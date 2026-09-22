import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Env } from "../common/env";

/** Thrown on any failure to reach or parse a response from the docai service — same shape as
 * AiServiceClient's AiServiceUnavailable (services/gateway/src/ai/ai-service.client.ts). */
export class DocAiServiceUnavailable extends Error {}

const PROCESS_TIMEOUT_MS = 5000; // enqueue is fast — the actual OCR/extraction runs in Celery
const SEARCH_TIMEOUT_MS = 3000; // a trigram query against dictionary_entry — the medicine search box shouldn't hang on it

export interface DictionaryEntryPayload {
  id: string;
  system: "allopathic" | "ayush_formulation" | "ayush_plant";
  canonical_name: string;
  synonyms: string[];
  metadata: Record<string, unknown> | null;
  score: number;
}

@Injectable()
export class DocAiServiceClient {
  constructor(private readonly config: ConfigService<Env, true>) {}

  /** GET /dictionary/search on docai — the same real DictionaryEntry table (Ayurvedic
   * Formulary of India seed data, docs/06-document-ai.md stage 4) docai already uses to
   * fuzzy-match handwritten drug names. The doctor console's medicine search reuses it rather
   * than inventing a second formulation list. */
  async searchDictionary(q: string, system: string | undefined, limit: number): Promise<DictionaryEntryPayload[]> {
    const baseUrl = this.config.get("DOCAI_SERVICE_URL", { infer: true });
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), SEARCH_TIMEOUT_MS);
    const params = new URLSearchParams({ q, limit: String(limit) });
    if (system) params.set("system", system);
    try {
      const response = await fetch(`${baseUrl}/dictionary/search?${params.toString()}`, { signal: controller.signal });
      if (!response.ok) throw new DocAiServiceUnavailable(`docai service /dictionary/search responded ${response.status}`);
      const body = (await response.json()) as { results: DictionaryEntryPayload[] };
      return body.results;
    } catch (err) {
      if (err instanceof DocAiServiceUnavailable) throw err;
      throw new DocAiServiceUnavailable(err instanceof Error ? err.message : String(err));
    } finally {
      clearTimeout(timeout);
    }
  }

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
