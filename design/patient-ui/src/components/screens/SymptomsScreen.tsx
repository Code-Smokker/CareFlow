import React, { useState } from 'react';
import { Header } from '../Header';

interface SymptomsScreenProps {
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
  onContinue: (symptoms: string[]) => void;
  onBack: () => void;
}

interface SymptomItem {
  id: string;
  emoji: string;
  title: string;
  hindiTitle: string;
}

const SYMPTOMS: SymptomItem[] = [
  { id: 'fever', emoji: '🌡️', title: 'Fever', hindiTitle: 'बुखार' },
  { id: 'cough', emoji: '😷', title: 'Cough', hindiTitle: 'खाँसी' },
  { id: 'breathlessness', emoji: '🫁', title: 'Breathlessness', hindiTitle: 'सांस लेने में तकलीफ' },
  { id: 'headache', emoji: '🤕', title: 'Headache', hindiTitle: 'सिरदर्द' },
  { id: 'nausea', emoji: '🤢', title: 'Nausea', hindiTitle: 'जी मिचलाना' },
  { id: 'runny-nose', emoji: '🤧', title: 'Runny Nose', hindiTitle: 'नाक बहना' },
];

export const SymptomsScreen: React.FC<SymptomsScreenProps> = ({
  currentLanguage,
  onLanguageChange,
  onContinue,
  onBack,
}) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['fever', 'cough']);
  const [isNoneSelected, setIsNoneSelected] = useState(false);
  const [isVoiceListening, setIsVoiceListening] = useState(false);

  const toggleSymptom = (id: string) => {
    if (isNoneSelected) {
      setIsNoneSelected(false);
    }
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleNone = () => {
    if (!isNoneSelected) {
      setSelectedSymptoms([]);
      setIsNoneSelected(true);
    } else {
      setIsNoneSelected(false);
    }
  };

  const handleVoiceSpeak = () => {
    setIsVoiceListening(true);
    setTimeout(() => {
      // Simulate recognized symptom
      if (!selectedSymptoms.includes('headache')) {
        setSelectedSymptoms((prev) => [...prev, 'headache']);
      }
      setIsVoiceListening(false);
    }, 1800);
  };

  const handleContinueClick = () => {
    onContinue(isNoneSelected ? ['none'] : selectedSymptoms);
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col bg-[#faf8ff] text-[#131b2e] pb-6">
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={onLanguageChange}
        showBack={true}
        onBack={onBack}
      />

      <main className="relative z-10 flex flex-col flex-1 w-full px-4 pt-1 max-w-[430px] mx-auto">
        {/* Stepper Card */}
        <div className="bg-white rounded-2xl p-3 border border-slate-200/60 shadow-xs mb-3 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-[12px]">
              <span className="font-bold text-[#005454]">Step 2 of 5</span>
              <span className="text-slate-300">•</span>
              <span className="font-medium text-[#131b2e]">Health Questions</span>
            </div>
            <span className="text-[11px] text-[#006b5f] bg-[#71f8e4]/30 px-2.5 py-0.5 rounded-full font-bold">
              40% Complete
            </span>
          </div>

          <div className="w-full bg-[#e2e7ff] h-2 rounded-full overflow-hidden flex">
            <div className="bg-[#005454] h-full w-[40%] rounded-full transition-all duration-500"></div>
          </div>

          <div className="flex items-center justify-between text-[10.5px] pt-0.5">
            <span className="text-[#005454] flex items-center gap-0.5 font-semibold">
              <span className="material-symbols-outlined text-[13px]">check_circle</span>
              <span>Basics</span>
            </span>
            <span className="text-[#005454] font-bold">Questions</span>
            <span className="text-[#6e7979] font-medium">Symptoms</span>
            <span className="text-slate-400">Review</span>
          </div>
        </div>

        {/* Question Header */}
        <div className="flex flex-col gap-1 mb-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#0d6e6e] text-white text-[10px] uppercase tracking-wider font-bold">
              QUESTION 3 · SYMPTOMS
            </span>
            <div className="flex items-center gap-1 text-[#006b5f] text-[11px] font-semibold">
              <span className="material-symbols-outlined text-[14px]">verified_user</span>
              <span>Care triage</span>
            </div>
          </div>

          <h1 className="text-[21px] leading-snug text-[#131b2e] font-extrabold tracking-tight mt-0.5">
            Which symptoms are you experiencing?
          </h1>
          <p className="text-[14.5px] text-[#006b5f] font-semibold">
            आपको कौन-कौन से लक्षण हैं?
          </p>
          <p className="text-[12px] text-[#3e4948] flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-[#005454]">info</span>
            <span>Select all that apply. (जो लागू हों, वे सभी चुनें।)</span>
          </p>
        </div>

        {/* Symptoms Vertical Stack */}
        <div className="flex flex-col gap-2 mb-3">
          {SYMPTOMS.map((symptom) => {
            const isSelected = selectedSymptoms.includes(symptom.id);

            return (
              <div
                key={symptom.id}
                onClick={() => toggleSymptom(symptom.id)}
                className={`cursor-pointer rounded-2xl p-3 border-2 flex items-center justify-between transition-all duration-150 active:scale-[0.99] select-none ${
                  isSelected
                    ? 'border-[#005454] bg-[#6df5e1]/15 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-[#005454]/40'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                      isSelected ? 'bg-white border border-slate-200/80 shadow-2xs' : 'bg-[#f2f3ff]'
                    }`}
                  >
                    {symptom.emoji}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[15px] font-bold ${
                          isSelected ? 'text-[#005454]' : 'text-[#131b2e]'
                        }`}
                      >
                        {symptom.title}
                      </span>
                      {isSelected && (
                        <span className="px-2 py-0.2 rounded-full bg-[#005454]/10 text-[#005454] text-[10px] font-bold">
                          Selected
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[12px] ${
                        isSelected ? 'text-[#006b5f] font-medium' : 'text-[#3e4948]'
                      }`}
                    >
                      {symptom.hindiTitle}
                    </span>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'bg-[#005454] text-white shadow-xs'
                      : 'border-2 border-slate-300 bg-white'
                  }`}
                >
                  {isSelected && (
                    <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Clean Divider */}
          <div className="flex items-center my-0.5">
            <div className="flex-1 border-t border-slate-200"></div>
            <span className="px-3 text-[10px] font-bold text-[#6e7979] uppercase tracking-wider">or</span>
            <div className="flex-1 border-t border-slate-200"></div>
          </div>

          {/* None of These */}
          <div
            onClick={toggleNone}
            className={`cursor-pointer rounded-2xl p-3 border-2 flex items-center justify-between transition-all duration-150 active:scale-[0.99] select-none ${
              isNoneSelected
                ? 'border-[#005454] bg-[#6df5e1]/15 shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#f2f3ff] flex items-center justify-center text-slate-500 shrink-0">
                <span className="material-symbols-outlined text-[20px]">block</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span
                  className={`text-[15px] font-bold ${
                    isNoneSelected ? 'text-[#005454]' : 'text-[#131b2e]'
                  }`}
                >
                  None of these
                </span>
                <span className="text-[12px] text-[#3e4948]">इनमें से कोई नहीं</span>
              </div>
            </div>

            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                isNoneSelected
                  ? 'bg-[#005454] text-white shadow-xs'
                  : 'border-2 border-slate-300 bg-white'
              }`}
            >
              {isNoneSelected && (
                <span className="material-symbols-outlined text-[16px] font-bold">check</span>
              )}
            </div>
          </div>
        </div>

        {/* Secondary Voice Row */}
        <div className="bg-[#f2f3ff] rounded-2xl p-2.5 flex items-center justify-between gap-2 border border-teal-100/60 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#6df5e1] flex items-center justify-center text-[#00201c] shrink-0">
              <span className="material-symbols-outlined text-[17px]">mic</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[12.5px] text-[#131b2e] font-bold truncate">Prefer to speak?</span>
              <span className="text-[11px] text-[#006b5f] truncate">बोलकर बताएं · Say symptoms aloud</span>
            </div>
          </div>

          <button
            onClick={handleVoiceSpeak}
            className="h-8 px-3 rounded-full bg-white text-[#005454] text-[12px] flex items-center gap-1 shadow-2xs hover:bg-[#005454] hover:text-white transition-all font-bold shrink-0 cursor-pointer"
            type="button"
          >
            <span
              className={`material-symbols-outlined text-[15px] ${
                isVoiceListening ? 'text-red-500 animate-pulse' : ''
              }`}
            >
              {isVoiceListening ? 'mic' : 'graphic_eq'}
            </span>
            <span>{isVoiceListening ? 'Listening...' : 'Speak'}</span>
          </button>
        </div>

        {/* Anchored Primary CTA & Reassurance */}
        <div className="mt-auto pt-1 flex flex-col gap-1.5">
          <button
            onClick={handleContinueClick}
            className="w-full h-13 bg-[#005454] text-white rounded-full text-[15px] flex items-center justify-center gap-2 shadow-md shadow-[#005454]/25 hover:bg-[#0d6e6e] transition-all active:scale-[0.98] font-bold cursor-pointer"
            type="button"
          >
            <span>
              {isNoneSelected
                ? 'Continue (None Selected)'
                : selectedSymptoms.length > 0
                ? `Continue (${selectedSymptoms.length} Selected)`
                : 'Continue'}
            </span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>

          <div className="flex items-center justify-center gap-1 text-center text-[#3e4948] pb-1">
            <span className="material-symbols-outlined text-[14px] text-[#006b5f]">lock</span>
            <span className="text-[11px]">
              Your answers are private &amp; secure · आपके उत्तर निजी और सुरक्षित हैं
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};
