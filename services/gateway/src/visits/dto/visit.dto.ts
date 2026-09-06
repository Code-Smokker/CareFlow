import { z } from "zod";

export const EditSummaryFieldSchema = z.object({
  field_path: z.string().min(1),
  value: z.unknown(),
});
export type EditSummaryFieldDto = z.infer<typeof EditSummaryFieldSchema>;

export const SignVisitSchema = z.object({
  signed_by: z.string().min(1),
});
export type SignVisitDto = z.infer<typeof SignVisitSchema>;
