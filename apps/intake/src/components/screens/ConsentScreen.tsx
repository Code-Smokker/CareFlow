"use client";

import { useState } from "react";
import { BigButton, SpeakerButton } from "@careflow/ui/patient";

const SCOPES: Array<{ id: string; label: string; description: string }> = [
  { id: "history", label: "Your medical history", description: "What you tell us today, saved for your doctor." },
  { id: "audio_recording", label: "Your voice", description: "So your doctor can hear exactly what you said." },
  { id: "abha_lookup", label: "Your ABHA health record", description: "Link this visit to your health ID, if you have one." },
];

export function ConsentScreen({ onAccept }: { onAccept: (scopes: string[]) => void }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({
    history: true,
    audio_recording: true,
    abha_lookup: true,
  });

  return (
    <div className="flex min-h-dvh flex-col justify-center gap-cf-4 bg-paper p-cf-4">
      <div className="flex items-center gap-cf-3">
        <SpeakerButton
          onPlay={() => {
            if (!("speechSynthesis" in window)) return;
            const text = `Before we start. We'll ask you some questions about how you're feeling. Here's what we save, and why. ${SCOPES.map((s) => `${s.label}. ${s.description}`).join(" ")}`;
            window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
          }}
        />
        <h1 className="font-question text-question font-bold text-ink">Before we start</h1>
      </div>
      <p className="font-question text-support text-muted">
        We&apos;ll ask you some questions about how you&apos;re feeling. Here&apos;s what we save, and why.
      </p>

      <div className="flex flex-col gap-cf-3">
        {SCOPES.map((scope) => (
          <label
            key={scope.id}
            className="flex min-h-touch items-center gap-cf-3 rounded-2xl border-2 border-line-strong bg-surface p-cf-3"
          >
            <input
              type="checkbox"
              checked={checked[scope.id]}
              onChange={(e) => setChecked((c) => ({ ...c, [scope.id]: e.target.checked }))}
              className="h-8 w-8 shrink-0"
            />
            <span>
              <span className="block font-question text-answer font-bold text-ink">{scope.label}</span>
              <span className="block font-question text-support text-muted">{scope.description}</span>
            </span>
          </label>
        ))}
      </div>

      <BigButton
        label="I agree, continue"
        icon="check_circle"
        onClick={() => onAccept(Object.entries(checked).filter(([, v]) => v).map(([k]) => k))}
      />
    </div>
  );
}
