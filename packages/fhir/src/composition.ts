import { z } from "zod";
import { CodeableConceptSchema, ReferenceSchema } from "./common";

const NarrativeSchema = z.object({
  status: z.enum(["generated", "extensions", "additional", "empty"]),
  div: z.string(),
});

const SectionSchema = z.object({
  title: z.string(),
  code: CodeableConceptSchema.optional(),
  text: NarrativeSchema.optional(),
  entry: z.array(ReferenceSchema).optional(),
  emptyReason: CodeableConceptSchema.optional(),
});

export const CompositionSchema = z.object({
  resourceType: z.literal("Composition"),
  id: z.string(),
  status: z.enum(["preliminary", "final", "amended", "entered-in-error"]),
  type: CodeableConceptSchema,
  subject: ReferenceSchema,
  encounter: ReferenceSchema.optional(),
  date: z.string(),
  author: z.array(ReferenceSchema),
  title: z.string(),
  section: z.array(SectionSchema).optional(),
});
export type Composition = z.infer<typeof CompositionSchema>;

/** SNOMED CT 371530004 "Clinical consultation report" — the code the NRCES ABDM FHIR IG uses
 * for OPConsultRecord's Composition.type per public examples. PLACEHOLDER discipline
 * (docs/07-ayush-terminology.md, docs/08-abdm-fhir.md): verify against the current NRCES IG
 * before relying on this for a real submission, same as every other code in this codebase
 * that hasn't been checked against its primary source this sprint. */
export const OP_CONSULT_RECORD_TYPE = {
  coding: [{ system: "http://snomed.info/sct", code: "371530004", display: "Clinical consultation report" }],
};

export interface CompositionSection {
  title: string;
  entryRefs?: z.infer<typeof ReferenceSchema>[];
}

export interface BuildCompositionInput {
  id: string;
  patientRef: z.infer<typeof ReferenceSchema>;
  encounterRef?: z.infer<typeof ReferenceSchema>;
  authorRefs: z.infer<typeof ReferenceSchema>[];
  date: string;
  title?: string;
  sections: CompositionSection[];
}

export function buildComposition(input: BuildCompositionInput): Composition {
  return CompositionSchema.parse({
    resourceType: "Composition",
    id: input.id,
    status: "final",
    type: OP_CONSULT_RECORD_TYPE,
    subject: input.patientRef,
    encounter: input.encounterRef,
    date: input.date,
    author: input.authorRefs,
    title: input.title ?? "OP Consultation Record",
    section: input.sections.map((s) => {
      const hasEntries = Boolean(s.entryRefs && s.entryRefs.length > 0);
      return {
        title: s.title,
        entry: hasEntries ? s.entryRefs : undefined,
        emptyReason: hasEntries ? undefined : { text: "Not captured in this version" },
        // FHIR's cmp-1 invariant requires text, entries, or sub-sections — an emptyReason
        // alone doesn't satisfy it, so an empty section still needs real narrative.
        text: hasEntries
          ? undefined
          : {
              status: "empty" as const,
              div: `<div xmlns="http://www.w3.org/1999/xhtml">${s.title}: not captured in this version.</div>`,
            },
      };
    }),
  });
}
