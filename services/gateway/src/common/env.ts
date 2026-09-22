import { z } from "zod";

/**
 * Only the variables the gateway actually reads. The rest of .env.example belongs to the
 * other services / external integrations and is validated where it's used.
 */
export const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  LOG_LEVEL: z.string().default("info"),
  GATEWAY_PORT: z.coerce.number().int().positive().default(4000),
  PUBLIC_WEB_URL: z.url().default("http://localhost:3000"),
  // Comma-separated extra allowed CORS origins beyond PUBLIC_WEB_URL (e.g. a kiosk build's own
  // origin, a staging host). Empty by default — most environments only need PUBLIC_WEB_URL.
  CORS_ORIGINS: z.string().default(""),
  AI_SERVICE_URL: z.url().default("http://localhost:8001"),
  DOCAI_SERVICE_URL: z.url().default("http://localhost:8002"),
  TERMINOLOGY_SERVICE_URL: z.url().default("http://localhost:8003"),
  FHIR_SERVER_URL: z.url().default("http://localhost:8090/fhir"),
  HIS_PUSH_URL: z.union([z.url(), z.literal("")]).default(""),
  // Comma-separated departments that run in AYUSH mode (the Prashna modules after the complaint
  // module). Set per OPD/department here — in visit config — never by the patient.
  AYUSH_DEPARTMENTS: z
    .string()
    .default("ayurveda")
    .transform((v) =>
      v
        .split(",")
        .map((d) => d.trim().toLowerCase())
        .filter(Boolean),
    ),
  DEID_ENABLED: z
    .string()
    .default("false")
    .transform((v) => v === "true"),
  DEID_STRICT: z
    .string()
    .default("false")
    .transform((v) => v === "true"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  // Object storage — Supabase Storage (S3 protocol) by default, MinIO for local/offline dev. Both are
  // plain S3, so one client serves both. STORAGE_PROVIDER is inferred from the endpoint when unset.
  STORAGE_PROVIDER: z.enum(["supabase", "minio"]).optional(),
  S3_ENDPOINT: z.url().default("http://localhost:9000"),
  S3_REGION: z.string().default("us-east-1"),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  // Older names, still read as a fallback so an existing .env keeps working.
  S3_ACCESS_KEY: z.string().optional(),
  S3_SECRET_KEY: z.string().optional(),
  S3_BUCKET_DOCUMENTS: z.string().default("intake-documents"),
  S3_BUCKET_AUDIO: z.string().default("intake-audio"),
  // Voice notes are kept only with the patient's consent, and never longer than this (or until the
  // visit is signed, whichever comes first).
  AUDIO_RETENTION_HOURS: z.coerce.number().positive().default(24),
  // Printed at the top of the token slip.
  HOSPITAL_NAME: z.string().default("CareFlow OPD"),
  // The public HTTPS origin of the patient app — token-slip QR codes encode this (`make tunnel`).
  INTAKE_PUBLIC_URL: z.url().optional(),
  FIELD_ENCRYPTION_KEY: z
    .string()
    .min(1, "FIELD_ENCRYPTION_KEY is required")
    .refine((key) => {
      try {
        return Buffer.from(key, "base64").length === 32;
      } catch {
        return false;
      }
    }, "FIELD_ENCRYPTION_KEY must be a base64-encoded 32-byte key (AES-256-GCM)"),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): Env {
  const result = envSchema.safeParse(config);
  if (!result.success) {
    throw new Error(
      `Invalid environment configuration:\n${result.error.message}`,
    );
  }
  return result.data;
}
