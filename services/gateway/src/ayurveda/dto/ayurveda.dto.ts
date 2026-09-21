import { z } from "zod";

/** Mirrors packages/contracts/openapi/gateway.yaml — PUT /v1/visits/{id}/ayurveda. `value` is
 * validated per field against the vocabulary in AyurvedaService, not here: the schema of a value
 * depends on which field it is for. */
export const SaveAyurvedaExamSchema = z.object({
  recorded_by: z.string().min(1),
  fields: z
    .array(z.object({ field_id: z.string().min(1), value: z.unknown() }))
    .min(1),
});
export type SaveAyurvedaExamDto = z.infer<typeof SaveAyurvedaExamSchema>;

/** One diagnosis the Vaidya picked from the NAMASTE terminology. `icd11` is the linked ICD-11
 * TM2 code from the terminology service's crosswalk (null when it has none). */
export const DiagnosisPickSchema = z.object({
  code: z.string().min(1),
  display: z.string().min(1),
  icd11: z.object({ code: z.string().min(1), display: z.string().nullish() }).nullable(),
  mapping_reviewed: z.boolean(),
});
export type DiagnosisPick = z.infer<typeof DiagnosisPickSchema>;
