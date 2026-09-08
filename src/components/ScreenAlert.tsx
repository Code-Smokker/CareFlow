import React, { useState } from 'react';
import { CareFlowSession, Language } from '../types';
import { speakText } from '../utils/speech';

interface ScreenAlertProps {
  patientData: CareFlowSession;
  language: Language;
  onContinue: () => void;
}

export const ScreenAlert: React.FC<ScreenAlertProps> = ({
  patientData,
  language,
  onContinue,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleHearAudio = () => {
    if (isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      return;
    }
    const textToSpeak = language === 'hi'
      ? 'महत्वपूर्ण सूचना। हमने एक ऐसी बात देखी है जिस पर ध्यान देना ज़रूरी है। आपके उत्तरों के आधार पर, इस लक्षण के बारे में किसी स्वास्थ्य विशेषज्ञ से बात करें। इस लक्षण को नज़रअंदाज़ न करें।'
      : "Clinical attention required. We noticed something that needs attention. Based on your answers, please speak with a healthcare professional about this symptom. Please don't ignore this symptom.";

    speakText(
      textToSpeak,
      language,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  return (
    <div className="flex flex-col w-full space-y-4 pb-28">
      {/* 1. Top Badges & Progress */}
      <div className="flex flex-col gap-1.5 bg-white p-3.5 rounded-2xl shadow-xs border border-slate-100">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 font-bold text-[10px] tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
              IMPORTANT • महत्वपूर्ण
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium text-[10px]">
              Care triage
            </span>
          </div>
          <span className="text-[#0d6e6e] font-bold text-xs">100% Complete</span>
        </div>
        <div className="flex items-center justify-between text-xs font-semibold pt-1">
          <span className="text-[#0f1e36]">Step 8 of 8 • Important | चरण 8/8</span>
          <span className="text-[#0d6e6e] font-bold">Final review</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full bg-red-600 rounded-full w-full transition-all duration-500"></div>
        </div>
        <div className="flex items-center justify-between text-[10.5px] text-slate-400 pt-0.5">
          <span className="text-[#0d6e6e] font-medium flex items-center gap-0.5">✓ Basics</span>
          <span className="text-[#0d6e6e] font-medium flex items-center gap-0.5">✓ Symptoms</span>
          <span className="text-[#0d6e6e] font-medium flex items-center gap-0.5">✓ Docs</span>
          <span className="text-[#0d6e6e] font-medium flex items-center gap-0.5">✓ Review</span>
          <span className="text-red-700 font-bold flex items-center gap-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block animate-ping"></span>Important
          </span>
        </div>
      </div>

      {/* 2. Intro & Audio Control */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-red-600">
            Clinical Attention Required
          </span>
          <button
            onClick={handleHearAudio}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-xs active:scale-95 transition-all ${
              isSpeaking
                ? 'bg-red-600 text-white'
                : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isSpeaking ? 'pause' : 'volume_up'}
            </span>
            <span>{isSpeaking ? 'Playing...' : 'Hear instruction / निर्देश सुनें'}</span>
          </button>
        </div>
        <h1 className="text-[23px] font-extrabold text-[#0f1e36] tracking-tight leading-tight mt-1">
          We noticed something that needs attention
        </h1>
        <p className="text-base font-bold text-[#0d6e6e] font-hindi">
          हमने एक ऐसी बात देखी है जिस पर ध्यान देना ज़रूरी है
        </p>
        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
          Based on your answers, please speak with a healthcare professional about this symptom.{' '}
          <span className="block text-[11px] text-slate-500 font-hindi mt-0.5">
            (आपके उत्तरों के आधार पर, इस लक्षण के बारे में किसी स्वास्थ्य विशेषज्ञ से बात करें।)
          </span>
        </p>
      </div>

      {/* 3. Red Flag Highlight Card */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-red-100 flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px] fill-1">medical_information</span>
          </div>
          <div className="flex flex-col">
            <h2 className="text-sm font-bold text-[#0f1e36]">
              Please don't ignore this symptom
            </h2>
            <span className="text-xs font-semibold text-[#0d6e6e] font-hindi">
              इस लक्षण को नज़रअंदाज़ न करें
            </span>
          </div>
        </div>

        <div className="bg-red-50/60 p-3 rounded-xl border border-red-100 text-xs text-slate-700 leading-relaxed">
          Your response suggests that this may need timely medical attention.
          <span className="block text-[11px] text-slate-500 font-hindi mt-1">
            (आपके उत्तर से संकेत मिलता है कि इस पर समय पर चिकित्सकीय ध्यान देना उचित है।)
          </span>
        </div>

        {/* Observation Rows */}
        <div className="flex flex-col gap-2 pt-1">
          <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
            <span>What We Noticed • हमने क्या देखा</span>
            <span className="text-[#0d6e6e]">Patient Logged</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between border border-slate-100">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#0f1e36]">Severe chest discomfort</span>
                <span className="text-[11px] text-slate-500 font-hindi">छाती में तेज असुविधा</span>
              </div>
              <span className="material-symbols-outlined text-[18px] text-[#0d6e6e]">symptoms</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between border border-slate-100">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#0f1e36]">Started recently</span>
                <span className="text-[11px] text-slate-500 font-hindi">हाल ही में शुरू हुआ</span>
              </div>
              <span className="material-symbols-outlined text-[18px] text-slate-400">schedule</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between border border-slate-100">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#0f1e36]">Severity: 8 of 10</span>
                <span className="text-[11px] text-slate-500 font-hindi">गंभीरता: 8/10</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">
                Needs evaluation
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. What Should You Do? */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 flex flex-col gap-3">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f1e36]">
            What should you do?
          </h3>
          <span className="text-xs font-semibold text-[#0d6e6e] font-hindi">
            आपको क्या करना चाहिए?
          </span>
        </div>

        <div className="flex flex-col gap-3 pt-1">
          {/* Step 01 */}
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-teal-100 text-[#0d6e6e] flex items-center justify-center text-xs font-bold shrink-0">
              01
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#0f1e36]">
                Speak with a healthcare professional
              </span>
              <span className="text-[11px] text-slate-600 mt-0.5">
                Contact your care team or clinician as soon as practical.
              </span>
              <span className="text-[10.5px] text-slate-500 font-hindi mt-0.5">
                स्वास्थ्य विशेषज्ञ से जल्द से जल्द संपर्क करें।
              </span>
            </div>
          </div>

          {/* Step 02 */}
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-teal-100 text-[#0d6e6e] flex items-center justify-center text-xs font-bold shrink-0">
              02
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#0f1e36]">
                Keep your information ready
              </span>
              <span className="text-[11px] text-slate-600 mt-0.5">
                Your CareFlow summary can help your care team understand what you reported.
              </span>
              <span className="text-[10.5px] text-slate-500 font-hindi mt-0.5">
                अपनी जानकारी और सारांश तैयार रखें।
              </span>
            </div>
          </div>

          {/* Step 03 */}
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-teal-100 text-[#0d6e6e] flex items-center justify-center text-xs font-bold shrink-0">
              03
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#0f1e36]">
                If symptoms become severe
              </span>
              <span className="text-[11px] text-slate-600 mt-0.5">
                Seek immediate emergency medical help without delay.
              </span>
              <span className="text-[10.5px] text-slate-500 font-hindi mt-0.5">
                लक्षण गंभीर होने पर आपातकालीन सहायता लें।
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Emergency Notice */}
      <div className="bg-red-50 rounded-2xl p-3.5 border border-red-200 flex items-start gap-3 shadow-xs">
        <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[20px] fill-1">emergency</span>
        </div>
        <div className="flex flex-col">
          <h4 className="text-xs font-bold text-red-900">
            If this feels like an emergency (अगर यह आपात स्थिति लगती है)
          </h4>
          <p className="text-[11px] text-red-800 mt-1 leading-relaxed">
            Seek immediate local emergency medical help. Do not wait for this CareFlow session to finish.
          </p>
          <p className="text-[10.5px] text-red-700 font-hindi mt-0.5">
            तुरंत स्थानीय आपातकालीन चिकित्सा सहायता लें। CareFlow सत्र पूरा होने का इंतज़ार न करें।
          </p>
        </div>
      </div>

      {/* 6. Patient Reassurance */}
      <div className="bg-[#f0fdfa] rounded-2xl p-3.5 border border-[#ccfbf1] flex items-start gap-3 shadow-xs">
        <div className="w-9 h-9 rounded-xl bg-[#0d6e6e] text-white flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[19px]">verified_user</span>
        </div>
        <div className="flex flex-col">
          <h4 className="text-xs font-bold text-[#0f1e36]">
            You're not alone • <span className="font-hindi">आप अकेले नहीं हैं</span>
          </h4>
          <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
            Your care team can use this information to better understand what you're experiencing and recommend appropriate next steps.
          </p>
          <p className="text-[10.5px] text-slate-500 font-hindi mt-0.5">
            आपकी देखभाल टीम इस जानकारी का उपयोग आपकी स्थिति को बेहतर समझने के लिए कर सकती है।
          </p>
        </div>
      </div>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-4 bg-white/95 backdrop-blur-md border-t border-slate-200/80 z-30 shadow-[0_-4px_16px_rgba(0,0,0,0.05)] space-y-2">
        <button
          onClick={onContinue}
          className="w-full h-12 py-3 px-6 rounded-full bg-[#0d6e6e] hover:bg-[#094e4e] active:scale-[0.99] text-white font-bold text-[15px] flex items-center justify-center gap-2 shadow-md shadow-teal-900/15 transition-all"
          type="button"
        >
          <span>Continue to Care Team</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
        <div className="text-center">
          <span className="text-[11px] text-slate-500 font-hindi">(केयर टीम के साथ जारी रखें)</span>
        </div>
      </div>
    </div>
  );
};
