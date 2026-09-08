import { gateway } from "./gateway-client";
import type { AnsweredLine, NextQuestion, RedFlag } from "./machine";

function idempotencyKey(sessionId: string, slotId: string) {
  return `${sessionId}:${slotId}:${Date.now()}`;
}

export async function startSession() {
  const { data, error } = await gateway.POST("/v1/sessions", {});
  if (error) throw new Error(error.error.message);
  return data;
}

export async function setLanguage(sessionId: string, language: string) {
  const { error } = await gateway.POST("/v1/sessions/{id}/language", {
    params: { path: { id: sessionId } },
    body: { language },
  });
  if (error) throw new Error(error.error.message);
}

export async function giveConsent(sessionId: string, scopes: string[]) {
  const { error } = await gateway.POST("/v1/sessions/{id}/consent", {
    params: { path: { id: sessionId } },
    body: { scopes: scopes as never },
  });
  if (error) throw new Error(error.error.message);
}

interface AnswerResult {
  question: NextQuestion | null;
  progressPercent: number;
  redFlags: RedFlag[];
  line: AnsweredLine;
}

export async function submitAnswer(
  sessionId: string,
  slotId: string,
  questionText: string,
  value: unknown,
  inputMode: "voice" | "tap" | "bodymap" | "proxy" | "ocr",
  confidence: number,
  audioUri?: string | null,
): Promise<AnswerResult> {
  const { data, error, response } = await gateway.POST("/v1/sessions/{id}/answer", {
    params: { path: { id: sessionId }, header: { "Idempotency-Key": idempotencyKey(sessionId, slotId) } },
    body: { slot_id: slotId, value: value as never, input_mode: inputMode, confidence, audio_uri: audioUri ?? null },
  });
  if (error) throw new Error(`${error.error.message} (${response.status})`);

  const nq = data.next_question;
  return {
    question: nq && nq.slot_id ? (nq as NextQuestion) : null,
    progressPercent: data.progress?.percent ?? 0,
    redFlags: data.red_flags as RedFlag[],
    line: { slot_id: slotId, question_text: questionText, value, input_mode: inputMode, confidence },
  };
}

export async function uploadDocument(sessionId: string, file: File) {
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const { data, error } = await gateway.POST("/v1/sessions/{id}/documents", {
    params: { path: { id: sessionId } },
    // openapi-fetch sends this as multipart/form-data per the contract; the generated client
    // types this body as the decoded JSON shape (file: base64 string) matching the schema.
    body: { file: base64, doc_type_hint: null } as never,
    bodySerializer: (body: { file: string; doc_type_hint?: string | null }) => {
      const form = new FormData();
      form.append("file", file);
      if (body.doc_type_hint) form.append("doc_type_hint", body.doc_type_hint);
      return form;
    },
  });
  if (error) throw new Error(error.error.message);
  return data;
}

export async function completeSession(sessionId: string) {
  const { data, error } = await gateway.POST("/v1/sessions/{id}/complete", {
    params: { path: { id: sessionId } },
  });
  if (error) throw new Error(error.error.message);
  return data;
}
