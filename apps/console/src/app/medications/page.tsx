import Link from "next/link";
import { createGatewayClient } from "@careflow/api-client";
import { DemoDataBadge } from "@careflow/ui";
import { getVisitDocuments } from "@/lib/visit-documents";

export const dynamic = "force-dynamic";

const MED_FIELD_HINTS = ["drug", "medication", "dose", "rx", "brand"];

export default async function MedicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ visitId?: string }>;
}) {
  const { visitId } = await searchParams;

  if (!visitId) {
    const gateway = createGatewayClient();
    const { data } = await gateway.GET("/v1/visits/queue");
    return (
      <div>
        <h1 className="font-page-title text-page-title text-on-surface mb-space-sm">Medications</h1>
        <p className="font-clinical-data text-on-surface-variant mb-space-md">
          Pick a visit — medications are extracted from that visit&apos;s uploaded documents.
        </p>
        <div className="flex flex-col gap-1">
          {(data ?? []).map((t) => (
            <Link
              key={t.visit_id}
              href={`/medications?visitId=${t.visit_id}`}
              className="px-space-md py-space-sm rounded-lg bg-surface-container-lowest hover:bg-surface-container-low font-clinical-data text-on-surface"
            >
              Token {t.token_no} · {t.department}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const result = await getVisitDocuments(visitId);
  if ("error" in result) {
    return <p className="text-error font-clinical-data">Could not load medications: {result.error.message}</p>;
  }

  const medicationExtractions = result.data.flatMap((doc) =>
    doc.extractions
      .filter((ex) => MED_FIELD_HINTS.some((hint) => ex.field.toLowerCase().includes(hint)))
      .map((ex) => ({ ...ex, document_id: doc.document_id })),
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-space-sm">
        <h1 className="font-page-title text-page-title text-on-surface">Medications — visit {visitId}</h1>
        <DemoDataBadge reason="Confirmation shortlist (CLAUDE.md rule 5: needs_confirmation, dictionary_matches, matched_dictionary, and per-medication NAMASTE/ICD-11 dual coding) is not yet exposed by the gateway's Extraction schema — only field/value/confidence are. See docs/19-frontend-status.md." />
      </div>

      <div className="flex flex-col gap-space-sm">
        {medicationExtractions.map((ex, i) => (
          <div key={i} className="rounded-lg border border-outline-variant bg-surface-container-lowest p-panel-padding flex items-center justify-between">
            <div>
              <p className="font-clinical-data text-clinical-data text-on-surface">{ex.value}</p>
              <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                {ex.field} · from document {ex.document_id}
              </p>
            </div>
            <span className="font-clinical-data-mono text-clinical-data-mono text-on-surface-variant">
              {Math.round(ex.confidence * 100)}% confidence
            </span>
          </div>
        ))}
        {medicationExtractions.length === 0 && (
          <p className="text-on-surface-variant font-clinical-data">
            No medication-like extractions found for this visit&apos;s documents.
          </p>
        )}
      </div>
    </div>
  );
}
