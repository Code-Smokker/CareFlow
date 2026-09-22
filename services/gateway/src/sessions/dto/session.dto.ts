import { z } from "zod";

/** POST /v1/sessions — the body is optional; `department` is staff-configured, not patient-chosen. */
export const RegistrationPatientSchema = z.object({
  name: z.string().trim().min(1).max(120),
  age_years: z.number().int().min(0).max(120).optional(),
  sex: z.enum(["male", "female", "other", "unknown"]).optional(),
  phone: z.string().trim().min(5).max(20).optional(),
  abha_number: z.string().trim().min(5).max(40).optional(),
});
export type RegistrationPatientDto = z.infer<typeof RegistrationPatientSchema>;

export const CreateSessionSchema = z
  .object({
    department: z.string().regex(/^[a-z][a-z0-9_-]{0,31}$/).optional(),
    patient: RegistrationPatientSchema.optional(),
  })
  .default({});
export type CreateSessionDto = z.infer<typeof CreateSessionSchema>;

/** Mirrors packages/contracts/openapi/gateway.yaml — AnswerSubmission. */
export const AnswerSubmissionSchema = z.object({
  slot_id: z.string().min(1),
  value: z.unknown(),
  input_mode: z.enum(["voice", "tap", "bodymap", "proxy", "ocr"]),
  confidence: z.number().min(0).max(1).nullable().optional(),
  audio_uri: z.url().nullable().optional(), // accepted for wire compatibility, IGNORED — see SessionsService.submitAnswer
  voice_id: z.uuid().nullable().optional(),
  replaces: z.boolean().optional(),
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
        "voice_note_share",
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
        "voice_note_share",
      ]),
    )
    .min(1),
});
export type RevokeConsentBodyDto = z.infer<typeof RevokeConsentBodySchema>;

export const ResumeBodySchema = z.object({
  resume_token: z.string().min(1),
});
export type ResumeBodyDto = z.infer<typeof ResumeBodySchema>;
