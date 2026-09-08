import Link from "next/link";
import { createGatewayClient } from "@careflow/api-client";
import { StatusBadge } from "@careflow/ui";
import { AcknowledgeButton } from "./AcknowledgeButton";

export const dynamic = "force-dynamic";

const priorityTone: Record<string, "critical" | "uncertain" | "neutral"> = {
  urgent: "critical",
  priority: "uncertain",
  routine: "neutral",
};

export default async function QueuePage() {
  const gateway = createGatewayClient();
  const { data, error } = await gateway.GET("/v1/visits/queue");

  if (error) {
    return (
      <div className="p-panel-padding">
        <h1 className="font-page-title text-page-title text-on-surface">OPD Queue</h1>
        <p className="mt-space-sm text-clinical-data text-error">
          Could not reach the gateway: {error.error.message ?? "unknown error"}. Is it running on{" "}
          <code>GATEWAY_URL</code>?
        </p>
      </div>
    );
  }

  const tokens = data ?? [];
  const withFlags = tokens.filter((t) => t.red_flags.length > 0);
  const rest = tokens.filter((t) => t.red_flags.length === 0);

  return (
    <div className="p-panel-padding">
      <div className="flex items-baseline justify-between mb-space-md">
        <h1 className="font-page-title text-page-title text-on-surface">OPD Queue</h1>
        <span className="font-clinical-data-mono text-clinical-data-mono text-on-surface-variant">
          {tokens.length} waiting
        </span>
      </div>

      {withFlags.length > 0 && (
        <section className="mb-space-lg">
          <h2 className="font-section-title text-section-title text-error mb-space-sm">
            Red flags — {withFlags.length}
          </h2>
          <div className="flex flex-col gap-space-sm">
            {withFlags.map((token) => (
              <div
                key={token.visit_id}
                className="border border-error-container bg-error-container/20 rounded-xl p-panel-padding"
              >
                <div className="flex items-center justify-between">
                  <Link
                    href={`/visit/${token.visit_id}`}
                    className="font-body-strong text-body-strong text-on-surface hover:underline"
                  >
                    Token {token.token_no} · {token.department}
                  </Link>
                  <StatusBadge tone={priorityTone[token.priority]} label={token.priority.toUpperCase()} />
                </div>
                <div className="mt-space-xs font-clinical-data-mono text-clinical-data-mono text-on-surface-variant">
                  Waiting {Math.round(token.waiting_minutes)}m · patient {token.patient_id}
                </div>
                <div className="mt-space-sm flex flex-col gap-space-xs">
                  {token.red_flags.map((flag) => (
                    <div
                      key={flag.id}
                      className="flex items-start justify-between gap-space-sm bg-surface-container-lowest rounded-lg p-space-sm"
                    >
                      <div>
                        <StatusBadge
                          tone={flag.severity === "critical" ? "critical" : flag.severity === "warning" ? "uncertain" : "neutral"}
                          label={flag.severity.toUpperCase()}
                        />
                        <p className="mt-space-xs font-clinical-note text-clinical-note text-on-surface">
                          &ldquo;{flag.quote}&rdquo;
                        </p>
                        <p className="mt-1 font-metadata-micro text-metadata-micro text-on-surface-variant">
                          {flag.rule_id}
                          {flag.acknowledged_by && ` · acknowledged by ${flag.acknowledged_by}`}
                        </p>
                      </div>
                      {!flag.acknowledged_by && <AcknowledgeButton redFlagId={flag.id} />}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-section-title text-section-title text-on-surface mb-space-sm">
          Waiting — {rest.length}
        </h2>
        <div className="flex flex-col gap-1">
          {rest.map((token) => (
            <Link
              key={token.visit_id}
              href={`/visit/${token.visit_id}`}
              className="flex items-center justify-between px-space-md py-space-sm rounded-lg bg-surface-container-lowest hover:bg-surface-container-low transition-colors"
            >
              <span className="font-clinical-data text-clinical-data text-on-surface">
                Token {token.token_no} · {token.department}
              </span>
              <span className="flex items-center gap-space-sm">
                <StatusBadge tone={priorityTone[token.priority]} label={token.priority.toUpperCase()} />
                <span className="font-clinical-data-mono text-clinical-data-mono text-on-surface-variant">
                  {Math.round(token.waiting_minutes)}m
                </span>
              </span>
            </Link>
          ))}
          {rest.length === 0 && withFlags.length === 0 && (
            <p className="text-clinical-data text-on-surface-variant py-space-md">Queue is empty.</p>
          )}
        </div>
      </section>
    </div>
  );
}
