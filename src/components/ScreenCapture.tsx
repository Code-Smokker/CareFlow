import React, { useState, useRef } from 'react';
import { CareFlowSession, DocumentCategory, Language } from '../types';
import { speakText } from '../utils/speech';

interface ScreenCaptureProps {
  patientData: CareFlowSession;
  language: Language;
  onUpdateDocument?: (docUpdates: Partial<CareFlowSession['document']>) => void;
  onCapture?: () => void;
  onCaptureComplete?: (fileInfo?: { name: string; size: string }) => void;
  onSkipToProcess?: () => void;
}

export const ScreenCapture: React.FC<ScreenCaptureProps> = ({
  patientData,
  language,
  onUpdateDocument,
  onCapture,
  onCaptureComplete,
  onSkipToProcess,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory>(patientData.document.category);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(patientData.document.imageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProceed = () => {
    if (onCapture) {
      onCapture();
    } else if (onCaptureComplete) {
      onCaptureComplete();
    } else if (onSkipToProcess) {
      onSkipToProcess();
    }
  };

  const handleHearAudio = () => {
    if (isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      return;
    }
    const textToSpeak = language === 'hi'
      ? 'अपनी मेडिकल रिपोर्ट जोड़ें। अपने प्रिस्क्रिप्शन, रिपोर्ट या मेडिकल दस्तावेज़ की साफ़ तस्वीर लें।'
      : "Let's add your medical document. Take a clear photo of your prescription, report, or medical document.";

    speakText(
      textToSpeak,
      language,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const handleCategorySelect = (category: DocumentCategory) => {
    setSelectedCategory(category);
    const names = {
      prescription: { en: 'Prescription', hi: 'प्रिस्क्रिप्शन' },
      lab_report: { en: 'Lab Report', hi: 'लैब रिपोर्ट' },
      other_doc: { en: 'Other Doc', hi: 'अन्य दस्तावेज़' },
    };
    onUpdateDocument?.({
      category,
      documentType: `${names[category].en} (${names[category].hi})`,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      setPreviewImage(url);
      onUpdateDocument?.({
        fileName: file.name,
        fileSize: sizeStr,
        capturedAt: 'Captured just now',
        imageUrl: url,
      });
      onCaptureComplete?.({
        name: file.name,
        size: sizeStr,
      });
    }
  };

  return (
    <div className="flex flex-col w-full space-y-3.5 pb-28">
      {/* 1. Main Heading & Bilingual Subtitle */}
      <div className="space-y-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h1 className="text-[23px] font-extrabold text-[#0f1e36] tracking-tight leading-tight">
              Let's add your medical document
            </h1>
            <p className="text-[17px] font-bold text-[#0d6e6e] mt-0.5 font-hindi">
              अपनी मेडिकल रिपोर्ट जोड़ें
            </p>
          </div>
          {/* Hear Audio Button */}
          <button
            aria-label="Audio readout in Hindi and English"
            onClick={handleHearAudio}
            className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full border transition-all mt-1 shadow-xs active:scale-95 ${
              isSpeaking
                ? 'bg-[#0d6e6e] text-white border-[#0d6e6e]'
                : 'bg-[#f0fdfa] border-[#ccfbf1] hover:bg-[#e6f7f7] text-[#0d6e6e]'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isSpeaking ? 'pause' : 'volume_up'}
            </span>
            <span className="text-xs font-semibold">{isSpeaking ? 'Playing...' : 'Hear'}</span>
          </button>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed pt-0.5">
          Take a clear photo of your prescription, report, or medical document.
          <span className="block text-[11px] text-slate-500 mt-0.5 font-hindi">
            अपने प्रिस्क्रिप्शन, रिपोर्ट या मेडिकल दस्तावेज़ की साफ़ तस्वीर लें।
          </span>
        </p>
      </div>

      {/* 2. "What are you adding?" Selector Card */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            What are you adding? · <span className="font-hindi text-[11px]">क्या जोड़ रहे हैं?</span>
          </h2>
        </div>

        {/* 3 Option Buttons */}
        <div className="grid grid-cols-3 gap-2">
          {/* Prescription */}
          <button
            type="button"
            onClick={() => handleCategorySelect('prescription')}
            className={`relative flex flex-col items-center justify-center p-2.5 rounded-xl border-2 text-center transition-all ${
              selectedCategory === 'prescription'
                ? 'border-[#0d6e6e] bg-[#f0fdfa] shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            {selectedCategory === 'prescription' && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#0d6e6e] text-white flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[11px] font-bold">check</span>
              </span>
            )}
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1 ${
                selectedCategory === 'prescription'
                  ? 'bg-[#ccfbf1] text-[#0d6e6e]'
                  : 'bg-slate-50 text-slate-500'
              }`}
            >
              <span className="material-symbols-outlined text-[19px]">prescriptions</span>
            </div>
            <span className="text-xs font-bold text-[#0f1e36] leading-tight">Prescription</span>
            <span className="text-[10px] font-semibold text-[#0d6e6e] mt-0.5 font-hindi">प्रिस्क्रिप्शन</span>
          </button>

          {/* Lab Report */}
          <button
            type="button"
            onClick={() => handleCategorySelect('lab_report')}
            className={`relative flex flex-col items-center justify-center p-2.5 rounded-xl border-2 text-center transition-all ${
              selectedCategory === 'lab_report'
                ? 'border-[#0d6e6e] bg-[#f0fdfa] shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            {selectedCategory === 'lab_report' && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#0d6e6e] text-white flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[11px] font-bold">check</span>
              </span>
            )}
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1 ${
                selectedCategory === 'lab_report'
                  ? 'bg-[#ccfbf1] text-[#0d6e6e]'
                  : 'bg-slate-50 text-slate-500'
              }`}
            >
              <span className="material-symbols-outlined text-[19px]">assignment</span>
            </div>
            <span className="text-xs font-semibold text-[#0f1e36] leading-tight">Lab Report</span>
            <span className="text-[10px] font-medium text-slate-500 mt-0.5 font-hindi">लैब रिपोर्ट</span>
          </button>

          {/* Other Doc */}
          <button
            type="button"
            onClick={() => handleCategorySelect('other_doc')}
            className={`relative flex flex-col items-center justify-center p-2.5 rounded-xl border-2 text-center transition-all ${
              selectedCategory === 'other_doc'
                ? 'border-[#0d6e6e] bg-[#f0fdfa] shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            {selectedCategory === 'other_doc' && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#0d6e6e] text-white flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[11px] font-bold">check</span>
              </span>
            )}
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1 ${
                selectedCategory === 'other_doc'
                  ? 'bg-[#ccfbf1] text-[#0d6e6e]'
                  : 'bg-slate-50 text-slate-500'
              }`}
            >
              <span className="material-symbols-outlined text-[19px]">description</span>
            </div>
            <span className="text-xs font-semibold text-[#0f1e36] leading-tight">Other Doc</span>
            <span className="text-[10px] font-medium text-slate-500 mt-0.5 font-hindi">अन्य दस्तावेज़</span>
          </button>
        </div>
      </div>

      {/* 3. Camera / Document Scanner Viewfinder Card */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs space-y-2.5">
        <div className="relative w-full h-[220px] rounded-xl bg-[#f0fdfa] border border-[#ccfbf1] overflow-hidden flex flex-col items-center justify-between p-3.5 select-none">
          {/* Status Pill at Top */}
          <div className="z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-white/95 text-[#0d6e6e] border border-[#ccfbf1] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Ready to scan · <span className="font-hindi">स्कैन के लिए तैयार</span></span>
          </div>

          {/* Pulsing scanning beam */}
          <div className="scan-beam absolute inset-x-6 top-1/2 h-8 bg-gradient-to-b from-transparent via-[#0d6e6e]/25 to-transparent pointer-events-none z-10" />

          {/* Viewfinder frame with 4 prominent teal rounded corner brackets */}
          <div className="relative w-[210px] h-[125px] border border-dashed border-[#0d6e6e]/40 rounded-lg flex flex-col items-center justify-center bg-white/85 backdrop-blur-[1px] shadow-xs overflow-hidden">
            <div className="scanner-corner corner-tl"></div>
            <div className="scanner-corner corner-tr"></div>
            <div className="scanner-corner corner-bl"></div>
            <div className="scanner-corner corner-br"></div>

            {previewImage ? (
              <img
                src={previewImage}
                alt="Document preview"
                className="w-full h-full object-cover opacity-90"
              />
            ) : (
              <>
                <div className="w-9 h-9 rounded-full bg-[#f0fdfa] border border-[#ccfbf1] text-[#0d6e6e] flex items-center justify-center mb-1 shadow-xs">
                  <span className="material-symbols-outlined text-[21px]">document_scanner</span>
                </div>
                <span className="text-[11px] font-bold text-[#0d6e6e]">Align Document inside frame</span>
                <span className="text-[9.5px] text-slate-500 font-medium font-hindi">दस्तावेज़ को फ्रेम के अंदर रखें</span>
              </>
            )}
          </div>

          {/* Bottom Camera Alignment Hint */}
          <div className="z-10 flex items-center gap-1.5 text-[11px] font-medium text-slate-600 bg-white/80 px-2.5 py-0.5 rounded-full">
            <span className="material-symbols-outlined text-[15px] text-[#0d6e6e]">center_focus_strong</span>
            <span>Auto-detecting borders</span>
          </div>
        </div>
      </div>

      {/* 4. Photo Guidance Card */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#0f1e36]">
          <span className="material-symbols-outlined text-[17px] text-[#0d6e6e]">tips_and_updates</span>
          <span>Tips for a clear photo · <span className="font-hindi text-[11px]">साफ़ तस्वीर के लिए सुझाव</span></span>
        </div>
        <ul className="space-y-1.5 pt-0.5 text-xs text-slate-600">
          <li className="flex items-start gap-2">
            <span className="w-4 h-4 rounded-full bg-[#f0fdfa] border border-[#ccfbf1] text-[#0d6e6e] flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[11px] font-bold">check</span>
            </span>
            <span>
              <strong>Keep document flat</strong> on an even surface{' '}
              <span className="font-hindi text-[11px] text-slate-500">(दस्तावेज़ को समतल सतह पर रखें)</span>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-4 h-4 rounded-full bg-[#f0fdfa] border border-[#ccfbf1] text-[#0d6e6e] flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[11px] font-bold">check</span>
            </span>
            <span>
              <strong>Ensure all text is visible</strong> and in focus{' '}
              <span className="font-hindi text-[11px] text-slate-500">(सभी लिखावट साफ़ दिखनी चाहिए)</span>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-4 h-4 rounded-full bg-[#f0fdfa] border border-[#ccfbf1] text-[#0d6e6e] flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[11px] font-bold">check</span>
            </span>
            <span>
              <strong>Avoid glare and harsh shadows</strong>{' '}
              <span className="font-hindi text-[11px] text-slate-500">(चमक और छाया से बचें)</span>
            </span>
          </li>
        </ul>
      </div>

      {/* 5. Choose from Photos Button */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,.pdf"
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="w-full py-2.5 px-4 rounded-xl border border-[#0d6e6e] bg-white hover:bg-[#f0fdfa] flex items-center justify-center gap-2 text-xs font-bold text-[#0f1e36] shadow-xs active:scale-95 transition-all"
        type="button"
      >
        <span className="material-symbols-outlined text-[18px] text-[#0d6e6e]">add_photo_alternate</span>
        <span>Choose from Photos · <span className="font-hindi">गैलरी से चुनें</span></span>
      </button>

      {/* 6. Security Reassurance Card */}
      <div className="rounded-2xl p-3.5 bg-[#f0fdfa] border border-[#ccfbf1] flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-white text-[#0d6e6e] border border-[#ccfbf1] flex items-center justify-center shrink-0 shadow-xs">
          <span className="material-symbols-outlined fill-1 text-[18px]">verified_user</span>
        </div>
        <div className="space-y-0.5">
          <h3 className="text-xs font-bold text-[#0d6e6e]">
            Your document is safe · <span className="font-hindi">आपके दस्तावेज़ सुरक्षित हैं</span>
          </h3>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Your medical documents are securely processed and are only used to help your care team understand your health information.
          </p>
        </div>
      </div>

      {/* Sticky Bottom Action & Security Footer */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-4 bg-white/95 backdrop-blur-md border-t border-slate-200/80 z-30 shadow-[0_-4px_16px_rgba(0,0,0,0.05)] space-y-2">
        <button
          onClick={handleProceed}
          className="w-full h-12 py-3 px-6 rounded-full bg-[#0d6e6e] hover:bg-[#094e4e] active:scale-[0.99] text-white font-bold text-[15px] flex items-center justify-center gap-2 shadow-md shadow-teal-900/15 transition-all"
          type="button"
        >
          <span>Capture Document</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 text-center">
          <span className="material-symbols-outlined text-[13px] text-slate-400">lock</span>
          <span>Private & Secure • ABDM Compliant • आपके दस्तावेज़ सुरक्षित हैं</span>
        </div>
      </div>
    </div>
  );
};
