import { z } from "zod";

/** Mirrors packages/ontology/schema/module.schema.json. That JSON schema (validated in CI via
 * packages/ontology/scripts/validate.py) is authoritative; this is the TS-side load-time check
 * so a malformed module fails loudly here too, not just in CI. */

export const SlotTypeSchema = z.enum([
  "string",
  "number",
  "boolean",
  "enum",
  "enum_multi",
  "duration",
  "region",
]);
export type SlotType = z.infer<typeof SlotTypeSchema>;

export const OntologyInputModeSchema = z.enum([
  "voice",
  "chips",
  "multi",
  "bodymap",
  "facescale",
  "duration",
]);
export type OntologyInputMode = z.infer<typeof OntologyInputModeSchema>;

export const SlotOptionSchema = z.object({
  value: z.string(),
  label: z.record(z.string(), z.string()),
  icon: z.string().optional(),
});
export type SlotOption = z.infer<typeof SlotOptionSchema>;

export const SlotSchema = z.object({
  id: z.string(),
  type: SlotTypeSchema,
  required: z.boolean(),
  input: z.array(OntologyInputModeSchema).min(2),
  options: z.array(SlotOptionSchema).optional(),
  range: z
    .object({ min: z.number().optional(), max: z.number().optional() })
    .optional(),
  prompt: z
    .record(z.string(), z.string())
    .refine(
      (o): o is Record<string, string> & { en: string } =>
        typeof o.en === "string",
      {
        message: "prompt.en is required",
      },
    ),
  hint: z.record(z.string(), z.string()).optional(),
  examples: z
    .array(
      z.object({
        utterance: z.string(),
        lang: z.string().optional(),
        value: z.unknown(),
      }),
    )
    .optional(),
  ask_if: z.string().optional(),
});
export type Slot = z.infer<typeof SlotSchema>;

export const RedFlagRuleSchema = z.object({
  id: z.string(),
  when: z.string(),
  action: z.enum(["escalate", "flag"]),
  severity: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  rationale: z.string().optional(),
  speak: z
    .record(z.string(), z.string())
    .refine(
      (o): o is Record<string, string> & { en: string } =>
        typeof o.en === "string",
      {
        message: "speak.en is required",
      },
    )
    .optional(),
});
export type RedFlagRule = z.infer<typeof RedFlagRuleSchema>;

export const FollowupSchema = z.object({
  if: z.string(),
  load_module: z.string(),
});
export type Followup = z.infer<typeof FollowupSchema>;

export const OntologyModuleSchema = z.object({
  id: z.string(),
  label: z.string(),
  framework: z.enum(["SOCRATES", "OLDCARTS", "DASHAVIDHA", "custom"]),
  description: z.string().optional(),
  source: z.string().optional(),
  triggers: z.array(z.string()).min(1),
  slots: z.array(SlotSchema).min(1),
  red_flags: z.array(RedFlagRuleSchema).optional(),
  followups: z.array(FollowupSchema).optional(),
});
export type OntologyModule = z.infer<typeof OntologyModuleSchema>;

export interface FiredRedFlag {
  rule_id: string;
  severity: 1 | 2 | 3;
  quote: string;
}
