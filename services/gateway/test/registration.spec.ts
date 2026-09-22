import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { FieldCipher } from "../src/common/crypto";
import { DocumentsService } from "../src/documents/documents.service";
import { OntologyService } from "../src/ontology/ontology.service";
import { PrismaService } from "../src/prisma/prisma.service";
import { SessionsService } from "../src/sessions/sessions.service";
import { VisitsService } from "../src/visits/visits.service";

const KEY = Buffer.alloc(32, 7).toString("base64");
const config = (extra: Record<string, unknown> = {}) => ({ get: (k: string) => ({ FIELD_ENCRYPTION_KEY: KEY, AYUSH_DEPARTMENTS: ["ayurveda"], ...extra })[k] }) as never;

/** Real Postgres, like the rest of this suite. Rows are removed at the end; the audit row from the
 * confirm test cannot be (append-only trigger) and is tagged `extraction.confirm`. */
describe("desk registration → queue, and extraction confirmation — real Postgres", () => {
  let prisma: PrismaService;
  let sessions: SessionsService;
  let visits: VisitsService;
  const visitIds: string[] = [];

  beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.$connect();
    const ontology = new OntologyService();
    ontology.onModuleInit();
    sessions = new SessionsService(prisma, ontology, {} as never, {} as never, { broadcastQueue: async () => undefined } as never, {} as never, config(), {} as never);
    visits = new VisitsService(prisma, {} as never, config(), {} as never, {} as never, {} as never, {} as never, {} as never);
  });

  afterAll(async () => {
    await prisma.extraction.deleteMany({ where: { document: { session: { visitId: { in: visitIds } } } } });
    await prisma.document.deleteMany({ where: { session: { visitId: { in: visitIds } } } });
    const found = await prisma.visit.findMany({ where: { id: { in: visitIds } }, select: { patientId: true } });
    await prisma.intakeSession.deleteMany({ where: { visitId: { in: visitIds } } });
    await prisma.visit.deleteMany({ where: { id: { in: visitIds } } });
    await prisma.patient.deleteMany({ where: { id: { in: found.map((v) => v.patientId) } } });
    await prisma.$disconnect();
  });

  it("stores name and phone encrypted, and the queue returns them decrypted with the phone masked", async () => {
    const r = await sessions.create("http://intake.test", "ayurveda", { name: "Reg Test Patient", age_years: 40, sex: "female", phone: "9876543210" });
    visitIds.push(r.visit_id);

    const row = await prisma.patient.findFirstOrThrow({ where: { visits: { some: { id: r.visit_id } } } });
    expect(row.name).not.toContain("Reg Test");
    expect(row.phone).not.toContain("9876");
    expect(new FieldCipher(KEY).decrypt(row.name!)).toBe("Reg Test Patient");

    const token = (await visits.getQueue()).find((t) => t.visit_id === r.visit_id)!;
    expect(token.patient).toEqual({ name: "Reg Test Patient", age_years: 40, sex: "female", phone_masked: "••••••3210" });
    expect(token.session_id).toBe(r.session_id);
    expect(token.intake_status).toBe("in_intake");
  });

  it("issues a slip whose QR is a PNG data URL of the intake link, in the department's mode", async () => {
    const r = await sessions.create("http://intake.test", "ayurveda", { name: "Slip Test" });
    visitIds.push(r.visit_id);
    expect(r.qr_url).toBe(`http://intake.test/s/${r.session_id}?token=${r.resume_token}`);
    expect(r.qr_data_url).toMatch(/^data:image\/png;base64,/);
    expect(r.ayush_mode).toBe(true);
    expect(r.token_no).toMatch(/^AYURVEDA-\d{3}$/);
  });

  it("leaves a walk-in with no registration details as honestly unknown, never a placeholder name", async () => {
    const r = await sessions.create("http://intake.test");
    visitIds.push(r.visit_id);
    const token = (await visits.getQueue()).find((t) => t.visit_id === r.visit_id)!;
    expect(token.patient).toEqual({ name: null, age_years: null, sex: null, phone_masked: null });
    expect(r.ayush_mode).toBe(false);
  });

  it("lists general plus the configured AYUSH departments", () => {
    expect(sessions.listDepartments()).toEqual([
      { id: "general", label: "General OPD", ayush_mode: false },
      { id: "ayurveda", label: "Ayurveda (AYUSH)", ayush_mode: true },
    ]);
  });

  it("confirming an extracted value records who, is refused the second time, and writes an audit row", async () => {
    const r = await sessions.create("http://intake.test", "general", { name: "Doc Test" });
    visitIds.push(r.visit_id);
    const doc = await prisma.document.create({ data: { sessionId: r.session_id, type: "prescription", storageUri: "s3://x/y", ocrStatus: "done" } });
    const ex = await prisma.extraction.create({ data: { documentId: doc.id, entityType: "medication", payload: { field: "drug", value: "Paracetamol" }, confidence: 0.6 } });
    const docs = new DocumentsService(prisma, {} as never, {} as never, {} as never);

    const before = (await docs.listForVisit(r.visit_id))[0].extractions[0];
    expect(before.confirmed_by).toBeNull();

    const out = await docs.confirmExtraction(ex.id, "dr-reg-test", "clinician");
    expect(out.confirmed_by).toBe("dr-reg-test");
    expect((await docs.listForVisit(r.visit_id))[0].extractions[0].confirmed_by).toBe("dr-reg-test");
    await expect(docs.confirmExtraction(ex.id, "someone-else", "clinician")).rejects.toThrow(/already confirmed/);

    const audit = await prisma.auditLog.findMany({ where: { action: "extraction.confirm", resourceId: ex.id } });
    expect(audit).toHaveLength(1);
    expect(audit[0]).toMatchObject({ actorId: "dr-reg-test", actorRole: "clinician", resource: "extraction" });
  });
});
