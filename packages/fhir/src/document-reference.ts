import { z } from "zod";
import { CodeableConceptSchema, ReferenceSchema } from "./common";

export const DocumentReferenceSchema = z.object({
  resourceType: z.literal("DocumentReference"),
  id: z.string(),
  status: z.enum(["current", "superseded", "entered-in-error"]),
  type: CodeableConceptSchema.optional(),
  subject: ReferenceSchema,
  content: z.array(
    z.object({
      attachment: z.object({
        contentType: z.string().optional(),
        url: z.string().optional(),
        title: z.string().optional(),
      }),
    }),
  ),
});
export type DocumentReference = z.infer<typeof DocumentReferenceSchema>;

export interface BuildDocumentReferenceInput {
  id: string;
  patientRef: z.infer<typeof ReferenceSchema>;
  /** MinIO/S3 URI, once docai actually stores scans (docs/06-document-ai.md — not built yet). */
  url: string;
  contentType?: string;
  docTypeText?: string;
}

/** One per scanned document (docs/08-abdm-fhir.md) — docai doesn't exist yet, so this is never
 * called with real data today; exists so the bundle assembler has the right shape ready. */
export function buildDocumentReference(input: BuildDocumentReferenceInput): DocumentReference {
  return DocumentReferenceSchema.parse({
    resourceType: "DocumentReference",
    id: input.id,
    status: "current",
    type: input.docTypeText ? { text: input.docTypeText } : undefined,
    subject: input.patientRef,
    content: [{ attachment: { url: input.url, contentType: input.contentType } }],
  });
}
