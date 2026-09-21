import { z } from "zod";
import { type Coding, CodeableConceptSchema, CodingSchema, ReferenceSchema } from "./common";

export const ObservationSchema = z.object({
  resourceType: z.literal("Observation"),
  id: z.string(),
  meta: z.object({ tag: z.array(CodingSchema) }).optional(),
  status: z.enum(["registered", "preliminary", "final", "amended", "cancelled", "entered-in-error", "unknown"]),
  category: z.array(CodeableConceptSchema).optional(),
  code: CodeableConceptSchema,
  subject: ReferenceSchema,
  encounter: ReferenceSchema.optional(),
  effectiveDateTime: z.string().optional(),
  note: z.array(z.object({ text: z.string() })).optional(),
  valueInteger: z.number().int().optional(),
  valueQuantity: z.object({ value: z.number(), unit: z.string().optional() }).optional(),
  valueString: z.string().optional(),
  valueBoolean: z.boolean().optional(),
});
export type Observation = z.infer<typeof ObservationSchema>;

export interface BuildObservationInput {
  id: string;
  /** The HPI slot's English prompt, or another human-readable label — becomes code.text
   * since there's no LOINC mapping for ontology slots (out of scope; see docs/07's PLACEHOLDER
   * discipline for the equivalent terminology gap on Condition). */
  codeText: string;
  patientRef: z.infer<typeof ReferenceSchema>;
  encounterRef?: z.infer<typeof ReferenceSchema>;
  value: number | string | boolean;
  effectiveDateTime?: string | null;
  /** Terminology codings for `code` (e.g. NAMASTE). Omitted → text-only, exactly as before. */
  codings?: Coding[];
  /** `meta.tag` entries — used to flag a NAMASTE code that is still a PLACEHOLDER. */
  tags?: Coding[];
  /** Free-text provenance ("source=clinician; overrides patient-reported: hard (tap, 100%)"). */
  noteText?: string;
  /** e.g. { code: "exam" } → the HL7 observation-category coding. */
  categoryCode?: "exam" | "survey";
  /** With a numeric `value`, emits valueQuantity (value + unit) instead of valueInteger — needed
   * for anything that is not a whole number (BMI) or that carries a unit (height, weight). */
  unit?: string;
}

export function buildObservation(input: BuildObservationInput): Observation {
  const valueFields =
    typeof input.value === "number"
      ? input.unit !== undefined || !Number.isInteger(input.value)
        ? { valueQuantity: { value: input.value, ...(input.unit !== undefined ? { unit: input.unit } : {}) } }
        : { valueInteger: input.value }
      : typeof input.value === "boolean"
        ? { valueBoolean: input.value }
        : { valueString: input.value };

  return ObservationSchema.parse({
    resourceType: "Observation",
    id: input.id,
    status: "final",
    ...(input.tags && input.tags.length > 0 ? { meta: { tag: input.tags } } : {}),
    ...(input.categoryCode
      ? {
          category: [
            {
              coding: [
                { system: "http://terminology.hl7.org/CodeSystem/observation-category", code: input.categoryCode },
              ],
            },
          ],
        }
      : {}),
    code: {
      text: input.codeText,
      ...(input.codings && input.codings.length > 0 ? { coding: input.codings } : {}),
    },
    subject: input.patientRef,
    encounter: input.encounterRef,
    effectiveDateTime: input.effectiveDateTime ?? undefined,
    ...(input.noteText ? { note: [{ text: input.noteText }] } : {}),
    ...valueFields,
  });
}
