import { DemoDataBadge } from "@careflow/ui";

const MOCK_STATS = [
  { label: "OPD throughput today", value: "142 visits" },
  { label: "Top complaint", value: "Fever (23%)" },
  { label: "Red-flag rate", value: "6.2%" },
  { label: "Average intake time", value: "4m 40s" },
];

/** No aggregation endpoint exists anywhere in the contracts (gateway, ai, docai, terminology) —
 * this would need a new analytics endpoint, which CLAUDE.md's Phase 3 rule says to list and
 * stop on, not invent. Numbers below are illustrative placeholders only. */
export default function AnalyticsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-space-md">
        <h1 className="font-page-title text-page-title text-on-surface">Analytics</h1>
        <DemoDataBadge reason="No analytics/aggregation endpoint exists in any service's OpenAPI contract yet. These numbers are illustrative only." />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-space-sm">
        {MOCK_STATS.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-outline-variant bg-surface-container-lowest p-panel-padding">
            <p className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase">{stat.label}</p>
            <p className="mt-1 font-page-title text-page-title text-on-surface">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
