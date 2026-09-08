"use client";

import { use, useState } from "react";
import { useMachine } from "@xstate/react";
import { intakeMachine, type NextQuestion } from "@/lib/machine";
import { completeSession, giveConsent, setLanguage, submitAnswer } from "@/lib/api";
import { LanguageScreen } from "@/components/screens/LanguageScreen";
import { ConsentScreen } from "@/components/screens/ConsentScreen";
import { QuestionScreen } from "@/components/screens/QuestionScreen";
import { RedFlagScreen } from "@/components/screens/RedFlagScreen";
import { DocumentsScreen } from "@/components/screens/DocumentsScreen";
import { ReadbackScreen } from "@/components/screens/ReadbackScreen";
import { CompleteScreen } from "@/components/screens/CompleteScreen";

const CHIEF_COMPLAINT_QUESTION: NextQuestion = {
  slot_id: "chief_complaint",
  text: "What brings you in today?",
  tts_url: null,
  input_modes: ["voice", "chips"],
  options: [
    { value: "chest_pain", label: "Chest pain", icon: "cardiology" },
    { value: "fever", label: "Fever", icon: "thermostat" },
    { value: "cough_breathlessness", label: "Cough or breathlessness", icon: "coronavirus" },
    { value: "abdominal_pain", label: "Stomach pain", icon: "sick" },
    { value: "joint_pain", label: "Joint pain", icon: "orthopedics" },
    { value: "generic", label: "Something else", icon: "help" },
  ],
};

export default function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: sessionId } = use(params);
  const [pending, setPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [state, send] = useMachine(intakeMachine, { input: { sessionId } });

  if (errorMsg) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-cf-3 bg-paper p-cf-4 text-center">
        <p className="font-question text-answer font-bold text-critical">Something went wrong — {errorMsg}</p>
        <p className="font-question text-support text-muted">You can try again, or ask a nurse for help.</p>
      </div>
    );
  }

  if (state.matches("language")) {
    return (
      <LanguageScreen
        onSelect={async (language) => {
          setPending(true);
          try {
            await setLanguage(sessionId, language);
            send({ type: "LANGUAGE_SET", language });
          } catch (e) {
            setErrorMsg(e instanceof Error ? e.message : String(e));
          } finally {
            setPending(false);
          }
        }}
      />
    );
  }

  if (state.matches("consent")) {
    return (
      <ConsentScreen
        onAccept={async (scopes) => {
          try {
            await giveConsent(sessionId, scopes);
            send({ type: "CONSENT_GIVEN" });
          } catch (e) {
            setErrorMsg(e instanceof Error ? e.message : String(e));
          }
        }}
      />
    );
  }

  if (state.matches("chiefComplaint")) {
    return (
      <QuestionScreen
        question={CHIEF_COMPLAINT_QUESTION}
        language={state.context.language}
        progressPercent={0}
        onAnswer={async (value, inputMode, confidence) => {
          if (pending) return;
          setPending(true);
          try {
            const result = await submitAnswer(
              sessionId,
              "chief_complaint",
              CHIEF_COMPLAINT_QUESTION.text,
              value,
              inputMode,
              confidence,
            );
            send({ type: "CHIEF_COMPLAINT_SET", question: result.question, redFlags: result.redFlags });
          } catch (e) {
            setErrorMsg(e instanceof Error ? e.message : String(e));
          } finally {
            setPending(false);
          }
        }}
      />
    );
  }

  if (state.matches("interview")) {
    const question = state.context.currentQuestion;
    if (!question || question.slot_id === null) {
      // The machine's `always` transition already moves this to "documents" on the next
      // microstep — this is just the one render in between.
      return null;
    }
    return (
      <QuestionScreen
        key={question.slot_id}
        question={question}
        language={state.context.language}
        progressPercent={state.context.progressPercent}
        onAnswer={async (value, inputMode, confidence) => {
          if (pending) return;
          setPending(true);
          try {
            const result = await submitAnswer(sessionId, question.slot_id!, question.text, value, inputMode, confidence);
            send({
              type: "ANSWER_SUBMITTED",
              line: result.line,
              question: result.question,
              progressPercent: result.progressPercent,
              redFlags: result.redFlags,
            });
          } catch (e) {
            setErrorMsg(e instanceof Error ? e.message : String(e));
          } finally {
            setPending(false);
          }
        }}
      />
    );
  }

  if (state.matches("redFlag")) {
    return <RedFlagScreen redFlags={state.context.pendingRedFlags} onContinue={() => send({ type: "RED_FLAG_ACKNOWLEDGED" })} />;
  }

  if (state.matches("documents")) {
    return <DocumentsScreen sessionId={sessionId} onDone={() => send({ type: "DOCUMENTS_DONE" })} />;
  }

  if (state.matches("readback")) {
    return (
      <ReadbackScreen
        answered={state.context.answered}
        onSubmit={async () => {
          try {
            await completeSession(sessionId);
            send({ type: "SUBMIT_COMPLETE" });
          } catch (e) {
            setErrorMsg(e instanceof Error ? e.message : String(e));
          }
        }}
      />
    );
  }

  if (state.matches("complete")) {
    return <CompleteScreen />;
  }

  return null;
}
