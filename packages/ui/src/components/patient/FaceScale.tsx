"use client";

/** 0-10 via six faces, green -> red ramp. Selected gets a ring and the value read out large —
 * literacy-free severity input (docs/10). Maps to the 0-10 integer scale ontology modules use. */
const FACES: Array<{ value: number; emoji: string; color: string }> = [
  { value: 0, emoji: "😀", color: "#1F7A47" },
  { value: 2, emoji: "🙂", color: "#4C9A5B" },
  { value: 4, emoji: "😐", color: "#A9700F" },
  { value: 6, emoji: "😟", color: "#C97A3D" },
  { value: 8, emoji: "😣", color: "#C0392B" },
  { value: 10, emoji: "😭", color: "#B32D24" },
];

export interface FaceScaleProps {
  value: number | null;
  onChange: (value: number) => void;
}

export function FaceScale({ value, onChange }: FaceScaleProps) {
  return (
    <div className="flex flex-col items-center gap-cf-4">
      <div className="flex flex-wrap justify-center gap-cf-3">
        {FACES.map((face) => {
          const active = value === face.value;
          return (
            <button
              key={face.value}
              type="button"
              onClick={() => onChange(face.value)}
              aria-pressed={active}
              aria-label={`Pain level ${face.value} out of 10`}
              className={`flex h-[72px] w-[72px] flex-col items-center justify-center rounded-full border-4 text-[32px] transition-transform ${
                active ? "scale-110 ring-4 ring-offset-2" : ""
              }`}
              style={{ borderColor: face.color, ...(active ? { boxShadow: `0 0 0 4px ${face.color}` } : {}) }}
            >
              {face.emoji}
            </button>
          );
        })}
      </div>
      {value !== null && (
        <p className="font-question text-question font-bold text-ink" aria-live="polite">
          {value} out of 10
        </p>
      )}
    </div>
  );
}
