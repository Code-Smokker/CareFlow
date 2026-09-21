import { resolve } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { ageFromDob, computeBmi, computeVayaBand, scorePrakriti } from "../src/ayurveda/compute";
import { type PatientAnswer, normaliseFieldValue, resolveDisposition } from "../src/ayurveda/exam-rules";
import { type Vocabulary, allFields, loadVocabulary } from "../src/ontology/vocabulary";

const MODULES_DIR = resolve(__dirname, "../../../packages/ontology/modules");

describe("override-keeps-original — the rule the Ashtavidha Mutra/Mala pre-fill depends on", () => {
  let vocab: Vocabulary;
  const field = (id: string) => allFields(vocab).find((f) => f.id === id)!;
  const answers = (...a: PatientAnswer[]) => new Map(a.map((x) => [x.slotId, x] as const));
  const hardStool: PatientAnswer = { slotId: "mala_consistency", value: "hard", source: "tap", confidence: 1 };

  beforeAll(() => {
    vocab = loadVocabulary(MODULES_DIR);
  });

  it("confirms when the Vaidya accepts the patient's value, and keeps the original", () => {
    const r = resolveDisposition(field("ashtavidha.mala.nature"), "baddha", answers(hardStool));
    expect(r.disposition).toBe("confirmed");
    expect(r.original).toEqual(hardStool);
  });

  it("overrides when the Vaidya records something else, and STILL keeps the original", () => {
    const r = resolveDisposition(field("ashtavidha.mala.nature"), "prakrita", answers(hardStool));
    expect(r.disposition).toBe("overridden");
    expect(r.original).toEqual(hardStool);
  });

  it("keeps the original's provenance, including an attendant (proxy) answer", () => {
    const proxy: PatientAnswer = { ...hardStool, source: "proxy", confidence: 0.9 };
    const r = resolveDisposition(field("ashtavidha.mala.nature"), "drava", answers(proxy));
    expect(r.original).toMatchObject({ source: "proxy", confidence: 0.9 });
  });

  it("is a plain entry when the patient gave no mappable answer", () => {
    expect(resolveDisposition(field("ashtavidha.mala.nature"), "drava", answers()).disposition).toBe("entered");
    const unmappable: PatientAnswer = { slotId: "mala_consistency", value: "something_else", source: "tap", confidence: 1 };
    expect(resolveDisposition(field("ashtavidha.mala.nature"), "drava", answers(unmappable)).disposition).toBe("entered");
  });

  it("never treats a reference-only answer as a pre-fill (Agni)", () => {
    const appetite: PatientAnswer = { slotId: "agni_appetite", value: "poor", source: "tap", confidence: 1 };
    const r = resolveDisposition(field("dashavidha.agni.type"), "mandagni", answers(appetite));
    expect(r).toEqual({ disposition: "entered", original: null });
  });

  it("maps the patient's burning answer onto Daha, and confirms or overrides it", () => {
    const burning: PatientAnswer = { slotId: "mutra_burning", value: "yes", source: "voice", confidence: 0.82 };
    expect(resolveDisposition(field("ashtavidha.mutra.daha"), "present", answers(burning)).disposition).toBe("confirmed");
    expect(resolveDisposition(field("ashtavidha.mutra.daha"), "absent", answers(burning)).disposition).toBe("overridden");
  });
});

describe("normaliseFieldValue — the server, not the client, decides what is storable", () => {
  let vocab: Vocabulary;
  const field = (id: string) => allFields(vocab).find((f) => f.id === id)!;
  beforeAll(() => {
    vocab = loadVocabulary(MODULES_DIR);
  });

  it("accepts an option from the vocabulary and rejects one that is not", () => {
    expect(normaliseFieldValue(field("ashtavidha.nadi.type"), "vataja")).toBe("vataja");
    expect(() => normaliseFieldValue(field("ashtavidha.nadi.type"), "made_up")).toThrow(/invalid_field_value|expected one of/i);
  });

  it("refuses to store a computed field", () => {
    expect(() => normaliseFieldValue(field("dashavidha.pramana.bmi"), 22)).toThrow(/calculated/);
    expect(() => normaliseFieldValue(field("dashavidha.vaya.band"), "bala")).toThrow(/calculated/);
  });

  it("enforces number ranges and treats null / empty as 'clear'", () => {
    expect(normaliseFieldValue(field("dashavidha.pramana.height_cm"), 172)).toBe(172);
    expect(() => normaliseFieldValue(field("dashavidha.pramana.height_cm"), 900)).toThrow();
    expect(normaliseFieldValue(field("trividha.darshana.notes"), "  ")).toBeNull();
    expect(normaliseFieldValue(field("dashavidha.vikriti.doshas"), [])).toBeNull();
    expect(normaliseFieldValue(field("dashavidha.vikriti.doshas"), null)).toBeNull();
  });

  it("de-duplicates a multi-select and rejects options outside the vocabulary", () => {
    expect(normaliseFieldValue(field("dashavidha.vikriti.doshas"), ["vata", "vata", "pitta"])).toEqual(["vata", "pitta"]);
    expect(() => normaliseFieldValue(field("dashavidha.vikriti.doshas"), ["vata", "ojas"])).toThrow();
  });

  it("requires a picked NAMASTE diagnosis to carry its code, display and mapping-review flag", () => {
    const pick = { code: "AAA-1", display: "Amavata", icd11: { code: "TM2-1", display: "x" }, mapping_reviewed: false };
    expect(normaliseFieldValue(field("vyadhi_vinishchaya.diagnosis.codes"), [pick])).toEqual([pick]);
    expect(() => normaliseFieldValue(field("vyadhi_vinishchaya.diagnosis.codes"), [{ display: "no code" }])).toThrow();
  });
});

describe("computed values — arithmetic over the Vaidya's own entries, never a judgement", () => {
  let vocab: Vocabulary;
  beforeAll(() => {
    vocab = loadVocabulary(MODULES_DIR);
  });

  it("calculates BMI to one decimal and returns null without both inputs", () => {
    expect(computeBmi(170, 65)).toBe(22.5);
    expect(computeBmi(160, 90)).toBe(35.2);
    expect(computeBmi(170, undefined)).toBeNull();
    expect(computeBmi(0, 60)).toBeNull();
  });

  it("bands Vaya by the vocabulary's exclusive upper bounds", () => {
    const vaya = allFields(vocab).find((f) => f.computed?.kind === "vaya_band")!;
    expect(computeVayaBand(0, vaya)).toBe("bala");
    expect(computeVayaBand(15, vaya)).toBe("bala");
    expect(computeVayaBand(16, vaya)).toBe("madhya");
    expect(computeVayaBand(69, vaya)).toBe("madhya");
    expect(computeVayaBand(70, vaya)).toBe("vriddha");
    expect(computeVayaBand(101, vaya)).toBe("vriddha");
    expect(computeVayaBand(null, vaya)).toBeNull();
  });

  it("reads Vaya from a changed vocabulary — the cut-offs are not hardcoded", () => {
    const vaya = structuredClone(allFields(vocab).find((f) => f.computed?.kind === "vaya_band")!);
    vaya.bands![0].below_age_years = 18;
    expect(computeVayaBand(17, vaya)).toBe("bala");
    expect(computeVayaBand(17, allFields(vocab).find((f) => f.computed?.kind === "vaya_band")!)).toBe("madhya");
  });

  it("computes completed years from a date of birth", () => {
    const now = new Date("2026-09-21T00:00:00Z");
    expect(ageFromDob(new Date("1990-09-21T00:00:00Z"), now)).toBe(36);
    expect(ageFromDob(new Date("1990-09-22T00:00:00Z"), now)).toBe(35);
    expect(ageFromDob(new Date("2030-01-01T00:00:00Z"), now)).toBeNull();
  });

  it("counts Prakriti answers per dosha and never names a dominant one", () => {
    const answers = new Map<string, unknown>([
      ["prakriti_body_frame", "thin"], // vata
      ["prakriti_skin", "dry_rough"], // vata
      ["prakriti_hunger", "sharp_intense"], // pitta
      ["prakriti_sleep", "deep_long"], // kapha
    ]);
    const score = scorePrakriti(vocab, answers)!;
    expect(score.counts).toEqual([
      { dosha: "vata", label: "Vata", count: 2 },
      { dosha: "pitta", label: "Pitta", count: 1 },
      { dosha: "kapha", label: "Kapha", count: 1 },
    ]);
    expect(score.answered).toBe(4);
    expect(score.total).toBe(5);
    expect(Object.keys(score)).not.toContain("dominant");
    expect(scorePrakriti(vocab, new Map())).toBeNull();
  });
});
