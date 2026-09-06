import { z } from "zod";

export const IdentifyByQrSchema = z.object({
  qr_payload: z.string().min(1),
});
export type IdentifyByQrDto = z.infer<typeof IdentifyByQrSchema>;

export const RequestOtpSchema = z
  .object({
    abha_number: z.string().nullable().optional(),
    mobile: z.string().nullable().optional(),
  })
  .refine((body) => Boolean(body.abha_number) !== Boolean(body.mobile), {
    message: "Exactly one of abha_number or mobile must be set.",
  });
export type RequestOtpDto = z.infer<typeof RequestOtpSchema>;

export const VerifyOtpSchema = z.object({
  txn_id: z.string().min(1),
  otp: z.string().min(1),
});
export type VerifyOtpDto = z.infer<typeof VerifyOtpSchema>;
