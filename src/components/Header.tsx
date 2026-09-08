import React, { useState } from 'react';
import { ScreenId, Language } from '../types';

export interface StepInfo {
  categoryBadge: string;
  subBadge: string;
  percentComplete: number;
  stepTitleEn: string;
  stepTitleHi?: string;
  assessmentNumber?: string;
}

const DEFAULT_STEP_INFO: Record<ScreenId, StepInfo> = {
  'splash': { categoryBadge: 'WELCOME', subBadge: 'Start', percentComplete: 0, stepTitleEn: 'CareFlow' },
  'checkin': { categoryBadge: 'CHECK-IN', subBadge: 'Step 1', percentComplete: 5, stepTitleEn: 'Patient Check-in', stepTitleHi: 'मरीज़ चेक-इन' },
  'language': { categoryBadge: 'PREFERENCES', subBadge: 'Step 1', percentComplete: 10, stepTitleEn: 'Select Language', stepTitleHi: 'भाषा चुनें' },
  'consent': { categoryBadge: 'CONSENT', subBadge: 'Step 1', percentComplete: 15, stepTitleEn: 'Patient Consent', stepTitleHi: 'मरीज़ की सहमति' },
  'abha-scan': { categoryBadge: 'IDENTIFICATION', subBadge: 'Step 1', percentComplete: 20, stepTitleEn: 'Scan ABHA QR', stepTitleHi: 'आभा क्यूआर स्कैन करें' },
  'abha-otp': { categoryBadge: 'VERIFICATION', subBadge: 'Step 1', percentComplete: 25, stepTitleEn: 'Verify ABHA', stepTitleHi: 'आभा सत्यापित करें' },
  'profile': { categoryBadge: 'PROFILE', subBadge: 'Step 1', percentComplete: 30, stepTitleEn: 'Patient Details', stepTitleHi: 'मरीज़ का विवरण' },
  'attendant': { categoryBadge: 'ATTENDANT', subBadge: 'Step 1', percentComplete: 35, stepTitleEn: 'Who is with the patient?', stepTitleHi: 'मरीज़ के साथ कौन है?' },
  'chief-complaint': { categoryBadge: 'SYMPTOMS', subBadge: 'Step 2', percentComplete: 45, stepTitleEn: 'Chief Complaint', stepTitleHi: 'मुख्य समस्या' },
  'symptoms': { categoryBadge: 'SYMPTOMS', subBadge: 'Step 2', percentComplete: 55, stepTitleEn: 'Additional Symptoms', stepTitleHi: 'अन्य लक्षण' },
  'capture': { categoryBadge: 'DOCUMENTS', subBadge: 'Step 3', percentComplete: 60, stepTitleEn: 'Capture Medical Documents', stepTitleHi: 'चिकित्सा दस्तावेज़ जोड़ें' },
  'processing': { categoryBadge: 'AI EXTRACTION', subBadge: 'Step 3', percentComplete: 68, stepTitleEn: 'Processing Document', stepTitleHi: 'दस्तावेज़ की जाँच हो रही है' },
  'review': { categoryBadge: 'CLINICAL REVIEW', subBadge: 'Step 4', percentComplete: 75, stepTitleEn: 'Review Extracted Info', stepTitleHi: 'निकाली गई जानकारी की समीक्षा करें' },
  'summary': { categoryBadge: 'INTAKE SUMMARY', subBadge: 'Step 5', percentComplete: 90, stepTitleEn: 'Pre-Consultation Summary', stepTitleHi: 'परामर्श पूर्व सारांश' },
  'alert': { categoryBadge: 'CLINICAL ALERT', subBadge: 'Priority Flag', percentComplete: 92, stepTitleEn: 'Clinical Alert Detected', stepTitleHi: 'क्लिनिकल चेतावनी' },
  'handoff': { categoryBadge: 'CARE HANDOFF', subBadge: 'Final Step', percentComplete: 96, stepTitleEn: 'Share with Care Team', stepTitleHi: 'देखभाल दल के साथ साझा करें' },
  'complete': { categoryBadge: 'SESSION COMPLETE', subBadge: 'Completed', percentComplete: 100, stepTitleEn: 'Ready for Consultation', stepTitleHi: 'परामर्श के लिए तैयार' },
};

interface HeaderProps {
  currentScreen?: ScreenId;
  language?: string;
  currentLanguage?: string; // from P1
  onLanguageChange?: (lang: string) => void;
  onToggleLanguage?: () => void;
  onBack?: () => void;
  showBack?: boolean;
  showHelp?: boolean;
  onHelp?: () => void;
  patientName?: string;
  stepInfo?: Partial<StepInfo>;
  stepTitle?: string; // from P1
  progressPercent?: number; // from P1
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen = 'splash',
  language,
  currentLanguage,
  onLanguageChange,
  onToggleLanguage,
  onBack,
  showBack = true,
  showHelp = false,
  onHelp,
  stepInfo,
  stepTitle,
  progressPercent,
}) => {
  const [showLangMenu, setShowLangMenu] = useState(false);

  // Reconcile language prop from P1 and P2
  const activeLanguage = language || currentLanguage || 'en';

  const languages = [
    { code: 'hi', label: 'हिन्दी' },
    { code: 'en', label: 'English' },
  ];

  const fallback = DEFAULT_STEP_INFO[currentScreen] || DEFAULT_STEP_INFO.splash;
  const activeStepInfo: StepInfo = {
    categoryBadge: stepInfo?.categoryBadge ?? fallback.categoryBadge,
    subBadge: stepInfo?.subBadge ?? fallback.subBadge,
    percentComplete: progressPercent ?? stepInfo?.percentComplete ?? fallback.percentComplete,
    stepTitleEn: stepTitle ?? stepInfo?.stepTitleEn ?? fallback.stepTitleEn,
    stepTitleHi: stepInfo?.stepTitleHi ?? fallback.stepTitleHi,
  };

  const handleSelectLanguage = (langLabel: string) => {
    if (onLanguageChange) {
      onLanguageChange(langLabel);
    } else if (onToggleLanguage) {
      onToggleLanguage();
    }
    setShowLangMenu(false);
  };

  const getBreadcrumbStatus = (stage: 'basics' | 'symptoms' | 'docs' | 'review' | 'complete') => {
    const screens = {
      basics: ['checkin', 'language', 'consent', 'abha-scan', 'abha-otp', 'profile', 'attendant'],
      symptoms: ['chief-complaint', 'symptoms'],
      docs: ['capture', 'processing'],
      review: ['review'],
      complete: ['summary', 'alert', 'handoff', 'complete']
    };

    if (screens[stage].includes(currentScreen)) return 'active';
    
    const stagePercents = { basics: 35, symptoms: 55, docs: 68, review: 75, complete: 100 };
    if (activeStepInfo.percentComplete > stagePercents[stage]) return 'done';
    
    return 'upcoming';
  };

  if (currentScreen === 'splash') {
    return null;
  }

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
      <div className="pt-2 px-6 flex justify-between items-center text-xs font-semibold text-slate-500">
        <span>9:41</span>
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[15px]">signal_cellular_alt</span>
          <span className="material-symbols-outlined text-[15px]">wifi</span>
          <span className="material-symbols-outlined text-[16px]">battery_full</span>
        </div>
      </div>

      <div className="px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showBack && onBack ? (
            <button
              aria-label="Go Back"
              onClick={onBack}
              className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 shadow-xs flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-95 transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
          ) : <div className="w-9 h-9" />}

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#0d6e6e] flex items-center justify-center text-white shadow-sm shadow-teal-900/15 overflow-hidden">
              <span className="material-symbols-outlined fill-1 text-[19px]">volunteer_activism</span>
            </div>
            <span className="font-bold text-[19px] tracking-tight text-[#0f1e36]">CareFlow</span>
          </div>
        </div>

        <div className="flex items-center gap-2 relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/90 text-xs font-semibold text-[#0f1e36] transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px] text-[#0d6e6e]">language</span>
            <span>{activeLanguage === 'en' || activeLanguage === 'English' ? 'English' : 'हिंदी'}</span>
            <span className="material-symbols-outlined text-[15px] text-slate-400">expand_more</span>
          </button>

          {showLangMenu && (
            <div className="absolute top-10 right-8 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-50 min-w-[120px]">
              {languages.map(l => (
                <button
                  key={l.code}
                  onClick={() => handleSelectLanguage(l.label)}
                  className={`w-full text-left px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-between ${
                    (activeLanguage === l.label || activeLanguage === l.code) ? 'bg-[#f0fdfa] text-[#0d6e6e]' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>{l.label}</span>
                  {(activeLanguage === l.label || activeLanguage === l.code) && <span className="material-symbols-outlined text-[14px]">check</span>}
                </button>
              ))}
            </div>
          )}

          {showHelp ? (
            <button
              onClick={onHelp}
              className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 shadow-xs flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">help_outline</span>
            </button>
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#0d6e6e] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 pt-1 pb-3 border-t border-slate-100 bg-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#f0fdfa] text-[#0d6e6e] border border-[#ccfbf1]">
              {activeStepInfo.categoryBadge}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
              {activeStepInfo.subBadge}
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#e6fffa] text-[#0d6e6e] border border-[#2dd4bf]/40">
            {activeStepInfo.percentComplete}% Complete
          </span>
        </div>

        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
          <span className="font-bold text-[#0f1e36]">
            {activeStepInfo.stepTitleEn} {activeStepInfo.stepTitleHi && activeLanguage !== 'en' && activeLanguage !== 'English' && <span className="font-hindi text-slate-500 font-normal">| {activeStepInfo.stepTitleHi}</span>}
          </span>
        </div>

        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-[#0d6e6e] rounded-full transition-all duration-500"
            style={{ width: `${activeStepInfo.percentComplete}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10.5px] font-medium pt-0.5 text-slate-500">
          <span className={`flex items-center gap-0.5 ${getBreadcrumbStatus('basics') === 'done' ? 'text-[#0d6e6e] font-semibold' : getBreadcrumbStatus('basics') === 'active' ? 'text-[#0f1e36] font-bold' : 'text-slate-400'}`}>
            {getBreadcrumbStatus('basics') === 'done' ? <span className="material-symbols-outlined text-[13px] font-bold">check</span> : <span className="w-2 h-2 rounded-full bg-[#0d6e6e]"></span>} Basics
          </span>
          <span className={`flex items-center gap-0.5 ${getBreadcrumbStatus('symptoms') === 'done' ? 'text-[#0d6e6e] font-semibold' : getBreadcrumbStatus('symptoms') === 'active' ? 'text-[#0f1e36] font-bold' : 'text-slate-400'}`}>
            {getBreadcrumbStatus('symptoms') === 'done' ? <span className="material-symbols-outlined text-[13px] font-bold">check</span> : getBreadcrumbStatus('symptoms') === 'active' ? <span className="w-2 h-2 rounded-full bg-[#0d6e6e]"></span> : <span className="w-1.5 h-1.5 rounded-full border border-slate-300"></span>} Symptoms
          </span>
          <span className={`flex items-center gap-0.5 ${getBreadcrumbStatus('docs') === 'done' ? 'text-[#0d6e6e] font-semibold' : getBreadcrumbStatus('docs') === 'active' ? 'text-[#0f1e36] font-bold' : 'text-slate-400'}`}>
            {getBreadcrumbStatus('docs') === 'done' ? <span className="material-symbols-outlined text-[13px] font-bold">check</span> : getBreadcrumbStatus('docs') === 'active' ? <span className="w-2 h-2 rounded-full bg-[#0d6e6e]"></span> : <span className="w-1.5 h-1.5 rounded-full border border-slate-300"></span>} Docs
          </span>
          <span className={`flex items-center gap-0.5 ${getBreadcrumbStatus('review') === 'done' ? 'text-[#0d6e6e] font-semibold' : getBreadcrumbStatus('review') === 'active' ? 'text-[#0f1e36] font-bold' : 'text-slate-400'}`}>
            {getBreadcrumbStatus('review') === 'done' ? <span className="material-symbols-outlined text-[13px] font-bold">check</span> : getBreadcrumbStatus('review') === 'active' ? <span className="w-2 h-2 rounded-full bg-[#0d6e6e]"></span> : <span className="w-1.5 h-1.5 rounded-full border border-slate-300"></span>} Review
          </span>
          <span className={`flex items-center gap-0.5 ${getBreadcrumbStatus('complete') === 'done' ? 'text-[#0d6e6e] font-semibold' : getBreadcrumbStatus('complete') === 'active' ? 'text-[#0f1e36] font-bold' : 'text-slate-400'}`}>
            {getBreadcrumbStatus('complete') === 'done' ? <span className="material-symbols-outlined text-[13px] font-bold">check</span> : getBreadcrumbStatus('complete') === 'active' ? <span className="w-2 h-2 rounded-full bg-[#0d6e6e] animate-pulse"></span> : <span className="w-1.5 h-1.5 rounded-full border border-slate-300"></span>} Complete
          </span>
        </div>
      </div>
    </header>
  );
};
