import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Env } from "../common/env";

/** Thrown on any failure to reach or parse a response from the docai service — same shape as
 * AiServiceClient's AiServiceUnavailable (services/gateway/src/ai/ai-service.client.ts). */
export class DocAiServiceUnavailable extends Error {}

const PROCESS_TIMEOUT_MS = 5000; // enqueue is fast — the actual OCR/extraction runs in Celery

@Injectable()
export class DocAiServiceClient {
  constructor(private readonly config: ConfigService<Env, true>) {}

  async process(documentId: string, imageRefs: string[]): Promise<{ job_id: string }> {
    const baseUrl = this.config.get("DOCAI_SERVICE_URL", { infer: true });
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), PROCESS_TIMEOUT_MS);
    try {
      const response = await fetch(`${baseUrl}/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ document_id: documentId, image_refs: imageRefs }),
        signal: controller.signal,
      });
      if (response.status !== 202) {
        throw new DocAiServiceUnavailable(`docai service /process responded ${response.status}`);
      }
      return (await response.json()) as { job_id: string };
    } catch (err) {
      if (err instanceof DocAiServiceUnavailable) throw err;
      throw new DocAiServiceUnavailable(err instanceof Error ? err.message : String(err));
    } finally {
      clearTimeout(timeout);
    }
  }
}
