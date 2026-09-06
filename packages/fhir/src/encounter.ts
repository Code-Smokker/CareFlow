import { z } from "zod";
import { CodingSchema, PeriodSchema, ReferenceSchema } from "./common";

export const EncounterSchema = z.object({
  resourceType: z.literal("Encounter"),
  id: z.string(),
  status: z.enum(["planned", "arrived", "in-progress", "onleave", "finished", "cancelled"]),
  class: CodingSchema,
  subject: ReferenceSchema,
  period: PeriodSchema.optional(),
});
export type Encounter = z.infer<typeof EncounterSchema>;

export interface BuildEncounterInput {
  id: string;
  status: Encounter["status"];
  patientRef: z.infer<typeof ReferenceSchema>;
  periodStart?: string | null;
  periodEnd?: string | null;
}

/** class = AMB (ambulatory) — an OPD visit, per HL7's v3 ActCode system, the standard choice
 * for an outpatient encounter. */
export function buildEncounter(input: BuildEncounterInput): Encounter {
  return EncounterSchema.parse({
    resourceType: "Encounter",
    id: input.id,
    status: input.status,
    class: { system: "http://terminology.hl7.org/CodeSystem/v3-ActCode", code: "AMB", display: "ambulatory" },
    subject: input.patientRef,
    period:
      input.periodStart || input.periodEnd
        ? { start: input.periodStart ?? undefined, end: input.periodEnd ?? undefined }
        : undefined,
  });
}
