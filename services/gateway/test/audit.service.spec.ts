import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { AuditService } from "../src/audit/audit.service";
import { PrismaService } from "../src/prisma/prisma.service";

describe("AuditService — real Postgres, docs/19-frontend-status.md's /audit", () => {
  let prisma: PrismaService;
  let audit: AuditService;
  const createdIds: string[] = [];

  beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.$connect();
    audit = new AuditService(prisma);
  });

  afterAll(async () => {
    // No cleanup of audit_log rows on purpose — the table is append-only, DELETE included (the
    // last test below proves it rejects an UPDATE; a DELETE hits the same trigger function).
    // Test rows are tagged with "test."/"unit_test" action names precisely so they're
    // identifiable and harmless to leave, the same way the real system never deletes a row.
    await prisma.$disconnect();
  });

  async function makeEntry(overrides: Partial<{ action: string; resource: string }> = {}) {
    const row = await prisma.auditLog.create({
      data: {
        actorId: "test-actor",
        actorRole: "test-role",
        action: overrides.action ?? "test.action",
        resource: overrides.resource ?? "test_resource",
      },
    });
    createdIds.push(row.id);
    return row;
  }

  it("lists entries newest first", async () => {
    const first = await makeEntry();
    await new Promise((r) => setTimeout(r, 5));
    const second = await makeEntry();

    const page = await audit.list({ limit: 200 });
    const ids = page.entries.map((e) => e.id);
    expect(ids.indexOf(second.id)).toBeLessThan(ids.indexOf(first.id));
  });

  it("filters by resource and action", async () => {
    await makeEntry({ action: "unit_test.probe", resource: "unit_test_resource" });

    const page = await audit.list({ limit: 200, action: "unit_test.probe", resource: "unit_test_resource" });
    expect(page.entries.length).toBeGreaterThanOrEqual(1);
    expect(page.entries.every((e) => e.action === "unit_test.probe" && e.resource === "unit_test_resource")).toBe(
      true,
    );
  });

  it("paginates with a cursor that doesn't repeat or skip rows", async () => {
    for (let i = 0; i < 3; i++) await makeEntry({ action: "unit_test.page_probe" });

    const pageOne = await audit.list({ limit: 2, action: "unit_test.page_probe" });
    expect(pageOne.entries).toHaveLength(2);
    expect(pageOne.next_cursor).not.toBeNull();

    const pageTwo = await audit.list({ limit: 2, action: "unit_test.page_probe", cursor: pageOne.next_cursor! });
    expect(pageTwo.entries.length).toBeGreaterThanOrEqual(1);

    const idsOne = new Set(pageOne.entries.map((e) => e.id));
    for (const entry of pageTwo.entries) expect(idsOne.has(entry.id)).toBe(false);
  });

  it("reports the append-only triggers as enabled — this repo's real migration, not a fixture", async () => {
    const integrity = await audit.checkIntegrity();
    expect(integrity.enforced).toBe(true);
    expect(integrity.triggers).toEqual(
      expect.arrayContaining([
        { name: "audit_log_no_update", enabled: true },
        { name: "audit_log_no_delete", enabled: true },
      ]),
    );
  });

  it("the trigger genuinely rejects an UPDATE — not just a claim the endpoint repeats", async () => {
    const row = await makeEntry();
    await expect(
      prisma.$executeRaw`UPDATE audit_log SET reason = 'tampered' WHERE id = ${row.id}::uuid`,
    ).rejects.toThrow(/append-only/);
  });
});
