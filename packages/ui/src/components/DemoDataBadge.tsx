/**
 * Every screen still on mock data must show this — always visible, never a tooltip.
 * Presenting mock data as real is worse than showing fewer live screens (docs/19-frontend-status.md).
 */
export interface DemoDataBadgeProps {
  /** Why this screen (or this section of it) isn't wired — shown on hover for detail, but the
   * badge itself is legible without it. */
  reason?: string;
}

export function DemoDataBadge({ reason }: DemoDataBadgeProps) {
  return (
    <div
      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-sm bg-uncertain-container text-on-uncertain-container font-clinical-data-mono text-[11px] font-semibold uppercase tracking-wide"
      role="status"
      title={reason}
    >
      <span className="material-symbols-outlined text-[14px] leading-none" aria-hidden="true">
        construction
      </span>
      Demo data — not connected to live backend
    </div>
  );
}
