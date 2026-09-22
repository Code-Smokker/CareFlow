"use client";

import { BigButton, ProvenanceChip, SpeakerButton } from "@careflow/ui/patient";
import { type AnsweredLine, lineLabel } from "@/lib/machine";

/** Read-back before submit — the AI speaks the summary; docs/10. Review-and-confirm, not
 * review-and-edit: see machine.ts's readback state comment for why "tap to fix" isn't wired. */
export function ReadbackScreen({ answered, onSubmit }: { answered: AnsweredLine[]; onSubmit: () => void }) {
  const speakAll = () => {
    if (!("speechSynthesis" in window)) return;
    const text = answered.map((a) => `${a.question_text} ${lineLabel(a)}`).join(". ");
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  };

  return (
    <div className="flex min-h-dvh flex-col gap-cf-4 bg-paper p-cf-4">
      <div className="flex items-center gap-cf-3">
        <SpeakerButton onPlay={speakAll} />
        <h1 className="font-question text-question font-bold text-ink">Here&apos;s what we heard</h1>
      </div>
      <p className="font-question text-support text-muted">Your doctor will see all of this before your visit.</p>

      <div className="flex flex-col gap-cf-2">
        {answered.map((line) => (
          <div key={line.slot_id} className="rounded-2xl border-2 border-line bg-surface p-cf-3">
            <div className="flex items-start justify-between gap-cf-2">
              <p className="font-question text-support text-muted">{line.question_text}</p>
              <ProvenanceChip source={line.input_mode} confidence={line.confidence} />
            </div>
            <p className="font-question text-answer font-bold text-ink">{lineLabel(line)}</p>
          </div>
        ))}
      </div>

      <BigButton label="This is right" icon="check_circle" onClick={onSubmit} />
    </div>
  );
}
