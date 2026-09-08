import React, { useState } from 'react';
import { Header } from '../Header';

interface ProfileScreenProps {
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
  onContinue: (profileData: {
    fullName: string;
    dob: string;
    mobile: string;
    gender: 'female' | 'male' | 'other' | 'unspecified';
  }) => void;
  onConnectAbha: () => void;
  onBack: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  currentLanguage,
  onLanguageChange,
  onContinue,
  onConnectAbha,
  onBack,
}) => {
  const [fullName, setFullName] = useState('Priya Sharma');
  const [dob, setDob] = useState('14 / 08 / 1994');
  const [mobile, setMobile] = useState('98765 43210');
  const [gender, setGender] = useState<'female' | 'male' | 'other' | 'unspecified'>('female');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onContinue({ fullName, dob, mobile, gender });
    }, 600);
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col bg-[#faf8ff] text-[#131b2e] pb-6">
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={onLanguageChange}
        showBack={true}
        onBack={onBack}
      />

      <main className="relative z-10 flex flex-col flex-1 w-full px-4 pt-2 max-w-[430px] mx-auto">
        {/* Progress Tracker */}
        <div className="flex flex-col gap-1 mb-2.5">
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#005454] animate-pulse"></span>
              <span className="text-[#005454] font-bold uppercase tracking-wider">STEP 3 OF 6</span>
            </div>
            <span className="text-[#3e4948] font-medium">50% completed</span>
          </div>

          <div className="grid grid-cols-6 gap-1.5 items-center">
            <div className="flex flex-col gap-0.5">
              <div className="h-1.5 rounded-full bg-[#005454]"></div>
              <span className="text-[10px] font-semibold text-[#005454] text-center">✓ Lang</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="h-1.5 rounded-full bg-[#005454]"></div>
              <span className="text-[10px] font-semibold text-[#005454] text-center">✓ Consent</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="h-1.5 rounded-full bg-[#005454]"></div>
              <span className="text-[10px] font-bold text-[#005454] text-center">Identity ●</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="h-1.5 rounded-full bg-[#dae2fd]"></div>
              <span className="text-[10px] font-medium text-[#6e7979] text-center">Health</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="h-1.5 rounded-full bg-[#dae2fd]"></div>
              <span className="text-[10px] font-medium text-[#6e7979] text-center">Review</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="h-1.5 rounded-full bg-[#dae2fd]"></div>
              <span className="text-[10px] font-medium text-[#6e7979] text-center">Done</span>
            </div>
          </div>
        </div>

        {/* Hero Narrative */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#f2f3ff] via-[#faf8ff] to-[#eaedff] p-3.5 shadow-xs border border-slate-200/50 mb-3">
          <div className="flex items-start gap-3">
            <div className="relative shrink-0 w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center p-2">
              <div className="w-full h-full rounded-xl bg-[#005454]/10 flex items-center justify-center relative overflow-hidden">
                <span className="material-symbols-outlined text-[#005454] text-[28px]">badge</span>
                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#006b5f]"></div>
              </div>
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <div className="inline-flex items-center gap-1 text-[11px] text-[#006b5f] font-semibold mb-0.5">
                <span className="material-symbols-outlined text-[14px]">verified_user</span>
                <span>Accredited Onboarding</span>
              </div>
              <h1 className="text-[22px] leading-tight text-[#131b2e] font-extrabold tracking-tight">
                Let’s create your CareFlow profile.
              </h1>
              <p className="text-[12px] text-[#3e4948] mt-0.5 leading-snug">
                We just need a few details to get your visit started with our care team.
              </p>
            </div>
          </div>
        </div>

        {/* Identity Inputs Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/60 flex flex-col gap-3.5 mb-3">
          {/* Full Name */}
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-bold text-[#131b2e] flex items-center gap-1" htmlFor="full-name">
              <span>Full name</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] inline-block"></span>
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 flex items-center pointer-events-none text-[#005454]">
                <span className="material-symbols-outlined text-[20px]">person</span>
              </div>
              <input
                id="full-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full h-11 pl-10 pr-10 bg-[#f2f3ff] text-[#131b2e] rounded-xl text-[14px] font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#005454] transition-all"
                required
              />
              <div className="absolute right-3.5 flex items-center text-[#006b5f] pointer-events-none">
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
              </div>
            </div>
            <span className="text-[11px] text-[#3e4948]">As stated on government-issued health ID</span>
          </div>

          {/* Date of Birth */}
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-bold text-[#131b2e] flex items-center gap-1" htmlFor="dob">
              <span>Date of birth</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] inline-block"></span>
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 flex items-center pointer-events-none text-[#005454]">
                <span className="material-symbols-outlined text-[20px]">calendar_today</span>
              </div>
              <input
                id="dob"
                type="text"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                placeholder="DD / MM / YYYY"
                className="w-full h-11 pl-10 pr-4 bg-[#f2f3ff] text-[#131b2e] rounded-xl text-[14px] font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#005454] transition-all tabular-nums"
                required
              />
            </div>
          </div>

          {/* Mobile Number */}
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-bold text-[#131b2e] flex items-center gap-1" htmlFor="mobile">
              <span>Mobile number</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] inline-block"></span>
            </label>
            <div className="flex gap-2">
              <div className="h-11 px-3 rounded-xl bg-[#eaedff] flex items-center gap-1 shrink-0 text-[#131b2e] text-[13px] font-semibold">
                <span>🇮🇳</span>
                <span>+91</span>
              </div>
              <div className="relative flex-1 flex items-center">
                <div className="absolute left-3 flex items-center pointer-events-none text-[#005454]">
                  <span className="material-symbols-outlined text-[19px]">call</span>
                </div>
                <input
                  id="mobile"
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="98765 43210"
                  className="w-full h-11 pl-9 pr-4 bg-[#f2f3ff] text-[#131b2e] rounded-xl text-[14px] font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#005454] transition-all tabular-nums"
                  required
                />
              </div>
            </div>
            <p className="text-[11px] text-[#3e4948] flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-[14px] text-[#006b5f]">lock</span>
              <span>We’ll use this number only to coordinate your CareFlow visit.</span>
            </p>
          </div>

          {/* Gender */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-bold text-[#131b2e]">Gender</label>
              <span className="text-[11px] text-[#6e7979]">Standard medical field</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { id: 'female', label: 'Female' },
                  { id: 'male', label: 'Male' },
                  { id: 'other', label: 'Other' },
                  { id: 'unspecified', label: 'Prefer not to say' },
                ] as const
              ).map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGender(g.id)}
                  className={`h-11 px-3 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    gender === g.id
                      ? 'bg-[#005454] text-white shadow-xs'
                      : 'bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff]'
                  }`}
                >
                  {gender === g.id && (
                    <span className="material-symbols-outlined text-[17px]">check</span>
                  )}
                  <span>{g.label}</span>
                </button>
              ))}
            </div>
          </div>
        </form>

        {/* Security Reassurance Card */}
        <div className="bg-[#f2f3ff] rounded-2xl p-3 flex items-start gap-2.5 border border-slate-200/40 mb-3">
          <div className="w-9 h-9 rounded-xl bg-[#6df5e1]/40 flex items-center justify-center shrink-0 text-[#00201c]">
            <span className="material-symbols-outlined text-[20px]">verified</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-[#131b2e] leading-tight">Your information is private and secure.</span>
            <p className="text-[12px] text-[#3e4948] mt-0.5 leading-snug">
              You control what you share with CareFlow. ABDM compliant, encrypted with zero third-party commercial tracking.
            </p>
          </div>
        </div>

        {/* Alternative: Connect ABHA */}
        <div className="flex items-center justify-center mb-3">
          <button
            onClick={onConnectAbha}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#eaedff] hover:bg-[#dae2fd] transition-colors text-[#005454] text-[12.5px] font-bold cursor-pointer"
            type="button"
          >
            <div className="w-5 h-5 rounded-md bg-[#005454] text-white flex items-center justify-center text-[10px] font-bold">
              ID
            </div>
            <span>Already have an ABHA? Connect it instead</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        {/* Dedicated Care Navigator Standby Card */}
        <div className="flex items-center gap-2.5 bg-white rounded-xl p-2.5 shadow-xs border border-slate-200/60 mb-3">
          <img
            className="w-11 h-11 rounded-full object-cover shadow-inner shrink-0"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDD1kZj1br87pmIVLzzRQN5FO4yab1QcLn24zRL22dhoIxnKAcDiDNcCCWSGY7EpXq8ZRgdTlCksZLG1O9Gt6IVuovvtfaf6UF6cTN8FmhLuR_Siwnf4HR_iPXcx-9xgQT8NER7dfWvhkWq9erJK9mQw4hk5xDRI05IrcFtk31SITzYJYJfLPZ7M99snR7UI486Spl3-T2jQvBGzy8MBAwzwyJgriaGxcWMhKU3r2-rplv8Y9qEHPPLxg"
            alt="Dedicated Care Navigator"
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[13px] font-bold text-[#131b2e] truncate">Dedicated Care Navigator</span>
            <span className="text-[11.5px] text-[#3e4948] truncate">Dr. Ananya Ray and team are on standby for your check-in</span>
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#006b5f] shrink-0 animate-pulse"></div>
        </div>

        {/* Bottom CTA Panel */}
        <div className="mt-auto pt-2 flex flex-col gap-2">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full h-13 rounded-full bg-[#005454] hover:bg-[#0d6e6e] text-white font-bold text-[16px] flex items-center justify-center gap-2 shadow-md shadow-[#005454]/20 active:scale-[0.99] transition-all cursor-pointer"
            type="button"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                <span>Securing Profile...</span>
              </>
            ) : (
              <>
                <span>Create Profile</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5 pb-1 text-[#6e7979]">
            <span className="material-symbols-outlined text-[14px]">shield</span>
            <span className="text-[10.5px] tracking-wider uppercase font-semibold">
              ABDM COMPLIANT · 256-BIT SECURE HEALTH PROTOCOL
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};
