import Link from "next/link";
import { createGatewayClient } from "@careflow/api-client";
import { StatusBadge } from "@careflow/ui";

export const dynamic = "force-dynamic";

export default async function VisitOverviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gateway = createGatewayClient();
  const { data: summary, error } = await gateway.GET("/v1/visits/{id}/summary", {
    params: { path: { id } },
  });

  if (error) {
    return <p className="text-error font-clinical-data p-panel-padding">Could not load this visit: {error.error.message}</p>;
  }

  const nameField = summary.fields.find((f) => f.field_path === "demographics.name");
  const complaintField = summary.fields.find((f) => f.field_path === "chief_complaint");
  const unresolvedFlags = summary.red_flags.filter((f) => !f.acknowledged_by);

  return (
    <div>
      <div className="flex items-start justify-between mb-space-lg">
        <div>
          <h1 className="font-page-title text-page-title text-on-surface">
            {nameField ? String(nameField.value) : `Visit ${summary.visit_id}`}
          </h1>
          {complaintField && (
            <p className="mt-1 font-clinical-note text-clinical-note text-on-surface-variant">
              {String(complaintField.value)}
            </p>
          )}
        </div>
        <StatusBadge
          tone={summary.signed ? "good" : "neutral"}
          label={summary.signed ? "Signed" : "Draft"}
        />
      </div>

      {unresolvedFlags.length > 0 && (
        <div className="mb-space-lg flex flex-col gap-space-xs">
          {unresolvedFlags.map((flag) => (
            <div key={flag.id} className="flex items-center gap-space-sm bg-error-container/30 border border-error-container rounded-lg px-space-md py-space-sm">
              <StatusBadge tone="critical" label={flag.severity.toUpperCase()} />
              <span className="font-clinical-note text-clinical-note text-on-surface">&ldquo;{flag.quote}&rdquo;</span>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-space-sm">
        <Link href={`/visit/${id}/dossier`} className="rounded-lg border border-outline-variant p-panel-padding hover:bg-surface-container-low">
          <span className="material-symbols-outlined text-primary">fact_check</span>
          <p className="mt-1 font-body-strong text-body-strong text-on-surface">Dossier</p>
          <p className="font-clinical-data-mono text-clinical-data-mono text-on-surface-variant">{summary.fields.length} slots</p>
        </Link>
        <Link href={`/visit/${id}/timeline`} className="rounded-lg border border-outline-variant p-panel-padding hover:bg-surface-container-low">
          <span className="material-symbols-outlined text-primary">timeline</span>
          <p className="mt-1 font-body-strong text-body-strong text-on-surface">Timeline</p>
        </Link>
        <Link href={`/visit/${id}/summary`} className="rounded-lg border border-outline-variant p-panel-padding hover:bg-surface-container-low">
          <span className="material-symbols-outlined text-primary">description</span>
          <p className="mt-1 font-body-strong text-body-strong text-on-surface">Summary</p>
        </Link>
        <Link href={`/visit/${id}/sign`} className="rounded-lg border border-outline-variant p-panel-padding hover:bg-surface-container-low">
          <span className="material-symbols-outlined text-primary">edit_document</span>
          <p className="mt-1 font-body-strong text-body-strong text-on-surface">Sign</p>
        </Link>
      </div>
    </div>
  );
}
