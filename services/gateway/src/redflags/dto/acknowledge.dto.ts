import { z } from "zod";

export const AcknowledgeRedFlagSchema = z.object({
  actor_id: z.string().min(1),
  actor_role: z.string().min(1),
});
export type AcknowledgeRedFlagDto = z.infer<typeof AcknowledgeRedFlagSchema>;
