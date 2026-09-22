import { readdirSync, readFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { load } from "js-yaml";
import { rootLogger } from "../common/logger";
import { evaluateExpression } from "./expression";
import {
  type FiredRedFlag,
  type OntologyModule,
  OntologyModuleSchema,
  type Slot,
} from "./ontology.types";
import { checkVocabulary, loadVocabulary, type Vocabulary } from "./vocabulary";

const CHIEF_COMPLAINT_SLOT_ID = "chief_complaint";
const AYUSH_DIR = "ayush";
const VOCABULARY_SUFFIX = "-vocabulary";

/**
 * Walks packages/ontology at startup and answers "what's the next question" and "which red
 * flags just fired" as pure functions of (module, filled slots) — CLAUDE.md rule 1: the LLM
 * never decides what to ask, this does, in code. No AI service call anywhere in this file.
 */
@Injectable()
export class OntologyService implements OnModuleInit {
  private modules = new Map<string, OntologyModule>();
  /** Modules under modules/ayush/ — Prashna modules asked after the complaint module in an AYUSH
   * department. Never offered as a chief complaint. */
  private ayushModuleIds = new Set<string>();
  private ayushSlotIds = new Set<string>();
  private vocabulary!: Vocabulary;

  onModuleInit() {
    this.loadModules();
  }

  private loadModules() {
    const dir =
      process.env.ONTOLOGY_MODULES_PATH ??
      resolve(__dirname, "../../../../packages/ontology/modules");
    // recursive: true (Node 20+) so modules/ayush/*.yaml is picked up too, matching
    // packages/ontology/scripts/validate.py's modules/**/*.yaml glob.
    const files = readdirSync(dir, { recursive: true }).filter(
      (f): f is string => typeof f === "string" && (f.endsWith(".yaml") || f.endsWith(".yml")),
    );
    for (const file of files) {
      // `*-vocabulary.yaml` is the clinician-side examination vocabulary, not an interview
      // module — loaded separately below.
      if (basename(file).replace(/\.ya?ml$/, "").endsWith(VOCABULARY_SUFFIX)) continue;
      const raw = load(readFileSync(join(dir, file), "utf8"));
      const parsed = OntologyModuleSchema.safeParse(raw);
      if (!parsed.success) {
        throw new Error(
          `Ontology module ${file} failed validation: ${parsed.error.message}`,
        );
      }
      this.modules.set(parsed.data.id, parsed.data);
      if (file.split(/[\\/]/)[0] === AYUSH_DIR) this.ayushModuleIds.add(parsed.data.id);
    }
    this.assertAyushSlotIdsAreUnique();

    this.vocabulary = loadVocabulary(dir);
    const problems = checkVocabulary(this.vocabulary, [...this.modules.values()]);
    if (problems.length > 0) {
      throw new Error(`Pariksha vocabulary is inconsistent with the ontology modules:\n  ${problems.join("\n  ")}`);
    }

    rootLogger.info(
      { modules: [...this.modules.keys()], ayush: [...this.ayushModuleIds], vocabulary_status: this.vocabulary.status },
      "ontology modules loaded",
    );
  }

  /** An AYUSH session's `filled` map accumulates across modules, keyed by slot id — so an ayush
   * slot id that collided with another ayush slot, or with the complaint module the patient
   * picked, would silently overwrite an answer. Fail at startup instead. */
  private assertAyushSlotIdsAreUnique() {
    const owners = new Map<string, string>();
    for (const id of this.ayushModuleIds) {
      for (const slot of this.modules.get(id)!.slots) {
        const existing = owners.get(slot.id);
        if (existing) throw new Error(`Slot id '${slot.id}' is declared by both '${existing}' and '${id}'`);
        owners.set(slot.id, id);
        this.ayushSlotIds.add(slot.id);
      }
    }
    for (const [id, module_] of this.modules) {
      if (this.ayushModuleIds.has(id)) continue;
      for (const slot of module_.slots) {
        const owner = owners.get(slot.id);
        if (owner) throw new Error(`Slot id '${slot.id}' in '${id}' collides with AYUSH module '${owner}'`);
      }
    }
  }

  /** Every loaded module, AYUSH ones included. */
  listModules(): { id: string; label: string }[] {
    return [...this.modules.values()].map((m) => ({
      id: m.id,
      label: m.label,
    }));
  }

  /** Modules a patient can pick as their chief complaint — AYUSH Prashna modules are excluded:
   * they are asked by the state machine, never chosen. */
  listComplaintModules(): { id: string; label: string }[] {
    return this.listModules().filter((m) => !this.ayushModuleIds.has(m.id));
  }

  isAyushModule(moduleId: string): boolean {
    return this.ayushModuleIds.has(moduleId);
  }

  isAyushSlot(slotId: string): boolean {
    return this.ayushSlotIds.has(slotId);
  }

  getVocabulary(): Vocabulary {
    return this.vocabulary;
  }

  /** The Prashna modules, in interview order — the vocabulary's `prashna.groups` order. The
   * chief-complaint group has `module: null` (whatever complaint module the patient picked). */
  ayushSequence(): string[] {
    return this.vocabulary.prashna.groups.flatMap((g) => (g.module ? [g.module] : []));
  }

  /** The ordered modules an interview walks: the complaint module, then — in an AYUSH
   * department — every Prashna module. Code decides; no model is consulted (rule 1). */
  moduleOrder(complaintModuleId: string, ayushMode: boolean): string[] {
    this.getModule(complaintModuleId);
    return ayushMode ? [complaintModuleId, ...this.ayushSequence()] : [complaintModuleId];
  }

  getModule(moduleId: string): OntologyModule {
    const module_ = this.modules.get(moduleId);
    if (!module_) throw new Error(`Unknown ontology module: ${moduleId}`);
    return module_;
  }

  /**
   * Day 1 has no AI classifier for the chief complaint (docs/05-interview-engine.md phase 3
   * normally routes via a model). Standing in for it with a plain chip-select slot over the
   * loaded modules keeps chief-complaint selection code-driven rather than skipping it — this
   * synthetic slot is what /answer's chief_complaint case (see SessionsService) expects.
   */
  chiefComplaintSlot(): Slot {
    return {
      id: CHIEF_COMPLAINT_SLOT_ID,
      type: "enum",
      required: true,
      input: ["voice", "chips"],
      options: this.listComplaintModules().map((m) => ({
        value: m.id,
        label: { en: m.label },
      })),
      prompt: {
        en: "What is the main problem you're here for today?",
        hi: "आज आप मुख्य रूप से किस समस्या के लिए आए हैं?",
      },
    };
  }

  isChiefComplaintSlot(slotId: string): boolean {
    return slotId === CHIEF_COMPLAINT_SLOT_ID;
  }

  /** Slots eligible given current answers — respects ask_if. This is the progress denominator
   * and also what nextSlot() walks, so a conditional slot never blocks or inflates progress. */
  eligibleSlots(moduleId: string, filled: Record<string, unknown>): Slot[] {
    const module_ = this.getModule(moduleId);
    return module_.slots.filter(
      (slot) => !slot.ask_if || evaluateExpression(slot.ask_if, filled),
    );
  }

  /** First eligible slot with no answer yet, in module declaration order — that order *is* the
   * clinical framework (SOCRATES/OLDCARTS/DASHAVIDHA), so it is never reordered here. */
  nextSlot(moduleId: string, filled: Record<string, unknown>): Slot | null {
    const eligible = this.eligibleSlots(moduleId, filled);
    return eligible.find((slot) => !(slot.id in filled)) ?? null;
  }

  /** Where the interview goes next across an ordered module list: the first unanswered eligible
   * slot in `order[fromIndex]`, else the first in the following modules. `null` = interview over. */
  nextInOrder(
    order: string[],
    fromIndex: number,
    filled: Record<string, unknown>,
  ): { moduleId: string; moduleIndex: number; slot: Slot } | null {
    for (let i = fromIndex; i < order.length; i++) {
      const slot = this.nextSlot(order[i], filled);
      if (slot) return { moduleId: order[i], moduleIndex: i, slot };
    }
    return null;
  }

  progress(
    moduleId: string,
    filled: Record<string, unknown>,
  ): { completed: number; total: number } {
    const eligible = this.eligibleSlots(moduleId, filled);
    const completed = eligible.filter((slot) => slot.id in filled).length;
    return { completed, total: eligible.length };
  }

  /** Progress across every module of an interview — the denominator of an AYUSH session is the
   * complaint module plus all Prashna modules, so the bar never resets between modules. */
  progressAcross(
    order: string[],
    filled: Record<string, unknown>,
  ): { completed: number; total: number } {
    return order.reduce(
      (acc, id) => {
        const p = this.progress(id, filled);
        return { completed: acc.completed + p.completed, total: acc.total + p.total };
      },
      { completed: 0, total: 0 },
    );
  }

  /** `type: boolean` slots carry no `options` in the YAML (unlike enum) — this is the one place
   * that shape is decided, so the tap chips, the answered-answer label and voice parsing all
   * agree on the same two values (CLAUDE.md rule 6: every question needs a tap path). Wire values
   * are the strings "true"/"false", not JS booleans — every other slot type's option value is a
   * string (SlotOptionSchema, the QuestionOption contract), and reusing that shape means nothing
   * downstream (the WebSocket event payload, the frontend chip renderer) needs a special case. */
  booleanOptions(language = "en"): { value: "true" | "false"; label: string; icon: string }[] {
    return [
      { value: "true", label: language === "hi" ? "हाँ" : "Yes", icon: "check_circle" },
      { value: "false", label: language === "hi" ? "नहीं" : "No", icon: "cancel" },
    ];
  }

  /** How an answer reads to the patient: the option's label in their language (several joined), or the raw value. */
  answerLabel(slot: Slot, value: unknown, language = "en"): string {
    if (slot.type === "boolean") return this.booleanOptions(language).find((o) => o.value === String(value))?.label ?? String(value);
    const one = (v: unknown) => slot.options?.find((o) => o.value === v)?.label[language] ?? slot.options?.find((o) => o.value === v)?.label.en ?? String(v);
    return Array.isArray(value) ? value.map(one).join(", ") : one(value);
  }

  /**
   * The patient's OWN words for what fired a red flag — the labels of the answers the rule reads
   * ("Chest pain · Sweating"), not the rule's clinical rationale. A red-flag screen quotes the person,
   * and the nurse sees what they said. Null when the rule reads no answered slot.
   */
  patientWords(moduleId: string, ruleId: string, filled: Record<string, unknown>, language = "en"): string | null {
    const module_ = this.getModule(moduleId);
    const rule = module_.red_flags?.find((r) => r.id === ruleId);
    if (!rule) return null;
    const referenced = new Set(rule.when.match(/[a-z][a-z0-9_]*/g) ?? []);
    const parts: string[] = [];
    for (const slot of module_.slots) {
      if (!referenced.has(slot.id) || !(slot.id in filled)) continue;
      const value = filled[slot.id];
      parts.push(typeof value === "number" ? `${slot.id.replace(/_/g, " ")} ${value}${slot.range?.max ? `/${slot.range.max}` : ""}` : this.answerLabel(slot, value, language));
    }
    return parts.length > 0 ? parts.join(" · ") : null;
  }

  /** What the patient hears when the rule fires, in their language (the rule's own calm text, never a paraphrase). */
  ruleSpeak(moduleId: string, ruleId: string, language = "en"): string | null {
    const rule = this.getModule(moduleId).red_flags?.find((r) => r.id === ruleId);
    return rule?.speak ? (rule.speak[language] ?? rule.speak.en ?? null) : null;
  }

  /** The slot definition for `slotId` within the modules THIS interview walks — slot ids repeat across
   * complaint modules (`duration` is in several), so the global first match would be the wrong module's. */
  slotInOrder(order: string[], slotId: string): Slot | undefined {
    for (const id of order) {
      const slot = this.getModule(id).slots.find((s) => s.id === slotId);
      if (slot) return slot;
    }
    return undefined;
  }

  /** Deterministic predicates only, evaluated over filled slots — CLAUDE.md rule 3. `quote`
   * falls back to the rule's rationale: there is no ASR transcript to quote verbatim until
   * voice lands (Day 2), and a red flag response can never be empty in the meantime. */
  evaluateRedFlags(
    moduleId: string,
    filled: Record<string, unknown>,
  ): FiredRedFlag[] {
    const module_ = this.getModule(moduleId);
    return (module_.red_flags ?? [])
      .filter((rule) => evaluateExpression(rule.when, filled))
      .map((rule) => ({
        rule_id: rule.id,
        severity: rule.severity,
        quote: rule.rationale ?? rule.id,
      }));
  }
}
