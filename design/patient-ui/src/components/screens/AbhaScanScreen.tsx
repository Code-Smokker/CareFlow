import React, { useState } from 'react';
import { Header } from '../Header';

interface AbhaScanScreenProps {
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
  onContinue: (abhaData: { abhaId: string; name: string }) => void;
  onEnterManualNumber: () => void;
  onBack: () => void;
}

export const AbhaScanScreen: React.FC<AbhaScanScreenProps> = ({
  currentLanguage,
  onLanguageChange,
  onContinue,
  onEnterManualNumber,
  onBack,
}) => {
  const [isScanned, setIsScanned] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSimulateScan = () => {
    setIsScanned(true);
    setShowToast(true);
  };

  const handleReset = () => {
    setIsScanned(false);
    setShowToast(false);
  };

  const handleProceed = () => {
    onContinue({
      abhaId: '91-4920-8472-1029',
      name: 'Ananya Sharma',
    });
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
        {/* Success Toast */}
        {showToast && (
          <div className="mb-3 bg-[#6df5e1] text-[#00201c] p-3 rounded-xl shadow-md flex items-center justify-between animate-in slide-in-from-top duration-200">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#005454]">verified_user</span>
              <span className="text-[13px] font-bold">ABHA Identity Verified Securely</span>
            </div>
            <button onClick={() => setShowToast(false)} className="text-slate-700">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        )}

        {/* Stepper Progress */}
        <div className="flex flex-col gap-1.5 mb-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-[#005454] font-bold">Step 3 of 6</span>
            <span className="text-[11px] text-[#3e4948]">50% completed</span>
          </div>

          <div className="grid grid-cols-6 gap-1.5 w-full">
            <div className="flex flex-col items-center gap-0.5">
              <div className="h-1.5 w-full bg-[#005454] rounded-full"></div>
              <span className="text-[10px] text-[#005454] font-semibold">✓ Lang</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <div className="h-1.5 w-full bg-[#005454] rounded-full"></div>
              <span className="text-[10px] text-[#005454] font-semibold">✓ Consent</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <div className="h-1.5 w-full bg-[#005454] rounded-full shadow-[0_0_8px_rgba(0,107,95,0.4)]"></div>
              <span className="text-[10px] text-[#005454] font-bold">Identity</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <div className="h-1.5 w-full bg-[#dae2fd] rounded-full"></div>
              <span className="text-[10px] text-[#3e4948]/60">Health</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <div className="h-1.5 w-full bg-[#dae2fd] rounded-full"></div>
              <span className="text-[10px] text-[#3e4948]/60">Review</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <div className="h-1.5 w-full bg-[#dae2fd] rounded-full"></div>
              <span className="text-[10px] text-[#3e4948]/60">Done</span>
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="flex flex-col mb-3.5">
          <h1 className="text-[26px] leading-[34px] text-[#131b2e] tracking-tight">
            Connect your <span className="text-[#005454] font-bold">ABHA</span>
          </h1>
          <p className="text-[13.5px] text-[#3e4948] mt-1">
            Scan your ABHA QR code to securely link your health records and medical timeline.
          </p>
        </div>

        {/* Camera Viewport Card */}
        <div className="relative w-full rounded-2xl bg-[#1e293b] text-white overflow-hidden shadow-xl flex flex-col items-center justify-center p-4 transition-all duration-300">
          {!isScanned ? (
            <div className="relative w-full flex flex-col items-center">
              {/* Lens Frame */}
              <div className="relative w-52 h-52 rounded-xl flex items-center justify-center overflow-hidden bg-black/40">
                {/* Corner Brackets */}
                <div className="absolute top-2 left-2 w-7 h-7 flex flex-col justify-between pointer-events-none">
                  <div className="w-full h-1 bg-[#4fdbc8]"></div>
                  <div className="w-1 h-full bg-[#4fdbc8]"></div>
                </div>
                <div className="absolute top-2 right-2 w-7 h-7 flex flex-col items-end justify-between pointer-events-none">
                  <div className="w-full h-1 bg-[#4fdbc8]"></div>
                  <div className="w-1 h-full bg-[#4fdbc8]"></div>
                </div>
                <div className="absolute bottom-2 left-2 w-7 h-7 flex flex-col-reverse justify-between pointer-events-none">
                  <div className="w-full h-1 bg-[#4fdbc8]"></div>
                  <div className="w-1 h-full bg-[#4fdbc8]"></div>
                </div>
                <div className="absolute bottom-2 right-2 w-7 h-7 flex flex-col-reverse items-end justify-between pointer-events-none">
                  <div className="w-full h-1 bg-[#4fdbc8]"></div>
                  <div className="w-1 h-full bg-[#4fdbc8]"></div>
                </div>

                {/* Animated Laser Line */}
                <div className="absolute inset-x-3 h-0.5 bg-gradient-to-r from-transparent via-[#71f8e4] to-transparent shadow-[0_0_12px_#71f8e4] animate-scan-move z-20"></div>

                {/* QR Watermark */}
                <div className="opacity-30 flex flex-col items-center justify-center pointer-events-none">
                  <svg className="w-36 h-36 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zm-3 2h3v3h-3v-3zm3 3h3v3h-3v-3zm-3 3h3v2h-3v-2zm-2-5h2v2h-2v-2zm0 3h2v4h-2v-4z"></path>
                  </svg>
                  <div className="absolute w-8 h-8 rounded-full bg-[#005454] flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-[#71f8e4] text-[16px]">add_moderator</span>
                  </div>
                </div>
              </div>

              <p className="text-[13px] text-slate-200 text-center mt-3">
                Place your ABHA QR code inside the frame
              </p>

              {/* Guidance Pills */}
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800/80 text-slate-200 text-[11px]">
                  <span className="material-symbols-outlined text-[13px] text-[#71f8e4]">light_mode</span> Good light
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800/80 text-slate-200 text-[11px]">
                  <span className="material-symbols-outlined text-[13px] text-[#71f8e4]">straighten</span> Keep straight
                </span>
              </div>

              {/* Simulation Quick Scan Button */}
              <button
                onClick={handleSimulateScan}
                className="mt-3 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[#71f8e4] text-[12px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[15px]">sensors</span>
                <span>Tap to Simulate Quick Scan</span>
              </button>
            </div>
          ) : (
            /* State 2: Verified Connected State */
            <div className="w-full flex flex-col items-center py-4 text-center">
              <div className="w-16 h-16 rounded-full bg-[#6df5e1] flex items-center justify-center mb-2 shadow-md">
                <span className="material-symbols-outlined text-[#006f64] text-[34px]">verified</span>
              </div>
              <span className="text-[11px] text-[#71f8e4] uppercase tracking-wider font-bold">Ayushman Bharat ID</span>
              <h3 className="text-[18px] font-bold text-white mt-0.5">Ananya Sharma</h3>
              
              <div className="mt-2 px-3 py-1 rounded-full bg-slate-800/80 text-slate-100 text-xs tracking-wider flex items-center gap-1.5">
                <span className="text-[#71f8e4] font-mono font-bold">91-4920-8472-1029</span>
                <span className="material-symbols-outlined text-[16px] text-[#71f8e4]">check_circle</span>
              </div>

              <p className="text-[12px] text-slate-300 mt-2 max-w-xs">
                Digital Health Account linked with Apollo &amp; Fortis care registries.
              </p>

              <button
                onClick={handleReset}
                className="mt-3 text-slate-300 hover:text-white text-[11.5px] underline flex items-center gap-1 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[13px]">refresh</span>
                <span>Rescan another QR</span>
              </button>
            </div>
          )}
        </div>

        {/* Discovery Card */}
        <div className="mt-3 p-3.5 rounded-2xl bg-[#f2f3ff] flex items-start gap-2.5 border border-slate-200/50">
          <div className="w-9 h-9 rounded-xl bg-[#eaedff] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#005454] text-[20px]">badge</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[13px] text-[#131b2e] font-bold">Where can I find my ABHA QR?</span>
            <p className="text-[12px] text-[#3e4948] mt-0.5 leading-normal">
              Look for the QR code on your printed national health card, Cowin portal, or inside your Aarogya Setu application.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="relative my-3 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full h-px bg-[#dae2fd]"></div>
          </div>
          <span className="relative px-2.5 bg-[#faf8ff] text-[10.5px] font-bold uppercase tracking-widest text-[#3e4948]">
            OR
          </span>
        </div>

        {/* Manual ABHA Button */}
        <button
          onClick={onEnterManualNumber}
          className="w-full min-h-[44px] py-2 px-4 rounded-full bg-white border border-slate-200/70 shadow-xs hover:bg-slate-50 transition-colors flex items-center justify-between text-[#005454] text-[13px] font-bold cursor-pointer"
          type="button"
        >
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">dialpad</span>
            <span>Enter 14-digit ABHA number instead</span>
          </span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>

        {/* Security Reassurance */}
        <div className="flex items-center justify-center gap-1.5 mt-3 text-[#3e4948]">
          <span className="material-symbols-outlined text-[15px] text-[#005454]">security</span>
          <span className="text-[11px]">Private and encrypted · ABDM Compliant &amp; Verified</span>
        </div>

        {/* Bottom Actions */}
        <div className="mt-auto pt-3 flex flex-col gap-1.5">
          <button
            onClick={handleProceed}
            className="w-full min-h-[50px] py-3 px-6 rounded-full bg-[#005454] hover:bg-[#0d6e6e] text-white font-bold text-[16px] flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-all cursor-pointer"
            type="button"
          >
            <span>{isScanned ? 'Confirmed · Proceed' : 'Continue to Health History'}</span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>

          <button
            onClick={onEnterManualNumber}
            className="w-full py-1.5 text-center text-[#005454] text-[12px] font-medium hover:underline cursor-pointer"
            type="button"
          >
            Need help creating a new ABHA account?
          </button>
        </div>
      </main>
    </div>
  );
};
