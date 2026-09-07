/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";

interface ClinicSlot {
  id: string;
  duration: string;
  durationUnit: string;
  title: string;
  tag: string;
  tagBg: string;
  location: string;
  actions: string;
  date: string;
  time: string;
}

const INITIAL_SLOTS: ClinicSlot[] = [
  {
    id: "slot-7d",
    duration: "07",
    durationUnit: "Days",
    title: "Cardiology OPD Review & Access Site Check",
    tag: "Confirmed",
    tagBg: "bg-primary/15 text-primary",
    location: "Dr. Rohit Verma · Cardiology OPD Wing B · Station 04",
    actions: "Actions: Right radial puncture site inspection, 12-lead baseline ECG, medication reconciliation.",
    date: "25 Oct 2024",
    time: "10:30 AM IST",
  },
  {
    id: "slot-30d",
    duration: "30",
    durationUnit: "Days",
    title: "Echo Re-assessment & Comprehensive Metabolic Panel",
    tag: "Diagnostic Re-Evaluation",
    tagBg: "bg-secondary-container text-on-secondary-container",
    location: "Non-Invasive Cardiac Lab & Apollo Central Biochemistry",
    actions: "Actions: Repeat 2D Transthoracic Echo for LVEF recovery, Fasting Lipids (LDL target <55), Serum Cr, SGPT.",
    date: "17 Nov 2024",
    time: "09:00 AM IST",
  },
  {
    id: "slot-3m",
    duration: "03",
    durationUnit: "Months",
    title: "Endocrinology & Cardio-Renal Risk Consult",
    tag: "Multi-Disciplinary",
    tagBg: "bg-surface-container-highest text-on-surface",
    location: "Dr. Sameer Kulkarni (Endocrinology Suite 12)",
    actions: "Actions: Re-initiation of oral hypoglycemics (SGLT2i Empagliflozin / GLP-1 RA evaluation for CV benefits).",
    date: "16 Jan 2025",
    time: "11:15 AM IST",
  },
];

export default function CarePlanPage() {
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [slots, setSlots] = useState<ClinicSlot[]>(INITIAL_SLOTS);

  // Checkboxes for patient daily routine
  const [checkMorning, setCheckMorning] = useState(true);
  const [checkEvening, setCheckEvening] = useState(true);
  const [checkVitals, setCheckVitals] = useState(false);

  // Modals
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [showAbdmModal, setShowAbdmModal] = useState(false);
  const [showAddSlotModal, setShowAddSlotModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [contactMember, setContactMember] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New slot form
  const [newSlotTitle, setNewSlotTitle] = useState("");
  const [newSlotDuration, setNewSlotDuration] = useState("06");
  const [newSlotUnit, setNewSlotUnit] = useState("Months");
  const [newSlotDate, setNewSlotDate] = useState("18 Apr 2025");
  const [newSlotTime, setNewSlotTime] = useState("10:00 AM IST");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleAddSlot = () => {
    if (!newSlotTitle.trim()) return;
    const newEntry: ClinicSlot = {
      id: "slot-" + Date.now(),
      duration: newSlotDuration,
      durationUnit: newSlotUnit,
      title: newSlotTitle,
      tag: "Follow-up Added",
      tagBg: "bg-primary/20 text-primary",
      location: "Cardiology Ambulatory Clinic · Station 04",
      actions: "Scheduled review & longitudinal reassessment.",
      date: newSlotDate,
      time: newSlotTime,
    };
    setSlots(prev => [...prev, newEntry]);
    setShowAddSlotModal(false);
    showToast(`Added [${newSlotTitle}] to post-discharge schedule.`);
  };

  return (
    <div className="flex flex-col w-full">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary-container text-on-primary-container px-space-md py-space-sm rounded-xl shadow-2xl flex items-center gap-space-sm border border-primary/20 animate-in fade-in slide-in-from-bottom-2">
          <span className="material-symbols-outlined text-2xl text-primary">check_circle</span>
          <div className="flex flex-col">
            <span className="font-body-strong text-clinical-data font-bold">Care Plan Updated</span>
            <span className="font-metadata-micro text-metadata-micro opacity-90 font-clinical-data-mono">{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* STICKY CLINICAL PATIENT & STRATEGY SUB-BANNER */}
      <section className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md mb-space-base flex flex-col gap-space-sm relative overflow-hidden border border-outline-variant/30">
        {/* Ambient Status Glow Indicator */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-gradient-to-br from-primary-fixed/30 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        {/* Patient Context Row */}
        <div className="flex flex-wrap items-center justify-between gap-y-space-xs gap-x-space-md">
          <div className="flex items-center gap-space-sm min-w-0">
            <div className="h-10 w-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-clinical-data font-semibold text-subheading shrink-0 shadow-sm">
              RS
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-space-xs flex-wrap">
                <span className="font-page-title text-section-title text-on-surface truncate">Rahul Sharma</span>
                <span className="font-clinical-data text-clinical-data text-on-surface-variant">42Y · Male</span>
                <span className="bg-surface-container text-on-surface px-space-xs py-0.5 rounded font-clinical-data-mono text-metadata-micro font-semibold">
                  Token #104
                </span>
                <span className="bg-primary/10 text-primary px-space-xs py-0.5 rounded font-clinical-data-mono text-metadata-micro font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">verified</span>ABHA 91-8842-1920-4491
                </span>
                <span className="bg-error-container text-on-error-container px-space-xs py-0.5 rounded font-body-strong text-metadata-micro flex items-center gap-1 uppercase tracking-wider">
                  <span className="material-symbols-outlined text-xs">e911_emergency</span>Acute STEMI · Primary PCI Done
                </span>
              </div>
              <div className="flex items-center gap-space-md font-metadata-micro text-metadata-micro text-on-surface-variant flex-wrap mt-0.5">
                <span>
                  UHID: <strong className="font-clinical-data-mono text-on-surface">DEL-2024-8841</strong>
                </span>
                <span>
                  Bed: <strong className="text-on-surface">CCU-04 (Cath Recovery)</strong>
                </span>
                <span>
                  Attending: <strong className="text-on-surface">Dr. Rohit Verma (Interventional Cardiology)</strong>
                </span>
                <span>
                  Admission: <strong className="text-on-surface">18 Oct 2024, 03:45 IST</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Group */}
          <div className="flex items-center gap-space-xs shrink-0 flex-wrap">
            <button
              onClick={() => setShowVersionModal(true)}
              className="bg-surface-container-low hover:bg-surface-container text-on-surface font-body-strong text-clinical-data px-space-md h-9 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-sm text-secondary">history</span>
              <span>Version Log</span>
            </button>
            <button
              onClick={() => setShowAbdmModal(true)}
              className="bg-primary hover:bg-primary-container text-on-primary font-body-strong text-clinical-data px-space-md h-9 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">cloud_sync</span>
              <span>Sync ABDM Locker</span>
            </button>
          </div>
        </div>

        {/* Active Strategy Bar & Metrics Overview */}
        <div className="bg-surface-container-low rounded-lg p-space-sm flex flex-wrap items-center justify-between gap-space-sm border border-outline-variant/20">
          <div className="flex items-center gap-space-sm">
            <div className="p-2 bg-primary-container text-on-primary-container rounded-lg flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-xl">route</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-subheading text-clinical-data text-on-surface font-bold">
                  Longitudinal Strategy: Multi-Disciplinary Post-PCI Pathway
                </span>
                <span className="bg-surface-container-highest text-on-surface font-clinical-data-mono text-metadata-micro px-1.5 py-0.5 rounded font-semibold">
                  v2.4 (Active)
                </span>
              </div>
              <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                Protocol: ESC/ACC STEMI Guideline 2023 · Dual Antiplatelet &amp; Cardio-Renal Risk Reduction
              </span>
            </div>
          </div>
          <div className="flex items-center gap-space-md flex-wrap">
            <div className="flex items-center gap-2 px-space-sm py-1 bg-surface-container-lowest rounded-lg shadow-sm border border-outline-variant/20">
              <span className="material-symbols-outlined text-primary text-base">flag</span>
              <div className="flex flex-col">
                <span className="font-clinical-data-mono text-clinical-data font-bold text-on-surface leading-none">5/5</span>
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant leading-tight">Goals Set</span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-space-sm py-1 bg-surface-container-lowest rounded-lg shadow-sm border border-outline-variant/20">
              <span className="material-symbols-outlined text-tertiary text-base">groups</span>
              <div className="flex flex-col">
                <span className="font-clinical-data-mono text-clinical-data font-bold text-on-surface leading-none">4</span>
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant leading-tight">
                  Referrals Logged
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-space-sm py-1 bg-surface-container-lowest rounded-lg shadow-sm border border-outline-variant/20">
              <span className="material-symbols-outlined text-secondary text-base">directions_walk</span>
              <div className="flex flex-col">
                <span className="font-clinical-data-mono text-clinical-data font-bold text-on-surface leading-none">3</span>
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant leading-tight">
                  Rehab Milestones
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-space-sm py-1 bg-surface-container-lowest rounded-lg shadow-sm border border-outline-variant/20">
              <span className="material-symbols-outlined text-primary-container text-base">menu_book</span>
              <div className="flex flex-col">
                <span className="font-clinical-data-mono text-clinical-data font-bold text-on-surface leading-none">Ready</span>
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant leading-tight">
                  ABDM Handout
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12-COLUMN MAIN WORKSPACE GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-base items-start">
        {/* LEFT & CENTER: Chronological Care Plan Phases (8 Cols) */}
        <div className="xl:col-span-8 flex flex-col gap-space-base">
          {/* PHASE 1: ACUTE INTERVENTIONAL & CCU (0-48H) */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/30">
            {/* Phase Banner Header */}
            <div className="bg-surface-container-low px-space-panel-padding py-space-sm flex flex-wrap items-center justify-between gap-2 border-b border-outline-variant/20">
              <div className="flex items-center gap-space-sm">
                <div className="h-8 w-8 rounded-lg bg-error-container text-on-error-container flex items-center justify-center font-clinical-data-mono text-clinical-data font-bold">
                  01
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-section-title text-subheading text-on-surface font-semibold">
                      Phase 1: Acute Interventional &amp; CCU Surveillance
                    </h3>
                    <span className="bg-error text-on-error px-2 py-0.5 rounded font-metadata-micro text-metadata-micro uppercase tracking-wider font-semibold">
                      In-Progress · Day 1
                    </span>
                  </div>
                  <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    Window: Immediate 0 - 48 Hours Post-Arrest / Intervention · Hemodynamic &amp; Infarct Stability
                  </p>
                </div>
              </div>
              <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant bg-surface-container-lowest px-2 py-1 rounded shadow-sm">
                Updated 18 min ago
              </span>
            </div>

            <div className="p-space-panel-padding flex flex-col gap-space-base">
              {/* Timeline & Goal 1 */}
              <div className="flex gap-space-md items-start">
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-sm">favorite</span>
                  </div>
                  <div className="w-0.5 h-full bg-surface-container-high my-1"></div>
                </div>
                <div className="flex-1 bg-surface-container-low/60 rounded-xl p-space-md border border-outline-variant/20">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-space-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-body-strong text-clinical-data text-on-surface">
                        Goal 1: Reperfusion &amp; Infarct Artery Patency
                      </span>
                      <span className="bg-primary/20 text-primary font-clinical-data-mono text-metadata-micro px-1.5 py-0.5 rounded font-semibold">
                        Achieved · TIMI 3 Flow
                      </span>
                    </div>
                    <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                      Cath Lab #2 · Dr. R. Verma
                    </span>
                  </div>
                  <p className="font-body-default text-clinical-data text-on-surface mb-space-sm leading-relaxed">
                    Successful primary PCI with single Drug-Eluting Stent (DES 3.5 x 28mm) to mid-LAD 99% thrombotic lesion. Full
                    continuous 12-lead ST-segment resolution achieved (&gt;70% at 90 min post-reperfusion).
                  </p>
                  {/* Clinical Parameter Box */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-space-xs bg-surface-container-lowest rounded-lg p-space-sm text-center border border-outline-variant/20">
                    <div>
                      <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">Pre-PCI TIMI</div>
                      <div className="font-clinical-data-mono text-clinical-data font-bold text-error">Grade 0</div>
                    </div>
                    <div>
                      <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">Post-PCI TIMI</div>
                      <div className="font-clinical-data-mono text-clinical-data font-bold text-primary">Grade 3</div>
                    </div>
                    <div>
                      <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">Peak Troponin-I</div>
                      <div className="font-clinical-data-mono text-clinical-data font-bold text-error">24.8 ng/mL</div>
                    </div>
                    <div>
                      <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">LVEF (Post-PCI)</div>
                      <div className="font-clinical-data-mono text-clinical-data font-bold text-tertiary">42% (Echo)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline & Goal 2 */}
              <div className="flex gap-space-md items-start">
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-sm">monitor_heart</span>
                  </div>
                  <div className="w-0.5 h-full bg-surface-container-high my-1"></div>
                </div>
                <div className="flex-1 bg-surface-container-low/60 rounded-xl p-space-md border border-outline-variant/20">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-space-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-body-strong text-clinical-data text-on-surface">
                        Goal 2: Hemodynamic &amp; Arrhythmia Surveillance
                      </span>
                      <span className="bg-primary/20 text-primary font-clinical-data-mono text-metadata-micro px-1.5 py-0.5 rounded font-semibold">
                        Target Stable
                      </span>
                    </div>
                    <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                      CCU Central Telemetry
                    </span>
                  </div>
                  <p className="font-body-default text-clinical-data text-on-surface mb-space-sm leading-relaxed">
                    Maintain MAP between 70–100 mmHg; strict vigilance for reperfusion-induced malignant ventricular arrhythmias
                    (VT/VF). Heart rate targeted at 60–75 bpm with careful oral Metoprolol Succinate titration once normotensive.
                  </p>
                  {/* Telemetry Sparkline Graphic Simulation */}
                  <div className="bg-surface-container-lowest rounded-lg p-space-sm flex flex-wrap items-center justify-between gap-space-md border border-outline-variant/20">
                    <div className="flex items-center gap-space-sm">
                      <div className="flex flex-col">
                        <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">Current Rhythm</span>
                        <span className="font-clinical-data-mono text-clinical-data font-bold text-on-surface">
                          Sinus @ 68 bpm
                        </span>
                      </div>
                      <div className="h-6 w-px bg-surface-variant"></div>
                      <div className="flex flex-col">
                        <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">Non-Invasive BP</span>
                        <span className="font-clinical-data-mono text-clinical-data font-bold text-on-surface">
                          118/76 (MAP 90)
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">48h Rhythm Trend:</span>
                      <svg className="w-28 h-6 text-primary stroke-current fill-none stroke-2" viewBox="0 0 100 24">
                        <path d="M0,12 L20,12 L24,6 L28,18 L32,4 L36,20 L40,12 L50,12 L54,8 L58,16 L62,12 L75,12 L80,5 L84,19 L88,12 L100,12"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline & Goal 3 */}
              <div className="flex gap-space-md items-start">
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-sm">water_drop</span>
                  </div>
                </div>
                <div className="flex-1 bg-surface-container-low/60 rounded-xl p-space-md border border-outline-variant/20">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-space-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-body-strong text-clinical-data text-on-surface">
                        Goal 3: Glycemic Optimization &amp; Contrast Nephropathy Protection
                      </span>
                      <span className="bg-secondary-container text-on-secondary-container font-clinical-data-mono text-metadata-micro px-1.5 py-0.5 rounded font-semibold">
                        Protocol Active
                      </span>
                    </div>
                    <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                      Endocrine Guidance
                    </span>
                  </div>
                  <p className="font-body-default text-clinical-data text-on-surface mb-space-xs leading-relaxed">
                    Maintain bedside glucose 140–180 mg/dL (7.8–10.0 mmol/L) without hypoglycemia using subcutaneous sliding-scale
                    regular insulin. <strong>Metformin strictly held for 48 hours post-contrast</strong> until re-check of Serum
                    Creatinine and eGFR.
                  </p>
                  <div className="flex items-center gap-space-xs text-metadata-micro font-metadata-micro text-error font-semibold">
                    <span className="material-symbols-outlined text-sm">warning</span>
                    <span>Contrast volume logged: 120 mL Iohexol. Target urine output &gt;0.5 mL/kg/h.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PHASE 2: INPATIENT STEP-DOWN & REHAB (DAY 3 - DAY 5) */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/30">
            <div className="bg-surface-container-low px-space-panel-padding py-space-sm flex flex-wrap items-center justify-between gap-2 border-b border-outline-variant/20">
              <div className="flex items-center gap-space-sm">
                <div className="h-8 w-8 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center font-clinical-data-mono text-clinical-data font-bold">
                  02
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-section-title text-subheading text-on-surface font-semibold">
                      Phase 2: Inpatient Step-Down &amp; Phase 1 Cardiac Rehab
                    </h3>
                    <span className="bg-surface-container-highest text-on-surface-variant px-2 py-0.5 rounded font-metadata-micro text-metadata-micro uppercase tracking-wider font-semibold">
                      Scheduled · Step-Down Ward B
                    </span>
                  </div>
                  <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    Window: Inpatient Day 3 to Day 5 · Secondary Prevention Titration &amp; Ambulation
                  </p>
                </div>
              </div>
              <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">Ward Bed: Reserved 308-B</span>
            </div>

            <div className="p-space-panel-padding flex flex-col gap-space-base">
              {/* Medication Plan Row */}
              <div className="bg-surface-container-low/60 rounded-xl p-space-md border border-outline-variant/20">
                <div className="flex items-center justify-between mb-space-xs">
                  <span className="font-body-strong text-clinical-data text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-base">medication</span>
                    Goal 4: Secondary Prevention Guideline-Directed Medical Therapy (GDMT)
                  </span>
                  <span className="font-clinical-data-mono text-metadata-micro bg-primary-container text-on-primary-container px-2 py-0.5 rounded">
                    Ordered in EHR
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm mt-space-sm">
                  <div className="bg-surface-container-lowest p-space-sm rounded-lg flex items-start gap-space-xs border border-outline-variant/20">
                    <div className="h-7 w-7 rounded bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-sm">pill</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-body-strong text-clinical-data text-on-surface">
                        Dual Antiplatelet Therapy (DAPT)
                      </span>
                      <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                        Ticagrelor 90mg BD + Aspirin 75mg OD
                      </span>
                      <span className="font-metadata-micro text-metadata-micro text-primary mt-1 font-semibold">
                        Duration: Minimum 12 Months non-interrupted
                      </span>
                    </div>
                  </div>
                  <div className="bg-surface-container-lowest p-space-sm rounded-lg flex items-start gap-space-xs border border-outline-variant/20">
                    <div className="h-7 w-7 rounded bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-sm">healing</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-body-strong text-clinical-data text-on-surface">High-Intensity Statin Therapy</span>
                      <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                        Atorvastatin 80mg Once Nightly
                      </span>
                      <span className="font-metadata-micro text-metadata-micro text-secondary mt-1 font-semibold">
                        Target: LDL &lt; 55 mg/dL (&gt;50% reduction)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rehab & Mobility Milestone */}
              <div className="bg-surface-container-low/60 rounded-xl p-space-md flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md border border-outline-variant/20">
                <div className="flex items-start gap-space-sm">
                  <div className="h-9 w-9 rounded-lg bg-surface-container-highest text-on-surface flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-lg">accessibility_new</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-body-strong text-clinical-data text-on-surface">
                      Phase 1 Supervised Inpatient Cardiac Rehabilitation
                    </span>
                    <span className="font-body-default text-clinical-data text-on-surface-variant">
                      Borg RPE &lt; 11 · Seated mobility Day 2, supervised 50m corridor ambulation Day 3.
                    </span>
                    <span className="font-metadata-micro text-metadata-micro text-on-surface-variant mt-0.5">
                      Coach: Sr. Ancy Thomas (Cardiovascular Nurse Specialist)
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-space-xs shrink-0 self-end md:self-center">
                  <span className="bg-surface-container-lowest px-2 py-1 rounded font-clinical-data-mono text-metadata-micro text-on-surface border border-outline-variant/20">
                    Rest HR: &lt;100 bpm
                  </span>
                  <span className="bg-surface-container-lowest px-2 py-1 rounded font-clinical-data-mono text-metadata-micro text-on-surface border border-outline-variant/20">
                    SpO2: &gt;95% RA
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* PHASE 3: POST-DISCHARGE LONGITUDINAL FOLLOW-UP SCHEDULE (WEEK 2 TO MONTH 12) */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/30">
            <div className="bg-surface-container-low px-space-panel-padding py-space-sm flex flex-wrap items-center justify-between gap-2 border-b border-outline-variant/20">
              <div className="flex items-center gap-space-sm">
                <div className="h-8 w-8 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center font-clinical-data-mono text-clinical-data font-bold">
                  03
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-section-title text-subheading text-on-surface font-semibold">
                      Phase 3: Post-Discharge Longitudinal Schedule
                    </h3>
                    <span className="bg-surface-container-highest text-on-surface px-2 py-0.5 rounded font-metadata-micro text-metadata-micro uppercase tracking-wider font-semibold">
                      Structured OPD Follow-ups
                    </span>
                  </div>
                  <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    Window: Day 7 Post-Discharge through 12 Months Surveillance
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddSlotModal(true)}
                className="bg-surface-container-lowest hover:bg-surface-container text-primary font-body-strong text-metadata-micro px-2 py-1 rounded shadow-sm flex items-center gap-1 transition-colors border border-outline-variant/30"
              >
                <span className="material-symbols-outlined text-xs">add</span>Add Clinic Slot
              </button>
            </div>

            <div className="p-space-panel-padding flex flex-col gap-space-sm">
              {slots.map(slot => (
                <div
                  key={slot.id}
                  className="p-space-sm bg-surface-container-low/40 hover:bg-surface-container-low rounded-lg transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm border border-outline-variant/10"
                >
                  <div className="flex items-start gap-space-sm">
                    <div className="p-2 bg-primary/10 text-primary rounded-lg text-center min-w-[54px]">
                      <div className="font-clinical-data-mono text-section-title font-bold leading-tight">{slot.duration}</div>
                      <div className="font-metadata-micro text-[9px] uppercase tracking-wide">{slot.durationUnit}</div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-body-strong text-clinical-data text-on-surface">{slot.title}</span>
                        <span className={`${slot.tagBg} text-[10px] font-semibold px-1.5 py-0.2 rounded`}>{slot.tag}</span>
                      </div>
                      <span className="font-body-default text-clinical-data text-on-surface-variant">{slot.location}</span>
                      <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">{slot.actions}</span>
                    </div>
                  </div>
                  <div className="sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end gap-1">
                    <span className="font-clinical-data-mono text-clinical-data text-on-surface font-semibold">
                      {slot.date}
                    </span>
                    <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">{slot.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Multi-Disciplinary Team & Patient-Facing Handout (4 Cols) */}
        <div className="xl:col-span-4 flex flex-col gap-space-base">
          {/* Care Coordination Team Panel */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-panel-padding flex flex-col gap-space-sm border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">diversity_3</span>
                <h3 className="font-section-title text-clinical-data text-on-surface font-semibold">Care Coordination Team</h3>
              </div>
              <span className="bg-surface-container text-on-surface font-clinical-data-mono text-metadata-micro px-1.5 py-0.5 rounded font-semibold">
                4 Specialists
              </span>
            </div>
            <div className="flex flex-col gap-space-xs mt-space-2xs">
              {/* Member 1 */}
              <div className="flex items-center justify-between p-space-xs hover:bg-surface-container-low rounded-lg transition-colors">
                <div className="flex items-center gap-space-xs">
                  <img
                    className="w-8 h-8 rounded-full object-cover shadow-sm ring-1 ring-outline-variant"
                    alt="Dr. Rohit Verma"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpscNdIoUd43tt1AkJFE-c0OxasnZvG9ijjultbv7909z9YGLZMThSLXgCEMe0MjwFyXJ7lH5teGNqiWNP7SjW4a8UxcI3aOU85-NIdN3QfrKClqgEwz9PEyVUnPl-XzjJN3gzlZQLlt54A_EhhMSouVWPol-Pc2FwRdrwNka3nB8EggNH1zTF4TTxTuGcGnYRCnAHgC4zK46IrnNkFceIui6-OeurosxFO4ucuyDNJn9bZXwXaiV-"
                  />
                  <div className="flex flex-col">
                    <span className="font-body-strong text-clinical-data text-on-surface leading-tight">Dr. Rohit Verma</span>
                    <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                      Lead Interventional Cardiologist
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setContactMember("Dr. Rohit Verma (Lead Cardiologist) · Ext 4092")}
                  className="material-symbols-outlined text-primary text-sm cursor-pointer hover:opacity-80"
                  title="Call Extension"
                >
                  call
                </button>
              </div>

              {/* Member 2 */}
              <div className="flex items-center justify-between p-space-xs hover:bg-surface-container-low rounded-lg transition-colors">
                <div className="flex items-center gap-space-xs">
                  <img
                    className="w-8 h-8 rounded-full object-cover shadow-sm ring-1 ring-outline-variant"
                    alt="Dr Sameer Kulkarni"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgPVyoAb30vReK7V7hTJwwZBCfm5fi-QRUtlrRPTjbkfOPOmawXNHjN3bLutF-c6sW6GokrU60V1KdaLA5DjMi6i6TaIAh1AxhZgJYy4wmrMhXZ6LK6SQ_M3Q9Cn0fvnoc5W3mqUqldtVWYmAk9Qh7McI_t_7g48IoWDSNS_cdzbxJbsZVF2YAkdW5so6zW5SGgOWntboO7oXES7qM0btxs-LG1hGY6TJzxXcdOvR8WfIB27pEYzCe"
                  />
                  <div className="flex flex-col">
                    <span className="font-body-strong text-clinical-data text-on-surface leading-tight">Dr. Sameer Kulkarni</span>
                    <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                      Secondary Attending · Endocrinology
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setContactMember("Dr. Sameer Kulkarni (Endocrinology) · dr.kulkarni@apollo.delhi")}
                  className="material-symbols-outlined text-secondary text-sm cursor-pointer hover:opacity-80"
                  title="Email"
                >
                  mail
                </button>
              </div>

              {/* Member 3 */}
              <div className="flex items-center justify-between p-space-xs hover:bg-surface-container-low rounded-lg transition-colors">
                <div className="flex items-center gap-space-xs">
                  <img
                    className="w-8 h-8 rounded-full object-cover shadow-sm ring-1 ring-outline-variant"
                    alt="Sr. Ancy Thomas"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCp3-yPosHoTxdn2YO8DtdO0LjV3T1j7jmCqoMRebO1wfHfeo3WJ2zKgbD4bfPB8gneAdIcG2bmRUleRO9kz7rLtaNb9IVPHz8Fe_SO5sBFZiocHxJiKqWGLI34hXwnku49tjhLbtSBz3bJPQJBJsg_zgmjmiw_JsNxLQdHXGDDkRxmdHPFjaeQqkydvHRZsIE2S0HMAlychJ953auk9TIZkdxbDJmd4FtuDZ2TdLoqwxZ_hdw2Ny3H"
                  />
                  <div className="flex flex-col">
                    <span className="font-body-strong text-clinical-data text-on-surface leading-tight">Sr. Ancy Thomas, RN</span>
                    <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                      Clinical Nurse Specialist &amp; Rehab Coach
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setContactMember("Sr. Ancy Thomas (CCU Nurse Station) · Pager 302")}
                  className="material-symbols-outlined text-primary text-sm cursor-pointer hover:opacity-80"
                  title="Internal Chat"
                >
                  chat
                </button>
              </div>

              {/* Member 4 */}
              <div className="flex items-center justify-between p-space-xs hover:bg-surface-container-low rounded-lg transition-colors">
                <div className="flex items-center gap-space-xs">
                  <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-clinical-data text-metadata-micro font-bold shadow-sm">
                    PI
                  </div>
                  <div className="flex flex-col">
                    <span className="font-body-strong text-clinical-data text-on-surface leading-tight">Ms. Pooja Iyer, RD</span>
                    <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                      Dietitian &amp; Metabolic Counselor
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setContactMember("Ms. Pooja Iyer (Clinical Nutrition) · Ext 218")}
                  className="material-symbols-outlined text-secondary text-sm cursor-pointer hover:opacity-80"
                  title="Dietetics Chat"
                >
                  chat
                </button>
              </div>
            </div>
          </div>

          {/* Patient-Facing Handout Preview (Bilingual English / Hindi) */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-panel-padding flex flex-col gap-space-sm relative border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-base">chrome_reader_mode</span>
                <h3 className="font-section-title text-clinical-data text-on-surface font-semibold">
                  Patient-Facing Handout Preview
                </h3>
              </div>
              <span className="bg-primary/10 text-primary font-clinical-data-mono text-metadata-micro px-1.5 py-0.5 rounded font-bold">
                ABDM Verified
              </span>
            </div>

            {/* Bilingual Tabs Indicator */}
            <div className="flex items-center bg-surface-container-low p-0.5 rounded-lg text-metadata-micro font-clinical-data border border-outline-variant/20">
              <button
                onClick={() => setLang("en")}
                className={`flex-1 py-1 text-center rounded font-semibold transition-all ${
                  lang === "en" ? "bg-surface-container-lowest text-on-surface shadow-sm" : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLang("hi")}
                className={`flex-1 py-1 text-center rounded font-semibold transition-all ${
                  lang === "hi" ? "bg-surface-container-lowest text-on-surface shadow-sm" : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                हिन्दी (Hindi)
              </button>
            </div>

            {/* Red-Flag Emergency Action Protocol */}
            <div className="bg-error-container/60 rounded-lg p-space-sm flex flex-col gap-1 border border-error/20">
              <div className="flex items-center gap-1.5 text-on-error-container">
                <span className="material-symbols-outlined text-base">emergency_share</span>
                <span className="font-body-strong text-clinical-data font-bold">
                  {lang === "en" ? "RED FLAG: When to Call 108" : "आपातकालीन चेतावनी: १०८ पर तुरंत कॉल करें"}
                </span>
              </div>
              <p className="font-body-default text-metadata-micro text-on-error-container leading-relaxed">
                {lang === "en"
                  ? "Immediately call emergency ambulance (108) or return to Apollo Emergency if Rahul experiences:"
                  : "यदि राहुल को निम्नलिखित में से कोई भी लक्षण हो, तो तुरंत एम्बुलेंस (१०८) बुलाएँ या अपोलो इमरजेंसी पहुँचें:"}
              </p>
              <ul className="font-metadata-micro text-metadata-micro text-on-error-container list-disc list-inside space-y-0.5 font-medium">
                {lang === "en" ? (
                  <>
                    <li>Crushing retrosternal chest pain lasting &gt; 5 minutes</li>
                    <li>Sudden severe shortness of breath or sweating</li>
                    <li>Sudden fainting, dizziness, or irregular fluttering heartbeat</li>
                    <li>Uncontrolled bleeding or swelling at the wrist puncture site</li>
                  </>
                ) : (
                  <>
                    <li>छाती में लगातार 5 मिनट से अधिक भारी दबाव या दर्द</li>
                    <li>अचानक सांस लेने में भारी तकलीफ या अत्यधिक पसीना</li>
                    <li>अचानक बेहोशी, चक्कर आना, या दिल की धड़कन तेज होना</li>
                    <li>कलाई या जांघ के पंचर वाली जगह से खून बहना या सूजन</li>
                  </>
                )}
              </ul>
            </div>

            {/* Medication Adherence Checklist Preview */}
            <div className="bg-surface-container-low rounded-lg p-space-sm flex flex-col gap-space-xs border border-outline-variant/20">
              <span className="font-body-strong text-metadata-micro text-on-surface uppercase tracking-wider">
                {lang === "en" ? "Patient Daily Checklist" : "दैनिक दवा एवं स्वास्थ्य चेकलिस्ट"}
              </span>
              <div className="flex flex-col gap-1 text-metadata-micro">
                <label className="flex items-center gap-2 text-on-surface cursor-pointer">
                  <input
                    checked={checkMorning}
                    onChange={e => setCheckMorning(e.target.checked)}
                    className="accent-primary rounded"
                    type="checkbox"
                  />
                  <span>
                    {lang === "en"
                      ? "Morning: Aspirin 75mg + Ticagrelor 90mg + Metoprolol"
                      : "सुबह: एस्पिरिन 75mg + टिकाग्रेलर 90mg + मेटोप्रोलोल"}
                  </span>
                </label>
                <label className="flex items-center gap-2 text-on-surface cursor-pointer">
                  <input
                    checked={checkEvening}
                    onChange={e => setCheckEvening(e.target.checked)}
                    className="accent-primary rounded"
                    type="checkbox"
                  />
                  <span>
                    {lang === "en"
                      ? "Evening: Ticagrelor 90mg + Atorvastatin 80mg"
                      : "शाम: टिकाग्रेलर 90mg + एटोरवास्टेटिन 80mg"}
                  </span>
                </label>
                <label className="flex items-center gap-2 text-on-surface cursor-pointer">
                  <input
                    checked={checkVitals}
                    onChange={e => setCheckVitals(e.target.checked)}
                    className="accent-primary rounded"
                    type="checkbox"
                  />
                  <span>
                    {lang === "en"
                      ? "Log daily BP & resting heart rate into ABHA app"
                      : "आभा (ABHA) ऐप में दैनिक रक्तचाप एवं नाड़ी दर्ज करें"}
                  </span>
                </label>
              </div>
            </div>

            {/* QR & ABDM Sync Stamp */}
            <div className="flex items-center justify-between p-space-xs bg-surface-container-low rounded-lg border border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-2xl text-on-surface-variant">qr_code_2</span>
                <div className="flex flex-col">
                  <span className="font-clinical-data-mono text-metadata-micro font-semibold text-on-surface">
                    ABHA Patient Card Synced
                  </span>
                  <span className="font-metadata-micro text-[10px] text-on-surface-variant">Instant mobile push active</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-primary text-base">check_circle</span>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-col gap-space-xs pt-space-xs">
              <button
                onClick={() => {
                  showToast("Care Plan bundle cryptographically signed and committed to ABHA Health Locker.");
                }}
                className="w-full bg-primary hover:bg-primary-container text-on-primary font-body-strong text-clinical-data h-9 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-sm">assignment_turned_in</span>
                <span>Commit &amp; Sync Care Plan to ABDM</span>
              </button>
              <div className="grid grid-cols-2 gap-space-xs">
                <button
                  onClick={() => setShowPrintModal(true)}
                  className="bg-surface-container-low hover:bg-surface-container text-on-surface font-body-strong text-metadata-micro h-8 rounded-lg flex items-center justify-center gap-1 transition-colors border border-outline-variant/20"
                >
                  <span className="material-symbols-outlined text-xs">print</span>
                  <span>Print A4 Guide</span>
                </button>
                <button
                  onClick={() => setShowSmsModal(true)}
                  className="bg-surface-container-low hover:bg-surface-container text-on-surface font-body-strong text-metadata-micro h-8 rounded-lg flex items-center justify-center gap-1 transition-colors border border-outline-variant/20"
                >
                  <span className="material-symbols-outlined text-xs">send_to_mobile</span>
                  <span>WhatsApp / SMS</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quality & Safety Audit Micro-Footnote */}
          <div className="p-space-sm bg-surface-container-low/60 rounded-xl flex items-center justify-between text-metadata-micro text-on-surface-variant border border-outline-variant/20">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-primary">security</span>
              <span>Care Plan Sign-Off: Dr. Rohit Verma</span>
            </div>
            <span className="font-clinical-data-mono text-[10px]">EHR-SIGN-2024-991A</span>
          </div>
        </div>
      </div>

      {/* MODAL: VERSION LOG */}
      {showVersionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-inverse-surface/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col border border-outline-variant">
            <div className="bg-surface-container p-space-md flex items-center justify-between border-b border-surface-container-high">
              <span className="font-section-title text-section-title text-on-surface">Care Plan Version History</span>
              <button onClick={() => setShowVersionModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="p-space-md space-y-3 text-xs font-clinical-data">
              <div className="p-3 bg-surface-container-low rounded-lg border-l-4 border-primary space-y-1">
                <div className="flex justify-between font-bold">
                  <span>v2.4 (Active)</span>
                  <span className="font-clinical-data-mono text-outline">Today, 14:40 IST</span>
                </div>
                <p className="text-on-surface-variant">
                  Added Phase 2 cardiac rehabilitation ambulation thresholds and 12-month DAPT continuity lock.
                </p>
                <span className="text-primary text-[10px] font-semibold">Author: Dr. Rohit Verma</span>
              </div>
              <div className="p-3 bg-surface-container-low/60 rounded-lg space-y-1 opacity-80">
                <div className="flex justify-between font-bold">
                  <span>v2.0</span>
                  <span className="font-clinical-data-mono text-outline">Today, 04:15 IST</span>
                </div>
                <p className="text-on-surface-variant">Post-PCI acute care pathway initialized upon Cath Lab exit.</p>
              </div>
            </div>
            <div className="bg-surface-container p-space-md flex justify-end">
              <button
                onClick={() => setShowVersionModal(false)}
                className="px-4 py-2 bg-primary text-on-primary rounded-lg font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SYNC ABDM LOCKER */}
      {showAbdmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-inverse-surface/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col border border-outline-variant">
            <div className="bg-surface-container p-space-md flex items-center justify-between border-b border-surface-container-high">
              <span className="font-section-title text-section-title text-on-surface">Sync to ABDM Health Locker</span>
              <button onClick={() => setShowAbdmModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="p-space-md space-y-3 text-xs font-clinical-data">
              <p className="text-on-surface-variant">
                Directly push this comprehensive Care Plan and Post-PCI Recovery Roadmap to <strong>Rahul Sharma&apos;s</strong> verified
                ABHA Locker (`91-8842-1920-4491`).
              </p>
              <div className="p-3 bg-surface-container-low rounded-lg space-y-1 font-clinical-data-mono text-[11px]">
                <div>• Resource Type: CarePlan (FHIR R4)</div>
                <div>• Profile: ABDM CarePlan Document</div>
                <div>• Patient PHR Push: Instant Push Notification</div>
              </div>
            </div>
            <div className="bg-surface-container p-space-md flex justify-end gap-2 border-t border-surface-container-high">
              <button
                onClick={() => setShowAbdmModal(false)}
                className="px-4 py-2 bg-surface-container-high text-on-surface rounded-lg text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAbdmModal(false);
                  showToast("Care Plan successfully synced to Rahul Sharma's ABHA PHR app.");
                }}
                className="px-4 py-2 bg-primary text-on-primary rounded-lg font-semibold text-xs flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">cloud_upload</span> Sync Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD CLINIC SLOT */}
      {showAddSlotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-inverse-surface/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col border border-outline-variant">
            <div className="bg-surface-container p-space-md flex items-center justify-between border-b border-surface-container-high">
              <span className="font-section-title text-section-title text-on-surface">Schedule OPD Follow-up Slot</span>
              <button onClick={() => setShowAddSlotModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="p-space-md space-y-3 text-xs font-clinical-data">
              <div>
                <label className="font-semibold block mb-1">Appointment Title</label>
                <input
                  type="text"
                  placeholder="e.g. 6-Month Treadmill Test & Lipid Panel"
                  value={newSlotTitle}
                  onChange={e => setNewSlotTitle(e.target.value)}
                  className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Interval Duration</label>
                  <input
                    type="text"
                    value={newSlotDuration}
                    onChange={e => setNewSlotDuration(e.target.value)}
                    className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg font-clinical-data-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Unit</label>
                  <select
                    value={newSlotUnit}
                    onChange={e => setNewSlotUnit(e.target.value)}
                    className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg"
                  >
                    <option value="Days">Days</option>
                    <option value="Weeks">Weeks</option>
                    <option value="Months">Months</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Target Date</label>
                  <input
                    type="text"
                    value={newSlotDate}
                    onChange={e => setNewSlotDate(e.target.value)}
                    className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg font-clinical-data-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Time</label>
                  <input
                    type="text"
                    value={newSlotTime}
                    onChange={e => setNewSlotTime(e.target.value)}
                    className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg font-clinical-data-mono"
                  />
                </div>
              </div>
            </div>
            <div className="bg-surface-container p-space-md flex justify-end gap-2 border-t border-surface-container-high">
              <button
                onClick={() => setShowAddSlotModal(false)}
                className="px-4 py-2 bg-surface-container-high text-on-surface rounded-lg text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSlot}
                className="px-4 py-2 bg-primary text-on-primary rounded-lg font-semibold text-xs"
              >
                Confirm Slot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PRINT A4 GUIDE */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-inverse-surface/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col border border-outline-variant">
            <div className="bg-surface-container p-space-md flex items-center justify-between border-b border-surface-container-high">
              <span className="font-section-title text-section-title text-on-surface">Print A4 Patient Takeaway Guide</span>
              <button onClick={() => setShowPrintModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="p-space-md text-xs font-clinical-data space-y-3">
              <div className="border border-outline-variant/40 p-4 rounded-lg bg-surface-container-lowest space-y-2">
                <div className="flex justify-between border-b border-outline-variant/40 pb-2">
                  <div>
                    <h4 className="font-bold text-primary">APOLLO HOSPITALS · CARDIOLOGY RECOVERY</h4>
                    <span className="text-[11px] text-on-surface-variant">
                      {lang === "en" ? "Post-PCI Discharge & Care Instructions" : "एंजियोप्लास्टी पश्चात डिस्चार्ज एवं देखभाल निर्देश"}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold">Rahul Sharma (42M)</span>
                    <p className="font-clinical-data-mono text-[10px]">DEL-2024-8841</p>
                  </div>
                </div>
                <p className="text-on-surface-variant">
                  {lang === "en"
                    ? "Includes full 12-month medication schedule, 108 emergency warning signs, cardiac rehabilitation ambulation rules, and scheduled OPD follow-up dates."
                    : "इसमें 12 महीने की संपूर्ण दवा अनुसूची, 108 आपातकालीन चेतावनी संकेत, कार्डियक पुनर्वास नियम और निर्धारित ओपीडी तिथियां शामिल हैं।"}
                </p>
              </div>
            </div>
            <div className="bg-surface-container p-space-md flex justify-end gap-2 border-t border-surface-container-high">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 bg-surface-container-high text-on-surface rounded-lg text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  window.print();
                  showToast("Printed A4 Takeaway Guide.");
                  setShowPrintModal(false);
                }}
                className="px-5 py-2 bg-primary text-on-primary rounded-lg font-semibold text-xs flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">print</span> Print Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: WHATSAPP / SMS DISPATCH */}
      {showSmsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-inverse-surface/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col border border-outline-variant">
            <div className="bg-surface-container p-space-md flex items-center justify-between border-b border-surface-container-high">
              <span className="font-section-title text-section-title text-on-surface">Send via WhatsApp &amp; SMS</span>
              <button onClick={() => setShowSmsModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="p-space-md space-y-3 text-xs font-clinical-data">
              <p className="text-on-surface-variant">
                Send bilingual digital care plan link to registered mobile number:
              </p>
              <div className="p-3 bg-surface-container-low rounded-lg font-clinical-data-mono text-sm font-bold text-on-surface">
                +91 98712 34567 (Rahul Sharma)
              </div>
              <p className="text-[11px] text-outline">
                Message will include verified link to Apollo ABHA Patient Portal with live medicine reminders and 24/7 cardiac helpline.
              </p>
            </div>
            <div className="bg-surface-container p-space-md flex justify-end gap-2 border-t border-surface-container-high">
              <button
                onClick={() => setShowSmsModal(false)}
                className="px-4 py-2 bg-surface-container-high text-on-surface rounded-lg text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowSmsModal(false);
                  showToast("Dispatched digital care plan link via WhatsApp and SMS to +91 98712 34567.");
                }}
                className="px-4 py-2 bg-primary text-on-primary rounded-lg font-semibold text-xs flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">send</span> Send to Mobile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CONTACT TEAM MEMBER */}
      {contactMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-inverse-surface/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col border border-outline-variant">
            <div className="bg-surface-container p-space-md flex items-center justify-between border-b border-surface-container-high">
              <span className="font-section-title text-section-title text-on-surface">Contact Specialist</span>
              <button onClick={() => setContactMember(null)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="p-space-md space-y-3 text-xs font-clinical-data">
              <div className="p-3 bg-surface-container-low rounded-lg">
                <span className="font-semibold block text-on-surface">{contactMember}</span>
              </div>
              <p className="text-on-surface-variant">
                Internal hospital hospital-wide voIP and secure message broadcast is connected.
              </p>
            </div>
            <div className="bg-surface-container p-space-md flex justify-end">
              <button
                onClick={() => {
                  setContactMember(null);
                  showToast(`Call initiated to ${contactMember}.`);
                }}
                className="px-4 py-2 bg-primary text-on-primary rounded-lg font-semibold text-xs flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">call</span> Connect Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
