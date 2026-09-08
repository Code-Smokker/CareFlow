import React, { useState } from 'react';
import { CareFlowSession, Language } from '../types';
import { speakText } from '../utils/speech';

interface ScreenSummaryProps {
  patientData: CareFlowSession;
  language: Language;
  onContinue: () => void;
  onViewDoc: () => void;
  onEditSection: (section: 'reason' | 'symptoms' | 'duration' | 'pain') => void;
}

export const ScreenSummary: React.FC<ScreenSummaryProps> = ({
  patientData,
  language,
  onContinue,
  onViewDoc,
  onEditSection,
}) => {
  const [confirmed, setConfirmed] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleHearAudio = () => {
    if (isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      return;
    }
    const textToSpeak = language === 'hi'
      ? `आपकी स्वास्थ्य जानकारी का सारांश। कारण: ${patientData.reasonForVisitHi}। लक्षण: ${patientData.symptomsHi.join(', ')}। अवधि: ${patientData.durationHi}। दर्द की तीव्रता: ${patientData.painSeverity} में से 10। एक प्रिस्क्रिप्शन दस्तावेज़ संलग्न है।`
      : `Your care summary. Reason for visit: ${patientData.reasonForVisitEn}. Symptoms: ${patientData.symptomsEn.join(', ')}. Duration: ${patientData.durationEn}. Pain severity: ${patientData.painSeverity} out of 10. Attached document: ${patientData.document.fileName}.`;

    speakText(
      textToSpeak,
      language,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  return (
    <div className="flex flex-col w-full space-y-4 pb-28">
      {/* 1. Milestone & Stepper Card */}
      <div className="flex flex-col gap-1.5 bg-white p-3.5 rounded-2xl shadow-xs border border-slate-100">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-[#ccfbf1]/50 text-[#0d6e6e] font-bold tracking-wide uppercase text-[10px]">
              Care Summary
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium text-[10px]">
              Care triage
            </span>
          </div>
          <span className="text-[#0d6e6e] font-bold text-xs flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px]">check_circle</span>
            100% Complete
          </span>
        </div>
        <div className="flex items-center justify-between text-xs font-semibold pt-1">
          <span className="text-[#0f1e36]">Step 8 of 8 • Care Summary</span>
          <span className="text-[#0d6e6e] font-bold">Completed</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full bg-[#0d6e6e] rounded-full w-full transition-all duration-500"></div>
        </div>
        <div className="flex items-center justify-between text-[10.5px] text-slate-400 pt-0.5">
          <span className="text-[#0d6e6e] font-medium flex items-center gap-0.5">✓ Basics</span>
          <span className="text-[#0d6e6e] font-medium flex items-center gap-0.5">✓ Symptoms</span>
          <span className="text-[#0d6e6e] font-medium flex items-center gap-0.5">✓ Docs</span>
          <span className="text-[#0d6e6e] font-medium flex items-center gap-0.5">✓ Review</span>
          <span className="text-[#0d6e6e] font-bold flex items-center gap-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0d6e6e] inline-block"></span>Summary
          </span>
        </div>
      </div>

      {/* 2. Intro & Bilingual Title */}
      <div className="flex items-start justify-between gap-3 pt-0.5">
        <div className="flex flex-col">
          <h1 className="text-[23px] font-extrabold text-[#0f1e36] tracking-tight leading-tight">
            Your care summary
          </h1>
          <p className="text-base font-bold text-[#0d6e6e] mt-0.5 font-hindi">
            आपकी स्वास्थ्य जानकारी का सारांश
          </p>
          <p className="text-xs text-slate-600 mt-1 leading-snug">
            Here's what you've shared with CareFlow. Please review it before continuing.
          </p>
          <p className="text-[11px] text-slate-400 font-hindi mt-0.5">
            आगे बढ़ने से पहले अपनी जानकारी की समीक्षा करें।
          </p>
        </div>
        <button
          onClick={handleHearAudio}
          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all shadow-xs active:scale-95 text-xs font-semibold ${
            isSpeaking
              ? 'bg-[#0d6e6e] text-white'
              : 'bg-[#f0fdfa] border border-[#ccfbf1] text-[#0d6e6e] hover:bg-teal-100'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[17px]">
            {isSpeaking ? 'pause' : 'volume_up'}
          </span>
          <span>{isSpeaking ? 'Playing...' : 'Hear / सुनें'}</span>
        </button>
      </div>

      {/* 3. What You Shared Card */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 flex flex-col gap-3">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center text-[#0d6e6e]">
              <span className="material-symbols-outlined text-[18px]">clinical_notes</span>
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0f1e36]">What you shared</span>
              <span className="text-[10px] text-slate-400 font-hindi block">आपने क्या बताया</span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
            4 points
          </span>
        </div>

        {/* 4 Points List */}
        <div className="flex flex-col gap-2.5">
          {/* Reason */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 hover:bg-slate-100/70 transition-colors">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#0d6e6e] shadow-xs mt-0.5 border border-slate-100">
                <span className="material-symbols-outlined text-[18px]">stethoscope</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Reason for visit</span>
                <span className="text-xs font-bold text-[#0f1e36]">{patientData.reasonForVisitEn}</span>
                <span className="text-[11px] text-slate-500 font-hindi">{patientData.reasonForVisitHi}</span>
              </div>
            </div>
            <button
              onClick={() => onEditSection('reason')}
              className="text-[#0d6e6e] text-xs font-bold hover:text-[#094e4e] px-2 py-1 rounded-lg"
              type="button"
            >
              Edit
            </button>
          </div>

          {/* Symptoms */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 hover:bg-slate-100/70 transition-colors">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#0d6e6e] shadow-xs mt-0.5 border border-slate-100">
                <span className="material-symbols-outlined text-[18px]">thermostat</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Reported symptoms</span>
                <span className="text-xs font-bold text-[#0f1e36]">{patientData.symptomsEn.join(' • ')}</span>
                <span className="text-[11px] text-slate-500 font-hindi">{patientData.symptomsHi.join(', ')}</span>
              </div>
            </div>
            <button
              onClick={() => onEditSection('symptoms')}
              className="text-[#0d6e6e] text-xs font-bold hover:text-[#094e4e] px-2 py-1 rounded-lg"
              type="button"
            >
              Edit
            </button>
          </div>

          {/* Duration */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 hover:bg-slate-100/70 transition-colors">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#0d6e6e] shadow-xs mt-0.5 border border-slate-100">
                <span className="material-symbols-outlined text-[18px]">schedule</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Duration</span>
                <span className="text-xs font-bold text-[#0f1e36]">{patientData.durationEn}</span>
                <span className="text-[11px] text-slate-500 font-hindi">{patientData.durationHi}</span>
              </div>
            </div>
            <button
              onClick={() => onEditSection('duration')}
              className="text-[#0d6e6e] text-xs font-bold hover:text-[#094e4e] px-2 py-1 rounded-lg"
              type="button"
            >
              Edit
            </button>
          </div>

          {/* Pain severity */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 hover:bg-slate-100/70 transition-colors">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#0d6e6e] shadow-xs mt-0.5 border border-slate-100">
                <span className="material-symbols-outlined text-[18px]">sentiment_dissatisfied</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Pain severity</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-bold text-[#0f1e36]">{patientData.painSeverity} / 10</span>
                  <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">
                    Moderate-Severe
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-hindi">दर्द की तीव्रता: {patientData.painSeverity}/10</span>
              </div>
            </div>
            <button
              onClick={() => onEditSection('pain')}
              className="text-[#0d6e6e] text-xs font-bold hover:text-[#094e4e] px-2 py-1 rounded-lg"
              type="button"
            >
              Edit
            </button>
          </div>
        </div>
      </div>

      {/* 4. Documents Card */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 flex flex-col gap-3">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center text-[#0d6e6e]">
              <span className="material-symbols-outlined text-[18px]">folder</span>
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0f1e36]">Documents</span>
              <span className="text-[10px] text-slate-400 font-hindi block">दस्तावेज़</span>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#ccfbf1] text-[#0d6e6e] text-xs font-bold">
            1 attached
          </span>
        </div>
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-100">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-teal-100/60 flex items-center justify-center text-[#0d6e6e] flex-shrink-0">
              <span className="material-symbols-outlined text-[22px]">description</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-[#0f1e36] truncate">
                {patientData.document.fileName}
              </span>
              <div className="flex items-center gap-1.5 flex-wrap mt-0.5 text-[11px]">
                <span className="font-semibold text-[#0d6e6e] flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[14px]">check</span> Prescribed Rx
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500">4 items extracted</span>
              </div>
            </div>
          </div>
          <button
            onClick={onViewDoc}
            className="flex-shrink-0 text-[#0d6e6e] text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-teal-50 transition-colors ml-2 border border-teal-200"
            type="button"
          >
            View
          </button>
        </div>
      </div>

      {/* 5. Ready for your care team */}
      <div className="bg-[#f0fdfa] rounded-2xl p-4 border border-[#ccfbf1] flex items-start gap-3.5 shadow-xs">
        <div className="w-10 h-10 rounded-full bg-[#0d6e6e] flex items-center justify-center text-white flex-shrink-0 shadow-xs">
          <span className="material-symbols-outlined text-[22px]">diversity_1</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <h2 className="text-sm font-bold text-[#0f1e36]">Ready for your care team</h2>
          <p className="text-xs font-semibold text-[#0d6e6e] font-hindi">आपकी देखभाल टीम के लिए तैयार</p>
          <p className="text-xs text-slate-600 mt-1 leading-snug">
            Your answers and documents will help your care team understand your needs before your visit.
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5 font-hindi">
            आपके उत्तर और दस्तावेज़ आपकी देखभाल टीम को आपकी ज़रूरतें समझने में मदद करेंगे।
          </p>
        </div>
      </div>

      {/* 6. Everything looks right? Checkbox */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f1e36]">Everything looks right?</h3>
          <span className="material-symbols-outlined text-[#0d6e6e] text-[20px]">verified</span>
        </div>
        <p className="text-[11px] text-slate-500 font-hindi">साझा करने से पहले आप किसी भी उत्तर को बदल सकते हैं।</p>
        <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/80 cursor-pointer hover:bg-slate-100/70 transition-colors mt-1 select-none border border-slate-100">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="sr-only"
          />
          <div
            className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors mt-0.5 ${
              confirmed ? 'bg-[#0d6e6e] text-white' : 'bg-white border border-slate-300'
            }`}
          >
            {confirmed && <span className="material-symbols-outlined text-[16px] font-bold">check</span>}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#0f1e36]">I've reviewed my information</span>
            <span className="text-[11px] text-slate-500 font-hindi">मैंने अपनी जानकारी की समीक्षा कर ली है</span>
          </div>
        </label>
      </div>

      {/* 7. Privacy & Security */}
      <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-slate-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-[#0d6e6e] flex-shrink-0">
          <span className="material-symbols-outlined text-[18px]">verified_user</span>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-[#0f1e36]">Your information stays private</span>
            <span className="text-[10px] text-slate-400 font-hindi">सुरक्षित एवं गोपनीय</span>
          </div>
          <span className="text-[11px] text-slate-500 leading-snug">
            Encrypted end-to-end and shared only with licensed clinical staff.
          </span>
        </div>
      </div>

      {/* Sticky Bottom Primary CTA */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-4 bg-white/95 backdrop-blur-md border-t border-slate-200/80 z-30 shadow-[0_-4px_16px_rgba(0,0,0,0.05)] space-y-2">
        <button
          onClick={onContinue}
          disabled={!confirmed}
          className={`w-full h-12 py-3 px-6 rounded-full bg-[#0d6e6e] hover:bg-[#094e4e] active:scale-[0.99] text-white font-bold text-[15px] flex items-center justify-center gap-2 shadow-md shadow-teal-900/15 transition-all ${
            !confirmed ? 'opacity-50 pointer-events-none' : ''
          }`}
          type="button"
        >
          <span>Continue to Care Team</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
        <div className="text-center">
          <span className="text-[11px] text-slate-500 font-hindi">केयर टीम को सुरक्षित रूप से भेजें</span>
        </div>
      </div>
    </div>
  );
};
