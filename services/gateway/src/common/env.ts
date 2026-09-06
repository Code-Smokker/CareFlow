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
  AI_SERVICE_URL: z.url().default("http://localhost:8001"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
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
