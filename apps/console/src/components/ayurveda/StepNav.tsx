import Link from "next/link";
import { type AyurvedaRecord, type AyurvedaVocabulary, stepSlug } from "./labels";

const STATUS: Record<string, { icon: string; label: string; tone: string }> = {
  complete: { icon: "check_circle", label: "Complete", tone: "text-primary" },
  in_progress: { icon: "timelapse", label: "In progress", tone: "text-uncertain" },
  not_started: { icon: "radio_button_unchecked", label: "Not started", tone: "text-on-surface-variant" },
};

/** Left-hand step navigation, in the order the problem statement fixes. Each step carries a
 * completion indicator that is icon + text + count, never colour alone. */
export function StepNav({
  visitId,
  vocabulary,
  record,
  activeStepId,
}: {
  visitId: string;
  vocabulary: AyurvedaVocabulary;
  record: AyurvedaRecord;
  activeStepId: string;
}) {
  const steps = [
    { id: "prashna", label: vocabulary.prashna.label, gloss: vocabulary.prashna.gloss },
    ...vocabulary.steps.map((s) => ({ id: s.id, label: s.label, gloss: s.gloss })),
    { id: vocabulary.summary_step.id, label: vocabulary.summary_step.label, gloss: vocabulary.summary_step.gloss },
  ];
  const completion = new Map(record.completion.map((c) => [c.step_id, c]));

  return (
    <nav aria-label="Ayurvedic case record steps" className="w-64 shrink-0 print:hidden">
      <ol className="flex flex-col gap-space-xs">
        {steps.map((step, index) => {
          const c = completion.get(step.id);
          const status = STATUS[c?.status ?? "not_started"];
          const active = step.id === activeStepId;
          return (
            <li key={step.id}>
              <Link
                href={`/visit/${visitId}/ayurveda/${stepSlug(step.id)}`}
                aria-current={active ? "step" : undefined}
                className={`flex items-start gap-space-sm rounded-lg border px-space-sm py-space-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
                  active
                    ? "border-primary bg-primary-container/30"
                    : "border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low"
                }`}
              >
                <span className="font-clinical-data-mono text-clinical-data-mono text-on-surface-variant pt-0.5">{index + 1}</span>
                <span className="flex-1 min-w-0">
                  <span className="block font-body-strong text-body-strong text-on-surface">{step.label}</span>
                  <span className="block font-metadata-micro text-metadata-micro text-on-surface-variant">{step.gloss}</span>
                  <span className={`mt-1 inline-flex items-center gap-1 font-metadata-micro text-metadata-micro ${status.tone}`}>
                    <span className="material-symbols-outlined text-[14px] leading-none" aria-hidden="true">{status.icon}</span>
                    {status.label}
                    {c && c.required_total > 0 && step.id !== "summary" ? ` · ${c.filled}/${c.required_total}` : ""}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
