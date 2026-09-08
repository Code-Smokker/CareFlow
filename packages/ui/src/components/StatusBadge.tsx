/**
 * Status colour never travels alone (CLAUDE.md-derived hard rule from this import): every
 * badge pairs its colour with an icon AND a label, so meaning survives colour-blindness, print,
 * and screenshots. `tone="critical"` is reserved for genuine clinical urgency — never repurpose
 * it for a delete button, an inactive tab, or a generic error toast.
 */

type Tone = "critical" | "uncertain" | "good" | "neutral";

const toneClasses: Record<Tone, string> = {
  critical: "bg-error-container text-on-error-container",
  uncertain: "bg-uncertain-container text-on-uncertain-container",
  good: "bg-primary-container text-on-primary-container",
  neutral: "bg-surface-container text-on-surface-variant",
};

const toneIcon: Record<Tone, string> = {
  critical: "priority_high",
  uncertain: "help",
  good: "check_circle",
  neutral: "info",
};

export interface StatusBadgeProps {
  tone: Tone;
  label: string;
  /** Override the tone's default icon with a Material Symbols name. */
  icon?: string;
}

export function StatusBadge({ tone, label, icon }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm font-clinical-data-mono text-[10px] font-semibold leading-none ${toneClasses[tone]}`}
    >
      <span className="material-symbols-outlined text-[12px] leading-none" aria-hidden="true">
        {icon ?? toneIcon[tone]}
      </span>
      {label}
    </span>
  );
}
