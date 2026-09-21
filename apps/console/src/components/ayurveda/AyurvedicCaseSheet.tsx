import { ProvenanceBadge, StatusBadge } from "@careflow/ui";
import { type AyurvedicSection } from "./labels";
import { VaidyaChip } from "./VaidyaChip";

type Row = AyurvedicSection["rows"][number];

function Provenance({ row }: { row: Row }) {
  if (row.source === "clinician") return <VaidyaChip disposition={row.disposition} />;
  if (row.source === "computed") return <StatusBadge tone="neutral" label="Calculated" icon="calculate" />;
  return <ProvenanceBadge source={row.source} confidence={row.confidence ?? 1} />;
}

/** The Ayurvedic case sheet in PS order. Shared by the clinician Summary page and Step 6 — the
 * same rows the gateway prints on the A4 view. A Vaidya override shows the patient's original
 * on the same row; both stay visible. Empty for a visit with no Ayurvedic data. */
export function AyurvedicCaseSheet({ sections, reviewStatus }: { sections: AyurvedicSection[]; reviewStatus?: string }) {
  if (sections.length === 0) return null;
  return (
    <section aria-labelledby="ayurvedic-case-sheet" className="mt-space-lg">
      <h2 id="ayurvedic-case-sheet" className="font-section-title text-section-title text-on-surface">
        Ayurvediya Rugna Pariksha
      </h2>
      <p className="font-metadata-micro text-metadata-micro text-on-surface-variant mb-space-sm">Ayurvedic Case Record</p>
      {reviewStatus && reviewStatus !== "VERIFIED" && (
        <p className="mb-space-sm rounded-lg border border-uncertain-container bg-uncertain-container/20 px-space-sm py-space-xs font-metadata-micro text-metadata-micro text-on-surface">
          Vocabulary status: <b>{reviewStatus}</b> — terms, option lists and age cut-offs are not yet verified by an
          Ayurveda practitioner.
        </p>
      )}
      <div className="flex flex-col gap-space-md">
        {sections.map((section) => {
          let lastGroup: string | null | undefined;
          return (
            <div key={section.id} className="rounded-lg border border-outline-variant bg-surface-container-lowest">
              <div className="px-space-sm py-space-xs border-b border-outline-variant">
                <h3 className="font-body-strong text-body-strong text-on-surface">{section.label}</h3>
                <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">{section.gloss}</p>
              </div>
              {section.rows.length === 0 ? (
                <p className="px-space-sm py-space-sm font-clinical-data text-clinical-data text-on-surface-variant">Not recorded.</p>
              ) : (
                <dl>
                  {section.rows.map((row, i) => {
                    const heading = row.group && row.group !== lastGroup ? row.group : null;
                    lastGroup = row.group;
                    return (
                      <div key={`${row.group}-${row.label}-${i}`}>
                        {heading && (
                          <dt className="px-space-sm pt-space-sm font-metadata-micro text-metadata-micro uppercase tracking-wide text-on-surface-variant">
                            {heading}
                          </dt>
                        )}
                        <dd className="flex items-start justify-between gap-space-sm px-space-sm py-space-xs">
                          <span className="min-w-0">
                            <span className="font-clinical-note text-clinical-note text-on-surface">
                              <span className="font-body-strong text-body-strong">{row.label}:</span> {row.value_label}
                            </span>
                            {row.original && (
                              <span className="mt-0.5 flex items-center gap-1 font-metadata-micro text-metadata-micro text-on-surface-variant">
                                {row.disposition === "confirmed" ? "Confirms" : "Overrides"} patient-reported: {row.original.value_label}
                                <ProvenanceBadge source={row.original.source} confidence={row.original.confidence} />
                              </span>
                            )}
                          </span>
                          <Provenance row={row} />
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
