import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { AyurvedaService } from "../src/ayurveda/ayurveda.service";
import { OntologyService } from "../src/ontology/ontology.service";
import { PrismaService } from "../src/prisma/prisma.service";

/**
 * Real Postgres, like the rest of this suite (docs/19). NOTE the audit_log side effect: every
 * save below writes a real row to the append-only audit_log, which the trigger will not let this
 * test delete — rows are tagged `ayurveda.exam.save` with a throwaway visit id.
 */
describe("AyurvedaService — real Postgres", () => {
  let prisma: PrismaService;
  let ontology: OntologyService;
  let ayurveda: AyurvedaService;
  const patientIds: string[] = [];
  const visitIds: string[] = [];

  beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.$connect();
    ontology = new OntologyService();
    ontology.onModuleInit();
    ayurveda = new AyurvedaService(prisma, ontology, { get: () => ["ayurveda"] } as never);
  });

  afterAll(async () => {
    await prisma.ayurvedaExamField.deleteMany({ where: { visitId: { in: visitIds } } });
    await prisma.summary.deleteMany({ where: { visitId: { in: visitIds } } });
    await prisma.answer.deleteMany({ where: { session: { visitId: { in: visitIds } } } });
    await prisma.intakeSession.deleteMany({ where: { visitId: { in: visitIds } } });
    await prisma.visit.deleteMany({ where: { id: { in: visitIds } } });
    await prisma.patient.deleteMany({ where: { id: { in: patientIds } } });
    await prisma.$disconnect();
  });

  /** A visit in an AYUSH department whose patient answered by tap and by voice. */
  async function makeVisit(opts: { department?: string } = {}) {
    const patient = await prisma.patient.create({ data: {} });
    patientIds.push(patient.id);
    const visit = await prisma.visit.create({
      data: { patientId: patient.id, department: opts.department ?? "ayurveda", tokenNo: `T-${randomUUID().slice(0, 6)}` },
    });
    visitIds.push(visit.id);
    const session = await prisma.intakeSession.create({
      data: { visitId: visit.id, resumeTokenHash: randomUUID(), expiresAt: new Date(Date.now() + 3_600_000), status: "completed" },
    });
    const answer = (slotId: string, value: unknown, source: "tap" | "voice" | "proxy", confidence: number | null, audioOffsetMs?: number) =>
      prisma.answer.create({
        data: { sessionId: session.id, slotId, value: value as never, inputMode: source, source, confidence, audioOffsetMs: audioOffsetMs ?? null },
      });
    await answer("chief_complaint", "fever", "tap", 1);
    await answer("duration", "2_days", "tap", 1); // a slot id fever shares with joint_pain
    await answer("mala_consistency", "hard", "tap", 1);
    await answer("mala_frequency", "less", "tap", 1);
    await answer("mutra_burning", "yes", "voice", 0.82, 4200);
    await answer("mutra_colour", "deep_yellow", "tap", 1);
    await answer("agni_appetite", "poor", "proxy", 1);
    await answer("prakriti_body_frame", "thin", "tap", 1);
    await answer("prakriti_skin", "dry_rough", "tap", 1);
    await answer("prakriti_hunger", "sharp_intense", "tap", 1);
    return { visit, session };
  }

  const auditRows = (visitId: string) =>
    prisma.auditLog.findMany({ where: { resource: "ayurveda_exam", resourceId: visitId }, orderBy: { at: "asc" } });

  it("composes Prashna from the patient's answers, with provenance and confidence, grouped as specified", async () => {
    const { visit } = await makeVisit();
    const record = await ayurveda.getRecord(visit.id);

    expect(record.ayush_mode).toBe(true);
    expect(record.prashna.groups.map((g) => g.id)).toEqual([
      "pradhana_vedana", "nidana", "ahara", "vihara", "agni", "koshtha", "mutra", "mala", "satmya", "ahara_shakti", "vyayama_shakti", "prakriti",
    ]);
    const mutra = record.prashna.groups.find((g) => g.id === "mutra")!;
    const burning = mutra.items.find((i) => i.slot_id === "mutra_burning")!;
    expect(burning).toMatchObject({ source: "voice", confidence: 0.82, audio_offset_ms: 4200, value: "yes" });
    expect(burning.value_label).toBe("Yes, burning");
    expect(record.prashna.groups.find((g) => g.id === "agni")!.items[0]).toMatchObject({ source: "proxy" });
  });

  it("resolves the complaint module's questions and labels within THAT module, not the first module sharing the slot id", async () => {
    const { visit } = await makeVisit();
    const record = await ayurveda.getRecord(visit.id);
    const item = record.prashna.groups.find((g) => g.id === "pradhana_vedana")!.items.find((i) => i.slot_id === "duration")!;
    expect(item.question).toBe("How many days have you had the fever?"); // joint_pain's `duration` asks about pain
    expect(item.value_label).toBe("2 days");
  });

  it("scores the Prakriti questionnaire as counts per dosha, with the proxy caveat and no dominant dosha", async () => {
    const { visit } = await makeVisit();
    const { prashna } = await ayurveda.getRecord(visit.id);
    expect(prashna.prakriti_score).toMatchObject({ answered: 3, total: 5 });
    expect(prashna.prakriti_score!.counts).toEqual([
      { dosha: "vata", label: "Vata", count: 2 },
      { dosha: "pitta", label: "Pitta", count: 1 },
      { dosha: "kapha", label: "Kapha", count: 0 },
    ]);
    expect(prashna.prakriti_score!.caveat).toMatch(/NOT the validated CCRAS/);
  });

  it("offers the patient's Mala and Mutra answers as pre-fills, and Agni as reference only", async () => {
    const { visit } = await makeVisit();
    const { patient_reference: ref } = await ayurveda.getRecord(visit.id);
    expect(ref["ashtavidha.mala.nature"][0]).toMatchObject({ slot_id: "mala_consistency", suggested_value: "baddha", source: "tap" });
    expect(ref["ashtavidha.mutra.daha"][0]).toMatchObject({ suggested_value: "present", source: "voice" });
    expect(ref["dashavidha.agni.type"][0]).toMatchObject({ slot_id: "agni_appetite", suggested_value: null });
  });

  it("OVERRIDE KEEPS THE ORIGINAL: both the Vaidya's value and the patient's stay stored and visible", async () => {
    const { visit } = await makeVisit();
    const record = await ayurveda.saveExam(visit.id, "dr-test", [{ field_id: "ashtavidha.mala.nature", value: "prakrita" }]);

    const stored = record.exam.find((e) => e.field_id === "ashtavidha.mala.nature")!;
    expect(stored).toMatchObject({ value: "prakrita", source: "clinician", disposition: "overridden", recorded_by: "dr-test" });
    expect(stored.original).toMatchObject({ value: "hard", value_label: "Hard, dry, difficult to pass", source: "tap", confidence: 1 });
    // …and the patient's own Prashna answer is untouched.
    expect(record.prashna.groups.find((g) => g.id === "mala")!.items.find((i) => i.slot_id === "mala_consistency")!.value).toBe("hard");

    const row = await prisma.ayurvedaExamField.findFirstOrThrow({ where: { visitId: visit.id, fieldId: "ashtavidha.mala.nature" } });
    expect(row).toMatchObject({ originalValue: "hard", originalSource: "tap", originalSlotId: "mala_consistency", source: "clinician" });
  });

  it("records a confirmation (value equal to the patient's) as 'confirmed', keeping the voice provenance", async () => {
    const { visit } = await makeVisit();
    const record = await ayurveda.saveExam(visit.id, "dr-test", [{ field_id: "ashtavidha.mutra.daha", value: "present" }]);
    const stored = record.exam.find((e) => e.field_id === "ashtavidha.mutra.daha")!;
    expect(stored.disposition).toBe("confirmed");
    expect(stored.original).toMatchObject({ source: "voice", confidence: 0.82 });
  });

  it("re-saving with the patient's own value after an override flips it to confirmed", async () => {
    const { visit } = await makeVisit();
    await ayurveda.saveExam(visit.id, "dr-test", [{ field_id: "ashtavidha.mala.nature", value: "prakrita" }]);
    const record = await ayurveda.saveExam(visit.id, "dr-test", [{ field_id: "ashtavidha.mala.nature", value: "baddha" }]);
    expect(record.exam.find((e) => e.field_id === "ashtavidha.mala.nature")).toMatchObject({ disposition: "confirmed", value: "baddha" });
  });

  it("AUDIT: every save writes exactly one append-only row — actor, action, visit — with field ids but no values", async () => {
    const { visit } = await makeVisit();
    expect(await auditRows(visit.id)).toHaveLength(0);

    await ayurveda.saveExam(visit.id, "dr-audit", [
      { field_id: "ashtavidha.mala.nature", value: "drava" },
      { field_id: "trividha.darshana.notes", value: "Patient-specific note that must not enter the audit log" },
    ]);
    const rows = await auditRows(visit.id);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ action: "ayurveda.exam.save", resource: "ayurveda_exam", resourceId: visit.id, actorId: "dr-audit", actorRole: "clinician" });
    expect(rows[0].reason).toContain("ashtavidha.mala.nature [overridden]");
    expect(rows[0].reason).toContain("trividha.darshana.notes [entered]");
    expect(rows[0].reason).not.toContain("Patient-specific note");

    await ayurveda.saveExam(visit.id, "dr-audit", [{ field_id: "trividha.darshana.notes", value: null }]);
    const after = await auditRows(visit.id);
    expect(after).toHaveLength(2);
    expect(after[1].reason).toContain("cleared 1: trividha.darshana.notes");
  });

  it("a rejected save writes neither fields nor an audit row (one transaction)", async () => {
    const { visit } = await makeVisit();
    await expect(
      ayurveda.saveExam(visit.id, "dr-test", [
        { field_id: "ashtavidha.nadi.type", value: "vataja" },
        { field_id: "ashtavidha.nadi.rate_bpm", value: 9999 },
      ]),
    ).rejects.toMatchObject({ errorCode: "invalid_field_value" });
    await expect(ayurveda.saveExam(visit.id, "dr-test", [{ field_id: "nope.field", value: "x" }])).rejects.toMatchObject({ errorCode: "unknown_field" });

    expect(await prisma.ayurvedaExamField.count({ where: { visitId: visit.id } })).toBe(0);
    expect(await auditRows(visit.id)).toHaveLength(0);
  });

  it("supports partial saves — untouched fields keep their values", async () => {
    const { visit } = await makeVisit();
    await ayurveda.saveExam(visit.id, "dr-test", [{ field_id: "ashtavidha.nadi.type", value: "pittaja" }]);
    const record = await ayurveda.saveExam(visit.id, "dr-test", [{ field_id: "ashtavidha.nadi.rate_bpm", value: 78 }]);
    expect(record.exam.map((e) => e.field_id).sort()).toEqual(["ashtavidha.nadi.rate_bpm", "ashtavidha.nadi.type"]);
  });

  it("refuses to change a signed visit's case record", async () => {
    const { visit } = await makeVisit();
    await prisma.summary.create({ data: { visitId: visit.id, structured: {} as never, status: "signed", signedBy: "dr-test", signedAt: new Date() } });
    await expect(ayurveda.saveExam(visit.id, "dr-test", [{ field_id: "ashtavidha.nadi.type", value: "vataja" }])).rejects.toMatchObject({
      errorCode: "visit_signed",
    });
    expect((await ayurveda.getRecord(visit.id)).signed).toBe(true);
  });

  it("calculates BMI and the Vaya band from the Vaidya's entries, and reports per-step completion", async () => {
    const { visit } = await makeVisit();
    const record = await ayurveda.saveExam(visit.id, "dr-test", [
      { field_id: "dashavidha.pramana.height_cm", value: 170 },
      { field_id: "dashavidha.pramana.weight_kg", value: 65 },
      { field_id: "dashavidha.vaya.age_years", value: 42 },
    ]);
    expect(record.computed.bmi).toBe(22.5);
    expect(record.computed.vaya).toEqual({ age_years: 42, age_source: "clinician", band: "madhya" });
    const dashavidha = record.completion.find((c) => c.step_id === "dashavidha")!;
    expect(dashavidha.status).toBe("in_progress");
    expect(dashavidha.filled).toBe(3);
    expect(record.completion.find((c) => c.step_id === "trividha")!.status).toBe("not_started");
    expect(record.completion.map((c) => c.step_id)).toEqual(["prashna", "trividha", "ashtavidha", "dashavidha", "vyadhi_vinishchaya", "summary"]);
  });

  it("returns the case sheet in PS order with the override and its original on the same row", async () => {
    const { visit } = await makeVisit();
    await ayurveda.saveExam(visit.id, "dr-test", [
      { field_id: "trividha.darshana.notes", value: "No pallor." },
      { field_id: "ashtavidha.mala.nature", value: "prakrita" },
      { field_id: "dashavidha.pramana.height_cm", value: 170 },
      { field_id: "dashavidha.pramana.weight_kg", value: 65 },
      { field_id: "vyadhi_vinishchaya.samprapti.notes", value: "Vaidya's own account." },
    ]);
    const sections = await ayurveda.getSummarySections(visit.id);
    expect(sections.map((s) => s.id)).toEqual(["prashna", "trividha", "ashtavidha", "dashavidha", "vyadhi_vinishchaya"]);
    const mala = sections.find((s) => s.id === "ashtavidha")!.rows.find((r) => r.label === "Nature" && r.group?.startsWith("Mala"))!;
    expect(mala).toMatchObject({ value_label: "Prakrita", source: "clinician", disposition: "overridden" });
    expect(mala.original).toMatchObject({ value_label: "Hard, dry, difficult to pass", source: "tap" });
    expect(sections.find((s) => s.id === "dashavidha")!.rows.find((r) => r.label === "BMI")).toMatchObject({ value_label: "22.5 kg/m²", source: "computed" });
  });

  it("returns no case sheet for a visit with no Ayurvedic data at all", async () => {
    const patient = await prisma.patient.create({ data: {} });
    patientIds.push(patient.id);
    const visit = await prisma.visit.create({ data: { patientId: patient.id, department: "general" } });
    visitIds.push(visit.id);
    expect(await ayurveda.getSummarySections(visit.id)).toEqual([]);
    expect(await ayurveda.getBundleInput(visit.id)).toBeUndefined();
  });

  it("hands the FHIR builder PLACEHOLDER-coded observations plus the diagnoses the Vaidya picked", async () => {
    const { visit } = await makeVisit();
    await ayurveda.saveExam(visit.id, "dr-test", [
      { field_id: "ashtavidha.mala.nature", value: "prakrita" },
      {
        field_id: "vyadhi_vinishchaya.diagnosis.codes",
        value: [{ code: "TEST-1", display: "Test disorder", icd11: { code: "TM2-9", display: "TM2 pattern" }, mapping_reviewed: false }],
      },
    ]);
    const input = (await ayurveda.getBundleInput(visit.id))!;
    const mala = input.observations.find((o) => o.fieldId === "ashtavidha.mala.nature")!;
    expect(mala.namasteCode ?? null).toBeNull(); // → PLACEHOLDER in the bundle, never invented
    expect(mala.noteText).toContain("overrides patient-reported: Hard, dry, difficult to pass (tap");
    expect(input.observations.some((o) => o.section === "prashna" && o.fieldId === "agni_appetite")).toBe(true);
    expect(input.diagnoses).toEqual([
      { displayText: "Test disorder", namaste: { code: "TEST-1", display: "Test disorder" }, icd11: { code: "TM2-9", display: "TM2 pattern" }, mappingReviewed: false },
    ]);
  });
});
