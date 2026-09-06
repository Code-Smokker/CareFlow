import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
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

const CHIEF_COMPLAINT_SLOT_ID = "chief_complaint";

/**
 * Walks packages/ontology at startup and answers "what's the next question" and "which red
 * flags just fired" as pure functions of (module, filled slots) — CLAUDE.md rule 1: the LLM
 * never decides what to ask, this does, in code. No AI service call anywhere in this file.
 */
@Injectable()
export class OntologyService implements OnModuleInit {
  private modules = new Map<string, OntologyModule>();

  onModuleInit() {
    this.loadModules();
  }

  private loadModules() {
    const dir =
      process.env.ONTOLOGY_MODULES_PATH ??
      resolve(__dirname, "../../../../packages/ontology/modules");
    const files = readdirSync(dir).filter(
      (f) => f.endsWith(".yaml") || f.endsWith(".yml"),
    );
    for (const file of files) {
      const raw = load(readFileSync(join(dir, file), "utf8"));
      const parsed = OntologyModuleSchema.safeParse(raw);
      if (!parsed.success) {
        throw new Error(
          `Ontology module ${file} failed validation: ${parsed.error.message}`,
        );
      }
      this.modules.set(parsed.data.id, parsed.data);
    }
    rootLogger.info(
      { modules: [...this.modules.keys()] },
      "ontology modules loaded",
    );
  }

  listModules(): { id: string; label: string }[] {
    return [...this.modules.values()].map((m) => ({
      id: m.id,
      label: m.label,
    }));
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
      options: this.listModules().map((m) => ({
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

  progress(
    moduleId: string,
    filled: Record<string, unknown>,
  ): { completed: number; total: number } {
    const eligible = this.eligibleSlots(moduleId, filled);
    const completed = eligible.filter((slot) => slot.id in filled).length;
    return { completed, total: eligible.length };
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
