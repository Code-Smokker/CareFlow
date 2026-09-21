import { StatusBadge } from "@careflow/ui";
import { StepNav } from "./StepNav";
import { type AyurvedaRecord, type AyurvedaVocabulary } from "./labels";
import { loadAyurveda } from "./load";

/** Title, review-status banner and the left step navigation, around whichever step is open.
 * A shell component rather than a layout so each page knows its own active step. */
export async function AyurvedaShell({
  visitId,
  activeStepId,
  title,
  gloss,
  children,
}: {
  visitId: string;
  activeStepId: string;
  title: string;
  gloss: string;
  children: (data: { record: AyurvedaRecord; vocabulary: AyurvedaVocabulary }) => React.ReactNode;
}) {
  const data = await loadAyurveda(visitId);
  if (!data.ok) {
    return <p role="alert" className="text-error font-clinical-data p-panel-padding">Could not load the Ayurvedic case record: {data.message}</p>;
  }
  const { record, vocabulary } = data;

  return (
    <div>
      <div className="mb-space-md flex items-start justify-between gap-space-sm print:hidden">
        <div>
          <h1 className="font-page-title text-page-title text-on-surface">{vocabulary.title.label}</h1>
          <p className="font-clinical-note text-clinical-note text-on-surface-variant">{vocabulary.title.gloss}</p>
        </div>
        <div className="flex items-center gap-space-xs">
          {vocabulary.status !== "VERIFIED" && <StatusBadge tone="uncertain" label={`Vocabulary ${vocabulary.status}`} icon="rule" />}
          <StatusBadge tone={record.signed ? "good" : "neutral"} label={record.signed ? "Signed" : "Draft"} />
        </div>
      </div>
      {!record.ayush_mode && (
        <p className="mb-space-sm rounded-lg border border-outline-variant bg-surface-container-low px-space-sm py-space-xs font-metadata-micro text-metadata-micro text-on-surface-variant">
          This visit&apos;s department ({record.department ?? "none"}) is not configured for AYUSH intake, so Prashna will be mostly empty.
          You can still record the examination.
        </p>
      )}
      <div className="flex items-start gap-space-lg">
        <StepNav visitId={visitId} vocabulary={vocabulary} record={record} activeStepId={activeStepId} />
        <div className="min-w-0 flex-1">
          <h2 className="font-section-title text-section-title text-on-surface">{title}</h2>
          <p className="mb-space-md font-metadata-micro text-metadata-micro text-on-surface-variant">{gloss}</p>
          {children({ record, vocabulary })}
        </div>
      </div>
    </div>
  );
}
