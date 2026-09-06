import { z } from "zod";
import { CodeableConceptSchema, ReferenceSchema } from "./common";

export const ConditionSchema = z.object({
  resourceType: z.literal("Condition"),
  id: z.string(),
  clinicalStatus: CodeableConceptSchema,
  code: CodeableConceptSchema,
  subject: ReferenceSchema,
  encounter: ReferenceSchema.optional(),
  recordedDate: z.string().optional(),
});
export type Condition = z.infer<typeof ConditionSchema>;

export interface BuildConditionInput {
  id: string;
  /** Plain text only — NAMASTE/ICD-11 TM2 coding is the terminology service's job
   * (docs/07-ayush-terminology.md) and isn't wired in here; every code in that pipeline is a
   * PLACEHOLDER until verified, so this builder emits an honest text-only CodeableConcept
   * rather than a fabricated coding array. */
  displayText: string;
  patientRef: z.infer<typeof ReferenceSchema>;
  encounterRef?: z.infer<typeof ReferenceSchema>;
  recordedDate?: string | null;
}

export function buildCondition(input: BuildConditionInput): Condition {
  return ConditionSchema.parse({
    resourceType: "Condition",
    id: input.id,
    clinicalStatus: { coding: [{ system: "http://terminology.hl7.org/CodeSystem/condition-clinical", code: "active" }] },
    code: { text: input.displayText },
    subject: input.patientRef,
    encounter: input.encounterRef,
    recordedDate: input.recordedDate ?? undefined,
  });
}
