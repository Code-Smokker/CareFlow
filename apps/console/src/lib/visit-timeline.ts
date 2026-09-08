import { createGatewayClient } from "@careflow/api-client";

type TimelineEvent = {
  event_id: string;
  occurred_at: string;
  kind: "visit" | "prescription" | "lab_report" | "symptom_onset";
  summary: string;
  source_document_id: string | null;
};

type TimelineResult =
  | { error: { code: string; message: string; details?: Record<string, unknown> | null }; status: number }
  | { data: TimelineEvent[] };

/** TimelineEvent is scoped to a session, not a visit — resolves visit -> session via
 * VisitSummary.session_id first. Shared by the /api/visits/[id]/timeline route handler and
 * the /visit/[id]/timeline Server Component so the two-hop lookup lives in one place. */
export async function getVisitTimeline(visitId: string): Promise<TimelineResult> {
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

  return { data: timeline.data };
}
