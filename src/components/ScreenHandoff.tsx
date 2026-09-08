import React, { useState } from 'react';
import { CareFlowSession, Language } from '../types';
import { speakText } from '../utils/speech';

interface ScreenHandoffProps {
  patientData: CareFlowSession;
  language: Language;
  onShare: () => void;
  onReviewBack: () => void;
}

export const ScreenHandoff: React.FC<ScreenHandoffProps> = ({
  patientData,
  language,
  onShare,
  onReviewBack,
}) => {
  const [consentChecked, setConsentChecked] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleHearAudio = () => {
    if (isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      return;
    }
    const textToSpeak = language === 'hi'
      ? 'आपकी देखभाल टीम तैयार है। आपकी जानकारी की समीक्षा हो चुकी है और अब इसे आपकी देखभाल टीम के साथ सुरक्षित रूप से साझा किया जा सकता है।'
      : "Your care team is ready. Your information has been reviewed and is ready to securely share with your care team.";

    speakText(
      textToSpeak,
      language,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  return (
    <div className="flex flex-col w-full space-y-4 pb-28">
      {/* 1. Progress Stepper */}
      <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-slate-100 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-[#ccfbf1]/50 text-[#0d6e6e] font-bold uppercase tracking-wider text-[10px]">
              READY FOR CARE
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium text-[10px]">
              Care triage
            </span>
          </div>
          <span className="text-[#0d6e6e] font-bold text-xs">100% Completed</span>
        </div>
        <div className="flex items-center justify-between text-xs font-semibold pt-1">
          <span className="text-[#0f1e36]">Step 8 of 8 • Care Team</span>
          <span className="text-[#0d6e6e] font-bold font-hindi">चरण 8/8</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full bg-[#0d6e6e] rounded-full w-full transition-all duration-500"></div>
        </div>
        <div className="flex items-center justify-between text-[10.5px] text-slate-400 pt-0.5 font-medium">
          <span className="text-[#0d6e6e] flex items-center gap-0.5 font-semibold">✓ Basics</span>
          <span className="text-[#0d6e6e] flex items-center gap-0.5 font-semibold">✓ Symptoms</span>
          <span className="text-[#0d6e6e] flex items-center gap-0.5 font-semibold">✓ Documents</span>
          <span className="text-[#0d6e6e] flex items-center gap-0.5 font-semibold">✓ Review</span>
          <span className="text-[#0d6e6e] font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0d6e6e] animate-pulse"></span>Complete
          </span>
        </div>
      </div>

      {/* 2. Intro & Audio Support */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-[#0d6e6e] text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">verified_user</span>
            <span>Ready for care review</span>
          </div>
          <button
            onClick={handleHearAudio}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold shadow-xs active:scale-95 transition-all ${
              isSpeaking
                ? 'bg-[#0d6e6e] text-white'
                : 'bg-[#f0fdfa] border border-[#ccfbf1] text-[#0d6e6e] hover:bg-teal-100'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[15px]">
              {isSpeaking ? 'pause' : 'volume_up'}
            </span>
            <span>{isSpeaking ? 'Playing...' : 'Hear / सुनें'}</span>
          </button>
        </div>
        <h1 className="text-[23px] font-extrabold text-[#0f1e36] tracking-tight leading-tight mt-1">
          Your care team is ready
        </h1>
        <p className="text-base font-bold text-[#0d6e6e] font-hindi">
          आपकी देखभाल टीम तैयार है
        </p>
        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
          Your information has been reviewed and is ready to securely share with your care team.
        </p>
        <p className="text-[11px] text-slate-500 font-hindi mt-0.5">
          आपकी जानकारी की समीक्षा हो चुकी है और अब इसे आपकी देखभाल टीम के साथ सुरक्षित रूप से साझा किया जा सकता है।
        </p>
      </div>

      {/* 3. Main Status Card */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f0fdfa] border border-[#ccfbf1] text-[#0d6e6e] text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>READY TO SHARE · <span className="font-hindi">साझा करने के लिए तैयार</span></span>
          </div>
          <div className="w-7 h-7 rounded-full bg-teal-50 flex items-center justify-center text-[#0d6e6e]">
            <span className="material-symbols-outlined text-[18px] fill-1">verified</span>
          </div>
        </div>

        <div className="flex items-start gap-3 mt-1">
          <div className="w-11 h-11 rounded-xl bg-[#f0fdfa] border border-[#ccfbf1] flex items-center justify-center text-[#0d6e6e] flex-shrink-0">
            <span className="material-symbols-outlined text-[24px] fill-1">clinical_notes</span>
          </div>
          <div className="flex flex-col min-w-0">
            <h2 className="text-sm font-bold text-[#0f1e36] leading-tight">
              Your health information is complete.
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Your answers and uploaded documents are ready for your care team to review.
            </p>
            <p className="text-[11px] text-slate-500 font-hindi mt-0.5">
              आपके उत्तर और अपलोड किए गए दस्तावेज़ आपकी देखभाल टीम की समीक्षा के लिए तैयार हैं।
            </p>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 flex items-center gap-2 text-slate-600 text-xs border border-slate-100">
          <span className="material-symbols-outlined text-[#0d6e6e] text-[18px]">task_alt</span>
          <span className="leading-tight text-[11px]">
            All 8 intake sections verified • Clinical triage summary generated
          </span>
        </div>
      </div>

      {/* 4. What Your Care Team Will See Card */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 flex flex-col gap-2.5">
        <div className="flex flex-col pb-1 border-b border-slate-100">
          <span className="text-xs font-bold text-[#0f1e36] tracking-wider uppercase">
            WHAT YOUR CARE TEAM WILL SEE
          </span>
          <span className="text-[10.5px] text-slate-400 font-hindi">
            आपकी देखभाल टीम क्या देखेगी
          </span>
        </div>

        <div className="flex flex-col divide-y divide-slate-100">
          {/* Row 1: Symptoms */}
          <div className="flex items-center gap-3 py-2.5 first:pt-1">
            <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 text-[#0d6e6e] border border-slate-100">
              <span className="material-symbols-outlined text-[18px]">stethoscope</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0f1e36]">Symptoms & answers</span>
                <span className="text-[11px] text-[#0d6e6e] font-hindi font-medium">लक्षण और उत्तर</span>
              </div>
              <span className="text-[11px] text-slate-500 leading-tight mt-0.5">
                {patientData.symptomsEn.join(', ')} • 4 key points
              </span>
            </div>
          </div>

          {/* Row 2: Pain & duration */}
          <div className="flex items-center gap-3 py-2.5">
            <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 text-[#0d6e6e] border border-slate-100">
              <span className="material-symbols-outlined text-[18px]">timer</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0f1e36]">Pain & duration</span>
                <span className="text-[11px] text-[#0d6e6e] font-hindi font-medium">दर्द और अवधि</span>
              </div>
              <span className="text-[11px] text-slate-500 leading-tight mt-0.5">
                Severity ({patientData.painSeverity}/10 Moderate-Severe) & duration ({patientData.durationEn})
              </span>
            </div>
          </div>

          {/* Row 3: Documents */}
          <div className="flex items-center gap-3 py-2.5 last:pb-1">
            <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 text-[#0d6e6e] border border-slate-100">
              <span className="material-symbols-outlined text-[18px]">prescriptions</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0f1e36]">Medical documents</span>
                <span className="text-[11px] text-[#0d6e6e] font-hindi font-medium">मेडिकल दस्तावेज़</span>
              </div>
              <span className="text-[11px] text-slate-500 leading-tight truncate mt-0.5">
                {patientData.document.fileName} • 4 extracted details
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Patient Control Reassurance */}
      <div className="rounded-2xl p-3.5 bg-slate-50 border border-slate-200/70 shadow-xs flex items-center justify-between">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center flex-shrink-0 text-[#0d6e6e] border border-slate-200 shadow-xs mt-0.5">
            <span className="material-symbols-outlined text-[18px] fill-1">shield_person</span>
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className="text-xs font-bold text-[#0f1e36]">
              You're still in control <span className="text-[#0d6e6e] font-hindi font-medium">· नियंत्रण आपके हाथ में है</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              You can review or change your info before sharing.
            </p>
          </div>
        </div>
        <button
          onClick={onReviewBack}
          className="shrink-0 text-xs font-bold text-[#0d6e6e] bg-white border border-[#ccfbf1] px-3 py-1.5 rounded-full hover:bg-teal-50 transition-colors ml-2 shadow-xs"
          type="button"
        >
          Review →
        </button>
      </div>

      {/* 6. Sharing Confirmation Checkbox */}
      <label className="cursor-pointer bg-white rounded-2xl p-3.5 shadow-xs border border-teal-200/80 flex items-start gap-3 select-none transition-all active:scale-[0.99]">
        <input
          type="checkbox"
          checked={consentChecked}
          onChange={(e) => setConsentChecked(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors flex-shrink-0 mt-0.5 ${
            consentChecked ? 'bg-[#0d6e6e] text-white' : 'bg-slate-100 border border-slate-300'
          }`}
        >
          {consentChecked && <span className="material-symbols-outlined text-[16px] font-bold">check</span>}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold text-[#0f1e36] leading-snug">
            I've reviewed my information and want to share it with my care team.
          </span>
          <span className="text-[11px] text-slate-500 font-hindi mt-0.5 leading-snug">
            मैंने अपनी जानकारी की समीक्षा कर ली है और इसे अपनी देखभाल टीम के साथ साझा करना चाहता/चाहती हूँ।
          </span>
        </div>
      </label>

      {/* 7. Privacy & Security */}
      <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/60 flex items-start gap-2.5 text-slate-600">
        <span className="material-symbols-outlined text-[#0d6e6e] text-[18px] flex-shrink-0 mt-0.5">lock</span>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold text-[#0f1e36]">
            Private & secure · <span className="font-hindi font-medium">निजी और सुरक्षित</span>
          </span>
          <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
            Your health information is encrypted and securely shared only as part of your care journey under ABDM standards.
          </p>
          <div className="pt-1">
            <span className="inline-block bg-white text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-200">
              🔒 ABDM Compliant • 256-bit Encrypted • ISO 27001
            </span>
          </div>
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-4 bg-white/95 backdrop-blur-md border-t border-slate-200/80 z-30 shadow-[0_-4px_16px_rgba(0,0,0,0.05)] space-y-2">
        <button
          onClick={onShare}
          disabled={!consentChecked}
          className={`w-full h-13 py-3.5 px-4 rounded-full bg-[#0d6e6e] hover:bg-[#094e4e] active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-teal-900/15 transition-all flex flex-col items-center justify-center ${
            !consentChecked ? 'opacity-50 pointer-events-none' : ''
          }`}
          type="button"
        >
          <div className="flex items-center gap-1.5 text-sm">
            <span>Share with Care Team</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </div>
          <span className="text-[10.5px] font-normal text-teal-100 font-hindi">
            केयर टीम के साथ साझा करें
          </span>
        </button>
        <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 text-center">
          <span className="material-symbols-outlined text-[13px]">lock</span>
          <span>Private & Secure • ABDM Compliant • आपके उत्तर सुरक्षित हैं</span>
        </div>
      </div>
    </div>
  );
};
