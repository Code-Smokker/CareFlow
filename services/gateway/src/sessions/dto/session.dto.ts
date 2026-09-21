import { z } from "zod";

/** POST /v1/sessions — the body is optional; `department` is staff-configured, not patient-chosen. */
export const CreateSessionSchema = z
  .object({ department: z.string().regex(/^[a-z][a-z0-9_-]{0,31}$/).optional() })
  .default({});
export type CreateSessionDto = z.infer<typeof CreateSessionSchema>;

/** Mirrors packages/contracts/openapi/gateway.yaml — AnswerSubmission. */
export const AnswerSubmissionSchema = z.object({
  slot_id: z.string().min(1),
  value: z.unknown(),
  input_mode: z.enum(["voice", "tap", "bodymap", "proxy", "ocr"]),
  confidence: z.number().min(0).max(1).nullable().optional(),
  audio_uri: z.url().nullable().optional(),
});
export type AnswerSubmissionDto = z.infer<typeof AnswerSubmissionSchema>;

export const LanguageBodySchema = z.object({
  language: z.string().min(1),
});
export type LanguageBodyDto = z.infer<typeof LanguageBodySchema>;

export const ConsentBodySchema = z.object({
  scopes: z
    .array(
      z.enum([
        "history",
        "audio_recording",
        "documents",
        "abha_lookup",
        "research_deidentified",
      ]),
    )
    .min(1),
  audio_uri: z.url().nullable().optional(),
});
export type ConsentBodyDto = z.infer<typeof ConsentBodySchema>;

export const RevokeConsentBodySchema = z.object({
  scopes: z
    .array(
      z.enum([
        "history",
        "audio_recording",
        "documents",
        "abha_lookup",
        "research_deidentified",
      ]),
    )
    .min(1),
});
export type RevokeConsentBodyDto = z.infer<typeof RevokeConsentBodySchema>;

export const ResumeBodySchema = z.object({
  resume_token: z.string().min(1),
});
export type ResumeBodyDto = z.infer<typeof ResumeBodySchema>;
