import React from 'react';
import { ExtractedDocumentData } from '../types';

interface DocumentModalProps {
  isOpen: boolean;
  document: ExtractedDocumentData;
  onClose: () => void;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({
  isOpen,
  document,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-[390px] max-h-[90vh] overflow-y-auto p-4 shadow-2xl flex flex-col gap-3 animate-in fade-in duration-200">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0d6e6e] text-[20px]">description</span>
            <div>
              <h3 className="text-xs font-bold text-[#0f1e36]">{document.fileName}</h3>
              <span className="text-[10px] text-slate-400">Captured: {document.capturedAt}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* High-fidelity Prescription Card Simulation */}
        <div className="relative bg-white border-2 border-dashed border-teal-600/30 rounded-xl p-4 shadow-inner flex flex-col gap-3 text-slate-800 text-xs">
          {/* Clinic Header */}
          <div className="border-b border-slate-200 pb-2 flex justify-between items-start">
            <div>
              <div className="font-extrabold text-[#0d6e6e] text-sm tracking-wide">
                APOLLO CLINIC & CARDIOLOGY
              </div>
              <div className="text-[10px] text-slate-500">
                102 Health Avenue, Indiranagar, Bengaluru
              </div>
              <div className="text-[9.5px] text-slate-400">ABDM Registry ID: BLR-49201-CL</div>
            </div>
            <div className="text-right">
              <span className="px-2 py-0.5 rounded bg-teal-50 text-[#0d6e6e] font-bold text-[10px] border border-teal-200">
                OPD SLIP
              </span>
              <div className="text-[10px] text-slate-500 mt-1">{document.consultationDate}</div>
            </div>
          </div>

          {/* Doctor Details */}
          <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg text-[11px]">
            <div>
              <span className="font-bold text-[#0f1e36]">{document.doctorName}</span>
              <span className="text-slate-500 block text-[10px]">{document.doctorSpecialty}</span>
            </div>
            <div className="text-right text-[10px] text-slate-500">
              <span>Reg: KMC-49210</span>
            </div>
          </div>

          {/* Rx symbol & Prescriptions */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-1.5 text-[#0d6e6e] font-bold text-sm">
              <span className="text-base font-serif italic">℞</span>
              <span className="text-[11px] tracking-wider uppercase font-sans">Prescription / दवा का पर्चा</span>
            </div>

            <div className="space-y-1.5 pl-2 border-l-2 border-[#0d6e6e]/40">
              {document.medicines.map((med, idx) => (
                <div key={idx} className="flex items-center justify-between text-[11px] bg-teal-50/50 p-1.5 rounded">
                  <span className="font-semibold text-[#0f1e36]">{idx + 1}. {med}</span>
                  <span className="text-[10px] text-slate-500">Once daily (OD)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Advice */}
          <div className="text-[10.5px] text-slate-600 bg-amber-50/70 p-2 rounded-lg border border-amber-200/50">
            <span className="font-bold text-amber-900 block text-[10px] uppercase tracking-wider">
              Clinical Advice:
            </span>
            <span>Monitor BP morning & evening. Low sodium diet. Review in 2 weeks.</span>
          </div>

          {/* Stamp & ABDM QR */}
          <div className="flex justify-between items-end pt-2 border-t border-slate-100 text-[9px] text-slate-400">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#0d6e6e]">verified</span>
              <span>Digitally Verified by ABDM</span>
            </div>
            <div className="w-12 h-12 bg-slate-100 rounded border border-slate-200 flex items-center justify-center text-[8px] text-slate-500 text-center leading-none">
              [ABDM QR]
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#0d6e6e] text-white text-xs font-bold hover:bg-[#094e4e] transition-colors"
          type="button"
        >
          Close Preview • बंद करें
        </button>
      </div>
    </div>
  );
};
