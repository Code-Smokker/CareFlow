"use client";

import { useEffect, useRef, useState } from "react";
import { BigButton, SpeakerButton } from "@careflow/ui/patient";

type Lang = "hi" | "en";
interface Scope {
  id: string;
  /** Pre-ticked? Voice-note sharing is NEVER pre-ticked: it is an extra the patient chooses (DPDP data minimisation). */
  defaultOn: boolean;
  label: Record<Lang, string>;
  description: Record<Lang, string>;
}

const SCOPES: Scope[] = [
  {
    id: "history",
    defaultOn: true,
    label: { en: "Your medical history", hi: "आपका चिकित्सा इतिहास" },
    description: { en: "What you tell us today, saved for your doctor.", hi: "आज आप जो बताएँगे, वह आपके डॉक्टर के लिए सहेजा जाएगा।" },
  },
  {
    id: "audio_recording",
    defaultOn: true,
    label: { en: "Listen to my voice", hi: "मेरी आवाज़ सुनना" },
    description: {
      en: "Only to turn what you say into your answers. The recording is deleted straight away.",
      hi: "सिर्फ़ आपकी बात को जवाब में बदलने के लिए। रिकॉर्डिंग तुरंत मिटा दी जाती है।",
    },
  },
  {
    id: "voice_note_share",
    defaultOn: false,
    label: { en: "Share my voice recording with the doctor", hi: "मेरी आवाज़ की रिकॉर्डिंग डॉक्टर के साथ साझा करें" },
    description: {
      en: "So your doctor can hear your own words. Deleted when the doctor signs, or after 24 hours.",
      hi: "ताकि डॉक्टर आपके अपने शब्द सुन सकें। डॉक्टर के हस्ताक्षर के बाद, या 24 घंटे में, मिटा दी जाती है।",
    },
  },
  {
    id: "abha_lookup",
    defaultOn: true,
    label: { en: "Your ABHA health record", hi: "आपका ABHA स्वास्थ्य रिकॉर्ड" },
    description: { en: "Link this visit to your health ID, if you have one.", hi: "अगर आपके पास स्वास्थ्य आईडी है तो इस विज़िट को उससे जोड़ें।" },
  },
];

const COPY: Record<Lang, { title: string; intro: string; agree: string; withdraw: string }> = {
  en: {
    title: "Before we start",
    intro: "We'll ask you some questions about how you're feeling. Here's what we save, and why.",
    agree: "I agree, continue",
    withdraw: "You can withdraw this at any time, from any screen.",
  },
  hi: {
    title: "शुरू करने से पहले",
    intro: "हम आपसे पूछेंगे कि आप कैसा महसूस कर रहे हैं। हम क्या सहेजते हैं और क्यों, यह नीचे है।",
    agree: "मैं सहमत हूँ, आगे बढ़ें",
    withdraw: "आप इसे किसी भी समय, किसी भी स्क्रीन से वापस ले सकते हैं।",
  },
};

export function ConsentScreen({ onAccept, language }: { onAccept: (scopes: string[]) => void; language: string }) {
  const lang: Lang = language === "hi" ? "hi" : "en";
  const copy = COPY[lang];
  const [checked, setChecked] = useState<Record<string, boolean>>(() => Object.fromEntries(SCOPES.map((s) => [s.id, s.defaultOn])));
  const spokenRef = useRef(false);

  const speak = () => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const text = [copy.title, copy.intro, ...SCOPES.map((s) => `${s.label[lang]}. ${s.description[lang]}`), copy.withdraw].join(" ");
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang === "hi" ? "hi-IN" : "en-IN";
    window.speechSynthesis.speak(utter);
  };

  // Read aloud on arrival (the language tap that got us here counts as the user gesture browsers require);
  // the speaker button replays it.
  useEffect(() => {
    if (spokenRef.current) return;
    spokenRef.current = true;
    speak();
    return () => window.speechSynthesis?.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-dvh flex-col justify-center gap-cf-4 bg-paper p-cf-4">
      <div className="flex items-center gap-cf-3">
        <SpeakerButton onPlay={speak} />
        <h1 lang={lang} className="font-question text-question font-bold text-ink">{copy.title}</h1>
      </div>
      <p lang={lang} className="font-question text-support text-muted">{copy.intro}</p>

      <div className="flex flex-col gap-cf-3">
        {SCOPES.map((scope) => (
          <label
            key={scope.id}
            className="flex min-h-touch items-center gap-cf-3 rounded-2xl border-2 border-line-strong bg-surface p-cf-3"
          >
            <input
              type="checkbox"
              checked={checked[scope.id]}
              onChange={(e) => setChecked((c) => ({ ...c, [scope.id]: e.target.checked }))}
              className="h-8 w-8 shrink-0"
              aria-label={scope.label[lang]}
            />
            <span lang={lang}>
              <span className="block font-question text-answer font-bold text-ink">{scope.label[lang]}</span>
              <span className="block font-question text-support text-muted">{scope.description[lang]}</span>
            </span>
          </label>
        ))}
      </div>
      <p lang={lang} className="font-question text-support text-muted">{copy.withdraw}</p>

      <BigButton
        label={copy.agree}
        icon="check_circle"
        onClick={() => onAccept(Object.entries(checked).filter(([, v]) => v).map(([k]) => k))}
      />
    </div>
  );
}
