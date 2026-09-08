"use client";

export interface ChipOption {
  value: string;
  label: string;
  icon?: string;
}

export interface ChipGroupProps {
  options: ChipOption[];
  mode: "single" | "multi";
  selected: string[];
  onChange: (selected: string[]) => void;
}

/** Single or multi select, icon + label, wraps with gap. Used directly for chips/multi slots,
 * and for duration ("today / 2 days / a week / a month / longer") — never a date picker. */
export function ChipGroup({ options, mode, selected, onChange }: ChipGroupProps) {
  const toggle = (value: string) => {
    if (mode === "single") {
      onChange([value]);
      return;
    }
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
  };

  return (
    <div className="flex flex-wrap gap-cf-3" role="group">
      {options.map((opt) => {
        const active = selected.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value)}
            aria-pressed={active}
            className={`flex min-h-touch items-center gap-cf-2 rounded-2xl border-2 px-cf-4 font-question text-answer font-bold transition-colors ${
              active ? "border-accent bg-accent text-white" : "border-line-strong bg-surface text-ink"
            }`}
          >
            {opt.icon && (
              <span className="material-symbols-outlined text-[26px]" aria-hidden="true">
                {opt.icon}
              </span>
            )}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
