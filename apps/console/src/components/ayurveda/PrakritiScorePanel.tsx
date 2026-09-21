import type { PrakritiScore } from "./labels";

/** The patient's Prakriti questionnaire answers counted per dosha — REFERENCE only. There is no
 * "dominant dosha" here on purpose: CareFlow never asserts a constitution, the Vaidya decides. */
export function PrakritiScorePanel({ score, compact = false }: { score: PrakritiScore; compact?: boolean }) {
  return (
    <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-space-sm">
      <p className="font-body-strong text-body-strong text-on-surface">{score.label}</p>
      <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">{score.gloss}</p>
      <ul className="mt-space-xs flex flex-col gap-1" aria-label="Questionnaire answers per dosha">
        {score.counts.map((c) => (
          <li key={c.dosha} className="flex items-center gap-space-sm font-clinical-data text-clinical-data text-on-surface">
            <span className="w-14">{c.label}</span>
            <span className="h-2 flex-1 rounded-full bg-surface-container" aria-hidden="true">
              <span
                className="block h-2 rounded-full bg-primary"
                style={{ width: `${score.total === 0 ? 0 : (c.count / score.total) * 100}%` }}
              />
            </span>
            <span className="w-12 text-right font-clinical-data-mono text-clinical-data-mono">
              {c.count}/{score.total}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-space-xs font-metadata-micro text-metadata-micro text-on-surface-variant">
        {score.answered} of {score.total} questions answered. Reference only — the Vaidya decides Prakriti.
      </p>
      {!compact && <p className="mt-1 font-metadata-micro text-metadata-micro text-uncertain">{score.caveat}</p>}
    </div>
  );
}
