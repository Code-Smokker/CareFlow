import React, { useState, useEffect, useRef } from 'react';
import { Header } from '../Header';

interface AbhaOtpScreenProps {
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
  onContinue: () => void;
  onBackToScan: () => void;
  onBack: () => void;
}

export const AbhaOtpScreen: React.FC<AbhaOtpScreenProps> = ({
  currentLanguage,
  onLanguageChange,
  onContinue,
  onBackToScan,
  onBack,
}) => {
  const [otp, setOtp] = useState<string[]>(['7', '2', '9', '', '', '']);
  const [countdown, setCountdown] = useState(39);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  const handleInputChange = (val: string, index: number) => {
    const digit = val.replace(/[^0-9]/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const filledCount = otp.filter(Boolean).length;
  const isComplete = filledCount === 6;

  const handleReadAloud = () => {
    const digitsToRead = otp.filter(Boolean).join(', ') || '7, 2, 9';
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        `Your CareFlow verification code is ${digitsToRead}`
      );
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onContinue();
    }, 800);
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
        <section className="flex flex-col gap-1 mb-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-[#005454] font-bold">Step 3 of 6</span>
            <span className="text-[11px] text-[#3e4948] font-semibold">50% completed</span>
          </div>

          <div className="grid grid-cols-6 gap-1.5 pt-0.5">
            <div className="h-1.5 rounded-full bg-[#0d6e6e]"></div>
            <div className="h-1.5 rounded-full bg-[#0d6e6e]"></div>
            <div className="h-1.5 rounded-full bg-[#005454] shadow-[0_0_8px_rgba(13,110,110,0.45)]"></div>
            <div className="h-1.5 rounded-full bg-[#dae2fd]"></div>
            <div className="h-1.5 rounded-full bg-[#dae2fd]"></div>
            <div className="h-1.5 rounded-full bg-[#dae2fd]"></div>
          </div>

          <div className="flex items-center justify-between pt-0.5 px-0.5">
            <span className="text-[10px] text-[#005454] flex items-center font-bold gap-0.5">✓ Lang</span>
            <span className="text-[10px] text-[#005454] flex items-center font-bold gap-0.5">✓ Consent</span>
            <span className="text-[10px] text-[#005454] font-bold underline decoration-[#006b5f]">Identity ●</span>
            <span className="text-[10px] text-[#3e4948]/60 font-medium">Health</span>
            <span className="text-[10px] text-[#3e4948]/60 font-medium">Review</span>
            <span className="text-[10px] text-[#3e4948]/60 font-medium">Done</span>
          </div>
        </section>

        {/* Hero & Heading */}
        <header className="flex flex-col mb-3">
          <h1 className="text-[26px] leading-[34px] font-bold text-[#131b2e] tracking-tight">
            Verify your <span className="text-[#0d6e6e] font-bold">ABHA</span>
          </h1>
          <p className="text-[13.5px] text-[#3e4948] mt-0.5">
            We’ve sent a 6-digit one-time password to the mobile number linked with your health locker.
          </p>
        </header>

        {/* Verification Illustration Card */}
        <div className="relative w-full rounded-2xl bg-[#f2f3ff] p-3.5 flex items-center justify-between shadow-xs border border-slate-200/50 mb-3 overflow-hidden">
          <div className="flex flex-col pr-2 z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#6df5e1]/40 text-[#00201c] text-[11px] font-bold mb-1 w-fit">
              <span className="material-symbols-outlined text-[13px]">lock</span> ABDM Safe-Auth
            </div>
            <p className="text-[14px] text-[#131b2e] font-bold">Instant OTP Gateway</p>
            <p className="text-[11.5px] text-[#3e4948]">Encrypted direct sync with NHA servers</p>
          </div>

          <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full" fill="none" viewBox="0 0 100 100">
              <circle cx="50" cy="50" fill="#E6FFFA" r="42"></circle>
              <circle cx="50" cy="50" fill="#6DF5E1" fillOpacity="0.35" r="32"></circle>
              <rect fill="#005454" height="52" rx="6" width="28" x="36" y="22"></rect>
              <rect fill="#FFFFFF" height="38" rx="3" width="22" x="39" y="27"></rect>
              <circle cx="50" cy="69" fill="#84D4D3" r="2"></circle>
              <g filter="drop-shadow(0 4px 6px rgba(13,110,110,0.2))">
                <circle cx="62" cy="52" fill="#0D6E6E" r="14"></circle>
                <path d="M62 44L69 47V52C69 56.4 66 59.8 62 61C58 59.8 55 56.4 55 52V47L62 44Z" fill="#6DF5E1"></path>
                <path d="M62 48.5V56M58.5 52.2H65.5" stroke="#005454" strokeLinecap="round" strokeWidth="1.8"></path>
              </g>
              <circle cx="28" cy="34" fill="#4CD7F6" r="3"></circle>
              <circle cx="74" cy="28" fill="#14B8A6" r="2.5"></circle>
            </svg>
          </div>
        </div>

        {/* Linked Identity Summary Card */}
        <section className="rounded-2xl bg-white p-3 shadow-xs border border-slate-200/60 flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-full bg-[#71f8e4]/50 flex items-center justify-center shrink-0 text-[#005454]">
              <span className="material-symbols-outlined text-[20px]">badge</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] text-[#3e4948] font-medium">ABHA Health Account</span>
              <span className="text-[15px] font-bold text-[#131b2e] tracking-tight truncate">+91 ••••• ••4821</span>
            </div>
          </div>
          <button
            onClick={onBackToScan}
            className="shrink-0 px-3 py-1 rounded-lg bg-[#eaedff] hover:bg-[#dae2fd] text-[#005454] text-[12px] font-bold cursor-pointer"
            type="button"
          >
            Change
          </button>
        </section>

        {/* OTP Input Section */}
        <section className="flex flex-col gap-1.5 mb-3">
          <div className="flex items-center justify-between">
            <label className="text-[14px] font-bold text-[#131b2e]">Enter the 6-digit OTP</label>
            <span className="text-[11.5px] text-[#006b5f] flex items-center gap-1 font-semibold">
              <span className="material-symbols-outlined text-[14px]">sms</span> Auto-detect active
            </span>
          </div>

          {/* 6 OTP Boxes */}
          <div className="grid grid-cols-6 gap-2 w-full pt-1">
            {otp.map((val, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="tel"
                inputMode="numeric"
                maxLength={1}
                value={val}
                placeholder="·"
                onChange={(e) => handleInputChange(e.target.value, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className="w-full h-13 rounded-xl text-center text-xl font-bold bg-white text-[#131b2e] border border-slate-200/90 shadow-xs focus:outline-none focus:border-[#0d6e6e] focus:ring-2 focus:ring-[#0d6e6e]/20 transition-all"
              />
            ))}
          </div>

          {/* Countdown & Read aloud */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1.5 text-[12.5px] text-[#3e4948]">
              <span className="material-symbols-outlined text-[15px] text-[#005454]">schedule</span>
              <span>
                Resend OTP in{' '}
                <span className="font-bold text-[#005454]">
                  00:{countdown < 10 ? `0${countdown}` : countdown}
                </span>
              </span>
            </div>

            <button
              onClick={handleReadAloud}
              className="flex items-center gap-1 text-[#005454] hover:text-[#0d6e6e] text-[12px] font-bold px-2.5 py-1 rounded-full bg-[#f2f3ff] transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[15px]">volume_up</span>
              <span>Read aloud</span>
            </button>
          </div>

          {/* Status Feedback */}
          <div className="mt-1 flex items-center justify-between rounded-xl px-3 py-2 bg-[#f2f3ff] border border-slate-200/40">
            <div className="flex items-center gap-2">
              <span
                className={`material-symbols-outlined text-[18px] ${
                  isComplete ? 'text-[#006b5f]' : 'text-[#005454]'
                }`}
              >
                {isComplete ? 'check_circle' : 'hourglass_top'}
              </span>
              <span className={`text-[12px] font-medium ${isComplete ? 'text-[#006b5f] font-bold' : 'text-[#3e4948]'}`}>
                {isComplete ? '6 digits entered · Ready to verify' : `Waiting for ${6 - filledCount} more digits...`}
              </span>
            </div>

            <button
              disabled={countdown > 0}
              onClick={() => setCountdown(45)}
              className={`text-[11px] font-bold underline ${
                countdown > 0 ? 'text-[#6e7979] opacity-40 cursor-not-allowed' : 'text-[#005454] cursor-pointer'
              }`}
            >
              Resend Now
            </button>
          </div>
        </section>

        {/* Alternative Path */}
        <div className="pt-1 flex justify-center mb-3">
          <button
            onClick={onBackToScan}
            className="inline-flex items-center gap-1 text-[#3e4948] hover:text-[#005454] transition-colors py-1.5 px-3 rounded-full hover:bg-[#f2f3ff] text-[12.5px] font-semibold cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[17px]">arrow_back</span>
            <span>Use ABHA QR code scan instead</span>
          </button>
        </div>

        {/* Bottom CTA */}
        <footer className="mt-auto pt-2 flex flex-col gap-2">
          <button
            onClick={handleVerify}
            disabled={isVerifying}
            className="w-full h-13 py-3 rounded-full bg-[#0d6e6e] hover:bg-[#005454] text-white font-bold text-[16px] shadow-md shadow-[#0d6e6e]/30 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
            type="button"
          >
            {isVerifying ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                <span>Verifying with ABDM...</span>
              </>
            ) : (
              <>
                <span>Verify &amp; Continue</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5 text-center text-[#3e4948]">
            <span className="material-symbols-outlined text-[15px] text-[#005454]">verified_user</span>
            <span className="text-[11px]">ABDM Compliant · 256-Bit Government Health Protocol</span>
          </div>
        </footer>
      </main>
    </div>
  );
};
