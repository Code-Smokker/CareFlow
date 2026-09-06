import { z } from "zod";
import { CodeableConceptSchema, ReferenceSchema } from "./common";

export const ObservationSchema = z.object({
  resourceType: z.literal("Observation"),
  id: z.string(),
  status: z.enum(["registered", "preliminary", "final", "amended", "cancelled", "entered-in-error", "unknown"]),
  code: CodeableConceptSchema,
  subject: ReferenceSchema,
  encounter: ReferenceSchema.optional(),
  effectiveDateTime: z.string().optional(),
  valueInteger: z.number().int().optional(),
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
}

export function buildObservation(input: BuildObservationInput): Observation {
  const valueFields =
    typeof input.value === "number"
      ? { valueInteger: input.value }
      : typeof input.value === "boolean"
        ? { valueBoolean: input.value }
        : { valueString: input.value };

  return ObservationSchema.parse({
    resourceType: "Observation",
    id: input.id,
    status: "final",
    code: { text: input.codeText },
    subject: input.patientRef,
    encounter: input.encounterRef,
    effectiveDateTime: input.effectiveDateTime ?? undefined,
    ...valueFields,
  });
}
