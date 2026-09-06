import { randomUUID } from "node:crypto";
import { Injectable } from "@nestjs/common";
import type { IntakeSession } from "@prisma/client";
import { AppException } from "../common/app-exception";
import { generateResumeToken, hashResumeToken } from "../common/crypto";
import { sessionLogger } from "../common/logger";
import { OntologyService } from "../ontology/ontology.service";
import type { Slot } from "../ontology/ontology.types";
import { PrismaService } from "../prisma/prisma.service";
import { EventsGateway } from "../websocket/events.gateway";
import type {
  AnswerSubmissionDto,
  ConsentBodyDto,
  LanguageBodyDto,
  ResumeBodyDto,
} from "./dto/session.dto";
import {
  CHIEF_COMPLAINT_PHASE,
  INTERVIEW_PHASE,
  READY_TO_COMPLETE_PHASE,
  type SessionState,
  initialSessionState,
  parseSessionState,
} from "./session-state";

const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

interface ProgressPayload {
  module_id: string;
  completed_slots: number;
  total_slots: number;
  percent: number;
}

interface QuestionOptionPayload {
  value: string;
  label: string;
  icon: string | null;
}

interface NextQuestionPayload {
  slot_id: string | null;
  text: string;
  tts_url: string | null;
  input_modes: string[];
  options: QuestionOptionPayload[];
}

interface RedFlagPayload {
  rule_id: string;
  severity: "info" | "warning" | "critical";
  quote: string;
  token_no: string;
}

@Injectable()
export class SessionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ontology: OntologyService,
    private readonly events: EventsGateway,
  ) {}

  async create(publicWebUrl: string) {
    const patient = await this.prisma.patient.create({ data: {} });
    const visit = await this.prisma.visit.create({
      data: { patientId: patient.id, status: "in_intake" },
    });
    const rawToken = generateResumeToken();
    const session = await this.prisma.intakeSession.create({
      data: {
        visitId: visit.id,
        resumeTokenHash: hashResumeToken(rawToken),
        state: initialSessionState() as never,
        progress: this.chiefComplaintProgress() as never,
        expiresAt: new Date(Date.now() + SESSION_TTL_MS),
      },
    });
    sessionLogger(session.id).info({ visit_id: visit.id }, "session created");
    return {
      session_id: session.id,
      resume_token: rawToken,
      // Provisional deep link — apps/intake isn't scaffolded yet; the shape (session id +
      // resume token as query params) is what it needs to rebind on load.
      qr_url: `${publicWebUrl}/intake/${session.id}?rt=${rawToken}`,
    };
  }

  async get(sessionId: string) {
    const session = await this.findSessionOrThrow(sessionId);
    return this.toSessionPayload(session);
  }

  async resume(sessionId: string, body: ResumeBodyDto) {
    const session = await this.findSessionOrThrow(sessionId);
    if (hashResumeToken(body.resume_token) !== session.resumeTokenHash) {
      throw new AppException(
        401,
        "invalid_resume_token",
        "This resume token is not valid for this session.",
      );
    }
    const deviceId = randomUUID();
    const updated = await this.prisma.intakeSession.update({
      where: { id: sessionId },
      data: { deviceId, resumedCount: { increment: 1 } },
    });
    this.events.emitToSession(sessionId, "session.resumed", {
      device_id: deviceId,
    });
    sessionLogger(sessionId).info({ device_id: deviceId }, "session resumed");
    return this.toSessionPayload(updated);
  }

  async setLanguage(sessionId: string, body: LanguageBodyDto) {
    await this.findSessionOrThrow(sessionId);
    await this.prisma.intakeSession.update({
      where: { id: sessionId },
      data: { language: body.language },
    });
  }

  async recordConsent(sessionId: string, body: ConsentBodyDto) {
    const session = await this.findSessionOrThrow(sessionId);
    const visit = await this.prisma.visit.findUniqueOrThrow({
      where: { id: session.visitId },
    });
    await this.prisma.consent.create({
      data: {
        patientId: visit.patientId,
        sessionId,
        scopes: body.scopes,
        audioUri: body.audio_uri ?? null,
      },
    });
  }

  async submitAnswer(
    sessionId: string,
    idempotencyKey: string,
    body: AnswerSubmissionDto,
  ) {
    const session = await this.findSessionOrThrow(sessionId);
    if (session.status === "completed" || session.status === "withdrawn") {
      throw new AppException(
        409,
        "session_closed",
        "This session is no longer accepting answers.",
      );
    }

    const replay = await this.prisma.answer.findUnique({
      where: { sessionId_idempotencyKey: { sessionId, idempotencyKey } },
    });
    if (replay) {
      // Already applied on a previous attempt — recompute the (deterministic) response from
      // current state instead of advancing again. Contracts rule 4: a retry must not
      // double-advance the interview.
      const state = parseSessionState(session.state);
      return {
        next_question: this.buildNextQuestion(state),
        progress: this.currentProgress(session),
        red_flags: [] as RedFlagPayload[],
      };
    }

    const state = parseSessionState(session.state);
    if (body.slot_id !== state.current_slot_id) {
      throw new AppException(
        409,
        "slot_mismatch",
        `Expected an answer for slot '${state.current_slot_id}', got '${body.slot_id}'.`,
      );
    }

    const slot = this.currentSlot(state);
    this.validateSlotValue(slot, body.value);

    await this.prisma.answer.create({
      data: {
        sessionId,
        slotId: slot.id,
        value: body.value as never,
        inputMode: body.input_mode,
        source: body.input_mode,
        confidence: body.confidence ?? null,
        audioUri: body.audio_uri ?? null,
        idempotencyKey,
      },
    });

    const nextState = this.advanceState(state, slot.id, body.value);

    const existingRedFlags = nextState.module_id
      ? await this.prisma.redFlag.findMany({
          where: { sessionId },
          select: { ruleId: true },
        })
      : [];
    const existingRuleIds = new Set(existingRedFlags.map((f) => f.ruleId));
    const fired = nextState.module_id
      ? this.ontology.evaluateRedFlags(nextState.module_id, nextState.filled)
      : [];
    const newlyFired = fired.filter((f) => !existingRuleIds.has(f.rule_id));

    if (newlyFired.length > 0) {
      await this.prisma.redFlag.createMany({
        data: newlyFired.map((f) => ({
          sessionId,
          ruleId: f.rule_id,
          severity: f.severity,
          quote: f.quote,
        })),
        skipDuplicates: true,
      });
    }

    const progress = nextState.module_id
      ? this.ontology.progress(nextState.module_id, nextState.filled)
      : null;
    const progressPayload: ProgressPayload = progress
      ? {
          module_id: nextState.module_id!,
          completed_slots: progress.completed,
          total_slots: progress.total,
          percent:
            progress.total === 0
              ? 100
              : Math.round((progress.completed / progress.total) * 100),
        }
      : this.chiefComplaintProgress();

    await this.prisma.intakeSession.update({
      where: { id: sessionId },
      data: {
        status: session.status === "created" ? "in_progress" : session.status,
        state: nextState as never,
        progress: progressPayload as never,
      },
    });

    const visit = await this.prisma.visit.findUniqueOrThrow({
      where: { id: session.visitId },
    });
    const redFlagPayloads: RedFlagPayload[] = newlyFired.map((f) => ({
      rule_id: f.rule_id,
      severity: severityToContract(f.severity),
      quote: f.quote,
      // No queue/token wiring yet (Day 2) — session_id stands in so this field is never empty.
      token_no: visit.tokenNo ?? sessionId,
    }));

    const nextQuestion = this.buildNextQuestion(nextState);
    this.events.emitToSession(sessionId, "slot.filled", {
      slot_id: slot.id,
      value: body.value,
      confidence: body.confidence ?? 1,
    });
    this.events.emitToSession(sessionId, "question.next", {
      question: nextQuestion.text,
      tts_url: nextQuestion.tts_url,
      input_modes: nextQuestion.input_modes as never,
      options: nextQuestion.options,
    });
    for (const flag of redFlagPayloads) {
      this.events.emitToSession(sessionId, "redflag.fired", flag);
    }

    sessionLogger(sessionId).info(
      {
        slot_id: slot.id,
        module_id: nextState.module_id,
        red_flags: redFlagPayloads.map((f) => f.rule_id),
      },
      "answer submitted",
    );

    return {
      next_question: nextQuestion,
      progress: progressPayload,
      red_flags: redFlagPayloads,
    };
  }

  async complete(sessionId: string) {
    const session = await this.findSessionOrThrow(sessionId);
    const state = parseSessionState(session.state);

    const summary = await this.prisma.summary.create({
      data: {
        visitId: session.visitId,
        structured: {
          module_id: state.module_id,
          slots: state.filled,
        } as never,
        renderedEn: "Draft summary — awaiting AI summarisation.",
        renderedLocal: null,
        status: "draft",
      },
    });
    await this.prisma.intakeSession.update({
      where: { id: sessionId },
      data: { status: "completed" },
    });
    await this.prisma.visit.update({
      where: { id: session.visitId },
      data: { status: "ready" },
    });

    sessionLogger(sessionId).info(
      { summary_id: summary.id },
      "session completed",
    );
    return { summary_id: summary.id };
  }

  async purge(sessionId: string) {
    const session = await this.findSessionOrThrow(sessionId);
    await this.prisma.$transaction([
      this.prisma.redFlag.deleteMany({ where: { sessionId } }),
      this.prisma.answer.deleteMany({ where: { sessionId } }),
      this.prisma.consent.deleteMany({ where: { sessionId } }),
      this.prisma.intakeSession.update({
        where: { id: sessionId },
        data: { status: "withdrawn", state: {} as never },
      }),
      this.prisma.auditLog.create({
        data: {
          action: "session.withdraw",
          resource: "intake_session",
          resourceId: sessionId,
          actorRole: "patient",
          reason: "patient-initiated withdrawal",
        },
      }),
    ]);
    sessionLogger(sessionId).info("session purged");
  }

  // ---------------------------------------------------------------------------------------

  private async findSessionOrThrow(sessionId: string): Promise<IntakeSession> {
    const session = await this.prisma.intakeSession.findUnique({
      where: { id: sessionId },
    });
    if (!session) {
      throw new AppException(
        404,
        "session_not_found",
        `No session with id '${sessionId}'.`,
      );
    }
    return session;
  }

  private currentSlot(state: SessionState): Slot {
    if (state.phase === CHIEF_COMPLAINT_PHASE)
      return this.ontology.chiefComplaintSlot();
    if (!state.module_id || !state.current_slot_id) {
      throw new AppException(
        409,
        "session_complete",
        "This session has no more questions to answer.",
      );
    }
    const module_ = this.ontology.getModule(state.module_id);
    const slot = module_.slots.find((s) => s.id === state.current_slot_id);
    if (!slot)
      throw new Error(
        `current_slot_id '${state.current_slot_id}' not found in module '${state.module_id}'`,
      );
    return slot;
  }

  private advanceState(
    state: SessionState,
    answeredSlotId: string,
    value: unknown,
  ): SessionState {
    if (state.phase === CHIEF_COMPLAINT_PHASE) {
      const moduleId = String(value);
      this.ontology.getModule(moduleId); // throws AppException-worthy error if unknown below
      const first = this.ontology.nextSlot(moduleId, {});
      return {
        phase: first ? INTERVIEW_PHASE : READY_TO_COMPLETE_PHASE,
        module_id: moduleId,
        current_slot_id: first?.id ?? null,
        filled: {},
      };
    }
    const filled = { ...state.filled, [answeredSlotId]: value };
    const next = this.ontology.nextSlot(state.module_id!, filled);
    return {
      phase: next ? INTERVIEW_PHASE : READY_TO_COMPLETE_PHASE,
      module_id: state.module_id,
      current_slot_id: next?.id ?? null,
      filled,
    };
  }

  private validateSlotValue(slot: Slot, value: unknown): void {
    const fail = (reason: string) => {
      throw new AppException(
        400,
        "invalid_slot_value",
        `Invalid value for slot '${slot.id}': ${reason}`,
        {
          slot_id: slot.id,
          expected_type: slot.type,
        },
      );
    };
    switch (slot.type) {
      case "enum": {
        const options = slot.options?.map((o) => o.value) ?? [];
        if (typeof value !== "string" || !options.includes(value))
          fail(`must be one of ${options.join(", ")}`);
        return;
      }
      case "enum_multi": {
        const options = slot.options?.map((o) => o.value) ?? [];
        if (
          !Array.isArray(value) ||
          !value.every((v) => typeof v === "string" && options.includes(v))
        ) {
          fail(`must be an array drawn from ${options.join(", ")}`);
        }
        return;
      }
      case "number": {
        if (typeof value !== "number" || Number.isNaN(value))
          return fail("must be a number");
        if (slot.range?.min !== undefined && value < slot.range.min)
          fail(`must be >= ${slot.range.min}`);
        if (slot.range?.max !== undefined && value > slot.range.max)
          fail(`must be <= ${slot.range.max}`);
        return;
      }
      case "boolean":
        if (typeof value !== "boolean") fail("must be a boolean");
        return;
      case "string":
      case "duration":
      case "region":
        if (typeof value !== "string" || value.length === 0)
          fail("must be a non-empty string");
        return;
    }
  }

  private buildNextQuestion(
    state: SessionState,
    language = "en",
  ): NextQuestionPayload {
    if (state.phase === READY_TO_COMPLETE_PHASE) {
      return {
        slot_id: null,
        text: "That's everything for this section. Tap done to finish.",
        tts_url: null,
        input_modes: ["chips"],
        options: [{ value: "complete", label: "Done", icon: null }],
      };
    }
    const slot = this.currentSlot(state);
    return {
      slot_id: slot.id,
      text: slot.prompt[language] ?? slot.prompt.en,
      tts_url: null,
      input_modes: slot.input,
      options: (slot.options ?? []).map((o) => ({
        value: o.value,
        label: o.label[language] ?? o.label.en,
        icon: o.icon ?? null,
      })),
    };
  }

  private chiefComplaintProgress(): ProgressPayload {
    return {
      module_id: "intake",
      completed_slots: 0,
      total_slots: 1,
      percent: 0,
    };
  }

  private currentProgress(session: IntakeSession): ProgressPayload {
    return (
      (session.progress as unknown as ProgressPayload | null) ??
      this.chiefComplaintProgress()
    );
  }

  private async toSessionPayload(session: IntakeSession) {
    const [visit, consents] = await Promise.all([
      this.prisma.visit.findUniqueOrThrow({ where: { id: session.visitId } }),
      this.prisma.consent.findMany({
        where: { sessionId: session.id, revokedAt: null },
        select: { scopes: true },
      }),
    ]);
    return {
      session_id: session.id,
      status: session.status,
      language: session.language,
      progress: this.currentProgress(session),
      consent_scopes: [...new Set(consents.flatMap((c) => c.scopes))],
      patient_id: visit.patientId,
    };
  }
}

function severityToContract(
  severity: 1 | 2 | 3,
): "critical" | "warning" | "info" {
  if (severity === 1) return "critical";
  if (severity === 2) return "warning";
  return "info";
}
