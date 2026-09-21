import { cache } from "react";
import { createGatewayClient } from "@careflow/api-client";

/** One fetch per request however many server components ask (the shell and the page both do). */
export const loadAyurveda = cache(async (visitId: string) => {
  const gateway = createGatewayClient();
  const [record, vocabulary] = await Promise.all([
    gateway.GET("/v1/visits/{id}/ayurveda", { params: { path: { id: visitId } } }),
    gateway.GET("/v1/ayurveda/vocabulary"),
  ]);
  if (record.error) return { ok: false as const, message: record.error.error.message };
  if (vocabulary.error) return { ok: false as const, message: vocabulary.error.error.message };
  return { ok: true as const, record: record.data, vocabulary: vocabulary.data };
});
