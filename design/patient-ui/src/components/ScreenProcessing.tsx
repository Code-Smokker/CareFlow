import React, { useState, useEffect } from 'react';
import { CareFlowSession, Language } from '../types';
import { speakText } from '../utils/speech';

interface ScreenProcessingProps {
  patientData: CareFlowSession;
  language: Language;
  onContinue: () => void;
  onRetake: () => void;
  onViewPreview: () => void;
}

export const ScreenProcessing: React.FC<ScreenProcessingProps> = ({
  patientData,
  language,
  onContinue,
  onRetake,
  onViewPreview,
}) => {
  const [extractProgress, setExtractProgress] = useState(85);
  const [activeStep, setActiveStep] = useState<number>(2); // 1: captured, 2: reading, 3: ready
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // Simulate active extraction completing to 100%
    const timer = setTimeout(() => {
      setExtractProgress(100);
      setActiveStep(3);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  const handleHearAudio = () => {
    if (isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      return;
    }
    const textToSpeak = language === 'hi'
      ? 'आपके दस्तावेज़ को प्रोसेस किया जा रहा है। हम आपके दस्तावेज़ को सुरक्षित रूप से पढ़ रहे हैं। इसमें बस कुछ क्षण लगते हैं।'
      : "Your document is being processed. We're securely reading your document. This usually takes just a moment.";

    speakText(
      textToSpeak,
      language,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  return (
    <div className="flex flex-col w-full space-y-4 pb-28">
      {/* 1. Page Intro & Bilingual Headings */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-1 rounded-full bg-[#ccfbf1] text-[#0d6e6e] font-bold text-[11px] uppercase tracking-wider">
              Document Processing
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
              Care triage
            </span>
          </div>
          {/* Accessible Audio Pill */}
          <button
            aria-label="Listen to instructions in English and Hindi"
            onClick={handleHearAudio}
            className={`h-8 px-3 rounded-full flex items-center gap-1.5 shadow-xs transition-all active:scale-95 text-xs font-semibold ${
              isSpeaking
                ? 'bg-[#0d6e6e] text-white'
                : 'bg-white border border-slate-200 text-[#0f1e36] hover:bg-slate-50'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[16px] text-[#0d6e6e]">
              {isSpeaking ? 'pause' : 'volume_up'}
            </span>
            <span>{isSpeaking ? 'Playing...' : 'Hear / सुनें'}</span>
          </button>
        </div>

        {/* Step Tracker Bar */}
        <div className="bg-white p-3 rounded-xl shadow-xs border border-slate-100 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-[#0f1e36]">Step 6 of 8 • Documents</span>
            <span className="text-[#0d6e6e] font-bold">80% Complete</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full bg-[#0d6e6e] rounded-full w-[80%] transition-all duration-500"></div>
          </div>
          <div className="flex items-center justify-between text-[10.5px] text-slate-400 pt-0.5">
            <span className="text-[#0d6e6e] font-semibold flex items-center gap-0.5">✓ Basics</span>
            <span className="text-[#0d6e6e] font-semibold flex items-center gap-0.5">✓ Symptoms</span>
            <span className="text-[#0d6e6e] font-bold flex items-center gap-0.5">● Documents</span>
            <span className="flex items-center gap-0.5">○ Review</span>
            <span className="flex items-center gap-0.5">○ Complete</span>
          </div>
        </div>

        {/* Main Title Section */}
        <div className="pt-1 flex flex-col gap-1">
          <h1 className="text-[24px] font-extrabold text-[#0f1e36] tracking-tight leading-tight">
            Your document is being processed
          </h1>
          <p className="text-[17px] text-[#0d6e6e] font-bold font-hindi">
            आपके दस्तावेज़ को प्रोसेस किया जा रहा है
          </p>
          <div className="mt-1 bg-[#f0fdfa] border border-[#ccfbf1]/70 p-3 rounded-xl flex flex-col gap-1">
            <p className="text-xs text-slate-700 leading-relaxed">
              We're securely reading your document. This usually takes just a moment.
            </p>
            <p className="text-[11.5px] text-slate-600 leading-relaxed font-hindi">
              हम आपके दस्तावेज़ को सुरक्षित रूप से पढ़ रहे हैं। इसमें बस कुछ क्षण लगते हैं।
            </p>
          </div>
        </div>
      </div>

      {/* 2. Main Processing & Document Tray Card */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 flex flex-col gap-4 relative overflow-hidden">
        {/* Header Status Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 text-[#0f1e36] text-xs font-semibold w-fit border border-slate-200/70">
            <span className="material-symbols-outlined text-[16px] text-[#0d6e6e]">description</span>
            <span>Prescription / <span className="font-hindi">प्रिस्क्रिप्शन</span></span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0fdfa] border border-[#ccfbf1] text-[#0d6e6e] text-xs font-semibold w-fit">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0d6e6e] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0d6e6e]"></span>
            </span>
            <span>Processing securely... · <span className="font-hindi">सुरक्षित रूप से प्रोसेस हो रहा है</span></span>
          </div>
        </div>

        {/* Document Tray Preview Container */}
        <div className="bg-slate-50/90 rounded-xl p-3 flex items-center gap-3.5 z-10 border border-slate-100">
          {/* Thumbnail Prescription Visual */}
          <div className="relative w-16 h-20 rounded-lg bg-white shadow-xs border border-slate-200 flex-shrink-0 flex flex-col p-1.5 justify-between overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[10px] text-[#0d6e6e] leading-none">Rx</span>
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            </div>
            <div className="flex flex-col gap-1 w-full opacity-70">
              <div className="w-full h-1 bg-slate-200 rounded-full"></div>
              <div className="w-3/4 h-1 bg-slate-200 rounded-full"></div>
              <div className="w-5/6 h-1 bg-[#0d6e6e]/40 rounded-full"></div>
              <div className="w-1/2 h-1 bg-slate-200 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between pt-0.5 text-[8px] text-slate-400">
              <span>ABDM</span>
              <div className="w-4 h-1 bg-[#0d6e6e]/40 rounded-full"></div>
            </div>
            {/* Captured Check badge */}
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-[#0d6e6e] text-white rounded-full flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[10px] font-bold">check</span>
            </div>
          </div>

          {/* Metadata */}
          <div className="flex flex-col justify-center min-w-0 flex-1">
            <span className="text-xs font-bold text-[#0f1e36] truncate">
              {patientData.document.fileName}
            </span>
            <span className="text-[11px] text-slate-600">Prescription · Rx Slip</span>
            <span className="text-[10px] text-slate-400 mt-0.5">
              {patientData.document.capturedAt} · {patientData.document.fileSize}
            </span>
            <div className="flex items-center gap-3 mt-1.5">
              <button
                onClick={onViewPreview}
                className="text-[#0d6e6e] text-xs font-bold hover:underline flex items-center gap-0.5"
                type="button"
              >
                <span className="material-symbols-outlined text-[14px]">visibility</span>
                <span>View preview</span>
              </button>
              <span className="text-slate-300">•</span>
              <button
                onClick={onRetake}
                className="text-[#0d6e6e] text-xs font-bold hover:underline flex items-center gap-0.5"
                type="button"
              >
                <span className="material-symbols-outlined text-[14px]">replay</span>
                <span>Retake</span>
              </button>
            </div>
          </div>
        </div>

        {/* Processing Steps Timeline (Vertical Checklist) */}
        <div className="flex flex-col gap-3 pt-1 z-10">
          {/* Step 1: Completed */}
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#0d6e6e] text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
              <span className="material-symbols-outlined text-[14px] font-bold">check</span>
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-bold text-[#0f1e36]">
                Document captured · Image quality checked
              </p>
              <p className="text-[10.5px] text-slate-500 font-hindi">
                दस्तावेज़ कैप्चर हुआ · गुणवत्ता मान्य
              </p>
            </div>
          </div>

          {/* Step 2: In-Progress or Complete */}
          <div className="flex items-start gap-3">
            <div className="relative w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
              {activeStep >= 3 ? (
                <div className="w-6 h-6 rounded-full bg-[#0d6e6e] text-white flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                </div>
              ) : (
                <>
                  <span className="animate-ping absolute inline-flex h-5 w-5 rounded-full bg-[#0d6e6e] opacity-40"></span>
                  <div className="w-6 h-6 rounded-full bg-[#ccfbf1] text-[#0d6e6e] flex items-center justify-center shadow-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0d6e6e]"></span>
                  </div>
                </>
              )}
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-bold text-[#0d6e6e]">
                Reading document · Extracting medical & dosage details
              </p>
              <p className="text-[10.5px] text-[#0d6e6e]/80 font-medium font-hindi">
                दस्तावेज़ का विश्लेषण जारी है
              </p>
            </div>
          </div>

          {/* Step 3: Upcoming / Ready */}
          <div className={`flex items-start gap-3 ${activeStep < 3 ? 'opacity-60' : 'opacity-100'}`}>
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              {activeStep >= 3 ? (
                <span className="material-symbols-outlined text-[14px] text-emerald-600 font-bold">check</span>
              ) : (
                <span className="material-symbols-outlined text-[14px] text-slate-400">radio_button_unchecked</span>
              )}
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-semibold text-[#0f1e36]">
                Preparing review · You'll verify extracted details next
              </p>
              <p className="text-[10.5px] text-slate-500 font-hindi">
                समीक्षा तैयार हो रही है
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Document Information Summary Card */}
      <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-slate-100 flex items-center justify-between gap-2">
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Document Type</span>
          <span className="text-xs font-bold text-[#0f1e36] truncate">Prescription (प्रिस्क्रिप्शन)</span>
        </div>
        <div className="w-px h-8 bg-slate-200"></div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Pages</span>
          <span className="text-xs font-bold text-[#0f1e36]">1 of 1</span>
        </div>
        <div className="w-px h-8 bg-slate-200"></div>
        <div className="flex flex-col items-end min-w-[90px]">
          <div className="flex items-center justify-between w-full text-[10px] font-semibold">
            <span className="text-slate-400 uppercase tracking-wider">Extract</span>
            <span className="text-[#0d6e6e] font-bold">{extractProgress}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-100 mt-1 overflow-hidden">
            <div
              className="h-full bg-[#0d6e6e] rounded-full transition-all duration-500"
              style={{ width: `${extractProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 4. Security & Privacy Card */}
      <div className="bg-[#f0fdfa] rounded-2xl p-3.5 border border-[#ccfbf1] flex items-start gap-3 shadow-xs">
        <div className="w-8 h-8 rounded-xl bg-white text-[#0d6e6e] border border-[#ccfbf1] flex items-center justify-center shrink-0 shadow-xs">
          <span className="material-symbols-outlined text-[19px] fill-1">shield</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <h3 className="text-xs font-bold text-[#0f1e36]">
            Your document is secure · <span className="font-hindi">आपके दस्तावेज़ सुरक्षित हैं</span>
          </h3>
          <p className="text-[11px] text-slate-600 leading-snug">
            Your medical document is securely processed and used only to help your care team understand your health information.
          </p>
        </div>
      </div>

      {/* 5. Sticky Bottom Action Area */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-4 bg-white/95 backdrop-blur-md border-t border-slate-200/80 z-30 shadow-[0_-4px_16px_rgba(0,0,0,0.05)] space-y-2">
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#0d6e6e] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Ready to review extracted data • <span className="font-hindi">समीक्षा के लिए तैयार</span></span>
        </div>
        <button
          onClick={onContinue}
          className="w-full h-12 py-3 px-6 rounded-full bg-[#0d6e6e] hover:bg-[#094e4e] active:scale-[0.99] text-white font-bold text-[15px] flex items-center justify-center gap-2 shadow-md shadow-teal-900/15 transition-all"
          type="button"
        >
          <span>Continue to Review →</span>
          <span className="text-xs font-normal text-teal-100 font-hindi">(आगे बढ़ें)</span>
        </button>
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
          <span className="material-symbols-outlined text-[13px]">lock</span>
          <span>Private & Secure • ABDM Compliant • आपके दस्तावेज़ सुरक्षित हैं</span>
        </div>
      </div>
    </div>
  );
};
