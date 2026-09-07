"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ClinicalSummaryPrintPage() {
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "hi">("en");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col w-full gap-space-base pb-16 print:p-0 print:m-0 print:pb-0">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-inverse-surface text-inverse-on-surface shadow-lg text-clinical-data font-clinical-data border border-outline-variant/30 print:hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="material-symbols-outlined text-primary-fixed text-lg">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Screen Header Controls (Hidden on Print) */}
      <div className="w-full bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-space-base flex flex-col md:flex-row md:items-center justify-between gap-space-base print:hidden">
        <div className="flex items-center gap-space-sm">
          <Link
            href="/patient-overview"
            className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors"
            title="Return to Overview"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
          </Link>
          <div className="flex flex-col">
            <h1 className="font-page-title text-subheading text-on-surface font-semibold">
              Print &amp; Share Clinical Summary
            </h1>
            <p className="font-body-default text-metadata-micro text-on-surface-variant">
              ABHA PHR Linked · Formatted for A4 Physical Print and Cryptographic Patient Export
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Language Selector */}
          <select
            value={selectedLanguage}
            onChange={(e) => {
              setSelectedLanguage(e.target.value as "en" | "hi");
              showToast(`Language switched to ${e.target.value === "en" ? "English" : "Hindi (हिंदी)"}`);
            }}
            className="h-9 px-3 rounded-lg bg-surface-container-low border border-outline-variant text-clinical-data font-clinical-data text-on-surface focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="en">English (Official)</option>
            <option value="hi">हिंदी (Hindi Translation)</option>
          </select>

          <button
            onClick={() => showToast("Dispatched SMS & WhatsApp secure link to patient (+91 98101-28941).")}
            className="h-9 px-3 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg text-clinical-data font-clinical-data font-semibold transition-colors flex items-center gap-1.5 border border-outline-variant/20"
          >
            <span className="material-symbols-outlined text-base text-primary">send_to_mobile</span>
            <span>Send SMS / WhatsApp</span>
          </button>

          <button
            onClick={() => showToast("Pushed encrypted FHIR R4 DiagnosticReport bundle to Rahul Sharma's ABHA Health Locker.")}
            className="h-9 px-3 bg-primary-container hover:bg-primary-container/80 text-on-primary-container rounded-lg text-clinical-data font-clinical-data font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-base">cloud_upload</span>
            <span>Push to ABHA Locker</span>
          </button>

          <button
            onClick={() => showToast("Downloading PDF bundle with embedded digital DSC signature...")}
            className="h-9 px-3 bg-secondary hover:bg-secondary/90 text-on-secondary rounded-lg text-clinical-data font-clinical-data font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-base">download</span>
            <span>Export PDF</span>
          </button>

          <button
            onClick={handlePrint}
            className="h-9 px-4 bg-primary hover:bg-primary-container text-on-primary rounded-lg text-clinical-data font-clinical-data font-semibold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-base">print</span>
            <span>Print Document</span>
          </button>
        </div>
      </div>

      {/* A4 Document Sheet */}
      <div className="w-full max-w-4xl mx-auto bg-white text-slate-900 p-8 md:p-12 rounded-xl shadow-md border border-slate-200 print:shadow-none print:border-none print:p-0 print:max-w-none print:w-full print:rounded-none">
        {/* Hospital Letterhead */}
        <div className="flex items-start justify-between pb-6 border-b-2 border-primary/40 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-2xl shadow-sm">
              <span className="material-symbols-outlined text-3xl">local_hospital</span>
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl font-bold tracking-tight text-primary uppercase">
                Apollo Indraprastha Hospitals
              </h2>
              <span className="text-xs text-slate-600 font-medium">
                Central Campus · Sarita Vihar, Mathura Road, New Delhi 110076
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                NABH Accredited · JCI Gold Seal · ABDM HIP/HIU Reg: IN-DL-HP-00412
              </span>
            </div>
          </div>

          <div className="text-right flex flex-col items-end">
            <span className="px-2.5 py-1 rounded bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold font-mono">
              OFFICIAL DISCHARGE SUMMARY
            </span>
            <span className="text-xs text-slate-600 font-mono mt-1">
              Ref: #DIS-2026-09821
            </span>
            <span className="text-[11px] text-slate-500">
              Generated: 18-Oct-2026 16:45 IST
            </span>
          </div>
        </div>

        {/* Patient Demographic Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 my-6 bg-slate-50 rounded-lg border border-slate-200 text-xs">
          <div className="flex flex-col">
            <span className="text-slate-500 uppercase text-[10px] font-bold">Patient Name</span>
            <span className="font-bold text-slate-900 text-sm">Rahul Sharma</span>
            <span className="text-slate-600 font-mono">42 Yrs / Male · B+</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-500 uppercase text-[10px] font-bold">Hospital Identifiers</span>
            <span className="font-mono font-bold text-slate-900">UHID: DEL-2024-8841</span>
            <span className="text-slate-600 font-mono">IPD Reg: #IPD-88219</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-500 uppercase text-[10px] font-bold">ABHA Health ID</span>
            <span className="font-mono font-bold text-primary">91-8842-1920-4491</span>
            <span className="text-slate-600">Verified via Aadhaar OTP</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-500 uppercase text-[10px] font-bold">Admission &amp; Discharge</span>
            <span className="font-mono font-bold text-slate-900">Adm: 18-Oct-2026 13:55</span>
            <span className="text-slate-600 font-mono">Dis: 18-Oct-2026 16:45</span>
          </div>
        </div>

        {/* Attending & Unit */}
        <div className="flex items-center justify-between px-4 py-2 mb-6 bg-teal-50/50 rounded border border-teal-100 text-xs">
          <div>
            <strong className="text-slate-700">Attending Consultant: </strong>
            <span className="font-bold text-slate-900">Dr. Rohit Verma</span>
            <span className="text-slate-600"> (MD, DM Cardiology, FACC) · Reg #MCI-2009-08821</span>
          </div>
          <div>
            <strong className="text-slate-700">Department: </strong>
            <span className="font-semibold text-slate-900">Cardiology &amp; Cardiac Catheterization Lab</span>
          </div>
        </div>

        {/* Clinical Highlights & Diagnoses */}
        <div className="flex flex-col gap-6 text-xs text-slate-800">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-primary border-b border-slate-200 pb-1 mb-2">
              1. Final Clinical Diagnosis &amp; ICD-10 Coding
            </h3>
            <div className="p-3 bg-slate-50 rounded border border-slate-200 flex flex-col gap-1">
              <div className="flex items-center justify-between font-bold text-slate-900 text-sm">
                <span>Acute Anterior Wall ST-Elevation Myocardial Infarction (STEMI)</span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-red-100 text-red-800">
                  ICD-10: I21.0 · SNOMED: 57054005
                </span>
              </div>
              <p className="text-slate-600 text-xs mt-0.5">
                Secondary diagnoses: Essential Hypertension (I10), Type 2 Diabetes Mellitus without end-organ damage (E11.9).
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-primary border-b border-slate-200 pb-1 mb-2">
              2. Surgical Procedures &amp; Interventions Performed
            </h3>
            <div className="p-3 bg-slate-50 rounded border border-slate-200 flex flex-col gap-1.5">
              <div className="font-semibold text-slate-900">
                Primary Percutaneous Coronary Intervention (PCI) with Drug-Eluting Stent (DES)
              </div>
              <ul className="list-disc list-inside text-slate-700 space-y-1">
                <li>Access Site: Right Radial Artery (6F Glidesheath Slender). Hemostasis achieved with TR Band.</li>
                <li>Coronary Angiography: 99% thrombotic occlusion of proximal Left Anterior Descending (LAD) artery.</li>
                <li>Stent Implantation: Promus Premier Everolimus-Eluting Stent 3.5 x 24 mm deployed at 16 atm.</li>
                <li>Post-PCI Result: TIMI 3 flow restored with 0% residual stenosis. Total Fluoroscopy Time: 14.2 min.</li>
                <li>Door-to-Balloon Achievement: Medical contact to balloon inflation achieved in <strong>38 minutes</strong> (Target &lt;90m).</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-primary border-b border-slate-200 pb-1 mb-2">
              3. Hemodynamic Vitals at Discharge / Transfer
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex flex-col">
                <span className="text-slate-500 uppercase text-[10px] font-bold">Blood Pressure</span>
                <span className="font-mono font-bold text-sm text-slate-900">124/78 mmHg</span>
                <span className="text-[11px] text-teal-700">Optimal post-PCI</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex flex-col">
                <span className="text-slate-500 uppercase text-[10px] font-bold">Heart Rate</span>
                <span className="font-mono font-bold text-sm text-slate-900">72 bpm</span>
                <span className="text-[11px] text-teal-700">Normal Sinus Rhythm</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex flex-col">
                <span className="text-slate-500 uppercase text-[10px] font-bold">SpO2 Oxygen</span>
                <span className="font-mono font-bold text-sm text-slate-900">99%</span>
                <span className="text-[11px] text-teal-700">Room air maintained</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex flex-col">
                <span className="text-slate-500 uppercase text-[10px] font-bold">eGFR Renal</span>
                <span className="font-mono font-bold text-sm text-slate-900">98 mL/min</span>
                <span className="text-[11px] text-teal-700">Low CIN risk</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-primary border-b border-slate-200 pb-1 mb-2">
              4. Discharge Medication Regimen (Strict Compliance Required)
            </h3>
            <div className="overflow-x-auto border border-slate-200 rounded">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
                    <th className="p-2">Medication Name</th>
                    <th className="p-2">Dose / Route</th>
                    <th className="p-2">Timing</th>
                    <th className="p-2">Instructions</th>
                    <th className="p-2">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  <tr>
                    <td className="p-2 font-bold text-slate-900">Aspirin (Ecosprin) 75mg</td>
                    <td className="p-2">1 Tab · Oral</td>
                    <td className="p-2">Once daily (Post lunch)</td>
                    <td className="p-2 font-sans text-slate-600">Do not skip. Antiplatelet protection.</td>
                    <td className="p-2">Life-long</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-slate-900">Ticagrelor (Brilinta) 90mg</td>
                    <td className="p-2">1 Tab · Oral</td>
                    <td className="p-2">Twice daily (12h apart)</td>
                    <td className="p-2 font-sans text-slate-600">Dual antiplatelet (DAPT) for stent patency.</td>
                    <td className="p-2">12 Months</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-slate-900">Atorvastatin 80mg</td>
                    <td className="p-2">1 Tab · Oral</td>
                    <td className="p-2">Night at bedtime</td>
                    <td className="p-2 font-sans text-slate-600">High-intensity lipid stabilization.</td>
                    <td className="p-2">Continuous</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-slate-900">Metoprolol Succinate 25mg</td>
                    <td className="p-2">1 Tab · Oral</td>
                    <td className="p-2">Morning post breakfast</td>
                    <td className="p-2 font-sans text-slate-600">Cardioprotection; monitor resting pulse.</td>
                    <td className="p-2">Continuous</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-slate-900">Metformin 500mg</td>
                    <td className="p-2">1 Tab · Oral</td>
                    <td className="p-2">Twice daily with meals</td>
                    <td className="p-2 font-sans text-slate-600">Resume 48h post-contrast with eGFR check.</td>
                    <td className="p-2">Ongoing</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Red Flag Warning Signs */}
          <div className="p-3.5 bg-red-50 rounded-lg border border-red-200 flex flex-col gap-1">
            <span className="font-bold text-red-900 uppercase text-xs flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">emergency</span>
              Emergency Red-Flag Warning Signs (Return to Hospital Immediately)
            </span>
            <p className="text-red-800 text-[11px] leading-relaxed">
              If you experience recurrence of chest tightness, pain radiating to the jaw/left arm, sudden shortness of breath, dizziness, cold sweats, or significant bleeding/hematoma at the right wrist puncture site, call <strong>Apollo Emergency at 1066</strong> or proceed to the nearest emergency room immediately.
            </p>
          </div>

          {/* Follow-up Scheduling */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div>
              <strong className="text-slate-700">Scheduled Follow-up Review: </strong>
              <span className="font-bold text-slate-900">25-Oct-2026 at 10:30 AM IST</span>
            </div>
            <div>
              <strong className="text-slate-700">Location: </strong>
              <span className="text-slate-900">Dr. Rohit Verma · OPD Room C-14, Cardiology Wing</span>
            </div>
          </div>
        </div>

        {/* Attestation & Security Footer */}
        <div className="mt-8 pt-6 border-t-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            {/* Real SVG QR Code representation */}
            <div className="w-20 h-20 bg-slate-100 p-1.5 rounded border border-slate-300 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <rect width="100" height="100" fill="white" />
                <rect x="10" y="10" width="25" height="25" fill="#0f766e" />
                <rect x="15" y="15" width="15" height="15" fill="white" />
                <rect x="18" y="18" width="9" height="9" fill="#0f766e" />
                <rect x="65" y="10" width="25" height="25" fill="#0f766e" />
                <rect x="70" y="15" width="15" height="15" fill="white" />
                <rect x="73" y="18" width="9" height="9" fill="#0f766e" />
                <rect x="10" y="65" width="25" height="25" fill="#0f766e" />
                <rect x="15" y="70" width="15" height="15" fill="white" />
                <rect x="18" y="73" width="9" height="9" fill="#0f766e" />
                <circle cx="50" cy="50" r="8" fill="#0f766e" />
                <rect x="42" y="15" width="6" height="12" fill="#0f766e" />
                <rect x="65" y="45" width="15" height="6" fill="#0f766e" />
                <rect x="45" y="75" width="12" height="12" fill="#0f766e" />
                <rect x="75" y="75" width="10" height="10" fill="#0f766e" />
              </svg>
            </div>
            <div className="flex flex-col text-[10px] text-slate-500 font-mono">
              <span className="font-bold text-slate-700">Verifiable ABDM QR Token</span>
              <span>Doc-ID: FHIR-R4-COMP-88219</span>
              <span>SHA256: a9f84bc...2e01</span>
              <span>Scan to load in Ayushman PHR</span>
            </div>
          </div>

          <div className="flex flex-col items-end text-right">
            <div className="p-2 bg-teal-50/70 border border-teal-200 rounded text-right">
              <span className="text-[10px] font-mono text-teal-800 font-bold block">
                DIGITALLY SIGNED &amp; CRYPTOGRAPHICALLY ATTESTED
              </span>
              <span className="text-xs font-bold text-slate-900 block mt-0.5">
                Dr. Rohit Verma, MD, DM (Cardiology)
              </span>
              <span className="text-[10px] text-slate-600 block">
                Class 3 Healthcare DSC (e-Mudhra PKI) · Reg #MCI-2009-08821
              </span>
              <span className="text-[10px] font-mono text-slate-500 block">
                Timestamp: 18-Oct-2026 16:45:12 IST
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
