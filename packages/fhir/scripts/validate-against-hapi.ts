#!/usr/bin/env -S node
/** Builds a synthetic OPConsultRecord bundle and validates it against a local HAPI server —
 * this is the CI job docs/08-abdm-fhir.md asks for: "a red test on a malformed bundle is a
 * great thing to show a judge." Also runnable locally: `pnpm --filter @careflow/fhir
 * validate:hapi` (HAPI must be up: `docker compose up -d fhir`).
 */

import { buildOPConsultRecordBundle } from "../src/bundle";
import { validateBundleAgainstHapi } from "../src/hapi-client";

const FHIR_BASE_URL = process.env.FHIR_SERVER_URL ?? "http://localhost:8090/fhir";

async function main() {
  const now = new Date().toISOString();
  const bundle = buildOPConsultRecordBundle({
    patient: { id: "synthetic-patient", name: "Synthetic Patient", abhaNumber: null },
    practitionerName: "Dr. Synthetic Reviewer",
    encounterPeriodStart: now,
    encounterPeriodEnd: now,
    chiefComplaintText: "Fever",
    hpiObservations: [
      { label: "How many days have you had the fever?", value: "2_days" },
      { label: "When is the fever worst?", value: "continuous" },
      { label: "How bad is the pain right now?", value: 8 },
    ],
    // The Ayurvedic case record too — Observations with PLACEHOLDER-flagged NAMASTE codings and a
    // dual-coded diagnosis. A bundle that only validates without them proves nothing about them.
    ayurveda: {
      observations: [
        { section: "prashna", fieldId: "agni_appetite", label: "Agni — How is your appetite these days?", value: "Poor, little desire to eat", noteText: "source=tap; confidence=1; patient-reported" },
        { section: "trividha", fieldId: "trividha.darshana.notes", label: "Darshana — Darshana findings", value: "No pallor or icterus.", noteText: "source=clinician; recorded_by=synthetic" },
        { section: "ashtavidha", fieldId: "ashtavidha.mala.nature", label: "Mala — Nature", value: "Prakrita", noteText: "source=clinician; disposition=overridden; overrides patient-reported: Hard (tap, confidence 1)" },
        { section: "ashtavidha", fieldId: "ashtavidha.nadi.rate_bpm", label: "Nadi — Rate", value: 78, unit: "beats/min" },
        { section: "dashavidha", fieldId: "dashavidha.pramana.bmi", label: "Pramana — BMI", value: 22.5, unit: "kg/m²", noteText: "source=computed" },
      ],
      diagnoses: [
        { displayText: "Synthetic disorder", namaste: { code: "SYN-1", display: "Synthetic disorder" }, icd11: { code: "SYN-TM2-1", display: "Synthetic TM2 pattern" }, mappingReviewed: false },
      ],
    },
    signedAt: now,
  });

  console.log(`Validating a synthetic OPConsultRecord bundle against ${FHIR_BASE_URL} ...`);
  const result = await validateBundleAgainstHapi(bundle, FHIR_BASE_URL);

  for (const issue of result.issues) {
    console.log(`  [${issue.severity}] ${issue.diagnostics ?? issue.details ?? "(no detail)"}`);
  }

  if (!result.valid) {
    console.error("FAIL: bundle did not validate against HAPI.");
    process.exit(1);
  }
  console.log("OK: bundle validates against HAPI.");
}

main().catch((err) => {
  console.error("ERROR:", err instanceof Error ? err.message : err);
  console.error(`Is HAPI running? docker compose up -d fhir (then wait ~30s for it to be ready)`);
  process.exit(1);
});
