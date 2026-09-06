import { buildOPConsultRecordBundle, validateBundleAgainstHapi } from "@careflow/fhir";
import type { Coding } from "@careflow/fhir";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { RedFlag, Summary, VisitPriority } from "@prisma/client";
import { ABDM_CLIENT } from "../abdm/abdm.tokens";
import type { AbdmClient } from "../abdm/abdm-client.interface";
import type { SummaryLeaf, SummariseStructured } from "../ai/ai-service.client";
import { AppException } from "../common/app-exception";
import type { Env } from "../common/env";
import { rootLogger } from "../common/logger";
import { PrismaService } from "../prisma/prisma.service";
import { TerminologyServiceClient, TerminologyServiceUnavailable } from "../terminology/terminology-service.client";
import { EventsGateway } from "../websocket/events.gateway";

interface SummaryFieldPayload {
  field_path: string;
  value: unknown;
  source: string;
  confidence: number;
  audio_offset_ms: number | null;
  bounding_box: null;
  physician_edited: boolean;
  low_confidence: boolean;
}

type ContractSeverity = "info" | "warning" | "critical";

interface RedFlagPayload {
  id: string;
  rule_id: string;
  severity: ContractSeverity;
  quote: string;
  token_no: string;
  acknowledged_by: string | null;
  acknowledged_at: string | null;
}

interface QueueTokenPayload {
  visit_id: string;
  token_no: string;
  patient_id: string;
  department: string;
  priority: VisitPriority;
  waiting_minutes: number;
  red_flags: RedFlagPayload[];
}

// Ranked so "is this an upgrade" is a plain numeric comparison — never downgrades a visit a
// worse rule already escalated (docs/05-interview-engine.md: firing re-prioritises the token).
const PRIORITY_RANK: Record<VisitPriority, number> = { routine: 0, priority: 1, urgent: 2 };

function severityToContract(severity: number): ContractSeverity {
  if (severity === 1) return "critical";
  if (severity === 2) return "warning";
  return "info";
}

function severityToPriority(severity: number): VisitPriority {
  if (severity === 1) return "urgent";
  if (severity === 2) return "priority";
  return "routine";
}

function toRedFlagPayload(flag: RedFlag, tokenNo: string): RedFlagPayload {
  return {
    id: flag.id,
    rule_id: flag.ruleId,
    severity: severityToContract(flag.severity),
    quote: flag.quote ?? flag.ruleId,
    token_no: tokenNo,
    acknowledged_by: flag.acknowledgedBy,
    acknowledged_at: flag.acknowledgedAt?.toISOString() ?? null,
  };
}

/** FHIR's Observation.value* is number | string | boolean — an enum_multi answer
 * (e.g. associated: ["neck_stiff", "headache"]) is an array, which isn't any of those, so it
 * needs flattening or buildObservation's Zod schema rejects it. */
function toObservationValue(value: unknown): number | string | boolean {
  if (typeof value === "number" || typeof value === "boolean") return value;
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}

@Injectable()
export class VisitsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventsGateway,
    private readonly config: ConfigService<Env, true>,
    @Inject(ABDM_CLIENT) private readonly abdm: AbdmClient,
    private readonly terminology: TerminologyServiceClient,
  ) {}

  /** NAMASTE + ICD-11 TM2/MMS codings for the chief complaint, docs/07-ayush-terminology.md's
   * dual coding — best-effort: any failure (service down, or simply no data loaded yet, which
   * is the actual state until infra/seed/namaste/ has the real export and ICD-11 credentials
   * exist) degrades to `[]`, exactly today's text-only Condition, never a thrown error and
   * never a fabricated code (docs/03-api-contracts.md rule 2 — partial failure still returns
   * something useful). */
  private async buildChiefComplaintCodings(chiefComplaintText: string): Promise<Coding[]> {
    try {
      const matches = await this.terminology.search(chiefComplaintText, "namaste");
      const best = matches[0];
      // Below this, "best of what's there" isn't the same as "a confident match" — an empty
      // codings array (today's text-only Condition) is more honest than a shaky one.
      const MIN_CONFIDENT_SCORE = 0.3;
      if (!best || best.score < MIN_CONFIDENT_SCORE) return [];

      const codings: Coding[] = [
        { system: "http://terminology.ayush.gov.in/namaste", code: best.code, display: best.display },
      ];

      for (const target of ["icd11-tm2", "icd11-bio"] as const) {
        const translation = await this.terminology.translate("namaste", best.code, target);
        if (translation.matched && translation.target_code) {
          codings.push({
            system: "http://id.who.int/icd/release/11/mms",
            code: translation.target_code,
            display: translation.target_display ?? undefined,
          });
        }
      }
      return codings;
    } catch (err) {
      if (err instanceof TerminologyServiceUnavailable) {
        rootLogger.warn({ error: err.message }, "terminology service unavailable — signing with text-only Condition");
        return [];
      }
      throw err;
    }
  }

  async getSummary(visitId: string) {
    const summary = await this.findLatestSummaryOrThrow(visitId);
    return this.toVisitSummaryPayload(visitId, summary);
  }

  async editSummaryField(visitId: string, fieldPath: string, value: unknown) {
    const summary = await this.findLatestSummaryOrThrow(visitId);
    const structured = summary.structured as unknown as SummariseStructured;

    const found = setLeafAtPath(structured, fieldPath, (leaf) => {
      leaf.value = value;
      leaf.confidence = 1;
      leaf.physician_edited = true;
      leaf.low_confidence = false; // physician-confirmed — no longer a value to demote
    });
    if (!found) {
      throw new AppException(404, "field_not_found", `No summary field at path '${fieldPath}'.`, { field_path: fieldPath });
    }

    const updated = await this.prisma.summary.update({
      where: { id: summary.id },
      data: { structured: structured as never },
    });
    return this.toVisitSummaryPayload(visitId, updated);
  }

  /** Assembles the OPConsultRecord bundle from the signed summary (packages/fhir — never an
   * inline object literal, docs/08-abdm-fhir.md) and validates it against the local HAPI
   * server before this counts as signed. A bundle HAPI rejects fails the sign, it does not
   * silently succeed — "a red test on a malformed bundle is a great thing to show a judge." */
  async sign(visitId: string, signedBy: string) {
    const summary = await this.findLatestSummaryOrThrow(visitId);
    const visit = await this.prisma.visit.findUniqueOrThrow({ where: { id: visitId } });
    const patient = await this.prisma.patient.findUniqueOrThrow({ where: { id: visit.patientId } });
    const structured = summary.structured as unknown as SummariseStructured;
    const chiefComplaintText = structured.chief_complaint ? String(structured.chief_complaint.value) : null;
    const chiefComplaintCodings = chiefComplaintText
      ? await this.buildChiefComplaintCodings(chiefComplaintText)
      : [];

    // patient.name/abhaNumber are AES-GCM ciphertext once an identity flow writes them
    // (src/common/crypto.ts) — always null today (no identity flow exists yet, ADR 0007), so
    // there's nothing to decrypt in practice. Whoever wires real identity into /sign needs to
    // decrypt here first, not pass ciphertext into a FHIR Patient.name.
    const bundle = buildOPConsultRecordBundle({
      patient: { id: patient.id, name: patient.name, abhaNumber: patient.abhaNumber },
      practitionerName: signedBy,
      encounterPeriodStart: visit.startedAt.toISOString(),
      encounterPeriodEnd: new Date().toISOString(),
      chiefComplaintText,
      chiefComplaintCodings,
      hpiObservations: Object.values(structured.history_of_present_illness ?? {}).map((leaf) => ({
        label: leaf.label,
        value: toObservationValue(leaf.value),
      })),
      signedAt: new Date().toISOString(),
    });

    const fhirServerUrl = this.config.get("FHIR_SERVER_URL", { infer: true });
    const validation = await validateBundleAgainstHapi(bundle, fhirServerUrl);
    if (!validation.valid) {
      throw new AppException(
        422,
        "invalid_fhir_bundle",
        "The assembled FHIR bundle failed validation against the local HAPI server.",
        { issues: validation.issues },
      );
    }

    await this.prisma.summary.update({
      where: { id: summary.id },
      data: { status: "signed", signedBy, signedAt: new Date(), fhirBundle: bundle as never },
    });
    rootLogger.info({ visit_id: visitId, fhir_bundle_id: bundle.id }, "visit signed, bundle validated against HAPI");

    // docs/08-abdm-fhir.md: "After the physician signs, link the care context to the patient's
    // ABHA so the record appears in their PHR app." care_context_status is what the UI must
    // show verbatim — under ABDM_MODE=mock that's always "linked (mock)", never a fake success.
    const careContext = await this.abdm.linkCareContext({
      patientId: patient.id,
      visitId,
      fhirBundleId: bundle.id,
    });

    return {
      fhir_bundle_id: bundle.id,
      // FHIR validity and ABDM submission are separate claims — the bundle is genuinely
      // HAPI-validated above; pushing it to ABDM is still mocked (ADR 0006, docs/08).
      abdm_status: "mocked" as const,
      care_context_status: careContext.status,
    };
  }

  /** GET /v1/visits/queue — prioritised token queue with waiting time (Nadi). Postgres enums
   * sort by declaration order (routine, priority, urgent), which is also clinical urgency
   * order, so `orderBy: priority desc` needs no special-casing here. */
  async getQueue(department?: string): Promise<QueueTokenPayload[]> {
    const visits = await this.prisma.visit.findMany({
      where: { status: { not: "closed" }, ...(department ? { department } : {}) },
      include: { sessions: { include: { redFlags: true } } },
      orderBy: [{ priority: "desc" }, { tokenNo: "asc" }],
    });

    const now = Date.now();
    return visits.map((visit) => {
      const redFlags = visit.sessions.flatMap((s) => s.redFlags);
      return {
        visit_id: visit.id,
        token_no: visit.tokenNo ?? visit.id,
        patient_id: visit.patientId,
        department: visit.department ?? "general",
        priority: visit.priority,
        waiting_minutes: Math.max(0, Math.floor((now - visit.startedAt.getTime()) / 60_000)),
        red_flags: redFlags.map((f) => toRedFlagPayload(f, visit.tokenNo ?? visit.id)),
      };
    });
  }

  /** Called after a turn fires one or more new red flags (SessionsService.submitAnswer). Bumps
   * the visit's queue priority if warranted, and pushes both `redflag.fired` and a refreshed
   * `queue.updated` to the department room — this is what makes "firing re-prioritises the
   * token" true rather than just a row in a table (docs/05-interview-engine.md "Red flags"). */
  async applyRedFlagsToQueue(visitId: string, firedRows: RedFlag[]): Promise<void> {
    if (firedRows.length === 0) return;

    const visit = await this.prisma.visit.findUniqueOrThrow({ where: { id: visitId } });
    const department = visit.department ?? "general";
    const tokenNo = visit.tokenNo ?? visit.id;

    const worstSeverity = Math.min(...firedRows.map((f) => f.severity));
    const desiredPriority = severityToPriority(worstSeverity);
    if (PRIORITY_RANK[desiredPriority] > PRIORITY_RANK[visit.priority]) {
      await this.prisma.visit.update({ where: { id: visitId }, data: { priority: desiredPriority } });
      rootLogger.info({ visit_id: visitId, from: visit.priority, to: desiredPriority }, "visit re-prioritised");
    }

    for (const flag of firedRows) {
      this.events.emitToDepartment(department, "redflag.fired", toRedFlagPayload(flag, tokenNo));
    }
    const tokens = await this.getQueue(department);
    this.events.emitToDepartment(department, "queue.updated", { tokens: tokens as never });
  }

  /** POST /v1/redflags/{id}/acknowledge — one-tap acknowledge, logged with who and when. Also
   * writes an audit_log row: genuinely append-only (DB-trigger-enforced), unlike red_flag's
   * own acknowledged_by/at columns which an application bug could still overwrite twice. */
  async acknowledge(redFlagId: string, actorId: string, actorRole: string) {
    const flag = await this.prisma.redFlag.findUnique({ where: { id: redFlagId } });
    if (!flag) {
      throw new AppException(404, "red_flag_not_found", `No red flag with id '${redFlagId}'.`);
    }
    if (flag.acknowledgedAt) {
      throw new AppException(409, "already_acknowledged", "This red flag was already acknowledged.", {
        acknowledged_by: flag.acknowledgedBy,
        acknowledged_at: flag.acknowledgedAt.toISOString(),
      });
    }

    const session = await this.prisma.intakeSession.findUniqueOrThrow({ where: { id: flag.sessionId } });
    const visit = await this.prisma.visit.findUniqueOrThrow({ where: { id: session.visitId } });

    const [updated] = await this.prisma.$transaction([
      this.prisma.redFlag.update({
        where: { id: redFlagId },
        data: { acknowledgedBy: actorId, acknowledgedAt: new Date() },
      }),
      this.prisma.auditLog.create({
        data: {
          actorId,
          actorRole,
          action: "redflag.acknowledge",
          resource: "red_flag",
          resourceId: redFlagId,
        },
      }),
    ]);
    return toRedFlagPayload(updated, visit.tokenNo ?? visit.id);
  }

  // ---------------------------------------------------------------------------------------

  private async findLatestSummaryOrThrow(visitId: string): Promise<Summary> {
    const summary = await this.prisma.summary.findFirst({
      where: { visitId },
      orderBy: { createdAt: "desc" },
    });
    if (!summary) {
      throw new AppException(404, "summary_not_found", `No summary for visit '${visitId}'. Has intake been completed?`);
    }
    return summary;
  }

  private async toVisitSummaryPayload(visitId: string, summary: Summary) {
    const session = await this.prisma.intakeSession.findFirst({
      where: { visitId },
      orderBy: { createdAt: "desc" },
      select: { id: true },
    });
    const visit = await this.prisma.visit.findUniqueOrThrow({ where: { id: visitId } });
    const unacknowledged = session
      ? await this.prisma.redFlag.findMany({ where: { sessionId: session.id, acknowledgedAt: null } })
      : [];
    return {
      visit_id: visitId,
      session_id: session?.id ?? null,
      fields: flattenStructured(summary.structured as unknown as SummariseStructured),
      signed: summary.status === "signed",
      // Derived live from red_flag on every request — never a separate stamped flag that
      // could drift out of sync with it. A non-empty array is the clinician console's cue to
      // open on the red banner (docs/05-interview-engine.md).
      red_flags: unacknowledged.map((f) => toRedFlagPayload(f, visit.tokenNo ?? visit.id)),
    };
  }
}

function flattenStructured(structured: SummariseStructured): SummaryFieldPayload[] {
  const fields: SummaryFieldPayload[] = [];
  const push = (fieldPath: string, leaf: SummaryLeaf) => {
    fields.push({
      field_path: fieldPath,
      value: leaf.value,
      source: leaf.source,
      confidence: leaf.confidence,
      audio_offset_ms: /^\d+$/.test(leaf.ref) ? Number(leaf.ref) : null,
      bounding_box: null,
      physician_edited: leaf.physician_edited ?? false,
      low_confidence: leaf.low_confidence,
    });
  };

  if (structured.chief_complaint) push("chief_complaint", structured.chief_complaint);
  for (const [slotId, leaf] of Object.entries(structured.history_of_present_illness ?? {})) {
    push(`history_of_present_illness.${slotId}`, leaf);
  }
  (structured.prior_investigations ?? []).forEach((leaf, i) => push(`prior_investigations.${i}`, leaf));

  return fields;
}

/** Navigates a dot-separated path (object keys and array indices alike — `arr["0"]` works the
 * same as `arr[0]` in JS) to the second-to-last segment, then mutates the leaf found at the
 * last one in place. Returns false if any segment along the way doesn't resolve. */
function setLeafAtPath(root: unknown, fieldPath: string, mutate: (leaf: SummaryLeaf) => void): boolean {
  const parts = fieldPath.split(".");
  let node: Record<string, unknown> | undefined = root as Record<string, unknown>;
  for (let i = 0; i < parts.length - 1; i++) {
    node = node?.[parts[i]] as Record<string, unknown> | undefined;
    if (node == null) return false;
  }
  const last = parts[parts.length - 1];
  const leaf = node?.[last];
  if (leaf == null || typeof leaf !== "object") return false;
  mutate(leaf as SummaryLeaf);
  return true;
}
