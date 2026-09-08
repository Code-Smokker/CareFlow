import { createGatewayClient } from "@careflow/api-client";

/** Unlike apps/console, this app calls the gateway directly from the browser — the interview is
 * a live, turn-by-turn conversation, not a page render. The gateway's CORS is already
 * configured for exactly this origin (PUBLIC_WEB_URL defaults to http://localhost:3000,
 * .env.example) — no new backend config needed. NEXT_PUBLIC_GATEWAY_URL overrides it. */
export const gateway = createGatewayClient(process.env.NEXT_PUBLIC_GATEWAY_URL ?? "http://localhost:4000");
