import { createGatewayClient } from "@careflow/api-client";
import { StatusBadge } from "@careflow/ui";

export const dynamic = "force-dynamic";
/** Wall display / nurse tablet — re-render every few seconds without a client bundle. */
export const revalidate = 5;

export default async function TriagePage() {
  const gateway = createGatewayClient();
  const { data, error } = await gateway.GET("/v1/visits/queue");

  if (error) {
    return (
      <div className="p-panel-padding bg-inverse-surface min-h-screen">
        <p className="text-error font-clinical-data">Gateway unreachable: {error.error.message}</p>
      </div>
    );
  }

  const withFlags = (data ?? [])
    .filter((t) => t.red_flags.some((f) => !f.acknowledged_by))
    .sort((a, b) => {
      const rank = { critical: 0, warning: 1, info: 2 } as const;
      const aMax = Math.min(...a.red_flags.map((f) => rank[f.severity]));
      const bMax = Math.min(...b.red_flags.map((f) => rank[f.severity]));
      return aMax - bMax;
    });

  return (
    <div className="bg-inverse-surface -m-panel-padding p-panel-padding min-h-[calc(100vh-3.5rem)]">
      <h1 className="font-page-title text-page-title text-inverse-on-surface mb-space-lg">
        Triage Board — {withFlags.length} unacknowledged
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-space-md">
        {withFlags.map((token) => {
          const worst = token.red_flags.reduce((w, f) =>
            f.severity === "critical" ? f : w.severity === "critical" ? w : f,
          );
          return (
            <div
              key={token.visit_id}
              className={`rounded-xl p-panel-padding border-2 ${
                worst.severity === "critical" ? "border-error bg-error/10" : "border-uncertain bg-uncertain/10"
              }`}
            >
              <div className="flex items-center justify-between mb-space-sm">
                <span className="font-section-title text-section-title text-inverse-on-surface">
                  Token {token.token_no}
                </span>
                <StatusBadge tone={worst.severity === "critical" ? "critical" : "uncertain"} label={worst.severity.toUpperCase()} />
              </div>
              <p className="font-clinical-data-mono text-clinical-data-mono text-inverse-on-surface/70 mb-space-sm">
                {token.department} · waiting {Math.round(token.waiting_minutes)}m
              </p>
              <div className="flex flex-col gap-space-xs">
                {token.red_flags
                  .filter((f) => !f.acknowledged_by)
                  .map((f) => (
                    <p key={f.id} className="font-clinical-note text-clinical-note text-inverse-on-surface">
                      &ldquo;{f.quote}&rdquo;
                    </p>
                  ))}
              </div>
            </div>
          );
        })}
        {withFlags.length === 0 && (
          <p className="text-inverse-on-surface/70 font-clinical-data col-span-full">
            No unacknowledged red flags right now.
          </p>
        )}
      </div>
    </div>
  );
}
