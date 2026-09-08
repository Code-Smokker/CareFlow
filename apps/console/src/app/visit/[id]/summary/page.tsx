import Link from "next/link";
import { createGatewayClient } from "@careflow/api-client";
import { ProvenanceBadge } from "@careflow/ui";

export const dynamic = "force-dynamic";

/** The clinician summary reads as a clinical note, not an app screen — serif type, prose
 * layout, one field per line — docs/16-design-system.md. */
export default async function SummaryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gateway = createGatewayClient();
  const { data: summary, error } = await gateway.GET("/v1/visits/{id}/summary", {
    params: { path: { id } },
  });

  if (error) {
    return <p className="text-error font-clinical-data">Could not load this visit: {error.error.message}</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-space-md print:hidden">
        <h1 className="font-page-title text-page-title text-on-surface">Clinical Summary</h1>
        <Link href={`/visit/${id}/summary/print`} className="font-clinical-data text-primary underline">
          Print version
        </Link>
      </div>

      <div className="max-w-2xl bg-surface-container-lowest rounded-lg p-panel-padding border border-outline-variant">
        {summary.fields.map((field) => (
          <p key={field.field_path} className="font-clinical-note text-clinical-note text-on-surface mb-space-sm">
            <span className="font-body-strong text-body-strong">
              {(field.field_path.split(".").slice(1).join(" ") || field.field_path).replace(/_/g, " ")}:
            </span>{" "}
            {typeof field.value === "object" ? JSON.stringify(field.value) : String(field.value)}{" "}
            <ProvenanceBadge source={field.source} confidence={field.confidence} physicianEdited={field.physician_edited} />
          </p>
        ))}
        {summary.fields.length === 0 && (
          <p className="font-clinical-note text-clinical-note text-on-surface-variant">
            No structured history recorded yet for this visit.
          </p>
        )}
      </div>

      <p className="mt-space-sm font-metadata-micro text-metadata-micro text-on-surface-variant print:hidden">
        {summary.signed ? "Physician-signed." : "Draft — not yet signed."} This is not a diagnosis; it is
        structured history for the physician to review.
      </p>
    </div>
  );
}
