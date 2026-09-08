import Link from "next/link";
import { createGatewayClient } from "@careflow/api-client";
import { StatusBadge } from "@careflow/ui";
import { getVisitDocuments } from "@/lib/visit-documents";

export const dynamic = "force-dynamic";

/** Documents are inherently visit-scoped in the real data model (there is no cross-visit
 * "all documents" endpoint) — this route takes ?visitId= from the queue picker below rather
 * than inventing an aggregate endpoint the backend doesn't have. */
export default async function DocumentsPage({
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
        <h1 className="font-page-title text-page-title text-on-surface mb-space-sm">Documents</h1>
        <p className="font-clinical-data text-on-surface-variant mb-space-md">
          Pick a visit — documents are scoped to a session, there is no cross-patient document list.
        </p>
        <div className="flex flex-col gap-1">
          {(data ?? []).map((t) => (
            <Link
              key={t.visit_id}
              href={`/documents?visitId=${t.visit_id}`}
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
    return <p className="text-error font-clinical-data">Could not load documents: {result.error.message}</p>;
  }

  return (
    <div>
      <h1 className="font-page-title text-page-title text-on-surface mb-space-md">
        Documents — visit {visitId}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
        {result.data.map((doc) => (
          <div key={doc.document_id} className="rounded-lg border border-outline-variant p-panel-padding bg-surface-container-lowest">
            <div className="flex items-center justify-between mb-space-sm">
              <span className="font-clinical-data-mono text-clinical-data-mono text-on-surface-variant">
                {doc.document_id}
              </span>
              <StatusBadge
                tone={doc.status === "done" ? "good" : doc.status === "failed" ? "critical" : "neutral"}
                label={doc.status.toUpperCase()}
              />
            </div>
            {doc.quality_score !== null && (
              <p className="font-clinical-data text-clinical-data text-on-surface-variant mb-space-xs">
                Scan quality: {Math.round(doc.quality_score * 100)}%
              </p>
            )}
            <div className="flex flex-col gap-1">
              {doc.extractions.map((ex, i) => (
                <div key={i} className="flex items-center justify-between text-clinical-data font-clinical-data">
                  <span className="text-on-surface">{ex.field}</span>
                  <span className="text-on-surface-variant font-clinical-data-mono text-clinical-data-mono">
                    {ex.value} · {Math.round(ex.confidence * 100)}%
                  </span>
                </div>
              ))}
              {doc.extractions.length === 0 && (
                <p className="text-metadata-micro font-metadata-micro text-on-surface-variant">
                  Still processing, or no extractions yet.
                </p>
              )}
            </div>
          </div>
        ))}
        {result.data.length === 0 && (
          <p className="text-on-surface-variant font-clinical-data">No documents uploaded for this visit.</p>
        )}
      </div>
    </div>
  );
}
