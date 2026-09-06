import { z } from "zod";
import { CodeableConceptSchema, ReferenceSchema } from "./common";

export const MedicationStatementSchema = z.object({
  resourceType: z.literal("MedicationStatement"),
  id: z.string(),
  status: z.enum(["active", "completed", "entered-in-error", "intended", "stopped", "on-hold", "unknown", "not-taken"]),
  medicationCodeableConcept: CodeableConceptSchema,
  subject: ReferenceSchema,
});
export type MedicationStatement = z.infer<typeof MedicationStatementSchema>;

export interface BuildMedicationStatementInput {
  id: string;
  displayText: string;
  patientRef: z.infer<typeof ReferenceSchema>;
  status?: MedicationStatement["status"];
}

/** No drug capture exists yet (docs/14-features.md section 4) — same status as
 * AllergyIntolerance's builder: exists for when that data is real, never called with
 * fabricated data today. */
export function buildMedicationStatement(input: BuildMedicationStatementInput): MedicationStatement {
  return MedicationStatementSchema.parse({
    resourceType: "MedicationStatement",
    id: input.id,
    status: input.status ?? "active",
    medicationCodeableConcept: { text: input.displayText },
    subject: input.patientRef,
  });
}
