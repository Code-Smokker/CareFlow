import { assign, setup } from "xstate";

/** Shape of gateway's NextQuestion schema, trimmed to what the UI needs. */
export interface NextQuestion {
  slot_id: string;
  text: string;
  tts_url: string | null;
  input_modes: string[];
  options: Array<{ value: string; label: string; icon: string | null }>;
  /** An Ayurvedic question's classical section term, shown small above the plain-language question. */
  module_label?: string | null;
}

export interface RedFlag {
  id: string;
  rule_id: string;
  severity: "info" | "warning" | "critical";
  /** The patient's own words — the answers the rule read. */
  quote: string;
  token_no: string;
  /** The calm instruction to read aloud, in the patient's language. */
  speak?: string | null;
}

export interface AnsweredLine {
  slot_id: string;
  question_text: string;
  /** The question as asked, with its options — what lets a chip be tapped to change the answer. */
  question?: NextQuestion;
  value: unknown;
  /** The answer as the patient saw it (server-provided on resume; derived from `question` otherwise). */
  value_label?: string;
  input_mode: "voice" | "tap" | "bodymap" | "proxy" | "ocr";
  confidence: number;
  /** False for the chief complaint: changing it would restart the interview. */
  editable?: boolean;
}

/** "Chest pain", "2 days", "Sweating, Nausea" — an answer in the words the patient chose. */
export function lineLabel(line: AnsweredLine): string {
  if (line.value_label) return line.value_label;
  const options = line.question?.options ?? [];
  const one = (v: unknown) => options.find((o) => o.value === v)?.label ?? String(v);
  return Array.isArray(line.value) ? line.value.map(one).join(", ") : one(line.value);
}

export function lineIcon(line: AnsweredLine): string | null {
  const first = Array.isArray(line.value) ? line.value[0] : line.value;
  return line.question?.options.find((o) => o.value === first)?.icon ?? null;
}

export interface AbhaLink {
  patientId: string;
  abhaAddress: string | null;
}

export type EndReason = "expired" | "withdrawn" | "finished";

export interface IntakeContext {
  sessionId: string;
  resumeToken: string | null;
  language: string;
  currentQuestion: NextQuestion | null;
  progressPercent: number;
  pendingRedFlags: RedFlag[];
  answered: AnsweredLine[];
  /** The answer being changed, while in `reanswer`. */
  editing: AnsweredLine | null;
  endReason: EndReason | null;
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
  | { type: "SESSION_FRESH" }
  | {
      type: "SESSION_RESUMED";
      language: string;
      question: NextQuestion | null;
      answered: AnsweredLine[];
      progressPercent: number;
    }
  | { type: "SESSION_ENDED"; reason: EndReason }
  | { type: "LANGUAGE_SET"; language: string }
  | { type: "CONSENT_GIVEN" }
  | { type: "ABHA_LINKED"; abha: AbhaLink }
  | { type: "ABHA_SKIPPED" }
  | { type: "ATTENDANT_SET"; isProxy: boolean; relation: string | null }
  | { type: "CHIEF_COMPLAINT_SET"; question: NextQuestion | null; redFlags: RedFlag[]; line: AnsweredLine }
  | { type: "ANSWER_SUBMITTED"; line: AnsweredLine; question: NextQuestion | null; progressPercent: number; redFlags: RedFlag[] }
  | { type: "EDIT_ANSWER"; slotId: string }
  | { type: "EDIT_CANCELLED" }
  | { type: "ANSWER_EDITED"; line: AnsweredLine; question: NextQuestion | null; progressPercent: number; redFlags: RedFlag[] }
  | { type: "RED_FLAG_ACKNOWLEDGED" }
  | { type: "DOCUMENTS_DONE" }
  | { type: "SUBMIT_COMPLETE" }
  | { type: "WITHDRAWN" }
  | { type: "ERROR"; message: string };

const replaceLine = (list: AnsweredLine[], line: AnsweredLine) =>
  list.some((l) => l.slot_id === line.slot_id) ? list.map((l) => (l.slot_id === line.slot_id ? line : l)) : [...list, line];

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
  initial: "loading",
  context: ({ input }) => ({
    sessionId: (input as { sessionId: string }).sessionId,
    resumeToken: (input as { resumeToken?: string }).resumeToken ?? null,
    language: "hi",
    currentQuestion: null,
    progressPercent: 0,
    pendingRedFlags: [],
    answered: [],
    editing: null,
    endReason: null,
    error: null,
    abha: null,
    isProxy: false,
    attendantRelation: null,
  }),
  // Withdrawing consent is reachable from every screen after consent: it ends the session for good.
  on: {
    WITHDRAWN: { target: ".ended", actions: assign({ endReason: () => "withdrawn" as EndReason }) },
  },
  states: {
    // The token slip was scanned: the first thing this app does is ask the gateway where the session is —
    // so a second device (or a reload) resumes instead of starting over, and a spent token gets a kind message.
    loading: {
      on: {
        SESSION_FRESH: "language",
        SESSION_ENDED: { target: "ended", actions: assign({ endReason: ({ event }) => event.reason }) },
        SESSION_RESUMED: [
          {
            guard: ({ event }) => event.question === null,
            target: "documents",
            actions: assign({
              language: ({ event }) => event.language,
              answered: ({ event }) => event.answered,
              progressPercent: () => 100,
            }),
          },
          {
            target: "interview",
            actions: assign({
              language: ({ event }) => event.language,
              currentQuestion: ({ event }) => event.question,
              answered: ({ event }) => event.answered,
              progressPercent: ({ event }) => event.progressPercent,
            }),
          },
        ],
      },
    },
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
              answered: ({ context, event }) => replaceLine(context.answered, event.line),
            }),
          },
          {
            target: "interview",
            actions: assign({
              currentQuestion: ({ event }) => event.question,
              answered: ({ context, event }) => replaceLine(context.answered, event.line),
            }),
          },
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
              answered: ({ context, event }) => replaceLine(context.answered, event.line),
              currentQuestion: ({ event }) => event.question,
              progressPercent: ({ event }) => event.progressPercent,
              pendingRedFlags: ({ event }) => event.redFlags,
            }),
          },
          {
            target: "interview",
            reenter: true,
            actions: assign({
              answered: ({ context, event }) => replaceLine(context.answered, event.line),
              currentQuestion: ({ event }) => event.question,
              progressPercent: ({ event }) => event.progressPercent,
            }),
          },
        ],
        // Tap a chip to change what you said (tap-to-re-answer, beat 4).
        EDIT_ANSWER: {
          target: "reanswer",
          guard: ({ context, event }) => context.answered.some((l) => l.slot_id === event.slotId && l.editable !== false && !!l.question),
          actions: assign({ editing: ({ context, event }) => context.answered.find((l) => l.slot_id === event.slotId) ?? null }),
        },
        ERROR: { actions: assign({ error: ({ event }) => event.message }) },
      },
    },
    reanswer: {
      on: {
        EDIT_CANCELLED: { target: "interview", actions: assign({ editing: () => null }) },
        ANSWER_EDITED: [
          {
            guard: ({ event }) => event.redFlags.length > 0,
            target: "redFlag",
            actions: assign({
              answered: ({ context, event }) => replaceLine(context.answered, event.line),
              currentQuestion: ({ event }) => event.question,
              progressPercent: ({ event }) => event.progressPercent,
              pendingRedFlags: ({ event }) => event.redFlags,
              editing: () => null,
            }),
          },
          {
            target: "interview",
            actions: assign({
              answered: ({ context, event }) => replaceLine(context.answered, event.line),
              currentQuestion: ({ event }) => event.question,
              progressPercent: ({ event }) => event.progressPercent,
              editing: () => null,
            }),
          },
        ],
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
    // Read-back is review-and-confirm; changing an answer happens from the chips during the interview
    // (gateway: POST /answer with `replaces: true`), which is why it is not offered again here.
    readback: {
      on: { SUBMIT_COMPLETE: "complete" },
    },
    complete: { type: "final" },
    // Expired token, withdrawn consent, or an intake already finished on another device.
    ended: { type: "final" },
  },
});
