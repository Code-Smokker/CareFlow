import { AppException } from "../common/app-exception";
import type { ExamField } from "../ontology/vocabulary";
import { DiagnosisPickSchema } from "./dto/ayurveda.dto";

export type PatientSource = "voice" | "tap" | "bodymap" | "proxy" | "ocr";

/** What the patient answered for one Prashna slot — the latest answer wins. */
export interface PatientAnswer {
  slotId: string;
  value: unknown;
  source: PatientSource;
  confidence: number;
}

export type Disposition = "entered" | "confirmed" | "overridden";

export interface DispositionResult {
  disposition: Disposition;
  /** The patient-reported answer this value confirms or replaces; null for the Vaidya's own finding. */
  original: PatientAnswer | null;
}

/** The patient answer, if any, that the vocabulary offers as a PRE-FILL for `field` — i.e. a
 * `patient_reference` entry with a `map` whose slot the patient answered with a mappable value.
 * Reference-only entries (no `map`) never pre-fill anything. */
export function findPrefill(
  field: ExamField,
  answers: ReadonlyMap<string, PatientAnswer>,
): { answer: PatientAnswer; suggested: string } | null {
  for (const ref of field.patient_reference ?? []) {
    if (!ref.map) continue;
    const answer = answers.get(ref.slot);
    if (!answer || typeof answer.value !== "string") continue;
    const suggested = ref.map[answer.value];
    if (suggested !== undefined) return { answer, suggested };
  }
  return null;
}

/**
 * The override-keeps-original rule. Decided here, on the server, never trusted from the client:
 *  - no patient pre-fill for the field            → `entered`   (the Vaidya's own finding)
 *  - value equals the patient's mapped value       → `confirmed` (original kept)
 *  - any other value                               → `overridden` (original kept, both visible)
 * The original is always the patient's answer as it stood at save time, with its source and
 * confidence — it is copied into the row, never discarded.
 */
export function resolveDisposition(
  field: ExamField,
  value: unknown,
  answers: ReadonlyMap<string, PatientAnswer>,
): DispositionResult {
  const prefill = findPrefill(field, answers);
  if (!prefill) return { disposition: "entered", original: null };
  return {
    disposition: value === prefill.suggested ? "confirmed" : "overridden",
    original: prefill.answer,
  };
}

function reject(field: ExamField, expected: string): never {
  throw new AppException(400, "invalid_field_value", `Invalid value for '${field.id}': expected ${expected}.`, {
    field_id: field.id,
    expected,
  });
}

/** Validates `value` against the vocabulary definition of `field` and returns the value to store.
 * Returns `null` for "clear this field" (null, empty string, empty array). */
export function normaliseFieldValue(field: ExamField, value: unknown): unknown {
  if (value === null || value === undefined) return null;

  switch (field.type) {
    case "computed":
      throw new AppException(400, "field_not_editable", `'${field.id}' is calculated, not entered.`, {
        field_id: field.id,
      });
    case "text": {
      if (typeof value !== "string") return reject(field, "a string");
      const trimmed = value.trim();
      if (trimmed.length === 0) return null;
      if (trimmed.length > 4000) return reject(field, "at most 4000 characters");
      return trimmed;
    }
    case "enum": {
      const allowed = (field.options ?? []).map((o) => o.value);
      if (typeof value !== "string" || !allowed.includes(value)) return reject(field, `one of ${allowed.join(", ")}`);
      return value;
    }
    case "enum_multi": {
      const allowed = (field.options ?? []).map((o) => o.value);
      if (!Array.isArray(value) || !value.every((v) => typeof v === "string" && allowed.includes(v))) {
        return reject(field, `an array drawn from ${allowed.join(", ")}`);
      }
      if (value.length === 0) return null;
      return [...new Set(value as string[])];
    }
    case "number": {
      if (typeof value !== "number" || !Number.isFinite(value)) return reject(field, "a number");
      if (field.min !== undefined && value < field.min) return reject(field, `a number >= ${field.min}`);
      if (field.max !== undefined && value > field.max) return reject(field, `a number <= ${field.max}`);
      return value;
    }
    case "namaste_codes": {
      if (!Array.isArray(value)) return reject(field, "an array of picked NAMASTE diagnoses");
      if (value.length === 0) return null;
      const parsed = value.map((v) => DiagnosisPickSchema.safeParse(v));
      if (parsed.some((p) => !p.success)) {
        return reject(field, "objects of { code, display, icd11 | null, mapping_reviewed }");
      }
      return parsed.map((p) => (p as { data: unknown }).data);
    }
  }
}
