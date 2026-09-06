import { z } from "zod";
import { CodeableConceptSchema, ReferenceSchema } from "./common";

/** docs/09-security-dpdp.md's four granular scopes, mapped onto the gateway's existing
 * ConsentScope enum (services/gateway/src/sessions/dto/session.dto.ts) — never invent new
 * scope strings here, this is display-only labelling of what's already recorded. */
const SCOPE_DISPLAY: Record<string, string> = {
  history: "Capture my history",
  audio_recording: "Record my spoken answers as audio",
  documents: "Read my old records",
  abha_lookup: "Link to my ABHA",
  research_deidentified: "Share de-identified data for research",
};

export const ConsentProvisionSchema = z.object({
  code: z.array(CodeableConceptSchema).optional(),
});

export const ConsentSchema = z.object({
  resourceType: z.literal("Consent"),
  id: z.string(),
  status: z.enum(["active", "inactive"]),
  scope: CodeableConceptSchema,
  category: z.array(CodeableConceptSchema),
  patient: ReferenceSchema,
  dateTime: z.string(),
  provision: ConsentProvisionSchema.optional(),
  sourceAttachment: z.object({ url: z.string() }).optional(),
});
export type Consent = z.infer<typeof ConsentSchema>;

export interface BuildConsentInput {
  id: string;
  patientRef: z.infer<typeof ReferenceSchema>;
  /** Scopes currently granted (not revoked) — becomes `provision.code`. */
  grantedScopes: string[];
  /** Every scope ever recorded for this session, granted or revoked — becomes `category`, so
   * a revoked scope stays visible on the resource rather than disappearing from the record. */
  allScopes: string[];
  grantedAt: string;
  audioUri?: string | null;
}

/** One FHIR Consent per session (docs/09, docs/14-features.md P1 "FHIR Consent resource plus
 * recorded audio assent"). `status` is "active" only when at least one scope is still granted
 * (services/gateway/src/sessions/sessions.service.ts's revokeConsent sets a scope's
 * `revokedAt` rather than deleting the row — a revocation is a recorded event, not an erasure;
 * full erasure is the separate `DELETE /v1/sessions/:id` purge path). */
export function buildConsent(input: BuildConsentInput): Consent {
  return ConsentSchema.parse({
    resourceType: "Consent",
    id: input.id,
    status: input.grantedScopes.length > 0 ? "active" : "inactive",
    scope: {
      coding: [{ system: "http://terminology.hl7.org/CodeSystem/consentscope", code: "patient-privacy" }],
    },
    category: input.allScopes.map((scope) => ({
      coding: [{ system: "https://careflow.dev/fhir/consent-scope", code: scope, display: SCOPE_DISPLAY[scope] ?? scope }],
    })),
    patient: input.patientRef,
    dateTime: input.grantedAt,
    provision: {
      code: input.grantedScopes.map((scope) => ({
        coding: [{ system: "https://careflow.dev/fhir/consent-scope", code: scope, display: SCOPE_DISPLAY[scope] ?? scope }],
      })),
    },
    sourceAttachment: input.audioUri ? { url: input.audioUri } : undefined,
  });
}
