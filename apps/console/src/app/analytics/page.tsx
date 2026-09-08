import { createGatewayClient } from "@careflow/api-client";

export const dynamic = "force-dynamic";

/** Rebuilt from real data — GET /v1/analytics/summary, aggregate queries over Visit/RedFlag/
 * IntakeSession/Summary. No new data, no separate analytics store. */
export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ since?: string }>;
}) {
  const { since } = await searchParams;
  const gateway = createGatewayClient();
  const { data, error } = await gateway.GET("/v1/analytics/summary", {
    params: { query: { since } },
  });

  if (error) {
    return <p className="text-error font-clinical-data p-panel-padding">Could not load analytics: {error.error.message}</p>;
  }

  return (
    <div>
      <div className="flex items-baseline justify-between mb-space-md">
        <h1 className="font-page-title text-page-title text-on-surface">Analytics</h1>
        <span className="font-clinical-data-mono text-clinical-data-mono text-on-surface-variant">
          {new Date(data.window_start).toLocaleString()} – {new Date(data.window_end).toLocaleString()}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-space-sm mb-space-lg">
        <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-panel-padding">
          <p className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase">OPD throughput</p>
          <p className="mt-1 font-page-title text-page-title text-on-surface">{data.opd_throughput}</p>
        </div>
        <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-panel-padding">
          <p className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase">Red-flag rate</p>
          <p className="mt-1 font-page-title text-page-title text-on-surface">{Math.round(data.red_flag_rate * 100)}%</p>
        </div>
        <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-panel-padding">
          <p className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase">Average intake time</p>
          <p className="mt-1 font-page-title text-page-title text-on-surface">
            {data.average_intake_seconds === null
              ? "—"
              : `${Math.round(data.average_intake_seconds / 60)}m ${Math.round(data.average_intake_seconds % 60)}s`}
          </p>
        </div>
        <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-panel-padding">
          <p className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase">Top complaint</p>
          <p className="mt-1 font-page-title text-page-title text-on-surface">
            {data.top_complaints[0]?.complaint ?? "—"}
          </p>
        </div>
      </div>

      <section>
        <h2 className="font-section-title text-section-title text-on-surface mb-space-sm">Top complaints</h2>
        <div className="flex flex-col gap-1">
          {data.top_complaints.map((c) => (
            <div key={c.complaint} className="flex items-center justify-between px-space-md py-space-sm rounded-lg bg-surface-container-lowest">
              <span className="font-clinical-data text-clinical-data text-on-surface">{c.complaint}</span>
              <span className="font-clinical-data-mono text-clinical-data-mono text-on-surface-variant">{c.count}</span>
            </div>
          ))}
          {data.top_complaints.length === 0 && (
            <p className="text-on-surface-variant font-clinical-data">No completed intakes with a chief complaint in this window.</p>
          )}
        </div>
      </section>
    </div>
  );
}
