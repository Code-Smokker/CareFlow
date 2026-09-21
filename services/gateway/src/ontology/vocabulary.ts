import { readFileSync } from "node:fs";
import { join } from "node:path";
import { load } from "js-yaml";
import { z } from "zod";
import type { OntologyModule } from "./ontology.types";

/**
 * The Pariksha vocabulary (packages/ontology/modules/ayush/pariksha-vocabulary.yaml) — every
 * examination field and option of the Ayurvedic case record. UI and API read options only from
 * here; nothing hardcodes one. The file is PENDING_EXPERT_REVIEW until an Ayurveda practitioner
 * verifies it, and that status is carried through to every client.
 *
 * Mirrors the referential checks in packages/ontology/scripts/validate.py: this is the
 * load-time guard (a broken vocabulary fails the gateway at startup, loudly), that is the CI one.
 */

export const VOCABULARY_FILE = "ayush/pariksha-vocabulary.yaml";

const OptionSchema = z.object({ value: z.string(), label: z.string(), gloss: z.string() }).strict();

const PatientReferenceSchema = z
  .object({ slot: z.string(), map: z.record(z.string(), z.string()).optional() })
  .strict();

const BandSchema = z
  .object({ value: z.string(), label: z.string(), gloss: z.string(), below_age_years: z.number().nullable() })
  .strict();

const ComputedSchema = z
  .object({
    kind: z.enum(["bmi", "vaya_band"]),
    height_field: z.string().optional(),
    weight_field: z.string().optional(),
    age_field: z.string().optional(),
  })
  .strict();

export const ExamFieldSchema = z
  .object({
    id: z.string(),
    label: z.string(),
    gloss: z.string(),
    type: z.enum(["text", "enum", "enum_multi", "number", "computed", "namaste_codes"]),
    required: z.boolean().optional(),
    options: z.array(OptionSchema).optional(),
    min: z.number().optional(),
    max: z.number().optional(),
    unit: z.string().optional(),
    patient_reference: z.array(PatientReferenceSchema).optional(),
    computed: ComputedSchema.optional(),
    source: z.string().optional(),
    bands: z.array(BandSchema).optional(),
    namaste_code: z.string().nullable().optional(),
  })
  .strict();
export type ExamField = z.infer<typeof ExamFieldSchema>;

const SectionSchema = z
  .object({
    id: z.string(),
    label: z.string(),
    gloss: z.string(),
    link_to_step: z.string().optional(),
    show_prakriti_score: z.boolean().optional(),
    fields: z.array(ExamFieldSchema),
  })
  .strict();
export type ExamSection = z.infer<typeof SectionSchema>;

const StepSchema = z
  .object({ id: z.string(), label: z.string(), gloss: z.string(), sections: z.array(SectionSchema) })
  .strict();
export type ExamStep = z.infer<typeof StepSchema>;

export const VocabularySchema = z
  .object({
    id: z.literal("pariksha_vocabulary"),
    status: z.enum(["PENDING_EXPERT_REVIEW", "VERIFIED"]),
    version: z.number().int(),
    title: z.object({ label: z.string(), gloss: z.string() }).strict(),
    review: z
      .object({ status: z.string(), note: z.string(), verified_by: z.string().nullable().optional() })
      .strict(),
    prashna: z
      .object({
        label: z.string(),
        gloss: z.string(),
        groups: z.array(
          z
            .object({ id: z.string(), label: z.string(), gloss: z.string(), module: z.string().nullable() })
            .strict(),
        ),
      })
      .strict(),
    prakriti_scoring: z
      .object({
        label: z.string(),
        gloss: z.string(),
        caveat: z.string(),
        doshas: z.array(z.object({ value: z.string(), label: z.string() }).strict()),
        slots: z.record(z.string(), z.record(z.string(), z.string())),
      })
      .strict(),
    steps: z.array(StepSchema),
    summary_step: z.object({ id: z.string(), label: z.string(), gloss: z.string() }).strict(),
  })
  .strict();
export type Vocabulary = z.infer<typeof VocabularySchema>;

export function loadVocabulary(modulesDir: string): Vocabulary {
  const raw = load(readFileSync(join(modulesDir, VOCABULARY_FILE), "utf8"));
  const parsed = VocabularySchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(`Pariksha vocabulary failed validation: ${parsed.error.message}`);
  }
  return parsed.data;
}

export function allFields(vocab: Vocabulary): ExamField[] {
  return vocab.steps.flatMap((step) => step.sections.flatMap((section) => section.fields));
}

export function fieldsOfStep(vocab: Vocabulary, stepId: string): ExamField[] {
  return (vocab.steps.find((s) => s.id === stepId)?.sections ?? []).flatMap((section) => section.fields);
}

/** Referential integrity between the vocabulary and the interview modules it points at. Returns
 * every problem found rather than the first, so one startup failure lists them all. */
export function checkVocabulary(vocab: Vocabulary, modules: OntologyModule[]): string[] {
  const errors: string[] = [];
  const slots = new Map(modules.flatMap((m) => m.slots.map((s) => [s.id, s] as const)));
  const moduleIds = new Set(modules.map((m) => m.id));

  const seen = new Set<string>();
  for (const step of vocab.steps) {
    for (const field of step.sections.flatMap((s) => s.fields)) {
      if (seen.has(field.id)) errors.push(`duplicate field id ${field.id}`);
      seen.add(field.id);
      if (!field.id.startsWith(`${step.id}.`)) errors.push(`field ${field.id} must be prefixed '${step.id}.'`);

      if ((field.type === "enum" || field.type === "enum_multi") && !(field.options?.length ?? 0)) {
        errors.push(`field ${field.id} has no options`);
      }
      const values = new Set((field.options ?? []).map((o) => o.value));
      if (values.size !== (field.options ?? []).length) errors.push(`field ${field.id} has duplicate option values`);

      for (const ref of field.patient_reference ?? []) {
        const slot = slots.get(ref.slot);
        if (!slot) {
          errors.push(`field ${field.id} references unknown slot '${ref.slot}'`);
          continue;
        }
        const slotValues = new Set((slot.options ?? []).map((o) => o.value));
        for (const [patientValue, examValue] of Object.entries(ref.map ?? {})) {
          if (!slotValues.has(patientValue)) errors.push(`field ${field.id}: '${patientValue}' is not an option of slot '${ref.slot}'`);
          if (!values.has(examValue)) errors.push(`field ${field.id}: '${examValue}' is not an option of the field`);
        }
      }
    }
  }
  for (const step of vocab.steps) {
    for (const field of step.sections.flatMap((s) => s.fields)) {
      const c = field.computed;
      if (field.type === "computed" && !c) errors.push(`computed field ${field.id} has no computed spec`);
      for (const ref of [c?.height_field, c?.weight_field, c?.age_field]) {
        if (ref && !seen.has(ref)) errors.push(`computed field ${field.id} reads unknown field '${ref}'`);
      }
      if (c?.kind === "vaya_band" && !(field.bands?.length ?? 0)) errors.push(`field ${field.id} has no bands`);
    }
  }
  for (const group of vocab.prashna.groups) {
    if (group.module !== null && !moduleIds.has(group.module)) {
      errors.push(`prashna group '${group.id}' references unknown module '${group.module}'`);
    }
  }
  const doshas = new Set(vocab.prakriti_scoring.doshas.map((d) => d.value));
  for (const [slotId, mapping] of Object.entries(vocab.prakriti_scoring.slots)) {
    const slot = slots.get(slotId);
    if (!slot) {
      errors.push(`prakriti_scoring references unknown slot '${slotId}'`);
      continue;
    }
    const slotValues = new Set((slot.options ?? []).map((o) => o.value));
    if (Object.keys(mapping).some((k) => !slotValues.has(k)) || [...slotValues].some((v) => !(v in mapping))) {
      errors.push(`prakriti_scoring for '${slotId}' must tag every option of the slot exactly once`);
    }
    for (const tag of Object.values(mapping)) if (!doshas.has(tag)) errors.push(`prakriti_scoring uses unknown dosha '${tag}'`);
  }
  return errors;
}
