import { z } from "zod";
import { CodeableConceptSchema, CodingSchema, ReferenceSchema } from "./common";

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
  displayText: string;
  /** NAMASTE + ICD-11 TM2/MMS codings from the terminology service (docs/07-ayush-terminology.md
   * "dual coding"), sourced by the gateway (services/gateway/src/visits/visits.service.ts)
   * calling TerminologyServiceClient before assembling the bundle — never constructed here.
   * Omitted or empty when the terminology service found no NAMASTE match at all (its tables
   * are empty until the real NAMASTE export is loaded — infra/seed/namaste/ has none yet), in
   * which case `code` stays exactly the text-only CodeableConcept this builder always emitted
   * before dual coding existed. Never invent a coding to fill this array. */
  codings?: z.infer<typeof CodingSchema>[];
  patientRef: z.infer<typeof ReferenceSchema>;
  encounterRef?: z.infer<typeof ReferenceSchema>;
  recordedDate?: string | null;
}

export function buildCondition(input: BuildConditionInput): Condition {
  return ConditionSchema.parse({
    resourceType: "Condition",
    id: input.id,
    clinicalStatus: { coding: [{ system: "http://terminology.hl7.org/CodeSystem/condition-clinical", code: "active" }] },
    code: {
      text: input.displayText,
      ...(input.codings && input.codings.length > 0 ? { coding: input.codings } : {}),
    },
    subject: input.patientRef,
    encounter: input.encounterRef,
    recordedDate: input.recordedDate ?? undefined,
  });
}
