/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import Link from "next/link";

interface ProblemItem {
  id: string;
  name: string;
  icd: string;
  status: string;
  statusClass: string;
  description: string;
  recorded: string;
  clinician: string;
  icon: string;
  iconColor: string;
  isAcute?: boolean;
}

const INITIAL_PROBLEMS: ProblemItem[] = [
  {
    id: "prob-1",
    name: "Acute Anterior STEMI",
    icd: "ICD-10 I21.0",
    status: "STAT HYPER-ACUTE",
    statusClass: "bg-error text-on-error font-metadata-micro text-[10px] px-1.5 py-0.2 rounded uppercase font-bold tracking-wider",
    description: "Sudden onset retrosternal crushing chest pain radiating to left shoulder. Onset 45m ago. Cath protocol activated.",
    recorded: "Onset: 13:20 IST",
    clinician: "Dr. Rohit Verma",
    icon: "emergency",
    iconColor: "text-error",
    isAcute: true,
  },
  {
    id: "prob-2",
    name: "Essential Systemic Hypertension",
    icd: "ICD-10 I10",
    status: "CHRONIC",
    statusClass: "bg-secondary text-on-secondary font-metadata-micro text-[10px] px-1.5 py-0.2 rounded",
    description: "Diagnosed 2021. Managed on dual CCB/ARB therapy. Baseline 130-140 systolic.",
    recorded: "Recorded: Oct 2021",
    clinician: "Dr. Sameer Kulkarni",
    icon: "favorite",
    iconColor: "text-primary",
  },
  {
    id: "prob-3",
    name: "Type 2 Diabetes Mellitus",
    icd: "ICD-10 E11.9",
    status: "SUB-OPTIMAL",
    statusClass: "bg-secondary text-on-secondary font-metadata-micro text-[10px] px-1.5 py-0.2 rounded",
    description: "Diagnosed 2019. Latest HbA1c 7.8% (04-Jul-2026). Managed with oral biguanide.",
    recorded: "Recorded: Mar 2019",
    clinician: "Apollo Endocrine OPD",
    icon: "water_drop",
    iconColor: "text-secondary",
  },
  {
    id: "prob-4",
    name: "Dyslipidemia · Atherogenic Lipoproteins",
    icd: "ICD-10 E78.5",
    status: "MONITORED",
    statusClass: "bg-surface-container text-on-surface font-metadata-micro text-[10px] px-1.5 py-0.2 rounded",
    description: "LDL-C elevated at 158 mg/dL on previous panel. Statin initiation indicated post-intervention.",
    recorded: "Recorded: Jan 2026",
    clinician: "Preventive Health OPD",
    icon: "vital_signs",
    iconColor: "text-outline",
  },
];

export default function PatientOverviewPage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [problems, setProblems] = useState<ProblemItem[]>(INITIAL_PROBLEMS);
  const [isSyncingAbha, setIsSyncingAbha] = useState<boolean>(false);
  const [abhaSynced, setAbhaSynced] = useState<boolean>(false);
  const [showFastTrackModal, setShowFastTrackModal] = useState<boolean>(false);
  const [showAddProblemModal, setShowAddProblemModal] = useState<boolean>(false);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [showEcgModal, setShowEcgModal] = useState<boolean>(false);
  const [showAuditModal, setShowAuditModal] = useState<boolean>(false);
  const [newProblem, setNewProblem] = useState({ name: "", icd: "", description: "" });

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  const handleAbhaSync = () => {
    setIsSyncingAbha(true);
    triggerToast("Connecting to ABDM Gateway (M2/M3 Federated Bridge)...");
    setTimeout(() => {
      setIsSyncingAbha(false);
      setAbhaSynced(true);
      triggerToast("ABDM M2/M3 Locker successfully synchronized · 4 HIP records updated");
      setTimeout(() => setAbhaSynced(false), 3000);
    }, 1100);
  };

  const handleAddProblemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProblem.name.trim()) return;

    const item: ProblemItem = {
      id: `prob-${Date.now()}`,
      name: newProblem.name.trim(),
      icd: newProblem.icd.trim() || "ICD-10 R69",
      status: "ACTIVE",
      statusClass: "bg-surface-container text-on-surface font-metadata-micro text-[10px] px-1.5 py-0.2 rounded font-semibold",
      description: newProblem.description.trim() || "Documented during current emergency cardiology encounter.",
      recorded: "Recorded: Today 14:30",
      clinician: "Dr. Rohit Verma",
      icon: "clinical_notes",
      iconColor: "text-primary",
    };

    setProblems([item, ...problems]);
    setNewProblem({ name: "", icd: "", description: "" });
    setShowAddProblemModal(false);
    triggerToast(`Added ${item.name} (${item.icd}) to Active Problem Registry.`);
  };

  return (
    <div className="flex flex-col w-full gap-space-md">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-outline-variant animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
          <span className="text-clinical-data font-clinical-data font-medium">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-on-surface-variant hover:text-on-surface ml-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* High Priority Red Flag Alert Banner */}
      <div className="w-full bg-error-container text-on-error-container rounded-xl p-space-md shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-space-sm relative overflow-hidden">
        <div className="flex items-center gap-space-md">
          <div className="h-10 w-10 rounded-lg bg-error text-on-error flex items-center justify-center shrink-0 shadow-sm animate-pulse">
            <span className="material-symbols-outlined text-2xl">e911_emergency</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs flex-wrap">
              <span className="font-body-strong text-clinical-data uppercase tracking-wider text-error">
                STAT Triage Directive
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-clinical-data-mono font-bold bg-error text-on-error">
                P1 CRITICAL
              </span>
              <span className="font-body-strong text-body-strong text-on-error-container">
                Suspected Acute Anterior STEMI / ACS
              </span>
            </div>
            <div className="flex items-center gap-space-sm text-metadata-micro font-metadata-micro text-on-surface-variant flex-wrap mt-0.5">
              <span className="font-semibold text-error">ALLERGIES RECORDED:</span>
              <span className="bg-surface-container-lowest px-1.5 py-0.5 rounded text-error font-medium">
                Penicillin (Type 1 IgE Anaphylaxis)
              </span>
              <span className="bg-surface-container-lowest px-1.5 py-0.5 rounded text-error font-medium">
                Aspirin (Gastric Intolerance · Pre-treated with PPI)
              </span>
              <span>
                • Door-to-Balloon Window:{" "}
                <strong className="font-clinical-data-mono font-bold text-error">
                  42 min remaining
                </strong>
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-space-xs shrink-0 self-end md:self-auto">
          <button
            onClick={() => setShowFastTrackModal(true)}
            className="px-space-sm py-1.5 bg-error text-on-error hover:opacity-95 font-body-strong text-clinical-data rounded-lg shadow-sm flex items-center gap-1 transition-opacity cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">notification_important</span>
            <span>Cath Lab Fast-Track</span>
          </button>
          <button
            onClick={() => triggerToast("Dispatching ER audio priority page: 'Cath Lab Team - Standby Bay 02'")}
            className="px-space-sm py-1.5 bg-surface-container-lowest text-on-surface hover:bg-surface-container-high font-body-strong text-clinical-data rounded-lg shadow-sm flex items-center gap-1 transition-colors cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">volume_up</span>
            <span>Audio Page</span>
          </button>
        </div>
      </div>

      {/* Persistent Patient Identity & Demographics Context Header */}
      <div className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div className="flex items-start md:items-center gap-space-md min-w-0">
          <div className="relative shrink-0">
            <img
              className="w-16 h-16 rounded-xl object-cover shadow-sm ring-2 ring-primary"
              alt="Rahul Sharma"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAekaxz4xbS-p72jcVAn62e4DiC57q96aisMJ-5lDcy1UFrcdu2PcxCIQrFPKDRTWAkCQdgQQS9lChGgDhkSG0v7p0M4ZzQFN-GODgo3VpzDtczchpLpSvKzJ9HvJhyxRoWuBp2aVr5AeUgWUDsRBklsKb3dEOjRZODCla5AL1YC5wuuMHf7WzILUuNRgr1eGMFq9OgJFz-xL_kh00wlc6kJa6F6gwDn2s-2ax6fU5BmZF1wqXD0pQ5"
            />
            <span className="absolute -bottom-1 -right-1 bg-primary text-on-primary font-clinical-data-mono text-[10px] font-bold px-1 rounded shadow-xs">
              B+ POS
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-space-xs flex-wrap">
              <h1 className="font-page-title text-page-title text-on-surface truncate">
                Rahul Sharma
              </h1>
              <span className="font-clinical-data-mono text-clinical-data text-on-surface-variant font-medium">
                42 Y · Male
              </span>
              <span className="inline-flex items-center gap-1 bg-surface-container text-primary px-2 py-0.5 rounded-full font-metadata-micro text-metadata-micro font-semibold">
                <span className="material-symbols-outlined text-xs">verified</span> ABHA Verified
              </span>
              <span className="bg-secondary-fixed text-on-secondary-fixed font-clinical-data-mono text-metadata-micro px-2 py-0.5 rounded font-bold">
                TOKEN #104
              </span>
            </div>
            <div className="flex items-center gap-space-sm text-metadata-micro font-metadata-micro text-on-surface-variant flex-wrap mt-1">
              <span>
                UHID: <strong className="font-clinical-data-mono text-on-surface">DEL-2024-8841</strong>
              </span>
              <span className="text-outline-variant">•</span>
              <span>
                ABHA ID: <strong className="font-clinical-data-mono text-on-surface">91-8842-1920-4491</strong>
              </span>
              <span className="text-outline-variant">•</span>
              <span className="flex items-center gap-0.5 text-primary font-semibold">
                <span className="material-symbols-outlined text-xs">location_on</span>
                Station 06 OPD / Bay 02 ER
              </span>
              <span className="text-outline-variant">•</span>
              <span>
                Attending: <strong className="text-on-surface">Dr. Rohit Verma</strong> (Chief of Clinical Services)
              </span>
            </div>
          </div>
        </div>

        {/* Top Action Toolbar */}
        <div className="flex items-center gap-space-xs flex-wrap shrink-0">
          <Link
            href="/consultation-workspace"
            className="h-9 px-space-md bg-primary text-on-primary hover:bg-primary-container font-body-strong text-clinical-data rounded-lg shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">play_circle</span>
            <span>Start Consultation</span>
          </Link>
          <button
            onClick={() => setShowUploadModal(true)}
            className="h-9 px-space-sm bg-surface-container text-on-surface hover:bg-surface-container-high font-body-strong text-clinical-data rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">document_scanner</span>
            <span>Upload Record / QR</span>
          </button>
          <button
            onClick={() => window.print()}
            className="h-9 px-space-sm bg-surface-container text-on-surface hover:bg-surface-container-high font-body-strong text-clinical-data rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">print</span>
            <span>Summary</span>
          </button>
          <div className="relative inline-block text-left">
            <button
              onClick={handleAbhaSync}
              disabled={isSyncingAbha}
              className="h-9 px-space-sm bg-surface-container-low hover:bg-surface-container text-primary font-body-strong text-clinical-data rounded-lg flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
            >
              <span className={`material-symbols-outlined text-base ${isSyncingAbha ? "animate-spin" : ""}`}>
                {abhaSynced ? "done_all" : "cloud_sync"}
              </span>
              <span>{isSyncingAbha ? "Syncing..." : abhaSynced ? "Pushed to ABHA" : "ABHA M2/M3 Locker"}</span>
              <span className="material-symbols-outlined text-xs">arrow_drop_down</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Two-Column Medical Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md items-start">
        {/* LEFT COLUMN: Demographic Dossier & Comprehensive Clinical Context (8 of 12 cols / ~67-70%) */}
        <div className="lg:col-span-8 flex flex-col gap-space-md min-w-0">
          {/* 1. Detailed Identity & Demographic Dossier */}
          <div className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-sm">
            <div className="flex items-center justify-between pb-space-sm border-b-0">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-lg">badge</span>
                <h2 className="font-section-title text-section-title text-on-surface">
                  Demographic &amp; Verification Dossier
                </h2>
              </div>
              <span className="font-clinical-data-mono text-metadata-micro text-primary px-2 py-0.5 bg-surface-container-low rounded">
                UIDAI Biometric e-KYC Verified
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm mt-space-sm">
              <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col">
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase">
                  Full Legal Name
                </span>
                <span className="font-body-strong text-clinical-data text-on-surface">Rahul Sharma</span>
                <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant mt-1">
                  DOB: 14-Jun-1984 (42 Yrs) · Male
                </span>
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                  Marital Status: Married
                </span>
              </div>
              <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col">
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase">
                  Federated Identifiers
                </span>
                <span className="font-clinical-data-mono text-clinical-data text-on-surface font-semibold">
                  rahul.sharma@abdm
                </span>
                <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant mt-1">
                  Aadhaar Token: ••••-••••-4091
                </span>
                <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                  UHID: DEL-2024-8841
                </span>
              </div>
              <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col">
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase">
                  Payer &amp; Health Insurance
                </span>
                <span className="font-body-strong text-clinical-data text-on-surface">ICICI Lombard TPA</span>
                <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant mt-1">
                  Policy: POL-882190 · Sum Insured: ₹15L
                </span>
                <span className="font-metadata-micro text-metadata-micro text-primary font-semibold">
                  Ayushman Bharat PM-JAY Eligible
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm mt-space-sm">
              <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col">
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase">
                  Contact &amp; Permanent Residence
                </span>
                <div className="flex items-center gap-space-xs mt-1">
                  <span className="material-symbols-outlined text-xs text-primary">call</span>
                  <span className="font-clinical-data-mono text-clinical-data text-on-surface">
                    +91 98102 44321
                  </span>
                  <span className="text-outline-variant">•</span>
                  <span className="material-symbols-outlined text-xs text-primary">mail</span>
                  <span className="font-clinical-data text-clinical-data text-on-surface truncate">
                    rahul.sharma.tech@gmail.com
                  </span>
                </div>
                <span className="font-body-default text-metadata-micro text-on-surface-variant mt-1">
                  B-402, Green Park Main, South Delhi, Delhi 110016
                </span>
              </div>
              <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col">
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase">
                  Primary Emergency Contact (NOK)
                </span>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-body-strong text-clinical-data text-on-surface">
                    Sunita Sharma (Wife)
                  </span>
                  <span className="bg-surface-container px-2 py-0.5 rounded text-[10px] font-semibold text-primary">
                    Priority 1
                  </span>
                </div>
                <div className="flex items-center gap-space-xs mt-1">
                  <span className="material-symbols-outlined text-xs text-primary">phone_in_talk</span>
                  <span className="font-clinical-data-mono text-clinical-data text-on-surface font-semibold">
                    +91 98102 44322
                  </span>
                  <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    (Present at Bedside)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Linked ABDM / Hospital Facilities Health Network */}
          <div className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-sm">
            <div className="flex items-center justify-between mb-space-sm">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-lg">hub</span>
                <h2 className="font-section-title text-section-title text-on-surface">
                  Linked ABDM Health Information Providers (HIP)
                </h2>
              </div>
              <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                3 Federated Facilities Discovered
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm">
              <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-body-strong text-clinical-data text-on-surface">
                      Apollo Indraprastha
                    </span>
                    <span className="h-2 w-2 rounded-full bg-primary" title="Primary Node Active"></span>
                  </div>
                  <span className="font-metadata-micro text-metadata-micro text-primary font-semibold">
                    Primary Care Node · Active
                  </span>
                  <p className="font-metadata-micro text-metadata-micro text-on-surface-variant mt-1">
                    4 Recorded Encounters (OPD, Labs, Cath Lab Registry)
                  </p>
                </div>
                <div className="mt-space-sm pt-space-xs flex items-center justify-between text-[11px] font-clinical-data-mono text-outline">
                  <span>Bridge: Apollo-EHR-V2</span>
                  <span className="text-primary font-medium">Sync: 14:02 IST</span>
                </div>
              </div>

              <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-body-strong text-clinical-data text-on-surface">
                      Max Super Speciality
                    </span>
                    <span className="h-2 w-2 rounded-full bg-secondary" title="Archived Linked Facility"></span>
                  </div>
                  <span className="font-metadata-micro text-metadata-micro text-secondary font-semibold">
                    Saket Unit · ABDM M1 Linked
                  </span>
                  <p className="font-metadata-micro text-metadata-micro text-on-surface-variant mt-1">
                    1 Surgical Encounter: Laparoscopic Appendectomy (2021)
                  </p>
                </div>
                <div className="mt-space-sm pt-space-xs flex items-center justify-between text-[11px] font-clinical-data-mono text-outline">
                  <span>OPD/IPD Discharge</span>
                  <span className="text-on-surface-variant">Consent Granted</span>
                </div>
              </div>

              <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-body-strong text-clinical-data text-on-surface">
                      Safdarjung Hospital
                    </span>
                    <span className="h-2 w-2 rounded-full bg-error" title="Critical Adverse Reaction Record"></span>
                  </div>
                  <span className="font-metadata-micro text-metadata-micro text-error font-semibold">
                    Emergency Resuscitation · 2018
                  </span>
                  <p className="font-metadata-micro text-metadata-micro text-on-surface-variant mt-1">
                    1 Critical Event: Documented severe Penicillin Anaphylaxis
                  </p>
                </div>
                <div className="mt-space-sm pt-space-xs flex items-center justify-between text-[11px] font-clinical-data-mono text-outline">
                  <span>Govt Central Registry</span>
                  <span className="text-error font-medium">Flag Linked</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Active Clinical Problem List & Chronic Registry */}
          <div className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-sm">
            <div className="flex items-center justify-between mb-space-sm">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-lg">clinical_notes</span>
                <h2 className="font-section-title text-section-title text-on-surface">
                  Active Problem List &amp; Diagnostic Registry
                </h2>
              </div>
              <button
                onClick={() => setShowAddProblemModal(true)}
                className="text-primary hover:text-primary-container font-clinical-data text-metadata-micro font-semibold flex items-center gap-0.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-xs">add</span>
                <span>Add SNOMED/ICD Entry</span>
              </button>
            </div>
            <div className="flex flex-col gap-space-xs">
              {problems.map((prob) => (
                <div
                  key={prob.id}
                  className={`p-space-sm rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-space-xs ${
                    prob.isAcute ? "bg-error-container/40" : "bg-surface-container-low"
                  }`}
                >
                  <div className="flex items-start gap-space-sm">
                    <span className={`material-symbols-outlined mt-0.5 text-base ${prob.iconColor}`}>
                      {prob.icon}
                    </span>
                    <div>
                      <div className="flex items-center gap-space-xs flex-wrap">
                        <span
                          className={`font-body-strong text-clinical-data ${
                            prob.isAcute ? "text-error font-bold" : "text-on-surface"
                          }`}
                        >
                          {prob.name}
                        </span>
                        <span
                          className={`font-clinical-data-mono text-[11px] px-1.5 py-0.2 rounded bg-surface-container-lowest ${
                            prob.isAcute ? "text-error font-bold" : "text-on-surface-variant font-medium"
                          }`}
                        >
                          {prob.icd}
                        </span>
                        <span className={prob.statusClass}>{prob.status}</span>
                      </div>
                      <p className="font-body-default text-metadata-micro text-on-surface-variant mt-0.5">
                        {prob.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0 pl-space-lg md:pl-0">
                    <span
                      className={`font-clinical-data-mono text-metadata-micro ${
                        prob.isAcute ? "font-bold text-error" : "text-on-surface"
                      }`}
                    >
                      {prob.recorded}
                    </span>
                    <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                      {prob.clinician}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Active Medication Regimen & Provenance Track */}
          <div className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-sm">
            <div className="flex items-center justify-between mb-space-sm">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-lg">prescriptions</span>
                <h2 className="font-section-title text-section-title text-on-surface">
                  Medication Regimen &amp; STAT Loading Doses
                </h2>
              </div>
              <div className="flex items-center gap-space-xs">
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                  Provenance Engine:
                </span>
                <span className="inline-flex items-center gap-0.5 text-primary text-[11px] font-clinical-data-mono font-bold bg-surface-container px-1.5 py-0.5 rounded">
                  <span className="material-symbols-outlined text-xs">shield</span> Dual-Verified
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-outline font-table-header text-table-header uppercase">
                    <th className="py-2 px-3 rounded-l">Pharmaceutical</th>
                    <th className="py-2 px-3">Dosage &amp; Cadence</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3">Verified Provenance</th>
                    <th className="py-2 px-3 rounded-r text-right">Administered</th>
                  </tr>
                </thead>
                <tbody className="font-clinical-data text-clinical-data text-on-surface divide-y-0">
                  {/* Loading Dose 1 */}
                  <tr className="bg-error-container/20">
                    <td className="py-2 px-3">
                      <div className="font-body-strong text-error font-bold">STAT Aspirin Chewable</div>
                      <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                        Platelet COX-1 inhibitor (Gastric protection IV Pantop 40mg given)
                      </div>
                    </td>
                    <td className="py-2 px-3 font-clinical-data-mono text-on-surface font-semibold">
                      325 mg STAT
                    </td>
                    <td className="py-2 px-3">
                      <span className="bg-error text-on-error text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                        Given
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <span className="inline-flex items-center gap-1 font-clinical-data-mono text-[11px] text-primary">
                        <span className="material-symbols-outlined text-xs">verified_user</span> Bay 02 Clinical Nurse
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right font-clinical-data-mono font-bold text-error">
                      Today 14:22
                    </td>
                  </tr>

                  {/* Loading Dose 2 */}
                  <tr className="bg-error-container/20">
                    <td className="py-2 px-3">
                      <div className="font-body-strong text-error font-bold">STAT Ticagrelor (Brilinta)</div>
                      <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                        P2Y12 platelet inhibitor loading
                      </div>
                    </td>
                    <td className="py-2 px-3 font-clinical-data-mono text-on-surface font-semibold">
                      180 mg STAT
                    </td>
                    <td className="py-2 px-3">
                      <span className="bg-error text-on-error text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                        Given
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <span className="inline-flex items-center gap-1 font-clinical-data-mono text-[11px] text-primary">
                        <span className="material-symbols-outlined text-xs">verified_user</span> ER Attending Signed
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right font-clinical-data-mono font-bold text-error">
                      Today 14:26
                    </td>
                  </tr>

                  {/* Chronic 1 */}
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="py-2 px-3">
                      <div className="font-body-strong text-on-surface">Tab. Amlodipine Besylate</div>
                      <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                        Calcium channel blocker (Hypertension)
                      </div>
                    </td>
                    <td className="py-2 px-3 font-clinical-data-mono text-on-surface">
                      5 mg Once Daily (Morn)
                    </td>
                    <td className="py-2 px-3">
                      <span className="bg-surface-container text-on-surface text-[10px] font-medium px-1.5 py-0.5 rounded">
                        Active Chronic
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <span className="inline-flex items-center gap-1 font-clinical-data-mono text-[11px] text-on-surface-variant">
                        <span className="material-symbols-outlined text-xs text-primary">cloud_done</span> Apollo EHR Verified
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right font-clinical-data-mono text-on-surface-variant">
                      Today 08:00
                    </td>
                  </tr>

                  {/* Chronic 2 */}
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="py-2 px-3">
                      <div className="font-body-strong text-on-surface">Tab. Telmisartan</div>
                      <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                        Angiotensin II Receptor Blocker
                      </div>
                    </td>
                    <td className="py-2 px-3 font-clinical-data-mono text-on-surface">
                      40 mg Once Daily (Morn)
                    </td>
                    <td className="py-2 px-3">
                      <span className="bg-surface-container text-on-surface text-[10px] font-medium px-1.5 py-0.5 rounded">
                        Active Chronic
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <span className="inline-flex items-center gap-1 font-clinical-data-mono text-[11px] text-on-surface-variant">
                        <span className="material-symbols-outlined text-xs text-primary">document_scanner</span> Prescription OCR Match
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right font-clinical-data-mono text-on-surface-variant">
                      Today 08:00
                    </td>
                  </tr>

                  {/* Chronic 3 */}
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="py-2 px-3">
                      <div className="font-body-strong text-on-surface">Tab. Metformin HCl</div>
                      <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                        Biguanide antidiabetic
                      </div>
                    </td>
                    <td className="py-2 px-3 font-clinical-data-mono text-on-surface">
                      500 mg Twice Daily (Post-meals)
                    </td>
                    <td className="py-2 px-3">
                      <span className="bg-surface-container text-on-surface text-[10px] font-medium px-1.5 py-0.5 rounded">
                        Hold for Cath
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <span className="inline-flex items-center gap-1 font-clinical-data-mono text-[11px] text-on-surface-variant">
                        <span className="material-symbols-outlined text-xs text-primary">record_voice_over</span> Patient Verified
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right font-clinical-data-mono text-on-surface-variant">
                      Yesterday PM
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 5. Recent Encounters Table */}
          <div className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-sm">
            <div className="flex items-center justify-between mb-space-sm">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-lg">history</span>
                <h2 className="font-section-title text-section-title text-on-surface">
                  Historical &amp; Inter-Facility Encounters
                </h2>
              </div>
              <span className="font-metadata-micro text-metadata-micro text-on-surface-variant font-clinical-data-mono">
                FHIR Bundle: v2.4-ENC
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-outline font-table-header text-table-header uppercase">
                    <th className="py-2 px-3 rounded-l">Date &amp; Time</th>
                    <th className="py-2 px-3">Encounter Classification</th>
                    <th className="py-2 px-3">Facility / Node</th>
                    <th className="py-2 px-3">Attending Physician</th>
                    <th className="py-2 px-3 rounded-r text-right">Records Link</th>
                  </tr>
                </thead>
                <tbody className="font-clinical-data text-clinical-data text-on-surface divide-y-0">
                  <tr className="bg-error-container/15">
                    <td className="py-2 px-3 font-clinical-data-mono font-bold text-error">
                      Today · 14:05
                    </td>
                    <td className="py-2 px-3">
                      <div className="font-body-strong text-error">Emergency Resuscitation · Chest Pain</div>
                      <div className="font-metadata-micro text-metadata-micro text-error font-medium">
                        STAT ACS Triage · P1 Critical
                      </div>
                    </td>
                    <td className="py-2 px-3 font-clinical-data">Apollo Indraprastha (ER-02)</td>
                    <td className="py-2 px-3 font-body-strong">Dr. Rohit Verma</td>
                    <td className="py-2 px-3 text-right">
                      <Link
                        href="/clinical-timeline"
                        className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-error text-on-error font-clinical-data-mono text-[10px] font-semibold cursor-pointer hover:opacity-90"
                      >
                        OPEN ENC-CURRENT
                      </Link>
                    </td>
                  </tr>

                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="py-2 px-3 font-clinical-data-mono text-on-surface">12-Aug-2026</td>
                    <td className="py-2 px-3">
                      <div className="font-body-strong text-on-surface">Routine OPD Consultation</div>
                      <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                        HTN &amp; T2D Metabolic Review
                      </div>
                    </td>
                    <td className="py-2 px-3 font-clinical-data">Apollo Indraprastha (OPD Wing B)</td>
                    <td className="py-2 px-3 font-body-strong">Dr. Sameer Kulkarni</td>
                    <td className="py-2 px-3 text-right">
                      <span
                        onClick={() => triggerToast("Opening DOC-88192-PDF: OPD Follow-up Consultation Note")}
                        className="font-clinical-data-mono text-[11px] text-primary hover:underline cursor-pointer"
                      >
                        DOC-88192-PDF
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="py-2 px-3 font-clinical-data-mono text-on-surface">04-Jul-2026</td>
                    <td className="py-2 px-3">
                      <div className="font-body-strong text-on-surface">
                        Comprehensive Metabolic &amp; Lipid Panel
                      </div>
                      <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                        HbA1c 7.8% · LDL 158 mg/dL
                      </div>
                    </td>
                    <td className="py-2 px-3 font-clinical-data">Apollo Central Diagnostic Lab</td>
                    <td className="py-2 px-3 font-body-strong">Dr. Anjali Nair (Path)</td>
                    <td className="py-2 px-3 text-right">
                      <span
                        onClick={() => triggerToast("Opening LAB-77410-RES: Verified Pathology Result")}
                        className="font-clinical-data-mono text-[11px] text-primary hover:underline cursor-pointer"
                      >
                        LAB-77410-RES
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="py-2 px-3 font-clinical-data-mono text-on-surface">10-Oct-2021</td>
                    <td className="py-2 px-3">
                      <div className="font-body-strong text-on-surface">
                        Laparoscopic Appendectomy (IPD)
                      </div>
                      <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                        Uncomplicated recovery · Discharged POD-3
                      </div>
                    </td>
                    <td className="py-2 px-3 font-clinical-data">Max Super Speciality Saket</td>
                    <td className="py-2 px-3 font-body-strong">Dr. P. Mehta</td>
                    <td className="py-2 px-3 text-right">
                      <span
                        onClick={() => triggerToast("Fetching federated consent bundle: ABDM-MAX-0091")}
                        className="font-clinical-data-mono text-[11px] text-primary hover:underline cursor-pointer"
                      >
                        ABDM-MAX-0091
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Clinical Snapshot, Vitals Telemetry & Provenance Inspector (4 of 12 cols / ~30-33%) */}
        <div className="lg:col-span-4 flex flex-col gap-space-md">
          {/* Patient Bedside Photographic Record & Biometric Snapshot */}
          <div className="w-full bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
            <div className="relative h-44 w-full">
              <img
                className="w-full h-full object-cover"
                alt="Emergency Room Telemetry Setup"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjhy5CFR-2YQuTY23NVSwbLkXZTqcfloUjvTPDDZaF6-2CvLDmQBPXMiEAXy_JmsVR7R-EEKTE5-I1NdzTG2J58pqXU5B-3eQYS8D29jl9jVkxeAKyptB93DLyt3184CYfhw3pfEyhvPLLIRTIlB2wCHZ_gU-2k9Ju2hgk4anAGqIHT01UgBnTn0ZeFMyK4-rS7ZHp26c7KhoTQk_OByqSruA0Llz3EKWeWzq2TYyaI6gDgke9mlDE"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface via-inverse-surface/40 to-transparent flex flex-col justify-end p-space-sm">
                <div className="flex items-center justify-between text-inverse-on-surface">
                  <div>
                    <span className="font-clinical-data-mono text-metadata-micro bg-error text-on-error px-1.5 py-0.5 rounded font-bold uppercase">
                      Bay 02 ER Telemetry
                    </span>
                    <p className="font-body-strong text-clinical-data mt-0.5">
                      BeneVision N12 Live Feed
                    </p>
                  </div>
                  <span className="flex items-center gap-1 text-[11px] font-clinical-data-mono text-primary-fixed">
                    <span className="h-2 w-2 rounded-full bg-primary-fixed animate-ping"></span>{" "}
                    STREAMING
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Hemodynamics & Live Biometrics Card */}
          <div className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-sm">
            <div className="flex items-center justify-between mb-space-sm">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-base">monitor_heart</span>
                <h3 className="font-section-title text-section-title text-on-surface">
                  Latest Hemodynamics
                </h3>
              </div>
              <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant font-medium">
                14:21 IST
              </span>
            </div>

            <div className="grid grid-cols-2 gap-space-xs">
              {/* Blood Pressure */}
              <div className="bg-error-container/30 p-space-sm rounded-lg flex flex-col">
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase">
                  Blood Pressure
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-clinical-data-mono text-2xl font-bold text-error">148/92</span>
                  <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                    mmHg
                  </span>
                </div>
                <span className="font-metadata-micro text-metadata-micro text-error font-semibold mt-1">
                  ↑ Hypertensive Urgency
                </span>
              </div>

              {/* Heart Rate */}
              <div className="bg-error-container/30 p-space-sm rounded-lg flex flex-col">
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase">
                  Pulse / HR
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-clinical-data-mono text-2xl font-bold text-error">104</span>
                  <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                    bpm
                  </span>
                </div>
                <span className="font-metadata-micro text-metadata-micro text-error font-semibold mt-1">
                  ↑ Sinus Tachycardia
                </span>
              </div>

              {/* SpO2 */}
              <div className="bg-secondary-container/30 p-space-sm rounded-lg flex flex-col">
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase">
                  SpO2 (Room Air)
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-clinical-data-mono text-2xl font-bold text-tertiary">94%</span>
                  <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                    O2 Sat
                  </span>
                </div>
                <span className="font-metadata-micro text-metadata-micro text-secondary font-semibold mt-1">
                  ↓ Borderline Hypoxia
                </span>
              </div>

              {/* Blood Glucose & Temp */}
              <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col">
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase">
                  BMG · Core Temp
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-clinical-data-mono text-xl font-bold text-on-surface">118</span>
                  <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                    mg/dL
                  </span>
                </div>
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant mt-1">
                  Temp: 98.6°F (Afebrile)
                </span>
              </div>
            </div>

            {/* Telemetry ECG Rhythm Sparkline SVG */}
            <div className="mt-space-sm bg-inverse-surface rounded-lg p-space-sm text-surface-container-lowest">
              <div className="flex items-center justify-between text-[11px] font-clinical-data-mono text-primary-fixed mb-1">
                <span>LEAD II TELEMETRY</span>
                <span>25mm/s · 10mm/mV</span>
              </div>
              <svg
                className="w-full h-12 text-primary-fixed"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 320 50"
              >
                <path
                  d="M0,25 L30,25 L35,25 L40,10 L45,45 L50,0 L56,40 L62,25 L75,25 L85,20 L95,25 L120,25 L125,25 L130,8 L135,46 L140,0 L146,38 L152,25 L165,25 L175,18 L185,25 L210,25 L215,25 L220,10 L225,45 L230,2 L236,40 L242,25 L255,25 L265,19 L275,25 L300,25 L320,25"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.75"
                ></path>
              </svg>
              <div className="flex items-center justify-between text-[10px] font-clinical-data-mono text-surface-variant mt-1">
                <span>ST Elevation &gt;2.5mm</span>
                <span className="text-error font-bold">MONITOR TRIGGERED</span>
              </div>
            </div>
          </div>

          {/* Diagnostic Intelligence & STAT Lab Stream */}
          <div className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-sm">
            <div className="flex items-center justify-between mb-space-sm">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-base">science</span>
                <h3 className="font-section-title text-section-title text-on-surface">
                  Diagnostic Intelligence
                </h3>
              </div>
              <span className="bg-surface-container px-2 py-0.5 rounded font-clinical-data-mono text-[10px] text-primary font-bold">
                STAT PIPELINE
              </span>
            </div>

            <div className="flex flex-col gap-space-xs">
              {/* ECG Finding */}
              <div className="bg-error-container/30 p-space-sm rounded-lg flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="font-body-strong text-clinical-data text-error">
                    Bedside 12-Lead ECG
                  </span>
                  <span className="font-clinical-data-mono text-metadata-micro text-error font-bold">
                    14:12 IST
                  </span>
                </div>
                <p className="font-body-strong text-metadata-micro text-on-error-container mt-1">
                  ST-Elevation &gt;2.5mm in V2-V4 with reciprocal depressions in III &amp; aVF.
                </p>
                <div className="flex items-center justify-between mt-2 pt-1 border-t-0">
                  <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    Concordant with Anterior Wall Infarction
                  </span>
                  <button
                    onClick={() => setShowEcgModal(true)}
                    className="font-clinical-data-mono text-[11px] text-primary font-bold hover:underline cursor-pointer"
                  >
                    View 12-Lead Strip
                  </button>
                </div>
              </div>

              {/* Troponin I Status */}
              <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="font-body-strong text-clinical-data text-on-surface">
                    High-Sensitivity Troponin I (hs-cTnI)
                  </span>
                  <span className="bg-secondary text-on-secondary font-clinical-data-mono text-[10px] px-1.5 py-0.2 rounded animate-pulse">
                    RUNNING STAT
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1 text-metadata-micro font-clinical-data-mono">
                  <span className="text-on-surface-variant">Sample Drawn: 14:20 IST</span>
                  <span className="text-primary font-bold">Expected ETA: 14:50 IST</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-500"
                    style={{ width: "45%" }}
                  ></div>
                </div>
              </div>

              {/* Metabolic Longitudinal Mini Chart */}
              <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="font-body-strong text-clinical-data text-on-surface">
                    Longitudinal Glycemic Control
                  </span>
                  <span className="font-clinical-data-mono text-clinical-data text-error font-bold">
                    HbA1c 7.8%
                  </span>
                </div>
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                  Target: &lt; 7.0% · Trend over last 3 intervals
                </span>
                {/* Glycemic Trend Visual Bars */}
                <div className="grid grid-cols-3 gap-space-xs mt-2 text-center">
                  <div className="bg-surface-container-lowest p-1 rounded flex flex-col items-center">
                    <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                      Nov 2025
                    </span>
                    <span className="font-clinical-data-mono text-clinical-data font-semibold text-primary">
                      7.2%
                    </span>
                  </div>
                  <div className="bg-surface-container-lowest p-1 rounded flex flex-col items-center">
                    <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                      Mar 2026
                    </span>
                    <span className="font-clinical-data-mono text-clinical-data font-semibold text-on-surface">
                      7.4%
                    </span>
                  </div>
                  <div className="bg-error-container/40 p-1 rounded flex flex-col items-center">
                    <span className="font-clinical-data-mono text-metadata-micro text-error">
                      Jul 2026
                    </span>
                    <span className="font-clinical-data-mono text-clinical-data font-bold text-error">
                      7.8% ↑
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Regulatory, Security & Audit Stamp */}
          <div className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-sm">
            <div className="flex items-center justify-between mb-space-xs">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-base">verified_user</span>
                <h3 className="font-section-title text-section-title text-on-surface">
                  Audit &amp; Security Attestation
                </h3>
              </div>
              <span className="font-metadata-micro text-metadata-micro text-primary font-bold">
                ABDM M1/M2/M3
              </span>
            </div>
            <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-1 text-metadata-micro font-metadata-micro">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Access Authenticated:</span>
                <span className="font-clinical-data-mono text-on-surface font-semibold">
                  Dr. Rohit Verma (Chief Clin)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Purpose of Access:</span>
                <span className="text-error font-semibold uppercase">Emergency ACS Cath Transfer</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Consent Artifact ID:</span>
                <span className="font-clinical-data-mono text-on-surface truncate max-w-[170px]">
                  ART-DEL-2024-9921-X1
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 mt-1 border-t-0">
                <span className="text-on-surface-variant">Cryptographic Hash:</span>
                <span className="font-clinical-data-mono text-[10px] text-outline truncate">
                  SHA-256 Validated · FHIR R4
                </span>
              </div>
            </div>
            <div className="mt-space-sm flex items-center justify-between">
              <button
                onClick={() => setShowAuditModal(true)}
                className="w-full py-1.5 bg-surface-container-low hover:bg-surface-container text-on-surface font-body-strong text-clinical-data rounded flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">lock_reset</span>
                <span>View Complete Audit Log [34 Events]</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: Cath Lab Fast-Track Modal */}
      {showFastTrackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-error/30 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-error">
              <span className="material-symbols-outlined text-3xl">emergency</span>
              <h3 className="font-section-title text-section-title font-bold">
                Cath Lab Fast-Track Activation
              </h3>
            </div>
            <p className="text-clinical-data font-body-default text-on-surface">
              Triggering priority Cath Lab transfer for <strong>Rahul Sharma (42M)</strong>. Door-to-Balloon clock target: &lt; 90 minutes.
            </p>
            <div className="bg-error-container/30 p-3 rounded-xl border border-error/20 flex flex-col gap-1.5 text-metadata-micro text-on-surface">
              <div className="flex justify-between font-bold text-error">
                <span>Door-to-Balloon Timer</span>
                <span className="font-clinical-data-mono">28m elapsed / 42m remaining</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                <div className="bg-error h-full rounded-full" style={{ width: "40%" }}></div>
              </div>
              <span>• Destination: Emergency Cath Lab Suite 02</span>
              <span>• Interventionalist on Call: Dr. M. Iyer, FSCAI</span>
              <span>• Nursing Team Notified: Nurse Sister Ancy (Ready)</span>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowFastTrackModal(false)}
                className="px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container text-clinical-data font-body-default cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowFastTrackModal(false);
                  triggerToast("Cath Lab Bay 02 Fast-Track Activated! Interventional suite pre-warmed.");
                }}
                className="px-4 py-2 bg-error text-on-error rounded-lg text-clinical-data font-body-strong hover:bg-red-700 shadow-sm cursor-pointer"
              >
                Confirm Fast-Track
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Add SNOMED / ICD Problem */}
      {showAddProblemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-surface-container flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">clinical_notes</span>
                <h3 className="font-section-title text-clinical-data text-on-surface font-semibold">
                  Add Diagnosis / Problem Entry
                </h3>
              </div>
              <button
                onClick={() => setShowAddProblemModal(false)}
                className="text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <form onSubmit={handleAddProblemSubmit} className="flex flex-col gap-3">
              <div>
                <label className="text-metadata-micro font-body-strong text-outline block mb-1">
                  CONDITION NAME (SNOMED-CT / CLINICAL TERM)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Coronary Artery Disease"
                  value={newProblem.name}
                  onChange={(e) => setNewProblem({ ...newProblem, name: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-clinical-data focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="text-metadata-micro font-body-strong text-outline block mb-1">
                  ICD-10 CODE
                </label>
                <input
                  type="text"
                  placeholder="e.g. I25.10"
                  value={newProblem.icd}
                  onChange={(e) => setNewProblem({ ...newProblem, icd: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-clinical-data font-clinical-data-mono focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="text-metadata-micro font-body-strong text-outline block mb-1">
                  CLINICAL NOTES / JUSTIFICATION
                </label>
                <textarea
                  rows={3}
                  placeholder="Clinical findings, onset date, etiology..."
                  value={newProblem.description}
                  onChange={(e) => setNewProblem({ ...newProblem, description: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-clinical-data focus:border-primary focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProblemModal(false)}
                  className="px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container text-clinical-data font-body-default cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-on-primary rounded-lg text-clinical-data font-body-strong hover:bg-primary-container shadow-sm cursor-pointer"
                >
                  Add Problem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: View 12-Lead ECG Strip */}
      {showEcgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-surface-container-lowest rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-surface-container flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <div className="flex items-center gap-2 text-error">
                <span className="material-symbols-outlined text-2xl">ecg_heart</span>
                <h3 className="font-section-title text-section-title font-bold text-on-surface">
                  12-Lead Diagnostic ECG: Rahul Sharma
                </h3>
              </div>
              <button
                onClick={() => setShowEcgModal(false)}
                className="text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="bg-inverse-surface rounded-xl p-4 text-surface-container-lowest flex flex-col gap-3">
              <div className="flex items-center justify-between text-[11px] font-clinical-data-mono text-primary-fixed">
                <span>ACQUIRED: TODAY 14:12 IST · ER BAY 02</span>
                <span className="text-error font-bold">ST ELEVATION +2.8mm (V2-V4)</span>
              </div>
              <svg className="w-full h-24 text-primary-fixed" fill="none" viewBox="0 0 600 80">
                <path
                  d="M0,40 L60,40 L65,30 L70,40 L75,40 L80,10 L85,75 L90,0 L98,65 L105,40 L120,40 L135,30 L150,40 L200,40 L205,30 L210,40 L215,40 L220,10 L225,75 L230,0 L238,65 L245,40 L260,40 L275,30 L290,40 L340,40 L345,30 L350,40 L355,40 L360,10 L365,75 L370,0 L378,65 L385,40 L400,40 L415,30 L430,40 L480,40 L485,30 L490,40 L495,40 L500,10 L505,75 L510,0 L518,65 L525,40 L540,40 L555,30 L570,40 L600,40"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                ></path>
              </svg>
              <div className="grid grid-cols-3 gap-2 text-[11px] font-clinical-data-mono text-surface-variant pt-2 border-t border-surface-container-high/30">
                <div>Vent. Rate: <strong>104 bpm</strong></div>
                <div>PR Interval: <strong>152 ms</strong></div>
                <div>QRS Duration: <strong>88 ms</strong></div>
                <div>QT/QTc: <strong>364 / 442 ms</strong></div>
                <div>P-R-T Axes: <strong>54 72 38</strong></div>
                <div className="text-error font-bold">Impression: Acute Anterior Infarction</div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 bg-surface-container text-on-surface rounded-lg text-clinical-data font-body-strong hover:bg-surface-container-high flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">print</span>
                <span>Print Strip</span>
              </button>
              <button
                onClick={() => setShowEcgModal(false)}
                className="px-4 py-2 bg-primary text-on-primary rounded-lg text-clinical-data font-body-strong hover:bg-primary-container shadow-sm cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Complete Audit Log [34 Events] */}
      {showAuditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-surface-container-lowest rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-surface-container flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-2xl">verified_user</span>
                <h3 className="font-section-title text-section-title font-semibold text-on-surface">
                  Cryptographic Audit Log [34 Events]
                </h3>
              </div>
              <button
                onClick={() => setShowAuditModal(false)}
                className="text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto flex flex-col gap-2 pr-1">
              {[
                { time: "14:26:10", actor: "Dr. Rohit Verma", action: "Administered STAT Ticagrelor 180mg", hash: "sha256:4a8c91...7e12" },
                { time: "14:22:04", actor: "Nurse Ancy Thomas", action: "Administered STAT Aspirin Chewable 325mg", hash: "sha256:7b1928...43da" },
                { time: "14:21:08", actor: "Mindray N12 Gateway", action: "Streamed Systolic BP 148 mmHg to FHIR Observation", hash: "sha256:6e3309...41dd" },
                { time: "14:20:15", actor: "POCT Accu-Chek", action: "Capillary Blood Glucose 118 mg/dL Committed", hash: "sha256:5b7194...12f8" },
                { time: "14:18:22", actor: "Sister Priya K.", action: "Triage Intake Voice Memo Recorded (18s)", hash: "sha256:2d991b...99ca" },
                { time: "14:12:00", actor: "Cardiology ER ECG", action: "12-Lead Diagnostic ECG Captured (ST +2.8mm)", hash: "sha256:8f2a11...4b39" },
                { time: "14:05:00", actor: "Triage Station 02", action: "Patient Registered under Token #104 (P1 Emergent)", hash: "sha256:1a8843...33bc" },
              ].map((ev, i) => (
                <div key={i} className="p-2.5 bg-surface-container-low rounded-lg flex flex-col gap-0.5 text-metadata-micro">
                  <div className="flex justify-between font-semibold text-on-surface">
                    <span>{ev.action}</span>
                    <span className="font-clinical-data-mono text-primary">{ev.time}</span>
                  </div>
                  <div className="flex justify-between text-outline text-[11px]">
                    <span>Actor: {ev.actor}</span>
                    <span className="font-clinical-data-mono">{ev.hash}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-surface-container">
              <button
                onClick={() => {
                  triggerToast("Exported Cryptographic Audit Log (JSON-LD) to clipboard.");
                  setShowAuditModal(false);
                }}
                className="px-4 py-2 bg-primary text-on-primary rounded-lg text-clinical-data font-body-strong hover:bg-primary-container shadow-sm cursor-pointer"
              >
                Export JSON Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: Upload Record / QR */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-surface-container flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">document_scanner</span>
                <h3 className="font-section-title text-clinical-data text-on-surface font-semibold">
                  Upload Health Record or Scan QR
                </h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="border-2 border-dashed border-outline-variant rounded-xl p-8 flex flex-col items-center justify-center text-center gap-2 hover:border-primary transition-colors cursor-pointer bg-surface-container-low">
              <span className="material-symbols-outlined text-4xl text-primary">cloud_upload</span>
              <span className="font-body-strong text-clinical-data text-on-surface">
                Drop PDF, DICOM, or JPG here
              </span>
              <span className="text-metadata-micro text-outline">
                Supports ABDM FHIR R4 Bundle, Lab OCR, or Prescription Scans
              </span>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container text-clinical-data font-body-default cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  triggerToast("Record uploaded and queued for AI OCR processing in Document Tray.");
                }}
                className="px-4 py-2 bg-primary text-on-primary rounded-lg text-clinical-data font-body-strong hover:bg-primary-container shadow-sm cursor-pointer"
              >
                Process Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
