"use client";

/** 72px minimum height, icon + label always — never one alone (docs/10-ui-guidelines.md). The
 * one general-purpose tap target patient screens use for anything that isn't a chip/bodymap/
 * facescale answer (Next, Done, Try again). */
export interface BigButtonProps {
  label: string;
  icon?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  type?: "button" | "submit";
}

export function BigButton({ label, icon, onClick, variant = "primary", disabled, type = "button" }: BigButtonProps) {
  const styles =
    variant === "primary"
      ? "bg-accent text-white active:bg-accent-deep"
      : "bg-surface border-2 border-line-strong text-ink active:bg-surface-2";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex min-h-[72px] w-full items-center justify-center gap-cf-3 rounded-2xl px-cf-4 font-question text-answer font-bold transition-colors disabled:opacity-40 ${styles}`}
    >
      {icon && (
        <span className="material-symbols-outlined text-[32px]" aria-hidden="true">
          {icon}
        </span>
      )}
      <span>{label}</span>
    </button>
  );
}
