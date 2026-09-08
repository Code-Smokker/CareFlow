"use client";

/** Front-view SVG figure, named tappable regions — for `type: region` slots (site, radiation).
 * The ontology leaves region values free-form (voice or bodymap tap, no fixed enum), so this
 * component is what actually defines the region vocabulary. Covers chest/abdomen (chest_pain,
 * abdominal_pain, generic modules) plus a couple of joints (joint_pain) — not every module's
 * full taxonomy, but the regions the demo script and the shipped ontology modules exercise. */
export interface BodyRegion {
  id: string;
  label: string;
  /** SVG path or shape, drawn as a simple filled region on a 200x400 viewBox figure. */
  cx: number;
  cy: number;
  r: number;
}

export const BODY_REGIONS: BodyRegion[] = [
  { id: "jaw", label: "Jaw", cx: 100, cy: 40, r: 16 },
  { id: "neck", label: "Neck", cx: 100, cy: 65, r: 14 },
  { id: "left_arm", label: "Left arm", cx: 55, cy: 140, r: 20 },
  { id: "right_arm", label: "Right arm", cx: 145, cy: 140, r: 20 },
  { id: "central_chest", label: "Centre of chest", cx: 100, cy: 110, r: 22 },
  { id: "left_chest", label: "Left chest", cx: 75, cy: 115, r: 18 },
  { id: "right_chest", label: "Right chest", cx: 125, cy: 115, r: 18 },
  { id: "epigastric", label: "Upper stomach", cx: 100, cy: 165, r: 20 },
  { id: "generalised", label: "All over the stomach", cx: 100, cy: 195, r: 26 },
  { id: "left_upper_quadrant", label: "Left side, upper stomach", cx: 75, cy: 175, r: 16 },
  { id: "right_upper_quadrant", label: "Right side, upper stomach", cx: 125, cy: 175, r: 16 },
  { id: "lower_back", label: "Lower back", cx: 100, cy: 230, r: 22 },
  { id: "knees", label: "Knees", cx: 100, cy: 300, r: 20 },
  { id: "right_knee", label: "Right knee", cx: 85, cy: 300, r: 16 },
  { id: "hands", label: "Hands", cx: 100, cy: 340, r: 18 },
  { id: "left_ankle", label: "Left ankle", cx: 115, cy: 370, r: 14 },
];

export interface BodyMapProps {
  selected: string[];
  onToggle: (regionId: string) => void;
  mode?: "single" | "multi";
}

export function BodyMap({ selected, onToggle, mode = "single" }: BodyMapProps) {
  return (
    <div className="flex flex-col items-center gap-cf-3">
      <svg viewBox="0 0 200 400" className="h-[360px] w-auto" role="img" aria-label="Body diagram, tap where it hurts">
        {/* Simple figure outline */}
        <ellipse cx="100" cy="30" rx="22" ry="26" fill="none" stroke="#C3D0CB" strokeWidth="2" />
        <path
          d="M 60 60 Q 100 50 140 60 L 150 220 Q 100 235 50 220 Z"
          fill="none"
          stroke="#C3D0CB"
          strokeWidth="2"
        />
        <path d="M 55 70 L 20 160 M 145 70 L 180 160" fill="none" stroke="#C3D0CB" strokeWidth="2" />
        <path d="M 65 220 L 60 380 M 135 220 L 140 380" fill="none" stroke="#C3D0CB" strokeWidth="2" />

        {BODY_REGIONS.map((region) => {
          const active = selected.includes(region.id);
          return (
            <g key={region.id}>
              <circle
                cx={region.cx}
                cy={region.cy}
                r={region.r}
                className={active ? "fill-critical/70" : "fill-accent-soft/70 active:fill-accent-soft"}
                stroke={active ? "#B32D24" : "#0E6F5C"}
                strokeWidth="2"
                onClick={() => onToggle(region.id)}
                tabIndex={0}
                role="button"
                aria-pressed={active}
                aria-label={region.label}
                style={{ cursor: "pointer" }}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onToggle(region.id)}
              />
            </g>
          );
        })}
      </svg>

      <div className="flex flex-wrap justify-center gap-cf-2">
        {selected.map((id) => (
          <span
            key={id}
            className="rounded-full bg-critical-soft px-cf-3 py-1 font-question text-support font-bold text-critical"
          >
            {BODY_REGIONS.find((r) => r.id === id)?.label ?? id}
          </span>
        ))}
      </div>
      {mode === "single" && selected.length === 0 && (
        <p className="font-question text-support text-muted">Tap the place on the body</p>
      )}
    </div>
  );
}
