"use client";

/** Full-bleed critical fill, quotes the patient's own words verbatim — never a paraphrase
 * (docs/16). Speaks a calm instruction; never blames or alarms the patient further. */
export interface RedFlagBannerProps {
  quote: string;
  speakText: string;
  onContinue: () => void;
}

export function RedFlagBanner({ quote, speakText, onContinue }: RedFlagBannerProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-cf-4 bg-critical p-cf-5 text-white">
      <span className="material-symbols-outlined text-[64px]" aria-hidden="true">
        favorite
      </span>
      <p className="text-center font-question text-question font-bold">{speakText}</p>
      <p className="text-center font-question text-support italic text-critical-soft">&ldquo;{quote}&rdquo;</p>
      <button
        type="button"
        onClick={onContinue}
        className="mt-cf-4 min-h-touch min-w-[200px] rounded-2xl bg-white px-cf-4 font-question text-answer font-bold text-critical"
      >
        Continue
      </button>
    </div>
  );
}
