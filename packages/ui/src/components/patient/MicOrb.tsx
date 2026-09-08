"use client";

/** 68px circle + live waveform bars, pulse ring on listening (docs/16). `prefers-reduced-motion`
 * kills the animation, not the state — the ring/bars still show listening via a static state,
 * just without the pulse/bounce keyframes (handled by the `motion-safe:` variants below). */
export interface MicOrbProps {
  listening: boolean;
  onPress: () => void;
  /** 0-1 amplitude samples, most recent last — omit for a resting/idle look while still listening. */
  levels?: number[];
  disabled?: boolean;
}

export function MicOrb({ listening, onPress, levels, disabled }: MicOrbProps) {
  const bars = levels && levels.length > 0 ? levels.slice(-5) : [0.2, 0.4, 0.3, 0.5, 0.25];

  return (
    <button
      type="button"
      onClick={onPress}
      disabled={disabled}
      aria-pressed={listening}
      aria-label={listening ? "Stop listening" : "Tap to speak"}
      className="relative flex h-[88px] w-[88px] items-center justify-center disabled:opacity-40"
    >
      {listening && (
        <span className="absolute inset-0 rounded-full bg-accent-soft motion-safe:animate-ping" aria-hidden="true" />
      )}
      <span
        className={`relative flex h-[68px] w-[68px] items-center justify-center rounded-full border-4 ${
          listening ? "border-accent bg-accent text-white" : "border-line-strong bg-surface text-ink"
        }`}
      >
        {listening ? (
          <span className="flex items-end gap-[3px]" aria-hidden="true">
            {bars.map((level, i) => (
              <span
                key={i}
                className="w-[3px] rounded-full bg-white motion-safe:transition-all motion-safe:duration-150"
                style={{ height: `${8 + level * 20}px` }}
              />
            ))}
          </span>
        ) : (
          <span className="material-symbols-outlined text-[32px]" aria-hidden="true">
            mic
          </span>
        )}
      </span>
    </button>
  );
}
