import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { ConfigService } from "@nestjs/config";
import type { Env } from "../common/env";

/** Where `make tunnel` records the public HTTPS URL it opened (repo-root .dev-pids/). */
const TUNNEL_URL_FILE = resolve(__dirname, "../../../../.dev-pids/intake-public-url");

/**
 * The origin token-slip QR codes encode. Order:
 *   1. INTAKE_PUBLIC_URL — an explicit, permanent public origin (a deployed patient app);
 *   2. the URL `make tunnel` is serving right now (read per request, so a slip issued after the tunnel
 *      opens is right without restarting anything);
 *   3. PUBLIC_WEB_URL — the local address (works on the same machine only).
 * A phone's microphone needs HTTPS, so for real-phone use 1 or 2 must apply.
 */
export function resolveIntakeUrl(config: ConfigService<Env, true>): string {
  const explicit = config.get("INTAKE_PUBLIC_URL", { infer: true });
  if (explicit) return explicit.replace(/\/$/, "");
  try {
    const tunnel = readFileSync(TUNNEL_URL_FILE, "utf8").trim();
    if (/^https:\/\/[^\s]+$/.test(tunnel)) return tunnel.replace(/\/$/, "");
  } catch {
    /* no tunnel running */
  }
  return config.get("PUBLIC_WEB_URL", { infer: true });
}
