import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { AiServiceUnavailable } from "../src/ai/ai-service.client";
import { OntologyService } from "../src/ontology/ontology.service";
import { PrismaService } from "../src/prisma/prisma.service";
import { SessionsService } from "../src/sessions/sessions.service";

const KEY = Buffer.alloc(32, 5).toString("base64");
const config = { get: (k: string) => (k === "FIELD_ENCRYPTION_KEY" ? KEY : k === "AYUSH_DEPARTMENTS" ? ["ayurveda"] : undefined) } as never;

/** Real Postgres (local by default — see test/setup-env.ts). No AI service: red flags fall back to the ontology walk. */
describe("resuming on another device, re-answering, expiry, language, and red-flag quotes", () => {
  let prisma: PrismaService;
  let sessions: SessionsService;
  const visitIds: string[] = [];

  beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.$connect();
    const ontology = new OntologyService();
    ontology.onModuleInit();
    const ai = { evaluateFlags: async () => { throw new AiServiceUnavailable("local fallback"); } } as never;
    sessions = new SessionsService(prisma, ontology, { emitToSession: () => undefined, emitToDepartment: () => undefined } as never, ai, { applyRedFlagsToQueue: async () => undefined, broadcastQueue: async () => undefined } as never, {} as never, config, { hasConsent: async () => false } as never);
  });

  afterAll(async () => {
    await prisma.redFlag.deleteMany({ where: { session: { visitId: { in: visitIds } } } });
    await prisma.answer.deleteMany({ where: { session: { visitId: { in: visitIds } } } });
    const found = await prisma.visit.findMany({ where: { id: { in: visitIds } }, select: { patientId: true } });
    await prisma.intakeSession.deleteMany({ where: { visitId: { in: visitIds } } });
    await prisma.visit.deleteMany({ where: { id: { in: visitIds } } });
    await prisma.patient.deleteMany({ where: { id: { in: found.map((v) => v.patientId) } } });
    await prisma.$disconnect();
  });

  const answer = (id: string, slot_id: string, value: unknown, extra: Record<string, unknown> = {}) =>
    sessions.submitAnswer(id, randomUUID(), { slot_id, value, input_mode: "tap", confidence: 1, ...extra } as never);

  async function chestPainSession(language = "hi") {
    const s = await sessions.create("http://intake.test", "general");
    visitIds.push(s.visit_id);
    await sessions.setLanguage(s.session_id, { language });
    await answer(s.session_id, "chief_complaint", "chest_pain");
    return s;
  }

  it("a second device gets the CURRENT question (in the session language) and everything answered so far", async () => {
    const s = await chestPainSession("hi");
    await answer(s.session_id, "site", "central_chest");
    await answer(s.session_id, "onset", "sudden");

    // A plain GET reveals no answers — only resume (with the slip's token) does.
    expect((await sessions.get(s.session_id)).answered).toEqual([]);
    expect((await sessions.get(s.session_id)).next_question).toBeNull();
    const view = await sessions.resume(s.session_id, { resume_token: s.resume_token });
    expect(view.status).toBe("in_progress");
    expect(view.token_no).toMatch(/^GENERAL-\d{3}$/); // what the patient app shows as "your token"
    expect(view.hospital_name).toBeTruthy();
    expect(view.next_question?.slot_id).toBe("duration");
    expect(view.next_question?.text).toMatch(/[ऀ-ॿ]/); // Devanagari — the question is in Hindi, not English
    expect(view.answered.map((a) => a.slot_id)).toEqual(["chief_complaint", "site", "onset"]);
    expect(view.answered[0]).toMatchObject({ slot_id: "chief_complaint", editable: false, value_label: expect.stringMatching(/chest/i) });
    expect(view.answered[1]).toMatchObject({ value: "central_chest", editable: true });
    expect(view.answered[2].question.options.length).toBeGreaterThan(1); // an enum answer carries its options, enough to show it again for a re-answer
  });

  it("re-answering changes the answer (latest wins), keeps the old row, and does not move the interview", async () => {
    const s = await chestPainSession("en");
    await answer(s.session_id, "site", "central_chest");
    await answer(s.session_id, "onset", "sudden");
    const before = (await sessions.resume(s.session_id, { resume_token: s.resume_token })).next_question?.slot_id;

    await answer(s.session_id, "onset", "gradual", { replaces: true });

    const after = await sessions.resume(s.session_id, { resume_token: s.resume_token });
    expect(after.answered.find((a) => a.slot_id === "onset")?.value).toBe("gradual");
    expect(after.next_question?.slot_id).toBe(before);
    expect(await prisma.answer.count({ where: { sessionId: s.session_id, slotId: "onset" } })).toBe(2); // provenance kept
  });

  it("refuses to re-answer the chief complaint, or a slot that was never answered", async () => {
    const s = await chestPainSession("en");
    await expect(answer(s.session_id, "chief_complaint", "fever", { replaces: true })).rejects.toMatchObject({ errorCode: "chief_complaint_locked" });
    await expect(answer(s.session_id, "severity", 5, { replaces: true })).rejects.toMatchObject({ errorCode: "slot_not_answered" });
  });

  it("the red flag quotes the PATIENT'S words, not the rule's rationale", async () => {
    const s = await chestPainSession("en");
    let flags: { quote: string }[] = [];
    for (const [slot, value] of [["site", "central_chest"], ["onset", "sudden"], ["duration", "2_days"], ["character", "pressure"], ["radiation", "none"], ["associated", ["sweating"]], ["exacerbating", ["rest"]], ["timing", "constant"], ["severity", 8]] as const) {
      const r = await answer(s.session_id, slot, value);
      if (r.red_flags.length) flags = r.red_flags;
    }
    expect(flags).toHaveLength(1);
    expect(flags[0].quote).toMatch(/Sweating/);
    expect(flags[0].quote).toMatch(/severity 8/);
    expect(flags[0].quote).not.toMatch(/coronary|diaphoresis|Escalate/i);
  });

  it("an expired token is 410 with a message the patient can act on; a completed one is reported, not an error", async () => {
    const s = await chestPainSession("en");
    await prisma.intakeSession.update({ where: { id: s.session_id }, data: { expiresAt: new Date(Date.now() - 1000) } });
    await expect(sessions.get(s.session_id)).rejects.toMatchObject({ errorCode: "session_expired" });
    await expect(sessions.resume(s.session_id, { resume_token: s.resume_token })).rejects.toMatchObject({ errorCode: "session_expired" });

    await prisma.intakeSession.update({ where: { id: s.session_id }, data: { status: "completed" } });
    const done = await sessions.resume(s.session_id, { resume_token: s.resume_token });
    expect(done.status).toBe("completed");
    expect(done.next_question).toBeNull();
  });

  it("an Ayurvedic question carries its classical section term as a small caption; other questions do not", async () => {
    const s = await sessions.create("http://intake.test", "ayurveda");
    visitIds.push(s.visit_id);
    await sessions.setLanguage(s.session_id, { language: "en" });
    let last = await answer(s.session_id, "chief_complaint", "fever");
    const seen = new Set<string | null>([last.next_question.module_label]);
    for (let i = 0; i < 12 && last.next_question.slot_id; i++) {
      const q = last.next_question;
      last = await answer(s.session_id, q.slot_id!, q.input_modes.includes("multi") ? [q.options[0].value] : q.options[0]?.value ?? "2_days");
      seen.add(last.next_question.module_label);
    }
    expect(seen.has(null)).toBe(true); // the fever questions
    expect([...seen].some((l) => l && /Nidana/.test(l))).toBe(true);
  });
});
