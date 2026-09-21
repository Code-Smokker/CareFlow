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
  /** The module currently being walked. In an AYUSH session this moves along `module_order`. */
  module_id: string | null;
  current_slot_id: string | null;
  /** Accumulates across modules (slot ids are unique across the modules of one interview —
   * OntologyService asserts it at startup), so red flags and progress see every answer. */
  filled: Record<string, unknown>;
  /** Set at session creation from the department's config, never by the patient. */
  ayush_mode?: boolean;
  /** The modules this interview walks, in order: the complaint module first, then (AYUSH mode)
   * the Prashna modules. Absent on sessions created before AYUSH mode existed = `[module_id]`. */
  module_order?: string[];
  module_index?: number;
}

export function initialSessionState(ayushMode = false): SessionState {
  return {
    phase: CHIEF_COMPLAINT_PHASE,
    module_id: null,
    current_slot_id: "chief_complaint",
    filled: {},
    ...(ayushMode ? { ayush_mode: true } : {}),
  };
}

/** The complaint module the patient picked — what red flags and the HPI summary belong to. */
export function complaintModuleId(state: SessionState): string | null {
  return state.module_order?.[0] ?? state.module_id;
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
