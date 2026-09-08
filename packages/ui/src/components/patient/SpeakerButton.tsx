"use client";

/** Present on EVERY screen, never behind a menu (hard rule). Replays the current question's
 * audio. 56px minimum touch target. */
export interface SpeakerButtonProps {
  onPlay: () => void;
  playing?: boolean;
}

export function SpeakerButton({ onPlay, playing = false }: SpeakerButtonProps) {
  return (
    <button
      type="button"
      onClick={onPlay}
      aria-label={playing ? "Playing question aloud" : "Play question aloud"}
      className={`flex h-touch w-touch shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
        playing
          ? "border-accent bg-accent-soft text-accent-deep motion-safe:animate-pulse"
          : "border-line-strong bg-surface text-ink"
      }`}
    >
      <span className="material-symbols-outlined text-[28px]" aria-hidden="true">
        {playing ? "volume_up" : "volume_up"}
      </span>
    </button>
  );
}
