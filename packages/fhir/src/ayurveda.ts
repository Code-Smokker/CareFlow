import { type Coding, type Reference } from "./common";
import { type Observation, buildObservation } from "./observation";

/**
 * Ayurvedic case-record Observations (Prashna, Trividha, Ashtavidha, Dashavidha, Vyadhi
 * Vinishchaya). One Observation per recorded field; the field's own vocabulary id is carried as
 * a CareFlow-local code, and the NAMASTE coding is emitted on every one — with code
 * `PLACEHOLDER` plus a `namaste-placeholder` tag wherever no verified NAMASTE code exists
 * (docs/07-ayush-terminology.md's PLACEHOLDER discipline). Nothing here invents a code.
 */

export const NAMASTE_SYSTEM = "http://terminology.ayush.gov.in/namaste";
export const ICD11_MMS_SYSTEM = "http://id.who.int/icd/release/11/mms";
export const CAREFLOW_PARIKSHA_SYSTEM = "https://careflow.dev/fhir/CodeSystem/ayurveda-pariksha";
const CAREFLOW_TAG_SYSTEM = "https://careflow.dev/fhir/tag";

export const NAMASTE_PLACEHOLDER_CODE = "PLACEHOLDER";
export const NAMASTE_PLACEHOLDER_TAG: Coding = {
  system: CAREFLOW_TAG_SYSTEM,
  code: "namaste-placeholder",
  display: "NAMASTE code unverified (PLACEHOLDER)",
};
export const ICD11_MAPPING_UNREVIEWED_TAG: Coding = {
  system: CAREFLOW_TAG_SYSTEM,
  code: "icd11-mapping-unreviewed",
  display: "NAMASTE to ICD-11 mapping not yet reviewed by a clinician",
};

/** PS order of the case sheet's sections. */
export const AYURVEDA_SECTION_ORDER = [
  "prashna",
  "trividha",
  "ashtavidha",
  "dashavidha",
  "vyadhi_vinishchaya",
] as const;
export type AyurvedaSectionId = (typeof AYURVEDA_SECTION_ORDER)[number];

export const AYURVEDA_SECTION_TITLES: Record<AyurvedaSectionId, string> = {
  prashna: "Prashna — Patient-reported history",
  trividha: "Trividha Pariksha — Threefold examination",
  ashtavidha: "Ashtavidha Pariksha — Eightfold examination",
  dashavidha: "Dashavidha Pariksha — Tenfold examination",
  vyadhi_vinishchaya: "Vyadhi Vinishchaya — Assessment by the Vaidya",
};

export interface AyurvedaObservationInput {
  section: AyurvedaSectionId;
  /** Vocabulary field id (or the Prashna slot id). */
  fieldId: string;
  label: string;
  value: number | string | boolean;
  /** For a numeric value that has one (cm, kg, kg/m², beats/min). */
  unit?: string;
  /** Verified NAMASTE code for this field, or null/undefined → PLACEHOLDER. */
  namasteCode?: string | null;
  /** Provenance, rendered into Observation.note. */
  noteText?: string;
}

export interface AyurvedaDiagnosisInput {
  displayText: string;
  namaste: { code: string; display: string };
  icd11?: { code: string; display?: string } | null;
  /** False when the NAMASTE→ICD-11 mapping has no `reviewed_by` — tagged, never hidden. */
  mappingReviewed: boolean;
}

export interface AyurvedaBundleInput {
  observations: AyurvedaObservationInput[];
  diagnoses: AyurvedaDiagnosisInput[];
}

export function buildAyurvedaObservation(
  input: AyurvedaObservationInput & { id: string; patientRef: Reference; encounterRef?: Reference; effectiveDateTime?: string | null },
): Observation {
  const verified = Boolean(input.namasteCode) && input.namasteCode !== NAMASTE_PLACEHOLDER_CODE;
  return buildObservation({
    id: input.id,
    codeText: input.label,
    patientRef: input.patientRef,
    encounterRef: input.encounterRef,
    value: input.value,
    unit: input.unit,
    effectiveDateTime: input.effectiveDateTime,
    categoryCode: input.section === "prashna" ? "survey" : "exam",
    codings: [
      { system: NAMASTE_SYSTEM, code: verified ? input.namasteCode! : NAMASTE_PLACEHOLDER_CODE, display: input.label },
      { system: CAREFLOW_PARIKSHA_SYSTEM, code: input.fieldId, display: input.label },
    ],
    tags: verified ? undefined : [NAMASTE_PLACEHOLDER_TAG],
    noteText: input.noteText,
  });
}
