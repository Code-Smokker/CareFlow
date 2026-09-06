import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { DocumentBundle } from "@careflow/fhir";
import type { Env } from "../common/env";
import { rootLogger } from "../common/logger";

const PUSH_TIMEOUT_MS = 5000;

/** docs/14-features.md section 7 "HIS push adapter (REST / HL7 v2)" — the problem statement
 * names HIS integration explicitly, and until this pass nothing existed. Deliberately thin: a
 * best-effort REST push of the already-signed, already-HAPI-validated bundle to a hospital's
 * receiving endpoint, plus a placeholder showing the intended HL7 v2 shape. Real HL7 v2
 * encoding (MSH/PID/OBX segment construction, ack handling) is out of scope for this pass —
 * claim exactly that, don't pretend this produces a wire-valid HL7 message. */
@Injectable()
export class HisAdapterService {
  constructor(private readonly config: ConfigService<Env, true>) {}

  /** Never throws — the sign has already succeeded and is already valid; a HIS that's down or
   * unconfigured must not affect that (docs/03-api-contracts.md rule 2). Caller fires this
   * without awaiting the result on the request path. */
  async pushBestEffort(bundle: DocumentBundle): Promise<void> {
    const pushUrl = this.config.get("HIS_PUSH_URL", { infer: true });
    if (!pushUrl) {
      rootLogger.info({ bundle_id: bundle.id }, "HIS_PUSH_URL not configured, skipping HIS push");
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), PUSH_TIMEOUT_MS);
    try {
      const response = await fetch(pushUrl, {
        method: "POST",
        headers: { "Content-Type": "application/fhir+json" },
        body: JSON.stringify(bundle),
        signal: controller.signal,
      });
      if (!response.ok) {
        rootLogger.warn({ bundle_id: bundle.id, status: response.status }, "HIS push responded with an error status");
        return;
      }
      rootLogger.info({ bundle_id: bundle.id }, "HIS push succeeded");
    } catch (err) {
      rootLogger.warn({ bundle_id: bundle.id, error: err instanceof Error ? err.message : String(err) }, "HIS push failed");
    } finally {
      clearTimeout(timeout);
    }
  }

  /** Placeholder only — shows the intended ORU^R01-style segment shape for a hospital whose
   * receiving system is HL7 v2, not FHIR. This is NOT a wire-valid HL7 v2 message (no MSH-10
   * control ID uniqueness guarantee, no encoding-character escaping, no ACK handling) — it
   * exists so the shape is visible and reviewable, not to be sent anywhere as-is. */
  buildHl7v2Placeholder(bundle: DocumentBundle): string {
    const timestamp = bundle.timestamp.replace(/[-:]/g, "").slice(0, 14);
    return [
      `MSH|^~\\&|CAREFLOW|HOSPITAL|HIS|HOSPITAL|${timestamp}||ORU^R01|${bundle.id}|P|2.5`,
      `PID|1||${bundle.identifier.value}`,
      `OBR|1|||CareFlow OP Consult Record`,
      `OBX|1|TX|SUMMARY||See attached FHIR bundle ${bundle.id}||||||F`,
    ].join("\r");
  }
}
