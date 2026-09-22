"use client";

import { useEffect } from "react";
import { RedFlagBanner, SpeakerButton } from "@careflow/ui/patient";
import type { RedFlag } from "@/lib/machine";

const LANG_TAG: Record<string, string> = { hi: "hi-IN", en: "en-IN", ta: "ta-IN", bn: "bn-IN" };
const FALLBACK: Record<string, string> = {
  hi: "बताने के लिए धन्यवाद। कृपया यहीं रुकें — नर्स अभी आपके पास आ रही हैं।",
  en: "Thank you for telling me. Please stay here — a nurse is coming to see you now.",
};

/** docs/05: firing a rule "speaks a calm instruction to the patient in their language" — never blame, never alarm
 * further. It shows AND reads aloud the rule's own calm text, and quotes the patient's own words (the answers the rule
 * read), not a paraphrase or a clinical rationale. The patient can carry on afterwards. */
export function RedFlagScreen({ redFlags, onContinue, language }: { redFlags: RedFlag[]; onContinue: () => void; language: string }) {
  const first = redFlags[0];
  const text = first?.speak ?? FALLBACK[language] ?? FALLBACK.en;

  const speak = () => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = LANG_TAG[language] ?? "en-IN";
    window.speechSynthesis.speak(utter);
  };

  useEffect(() => {
    speak();
    return () => window.speechSynthesis?.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  if (!first) return null;
  return (
    <div lang={language}>
      <RedFlagBanner quote={first.quote} speakText={text} onContinue={onContinue} />
      <div className="fixed left-cf-3 top-cf-3 z-[60]">
        <SpeakerButton onPlay={speak} />
      </div>
    </div>
  );
}
