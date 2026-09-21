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

describe("buildOPConsultRecordBundle — Ayurvedic case record", () => {
  const base = {
    patient: { id: "p1", name: null, abhaNumber: null },
    practitionerName: "Dr. Test",
    encounterPeriodStart: "2026-09-06T10:00:00.000Z",
    chiefComplaintText: "Fever",
    hpiObservations: [],
    signedAt: "2026-09-06T10:15:00.000Z",
  };
  const ayurveda = {
    observations: [
      { section: "prashna" as const, fieldId: "agni_appetite", label: "Agni — How is your appetite?", value: "Poor, little desire to eat", noteText: "source=tap; patient-reported" },
      { section: "ashtavidha" as const, fieldId: "ashtavidha.mala.nature", label: "Mala — Nature", value: "Prakrita", noteText: "source=clinician; overrides patient-reported: Hard" },
      { section: "dashavidha" as const, fieldId: "dashavidha.pramana.bmi", label: "Pramana — BMI", value: 22.5, unit: "kg/m²", namasteCode: "REAL-CODE-1" },
    ],
    diagnoses: [
      { displayText: "Amavata", namaste: { code: "AAA-1", display: "Amavata" }, icd11: { code: "TM2-1", display: "TM2 pattern" }, mappingReviewed: false },
    ],
  };

  it("emits no Ayurvedic section and no extra resource when there is no Ayurvedic data", () => {
    const bundle = buildOPConsultRecordBundle(base);
    const composition = bundle.entry[0].resource as { section: { title: string }[] };
    expect(composition.section.map((s) => s.title).join("|")).not.toMatch(/Pariksha|Prashna|Vyadhi/);
  });

  it("flags every unverified NAMASTE code as PLACEHOLDER with a tag — and does not invent codes", () => {
    const bundle = buildOPConsultRecordBundle({ ...base, ayurveda });
    const obs = bundle.entry.map((e) => e.resource).filter((r) => r.resourceType === "Observation") as {
      code: { text: string; coding: { system: string; code: string }[] };
      meta?: { tag: { code: string }[] };
      note?: { text: string }[];
      valueQuantity?: { value: number; unit?: string };
    }[];
    const mala = obs.find((o) => o.code.text === "Mala — Nature")!;
    expect(mala.code.coding.find((c) => c.system.includes("namaste"))!.code).toBe("PLACEHOLDER");
    expect(mala.code.coding.find((c) => c.system.includes("ayurveda-pariksha"))!.code).toBe("ashtavidha.mala.nature");
    expect(mala.meta!.tag.map((t) => t.code)).toContain("namaste-placeholder");
    expect(mala.note![0].text).toContain("overrides patient-reported: Hard");

    const bmi = obs.find((o) => o.code.text === "Pramana — BMI")!;
    expect(bmi.code.coding.find((c) => c.system.includes("namaste"))!.code).toBe("REAL-CODE-1");
    expect(bmi.meta).toBeUndefined(); // a verified code carries no placeholder tag
    expect(bmi.valueQuantity).toEqual({ value: 22.5, unit: "kg/m²" });
  });

  it("puts the case sheet in the Composition in PS order, after the existing sections", () => {
    const bundle = buildOPConsultRecordBundle({ ...base, ayurveda });
    const titles = (bundle.entry[0].resource as { section: { title: string }[] }).section.map((s) => s.title);
    const ayurvedic = titles.filter((t) => /Prashna|Trividha|Ashtavidha|Dashavidha|Vyadhi/.test(t));
    expect(ayurvedic).toEqual([
      "Prashna — Patient-reported history",
      "Ashtavidha Pariksha — Eightfold examination",
      "Dashavidha Pariksha — Tenfold examination",
      "Vyadhi Vinishchaya — Assessment by the Vaidya",
    ]);
    expect(titles.indexOf(ayurvedic[0])).toBeGreaterThan(titles.indexOf("Documents"));
  });

  it("dual-codes the diagnosis the Vaidya picked and tags an unreviewed ICD-11 mapping", () => {
    const bundle = buildOPConsultRecordBundle({ ...base, ayurveda });
    const conditions = bundle.entry.map((e) => e.resource).filter((r) => r.resourceType === "Condition") as {
      code: { text: string; coding?: { system: string; code: string }[] };
      meta?: { tag: { code: string }[] };
    }[];
    const dx = conditions.find((c) => c.code.text === "Amavata")!;
    expect(dx.code.coding!.map((c) => c.code)).toEqual(["AAA-1", "TM2-1"]);
    expect(dx.meta!.tag.map((t) => t.code)).toEqual(["icd11-mapping-unreviewed"]);
  });
});
