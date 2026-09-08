import { SearchPanel } from "./SearchPanel";

export default function TerminologyPage() {
  return (
    <div>
      <h1 className="font-page-title text-page-title text-on-surface mb-space-xs">Terminology</h1>
      <p className="font-clinical-data text-on-surface-variant mb-space-md">
        NAMASTE ↔ ICD-11 TM2 crosswalk. An unreviewed automatic mapping is never shown as
        authoritative (docs/07-ayush-terminology.md) — it's demoted the same way a low-confidence
        slot is.
      </p>
      <SearchPanel />
    </div>
  );
}
