import { createGatewayClient } from "@careflow/api-client";
import { StatusBadge } from "@careflow/ui";

export const dynamic = "force-dynamic";

const CAPABILITY_LABEL: Record<string, string> = {
  "llm.fill_slot": "LLM · slot filling",
  "asr.transcribe": "Speech-to-text",
  "tts.synthesise": "Text-to-speech",
  "docai.ocr": "Document OCR",
};

/** Rebuilt from real data — GET /v1/integration-events, backed by a new provider_cascade_event
 * table written directly from services/ai's and services/docai's cascade() helper (the single
 * call site every hosted->local fallback goes through, docs/15-ai-stack.md). This is CLAUDE.md
 * rule 9 as something that happened, not an eval-report claim. */
export default async function IntegrationsPage({
  searchParams,
}: {
  searchParams: Promise<{ cursor?: string; outcome?: "success" | "failure"; capability?: string }>;
}) {
  const { cursor, outcome, capability } = await searchParams;
  const gateway = createGatewayClient();
  const { data, error } = await gateway.GET("/v1/integration-events", {
    params: { query: { limit: 50, cursor, outcome, capability } },
  });

  if (error) {
    return <p className="text-error font-clinical-data p-panel-padding">Could not load integration events: {error.error.message}</p>;
  }

  return (
    <div>
      <h1 className="font-page-title text-page-title text-on-surface mb-space-xs">Integration Logs</h1>
      <p className="font-clinical-data text-on-surface-variant mb-space-md">
        Every provider tier attempted, hosted first — a failure here is the fallback working,
        not an outage.
      </p>

      <div className="flex flex-col gap-1">
        {data.entries.map((entry) => (
          <div
            key={entry.id}
            className={`flex items-center justify-between px-space-md py-space-sm rounded-lg border ${
              entry.outcome === "failure"
                ? "bg-uncertain-container/20 border-uncertain-container"
                : "bg-surface-container-lowest border-outline-variant"
            }`}
          >
            <div className="flex items-center gap-space-sm">
              <span className="font-clinical-data-mono text-clinical-data-mono text-on-surface-variant">
                {new Date(entry.at).toLocaleString()}
              </span>
              <span className="font-clinical-data text-clinical-data text-on-surface">
                {CAPABILITY_LABEL[entry.capability] ?? entry.capability}
              </span>
              <StatusBadge
                tone={entry.outcome === "success" ? "good" : "uncertain"}
                label={`${entry.provider} · ${entry.outcome}`}
              />
              {entry.error && (
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">{entry.error}</span>
              )}
            </div>
            <span className="font-clinical-data-mono text-clinical-data-mono text-on-surface-variant">
              {entry.latency_ms}ms
            </span>
          </div>
        ))}
        {data.entries.length === 0 && (
          <p className="text-on-surface-variant font-clinical-data">
            No provider cascade events recorded yet — run an intake turn (voice transcription,
            slot filling, or a document upload) to generate one.
          </p>
        )}
      </div>

      {data.next_cursor && (
        <a
          href={`/integrations?cursor=${data.next_cursor}${outcome ? `&outcome=${outcome}` : ""}${capability ? `&capability=${capability}` : ""}`}
          className="mt-space-md inline-block font-clinical-data text-primary underline"
        >
          Older events →
        </a>
      )}
    </div>
  );
}
