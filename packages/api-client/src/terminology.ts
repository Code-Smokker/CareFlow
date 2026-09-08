import createClient from "openapi-fetch";
import type { paths } from "@careflow/contracts/generated/ts/terminology";

export type { paths as TerminologyPaths } from "@careflow/contracts/generated/ts/terminology";
export type { components as TerminologyComponents } from "@careflow/contracts/generated/ts/terminology";

/**
 * Server-side only, same as createGatewayClient. The terminology service has no browser CORS
 * config (only the gateway does) and there's no gateway proxy for it in gateway.yaml, so this
 * calls TERMINOLOGY_SERVICE_URL directly, Node-to-Node — the same non-gateway-proxied pattern
 * used for the local HAPI FHIR server. Not a new endpoint: /search and /translate already exist
 * on the terminology service, this just calls them from a different (still server-side) caller.
 */
export function createTerminologyClient(
  baseUrl: string = process.env.TERMINOLOGY_SERVICE_URL ?? "http://localhost:8003",
) {
  return createClient<paths>({ baseUrl });
}
