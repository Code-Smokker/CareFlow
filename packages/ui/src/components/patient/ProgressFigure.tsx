"use client";

/** Human figure filling bottom-up via clipPath — readable with zero literacy (docs/16). */
export interface ProgressFigureProps {
  percent: number;
}

export function ProgressFigure({ percent }: ProgressFigureProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  const fillY = 100 - clamped;

  return (
    <div className="flex items-center gap-cf-2" role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}>
      <svg viewBox="0 0 40 100" className="h-[40px] w-[16px]">
        <defs>
          <clipPath id="progress-fill-clip">
            <rect x="0" y={fillY} width="40" height={clamped} />
          </clipPath>
        </defs>
        <path
          d="M20 5 a8 8 0 1 1 0 16 a8 8 0 1 1 0 -16 M8 30 h24 l-4 40 h-6 l-2 -20 l-2 20 h-6 z"
          fill="#DCE5E1"
        />
        <path
          d="M20 5 a8 8 0 1 1 0 16 a8 8 0 1 1 0 -16 M8 30 h24 l-4 40 h-6 l-2 -20 l-2 20 h-6 z"
          fill="#0E6F5C"
          clipPath="url(#progress-fill-clip)"
        />
      </svg>
      <span className="font-question text-support font-bold text-muted">{clamped}%</span>
    </div>
  );
}
