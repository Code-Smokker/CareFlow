import Link from "next/link";
import { createGatewayClient } from "@careflow/api-client";

export const dynamic = "force-dynamic";

/** The gateway already server-renders a complete printable HTML page with a QR code
 * (GET /v1/visits/{id}/printable-summary — "for hospitals that cannot integrate
 * electronically", docs/14-features.md section 7). This embeds that real page rather than
 * re-deriving a second print layout from VisitSummary — one source of truth for what prints. */
export default async function SummaryPrintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gateway = createGatewayClient();
  const { data: summary } = await gateway.GET("/v1/visits/{id}/summary", { params: { path: { id } } });

  if (!summary?.signed) {
    return (
      <div className="p-panel-padding">
        <Link href={`/visit/${id}/summary`} className="font-clinical-data text-primary underline">
          ← Back to summary
        </Link>
        <p className="mt-space-md font-clinical-data text-on-surface-variant">
          The printable summary is only available once this visit is signed —{" "}
          <Link href={`/visit/${id}/sign`} className="text-primary underline">sign it first</Link>.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] print:h-auto">
      <div className="flex items-center gap-space-sm mb-space-sm print:hidden">
        <Link href={`/visit/${id}/summary`} className="font-clinical-data text-primary underline">
          ← Back
        </Link>
        <span className="font-clinical-data text-on-surface-variant">
          Server-rendered by the gateway (docs/14-features.md's printable fallback).
        </span>
      </div>
      <iframe
        src={`/api/visits/${id}/printable-summary`}
        title="Printable clinical summary"
        className="w-full flex-1 border border-outline-variant rounded-lg print:border-0 print:h-auto"
      />
    </div>
  );
}
