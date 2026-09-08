"use client";

import { RedFlagBanner } from "@careflow/ui/patient";
import type { RedFlag } from "@/lib/machine";

/** docs/05: firing a rule "speaks a calm instruction to the patient in their language" — never
 * blame, never alarm further. Quotes the patient's own words verbatim (the last thing they
 * said, matched by the rule), not a paraphrase. */
export function RedFlagScreen({ redFlags, onContinue }: { redFlags: RedFlag[]; onContinue: () => void }) {
  const first = redFlags[0];
  if (!first) return null;
  return (
    <RedFlagBanner
      quote={first.quote}
      speakText="Thank you for telling me. Please stay here — a nurse is coming to see you now."
      onContinue={onContinue}
    />
  );
}
