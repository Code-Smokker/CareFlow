import { z } from "zod";

/** Mirrors packages/contracts/openapi/docai.yaml — BoundingBox/ExtractedField/ProcessResult.
 * This is the shape services/docai/app/tasks.py POSTs to GATEWAY_CALLBACK_URL, not a public
 * contract endpoint — docai is an internal service, never called directly by a client. */
const BoundingBoxSchema = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
});

const ExtractedFieldSchema = z.object({
  field: z.string(),
  value: z.string(),
  confidence: z.number().min(0).max(1),
  bounding_box: BoundingBoxSchema.nullable(),
  needs_confirmation: z.boolean(),
  dictionary_matches: z.array(z.string()),
});

const TimelineEventSchema = z.object({
  event_id: z.string(),
  occurred_at: z.string(),
  kind: z.enum(["visit", "prescription", "lab_report", "symptom_onset"]),
  summary: z.string(),
});

export const ProcessCallbackSchema = z.object({
  document_id: z.string(),
  extractions: z.array(ExtractedFieldSchema),
  timeline_events: z.array(TimelineEventSchema),
  quality_score: z.number().min(0).max(1),
});
export type ProcessCallbackDto = z.infer<typeof ProcessCallbackSchema>;

export const UploadDocumentBodySchema = z.object({
  doc_type_hint: z.string().nullable().optional(),
});
export type UploadDocumentBodyDto = z.infer<typeof UploadDocumentBodySchema>;
