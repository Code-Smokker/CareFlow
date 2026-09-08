"use client";

/** Tap-only digit entry — a mobile number or an OTP is inherently numeric, but docs/10 rule 6
 * ("no question answerable only by typing") still applies: this is a tap grid, never a text
 * input, so it works the same on a kiosk with no keyboard as it does on a phone. Large value
 * readout keeps it legible per the 32px floor. */
export interface NumberPadProps {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  /** Rendered between digits, e.g. "XXXXX XXXXX" for a 10-digit mobile number. */
  placeholder?: string;
}

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "back"];

export function NumberPad({ value, onChange, maxLength, placeholder }: NumberPadProps) {
  const press = (key: string) => {
    if (key === "back") {
      onChange(value.slice(0, -1));
    } else if (key && value.length < maxLength) {
      onChange(value + key);
    }
  };

  return (
    <div className="flex flex-col items-center gap-cf-4">
      <p className="font-mono text-question font-bold tracking-[0.15em] text-ink" aria-live="polite">
        {value.length > 0 ? value : (placeholder ?? "—".repeat(maxLength))}
      </p>
      <div className="grid grid-cols-3 gap-cf-2">
        {KEYS.map((key, i) =>
          key === "" ? (
            <div key={`spacer-${i}`} />
          ) : (
            <button
              key={key}
              type="button"
              onClick={() => press(key)}
              aria-label={key === "back" ? "Delete last digit" : `Digit ${key}`}
              className="flex h-touch w-touch items-center justify-center rounded-2xl border-2 border-line-strong bg-surface font-question text-answer font-bold text-ink active:bg-surface-2"
            >
              {key === "back" ? (
                <span className="material-symbols-outlined text-[26px]" aria-hidden="true">
                  backspace
                </span>
              ) : (
                key
              )}
            </button>
          ),
        )}
      </div>
    </div>
  );
}
