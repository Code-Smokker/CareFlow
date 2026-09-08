/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import ReviewSignPage from "@/app/review-sign/page";

interface SecondaryDiagnosis {
  id: string;
  name: string;
  icd: string;
}

export default function ConsultationWorkspacePage() {
  const [viewMode, setViewMode] = useState<"ambient-soap" | "review-sign">("review-sign");
  const [scribeActive, setScribeActive] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("section-hpi");
  const [cathLabAlerted, setCathLabAlerted] = useState<boolean>(false);
  const [showCathLabModal, setShowCathLabModal] = useState<boolean>(false);
  const [showSignModal, setShowSignModal] = useState<boolean>(false);
  const [showAddComorbidityModal, setShowAddComorbidityModal] = useState<boolean>(false);
  const [showDdiModal, setShowDdiModal] = useState<boolean>(false);
  const [newComorbidityName, setNewComorbidityName] = useState("");
  const [newComorbidityIcd, setNewComorbidityIcd] = useState("");
  const [primaryConfirmed, setPrimaryConfirmed] = useState<boolean>(true);
  const [statinsStatus, setStatinsStatus] = useState<"verifying" | "given">("verifying");
  const [aiNoteInserted, setAiNoteInserted] = useState<boolean>(false);

  const [secondaryDiagnoses, setSecondaryDiagnoses] = useState<SecondaryDiagnosis[]>([
    { id: "htn", name: "Essential Hypertension", icd: "ICD-10 I10" },
    { id: "t2dm", name: "Type 2 Diabetes Mellitus without complication", icd: "ICD-10 E11.9" },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleAddComorbidity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComorbidityName.trim()) return;
    setSecondaryDiagnoses([
      ...secondaryDiagnoses,
      {
        id: `diag-${Date.now()}`,
        name: newComorbidityName,
        icd: newComorbidityIcd || "ICD-10 R69",
      },
    ]);
    setNewComorbidityName("");
    setNewComorbidityIcd("");
    setShowAddComorbidityModal(false);
    showToast(`Added comorbidity: ${newComorbidityName}`);
  };

  const handleSignEncounterConfirm = () => {
    setShowSignModal(false);
    showToast("Encounter digitally signed with ABHA Certificate #9014. Cath Lab STAT Transfer packet dispatched.");
  };

  if (viewMode === "review-sign") {
    return <ReviewSignPage onBackToEdit={() => setViewMode("ambient-soap")} />;
  }

  return (
    <div className="flex flex-col w-full gap-space-sm pb-space-2xl min-h-screen">
      {/* Top Progress Indicator / Audit Breadcrumb */}
      <div className="flex items-center justify-between py-space-xs px-space-xs flex-wrap gap-2">
        <div className="flex items-center gap-space-sm text-metadata-micro font-metadata-micro text-on-surface-variant flex-wrap">
          <button
            onClick={() => setViewMode("ambient-soap")}
            className="flex items-center gap-1 text-primary font-semibold hover:underline"
          >
            <span className="material-symbols-outlined text-sm">check_circle</span> 1. Clinical Intake
          </button>
          <span className="text-outline-variant font-clinical-data-mono">/</span>
          <span className="flex items-center gap-1 text-primary font-semibold">
            <span className="material-symbols-outlined text-sm">check_circle</span> 2. Triage &amp; Vitals
          </span>
          <span className="text-outline-variant font-clinical-data-mono">/</span>
          <span className="flex items-center gap-1 text-primary font-semibold">
            <span className="material-symbols-outlined text-sm">check_circle</span> 3. Orders &amp; Interventions
          </span>
          <span className="text-outline-variant font-clinical-data-mono">/</span>
          <button
            onClick={() => setViewMode("review-sign")}
            className="flex items-center gap-1 text-on-surface font-bold bg-secondary-container text-on-secondary-container px-space-xs py-0.5 rounded shadow-2xs"
          >
            <span className="material-symbols-outlined text-sm">draw</span> 4. Review &amp; Sign
          </button>
        </div>
        <div className="flex items-center gap-space-md flex-wrap">
          <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">
            FHIR Audit Trail ID: <strong className="text-on-surface font-semibold">#AUD-2024-8841-SIGN</strong>
          </span>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
            <span className="font-metadata-micro text-metadata-micro text-primary font-semibold uppercase tracking-wider">
              HSM Keystore Online
            </span>
          </div>
        </div>
      </div>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-bounce border border-inverse-primary/30 text-clinical-data">
          <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-inverse-on-surface/70 hover:text-inverse-on-surface ml-2"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* TOP PATIENT HEADER & CRITICAL RED FLAG BANNER */}
      <div className="flex flex-col rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden border border-outline-variant/20">
        {/* P1 Critical Red Flag Strip */}
        <div className="bg-error text-on-error px-gutter-normal py-2 flex flex-wrap items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-xl animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>
              emergency
            </span>
            <div className="flex items-center gap-2">
              <span className="font-clinical-data-mono text-metadata-micro bg-on-error text-error px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                P1 Critical
              </span>
              <span className="font-body-strong text-clinical-data tracking-tight">
                SUSPECTED ACUTE CORONARY SYNDROME — STEMI PROTOCOL ACTIVATED
              </span>
            </div>
            <span className="hidden md:inline font-body-default text-metadata-micro opacity-90">
              | STAT 12-Lead ECG Dispatched · Serial High-Sensitivity Troponin I Draw Pending (Cath Lab Team Notified)
            </span>
          </div>
          <div className="flex items-center gap-space-xs">
            <button
              onClick={() => setShowCathLabModal(true)}
              className="px-2.5 py-1 bg-surface-container-lowest text-error font-clinical-data text-metadata-micro rounded font-bold hover:bg-error-container transition-colors flex items-center gap-1 shadow-sm"
            >
              <span className="material-symbols-outlined text-xs">notifications_active</span>
              {cathLabAlerted ? "Cath Lab Alerted (Bay 02 Ready)" : "Cath Lab Pre-Alert (Bay 02)"}
            </button>
          </div>
        </div>

        {/* Main Patient Identifier & Longitudinal Metadata */}
        <div className="p-gutter-normal flex flex-col xl:flex-row xl:items-center justify-between gap-space-md bg-surface-container-lowest">
          <div className="flex items-start gap-space-md">
            <div className="relative shrink-0">
              <img
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-surface-variant"
                alt="Close up medical identity photograph of Rahul Sharma"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsxGUwxPhPPmhyH32_o1d0eFZONPVF77MfpoNMH5t7Vf2YRX2sM4TgYG_28XuzH1btn0jMHFcm7sm2b0N9WjDOSAeXesmR8wuY_hVcdhTJBynOR03u48bDS1y81yLtmIWEBZnua2Gbga3U7G-toW4BhW0rbCQHwYpxN-S5B_iisd-Mv9kQHP6NxNYCcnqCfDtRA4DGfv15jriUutwgPiZMA-mE76yzk7qw0RbuzbY7hiFC1hptkhqb"
              />
              <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-error flex items-center justify-center text-on-error font-clinical-data-mono text-[9px] font-bold">
                !
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex flex-wrap items-center gap-x-space-sm gap-y-1">
                <h1 className="font-page-title text-section-title text-on-surface">Rahul Sharma</h1>
                <span className="font-clinical-data text-clinical-data text-on-surface-variant">42 Y · Male</span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container-low text-primary font-clinical-data text-metadata-micro font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                  ABHA 91-8842-1920-4491
                </span>
                <span className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-clinical-data-mono text-metadata-micro">
                  UHID: DEL-2024-8841
                </span>
                <span className="px-1.5 py-0.5 rounded bg-secondary-container text-on-secondary-container font-clinical-data-mono text-metadata-micro font-semibold">
                  Token #104
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-space-md gap-y-1 text-on-surface-variant font-metadata-micro text-metadata-micro">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-primary">local_hospital</span> OPD · Cardiology &amp; Internal Med
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-secondary">stethoscope</span> Attending:{" "}
                  <strong className="text-on-surface font-semibold">Dr. Rohit Verma</strong> (Lead Internist)
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-clinical-data-mono text-primary">
                  <span className="material-symbols-outlined text-xs">schedule</span> Checked-in: 14:10 IST (32m elapsed)
                </span>
              </div>
            </div>
          </div>

          {/* Point-in-Time Vitals Matrix & Critical Allergies Strip */}
          <div className="flex flex-wrap items-center gap-space-sm">
            {/* Vitals Micro-Matrix */}
            <div className="grid grid-cols-3 gap-space-xs bg-surface-container-low p-2 rounded-xl border border-outline-variant/30">
              <div className="px-2 py-1 bg-surface-container-lowest rounded flex flex-col">
                <span className="font-metadata-micro text-metadata-micro text-outline uppercase tracking-wider">
                  BP (Sys/Dia)
                </span>
                <div className="flex items-center gap-1">
                  <span className="font-clinical-data-mono text-clinical-data font-bold text-error">148/92</span>
                  <span className="font-clinical-data-mono text-[10px] text-error font-bold">↑</span>
                </div>
                <span className="font-metadata-micro text-[10px] text-on-surface-variant">mmHg · 14:12</span>
              </div>
              <div className="px-2 py-1 bg-surface-container-lowest rounded flex flex-col">
                <span className="font-metadata-micro text-metadata-micro text-outline uppercase tracking-wider">
                  Pulse / HR
                </span>
                <div className="flex items-center gap-1">
                  <span className="font-clinical-data-mono text-clinical-data font-bold text-error">104</span>
                  <span className="font-clinical-data-mono text-[10px] text-error font-bold">↑</span>
                </div>
                <span className="font-metadata-micro text-[10px] text-on-surface-variant">bpm · Tachy</span>
              </div>
              <div className="px-2 py-1 bg-surface-container-lowest rounded flex flex-col">
                <span className="font-metadata-micro text-metadata-micro text-outline uppercase tracking-wider">
                  SpO2 (Room)
                </span>
                <div className="flex items-center gap-1">
                  <span className="font-clinical-data-mono text-clinical-data font-bold text-tertiary">94%</span>
                  <span className="font-clinical-data-mono text-[10px] text-tertiary font-bold">↓</span>
                </div>
                <span className="font-metadata-micro text-[10px] text-on-surface-variant">O2 Mask 2L Prep</span>
              </div>
            </div>

            {/* Allergies Quick Capsule */}
            <div className="flex flex-col bg-error-container/40 p-2 rounded-xl max-w-xs border border-error/30">
              <div className="flex items-center gap-1 text-on-error-container font-metadata-micro text-metadata-micro font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-xs text-error">warning</span> Critical Safety Alerts
              </div>
              <div className="flex flex-col gap-0.5 mt-1 font-clinical-data text-metadata-micro">
                <span className="text-error font-bold leading-tight">
                  Penicillin <span className="font-normal text-on-surface font-metadata-micro">(Type 1 IgE Anaphylaxis)</span>
                </span>
                <span className="text-on-error-container leading-tight">
                  Aspirin <span className="font-normal text-on-surface font-metadata-micro">(Severe Gastric Ulcer/Irritation)</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3-PANE CLINICAL WORKSPACE ARCHITECTURE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-sm items-start">
        {/* ========================================== */}
        {/* LEFT PANE: CLINICAL NAVIGATOR & LONGITUDINAL */}
        {/* ========================================== */}
        <div className="lg:col-span-3 flex flex-col gap-space-sm">
          {/* Real-time Clinical Scribe Box */}
          <div className="bg-surface-container-lowest rounded-xl p-space-panel-padding shadow-sm flex flex-col gap-space-sm border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="relative flex h-2.5 w-2.5">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${scribeActive ? "bg-primary" : "bg-outline"} opacity-75`}></span>
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${scribeActive ? "bg-primary" : "bg-outline"}`}></span>
                </span>
                <span className="font-section-title text-clinical-data text-on-surface">CareFlow Scribe</span>
              </div>
              <span className={`font-clinical-data-mono text-[11px] px-2 py-0.5 rounded font-semibold tracking-wide ${
                scribeActive ? "bg-primary-container text-on-primary-container" : "bg-surface-container text-on-surface-variant"
              }`}>
                {scribeActive ? "LIVE DUAL-AUDIO" : "PAUSED"}
              </span>
            </div>
            <p className="font-body-default text-metadata-micro text-on-surface-variant leading-relaxed">
              Ambient microphone parsing Hindi-English medical speech. Continuous diarization active between Patient and Clinician.
            </p>

            {/* Waveform Simulation */}
            <div className="h-10 bg-surface-container-low rounded-lg p-2 flex items-center justify-between gap-1 overflow-hidden border border-outline-variant/20">
              <span className={`h-2 w-1 rounded-full ${scribeActive ? "bg-primary animate-pulse" : "bg-outline"}`}></span>
              <span className={`h-6 w-1 rounded-full ${scribeActive ? "bg-primary-container animate-bounce" : "bg-outline"}`}></span>
              <span className={`h-8 w-1 rounded-full ${scribeActive ? "bg-primary" : "bg-outline"}`}></span>
              <span className={`h-4 w-1 rounded-full ${scribeActive ? "bg-primary-container" : "bg-outline"}`}></span>
              <span className={`h-7 w-1 rounded-full ${scribeActive ? "bg-primary animate-pulse" : "bg-outline"}`}></span>
              <span className={`h-5 w-1 rounded-full ${scribeActive ? "bg-primary" : "bg-outline"}`}></span>
              <span className={`h-9 w-1 rounded-full ${scribeActive ? "bg-primary-container animate-bounce" : "bg-outline"}`}></span>
              <span className={`h-4 w-1 rounded-full ${scribeActive ? "bg-primary" : "bg-outline"}`}></span>
              <span className={`h-7 w-1 rounded-full ${scribeActive ? "bg-primary" : "bg-outline"}`}></span>
              <span className={`h-3 w-1 rounded-full ${scribeActive ? "bg-primary-container" : "bg-outline"}`}></span>
              <span className={`h-6 w-1 rounded-full ${scribeActive ? "bg-primary animate-pulse" : "bg-outline"}`}></span>
              <span className={`h-2 w-1 rounded-full ${scribeActive ? "bg-primary" : "bg-outline"}`}></span>
            </div>

            <div className="flex items-center gap-space-xs pt-1">
              <button
                onClick={() => {
                  setScribeActive(!scribeActive);
                  showToast(scribeActive ? "CareFlow Ambient Scribe paused." : "CareFlow Ambient Scribe resumed listening.");
                }}
                className={`flex-1 py-1.5 px-space-sm rounded font-clinical-data text-metadata-micro font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-colors ${
                  scribeActive
                    ? "bg-primary text-on-primary hover:bg-primary-container"
                    : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  {scribeActive ? "pause_circle" : "play_circle"}
                </span>
                <span>{scribeActive ? "Pause Capture" : "Resume Scribe"}</span>
              </button>
              <button
                onClick={() => showToast("Microphone: Jabra Speak 710 Array (Channel 1: Clinician, Channel 2: Patient) calibrated.")}
                className="p-1.5 bg-surface-container text-on-surface-variant hover:text-on-surface rounded transition-colors"
                title="Mic Settings"
              >
                <span className="material-symbols-outlined text-base">tune</span>
              </button>
            </div>
          </div>

          {/* Quick Section Anchor Links */}
          <div className="bg-surface-container-lowest rounded-xl p-space-sm shadow-sm flex flex-col border border-outline-variant/20">
            <div className="px-space-xs py-1 mb-1 text-outline font-metadata-micro text-metadata-micro uppercase font-bold tracking-wider">
              Encounter Navigation
            </div>
            <nav className="flex flex-col gap-0.5">
              <button
                onClick={() => scrollToSection("section-hpi")}
                className={`flex items-center justify-between px-space-sm py-1.5 rounded font-clinical-data text-metadata-micro transition-colors text-left ${
                  activeSection === "section-hpi"
                    ? "bg-surface-container-high text-primary font-bold"
                    : "hover:bg-surface-container-low text-on-surface-variant"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">record_voice_over</span> Chief Complaint &amp; HPI
                </span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </button>
              <button
                onClick={() => scrollToSection("section-ros")}
                className={`flex items-center justify-between px-space-sm py-1.5 rounded font-clinical-data text-metadata-micro transition-colors text-left ${
                  activeSection === "section-ros"
                    ? "bg-surface-container-high text-primary font-bold"
                    : "hover:bg-surface-container-low text-on-surface-variant"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">checklist_rtl</span> Review of Systems (ROS)
                </span>
              </button>
              <button
                onClick={() => scrollToSection("section-pe")}
                className={`flex items-center justify-between px-space-sm py-1.5 rounded font-clinical-data text-metadata-micro transition-colors text-left ${
                  activeSection === "section-pe"
                    ? "bg-surface-container-high text-primary font-bold"
                    : "hover:bg-surface-container-low text-on-surface-variant"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">stethoscope</span> Physical Examination
                </span>
              </button>
              <button
                onClick={() => scrollToSection("section-assessment")}
                className={`flex items-center justify-between px-space-sm py-1.5 rounded font-clinical-data text-metadata-micro transition-colors text-left ${
                  activeSection === "section-assessment"
                    ? "bg-surface-container-high text-primary font-bold"
                    : "hover:bg-surface-container-low text-on-surface-variant"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">diagnosis</span> Assessment &amp; ICD-11/10
                </span>
                <span className="font-clinical-data-mono text-[9px] bg-error-container text-on-error-container px-1 rounded">
                  STAT
                </span>
              </button>
              <button
                onClick={() => scrollToSection("section-orders")}
                className={`flex items-center justify-between px-space-sm py-1.5 rounded font-clinical-data text-metadata-micro transition-colors text-left ${
                  activeSection === "section-orders"
                    ? "bg-surface-container-high text-primary font-bold"
                    : "hover:bg-surface-container-low text-on-surface-variant"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">medication</span> STAT Orders &amp; Rx Pad
                </span>
                <span className="font-clinical-data-mono text-[9px] bg-surface-container text-on-surface px-1 rounded">
                  3 Rx
                </span>
              </button>
              <button
                onClick={() => scrollToSection("section-disposition")}
                className={`flex items-center justify-between px-space-sm py-1.5 rounded font-clinical-data text-metadata-micro transition-colors text-left ${
                  activeSection === "section-disposition"
                    ? "bg-surface-container-high text-primary font-bold"
                    : "hover:bg-surface-container-low text-on-surface-variant"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">transfer_within_a_station</span> Transfer &amp; Cath Lab
                </span>
              </button>
            </nav>
          </div>

          {/* Longitudinal Past History & EHR Context Snippets */}
          <div className="bg-surface-container-lowest rounded-xl p-space-panel-padding shadow-sm flex flex-col gap-space-sm border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <span className="font-section-title text-clinical-data text-on-surface">Longitudinal Record</span>
              <Link
                href="/medical-history"
                className="font-metadata-micro text-metadata-micro text-primary flex items-center gap-0.5 hover:underline"
              >
                Full Chart <span className="material-symbols-outlined text-xs">open_in_new</span>
              </Link>
            </div>
            <div className="flex flex-col gap-space-xs font-clinical-data text-metadata-micro">
              {/* Item 1: Chronic Condition */}
              <div className="p-2 bg-surface-container-low rounded-lg flex flex-col gap-0.5 border border-outline-variant/20">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-on-surface">Type 2 Diabetes Mellitus</span>
                  <span className="font-clinical-data-mono text-[10px] text-outline">Dx 2019 (7 Yrs)</span>
                </div>
                <p className="text-on-surface-variant text-[11px]">
                  Latest HbA1c: <strong className="text-on-surface">7.8%</strong> (Apollo Labs · 14 Jul 2026). Sub-optimal glycemic control.
                </p>
              </div>

              {/* Item 2: Active Prescriptions */}
              <div className="p-2 bg-surface-container-low rounded-lg flex flex-col gap-1 border border-outline-variant/20">
                <span className="font-bold text-on-surface">Current Maintenance Regimen</span>
                <ul className="flex flex-col gap-0.5 text-[11px] text-on-surface-variant font-clinical-data-mono">
                  <li className="flex items-center justify-between">
                    <span>• Metformin 500mg BD</span>
                    <span className="text-primary text-[10px]">Compliant</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>• Telmisartan 40mg OD</span>
                    <span className="text-primary text-[10px]">Compliant</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>• Atorvastatin 20mg HS</span>
                    <span className="text-secondary text-[10px]">Irregular</span>
                  </li>
                </ul>
              </div>

              {/* Item 3: Family Cadence */}
              <div className="p-2 bg-error-container/30 rounded-lg flex flex-col gap-0.5 border border-error/20">
                <div className="flex items-center gap-1 text-on-error-container font-bold">
                  <span className="material-symbols-outlined text-xs text-error">family_history</span> High CAD Genetic Load
                </div>
                <p className="text-on-surface text-[11px] leading-tight">
                  Father experienced fatal acute transmural myocardial infarction at age 52.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* CENTER PANE: ACTIVE CONSULTATION WORKSPACE  */}
        {/* ========================================== */}
        <div className="lg:col-span-6 flex flex-col gap-space-sm">
          {/* Section 1: Chief Complaint & Structured HPI */}
          <section
            className="bg-surface-container-lowest rounded-xl p-space-panel-padding shadow-sm flex flex-col gap-space-sm scroll-mt-20 border border-outline-variant/20"
            id="section-hpi"
          >
            <div className="flex items-center justify-between flex-wrap gap-2 pb-space-xs">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-xl">medical_information</span>
                <h2 className="font-section-title text-section-title text-on-surface">Chief Complaint &amp; HPI</h2>
              </div>
              {/* Legend Chips */}
              <div className="flex flex-wrap items-center gap-1">
                <span className="px-1.5 py-0.5 bg-surface-container font-metadata-micro text-[10px] text-on-surface-variant rounded">
                  Patient Words
                </span>
                <span className="px-1.5 py-0.5 bg-primary-container text-on-primary-container font-metadata-micro text-[10px] rounded font-semibold">
                  AI Extracted
                </span>
                <span className="px-1.5 py-0.5 bg-secondary-container text-on-secondary-container font-metadata-micro text-[10px] rounded font-semibold">
                  Clinician Verified
                </span>
              </div>
            </div>

            {/* Verbatim Patient Quote */}
            <div className="p-3 bg-surface-container-low rounded-xl flex flex-col gap-1.5 border border-outline-variant/20">
              <div className="flex items-center justify-between text-outline font-metadata-micro text-metadata-micro">
                <span className="flex items-center gap-1 font-clinical-data font-semibold text-primary">
                  <span className="material-symbols-outlined text-xs">mic</span> Verbatim Audio Transcript (Captured 14:18 IST)
                </span>
                <span className="font-clinical-data-mono text-[10px]">Audio Stream #04</span>
              </div>
              <p className="font-clinical-data text-clinical-data text-on-surface italic leading-relaxed">
                &ldquo;Seene mein bahut heavy pressure ho raha hai jaise koi pathar rakh diya ho. Yeh dard left haath aur jabde (jaw) tak travel kar raha hai lagbhag 40-45 minute se. Saans lene mein bhi dikkat hai aur bohot paseena aa raha hai.&rdquo;
              </p>
            </div>

            {/* Structured HPI Extraction Breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-space-xs">
              <div className="p-2 bg-surface-container-low rounded-lg flex flex-col border border-outline-variant/20">
                <span className="font-metadata-micro text-[10px] text-outline uppercase font-bold">Onset</span>
                <span className="font-clinical-data-mono text-clinical-data text-on-surface font-bold">13:40 IST</span>
                <span className="font-metadata-micro text-[10px] text-error font-medium">~45 mins acute</span>
              </div>
              <div className="p-2 bg-surface-container-low rounded-lg flex flex-col border border-outline-variant/20">
                <span className="font-metadata-micro text-[10px] text-outline uppercase font-bold">Location</span>
                <span className="font-clinical-data text-clinical-data text-on-surface font-bold">Substernal</span>
                <span className="font-metadata-micro text-[10px] text-on-surface-variant">Retrosternal precordium</span>
              </div>
              <div className="p-2 bg-surface-container-low rounded-lg flex flex-col border border-outline-variant/20">
                <span className="font-metadata-micro text-[10px] text-outline uppercase font-bold">Character</span>
                <span className="font-clinical-data text-clinical-data text-error font-bold">Crushing / Squeezing</span>
                <span className="font-metadata-micro text-[10px] text-on-surface-variant">&ldquo;Pathar jaise pressure&rdquo;</span>
              </div>
              <div className="p-2 bg-surface-container-low rounded-lg flex flex-col border border-outline-variant/20">
                <span className="font-metadata-micro text-[10px] text-outline uppercase font-bold">Severity</span>
                <div className="flex items-center gap-1">
                  <span className="font-clinical-data-mono text-clinical-data text-error font-bold">8 / 10</span>
                  <span className="px-1 py-0.2 rounded bg-error-container text-on-error-container font-clinical-data-mono text-[9px]">
                    Severe
                  </span>
                </div>
                <span className="font-metadata-micro text-[10px] text-on-surface-variant">Escalating over 20m</span>
              </div>
              <div className="p-2 bg-surface-container-low rounded-lg flex flex-col col-span-2 border border-outline-variant/20">
                <span className="font-metadata-micro text-[10px] text-outline uppercase font-bold">Radiation Pattern</span>
                <span className="font-clinical-data text-clinical-data text-on-surface font-semibold">
                  Left Shoulder, Arm &amp; Mandibular Angle
                </span>
                <span className="font-metadata-micro text-[10px] text-primary">High positive likelihood ratio for ACS</span>
              </div>
              <div className="p-2 bg-surface-container-low rounded-lg flex flex-col border border-outline-variant/20">
                <span className="font-metadata-micro text-[10px] text-outline uppercase font-bold">Aggravating</span>
                <span className="font-clinical-data text-clinical-data text-on-surface">Brisk Walking</span>
                <span className="font-metadata-micro text-[10px] text-on-surface-variant">Post-lunch exertion</span>
              </div>
              <div className="p-2 bg-surface-container-low rounded-lg flex flex-col border border-outline-variant/20">
                <span className="font-metadata-micro text-[10px] text-outline uppercase font-bold">Relieving</span>
                <span className="font-clinical-data text-clinical-data text-error font-semibold">Nil with Rest</span>
                <span className="font-metadata-micro text-[10px] text-on-surface-variant">Sitting did not abate pain</span>
              </div>
            </div>
          </section>

          {/* Section 2: Review of Systems (ROS Matrix) */}
          <section
            className="bg-surface-container-lowest rounded-xl p-space-panel-padding shadow-sm flex flex-col gap-space-sm scroll-mt-20 border border-outline-variant/20"
            id="section-ros"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-xl">fact_check</span>
                <h2 className="font-section-title text-section-title text-on-surface">Review of Systems (ROS)</h2>
              </div>
              <span className="font-clinical-data text-metadata-micro text-outline">Voice Auto-Coded &amp; Confirmed</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-xs">
              {/* Positive Findings */}
              <div className="flex items-center gap-2 p-2 bg-error-container/20 rounded-lg border border-error/20">
                <span className="material-symbols-outlined text-error text-base">check_box</span>
                <div className="flex flex-col">
                  <span className="font-clinical-data text-clinical-data text-on-surface font-semibold">+ Chest Pressure</span>
                  <span className="font-metadata-micro text-[10px] text-error">Severe retrosternal</span>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 bg-error-container/20 rounded-lg border border-error/20">
                <span className="material-symbols-outlined text-error text-base">check_box</span>
                <div className="flex flex-col">
                  <span className="font-clinical-data text-clinical-data text-on-surface font-semibold">+ Diaphoresis</span>
                  <span className="font-metadata-micro text-[10px] text-error">Profuse cold sweating</span>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 bg-error-container/20 rounded-lg border border-error/20">
                <span className="material-symbols-outlined text-error text-base">check_box</span>
                <div className="flex flex-col">
                  <span className="font-clinical-data text-clinical-data text-on-surface font-semibold">+ Dyspnea</span>
                  <span className="font-metadata-micro text-[10px] text-error">Shortness of breath on exertion</span>
                </div>
              </div>
              {/* Pertinent Negatives */}
              <div className="flex items-center gap-2 p-2 bg-surface-container-low rounded-lg border border-outline-variant/20">
                <span className="material-symbols-outlined text-outline text-base">check_box_outline_blank</span>
                <div className="flex flex-col">
                  <span className="font-clinical-data text-clinical-data text-on-surface-variant">- Syncope / Presyncope</span>
                  <span className="font-metadata-micro text-[10px] text-outline">No loss of consciousness</span>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 bg-surface-container-low rounded-lg border border-outline-variant/20">
                <span className="material-symbols-outlined text-outline text-base">check_box_outline_blank</span>
                <div className="flex flex-col">
                  <span className="font-clinical-data text-clinical-data text-on-surface-variant">- Palpitations</span>
                  <span className="font-metadata-micro text-[10px] text-outline">Denies fluttering</span>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 bg-surface-container-low rounded-lg border border-outline-variant/20">
                <span className="material-symbols-outlined text-outline text-base">check_box_outline_blank</span>
                <div className="flex flex-col">
                  <span className="font-clinical-data text-clinical-data text-on-surface-variant">- Fever / Chills</span>
                  <span className="font-metadata-micro text-[10px] text-outline">Afebrile 98.4°F</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Focused Physical Examination */}
          <section
            className="bg-surface-container-lowest rounded-xl p-space-panel-padding shadow-sm flex flex-col gap-space-sm scroll-mt-20 border border-outline-variant/20"
            id="section-pe"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-xl">stethoscope</span>
                <h2 className="font-section-title text-section-title text-on-surface">Focused Physical Examination</h2>
              </div>
              <button
                onClick={() => showToast("Quick Examination Template applied: Standard Cardiorespiratory ACS Exam.")}
                className="font-clinical-data text-metadata-micro text-primary hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-xs">edit_note</span> Quick Template
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
              <div className="p-3 bg-surface-container-low rounded-xl flex flex-col gap-1 border border-outline-variant/20">
                <span className="font-clinical-data text-clinical-data font-bold text-on-surface">
                  General Appearance &amp; Perfusion
                </span>
                <p className="font-body-default text-metadata-micro text-on-surface leading-relaxed">
                  Middle-aged male sitting forward in marked distress. Noticeably pale, cool extremities with profuse diaphoresis across forehead and upper chest. No cyanosis, no pedal edema. CRT &lt; 2s.
                </p>
              </div>
              <div className="p-3 bg-surface-container-low rounded-xl flex flex-col gap-1 border border-outline-variant/20">
                <span className="font-clinical-data text-clinical-data font-bold text-on-surface">
                  Cardiovascular System (CVS)
                </span>
                <p className="font-body-default text-metadata-micro text-on-surface leading-relaxed">
                  Normal S1 and S2 present. Sinus tachycardia at 104 bpm. No audible S3 gallop, S4, pericardial friction rub, or regurgitant murmurs over apex and left sternal border. JVP not elevated.
                </p>
              </div>
              <div className="p-3 bg-surface-container-low rounded-xl flex flex-col gap-1 md:col-span-2 border border-outline-variant/20">
                <span className="font-clinical-data text-clinical-data font-bold text-on-surface">
                  Respiratory &amp; Chest Wall Auscultation
                </span>
                <p className="font-body-default text-metadata-micro text-on-surface leading-relaxed">
                  Tachypneic (RR 22/min). Bilateral vesicular breath sounds heard throughout all lung fields. Lung bases clear to auscultation without crackles, rales, or wheezing. No chest wall localized tenderness on palpation (reproducibility negative).
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Assessment & Diagnostic Coding */}
          <section
            className="bg-surface-container-lowest rounded-xl p-space-panel-padding shadow-sm flex flex-col gap-space-sm scroll-mt-20 border border-outline-variant/20"
            id="section-assessment"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-xl">psychology_alt</span>
                <h2 className="font-section-title text-section-title text-on-surface">Clinical Assessment &amp; Diagnoses</h2>
              </div>
              <span className="font-clinical-data-mono text-metadata-micro text-secondary font-semibold">
                ICD-11 / ICD-10 / SNOMED CT
              </span>
            </div>

            {/* Primary Diagnosis Card */}
            <div className="p-3 bg-error-container/20 rounded-xl flex flex-col gap-2 border border-error/30">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-error text-on-error rounded font-clinical-data-mono text-[10px] font-bold">
                      PRIMARY SUSPECTED
                    </span>
                    <span className="font-clinical-data-mono text-metadata-micro text-outline">
                      ICD-10: I21.0 · ICD-11: BD10
                    </span>
                  </div>
                  <h3 className="font-body-strong text-clinical-data text-on-surface mt-1">
                    Acute Transmural Myocardial Infarction of Anterior Wall (STEMI / ACS)
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setPrimaryConfirmed(!primaryConfirmed);
                    showToast(primaryConfirmed ? "Diagnosis marked as Unconfirmed / Differential." : "Primary diagnosis marked as Clinically Confirmed.");
                  }}
                  className={`px-2.5 py-1 rounded font-clinical-data text-metadata-micro font-bold shadow-sm shrink-0 transition-colors ${
                    primaryConfirmed
                      ? "bg-primary text-on-primary hover:bg-primary-container"
                      : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                  }`}
                >
                  {primaryConfirmed ? "Confirmed ✓" : "Verify Diagnosis"}
                </button>
              </div>
              <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                Automated CDS trigger based on 45m retrosternal crushing pain radiating to mandible/left arm, tachycardia, diaphoresis, and diabetes comorbidity.
              </p>
            </div>

            {/* Secondary Diagnoses Tags */}
            <div className="flex flex-col gap-1.5 pt-1">
              <span className="font-metadata-micro text-metadata-micro text-outline uppercase font-bold">
                Secondary Comorbidities Added to Encounter
              </span>
              <div className="flex flex-wrap gap-2">
                {secondaryDiagnoses.map((diag) => (
                  <div
                    key={diag.id}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-surface-container-low rounded-lg font-clinical-data text-metadata-micro text-on-surface border border-outline-variant/30"
                  >
                    <span className="material-symbols-outlined text-xs text-primary">check_circle</span>
                    <span>
                      {diag.name} ({diag.icd})
                    </span>
                  </div>
                ))}
                <button
                  onClick={() => setShowAddComorbidityModal(true)}
                  className="flex items-center gap-1 px-2.5 py-1 bg-surface-container hover:bg-surface-container-high rounded-lg font-clinical-data text-metadata-micro text-on-surface-variant transition-colors border border-outline-variant/30"
                >
                  <span className="material-symbols-outlined text-xs">add</span> Add Comorbidity
                </button>
              </div>
            </div>
          </section>

          {/* Section 5: STAT Orders & Rx Pad */}
          <section
            className="bg-surface-container-lowest rounded-xl p-space-panel-padding shadow-sm flex flex-col gap-space-sm scroll-mt-20 border border-outline-variant/20"
            id="section-orders"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-xl">receipt_long</span>
                <h2 className="font-section-title text-section-title text-on-surface">STAT Orders &amp; Prescription Pad</h2>
              </div>
              <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-clinical-data-mono text-metadata-micro font-semibold">
                FHIR CPOE Active
              </span>
            </div>

            {/* Diagnostic Orders Table */}
            <div className="flex flex-col gap-1">
              <span className="font-metadata-micro text-metadata-micro text-outline uppercase font-bold">
                Diagnostic Workup Dispatched
              </span>
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between p-2 bg-surface-container-low rounded-lg font-clinical-data text-metadata-micro border border-outline-variant/20">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-base">monitor_heart</span>
                    <span className="font-bold text-on-surface">Repeat 12-Lead ECG (STAT bedside)</span>
                  </div>
                  <span className="font-clinical-data-mono text-primary font-semibold">In Progress · Technician at bedside</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-surface-container-low rounded-lg font-clinical-data text-metadata-micro border border-outline-variant/20">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-base">biotech</span>
                    <span className="font-bold text-on-surface">High-Sensitivity Troponin I (Serial Draw 0h &amp; 3h)</span>
                  </div>
                  <span className="font-clinical-data-mono text-error font-semibold">Phlebotomy Dispatched</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-surface-container-low rounded-lg font-clinical-data text-metadata-micro border border-outline-variant/20">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-base">radiology</span>
                    <span className="font-bold text-on-surface">Point-of-Care Echocardiogram (Bedside Wall Motion)</span>
                  </div>
                  <span className="font-clinical-data-mono text-secondary font-semibold">Bay Alerted</span>
                </div>
              </div>
            </div>

            {/* Emergency Rx Orders List */}
            <div className="flex flex-col gap-1 pt-2">
              <div className="flex items-center justify-between">
                <span className="font-metadata-micro text-metadata-micro text-outline uppercase font-bold">
                  Immediate Medical Management
                </span>
                <span className="font-metadata-micro text-metadata-micro text-error font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">shield_with_heart</span> Allergy Safety Check Passed
                </span>
              </div>
              {/* Rx 1 */}
              <div className="p-2.5 bg-surface-container-low rounded-xl flex flex-col gap-1 border border-outline-variant/20">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-body-strong text-clinical-data text-on-surface">Tab. Chewable Aspirin 325 mg</span>
                    <span className="px-1.5 py-0.2 rounded bg-surface-container-highest font-clinical-data-mono text-[9px] text-on-surface">
                      STAT
                    </span>
                  </div>
                  <span className="font-clinical-data-mono text-[11px] text-primary font-bold">GIVEN 14:22 IST</span>
                </div>
                <div className="flex items-center justify-between text-metadata-micro text-on-surface-variant font-metadata-micro">
                  <span>
                    Oral chewable. (Gastric protectant PPI co-ordered due to mild gastritis history; allergy alert clarified as non-anaphylactic).
                  </span>
                  <span className="font-clinical-data-mono text-outline">Dose 1 of 1</span>
                </div>
              </div>

              {/* Rx 2 */}
              <div className="p-2.5 bg-surface-container-low rounded-xl flex flex-col gap-1 border border-outline-variant/20">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-body-strong text-clinical-data text-on-surface">
                      Sublingual Nitroglycerin (NTG) 0.4 mg SL
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-surface-container-highest font-clinical-data-mono text-[9px] text-on-surface">
                      STAT
                    </span>
                  </div>
                  <span className="font-clinical-data-mono text-[11px] text-primary font-bold">ADMINISTERED 14:25 IST</span>
                </div>
                <div className="flex items-center justify-between text-metadata-micro text-on-surface-variant font-metadata-micro">
                  <span>BP re-check confirmed &gt;90 systolic (144/88 post-dose). Patient denies PDE-5 inhibitor use in last 48h.</span>
                  <span className="font-clinical-data-mono text-outline">Repeat q5m x3 prn</span>
                </div>
              </div>

              {/* Rx 3 */}
              <div className="p-2.5 bg-surface-container-low rounded-xl flex flex-col gap-1 border border-outline-variant/20">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-body-strong text-clinical-data text-on-surface">
                      Tab. Atorvastatin 80 mg Oral Loading Dose
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-surface-container-highest font-clinical-data-mono text-[9px] text-on-surface">
                      STAT
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (statinsStatus === "verifying") {
                        setStatinsStatus("given");
                        showToast("Nurse Verified: Atorvastatin 80mg loading dose administered.");
                      } else {
                        setStatinsStatus("verifying");
                      }
                    }}
                    className={`font-clinical-data-mono text-[11px] font-bold px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                      statinsStatus === "given"
                        ? "bg-primary-fixed text-on-primary-fixed"
                        : "bg-secondary text-on-secondary"
                    }`}
                  >
                    {statinsStatus === "given" ? "GIVEN 14:29 IST ✓" : "NURSE VERIFYING"}
                  </button>
                </div>
                <div className="flex items-center justify-between text-metadata-micro text-on-surface-variant font-metadata-micro">
                  <span>High-intensity statin therapy initiated prior to coronary intervention.</span>
                  <span className="font-clinical-data-mono text-outline">1 tab immediately</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6: Disposition & Immediate Transfer Plan */}
          <section
            className="bg-surface-container-lowest rounded-xl p-space-panel-padding shadow-sm flex flex-col gap-space-sm scroll-mt-20 border border-outline-variant/20"
            id="section-disposition"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-xl">transfer_within_a_station</span>
                <h2 className="font-section-title text-section-title text-on-surface">Disposition &amp; Next Clinical Actions</h2>
              </div>
              <span className="px-2 py-0.5 bg-error-container text-on-error-container font-clinical-data-mono text-metadata-micro font-bold rounded">
                CATH LAB ACTIVATION
              </span>
            </div>
            <div className="p-3 bg-surface-container-low rounded-xl flex flex-col gap-2 border border-error/20">
              <div className="flex items-center justify-between">
                <span className="font-clinical-data text-clinical-data font-bold text-on-surface">
                  Transfer to Resuscitation Bay 02 &amp; Cath Lab Holding
                </span>
                <span className="font-clinical-data-mono text-metadata-micro text-primary font-bold">Priority Code: RED</span>
              </div>
              <p className="font-body-default text-metadata-micro text-on-surface leading-relaxed">
                Patient briefed along with accompanying family (spouse). Consent form initiated for primary percutaneous coronary intervention (PCI). Oxygen continued at 2L via nasal cannula. Continuous cardiac monitor telemetry active.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1 font-clinical-data text-metadata-micro">
                <span className="px-2 py-1 bg-surface-container-lowest rounded text-on-surface font-semibold flex items-center gap-1 border border-outline-variant/20">
                  <span className="material-symbols-outlined text-xs text-primary">check</span> Interventionalist on Call: Dr. Sen
                </span>
                <span className="px-2 py-1 bg-surface-container-lowest rounded text-on-surface font-semibold flex items-center gap-1 border border-outline-variant/20">
                  <span className="material-symbols-outlined text-xs text-primary">check</span> Transport Gurney Ready
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* ========================================== */}
        {/* RIGHT PANE: EMBEDDED AI CLINICAL CO-PILOT  */}
        {/* ========================================== */}
        <div className="lg:col-span-3 flex flex-col gap-space-sm">
          {/* Co-Pilot Card */}
          <div className="bg-surface-container-lowest rounded-xl p-space-panel-padding shadow-sm flex flex-col gap-space-sm relative overflow-hidden border border-outline-variant/20">
            {/* Teal Left Accent Line */}
            <div className="absolute top-0 left-0 bottom-0 w-1 bg-primary"></div>
            <div className="flex items-center justify-between pl-1">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  smart_toy
                </span>
                <span className="font-section-title text-clinical-data text-on-surface">Decision Support</span>
              </div>
              <span className="font-clinical-data-mono text-[10px] bg-primary-container text-on-primary-container px-1.5 py-0.5 rounded font-bold">
                R4 EHR Citations
              </span>
            </div>
            <p className="font-metadata-micro text-metadata-micro text-on-surface-variant pl-1">
              Synthesizing real-time patient voice transcript, historic HbA1c, and ACC/AHA STEMI risk criteria.
            </p>

            {/* Pre-test Probability Box */}
            <div className="p-3 bg-surface-container-low rounded-xl flex flex-col gap-1.5 pl-3 border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <span className="font-metadata-micro text-[11px] text-outline font-bold uppercase">Pre-Test Probability</span>
                <span className="font-clinical-data-mono text-clinical-data text-error font-bold">&gt; 92% ACS</span>
              </div>
              {/* Mini Risk Bar */}
              <div className="w-full bg-surface-variant rounded-full h-2 overflow-hidden flex">
                <div className="bg-primary h-full w-1/4" title="Low (25%)"></div>
                <div className="bg-secondary h-full w-1/4" title="Moderate (25%)"></div>
                <div className="bg-error h-full w-1/2" title="High (50%)"></div>
              </div>
              <span className="font-metadata-micro text-[10px] text-error font-semibold">
                High risk for Acute Anterior STEMI
              </span>
            </div>

            {/* Evidence Citations Flow */}
            <div className="flex flex-col gap-2 pl-1 pt-1">
              <span className="font-metadata-micro text-metadata-micro text-outline uppercase font-bold tracking-wider">
                Grounding Evidence &amp; Sources
              </span>

              {/* Citation 1 */}
              <div
                onClick={() => {
                  scrollToSection("section-hpi");
                  showToast("Grounded in Patient Audio Stream #04 at 14:18 IST.");
                }}
                className="p-2 bg-surface-container-low rounded-lg flex flex-col gap-1 cursor-pointer hover:bg-surface-container transition-colors border border-outline-variant/20"
              >
                <div className="flex items-center justify-between">
                  <span className="font-clinical-data text-[11px] font-bold text-on-surface flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs text-primary">voice_chat</span> Patient Audio Transcript
                  </span>
                  <span className="font-clinical-data-mono text-[9px] text-outline">14:18 IST</span>
                </div>
                <p className="font-metadata-micro text-[10px] text-on-surface-variant">
                  &ldquo;Pressure... left haath aur jabde tak... 40 min se&rdquo; matches classic ischemic dermatome distribution (LR+ 4.1).
                </p>
              </div>

              {/* Citation 2 */}
              <div
                onClick={() => {
                  showToast("Grounded in Apollo Labs federated diagnostic panel from 14-Jul-2026.");
                }}
                className="p-2 bg-surface-container-low rounded-lg flex flex-col gap-1 cursor-pointer hover:bg-surface-container transition-colors border border-outline-variant/20"
              >
                <div className="flex items-center justify-between">
                  <span className="font-clinical-data text-[11px] font-bold text-on-surface flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs text-secondary">analytics</span> Prior Lab History
                  </span>
                  <span className="font-clinical-data-mono text-[9px] text-outline">14 Jul 2026</span>
                </div>
                <p className="font-metadata-micro text-[10px] text-on-surface-variant">
                  HbA1c 7.8% &amp; LDL-C 142 mg/dL. Baseline diabetic microvascular damage amplifies atherosclerotic rupture probability.
                </p>
              </div>

              {/* Citation 3 */}
              <div
                onClick={() => {
                  showToast("ACC/AHA Guideline 2024: Class I Recommendation for PCI D2B <90m.");
                }}
                className="p-2 bg-surface-container-low rounded-lg flex flex-col gap-1 cursor-pointer hover:bg-surface-container transition-colors border border-outline-variant/20"
              >
                <div className="flex items-center justify-between">
                  <span className="font-clinical-data text-[11px] font-bold text-on-surface flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs text-error">menu_book</span> ACC/AHA Guideline 2024
                  </span>
                  <span className="font-clinical-data-mono text-[9px] text-outline">Class I Rec</span>
                </div>
                <p className="font-metadata-micro text-[10px] text-on-surface-variant">
                  Door-to-Balloon (D2B) target &lt;90 minutes. Serial Troponin draw within 10 min of presentation.
                </p>
              </div>
            </div>

            {/* Co-Pilot 1-Click Action Buttons */}
            <div className="flex flex-col gap-1.5 pt-2 pl-1">
              <button
                onClick={() => {
                  setAiNoteInserted(true);
                  showToast("AI Clinical Impression inserted into encounter note chart.");
                }}
                className={`w-full py-2 px-3 rounded font-clinical-data text-metadata-micro font-bold transition-colors shadow-sm flex items-center justify-center gap-1.5 ${
                  aiNoteInserted
                    ? "bg-primary-container text-on-primary-container"
                    : "bg-primary text-on-primary hover:bg-primary-container"
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  {aiNoteInserted ? "check_circle" : "assignment_add"}
                </span>
                <span>{aiNoteInserted ? "AI Note Appended to Chart ✓" : "Insert AI Note to Chart"}</span>
              </button>
              <button
                onClick={() => setShowDdiModal(true)}
                className="w-full py-1.5 px-3 bg-surface-container text-on-surface-variant hover:text-on-surface font-clinical-data text-metadata-micro rounded font-semibold transition-colors flex items-center justify-center gap-1.5 border border-outline-variant/30"
              >
                <span className="material-symbols-outlined text-sm">security</span> Run Drug-Drug Interaction Check
              </button>
            </div>
          </div>

          {/* Quick Differential Diagnosis Explorer */}
          <div className="bg-surface-container-lowest rounded-xl p-space-panel-padding shadow-sm flex flex-col gap-space-xs border border-outline-variant/20">
            <span className="font-section-title text-clinical-data text-on-surface">Considered Differentials</span>
            <div className="flex flex-col gap-1 text-metadata-micro font-clinical-data">
              <div className="flex items-center justify-between p-1.5 bg-surface-container-low rounded border border-error/20">
                <span className="text-on-surface font-medium">1. Anterior STEMI / NSTEMI</span>
                <span className="font-clinical-data-mono text-error font-bold">92% Match</span>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-surface-container-low rounded opacity-80 border border-outline-variant/20">
                <span className="text-on-surface-variant">2. Acute Aortic Dissection</span>
                <span className="font-clinical-data-mono text-outline">6% (No tearing pain)</span>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-surface-container-low rounded opacity-70 border border-outline-variant/20">
                <span className="text-on-surface-variant">3. Acute Pulmonary Embolism</span>
                <span className="font-clinical-data-mono text-outline">2% (Clear bases)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* PERSISTENT CLINICAL BOTTOM ACTION BAR      */}
      {/* ========================================== */}
      <div className="sticky bottom-0 z-30 bg-surface-container-lowest p-space-sm rounded-xl shadow-md flex flex-wrap items-center justify-between gap-space-sm mt-space-sm border border-outline-variant/30">
        <div className="flex items-center gap-space-md">
          <div className="flex items-center gap-1.5 text-on-surface-variant font-metadata-micro text-metadata-micro">
            <span className="h-2 w-2 rounded-full bg-primary inline-block"></span>
            <span>
              Draft Encrypted &amp; Auto-saved:{" "}
              <strong className="text-on-surface font-clinical-data-mono">14:28:44 IST</strong>
            </span>
          </div>
          <span className="hidden md:inline text-outline text-xs">|</span>
          <div className="hidden md:flex items-center gap-1 text-on-surface-variant font-metadata-micro text-metadata-micro">
            <span className="material-symbols-outlined text-xs text-primary">verified_user</span>
            <span>ABHA Token Audit #9014 Locked</span>
          </div>
        </div>
        <div className="flex items-center gap-space-xs">
          <button
            onClick={() => {
              window.print();
            }}
            className="px-space-md py-2 bg-surface-container-low text-on-surface font-clinical-data text-metadata-micro font-semibold rounded hover:bg-surface-container transition-colors flex items-center gap-1 border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-sm">print</span> Print OPD Summary
          </button>
          <button
            onClick={() => showToast("Encounter draft snapshot saved to encrypted local cache.")}
            className="px-space-md py-2 bg-surface-container text-on-surface font-clinical-data text-metadata-micro font-semibold rounded hover:bg-surface-container-high transition-colors border border-outline-variant/30"
          >
            Save Draft
          </button>
          <button
            onClick={() => setShowSignModal(true)}
            className="px-space-lg py-2 bg-primary text-on-primary font-clinical-data text-clinical-data font-bold rounded shadow-sm hover:bg-primary-container transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">draw</span> Review &amp; Sign Encounter{" "}
            <span className="font-clinical-data-mono text-xs">→</span>
          </button>
        </div>
      </div>

      {/* Cath Lab Pre-Alert Modal */}
      {showCathLabModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-surface-container-lowest max-w-lg w-full rounded-2xl p-6 shadow-2xl border border-error flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <div className="flex items-center gap-2 text-error">
                <span className="material-symbols-outlined text-2xl">notifications_active</span>
                <h3 className="font-section-title text-section-title font-bold">Cath Lab Emergency Pre-Alert</h3>
              </div>
              <button
                onClick={() => setShowCathLabModal(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="bg-error-container/20 p-3 rounded-lg text-clinical-data text-on-error-container font-body-strong flex items-center gap-2 border border-error/30">
              <span className="material-symbols-outlined text-error">emergency</span>
              Direct Cath Lab Dispatch for Patient: Rahul Sharma (UHID: DEL-2024-8841)
            </div>
            <div className="flex flex-col gap-2 font-clinical-data text-metadata-micro">
              <div className="flex justify-between border-b border-outline-variant/20 pb-1">
                <span className="text-outline">Target Destination:</span>
                <span className="font-semibold text-on-surface">Resuscitation Bay 02 &amp; Cath Lab Suite 01</span>
              </div>
              <div className="flex justify-between border-b border-outline-variant/20 pb-1">
                <span className="text-outline">On-Call Interventionalist:</span>
                <span className="font-semibold text-primary">Dr. A. Sen (Interventional Cardiology)</span>
              </div>
              <div className="flex justify-between border-b border-outline-variant/20 pb-1">
                <span className="text-outline">Estimated Door-to-Balloon Target:</span>
                <span className="font-semibold text-error">&lt; 65 minutes remaining</span>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-outline-variant/30">
              <button
                onClick={() => setShowCathLabModal(false)}
                className="px-4 py-2 rounded bg-surface-container-high text-on-surface text-clinical-data font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setCathLabAlerted(true);
                  setShowCathLabModal(false);
                  showToast("Cath Lab Team paged via Code STEMI pager. Bay 02 transport dispatched.");
                }}
                className="px-4 py-2 rounded bg-error text-on-error text-clinical-data font-semibold hover:bg-error-container hover:text-on-error-container"
              >
                Confirm Dispatch &amp; Page Team
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review & Sign Encounter Modal */}
      {showSignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-surface-container-lowest max-w-lg w-full rounded-2xl p-6 shadow-2xl border border-primary flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-2xl">draw</span>
                <h3 className="font-section-title text-section-title font-bold">Sign &amp; Lock Clinical Encounter</h3>
              </div>
              <button
                onClick={() => setShowSignModal(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="font-clinical-data text-clinical-data text-on-surface leading-relaxed">
              Initiate Encounter Sign-Off and transmit STAT Cath Lab Transfer order for{" "}
              <strong>Rahul Sharma (Token #104)</strong>? This will lock the consultation notes and generate a digital signature on the ABHA registry.
            </p>
            <div className="bg-surface-container-low p-3 rounded-lg text-metadata-micro text-on-surface-variant flex flex-col gap-1 border border-outline-variant/20">
              <div className="flex justify-between">
                <span>Signer:</span>
                <span className="font-semibold text-on-surface">Dr. Rohit Verma (Chief of Clinical Services)</span>
              </div>
              <div className="flex justify-between">
                <span>Security Token:</span>
                <span className="font-clinical-data-mono">ABHA-DSC-DEL-0412</span>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-outline-variant/30">
              <button
                onClick={() => setShowSignModal(false)}
                className="px-4 py-2 rounded bg-surface-container-high text-on-surface text-clinical-data font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSignEncounterConfirm}
                className="px-4 py-2 rounded bg-primary text-on-primary text-clinical-data font-semibold hover:bg-primary-container"
              >
                Sign &amp; Transmit STEMI Protocol
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Comorbidity Modal */}
      {showAddComorbidityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <form
            onSubmit={handleAddComorbidity}
            className="bg-surface-container-lowest max-w-md w-full rounded-2xl p-6 shadow-2xl border border-primary flex flex-col gap-4 animate-in fade-in zoom-in-95"
          >
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-2xl">add_circle</span>
                <h3 className="font-section-title text-section-title font-bold">Add Encounter Comorbidity</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddComorbidityModal(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-metadata-micro text-outline font-semibold uppercase">Condition Name</label>
              <input
                type="text"
                required
                value={newComorbidityName}
                onChange={(e) => setNewComorbidityName(e.target.value)}
                placeholder="e.g. Dyslipidemia, OSA"
                className="p-2 rounded border border-outline-variant text-clinical-data bg-surface-container-low focus:border-primary focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-metadata-micro text-outline font-semibold uppercase">ICD-10 Code</label>
              <input
                type="text"
                value={newComorbidityIcd}
                onChange={(e) => setNewComorbidityIcd(e.target.value)}
                placeholder="e.g. E78.5"
                className="p-2 rounded border border-outline-variant font-clinical-data-mono text-clinical-data bg-surface-container-low focus:border-primary focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-outline-variant/30">
              <button
                type="button"
                onClick={() => setShowAddComorbidityModal(false)}
                className="px-4 py-2 rounded bg-surface-container-high text-on-surface text-clinical-data font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-primary text-on-primary text-clinical-data font-semibold hover:bg-primary-container"
              >
                Add Comorbidity
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DDI Safety Check Modal */}
      {showDdiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-surface-container-lowest max-w-lg w-full rounded-2xl p-6 shadow-2xl border border-secondary flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <div className="flex items-center gap-2 text-secondary">
                <span className="material-symbols-outlined text-2xl">security</span>
                <h3 className="font-section-title text-section-title font-bold">Drug-Drug Interaction (DDI) Safety Scan</h3>
              </div>
              <button
                onClick={() => setShowDdiModal(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="bg-primary-fixed/20 p-3 rounded-lg text-clinical-data text-primary font-body-strong flex items-center gap-2 border border-primary/30">
              <span className="material-symbols-outlined">verified</span>
              0 Severe / Hard-Stop Contraindications Detected across 5 Active Medications.
            </div>
            <div className="flex flex-col gap-2 font-clinical-data text-metadata-micro">
              <div className="p-2 bg-surface-container-low rounded flex items-center justify-between">
                <span>Aspirin 325mg + Sublingual NTG 0.4mg</span>
                <span className="text-primary font-bold">Compatible (Monitored BP)</span>
              </div>
              <div className="p-2 bg-surface-container-low rounded flex items-center justify-between">
                <span>Atorvastatin 80mg + Telmisartan 40mg</span>
                <span className="text-primary font-bold">No Adverse Interaction</span>
              </div>
              <div className="p-2 bg-surface-container-low rounded flex items-center justify-between">
                <span>Penicillin Absolute Allergy Guard</span>
                <span className="text-error font-bold">No Beta-Lactams in Regimen ✓</span>
              </div>
            </div>
            <div className="flex justify-end pt-2 border-t border-outline-variant/30">
              <button
                onClick={() => setShowDdiModal(false)}
                className="px-4 py-2 rounded bg-primary text-on-primary text-clinical-data font-semibold"
              >
                Close Safety Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
