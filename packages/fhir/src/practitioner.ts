import { z } from "zod";

export const PractitionerSchema = z.object({
  resourceType: z.literal("Practitioner"),
  id: z.string(),
  name: z.array(z.object({ text: z.string() })),
});
export type Practitioner = z.infer<typeof PractitionerSchema>;

export interface BuildPractitionerInput {
  id: string;
  /** No RBAC/practitioner registry exists yet (ADR pattern established for POST /sign's
   * signed_by) — this is a plain display name, not a resolved identity. */
  name: string;
}

export function buildPractitioner(input: BuildPractitionerInput): Practitioner {
  return PractitionerSchema.parse({
    resourceType: "Practitioner",
    id: input.id,
    name: [{ text: input.name }],
  });
}
