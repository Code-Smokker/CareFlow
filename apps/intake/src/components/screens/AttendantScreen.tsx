"use client";

import { useState } from "react";
import { BigButton, ChipGroup, SpeakerButton } from "@careflow/ui/patient";

const RELATIONS = [
  { value: "spouse", label: "Husband or wife", icon: "favorite" },
  { value: "child", label: "Son or daughter", icon: "family_restroom" },
  { value: "parent", label: "Mother or father", icon: "elderly" },
  { value: "other_relative", label: "Other relative", icon: "group" },
  { value: "health_worker", label: "ASHA / health worker", icon: "medical_services" },
];

export interface AttendantResult {
  isProxy: boolean;
  relation: string | null;
}

/** Sits between consent and the interview (design/patient-ui's orphan AttendantScreen, adopted
 * whole — see docs/16). Tap-only by design (docs/10 rule 6): a relation is picked from a fixed
 * list, never typed. Answering "someone else" here is what makes every downstream answer.source
 * become "proxy" instead of voice/tap/bodymap — CLAUDE.md rule 4's provenance model already had
 * a `proxy` source with nothing that produced it until this screen. */
export function AttendantScreen({ onContinue }: { onContinue: (result: AttendantResult) => void }) {
  const [showRelations, setShowRelations] = useState(false);

  const speak = () => {
    if (!("speechSynthesis" in window)) return;
    const text = showRelations
      ? "Who are you, to the patient?"
      : "Who is answering these questions today? You, or someone with you?";
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  };

  if (showRelations) {
    return (
      <div className="flex min-h-dvh flex-col gap-cf-4 bg-paper p-cf-4">
        <div className="flex items-center gap-cf-3">
          <SpeakerButton onPlay={speak} />
          <h1 className="font-question text-question font-bold text-ink">Who are you, to the patient?</h1>
        </div>
        <ChipGroup
          options={RELATIONS}
          mode="single"
          selected={[]}
          onChange={([relation]) => onContinue({ isProxy: true, relation })}
        />
        <button
          type="button"
          onClick={() => setShowRelations(false)}
          className="mt-cf-2 min-h-touch font-question text-support font-bold text-muted underline"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col justify-center gap-cf-4 bg-paper p-cf-4">
      <div className="flex items-center gap-cf-3">
        <SpeakerButton onPlay={speak} />
        <h1 className="font-question text-question font-bold text-ink">Who is answering today?</h1>
      </div>
      <p className="font-question text-support text-muted">
        It&apos;s common for a family member to answer for someone who is unwell, very young, or elderly. Either
        way is fine.
      </p>
      <div className="flex flex-col gap-cf-3">
        <BigButton label="I am the patient" icon="person" onClick={() => onContinue({ isProxy: false, relation: null })} />
        <BigButton
          label="I'm answering for someone else"
          icon="group"
          variant="secondary"
          onClick={() => setShowRelations(true)}
        />
      </div>
    </div>
  );
}
