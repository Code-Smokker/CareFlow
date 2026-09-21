import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { AyurvedaBundleInput, AyurvedaObservationInput, AyurvedaSectionId } from "@careflow/fhir";
import type { AyurvedaExamField } from "@prisma/client";
import { AppException } from "../common/app-exception";
import type { Env } from "../common/env";
import { OntologyService } from "../ontology/ontology.service";
import type { Slot } from "../ontology/ontology.types";
import { type ExamField, allFields, fieldsOfStep, type Vocabulary } from "../ontology/vocabulary";
import { PrismaService } from "../prisma/prisma.service";
import { ageFromDob, computeBmi, computeVayaBand, scorePrakriti } from "./compute";
import type { DiagnosisPick } from "./dto/ayurveda.dto";
import {
  type Disposition,
  type PatientAnswer,
  normaliseFieldValue,
  resolveDisposition,
} from "./exam-rules";

const CHIEF_COMPLAINT_SLOT_ID = "chief_complaint";
const EXAM_STEP_IDS = ["trividha", "ashtavidha", "dashavidha", "vyadhi_vinishchaya"] as const;
const AUDIT_ACTION = "ayurveda.exam.save";
const AUDIT_RESOURCE = "ayurveda_exam";

type AnswerWithOffset = PatientAnswer & { audioOffsetMs: number | null };

interface PrashnaItem {
  slot_id: string;
  question: string;
  value: unknown;
  value_label: string;
  source: PatientAnswer["source"];
  confidence: number;
  audio_offset_ms: number | null;
  suggested_value: string | null;
}

interface ExamOriginal {
  value: unknown;
  value_label: string;
  source: PatientAnswer["source"];
  confidence: number;
}

interface ExamValue {
  field_id: string;
  value: unknown;
  source: "clinician";
  disposition: Disposition;
  recorded_by: string;
  recorded_at: string;
  original: ExamOriginal | null;
}

interface AyurvedicRow {
  group: string | null;
  label: string;
  gloss: string;
  value_label: string;
  source: PatientAnswer["source"] | "clinician" | "computed";
  confidence: number | null;
  disposition: Disposition | null;
  original: ExamOriginal | null;
  recorded_by: string | null;
}

interface Context {
  visit: { id: string; department: string | null };
  dob: Date | null;
  answers: Map<string, AnswerWithOffset>;
  exam: AyurvedaExamField[];
  signed: boolean;
}

/** Tap/bodymap/proxy answers carry no ASR uncertainty; voice/ocr default conservative — the same
 * rule services/ai/app/summary/build.py applies to every other summary field. */
function effectiveConfidence(source: string, confidence: number | null): number {
  return confidence ?? (["tap", "bodymap", "proxy"].includes(source) ? 1 : 0.5);
}

/**
 * The Ayurvedic case record (Ayurvediya Rugna Pariksha). Prashna is composed live from the
 * patient's `answer` rows and is read-only; Trividha / Ashtavidha / Dashavidha / Vyadhi
 * Vinishchaya are what the Vaidya records in `ayurveda_exam_field`. CareFlow never suggests or
 * computes Vikriti, Samprapti or a diagnosis (CLAUDE.md rule 2) — the only derived values are
 * BMI and the Vaya band, arithmetic over the Vaidya's own entries, and a per-dosha COUNT of the
 * patient's Prakriti questionnaire answers shown as reference.
 */
@Injectable()
export class AyurvedaService {
  private slotIndex: Map<string, Slot> | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly ontology: OntologyService,
    private readonly config: ConfigService<Env, true>,
  ) {}

  getVocabulary(): Vocabulary {
    return this.ontology.getVocabulary();
  }

  // ------------------------------------------------------------------------------------------
  // Read

  async getRecord(visitId: string) {
    const ctx = await this.loadContext(visitId);
    const vocab = this.getVocabulary();

    const filled = new Map([...ctx.answers].map(([slotId, a]) => [slotId, a.value] as const));
    const prashna = this.buildPrashna(ctx, vocab, filled);
    const computed = this.buildComputed(ctx, vocab);

    const patientReference: Record<string, PrashnaItem[]> = {};
    for (const field of allFields(vocab)) {
      if (!field.patient_reference?.length) continue;
      const items = field.patient_reference.flatMap((ref) => {
        const answer = ctx.answers.get(ref.slot);
        if (!answer) return [];
        const suggested = typeof answer.value === "string" ? (ref.map?.[answer.value] ?? null) : null;
        return [this.toPrashnaItem(answer, suggested)];
      });
      if (items.length > 0) patientReference[field.id] = items;
    }

    return {
      visit_id: ctx.visit.id,
      signed: ctx.signed,
      department: ctx.visit.department,
      ayush_mode: this.isAyushDepartment(ctx.visit.department),
      prashna: { ...prashna.record, prakriti_score: this.buildPrakritiScore(vocab, filled) },
      exam: ctx.exam.map((row) => this.toExamValue(row)),
      patient_reference: patientReference,
      computed,
      completion: this.buildCompletion(ctx, vocab, prashna.record.answered, prashna.record.total, computed),
    };
  }

  /** The case sheet in PS order — Prashna, Trividha, Ashtavidha, Dashavidha, Vyadhi Vinishchaya —
   * for the merged clinician summary and the A4 print view. Empty when the visit carries no
   * Ayurvedic data at all, so a general-OPD summary is unchanged. */
  async getSummarySections(visitId: string) {
    const ctx = await this.loadContext(visitId);
    const vocab = this.getVocabulary();
    const filled = new Map([...ctx.answers].map(([slotId, a]) => [slotId, a.value] as const));
    const prashna = this.buildPrashna(ctx, vocab, filled);
    const computed = this.buildComputed(ctx, vocab);

    const hasAyushAnswers = [...ctx.answers.keys()].some((id) => this.ontology.isAyushSlot(id));
    if (!hasAyushAnswers && ctx.exam.length === 0) return [];

    const examByField = new Map(ctx.exam.map((row) => [row.fieldId, row] as const));
    const sections: { id: string; label: string; gloss: string; rows: AyurvedicRow[] }[] = [];

    // Prashna — every answered group except the chief complaint, which the summary already leads with.
    const prashnaRows: AyurvedicRow[] = [];
    for (const group of prashna.record.groups) {
      if (group.id === "pradhana_vedana") continue;
      for (const item of group.items) {
        prashnaRows.push({
          group: `${group.label} — ${group.gloss}`,
          label: item.question,
          gloss: "",
          value_label: item.value_label,
          source: item.source,
          confidence: item.confidence,
          disposition: null,
          original: null,
          recorded_by: null,
        });
      }
    }
    const score = this.buildPrakritiScore(vocab, filled);
    if (score) {
      prashnaRows.push({
        group: `${score.label} — ${score.gloss}`,
        label: "Answers by dosha (reference only — the Vaidya decides Prakriti)",
        gloss: "",
        value_label: `${score.counts.map((c) => `${c.label} ${c.count}`).join(" · ")} (of ${score.total} questions)`,
        source: "computed",
        confidence: null,
        disposition: null,
        original: null,
        recorded_by: null,
      });
    }
    sections.push({ id: "prashna", label: vocab.prashna.label, gloss: vocab.prashna.gloss, rows: prashnaRows });

    for (const stepId of EXAM_STEP_IDS) {
      const step = vocab.steps.find((s) => s.id === stepId)!;
      const rows: AyurvedicRow[] = [];
      for (const section of step.sections) {
        for (const field of section.fields) {
          const group = `${section.label} — ${section.gloss.split(" — ")[0]}`;
          if (field.type === "computed") {
            const row = this.computedRow(field, group, computed);
            if (row) rows.push(row);
            continue;
          }
          const stored = examByField.get(field.id);
          if (!stored) continue;
          rows.push({
            group,
            label: field.label,
            gloss: field.gloss,
            value_label: this.examValueLabel(field, stored.value),
            source: "clinician",
            confidence: null,
            disposition: stored.disposition,
            original: this.toOriginal(stored),
            recorded_by: stored.recordedBy,
          });
        }
      }
      sections.push({ id: step.id, label: step.label, gloss: step.gloss, rows });
    }
    return sections;
  }

  /** What `sign` hands to the FHIR bundle builder: one Observation per Prashna answer and per
   * recorded exam field, one Condition per diagnosis the Vaidya picked. */
  async getBundleInput(visitId: string): Promise<AyurvedaBundleInput | undefined> {
    const ctx = await this.loadContext(visitId);
    const vocab = this.getVocabulary();
    const observations: AyurvedaObservationInput[] = [];

    for (const group of vocab.prashna.groups) {
      if (!group.module) continue; // the complaint module's answers already feed the HPI observations
      for (const slot of this.ontology.getModule(group.module).slots) {
        const answer = ctx.answers.get(slot.id);
        if (!answer) continue;
        observations.push({
          section: "prashna",
          fieldId: slot.id,
          label: `${group.label} — ${slot.prompt.en}`,
          value: this.labelFor(slot, answer.value),
          noteText: `source=${answer.source}; confidence=${effectiveConfidence(answer.source, answer.confidence)}; patient-reported`,
        });
      }
    }

    const examByField = new Map(ctx.exam.map((row) => [row.fieldId, row] as const));
    const diagnoses: AyurvedaBundleInput["diagnoses"] = [];
    for (const step of vocab.steps) {
      for (const section of step.sections) {
        for (const field of section.fields) {
          const stored = examByField.get(field.id);
          if (!stored || field.type === "computed") continue;
          if (field.type === "namaste_codes") {
            for (const pick of stored.value as DiagnosisPick[]) {
              diagnoses.push({
                displayText: pick.display,
                namaste: { code: pick.code, display: pick.display },
                icd11: pick.icd11 ? { code: pick.icd11.code, display: pick.icd11.display ?? undefined } : null,
                mappingReviewed: pick.mapping_reviewed,
              });
            }
            continue;
          }
          const original = this.toOriginal(stored);
          const note = [
            `source=clinician`,
            `recorded_by=${stored.recordedBy}`,
            `disposition=${stored.disposition}`,
            original
              ? `${stored.disposition === "confirmed" ? "confirms" : "overrides"} patient-reported: ${original.value_label} (${original.source}, confidence ${original.confidence})`
              : null,
          ]
            .filter(Boolean)
            .join("; ");
          observations.push({
            section: step.id as AyurvedaSectionId,
            fieldId: field.id,
            label: `${section.label} — ${field.label}`,
            value: typeof stored.value === "number" ? stored.value : this.examValueLabel(field, stored.value),
            unit: typeof stored.value === "number" ? field.unit : undefined,
            namasteCode: field.namaste_code,
            noteText: note,
          });
        }
      }
    }

    const computed = this.buildComputed(ctx, vocab);
    if (computed.bmi !== null) {
      const bmiField = allFields(vocab).find((f) => f.computed?.kind === "bmi");
      if (bmiField) {
        observations.push({
          section: "dashavidha",
          fieldId: bmiField.id,
          label: "Pramana — BMI",
          value: computed.bmi,
          unit: bmiField.unit,
          namasteCode: bmiField.namaste_code,
          noteText: "source=computed; calculated from the recorded height and weight",
        });
      }
    }
    if (computed.vaya.band) {
      const vayaField = allFields(vocab).find((f) => f.computed?.kind === "vaya_band");
      if (vayaField) {
        const band = vayaField.bands?.find((b) => b.value === computed.vaya.band);
        observations.push({
          section: "dashavidha",
          fieldId: vayaField.id,
          label: "Vaya — Age band",
          value: band?.label ?? computed.vaya.band,
          namasteCode: vayaField.namaste_code,
          noteText: `source=computed; from age ${computed.vaya.age_years} (${computed.vaya.age_source}); cut-offs per the vocabulary (${vocab.status})`,
        });
      }
    }

    return observations.length + diagnoses.length === 0 ? undefined : { observations, diagnoses };
  }

  // ------------------------------------------------------------------------------------------
  // Write

  async saveExam(visitId: string, recordedBy: string, fields: { field_id: string; value: unknown }[]) {
    const ctx = await this.loadContext(visitId);
    if (ctx.signed) {
      throw new AppException(409, "visit_signed", "This visit is signed; its Ayurvedic case record can no longer change.");
    }

    const vocabFields = new Map(allFields(this.getVocabulary()).map((f) => [f.id, f] as const));
    const seen = new Set<string>();
    const writes: { field: ExamField; value: unknown }[] = [];
    for (const { field_id, value } of fields) {
      const field = vocabFields.get(field_id);
      if (!field) {
        throw new AppException(400, "unknown_field", `'${field_id}' is not a field of the Pariksha vocabulary.`, { field_id });
      }
      if (seen.has(field_id)) {
        throw new AppException(400, "duplicate_field", `'${field_id}' appears more than once in this request.`, { field_id });
      }
      seen.add(field_id);
      writes.push({ field, value: normaliseFieldValue(field, value) });
    }

    const now = new Date();
    const operations = [];
    const auditParts: string[] = [];
    const cleared: string[] = [];
    for (const { field, value } of writes) {
      if (value === null) {
        operations.push(this.prisma.ayurvedaExamField.deleteMany({ where: { visitId, fieldId: field.id } }));
        cleared.push(field.id);
        continue;
      }
      const { disposition, original } = resolveDisposition(field, value, ctx.answers);
      const data = {
        value: value as never,
        source: "clinician" as const,
        disposition,
        recordedBy,
        recordedAt: now,
        // Always rewritten together: an override keeps the patient's original, and a later plain
        // entry (no pre-fill) clears it rather than leaving a stale one behind.
        originalSlotId: original?.slotId ?? null,
        originalValue: original ? (original.value as never) : (null as never),
        originalSource: original?.source ?? null,
        originalConfidence: original ? effectiveConfidence(original.source, original.confidence) : null,
      };
      operations.push(
        this.prisma.ayurvedaExamField.upsert({
          where: { visitId_fieldId: { visitId, fieldId: field.id } },
          create: { visitId, fieldId: field.id, ...data },
          update: data,
        }),
      );
      auditParts.push(`${field.id} [${disposition}]`);
    }

    // The audit row is written in the SAME transaction as the field writes: a save that
    // succeeded but left no trace — or a trace of a save that rolled back — cannot happen. Field
    // ids and dispositions only, never the values themselves.
    const reason = [
      auditParts.length ? `saved ${auditParts.length}: ${auditParts.join(", ")}` : null,
      cleared.length ? `cleared ${cleared.length}: ${cleared.join(", ")}` : null,
    ]
      .filter(Boolean)
      .join("; ");
    operations.push(
      this.prisma.auditLog.create({
        data: {
          actorId: recordedBy,
          actorRole: "clinician",
          action: AUDIT_ACTION,
          resource: AUDIT_RESOURCE,
          resourceId: visitId,
          reason,
        },
      }),
    );
    await this.prisma.$transaction(operations);

    return this.getRecord(visitId);
  }

  // ------------------------------------------------------------------------------------------
  // Internals

  private isAyushDepartment(department: string | null): boolean {
    const configured = this.config.get("AYUSH_DEPARTMENTS", { infer: true }) as string[] | undefined;
    return department !== null && (configured ?? []).includes(department);
  }

  private async loadContext(visitId: string): Promise<Context> {
    const visit = await this.prisma.visit.findUnique({ where: { id: visitId }, include: { patient: true } });
    if (!visit) throw new AppException(404, "visit_not_found", `No visit with id '${visitId}'.`);

    const [answerRows, exam, latestSummary] = await Promise.all([
      this.prisma.answer.findMany({ where: { session: { visitId } }, orderBy: { answeredAt: "asc" } }),
      this.prisma.ayurvedaExamField.findMany({ where: { visitId }, orderBy: { fieldId: "asc" } }),
      this.prisma.summary.findFirst({ where: { visitId }, orderBy: { createdAt: "desc" }, select: { status: true } }),
    ]);

    // Latest answer per slot wins (rows are ordered oldest → newest).
    const answers = new Map<string, AnswerWithOffset>();
    for (const row of answerRows) {
      answers.set(row.slotId, {
        slotId: row.slotId,
        value: row.value,
        source: row.source,
        confidence: effectiveConfidence(row.source, row.confidence),
        audioOffsetMs: row.audioOffsetMs,
      });
    }
    return {
      visit: { id: visit.id, department: visit.department },
      dob: visit.patient.dob,
      answers,
      exam,
      signed: latestSummary?.status === "signed",
    };
  }

  private getSlot(slotId: string): Slot | undefined {
    if (!this.slotIndex) {
      this.slotIndex = new Map(
        this.ontology.listModules().flatMap((m) => this.ontology.getModule(m.id).slots.map((s) => [s.id, s] as const)),
      );
    }
    return this.slotIndex.get(slotId);
  }

  private labelFor(slot: Slot | undefined, value: unknown): string {
    const one = (v: unknown) => {
      const fromOption = slot?.options?.find((o) => o.value === v)?.label.en;
      if (fromOption) return fromOption;
      if (typeof v === "string") return v.replace(/_/g, " ");
      return String(v);
    };
    return Array.isArray(value) ? value.map(one).join(", ") : one(value);
  }

  /** `slot` is passed for the complaint module's answers: slot ids like `duration` exist in several
   * complaint modules, so resolving one through the global index would pick the wrong module's
   * question text and option labels. AYUSH slot ids are unique (asserted at startup), so the global
   * index is safe for them. */
  private toPrashnaItem(answer: AnswerWithOffset, suggested: string | null, slot: Slot | undefined = this.getSlot(answer.slotId)): PrashnaItem {
    return {
      slot_id: answer.slotId,
      question: slot?.prompt.en ?? answer.slotId,
      value: answer.value,
      value_label: this.labelFor(slot, answer.value),
      source: answer.source,
      confidence: answer.confidence,
      audio_offset_ms: answer.audioOffsetMs,
      suggested_value: suggested,
    };
  }

  private buildPrashna(ctx: Context, vocab: Vocabulary, filled: ReadonlyMap<string, unknown>) {
    const filledRecord = Object.fromEntries(filled);
    const chief = ctx.answers.get(CHIEF_COMPLAINT_SLOT_ID);
    let complaintModuleId: string | null = null;
    if (chief && typeof chief.value === "string") {
      try {
        this.ontology.getModule(chief.value);
        complaintModuleId = chief.value;
      } catch {
        complaintModuleId = null;
      }
    }

    let answered = 0;
    let total = 0;
    const groups = vocab.prashna.groups.map((group) => {
      const items: PrashnaItem[] = [];
      const moduleId = group.module ?? complaintModuleId;
      if (group.module === null) {
        total += 1;
        if (chief) {
          items.push({
            slot_id: CHIEF_COMPLAINT_SLOT_ID,
            question: "What is the main problem you're here for today?",
            value: chief.value,
            value_label: complaintModuleId ? this.ontology.getModule(complaintModuleId).label : String(chief.value),
            source: chief.source,
            confidence: chief.confidence,
            audio_offset_ms: chief.audioOffsetMs,
            suggested_value: null,
          });
        }
      }
      if (moduleId) {
        const eligible = this.ontology.eligibleSlots(moduleId, filledRecord);
        total += eligible.length;
        for (const slot of eligible) {
          const answer = ctx.answers.get(slot.id);
          if (answer) items.push(this.toPrashnaItem(answer, null, slot));
        }
      }
      answered += items.length;
      return { id: group.id, label: group.label, gloss: group.gloss, items };
    });
    return { record: { groups, answered, total } };
  }

  private buildPrakritiScore(vocab: Vocabulary, filled: ReadonlyMap<string, unknown>) {
    const score = scorePrakriti(vocab, filled);
    if (!score) return null;
    const { label, gloss, caveat } = vocab.prakriti_scoring;
    return { label, gloss, caveat, ...score };
  }

  private buildComputed(ctx: Context, vocab: Vocabulary) {
    const examValue = (fieldId: string | undefined): unknown => ctx.exam.find((r) => r.fieldId === fieldId)?.value;
    const fields = allFields(vocab);
    const bmiSpec = fields.find((f) => f.computed?.kind === "bmi")?.computed;
    const vayaField = fields.find((f) => f.computed?.kind === "vaya_band");

    const bmi = bmiSpec ? computeBmi(examValue(bmiSpec.height_field), examValue(bmiSpec.weight_field)) : null;

    // Age: what the Vaidya entered wins; otherwise the patient's date of birth when one is known.
    const clinicianAge = examValue(vayaField?.computed?.age_field);
    let ageYears: number | null = null;
    let ageSource: "dob" | "clinician" | null = null;
    if (typeof clinicianAge === "number") {
      ageYears = Math.floor(clinicianAge);
      ageSource = "clinician";
    } else if (ctx.dob) {
      ageYears = ageFromDob(ctx.dob);
      ageSource = ageYears === null ? null : "dob";
    }
    return {
      bmi,
      vaya: { age_years: ageYears, age_source: ageSource, band: vayaField ? computeVayaBand(ageYears, vayaField) : null },
    };
  }

  private buildCompletion(
    ctx: Context,
    vocab: Vocabulary,
    prashnaAnswered: number,
    prashnaTotal: number,
    computed: ReturnType<AyurvedaService["buildComputed"]>,
  ) {
    const stored = new Set(ctx.exam.map((r) => r.fieldId));
    const vayaAgeField = allFields(vocab).find((f) => f.computed?.kind === "vaya_band")?.computed?.age_field;
    if (vayaAgeField && computed.vaya.age_years !== null) stored.add(vayaAgeField); // known from DOB

    const status = (filled: number, required: number) =>
      filled === 0 ? ("not_started" as const) : filled >= required ? ("complete" as const) : ("in_progress" as const);

    const steps = [
      {
        step_id: "prashna",
        filled: prashnaAnswered,
        required_total: prashnaTotal,
        status: status(prashnaAnswered, prashnaTotal),
      },
      ...EXAM_STEP_IDS.map((stepId) => {
        const required = fieldsOfStep(vocab, stepId).filter((f) => f.required && f.type !== "computed");
        const filled = required.filter((f) => stored.has(f.id)).length;
        return { step_id: stepId, filled, required_total: required.length, status: status(filled, required.length) };
      }),
    ];
    steps.push({
      step_id: vocab.summary_step.id,
      filled: ctx.signed ? 1 : 0,
      required_total: 1,
      status: ctx.signed ? "complete" : "not_started",
    });
    return steps;
  }

  private toExamValue(row: AyurvedaExamField): ExamValue {
    return {
      field_id: row.fieldId,
      value: row.value,
      source: "clinician",
      disposition: row.disposition,
      recorded_by: row.recordedBy,
      recorded_at: row.recordedAt.toISOString(),
      original: this.toOriginal(row),
    };
  }

  private toOriginal(row: AyurvedaExamField): ExamOriginal | null {
    if (!row.originalSource || row.originalValue === null || row.originalConfidence === null) return null;
    const slot = row.originalSlotId ? this.getSlot(row.originalSlotId) : undefined;
    return {
      value: row.originalValue,
      value_label: this.labelFor(slot, row.originalValue),
      source: row.originalSource,
      confidence: row.originalConfidence,
    };
  }

  private examValueLabel(field: ExamField, value: unknown): string {
    const optionLabel = (v: unknown) => field.options?.find((o) => o.value === v)?.label ?? String(v);
    switch (field.type) {
      case "enum":
        return optionLabel(value);
      case "enum_multi":
        return (value as unknown[]).map(optionLabel).join(", ");
      case "number":
        return `${value}${field.unit ? ` ${field.unit}` : ""}`;
      case "namaste_codes":
        return (value as DiagnosisPick[])
          .map((d) => `${d.display} — NAMASTE ${d.code}${d.icd11 ? ` · ICD-11 TM2 ${d.icd11.code}` : ""}`)
          .join("; ");
      default:
        return String(value);
    }
  }

  private computedRow(field: ExamField, group: string, computed: ReturnType<AyurvedaService["buildComputed"]>): AyurvedicRow | null {
    const base = { group, label: field.label, gloss: field.gloss, source: "computed" as const, confidence: null, disposition: null, original: null, recorded_by: null };
    if (field.computed?.kind === "bmi") {
      return computed.bmi === null ? null : { ...base, value_label: `${computed.bmi}${field.unit ? ` ${field.unit}` : ""}` };
    }
    if (field.computed?.kind === "vaya_band") {
      if (!computed.vaya.band) return null;
      const band = field.bands?.find((b) => b.value === computed.vaya.band);
      return { ...base, value_label: `${band?.label ?? computed.vaya.band} (age ${computed.vaya.age_years})` };
    }
    return null;
  }
}
