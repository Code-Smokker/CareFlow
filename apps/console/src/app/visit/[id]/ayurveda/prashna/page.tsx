import { AyurvedaShell } from "@/components/ayurveda/AyurvedaShell";
import { loadAyurveda } from "@/components/ayurveda/load";
import { PrashnaView } from "@/components/ayurveda/PrashnaView";

export const dynamic = "force-dynamic";

export default async function PrashnaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await loadAyurveda(id);
  const p = data.ok ? data.vocabulary.prashna : { label: "Prashna", gloss: "Patient-reported history" };
  return (
    <AyurvedaShell visitId={id} activeStepId="prashna" title={`Step 1 · ${p.label}`} gloss={`${p.gloss} — read-only`}>
      {({ record }) => <PrashnaView record={record} />}
    </AyurvedaShell>
  );
}
