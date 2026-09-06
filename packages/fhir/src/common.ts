/**
 * Shared FHIR R4 primitives. Deliberately minimal — only the fields CareFlow's builders
 * actually populate, not the full base-spec surface of each datatype. Extend as a real field
 * is needed, never speculatively.
 */

import { z } from "zod";

export const CodingSchema = z.object({
  system: z.string().optional(),
  code: z.string().optional(),
  display: z.string().optional(),
});
export type Coding = z.infer<typeof CodingSchema>;

export const CodeableConceptSchema = z.object({
  coding: z.array(CodingSchema).optional(),
  text: z.string().optional(),
});
export type CodeableConcept = z.infer<typeof CodeableConceptSchema>;

export const ReferenceSchema = z.object({
  reference: z.string(),
  display: z.string().optional(),
});
export type Reference = z.infer<typeof ReferenceSchema>;

export const PeriodSchema = z.object({
  start: z.string().optional(),
  end: z.string().optional(),
});
export type Period = z.infer<typeof PeriodSchema>;

export const IdentifierSchema = z.object({
  system: z.string().optional(),
  value: z.string(),
});
export type Identifier = z.infer<typeof IdentifierSchema>;

/** `urn:uuid:<id>` — the reference scheme this package uses throughout for document-bundle
 * internal references, matching each entry's own `fullUrl`. */
export function urnReference(id: string, display?: string): Reference {
  return { reference: `urn:uuid:${id}`, display };
}
