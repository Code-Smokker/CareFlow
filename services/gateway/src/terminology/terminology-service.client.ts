import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Env } from "../common/env";

/** Thrown on any failure to reach or parse a response from the terminology service — same
 * shape as DocAiServiceUnavailable (services/gateway/src/docai/docai-service.client.ts). Never
 * an error the sign flow re-throws: services/gateway/src/visits/visits.service.ts catches this
 * and signs with a text-only Condition, exactly as it does today with no terminology service at
 * all (docs/03-api-contracts.md rule 2 — "every endpoint returns something useful on partial
 * failure"). */
export class TerminologyServiceUnavailable extends Error {}

const REQUEST_TIMEOUT_MS = 3000; // dual-coding is an enrichment, not on POST /answer's hot path — but sign() still shouldn't hang on it

export type TerminologySystem = "namaste" | "icd11-tm2" | "icd11-bio";

export interface ConceptSummary {
  system: TerminologySystem;
  code: string;
  display: string;
  score: number;
}

export interface ConceptMapMatch {
  matched: boolean;
  equivalence: "equivalent" | "wider" | "narrower" | "related" | "inexact" | null;
  target_system?: TerminologySystem;
  target_code?: string | null;
  target_display?: string | null;
  reviewed_by?: string | null;
  provenance?: "lexical" | "manual" | null;
}

@Injectable()
export class TerminologyServiceClient {
  constructor(private readonly config: ConfigService<Env, true>) {}

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const baseUrl = this.config.get("TERMINOLOGY_SERVICE_URL", { infer: true });
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const response = await fetch(`${baseUrl}${path}`, { ...init, signal: controller.signal });
      if (!response.ok) {
        throw new TerminologyServiceUnavailable(`terminology service ${path} responded ${response.status}`);
      }
      return (await response.json()) as T;
    } catch (err) {
      if (err instanceof TerminologyServiceUnavailable) throw err;
      throw new TerminologyServiceUnavailable(err instanceof Error ? err.message : String(err));
    } finally {
      clearTimeout(timeout);
    }
  }

  /** Best candidate NAMASTE concept for free text, or null if nothing scored high enough to
   * act on — this service never invents a code to fill a slot (docs/07-ayush-terminology.md),
   * so the caller decides its own acceptance threshold rather than this client guessing one. */
  async search(q: string, system: TerminologySystem): Promise<ConceptSummary[]> {
    return this.request<ConceptSummary[]>(`/search?q=${encodeURIComponent(q)}&system=${system}`);
  }

  async translate(system: TerminologySystem, code: string, target: TerminologySystem): Promise<ConceptMapMatch> {
    return this.request<ConceptMapMatch>("/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system, code, target }),
    });
  }
}
