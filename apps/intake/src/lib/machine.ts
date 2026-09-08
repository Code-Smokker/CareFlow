import { assign, setup } from "xstate";

/** Shape of gateway's NextQuestion schema, trimmed to what the UI needs. */
export interface NextQuestion {
  slot_id: string;
  text: string;
  tts_url: string | null;
  input_modes: string[];
  options: Array<{ value: string; label: string; icon: string | null }>;
}

export interface RedFlag {
  id: string;
  rule_id: string;
  severity: "info" | "warning" | "critical";
  quote: string;
  token_no: string;
}

export interface AnsweredLine {
  slot_id: string;
  question_text: string;
  value: unknown;
  input_mode: "voice" | "tap" | "bodymap" | "proxy" | "ocr";
  confidence: number;
}

export interface AbhaLink {
  patientId: string;
  abhaAddress: string | null;
}

export interface IntakeContext {
  sessionId: string;
  resumeToken: string | null;
  language: string;
  currentQuestion: NextQuestion | null;
  progressPercent: number;
  pendingRedFlags: RedFlag[];
  answered: AnsweredLine[];
  error: string | null;
  abha: AbhaLink | null;
  /** Set on the attendant screen (docs/16). When true, every downstream ANSWER_SUBMITTED /
   * CHIEF_COMPLAINT_SET forces input_mode to "proxy" before it reaches the gateway — the
   * screen never sends its own voice/tap/bodymap mode once a proxy is answering, per CLAUDE.md
   * rule 4 (provenance is about who answered, not how). */
  isProxy: boolean;
  attendantRelation: string | null;
}

export type IntakeEvent =
  | { type: "LANGUAGE_SET"; language: string }
  | { type: "CONSENT_GIVEN" }
  | { type: "ABHA_LINKED"; abha: AbhaLink }
  | { type: "ABHA_SKIPPED" }
  | { type: "ATTENDANT_SET"; isProxy: boolean; relation: string | null }
  | { type: "CHIEF_COMPLAINT_SET"; question: NextQuestion | null; redFlags: RedFlag[] }
  | { type: "ANSWER_SUBMITTED"; line: AnsweredLine; question: NextQuestion | null; progressPercent: number; redFlags: RedFlag[] }
  | { type: "RED_FLAG_ACKNOWLEDGED" }
  | { type: "DOCUMENTS_DONE" }
  | { type: "SUBMIT_COMPLETE" }
  | { type: "ERROR"; message: string };

/** Drives which screen is on-screen — question order/completeness/escalation stay server-side
 * (docs/05: "the LLM never decides what to ask" — neither does this machine; it only reacts to
 * what the gateway already decided and returned). */
export const intakeMachine = setup({
  types: {
    context: {} as IntakeContext,
    events: {} as IntakeEvent,
  },
}).createMachine({
  id: "intake",
  initial: "language",
  context: ({ input }) => ({
    sessionId: (input as { sessionId: string }).sessionId,
    resumeToken: (input as { resumeToken?: string }).resumeToken ?? null,
    language: "hi",
    currentQuestion: null,
    progressPercent: 0,
    pendingRedFlags: [],
    answered: [],
    error: null,
    abha: null,
    isProxy: false,
    attendantRelation: null,
  }),
  states: {
    language: {
      on: {
        LANGUAGE_SET: { target: "consent", actions: assign({ language: ({ event }) => event.language }) },
      },
    },
    consent: {
      on: { CONSENT_GIVEN: "abha" },
    },
    abha: {
      on: {
        ABHA_LINKED: { target: "attendant", actions: assign({ abha: ({ event }) => event.abha }) },
        ABHA_SKIPPED: "attendant",
      },
    },
    attendant: {
      on: {
        ATTENDANT_SET: {
          target: "chiefComplaint",
          actions: assign({
            isProxy: ({ event }) => event.isProxy,
            attendantRelation: ({ event }) => event.relation,
          }),
        },
      },
    },
    chiefComplaint: {
      on: {
        CHIEF_COMPLAINT_SET: [
          {
            guard: ({ event }) => event.redFlags.length > 0,
            target: "redFlag",
            actions: assign({
              currentQuestion: ({ event }) => event.question,
              pendingRedFlags: ({ event }) => event.redFlags,
            }),
          },
          { target: "interview", actions: assign({ currentQuestion: ({ event }) => event.question }) },
        ],
      },
    },
    interview: {
      always: {
        guard: ({ context }) => context.currentQuestion === null || context.currentQuestion.slot_id === null,
        target: "documents",
      },
      on: {
        ANSWER_SUBMITTED: [
          {
            guard: ({ event }) => event.redFlags.length > 0,
            target: "redFlag",
            actions: assign({
              answered: ({ context, event }) => [...context.answered, event.line],
              currentQuestion: ({ event }) => event.question,
              progressPercent: ({ event }) => event.progressPercent,
              pendingRedFlags: ({ event }) => event.redFlags,
            }),
          },
          {
            target: "interview",
            reenter: true,
            actions: assign({
              answered: ({ context, event }) => [...context.answered, event.line],
              currentQuestion: ({ event }) => event.question,
              progressPercent: ({ event }) => event.progressPercent,
            }),
          },
        ],
        ERROR: { actions: assign({ error: ({ event }) => event.message }) },
      },
    },
    redFlag: {
      on: {
        RED_FLAG_ACKNOWLEDGED: [
          {
            guard: ({ context }) => context.currentQuestion === null || context.currentQuestion.slot_id === null,
            target: "documents",
            actions: assign({ pendingRedFlags: [] }),
          },
          { target: "interview", actions: assign({ pendingRedFlags: [] }) },
        ],
      },
    },
    documents: {
      on: { DOCUMENTS_DONE: "readback" },
    },
    // "Tap any line to fix it" (docs/10) isn't wired: POST /answer only accepts the slot the
    // gateway currently expects (state.current_slot_id) and 409s on anything else, so there is
    // no endpoint that lets a patient re-open an already-answered slot after the module is
    // complete. Read-back here is review-and-confirm, not review-and-edit — a real gap, not
    // papered over with a button that would 409.
    readback: {
      on: { SUBMIT_COMPLETE: "complete" },
    },
    complete: { type: "final" },
  },
});
