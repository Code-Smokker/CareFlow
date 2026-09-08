import { createGatewayClient } from "@careflow/api-client";
import { ProvenanceBadge, StatusBadge } from "@careflow/ui";

export const dynamic = "force-dynamic";

/** field_path values are dotted, e.g. "history.onset" or "demographics.name" — this is the
 * one place that grouping convention is interpreted, so a new ontology module doesn't need a
 * matching UI change: unknown prefixes fall into "Other". */
function groupLabel(fieldPath: string): string {
  const section = fieldPath.split(".")[0];
  const labels: Record<string, string> = {
    chief_complaint: "Chief Complaint",
    demographics: "Demographics",
    history_of_present_illness: "History of Presenting Complaint",
    red_flags: "Red Flags",
    medications: "Medications",
    allergies: "Allergies",
    vitals: "Vitals",
    ayush: "AYUSH / Prakriti",
  };
  return labels[section] ?? "Other";
}

export default async function DossierPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gateway = createGatewayClient();
  const { data: summary, error } = await gateway.GET("/v1/visits/{id}/summary", {
    params: { path: { id } },
  });

  if (error) {
    return <p className="text-error font-clinical-data p-panel-padding">Could not load this visit: {error.error.message}</p>;
  }

  const groups = new Map<string, typeof summary.fields>();
  for (const field of summary.fields) {
    const key = groupLabel(field.field_path);
    groups.set(key, [...(groups.get(key) ?? []), field]);
  }

  return (
    <div>
      {summary.red_flags.length > 0 && (
        <div className="mb-space-md flex flex-col gap-space-xs">
          {summary.red_flags.map((flag) => (
            <div key={flag.id} className="flex items-center gap-space-sm bg-error-container/30 border border-error-container rounded-lg px-space-md py-space-sm">
              <StatusBadge tone="critical" label={flag.severity.toUpperCase()} />
              <span className="font-clinical-note text-clinical-note text-on-surface">&ldquo;{flag.quote}&rdquo;</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-space-lg">
        {Array.from(groups.entries()).map(([group, fields]) => (
          <section key={group}>
            <h2 className="font-section-title text-section-title text-on-surface mb-space-sm">{group}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
              {fields.map((field) => (
                <div
                  key={field.field_path}
                  className={`rounded-lg border p-space-sm ${
                    field.low_confidence && !field.physician_edited
                      ? "border-uncertain-container bg-uncertain-container/20"
                      : "border-outline-variant bg-surface-container-lowest"
                  }`}
                >
                  <div className="flex items-start justify-between gap-space-sm">
                    <span className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase tracking-wide">
                      {(field.field_path.split(".").slice(1).join(" ") || field.field_path).replace(/_/g, " ")}
                    </span>
                    <ProvenanceBadge
                      source={field.source}
                      confidence={field.confidence}
                      physicianEdited={field.physician_edited}
                    />
                  </div>
                  <p className="mt-1 font-clinical-data text-clinical-data text-on-surface">
                    {typeof field.value === "object" ? JSON.stringify(field.value) : String(field.value)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}
        {summary.fields.length === 0 && (
          <p className="text-on-surface-variant font-clinical-data">No slots filled yet for this visit.</p>
        )}
      </div>
    </div>
  );
}
