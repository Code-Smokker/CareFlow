import { createGatewayClient } from "@careflow/api-client";
import { StatusBadge } from "@careflow/ui";

export const dynamic = "force-dynamic";

/** Rebuilt from real data — GET /v1/audit-log, added contracts-first
 * (packages/contracts/openapi/gateway.yaml) specifically for this screen. The append-only
 * property is verified live, on every request, by querying pg_trigger — not asserted. */
export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<{ cursor?: string; resource?: string; action?: string }>;
}) {
  const { cursor, resource, action } = await searchParams;
  const gateway = createGatewayClient();
  const { data, error } = await gateway.GET("/v1/audit-log", {
    params: { query: { limit: 50, cursor, resource, action } },
  });

  if (error) {
    return <p className="text-error font-clinical-data p-panel-padding">Could not load the audit log: {error.error.message}</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-space-sm">
        <h1 className="font-page-title text-page-title text-on-surface">Audit Log</h1>
        <StatusBadge
          tone={data.integrity.enforced ? "good" : "critical"}
          icon="lock"
          label={data.integrity.enforced ? "Append-only enforced" : "INTEGRITY CHECK FAILED"}
        />
      </div>
      <p className="font-clinical-data text-on-surface-variant mb-space-md">
        Verified live, this request, by querying <code>pg_trigger</code> — not a stored claim.
        {" "}
        {data.integrity.triggers.map((t) => (
          <span key={t.name} className="font-clinical-data-mono text-clinical-data-mono mr-space-sm">
            {t.name}: {t.enabled ? "enabled" : "disabled"}
          </span>
        ))}
      </p>

      <div className="flex flex-col gap-1">
        {data.entries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between px-space-md py-space-sm rounded-lg bg-surface-container-lowest border border-outline-variant"
          >
            <div className="flex items-center gap-space-sm">
              <span className="font-clinical-data-mono text-clinical-data-mono text-on-surface-variant">
                {new Date(entry.at).toLocaleString()}
              </span>
              <span className="font-clinical-data text-clinical-data text-on-surface">{entry.action}</span>
              <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                {entry.resource}
                {entry.resource_id ? ` #${entry.resource_id.slice(0, 8)}` : ""}
              </span>
            </div>
            <span className="font-clinical-data-mono text-clinical-data-mono text-on-surface-variant">
              {entry.actor_role ?? "system"}
              {entry.actor_id ? ` (${entry.actor_id})` : ""}
            </span>
          </div>
        ))}
        {data.entries.length === 0 && (
          <p className="text-on-surface-variant font-clinical-data">No audit events yet.</p>
        )}
      </div>

      {data.next_cursor && (
        <a
          href={`/audit?cursor=${data.next_cursor}${resource ? `&resource=${resource}` : ""}${action ? `&action=${action}` : ""}`}
          className="mt-space-md inline-block font-clinical-data text-primary underline"
        >
          Older entries →
        </a>
      )}
    </div>
  );
}
