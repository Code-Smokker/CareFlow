import { gateway } from "./gateway-client";
import type { AnsweredLine, EndReason, NextQuestion, RedFlag } from "./machine";

function idempotencyKey(sessionId: string, slotId: string) {
  return `${sessionId}:${slotId}:${Date.now()}`;
}

/** `department` is set by whoever configured this check-in screen (the `?dept=` in its URL),
 * never chosen by the patient. Whether that department runs in AYUSH mode is the gateway's
 * visit config — this app does not know or care, it just renders the questions it is sent. */
export async function startSession(department?: string) {
  const { data, error } = await gateway.POST("/v1/sessions", { body: department ? { department } : {} });
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
  voiceId?: string | null,
  /** True when changing an answer given earlier (tap a chip). */
  replaces = false,
): Promise<AnswerResult> {
  const { data, error, response } = await gateway.POST("/v1/sessions/{id}/answer", {
    params: { path: { id: sessionId }, header: { "Idempotency-Key": idempotencyKey(sessionId, slotId) } },
    body: { slot_id: slotId, value: value as never, input_mode: inputMode, confidence, voice_id: voiceId ?? null, replaces },
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

export async function uploadDocument(sessionId: string, file: File, docTypeHint?: string) {
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
    body: { file: base64, doc_type_hint: docTypeHint ?? null } as never,
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

/** ADR 0006 / docs/08: served by the mock ABDM gateway (ABDM_MODE=mock, the default) — same
 * request/response shapes a real sandbox client would use, just answered locally. Known gap
 * (services/gateway/src/identity/identity.service.ts): these endpoints don't take a
 * session_id, so a successful link here identifies a *patient* record but doesn't yet attach
 * it to this intake session server-side — the ABHA result below is kept client-side in
 * IntakeContext for display only, not sent anywhere else. */
export async function identifyByAbhaQr(qrPayload: string) {
  const { data, error } = await gateway.POST("/v1/identity/abha/qr", { body: { qr_payload: qrPayload } });
  if (error) throw new Error(error.error.message);
  return data;
}

export async function requestAbhaOtp(input: { abhaNumber?: string; mobile?: string }) {
  const { data, error } = await gateway.POST("/v1/identity/abha/otp/request", {
    body: { abha_number: input.abhaNumber ?? null, mobile: input.mobile ?? null },
  });
  if (error) throw new Error(error.error.message);
  return data;
}

export async function verifyAbhaOtp(txnId: string, otp: string) {
  const { data, error } = await gateway.POST("/v1/identity/abha/otp/verify", { body: { txn_id: txnId, otp } });
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


export type LoadedSession =
  | { kind: "fresh" }
  | { kind: "resumed"; language: string; question: NextQuestion | null; answered: AnsweredLine[]; progressPercent: number }
  | { kind: "ended"; reason: EndReason };

/** What the slip's QR opens. Asks the gateway where this session is (POST /resume, which needs the slip's token):
 * new → start; part-way → carry on exactly where any device left off; spent → a kind message. */
export async function loadSession(sessionId: string, token: string | null): Promise<LoadedSession> {
  if (!token) throw new Error("Please scan the QR code on your token slip to begin.");
  const { data, error, response } = await gateway.POST("/v1/sessions/{id}/resume", {
    params: { path: { id: sessionId } },
    body: { resume_token: token },
  });
  if (error) {
    if (response.status === 410) return { kind: "ended", reason: "expired" };
    if (response.status === 404) throw new Error("We couldn't find this visit. Please ask the desk for a new token.");
    throw new Error("This link doesn't match your token. Please scan the QR code on your slip again.");
  }
  if (data.status === "completed") return { kind: "ended", reason: "finished" };
  if (data.status === "withdrawn") return { kind: "ended", reason: "withdrawn" };

  const answered: AnsweredLine[] = (data.answered ?? []).map((a) => ({
    slot_id: a.slot_id,
    question_text: a.question.text,
    question: a.question as NextQuestion,
    value: a.value,
    value_label: a.value_label,
    input_mode: a.input_mode as AnsweredLine["input_mode"],
    confidence: a.confidence,
    editable: a.editable,
  }));
  if (answered.length === 0 && !data.next_question) return { kind: "fresh" };
  const nq = data.next_question;
  return {
    kind: "resumed",
    language: data.language ?? "hi",
    question: nq && nq.slot_id ? (nq as NextQuestion) : null,
    answered,
    progressPercent: data.progress?.percent ?? 0,
  };
}

/** "Withdraw my consent": stops the session, wipes it (the gateway's TTL-wipe path, which also deletes any kept voice
 * notes) and writes the withdrawal to the audit log. */
export async function withdrawSession(sessionId: string) {
  const { error } = await gateway.DELETE("/v1/sessions/{id}", { params: { path: { id: sessionId } } });
  if (error) throw new Error(error.error.message);
}

export interface DocumentFinding {
  field: string;
  value: string;
  confidence: number | null;
}
export interface DocumentReading {
  status: "queued" | "processing" | "done" | "failed";
  findings: DocumentFinding[];
}

export async function getDocumentReading(documentId: string): Promise<DocumentReading> {
  const { data, error } = await gateway.GET("/v1/documents/{id}", { params: { path: { id: documentId } } });
  if (error) throw new Error(error.error.message);
  return {
    status: data.status as DocumentReading["status"],
    findings: (data.extractions ?? []).map((e) => ({ field: e.field, value: e.value, confidence: e.confidence ?? null })),
  };
}
