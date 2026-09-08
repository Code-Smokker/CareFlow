"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ReferralDetailPage() {
  const params = useParams();
  const rawId = (params?.id as string) || "REF-2024-08912";
  const refId = rawId.startsWith("REF") ? rawId : "REF-2024-08912";

  // Notifications Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Modals
  const [isDossierModalOpen, setIsDossierModalOpen] = useState(false);
  const [isAbdmModalOpen, setIsAbdmModalOpen] = useState(false);
  const [isAmbulanceModalOpen, setIsAmbulanceModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isSignOffModalOpen, setIsSignOffModalOpen] = useState(false);
  const [isAbortModalOpen, setIsAbortModalOpen] = useState(false);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [isHashVerified, setIsHashVerified] = useState(false);
  const [isAudioLinkActive, setIsAudioLinkActive] = useState(true);

  // Transfer Checklist State
  const [checklist, setChecklist] = useState<boolean[]>([true, true, true, true, true]);
  const toggleChecklist = (index: number) => {
    setChecklist((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };
  const verifiedCount = checklist.filter(Boolean).length;

  return (
    <div className="flex flex-col w-full gap-space-md">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-inverse-surface text-inverse-on-surface px-4 py-2.5 rounded-lg shadow-xl border border-outline-variant/30 text-clinical-data animate-bounce">
          <span className="material-symbols-outlined text-primary text-base">check_circle</span>
          <span className="font-semibold">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-outline-variant hover:text-inverse-on-surface"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* Top Breadcrumb & Status Super-Bar */}
      <div className="flex flex-wrap items-center justify-between gap-space-sm bg-surface-container-lowest px-panel-padding py-space-sm rounded-lg shadow-sm border border-outline-variant/20">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-space-xs font-metadata-micro text-metadata-micro text-on-surface-variant flex-wrap">
            <Link href="/admissions-ipd" className="hover:text-primary transition-colors">
              Operations &amp; Registry
            </Link>
            <span className="material-symbols-outlined text-xs text-outline">chevron_right</span>
            <Link href="/discharge-referrals" className="hover:text-primary transition-colors">
              Discharge &amp; Referrals
            </Link>
            <span className="material-symbols-outlined text-xs text-outline">chevron_right</span>
            <span className="font-clinical-data-mono text-primary font-semibold">
              Referral #{refId}
            </span>
          </div>
          <div className="flex items-center gap-space-md mt-space-2xs flex-wrap">
            <h1 className="font-page-title text-page-title text-on-surface tracking-tight">Referral Detail</h1>
            <div className="flex items-center gap-space-xs">
              <span className="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-clinical-data text-metadata-micro font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                Accepted &amp; Scheduled
              </span>
              <span className="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full bg-error-container text-on-error-container font-clinical-data text-metadata-micro font-semibold">
                <span className="material-symbols-outlined text-xs">emergency_home</span>
                Urgent - Tertiary Transfer
              </span>
            </div>
          </div>
        </div>

        {/* Top Action Array */}
        <div className="flex items-center gap-space-xs flex-wrap">
          <button
            onClick={() => setIsDossierModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-space-sm py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface rounded font-clinical-data text-clinical-data shadow-sm transition-all"
            title="Download Official Medical Summary Package"
          >
            <span className="material-symbols-outlined text-base text-primary">picture_as_pdf</span>
            <span>Download Dossier</span>
          </button>
          <button
            onClick={() => setIsAbdmModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-space-sm py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface rounded font-clinical-data text-clinical-data shadow-sm transition-all"
            title="ABDM National Health Network Dispatch"
          >
            <span className="material-symbols-outlined text-base text-tertiary">cell_tower</span>
            <span>Push via ABDM</span>
          </button>
          <button
            onClick={() => setIsAmbulanceModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-space-sm py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface rounded font-clinical-data text-clinical-data shadow-sm transition-all"
            title="Real-time GPS Telemetry Monitor"
          >
            <span className="material-symbols-outlined text-base text-primary">local_shipping</span>
            <span>Track ALS Ambulance</span>
          </button>
          <button
            onClick={() => setIsQrModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-space-sm py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface rounded font-clinical-data text-clinical-data shadow-sm transition-all"
            title="Generate Physical Bedside Handover Pass"
          >
            <span className="material-symbols-outlined text-base text-on-surface-variant">qr_code_2</span>
            <span>Print QR</span>
          </button>
          <button
            onClick={() => setIsSignOffModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-space-md py-1.5 bg-primary hover:bg-primary-container text-on-primary rounded font-body-strong text-clinical-data shadow-sm transition-all"
            title="Physician Verification and Bedside Transfer Sign-Off"
          >
            <span className="material-symbols-outlined text-base">verified_user</span>
            <span>Clinical Hand-off Sign-off</span>
          </button>
        </div>
      </div>

      {/* Red Flag Medical Strip & Patient Context Header */}
      <div className="relative flex flex-col bg-surface-container-lowest rounded-lg shadow-sm overflow-hidden border border-outline-variant/20">
        {/* Active Critical Alert Ribbon */}
        <div className="flex items-center justify-between px-panel-padding py-1.5 bg-error-container text-on-error-container font-clinical-data text-metadata-micro flex-wrap gap-2">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-base text-error shrink-0">warning</span>
            <span className="font-body-strong tracking-wide uppercase">Critical Transport Alert:</span>
            <span>
              Severe Refractory Hyperkalemia (6.2 mEq/L) · Acute AV Fistula Occlusion · Continuous Telemetry &amp; Cardiac Rhythm Monitoring Required During Transit
            </span>
          </div>
          <div className="flex items-center gap-space-md font-clinical-data-mono">
            <span>Pre-med Shift: 14:10 IST</span>
            <span className="font-bold">STATUS: CRITICAL STABLE</span>
          </div>
        </div>

        {/* Patient Details Banner */}
        <div className="p-panel-padding flex flex-wrap items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md">
            <div className="relative">
              <div className="h-14 w-14 rounded-full bg-surface-container-high flex items-center justify-center font-chief-complaint text-section-title text-primary shadow-inner">
                HC
              </div>
              <span
                className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-error ring-2 ring-surface-container-lowest flex items-center justify-center text-[9px] text-on-error font-bold"
                title="High Fall / Hemodynamic Risk"
              >
                !
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-space-sm flex-wrap">
                <span className="font-page-title text-section-title text-on-surface">Harish Chandra</span>
                <span className="font-clinical-data text-clinical-data text-on-surface-variant">64 Y / Male</span>
                <span className="px-space-xs py-0.5 rounded bg-surface-container-high font-clinical-data-mono text-metadata-micro text-on-surface">
                  UHID: DEL-2024-4419
                </span>
                <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded bg-primary-fixed text-on-primary-fixed-variant font-clinical-data-mono text-metadata-micro font-semibold">
                  <span className="material-symbols-outlined text-xs">verified</span>
                  ABHA: 91-4920-8812-3012
                </span>
              </div>
              <div className="flex items-center gap-space-lg font-metadata-micro text-metadata-micro text-on-surface-variant mt-1 flex-wrap">
                <span>
                  <strong className="text-on-surface">Payer:</strong> CGHS Beneficiary (Central Govt. Pensioner - Code 8119)
                </span>
                <span>
                  <strong className="text-on-surface">Blood Group:</strong> B Positive (Rh+)
                </span>
                <span>
                  <strong className="text-on-surface">Source Bed:</strong> Nephro-Ward ICU-B04
                </span>
                <span>
                  <strong className="text-on-surface">Primary Attending:</strong> Dr. Sameer Kulkarni, DM
                </span>
              </div>
            </div>
          </div>

          {/* Quick Transfer Telemetry Snapshot */}
          <div className="flex items-center gap-space-md bg-surface-container-low px-space-md py-space-sm rounded">
            <div className="flex flex-col items-center">
              <span className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase">Blood Pressure</span>
              <span className="font-clinical-data-mono text-body-strong text-error">168/96</span>
              <span className="font-metadata-micro text-[10px] text-error">↑ Volume Surge</span>
            </div>
            <div className="h-8 w-px bg-surface-variant"></div>
            <div className="flex flex-col items-center">
              <span className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase">Serum K+</span>
              <span className="font-clinical-data-mono text-body-strong text-error">6.2</span>
              <span className="font-metadata-micro text-[10px] text-error">mEq/L · Critical</span>
            </div>
            <div className="h-8 w-px bg-surface-variant"></div>
            <div className="flex flex-col items-center">
              <span className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase">SpO2 / RR</span>
              <span className="font-clinical-data-mono text-body-strong text-on-surface">94% / 22</span>
              <span className="font-metadata-micro text-[10px] text-on-surface-variant">Room Air</span>
            </div>
            <div className="h-8 w-px bg-surface-variant"></div>
            <div className="flex flex-col items-center">
              <span className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase">Ambulance ETA</span>
              <span className="font-clinical-data-mono text-body-strong text-primary">16:15 IST</span>
              <span className="font-metadata-micro text-[10px] text-primary">30m transit window</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Column Clinical Matrix Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-md">
        {/* LEFT COLUMN: Referring Provider & Clinical Context (col-span-4) */}
        <div className="xl:col-span-4 flex flex-col gap-space-md">
          {/* Referring Facility Card */}
          <div className="bg-surface-container-lowest p-panel-padding rounded-lg shadow-sm flex flex-col gap-space-sm border border-outline-variant/20">
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-base">outpatient</span>
                <span className="font-section-title text-subheading text-on-surface">Referring Provider Context</span>
              </div>
              <span className="px-space-xs py-0.5 rounded bg-surface-container-high font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                UNIT-NEPH-01
              </span>
            </div>
            <div className="bg-surface-container-low p-space-sm rounded flex flex-col gap-1">
              <span className="font-metadata-micro text-metadata-micro text-outline uppercase font-semibold">Originating Institution</span>
              <span className="font-body-strong text-body-default text-on-surface">Apollo Indraprastha Hospitals · Central Campus</span>
              <span className="font-clinical-data text-metadata-micro text-on-surface-variant">Main Nephrology Unit &amp; Renal Dialysis Suite · Delhi</span>
            </div>
            <div className="flex items-center gap-space-sm p-space-sm bg-surface-container-low rounded">
              <div className="h-9 w-9 rounded-full bg-surface-variant flex items-center justify-center text-primary font-bold">
                SK
              </div>
              <div className="flex flex-col">
                <span className="font-body-strong text-clinical-data text-on-surface">Dr. Sameer Kulkarni, MD, DM</span>
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">Chief of Nephrology &amp; Metabolic Medicine</span>
                <span className="font-clinical-data-mono text-metadata-micro text-primary">Reg: MCI-DL-29481 · Mobile Direct: Ext. 518</span>
              </div>
            </div>
            {/* Admitting Diagnosis Box */}
            <div className="flex flex-col gap-space-xs mt-space-xs">
              <span className="font-metadata-micro text-metadata-micro text-outline uppercase font-semibold">
                Primary &amp; Admitting Diagnosis
              </span>
              <div className="space-y-1">
                <div className="p-space-xs bg-surface-container rounded flex items-center justify-between">
                  <span className="font-clinical-data text-clinical-data text-on-surface">End-Stage Renal Disease on Maintenance HD</span>
                  <span className="font-clinical-data-mono text-metadata-micro px-1 rounded bg-surface-container-highest text-on-surface font-semibold">
                    ICD-10 N18.6
                  </span>
                </div>
                <div className="p-space-xs bg-surface-container rounded flex items-center justify-between">
                  <span className="font-clinical-data text-clinical-data text-on-surface">Type 2 Diabetes with Diabetic Nephropathy</span>
                  <span className="font-clinical-data-mono text-metadata-micro px-1 rounded bg-surface-container-highest text-on-surface font-semibold">
                    ICD-10 E11.21
                  </span>
                </div>
              </div>
            </div>
            {/* Primary Clinical Indication with left accent line */}
            <div className="p-space-sm rounded bg-surface-container-low flex flex-col gap-space-xs shadow-inner border-l-2 border-primary">
              <div className="flex items-center gap-space-xs text-primary font-body-strong text-clinical-data">
                <span className="material-symbols-outlined text-base">clinical_notes</span>
                <span>Clinical Indication for Tertiary Referral</span>
              </div>
              <p className="font-body-default text-clinical-data text-on-surface leading-relaxed">
                End-Stage Renal Disease (ESRD) secondary to Diabetic Nephropathy presenting with severe hypervolemic fluid overload, refractory hyperkalemia (
                <span className="font-clinical-data-mono font-bold text-error">K+ 6.2 mEq/L</span>), and acute left radiocephalic arteriovenous fistula thrombotic occlusion. Requires emergent tertiary vascular surgery / interventional access revision not available locally on short notice.
              </p>
            </div>
          </div>

          {/* Clinical Findings & Urgent Laboratory Flow */}
          <div className="bg-surface-container-lowest p-panel-padding rounded-lg shadow-sm flex flex-col gap-space-sm border border-outline-variant/20">
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-tertiary text-base">vital_signs</span>
                <span className="font-section-title text-subheading text-on-surface">Biomarkers &amp; Bedside Findings</span>
              </div>
              <span className="font-clinical-data-mono text-metadata-micro text-outline">Sample: 13:30 IST</span>
            </div>
            <div className="grid grid-cols-2 gap-space-xs">
              <div className="p-space-xs rounded bg-surface-container-low flex flex-col">
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">Serum Creatinine</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-clinical-data-mono text-subheading font-bold text-error">5.8</span>
                  <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">mg/dL</span>
                </div>
                <span className="font-metadata-micro text-[10px] text-error">Baseline: 3.4 mg/dL</span>
              </div>
              <div className="p-space-xs rounded bg-surface-container-low flex flex-col">
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">Blood Urea Nitrogen</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-clinical-data-mono text-subheading font-bold text-error">142</span>
                  <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">mg/dL</span>
                </div>
                <span className="font-metadata-micro text-[10px] text-error">Azotemic surge</span>
              </div>
              <div className="p-space-xs rounded bg-surface-container-low flex flex-col">
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">Serum Potassium (K+)</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-clinical-data-mono text-subheading font-bold text-error">6.2</span>
                  <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">mEq/L</span>
                </div>
                <span className="font-metadata-micro text-[10px] text-error">Peaked T-waves on ECG</span>
              </div>
              <div className="p-space-xs rounded bg-surface-container-low flex flex-col">
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">Heart Rate / Rhythm</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-clinical-data-mono text-subheading font-bold text-on-surface">82</span>
                  <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">BPM</span>
                </div>
                <span className="font-metadata-micro text-[10px] text-on-surface-variant">Normal Sinus + Tall T</span>
              </div>
            </div>
            {/* Pre-Transfer Interventions Done */}
            <div className="mt-space-xs flex flex-col gap-1.5">
              <span className="font-metadata-micro text-metadata-micro text-outline uppercase font-semibold">
                Pre-Transfer Interventions Executed
              </span>
              <div className="flex items-start gap-space-xs p-space-xs rounded bg-surface-container">
                <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                <div className="flex flex-col">
                  <span className="font-body-strong text-clinical-data text-on-surface">10% Calcium Gluconate (10 mL IV push)</span>
                  <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    Administered at 13:50 IST for myocardial membrane stabilization
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-space-xs p-space-xs rounded bg-surface-container">
                <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                <div className="flex flex-col">
                  <span className="font-body-strong text-clinical-data text-on-surface">Insulin-Dextrose Polarizing Solution</span>
                  <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    10 units Regular Human Actrapid in 50ml 25% Dextrose completed 14:10 IST
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-space-xs p-space-xs rounded bg-surface-container">
                <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                <div className="flex flex-col">
                  <span className="font-body-strong text-clinical-data text-on-surface">Salbutamol 5mg Nebulization</span>
                  <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    Given at 14:15 IST · Supplemental cellular potassium drive
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Receiving Facility & Inter-Hospital Logistics (col-span-5) */}
        <div className="xl:col-span-5 flex flex-col gap-space-md">
          {/* Target Facility & Receiving Team */}
          <div className="bg-surface-container-lowest p-panel-padding rounded-lg shadow-sm flex flex-col gap-space-sm border border-outline-variant/20">
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-base">domain_verification</span>
                <span className="font-section-title text-subheading text-on-surface">Destination &amp; Inpatient Acceptance</span>
              </div>
              <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded bg-primary text-on-primary font-clinical-data-mono text-metadata-micro font-semibold">
                BED RESERVED
              </span>
            </div>
            {/* Target Institution Spotlight */}
            <div className="bg-surface-container p-space-sm rounded flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-metadata-micro text-metadata-micro text-outline uppercase font-semibold">Receiving Tertiary Hub</span>
                <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">ABDM HFR ID: IN-DL-0010</span>
              </div>
              <span className="font-body-strong text-body-strong text-on-surface">All India Institute of Medical Sciences (AIIMS)</span>
              <span className="font-clinical-data text-clinical-data text-on-surface-variant">
                Ansari Nagar, New Delhi · Dept. of Nephrology &amp; Renal Transplant Surgery
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-xs">
              <div className="p-space-sm bg-surface-container-low rounded flex flex-col">
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">Designated Receiving Attending</span>
                <span className="font-body-strong text-clinical-data text-on-surface mt-0.5">Dr. Arvind Saxena, DM</span>
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">Senior Interventional Nephrologist</span>
              </div>
              <div className="p-space-sm bg-surface-container-low rounded flex flex-col">
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">Liaison Phone &amp; Extension</span>
                <span className="font-clinical-data-mono text-clinical-data font-semibold text-primary mt-0.5">+91 11 2659 4821</span>
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">Dialysis Control Desk Ext 402</span>
              </div>
            </div>
            {/* Bed Allocation Box */}
            <div className="p-space-sm bg-surface-container-high rounded flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-primary text-xl">single_bed</span>
                <div className="flex flex-col">
                  <span className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase">Ward &amp; Bed Allocation</span>
                  <span className="font-body-strong text-clinical-data text-on-surface font-semibold">
                    Bed HDU-08 · Dialysis Acute Care Unit
                  </span>
                </div>
              </div>
              <span className="px-space-sm py-1 rounded bg-surface-container-lowest text-primary font-clinical-data-mono text-metadata-micro font-bold shadow-sm">
                PREPARED &amp; CLEARED
              </span>
            </div>
            {/* Official Referral Query & Order to Receiving Staff */}
            <div className="flex flex-col gap-space-xs p-space-sm bg-surface-container-low rounded">
              <div className="flex items-center gap-space-xs text-on-surface font-body-strong text-clinical-data">
                <span className="material-symbols-outlined text-base text-primary">priority_high</span>
                <span>Requested Procedure &amp; Clinical Directive</span>
              </div>
              <blockquote className="font-body-default text-clinical-data text-on-surface italic pl-space-xs border-l-2 border-primary/40">
                &ldquo;Kindly accept patient for emergent ultrasound-guided left brachiocephalic fistula thrombectomy / catheter-directed angioplasty, and simultaneously initiate an urgent 4-hour hemodialysis via temporary right internal jugular line. Baseline labs, viral serology, non-contrast ECG, and full contrast allergy clearance attached.&rdquo;
              </blockquote>
            </div>
          </div>

          {/* Live Transport & Paramedic Logistics */}
          <div className="bg-surface-container-lowest p-panel-padding rounded-lg shadow-sm flex flex-col gap-space-sm border border-outline-variant/20">
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-base">ambulance</span>
                <span className="font-section-title text-subheading text-on-surface">Emergency Transit Telemetry</span>
              </div>
              <span className="px-space-xs py-0.5 rounded bg-surface-container-high font-clinical-data-mono text-metadata-micro text-on-surface">
                ALS Fleet #DL-1T-4819
              </span>
            </div>
            {/* Map & Route Visual Integration */}
            <div
              className="w-full h-44 rounded bg-cover bg-center relative overflow-hidden shadow-inner flex flex-col justify-between p-space-sm border border-outline-variant/20"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCD2dRDSWApU5jDIk6s3WRJmTVz7oSTHGdQc6XYcjei0qJmmuErsb5Nphlw4-4YqeOgF4uQAJlbbtIQxu898kFcCq0SFbAENAEZKtKS7L_eGtokrvyBYZMtT3ykSRXA4-QtyDD4xd9CcNxvLIIqYcoa1MQnR08BQ956VuqZu9EN4j7OZ95GFhJ0gRrHvdlPH7NPg7z57qrgz06VGWLS8aomqDNT58RE_9szmPd-M-whWe2GdkwzkNts')",
              }}
            >
              <div className="flex items-center justify-between">
                <span className="px-space-xs py-1 rounded bg-surface-container-lowest/90 backdrop-blur font-clinical-data-mono text-metadata-micro font-semibold text-primary shadow-sm">
                  LIVE GPS: Outer Ring Road · 42 km/h
                </span>
                <span className="px-space-xs py-1 rounded bg-surface-container-lowest/90 backdrop-blur font-clinical-data-mono text-metadata-micro font-bold text-error shadow-sm">
                  ALS ACTIVE
                </span>
              </div>
              <div className="bg-surface-container-lowest/95 backdrop-blur p-space-xs rounded shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="h-2 w-2 rounded-full bg-primary animate-ping"></span>
                  <span className="font-clinical-data text-metadata-micro font-semibold text-on-surface">
                    Apollo Central → AIIMS Trauma / Nephro
                  </span>
                </div>
                <span className="font-clinical-data-mono text-metadata-micro text-primary font-bold">
                  14.2 km · 28 mins
                </span>
              </div>
            </div>
            {/* Transport Specifications Matrix */}
            <div className="space-y-1 mt-space-xs">
              <div className="p-space-xs bg-surface-container-low rounded flex items-center justify-between">
                <span className="font-clinical-data text-metadata-micro text-on-surface-variant">Onboard Support Equipment</span>
                <span className="font-body-strong text-clinical-data text-on-surface">Zoll R-Series Defib + Transport HDF Cart</span>
              </div>
              <div className="p-space-xs bg-surface-container-low rounded flex items-center justify-between">
                <span className="font-clinical-data text-metadata-micro text-on-surface-variant">Assigned Escort Clinician</span>
                <span className="font-body-strong text-clinical-data text-on-surface">Nurse Rajesh M. (ICU/Dialysis RN)</span>
              </div>
              <div className="p-space-xs bg-surface-container-low rounded flex items-center justify-between">
                <span className="font-clinical-data text-metadata-micro text-on-surface-variant">Accompanying Kin</span>
                <span className="font-body-strong text-clinical-data text-on-surface">Suresh Chandra (Son · +91 98112 04812)</span>
              </div>
              <div className="p-space-xs bg-surface-container-low rounded flex items-center justify-between">
                <span className="font-clinical-data text-metadata-micro text-on-surface-variant">Scheduled Bay Departure</span>
                <span className="font-clinical-data-mono text-clinical-data font-semibold text-primary">15:45 IST (ETA 16:15 IST)</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Clinical Provenance, Safety Checklist & State Audit (col-span-3) */}
        <div className="xl:col-span-3 flex flex-col gap-space-md">
          {/* ABDM National Integration & Cryptography Card */}
          <div className="bg-surface-container-lowest p-panel-padding rounded-lg shadow-sm flex flex-col gap-space-sm border border-outline-variant/20">
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-base">cloud_done</span>
                <span className="font-section-title text-subheading text-on-surface">FHIR / ABDM Token</span>
              </div>
              <span className="px-space-xs py-0.5 rounded bg-primary-fixed text-on-primary-fixed-variant font-clinical-data-mono text-metadata-micro font-semibold">
                R4 Compliant
              </span>
            </div>
            <div className="bg-surface-container-low p-space-sm rounded flex flex-col gap-1">
              <span className="font-metadata-micro text-metadata-micro text-outline uppercase font-semibold">FHIR Resource Bundle</span>
              <span className="font-clinical-data-mono text-clinical-data font-semibold text-on-surface">CareConnect-ReferralRequest</span>
              <div className="flex items-center justify-between text-metadata-micro text-on-surface-variant font-clinical-data-mono mt-1">
                <span>Hash: #c47a...991e</span>
                <button
                  onClick={() => {
                    setIsHashVerified(true);
                    showToast("SHA-256 Bundle hash cryptographically verified with ABDM Registry.");
                  }}
                  className="text-primary cursor-pointer hover:underline font-semibold"
                >
                  {isHashVerified ? "✓ Verified" : "Verify"}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between p-space-xs bg-surface-container rounded text-metadata-micro">
              <span className="font-clinical-data text-on-surface">Consent Artifact Key:</span>
              <span className="font-clinical-data-mono text-primary font-semibold">CON-DEL-9810-72</span>
            </div>
          </div>

          {/* Pre-Transfer Safety Signoff Checklist */}
          <div className="bg-surface-container-lowest p-panel-padding rounded-lg shadow-sm flex flex-col gap-space-sm border border-outline-variant/20">
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-base">fact_check</span>
                <span className="font-section-title text-subheading text-on-surface">Transfer Checklist</span>
              </div>
              <span className="font-clinical-data-mono text-metadata-micro text-primary font-bold">
                {verifiedCount} / 5 VERIFIED
              </span>
            </div>
            {/* Checklist Rows with checked state */}
            <div className="flex flex-col gap-space-xs">
              <label
                onClick={() => toggleChecklist(0)}
                className="flex items-start gap-space-xs p-space-xs rounded bg-surface-container-low cursor-pointer hover:bg-surface-container transition-colors select-none"
              >
                <span
                  className={`material-symbols-outlined text-base ${
                    checklist[0] ? "text-primary" : "text-outline"
                  }`}
                >
                  {checklist[0] ? "check_box" : "check_box_outline_blank"}
                </span>
                <span className="font-clinical-data text-clinical-data text-on-surface leading-snug">
                  Patient &amp; Attendant Biometric Consent Authenticated
                </span>
              </label>
              <label
                onClick={() => toggleChecklist(1)}
                className="flex items-start gap-space-xs p-space-xs rounded bg-surface-container-low cursor-pointer hover:bg-surface-container transition-colors select-none"
              >
                <span
                  className={`material-symbols-outlined text-base ${
                    checklist[1] ? "text-primary" : "text-outline"
                  }`}
                >
                  {checklist[1] ? "check_box" : "check_box_outline_blank"}
                </span>
                <span className="font-clinical-data text-clinical-data text-on-surface leading-snug">
                  DICOM PACS Token &amp; Physical Imaging Discs Handed to Escort RN
                </span>
              </label>
              <label
                onClick={() => toggleChecklist(2)}
                className="flex items-start gap-space-xs p-space-xs rounded bg-surface-container-low cursor-pointer hover:bg-surface-container transition-colors select-none"
              >
                <span
                  className={`material-symbols-outlined text-base ${
                    checklist[2] ? "text-primary" : "text-outline"
                  }`}
                >
                  {checklist[2] ? "check_box" : "check_box_outline_blank"}
                </span>
                <span className="font-clinical-data text-clinical-data text-on-surface leading-snug">
                  Patient Stabilized for Transit (Airway &amp; Hemodynamics Monitored)
                </span>
              </label>
              <label
                onClick={() => toggleChecklist(3)}
                className="flex items-start gap-space-xs p-space-xs rounded bg-surface-container-low cursor-pointer hover:bg-surface-container transition-colors select-none"
              >
                <span
                  className={`material-symbols-outlined text-base ${
                    checklist[3] ? "text-primary" : "text-outline"
                  }`}
                >
                  {checklist[3] ? "check_box" : "check_box_outline_blank"}
                </span>
                <span className="font-clinical-data text-clinical-data text-on-surface leading-snug">
                  Two Wide-Bore Peripheral IV Lines Patent (18G Right Forearm)
                </span>
              </label>
              <label
                onClick={() => toggleChecklist(4)}
                className="flex items-start gap-space-xs p-space-xs rounded bg-surface-container-low cursor-pointer hover:bg-surface-container transition-colors select-none"
              >
                <span
                  className={`material-symbols-outlined text-base ${
                    checklist[4] ? "text-primary" : "text-outline"
                  }`}
                >
                  {checklist[4] ? "check_box" : "check_box_outline_blank"}
                </span>
                <span className="font-clinical-data text-clinical-data text-on-surface leading-snug">
                  Portable O2 Cylinder (10L) Full &amp; Regulator Checked
                </span>
              </label>
            </div>
          </div>

          {/* Longitudinal Referral State Audit Timeline */}
          <div className="bg-surface-container-lowest p-panel-padding rounded-lg shadow-sm flex flex-col gap-space-sm flex-1 border border-outline-variant/20">
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-outline text-base">history_toggle_off</span>
                <span className="font-section-title text-subheading text-on-surface">Lifecycle Audit Log</span>
              </div>
              <span className="font-clinical-data-mono text-metadata-micro text-outline">IST (UTC+5:30)</span>
            </div>
            {/* Vertical Timeline Nodes */}
            <div className="relative pl-space-lg flex flex-col gap-space-md mt-space-xs">
              {/* Continuous line */}
              <div className="absolute left-2 top-1.5 bottom-2 w-0.5 bg-surface-container-highest"></div>
              {/* Step 1 */}
              <div className="relative flex flex-col">
                <div className="absolute -left-space-lg top-1 h-3.5 w-3.5 rounded-full bg-primary flex items-center justify-center ring-4 ring-surface-container-lowest"></div>
                <div className="flex items-center justify-between">
                  <span className="font-body-strong text-clinical-data text-on-surface">Referral Initiated</span>
                  <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">13:40</span>
                </div>
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                  Dr. Sameer Kulkarni (Apollo Nephrology Unit)
                </span>
              </div>
              {/* Step 2 */}
              <div className="relative flex flex-col">
                <div className="absolute -left-space-lg top-1 h-3.5 w-3.5 rounded-full bg-primary flex items-center justify-center ring-4 ring-surface-container-lowest"></div>
                <div className="flex items-center justify-between">
                  <span className="font-body-strong text-clinical-data text-on-surface">ABDM Bundle Dispatched</span>
                  <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">14:05</span>
                </div>
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                  Transmitted to AIIMS Central Intake Bridge
                </span>
              </div>
              {/* Step 3 */}
              <div className="relative flex flex-col">
                <div className="absolute -left-space-lg top-1 h-3.5 w-3.5 rounded-full bg-primary flex items-center justify-center ring-4 ring-surface-container-lowest"></div>
                <div className="flex items-center justify-between">
                  <span className="font-body-strong text-clinical-data text-on-surface">Consultant Transfer Acceptance</span>
                  <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">14:25</span>
                </div>
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                  Formally accepted by Dr. Arvind Saxena
                </span>
              </div>
              {/* Step 4 */}
              <div className="relative flex flex-col">
                <div className="absolute -left-space-lg top-1 h-3.5 w-3.5 rounded-full bg-primary flex items-center justify-center ring-4 ring-surface-container-lowest"></div>
                <div className="flex items-center justify-between">
                  <span className="font-body-strong text-clinical-data text-on-surface">Bed Assigned &amp; Scrubbed</span>
                  <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">14:40</span>
                </div>
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                  AIIMS Dialysis HDU-08 Verified Ready
                </span>
              </div>
              {/* Step 5 (In-Progress) */}
              <div className="relative flex flex-col">
                <div className="absolute -left-space-lg top-1 h-3.5 w-3.5 rounded-full bg-primary-fixed flex items-center justify-center ring-4 ring-surface-container-lowest animate-pulse">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-body-strong text-clinical-data text-primary">Pre-Departure Signoff</span>
                  <span className="font-clinical-data-mono text-metadata-micro text-primary font-bold">CURRENT</span>
                </div>
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                  Bedside vitals verification and stretcher dispatch
                </span>
              </div>
            </div>
            {/* Footer Sign-off Action Bar in audit pane */}
            <div className="mt-space-sm pt-space-xs bg-surface-container-low p-space-xs rounded flex items-center justify-between">
              <div className="flex items-center gap-1 text-metadata-micro font-clinical-data text-on-surface-variant">
                <span className="material-symbols-outlined text-xs text-primary">lock</span>
                <span>Audit Trail Immutable</span>
              </div>
              <span className="font-clinical-data-mono text-metadata-micro text-outline">Node #8912-DL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fast-Action Telemetry Footer Strip */}
      <div className="flex flex-wrap items-center justify-between gap-space-sm p-space-sm bg-surface-container-lowest rounded-lg shadow-sm border border-outline-variant/20">
        <div className="flex items-center gap-space-md flex-wrap">
          <button
            onClick={() => {
              setIsAudioLinkActive(!isAudioLinkActive);
              showToast(
                !isAudioLinkActive
                  ? "Direct Audio Link connected to AIIMS Emergency Triage Desk."
                  : "Audio Link muted."
              );
            }}
            className="inline-flex items-center gap-1 font-clinical-data text-metadata-micro text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isAudioLinkActive ? "bg-primary animate-ping" : "bg-outline"
              }`}
            ></span>
            <span>
              Direct Audio Link {isAudioLinkActive ? "Active" : "Muted"}: AIIMS Emergency Triage Desk (Channel 04)
            </span>
          </button>
          <span className="inline-flex items-center gap-1 font-clinical-data-mono text-metadata-micro text-outline">
            Ambulance Battery: 98% · O2 Reserve: 2200 PSI
          </span>
        </div>
        <div className="flex items-center gap-space-xs">
          <button
            onClick={() => setIsAbortModalOpen(true)}
            className="px-space-sm py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-clinical-data text-clinical-data transition-colors"
          >
            Cancel / Abort Transfer
          </button>
          <button
            onClick={() => setIsDispatchModalOpen(true)}
            className="px-space-md py-1.5 rounded bg-primary hover:bg-primary-container text-on-primary font-body-strong text-clinical-data transition-colors shadow-sm"
          >
            Dispatch Ambulance &amp; Handover
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: DOWNLOAD DOSSIER MODAL */}
      {/* ========================================================================= */}
      {isDossierModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-lg w-full overflow-hidden">
            <div className="px-5 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">picture_as_pdf</span>
                <h3 className="font-body-strong text-body-strong text-on-surface">Download Referral Package</h3>
              </div>
              <button onClick={() => setIsDossierModalOpen(false)} className="text-outline hover:text-on-surface p-1 rounded">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="p-5 flex flex-col gap-3 font-clinical-data text-clinical-data">
              <p className="text-on-surface-variant">
                Full inter-hospital referral dossier bundle containing clinical summary, emergency dialysis orders, 12-lead ECG, blood gas analysis, and DICOM access tokens.
              </p>
              <div className="p-3 bg-surface-container-low rounded-lg flex flex-col gap-1.5 font-clinical-data-mono text-metadata-micro">
                <div className="flex justify-between">
                  <span className="text-outline">File:</span>
                  <span className="text-on-surface font-bold">HarishChandra_AIIMS_Referral_Package.pdf</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Size:</span>
                  <span className="text-on-surface">6.8 MB (with high-res DICOM key)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Authentication:</span>
                  <span className="text-primary font-semibold">Dr. Sameer Kulkarni (MCI-DL-29481)</span>
                </div>
              </div>
            </div>
            <div className="px-5 py-3 bg-surface-container-low border-t border-surface-container flex items-center justify-end gap-2">
              <button
                onClick={() => setIsDossierModalOpen(false)}
                className="px-4 py-1.5 text-on-surface-variant hover:text-on-surface font-body-strong text-clinical-data"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setIsDossierModalOpen(false);
                  showToast("Referral dossier package downloaded successfully.");
                }}
                className="px-4 py-1.5 bg-primary text-on-primary font-body-strong text-clinical-data rounded-lg shadow-sm hover:bg-primary/90"
              >
                Download PDF Archive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: PUSH VIA ABDM MODAL */}
      {/* ========================================================================= */}
      {isAbdmModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-lg w-full overflow-hidden">
            <div className="px-5 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-xl">cell_tower</span>
                <h3 className="font-body-strong text-body-strong text-on-surface">ABDM National Health Network Dispatch</h3>
              </div>
              <button onClick={() => setIsAbdmModalOpen(false)} className="text-outline hover:text-on-surface p-1 rounded">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="p-5 flex flex-col gap-3 font-clinical-data text-clinical-data">
              <p className="text-on-surface-variant">
                Pushing digital encounter bundle to ABDM Health Facility Registry ID: <strong>IN-DL-0010 (AIIMS New Delhi)</strong>.
              </p>
              <div className="p-3 bg-surface-container-low rounded-lg flex flex-col gap-1.5 font-clinical-data-mono text-metadata-micro">
                <div className="flex justify-between">
                  <span className="text-outline">Patient ABHA:</span>
                  <span className="text-primary font-bold">91-4920-8812-3012</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Bridge Service:</span>
                  <span>National Health Authority Gateway M2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Consent Pin:</span>
                  <span className="text-on-surface font-semibold">CON-DEL-9810-72 (Verified)</span>
                </div>
              </div>
            </div>
            <div className="px-5 py-3 bg-surface-container-low border-t border-surface-container flex items-center justify-end gap-2">
              <button
                onClick={() => setIsAbdmModalOpen(false)}
                className="px-4 py-1.5 text-on-surface-variant hover:text-on-surface font-body-strong text-clinical-data"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsAbdmModalOpen(false);
                  showToast("FHIR R4 bundle published to AIIMS Intake Bridge. Token ack received.");
                }}
                className="px-4 py-1.5 bg-primary text-on-primary font-body-strong text-clinical-data rounded-lg shadow-sm hover:bg-primary/90"
              >
                Transmit to AIIMS Bridge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: TRACK ALS AMBULANCE MODAL */}
      {/* ========================================================================= */}
      {isAmbulanceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-xl w-full overflow-hidden">
            <div className="px-5 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">local_shipping</span>
                <h3 className="font-body-strong text-body-strong text-on-surface">
                  ALS Ambulance Fleet #DL-1T-4819 Telemetry
                </h3>
              </div>
              <button onClick={() => setIsAmbulanceModalOpen(false)} className="text-outline hover:text-on-surface p-1 rounded">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4 font-clinical-data text-clinical-data">
              <div className="p-3 bg-surface-container-low rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-body-strong text-on-surface">Vehicle Status: Staged at Resuscitation Bay 02</div>
                  <div className="text-metadata-micro text-outline">Driver: Ramesh Sharma (+91 98110-44120) · Paramedic: J. Paul</div>
                </div>
                <span className="px-2.5 py-0.5 bg-primary-fixed text-on-primary-fixed-variant rounded text-metadata-micro font-bold">
                  READY FOR BOARDING
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-metadata-micro font-clinical-data-mono">
                <div className="p-2.5 bg-surface-container-low rounded">
                  <div className="text-outline">Oxygen Pressure</div>
                  <div className="text-section-title font-bold text-primary">2200 PSI</div>
                </div>
                <div className="p-2.5 bg-surface-container-low rounded">
                  <div className="text-outline">Defibrillator</div>
                  <div className="text-section-title font-bold text-primary">Zoll R 100%</div>
                </div>
                <div className="p-2.5 bg-surface-container-low rounded">
                  <div className="text-outline">Estimated Transit</div>
                  <div className="text-section-title font-bold text-primary">28 min</div>
                </div>
              </div>
            </div>
            <div className="px-5 py-3 bg-surface-container-low border-t border-surface-container flex items-center justify-end">
              <button
                onClick={() => setIsAmbulanceModalOpen(false)}
                className="px-4 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface font-body-strong text-clinical-data rounded-lg"
              >
                Close Telemetry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: PRINT QR MODAL */}
      {/* ========================================================================= */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-md w-full overflow-hidden text-center p-6">
            <div className="w-12 h-12 rounded-full bg-primary-container/20 text-primary flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-2xl">qr_code_2</span>
            </div>
            <h3 className="font-section-title text-section-title font-bold text-on-surface">Bedside Handover QR Pass</h3>
            <p className="text-clinical-data text-on-surface-variant mt-1">
              Cryptographically signed QR token for escort nurse and ambulance paramedic handover at AIIMS Dialysis Unit.
            </p>
            <div className="my-5 p-4 bg-surface-container-low rounded-xl border border-outline-variant/30 flex flex-col items-center gap-2">
              <div className="w-32 h-32 bg-surface-container-lowest rounded-lg p-2 border border-outline-variant flex items-center justify-center">
                <span className="material-symbols-outlined text-7xl text-on-surface">qr_code</span>
              </div>
              <span className="font-clinical-data-mono text-metadata-micro text-outline">
                TOKEN: #{refId}-AIIMS-TRANSIT
              </span>
              <span className="text-metadata-micro text-primary font-semibold">
                Valid for Paramedic Stretcher &amp; AIIMS Reception Gate 4
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="flex-1 h-9 bg-surface-container hover:bg-surface-container-high text-on-surface font-body-strong text-clinical-data rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setIsQrModalOpen(false);
                  if (typeof window !== "undefined") {
                    window.print();
                  }
                }}
                className="flex-1 h-9 bg-primary-container hover:bg-primary text-on-primary font-body-strong text-clinical-data rounded-lg shadow-sm"
              >
                Print Handover Slip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: CLINICAL HAND-OFF SIGN-OFF MODAL */}
      {/* ========================================================================= */}
      {isSignOffModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-lg w-full overflow-hidden">
            <div className="px-5 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">verified_user</span>
                <h3 className="font-body-strong text-body-strong text-on-surface">Physician Hand-off Sign-Off</h3>
              </div>
              <button onClick={() => setIsSignOffModalOpen(false)} className="text-outline hover:text-on-surface p-1 rounded">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="p-5 flex flex-col gap-3 font-clinical-data text-clinical-data">
              <p className="text-on-surface-variant">
                I, <strong>Dr. Sameer Kulkarni</strong> (Reg: MCI-DL-29481), confirm that the patient Harish Chandra has been clinically stabilized with potassium-shifting pharmacotherapy, informed consent obtained from kin Suresh Chandra, and receiving acceptance verified with AIIMS Nephrology.
              </p>
              <div className="p-3 bg-primary-container/10 border border-primary/20 rounded text-metadata-micro text-primary">
                Digital Signature Token: <strong>#SIG-2024-KULKARNI-NEPHRO-8912</strong>
              </div>
            </div>
            <div className="px-5 py-3 bg-surface-container-low border-t border-surface-container flex items-center justify-end gap-2">
              <button
                onClick={() => setIsSignOffModalOpen(false)}
                className="px-4 py-1.5 text-on-surface-variant hover:text-on-surface font-body-strong text-clinical-data"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsSignOffModalOpen(false);
                  showToast("Clinical Hand-off signed and logged to immutable audit ledger.");
                }}
                className="px-4 py-1.5 bg-primary text-on-primary font-body-strong text-clinical-data rounded-lg shadow-sm hover:bg-primary/90"
              >
                Sign &amp; Authenticate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: ABORT TRANSFER CONFIRMATION */}
      {/* ========================================================================= */}
      {isAbortModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-md w-full overflow-hidden p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-error-container text-error flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-2xl">warning</span>
            </div>
            <h3 className="font-section-title text-section-title font-bold text-on-surface">Abort Tertiary Referral?</h3>
            <p className="text-clinical-data text-on-surface-variant mt-1">
              Cancelling will stand down Ambulance ALS-03 and notify AIIMS Dialysis Desk that the transfer is halted.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <button
                onClick={() => setIsAbortModalOpen(false)}
                className="flex-1 h-9 bg-surface-container hover:bg-surface-container-high text-on-surface font-body-strong text-clinical-data rounded-lg"
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  setIsAbortModalOpen(false);
                  showToast("Transfer stood down. Ambulance fleet and AIIMS desk notified.");
                }}
                className="flex-1 h-9 bg-error hover:bg-error/90 text-on-error font-body-strong text-clinical-data rounded-lg shadow-sm"
              >
                Confirm Abort
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 7: DISPATCH AMBULANCE & HANDOVER */}
      {/* ========================================================================= */}
      {isDispatchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-md w-full overflow-hidden p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-2xl">local_shipping</span>
            </div>
            <h3 className="font-section-title text-section-title font-bold text-on-surface">Dispatch Ambulance ALS-03?</h3>
            <p className="text-clinical-data text-on-surface-variant mt-1">
              Begin active transit to AIIMS New Delhi. Telemetry stream will switch to cellular satellite bridge.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <button
                onClick={() => setIsDispatchModalOpen(false)}
                className="flex-1 h-9 bg-surface-container hover:bg-surface-container-high text-on-surface font-body-strong text-clinical-data rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsDispatchModalOpen(false);
                  showToast("Ambulance ALS-03 dispatched! Live GPS tracking active on Outer Ring Road.");
                }}
                className="flex-1 h-9 bg-primary hover:bg-primary/90 text-on-primary font-body-strong text-clinical-data rounded-lg shadow-sm"
              >
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
