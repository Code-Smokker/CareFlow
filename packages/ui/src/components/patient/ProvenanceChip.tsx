"use client";

import type { InputMode } from "../../tokens";

/** Mono, 11px: "voice" / "tapped" / "low confidence" (uncertain colour) — docs/16. Used on the
 * read-back screen, one per answered line. */
export interface ProvenanceChipProps {
  source: InputMode;
  confidence: number;
  lowConfidenceThreshold?: number;
}

const SOURCE_LABEL: Record<InputMode, string> = {
  voice: "voice",
  tap: "tapped",
  bodymap: "tapped on body",
  proxy: "answered for patient",
  ocr: "from document",
};

export function ProvenanceChip({ source, confidence, lowConfidenceThreshold = 0.6 }: ProvenanceChipProps) {
  const lowConfidence = confidence < lowConfidenceThreshold;
  return (
    <span
      className={`rounded-full px-cf-2 py-[2px] font-mono text-[11px] font-bold uppercase tracking-wide ${
        lowConfidence ? "bg-uncertain-soft text-uncertain" : "bg-accent-soft text-accent-deep"
      }`}
    >
      {lowConfidence ? "unclear — please check" : SOURCE_LABEL[source]}
    </span>
  );
}
