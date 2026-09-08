import React, { useState } from 'react';
import { CareFlowSession, Language } from '../types';
import { speakText } from '../utils/speech';

interface ScreenCompleteProps {
  patientData: CareFlowSession;
  language: Language;
  onFinish: () => void;
  onRestart: () => void;
}

export const ScreenComplete: React.FC<ScreenCompleteProps> = ({
  patientData,
  language,
  onFinish,
  onRestart,
}) => {
  const [isFinished, setIsFinished] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleHearAudio = () => {
    if (isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      return;
    }
    const textToSpeak = language === 'hi'
      ? 'सब तैयार है। सत्र पूरा हुआ। आपकी जानकारी आपकी देखभाल टीम के साथ सुरक्षित रूप से साझा कर दी गई है। डॉक्टर और क्लिनिक दल आपके विवरण की समीक्षा करेंगे।'
      : "You're all set. Session complete. Your information has been securely shared with your care team. Your care team can review the information to support your upcoming visit.";

    speakText(
      textToSpeak,
      language,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const handleFinishClick = () => {
    setIsFinished(true);
    setTimeout(() => {
      onFinish();
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full space-y-4 pb-32">
      {/* 1. Milestone Header */}
      <div className="w-full bg-white rounded-2xl p-3.5 shadow-xs border border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#ccfbf1]/50 text-[#0d6e6e] text-[10px] font-bold tracking-wide uppercase">
              Complete
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium">
              Care triage
            </span>
          </div>
          <span className="text-xs text-[#0d6e6e] font-bold">100% Complete</span>
        </div>
        <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
          <span className="text-[#0f1e36]">Complete • <span className="font-hindi">पूर्ण</span></span>
          <span className="text-slate-500 font-medium">Step 8 of 8</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden mb-2">
          <div className="h-full bg-[#0d6e6e] rounded-full w-full transition-all duration-500"></div>
        </div>
        <div className="flex items-center justify-between text-[10.5px] text-slate-400 pt-0.5">
          <span className="text-[#0d6e6e] font-medium flex items-center gap-0.5">✓ Basics</span>
          <span className="text-[#0d6e6e] font-medium flex items-center gap-0.5">✓ Symptoms</span>
          <span className="text-[#0d6e6e] font-medium flex items-center gap-0.5">✓ Docs</span>
          <span className="text-[#0d6e6e] font-medium flex items-center gap-0.5">✓ Review</span>
          <span className="text-[#0d6e6e] font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0d6e6e] inline-block"></span>Complete
          </span>
        </div>
      </div>

      {/* 2. Hero Checkmark Badge & Greeting */}
      <div className="flex flex-col items-center text-center pt-2 pb-1">
        <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mb-3 shadow-xs border border-[#ccfbf1]">
          <div className="w-11 h-11 rounded-full bg-[#0d6e6e] flex items-center justify-center text-white shadow-xs">
            <span className="material-symbols-outlined text-[26px] font-bold">check</span>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-[#f0fdfa] border border-[#ccfbf1] text-[#0d6e6e] text-[10.5px] font-bold tracking-wider uppercase mb-1.5">
          SESSION COMPLETE • <span className="font-hindi">सत्र पूरा हुआ</span>
        </span>

        <h1 className="text-[25px] font-extrabold text-[#0f1e36] tracking-tight">
          You're all set
        </h1>
        <p className="text-base font-bold text-[#0d6e6e] mt-0.5 font-hindi">
          सब तैयार है
        </p>

        <p className="text-xs text-slate-600 max-w-[320px] mt-1.5 leading-relaxed">
          Your information has been securely shared with your care team.
        </p>
        <p className="text-[11px] text-slate-400 font-hindi mt-0.5">
          (आपकी जानकारी आपकी देखभाल टीम के साथ सुरक्षित रूप से साझा कर दी गई है।)
        </p>

        {/* Voice Accessibility Pill */}
        <button
          onClick={handleHearAudio}
          className={`mt-3 h-9 px-4 rounded-full transition-all flex items-center gap-2 text-xs shadow-xs active:scale-95 ${
            isSpeaking
              ? 'bg-[#0d6e6e] text-white'
              : 'bg-white border border-slate-200 text-[#0f1e36] hover:bg-slate-50'
          }`}
          type="button"
        >
          <span className="material-symbols-outlined text-[17px] text-[#0d6e6e]">
            {isSpeaking ? 'pause' : 'volume_up'}
          </span>
          <span className="font-medium">
            {isSpeaking ? 'Playing...' : 'Would you like to hear this? / सुनना चाहते हैं?'}
          </span>
          <span className="text-[#0d6e6e] font-bold ml-0.5">
            {isSpeaking ? 'Pause' : 'Listen ▶'}
          </span>
        </button>
      </div>

      {/* 3. Completion Status Card */}
      <div className="w-full bg-white rounded-2xl p-4 shadow-xs border border-slate-100">
        <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-slate-100">
          <div className="w-7 h-7 rounded-lg bg-teal-100/60 flex items-center justify-center text-[#0d6e6e]">
            <span className="material-symbols-outlined text-[18px]">task_alt</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#0d6e6e] tracking-wide uppercase">
              YOUR CARE INTAKE IS COMPLETE
            </span>
            <span className="text-[10px] text-slate-400 font-hindi">
              आपका स्वास्थ्य विवरण पूरा हो गया है
            </span>
          </div>
        </div>

        {/* Checklist */}
        <div className="space-y-2.5">
          {/* Item 1 */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="w-5 h-5 rounded-full bg-[#ccfbf1] flex items-center justify-center shrink-0 mt-0.5 text-[#0d6e6e]">
                <span className="material-symbols-outlined text-[14px] font-bold">check</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#0f1e36]">Health information</p>
                <p className="text-[10.5px] text-slate-500 font-hindi">स्वास्थ्य संबंधी सामान्य जानकारी</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-[#0d6e6e] text-[10.5px] font-semibold shrink-0">
              Reviewed (समीक्षा)
            </span>
          </div>

          {/* Item 2 */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="w-5 h-5 rounded-full bg-[#ccfbf1] flex items-center justify-center shrink-0 mt-0.5 text-[#0d6e6e]">
                <span className="material-symbols-outlined text-[14px] font-bold">check</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#0f1e36]">Symptoms & answers</p>
                <p className="text-[10.5px] text-slate-500 font-hindi">लक्षण और दिए गए उत्तर</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-[#0d6e6e] text-[10.5px] font-semibold shrink-0">
              Recorded (दर्ज)
            </span>
          </div>

          {/* Item 3 */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="w-5 h-5 rounded-full bg-[#ccfbf1] flex items-center justify-center shrink-0 mt-0.5 text-[#0d6e6e]">
                <span className="material-symbols-outlined text-[14px] font-bold">check</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#0f1e36]">Medical documents</p>
                <p className="text-[10.5px] text-slate-500 font-hindi">अपलोड किए गए पर्चे और रिपोर्ट</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-[#0d6e6e] text-[10.5px] font-semibold shrink-0">
              Processed (संपादित)
            </span>
          </div>

          {/* Item 4 */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="w-5 h-5 rounded-full bg-[#ccfbf1] flex items-center justify-center shrink-0 mt-0.5 text-[#0d6e6e]">
                <span className="material-symbols-outlined text-[14px] font-bold">check</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#0f1e36]">Care team intake</p>
                <p className="text-[10.5px] text-slate-500 font-hindi">डॉक्टर और क्लिनिक दल के पास</p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#ccfbf1] text-[#0d6e6e] text-[10.5px] font-bold shrink-0">
              Shared (साझा)
            </span>
          </div>
        </div>
      </div>

      {/* 4. What Happens Next Card */}
      <div className="w-full bg-[#f0fdfa] rounded-2xl p-4 border border-[#ccfbf1] shadow-xs">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#0d6e6e] shrink-0 shadow-xs border border-[#ccfbf1]">
            <span className="material-symbols-outlined text-[19px]">clinical_notes</span>
          </div>
          <div>
            <h2 className="text-xs font-bold text-[#0f1e36]">What happens next?</h2>
            <span className="text-[11px] text-[#0d6e6e] font-hindi font-medium">अब आगे क्या होगा?</span>
          </div>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Your care team can review the information you provided and use it to support your upcoming visit.
        </p>
        <p className="text-[11px] text-slate-500 font-hindi mt-1 leading-normal">
          आपकी देखभाल टीम आपके द्वारा दी गई जानकारी की समीक्षा कर सकती है और आपकी मुलाकात के दौरान इसका उपयोग कर सकती है।
        </p>
        <div className="mt-3 pt-2.5 border-t border-[#ccfbf1] flex items-center justify-between text-[11px] text-slate-600 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Doctor triage ready</span>
          </div>
          <span className="text-slate-400">Ready for doctor</span>
        </div>
      </div>

      {/* 5. Keep Session Details Handy */}
      <div className="w-full bg-white rounded-2xl p-4 shadow-xs border border-slate-100">
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center shrink-0 mt-0.5 text-[#0d6e6e]">
            <span className="material-symbols-outlined text-[18px]">bookmark_heart</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xs font-bold text-[#0f1e36]">
              Keep your CareFlow session details handy
            </h3>
            <p className="text-[11px] text-[#0d6e6e] font-hindi font-medium mb-1">
              अपनी CareFlow जानकारी संभालकर रखें
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              If your care team asks about your symptoms, you can refer to the information you reviewed during this session.
            </p>
            <p className="text-[10.5px] text-slate-500 font-hindi mt-1">
              यदि आपकी देखभाल टीम आपके लक्षणों के बारे में पूछे, तो आप इस सत्र में समीक्षा की गई जानकारी देख सकते हैं।
            </p>
          </div>
        </div>
      </div>

      {/* 6. Security Reassurance */}
      <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-200/70 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#0d6e6e] shrink-0 mt-0.5 border border-slate-200 shadow-xs">
            <span className="material-symbols-outlined text-[20px] fill-1">verified_user</span>
          </div>
          <div className="flex-1">
            <h3 className="text-xs font-bold text-[#0f1e36]">
              Your information remains secure
            </h3>
            <p className="text-[11px] text-[#0d6e6e] font-hindi font-medium mb-1">
              आपकी जानकारी सुरक्षित रहेगी
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your health information is protected and shared securely as part of your care journey.
            </p>
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-slate-700 text-[10px] font-semibold border border-slate-200 shadow-xs">
                <span className="material-symbols-outlined text-[13px] text-[#0d6e6e]">lock</span>
                Private & Secure
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-slate-700 text-[10px] font-semibold border border-slate-200 shadow-xs">
                <span className="material-symbols-outlined text-[13px] text-emerald-600">verified</span>
                ABDM Compliant
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-slate-700 text-[10px] font-semibold border border-slate-200 shadow-xs">
                <span className="material-symbols-outlined text-[13px] text-[#0d6e6e]">shield</span>
                256-bit Encrypted
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-4 bg-white/95 backdrop-blur-md border-t border-slate-200/80 z-30 shadow-[0_-4px_16px_rgba(0,0,0,0.05)] space-y-2">
        <button
          onClick={handleFinishClick}
          className="w-full h-12 rounded-full bg-[#0d6e6e] hover:bg-[#094e4e] active:scale-[0.99] text-white font-bold text-[15px] shadow-md shadow-teal-900/15 transition-all flex items-center justify-center gap-2"
          type="button"
        >
          {isFinished ? (
            <>
              <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
              <span>Saved Securely (सहेज लिया गया)</span>
            </>
          ) : (
            <>
              <span>Finish (समाप्त करें)</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </>
          )}
        </button>

        <button
          onClick={onRestart}
          className="w-full py-1.5 text-center text-xs font-semibold text-slate-600 hover:text-[#0d6e6e] transition-colors flex items-center justify-center gap-1"
          type="button"
        >
          <span className="material-symbols-outlined text-[15px]">refresh</span>
          <span>Start a new session • नया सत्र शुरू करें</span>
        </button>

        <div className="text-center text-[10.5px] text-slate-400">
          Private & Secure • ABDM Compliant • आपके दस्तावेज़ सुरक्षित हैं
        </div>
      </div>
    </div>
  );
};
