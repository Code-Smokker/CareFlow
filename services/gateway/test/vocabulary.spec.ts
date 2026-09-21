import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { load } from "js-yaml";
import { beforeAll, describe, expect, it } from "vitest";
import { OntologyService } from "../src/ontology/ontology.service";
import {
  type Vocabulary,
  VocabularySchema,
  allFields,
  checkVocabulary,
  loadVocabulary,
} from "../src/ontology/vocabulary";

const MODULES_DIR = resolve(__dirname, "../../../packages/ontology/modules");

describe("Pariksha vocabulary loader — packages/ontology/modules/ayush/pariksha-vocabulary.yaml", () => {
  let vocab: Vocabulary;
  let ontology: OntologyService;

  beforeAll(() => {
    vocab = loadVocabulary(MODULES_DIR);
    ontology = new OntologyService();
    ontology.onModuleInit();
  });

  it("is marked PENDING_EXPERT_REVIEW until a practitioner verifies it", () => {
    expect(vocab.status).toBe("PENDING_EXPERT_REVIEW");
    expect(vocab.review.verified_by ?? null).toBeNull();
  });

  it("covers every PS 26047 step, in the specified order", () => {
    expect(vocab.steps.map((s) => s.id)).toEqual(["trividha", "ashtavidha", "dashavidha", "vyadhi_vinishchaya"]);
    const ashtavidha = vocab.steps.find((s) => s.id === "ashtavidha")!;
    expect(ashtavidha.sections.map((s) => s.id)).toEqual([
      "nadi", "mutra", "mala", "jihva", "shabda", "sparsha", "drik", "akriti",
    ]);
  });

  it("gives every field and option a Sanskrit label and an English gloss", () => {
    for (const field of allFields(vocab)) {
      expect(field.label.length, field.id).toBeGreaterThan(0);
      expect(field.gloss.length, field.id).toBeGreaterThan(0);
      for (const option of field.options ?? []) {
        expect(option.label.length, `${field.id}.${option.value}`).toBeGreaterThan(0);
        expect(option.gloss.length, `${field.id}.${option.value}`).toBeGreaterThan(0);
      }
    }
  });

  it("offers exactly the options the spec names for Nadi, Mala and Agni", () => {
    const options = (id: string) => allFields(vocab).find((f) => f.id === id)!.options!.map((o) => o.value);
    expect(options("ashtavidha.nadi.type")).toEqual(["vataja", "pittaja", "kaphaja", "dwandvaja", "sannipataja"]);
    expect(options("ashtavidha.mala.nature")).toEqual(["prakrita", "baddha", "drava"]);
    expect(options("dashavidha.agni.type")).toEqual(["samagni", "vishamagni", "tikshnagni", "mandagni"]);
    expect(options("dashavidha.koshtha.type")).toEqual(["mridu", "madhyama", "krura"]);
  });

  it("takes the Vaya cut-offs from the file, with the classical source noted", () => {
    const vaya = allFields(vocab).find((f) => f.computed?.kind === "vaya_band")!;
    expect(vaya.bands?.map((b) => [b.value, b.below_age_years])).toEqual([
      ["bala", 16],
      ["madhya", 70],
      ["vriddha", null],
    ]);
    expect(vaya.source).toMatch(/Sushruta/);
  });

  it("never pre-fills Vikriti, Samprapti or a diagnosis from the patient", () => {
    for (const id of ["dashavidha.vikriti.doshas", "dashavidha.vikriti.dushyas", "vyadhi_vinishchaya.samprapti.notes", "vyadhi_vinishchaya.diagnosis.codes"]) {
      const field = allFields(vocab).find((f) => f.id === id)!;
      expect(field.patient_reference, id).toBeUndefined();
    }
  });

  it("pre-fills only Mutra colour, Mutra Daha and Mala nature — Agni, Prakriti etc. are reference only", () => {
    const prefilled = allFields(vocab)
      .filter((f) => f.patient_reference?.some((r) => r.map))
      .map((f) => f.id)
      .sort();
    expect(prefilled).toEqual(["ashtavidha.mala.nature", "ashtavidha.mutra.colour", "ashtavidha.mutra.daha"]);
  });

  it("is consistent with the interview modules it points at (slots, options, mappings)", () => {
    const modules = ontology.listModules().map((m) => ontology.getModule(m.id));
    expect(checkVocabulary(vocab, modules)).toEqual([]);
  });

  it("reports every inconsistency it finds, not just the first", () => {
    const raw = load(readFileSync(resolve(MODULES_DIR, "ayush/pariksha-vocabulary.yaml"), "utf8")) as Vocabulary;
    const broken = structuredClone(raw);
    const mala = allFields(broken).find((f) => f.id === "ashtavidha.mala.nature")!;
    mala.patient_reference![0].map = { normal: "prakrita", hard: "nope" };
    allFields(broken).find((f) => f.id === "dashavidha.koshtha.type")!.patient_reference![0].slot = "no_such_slot";
    broken.prashna.groups[1].module = "no_such_module";

    const modules = ontology.listModules().map((m) => ontology.getModule(m.id));
    const problems = checkVocabulary(broken, modules);
    expect(problems).toHaveLength(3);
    expect(problems.join("\n")).toMatch(/'nope' is not an option of the field/);
    expect(problems.join("\n")).toMatch(/unknown slot 'no_such_slot'/);
    expect(problems.join("\n")).toMatch(/unknown module 'no_such_module'/);
  });

  it("rejects a typo'd key instead of silently ignoring it (strict schema)", () => {
    const raw = load(readFileSync(resolve(MODULES_DIR, "ayush/pariksha-vocabulary.yaml"), "utf8")) as Record<string, unknown>;
    expect(VocabularySchema.safeParse({ ...raw, statuss: "VERIFIED" }).success).toBe(false);
  });
});

describe("OntologyService and the AYUSH modules", () => {
  let ontology: OntologyService;
  beforeAll(() => {
    ontology = new OntologyService();
    ontology.onModuleInit();
  });

  it("does not load the vocabulary file as an interview module", () => {
    expect(ontology.listModules().map((m) => m.id)).not.toContain("pariksha-vocabulary");
    expect(ontology.listModules().map((m) => m.id)).not.toContain("pariksha_vocabulary");
  });

  it("never offers an AYUSH module as a chief complaint", () => {
    const offered = ontology.chiefComplaintSlot().options!.map((o) => o.value);
    expect(offered).toContain("fever");
    for (const id of ["prakriti", "agni", "koshtha", "mutra", "mala", "ahara", "vihara", "nidana", "satmya", "ahara_shakti", "vyayama_shakti", "dashavidha"]) {
      expect(offered, id).not.toContain(id);
    }
  });

  it("walks the complaint module then every Prashna module, in vocabulary order, in an AYUSH department", () => {
    const order = ontology.moduleOrder("fever", true);
    expect(order).toEqual([
      "fever", "nidana", "ahara", "vihara", "agni", "koshtha", "mutra", "mala", "satmya", "ahara_shakti", "vyayama_shakti", "prakriti",
    ]);
    expect(ontology.moduleOrder("fever", false)).toEqual(["fever"]);
  });

  it("gives every Prashna question a tap path (chips or multi) with an icon and label on each option", () => {
    for (const id of ontology.ayushSequence()) {
      for (const slot of ontology.getModule(id).slots) {
        expect(slot.input.some((m) => m === "chips" || m === "multi"), slot.id).toBe(true);
        expect(slot.input, slot.id).toContain("voice");
        expect(slot.options?.length, slot.id).toBeGreaterThan(1);
        for (const option of slot.options ?? []) {
          expect(option.icon, `${slot.id}.${option.value}`).toBeTruthy();
          expect(option.label.en, `${slot.id}.${option.value}`).toBeTruthy();
          expect(option.label.hi, `${slot.id}.${option.value}`).toBeTruthy();
        }
      }
    }
  });

  it("carries the filled map across modules so progress spans the whole interview", () => {
    const order = ontology.moduleOrder("fever", true);
    let filled: Record<string, unknown> = {};
    let index = 0;
    let asked = 0;
    for (let guard = 0; guard < 200; guard++) {
      const next = ontology.nextInOrder(order, index, filled);
      if (!next) break;
      index = next.moduleIndex;
      filled = { ...filled, [next.slot.id]: next.slot.options?.[0]?.value ?? "x" };
      asked += 1;
    }
    const progress = ontology.progressAcross(order, filled);
    expect(progress.completed).toBe(progress.total);
    expect(asked).toBe(progress.total);
    expect(Object.keys(filled)).toContain("agni_appetite");
    expect(Object.keys(filled)).toContain("prakriti_temperament");
  });
});
