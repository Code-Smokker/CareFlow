/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function InpatientEncounterPage() {
  const params = useParams();
  const rawId = (params?.id as string) || "IPD-2026-00921";
  const ipdId = rawId.startsWith("IPD") ? rawId : "IPD-2026-00921";

  // Active Tab
  const [activeTab, setActiveTab] = useState<string>("Overview");

  // Notifications Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Modals
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isCpoeModalOpen, setIsCpoeModalOpen] = useState(false);
  const [isEmarModalOpen, setIsEmarModalOpen] = useState(false);
  const [isFaceSheetModalOpen, setIsFaceSheetModalOpen] = useState(false);
  const [isFhirModalOpen, setIsFhirModalOpen] = useState(false);
  const [isInsuranceModalOpen, setIsInsuranceModalOpen] = useState(false);
  const [isAttendantModalOpen, setIsAttendantModalOpen] = useState(false);
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);

  // Form states
  const [attendantName, setAttendantName] = useState("");
  const [attendantRelation, setAttendantRelation] = useState("Brother");

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

      {/* Sticky Red Flag & Inpatient Header Banner */}
      <div className="flex flex-col rounded-xl overflow-hidden bg-surface-container-lowest shadow-sm border border-outline-variant/20">
        {/* Red Flag Strip */}
        <div className="bg-error text-on-error px-panel-padding py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-base animate-pulse">warning</span>
            <span className="font-clinical-data-mono text-clinical-data tracking-wide uppercase font-semibold">
              P1 CRITICAL STEMI PROTOCOL ACTIVE · PRIMARY PCI IN PROGRESS · NPO · ALLERGY: PENICILLIN (ANAPHYLAXIS)
            </span>
          </div>
          <div className="flex items-center gap-space-xs font-clinical-data-mono text-metadata-micro bg-on-error/20 px-2 py-0.5 rounded">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-on-error opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-on-error"></span>
            </span>
            CODE STEMI DOOR-TO-BALLOON: 28m elapsed
          </div>
        </div>

        {/* Core Inpatient Context Panel */}
        <div className="p-panel-padding flex flex-col xl:flex-row xl:items-center justify-between gap-space-md">
          <div className="flex items-start md:items-center gap-space-md">
            {/* Patient Identity & Avatar */}
            <div className="relative shrink-0">
              <img
                className="w-14 h-14 rounded-xl object-cover ring-2 ring-error"
                alt="Rahul Sharma"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmpTXi-nNkknPHERwN4JsQbLuLgyKkl4P9vOoL7pnBoX5AqHFopuTLODrTk6LpuBkf9_9L2V1j1vxKzPM9kKacuIygfnf-XBE8tPndJDZRwyQnIiHUhLulBqJfpTnVsfXTJXeLFlMaR2qEceWlqW-xWfWBf-oKA-NNzbMkPJRpI77dwWx-zkdy9aALOyIoc0Xq9v-R0-BBcPOgNbeCa__gdCE2wpJgVo8gOVwQ3s-qhckgjOIFVrqt"
              />
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 bg-error text-on-error font-clinical-data-mono text-metadata-micro rounded font-bold">
                P1
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex flex-wrap items-center gap-space-xs">
                <h1 className="font-page-title text-page-title text-on-surface">Rahul Sharma</h1>
                <span className="font-body-default text-clinical-data text-on-surface-variant">42Y / Male</span>
                <span className="px-2 py-0.5 bg-primary-container text-on-primary-container rounded font-clinical-data text-metadata-micro flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">verified</span> ABHA Verified · 91-8842-1920-4491
                </span>
                <span className="px-2 py-0.5 bg-surface-container-highest text-on-surface-variant font-clinical-data-mono text-metadata-micro rounded">
                  UHID: DEL-2024-8841
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-y-1 gap-x-space-md text-on-surface-variant font-clinical-data text-metadata-micro">
                <span className="flex items-center gap-1 font-body-strong text-primary">
                  <span className="material-symbols-outlined text-sm">meeting_room</span> Bed: CCU-01 (Coronary Care, Floor 2)
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">tag</span> {ipdId}
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">schedule</span> Admitted: 18 Oct 2024, 14:15 IST (LOS: Day 0)
                </span>
                <span className="flex items-center gap-1 font-body-strong text-on-surface">
                  <span className="material-symbols-outlined text-sm text-primary">stethoscope</span> Attending: Dr. Rohit Verma
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">assignment_ind</span> Nurse: Sr. Ancy Thomas, RN (#4419)
                </span>
              </div>
            </div>
          </div>

          {/* Action Bar Cluster */}
          <div className="flex flex-wrap items-center gap-space-xs">
            <button
              onClick={() => setIsTransferModalOpen(true)}
              className="h-9 px-3 bg-primary text-on-primary rounded font-body-strong text-clinical-data flex items-center gap-1.5 hover:bg-primary-container transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-base">emergency_share</span>
              Transfer Bed / Cath Lab
            </button>
            <button
              onClick={() => setIsCpoeModalOpen(true)}
              className="h-9 px-3 bg-surface-container text-on-surface hover:bg-surface-container-high rounded font-body-strong text-clinical-data flex items-center gap-1.5 transition-colors border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-base text-primary">add_notes</span>
              CPOE Orders
            </button>
            <button
              onClick={() => setIsEmarModalOpen(true)}
              className="h-9 px-3 bg-surface-container text-on-surface hover:bg-surface-container-high rounded font-body-strong text-clinical-data flex items-center gap-1.5 transition-colors border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-base text-secondary">medication</span>
              eMAR Flowsheet
            </button>
            <button
              onClick={() => setIsFaceSheetModalOpen(true)}
              className="h-9 px-3 bg-surface-container text-on-surface hover:bg-surface-container-high rounded font-body-strong text-clinical-data flex items-center gap-1.5 transition-colors border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-base">print</span>
              Face Sheet
            </button>
            <button
              onClick={() => setIsFhirModalOpen(true)}
              className="h-9 px-2.5 bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded flex items-center transition-colors border border-outline-variant/30"
              title="FHIR Encounter Details"
            >
              <span className="material-symbols-outlined text-base">data_object</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="px-panel-padding bg-surface-container-low flex items-center gap-space-xs overflow-x-auto border-t border-surface-container">
          {[
            { id: "Overview", icon: "dashboard", label: "Overview" },
            { id: "Clinical Notes", icon: "clinical_notes", label: "Clinical Notes" },
            { id: "Flowsheet & Vitals", icon: "monitor_heart", label: "Flowsheet & Vitals" },
            {
              id: "Inpatient Orders",
              icon: "order_approve",
              label: "Inpatient Orders",
              badge: "4 STAT",
            },
            { id: "Medications (eMAR)", icon: "pill", label: "Medications (eMAR)" },
            { id: "Investigations & Labs", icon: "biotech", label: "Investigations & Labs" },
            { id: "Nursing Care Plan", icon: "health_and_safety", label: "Nursing Care Plan" },
            { id: "Consents & Legal", icon: "gavel", label: "Consents & Legal" },
            { id: "Billing & Insurance", icon: "payments", label: "Billing & Insurance" },
            { id: "Discharge Milestones", icon: "flag", label: "Discharge Milestones" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id !== "Overview") {
                    showToast(`Switched view to: ${tab.label}`);
                  }
                }}
                className={`px-3 py-2.5 font-clinical-data text-clinical-data transition-colors rounded-t-lg flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? "font-body-strong text-primary bg-surface-container-lowest shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                }`}
              >
                <span className="material-symbols-outlined text-base">{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.2 bg-primary-container text-on-primary-container text-metadata-micro font-clinical-data-mono rounded-full font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Dual Column Working Workspace (70% Clinical / 30% Operational & Logistics) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md items-start">
        {/* LEFT COLUMN: Inpatient Clinical Chart (70% on large viewports) */}
        <div className="lg:col-span-8 flex flex-col gap-space-md">
          {/* Card 1: Admitting Diagnosis & Synoptic Summary */}
          <div className="bg-surface-container-lowest rounded-xl p-panel-padding shadow-sm flex flex-col gap-space-sm border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-xl">medical_services</span>
                <h2 className="font-section-title text-section-title text-on-surface">
                  Admitting Diagnosis &amp; Clinical Presentation
                </h2>
              </div>
              <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant px-2 py-0.5 bg-surface-container rounded">
                ICD-10 / SNOMED CT Encoded
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm mt-1">
              {/* Primary Diagnosis */}
              <div className="md:col-span-2 bg-error-container/20 rounded-lg p-space-sm flex flex-col gap-1 border border-error/20">
                <div className="flex items-center justify-between">
                  <span className="font-metadata-micro text-metadata-micro text-error font-bold uppercase tracking-wider">
                    Primary Working Diagnosis
                  </span>
                  <span className="font-clinical-data-mono text-metadata-micro px-1.5 py-0.5 bg-surface-container-lowest text-error rounded font-semibold">
                    ICD-10 I21.0
                  </span>
                </div>
                <span className="font-body-strong text-clinical-data text-on-surface font-bold">
                  Acute Transmural Myocardial Infarction of Anterior Wall (STEMI)
                </span>
                <div className="flex items-center gap-space-sm font-metadata-micro text-metadata-micro text-on-surface-variant">
                  <span>SNOMED CT: 57054005</span>
                  <span>•</span>
                  <span className="text-error font-medium">ST-Elevation &gt;2.5mm V2–V4</span>
                  <span>•</span>
                  <span className="text-error font-medium">Troponin I: 4.82 ng/mL ↑</span>
                </div>
              </div>

              {/* Comorbidities */}
              <div className="bg-surface-container-low rounded-lg p-space-sm flex flex-col gap-1 border border-surface-container">
                <span className="font-metadata-micro text-metadata-micro text-outline font-bold uppercase tracking-wider">
                  Documented Comorbidities
                </span>
                <ul className="font-clinical-data text-metadata-micro text-on-surface flex flex-col gap-0.5">
                  <li className="flex items-center justify-between">
                    <span>Essential Hypertension (I10)</span>
                    <span className="text-on-surface-variant font-clinical-data-mono">Stage 2</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Type 2 DM (E11.9)</span>
                    <span className="text-error font-clinical-data-mono font-medium">HbA1c 7.8%</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Atherogenic Dyslipidemia</span>
                    <span className="text-on-surface-variant font-clinical-data-mono">E78.5</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Synopsis Narrative */}
            <div className="bg-surface-container-low/60 rounded-lg p-space-sm text-clinical-data text-on-surface-variant flex flex-col gap-1 border border-surface-container">
              <div className="flex items-center gap-1 font-body-strong text-metadata-micro text-on-surface uppercase">
                <span className="material-symbols-outlined text-sm text-primary">notes</span>
                Admission Clinical Synopsis
              </div>
              <p className="font-body-default text-clinical-data leading-relaxed">
                42-year-old male with no prior reported CAD presenting with 45 minutes of hyper-acute, crushing
                retrosternal chest pain radiating to left mandible and diaphoresis. Immediate 12-lead ECG confirmed anterior
                STEMI. Pre-cath contrast screening validated (eGFR 98 mL/min). Dual antiplatelet loading completed.
                Transferred directly to Cath Lab Suite 01 under emergency code activation.
              </p>
            </div>

            {/* Live Hemodynamics Micro-Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs pt-1">
              <div className="bg-surface-container rounded-lg p-2 flex flex-col">
                <span className="font-metadata-micro text-metadata-micro text-outline uppercase font-semibold">
                  NIBP (mmHg)
                </span>
                <span className="font-clinical-data-mono text-section-title font-bold text-error">
                  154/98 <span className="text-metadata-micro font-normal">↑ High</span>
                </span>
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">MAP: 116 mmHg</span>
              </div>
              <div className="bg-surface-container rounded-lg p-2 flex flex-col">
                <span className="font-metadata-micro text-metadata-micro text-outline uppercase font-semibold">
                  Heart Rate
                </span>
                <span className="font-clinical-data-mono text-section-title font-bold text-on-surface">
                  104 <span className="text-metadata-micro font-normal">bpm</span>
                </span>
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">Sinus Tachycardia</span>
              </div>
              <div className="bg-surface-container rounded-lg p-2 flex flex-col">
                <span className="font-metadata-micro text-metadata-micro text-outline uppercase font-semibold">
                  SpO2 (Room Air)
                </span>
                <span className="font-clinical-data-mono text-section-title font-bold text-on-surface">97%</span>
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">Nasal Cannula 2L/m</span>
              </div>
              <div className="bg-surface-container rounded-lg p-2 flex flex-col">
                <span className="font-metadata-micro text-metadata-micro text-outline uppercase font-semibold">
                  POC Blood Glucose
                </span>
                <span className="font-clinical-data-mono text-section-title font-bold text-error">
                  184 <span className="text-metadata-micro font-normal">mg/dL ↑</span>
                </span>
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">Sliding Scale Active</span>
              </div>
            </div>
          </div>

          {/* Card 2: Longitudinal Inpatient Care Timeline & Telemetry Events */}
          <div className="bg-surface-container-lowest rounded-xl p-panel-padding shadow-sm flex flex-col gap-space-sm border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-xl">timeline</span>
                <h2 className="font-section-title text-section-title text-on-surface">
                  Inpatient Care Events &amp; Clinical Trajectory (Day 0)
                </h2>
              </div>
              <div className="flex items-center gap-space-xs">
                <span className="font-clinical-data-mono text-metadata-micro text-primary flex items-center gap-1 font-bold">
                  <span className="h-2 w-2 rounded-full bg-primary animate-ping"></span>
                  Live Telemetry: Mindray N12
                </span>
              </div>
            </div>

            {/* Vertical Timeline Items */}
            <div className="relative pl-6 flex flex-col gap-space-md before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-container-high">
              {/* Event 1: Cath Lab Suite */}
              <div className="relative flex flex-col gap-1">
                <div className="absolute -left-[1.65rem] top-0.5 h-3.5 w-3.5 rounded-full bg-error ring-4 ring-surface-container-lowest flex items-center justify-center"></div>
                <div className="flex items-center justify-between">
                  <span className="font-clinical-data-mono text-clinical-data text-error font-bold">
                    14:35 IST · Intra-Hospital Mobilization
                  </span>
                  <span className="font-metadata-micro text-metadata-micro px-2 py-0.5 bg-error text-on-error rounded font-bold">
                    ACTIVE NOW
                  </span>
                </div>
                <p className="font-body-strong text-clinical-data text-on-surface">
                  Transfer to Cath Lab Suite 01 Mobilized with Transport Telemetry
                </p>
                <p className="font-body-default text-metadata-micro text-on-surface-variant">
                  Attending Interventionalist Dr. Rohit Verma scrubs in. Pacing and radial access sterile pack prepped.
                  Defibrillator pads adhered.
                </p>
              </div>

              {/* Event 2: Consent Signed */}
              <div className="relative flex flex-col gap-1">
                <div className="absolute -left-[1.65rem] top-0.5 h-3.5 w-3.5 rounded-full bg-primary ring-4 ring-surface-container-lowest"></div>
                <div className="flex items-center justify-between">
                  <span className="font-clinical-data-mono text-clinical-data text-on-surface font-semibold">
                    14:30 IST · Legal &amp; Informed Consent
                  </span>
                  <span className="font-metadata-micro text-metadata-micro text-outline">Aadhaar OTP #8410</span>
                </div>
                <p className="font-body-strong text-clinical-data text-on-surface">
                  Primary Angioplasty / Stenting Consent Witnessed &amp; Digitally Counter-signed
                </p>
                <p className="font-body-default text-metadata-micro text-on-surface-variant">
                  High-risk consent verified with spouse Sunita Sharma (Primary Next-of-Kin). Risks of dye nephropathy and
                  bleeding explained.
                </p>
              </div>

              {/* Event 3: Contrast Clearance */}
              <div className="relative flex flex-col gap-1">
                <div className="absolute -left-[1.65rem] top-0.5 h-3.5 w-3.5 rounded-full bg-secondary ring-4 ring-surface-container-lowest"></div>
                <div className="flex items-center justify-between">
                  <span className="font-clinical-data-mono text-clinical-data text-on-surface font-semibold">
                    14:26 IST · Laboratory Clearance
                  </span>
                  <span className="font-metadata-micro text-metadata-micro text-outline">
                    STAT Lab Automated Dispatch
                  </span>
                </div>
                <p className="font-body-strong text-clinical-data text-on-surface">
                  Pre-Cath Contrast Clearance Validated
                </p>
                <p className="font-body-default text-metadata-micro text-on-surface-variant">
                  Serum Creatinine: 0.88 mg/dL · eGFR: 98 mL/min/1.73m² (Low CIN Risk) · Platelets: 242,000 /µL.
                </p>
              </div>

              {/* Event 4: STAT Meds */}
              <div className="relative flex flex-col gap-1">
                <div className="absolute -left-[1.65rem] top-0.5 h-3.5 w-3.5 rounded-full bg-primary-container ring-4 ring-surface-container-lowest"></div>
                <div className="flex items-center justify-between">
                  <span className="font-clinical-data-mono text-clinical-data text-on-surface font-semibold">
                    14:22 IST · Nursing Administration
                  </span>
                  <span className="font-metadata-micro text-metadata-micro text-outline">Sr. Ancy Thomas, RN</span>
                </div>
                <p className="font-body-strong text-clinical-data text-on-surface">
                  STEMI Loading Regimen Administered
                </p>
                <div className="flex flex-wrap gap-space-xs font-clinical-data-mono text-metadata-micro mt-0.5">
                  <span className="px-2 py-0.5 bg-surface-container text-on-surface rounded">Aspirin 325mg PO (Chewed)</span>
                  <span className="px-2 py-0.5 bg-surface-container text-on-surface rounded">Ticagrelor 180mg PO</span>
                  <span className="px-2 py-0.5 bg-surface-container text-on-surface rounded">Atorvastatin 80mg PO</span>
                  <span className="px-2 py-0.5 bg-surface-container text-on-surface rounded">Heparin 5000 IU IV STAT</span>
                </div>
              </div>

              {/* Event 5: Bed Assigned */}
              <div className="relative flex flex-col gap-1">
                <div className="absolute -left-[1.65rem] top-0.5 h-3.5 w-3.5 rounded-full bg-outline-variant ring-4 ring-surface-container-lowest"></div>
                <div className="flex items-center justify-between">
                  <span className="font-clinical-data-mono text-clinical-data text-on-surface font-semibold">
                    14:20 IST · Inpatient Placement
                  </span>
                  <span className="font-metadata-micro text-metadata-micro text-outline">Admission Desk</span>
                </div>
                <p className="font-body-strong text-clinical-data text-on-surface">
                  Bed CCU-01 Assigned &amp; Mindray N12 Telemetry Synchronized
                </p>
              </div>

              {/* Event 6: Admission Registered */}
              <div className="relative flex flex-col gap-1">
                <div className="absolute -left-[1.65rem] top-0.5 h-3.5 w-3.5 rounded-full bg-outline ring-4 ring-surface-container-lowest"></div>
                <div className="flex items-center justify-between">
                  <span className="font-clinical-data-mono text-clinical-data text-on-surface font-semibold">
                    14:15 IST · Emergency IPD Registry
                  </span>
                  <span className="font-metadata-micro text-metadata-micro text-outline">Encounter Created</span>
                </div>
                <p className="font-body-strong text-clinical-data text-on-surface">
                  Emergency Inpatient Admission Registered ({ipdId})
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Care Team Dock & Safety Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            {/* Care Team Dock */}
            <div className="bg-surface-container-lowest rounded-xl p-panel-padding shadow-sm flex flex-col gap-space-sm border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <h3 className="font-section-title text-subheading text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-base">groups</span>
                  Assigned Clinical Team
                </h3>
                <button
                  onClick={() => setIsReassignModalOpen(true)}
                  className="font-clinical-data text-metadata-micro text-primary hover:underline"
                >
                  Change / Reassign
                </button>
              </div>
              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center justify-between p-2 bg-surface-container-low rounded-lg border border-surface-container">
                  <div className="flex items-center gap-2">
                    <img
                      className="w-8 h-8 rounded-full object-cover"
                      alt="Dr Rohit Verma"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZwrb3XXsMbuUDCCXxxRiABgVXbkAMmCpHb1NBPdlp-8tn3lZ8D1TnmKmeKPRjEa4t5g5cU8Ingj27PxCPDfXYSfrLlezAJp6DHmniwo_GISdgc8syMavUlGWf8K4xfMKjHrVVZvql7ucprZsvhmsI4iVYnpXak29UXDiSX7d44dgLRr6YHzpL4C1UUQySmEUWT19GJL6D4nqAkv5YDsD4qmlFUXG8_BZnhsx9i6Td8RrUcaS0Y8KP"
                    />
                    <div className="flex flex-col">
                      <span className="font-body-strong text-clinical-data text-on-surface font-semibold">
                        Dr. Rohit Verma
                      </span>
                      <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                        Lead Interventionalist · Chief Clinical Services
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-primary-container text-on-primary-container rounded font-clinical-data text-metadata-micro font-bold">
                    Attending
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 bg-surface-container-low rounded-lg border border-surface-container">
                  <div className="flex items-center gap-2">
                    <img
                      className="w-8 h-8 rounded-full object-cover"
                      alt="Dr Sameer Kulkarni"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHLOFLL-0JPj48FXljN6r-Rf0XrvH5YQF82b6cWFhkBYjNwVz3yaR5_K_3aaUWGvEvVLmK2vTbUGjzWUdwuN_Pgkbn5fH5h9rKjHA-3onYaTxn4orvkPcUSFVvST7c-PW8Qs09etmnDTu07MjSFo0s-FrWP5j4F0pqvepDquaLLWuXy7HRQb-ce3D6edvuOaU_VaFTEBsxUbO6sM39dLdU_Bb0beK_NsZ0-Kfj8IYI8wDLAbS_L0oj"
                    />
                    <div className="flex flex-col">
                      <span className="font-body-strong text-clinical-data text-on-surface font-semibold">
                        Dr. Sameer Kulkarni
                      </span>
                      <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                        Endocrinology (Glycemic Management)
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-surface-container text-on-surface-variant rounded font-clinical-data text-metadata-micro">
                    Co-Attending
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 bg-surface-container-low rounded-lg border border-surface-container">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xs">
                      SR
                    </div>
                    <div className="flex flex-col">
                      <span className="font-body-strong text-clinical-data text-on-surface font-semibold">
                        Dr. Sneha Rao
                      </span>
                      <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                        Cardiology Fellow / Registrar (Station 04)
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-surface-container text-on-surface-variant rounded font-clinical-data text-metadata-micro">
                    On-Duty
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 bg-surface-container-low rounded-lg border border-surface-container">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs">
                      AT
                    </div>
                    <div className="flex flex-col">
                      <span className="font-body-strong text-clinical-data text-on-surface font-semibold">
                        Sr. Ancy Thomas, RN
                      </span>
                      <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                        Shift In-Charge · CCU Lead (#4419)
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-primary-container text-on-primary-container rounded font-clinical-data text-metadata-micro font-bold">
                    Primary RN
                  </span>
                </div>
              </div>
            </div>

            {/* Inpatient Safety, Fall Risk & Nursing Flags */}
            <div className="bg-surface-container-lowest rounded-xl p-panel-padding shadow-sm flex flex-col gap-space-sm border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <h3 className="font-section-title text-subheading text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-error text-base">shield</span>
                  Inpatient Safety Ledger &amp; Scores
                </h3>
                <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                  Assessed: 14:25
                </span>
              </div>
              <div className="flex flex-col gap-space-xs">
                {/* Morse Fall Scale */}
                <div className="p-2 bg-error-container/20 rounded-lg flex items-center justify-between border border-error/20">
                  <div className="flex flex-col">
                    <span className="font-body-strong text-clinical-data text-error font-bold">
                      Morse Fall Scale: 65 (High Risk)
                    </span>
                    <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                      Bed alarm activated · Both side rails engaged · Strict assisted transfer
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-error">warning</span>
                </div>

                {/* Braden Scale */}
                <div className="p-2 bg-surface-container-low rounded-lg flex items-center justify-between border border-surface-container">
                  <div className="flex flex-col">
                    <span className="font-body-strong text-clinical-data text-on-surface font-bold">
                      Braden Pressure Score: 18
                    </span>
                    <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                      Low risk · Q2H repositioning log active · Dynamic air mattress enabled
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-primary">check_circle</span>
                </div>

                {/* Allergy Verification Band */}
                <div className="p-2 bg-error/10 rounded-lg flex items-center justify-between border border-error/20">
                  <div className="flex flex-col">
                    <span className="font-body-strong text-clinical-data text-error font-bold">
                      Allergy Band Verified: Red Wristband
                    </span>
                    <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                      Severe Type 1 Anaphylaxis: Penicillin / Beta-lactams. Barcode confirmed.
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-error">dangerous</span>
                </div>

                {/* Dietary Status */}
                <div className="p-2 bg-surface-container-low rounded-lg flex items-center justify-between border border-surface-container">
                  <div className="flex flex-col">
                    <span className="font-body-strong text-clinical-data text-on-surface font-bold">
                      Dietary Status: Strict NPO
                    </span>
                    <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                      Nothing by mouth pre-procedure. IV maintenance D5 1/2 NS at 50 mL/h.
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-outline">no_food</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Inpatient Operational Status, Logistics, Payer & Milestones (30%) */}
        <div className="lg:col-span-4 flex flex-col gap-space-md">
          {/* Module 1: Inpatient Bed & Ward Logistics */}
          <div className="bg-surface-container-lowest rounded-xl p-panel-padding shadow-sm flex flex-col gap-space-sm border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-xl">bed</span>
                <h2 className="font-section-title text-section-title text-on-surface">Bed &amp; Ward Logistics</h2>
              </div>
              <span className="px-2 py-0.5 bg-primary-container text-on-primary-container rounded font-clinical-data text-metadata-micro font-bold">
                OCCUPIED
              </span>
            </div>
            <div className="flex flex-col gap-2 font-clinical-data text-clinical-data">
              <div className="flex items-center justify-between py-1 bg-surface-container-low px-2 rounded">
                <span className="text-on-surface-variant font-metadata-micro text-metadata-micro uppercase">
                  Assigned Unit
                </span>
                <span className="font-body-strong text-on-surface font-semibold">
                  Floor 2 · Coronary Care Unit (CCU)
                </span>
              </div>
              <div className="flex items-center justify-between py-1 bg-surface-container-low px-2 rounded">
                <span className="text-on-surface-variant font-metadata-micro text-metadata-micro uppercase">
                  Bed Code / Port
                </span>
                <span className="font-clinical-data-mono font-bold text-primary">CCU-01 (Resus Bay 02)</span>
              </div>
              <div className="flex items-center justify-between py-1 bg-surface-container-low px-2 rounded">
                <span className="text-on-surface-variant font-metadata-micro text-metadata-micro uppercase">
                  Bed Class
                </span>
                <span className="text-on-surface">Intensive Care (Continuous 12L)</span>
              </div>
              <div className="flex items-center justify-between py-1 bg-surface-container-low px-2 rounded">
                <span className="text-on-surface-variant font-metadata-micro text-metadata-micro uppercase">
                  Daily Room Tariff
                </span>
                <span className="font-clinical-data-mono text-on-surface font-semibold">₹12,500 / day</span>
              </div>
              <div className="flex items-center justify-between py-1 bg-surface-container-low px-2 rounded">
                <span className="text-on-surface-variant font-metadata-micro text-metadata-micro uppercase">
                  Hardware Hooks
                </span>
                <span className="text-on-surface-variant text-metadata-micro">
                  O2 High Flow, Suction, Mindray Telemetry
                </span>
              </div>
            </div>
            <div className="pt-1 flex gap-space-xs">
              <button
                onClick={() => setIsTransferModalOpen(true)}
                className="flex-1 h-8 bg-surface-container text-on-surface hover:bg-surface-container-high rounded font-body-strong text-metadata-micro flex items-center justify-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">swap_horiz</span>
                Request Ward Transfer
              </button>
              <button
                onClick={() => showToast("Bed parameters locked on ward controller.")}
                className="h-8 px-2.5 bg-surface-container text-on-surface hover:bg-surface-container-high rounded font-body-strong text-metadata-micro flex items-center justify-center gap-1 transition-colors"
                title="Lock Bed Parameters"
              >
                <span className="material-symbols-outlined text-sm">lock</span>
              </button>
            </div>
          </div>

          {/* Module 2: Payer & Cashless Pre-Auth Status */}
          <div className="bg-surface-container-lowest rounded-xl p-panel-padding shadow-sm flex flex-col gap-space-sm border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-tertiary text-xl">account_balance_wallet</span>
                <h2 className="font-section-title text-section-title text-on-surface">Insurance Pre-Auth</h2>
              </div>
              <span className="px-2 py-0.5 bg-primary text-on-primary rounded font-clinical-data text-metadata-micro font-bold">
                APPROVED
              </span>
            </div>
            <div className="flex flex-col gap-2 font-clinical-data text-clinical-data">
              <div className="p-2.5 bg-surface-container-low rounded-lg flex flex-col gap-1 border border-surface-container">
                <div className="flex items-center justify-between">
                  <span className="font-body-strong text-on-surface font-semibold">
                    ICICI Lombard Health Insurance
                  </span>
                  <span className="font-metadata-micro text-metadata-micro text-outline">TPA: MediAssist</span>
                </div>
                <div className="flex items-center justify-between font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                  <span>Policy: POL-882190</span>
                  <span className="font-semibold text-primary">PRE-AUTH-2024-88412</span>
                </div>
              </div>

              {/* Financial Burn Gauge */}
              <div className="p-2.5 bg-surface-container-low rounded-lg flex flex-col gap-1.5 border border-surface-container">
                <div className="flex items-center justify-between font-clinical-data-mono text-metadata-micro">
                  <span className="text-on-surface-variant">Initial Pre-Auth Cap:</span>
                  <span className="font-bold text-on-surface">₹4,50,000</span>
                </div>
                <div className="flex items-center justify-between font-clinical-data-mono text-metadata-micro">
                  <span className="text-on-surface-variant">Estimated Total Encounter:</span>
                  <span className="text-primary font-bold">₹4,20,000</span>
                </div>
                {/* Visual Bar */}
                <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "93.3%" }}></div>
                </div>
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                  93.3% allocated for Primary PCI with Drug-Eluting Stents (DES)
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsInsuranceModalOpen(true)}
              className="w-full h-8 bg-surface-container text-on-surface hover:bg-surface-container-high rounded font-body-strong text-metadata-micro flex items-center justify-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">upload_file</span>
              Update Insurance Enhancements
            </button>
          </div>

          {/* Module 3: Discharge Planning & Clinical Milestones */}
          <div className="bg-surface-container-lowest rounded-xl p-panel-padding shadow-sm flex flex-col gap-space-sm border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-xl">flag_circle</span>
                <h2 className="font-section-title text-section-title text-on-surface">Discharge Milestones</h2>
              </div>
              <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                Est. LOS: 4 Days
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-primary-container/10 rounded-lg border border-primary/20">
              <span className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase font-semibold">
                Target Discharge Date
              </span>
              <span className="font-clinical-data-mono text-clinical-data font-bold text-primary">22 Oct 2024</span>
            </div>

            {/* Clinical Milestone Gateways */}
            <div className="flex flex-col gap-2">
              <div className="flex items-start gap-2 p-2 bg-surface-container-low rounded-lg border border-surface-container">
                <span className="material-symbols-outlined text-error text-base shrink-0 mt-0.5 animate-spin">
                  sync
                </span>
                <div className="flex flex-col">
                  <span className="font-body-strong text-metadata-micro text-on-surface font-semibold">
                    Gateway 1: Successful Primary PCI
                  </span>
                  <span className="font-clinical-data text-metadata-micro text-on-surface-variant">
                    TIMI 3 epicardial flow restored in culprit LAD vessel (In Progress)
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 bg-surface-container-low rounded-lg opacity-80 border border-surface-container">
                <span className="material-symbols-outlined text-outline text-base shrink-0 mt-0.5">
                  radio_button_unchecked
                </span>
                <div className="flex flex-col">
                  <span className="font-body-strong text-metadata-micro text-on-surface font-semibold">
                    Gateway 2: Hemodynamic Stability
                  </span>
                  <span className="font-clinical-data text-metadata-micro text-on-surface-variant">
                    Zero vasopressor / inotropic support &gt; 24 consecutive hours
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 bg-surface-container-low rounded-lg opacity-80 border border-surface-container">
                <span className="material-symbols-outlined text-outline text-base shrink-0 mt-0.5">
                  radio_button_unchecked
                </span>
                <div className="flex flex-col">
                  <span className="font-body-strong text-metadata-micro text-on-surface font-semibold">
                    Gateway 3: GDMT Heart Failure Titration
                  </span>
                  <span className="font-clinical-data text-metadata-micro text-on-surface-variant">
                    Tolerating Beta-blocker, ACEi/ARNI, SGLT2i, and Dual Antiplatelets
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 bg-surface-container-low rounded-lg opacity-80 border border-surface-container">
                <span className="material-symbols-outlined text-outline text-base shrink-0 mt-0.5">
                  radio_button_unchecked
                </span>
                <div className="flex flex-col">
                  <span className="font-body-strong text-metadata-micro text-on-surface font-semibold">
                    Gateway 4: Supervised Phase 1 Ambulation
                  </span>
                  <span className="font-clinical-data text-metadata-micro text-on-surface-variant">
                    Bedside 50m corridor walk without angina, dyspnea or arrhythmia
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Module 4: Inpatient Administrative & Visitor Gateways */}
          <div className="bg-surface-container-lowest rounded-xl p-panel-padding shadow-sm flex flex-col gap-space-sm border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-xl">badge</span>
                <h2 className="font-section-title text-section-title text-on-surface">Administrative Gateway</h2>
              </div>
              <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                1 Attendant Active
              </span>
            </div>
            <div className="p-2.5 bg-surface-container-low rounded-lg flex items-center justify-between border border-surface-container">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">person</span>
                <div className="flex flex-col">
                  <span className="font-body-strong text-clinical-data text-on-surface font-semibold">
                    Sunita Sharma (Wife)
                  </span>
                  <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    Primary Caregiver Pass #CCU-V-092 · Bio-checked
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-surface-container-highest text-on-surface rounded font-clinical-data-mono text-metadata-micro font-semibold">
                VALID
              </span>
            </div>
            <div className="grid grid-cols-2 gap-space-xs pt-1">
              <button
                onClick={() => showToast("Attendant pass #CCU-V-092 reprinted.")}
                className="h-8 bg-surface-container text-on-surface hover:bg-surface-container-high rounded font-body-strong text-metadata-micro flex items-center justify-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">qr_code_2</span>
                Reprint Pass
              </button>
              <button
                onClick={() => setIsAttendantModalOpen(true)}
                className="h-8 bg-surface-container text-on-surface hover:bg-surface-container-high rounded font-body-strong text-metadata-micro flex items-center justify-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">person_add</span>
                Add Attendant
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* MODAL 1: TRANSFER BED / CATH LAB */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-md w-full overflow-hidden">
            <div className="px-5 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">emergency_share</span>
                <h3 className="font-body-strong text-body-strong text-on-surface">Emergency Bed Transfer Order</h3>
              </div>
              <button
                onClick={() => setIsTransferModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface rounded p-1"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4 text-clinical-data">
              <div className="p-3 bg-error/10 border-l-4 border-error rounded text-error text-metadata-micro font-semibold">
                Patient is currently mobilized to Cath Lab Suite 01 under Code STEMI protocol.
              </div>
              <div>
                <label className="block text-metadata-micro uppercase font-semibold text-outline mb-1">
                  Destination Unit
                </label>
                <select className="w-full h-8 px-2 rounded border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary">
                  <option>Cath Lab Suite 01 (Primary PCI Active)</option>
                  <option>CCU Bed 04 (Post-Cath Recovery Hold)</option>
                  <option>HDU Bed 02 (Telemetry Step-Down)</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-surface-container text-on-surface hover:bg-surface-container-high font-semibold text-clinical-data"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsTransferModalOpen(false);
                    showToast("Transfer confirmed. Transport gurney tracking synchronized.");
                  }}
                  className="px-4 py-1.5 rounded bg-primary text-on-primary hover:bg-primary-container font-semibold text-clinical-data shadow-sm"
                >
                  Confirm Transfer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CPOE ORDERS */}
      {isCpoeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-lg w-full overflow-hidden">
            <div className="px-5 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">add_notes</span>
                <h3 className="font-body-strong text-body-strong text-on-surface">Active CPOE Orders</h3>
              </div>
              <button
                onClick={() => setIsCpoeModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface rounded p-1"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="p-5 flex flex-col gap-3 text-clinical-data">
              <div className="space-y-2">
                <div className="p-2.5 bg-surface-container-low rounded flex items-center justify-between border border-surface-container">
                  <div>
                    <span className="font-bold text-on-surface block">Coronary Angiography + Primary PCI</span>
                    <span className="text-metadata-micro text-outline">STAT · Dr. Rohit Verma</span>
                  </div>
                  <span className="px-2 py-0.5 bg-error text-on-error rounded font-bold text-xs">IN PROGRESS</span>
                </div>
                <div className="p-2.5 bg-surface-container-low rounded flex items-center justify-between border border-surface-container">
                  <div>
                    <span className="font-bold text-on-surface block">Continuous Telemetry Lead II &amp; V5</span>
                    <span className="text-metadata-micro text-outline">STAT · CCU Protocol</span>
                  </div>
                  <span className="px-2 py-0.5 bg-primary text-on-primary rounded font-bold text-xs">ACTIVE</span>
                </div>
                <div className="p-2.5 bg-surface-container-low rounded flex items-center justify-between border border-surface-container">
                  <div>
                    <span className="font-bold text-on-surface block">Post-PCI hs-cTnI Serial Run (Q3H x 3)</span>
                    <span className="text-metadata-micro text-outline">Core Biochemistry</span>
                  </div>
                  <span className="px-2 py-0.5 bg-secondary text-on-secondary rounded font-bold text-xs">QUEUED</span>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container">
                <Link
                  href="/cpoe"
                  className="px-4 py-1.5 rounded bg-primary text-on-primary hover:bg-primary-container font-semibold text-clinical-data shadow-sm inline-block"
                >
                  Open Full CPOE Console
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: eMAR FLOWSHEET */}
      {isEmarModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-lg w-full overflow-hidden">
            <div className="px-5 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-xl">medication</span>
                <h3 className="font-body-strong text-body-strong text-on-surface">eMAR Administration Log</h3>
              </div>
              <button
                onClick={() => setIsEmarModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface rounded p-1"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="p-5 flex flex-col gap-3 text-clinical-data">
              <div className="space-y-2 font-clinical-data-mono text-xs">
                <div className="p-2.5 bg-surface-container-low rounded flex justify-between items-center border border-surface-container">
                  <div>
                    <span className="font-bold text-on-surface block">Aspirin 325mg PO</span>
                    <span className="text-metadata-micro text-outline">Chewed · 14:22 IST · Sr. Ancy Thomas</span>
                  </div>
                  <span className="text-primary font-bold">GIVEN</span>
                </div>
                <div className="p-2.5 bg-surface-container-low rounded flex justify-between items-center border border-surface-container">
                  <div>
                    <span className="font-bold text-on-surface block">Ticagrelor 180mg PO</span>
                    <span className="text-metadata-micro text-outline">Loading · 14:22 IST · Sr. Ancy Thomas</span>
                  </div>
                  <span className="text-primary font-bold">GIVEN</span>
                </div>
                <div className="p-2.5 bg-surface-container-low rounded flex justify-between items-center border border-surface-container">
                  <div>
                    <span className="font-bold text-on-surface block">Unfractionated Heparin 5000 IU IV</span>
                    <span className="text-metadata-micro text-outline">Bolus · 14:24 IST · Sr. Ancy Thomas</span>
                  </div>
                  <span className="text-primary font-bold">GIVEN</span>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container">
                <Link
                  href="/prescriptions"
                  className="px-4 py-1.5 rounded bg-primary text-on-primary hover:bg-primary-container font-semibold text-clinical-data shadow-sm inline-block"
                >
                  Open Pharmacy &amp; eMAR
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: FACE SHEET */}
      {isFaceSheetModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-md w-full overflow-hidden">
            <div className="px-5 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">print</span>
                <h3 className="font-body-strong text-body-strong text-on-surface">Inpatient Face Sheet</h3>
              </div>
              <button
                onClick={() => setIsFaceSheetModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface rounded p-1"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="p-5 flex flex-col gap-3 font-clinical-data text-clinical-data">
              <div className="p-4 bg-surface-container-low rounded-lg border border-surface-container flex flex-col gap-2 font-clinical-data-mono text-xs">
                <div className="flex justify-between border-b pb-1 font-bold">
                  <span className="text-primary">APOLLO INDRAPRASTHA IPD</span>
                  <span>{ipdId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Patient:</span>
                  <span className="font-bold text-on-surface">Rahul Sharma (42M)</span>
                </div>
                <div className="flex justify-between">
                  <span>UHID:</span>
                  <span>DEL-2024-8841</span>
                </div>
                <div className="flex justify-between">
                  <span>Bed Location:</span>
                  <span className="font-bold text-on-surface">CCU-01 (Floor 2)</span>
                </div>
                <div className="flex justify-between">
                  <span>Admitting Diagnosis:</span>
                  <span>Acute Anterior STEMI</span>
                </div>
                <div className="flex justify-between">
                  <span>Allergies:</span>
                  <span className="text-error font-bold">PENICILLIN (Anaphylaxis)</span>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFaceSheetModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-surface-container text-on-surface hover:bg-surface-container-high font-semibold"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsFaceSheetModalOpen(false);
                    showToast("Face sheet sent to network printer.");
                  }}
                  className="px-4 py-1.5 rounded bg-primary text-on-primary hover:bg-primary-container font-semibold shadow-sm flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">print</span>
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: FHIR MODAL */}
      {isFhirModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-lg w-full overflow-hidden">
            <div className="px-5 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">data_object</span>
                <h3 className="font-body-strong text-body-strong text-on-surface">FHIR R4 Encounter Resource</h3>
              </div>
              <button
                onClick={() => setIsFhirModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface rounded p-1"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="p-5 flex flex-col gap-3 font-clinical-data-mono text-xs">
              <pre className="p-3 bg-surface-container-low rounded border border-surface-container overflow-x-auto text-[11px] max-h-60 text-on-surface">
{`{
  "resourceType": "Encounter",
  "id": "${ipdId}",
  "status": "in-progress",
  "class": { "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode", "code": "IMP" },
  "subject": { "reference": "Patient/DEL-2024-8841", "display": "Rahul Sharma" },
  "location": [{ "location": { "display": "CCU-01 Resus Bay 02" }, "status": "active" }],
  "serviceProvider": { "display": "Apollo Indraprastha Central" }
}`}
              </pre>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setIsFhirModalOpen(false)}
                  className="px-4 py-1.5 rounded bg-primary text-on-primary hover:bg-primary-container font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: INSURANCE ENHANCEMENTS */}
      {isInsuranceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-md w-full overflow-hidden">
            <div className="px-5 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">upload_file</span>
                <h3 className="font-body-strong text-body-strong text-on-surface">Pre-Auth Enhancement Request</h3>
              </div>
              <button
                onClick={() => setIsInsuranceModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface rounded p-1"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="p-5 flex flex-col gap-3 text-clinical-data">
              <div className="p-3 bg-surface-container-low rounded border border-surface-container">
                <span className="text-metadata-micro text-outline block">Active Approved Limit:</span>
                <span className="font-bold text-on-surface text-base">₹4,50,000 (ICICI Lombard)</span>
              </div>
              <div>
                <label className="block text-metadata-micro uppercase font-semibold text-outline mb-1">
                  Requested Additional Cap
                </label>
                <input
                  type="text"
                  defaultValue="₹1,50,000"
                  className="w-full h-8 px-3 rounded border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-metadata-micro uppercase font-semibold text-outline mb-1">
                  Clinical Enhancement Justification
                </label>
                <textarea
                  rows={3}
                  defaultValue="Multi-vessel disease anticipated post-angiogram with possible bifurcation stent / IABP requirement."
                  className="w-full p-2 rounded border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary text-metadata-micro"
                ></textarea>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setIsInsuranceModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-surface-container text-on-surface hover:bg-surface-container-high font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsInsuranceModalOpen(false);
                    showToast("Enhancement claim uploaded to MediAssist TPA portal.");
                  }}
                  className="px-4 py-1.5 rounded bg-primary text-on-primary hover:bg-primary-container font-semibold shadow-sm"
                >
                  Submit Enhancement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 7: ADD ATTENDANT */}
      {isAttendantModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-md w-full overflow-hidden">
            <div className="px-5 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">person_add</span>
                <h3 className="font-body-strong text-body-strong text-on-surface">Issue Secondary Attendant Pass</h3>
              </div>
              <button
                onClick={() => setIsAttendantModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface rounded p-1"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="p-5 flex flex-col gap-3 text-clinical-data">
              <div>
                <label className="block text-metadata-micro uppercase font-semibold text-outline mb-1">
                  Attendant Full Name
                </label>
                <input
                  type="text"
                  value={attendantName}
                  onChange={(e) => setAttendantName(e.target.value)}
                  placeholder="e.g. Rakesh Sharma"
                  className="w-full h-8 px-3 rounded border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-metadata-micro uppercase font-semibold text-outline mb-1">
                  Relationship to Patient
                </label>
                <select
                  value={attendantRelation}
                  onChange={(e) => setAttendantRelation(e.target.value)}
                  className="w-full h-8 px-2 rounded border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                >
                  <option value="Brother">Brother</option>
                  <option value="Son">Son</option>
                  <option value="Daughter">Daughter</option>
                  <option value="Parent">Parent</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setIsAttendantModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-surface-container text-on-surface hover:bg-surface-container-high font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAttendantModalOpen(false);
                    showToast(`Secondary pass generated for ${attendantName || "Attendant"}.`);
                  }}
                  className="px-4 py-1.5 rounded bg-primary text-on-primary hover:bg-primary-container font-semibold shadow-sm"
                >
                  Generate Pass
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 8: REASSIGN CLINICIAN */}
      {isReassignModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-md w-full overflow-hidden">
            <div className="px-5 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">groups</span>
                <h3 className="font-body-strong text-body-strong text-on-surface">Reassign Clinical Care Team</h3>
              </div>
              <button
                onClick={() => setIsReassignModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface rounded p-1"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="p-5 flex flex-col gap-3 text-clinical-data">
              <div>
                <label className="block text-metadata-micro uppercase font-semibold text-outline mb-1">
                  Lead Attending
                </label>
                <select className="w-full h-8 px-2 rounded border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary">
                  <option>Dr. Rohit Verma (Cardiology Lead)</option>
                  <option>Dr. Sandeep Goyal (Cath Lab On-Call)</option>
                </select>
              </div>
              <div>
                <label className="block text-metadata-micro uppercase font-semibold text-outline mb-1">
                  Primary Shift RN
                </label>
                <select className="w-full h-8 px-2 rounded border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary">
                  <option>Sr. Ancy Thomas, RN (#4419)</option>
                  <option>Staff Nurse Priya K. (RN #5012)</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setIsReassignModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-surface-container text-on-surface hover:bg-surface-container-high font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsReassignModalOpen(false);
                    showToast("Care team assignments updated in EHR roster.");
                  }}
                  className="px-4 py-1.5 rounded bg-primary text-on-primary hover:bg-primary-container font-semibold shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
