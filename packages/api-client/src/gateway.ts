import createClient from "openapi-fetch";
import type { paths } from "@careflow/contracts/generated/ts/gateway";

export type { paths as GatewayPaths } from "@careflow/contracts/generated/ts/gateway";
export type { components as GatewayComponents } from "@careflow/contracts/generated/ts/gateway";

/**
 * Server-side only — call from a Route Handler or Server Component, never a "use client"
 * module. Base URL comes from GATEWAY_URL (not NEXT_PUBLIC_*): the browser never talks to the
 * gateway directly, it talks to apps/console's own /api/* routes, which proxy through this.
 */
export function createGatewayClient(baseUrl: string = process.env.GATEWAY_URL ?? "http://localhost:4000") {
  return createClient<paths>({ baseUrl });
}
