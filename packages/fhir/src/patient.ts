import { z } from "zod";
import { IdentifierSchema } from "./common";

export const PatientSchema = z.object({
  resourceType: z.literal("Patient"),
  id: z.string(),
  identifier: z.array(IdentifierSchema).optional(),
  name: z.array(z.object({ text: z.string() })).optional(),
  gender: z.enum(["male", "female", "other", "unknown"]).optional(),
  birthDate: z.string().optional(),
});
export type Patient = z.infer<typeof PatientSchema>;

export interface BuildPatientInput {
  id: string;
  /** ABHA number, if identity has been resolved (docs/adr/0007) — most sessions today are a
   * placeholder patient with none of these fields set, and that's a valid Patient resource. */
  abhaNumber?: string | null;
  name?: string | null;
  gender?: "male" | "female" | "other" | "unknown" | null;
  birthDate?: string | null;
}

export function buildPatient(input: BuildPatientInput): Patient {
  return PatientSchema.parse({
    resourceType: "Patient",
    id: input.id,
    identifier: input.abhaNumber
      ? [{ system: "https://healthid.ndhm.gov.in", value: input.abhaNumber }]
      : undefined,
    name: input.name ? [{ text: input.name }] : undefined,
    gender: input.gender ?? undefined,
    birthDate: input.birthDate ?? undefined,
  });
}
