import { z } from "zod";
import { CodeableConceptSchema, ReferenceSchema } from "./common";

export const AllergyIntoleranceSchema = z.object({
  resourceType: z.literal("AllergyIntolerance"),
  id: z.string(),
  clinicalStatus: CodeableConceptSchema.optional(),
  code: CodeableConceptSchema,
  patient: ReferenceSchema,
});
export type AllergyIntolerance = z.infer<typeof AllergyIntoleranceSchema>;

export interface BuildAllergyIntoleranceInput {
  id: string;
  displayText: string;
  patientRef: z.infer<typeof ReferenceSchema>;
}

/** No drug/allergy capture exists yet (docs/14-features.md section 4 — pre-filled from scanned
 * prescriptions — isn't built). This builder exists so the bundle assembler has somewhere to
 * put a real one the moment that data exists; it's simply never called with real data today. */
export function buildAllergyIntolerance(input: BuildAllergyIntoleranceInput): AllergyIntolerance {
  return AllergyIntoleranceSchema.parse({
    resourceType: "AllergyIntolerance",
    id: input.id,
    clinicalStatus: { coding: [{ system: "http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical", code: "active" }] },
    code: { text: input.displayText },
    patient: input.patientRef,
  });
}
