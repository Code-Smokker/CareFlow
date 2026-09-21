import type { ExamField, Vocabulary } from "../ontology/vocabulary";

/**
 * Pure arithmetic over fields the Vaidya entered — the only "computed" values the Ayurvedic case
 * record has. CareFlow never computes Vikriti, Samprapti or a diagnosis (CLAUDE.md rule 2); BMI
 * and the Vaya band are measurements, not judgements, and the Vaya cut-offs come from the
 * vocabulary (with their classical source noted there), never from this file.
 */

/** kg / m², one decimal. null when either input is missing or non-positive. */
export function computeBmi(heightCm: unknown, weightKg: unknown): number | null {
  if (typeof heightCm !== "number" || typeof weightKg !== "number") return null;
  if (!(heightCm > 0) || !(weightKg > 0)) return null;
  const metres = heightCm / 100;
  return Math.round((weightKg / (metres * metres)) * 10) / 10;
}

/** Completed years between `dob` and `now`. null for a DOB in the future. */
export function ageFromDob(dob: Date, now: Date = new Date()): number | null {
  let age = now.getUTCFullYear() - dob.getUTCFullYear();
  const beforeBirthday =
    now.getUTCMonth() < dob.getUTCMonth() ||
    (now.getUTCMonth() === dob.getUTCMonth() && now.getUTCDate() < dob.getUTCDate());
  if (beforeBirthday) age -= 1;
  return age < 0 ? null : age;
}

/** The first band whose exclusive upper bound is above `ageYears`; a `null` bound is open-ended. */
export function computeVayaBand(ageYears: number | null, field: Pick<ExamField, "bands">): string | null {
  if (ageYears === null || !Number.isFinite(ageYears) || ageYears < 0) return null;
  for (const band of field.bands ?? []) {
    if (band.below_age_years === null || ageYears < band.below_age_years) return band.value;
  }
  return null;
}

/** Dosha → number of the patient's questionnaire answers tagged to it. Counts only; there is no
 * "dominant dosha" here on purpose — the Vaidya decides Prakriti. */
export function scorePrakriti(
  vocab: Vocabulary,
  answers: ReadonlyMap<string, unknown>,
): { counts: { dosha: string; label: string; count: number }[]; answered: number; total: number } | null {
  const scoring = vocab.prakriti_scoring;
  const totals = new Map(scoring.doshas.map((d) => [d.value, 0]));
  let answered = 0;
  for (const [slotId, tagByOption] of Object.entries(scoring.slots)) {
    const answer = answers.get(slotId);
    if (typeof answer !== "string") continue;
    const dosha = tagByOption[answer];
    if (!dosha) continue;
    answered += 1;
    totals.set(dosha, (totals.get(dosha) ?? 0) + 1);
  }
  if (answered === 0) return null;
  return {
    counts: scoring.doshas.map((d) => ({ dosha: d.value, label: d.label, count: totals.get(d.value) ?? 0 })),
    answered,
    total: Object.keys(scoring.slots).length,
  };
}
