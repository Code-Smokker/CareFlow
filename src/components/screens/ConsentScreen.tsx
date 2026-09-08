import React, { useState } from 'react';
import { Header } from '../Header';

interface ConsentScreenProps {
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
  onContinue: (consents: { essentialHealth: boolean; voiceCare: boolean; pastRecords: boolean }) => void;
  onBack: () => void;
}

export const ConsentScreen: React.FC<ConsentScreenProps> = ({
  currentLanguage,
  onLanguageChange,
  onContinue,
  onBack,
}) => {
  const [voiceCare, setVoiceCare] = useState(true);
  const [pastRecords, setPastRecords] = useState(false);
  const [showPrivacySheet, setShowPrivacySheet] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAgree = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onContinue({
        essentialHealth: true,
        voiceCare,
        pastRecords,
      });
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
        {/* Stepper Progress Ribbon */}
        <section className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-[#3e4948] uppercase tracking-wider">
              Step 2 of 6
            </span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#eaedff]">
              <span className="w-2 h-2 rounded-full bg-[#005454] animate-pulse"></span>
              <span className="text-[11px] text-[#005454] font-semibold">30% completed</span>
            </div>
          </div>

          <nav aria-label="Onboarding Progress">
            <ol className="grid grid-cols-6 gap-1.5 items-center">
              {/* Step 1: Lang */}
              <li className="flex flex-col gap-1 items-center">
                <div className="w-full h-1.5 rounded-full bg-[#005454]"></div>
                <span className="text-[10px] text-[#005454] flex items-center gap-0.5 font-semibold">
                  <span className="material-symbols-outlined text-[11px]">check_circle</span>
                  <span>Lang</span>
                </span>
              </li>
              {/* Step 2: Consent */}
              <li className="flex flex-col gap-1 items-center">
                <div className="w-full h-1.5 rounded-full bg-[#005454] shadow-sm shadow-[#005454]/30"></div>
                <span className="text-[10px] text-[#005454] font-bold">Consent</span>
              </li>
              {/* Step 3: Identity */}
              <li className="flex flex-col gap-1 items-center">
                <div className="w-full h-1.5 rounded-full bg-[#eaedff]"></div>
                <span className="text-[10px] text-[#3e4948]/60 font-medium">Identity</span>
              </li>
              {/* Step 4: Health */}
              <li className="flex flex-col gap-1 items-center">
                <div className="w-full h-1.5 rounded-full bg-[#eaedff]"></div>
                <span className="text-[10px] text-[#3e4948]/60 font-medium">Health</span>
              </li>
              {/* Step 5: Review */}
              <li className="flex flex-col gap-1 items-center">
                <div className="w-full h-1.5 rounded-full bg-[#eaedff]"></div>
                <span className="text-[10px] text-[#3e4948]/60 font-medium">Review</span>
              </li>
              {/* Step 6: Done */}
              <li className="flex flex-col gap-1 items-center">
                <div className="w-full h-1.5 rounded-full bg-[#eaedff]"></div>
                <span className="text-[10px] text-[#3e4948]/60 font-medium">Done</span>
              </li>
            </ol>
          </nav>
        </section>

        {/* Hero Reassurance Container with Doctor Illustration */}
        <section className="mb-3">
          <div className="relative overflow-hidden rounded-2xl bg-[#f2f3ff] p-3.5 shadow-xs border border-slate-200/50">
            <div className="relative flex items-center gap-3.5">
              <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-[#eaedff]">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiV6JaQp0HXdVoNiis9N44XlP0qGyeG8NKU4EBSxWinoSgRJtEJYntivOcOLaAUu7WE5nrLb5NBnX7Wpe3AWAjnv-7w2WJidNJRwrifmUfUSoWSP_nbuEC8oK752NBNQm0cXP5B7QReaUGd8HTDOPj8WL2jpnL7sYeP9fldTtLIXUHvAPnuXhEFddOdOyboF09oEBIMrKES4vCigE__Ej8AE7MnEisEfVVWSXHMF8AB3d6zDtuoMJFww"
                  alt="Doctor with reassuring privacy shield"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="inline-flex items-center gap-1 self-start px-2 py-0.5 rounded-full bg-[#71f8e4] text-[#00201c] text-[10px] font-bold mb-1">
                  <span className="material-symbols-outlined text-[12px]">verified_user</span>
                  <span>Your Privacy First</span>
                </div>
                <h1 className="text-[18px] leading-snug font-bold text-[#131b2e] tracking-tight">
                  Before we begin, your privacy is protected.
                </h1>
                <p className="text-[12.5px] text-[#3e4948] pt-1">
                  Choose what you feel comfortable sharing. You can modify these anytime.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Consent Action Cards */}
        <section className="flex flex-col gap-2.5 mb-3">
          {/* Card 1: Essential Health Data (Locked) */}
          <article className="p-3.5 rounded-2xl bg-white shadow-xs border border-slate-200/60">
            <div className="flex items-start justify-between gap-1 mb-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#a0f0f0] text-[#002020] text-[10.5px] font-bold tracking-wide">
                <span className="material-symbols-outlined text-[12px]">lock</span>
                ESSENTIAL
              </span>
              <span className="text-[11.5px] text-[#3e4948]/80 font-medium">Required for care</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#f2f3ff] flex items-center justify-center shrink-0 text-[#005454]">
                  <span className="material-symbols-outlined text-[22px]">health_and_safety</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <h2 className="text-[15px] font-bold text-[#131b2e] truncate">Share health information</h2>
                  <p className="text-[12.5px] text-[#3e4948] leading-tight mt-0.5">
                    Allow CareFlow to collect symptoms and details provided during this intake.
                  </p>
                </div>
              </div>

              {/* Locked Toggle */}
              <div className="w-11 h-6 bg-[#005454] rounded-full flex items-center px-0.5 shrink-0 opacity-95">
                <div className="w-5 h-5 bg-white rounded-full shadow-sm ml-auto flex items-center justify-center">
                  <span className="material-symbols-outlined text-[12px] text-[#005454]">lock</span>
                </div>
              </div>
            </div>
          </article>

          {/* Card 2: Voice Input Care */}
          <article className="p-3.5 rounded-2xl bg-white shadow-xs border border-slate-200/60">
            <div className="flex items-start justify-between gap-1 mb-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#71f8e4] text-[#00201c] text-[10.5px] font-bold tracking-wide">
                <span className="material-symbols-outlined text-[12px]">mic</span>
                VOICE CARE
              </span>
              <span className="text-[11.5px] text-[#006b5f] font-semibold">Faster intake</span>
            </div>
            <div
              onClick={() => setVoiceCare(!voiceCare)}
              className="flex items-center justify-between gap-3 cursor-pointer select-none"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#f2f3ff] flex items-center justify-center shrink-0 text-[#006b5f]">
                  <span className="material-symbols-outlined text-[22px]">graphic_eq</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <h2 className="text-[15px] font-bold text-[#131b2e] truncate">Use voice for faster answers</h2>
                  <p className="text-[12.5px] text-[#3e4948] leading-tight mt-0.5">
                    Speak naturally instead of typing. Your audio stream is encrypted and securely processed.
                  </p>
                </div>
              </div>

              {/* Interactive Toggle */}
              <div
                className={`w-11 h-6 rounded-full flex items-center px-0.5 shrink-0 transition-colors ${
                  voiceCare ? 'bg-[#005454]' : 'bg-[#eaedff]'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-sm flex items-center justify-center transition-transform ${
                    voiceCare ? 'translate-x-5' : 'translate-x-0'
                  }`}
                >
                  {voiceCare && (
                    <span className="material-symbols-outlined text-[12px] text-[#005454]">check</span>
                  )}
                </div>
              </div>
            </div>
          </article>

          {/* Card 3: Previous Medical Records */}
          <article className="p-3.5 rounded-2xl bg-white shadow-xs border border-slate-200/60">
            <div className="flex items-start justify-between gap-1 mb-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#eaedff] text-[#3e4948] text-[10.5px] font-bold tracking-wide">
                <span className="material-symbols-outlined text-[12px]">folder_open</span>
                OPTIONAL
              </span>
              <span className="text-[11.5px] text-[#3e4948]/70 font-medium">Past records</span>
            </div>
            <div
              onClick={() => setPastRecords(!pastRecords)}
              className="flex items-center justify-between gap-3 cursor-pointer select-none"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#f2f3ff] flex items-center justify-center shrink-0 text-[#005261]">
                  <span className="material-symbols-outlined text-[22px]">receipt_long</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <h2 className="text-[15px] font-bold text-[#131b2e] truncate">Use previous medical records</h2>
                  <p className="text-[12.5px] text-[#3e4948] leading-tight mt-0.5">
                    Allow previous prescriptions and diagnostic tests to assist your attending doctor.
                  </p>
                </div>
              </div>

              {/* Interactive Toggle */}
              <div
                className={`w-11 h-6 rounded-full flex items-center px-0.5 shrink-0 transition-colors ${
                  pastRecords ? 'bg-[#005454]' : 'bg-[#eaedff]'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-sm flex items-center justify-center transition-transform ${
                    pastRecords ? 'translate-x-5' : 'translate-x-0'
                  }`}
                >
                  {pastRecords && (
                    <span className="material-symbols-outlined text-[12px] text-[#005454]">check</span>
                  )}
                </div>
              </div>
            </div>
          </article>
        </section>

        {/* Reassuring Standards Badge */}
        <section className="mb-4">
          <div className="p-3.5 rounded-2xl bg-[#f2f3ff] flex items-start gap-2.5 border border-slate-200/40">
            <div className="w-8 h-8 rounded-full bg-[#a0f0f0] flex items-center justify-center shrink-0 text-[#002020]">
              <span className="material-symbols-outlined text-[18px]">shield</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] text-[#131b2e] font-bold">Your information stays protected.</span>
              <p className="text-[12px] text-[#3e4948] pt-0.5 leading-relaxed">
                CareFlow adheres strictly to applicable Ayushman Bharat Digital Mission (ABDM) data protection benchmarks and ISO health privacy standards.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom CTA Area */}
        <section className="mt-auto flex flex-col gap-2 pt-2">
          <button
            onClick={handleAgree}
            disabled={isSubmitting}
            className="w-full h-13 py-3.5 rounded-full bg-[#005454] hover:bg-[#0d6e6e] text-white font-bold text-[16px] flex items-center justify-center gap-2 shadow-md shadow-[#005454]/20 active:scale-[0.98] transition-all cursor-pointer"
            type="button"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                <span>Securing Consent...</span>
              </>
            ) : (
              <>
                <span>Agree &amp; Continue</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </>
            )}
          </button>

          <div className="flex flex-col items-center">
            <button
              onClick={() => setShowPrivacySheet(true)}
              className="text-[13px] text-[#005454] font-semibold hover:underline py-1 flex items-center gap-1 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              <span>Review full privacy details</span>
            </button>
            <span className="text-[11px] text-[#3e4948]/70 text-center">
              You can change or revoke your consent choices at any time.
            </span>
          </div>
        </section>
      </main>

      {/* Floating Privacy Details Bottom Sheet */}
      {showPrivacySheet && (
        <div className="fixed inset-0 z-50 bg-[#283044]/50 backdrop-blur-xs flex items-end justify-center p-0">
          <div className="w-full max-w-[430px] bg-white rounded-t-3xl p-5 flex flex-col gap-3.5 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="w-12 h-1 rounded-full bg-[#dae2fd] self-center"></div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#a0f0f0] flex items-center justify-center text-[#005454]">
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                </div>
                <h2 className="text-[16px] font-bold text-[#131b2e]">Data Protection Summary</h2>
              </div>
              <button
                onClick={() => setShowPrivacySheet(false)}
                className="w-8 h-8 rounded-full bg-[#f2f3ff] flex items-center justify-center text-[#3e4948]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-2.5 text-[12.5px] text-[#3e4948]">
              <div className="p-3 rounded-xl bg-[#f2f3ff]">
                <p className="font-bold text-[#131b2e]">No Third-Party Advertising</p>
                <p className="text-[12px] pt-0.5">We do not sell, rent, or trade your identifiable medical records to advertisers or data aggregators.</p>
              </div>
              <div className="p-3 rounded-xl bg-[#f2f3ff]">
                <p className="font-bold text-[#131b2e]">Encrypted Transmission</p>
                <p className="text-[12px] pt-0.5">All voice streams and clinical notes are transmitted via TLS 1.3 with AES-256 rest encryption.</p>
              </div>
              <div className="p-3 rounded-xl bg-[#f2f3ff]">
                <p className="font-bold text-[#131b2e]">Granular Revocation</p>
                <p className="text-[12px] pt-0.5">You may withdraw access or request total data purging in Settings &gt; Privacy Controls at any visit stage.</p>
              </div>
            </div>

            <button
              onClick={() => setShowPrivacySheet(false)}
              className="w-full py-3 rounded-full bg-[#005454] text-white font-bold text-[14px]"
            >
              Understood, Return to Intake
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
