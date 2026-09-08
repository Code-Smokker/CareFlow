import React, { useState } from 'react';
import { CareFlowSession, Language } from '../types';
import { speakText } from '../utils/speech';

interface ScreenReviewProps {
  patientData: CareFlowSession;
  language: Language;
  onContinue: () => void;
  onRetake: () => void;
  onViewOriginal: () => void;
  onEditField: (field: 'doctor' | 'date' | 'type' | 'medicines') => void;
}

export const ScreenReview: React.FC<ScreenReviewProps> = ({
  patientData,
  language,
  onContinue,
  onRetake,
  onViewOriginal,
  onEditField,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleHearAudio = () => {
    if (isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      return;
    }
    const textToSpeak = language === 'hi'
      ? `दस्तावेज़ की समीक्षा। डॉक्टर: ${patientData.document.doctorName}, तारीख: ${patientData.document.consultationDate}, प्रकार: ${patientData.document.documentType}, दवाइयां: ${patientData.document.medicines.join(', ')}। कृपया विवरण की जाँच करें।`
      : `Review your document. Found Doctor ${patientData.document.doctorName}, date ${patientData.document.consultationDate}, type ${patientData.document.documentType}, and medicines: ${patientData.document.medicines.join(', ')}. Please verify the details before continuing.`;

    speakText(
      textToSpeak,
      language,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  return (
    <div className="flex flex-col w-full space-y-3.5 pb-28">
      {/* 1. Progress & Stepper Box */}
      <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-slate-100 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#f0fdfa] text-[#0d6e6e] font-bold uppercase tracking-wider text-[10px] border border-[#ccfbf1]">
              DOCUMENT REVIEW
            </span>
            <span className="text-slate-500 font-medium text-[11px]">Care triage</span>
          </div>
          <span className="text-[#0d6e6e] font-bold text-[11px] tracking-tight">85% Complete</span>
        </div>
        <div className="flex items-center justify-between text-[11px] font-semibold text-[#0f1e36] pt-0.5">
          <span>Step 7 of 8 • Documents</span>
          <span className="text-slate-400 font-normal text-[10px]">Assessment 18</span>
        </div>
        {/* Progress Track */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div className="bg-[#0d6e6e] h-full rounded-full transition-all duration-500" style={{ width: '85%' }}></div>
        </div>
        {/* Sub-step Navigation Line */}
        <div className="flex justify-between items-center text-[10.5px] text-slate-400 pt-0.5 font-medium">
          <span className="text-[#0d6e6e] font-semibold flex items-center gap-0.5">✓ Basics</span>
          <span className="text-[#0d6e6e] font-semibold flex items-center gap-0.5">✓ Symptoms</span>
          <span className="text-[#0d6e6e] font-semibold flex items-center gap-0.5">✓ Documents</span>
          <span className="text-[#0d6e6e] font-bold flex items-center gap-0.5">● Review</span>
          <span>Complete</span>
        </div>
      </div>

      {/* 2. Screen Title & Bilingual Introduction */}
      <div className="flex flex-col gap-1 px-0.5">
        <div className="flex items-center justify-between">
          <h1 className="text-[23px] font-extrabold tracking-tight text-[#0f1e36]">
            Review your document
          </h1>
          <button
            onClick={handleHearAudio}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-xs border transition-all active:scale-95 ${
              isSpeaking
                ? 'bg-[#0d6e6e] text-white border-[#0d6e6e]'
                : 'bg-[#f0fdfa] border-[#ccfbf1] text-[#0d6e6e] hover:bg-teal-100'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">
              {isSpeaking ? 'pause' : 'volume_up'}
            </span>
            <span>{isSpeaking ? 'Playing...' : 'Hear / सुनें'}</span>
          </button>
        </div>
        <h2 className="text-base font-semibold text-[#0d6e6e] font-hindi">
          अपने दस्तावेज़ की जाँच करें
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed pt-0.5">
          We found some information in your document. Please check that it looks correct.
        </p>
        <p className="text-[11px] text-slate-500 leading-relaxed font-hindi">
          हमें आपके दस्तावेज़ में कुछ जानकारी मिली है। कृपया जाँच लें कि यह सही है।
        </p>
      </div>

      {/* 3. Extracted Document Card */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 flex flex-col gap-3.5">
        {/* Header inside Card */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
              <span className="material-symbols-outlined text-[15px] font-bold">check</span>
            </div>
            <div>
              <p className="text-xs font-bold text-[#0f1e36]">Document scanned</p>
              <p className="text-[10px] text-slate-400 font-hindi">दस्तावेज़ स्कैन किया गया</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#f0fdfa] border border-[#ccfbf1] text-[#0d6e6e] font-bold text-[10.5px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0d6e6e]"></span>
            ✓ Successfully scanned
          </span>
        </div>

        {/* Document Preview Thumbnail & Meta */}
        <div className="bg-slate-50/90 rounded-xl p-3 border border-slate-100 flex items-center gap-3">
          <div className="w-14 h-18 bg-white rounded-lg shadow-xs border border-slate-200 p-1.5 flex flex-col justify-between shrink-0 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-1">
              <span className="text-[9px] font-extrabold text-[#0d6e6e] tracking-tight">Rx</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </div>
            <div className="space-y-1 my-1">
              <div className="h-1 bg-slate-200 rounded w-full"></div>
              <div className="h-1 bg-slate-200 rounded w-4/5"></div>
              <div className="h-1 bg-[#0d6e6e]/40 rounded w-2/3"></div>
              <div className="h-1 bg-slate-100 rounded w-1/2"></div>
            </div>
            <div className="pt-1 border-t border-slate-100 flex justify-between items-center text-[7px] text-slate-400">
              <span>ABDM</span>
              <span className="font-bold text-[#0d6e6e]">Dr. S</span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <span className="font-bold text-xs text-[#0f1e36] truncate block">
              {patientData.document.fileName}
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Physical Rx Slip • {patientData.document.capturedAt}
            </p>
            <div className="flex items-center gap-3 mt-1.5 text-[11px] font-semibold">
              <button
                onClick={onViewOriginal}
                className="text-[#0d6e6e] hover:underline flex items-center gap-1"
                type="button"
              >
                <span className="material-symbols-outlined text-[14px]">visibility</span>
                <span>View original</span>
              </button>
              <span className="text-slate-300">•</span>
              <button
                onClick={onRetake}
                className="text-slate-500 hover:text-[#0f1e36] flex items-center gap-1"
                type="button"
              >
                <span className="material-symbols-outlined text-[14px]">replay</span>
                <span>Retake photo</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4. Extracted Information Section */}
        <div className="pt-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f1e36]">
                INFORMATION FOUND
              </h3>
              <p className="text-[10px] text-slate-400 font-hindi">मिली हुई जानकारी की पुष्टि करें</p>
            </div>
            <span className="text-[10.5px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              4 fields extracted
            </span>
          </div>

          {/* Structured Rows */}
          <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden bg-white">
            {/* Row 1: Doctor */}
            <div className="p-3 flex items-center justify-between hover:bg-slate-50/60 transition-colors">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-teal-50 text-[#0d6e6e] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[17px]">person</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Doctor • <span className="font-hindi">डॉक्टर</span>
                  </span>
                  <span className="text-xs font-bold text-[#0f1e36]">{patientData.document.doctorName}</span>
                  <span className="text-[10.5px] text-slate-500 block font-normal">
                    {patientData.document.doctorSpecialty} ({patientData.document.clinicName})
                  </span>
                </div>
              </div>
              <button
                onClick={() => onEditField('doctor')}
                className="text-xs font-bold text-[#0d6e6e] hover:text-[#084c4c] px-2.5 py-1 rounded-lg hover:bg-teal-50 transition-colors"
                type="button"
              >
                Edit
              </button>
            </div>

            {/* Row 2: Date */}
            <div className="p-3 flex items-center justify-between hover:bg-slate-50/60 transition-colors">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-teal-50 text-[#0d6e6e] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[17px]">calendar_today</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Date • <span className="font-hindi">तारीख</span>
                  </span>
                  <span className="text-xs font-bold text-[#0f1e36]">{patientData.document.consultationDate}</span>
                  <span className="text-[10.5px] text-slate-500 block font-normal">Recent consultation</span>
                </div>
              </div>
              <button
                onClick={() => onEditField('date')}
                className="text-xs font-bold text-[#0d6e6e] hover:text-[#084c4c] px-2.5 py-1 rounded-lg hover:bg-teal-50 transition-colors"
                type="button"
              >
                Edit
              </button>
            </div>

            {/* Row 3: Document type */}
            <div className="p-3 flex items-center justify-between hover:bg-slate-50/60 transition-colors">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-teal-50 text-[#0d6e6e] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[17px]">description</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Document Type • <span className="font-hindi">प्रकार</span>
                  </span>
                  <span className="text-xs font-bold text-[#0f1e36]">{patientData.document.documentType}</span>
                  <span className="text-[10.5px] text-slate-500 block font-normal">{patientData.document.subType}</span>
                </div>
              </div>
              <button
                onClick={() => onEditField('type')}
                className="text-xs font-bold text-[#0d6e6e] hover:text-[#084c4c] px-2.5 py-1 rounded-lg hover:bg-teal-50 transition-colors"
                type="button"
              >
                Edit
              </button>
            </div>

            {/* Row 4: Medicines */}
            <div className="p-3 flex items-center justify-between hover:bg-slate-50/60 transition-colors">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-teal-50 text-[#0d6e6e] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[17px]">medication</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Medicines • <span className="font-hindi">दवाइयां</span>
                  </span>
                  <span className="text-xs font-bold text-[#0f1e36]">
                    {patientData.document.medicines.length} medicines found
                  </span>
                  <span className="text-[10.5px] text-slate-500 block font-normal">
                    {patientData.document.medicines.join(', ')}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onEditField('medicines')}
                className="text-xs font-bold text-[#0d6e6e] hover:text-[#084c4c] px-2.5 py-1 rounded-lg hover:bg-teal-50 transition-colors"
                type="button"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Confidence / Verification Guidance Notice */}
      <div className="bg-[#f0fdfa] rounded-2xl p-3.5 border border-[#ccfbf1] flex items-start gap-3">
        <div className="w-7 h-7 rounded-xl bg-teal-100 text-[#0d6e6e] flex items-center justify-center shrink-0 mt-0.5">
          <span className="material-symbols-outlined text-[18px]">verified_user</span>
        </div>
        <div className="space-y-0.5 flex-1">
          <h4 className="text-xs font-bold text-[#0f1e36]">Please verify the details</h4>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            CareFlow extracted this information from your document. You can review and correct anything before it is shared with your care team.
          </p>
          <p className="text-[10.5px] text-slate-500 leading-relaxed font-hindi pt-0.5">
            केयरफ्लो ने आपके दस्तावेज़ से यह विवरण निकाला है। डॉक्टर के साथ साझा करने से पहले आप इसमें बदलाव कर सकते हैं।
          </p>
        </div>
      </div>

      {/* 6. Voice Read-back row */}
      <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#f0fdfa] text-[#0d6e6e] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[16px]">mic</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#0f1e36]">Prefer to hear this aloud?</p>
            <p className="text-[10px] text-slate-400 font-hindi">बोलकर सुनना चाहते हैं?</p>
          </div>
        </div>
        <button
          onClick={handleHearAudio}
          className="px-3 py-1.5 rounded-full bg-[#f0fdfa] border border-[#ccfbf1] hover:bg-teal-100 text-[#0d6e6e] text-xs font-bold flex items-center gap-1 transition-colors"
          type="button"
        >
          <span>Listen</span>
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </button>
      </div>

      {/* 7. Security Reassurance Card */}
      <div className="bg-[#f0fdfa]/70 rounded-2xl p-3 border border-[#ccfbf1]/60 flex items-start gap-2.5">
        <span className="material-symbols-outlined text-[#0d6e6e] text-[17px] shrink-0 mt-0.5">lock</span>
        <div className="text-[11px] leading-snug">
          <span className="font-bold text-[#0f1e36]">Your document stays secure.</span>
          <span className="text-slate-600"> Encrypted and shared only as part of your care journey.</span>
          <span className="block text-[10px] text-slate-500 font-hindi pt-0.5">
            आपकी चिकित्सा जानकारी पूरी तरह से एन्क्रिप्टेड और सुरक्षित है।
          </span>
        </div>
      </div>

      {/* Sticky Bottom Action Area */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-4 bg-white/95 backdrop-blur-md border-t border-slate-200/80 z-30 shadow-[0_-4px_16px_rgba(0,0,0,0.05)] space-y-2">
        <button
          onClick={onContinue}
          className="w-full h-12 py-3 px-6 rounded-full bg-[#0d6e6e] hover:bg-[#094e4e] active:scale-[0.99] text-white font-bold text-[15px] flex items-center justify-center gap-2 shadow-md shadow-teal-900/15 transition-all"
          type="button"
        >
          <span>Continue to Summary →</span>
          <span className="text-xs font-normal text-teal-100 font-hindi">(सारांश देखें)</span>
        </button>
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
          <span className="material-symbols-outlined text-[13px]">lock</span>
          <span>Private & Secure • ABDM Compliant • आपके उत्तर सुरक्षित हैं</span>
        </div>
      </div>
    </div>
  );
};
