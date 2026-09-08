import { createGatewayClient, type GatewayComponents } from "@careflow/api-client";

type DocumentStatus = GatewayComponents["schemas"]["DocumentStatus"];

/** There is no "list documents for a visit/session" endpoint — /v1/sessions/{id}/documents is
 * upload-only. Documents are discovered via the session timeline's source_document_id, then
 * fetched individually by GET /v1/documents/{id}. Shared by the visits/[id]/documents route
 * handler and the /documents page. */
type DocumentsResult =
  | { error: { code: string; message: string; details?: Record<string, unknown> | null }; status: number }
  | { data: Array<{ document_id: string } & DocumentStatus> };

export async function getVisitDocuments(visitId: string): Promise<DocumentsResult> {
  const gateway = createGatewayClient();

  const summary = await gateway.GET("/v1/visits/{id}/summary", { params: { path: { id: visitId } } });
  if (summary.error) {
    return { error: summary.error.error, status: summary.response.status };
  }

  const timeline = await gateway.GET("/v1/sessions/{id}/timeline", {
    params: { path: { id: summary.data.session_id } },
  });
  if (timeline.error) {
    return { error: timeline.error.error, status: timeline.response.status };
  }

  const documentIds = Array.from(
    new Set(
      timeline.data
        .map((event) => event.source_document_id)
        .filter((docId): docId is string => Boolean(docId)),
    ),
  );

  const documents = await Promise.all(
    documentIds.map(async (docId) => {
      const doc = await gateway.GET("/v1/documents/{id}", { params: { path: { id: docId } } });
      return doc.error ? null : { document_id: docId, ...doc.data };
    }),
  );

  return { data: documents.filter((d): d is NonNullable<typeof d> => d !== null) };
}
