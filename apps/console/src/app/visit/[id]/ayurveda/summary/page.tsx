import Link from "next/link";
import { createGatewayClient } from "@careflow/api-client";
import { AyurvedicCaseSheet } from "@/components/ayurveda/AyurvedicCaseSheet";
import { AyurvedaShell } from "@/components/ayurveda/AyurvedaShell";
import { loadAyurveda } from "@/components/ayurveda/load";

export const dynamic = "force-dynamic";

/** Step 6 — the Ayurvedic case sheet as it will read in the merged clinician summary and print
 * on the A4 view. Signing is the existing sign flow; nothing is signed from here. */
export default async function AyurvedaSummaryStep({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await loadAyurveda(id);
  const gateway = createGatewayClient();
  const { data: summary } = await gateway.GET("/v1/visits/{id}/summary", { params: { path: { id } } });
  const step = data.ok ? data.vocabulary.summary_step : { label: "Summary & Sign", gloss: "The Ayurvedic case sheet" };

  return (
    <AyurvedaShell visitId={id} activeStepId="summary" title={`Step 6 · ${step.label}`} gloss={step.gloss}>
      {({ vocabulary }) => (
        <div>
          <div className="flex flex-wrap items-center gap-space-sm">
            <Link href={`/visit/${id}/sign`} className="rounded-lg bg-primary px-space-lg py-space-sm font-body-strong text-body-strong text-on-primary">
              Go to Sign
            </Link>
            <Link href={`/visit/${id}/summary`} className="font-clinical-data text-primary underline">Clinician summary</Link>
            <Link href={`/visit/${id}/summary/print`} className="font-clinical-data text-primary underline">Print view (A4)</Link>
          </div>
          {summary && summary.ayurveda_sections && summary.ayurveda_sections.length > 0 ? (
            <AyurvedicCaseSheet sections={summary.ayurveda_sections} reviewStatus={vocabulary.status} />
          ) : (
            <p className="mt-space-md font-clinical-data text-clinical-data text-on-surface-variant">
              No Ayurvedic findings recorded yet — complete Steps 2–5 first.
            </p>
          )}
        </div>
      )}
    </AyurvedaShell>
  );
}
