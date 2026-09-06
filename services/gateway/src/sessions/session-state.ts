/**
 * `intake_session.state` — the serialized interview snapshot (docs/04-data-model.md,
 * docs/01-architecture.md "State and resumability"). A plain JSON object today; forward
 * compatible with a real XState snapshot once the ai service starts phasing questions —
 * nothing outside OntologyService/SessionsService needs to know which it is.
 */
export const CHIEF_COMPLAINT_PHASE = "chief_complaint";
export const INTERVIEW_PHASE = "interview";
export const READY_TO_COMPLETE_PHASE = "ready_to_complete";

export type SessionPhase =
  | typeof CHIEF_COMPLAINT_PHASE
  | typeof INTERVIEW_PHASE
  | typeof READY_TO_COMPLETE_PHASE;

export interface SessionState {
  phase: SessionPhase;
  module_id: string | null;
  current_slot_id: string | null;
  filled: Record<string, unknown>;
}

export function initialSessionState(): SessionState {
  return {
    phase: CHIEF_COMPLAINT_PHASE,
    module_id: null,
    current_slot_id: "chief_complaint",
    filled: {},
  };
}

/** `intake_session.state` is untyped Json at the DB layer; this is the one place that casts
 * it back, so a corrupt/foreign row fails loudly instead of silently misbehaving downstream. */
export function parseSessionState(raw: unknown): SessionState {
  if (
    typeof raw !== "object" ||
    raw === null ||
    !("phase" in raw) ||
    !("filled" in raw) ||
    typeof (raw as Record<string, unknown>).filled !== "object"
  ) {
    throw new Error("intake_session.state is not a valid SessionState");
  }
  return raw as SessionState;
}
