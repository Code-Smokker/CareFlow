/**
 * WebSocket event names and payload types, shared by every client and the gateway.
 * Source of truth alongside openapi/*.yaml — see docs/03-api-contracts.md.
 *
 * Rooms: `session:{id}` and `department:{code}`.
 */

export type InputMode = "voice" | "tap" | "bodymap" | "proxy" | "ocr";

/**
 * UI affordances a question can be answered with — packages/ontology slot.input, not the
 * answer-provenance InputMode above. Every slot supports at least two, none requires typing
 * (docs/05-interview-engine.md).
 */
export type QuestionInputMode =
  "voice" | "chips" | "multi" | "bodymap" | "facescale" | "duration";

export type RedFlagSeverity = "info" | "warning" | "critical";

export interface QuestionOption {
  value: string;
  label: string;
  icon?: string | null;
}

export interface RedFlagPayload {
  id: string;
  rule_id: string;
  severity: RedFlagSeverity;
  quote: string;
  token_no: string;
}

export interface ExtractionPayload {
  field: string;
  value: string;
  confidence: number;
  bounding_box: { x: number; y: number; width: number; height: number } | null;
}

export interface QueueTokenPayload {
  visit_id: string;
  token_no: string;
  patient_id: string;
  department: string;
  priority: "routine" | "priority" | "urgent";
  waiting_minutes: number;
  red_flags: RedFlagPayload[];
}

/** client → server, room: `session:{id}`. Binary frame, 16 kHz PCM. */
export interface AudioChunkPayload {
  data: ArrayBuffer;
}

/** server → client, room: `session:{id}` */
export interface TranscriptPartialPayload {
  text: string;
  is_final: boolean;
}

/** server → client, room: `session:{id}` */
export interface SlotFilledPayload {
  slot_id: string;
  value: unknown;
  confidence: number;
}

/** server → client, room: `session:{id}` */
export interface QuestionNextPayload {
  question: string;
  tts_url: string | null;
  input_modes: QuestionInputMode[];
  options: QuestionOption[];
}

/** server → both rooms: `session:{id}` and `department:{code}` */
export interface RedflagFiredPayload extends RedFlagPayload {}

/** server → client, room: `department:{code}` */
export interface QueueUpdatedPayload {
  tokens: QueueTokenPayload[];
}

/** server → client, room: `session:{id}` */
export interface DocumentProcessedPayload {
  document_id: string;
  extractions: ExtractionPayload[];
}

/** server → client, room: `session:{id}` */
export interface SessionResumedPayload {
  device_id: string;
}

/**
 * Discriminated map from event name to payload type. Use with a typed emitter/listener
 * helper, e.g. `socket.on<WsEvent>("slot.filled", (p: WsEventPayload<"slot.filled">) => ...)`.
 */
export interface WsEventPayloadMap {
  "audio.chunk": AudioChunkPayload;
  "transcript.partial": TranscriptPartialPayload;
  "slot.filled": SlotFilledPayload;
  "question.next": QuestionNextPayload;
  "redflag.fired": RedflagFiredPayload;
  "queue.updated": QueueUpdatedPayload;
  "document.processed": DocumentProcessedPayload;
  "session.resumed": SessionResumedPayload;
}

export type WsEvent = keyof WsEventPayloadMap;

export type WsEventPayload<E extends WsEvent> = WsEventPayloadMap[E];

export const WS_EVENTS = [
  "audio.chunk",
  "transcript.partial",
  "slot.filled",
  "question.next",
  "redflag.fired",
  "queue.updated",
  "document.processed",
  "session.resumed",
] as const satisfies readonly WsEvent[];

export function sessionRoom(sessionId: string): `session:${string}` {
  return `session:${sessionId}`;
}

export function departmentRoom(departmentCode: string): `department:${string}` {
  return `department:${departmentCode}`;
}
