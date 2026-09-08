"use client";

import { BigButton } from "@careflow/ui/patient";

const LANGUAGES = [
  { code: "hi", native: "हिन्दी", english: "Hindi" },
  { code: "en", native: "English", english: "English" },
  { code: "ta", native: "தமிழ்", english: "Tamil" },
  { code: "bn", native: "বাংলা", english: "Bengali" },
];

export function LanguageScreen({ onSelect }: { onSelect: (language: string) => void }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-cf-4 bg-paper p-cf-4">
      <h1 className="text-center font-question text-question font-bold text-ink">Choose your language</h1>
      <p className="text-center font-native text-support text-muted">अपनी भाषा चुनें</p>
      <div className="mt-cf-4 flex w-full max-w-md flex-col gap-cf-3">
        {LANGUAGES.map((lang) => (
          <BigButton key={lang.code} label={`${lang.native} (${lang.english})`} icon="volume_up" onClick={() => onSelect(lang.code)} />
        ))}
      </div>
    </div>
  );
}
