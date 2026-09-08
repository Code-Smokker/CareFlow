/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";

interface LabItem {
  id: string;
  section: string;
  name: string;
  loinc: string;
  value: string;
  valueBadge?: string;
  valueBadgeColor?: "error" | "secondary" | "primary" | "surface";
  reference: string;
  specimen: string;
  collectedTime: string;
  statusBadge: string;
  statusBadgeColor: "error" | "secondary" | "primary" | "surface";
  trendNote?: string;
  isInFlight?: boolean;
}

const ALL_INVESTIGATIONS: LabItem[] = [
  // SECTION I: STAT CARDIAC
  {
    id: "ctni",
    section: "cardiac",
    name: "hs-cTnI (Cardiac Troponin I)",
    loinc: "LOINC: 89579-7 · High Sensitivity",
    value: "IN-FLIGHT RUNNING (ETA ~14:50)",
    isInFlight: true,
    reference: "< 0.04 ng/mL (< 14 ng/L)",
    specimen: "Venous Li-Heparin (Siemens Atellica IM)",
    collectedTime: "Today 14:20 IST",
    statusBadge: "IN ANALYZER · STAT",
    statusBadgeColor: "error",
  },
  {
    id: "ecg-stat",
    section: "cardiac",
    name: "Bedside 12-Lead Telemetry ECG",
    loinc: "DICOM-ECG Waveform Stream",
    value: "+3.2mm ST-Elevation (V2-V4)",
    valueBadge: "STAT CRITICAL ALERT",
    valueBadgeColor: "error",
    reference: "Isoelectric (<1.0mm)",
    specimen: "Bedside Monitor (Bay 02)",
    collectedTime: "Today 14:25 IST",
    statusBadge: "STAT CRITICAL ALERT",
    statusBadgeColor: "error",
  },
  {
    id: "echo-pocus",
    section: "cardiac",
    name: "Bedside POCUS Focused Echo",
    loinc: "LOINC: 18044-8 · Transthoracic",
    value: "Anterior Wall Hypokinesis, LVEF ~42%",
    reference: "LVEF > 55% · Normal wall motion",
    specimen: "Handheld Philips Lumify",
    collectedTime: "Today 14:28 IST",
    statusBadge: "COMPLETED",
    statusBadgeColor: "primary",
  },

  // SECTION II: GLYCEMIC & METABOLIC
  {
    id: "hba1c",
    section: "glycemic",
    name: "HbA1c (Glycated Hemoglobin)",
    loinc: "LOINC: 4548-4 · Ion-Exchange HPLC",
    value: "7.8 %",
    valueBadge: "HIGH",
    valueBadgeColor: "error",
    reference: "< 5.7% (Normal), < 6.5% (Goal)",
    specimen: "EDTA Whole Blood (HPLC)",
    collectedTime: "04-Jul-2026 (Apollo Core)",
    statusBadge: "+0.3% vs 2025",
    statusBadgeColor: "error",
    trendNote: "+0.3% vs 2025",
  },
  {
    id: "fpg",
    section: "glycemic",
    name: "Fasting Plasma Glucose",
    loinc: "LOINC: 1558-6 · Hexokinase Enzymatic",
    value: "162 mg/dL",
    valueBadge: "HIGH",
    valueBadgeColor: "error",
    reference: "70 - 99 mg/dL",
    specimen: "Fluoride Plasma",
    collectedTime: "04-Jul-2026",
    statusBadge: "Verified",
    statusBadgeColor: "surface",
  },

  // SECTION III: LIPIDS
  {
    id: "ldl",
    section: "lipid",
    name: "Serum LDL Cholesterol (Direct Assay)",
    loinc: "LOINC: 18262-6 · Homogeneous Enzymatic",
    value: "152 mg/dL",
    valueBadge: "HIGH RISK",
    valueBadgeColor: "error",
    reference: "< 100 mg/dL (<55 in CAD)",
    specimen: "Serum Gel Clot Activator",
    collectedTime: "04-Jul-2026",
    statusBadge: "AHA Statin Indicated",
    statusBadgeColor: "error",
  },
  {
    id: "tg",
    section: "lipid",
    name: "Serum Triglycerides",
    loinc: "LOINC: 2571-8 · GPO-POD Enzymatic",
    value: "190 mg/dL",
    valueBadge: "BORDERLINE",
    valueBadgeColor: "secondary",
    reference: "< 150 mg/dL",
    specimen: "Serum Separator Clot",
    collectedTime: "04-Jul-2026",
    statusBadge: "Verified",
    statusBadgeColor: "surface",
  },
  {
    id: "tc",
    section: "lipid",
    name: "Total Cholesterol",
    loinc: "LOINC: 2093-3 · CHOD-PAP",
    value: "224 mg/dL",
    valueBadge: "HIGH",
    valueBadgeColor: "error",
    reference: "< 200 mg/dL",
    specimen: "Serum Separator Clot",
    collectedTime: "04-Jul-2026",
    statusBadge: "Verified",
    statusBadgeColor: "surface",
  },

  // SECTION IV: RENAL & CONTRAST
  {
    id: "cr",
    section: "renal",
    name: "Serum Creatinine",
    loinc: "LOINC: 2160-0 · IDMS Traceable Enzymatic",
    value: "0.9 mg/dL",
    reference: "0.70 - 1.20 mg/dL",
    specimen: "Serum Clot Tube",
    collectedTime: "18-May-2026 (Baseline)",
    statusBadge: "NORMAL",
    statusBadgeColor: "primary",
  },
  {
    id: "egfr",
    section: "renal",
    name: "Estimated GFR (CKD-EPI 2021)",
    loinc: "LOINC: 98979-8 · Non-Indexed",
    value: "98 mL/min/1.73m²",
    reference: "> 60 mL/min/1.73m²",
    specimen: "Calculated from Creatinine",
    collectedTime: "18-May-2026",
    statusBadge: "CONTRAST SAFE FOR PCI",
    statusBadgeColor: "primary",
  },

  // SECTION V: HEMATOLOGY
  {
    id: "hb",
    section: "hematology",
    name: "Hemoglobin (Hb)",
    loinc: "LOINC: 718-7 · Sysmex XN-9000",
    value: "14.2 g/dL",
    reference: "13.5 - 17.5 g/dL",
    specimen: "EDTA Whole Blood",
    collectedTime: "18-May-2026",
    statusBadge: "NORMAL",
    statusBadgeColor: "primary",
  },
  {
    id: "tlc",
    section: "hematology",
    name: "Total Leukocyte Count (TLC)",
    loinc: "LOINC: 6690-2",
    value: "8,400 /µL",
    reference: "4,000 - 11,000 /µL",
    specimen: "EDTA Whole Blood",
    collectedTime: "18-May-2026",
    statusBadge: "NORMAL",
    statusBadgeColor: "primary",
  },
  {
    id: "plt",
    section: "hematology",
    name: "Platelet Count",
    loinc: "LOINC: 777-3 · Impedance Counting",
    value: "240,000 /µL",
    reference: "150,000 - 450,000 /µL",
    specimen: "EDTA Whole Blood",
    collectedTime: "18-May-2026",
    statusBadge: "NORMAL",
    statusBadgeColor: "primary",
  },
];

export default function InvestigationsPage() {
  const [activeTab, setActiveTab] = useState<string>("cardiac");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isImageInspectOpen, setIsImageInspectOpen] = useState(false);
  const [activeImage, setActiveImage] = useState<{
    title: string;
    subtitle: string;
    badge: string;
    src: string;
  } | null>(null);

  // New Order Form state
  const [orderTestName, setOrderTestName] = useState("Serum Electrolytes (Na/K/Cl)");
  const [orderPriority, setOrderPriority] = useState("STAT Urgent");
  const [orderInstructions, setOrderInstructions] = useState("Pre-PCI baseline electrolyte check");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const filteredInvestigations = useMemo(() => {
    return ALL_INVESTIGATIONS.filter((item) => {
      if (activeTab !== "all" && item.section !== activeTab) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.loinc.toLowerCase().includes(q) ||
          item.value.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [activeTab, searchQuery]);

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOrderModalOpen(false);
    showToast(`STAT Order #${Math.floor(10000 + Math.random() * 90000)} (${orderTestName}) dispatched to LIS Core.`);
  };

  return (
    <div className="flex flex-col w-full gap-space-sm pb-space-2xl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-on-surface text-surface px-4 py-2.5 rounded-lg shadow-2xl border border-outline/30 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="material-symbols-outlined text-primary text-xl">verified</span>
          <span className="text-clinical-data font-clinical-data">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-outline hover:text-surface"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* Patient Header & Red Flag Strip Container */}
      <section className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
        {/* Active Critical Red Flag Banner */}
        <div className="bg-error px-gutter-normal py-space-xs text-on-error flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-space-sm min-w-0">
            <span className="material-symbols-outlined text-lg shrink-0">crisis_alert</span>
            <span className="font-body-strong text-clinical-data tracking-wide truncate uppercase">
              RED FLAG ALERT: SUSPECTED ACUTE ANTERIOR STEMI · PRIMARY PCI PROTOCOL ACTIVATED · CATH
              LAB TRANSFER IN PROGRESS
            </span>
          </div>
          <div className="flex items-center gap-space-md shrink-0">
            <span className="font-clinical-data-mono text-metadata-micro bg-on-error/20 px-space-xs py-0.5 rounded font-semibold tracking-wider">
              CODE STEMI ACTIVE
            </span>
            <span className="font-clinical-data-mono text-metadata-micro font-medium">
              Door-to-Balloon Timer: 00:22:14
            </span>
          </div>
        </div>

        {/* Core Patient Context Strip */}
        <div className="p-gutter-normal flex flex-wrap lg:flex-nowrap items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md min-w-0">
            <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary font-section-title text-section-title shrink-0">
              RS
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-space-sm flex-wrap">
                <h1 className="font-page-title text-page-title text-on-surface truncate">
                  Rahul Sharma
                </h1>
                <span className="font-body-strong text-clinical-data text-on-surface-variant">
                  42M · 174cm · 82kg
                </span>
                <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded bg-surface-container text-primary font-metadata-micro text-metadata-micro font-semibold">
                  <span className="material-symbols-outlined text-xs">verified</span> ABHA
                  91-8832-1002-99
                </span>
                <span className="bg-error-container text-on-error-container font-clinical-data-mono text-metadata-micro px-1.5 py-0.5 rounded font-semibold">
                  NPO · CATH PREP
                </span>
              </div>
              <div className="flex items-center gap-space-md text-metadata-micro font-metadata-micro text-on-surface-variant mt-1 flex-wrap">
                <span>
                  UHID: <strong className="font-clinical-data-mono text-on-surface">DEL-2024-8841</strong>
                </span>
                <span>
                  Token:{" "}
                  <strong className="font-clinical-data-mono text-primary font-bold">#104</strong>
                </span>
                <span>
                  Location: <strong className="text-on-surface">ER Bay 02 (Telemetry Resus)</strong>
                </span>
                <span>
                  Attending:{" "}
                  <strong className="text-on-surface">Dr. Rohit Verma (Cardiology)</strong>
                </span>
                <span className="text-error font-semibold flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-xs">warning</span> Anaphylaxis:
                  IV Penicillins
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-space-xs shrink-0 w-full lg:w-auto justify-end">
            <button
              onClick={() => showToast("Requisition forms printed for Central Pathology & Bio-Imaging.")}
              className="flex items-center gap-1.5 px-space-sm h-8 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-body-strong text-clinical-data transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">print</span> Print Requisitions
            </button>
            <button
              onClick={() => showToast("LIS synchronization: Polled Siemens Atellica IM & Core Lab (0 new items).")}
              className="flex items-center gap-1.5 px-space-sm h-8 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-body-strong text-clinical-data transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">sync</span> LIS Fetch
            </button>
            <button
              onClick={() => setIsOrderModalOpen(true)}
              className="flex items-center gap-1.5 px-space-md h-8 rounded bg-primary text-on-primary font-body-strong text-clinical-data shadow-sm hover:bg-primary-container hover:text-on-primary-container transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">add_box</span> Stat Order Entry
            </button>
          </div>
        </div>

        {/* Navigation Filter Tabs */}
        <div className="px-gutter-normal flex items-center gap-1 overflow-x-auto bg-surface-container-low py-1">
          {[
            { id: "all", label: "All Investigations (34)" },
            { id: "cardiac", label: "Cardiac & Bedside STAT (5)", hasPing: true },
            { id: "glycemic", label: "Biochemistry & Glycemic (8)" },
            { id: "lipid", label: "Lipid Panel (5)" },
            { id: "hematology", label: "Hematology / CBC (12)" },
            { id: "renal", label: "Renal & Electrolytes (6)" },
            { id: "imaging", label: "Radiology & Imaging (4)" },
            { id: "micro", label: "Microbiology" },
            { id: "trends", label: "Longitudinal Trends" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-space-sm py-1.5 rounded font-clinical-data text-clinical-data transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                activeTab === tab.id
                  ? "bg-primary text-on-primary font-semibold shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              }`}
            >
              {tab.hasPing && (
                <span className="h-1.5 w-1.5 rounded-full bg-error animate-ping inline-block"></span>
              )}
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Top KPI Strip (6 Cards) */}
      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-space-sm">
        {/* Card 1 */}
        <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-metadata-micro text-metadata-micro font-semibold uppercase tracking-wider">
              Critical STAT
            </span>
            <span className="material-symbols-outlined text-error text-base">e911_emergency</span>
          </div>
          <div className="flex items-baseline gap-space-xs mt-1">
            <span className="font-chief-complaint text-chief-complaint text-error leading-none font-bold">
              02
            </span>
            <span className="font-metadata-micro text-metadata-micro text-error font-semibold uppercase">
              Action Req.
            </span>
          </div>
          <p className="font-metadata-micro text-metadata-micro text-on-surface-variant mt-1 line-clamp-1 truncate">
            Troponin I In-Flight · Precordial STEMI
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-metadata-micro text-metadata-micro font-semibold uppercase tracking-wider">
              Pending Lab Runs
            </span>
            <span className="material-symbols-outlined text-tertiary text-base">hourglass_top</span>
          </div>
          <div className="flex items-baseline gap-space-xs mt-1">
            <span className="font-chief-complaint text-chief-complaint text-tertiary leading-none font-bold">
              01
            </span>
            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant font-medium">
              ETA ~14:50
            </span>
          </div>
          <p className="font-metadata-micro text-metadata-micro text-on-surface-variant mt-1 truncate">
            hs-cTnI · Siemens Atellica
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-metadata-micro text-metadata-micro font-semibold uppercase tracking-wider">
              Abnormal Values
            </span>
            <span className="material-symbols-outlined text-on-secondary-container text-base">
              troubleshoot
            </span>
          </div>
          <div className="flex items-baseline gap-space-xs mt-1">
            <span className="font-chief-complaint text-chief-complaint text-on-surface leading-none font-bold">
              04
            </span>
            <span className="font-metadata-micro text-metadata-micro text-secondary font-semibold">
              Out-of-Bounds
            </span>
          </div>
          <p className="font-metadata-micro text-metadata-micro text-on-surface-variant mt-1 truncate">
            HbA1c 7.8% · LDL 152 mg/dL
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-metadata-micro text-metadata-micro font-semibold uppercase tracking-wider">
              Normal / Cleared
            </span>
            <span className="material-symbols-outlined text-primary text-base">task_alt</span>
          </div>
          <div className="flex items-baseline gap-space-xs mt-1">
            <span className="font-chief-complaint text-chief-complaint text-primary leading-none font-bold">
              28
            </span>
            <span className="font-metadata-micro text-metadata-micro text-primary font-medium">
              Verified Cleared
            </span>
          </div>
          <p className="font-metadata-micro text-metadata-micro text-on-surface-variant mt-1 truncate">
            Electrolytes, Hemogram, Platelets
          </p>
        </div>

        {/* Card 5 */}
        <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-metadata-micro text-metadata-micro font-semibold uppercase tracking-wider">
              PCI Clearance
            </span>
            <span className="material-symbols-outlined text-primary text-base">check_circle</span>
          </div>
          <div className="flex items-baseline gap-space-xs mt-1">
            <span className="font-body-strong text-body-strong text-on-surface leading-none font-bold">
              eGFR 98
            </span>
            <span className="font-metadata-micro text-metadata-micro text-primary font-bold">
              PASS
            </span>
          </div>
          <p className="font-metadata-micro text-metadata-micro text-on-surface-variant mt-1 truncate">
            Contrast Safe · aPTT 28.4s Normal
          </p>
        </div>

        {/* Card 6 */}
        <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-metadata-micro text-metadata-micro font-semibold uppercase tracking-wider">
              Custody Custodian
            </span>
            <span className="material-symbols-outlined text-primary text-base">move_to_inbox</span>
          </div>
          <div className="flex items-baseline gap-space-xs mt-1">
            <span className="font-clinical-data-mono text-clinical-data-mono font-bold text-on-surface">
              #L-441
            </span>
            <span className="font-metadata-micro text-metadata-micro text-primary font-medium">
              Core Lab
            </span>
          </div>
          <p className="font-metadata-micro text-metadata-micro text-on-surface-variant mt-1 truncate">
            Centrifuged @ 14:28 IST
          </p>
        </div>
      </section>

      {/* Main Split Clinical Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-sm items-start">
        {/* LEFT SIDE: 65% (8 Columns) */}
        <section className="xl:col-span-8 flex flex-col gap-space-sm">
          {/* Bedside Telemetry & ECG Strip Card */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm">
            <div className="flex items-center justify-between pb-space-xs">
              <div className="flex items-center gap-space-xs">
                <span className="h-2.5 w-2.5 rounded-full bg-error animate-ping"></span>
                <span className="font-body-strong text-body-strong text-on-surface">
                  BEDSIDE 12-LEAD TELEMETRY (LEAD V2-V4 ST ELEVATION)
                </span>
                <span className="bg-error text-on-error font-clinical-data-mono text-metadata-micro px-1.5 py-0.5 rounded font-bold uppercase">
                  Acute Injury Current
                </span>
              </div>
              <div className="flex items-center gap-space-sm text-metadata-micro font-clinical-data-mono text-on-surface-variant">
                <span>
                  HR: <strong className="text-error font-bold">104 bpm</strong> (Sinus Tach)
                </span>
                <span>Speed: 25 mm/s</span>
                <span>Gain: 10 mm/mV</span>
                <span>Captured: 14:25 IST (Station 02)</span>
              </div>
            </div>

            {/* High-contrast Live Bedside Precordial Waveform SVG */}
            <div className="relative bg-surface-container-high rounded-lg p-space-sm overflow-hidden mt-1">
              <div className="absolute top-2 left-3 flex items-center gap-2 z-10">
                <span className="font-clinical-data-mono text-metadata-micro text-error font-bold tracking-wider">
                  LEAD V3 · ST SEGMENT: +3.2 mm ELEVATED
                </span>
                <span className="font-metadata-micro text-metadata-micro bg-surface-container px-1 py-0.5 rounded text-on-surface-variant">
                  Reciprocal ST Depression in III/aVF
                </span>
              </div>

              {/* Continuous Rhythm SVG Line with STEMI elevation */}
              <svg
                className="w-full h-24 text-error"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 900 100"
              >
                {/* Background Telemetry Grid */}
                <defs>
                  <pattern height="20" id="ecgGrid" patternUnits="userSpaceOnUse" width="20">
                    <path
                      className="text-outline-variant/30"
                      d="M 20 0 L 0 0 0 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.5"
                    ></path>
                  </pattern>
                </defs>
                <rect fill="url(#ecgGrid)" height="100%" opacity="0.3" width="100%"></rect>

                {/* ECG Cycle Repeated with high ST Elevation */}
                <path
                  d="
                    M 0,55 L 40,55 
                    C 45,55 48,51 52,51 C 56,51 59,55 64,55
                    L 74,55 L 77,58 L 81,10 L 87,70 L 91,55 
                    C 95,30 115,22 135,22 C 150,22 165,55 180,55
                    L 230,55
                    C 235,55 238,51 242,51 C 246,51 249,55 254,55
                    L 264,55 L 267,58 L 271,10 L 277,70 L 281,55 
                    C 285,30 305,22 325,22 C 340,22 355,55 370,55
                    L 420,55
                    C 425,55 428,51 432,51 C 436,51 439,55 444,55
                    L 454,55 L 457,58 L 461,10 L 467,70 L 471,55 
                    C 475,30 495,22 515,22 C 530,22 545,55 560,55
                    L 610,55
                    C 615,55 618,51 622,51 C 626,51 629,55 634,55
                    L 644,55 L 647,58 L 651,10 L 657,70 L 661,55 
                    C 665,30 685,22 705,22 C 720,22 735,55 750,55
                    L 800,55
                    C 805,55 808,51 812,51 C 816,51 819,55 824,55
                    L 834,55 L 837,58 L 841,10 L 847,70 L 851,55 
                    C 855,30 875,22 895,22 L 900,24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.2"
                ></path>
              </svg>
              <div className="flex items-center justify-between text-metadata-micro font-clinical-data-mono text-on-surface-variant pt-1">
                <span>PR: 142ms · QRS: 96ms · QTc: 462ms · J-Point: +3.2mm</span>
                <span className="text-error font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">notification_important</span>{" "}
                  Immediate Cath Lab Direct Activation Criteria Met
                </span>
              </div>
            </div>
          </div>

          {/* Comprehensive Dense Hospital Investigations Table */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
            {/* Table Control Toolbar */}
            <div className="p-space-sm bg-surface-container-low flex flex-wrap items-center justify-between gap-space-sm">
              <div className="flex items-center gap-space-xs">
                <span className="font-section-title text-section-title text-on-surface">
                  Integrated Diagnostic Matrix
                </span>
                <span className="font-metadata-micro text-metadata-micro bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">
                  LOINC / FHIR R4 Connected
                </span>
              </div>
              <div className="flex items-center gap-space-xs">
                <div className="relative">
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-7 pl-7 pr-3 bg-surface text-clinical-data font-clinical-data rounded text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary w-48 text-xs border border-outline-variant"
                    placeholder="Filter lab parameter or LOINC..."
                    type="text"
                  />
                  <span className="material-symbols-outlined absolute left-2 top-1.5 text-outline text-sm">
                    filter_alt
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab("all")}
                  className="h-7 px-2 bg-surface-container hover:bg-surface-container-high rounded text-metadata-micro font-body-strong text-on-surface flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xs">unfold_more</span> Expand All
                </button>
              </div>
            </div>

            {/* Dense Table Body */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container text-on-surface-variant font-table-header text-table-header uppercase tracking-wider">
                    <th className="py-2 px-space-md">Investigation / Analyte</th>
                    <th className="py-2 px-space-sm">Observed Value</th>
                    <th className="py-2 px-space-sm">Reference Range</th>
                    <th className="py-2 px-space-sm">Specimen &amp; Method</th>
                    <th className="py-2 px-space-sm">Collection / Run</th>
                    <th className="py-2 px-space-sm text-right">Status / Validation</th>
                  </tr>
                </thead>
                <tbody className="font-clinical-data text-clinical-data divide-y divide-surface-container-high">
                  {filteredInvestigations.map((item) => {
                    const isEcg = item.id === "ecg-stat";
                    return (
                      <tr
                        key={item.id}
                        className={`${
                          isEcg
                            ? "bg-error/5 hover:bg-error/10"
                            : "bg-surface-container-lowest hover:bg-surface-container-low"
                        } transition-colors`}
                      >
                        <td className="py-2.5 px-space-md">
                          <div className="flex items-center gap-2">
                            {item.isInFlight ? (
                              <span className="h-2 w-2 rounded-full bg-error animate-ping"></span>
                            ) : isEcg ? (
                              <span className="material-symbols-outlined text-error text-base">
                                ecg
                              </span>
                            ) : null}
                            <div>
                              <span
                                className={`font-body-strong ${
                                  isEcg ? "text-error" : "text-on-surface"
                                }`}
                              >
                                {item.name}
                              </span>
                              <span className="block font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                                {item.loinc}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-space-sm">
                          {item.isInFlight ? (
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-container-high text-on-surface font-clinical-data-mono text-metadata-micro font-bold">
                              <span className="material-symbols-outlined text-xs animate-spin text-tertiary">
                                progress_activity
                              </span>
                              {item.value}
                            </div>
                          ) : item.valueBadge ? (
                            <span
                              className={`inline-flex items-center gap-1 font-clinical-data-mono text-body-strong font-bold ${
                                item.valueBadgeColor === "error"
                                  ? "text-error bg-error-container/30 px-1.5 py-0.5 rounded"
                                  : "text-secondary bg-secondary-container/30 px-1.5 py-0.5 rounded"
                              }`}
                            >
                              {item.value}{" "}
                              <span className="text-xs font-semibold">{item.valueBadge}</span>
                            </span>
                          ) : (
                            <span
                              className={`font-clinical-data-mono text-body-strong ${
                                item.id === "egfr"
                                  ? "text-primary font-bold"
                                  : "text-on-surface font-medium"
                              }`}
                            >
                              {item.value}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-space-sm font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                          {item.reference}
                        </td>
                        <td className="py-2.5 px-space-sm text-metadata-micro text-on-surface-variant">
                          {item.specimen}
                        </td>
                        <td className="py-2.5 px-space-sm font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                          {item.collectedTime}
                        </td>
                        <td className="py-2.5 px-space-sm text-right">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-metadata-micro font-semibold ${
                              item.statusBadgeColor === "error"
                                ? "bg-error text-on-error font-bold"
                                : item.statusBadgeColor === "primary"
                                ? "bg-surface-container text-primary font-body-strong"
                                : "bg-surface-container text-on-surface-variant font-medium"
                            }`}
                          >
                            {item.statusBadge}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Multi-Modal Imaging & Diagnostic Thumbnail Tray */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm">
            <div className="flex items-center justify-between pb-space-xs">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-base">perm_media</span>
                <span className="font-section-title text-subheading text-on-surface">
                  Multi-Modal Diagnostic Tray
                </span>
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                  3 DICOM Studies Linked
                </span>
              </div>
              <Link
                href="/imaging"
                className="flex items-center gap-1 text-primary hover:text-primary-container font-body-strong text-metadata-micro transition-colors"
              >
                <span className="material-symbols-outlined text-xs">open_in_new</span> Launch Full
                PACS Viewer
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm mt-2">
              {/* Thumbnail 1: Bedside 12-Lead ECG PDF */}
              <div
                onClick={() => {
                  setActiveImage({
                    title: "Bedside 12-Lead ECG (Full)",
                    subtitle: "Station 02 · Lead Precordial Acute STEMI Elevation",
                    badge: "ST-ELEVATION CONFIRMED",
                    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAlrFJMCFItLBhfi4uUkEtq1QdQdc0aT7NxP81QqWEhaWw0KB3_hudwCD6Y14Uq3PTkSbAeF7GrL5KY6cHgu3OysXSkljguEN_qL-swwWPTLQefkFG5ggLhdmTVO3EFu7ZDmspQ1J29X0c7_nfX7JevebsNj3ZSmpLSxhRowH76dJeWVGs5wdyAuHdUS9dgVFMZ9TGaGyWTWodUB3W_Jo4SrFHQ9VFCz55mEUAJDK45nZONP-fQd9pe",
                  });
                  setIsImageInspectOpen(true);
                }}
                className="bg-surface-container-low rounded-lg p-space-xs flex flex-col gap-1 cursor-pointer hover:bg-surface-container transition-all"
              >
                <div className="relative h-28 bg-surface-container-high rounded overflow-hidden flex items-center justify-center">
                  <img
                    className="w-full h-full object-cover"
                    alt="12-lead ECG"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlrFJMCFItLBhfi4uUkEtq1QdQdc0aT7NxP81QqWEhaWw0KB3_hudwCD6Y14Uq3PTkSbAeF7GrL5KY6cHgu3OysXSkljguEN_qL-swwWPTLQefkFG5ggLhdmTVO3EFu7ZDmspQ1J29X0c7_nfX7JevebsNj3ZSmpLSxhRowH76dJeWVGs5wdyAuHdUS9dgVFMZ9TGaGyWTWodUB3W_Jo4SrFHQ9VFCz55mEUAJDK45nZONP-fQd9pe"
                  />
                  <span className="absolute top-1 left-1 bg-error text-on-error font-clinical-data-mono text-[9px] px-1 rounded font-bold">
                    ST-ELEVATION CONFIRMED
                  </span>
                  <span className="absolute bottom-1 right-1 bg-surface/90 text-on-surface font-clinical-data-mono text-[9px] px-1 rounded">
                    PDF · 14:25 IST
                  </span>
                </div>
                <div className="px-1">
                  <span className="font-body-strong text-metadata-micro text-on-surface block truncate">
                    Bedside 12-Lead ECG (Full)
                  </span>
                  <span className="font-metadata-micro text-[10px] text-on-surface-variant">
                    Station 02 · Lead Precordial Acute
                  </span>
                </div>
              </div>

              {/* Thumbnail 2: Chest X-Ray */}
              <div
                onClick={() => {
                  setActiveImage({
                    title: "Chest X-Ray PA View",
                    subtitle: "CTR 0.46 · Clear costophrenic angles · Normal cardiothoracic ratio",
                    badge: "NORMAL CXR",
                    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuB9JpBe4-C8tJclSW6PMRqDe5xAzgrGxmTbk0JvTCTHsuHO7_5_t41gPXWImaeQb5M9A4zDW7LgMAh8YY6DjmDZjQ7nRo2NwPnT9M_WinXuCVgE4hBnUTz6oYLTT6voJHx6FqwI7dZeR6KKd7KboimUSlbUNgXebe8BnPD4rrLlKpuQaYyuc6Co8cTvVwL3H0208jg73ICQX8Kb0cS2PfoUgygPMX45U8TZZ4fN2fC9w7SKcmBtf7zp",
                  });
                  setIsImageInspectOpen(true);
                }}
                className="bg-surface-container-low rounded-lg p-space-xs flex flex-col gap-1 cursor-pointer hover:bg-surface-container transition-all"
              >
                <div className="relative h-28 bg-surface-container-high rounded overflow-hidden flex items-center justify-center">
                  <img
                    className="w-full h-full object-cover"
                    alt="Chest X-Ray"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9JpBe4-C8tJclSW6PMRqDe5xAzgrGxmTbk0JvTCTHsuHO7_5_t41gPXWImaeQb5M9A4zDW7LgMAh8YY6DjmDZjQ7nRo2NwPnT9M_WinXuCVgE4hBnUTz6oYLTT6voJHx6FqwI7dZeR6KKd7KboimUSlbUNgXebe8BnPD4rrLlKpuQaYyuc6Co8cTvVwL3H0208jg73ICQX8Kb0cS2PfoUgygPMX45U8TZZ4fN2fC9w7SKcmBtf7zp"
                  />
                  <span className="absolute top-1 left-1 bg-primary text-on-primary font-clinical-data-mono text-[9px] px-1 rounded font-bold">
                    NORMAL CXR
                  </span>
                  <span className="absolute bottom-1 right-1 bg-surface/90 text-on-surface font-clinical-data-mono text-[9px] px-1 rounded">
                    DICOM · 18-May
                  </span>
                </div>
                <div className="px-1">
                  <span className="font-body-strong text-metadata-micro text-on-surface block truncate">
                    Chest X-Ray PA View
                  </span>
                  <span className="font-metadata-micro text-[10px] text-on-surface-variant">
                    CTR 0.46 · Clear costophrenic
                  </span>
                </div>
              </div>

              {/* Thumbnail 3: Historical Cath Angiogram */}
              <div
                onClick={() => {
                  setActiveImage({
                    title: "Coronary Angio (Nov 2021)",
                    subtitle: "Cath Lab 01 · LAD 40% mid-lesion plaque historical baseline",
                    badge: "HISTORICAL 2021",
                    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAcDSwk8pi56mKIB7WjPx6KhMR-3u2vYsQN_zHzjmRU7Vn1h0oRsHHg3Ee5Ns1hdBl5_bwiNMIzHb_HdMK8Bp91Vd_azz1bdg5LGyRHnAL8cPbd9NW4NcDia4r8GMM0ItUJhtwzjyQUrwM1e2p-k9cqROp9xI7yQEFkuBflS_EfHyZcWvjS39_7-oJxdr8vDTZyVrFkDVglV6KphhdtREwIxMm5uk1FszjAlkR0Iu4y-WV2LBPlwYT3",
                  });
                  setIsImageInspectOpen(true);
                }}
                className="bg-surface-container-low rounded-lg p-space-xs flex flex-col gap-1 cursor-pointer hover:bg-surface-container transition-all"
              >
                <div className="relative h-28 bg-surface-container-high rounded overflow-hidden flex items-center justify-center">
                  <img
                    className="w-full h-full object-cover"
                    alt="Coronary Angio"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcDSwk8pi56mKIB7WjPx6KhMR-3u2vYsQN_zHzjmRU7Vn1h0oRsHHg3Ee5Ns1hdBl5_bwiNMIzHb_HdMK8Bp91Vd_azz1bdg5LGyRHnAL8cPbd9NW4NcDia4r8GMM0ItUJhtwzjyQUrwM1e2p-k9cqROp9xI7yQEFkuBflS_EfHyZcWvjS39_7-oJxdr8vDTZyVrFkDVglV6KphhdtREwIxMm5uk1FszjAlkR0Iu4y-WV2LBPlwYT3"
                  />
                  <span className="absolute top-1 left-1 bg-secondary text-on-secondary font-clinical-data-mono text-[9px] px-1 rounded font-bold">
                    HISTORICAL 2021
                  </span>
                  <span className="absolute bottom-1 right-1 bg-surface/90 text-on-surface font-clinical-data-mono text-[9px] px-1 rounded">
                    Cath Lab 01
                  </span>
                </div>
                <div className="px-1">
                  <span className="font-body-strong text-metadata-micro text-on-surface block truncate">
                    Coronary Angio (Nov 2021)
                  </span>
                  <span className="font-metadata-micro text-[10px] text-on-surface-variant">
                    LAD 40% mid-lesion plaque
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT SIDE: 35% (4 Columns) - Investigation Inspector & Acknowledgment */}
        <section className="xl:col-span-4 flex flex-col gap-space-sm">
          {/* CRITICAL RESULT ACKNOWLEDGEMENT CARD */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border-l-4 border-error">
            <div className="flex items-center gap-space-xs text-error pb-1">
              <span className="material-symbols-outlined text-lg">warning</span>
              <span className="font-body-strong text-clinical-data uppercase font-bold tracking-wide">
                STAT Critical Finding Notice
              </span>
            </div>
            <div className="bg-error-container/30 p-space-sm rounded-lg mt-1">
              <span className="font-body-strong text-clinical-data text-on-error-container block">
                Bedside 12-Lead ECG: Acute Anterior STEMI
              </span>
              <p className="font-body-default text-metadata-micro text-on-surface mt-1 leading-relaxed">
                Marked J-point ST-elevation (&gt;2.5mm) across V2–V4 with reciprocal ST depression in
                inferior leads. High probability of proximal Left Anterior Descending (LAD) acute
                occlusion.
              </p>
              <div className="mt-2 pt-2 border-t border-error/20 flex flex-col gap-1 text-metadata-micro font-clinical-data-mono text-on-surface-variant">
                <span>
                  Detected: <strong className="text-on-surface">Today 14:25 IST</strong>
                </span>
                <span>
                  Required Attending:{" "}
                  <strong className="text-on-surface">Dr. Rohit Verma (Signed)</strong>
                </span>
                <span className="text-primary font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">verified</span> ACKNOWLEDGED
                  &amp; SIGNED AT 14:26:00 IST
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsTransferModalOpen(true)}
              className="w-full mt-space-sm h-10 rounded-lg bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container font-body-strong text-clinical-data flex items-center justify-center gap-space-xs transition-colors shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">emergency_share</span>
              Authorized Immediate Cath Lab Transfer
            </button>
          </div>

          {/* ACTIVE SPECIMEN INSPECTOR & CHAIN-OF-CUSTODY */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-sm">
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-tertiary text-base">biotech</span>
                <span className="font-section-title text-subheading text-on-surface">
                  Specimen Live Tracker
                </span>
              </div>
              <span className="bg-surface-container text-primary font-clinical-data-mono text-[10px] px-1.5 py-0.5 rounded font-bold">
                LIS #4491-cTnI
              </span>
            </div>
            <div>
              <span className="font-body-strong text-clinical-data text-on-surface block">
                High-Sensitivity Cardiac Troponin I (hs-cTnI)
              </span>
              <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                Priority: STAT-LEVEL 1 · Sample ID:{" "}
                <strong className="font-clinical-data-mono text-on-surface">990142-01</strong>
              </span>
            </div>
            {/* Progress Bar Indicator */}
            <div className="bg-surface-container rounded-full h-2 overflow-hidden relative">
              <div className="bg-tertiary h-full w-2/3 rounded-full transition-all duration-500"></div>
            </div>
            <div className="flex items-center justify-between text-metadata-micro font-clinical-data-mono text-on-surface-variant -mt-1">
              <span>Analyzer Progress: 65%</span>
              <span className="text-tertiary font-bold">ETA 14:50 IST</span>
            </div>
            {/* Specimen Chain of Custody Timeline */}
            <div className="relative pl-5 space-y-3 mt-1 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-container-high">
              {/* Step 1 */}
              <div className="relative">
                <span className="absolute -left-5 top-1 h-3 w-3 rounded-full bg-primary ring-2 ring-surface"></span>
                <div className="flex items-baseline justify-between">
                  <span className="font-body-strong text-metadata-micro text-on-surface">
                    CPOE Authorized
                  </span>
                  <span className="font-clinical-data-mono text-[10px] text-on-surface-variant">
                    14:20 IST
                  </span>
                </div>
                <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                  Dr. Rohit Verma · CPOE #99812
                </p>
              </div>
              {/* Step 2 */}
              <div className="relative">
                <span className="absolute -left-5 top-1 h-3 w-3 rounded-full bg-primary ring-2 ring-surface"></span>
                <div className="flex items-baseline justify-between">
                  <span className="font-body-strong text-metadata-micro text-on-surface">
                    Drawn at Bedside
                  </span>
                  <span className="font-clinical-data-mono text-[10px] text-on-surface-variant">
                    14:23 IST
                  </span>
                </div>
                <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                  Sr. Preeti S. · Bay 02 Barcode verified
                </p>
              </div>
              {/* Step 3 */}
              <div className="relative">
                <span className="absolute -left-5 top-1 h-3 w-3 rounded-full bg-primary ring-2 ring-surface"></span>
                <div className="flex items-baseline justify-between">
                  <span className="font-body-strong text-metadata-micro text-on-surface">
                    Pneumatic Dispatch
                  </span>
                  <span className="font-clinical-data-mono text-[10px] text-on-surface-variant">
                    14:25 IST
                  </span>
                </div>
                <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                  Tube 04 → Core Lab Sta 01
                </p>
              </div>
              {/* Step 4 */}
              <div className="relative">
                <span className="absolute -left-5 top-1 h-3 w-3 rounded-full bg-primary ring-2 ring-surface"></span>
                <div className="flex items-baseline justify-between">
                  <span className="font-body-strong text-metadata-micro text-on-surface">
                    Core Centrifuged
                  </span>
                  <span className="font-clinical-data-mono text-[10px] text-on-surface-variant">
                    14:28 IST
                  </span>
                </div>
                <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                  Tech: Rajesh M. · 3000 RPM / 5 min
                </p>
              </div>
              {/* Step 5 (Active) */}
              <div className="relative">
                <span className="absolute -left-5 top-1 h-3 w-3 rounded-full bg-tertiary animate-pulse ring-2 ring-surface"></span>
                <div className="flex items-baseline justify-between">
                  <span className="font-body-strong text-metadata-micro text-tertiary font-bold">
                    In Analyzer Running
                  </span>
                  <span className="font-clinical-data-mono text-[10px] text-tertiary font-bold">
                    14:32 IST
                  </span>
                </div>
                <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                  Siemens Atellica IM #01 (Well 04)
                </p>
              </div>
            </div>
          </div>

          {/* LONGITUDINAL ASSAY TREND MINI-GRAPH (HbA1c & Lipids) */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-xs">
            <div className="flex items-center justify-between">
              <span className="font-body-strong text-clinical-data text-on-surface">
                Longitudinal Glycemic Trajectory (HbA1c)
              </span>
              <span className="text-error font-clinical-data-mono text-metadata-micro font-semibold">
                +0.6% 2-Yr Shift
              </span>
            </div>
            <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
              Historical progression: Aug 2024 (7.2%) → Sep 2025 (7.5%) → Jul 2026 (7.8%)
            </p>
            {/* Trend Line SVG Chart */}
            <div className="bg-surface-container-low rounded-lg p-space-sm mt-1">
              <svg className="w-full h-24" fill="none" viewBox="0 0 300 90">
                {/* Reference ADA Target < 7.0% Line */}
                <line
                  opacity="0.5"
                  stroke="#6e7977"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                  x1="20"
                  x2="280"
                  y1="60"
                  y2="60"
                ></line>
                <text className="font-clinical-data-mono text-[8px]" fill="#6e7977" x="25" y="55">
                  ADA Guideline Goal &lt; 7.0%
                </text>
                {/* Severe Threshold Line */}
                <line
                  opacity="0.3"
                  stroke="#ba1a1a"
                  strokeDasharray="2 2"
                  strokeWidth="0.8"
                  x1="20"
                  x2="280"
                  y1="25"
                  y2="25"
                ></line>
                <text className="font-clinical-data-mono text-[8px]" fill="#ba1a1a" x="180" y="22">
                  High Risk &gt; 7.5%
                </text>
                {/* Curve Trajectory */}
                <path
                  d="M 50,55 Q 160,40 250,18"
                  fill="none"
                  stroke="#ba1a1a"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                ></path>
                {/* Nodes */}
                <circle
                  cx="50"
                  cy="55"
                  fill="#005c55"
                  r="4"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                ></circle>
                <circle
                  cx="150"
                  cy="40"
                  fill="#4c5e83"
                  r="4"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                ></circle>
                <circle
                  cx="250"
                  cy="18"
                  fill="#ba1a1a"
                  r="5"
                  stroke="#ffffff"
                  strokeWidth="2"
                ></circle>
                {/* Labels on Nodes */}
                <text
                  className="font-clinical-data-mono text-[9px] font-bold"
                  fill="#101d25"
                  x="40"
                  y="72"
                >
                  7.2%
                </text>
                <text className="font-metadata-micro text-[8px]" fill="#3e4947" x="35" y="82">
                  2024
                </text>
                <text
                  className="font-clinical-data-mono text-[9px] font-bold"
                  fill="#101d25"
                  x="140"
                  y="57"
                >
                  7.5%
                </text>
                <text className="font-metadata-micro text-[8px]" fill="#3e4947" x="135" y="67">
                  2025
                </text>
                <text
                  className="font-clinical-data-mono text-[9px] font-bold"
                  fill="#ba1a1a"
                  x="240"
                  y="35"
                >
                  7.8%
                </text>
                <text
                  className="font-metadata-micro text-[8px] font-semibold"
                  fill="#ba1a1a"
                  x="235"
                  y="45"
                >
                  Today
                </text>
              </svg>
            </div>
          </div>

          {/* PROVENANCE & LIS BRIDGE DETAILS */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm">
            <div className="flex items-center gap-space-xs text-on-surface-variant pb-1">
              <span className="material-symbols-outlined text-base">verified_user</span>
              <span className="font-body-strong text-metadata-micro uppercase tracking-wider">
                Provenance &amp; Validation
              </span>
            </div>
            <div className="text-metadata-micro font-metadata-micro text-on-surface-variant space-y-1 mt-1">
              <p>
                Verified Pathologist:{" "}
                <strong className="text-on-surface">Dr. Anjali Nair, MD (Clinical Path)</strong>
              </p>
              <p>
                Lab Master Acc:{" "}
                <strong className="font-clinical-data-mono text-on-surface">
                  #LAB-77218 (04-Jul-2026)
                </strong>
              </p>
              <p>
                LIS Interface:{" "}
                <span className="font-clinical-data-mono text-primary font-semibold">
                  HL7 v2.5 / FHIR DiagnosticReport Active
                </span>
              </p>
            </div>
            <div className="grid grid-cols-3 gap-1 mt-space-sm">
              <button
                onClick={() => showToast("Downloading official signed pathology PDF report...")}
                className="px-2 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface rounded font-body-strong text-[11px] flex flex-col items-center justify-center text-center transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm mb-0.5">picture_as_pdf</span>
                PDF Report
              </button>
              <button
                onClick={() => showToast("Diagnostic reports pushed to Rahul Sharma's ABDM Locker.")}
                className="px-2 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface rounded font-body-strong text-[11px] flex flex-col items-center justify-center text-center transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm mb-0.5">lock</span>
                ABHA Push
              </button>
              <button
                onClick={() => showToast("Lab findings appended into Cardiology Consultation Chart.")}
                className="px-2 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface rounded font-body-strong text-[11px] flex flex-col items-center justify-center text-center transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm mb-0.5">post_add</span>
                Chart Note
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* MODALS */}

      {/* 1. Stat Order Entry Modal */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 bg-inverse-surface/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-surface-container-lowest rounded-xl shadow-xl max-w-md w-full p-space-panel-padding flex flex-col gap-3 border border-outline-variant">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">add_box</span>
                <h3 className="font-page-title text-subheading font-bold text-on-surface">
                  STAT Investigation Order Entry
                </h3>
              </div>
              <button
                onClick={() => setIsOrderModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateOrder} className="flex flex-col gap-3 font-clinical-data text-clinical-data">
              <div>
                <label className="text-metadata-micro text-outline font-semibold uppercase block mb-1">
                  Investigation / Panel Name
                </label>
                <select
                  value={orderTestName}
                  onChange={(e) => setOrderTestName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-surface-container-low rounded border border-outline-variant text-on-surface"
                >
                  <option>Serum Electrolytes (Na/K/Cl)</option>
                  <option>Arterial Blood Gas (ABG) STAT</option>
                  <option>Repeat hs-cTnI (03-Hour Serial)</option>
                  <option>Coagulation Profile (PT/INR/aPTT)</option>
                  <option>Serum Lactate &amp; Blood Ketones</option>
                </select>
              </div>
              <div>
                <label className="text-metadata-micro text-outline font-semibold uppercase block mb-1">
                  Priority
                </label>
                <select
                  value={orderPriority}
                  onChange={(e) => setOrderPriority(e.target.value)}
                  className="w-full px-3 py-1.5 bg-surface-container-low rounded border border-outline-variant text-on-surface"
                >
                  <option>STAT Urgent (Cath Lab Ready)</option>
                  <option>Urgent (Within 60 mins)</option>
                  <option>Routine Inpatient</option>
                </select>
              </div>
              <div>
                <label className="text-metadata-micro text-outline font-semibold uppercase block mb-1">
                  Clinical Indication / Instructions
                </label>
                <textarea
                  rows={2}
                  value={orderInstructions}
                  onChange={(e) => setOrderInstructions(e.target.value)}
                  className="w-full p-2 bg-surface-container-low rounded border border-outline-variant text-on-surface text-xs resize-none"
                ></textarea>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant">
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-surface-container text-on-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-primary text-on-primary font-semibold hover:opacity-95"
                >
                  Dispatch STAT Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Immediate Cath Lab Transfer Modal */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 bg-inverse-surface/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-surface-container-lowest rounded-xl shadow-xl max-w-md w-full p-space-panel-padding flex flex-col gap-3 border-2 border-error">
            <div className="p-space-base bg-error text-on-error flex items-center justify-between -mx-space-panel-padding -mt-space-panel-padding rounded-t-lg">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xl animate-pulse">emergency_share</span>
                <h3 className="font-page-title text-subheading font-bold">
                  Cath Lab Transfer Authorization
                </h3>
              </div>
              <button
                onClick={() => setIsTransferModalOpen(false)}
                className="text-on-error hover:opacity-80"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="space-y-2 text-clinical-data font-clinical-data">
              <p className="text-on-surface leading-relaxed">
                Confirming immediate bed-to-table transfer for <strong>Rahul Sharma (#104)</strong> directly to <strong>Cath Lab Suite 01</strong>.
              </p>
              <div className="p-2.5 rounded bg-error-container/30 text-error font-clinical-data-mono text-metadata-micro space-y-1">
                <div>• Diagnosis: Acute Anterior STEMI (Proximal LAD)</div>
                <div>• Interventionalist: Dr. Rohit Verma (Ready in Suite 01)</div>
                <div>• Door-to-Balloon: 22m elapsed / Target &lt; 90m</div>
                <div>• Transport: Emergency Porter #04 Dispatched to Bay 02</div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant">
              <button
                onClick={() => setIsTransferModalOpen(false)}
                className="px-3 py-1.5 rounded bg-surface-container text-on-surface"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsTransferModalOpen(false);
                  showToast("Cath Lab Transfer Authorized. Team standing by in Suite 01.");
                }}
                className="px-4 py-1.5 rounded bg-error text-on-error font-bold hover:opacity-95 shadow-md"
              >
                Confirm Immediate Transfer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. DICOM / Image Inspect Modal */}
      {isImageInspectOpen && activeImage && (
        <div className="fixed inset-0 bg-inverse-surface/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl max-w-3xl w-full p-space-panel-padding flex flex-col gap-3 border border-outline-variant">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant">
              <div>
                <h3 className="font-page-title text-subheading font-bold text-on-surface">
                  {activeImage.title}
                </h3>
                <p className="text-metadata-micro text-on-surface-variant font-clinical-data">
                  {activeImage.subtitle}
                </p>
              </div>
              <button
                onClick={() => setIsImageInspectOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="w-full h-96 bg-black rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src={activeImage.src}
                alt={activeImage.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-outline-variant">
              <span className="px-2 py-0.5 rounded bg-error text-on-error font-clinical-data-mono text-metadata-micro font-bold">
                {activeImage.badge}
              </span>
              <div className="flex gap-2">
                <Link
                  href="/imaging"
                  className="px-4 py-1.5 bg-primary text-on-primary rounded font-semibold text-clinical-data flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                  Open in Full DICOM PACS Viewer
                </Link>
                <button
                  onClick={() => setIsImageInspectOpen(false)}
                  className="px-4 py-1.5 bg-surface-container text-on-surface rounded font-medium text-clinical-data"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
