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
