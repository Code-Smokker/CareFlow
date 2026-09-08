import { createGatewayClient } from "@careflow/api-client";
import { SignButton } from "./SignButton";

export const dynamic = "force-dynamic";

export default async function SignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gateway = createGatewayClient();
  const { data: summary, error } = await gateway.GET("/v1/visits/{id}/summary", {
    params: { path: { id } },
  });

  if (error) {
    return <p className="text-error font-clinical-data">Could not load this visit: {error.error.message}</p>;
  }

  const unresolvedFlags = summary.red_flags.filter((f) => !f.acknowledged_by);
  const lowConfidenceCount = summary.fields.filter((f) => f.low_confidence && !f.physician_edited).length;

  return (
    <div>
      <h1 className="font-page-title text-page-title text-on-surface mb-space-md">Review &amp; Sign</h1>

      {summary.signed ? (
        <div className="rounded-lg border border-primary-container bg-primary-container/20 p-panel-padding">
          <p className="font-body-strong text-body-strong text-on-surface">Already signed.</p>
          <p className="font-clinical-data text-clinical-data text-on-surface-variant">
            This visit&apos;s summary has been physician-signed. See /visit/{id}/summary/print for the FHIR bundle status.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-space-md max-w-xl">
          {unresolvedFlags.length > 0 && (
            <p className="text-error font-clinical-data">
              {unresolvedFlags.length} unacknowledged red flag(s) — acknowledge them from the queue before signing.
            </p>
          )}
          {lowConfidenceCount > 0 && (
            <p className="text-uncertain font-clinical-data">
              {lowConfidenceCount} field(s) are still low-confidence and unconfirmed.
            </p>
          )}
          <p className="font-clinical-data text-on-surface-variant">
            {summary.fields.length} slots recorded. Signing assembles the FHIR bundle and attempts the
            ABDM care-context link (mocked unless a sandbox key is configured).
          </p>
          <SignButton visitId={id} />
        </div>
      )}
    </div>
  );
}
