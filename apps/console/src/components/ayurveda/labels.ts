import type { GatewayComponents } from "@careflow/api-client";

type Schemas = GatewayComponents["schemas"];
export type AyurvedaRecord = Schemas["AyurvedaRecord"];
export type AyurvedaVocabulary = Schemas["AyurvedaVocabulary"];
export type ExamStep = Schemas["ExamStep"];
export type ExamSection = Schemas["ExamSection"];
export type ExamField = Schemas["ExamField"];
export type ExamValue = Schemas["ExamValue"];
export type PrashnaItem = Schemas["PrashnaItem"];
export type PrakritiScore = Schemas["PrakritiScore"];
export type AyurvedicSection = Schemas["AyurvedicSection"];

/** A NAMASTE diagnosis the Vaidya picked, as stored in `vyadhi_vinishchaya.diagnosis.codes`. */
export interface DiagnosisPick {
  code: string;
  display: string;
  icd11: { code: string; display?: string | null } | null;
  mapping_reviewed: boolean;
}

/** Vocabulary step ids use underscores; routes are kebab-case (CLAUDE.md naming). */
export const stepSlug = (stepId: string) => stepId.replace(/_/g, "-");
export const stepIdFromSlug = (slug: string) => slug.replace(/-/g, "_");

export function optionLabel(field: ExamField, value: unknown): string {
  return field.options?.find((o) => o.value === value)?.label ?? String(value);
}

/** Same arithmetic as the gateway's compute.ts, for the live preview while the Vaidya types.
 * The gateway's value (returned in `record.computed`) is what is stored, printed and coded. */
export function previewBmi(heightCm: unknown, weightKg: unknown): number | null {
  if (typeof heightCm !== "number" || typeof weightKg !== "number" || !(heightCm > 0) || !(weightKg > 0)) return null;
  const metres = heightCm / 100;
  return Math.round((weightKg / (metres * metres)) * 10) / 10;
}

export function previewVayaBand(ageYears: number | null, field: ExamField): string | null {
  if (ageYears === null || ageYears < 0) return null;
  const band = field.bands?.find((b) => b.below_age_years === null || ageYears < b.below_age_years);
  return band?.value ?? null;
}
