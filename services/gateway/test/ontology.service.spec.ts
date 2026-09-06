import { beforeAll, describe, expect, it } from "vitest";
import { OntologyService } from "../src/ontology/ontology.service";

describe("OntologyService against the real packages/ontology modules", () => {
  let ontology: OntologyService;

  beforeAll(() => {
    ontology = new OntologyService();
    ontology.onModuleInit();
  });

  it("loads fever and chest_pain", () => {
    const ids = ontology.listModules().map((m) => m.id);
    expect(ids).toContain("fever");
    expect(ids).toContain("chest_pain");
  });

  it("walks fever's slots in declared order, honouring required order", () => {
    let filled: Record<string, unknown> = {};
    const order: string[] = [];
    for (let i = 0; i < 20; i++) {
      const slot = ontology.nextSlot("fever", filled);
      if (!slot) break;
      order.push(slot.id);
      filled = {
        ...filled,
        [slot.id]: slot.options?.[0]?.value ?? "placeholder",
      };
    }
    expect(order).toEqual([
      "duration",
      "pattern",
      "measured",
      "associated",
      "consciousness",
      "travel_exposure",
    ]);
  });

  it("fires fever's meningism red flag exactly on its trigger condition", () => {
    const filled = { associated: ["neck_stiff", "headache"] };
    const fired = ontology.evaluateRedFlags("fever", filled);
    expect(fired.map((f) => f.rule_id)).toContain("meningism");
  });

  it("does not fire a red flag whose predicate isn't met", () => {
    const fired = ontology.evaluateRedFlags("fever", {
      associated: ["headache"],
    });
    expect(fired.map((f) => f.rule_id)).not.toContain("meningism");
  });

  it("computes progress against eligible slots only", () => {
    const { completed, total } = ontology.progress("fever", {
      duration: "2_days",
    });
    expect(completed).toBe(1);
    expect(total).toBeGreaterThan(1);
  });

  it("exposes a chief-complaint chip-select slot listing every loaded module", () => {
    const slot = ontology.chiefComplaintSlot();
    const values = slot.options?.map((o) => o.value) ?? [];
    expect(values).toContain("fever");
    expect(values).toContain("chest_pain");
  });
});
