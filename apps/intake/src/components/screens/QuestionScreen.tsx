"use client";

import { useState } from "react";
import { BigButton, BodyMap, ChipGroup, FaceScale, MicOrb, ProgressFigure, SpeakerButton } from "@careflow/ui/patient";
import { useVoiceCapture } from "@/lib/useVoiceCapture";
import type { NextQuestion } from "@/lib/machine";

const DURATION_CHIPS = [
  { value: "today", label: "Today" },
  { value: "2_days", label: "2 days" },
  { value: "1_week", label: "A week" },
  { value: "1_month", label: "A month" },
  { value: "longer", label: "Longer" },
];

export interface QuestionScreenProps {
  question: NextQuestion;
  language: string;
  progressPercent: number;
  onAnswer: (value: unknown, inputMode: "voice" | "tap" | "bodymap", confidence: number) => void;
}

/** One question per screen, nothing else on it (docs/10). Renders whichever tap widget the
 * question's input_modes call for; voice (via MicOrb) is layered on top of every one of them —
 * every slot supports at least two modes, none requires typing. */
export function QuestionScreen({ question, language, progressPercent, onAnswer }: QuestionScreenProps) {
  const [multiSelected, setMultiSelected] = useState<string[]>([]);
  const [bodySelected, setBodySelected] = useState<string[]>([]);
  const [voiceStatus, setVoiceStatus] = useState<"idle" | "thinking" | "unclear">("idle");
  const voice = useVoiceCapture(language);

  const hasVoice = question.input_modes.includes("voice");
  const hasChips = question.input_modes.includes("chips");
  const hasMulti = question.input_modes.includes("multi");
  const hasBodymap = question.input_modes.includes("bodymap");
  const hasFacescale = question.input_modes.includes("facescale");
  const hasDuration = question.input_modes.includes("duration");

  const speakQuestion = () => {
    if (!("speechSynthesis" in window)) return;
    const utter = new SpeechSynthesisUtterance(question.text);
    utter.lang = language === "hi" ? "hi-IN" : language;
    window.speechSynthesis.speak(utter);
  };

  const handleVoicePress = async () => {
    if (!voice.listening) {
      await voice.start();
      return;
    }
    setVoiceStatus("thinking");
    const slotSchema =
      hasChips || hasMulti
        ? { type: hasMulti ? "array" : "string", enum: question.options.map((o) => o.value) }
        : hasFacescale
          ? { type: "integer", minimum: 0, maximum: 10 }
          : { type: "string" };
    const result = await voice.stopAndProcess(slotSchema, { slot_id: question.slot_id });
    if (!result || result.needsClarification || result.value === null || result.value === undefined) {
      setVoiceStatus("unclear");
      setTimeout(() => setVoiceStatus("idle"), 2500);
      return;
    }
    setVoiceStatus("idle");
    onAnswer(result.value, "voice", result.confidence);
  };

  return (
    <div className="flex min-h-dvh flex-col gap-cf-4 bg-paper p-cf-4">
      <div className="flex items-center justify-between">
        <ProgressFigure percent={progressPercent} />
        <SpeakerButton onPlay={speakQuestion} />
      </div>

      <h1 className="font-question text-question font-bold text-ink">{question.text}</h1>

      {voiceStatus === "unclear" && (
        <p className="rounded-xl bg-uncertain-soft p-cf-3 font-question text-support font-bold text-uncertain">
          I didn&apos;t catch that — you can tap instead.
        </p>
      )}
      {voiceStatus === "thinking" && (
        <p className="font-question text-support text-muted">Listening to what you said…</p>
      )}

      {hasBodymap && (
        <BodyMap
          selected={bodySelected}
          onToggle={(id) => {
            const next = [id];
            setBodySelected(next);
            onAnswer(id, "bodymap", 1);
          }}
        />
      )}

      {hasFacescale && <FaceScale value={null} onChange={(v) => onAnswer(v, "tap", 1)} />}

      {hasDuration && (
        <ChipGroup options={DURATION_CHIPS} mode="single" selected={[]} onChange={([v]) => onAnswer(v, "tap", 1)} />
      )}

      {hasChips && !hasDuration && (
        <ChipGroup
          options={question.options.map((o) => ({ value: o.value, label: o.label, icon: o.icon ?? undefined }))}
          mode="single"
          selected={[]}
          onChange={([v]) => onAnswer(v, "tap", 1)}
        />
      )}

      {hasMulti && (
        <>
          <ChipGroup
            options={question.options.map((o) => ({ value: o.value, label: o.label, icon: o.icon ?? undefined }))}
            mode="multi"
            selected={multiSelected}
            onChange={setMultiSelected}
          />
          <BigButton
            label="Done"
            icon="check"
            disabled={multiSelected.length === 0}
            onClick={() => onAnswer(multiSelected, "tap", 1)}
          />
        </>
      )}

      {hasVoice && (
        <div className="mt-cf-3 flex flex-col items-center gap-cf-2">
          <MicOrb listening={voice.listening} onPress={handleVoicePress} />
          <p className="font-question text-support text-muted">
            {voice.listening ? "Tap again when you're done speaking" : "Or tap to speak your answer"}
          </p>
        </div>
      )}
    </div>
  );
}
