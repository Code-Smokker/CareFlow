/** Provenance for a value the Vaidya recorded (CLAUDE.md rule 4). Icon + label, never colour
 * alone. Patient-reported values use the shared ProvenanceBadge (voice / tap / proxy…). */
export function VaidyaChip({ disposition }: { disposition?: "entered" | "confirmed" | "overridden" | null }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-primary-container text-on-primary-container font-clinical-data-mono text-[10px] font-medium leading-none"
      title="Recorded by the Vaidya"
    >
      <span className="material-symbols-outlined text-[12px] leading-none" aria-hidden="true">
        {disposition === "confirmed" ? "verified" : "stethoscope"}
      </span>
      Vaidya{disposition && disposition !== "entered" ? ` · ${disposition}` : ""}
    </span>
  );
}
