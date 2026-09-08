import React, { useState } from 'react';
import { Header } from '../Header';
import { CareFlowSession } from '../../types';

interface CompleteScreenProps {
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
  patientData: CareFlowSession;
  onStartNewIntake: () => void;
}

export const CompleteScreen: React.FC<CompleteScreenProps> = ({
  currentLanguage,
  onLanguageChange,
  patientData,
  onStartNewIntake,
}) => {
  const [showShareToast, setShowShareToast] = useState(false);

  const handleShare = () => {
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col bg-[#faf8ff] text-[#131b2e] pb-6">
      {/* Background ambient decorative shapes */}
      <div className="careflow-bg-curves"></div>
      <div className="careflow-bg-curves-bottom"></div>

      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={onLanguageChange}
        showBack={false}
      />

      <main className="relative z-10 flex flex-col flex-1 w-full px-4 pt-1 max-w-[430px] mx-auto">
        {/* Toast */}
        {showShareToast && (
          <div className="mb-3 bg-[#6df5e1] text-[#00201c] p-3 rounded-xl shadow-md flex items-center justify-between animate-in slide-in-from-top duration-200">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#005454]">check_circle</span>
              <span className="text-[13px] font-bold">Token pass copied &amp; link sent via SMS!</span>
            </div>
            <button onClick={() => setShowShareToast(false)} className="text-slate-700">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        )}

        {/* Stepper (100% Done) */}
        <div className="flex flex-col gap-1 mb-3">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="text-[#005454] uppercase tracking-wider">Step 6 of 6 · Completed</span>
            <span className="text-[#006b5f] font-semibold bg-[#71f8e4]/30 px-2 py-0.5 rounded-full">
              100% Ready
            </span>
          </div>

          <div className="grid grid-cols-6 gap-1.5 w-full pt-0.5">
            <div className="h-1.5 rounded-full bg-[#005454]"></div>
            <div className="h-1.5 rounded-full bg-[#005454]"></div>
            <div className="h-1.5 rounded-full bg-[#005454]"></div>
            <div className="h-1.5 rounded-full bg-[#005454]"></div>
            <div className="h-1.5 rounded-full bg-[#005454]"></div>
            <div className="h-1.5 rounded-full bg-[#005454] shadow-[0_0_8px_rgba(0,84,84,0.4)]"></div>
          </div>
        </div>

        {/* Big Success Hero */}
        <div className="text-center flex flex-col items-center mb-3">
          <div className="relative w-20 h-20 rounded-full bg-[#6df5e1]/30 flex items-center justify-center mb-2 animate-bounce-short">
            <div className="w-15 h-15 rounded-full bg-[#005454] text-white flex items-center justify-center shadow-md shadow-[#005454]/30">
              <span className="material-symbols-outlined text-[36px]">check</span>
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-[#005454]/20 animate-ping pointer-events-none"></div>
          </div>

          <h1 className="text-[24px] font-extrabold text-[#131b2e] tracking-tight">
            Check-in Complete!
          </h1>
          <p className="text-[13.5px] font-semibold text-[#006b5f] mt-0.5">
            आपकी जानकारी सुरक्षित रूप से दर्ज कर ली गई है।
          </p>
          <p className="text-[12px] text-[#3e4948] max-w-xs mt-1 leading-snug">
            Your preliminary assessment has been routed to{' '}
            <span className="font-bold text-[#131b2e]">Dr. Ananya Ray</span> and the triage station.
          </p>
        </div>

        {/* Official Token Pass Card */}
        <div className="relative w-full rounded-2xl bg-gradient-to-br from-[#005454] to-[#003737] text-white p-4 shadow-lg mb-3 overflow-hidden">
          {/* Subtle watermarks */}
          <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[150px]">verified_user</span>
          </div>

          <div className="flex items-center justify-between border-b border-teal-600/60 pb-3 mb-3">
            <div>
              <span className="text-[10.5px] text-teal-200 uppercase tracking-widest font-bold">
                CLINICAL TOKEN
              </span>
              <div className="text-[34px] font-mono font-extrabold tracking-tight leading-none text-white mt-0.5">
                {patientData.tokenNumber || 'A-104'}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10.5px] text-teal-200 uppercase tracking-widest font-bold">
                ESTIMATED WAIT
              </span>
              <div className="text-[20px] font-bold text-[#71f8e4] mt-0.5 flex items-center justify-end gap-1">
                <span className="material-symbols-outlined text-[18px]">schedule</span>
                <span>~12 mins</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[12.5px]">
            <div>
              <span className="text-teal-200 text-[11px] block">Consultation Room</span>
              <span className="font-bold text-white">Room 302, 3rd Floor</span>
              <span className="text-[11px] text-teal-200 block">Cardiology &amp; General Medicine</span>
            </div>

            <div className="w-16 h-16 rounded-xl bg-white p-1 shrink-0 flex items-center justify-center">
              {/* Simulated QR Code for Token */}
              <svg className="w-full h-full text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm10-2h3v3h-3v-3zm3 3h3v3h-3v-3zm-3 3h3v3h-3v-3zm5-3h1v1h-1v-1zm0 2h1v1h-1v-1zm-7-2h2v2h-2v-2zm4 4h3v1h-3v-1z"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Clinical Intake Summary Card */}
        <div className="rounded-2xl bg-white p-3.5 shadow-xs border border-slate-200/70 mb-3 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#005454] flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">medical_services</span>
              <span>Intake Dossier</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold flex items-center gap-0.5 border border-emerald-200">
              <span className="material-symbols-outlined text-[13px]">check_circle</span>
              <span>ABDM Linked</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[12px]">
            <div>
              <span className="text-[10.5px] text-slate-400 block font-medium">Patient Name</span>
              <span className="font-bold text-[#131b2e]">{patientData.name || 'Priya Sharma'}</span>
            </div>
            <div>
              <span className="text-[10.5px] text-slate-400 block font-medium">ABHA Health ID</span>
              <span className="font-mono font-semibold text-[#005454] text-[11.5px]">
                {patientData.abhaId || '91-4920-8472-1029'}
              </span>
            </div>
            <div>
              <span className="text-[10.5px] text-slate-400 block font-medium">Demographics</span>
              <span className="font-medium text-slate-700">
                {patientData.dob ? '14/08/1994 (29 Y)' : '29 Y'}, {patientData.gender || 'Female'}
              </span>
            </div>
            <div>
              <span className="text-[10.5px] text-slate-400 block font-medium">Language &amp; Mode</span>
              <span className="font-medium text-slate-700">
                {patientData.language || 'English'} · {patientData.attendantMode === 'helper' ? 'Attendant' : 'Direct'}
              </span>
            </div>
          </div>

          {/* Primary complaint */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[10.5px] text-slate-400 block font-medium">Reported Concern</span>
            <p className="text-[12.5px] font-semibold text-[#131b2e] mt-0.5 leading-snug">
              “{patientData.chiefComplaint || 'Chest pain and mild dizziness since yesterday evening'}”
            </p>
          </div>

          {/* Symptoms badges */}
          <div>
            <span className="text-[10.5px] text-slate-400 block font-medium mb-1">Triage Symptoms</span>
            <div className="flex flex-wrap gap-1.5">
              {(patientData.symptoms?.length ? patientData.symptoms : ['fever', 'cough']).map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-0.5 rounded-full bg-[#f2f3ff] text-[#005454] text-[11px] font-semibold flex items-center gap-1 border border-teal-100"
                >
                  <span className="material-symbols-outlined text-[12px]">check</span>
                  <span className="capitalize">{s.replace('-', ' ')}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Guidance Directions */}
        <div className="rounded-2xl bg-[#f2f3ff] p-3 border border-teal-100/70 mb-3 space-y-2">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white text-[#005454] flex items-center justify-center shrink-0 shadow-2xs font-bold text-xs">
              1
            </div>
            <div>
              <span className="text-[12.5px] font-bold text-[#131b2e]">Proceed to Waiting Lounge B</span>
              <p className="text-[11.5px] text-[#3e4948] leading-tight mt-0.5">
                Take Elevator 2 to 3rd Floor. Your token will be called on the central LED displays.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 pt-1.5 border-t border-slate-200/50">
            <div className="w-8 h-8 rounded-xl bg-white text-[#005454] flex items-center justify-center shrink-0 shadow-2xs font-bold text-xs">
              2
            </div>
            <div>
              <span className="text-[12.5px] font-bold text-[#131b2e]">Digital Prescription Sync</span>
              <p className="text-[11.5px] text-[#3e4948] leading-tight mt-0.5">
                Post-consultation summary will automatically sync to your ABHA health locker.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={handleShare}
            className="flex-1 py-2.5 px-3 rounded-xl bg-white border border-slate-200/80 hover:bg-slate-50 text-[12.5px] font-bold text-[#005454] flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[17px]">share</span>
            <span>Share Pass</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 px-3 rounded-xl bg-white border border-slate-200/80 hover:bg-slate-50 text-[12.5px] font-bold text-[#005454] flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[17px]">print</span>
            <span>Print Token</span>
          </button>
        </div>

        {/* Bottom CTA to start a new check-in */}
        <div className="mt-auto pt-1 flex flex-col gap-2">
          <button
            onClick={onStartNewIntake}
            className="w-full h-12 rounded-full bg-[#005454] hover:bg-[#0d6e6e] text-white font-bold text-[15px] flex items-center justify-center gap-2 shadow-md shadow-[#005454]/20 transition-all cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            <span>Start New Patient Intake</span>
          </button>

          <div className="text-center text-[10.5px] text-slate-400">
            CareFlow ClinicOS v2.4 · National Health Authority Accredited
          </div>
        </div>
      </main>
    </div>
  );
};
