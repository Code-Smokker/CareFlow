import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Env } from "../common/env";
import type { FiredRedFlag } from "../ontology/ontology.types";

/** Thrown on any failure to reach or parse a response from the ai service — the caller's
 * signal to fall back to the local ontology walk (docs/01-architecture.md "Degradation"). */
export class AiServiceUnavailable extends Error {}

const EVALUATE_FLAGS_TIMEOUT_MS = 800; // leaves headroom inside the 1.2s p95 turn budget

type ContractSeverity = "info" | "warning" | "critical";

/** Inverse of SessionsService's severityToContract — ai service returns the contract's string
 * enum (packages/contracts/openapi/ai.yaml RedFlagFinding); everywhere else in the gateway
 * (Prisma's red_flag.severity, OntologyService.evaluateRedFlags) uses the ontology's numeric
 * 1|2|3, so results from either source can flow through the same downstream code unchanged. */
function toNumericSeverity(severity: ContractSeverity): 1 | 2 | 3 {
  if (severity === "critical") return 1;
  if (severity === "warning") return 2;
  return 3;
}

@Injectable()
export class AiServiceClient {
  constructor(private readonly config: ConfigService<Env, true>) {}

  async evaluateFlags(
    sessionId: string,
    moduleId: string,
    slots: Record<string, unknown>,
  ): Promise<FiredRedFlag[]> {
    const baseUrl = this.config.get("AI_SERVICE_URL", { infer: true });
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), EVALUATE_FLAGS_TIMEOUT_MS);
    try {
      const response = await fetch(`${baseUrl}/evaluate-flags`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sessionId },
        body: JSON.stringify({ module_id: moduleId, slots }),
        signal: controller.signal,
      });
      if (!response.ok) {
        throw new AiServiceUnavailable(`ai service /evaluate-flags responded ${response.status}`);
      }
      const body = (await response.json()) as {
        fired: { rule_id: string; severity: ContractSeverity; quote: string }[];
      };
      return body.fired.map((f) => ({
        rule_id: f.rule_id,
        severity: toNumericSeverity(f.severity),
        quote: f.quote,
      }));
    } catch (err) {
      if (err instanceof AiServiceUnavailable) throw err;
      throw new AiServiceUnavailable(err instanceof Error ? err.message : String(err));
    } finally {
      clearTimeout(timeout);
    }
  }
}
