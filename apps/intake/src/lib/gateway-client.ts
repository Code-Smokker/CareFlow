import { createGatewayClient } from "@careflow/api-client";

/**
 * The browser talks to ONE origin — this app's own. next.config.ts rewrites `/api/v1/*` to the gateway, so a
 * phone opening the HTTPS tunnel URL (a microphone needs a secure context) never needs to reach
 * `localhost:4000`, which on a phone is the phone itself. NEXT_PUBLIC_GATEWAY_URL can still point somewhere
 * absolute (e.g. a deployed gateway with CORS); unset, it is same-origin `/api`.
 */
export const GATEWAY_BASE = process.env.NEXT_PUBLIC_GATEWAY_URL ?? "/api";

export const gateway = createGatewayClient(GATEWAY_BASE);
