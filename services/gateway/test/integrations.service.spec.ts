import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { IntegrationsService } from "../src/integrations/integrations.service";
import { PrismaService } from "../src/prisma/prisma.service";

describe("IntegrationsService — real Postgres, docs/19-frontend-status.md's /integrations", () => {
  let prisma: PrismaService;
  let integrations: IntegrationsService;
  const createdIds: string[] = [];

  beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.$connect();
    integrations = new IntegrationsService(prisma);
  });

  afterAll(async () => {
    await prisma.providerCascadeEvent.deleteMany({ where: { id: { in: createdIds } } });
    await prisma.$disconnect();
  });

  async function makeEvent(overrides: Partial<{ outcome: "success" | "failure"; capability: string; provider: string }> = {}) {
    const row = await prisma.providerCascadeEvent.create({
      data: {
        service: "ai",
        capability: overrides.capability ?? "unit_test.probe",
        provider: overrides.provider ?? "sarvam",
        outcome: overrides.outcome ?? "success",
        latencyMs: 42,
      },
    });
    createdIds.push(row.id);
    return row;
  }

  it("lists a fallback sequence — hosted tier failed, local tier served the request", async () => {
    await makeEvent({ capability: "unit_test.cascade", provider: "sarvam", outcome: "failure" });
    await makeEvent({ capability: "unit_test.cascade", provider: "local", outcome: "success" });

    const page = await integrations.list({ limit: 200, capability: "unit_test.cascade" });
    expect(page.entries).toHaveLength(2);
    expect(page.entries.map((e) => e.outcome)).toEqual(["success", "failure"]); // newest first
    expect(page.entries.find((e) => e.provider === "sarvam")?.outcome).toBe("failure");
    expect(page.entries.find((e) => e.provider === "local")?.outcome).toBe("success");
  });

  it("filters by outcome", async () => {
    await makeEvent({ capability: "unit_test.filter_probe", outcome: "failure" });
    await makeEvent({ capability: "unit_test.filter_probe", outcome: "success" });

    const page = await integrations.list({ limit: 200, capability: "unit_test.filter_probe", outcome: "failure" });
    expect(page.entries.every((e) => e.outcome === "failure")).toBe(true);
    expect(page.entries.length).toBeGreaterThanOrEqual(1);
  });
});
