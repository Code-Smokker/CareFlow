import { randomUUID } from "node:crypto";
import { z } from "zod";
import { buildAllergyIntolerance } from "./allergy-intolerance";
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

  const sections: CompositionSection[] = [
    { title: "Chief Complaint", entryRefs: condition ? [urnReference(condition.id)] : [] },
    { title: "History of Present Illness", entryRefs: observations.map((o) => urnReference(o.id)) },
    { title: "Allergies", entryRefs: allergies.map((a) => urnReference(a.id)) },
    { title: "Medications", entryRefs: medications.map((m) => urnReference(m.id)) },
    { title: "Documents", entryRefs: documents.map((d) => urnReference(d.id)) },
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
      ...allergies.map(entry),
      ...medications.map(entry),
      ...documents.map(entry),
    ],
  });
}

// Re-export so a consumer never needs to hand-write a Coding literal either.
export { CodingSchema };
