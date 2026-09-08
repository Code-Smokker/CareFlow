import React, { useState } from 'react';
import { CareFlowSession } from '../types';

interface EditModalProps {
  isOpen: boolean;
  field: string | null;
  patientData: CareFlowSession;
  onClose: () => void;
  onSave: (updatedData: Partial<CareFlowSession>) => void;
}

export const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  field,
  patientData,
  onClose,
  onSave,
}) => {
  if (!isOpen || !field) return null;

  // Local states
  const [doctorName, setDoctorName] = useState(patientData.document.doctorName);
  const [doctorSpecialty, setDoctorSpecialty] = useState(patientData.document.doctorSpecialty);
  const [clinicName, setClinicName] = useState(patientData.document.clinicName);
  const [consultationDate, setConsultationDate] = useState(patientData.document.consultationDate);
  const [documentType, setDocumentType] = useState(patientData.document.documentType);
  const [medicinesStr, setMedicinesStr] = useState(patientData.document.medicines.join(', '));
  const [reasonEn, setReasonEn] = useState(patientData.reasonForVisitEn);
  const [reasonHi, setReasonHi] = useState(patientData.reasonForVisitHi);
  const [symptomsStr, setSymptomsStr] = useState(patientData.symptomsEn.join(', '));
  const [durationEn, setDurationEn] = useState(patientData.durationEn);
  const [painSeverity, setPainSeverity] = useState(patientData.painSeverity);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (field === 'doctor') {
      onSave({
        document: {
          ...patientData.document,
          doctorName,
          doctorSpecialty,
          clinicName,
        },
      });
    } else if (field === 'date') {
      onSave({
        document: {
          ...patientData.document,
          consultationDate,
        },
      });
    } else if (field === 'type') {
      onSave({
        document: {
          ...patientData.document,
          documentType,
        },
      });
    } else if (field === 'medicines') {
      onSave({
        document: {
          ...patientData.document,
          medicines: medicinesStr.split(',').map((s) => s.trim()).filter(Boolean),
        },
      });
    } else if (field === 'reason') {
      onSave({
        reasonForVisitEn: reasonEn,
        reasonForVisitHi: reasonHi,
      });
    } else if (field === 'symptoms') {
      onSave({
        symptomsEn: symptomsStr.split(',').map((s) => s.trim()).filter(Boolean),
      });
    } else if (field === 'duration') {
      onSave({
        durationEn,
      });
    } else if (field === 'pain') {
      onSave({
        painSeverity: Number(painSeverity),
        hasRedFlag: Number(painSeverity) >= 8,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-[360px] p-5 shadow-2xl border border-slate-100 flex flex-col gap-4 animate-in fade-in duration-200">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-sm font-bold text-[#0f1e36]">
            Edit Information • विवरण संपादित करें
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {field === 'doctor' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Doctor Name
                </label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-[#0d6e6e] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Specialty
                </label>
                <input
                  type="text"
                  value={doctorSpecialty}
                  onChange={(e) => setDoctorSpecialty(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-[#0d6e6e] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Clinic or Hospital
                </label>
                <input
                  type="text"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-[#0d6e6e] focus:outline-none"
                />
              </div>
            </>
          )}

          {field === 'date' && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Consultation Date
              </label>
              <input
                type="text"
                value={consultationDate}
                onChange={(e) => setConsultationDate(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-[#0d6e6e] focus:outline-none"
              />
            </div>
          )}

          {field === 'type' && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Document Type
              </label>
              <input
                type="text"
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-[#0d6e6e] focus:outline-none"
              />
            </div>
          )}

          {field === 'medicines' && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Medicines (comma separated)
              </label>
              <textarea
                value={medicinesStr}
                onChange={(e) => setMedicinesStr(e.target.value)}
                rows={3}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-[#0d6e6e] focus:outline-none"
              />
            </div>
          )}

          {field === 'reason' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Reason for visit (English)
                </label>
                <input
                  type="text"
                  value={reasonEn}
                  onChange={(e) => setReasonEn(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-[#0d6e6e] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 font-hindi">
                  आने का कारण (हिंदी)
                </label>
                <input
                  type="text"
                  value={reasonHi}
                  onChange={(e) => setReasonHi(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-[#0d6e6e] focus:outline-none"
                />
              </div>
            </>
          )}

          {field === 'symptoms' && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Reported symptoms (comma separated)
              </label>
              <input
                type="text"
                value={symptomsStr}
                onChange={(e) => setSymptomsStr(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-[#0d6e6e] focus:outline-none"
              />
            </div>
          )}

          {field === 'duration' && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Duration (e.g. 2 days)
              </label>
              <input
                type="text"
                value={durationEn}
                onChange={(e) => setDurationEn(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:border-[#0d6e6e] focus:outline-none"
              />
            </div>
          )}

          {field === 'pain' && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Pain Severity (0 - 10)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={painSeverity}
                  onChange={(e) => setPainSeverity(Number(e.target.value))}
                  className="w-full accent-[#0d6e6e]"
                />
                <span className="font-bold text-sm text-[#0d6e6e] min-w-[28px] text-right">
                  {painSeverity}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                {painSeverity >= 8 ? '🚨 High severity triggers clinical attention screen' : 'Standard severity'}
              </span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold rounded-lg bg-[#0d6e6e] hover:bg-[#094e4e] text-white shadow-xs"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
