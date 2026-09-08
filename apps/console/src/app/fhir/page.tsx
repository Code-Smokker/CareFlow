import { StatusBadge, DemoDataBadge } from "@careflow/ui";

export const dynamic = "force-dynamic";

/** Correction after testing against the real stack: the bundle is NOT retrievable by id from
 * HAPI. validateBundleAgainstHapi (packages/fhir/src/hapi-client.ts) calls HAPI's stateless
 * $validate operation only — nothing is ever persisted there. The signed bundle lives solely
 * as JSON on the gateway's Visit row, with no endpoint exposing its content. So this screen can
 * honestly show fhir_bundle_id / abdm_status / care_context_status (the real POST /sign
 * response) but not the bundle body — that needs either a new
 * `GET /v1/visits/{id}/fhir-bundle` endpoint or changing sign to persist into HAPI via a real
 * create, not $validate. Listed in docs/19-frontend-status.md, not invented here. */
export default async function FhirGatewayPage({
  searchParams,
}: {
  searchParams: Promise<{ bundleId?: string; abdmStatus?: string; careContextStatus?: string }>;
}) {
  const { bundleId, abdmStatus, careContextStatus } = await searchParams;

  if (!bundleId) {
    return (
      <div>
        <h1 className="font-page-title text-page-title text-on-surface mb-space-sm">FHIR / ABDM Gateway</h1>
        <p className="font-clinical-data text-on-surface-variant">
          No bundle selected. Sign a visit from its <code>/sign</code> screen — the resulting bundle
          status lands here.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-page-title text-page-title text-on-surface mb-space-sm">FHIR / ABDM Gateway</h1>

      <div className="flex items-center gap-space-sm mb-space-md flex-wrap">
        <StatusBadge tone="good" label="Bundle assembled at sign-time" />
        {abdmStatus && <StatusBadge tone={abdmStatus === "acknowledged" ? "good" : "uncertain"} label={`ABDM: ${abdmStatus}`} />}
      </div>
      {careContextStatus && (
        <p className="font-clinical-data-mono text-clinical-data-mono text-on-surface-variant mb-space-md">
          Care context: {careContextStatus}
        </p>
      )}

      <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-panel-padding mb-space-md">
        <p className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase">FHIR bundle ID</p>
        <p className="font-clinical-data-mono text-clinical-data text-on-surface">{bundleId}</p>
      </div>

      <DemoDataBadge reason="The bundle body itself isn't shown below — it's validated against local HAPI via a stateless $validate call at sign-time (never persisted there) and stored only as JSON on the gateway's Visit row, with no endpoint exposing that content back. The ID and statuses above are real, from the actual POST /v1/visits/{id}/sign response." />
    </div>
  );
}
