"use client";

import { useEffect, useRef, useState } from "react";
import { BigButton, BodyMap, ChipGroup, FaceScale, MicOrb, ProgressFigure, SpeakerButton } from "@careflow/ui/patient";
import { AnswerChips } from "@/components/AnswerChips";
import { useVoiceCapture } from "@/lib/useVoiceCapture";
import type { AnsweredLine, NextQuestion } from "@/lib/machine";

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
  /** `voiceId` is set only for a spoken answer — the gateway's id for the (consented) stored voice note. */
  onAnswer: (value: unknown, inputMode: "voice" | "tap" | "bodymap", confidence: number, voiceId?: string | null) => void;
  sessionId: string;
  /** Answers so far, shown as chips; tapping one calls `onEdit` (beat 4). */
  answered?: AnsweredLine[];
  onEdit?: (slotId: string) => void;
  /** Set while the patient is changing an earlier answer: shows a heading and a way back. */
  editing?: boolean;
  onCancel?: () => void;
  /** Set once AttendantScreen records someone answering on the patient's behalf — shown so the
   * attendant sees it's still recording, not a silent backend flag (docs/16). The gateway call
   * always sends input_mode="proxy" in this case regardless of what's passed here (page.tsx). */
  isProxy?: boolean;
}

/** One question per screen, nothing else on it (docs/10). Renders whichever tap widget the
 * question's input_modes call for; voice (via MicOrb) is layered on top of every one of them —
 * every slot supports at least two modes, none requires typing. */
const LANG_TAG: Record<string, string> = { hi: "hi-IN", en: "en-IN", ta: "ta-IN", bn: "bn-IN" };

export function QuestionScreen({ question, language, progressPercent, onAnswer, isProxy, sessionId, answered = [], onEdit, editing = false, onCancel }: QuestionScreenProps) {
  const [multiSelected, setMultiSelected] = useState<string[]>([]);
  const [bodySelected, setBodySelected] = useState<string[]>([]);
  const [voiceStatus, setVoiceStatus] = useState<"idle" | "thinking" | "unclear" | "unavailable">("idle");
  const voice = useVoiceCapture(language, sessionId);
  // The silence detector calls back into the LATEST closure, not the one from when recording began.
  const finishRef = useRef<() => Promise<void>>(async () => undefined);

  const hasVoice = question.input_modes.includes("voice");
  const hasChips = question.input_modes.includes("chips");
  const hasMulti = question.input_modes.includes("multi");
  const hasBodymap = question.input_modes.includes("bodymap");
  const hasFacescale = question.input_modes.includes("facescale");
  const hasDuration = question.input_modes.includes("duration");

  const speakQuestion = () => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(question.text);
    utter.lang = LANG_TAG[language] ?? "en-IN";
    window.speechSynthesis.speak(utter);
  };

  // Every question is read aloud as it appears (the speaker button replays it). Silently skipped where the browser
  // blocks speech before a first tap; the patient can still press the speaker.
  useEffect(() => {
    speakQuestion();
    return () => window.speechSynthesis?.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.slot_id]);

  const finishVoice = async () => {
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
    onAnswer(result.value, "voice", result.confidence, result.voiceId);
  };
  finishRef.current = finishVoice;

  const handleVoicePress = async () => {
    if (voice.listening) return finishVoice();
    if (!voice.supported) {
      // Plain http on a LAN address has no microphone API; say so kindly and leave the taps in place.
      setVoiceStatus("unavailable");
      return;
    }
    try {
      setVoiceStatus("idle");
      await voice.start(() => void finishRef.current());
    } catch {
      setVoiceStatus("unavailable"); // permission declined or no microphone
    }
  };

  return (
    <div className="flex min-h-dvh flex-col gap-cf-4 bg-paper p-cf-4">
      <div className="flex items-center justify-between">
        <ProgressFigure percent={progressPercent} />
        <SpeakerButton onPlay={speakQuestion} />
      </div>

      {isProxy && (
        <span className="w-fit rounded-full bg-accent-soft px-cf-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wide text-accent-deep">
          Answering for the patient
        </span>
      )}

      {!editing && <AnswerChips lines={answered} onEdit={onEdit} heading={language === "hi" ? "आपके अब तक के जवाब" : "Your answers so far"} />}

      {editing && (
        <p className="font-question text-support font-bold text-accent-deep">
          {language === "hi" ? "अपना जवाब बदलें" : "Change your answer"}
        </p>
      )}
      {question.module_label && (
        <p className="w-fit rounded-full bg-accent-soft px-cf-3 py-1 font-mono text-[12px] font-bold uppercase tracking-wide text-accent-deep">
          {question.module_label}
        </p>
      )}
      <h1 lang={language} className="font-question text-question font-bold text-ink">{question.text}</h1>

      {voiceStatus === "unclear" && (
        <p className="rounded-xl bg-uncertain-soft p-cf-3 font-question text-support font-bold text-uncertain">
          I didn&apos;t catch that — you can tap instead.
        </p>
      )}
      {voiceStatus === "unavailable" && (
        <p className="rounded-xl bg-uncertain-soft p-cf-3 font-question text-support font-bold text-uncertain">
          The microphone isn&apos;t available here — please tap your answer instead.
        </p>
      )}
      {voiceStatus === "thinking" && (
        <p className="font-question text-support text-muted">Listening to what you said…</p>
      )}
      {voice.transcript && voiceStatus !== "unclear" && (
        <p lang={language} className="rounded-xl bg-accent-soft p-cf-3 font-question text-answer text-ink">“{voice.transcript}”</p>
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

      {editing && onCancel && (
        <BigButton label={language === "hi" ? "पुराना जवाब रखें" : "Keep my answer"} icon="arrow_back" variant="secondary" onClick={onCancel} />
      )}

      {hasVoice && (
        <div className="mt-cf-3 flex flex-col items-center gap-cf-2 pb-cf-7">
          <MicOrb listening={voice.listening} levels={voice.levels} onPress={handleVoicePress} />
          <p className="font-question text-support text-muted">
            {voice.listening ? "Speak now — I'll stop when you pause" : "Or tap to speak your answer"}
          </p>
        </div>
      )}
    </div>
  );
}
