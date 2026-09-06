import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Env } from "../common/env";

interface DebugEntry {
  direction: "redact" | "restore";
  before: string;
  after: string;
  at: string;
}

const DEBUG_LOG_LIMIT = 20; // ring buffer per session — demo scaffolding, not a clinical record

/** docs/09-security-dpdp.md's de-identification proxy: "before any hosted model call,
 * identifiers — name, ABHA number, phone, address — are replaced with stable per-session
 * placeholders, and restored on the way back." Callers pass in the patient's already-decrypted
 * identifier values (this service does no encryption/decryption itself, and never touches
 * Prisma — it's pure string substitution, kept deliberately dependency-free so it's trivial to
 * unit-test and to reason about). The placeholder mapping is per-session and stable: the same
 * identifier value always maps to the same placeholder for the life of the session, so a
 * restored response is unambiguous even if the identifier appears many times.
 *
 * `DEID_ENABLED=false` makes both methods no-ops (text passes through unchanged) — used only
 * for local debugging, never in a demo (.env.example: "true in production; false only for
 * local debugging"). `DEID_STRICT=true` (the default) means a redaction failure blocks the
 * call rather than silently sending unredacted text; `DEID_STRICT=false` logs and proceeds.
 */
@Injectable()
export class DeidService {
  private readonly logger = new Logger(DeidService.name);
  private readonly forward = new Map<string, Map<string, string>>(); // sessionId -> (real -> placeholder)
  private readonly backward = new Map<string, Map<string, string>>(); // sessionId -> (placeholder -> real)
  private readonly debugLog = new Map<string, DebugEntry[]>();

  constructor(private readonly config: ConfigService<Env, true>) {}

  private get enabled(): boolean {
    return this.config.get("DEID_ENABLED", { infer: true });
  }

  private get strict(): boolean {
    return this.config.get("DEID_STRICT", { infer: true });
  }

  /** Assigns (or reuses) a stable placeholder for each non-empty identifier, then replaces
   * every occurrence of each identifier's real value in `text` with its placeholder. Order
   * matters: longer identifiers are replaced first so one identifier that's a substring of
   * another (unlikely but not impossible — e.g. a name embedded in an address) can't get
   * partially clobbered by the shorter one's replacement running first. */
  redact(sessionId: string, identifiers: (string | null | undefined)[], text: string): string {
    if (!this.enabled) return text;
    try {
      const real = [...new Set(identifiers.filter((v): v is string => !!v && v.trim().length > 0))].sort(
        (a, b) => b.length - a.length,
      );
      const fwd = this.forward.get(sessionId) ?? new Map<string, string>();
      const bwd = this.backward.get(sessionId) ?? new Map<string, string>();
      this.forward.set(sessionId, fwd);
      this.backward.set(sessionId, bwd);

      let redacted = text;
      for (const value of real) {
        let placeholder = fwd.get(value);
        if (!placeholder) {
          placeholder = `[[ID_${fwd.size + 1}]]`;
          fwd.set(value, placeholder);
          bwd.set(placeholder, value);
        }
        redacted = redacted.split(value).join(placeholder);
      }
      this.recordDebug(sessionId, "redact", text, redacted);
      return redacted;
    } catch (err) {
      if (this.strict) throw err;
      this.logger.warn(`redact failed for session ${sessionId}, sending unredacted text (DEID_STRICT=false): ${err}`);
      return text;
    }
  }

  /** Inverse of redact — replaces every placeholder this session has ever issued with its real
   * value. Safe to call on text that contains no placeholders at all (no-op passthrough). */
  restore(sessionId: string, text: string): string {
    if (!this.enabled) return text;
    const bwd = this.backward.get(sessionId);
    if (!bwd || bwd.size === 0) return text;
    let restored = text;
    for (const [placeholder, value] of bwd) {
      restored = restored.split(placeholder).join(value);
    }
    this.recordDebug(sessionId, "restore", text, restored);
    return restored;
  }

  private recordDebug(sessionId: string, direction: DebugEntry["direction"], before: string, after: string): void {
    const log = this.debugLog.get(sessionId) ?? [];
    log.push({ direction, before, after, at: new Date().toISOString() });
    if (log.length > DEBUG_LOG_LIMIT) log.shift();
    this.debugLog.set(sessionId, log);
  }

  /** Backs the debug view (docs/09: "keep a debug view that shows the before and after ...
   * demos in five seconds"). Deliberately in-memory only, per session, capped — this is demo
   * scaffolding, not something that belongs in the clinical record. */
  getDebugLog(sessionId: string): DebugEntry[] {
    return this.debugLog.get(sessionId) ?? [];
  }
}
