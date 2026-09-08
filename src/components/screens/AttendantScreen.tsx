import React, { useState } from 'react';
import { Header } from '../Header';

interface AttendantScreenProps {
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
  onContinue: (modeData: {
    mode: 'myself' | 'helper';
    attendantName?: string;
    role?: 'family' | 'caregiver' | 'asha';
  }) => void;
  onBack: () => void;
}

export const AttendantScreen: React.FC<AttendantScreenProps> = ({
  currentLanguage,
  onLanguageChange,
  onContinue,
  onBack,
}) => {
  const [mode, setMode] = useState<'myself' | 'helper'>('myself');
  const [attendantName, setAttendantName] = useState('');
  const [selectedRole, setSelectedRole] = useState<'family' | 'caregiver' | 'asha'>('asha');

  const handleContinue = () => {
    onContinue({
      mode,
      attendantName: mode === 'helper' ? attendantName : undefined,
      role: mode === 'helper' ? selectedRole : undefined,
    });
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col bg-[#FAFCFD] text-[#0F1E36] pb-6 selection:bg-[#CCFBF1]">
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={onLanguageChange}
        showBack={true}
        onBack={onBack}
      />

      <main className="relative z-10 flex flex-col flex-1 w-full px-4 pt-2 max-w-[430px] mx-auto">
        {/* Progress Tracker: STEP 4 OF 6 (65% completed) */}
        <div className="flex flex-col gap-1 mb-3">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0D6E6E]"></span>
              <span className="tracking-wide uppercase text-[#0F1E36] font-extrabold text-[10px]">
                STEP 4 OF 6
              </span>
            </div>
            <span className="text-[#0D6E6E] font-semibold">65% completed</span>
          </div>

          <div className="grid grid-cols-6 gap-1.5">
            <div className="h-1.5 rounded-full bg-[#0D6E6E]"></div>
            <div className="h-1.5 rounded-full bg-[#0D6E6E]"></div>
            <div className="h-1.5 rounded-full bg-[#0D6E6E]"></div>
            <div className="h-1.5 rounded-full bg-[#0D6E6E]"></div>
            <div className="h-1.5 rounded-full bg-slate-200"></div>
            <div className="h-1.5 rounded-full bg-slate-200"></div>
          </div>

          <div className="flex items-center justify-between text-[9.5px] font-semibold text-slate-400 mt-1 px-0.5">
            <span className="text-[#0D6E6E] flex items-center">✓ Lang</span>
            <span className="text-[#0D6E6E] flex items-center">✓ Consent</span>
            <span className="text-[#0D6E6E] flex items-center">✓ Identity</span>
            <span className="text-[#0D6E6E] font-bold flex items-center">Health ●</span>
            <span className="text-slate-400">Review</span>
            <span className="text-slate-400">Done</span>
          </div>
        </div>

        {/* Hero Illustration & Title */}
        <div className="bg-gradient-to-b from-[#F0F9F9]/70 to-white/90 rounded-2xl p-3.5 border border-teal-100/60 shadow-xs mb-3">
          <div className="flex items-center space-x-3.5">
            {/* Caregiver + Patient Illustration SVG */}
            <div className="w-20 h-20 shrink-0 bg-white rounded-2xl shadow-xs border border-teal-100/80 flex items-center justify-center p-1.5 relative overflow-hidden">
              <svg className="w-full h-full" fill="none" viewBox="0 0 80 80">
                <circle cx="40" cy="40" fill="#E6F4F4" r="34"></circle>
                <path d="M18 68C18 57 28 50 40 50C52 50 62 57 62 68" fill="#CCFBF1" opacity="0.6"></path>
                {/* Patient */}
                <circle cx="30" cy="30" fill="#0D6E6E" r="8.5"></circle>
                <path d="M19 56C19 46.5 24 43 30 43C36 43 41 46.5 41 56H19Z" fill="#0D6E6E" opacity="0.9"></path>
                <circle cx="30" cy="30" fill="#FDE047" opacity="0.4" r="6"></circle>
                {/* Attendant */}
                <circle cx="50" cy="27" fill="#14B8A6" r="7.5"></circle>
                <path d="M41 54C41 45.5 45.5 41.5 51 41.5C56.5 41.5 61 45.5 61 54H41Z" fill="#14B8A6"></path>
                {/* Heart Emblem */}
                <g transform="translate(32, 43)">
                  <rect fill="white" height="16" rx="8" width="16" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"></rect>
                  <path d="M8 12.5C8 12.5 4 10 4 7.2C4 5.7 5.2 4.5 6.7 4.5C7.6 4.5 8 5.1 8 5.1C8 5.1 8.4 4.5 9.3 4.5C10.8 4.5 12 5.7 12 7.2C12 10 8 12.5 8 12.5Z" fill="#0D6E6E"></path>
                </g>
                <path d="M48 37C44 38 38 39 34 43" stroke="#14B8A6" strokeLinecap="round" strokeWidth="2"></path>
              </svg>
            </div>

            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-teal-50 border border-teal-200/60 text-[10px] font-bold text-[#0D6E6E] mb-1">
                <span className="material-symbols-outlined text-[13px] text-[#14B8A6]">verified</span>
                <span>SUPPORTED INTAKE</span>
              </div>
              <h1 className="text-[19px] font-bold tracking-tight text-[#0F1E36] leading-snug">
                Who will answer the questions?
              </h1>
              <p className="text-[12px] text-[#64748B] mt-0.5 leading-snug">
                You can answer for yourself, or someone you trust can help.<br />
                <span className="text-[11px] text-slate-500 font-normal">आप खुद जवाब देंगे या कोई आपकी मदद करेगा?</span>
              </p>
            </div>
          </div>
        </div>

        {/* Voice Accessibility Banner */}
        <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-100/80 border border-slate-200/70 mb-3">
          <div className="flex items-center space-x-2 text-xs text-[#0F1E36]">
            <div className="w-6 h-6 rounded-full bg-[#0D6E6E]/10 flex items-center justify-center text-[#0D6E6E]">
              <span className="material-symbols-outlined text-[15px]">mic</span>
            </div>
            <span className="font-medium text-slate-700">Voice-assisted questions available</span>
          </div>
          <span className="text-[11px] font-bold text-[#0D6E6E]">Hinglish / हिन्दी</span>
        </div>

        {/* Mode Selection Cards */}
        <div className="space-y-3 mb-3">
          {/* Option 1: Myself */}
          <label
            onClick={() => setMode('myself')}
            className={`relative block rounded-2xl p-3.5 cursor-pointer transition-all duration-200 border-2 ${
              mode === 'myself'
                ? 'bg-[#F0F9F9]/70 border-[#0D6E6E] shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                    mode === 'myself'
                      ? 'bg-white border-teal-200/80 text-[#0D6E6E]'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <span className="material-symbols-outlined text-[24px]">person</span>
                </div>

                <div className="pr-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-[15px] font-bold text-[#0F1E36]">I’ll answer for myself</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#0D6E6E] text-white text-[10px] font-bold tracking-wide">
                      DEFAULT
                    </span>
                  </div>
                  <p className="text-[12px] text-[#64748B] mt-0.5 leading-snug">
                    I’ll speak or select answers during my CareFlow visit.
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="inline-flex items-center text-[11px] text-[#0D6E6E] font-semibold">
                      <span className="material-symbols-outlined text-[13px] mr-1">check</span>
                      Direct patient answers
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-[11px] text-slate-500 font-medium">Voice or tap</span>
                  </div>
                </div>
              </div>

              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  mode === 'myself' ? 'border-2 border-[#0D6E6E] bg-[#0D6E6E] text-white' : 'border-2 border-slate-300 bg-white'
                }`}
              >
                {mode === 'myself' && <span className="material-symbols-outlined text-[15px] font-bold">check</span>}
              </div>
            </div>
          </label>

          {/* Option 2: Helper / Attendant */}
          <label
            onClick={() => setMode('helper')}
            className={`relative block rounded-2xl p-3.5 cursor-pointer transition-all duration-200 border-2 ${
              mode === 'helper'
                ? 'bg-[#F0F9F9]/70 border-[#0D6E6E] shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                    mode === 'helper'
                      ? 'bg-white border-teal-200/80 text-[#0D6E6E]'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <span className="material-symbols-outlined text-[24px]">group</span>
                </div>

                <div className="pr-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-[15px] font-bold text-[#0F1E36]">Someone is helping me</span>
                  </div>
                  <p className="text-[12px] text-[#64748B] mt-0.5 leading-snug">
                    A family member, caregiver, ASHA worker or health attendant will answer with me.
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {(
                      [
                        { id: 'family', label: 'Family member' },
                        { id: 'caregiver', label: 'Caregiver' },
                        { id: 'asha', label: 'ASHA / Saheli' },
                      ] as const
                    ).map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRole(r.id);
                        }}
                        className={`px-2 py-0.5 rounded-md text-[10.5px] font-semibold transition-colors ${
                          selectedRole === r.id
                            ? 'bg-teal-50 text-[#0D6E6E] border border-teal-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  mode === 'helper' ? 'border-2 border-[#0D6E6E] bg-[#0D6E6E] text-white' : 'border-2 border-slate-300 bg-white'
                }`}
              >
                {mode === 'helper' && <span className="material-symbols-outlined text-[15px] font-bold">check</span>}
              </div>
            </div>
          </label>
        </div>

        {/* Dynamic Attendant Details Card */}
        {mode === 'helper' && (
          <div className="mb-3 rounded-2xl p-3.5 bg-gradient-to-br from-white to-[#F0F9F9]/50 border border-teal-200/80 shadow-xs animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#0F1E36] flex items-center space-x-1" htmlFor="attendant-name">
                <span className="material-symbols-outlined text-[16px] text-[#0D6E6E]">person</span>
                <span>
                  Attendant name <span className="text-slate-400 font-normal">(optional)</span>
                </span>
              </label>
              <span className="text-[10px] font-medium text-[#0D6E6E] bg-teal-50 px-2 py-0.5 rounded-full">
                Intake reference
              </span>
            </div>
            <input
              id="attendant-name"
              type="text"
              value={attendantName}
              onChange={(e) => setAttendantName(e.target.value)}
              placeholder="Enter name (e.g., Sunita Devi - ASHA, Rajesh Sharma)"
              className="w-full h-10 px-3.5 bg-white rounded-xl border border-slate-200 focus:border-[#0D6E6E] focus:ring-2 focus:ring-[#0D6E6E]/20 text-xs font-medium text-[#0F1E36] outline-none transition-all shadow-2xs"
            />
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px] text-slate-400">info</span>
              <span>Only needed to identify who is assisting during this CareFlow intake.</span>
            </p>
          </div>
        )}

        {/* Reassurance Banner */}
        <div className="rounded-2xl p-3 bg-[#F0F9F9]/80 border border-teal-200/60 shadow-2xs mb-3">
          <div className="flex items-start space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-white text-[#0D6E6E] flex items-center justify-center shrink-0 border border-teal-100 shadow-2xs mt-0.5">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#0F1E36]">You’re always in control.</h4>
              <p className="text-[11px] text-[#64748B] mt-0.5 leading-relaxed">
                Your attendant can help, but you can correct or change any answer before it is submitted to the clinical team.
              </p>
            </div>
          </div>
        </div>

        {/* Dedicated Care Navigator Standby */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white border border-slate-200/70 text-slate-600 mb-3">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="w-7 h-7 rounded-full bg-teal-100 border border-teal-200 flex items-center justify-center text-[#0D6E6E] font-bold text-xs">
                AR
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </div>
            <span className="text-[11px] font-medium text-[#0F1E36]">
              Care Navigator on standby for Hindi &amp; English
            </span>
          </div>
          <button className="text-[11px] font-bold text-[#0D6E6E] hover:underline" type="button">
            Help
          </button>
        </div>

        {/* Sticky Action Footer */}
        <footer className="mt-auto pt-2 flex flex-col gap-2">
          <button
            onClick={handleContinue}
            className="w-full h-13 rounded-full bg-[#0D6E6E] hover:bg-[#084C4C] active:scale-[0.98] text-white font-bold text-[16px] shadow-md shadow-teal-900/15 flex items-center justify-center space-x-2 transition-all cursor-pointer"
            type="button"
          >
            <span>Continue</span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>

          <div className="flex items-center justify-center space-x-1.5 text-[10.5px] text-slate-500">
            <span className="material-symbols-outlined text-[13px] text-[#0D6E6E]">verified_user</span>
            <span>ABDM COMPLIANT · PRIVATE &amp; SECURE INTAKE</span>
          </div>
        </footer>
      </main>
    </div>
  );
};
