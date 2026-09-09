import { randomUUID } from "node:crypto";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { buildConsent, urnReference } from "@careflow/fhir";
import type { Answer, IntakeSession } from "@prisma/client";
import {
  AiServiceClient,
  AiServiceUnavailable,
  type SummariseAnswer,
  type SummaryLeaf,
  type SummariseStructured,
} from "../ai/ai-service.client";
import { AppException } from "../common/app-exception";
import { FieldCipher, generateResumeToken, hashResumeToken } from "../common/crypto";
import type { Env } from "../common/env";
import { sessionLogger } from "../common/logger";
import { DeidService } from "../deid/deid.service";
import { OntologyService } from "../ontology/ontology.service";
import type { Slot } from "../ontology/ontology.types";
import { PrismaService } from "../prisma/prisma.service";
import { VisitsService } from "../visits/visits.service";
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
  id: string;
  rule_id: string;
  severity: "info" | "warning" | "critical";
  quote: string;
  token_no: string;
}

@Injectable()
export class SessionsService {
  private readonly cipher: FieldCipher;

  constructor(
    private readonly prisma: PrismaService,
    private readonly ontology: OntologyService,
    private readonly events: EventsGateway,
    private readonly aiService: AiServiceClient,
    private readonly visits: VisitsService,
    private readonly deid: DeidService,
    config: ConfigService<Env, true>,
  ) {
    this.cipher = new FieldCipher(config.get("FIELD_ENCRYPTION_KEY", { infer: true }));
  }

  /** The identifiers docs/09-security-dpdp.md names for the de-identification proxy — name,
   * ABHA number, phone, address. There's no separate physical-address field on Patient today
   * (only `abhaAddress`, the ABDM address, which is stored plaintext already — see
   * identity.service.ts), so that's the closest real field; a genuine street address isn't
   * captured anywhere yet, which is an honest gap, not something to fake here. */
  private decryptPatientIdentifiers(patient: {
    name: string | null;
    abhaNumber: string | null;
    abhaAddress: string | null;
    phone: string | null;
  }): (string | null)[] {
    return [
      patient.name ? this.cipher.decrypt(patient.name) : null,
      patient.abhaNumber ? this.cipher.decrypt(patient.abhaNumber) : null,
      patient.abhaAddress,
      patient.phone,
    ];
  }

  /** Restores any placeholder the ai service echoed back into `structured` — only string leaf
   * values can carry a placeholder (numbers/booleans/null never do), so those are the only
   * ones touched. */
  private restoreStructured(sessionId: string, structured: SummariseStructured): SummariseStructured {
    const restoreLeaf = (leaf: SummaryLeaf | null): SummaryLeaf | null =>
      leaf && typeof leaf.value === "string" ? { ...leaf, value: this.deid.restore(sessionId, leaf.value) } : leaf;
    return {
      ...structured,
      chief_complaint: restoreLeaf(structured.chief_complaint),
      history_of_present_illness: Object.fromEntries(
        Object.entries(structured.history_of_present_illness ?? {}).map(([k, v]) => [k, restoreLeaf(v)!]),
      ),
    };
  }

  async create(publicWebUrl: string) {
    const patient = await this.prisma.patient.create({ data: {} });
    // No registration/department-selection flow exists yet (ADR 0007) — every visit lands in
    // one placeholder department so the queue is genuinely usable today rather than empty.
    // Token numbering has a known benign race under concurrent creates (read-then-write, no
    // lock) — acceptable at demo scale, not for the department to actually run on.
    const department = "general";
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todaysCount = await this.prisma.visit.count({
      where: { department, startedAt: { gte: startOfToday } },
    });
    const tokenNo = `${department.toUpperCase()}-${String(todaysCount + 1).padStart(3, "0")}`;
    const visit = await this.prisma.visit.create({
      data: { patientId: patient.id, status: "in_intake", department, tokenNo },
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
      // Matches apps/intake's actual route (src/app/s/[id]/page.tsx) — this used to point at
      // /intake/{id}?rt=, a placeholder written before that app was scaffolded and never
      // updated afterward. A QR built from the old shape 404'd on scan; nothing caught it
      // because nothing renders qr_url as an actual QR code yet (see docs/19).
      qr_url: `${publicWebUrl}/s/${session.id}?token=${rawToken}`,
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

  /** Revokes exactly the requested scopes, at scope granularity, not row granularity — a single
   * `POST /consent` call can bundle several scopes onto one row, and revoking one of them must
   * not silently revoke the others it happened to be granted alongside. For each live row that
   * overlaps the requested scopes: if every one of its scopes is being revoked, the row itself
   * is marked `revokedAt` (a recorded event, never a deletion — docs/09-security-dpdp.md; full
   * erasure is the separate `purge()` path below). If only some of its scopes are being
   * revoked, the row is split: it keeps its still-live scopes, and a new row — already
   * `revokedAt` — is inserted carrying just the revoked ones, so `getConsentResource`'s
   * `category` still shows a revoked scope was once granted. Revoking an already-revoked or
   * never-granted scope is a no-op, not an error — idempotent by design. */
  async revokeConsent(sessionId: string, scopes: string[]) {
    await this.findSessionOrThrow(sessionId);
    const requested = new Set(scopes);
    const liveRows = await this.prisma.consent.findMany({
      where: { sessionId, revokedAt: null, scopes: { hasSome: scopes } },
    });

    const now = new Date();
    for (const row of liveRows) {
      const toRevoke = row.scopes.filter((s) => requested.has(s));
      const toKeep = row.scopes.filter((s) => !requested.has(s));
      if (toKeep.length === 0) {
        await this.prisma.consent.update({ where: { id: row.id }, data: { revokedAt: now } });
      } else {
        await this.prisma.$transaction([
          this.prisma.consent.update({ where: { id: row.id }, data: { scopes: toKeep } }),
          this.prisma.consent.create({
            data: {
              patientId: row.patientId,
              sessionId,
              scopes: toRevoke,
              grantedAt: row.grantedAt,
              revokedAt: now,
            },
          }),
        ]);
      }
    }
    sessionLogger(sessionId).info({ scopes }, "consent scope(s) revoked");
  }

  /** True only if a non-revoked consent row for this session grants `scope` — the one real
   * behavioural consequence of revocation today (docs/09: "refusing a scope degrades
   * gracefully"). Callers must never gate a feature on the session having *any* consent row;
   * they must check the specific scope they're about to act on. */
  async hasLiveConsentScope(sessionId: string, scope: string): Promise<boolean> {
    const count = await this.prisma.consent.count({
      where: { sessionId, revokedAt: null, scopes: { has: scope } },
    });
    return count > 0;
  }

  /** Assembles a FHIR Consent resource from every consent row ever recorded for this session —
   * `category` lists every scope ever seen (granted or revoked), `provision.code` only the
   * scopes still live, so a revoked scope stays visible on the resource rather than vanishing
   * from the record (docs/14-features.md P1 "FHIR Consent resource"). */
  async getConsentResource(sessionId: string) {
    const session = await this.findSessionOrThrow(sessionId);
    const visit = await this.prisma.visit.findUniqueOrThrow({ where: { id: session.visitId } });
    const rows = await this.prisma.consent.findMany({ where: { sessionId }, orderBy: { grantedAt: "asc" } });
    if (rows.length === 0) {
      throw new AppException(404, "no_consent_recorded", `Session '${sessionId}' has no recorded consent.`);
    }
    const allScopes = [...new Set(rows.flatMap((r) => r.scopes))];
    const grantedScopes = [...new Set(rows.filter((r) => r.revokedAt === null).flatMap((r) => r.scopes))];
    const audioUri = rows.find((r) => r.audioUri)?.audioUri ?? null;
    return buildConsent({
      id: `consent-${sessionId}`,
      patientRef: urnReference(visit.patientId),
      grantedScopes,
      allScopes,
      grantedAt: rows[0].grantedAt.toISOString(),
      audioUri,
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
      ? await this.evaluateRedFlagsPreferringAiService(sessionId, nextState.module_id, nextState.filled)
      : [];
    const newlyFired = fired.filter((f) => !existingRuleIds.has(f.rule_id));

    const newlyFiredRows =
      newlyFired.length > 0
        ? await this.prisma.redFlag.createManyAndReturn({
            data: newlyFired.map((f) => ({
              sessionId,
              ruleId: f.rule_id,
              severity: f.severity,
              quote: f.quote,
            })),
            skipDuplicates: true,
          })
        : [];

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
    const redFlagPayloads: RedFlagPayload[] = newlyFiredRows.map((row) => ({
      id: row.id,
      rule_id: row.ruleId,
      severity: severityToContract(row.severity),
      quote: row.quote ?? row.ruleId,
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
    // Queue re-prioritisation + the department-room broadcast (redflag.fired there too, plus a
    // refreshed queue.updated) — this is what makes firing a rule actually move the token,
    // not just write a row (docs/05-interview-engine.md "Red flags").
    await this.visits.applyRedFlagsToQueue(session.visitId, newlyFiredRows);

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

    const visit = await this.prisma.visit.findUniqueOrThrow({ where: { id: session.visitId } });
    const patient = await this.prisma.patient.findUniqueOrThrow({ where: { id: visit.patientId } });
    const identifiers = this.decryptPatientIdentifiers(patient);

    const answerRows = await this.prisma.answer.findMany({
      where: { sessionId },
      orderBy: { answeredAt: "asc" },
    });
    // De-identification proxy (docs/09-security-dpdp.md): every free-text answer value is
    // redacted before it crosses the process boundary to the ai service, which may be a
    // hosted model call depending on that service's own LLM_PROVIDER — the gateway can't see
    // inside that boundary, so it strips unconditionally as defense in depth.
    const summariseAnswers: SummariseAnswer[] = answerRows.map((a) => ({
      slot_id: a.slotId,
      value: typeof a.value === "string" ? this.deid.redact(sessionId, identifiers, a.value) : a.value,
      input_mode: a.inputMode,
      confidence: a.confidence,
      audio_uri: a.audioUri,
      audio_offset_ms: a.audioOffsetMs,
    }));

    let structured: SummariseStructured;
    let renderedEn: string;
    let renderedLocal: string | null;
    try {
      const result = await this.aiService.summarise(sessionId, state.module_id, session.language, summariseAnswers);
      structured = this.restoreStructured(sessionId, result.structured);
      renderedEn = this.deid.restore(sessionId, result.rendered_en);
      renderedLocal = result.rendered_local ? this.deid.restore(sessionId, result.rendered_local) : result.rendered_local;
      sessionLogger(sessionId).info("summary generated via ai service");
    } catch (err) {
      if (!(err instanceof AiServiceUnavailable)) throw err;
      sessionLogger(sessionId).warn(
        { error: err.message },
        "ai service unavailable, building summary from the local ontology walk",
      );
      // Same leaf shape the ai service would have produced (services/ai/app/summary/build.py)
      // — GET/PATCH/sign downstream don't need to know which path built this.
      structured = this.buildFallbackStructured(state.module_id, answerRows);
      renderedEn = "Draft summary — ai service unavailable, generated locally.";
      renderedLocal = null;
    }

    const summary = await this.prisma.summary.create({
      data: {
        visitId: session.visitId,
        structured: structured as never,
        renderedEn,
        renderedLocal,
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

  async purge(
    sessionId: string,
    options: { actorRole?: string; reason?: string } = {},
  ) {
    const actorRole = options.actorRole ?? "patient";
    const reason = options.reason ?? "patient-initiated withdrawal";
    await this.findSessionOrThrow(sessionId);
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
          actorRole,
          reason,
        },
      }),
    ]);
    sessionLogger(sessionId).info({ reason }, "session purged");
  }

  /** docs/09-security-dpdp.md "session data expires" — `IntakeSession.expiresAt` is set at
   * creation but nothing previously acted on it. Called on a schedule (see
   * SessionCleanupScheduler) rather than lazily on read, so a session actually disappears at
   * its TTL instead of only appearing to on the next unrelated request. Reuses `purge()`'s
   * transaction rather than duplicating it — TTL expiry is erasure, same as patient withdrawal,
   * just a different actor and reason on the audit row. */
  async purgeExpiredSessions(): Promise<number> {
    const expired = await this.prisma.intakeSession.findMany({
      where: { expiresAt: { lt: new Date() }, status: { not: "withdrawn" } },
      select: { id: true },
    });
    for (const { id } of expired) {
      await this.purge(id, { actorRole: "system", reason: "session TTL expired" });
    }
    return expired.length;
  }

  // ---------------------------------------------------------------------------------------

  /** Prefers the ai service's /evaluate-flags, falls back to the local ontology walk when it's
   * unreachable — the ai service is stateless and re-derivable from packages/ontology, so this
   * is a pure availability fallback, not a data-loss risk. Both paths implement the exact same
   * deterministic rules (CLAUDE.md rule 3): no model call in either. */
  private async evaluateRedFlagsPreferringAiService(
    sessionId: string,
    moduleId: string,
    filled: Record<string, unknown>,
  ) {
    try {
      const fired = await this.aiService.evaluateFlags(sessionId, moduleId, filled);
      sessionLogger(sessionId).debug({ module_id: moduleId }, "red flags evaluated via ai service");
      return fired;
    } catch (err) {
      if (!(err instanceof AiServiceUnavailable)) throw err;
      sessionLogger(sessionId).warn(
        { module_id: moduleId, error: err.message },
        "ai service unavailable, falling back to local ontology red-flag evaluation",
      );
      return this.ontology.evaluateRedFlags(moduleId, filled);
    }
  }

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

  private static readonly LOW_CONFIDENCE_THRESHOLD = 0.6;

  /** Mirrors services/ai/app/summary/build.py's leaf-shaping exactly (same threshold, same
   * "tap defaults to full confidence, voice/ocr defaults conservative" rule, same ref
   * convention) — used only when the ai service is unreachable at /complete time, so GET/PATCH
   * /visits/:id/summary never need to know which path built a given Summary row. */
  private buildFallbackStructured(moduleId: string | null, answerRows: Answer[]): SummariseStructured {
    const effectiveConfidence = (inputMode: string, confidence: number | null): number =>
      confidence ?? (["tap", "bodymap", "proxy"].includes(inputMode) ? 1 : 0.5);
    const ref = (inputMode: string, slotId: string, audioOffsetMs: number | null): string =>
      inputMode === "voice" && audioOffsetMs !== null ? String(audioOffsetMs) : slotId;
    const toLeaf = (label: string, value: unknown, row: Answer): SummaryLeaf => {
      const confidence = effectiveConfidence(row.inputMode, row.confidence);
      return {
        label,
        value,
        source: row.inputMode as SummaryLeaf["source"],
        confidence,
        ref: ref(row.inputMode, row.slotId, row.audioOffsetMs),
        low_confidence: confidence < SessionsService.LOW_CONFIDENCE_THRESHOLD,
      };
    };

    let module_: ReturnType<OntologyService["getModule"]> | null = null;
    if (moduleId) {
      try {
        module_ = this.ontology.getModule(moduleId);
      } catch {
        module_ = null;
      }
    }

    const chiefComplaintRow = answerRows.find((a) => a.slotId === "chief_complaint");
    const chiefComplaint = chiefComplaintRow
      ? toLeaf("Chief complaint", module_ ? module_.label : chiefComplaintRow.value, chiefComplaintRow)
      : null;

    const historyOfPresentIllness: Record<string, SummaryLeaf> = {};
    for (const row of answerRows) {
      if (row.slotId === "chief_complaint") continue;
      const slot = module_?.slots.find((s) => s.id === row.slotId);
      historyOfPresentIllness[row.slotId] = toLeaf(slot?.prompt.en ?? row.slotId, row.value, row);
    }

    return {
      chief_complaint: chiefComplaint,
      history_of_present_illness: historyOfPresentIllness,
      past_history: null,
      drugs_and_allergy: null,
      family_history: null,
      personal_history: null,
      review_of_systems: null,
      prior_investigations: [],
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

function severityToContract(severity: number): "critical" | "warning" | "info" {
  if (severity === 1) return "critical";
  if (severity === 2) return "warning";
  return "info";
}
