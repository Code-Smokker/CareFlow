"use client";

import { use, useEffect, useState } from "react";
import { useMachine } from "@xstate/react";
import { type AnsweredLine, intakeMachine, type NextQuestion } from "@/lib/machine";
import { completeSession, giveConsent, loadSession, setLanguage, submitAnswer, withdrawSession } from "@/lib/api";
import { LanguageScreen } from "@/components/screens/LanguageScreen";
import { ConsentScreen } from "@/components/screens/ConsentScreen";
import { AbhaScreen } from "@/components/screens/AbhaScreen";
import { AttendantScreen } from "@/components/screens/AttendantScreen";
import { QuestionScreen } from "@/components/screens/QuestionScreen";
import { RedFlagScreen } from "@/components/screens/RedFlagScreen";
import { DocumentsScreen } from "@/components/screens/DocumentsScreen";
import { ReadbackScreen } from "@/components/screens/ReadbackScreen";
import { CompleteScreen } from "@/components/screens/CompleteScreen";
import { MessageScreen } from "@/components/screens/MessageScreen";
import { WithdrawBar } from "@/components/WithdrawBar";

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

const ENDED: Record<string, Record<"expired" | "withdrawn" | "finished", { icon: string; title: string; body: string }>> = {
  en: {
    expired: { icon: "schedule", title: "This token has expired", body: "Please ask the desk for a new one — it only takes a moment." },
    withdrawn: { icon: "delete", title: "Your information has been deleted", body: "You can leave now. If you'd like to start again, the desk can help." },
    finished: { icon: "task_alt", title: "You've already finished", body: "Please wait to be called. Your doctor already has everything you told us." },
  },
  hi: {
    expired: { icon: "schedule", title: "इस टोकन की अवधि समाप्त हो गई है", body: "कृपया डेस्क से नया टोकन माँग लें — इसमें बस एक पल लगेगा।" },
    withdrawn: { icon: "delete", title: "आपकी जानकारी मिटा दी गई है", body: "अब आप जा सकते हैं। दोबारा शुरू करना चाहें तो डेस्क आपकी मदद करेगा।" },
    finished: { icon: "task_alt", title: "आप पहले ही पूरा कर चुके हैं", body: "कृपया बुलाए जाने का इंतज़ार करें। आपने जो बताया वह डॉक्टर के पास है।" },
  },
};

export default function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: sessionId } = use(params);
  const [pending, setPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [state, send] = useMachine(intakeMachine, { input: { sessionId } });

  // The QR on the token slip opens this page with the resume token. Ask the gateway where the session is, so a second
  // device — or a reload — carries on instead of starting over, and a spent token gets a kind message.
  useEffect(() => {
    let cancelled = false;
    const token = new URLSearchParams(window.location.search).get("token");
    loadSession(sessionId, token)
      .then((loaded) => {
        if (cancelled) return;
        if (loaded.kind === "ended") send({ type: "SESSION_ENDED", reason: loaded.reason });
        else if (loaded.kind === "resumed") send({ type: "SESSION_RESUMED", language: loaded.language, question: loaded.question, answered: loaded.answered, progressPercent: loaded.progressPercent });
        else send({ type: "SESSION_FRESH" });
      })
      .catch((e) => !cancelled && setErrorMsg(e instanceof Error ? e.message : String(e)));
    return () => {
      cancelled = true;
    };
  }, [sessionId, send]);

  const language = state.context.language;
  const lang = language === "hi" ? "hi" : "en";
  const withdrawable = ["abha", "attendant", "chiefComplaint", "interview", "reanswer", "redFlag", "documents", "readback"].some((s) => state.matches(s as never));

  const withdraw = async () => {
    await withdrawSession(sessionId);
    send({ type: "WITHDRAWN" });
  };

  const screen = (() => {
    if (errorMsg) {
      return (
        <div className="flex min-h-dvh flex-col items-center justify-center gap-cf-3 bg-paper p-cf-4 text-center">
          <p className="font-question text-answer font-bold text-ink">{errorMsg}</p>
          <p className="font-question text-support text-muted">You can try again, or ask a nurse for help.</p>
        </div>
      );
    }

    if (state.matches("loading")) {
      return (
        <div className="flex min-h-dvh items-center justify-center bg-paper">
          <p className="font-question text-support text-muted" role="status">Just a moment…</p>
        </div>
      );
    }

    if (state.matches("ended") && state.context.endReason) {
      const m = (ENDED[lang] ?? ENDED.en)[state.context.endReason];
      return <MessageScreen icon={m.icon} title={m.title} body={m.body} lang={lang} />;
    }

    if (state.matches("language")) {
      return (
        <LanguageScreen
          onSelect={async (chosen) => {
            setPending(true);
            try {
              await setLanguage(sessionId, chosen);
              send({ type: "LANGUAGE_SET", language: chosen });
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
          language={language}
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

    if (state.matches("abha")) {
      return <AbhaScreen onLinked={(abha) => send({ type: "ABHA_LINKED", abha })} onSkip={() => send({ type: "ABHA_SKIPPED" })} />;
    }

    if (state.matches("attendant")) {
      return <AttendantScreen onContinue={({ isProxy, relation }) => send({ type: "ATTENDANT_SET", isProxy, relation })} />;
    }

    if (state.matches("chiefComplaint")) {
      return (
        <QuestionScreen
          question={CHIEF_COMPLAINT_QUESTION}
          sessionId={sessionId}
          language={language}
          progressPercent={0}
          isProxy={state.context.isProxy}
          onAnswer={async (value, inputMode, confidence, voiceId) => {
            if (pending) return;
            setPending(true);
            try {
              const mode = state.context.isProxy ? "proxy" : inputMode;
              const result = await submitAnswer(sessionId, "chief_complaint", CHIEF_COMPLAINT_QUESTION.text, value, mode, confidence, voiceId);
              const line: AnsweredLine = {
                slot_id: "chief_complaint",
                question_text: CHIEF_COMPLAINT_QUESTION.text,
                value,
                value_label: CHIEF_COMPLAINT_QUESTION.options.find((o) => o.value === value)?.label ?? String(value),
                input_mode: mode,
                confidence,
                editable: false, // changing the main problem would restart the questions
              };
              send({ type: "CHIEF_COMPLAINT_SET", question: result.question, redFlags: result.redFlags, line });
            } catch (e) {
              setErrorMsg(e instanceof Error ? e.message : String(e));
            } finally {
              setPending(false);
            }
          }}
        />
      );
    }

    if (state.matches("interview") || state.matches("reanswer")) {
      const editing = state.matches("reanswer") ? state.context.editing : null;
      const question = editing?.question ?? state.context.currentQuestion;
      if (!question || question.slot_id === null) return null; // the machine's `always` moves this to "documents" next microstep
      return (
        <QuestionScreen
          key={`${question.slot_id}-${editing ? "edit" : "ask"}`}
          question={question}
          sessionId={sessionId}
          language={language}
          progressPercent={state.context.progressPercent}
          isProxy={state.context.isProxy}
          answered={state.context.answered}
          onEdit={(slotId) => send({ type: "EDIT_ANSWER", slotId })}
          editing={!!editing}
          onCancel={() => send({ type: "EDIT_CANCELLED" })}
          onAnswer={async (value, inputMode, confidence, voiceId) => {
            if (pending) return;
            setPending(true);
            try {
              const mode = state.context.isProxy ? "proxy" : inputMode;
              const result = await submitAnswer(sessionId, question.slot_id!, question.text, value, mode, confidence, voiceId, !!editing);
              const line: AnsweredLine = { ...result.line, question, editable: true };
              const next = { question: result.question, progressPercent: result.progressPercent, redFlags: result.redFlags };
              send(editing ? { type: "ANSWER_EDITED", line, ...next } : { type: "ANSWER_SUBMITTED", line, ...next });
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
      return <RedFlagScreen redFlags={state.context.pendingRedFlags} language={language} onContinue={() => send({ type: "RED_FLAG_ACKNOWLEDGED" })} />;
    }

    if (state.matches("documents")) {
      return <DocumentsScreen sessionId={sessionId} language={language} onDone={() => send({ type: "DOCUMENTS_DONE" })} />;
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

    if (state.matches("complete")) return <CompleteScreen />;
    return null;
  })();

  return (
    <>
      {screen}
      {withdrawable && !errorMsg && <WithdrawBar language={language} onConfirm={withdraw} />}
    </>
  );
}
