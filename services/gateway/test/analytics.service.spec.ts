import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { AnalyticsService } from "../src/analytics/analytics.service";
import { PrismaService } from "../src/prisma/prisma.service";

describe("AnalyticsService — real Postgres, docs/19-frontend-status.md's /analytics", () => {
  let prisma: PrismaService;
  let analytics: AnalyticsService;
  const patientIds: string[] = [];
  let windowStart: Date;

  beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.$connect();
    analytics = new AnalyticsService(prisma);
    windowStart = new Date();
  });

  afterAll(async () => {
    // FK order: red_flag/summary reference intake_session/visit, so they go first.
    await prisma.redFlag.deleteMany({ where: { session: { visit: { patientId: { in: patientIds } } } } });
    await prisma.summary.deleteMany({ where: { visit: { patientId: { in: patientIds } } } });
    await prisma.intakeSession.deleteMany({ where: { visit: { patientId: { in: patientIds } } } });
    await prisma.visit.deleteMany({ where: { patientId: { in: patientIds } } });
    await prisma.patient.deleteMany({ where: { id: { in: patientIds } } });
    await prisma.$disconnect();
  });

  async function makeVisit(withRedFlag: boolean, chiefComplaint: string | null) {
    const patient = await prisma.patient.create({ data: {} });
    patientIds.push(patient.id);
    const visit = await prisma.visit.create({ data: { patientId: patient.id, startedAt: new Date() } });
    const session = await prisma.intakeSession.create({
      data: { visitId: visit.id, resumeTokenHash: `test-${visit.id}`, expiresAt: new Date(Date.now() + 3600_000) },
    });

    if (withRedFlag) {
      await prisma.redFlag.create({
        data: { sessionId: session.id, ruleId: "unit_test_rule", severity: 1, quote: "test quote" },
      });
    }
    if (chiefComplaint) {
      await prisma.summary.create({
        data: { visitId: visit.id, structured: { chief_complaint: { value: chiefComplaint } } },
      });
    }
    return { visit, session };
  }

  it("counts throughput and red-flag rate over the window", async () => {
    await makeVisit(true, "Analytics test complaint");
    await makeVisit(false, "Analytics test complaint");
    await makeVisit(false, null);

    const result = await analytics.summary(windowStart);
    expect(result.opd_throughput).toBeGreaterThanOrEqual(3);
    expect(result.red_flag_rate).toBeGreaterThan(0);
    expect(result.red_flag_rate).toBeLessThanOrEqual(1);
  });

  it("surfaces the seeded complaint in top_complaints", async () => {
    const result = await analytics.summary(windowStart);
    const match = result.top_complaints.find((c) => c.complaint === "Analytics test complaint");
    expect(match?.count).toBeGreaterThanOrEqual(2);
  });

  it("returns null average_intake_seconds rather than a fabricated 0 when nothing completed", async () => {
    const farFuture = new Date(Date.now() + 3600_000 * 24 * 365);
    const result = await analytics.summary(farFuture);
    expect(result.opd_throughput).toBe(0);
    expect(result.average_intake_seconds).toBeNull();
  });

  it("computes a real average intake duration from completed sessions", async () => {
    const patient = await prisma.patient.create({ data: {} });
    patientIds.push(patient.id);
    const visit = await prisma.visit.create({ data: { patientId: patient.id } });
    const session = await prisma.intakeSession.create({
      data: { visitId: visit.id, resumeTokenHash: `test-complete-${visit.id}`, expiresAt: new Date(Date.now() + 3600_000) },
    });
    await new Promise((r) => setTimeout(r, 50));
    await prisma.intakeSession.update({ where: { id: session.id }, data: { status: "completed" } });

    const result = await analytics.summary(windowStart);
    expect(result.average_intake_seconds).not.toBeNull();
    expect(result.average_intake_seconds).toBeGreaterThan(0);
  });
});
