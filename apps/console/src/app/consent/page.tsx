import Link from "next/link";
import { createGatewayClient } from "@careflow/api-client";
import { StatusBadge, DemoDataBadge } from "@careflow/ui";

export const dynamic = "force-dynamic";

const SCOPE_LABEL: Record<string, string> = {
  history: "Medical history",
  audio_recording: "Audio recording",
  documents: "Uploaded documents",
  abha_lookup: "ABHA lookup",
  research_deidentified: "De-identified research use",
};

export default async function ConsentPage({
  searchParams,
}: {
  searchParams: Promise<{ visitId?: string }>;
}) {
  const { visitId } = await searchParams;
  const gateway = createGatewayClient();

  if (!visitId) {
    const { data } = await gateway.GET("/v1/visits/queue");
    return (
      <div>
        <h1 className="font-page-title text-page-title text-on-surface mb-space-sm">Consent &amp; Privacy</h1>
        <p className="font-clinical-data text-on-surface-variant mb-space-md">
          Consent is recorded per intake session — pick a visit.
        </p>
        <div className="flex flex-col gap-1">
          {(data ?? []).map((t) => (
            <Link
              key={t.visit_id}
              href={`/consent?visitId=${t.visit_id}`}
              className="px-space-md py-space-sm rounded-lg bg-surface-container-lowest hover:bg-surface-container-low font-clinical-data text-on-surface"
            >
              Token {t.token_no} · {t.department}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const summary = await gateway.GET("/v1/visits/{id}/summary", { params: { path: { id: visitId } } });
  if (summary.error) {
    return <p className="text-error font-clinical-data">Could not load this visit: {summary.error.error.message}</p>;
  }
  const sessionId = summary.data.session_id;

  const [session, consentResource] = await Promise.all([
    gateway.GET("/v1/sessions/{id}", { params: { path: { id: sessionId } } }),
    gateway.GET("/v1/sessions/{id}/consent/resource", { params: { path: { id: sessionId } } }),
  ]);

  return (
    <div>
      <h1 className="font-page-title text-page-title text-on-surface mb-space-md">
        Consent &amp; Privacy — visit {visitId}
      </h1>

      <section className="mb-space-lg">
        <h2 className="font-section-title text-section-title text-on-surface mb-space-sm">Recorded scopes</h2>
        <div className="flex flex-wrap gap-space-sm">
          {(session.data?.consent_scopes ?? []).map((scope) => (
            <StatusBadge key={scope} tone="good" label={SCOPE_LABEL[scope] ?? scope} />
          ))}
          {(session.data?.consent_scopes ?? []).length === 0 && (
            <p className="font-clinical-data text-on-surface-variant">No consent scopes recorded yet.</p>
          )}
        </div>
      </section>

      <section className="mb-space-lg">
        <h2 className="font-section-title text-section-title text-on-surface mb-space-sm">FHIR Consent resource</h2>
        <pre className="rounded-lg border border-outline-variant bg-surface-container-lowest p-panel-padding overflow-auto text-[12px] font-clinical-data-mono text-on-surface max-h-[40vh]">
          {consentResource.data ? JSON.stringify(consentResource.data, null, 2) : "Not available."}
        </pre>
      </section>

      <section>
        <div className="flex items-center justify-between mb-space-sm">
          <h2 className="font-section-title text-section-title text-on-surface">DPDP admin actions</h2>
          <DemoDataBadge reason="TTL wipe / break-glass / key-rotation controls have no backing endpoint yet — session-level consent above is real." />
        </div>
      </section>
    </div>
  );
}
