import { ProvenanceBadge } from "@careflow/ui";
import type { AyurvedaRecord } from "./labels";
import { PrakritiScorePanel } from "./PrakritiScorePanel";

/** Step 1 — everything the patient reported at intake, read-only. Nothing here is editable:
 * no input, no button. Every answer carries its provenance chip; a low-confidence value is
 * demoted (uncertain tone), never hidden (CLAUDE.md rule 4). */
export function PrashnaView({ record }: { record: AyurvedaRecord }) {
  const { prashna } = record;
  return (
    <div className="flex flex-col gap-space-md">
      <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
        {prashna.answered} of {prashna.total} questions answered. Chips show how each answer was given: <b>voice</b>,
        <b> tap</b>, or <b>proxy</b> (answered by an attendant on the patient&apos;s behalf), with confidence.
      </p>

      {prashna.groups.map((group) => (
        <section key={group.id} aria-labelledby={`prashna-${group.id}`} className="rounded-lg border border-outline-variant bg-surface-container-lowest">
          <div className="px-space-sm py-space-xs border-b border-outline-variant">
            <h2 id={`prashna-${group.id}`} className="font-body-strong text-body-strong text-on-surface">{group.label}</h2>
            <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">{group.gloss}</p>
          </div>
          {group.items.length === 0 ? (
            <p className="px-space-sm py-space-sm font-clinical-data text-clinical-data text-on-surface-variant">Not answered by the patient.</p>
          ) : (
            <dl>
              {group.items.map((item) => {
                const low = item.confidence < 0.6;
                return (
                  <div
                    key={item.slot_id}
                    className={`flex items-start justify-between gap-space-sm px-space-sm py-space-xs ${low ? "bg-uncertain-container/20" : ""}`}
                  >
                    <div className="min-w-0">
                      <dt className="font-metadata-micro text-metadata-micro text-on-surface-variant">{item.question}</dt>
                      <dd className="font-clinical-note text-clinical-note text-on-surface">{item.value_label}</dd>
                    </div>
                    <ProvenanceBadge source={item.source} confidence={item.confidence} />
                  </div>
                );
              })}
            </dl>
          )}
        </section>
      ))}

      {prashna.prakriti_score ? (
        <PrakritiScorePanel score={prashna.prakriti_score} />
      ) : (
        <p className="font-clinical-data text-clinical-data text-on-surface-variant">No Prakriti questionnaire answers to score.</p>
      )}
    </div>
  );
}
