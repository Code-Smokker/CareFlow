import { describe, expect, it } from "vitest";
import { buildOPConsultRecordBundle } from "../src/bundle";

describe("buildOPConsultRecordBundle", () => {
  const input = {
    patient: { id: "p1", name: "Test Patient", abhaNumber: null },
    practitionerName: "Dr. Test",
    encounterPeriodStart: "2026-09-06T10:00:00.000Z",
    encounterPeriodEnd: "2026-09-06T10:10:00.000Z",
    chiefComplaintText: "Fever",
    hpiObservations: [
      { label: "Duration", value: "2_days" },
      { label: "Severity", value: 8 },
    ],
    signedAt: "2026-09-06T10:15:00.000Z",
  };

  it("puts the Composition first — required by FHIR's bdl-9 document invariant", () => {
    const bundle = buildOPConsultRecordBundle(input);
    expect(bundle.entry[0].resource.resourceType).toBe("Composition");
  });

  it("carries a Bundle.identifier — required by bdl-9", () => {
    const bundle = buildOPConsultRecordBundle(input);
    expect(bundle.identifier.system).toBeTruthy();
    expect(bundle.identifier.value).toBeTruthy();
  });

  it("includes one Observation per HPI field, and a Condition for the chief complaint", () => {
    const bundle = buildOPConsultRecordBundle(input);
    const types = bundle.entry.map((e) => e.resource.resourceType);
    expect(types.filter((t) => t === "Observation")).toHaveLength(2);
    expect(types).toContain("Condition");
  });

  it("omits Condition entirely when there's no chief complaint, rather than fabricating one", () => {
    const bundle = buildOPConsultRecordBundle({ ...input, chiefComplaintText: null });
    const types = bundle.entry.map((e) => e.resource.resourceType);
    expect(types).not.toContain("Condition");
  });

  it("Condition carries no coding array when no terminology codings were found — text-only, not fabricated", () => {
    const bundle = buildOPConsultRecordBundle(input);
    const condition = bundle.entry.find((e) => e.resource.resourceType === "Condition")!
      .resource as { code: { text: string; coding?: unknown[] } };
    expect(condition.code.text).toBe("Fever");
    expect(condition.code.coding).toBeUndefined();
  });

  it("Condition carries NAMASTE + ICD-11 codings when the terminology service found them", () => {
    const bundle = buildOPConsultRecordBundle({
      ...input,
      chiefComplaintCodings: [
        { system: "http://terminology.ayush.gov.in/namaste", code: "TEST-AAA-2.1", display: "Amavata" },
        { system: "http://id.who.int/icd/release/11/mms", code: "TM2-1", display: "TM2 pattern" },
      ],
    });
    const condition = bundle.entry.find((e) => e.resource.resourceType === "Condition")!
      .resource as { code: { text: string; coding?: { system?: string; code?: string }[] } };
    expect(condition.code.coding).toHaveLength(2);
    expect(condition.code.coding?.[0].system).toBe("http://terminology.ayush.gov.in/namaste");
  });

  it("gives empty sections (no allergies/medications/documents captured) real narrative text, not just emptyReason", () => {
    const bundle = buildOPConsultRecordBundle(input);
    const composition = bundle.entry[0].resource as { section: { title: string; text?: { div: string } }[] };
    const allergySection = composition.section.find((s) => s.title === "Allergies")!;
    expect(allergySection.text?.div).toContain("not captured");
  });

  it("throws rather than silently coercing invalid input (Zod validation genuinely runs)", () => {
    expect(() =>
      buildOPConsultRecordBundle({
        ...input,
        // Encounter.status must be one of the enum's literal values — Zod must reject this.
        hpiObservations: [{ label: "x", value: { nested: "objects aren't a valid Observation value" } as never }],
      }),
    ).toThrow();
  });
});
