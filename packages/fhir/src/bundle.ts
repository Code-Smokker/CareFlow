import { randomUUID } from "node:crypto";
import { z } from "zod";
import { buildAllergyIntolerance } from "./allergy-intolerance";
import {
  AYURVEDA_SECTION_ORDER,
  AYURVEDA_SECTION_TITLES,
  type AyurvedaBundleInput,
  ICD11_MAPPING_UNREVIEWED_TAG,
  ICD11_MMS_SYSTEM,
  NAMASTE_SYSTEM,
  buildAyurvedaObservation,
} from "./ayurveda";
import { buildComposition, type CompositionSection } from "./composition";
import { CodingSchema, urnReference } from "./common";
import type { Coding } from "./common";
import { buildCondition } from "./condition";
import { buildDocumentReference } from "./document-reference";
import { buildEncounter } from "./encounter";
import { buildMedicationStatement } from "./medication-statement";
import { buildObservation } from "./observation";
import { buildPatient } from "./patient";
import { buildPractitioner } from "./practitioner";

const EntrySchema = z.object({
  fullUrl: z.string(),
  resource: z.record(z.string(), z.unknown()),
});

export const DocumentBundleSchema = z.object({
  resourceType: z.literal("Bundle"),
  id: z.string(),
  // FHIR's bdl-9 invariant: a `type: document` Bundle must carry a business identifier
  // (system + value) distinct from `id` — HAPI's $validate rejected a first draft without one.
  identifier: z.object({ system: z.string(), value: z.string() }),
  type: z.literal("document"),
  timestamp: z.string(),
  entry: z.array(EntrySchema).min(1),
});
export type DocumentBundle = z.infer<typeof DocumentBundleSchema>;

/** One per (id, resource) pair — this is the only place a Bundle gets assembled, so a call
 * site can never construct one as an inline object literal (docs/08-abdm-fhir.md). */
function entry(resource: { id: string; resourceType: string }): z.infer<typeof EntrySchema> {
  return { fullUrl: `urn:uuid:${resource.id}`, resource };
}

export interface OPConsultRecordInput {
  patient: { id: string; abhaNumber?: string | null; name?: string | null };
  practitionerName: string;
  encounterPeriodStart: string;
  encounterPeriodEnd?: string | null;
  chiefComplaintText: string | null;
  /** NAMASTE + ICD-11 TM2/MMS codings for the chief complaint, from the terminology service —
   * see BuildConditionInput.codings in ./condition for what "omitted" means and why. */
  chiefComplaintCodings?: Coding[];
  /** One per HPI field (services/ai's SummaryField-shaped leaves, already flattened by the
   * gateway) — each becomes an Observation. No LOINC coding (out of scope). */
  hpiObservations: { label: string; value: number | string | boolean }[];
  /** Only populated once a real source exists (docs/14-features.md section 4/docai) — omitted
   * entries render as an honest `emptyReason` in the Composition, never a fabricated entry. */
  allergies?: { displayText: string }[];
  medications?: { displayText: string }[];
  documents?: { url: string; contentType?: string; docTypeText?: string }[];
  /** The Ayurvedic case record — Prashna answers, the Vaidya's examination findings and the
   * diagnoses the Vaidya picked. Omitted for a visit with none, so a non-AYUSH bundle is
   * byte-for-byte what it was before. */
  ayurveda?: AyurvedaBundleInput;
  signedAt: string;
}

/** Assembles the OPConsultRecord DocumentBundle: Composition (must be entry[0] for a
 * `type: document` Bundle — FHIR invariant bdl-9) + Patient + Practitioner + Encounter +
 * Condition + AllergyIntolerance + MedicationStatement + Observation + DocumentReference. */
export function buildOPConsultRecordBundle(input: OPConsultRecordInput): DocumentBundle {
  const patient = buildPatient({
    id: randomUUID(),
    abhaNumber: input.patient.abhaNumber,
    name: input.patient.name,
  });
  const patientRef = urnReference(patient.id);

  const practitioner = buildPractitioner({ id: randomUUID(), name: input.practitionerName });
  const practitionerRef = urnReference(practitioner.id);

  const encounter = buildEncounter({
    id: randomUUID(),
    status: "finished",
    patientRef,
    periodStart: input.encounterPeriodStart,
    periodEnd: input.encounterPeriodEnd,
  });
  const encounterRef = urnReference(encounter.id);

  const condition = input.chiefComplaintText
    ? buildCondition({
        id: randomUUID(),
        displayText: input.chiefComplaintText,
        codings: input.chiefComplaintCodings,
        patientRef,
        encounterRef,
        recordedDate: input.encounterPeriodStart,
      })
    : null;

  const observations = input.hpiObservations.map((o) =>
    buildObservation({
      id: randomUUID(),
      codeText: o.label,
      patientRef,
      encounterRef,
      value: o.value,
      effectiveDateTime: input.encounterPeriodStart,
    }),
  );

  const allergies = (input.allergies ?? []).map((a) =>
    buildAllergyIntolerance({ id: randomUUID(), displayText: a.displayText, patientRef }),
  );
  const medications = (input.medications ?? []).map((m) =>
    buildMedicationStatement({ id: randomUUID(), displayText: m.displayText, patientRef }),
  );
  const documents = (input.documents ?? []).map((d) =>
    buildDocumentReference({
      id: randomUUID(),
      patientRef,
      url: d.url,
      contentType: d.contentType,
      docTypeText: d.docTypeText,
    }),
  );

  const ayurvedaObservations = (input.ayurveda?.observations ?? []).map((o) => ({
    section: o.section,
    resource: buildAyurvedaObservation({
      ...o,
      id: randomUUID(),
      patientRef,
      encounterRef,
      effectiveDateTime: input.encounterPeriodStart,
    }),
  }));
  const ayurvedaDiagnoses = (input.ayurveda?.diagnoses ?? []).map((d) =>
    buildCondition({
      id: randomUUID(),
      displayText: d.displayText,
      codings: [
        { system: NAMASTE_SYSTEM, code: d.namaste.code, display: d.namaste.display },
        ...(d.icd11 ? [{ system: ICD11_MMS_SYSTEM, code: d.icd11.code, display: d.icd11.display }] : []),
      ],
      tags: d.icd11 && !d.mappingReviewed ? [ICD11_MAPPING_UNREVIEWED_TAG] : undefined,
      patientRef,
      encounterRef,
      recordedDate: input.encounterPeriodStart,
    }),
  );
  const ayurvedaSections: CompositionSection[] =
    ayurvedaObservations.length + ayurvedaDiagnoses.length === 0
      ? []
      : AYURVEDA_SECTION_ORDER.map((sectionId) => ({
          title: AYURVEDA_SECTION_TITLES[sectionId],
          entryRefs: [
            ...ayurvedaObservations.filter((o) => o.section === sectionId).map((o) => urnReference(o.resource.id)),
            ...(sectionId === "vyadhi_vinishchaya" ? ayurvedaDiagnoses.map((c) => urnReference(c.id)) : []),
          ],
        })).filter((s) => s.entryRefs.length > 0);

  const sections: CompositionSection[] = [
    { title: "Chief Complaint", entryRefs: condition ? [urnReference(condition.id)] : [] },
    { title: "History of Present Illness", entryRefs: observations.map((o) => urnReference(o.id)) },
    { title: "Allergies", entryRefs: allergies.map((a) => urnReference(a.id)) },
    { title: "Medications", entryRefs: medications.map((m) => urnReference(m.id)) },
    { title: "Documents", entryRefs: documents.map((d) => urnReference(d.id)) },
    ...ayurvedaSections,
  ];

  const composition = buildComposition({
    id: randomUUID(),
    patientRef,
    encounterRef,
    authorRefs: [practitionerRef],
    date: input.signedAt,
    sections,
  });

  const bundleId = randomUUID();
  return DocumentBundleSchema.parse({
    resourceType: "Bundle",
    id: bundleId,
    identifier: { system: "https://careflow.dev/fhir/bundle-id", value: bundleId },
    type: "document",
    timestamp: input.signedAt,
    entry: [
      entry(composition), // must be first — FHIR document-bundle invariant bdl-9
      entry(patient),
      entry(practitioner),
      entry(encounter),
      ...(condition ? [entry(condition)] : []),
      ...observations.map(entry),
      ...ayurvedaObservations.map((o) => entry(o.resource)),
      ...ayurvedaDiagnoses.map(entry),
      ...allergies.map(entry),
      ...medications.map(entry),
      ...documents.map(entry),
    ],
  });
}

// Re-export so a consumer never needs to hand-write a Coding literal either.
export { CodingSchema };
