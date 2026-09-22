import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PrismaService } from "../src/prisma/prisma.service";
import { SessionsService } from "../src/sessions/sessions.service";

function fakeConfig(values: Record<string, unknown>) {
  return { get: (key: string) => values[key] } as never;
}

describe("SessionsService.purgeExpiredSessions — real Postgres, docs/09 'session data expires'", () => {
  let prisma: PrismaService;
  let sessions: SessionsService;
  const testPatientIds: string[] = [];

  beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.$connect();
    sessions = new SessionsService(
      prisma,
      {} as never, // ontology — unused by purge()/purgeExpiredSessions()
      {} as never, // events
      {} as never, // aiService
      {} as never, // visits
      {} as never, // deid
      fakeConfig({ FIELD_ENCRYPTION_KEY: Buffer.alloc(32).toString("base64") }),
      { deleteForSession: async () => 0 } as never, // audio
    );
  });

  afterAll(async () => {
    await prisma.intakeSession.deleteMany({ where: { visit: { patientId: { in: testPatientIds } } } });
    await prisma.visit.deleteMany({ where: { patientId: { in: testPatientIds } } });
    await prisma.auditLog.deleteMany({ where: { resourceId: { in: testPatientIds } } });
    await prisma.patient.deleteMany({ where: { id: { in: testPatientIds } } });
    await prisma.$disconnect();
  });

  async function makeExpiredSession() {
    const patient = await prisma.patient.create({ data: {} });
    testPatientIds.push(patient.id);
    const visit = await prisma.visit.create({ data: { patientId: patient.id } });
    const session = await prisma.intakeSession.create({
      data: {
        visitId: visit.id,
        resumeTokenHash: randomUUID(),
        expiresAt: new Date(Date.now() - 60_000), // already expired
      },
    });
    return session.id;
  }

  it("purges a session past its expiresAt and records why", async () => {
    const sessionId = await makeExpiredSession();

    const purgedCount = await sessions.purgeExpiredSessions();
    expect(purgedCount).toBeGreaterThanOrEqual(1);

    const after = await prisma.intakeSession.findUniqueOrThrow({ where: { id: sessionId } });
    expect(after.status).toBe("withdrawn");

    const audit = await prisma.auditLog.findFirst({
      where: { resourceId: sessionId, action: "session.withdraw" },
      orderBy: { at: "desc" },
    });
    expect(audit?.reason).toBe("session TTL expired");
    expect(audit?.actorRole).toBe("system");
  });

  it("leaves a non-expired session untouched", async () => {
    const patient = await prisma.patient.create({ data: {} });
    testPatientIds.push(patient.id);
    const visit = await prisma.visit.create({ data: { patientId: patient.id } });
    const session = await prisma.intakeSession.create({
      data: {
        visitId: visit.id,
        resumeTokenHash: randomUUID(),
        expiresAt: new Date(Date.now() + 60_000), // not expired yet
      },
    });

    await sessions.purgeExpiredSessions();

    const after = await prisma.intakeSession.findUniqueOrThrow({ where: { id: session.id } });
    expect(after.status).not.toBe("withdrawn");
  });
});
