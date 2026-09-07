/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";

interface MedicationItem {
  id: string;
  num: string;
  name: string;
  classTag: string;
  classTagBg: string;
  subTag?: string;
  subTagBg?: string;
  indication: string;
  doseFreq: string;
  doseSubtitle: string;
  routeTiming: string;
  duration: string;
  dispense: string;
  extraLabel: string;
  extraValue: string;
  isImportant?: boolean;
}

const DEFAULT_MEDICATIONS: MedicationItem[] = [
  {
    id: "ticagrelor",
    num: "01",
    name: "Ticagrelor 90mg Tablets",
    classTag: "P2Y12 Inhibitor",
    classTagBg: "bg-primary/15 text-primary",
    subTag: "DAW: No Generic Substitution",
    subTagBg: "bg-error-container text-on-error-container",
    indication: "Post-STEMI Dual Antiplatelet Therapy (ICD-10 I21.0) · Target Duration: 12 Months",
    doseFreq: "1 Tab BD",
    doseSubtitle: "(Twice daily)",
    routeTiming: "Oral · Post-Meal",
    duration: "12 Months (365 d)",
    dispense: "60 Tabs (30-day pack)",
    extraLabel: "Refills Authorized",
    extraValue: "3 Authorized",
    isImportant: true,
  },
  {
    id: "aspirin",
    num: "02",
    name: "Aspirin 75mg Gastro-resistant Tablets",
    classTag: "Cyclooxygenase Inhibitor",
    classTagBg: "bg-secondary-container text-on-secondary-container",
    subTag: "Enteric Coated EC-ASA",
    subTagBg: "bg-surface-variant text-on-surface-variant",
    indication: "Secondary Prevention Coronary Artery Disease (CAD) · Gastric Shield Active",
    doseFreq: "1 Tab OD",
    doseSubtitle: "(Morning)",
    routeTiming: "Oral · After Breakfast",
    duration: "Lifelong (Chronic)",
    dispense: "30 Tabs",
    extraLabel: "Special Shield",
    extraValue: "Take with Omeprazole",
  },
  {
    id: "atorvastatin",
    num: "03",
    name: "Atorvastatin Calcium 80mg Tablets",
    classTag: "High-Intensity Statin",
    classTagBg: "bg-primary/10 text-primary",
    indication: "ACS Plaque Stabilization & Lipid Lowering (Target LDL-C: <55 mg/dL)",
    doseFreq: "1 Tab OD (HS)",
    doseSubtitle: "(At Bedtime)",
    routeTiming: "Oral · At Bedtime",
    duration: "6 Months",
    dispense: "30 Tabs",
    extraLabel: "Follow-Up Lab",
    extraValue: "LFT / Lipid at 4 Wks",
  },
  {
    id: "metoprolol",
    num: "04",
    name: "Metoprolol Succinate Extended-Release 25mg",
    classTag: "Beta-1 Selective Blocker",
    classTagBg: "bg-surface-container-high text-on-surface",
    indication: "Cardioprotection post-STEMI · Resting Heart Rate Target: 60–70 bpm",
    doseFreq: "1 Tab OD",
    doseSubtitle: "(Morning)",
    routeTiming: "Oral · Morning Post-Meal",
    duration: "3 Months",
    dispense: "30 Tabs",
    extraLabel: "Vital Gate",
    extraValue: "Hold if HR < 55 bpm",
  },
  {
    id: "pantoprazole",
    num: "05",
    name: "Pantoprazole Sodium 40mg GR Tablets",
    classTag: "Proton Pump Inhibitor (PPI)",
    classTagBg: "bg-primary/10 text-primary",
    subTag: "Mucosal Shield",
    subTagBg: "bg-secondary-container text-on-secondary-container",
    indication: "Gastrointestinal protection co-prescribed with DAPT",
    doseFreq: "1 Tab OD",
    doseSubtitle: "(Morning)",
    routeTiming: "Oral · 30 min Pre-Meal",
    duration: "30 Days",
    dispense: "30 Tabs",
    extraLabel: "Review Period",
    extraValue: "Taper at Day 30",
  },
];

export default function DigitalPrescriptionComposerPage() {
  const [medications, setMedications] = useState<MedicationItem[]>(DEFAULT_MEDICATIONS);
  const [searchInput, setSearchInput] = useState<string>(
    "Ticagrelor 90mg Tablet (Brilinta) · High Potency P2Y12"
  );
  const [activeProtocol, setActiveProtocol] = useState<string>("acs");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [showSignModal, setShowSignModal] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [showAbhaModal, setShowAbhaModal] = useState<boolean>(false);
  const [showBatchModal, setShowBatchModal] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  const handleProtocolSelect = (proto: "acs" | "htn" | "t2dm") => {
    setActiveProtocol(proto);
    if (proto === "acs") {
      setMedications(DEFAULT_MEDICATIONS);
      triggerToast("Loaded: ACS Post-PCI (5 Drugs) guideline protocol.");
    } else if (proto === "htn") {
      setMedications([
        {
          id: "telmisartan",
          num: "01",
          name: "Telmisartan 40mg + Amlodipine 5mg Tablets",
          classTag: "ARB + CCB Combo",
          classTagBg: "bg-primary/15 text-primary",
          indication: "Stage 2 Essential Hypertension with microalbuminuria control",
          doseFreq: "1 Tab OD",
          doseSubtitle: "(Morning)",
          routeTiming: "Oral · Post-Meal",
          duration: "90 Days",
          dispense: "90 Tabs",
          extraLabel: "BP Gate",
          extraValue: "Target SBP < 130",
        },
        {
          id: "chlorthalidone",
          num: "02",
          name: "Chlorthalidone 12.5mg Tablets",
          classTag: "Thiazide-like Diuretic",
          classTagBg: "bg-secondary-container text-on-secondary-container",
          indication: "Volume control & synergistic anti-hypertensive therapy",
          doseFreq: "1 Tab OD",
          doseSubtitle: "(Morning)",
          routeTiming: "Oral · Morning with Water",
          duration: "90 Days",
          dispense: "90 Tabs",
          extraLabel: "Electrolyte Check",
          extraValue: "K+ at 14 Days",
        },
      ]);
      triggerToast("Loaded: Hypertension Quad protocol.");
    } else if (proto === "t2dm") {
      setMedications([
        {
          id: "metformin",
          num: "01",
          name: "Metformin ER 1000mg + Dapagliflozin 10mg Tablets",
          classTag: "Biguanide + SGLT2i",
          classTagBg: "bg-primary/15 text-primary",
          indication: "Type 2 Diabetes Mellitus with high cardiorenal risk",
          doseFreq: "1 Tab OD",
          doseSubtitle: "(Morning Post-Meal)",
          routeTiming: "Oral · Post-Breakfast",
          duration: "90 Days",
          dispense: "90 Tabs",
          extraLabel: "eGFR Gate",
          extraValue: "Safe > 30 mL/min",
        },
        {
          id: "glimepiride",
          num: "02",
          name: "Teneligliptin 20mg Tablets",
          classTag: "DPP-4 Inhibitor",
          classTagBg: "bg-secondary-container text-on-secondary-container",
          indication: "Post-prandial glycemic excursions control",
          doseFreq: "1 Tab OD",
          doseSubtitle: "(Morning)",
          routeTiming: "Oral · Pre-Meal",
          duration: "90 Days",
          dispense: "90 Tabs",
          extraLabel: "Hypo Risk",
          extraValue: "Very Low",
        },
      ]);
      triggerToast("Loaded: T2DM Triple-Oral protocol.");
    }
  };

  const handlePlayAudio = () => {
    setIsPlayingAudio(true);
    triggerToast("Playing synthesized Hindi & English patient audio directives...");
    setTimeout(() => {
      setIsPlayingAudio(false);
      triggerToast("Audio playback completed.");
    }, 2800);
  };

  const handleDeleteMed = (id: string) => {
    setMedications(medications.filter((m) => m.id !== id));
    triggerToast("Medication item removed from prescription basket.");
  };

  return (
    <div className="flex flex-col w-full gap-space-md">
      {/* FLOATING TOAST */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-error text-on-error px-gutter-normal py-space-sm rounded-xl shadow-2xl flex items-center gap-space-sm animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="material-symbols-outlined text-xl animate-bounce">priority_high</span>
          <div className="flex flex-col">
            <span className="font-body-strong text-clinical-data">{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-on-error hover:opacity-80 ml-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* RED FLAG / CRITICAL TRIAGE ALERT BAR */}
      <div className="w-full bg-error text-on-error px-gutter-normal py-2 rounded-lg flex items-center justify-between shadow-sm flex-wrap gap-2">
        <div className="flex items-center gap-space-sm min-w-0 flex-wrap">
          <span
            className="material-symbols-outlined text-xl shrink-0"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            emergency
          </span>
          <div className="flex items-center gap-space-xs font-clinical-data text-clinical-data flex-wrap">
            <span className="bg-surface-container-lowest text-error font-clinical-data-mono text-metadata-micro px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">
              P1 Urgent Triage
            </span>
            <span className="font-bold">CRITICAL ENCOUNTER ALERT:</span>
            <span className="opacity-95">Post-PCI Acute Coronary Syndrome stabilization</span>
            <span className="opacity-80">·</span>
            <span className="bg-error-container text-on-error-container font-clinical-data-mono text-metadata-micro px-2 py-0.5 rounded font-semibold uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">block</span>
              <span>Penicillin (Anaphylaxis)</span>
            </span>
            <span className="bg-error-container text-on-error-container font-clinical-data-mono text-metadata-micro px-2 py-0.5 rounded font-semibold uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">warning</span>
              <span>Aspirin (Gastric Intolerance - Buffered Rx Only)</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-space-xs shrink-0 pl-2">
          <span className="font-clinical-data-mono text-metadata-micro opacity-90 font-semibold">
            Protocol: STEMI-DAPT-V3
          </span>
          <span
            onClick={() => triggerToast("STEMI-DAPT-V3: Ticagrelor 90mg BD + Aspirin 75mg OD + Statin 80mg.")}
            className="material-symbols-outlined text-base cursor-pointer opacity-90 hover:opacity-100"
          >
            info
          </span>
        </div>
      </div>

      {/* PATIENT CONTEXT BANNER */}
      <div className="w-full bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex flex-wrap lg:flex-nowrap items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-md min-w-0">
          <div className="relative shrink-0">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8IcCkmptI5zqAsu08fIma3EFUzKHUxLTSIhMaIM5CEuIz35YBPi-akG6bLvtVBSsnIYMvlovMtnIUceUKW8YCOQVkH26DW6y_aEpfJUj2VZIzHVuTPCBgHMZOdi7qe_rYpOMqJ5TGQzccphvLOVTVU8AcYFEcdG9GI8Er7qI-ouEx5uv7QPh3gxoJY9HCRp_aDdb12txZWNtGxDcNs5lDso7IJtiGoT0BKv_qoTElCyck0Hc2YkQz"
              alt="Rahul Sharma"
              className="w-12 h-12 rounded-full object-cover shadow-sm ring-1 ring-primary/20"
            />
            <span className="absolute bottom-0 right-0 h-3.5 w-3.5 bg-primary rounded-full ring-2 ring-surface-container-lowest flex items-center justify-center">
              <span className="material-symbols-outlined text-[9px] text-on-primary">check</span>
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-space-xs flex-wrap">
              <span className="font-page-title text-section-title text-on-surface font-semibold truncate">
                Rahul Sharma
              </span>
              <span className="font-clinical-data text-clinical-data text-on-surface-variant font-medium">
                42 Y / Male
              </span>
              <span className="font-clinical-data-mono text-metadata-micro bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                Token #104
              </span>
              <span className="font-clinical-data-mono text-metadata-micro bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded font-medium">
                UHID: DEL-2024-8841
              </span>
              <span className="font-clinical-data-mono text-metadata-micro bg-surface-container-high text-on-surface px-2 py-0.5 rounded flex items-center gap-1">
                <span className="material-symbols-outlined text-primary text-xs">verified</span>
                <span>ABHA: 91-8842-1920-4491</span>
              </span>
            </div>
            <div className="flex items-center gap-space-md text-metadata-micro font-metadata-micro text-on-surface-variant mt-0.5 flex-wrap">
              <span>
                Attending: <strong className="text-on-surface font-body-strong">Dr. Rohit Verma</strong> (Cardiology, Apollo Indraprastha)
              </span>
              <span>·</span>
              <span>
                Bed: <strong className="text-on-surface">ICU-04 (Telemetry)</strong>
              </span>
              <span>·</span>
              <span>
                Weight: <strong className="text-on-surface font-clinical-data-mono">76.4 kg</strong>
              </span>
              <span>·</span>
              <span>
                BSA: <strong className="text-on-surface font-clinical-data-mono">1.88 m²</strong>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-space-sm shrink-0 flex-wrap">
          <div className="flex flex-col text-right pr-space-sm border-r-0">
            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase tracking-wider font-semibold">
              Clinical Encounter
            </span>
            <span className="font-clinical-data-mono text-clinical-data text-primary font-bold">
              #ENC-90214
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-surface-container-low px-space-sm py-1.5 rounded-lg">
            <span className="material-symbols-outlined text-primary text-base">swap_horiz</span>
            <div className="flex flex-col">
              <span className="font-clinical-data text-metadata-micro font-semibold text-on-surface">
                Apollo Main In-House
              </span>
              <span className="font-metadata-micro text-[10px] text-on-surface-variant">
                Central Auto-Dispense Rack 4
              </span>
            </div>
          </div>
          <button
            onClick={() => triggerToast("Opening chronological patient medication history...")}
            className="bg-surface-container hover:bg-surface-container-high text-on-surface p-2 rounded-lg transition-colors cursor-pointer"
            title="Patient Clinical History Snapshot"
          >
            <span className="material-symbols-outlined text-base">history</span>
          </button>
        </div>
      </div>

      {/* PRIMARY 12-COLUMN GRID WORKSPACE */}
      <div className="grid grid-cols-12 gap-space-md w-full items-start">
        {/* LEFT 7 COLS: Order Composer & Intelligent Rx Pad */}
        <div className="col-span-12 xl:col-span-7 flex flex-col gap-space-md">
          {/* Rx Header & Dynamic Molecule Search */}
          <div className="bg-surface-container-lowest rounded-xl p-space-panel-padding shadow-sm flex flex-col gap-space-md">
            <div className="flex items-center justify-between pb-space-xs flex-wrap gap-2">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-xl">prescriptions</span>
                <span className="font-section-title text-section-title text-on-surface font-semibold">
                  Digital Prescription Composer
                </span>
                <span className="font-metadata-micro text-metadata-micro bg-primary text-on-primary px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  FHIR R4 MedRequest
                </span>
              </div>
              <div className="flex items-center gap-space-xs font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span>Rx Formulary v24.2 Active</span>
              </div>
            </div>

            {/* Smart Formulary Search Field */}
            <div className="relative w-full">
              <div className="flex items-center bg-surface-container-low rounded-lg px-space-md py-2.5 shadow-inner">
                <span className="material-symbols-outlined text-outline text-lg mr-space-sm">medication</span>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search Brand, Generic Molecule, RxNorm, or SNOMED-CT code..."
                  className="w-full bg-transparent text-clinical-data font-clinical-data text-on-surface placeholder:text-outline focus:outline-none"
                />
                <span className="bg-primary/10 text-primary font-clinical-data-mono text-metadata-micro px-2 py-1 rounded font-semibold shrink-0 ml-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">inventory_2</span>
                  <span>In-Stock (420 tabs)</span>
                </span>
              </div>

              <div className="flex items-center justify-between mt-2 px-1 flex-wrap gap-2">
                <div className="flex items-center gap-2 text-metadata-micro text-on-surface-variant flex-wrap">
                  <span className="font-semibold">Quick Protocols:</span>
                  <button
                    onClick={() => handleProtocolSelect("acs")}
                    className={`px-2 py-0.5 rounded font-clinical-data-mono cursor-pointer transition-colors ${
                      activeProtocol === "acs"
                        ? "bg-primary text-on-primary font-bold"
                        : "bg-surface-container hover:bg-surface-container-high text-on-surface"
                    }`}
                  >
                    ACS Post-PCI (5 Drugs)
                  </button>
                  <button
                    onClick={() => handleProtocolSelect("htn")}
                    className={`px-2 py-0.5 rounded font-clinical-data-mono cursor-pointer transition-colors ${
                      activeProtocol === "htn"
                        ? "bg-primary text-on-primary font-bold"
                        : "bg-surface-container hover:bg-surface-container-high text-on-surface"
                    }`}
                  >
                    Hypertension Quad
                  </button>
                  <button
                    onClick={() => handleProtocolSelect("t2dm")}
                    className={`px-2 py-0.5 rounded font-clinical-data-mono cursor-pointer transition-colors ${
                      activeProtocol === "t2dm"
                        ? "bg-primary text-on-primary font-bold"
                        : "bg-surface-container hover:bg-surface-container-high text-on-surface"
                    }`}
                  >
                    T2DM Triple-Oral
                  </button>
                </div>
                <span className="font-clinical-data-mono text-metadata-micro text-outline">
                  Press [Enter] to insert line item
                </span>
              </div>
            </div>
          </div>

          {/* Structured Prescription Line Items */}
          <div className="bg-surface-container-lowest rounded-xl p-space-panel-padding shadow-sm flex flex-col gap-space-sm">
            <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="font-body-strong text-body-strong text-on-surface font-semibold">
                  Prescribed Medications ({medications.length} Items)
                </span>
                <span className="font-clinical-data-mono text-metadata-micro bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">
                  Route: Apollo Central Pharmacy
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowBatchModal(true)}
                  className="font-metadata-micro text-metadata-micro text-primary flex items-center gap-1 font-semibold cursor-pointer hover:underline"
                >
                  <span className="material-symbols-outlined text-sm">tune</span>
                  <span>Batch Adjust Dosages</span>
                </button>
                <button
                  onClick={() => triggerToast("Line details toggled.")}
                  className="font-metadata-micro text-metadata-micro text-outline cursor-pointer hover:text-on-surface"
                >
                  Collapse Details
                </button>
              </div>
            </div>

            {/* Drug Line Items */}
            {medications.map((med) => (
              <div
                key={med.id}
                className="bg-surface-container-low rounded-lg p-space-md flex flex-col gap-space-xs hover:bg-surface-container/60 transition-colors"
              >
                <div className="flex items-start justify-between gap-space-sm">
                  <div className="flex items-start gap-space-sm">
                    <div className="w-7 h-7 rounded-md bg-primary text-on-primary font-clinical-data-mono text-metadata-micro flex items-center justify-center font-bold shrink-0 mt-0.5">
                      {med.num}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-body-strong text-clinical-data text-on-surface font-bold">
                          {med.name}
                        </span>
                        <span className={`font-metadata-micro text-metadata-micro px-1.5 py-0.5 rounded font-bold uppercase ${med.classTagBg}`}>
                          {med.classTag}
                        </span>
                        {med.subTag && (
                          <span className={`font-metadata-micro text-metadata-micro px-1.5 py-0.5 rounded font-semibold ${med.subTagBg}`}>
                            {med.subTag}
                          </span>
                        )}
                      </div>
                      <span className="text-metadata-micro font-metadata-micro text-on-surface-variant mt-0.5">
                        Indication: <strong className="text-on-surface font-medium">{med.indication}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => triggerToast(`Editing dosage parameters for ${med.name}`)}
                      className="p-1 rounded text-outline hover:text-on-surface hover:bg-surface-container cursor-pointer"
                      title="Edit Line Item"
                    >
                      <span className="material-symbols-outlined text-base">edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteMed(med.id)}
                      className="p-1 rounded text-outline hover:text-error hover:bg-error-container cursor-pointer"
                      title="Delete Line Item"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-2 pt-2 bg-surface-container-lowest/80 p-2.5 rounded-lg text-clinical-data-mono text-metadata-micro">
                  <div>
                    <span className="text-on-surface-variant font-metadata-micro uppercase block text-[10px]">
                      Dose / Freq
                    </span>
                    <strong className="text-on-surface text-clinical-data font-semibold">
                      {med.doseFreq}
                    </strong>{" "}
                    {med.doseSubtitle}
                  </div>
                  <div>
                    <span className="text-on-surface-variant font-metadata-micro uppercase block text-[10px]">
                      Route &amp; Timing
                    </span>
                    <strong className="text-on-surface">{med.routeTiming}</strong>
                  </div>
                  <div>
                    <span className="text-on-surface-variant font-metadata-micro uppercase block text-[10px]">
                      Duration
                    </span>
                    <strong className="text-on-surface">{med.duration}</strong>
                  </div>
                  <div>
                    <span className="text-on-surface-variant font-metadata-micro uppercase block text-[10px]">
                      Dispense (Initial)
                    </span>
                    <strong className="text-primary font-bold">{med.dispense}</strong>
                  </div>
                  <div>
                    <span className="text-on-surface-variant font-metadata-micro uppercase block text-[10px]">
                      {med.extraLabel}
                    </span>
                    <strong className="text-on-surface">{med.extraValue}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bilingual Discharge & Transition Guidance */}
          <div className="bg-surface-container-lowest rounded-xl p-space-panel-padding shadow-sm flex flex-col gap-space-sm">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-lg">translate</span>
                <span className="font-body-strong text-body-strong text-on-surface font-semibold">
                  Patient Instructions &amp; Critical Red Flags (Bilingual)
                </span>
              </div>
              <button
                onClick={handlePlayAudio}
                className="font-metadata-micro text-metadata-micro text-primary flex items-center gap-1 font-semibold cursor-pointer hover:underline"
              >
                <span className={`material-symbols-outlined text-sm ${isPlayingAudio ? "animate-pulse text-error" : ""}`}>
                  volume_up
                </span>
                <span>{isPlayingAudio ? "Playing Audio..." : "English + Hindi Audio Synced"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md mt-1">
              {/* English Instruction Block */}
              <div className="bg-surface-container-low p-space-md rounded-lg flex flex-col gap-1.5 text-body-default text-clinical-data">
                <span className="font-clinical-data font-bold text-primary flex items-center gap-1 text-metadata-micro uppercase tracking-wider">
                  <span className="material-symbols-outlined text-sm">language</span>
                  <span>English Protocol Directives</span>
                </span>
                <ul className="list-disc list-inside space-y-1 text-on-surface-variant text-metadata-micro leading-relaxed">
                  <li>
                    Do not skip or stop <strong>Ticagrelor or Aspirin</strong> without consulting your cardiologist. Sudden discontinuation may cause acute stent thrombosis.
                  </li>
                  <li>
                    Take <strong>Pantoprazole</strong> 30 minutes before your first meal on an empty stomach.
                  </li>
                  <li>
                    Report immediately if you experience: sudden recurrent chest tightness, shortness of breath, blood in urine or black tarry stools.
                  </li>
                </ul>
              </div>

              {/* Hindi Transliterated Block */}
              <div className="bg-surface-container-low p-space-md rounded-lg flex flex-col gap-1.5 text-body-default text-clinical-data">
                <span className="font-clinical-data font-bold text-secondary flex items-center gap-1 text-metadata-micro uppercase tracking-wider">
                  <span className="material-symbols-outlined text-sm">record_voice_over</span>
                  <span>Hindi Guidance (हिंदी निर्देश)</span>
                </span>
                <p className="text-metadata-micro text-on-surface-variant leading-relaxed">
                  <strong>दवा का नियम:</strong> टिकाग्रेलर (Ticagrelor) और एस्पिरिन (Aspirin) का सेवन डॉक्टर की सलाह के बिना कभी बंद न करें। पैंटोप्रैजोल (Pantoprazole) सुबह नाश्ते से आधा घंटा पहले खाली पेट लें।
                </p>
                <p className="text-metadata-micro text-error font-medium leading-relaxed">
                  <strong>आपातकालीन चेतावनी:</strong> अत्यधिक कमजोरी, सीने में दर्द, काला मल (black stools), या शरीर पर असामान्य नीले निशान दिखने पर तुरंत अपोलो इमरजेंसी को 1066 पर कॉल करें।
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT 5 COLS: Prescription Safety Engine & Real-Time E-Prescription Preview */}
        <div className="col-span-12 xl:col-span-5 flex flex-col gap-space-md">
          {/* Pharmacovigilance & Safety Engine Card */}
          <div className="bg-surface-container-lowest rounded-xl p-space-panel-padding shadow-sm flex flex-col gap-space-sm">
            <div className="flex items-center justify-between pb-space-xs">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-xl">shield_locked</span>
                <span className="font-body-strong text-section-title text-on-surface font-semibold">
                  Real-Time Clinical Safety Shield
                </span>
              </div>
              <span className="bg-primary/10 text-primary font-clinical-data-mono text-metadata-micro px-2 py-0.5 rounded font-bold">
                3/3 CLEARED
              </span>
            </div>

            {/* Metric 1: Allergy & Cross-Reactivity Shield */}
            <div className="bg-surface-container-low rounded-lg p-space-sm flex items-start gap-space-sm">
              <span className="material-symbols-outlined text-primary text-lg mt-0.5">verified_user</span>
              <div className="flex flex-col flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-clinical-data text-clinical-data font-semibold text-on-surface">
                    Allergy Cross-Reactivity Shield
                  </span>
                  <span className="font-clinical-data-mono text-metadata-micro text-primary font-bold">
                    COMPLIANT
                  </span>
                </div>
                <p className="font-metadata-micro text-metadata-micro text-on-surface-variant mt-0.5 leading-relaxed">
                  Zero beta-lactam molecules in active order basket. Aspirin prescribed as Enteric-Coated 75mg gastro-buffered with co-prescribed PPI shielding gastric mucosa.
                </p>
              </div>
            </div>

            {/* Metric 2: Organ Clearance & Clearance Filter */}
            <div className="bg-surface-container-low rounded-lg p-space-sm flex items-start gap-space-sm">
              <span className="material-symbols-outlined text-primary text-lg mt-0.5">vital_signs</span>
              <div className="flex flex-col flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-clinical-data text-clinical-data font-semibold text-on-surface">
                    Renal &amp; Hepatic Dose Clearance
                  </span>
                  <span className="font-clinical-data-mono text-metadata-micro text-primary font-bold">
                    eGFR 98 mL/min
                  </span>
                </div>
                <p className="font-metadata-micro text-metadata-micro text-on-surface-variant mt-0.5 leading-relaxed">
                  Creatinine 0.82 mg/dL. Normal renal clearance. Atorvastatin 80mg cleared for unadjusted full acute coronary dose.
                </p>
              </div>
            </div>

            {/* Metric 3: Drug-Drug Interaction Matrix */}
            <div className="bg-surface-container-low rounded-lg p-space-sm flex items-start gap-space-sm">
              <span className="material-symbols-outlined text-secondary text-lg mt-0.5">info</span>
              <div className="flex flex-col flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-clinical-data text-clinical-data font-semibold text-on-surface">
                    Drug-Drug Synergy: DAPT + Metoprolol
                  </span>
                  <span className="font-clinical-data-mono text-metadata-micro text-secondary font-bold">
                    MONITORED SYNERGY
                  </span>
                </div>
                <p className="font-metadata-micro text-metadata-micro text-on-surface-variant mt-0.5 leading-relaxed">
                  Additive cardioprotective benefit. Heart rate telemetry linked (Current HR: 68 bpm, BP 124/78 mmHg). Standard ACC/AHA Guideline Class 1A recommendation.
                </p>
              </div>
            </div>
          </div>

          {/* Real-Time Official Digital Prescription (A4 Sheet Preview) */}
          <div className="bg-surface-container-lowest rounded-xl shadow-md p-space-panel-padding flex flex-col gap-space-sm">
            <div className="flex items-center justify-between pb-2 flex-wrap gap-1">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-base">print</span>
                <span className="font-metadata-micro text-metadata-micro uppercase tracking-wider text-outline font-bold">
                  Official Document Preview · Live Render
                </span>
              </div>
              <span className="font-clinical-data-mono text-metadata-micro bg-surface-container px-2 py-0.5 rounded text-on-surface">
                ISO A4 Scale 82%
              </span>
            </div>

            {/* Document Preview Canvas */}
            <div className="bg-surface-bright rounded-lg p-space-md shadow-inner flex flex-col gap-space-sm border border-outline-variant/40">
              {/* Hospital Official Header */}
              <div className="flex items-start justify-between pb-space-xs flex-wrap gap-2">
                <div className="flex flex-col">
                  <span className="font-page-title text-body-strong text-primary uppercase font-bold tracking-tight">
                    Apollo Indraprastha Hospitals
                  </span>
                  <span className="font-metadata-micro text-[10px] text-on-surface-variant leading-tight">
                    Center of Excellence in Cardiology · Sarita Vihar, Delhi Mathura Road, New Delhi 110076
                  </span>
                  <span className="font-clinical-data-mono text-[9px] text-outline">
                    NABH &amp; JCI Accredited Hospital · Tel: +91-11-2692-5858
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-clinical-data-mono text-metadata-micro bg-primary text-on-primary px-1.5 py-0.5 rounded font-bold">
                    FORM-RX-10
                  </span>
                </div>
              </div>

              {/* Doctor & Patient Micro Table */}
              <div className="grid grid-cols-2 gap-2 bg-surface-container-low p-2 rounded text-[11px] font-clinical-data">
                <div>
                  <span className="text-outline uppercase text-[9px] block font-semibold">Consultant / Attending</span>
                  <strong className="text-on-surface">Dr. Rohit Verma, MD, DM (Cardiology)</strong>
                  <span className="block text-outline text-[10px] font-clinical-data-mono">Reg: MCI-2009-08821</span>
                </div>
                <div>
                  <span className="text-outline uppercase text-[9px] block font-semibold">Patient Details</span>
                  <strong className="text-on-surface">Rahul Sharma (42M)</strong>
                  <span className="block text-outline text-[10px] font-clinical-data-mono">
                    UHID: DEL-2024-8841 · ABHA Verified
                  </span>
                </div>
              </div>

              {/* Micro Medication Lines */}
              <div className="flex flex-col gap-1 py-1">
                {medications.map((m, idx) => (
                  <div key={m.id} className="flex items-center justify-between text-[11px] font-clinical-data-mono">
                    <span className="font-semibold text-on-surface">
                      {idx + 1}. {m.name}
                    </span>
                    <span className="text-on-surface-variant font-medium">
                      {m.doseFreq} ({m.routeTiming}) · {m.duration}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer Verification, Seal & Tokenized ABDM QR */}
              <div className="flex items-end justify-between pt-space-xs mt-1 border-t border-outline-variant/30 flex-wrap gap-2">
                <div className="flex items-center gap-space-xs">
                  {/* Tokenized ABHA QR Code Placeholder */}
                  <div className="w-14 h-14 bg-surface-container-lowest p-1 rounded shadow-sm flex flex-col items-center justify-center">
                    <svg className="w-full h-full text-on-surface" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zm-5 0h2v3h-2v-3zm2 3h3v2h-3v-2zm3 3h3v3h-3v-3zm-5-1h2v4h-2v-4zm-3-2h3v2h-3v-2z" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-metadata-micro text-[10px] text-primary font-bold">
                      ABDM Fast-Link QR
                    </span>
                    <span className="font-clinical-data-mono text-[9px] text-outline">
                      Scan via Arogya Setu / PHR
                    </span>
                    <span className="font-metadata-micro text-[9px] text-on-surface-variant">
                      Payload: ABDM-M2-FHIR-Prescription
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 text-primary">
                    <span className="material-symbols-outlined text-sm">verified</span>
                    <span className="font-clinical-data-mono text-[10px] font-bold uppercase tracking-wider">
                      Class 3 Digital Sign Ready
                    </span>
                  </div>
                  <span className="font-body-strong text-clinical-data text-on-surface mt-0.5 font-semibold">
                    Dr. Rohit Verma
                  </span>
                  <span className="font-clinical-data-mono text-[9px] text-on-surface-variant">
                    MCI-2009-08821 · DSC Token #9941
                  </span>
                </div>
              </div>
            </div>

            {/* Pharmacy Destination Routing Strip */}
            <div className="bg-surface-container-low rounded-lg p-space-sm flex items-center justify-between text-clinical-data-mono text-metadata-micro flex-wrap gap-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">local_pharmacy</span>
                <span>
                  Target: <strong className="text-on-surface">Apollo Indraprastha IP/OP Pharmacy</strong>
                </span>
              </div>
              <span className="text-primary font-semibold">Priority: STAT / Discharge</span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM STICKY ACTION DOCK */}
      <div className="sticky bottom-0 w-full bg-surface-container-lowest shadow-[0_-4px_16px_rgba(0,0,0,0.06)] rounded-xl p-space-md mt-space-sm z-30 flex flex-wrap items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-md flex-wrap">
          <div className="flex items-center gap-space-xs text-clinical-data font-clinical-data">
            <span className="material-symbols-outlined text-primary text-lg">health_and_safety</span>
            <span className="font-bold text-on-surface">Prescription Engine:</span>
            <span className="text-primary font-semibold">{medications.length} Meds Ready for Signature</span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-metadata-micro font-clinical-data-mono text-on-surface-variant">
            <span>·</span>
            <span>ABDM FHIR Bundle: Validated</span>
            <span>·</span>
            <span>Dispense Cost Est: ₹1,480 (Covered by CGHS / TPA)</span>
          </div>
        </div>

        <div className="flex items-center gap-space-sm flex-wrap">
          <button
            onClick={() => triggerToast("Prescription draft saved to encounter #ENC-90214.")}
            className="bg-surface-container hover:bg-surface-container-high text-on-surface font-clinical-data text-clinical-data px-space-md h-9 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">save</span>
            <span>Save Clinical Draft</span>
          </button>
          <button
            onClick={() => {
              setShowPrintModal(true);
            }}
            className="bg-surface-container hover:bg-surface-container-high text-on-surface font-clinical-data text-clinical-data px-space-md h-9 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">print</span>
            <span>Print A4 Laser Rx</span>
          </button>
          <button
            onClick={() => {
              setShowAbhaModal(true);
            }}
            className="bg-secondary text-on-secondary hover:bg-secondary/90 font-clinical-data text-clinical-data px-space-md h-9 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">cloud_upload</span>
            <span>Push to ABHA Locker</span>
          </button>
          <button
            onClick={() => setShowSignModal(true)}
            className="bg-primary text-on-primary hover:bg-primary-container font-clinical-data text-clinical-data px-space-lg h-10 rounded-lg flex items-center gap-2 shadow-sm transition-all transform active:scale-95 font-semibold cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">draw</span>
            <span>Sign &amp; Route to Pharmacy</span>
          </button>
        </div>
      </div>

      {/* MODAL 1: SIGN & ROUTE TO PHARMACY */}
      {showSignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-inverse-surface/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-xl shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-primary text-on-primary px-gutter-normal py-space-sm flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-xl">draw</span>
                <h3 className="font-section-title text-section-title font-semibold">
                  Digitally Sign &amp; Route Prescription
                </h3>
              </div>
              <button
                onClick={() => setShowSignModal(false)}
                className="text-on-primary hover:opacity-80 cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-gutter-normal flex flex-col gap-space-sm text-clinical-data">
              <div className="p-3 bg-surface-container-low rounded-lg text-metadata-micro leading-relaxed">
                <div>Prescriber: <strong>Dr. Rohit Verma (Cardiology)</strong></div>
                <div>DSC Token: <strong>#9941 (MCI-2009-08821)</strong></div>
                <div>Patient: <strong>Rahul Sharma (DEL-2024-8841)</strong></div>
                <div>Items: <strong>{medications.length} Medications (DAPT STEMI Protocol)</strong></div>
                <div>Target: <strong>Apollo Central Pharmacy Dispense Robot #4</strong></div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-metadata-micro font-semibold uppercase text-outline">
                  Enter Clinician DSC PIN / Passphrase
                </label>
                <input
                  type="password"
                  defaultValue="••••••••"
                  className="p-2 bg-surface-container-low rounded border border-outline-variant font-clinical-data-mono tracking-widest"
                />
              </div>

              <div className="flex items-center justify-end gap-space-xs pt-space-xs">
                <button
                  onClick={() => setShowSignModal(false)}
                  className="px-space-md py-1.5 bg-surface-container-low text-on-surface rounded font-clinical-data cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowSignModal(false);
                    triggerToast("Prescription digitally signed & dispatched to Central Pharmacy!");
                  }}
                  className="px-space-md py-1.5 bg-primary text-on-primary rounded font-body-strong text-clinical-data shadow-md flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">verified</span>
                  <span>Confirm Digital Signature</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: PRINT A4 LASER RX PREVIEW */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-inverse-surface/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-surface-container-lowest w-full max-w-xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-surface-container-high px-gutter-normal py-space-sm flex items-center justify-between">
              <h3 className="font-section-title text-section-title font-semibold text-on-surface flex items-center gap-1">
                <span className="material-symbols-outlined text-primary">print</span>
                <span>Print Official A4 Laser Prescription</span>
              </h3>
              <button
                onClick={() => setShowPrintModal(false)}
                className="text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-gutter-normal flex flex-col gap-space-sm overflow-y-auto">
              <div className="border border-outline-variant p-4 rounded-lg bg-surface flex flex-col gap-2 font-clinical-data text-xs">
                <div className="text-center font-bold text-primary text-sm">APOLLO INDRAPRASTHA HOSPITALS</div>
                <div className="text-center text-[10px] text-outline">Sarita Vihar, New Delhi · NABH &amp; JCI Accredited</div>
                <div className="border-t border-outline-variant my-1"></div>
                <div className="flex justify-between text-[11px]">
                  <span>Patient: <strong>Rahul Sharma (42M)</strong></span>
                  <span>UHID: <strong>DEL-2024-8841</strong></span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>Doctor: <strong>Dr. Rohit Verma (Cardiology)</strong></span>
                  <span>Date: <strong>04-Jul-2026 14:45 IST</strong></span>
                </div>
                <div className="border-t border-outline-variant my-1"></div>
                <div className="font-bold text-primary">Rx (Medications):</div>
                {medications.map((m, i) => (
                  <div key={m.id} className="flex justify-between font-clinical-data-mono text-[11px]">
                    <span>{i + 1}. {m.name}</span>
                    <span>{m.doseFreq} ({m.duration})</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-space-sm bg-surface-container-low flex justify-end gap-space-xs">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-space-md py-1.5 bg-surface-container text-on-surface rounded cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowPrintModal(false);
                  window.print();
                }}
                className="px-space-md py-1.5 bg-primary text-on-primary rounded font-semibold cursor-pointer"
              >
                Print Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: PUSH TO ABHA LOCKER */}
      {showAbhaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-inverse-surface/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-xl shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-secondary text-on-secondary px-gutter-normal py-space-sm flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-xl">cloud_upload</span>
                <h3 className="font-section-title text-section-title font-semibold">
                  Push to ABHA Health Locker
                </h3>
              </div>
              <button
                onClick={() => setShowAbhaModal(false)}
                className="text-on-secondary hover:opacity-80 cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-gutter-normal flex flex-col gap-space-sm text-clinical-data">
              <p className="text-on-surface leading-relaxed">
                Transmitting FHIR <code>MedicationRequest</code> bundle to Patient ABHA ID: <strong>91-8842-1920-4491</strong> (Rahul Sharma).
              </p>
              <div className="p-2 bg-surface-container-low rounded font-clinical-data-mono text-metadata-micro text-outline">
                Encryption: ECDH P-256 + AES-GCM-256 (ABDM Compliant)
              </div>
              <div className="flex justify-end gap-space-xs pt-2">
                <button
                  onClick={() => setShowAbhaModal(false)}
                  className="px-space-md py-1.5 bg-surface-container text-on-surface rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowAbhaModal(false);
                    triggerToast("Prescription pushed to patient's ABHA Health Locker!");
                  }}
                  className="px-space-md py-1.5 bg-primary text-on-primary rounded font-semibold cursor-pointer"
                >
                  Confirm Push
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: BATCH ADJUST DOSAGES */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-inverse-surface/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-xl shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-surface-container-high px-gutter-normal py-space-sm flex items-center justify-between">
              <h3 className="font-section-title text-section-title font-semibold text-on-surface flex items-center gap-1">
                <span className="material-symbols-outlined text-primary">tune</span>
                <span>Batch Adjust Dosages</span>
              </h3>
              <button
                onClick={() => setShowBatchModal(false)}
                className="text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-gutter-normal flex flex-col gap-space-sm text-clinical-data">
              <div className="flex items-center justify-between p-2 bg-surface-container-low rounded">
                <span>Extend Duration to 60 Days (All Meds)</span>
                <button
                  onClick={() => {
                    setMedications(medications.map((m) => ({ ...m, duration: "60 Days", dispense: "60 Tabs" })));
                    triggerToast("All medications updated to 60-day duration.");
                    setShowBatchModal(false);
                  }}
                  className="px-2 py-1 bg-primary text-on-primary rounded text-xs font-semibold cursor-pointer"
                >
                  Apply
                </button>
              </div>
              <div className="flex items-center justify-between p-2 bg-surface-container-low rounded">
                <span>Set All Refills to 2 Refills</span>
                <button
                  onClick={() => {
                    setMedications(medications.map((m) => ({ ...m, extraValue: "2 Authorized" })));
                    triggerToast("Refills updated to 2.");
                    setShowBatchModal(false);
                  }}
                  className="px-2 py-1 bg-primary text-on-primary rounded text-xs font-semibold cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
