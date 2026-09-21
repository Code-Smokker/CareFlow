import { notFound } from "next/navigation";
import { AyurvedaShell } from "@/components/ayurveda/AyurvedaShell";
import { ExamForm } from "@/components/ayurveda/ExamForm";
import { stepIdFromSlug } from "@/components/ayurveda/labels";
import { loadAyurveda } from "@/components/ayurveda/load";

export const dynamic = "force-dynamic";

/** Steps 2–5 (Trividha, Ashtavidha, Dashavidha, Vyadhi Vinishchaya) — one route, rendered from
 * whichever step of the vocabulary the slug names. `prashna` and `summary` are their own routes. */
export default async function ExamStepPage({ params }: { params: Promise<{ id: string; step: string }> }) {
  const { id, step: slug } = await params;
  const data = await loadAyurveda(id);
  if (!data.ok) {
    return <p role="alert" className="text-error font-clinical-data p-panel-padding">Could not load the Ayurvedic case record: {data.message}</p>;
  }
  const stepId = stepIdFromSlug(slug);
  const index = data.vocabulary.steps.findIndex((s) => s.id === stepId);
  if (index === -1) notFound();
  const step = data.vocabulary.steps[index];

  return (
    <AyurvedaShell visitId={id} activeStepId={step.id} title={`Step ${index + 2} · ${step.label}`} gloss={step.gloss}>
      {({ record, vocabulary }) => <ExamForm key={step.id} visitId={id} step={step} record={record} reviewStatus={vocabulary.status} />}
    </AyurvedaShell>
  );
}
