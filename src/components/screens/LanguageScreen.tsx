import React, { useState } from 'react';
import { Header } from '../Header';

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  sampleText: string;
  speechText: string;
}

interface LanguageScreenProps {
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
  onContinue: () => void;
  onBack: () => void;
  onSwitchAttendant?: () => void;
}

const LANGUAGES: LanguageOption[] = [
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    sampleText: 'नमस्ते, आपको क्या तकलीफ है?',
    speechText: 'नमस्ते, आपको क्या तकलीफ है?',
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    sampleText: 'नमस्कार, तुम्हाला काय त्रास होत आहे?',
    speechText: 'नमस्कार, तुम्हाला काय त्रास होत आहे?',
  },
  {
    code: 'en',
    name: 'Indian English',
    nativeName: 'English',
    sampleText: 'Hello, how can we help you today?',
    speechText: 'Hello, how can we help you today?',
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    sampleText: 'નમસ્તે, તમને શું તકલીફ છે?',
    speechText: 'નમસ્તે, તમને શું તકલીફ છે?',
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    sampleText: 'வணக்கம், உங்களுக்கு என்ன பிரச்சனை?',
    speechText: 'வணக்கம், உங்களுக்கு என்ன பிரச்சனை?',
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    sampleText: 'నమస్కారం, మీకు ఏమి ఇబ్బందిగా ఉంది?',
    speechText: 'నమస్కారం, మీకు ఏమి ఇబ్బందిగా ఉంది?',
  },
];

export const LanguageScreen: React.FC<LanguageScreenProps> = ({
  currentLanguage,
  onLanguageChange,
  onContinue,
  onBack,
  onSwitchAttendant,
}) => {
  const [selectedLang, setSelectedLang] = useState<LanguageOption>(
    LANGUAGES.find((l) => l.nativeName === currentLanguage) || LANGUAGES[0]
  );
  const [playingCode, setPlayingCode] = useState<string | null>(null);

  const handleSelect = (lang: LanguageOption) => {
    setSelectedLang(lang);
    onLanguageChange(lang.nativeName);
  };

  const playAudio = (e: React.MouseEvent, lang: LanguageOption) => {
    e.stopPropagation();
    setPlayingCode(lang.code);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(lang.speechText);
      utterance.rate = 0.9;
      utterance.onend = () => setPlayingCode(null);
      utterance.onerror = () => setPlayingCode(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setPlayingCode(null), 1200);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col bg-[#FAFAFA] text-[#0F1E36] pb-6">
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={onLanguageChange}
        showBack={true}
        onBack={onBack}
        showHelp={true}
      />

      <main className="relative z-10 flex flex-col flex-1 w-full px-4 pt-2 pb-6 max-w-[430px] mx-auto">
        {/* Progress Tracker: Step 1 of 6 */}
        <div className="flex flex-col gap-1 mb-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] tracking-wider uppercase text-[#0D6E6E] font-bold">
              Step 1 of 6
            </span>
            <span className="text-[12px] text-[#5A6E85] font-medium">15% completed</span>
          </div>
          <div className="grid grid-cols-6 gap-1.5 w-full h-1.5 rounded-full overflow-hidden bg-[#E2E8F0]">
            <div className="h-full bg-[#0D6E6E] rounded-full transition-all duration-300"></div>
            <div className="h-full bg-[#CBD5E1]/50 rounded-full"></div>
            <div className="h-full bg-[#CBD5E1]/50 rounded-full"></div>
            <div className="h-full bg-[#CBD5E1]/50 rounded-full"></div>
            <div className="h-full bg-[#CBD5E1]/50 rounded-full"></div>
            <div className="h-full bg-[#CBD5E1]/50 rounded-full"></div>
          </div>
        </div>

        {/* Attendant Quick Switcher */}
        <button
          onClick={onSwitchAttendant}
          className="w-full py-2.5 px-3 mb-2.5 rounded-2xl bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#0F1E36] flex items-center justify-between transition-colors shadow-xs text-left cursor-pointer"
          type="button"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-[#E6F7F5] flex items-center justify-center text-[#0D6E6E] shrink-0">
              <span className="material-symbols-outlined text-[17px]">support_agent</span>
            </div>
            <span className="text-[12px] text-[#0F1E36] font-medium truncate">
              Health attendant or ASHA worker assisting?
            </span>
          </div>
          <span className="text-[12px] text-[#0D6E6E] font-semibold shrink-0 ml-1">Switch →</span>
        </button>

        {/* Dialect / Hinglish Awareness Callout */}
        <div className="p-3 mb-3 rounded-2xl bg-[#F0FDFA] border border-[#99F6E4]/60 shadow-xs flex items-start gap-2.5 relative overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-[#CCFBF1] flex items-center justify-center shrink-0 shadow-xs text-[#0D6E6E]">
            <span className="material-symbols-outlined text-[18px]">mic</span>
          </div>
          <div className="flex flex-col min-w-0">
            <p className="text-[13px] text-[#0F1E36] font-semibold leading-tight">
              We also detect spoken Hinglish and regional dialects automatically.
            </p>
            <p className="text-[12px] text-[#5A6E85] pt-1 leading-normal">
              No formal grammar needed — just speak as you do at home.
            </p>
          </div>
        </div>

        {/* Language Options List */}
        <div className="flex flex-col gap-2 mb-4" role="radiogroup" aria-label="Preferred Language">
          {LANGUAGES.map((lang) => {
            const isSelected = selectedLang.code === lang.code;
            const isPlaying = playingCode === lang.code;

            return (
              <div
                key={lang.code}
                onClick={() => handleSelect(lang)}
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                className={`w-full p-3 rounded-2xl flex items-center justify-between cursor-pointer transition-all duration-200 select-none ${
                  isSelected
                    ? 'bg-[#0D6E6E] text-white shadow-md border border-[#0D6E6E]'
                    : 'bg-white text-[#0F1E36] border border-[#E2E8F0] shadow-xs hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Radio Indicator */}
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-white shadow-xs' : 'border-2 border-[#CBD5E1] bg-white'
                    }`}
                  >
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#0D6E6E]"></div>}
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-baseline gap-1.5">
                      <span
                        className={`text-[17px] font-bold ${
                          isSelected ? 'text-white' : 'text-[#0F1E36]'
                        }`}
                      >
                        {lang.nativeName}
                      </span>
                      <span
                        className={`text-[12px] ${
                          isSelected ? 'text-white/80' : 'text-[#5A6E85]'
                        }`}
                      >
                        ({lang.name})
                      </span>
                    </div>
                    <span
                      className={`text-[12px] truncate ${
                        isSelected ? 'text-white/90' : 'text-[#5A6E85]'
                      }`}
                    >
                      {lang.sampleText}
                    </span>
                  </div>
                </div>

                {/* Audio pronunciation preview button */}
                <button
                  type="button"
                  onClick={(e) => playAudio(e, lang)}
                  aria-label={`Listen ${lang.name} pronunciation`}
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-90 ${
                    isSelected
                      ? 'bg-white/20 hover:bg-white/30 text-white'
                      : 'bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#5A6E85]'
                  } ${isPlaying ? 'scale-110 ring-2 ring-teal-200' : ''}`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isPlaying ? 'volume_up' : 'volume_up'}
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Continue Action */}
        <div className="mt-auto flex flex-col gap-2 pt-2">
          <button
            onClick={onContinue}
            className="w-full h-12 rounded-full bg-[#0D6E6E] hover:bg-[#0A5656] text-white text-[15px] font-semibold flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all cursor-pointer"
            type="button"
          >
            <span>Continue with {selectedLang.nativeName}</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[#5A6E85]">
            <span className="material-symbols-outlined text-[15px] text-[#0D6E6E]">lock</span>
            <span className="text-[12px] tracking-wide text-[#5A6E85]">
              ABDM Compliant • Encrypted Voice
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};
