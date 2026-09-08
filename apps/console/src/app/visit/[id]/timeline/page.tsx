import { getVisitTimeline } from "@/lib/visit-timeline";

export const dynamic = "force-dynamic";

const kindIcon: Record<string, string> = {
  visit: "event",
  prescription: "prescriptions",
  lab_report: "labs",
  symptom_onset: "warning",
};

export default async function TimelinePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getVisitTimeline(id);

  if ("error" in result) {
    return <p className="text-error font-clinical-data">Could not load the timeline: {result.error.message}</p>;
  }

  const sorted = [...result.data].sort(
    (a, b) => new Date(a.occurred_at).getTime() - new Date(b.occurred_at).getTime(),
  );

  return (
    <div>
      <h1 className="font-page-title text-page-title text-on-surface mb-space-md">Timeline</h1>
      <ol className="relative border-l border-outline-variant ml-space-sm">
        {sorted.map((event) => (
          <li key={event.event_id} className="mb-space-md ml-space-md">
            <span className="absolute -left-[9px] flex h-4 w-4 items-center justify-center rounded-full bg-primary-container">
              <span className="material-symbols-outlined text-[12px] text-on-primary-container">
                {kindIcon[event.kind] ?? "event"}
              </span>
            </span>
            <p className="font-clinical-data-mono text-clinical-data-mono text-on-surface-variant">
              {new Date(event.occurred_at).toLocaleString()}
            </p>
            <p className="font-clinical-data text-clinical-data text-on-surface">{event.summary}</p>
            {event.source_document_id && (
              <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                from document {event.source_document_id}
              </p>
            )}
          </li>
        ))}
        {sorted.length === 0 && (
          <p className="text-on-surface-variant font-clinical-data">No events recorded yet.</p>
        )}
      </ol>
    </div>
  );
}
