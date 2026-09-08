import React, { useState, useEffect } from 'react';
import { Header } from '../Header';

interface CheckInScreenProps {
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
  onContinue: () => void;
  onTokenSelected?: (token: string) => void;
}

export const CheckInScreen: React.FC<CheckInScreenProps> = ({
  currentLanguage,
  onLanguageChange,
  onContinue,
  onTokenSelected,
}) => {
  const [laserPos, setLaserPos] = useState(24);
  const [direction, setDirection] = useState(1);
  const [isScanning, setIsScanning] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [tokenInput, setTokenInput] = useState('CF-4821');

  // Sweeping laser animation
  useEffect(() => {
    const interval = setInterval(() => {
      setLaserPos((pos) => {
        if (pos >= 170) {
          setDirection(-1);
          return 168;
        }
        if (pos <= 16) {
          setDirection(1);
          return 18;
        }
        return pos + (direction > 0 ? 3 : -3);
      });
    }, 30);
    return () => clearInterval(interval);
  }, [direction]);

  const handleStartScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      onContinue();
    }, 1200);
  };

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tokenInput.trim()) {
      onTokenSelected?.(tokenInput.trim());
      setShowTokenModal(false);
      onContinue();
    }
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col bg-[#faf8ff] text-[#131b2e] pb-6 selection:bg-[#6df5e1] selection:text-[#006f64]">
      {/* Organic Background Blurs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -right-24 w-96 h-96 rounded-full bg-[#4fdbc8]/20 blur-3xl"></div>
        <div className="absolute top-1/4 -left-32 w-80 h-80 rounded-full bg-[#84d4d3]/15 blur-3xl"></div>
        <div className="absolute bottom-10 right-0 w-80 h-80 rounded-full bg-[#4cd7f6]/15 blur-3xl"></div>
      </div>

      <Header currentLanguage={currentLanguage} onLanguageChange={onLanguageChange} />

      <main className="relative z-10 flex flex-col flex-1 w-full px-5 pt-3 max-w-[430px] mx-auto">
        {/* Landscape Accent SVG */}
        <div className="absolute -top-6 right-0 w-64 h-64 pointer-events-none opacity-40 z-0">
          <svg className="w-full h-full text-[#71f8e4]" fill="none" viewBox="0 0 200 200">
            <path d="M40 180C40 120 90 90 150 90C170 90 190 95 200 100V200H40V180Z" fill="currentColor" fillOpacity="0.25"></path>
            <path d="M120 70C120 40 150 20 190 20V120C150 120 120 100 120 70Z" fill="currentColor" fillOpacity="0.3"></path>
            <circle cx="170" cy="45" fill="#14b8a6" fillOpacity="0.2" r="18"></circle>
            <path d="M80 160C85 140 105 130 125 135C130 150 115 170 95 170C85 170 80 165 80 160Z" fill="#0d6e6e" fillOpacity="0.12"></path>
          </svg>
        </div>

        {/* 1. HERO TITLE */}
        <section className="relative z-10 flex flex-col gap-1 pr-4 mb-4">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#f2f3ff] w-fit mb-1 border border-slate-200/60">
            <span className="w-2 h-2 rounded-full bg-[#006b5f] animate-pulse"></span>
            <span className="text-[11px] font-semibold text-[#006b5f] tracking-wide">Hospital Check-in</span>
          </div>
          <h1 className="text-[26px] leading-[34px] font-bold text-[#131b2e] tracking-tight">
            Your care journey<br />
            <span className="text-[#005454]">starts here.</span>
          </h1>
          <p className="text-[14px] text-[#3e4948] max-w-[320px] mt-1">
            Scan the QR code provided at your healthcare centre to begin.
          </p>
        </section>

        {/* 2. QR SCANNER VIEWPORT */}
        <section className="relative z-10 w-full mb-4">
          <div className="w-full bg-white rounded-2xl shadow-md p-4 flex flex-col items-center border border-slate-100">
            {/* Viewfinder Box */}
            <div className="relative w-[210px] h-[210px] rounded-xl bg-[#f2f3ff] overflow-hidden flex items-center justify-center">
              {/* Subtle vignette */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#71f8e4]/20 via-transparent to-[#84d4d3]/20 pointer-events-none"></div>

              {/* 4 Corner Brackets */}
              <div className="absolute top-3 left-3 w-6 h-6 border-t-4 border-l-4 border-[#005454] rounded-tl-lg pointer-events-none"></div>
              <div className="absolute top-3 right-3 w-6 h-6 border-t-4 border-r-4 border-[#005454] rounded-tr-lg pointer-events-none"></div>
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b-4 border-l-4 border-[#005454] rounded-bl-lg pointer-events-none"></div>
              <div className="absolute bottom-3 right-3 w-6 h-6 border-b-4 border-r-4 border-[#005454] rounded-br-lg pointer-events-none"></div>

              {/* Animated Scanning Laser Beam */}
              <div
                className="absolute left-2 right-2 h-[3px] rounded-full bg-gradient-to-r from-transparent via-[#6df5e1] to-transparent shadow-[0_0_12px_#6df5e1] z-20 pointer-events-none transition-transform duration-75"
                style={{ transform: `translateY(${laserPos}px)` }}
              ></div>

              {/* Vector QR Code with Medical Cross Badge */}
              <div className="relative w-[150px] h-[150px] p-2 bg-white rounded-lg flex items-center justify-center shadow-xs">
                <svg className="w-full h-full text-[#131b2e]" fill="currentColor" viewBox="0 0 100 100">
                  {/* Corner Finder 1 */}
                  <rect fill="none" height="28" rx="4" stroke="currentColor" strokeWidth="4" width="28" x="2" y="2"></rect>
                  <rect fill="currentColor" height="16" rx="2" width="16" x="8" y="8"></rect>
                  {/* Corner Finder 2 */}
                  <rect fill="none" height="28" rx="4" stroke="currentColor" strokeWidth="4" width="28" x="70" y="2"></rect>
                  <rect fill="currentColor" height="16" rx="2" width="16" x="76" y="8"></rect>
                  {/* Corner Finder 3 */}
                  <rect fill="none" height="28" rx="4" stroke="currentColor" strokeWidth="4" width="28" x="2" y="70"></rect>
                  <rect fill="currentColor" height="16" rx="2" width="16" x="8" y="76"></rect>

                  {/* Pattern blocks */}
                  <rect height="6" rx="1" width="6" x="36" y="6"></rect>
                  <rect height="6" rx="1" width="6" x="48" y="6"></rect>
                  <rect height="6" rx="1" width="6" x="58" y="14"></rect>
                  <rect height="8" rx="1" width="8" x="36" y="20"></rect>
                  <rect height="6" rx="1" width="6" x="48" y="24"></rect>
                  <rect height="8" rx="1" width="8" x="6" y="38"></rect>
                  <rect height="6" rx="1" width="6" x="18" y="44"></rect>
                  <rect height="6" rx="1" width="6" x="6" y="54"></rect>
                  <rect height="8" rx="1" width="8" x="20" y="56"></rect>
                  <rect height="6" rx="1" width="8" x="74" y="38"></rect>
                  <rect height="8" rx="1" width="8" x="86" y="44"></rect>
                  <rect height="6" rx="1" width="6" x="72" y="54"></rect>
                  <rect height="6" rx="1" width="8" x="84" y="58"></rect>
                  <rect height="8" rx="1" width="8" x="36" y="72"></rect>
                  <rect height="6" rx="1" width="6" x="50" y="72"></rect>
                  <rect height="6" rx="1" width="6" x="60" y="78"></rect>
                  <rect height="8" rx="1" width="6" x="42" y="86"></rect>
                  <rect height="8" rx="1" width="8" x="54" y="86"></rect>
                  <rect height="8" rx="1" width="8" x="74" y="80"></rect>
                  <rect height="6" rx="1" width="8" x="86" y="74"></rect>
                </svg>

                {/* Center Reassuring Medical Emblem */}
                <div className="absolute inset-0 m-auto w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-[#005454]">
                  <span className="material-symbols-outlined text-[20px]">medical_services</span>
                </div>
              </div>
            </div>

            <p className="text-[13.5px] font-medium text-[#3e4948] mt-3 text-center">
              Align the QR code inside the frame
            </p>
          </div>

          <div className="flex items-center justify-center gap-1.5 mt-3 px-1 text-center">
            <span className="material-symbols-outlined text-[18px] text-[#006b5f]">qr_code_scanner</span>
            <span className="text-[12.5px] font-medium text-[#3e4948]">
              Scan the QR code on your CareFlow token or hospital desk.
            </span>
          </div>
        </section>

        {/* 3. ACTIONS */}
        <section className="relative z-10 w-full flex flex-col gap-2.5">
          <button
            onClick={handleStartScan}
            disabled={isScanning}
            className="w-full h-14 rounded-full bg-[#005454] hover:bg-[#0d6e6e] text-white font-bold text-[17px] flex items-center justify-center gap-2 shadow-md shadow-[#005454]/25 active:scale-[0.98] transition-all cursor-pointer"
            type="button"
          >
            {isScanning ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                <span>Opening camera...</span>
              </>
            ) : (
              <>
                <span>Start Scan</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </>
            )}
          </button>

          {/* OR Divider */}
          <div className="relative flex py-1 items-center justify-center">
            <div className="w-full h-[1px] bg-[#e2e7ff]"></div>
            <span className="shrink-0 px-3 text-[11px] font-bold text-[#6e7979] uppercase tracking-wider bg-[#faf8ff]">
              OR
            </span>
            <div className="w-full h-[1px] bg-[#e2e7ff]"></div>
          </div>

          {/* Enter token number card */}
          <button
            onClick={() => setShowTokenModal(true)}
            className="w-full py-2.5 px-4 rounded-xl bg-white text-[#131b2e] flex items-center justify-between shadow-xs border border-slate-200/80 active:bg-slate-50 transition-colors text-left"
            type="button"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-[#e2e7ff] flex items-center justify-center text-[#005454] shrink-0">
                <span className="material-symbols-outlined text-[20px]">pin</span>
              </div>
              <div className="flex flex-col truncate">
                <span className="text-[15px] font-bold text-[#131b2e] truncate">Enter token number instead</span>
                <span className="text-[12px] text-[#3e4948] truncate">Printed 6-digit hospital slip code</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#6e7979] text-[20px] shrink-0 ml-1">chevron_right</span>
          </button>
        </section>

        {/* 4. FOOTER */}
        <footer className="relative z-10 w-full flex flex-col items-center gap-2 pt-4 mt-auto">
          <button
            onClick={onContinue}
            className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#006b5f] hover:underline active:opacity-80 py-1"
            type="button"
          >
            <span>Already started a visit? Resume session</span>
            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
          </button>

          <div className="inline-flex items-center gap-1.5 text-[#6e7979] text-[11px] font-medium">
            <span className="material-symbols-outlined text-[15px] text-[#006b5f]">verified_user</span>
            <span>Your information is private and secure.</span>
          </div>
        </footer>
      </main>

      {/* Manual Token Dialog */}
      {showTokenModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#005454] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">pin</span>
                </div>
                <h3 className="text-base font-bold text-[#131b2e]">Hospital Token Code</h3>
              </div>
              <button
                onClick={() => setShowTokenModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Enter the 6-digit hospital token slip code issued at the reception desk.
            </p>
            <form onSubmit={handleTokenSubmit} className="space-y-3">
              <input
                type="text"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value.toUpperCase())}
                placeholder="e.g. CF-4821"
                className="w-full h-12 px-4 text-center font-mono font-bold text-lg bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#005454]"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowTokenModal(false)}
                  className="flex-1 py-2.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-[#005454] text-white text-xs font-bold shadow-sm"
                >
                  Verify Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
