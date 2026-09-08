/**
 * Renders CLAUDE.md rule 4: every stored fact carries provenance and confidence. Low-confidence
 * values are demoted (uncertain tone), never hidden and never silently guessed — this component
 * is the one place that decision is made, so no screen can quietly drop it.
 */
import { inputModeIcon, type InputMode } from "../tokens";

export interface ProvenanceBadgeProps {
  source: InputMode;
  confidence: number;
  /** True once a physician has confirmed/edited the value — de-escalates the uncertain tone. */
  physicianEdited?: boolean;
  /** Below this, the badge switches to the uncertain tone. Matches SummaryField.low_confidence intent. */
  lowConfidenceThreshold?: number;
}

export function ProvenanceBadge({
  source,
  confidence,
  physicianEdited = false,
  lowConfidenceThreshold = 0.6,
}: ProvenanceBadgeProps) {
  const isLowConfidence = !physicianEdited && confidence < lowConfidenceThreshold;
  const tone = isLowConfidence
    ? "bg-uncertain-container text-on-uncertain-container"
    : "bg-surface-container text-on-surface-variant";

  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm font-clinical-data-mono text-[10px] font-medium leading-none ${tone}`}
      title={`Source: ${source} · Confidence: ${Math.round(confidence * 100)}%${physicianEdited ? " · Physician-confirmed" : ""}`}
    >
      <span className="material-symbols-outlined text-[12px] leading-none" aria-hidden="true">
        {physicianEdited ? "verified" : inputModeIcon[source]}
      </span>
      <span className="capitalize">{source}</span>
      <span aria-hidden="true">·</span>
      <span>{Math.round(confidence * 100)}%</span>
      {isLowConfidence && <span className="sr-only">low confidence, needs confirmation</span>}
    </span>
  );
}
