/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import Link from "next/link";

interface ReconciliationRow {
  id: string;
  category: string;
  homeMed: {
    name: string;
    freq: string;
    description: string;
    source: string;
    confidence: string;
    confColor?: string;
  };
  statMed: {
    name: string;
    badge: string;
    badgeBg: string;
    badgeText: string;
    description: string;
    footerText: string;
    footerHighlight?: string;
  };
  reconciledMed: {
    name: string;
    decision: string;
    decisionBg: string;
    decisionText: string;
    description: string;
    statusNote: string;
    statusIcon: string;
    statusColor: string;
    tagRight?: string;
  };
}

const INITIAL_ROWS: ReconciliationRow[] = [
  {
    id: "amlodipine",
    category: "Cardiovascular",
    homeMed: {
      name: "Tab. Amlodipine 5mg",
      freq: "OD (Morn)",
      description: "Oral baseline for systemic hypertension. Adherent.",
      source: "Handwritten Rx Dr. Kulkarni (Aug '25)",
      confidence: "96% Conf",
    },
    statMed: {
      name: "No STAT CCB Ordered",
      badge: "N/A",
      badgeBg: "bg-surface-container-low",
      badgeText: "text-outline",
      description: "BP managed via IV Glyceryl Trinitrate (NTG) infusion titrated at 10 mcg/min.",
      footerText: "ED Regimen Intact",
    },
    reconciledMed: {
      name: "Amlodipine 5mg PO",
      decision: "Hold Pre-PCI",
      decisionBg: "bg-secondary-container",
      decisionText: "text-on-secondary-container",
      description: "Temporarily hold pre-PCI. Resume baseline post-procedure once invasive hemodynamics and femoral line removal are stable.",
      statusNote: "Approved · Dr. Rohit Verma",
      statusIcon: "check_circle",
      statusColor: "text-primary",
    },
  },
  {
    id: "telmisartan",
    category: "Cardiovascular",
    homeMed: {
      name: "Tab. Telmisartan 40mg",
      freq: "OD (Bedtime)",
      description: "Antihypertensive ARB therapy prescribed 2024.",
      source: "OCR Pill Box Review",
      confidence: "82% Conf",
    },
    statMed: {
      name: "No In-Flight ARB/ACEi",
      badge: "Deferred",
      badgeBg: "bg-surface-container",
      badgeText: "text-outline",
      description: "Baseline SBP decreased from 148 to 110 mmHg post-sublingual & IV NTG.",
      footerText: "Risk: Hypotension During Angiogram",
    },
    reconciledMed: {
      name: "Telmisartan 40mg PO",
      decision: "Held Pre-Procedure",
      decisionBg: "bg-error-container",
      decisionText: "text-on-error-container",
      description: "Hold immediately due to borderline blood pressure (110/70 post-NTG) and renal safety before iodinated contrast exposure.",
      statusNote: "Locked Hold · Contrast Protocol",
      statusIcon: "block",
      statusColor: "text-error",
    },
  },
  {
    id: "metformin",
    category: "Endocrine",
    homeMed: {
      name: "Tab. Metformin HCl 500mg",
      freq: "BD (Post-meals)",
      description: "T2D Glycemic management. Last taken today at 08:00 breakfast.",
      source: "Patient Verified + Strip Scan",
      confidence: "100% Conf",
      confColor: "text-primary font-bold",
    },
    statMed: {
      name: "Sliding Scale Regular Insulin",
      badge: "SC PRN",
      badgeBg: "bg-surface-container",
      badgeText: "text-on-surface",
      description: "Emergency glycemic target 140-180 mg/dL. Baseline bedside glucometry: 172 mg/dL.",
      footerText: "Nurse Administered: In-Hospital Chart",
    },
    reconciledMed: {
      name: "Metformin HCl 500mg",
      decision: "Strict Hold 48h",
      decisionBg: "bg-error-container",
      decisionText: "text-on-error-container",
      description: "High nephrotoxicity & lactic acidosis risk with iodinated angiographic contrast. Strict 48-hour hold required post-cath.",
      statusNote: "Safety Lockout Active",
      statusIcon: "lock",
      statusColor: "text-error",
      tagRight: "Check Serum Creatinine 48h",
    },
  },
  {
    id: "dapt",
    category: "Cardiovascular",
    homeMed: {
      name: "No Baseline Antiplatelet",
      freq: "Naïve",
      description: "Prior intermittent aspirin discontinued 2021 due to epigastric burning/dyspepsia.",
      source: "Allergy Chart Linked",
      confidence: "",
    },
    statMed: {
      name: "Aspirin 325mg + Ticagrelor 180mg",
      badge: "STAT PO",
      badgeBg: "bg-error-container",
      badgeText: "text-on-error-container",
      description: "Chewable Aspirin given 14:22 IST (Nurse Ancy) + Ticagrelor 180mg loading dose given 14:26 IST.",
      footerText: "Admin Confirmed (eMAR)",
      footerHighlight: "14:26 IST",
    },
    reconciledMed: {
      name: "DAPT: Ticagrelor + Aspirin",
      decision: "Verified & Committed",
      decisionBg: "bg-primary-container",
      decisionText: "text-on-primary",
      description: "Continue Ticagrelor 90mg BD + Ecosprin 75mg OD maintenance post-procedure. Pantoprazole 40mg IV co-administered for gastric protection.",
      statusNote: "Committed to eMAR Flowsheet",
      statusIcon: "verified",
      statusColor: "text-primary",
      tagRight: "DAPT 12M",
    },
  },
  {
    id: "atorvastatin",
    category: "Cardiovascular",
    homeMed: {
      name: "Tab. Atorvastatin 20mg",
      freq: "HS (Bedtime)",
      description: "Primary dyslipidemia. Patient admits irregular compliance over past 3 months.",
      source: "Apollo OPD 2025",
      confidence: "Sub-adherent",
      confColor: "text-error font-bold",
    },
    statMed: {
      name: "Tab. Atorvastatin 80mg",
      badge: "STAT PO",
      badgeBg: "bg-error-container",
      badgeText: "text-on-error-container",
      description: "High-intensity statin boost administered 14:30 IST for plaque stabilization pre-PCI.",
      footerText: "Dispensed Central Pharmacy",
      footerHighlight: "STAT Rx #881",
    },
    reconciledMed: {
      name: "Atorvastatin 80mg PO OD",
      decision: "Dose Escalated",
      decisionBg: "bg-primary-container",
      decisionText: "text-on-primary",
      description: "Replaces baseline 20mg with high-intensity 80mg daily. Scheduled nightly dose to commence Day 1 post-PCI.",
      statusNote: "Baseline Superseded",
      statusIcon: "trending_up",
      statusColor: "text-primary",
      tagRight: "Target LDL < 55",
    },
  },
  {
    id: "heparin",
    category: "Cardiovascular",
    homeMed: {
      name: "No Baseline Anticoagulant",
      freq: "None",
      description: "No history of DVT/PE or non-valvular AF.",
      source: "Coag Screen Ordered",
      confidence: "",
    },
    statMed: {
      name: "Heparin 5000 IU IV Bolus",
      badge: "On Hold",
      badgeBg: "bg-secondary-container",
      badgeText: "text-on-secondary-container",
      description: "Pre-Cath staging order. Held bedside awaiting immediate baseline aPTT and ACT point-of-care reading.",
      footerText: "Awaiting Lab ACT",
      footerHighlight: "POC #09",
    },
    reconciledMed: {
      name: "Unfractionated Heparin Bolus",
      decision: "Procedural Cath Order",
      decisionBg: "bg-surface-container",
      decisionText: "text-on-surface",
      description: "Dose will be administered directly in the Cath Lab by interventional fellow following initial femoral/radial sheath insertion.",
      statusNote: "Cath Lab Handover",
      statusIcon: "room_service",
      statusColor: "text-primary",
      tagRight: "Target ACT 250-300s",
    },
  },
];

export default function MedicationReconciliationPage() {
  const [activeTab, setActiveTab] = useState<string>("active-stage");
  const [rows, setRows] = useState<ReconciliationRow[]>(INITIAL_ROWS);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [showFilterMenu, setShowFilterMenu] = useState<boolean>(false);
  const [editingRow, setEditingRow] = useState<ReconciliationRow | null>(null);

  // Modals
  const [showCommitModal, setShowCommitModal] = useState<boolean>(false);
  const [showStatModal, setShowStatModal] = useState<boolean>(false);
  const [showMarModal, setShowMarModal] = useState<boolean>(false);
  const [showHistoricalModal, setShowHistoricalModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // STAT form state
  const [statDrug, setStatDrug] = useState<string>("Heparin 5000 IU IV");
  const [statRoute, setStatRoute] = useState<string>("IV Bolus");
  const [statUrgency, setStatUrgency] = useState<string>("IMMEDIATE");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleDecisionUpdate = (rowId: string, newDecision: string, newDecisionBg: string, newDecisionText: string, note: string) => {
    setRows(prev =>
      prev.map(r => {
        if (r.id === rowId) {
          return {
            ...r,
            reconciledMed: {
              ...r.reconciledMed,
              decision: newDecision,
              decisionBg: newDecisionBg,
              decisionText: newDecisionText,
              description: note || r.reconciledMed.description,
            },
          };
        }
        return r;
      })
    );
    setEditingRow(null);
    showToast(`Updated reconciliation decision for ${rowId.toUpperCase()}`);
  };

  const filteredRows = rows.filter(r => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "cardio") return r.category === "Cardiovascular";
    if (selectedFilter === "endocrine") return r.category === "Endocrine";
    if (selectedFilter === "held") return r.reconciledMed.decision.toLowerCase().includes("hold");
    return true;
  });

  return (
    <div className="flex flex-col w-full gap-space-md">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-inverse-surface text-inverse-on-surface px-4 py-2.5 rounded-lg shadow-xl border border-outline/30 animate-in fade-in slide-in-from-bottom-2">
          <span className="material-symbols-outlined text-primary text-base">check_circle</span>
          <span className="text-clinical-data font-clinical-data">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* BREADCRUMB & REAL-TIME STATUS BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-xs px-space-xs">
        <div className="flex items-center gap-space-xs font-metadata-micro text-metadata-micro text-on-surface-variant">
          <Link href="/" className="font-semibold text-primary uppercase tracking-wider hover:underline">
            Clinical Workspace
          </Link>
          <span className="material-symbols-outlined text-[13px] text-outline">chevron_right</span>
          <Link href="/pharmacy-lab" className="uppercase tracking-wider hover:underline">
            Pharmacotherapy
          </Link>
          <span className="material-symbols-outlined text-[13px] text-outline">chevron_right</span>
          <span className="font-semibold text-on-surface uppercase tracking-wider">
            Medication Reconciliation &amp; Safety Center
          </span>
        </div>

        {/* QUICK TELEMETRY METRICS */}
        <div className="flex items-center gap-space-xs flex-wrap">
          <div className="flex items-center gap-1.5 px-space-sm py-1 bg-surface-container-low rounded">
            <span className="h-2 w-2 rounded-full bg-primary"></span>
            <span className="font-clinical-data text-metadata-micro text-on-surface font-semibold">4 Active Baseline</span>
          </div>
          <div className="flex items-center gap-1.5 px-space-sm py-1 bg-error-container text-on-error-container rounded">
            <span className="material-symbols-outlined text-[13px]">bolt</span>
            <span className="font-clinical-data-mono text-metadata-micro font-semibold">2 STAT In-Flight</span>
          </div>
          <div className="flex items-center gap-1.5 px-space-sm py-1 bg-surface-container-low rounded">
            <span className="material-symbols-outlined text-[13px] text-primary">verified_user</span>
            <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">0 Lethal Inter.</span>
          </div>
          <div className="flex items-center gap-1.5 px-space-sm py-1 bg-secondary-container text-on-secondary-container rounded">
            <span className="material-symbols-outlined text-[13px]">shield_lock</span>
            <span className="font-clinical-data text-metadata-micro font-semibold">1 Safety Override Active</span>
          </div>
        </div>
      </div>

      {/* PATIENT CONTEXT HEADER & MANDATORY CLINICAL SAFETY STRIP */}
      <div className="flex flex-col rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden border border-outline-variant/30">
        {/* Red Alert High-Visibility Band */}
        <div className="bg-error text-on-error px-space-normal py-1 flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-[16px] animate-pulse">warning</span>
            <span className="font-clinical-data text-metadata-micro tracking-wider uppercase font-semibold">
              Critical Safety Intercepts Enforced
            </span>
            <span className="hidden sm:inline font-metadata-micro text-on-error/80">|</span>
            <span className="hidden sm:inline font-metadata-micro text-metadata-micro">
              Allergy Cross-Reference Engine Synced (RxNorm / SNOMED CT)
            </span>
          </div>
          <span className="font-clinical-data-mono text-metadata-micro bg-on-error/20 px-1.5 py-0.5 rounded font-bold">
            Triage Stage: RED P1
          </span>
        </div>

        {/* Main Patient Strip Grid */}
        <div className="p-space-base grid grid-cols-1 xl:grid-cols-12 gap-space-md items-center">
          {/* Patient Identity Column */}
          <div className="xl:col-span-4 flex items-start gap-space-md">
            <div className="relative shrink-0">
              <img
                className="w-12 h-12 rounded-full object-cover shadow-sm ring-1 ring-outline-variant"
                alt="Rahul Sharma"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4szDSO4ANh7-Z9BDh7Wx_sym1YhCEezhG1KZiZHj2yXpuagyJzzxDp7KDJBM8KEg88ba6r4GYMEu39_LILJ4pjMn_TATpjx76guBcriETnaHFMG1yhDdVkTiFENcDzevptQ8w_SzEl6cVxPT1HnbrHJwKycQicADIjmQRriJwA2xCa4Qe7oiJpvvrT-pFBIG4UcheR923PTTy5Dnr0aoV_wDPktlcsENmFB-HKg0muiwqSokxT51c"
              />
              <span className="absolute -bottom-1 -right-1 bg-error text-on-error text-[9px] font-clinical-data-mono px-1 rounded font-bold uppercase shadow">
                P1 STAT
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-space-xs flex-wrap">
                <h1 className="font-page-title text-page-title text-on-surface truncate">Rahul Sharma</h1>
                <span className="font-clinical-data-mono text-metadata-micro px-1.5 py-0.5 bg-surface-container text-on-surface font-semibold rounded">
                  42 Y / Male
                </span>
                <span className="font-clinical-data-mono text-metadata-micro px-1.5 py-0.5 bg-primary-container text-on-primary font-bold rounded">
                  Token #104
                </span>
              </div>
              <div className="flex items-center gap-space-sm font-metadata-micro text-metadata-micro text-on-surface-variant mt-0.5 flex-wrap">
                <span>
                  UHID: <strong className="font-clinical-data-mono text-on-surface">DEL-2024-8841</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-0.5 text-primary font-medium">
                  <span className="material-symbols-outlined text-[13px]">verified</span> ABHA: 91-8842-1920-4491
                </span>
              </div>
            </div>
          </div>

          {/* Station, Attending & Vitals */}
          <div className="xl:col-span-3 flex flex-col gap-0.5">
            <div className="flex items-center gap-space-xs text-metadata-micro font-metadata-micro text-on-surface-variant">
              <span className="material-symbols-outlined text-[15px] text-primary">local_hospital</span>
              <span>Location:</span>
              <span className="font-clinical-data text-on-surface font-semibold">Resuscitation Bay 02 (STEMI Protocol)</span>
            </div>
            <div className="flex items-center gap-space-xs text-metadata-micro font-metadata-micro text-on-surface-variant">
              <span className="material-symbols-outlined text-[15px] text-secondary">person</span>
              <span>Attending:</span>
              <span className="font-clinical-data text-on-surface font-semibold">Dr. Rohit Verma · Interventional Cardiology</span>
            </div>
            <div className="flex items-center gap-space-xs text-metadata-micro font-clinical-data-mono text-on-surface-variant">
              <span className="text-error font-bold">BP 110/70</span> (Post-NTG) ·{" "}
              <span className="text-primary font-bold">SpO2 97%</span> on 2L NC ·{" "}
              <span className="text-on-surface font-bold">HR 84 bpm</span>
            </div>
          </div>

          {/* Active Allergy Banners (Crucial Clinical High-Risk Context) */}
          <div className="xl:col-span-5 flex flex-col gap-1.5 bg-surface-container-low p-space-sm rounded-lg border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <span className="font-metadata-micro text-metadata-micro uppercase tracking-wider text-outline font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px] text-error">dangerous</span>
                Documented Drug Allergies &amp; Intolerances (2)
              </span>
              <span className="font-clinical-data-mono text-[10px] text-on-surface-variant bg-surface-container px-1 py-0.5 rounded">
                Active Mar 2026
              </span>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch gap-1.5">
              {/* Penicillin */}
              <div className="flex-1 flex items-start gap-1.5 bg-error-container text-on-error-container p-1.5 rounded">
                <span className="material-symbols-outlined text-base shrink-0 mt-0.5">report</span>
                <div className="flex flex-col min-w-0">
                  <span className="font-body-strong text-metadata-micro font-bold uppercase">
                    Penicillin · Type 1 Anaphylaxis (&apos;18)
                  </span>
                  <span className="font-metadata-micro text-[10px] leading-tight">
                    Hard stop active. Avoid all beta-lactams.
                  </span>
                </div>
              </div>
              {/* Aspirin */}
              <div className="flex-1 flex items-start gap-1.5 bg-secondary-container text-on-secondary-container p-1.5 rounded">
                <span className="material-symbols-outlined text-base shrink-0 mt-0.5">shield</span>
                <div className="flex flex-col min-w-0">
                  <span className="font-body-strong text-metadata-micro font-bold uppercase">
                    Aspirin · Gastric Intolerance
                  </span>
                  <span className="font-metadata-micro text-[10px] leading-tight">
                    Emergency Overridden: Buffered Chewable + IV PPI
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PRIMARY RECONCILIATION SUB-TABS */}
        <div className="flex items-center justify-between px-space-base bg-surface-container-high overflow-x-auto border-t border-outline-variant/30">
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setActiveTab("current-active")}
              className={`px-space-md py-2.5 font-clinical-data text-clinical-data transition-colors ${
                activeTab === "current-active"
                  ? "text-primary font-bold shadow-[inset_0_-2px_0_0_#005c55] bg-surface-container-lowest"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Current Active Meds
            </button>
            <button
              onClick={() => setActiveTab("active-stage")}
              className={`px-space-md py-2.5 font-clinical-data text-clinical-data transition-colors ${
                activeTab === "active-stage"
                  ? "text-primary font-bold shadow-[inset_0_-2px_0_0_#005c55] bg-surface-container-lowest"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">sync_alt</span>
                Medication Reconciliation (Active Stage)
                <span className="bg-primary text-on-primary font-clinical-data-mono text-[10px] px-1.5 rounded-full">
                  5 Changes
                </span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab("discontinued")}
              className={`px-space-md py-2.5 font-clinical-data text-clinical-data transition-colors ${
                activeTab === "discontinued"
                  ? "text-primary font-bold shadow-[inset_0_-2px_0_0_#005c55] bg-surface-container-lowest"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Discontinued &amp; Historic
            </button>
            <button
              onClick={() => setActiveTab("interaction-guard")}
              className={`px-space-md py-2.5 font-clinical-data text-clinical-data transition-colors flex items-center gap-1 ${
                activeTab === "interaction-guard"
                  ? "text-primary font-bold shadow-[inset_0_-2px_0_0_#005c55] bg-surface-container-lowest"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span>Interaction &amp; Allergy Guard</span>
              <span className="bg-secondary-container text-on-secondary-container font-clinical-data-mono text-[10px] px-1 rounded-sm">
                2 Flags
              </span>
            </button>
            <button
              onClick={() => setActiveTab("adherence")}
              className={`px-space-md py-2.5 font-clinical-data text-clinical-data transition-colors ${
                activeTab === "adherence"
                  ? "text-primary font-bold shadow-[inset_0_-2px_0_0_#005c55] bg-surface-container-lowest"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Refill &amp; Adherence Log
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-space-xs py-1 shrink-0 relative">
            <button
              onClick={() => setShowHistoricalModal(true)}
              className="px-space-sm py-1 text-clinical-data font-clinical-data bg-surface-container text-on-surface rounded hover:bg-surface-variant transition-colors flex items-center gap-1 border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-[15px]">difference</span> Compare Historical (Aug &apos;25)
            </button>

            <div className="relative">
              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className="px-space-sm py-1 text-clinical-data font-clinical-data bg-surface-container text-on-surface rounded hover:bg-surface-variant transition-colors flex items-center gap-1 border border-outline-variant/30"
              >
                <span className="material-symbols-outlined text-[15px]">filter_list</span>
                <span>Filter: {selectedFilter === "all" ? "All" : selectedFilter.toUpperCase()}</span>
              </button>

              {showFilterMenu && (
                <div className="absolute right-0 mt-1 w-48 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg z-30 py-1 font-clinical-data text-clinical-data">
                  <button
                    onClick={() => {
                      setSelectedFilter("all");
                      setShowFilterMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-surface-container flex items-center justify-between ${
                      selectedFilter === "all" ? "text-primary font-semibold" : "text-on-surface"
                    }`}
                  >
                    <span>All Regimens</span>
                    {selectedFilter === "all" && <span className="material-symbols-outlined text-xs">check</span>}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedFilter("cardio");
                      setShowFilterMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-surface-container flex items-center justify-between ${
                      selectedFilter === "cardio" ? "text-primary font-semibold" : "text-on-surface"
                    }`}
                  >
                    <span>Cardiovascular</span>
                    {selectedFilter === "cardio" && <span className="material-symbols-outlined text-xs">check</span>}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedFilter("endocrine");
                      setShowFilterMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-surface-container flex items-center justify-between ${
                      selectedFilter === "endocrine" ? "text-primary font-semibold" : "text-on-surface"
                    }`}
                  >
                    <span>Endocrine</span>
                    {selectedFilter === "endocrine" && <span className="material-symbols-outlined text-xs">check</span>}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedFilter("held");
                      setShowFilterMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-surface-container flex items-center justify-between ${
                      selectedFilter === "held" ? "text-primary font-semibold" : "text-on-surface"
                    }`}
                  >
                    <span>Held Pre-Procedure</span>
                    {selectedFilter === "held" && <span className="material-symbols-outlined text-xs">check</span>}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN STAGE: 3-COLUMN RECONCILIATION MATRIX + RIGHT SAFETY DRAWER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md items-start">
        {/* CENTER STAGE (3-COLUMN CLINICAL COMPARISON MATRIX) */}
        <div className="lg:col-span-8 flex flex-col gap-space-md">
          {/* Action Protocol Alert Banner */}
          <div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container text-on-surface border border-outline-variant/30">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-primary text-xl">vital_signs</span>
              <div className="flex flex-col">
                <span className="font-body-strong text-clinical-data text-on-surface">
                  Acute Coronary Syndrome (STEMI Anterior) Reconciliation Protocol
                </span>
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                  Reconciling baseline outpatient antihypertensives &amp; antidiabetics against STAT pre-PCI pharmacology.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-space-xs shrink-0">
              <span className="font-clinical-data-mono text-metadata-micro bg-surface-container-highest px-2 py-1 rounded text-on-surface-variant font-medium">
                Cath Lab Bay Prep: 14m remaining
              </span>
            </div>
          </div>

          {activeTab === "active-stage" && (
            <>
              {/* 3-Column Comparative Grid Header */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm">
                {/* Col 1 Header */}
                <div className="bg-surface-container-lowest p-space-sm rounded-t-lg shadow-sm border border-outline-variant/30 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-clinical-data text-clinical-data text-on-surface font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-base text-secondary">home_pin</span>
                      1. Baseline Regimen
                    </span>
                    <span className="font-clinical-data-mono text-metadata-micro bg-surface-container px-1.5 py-0.5 rounded text-on-surface-variant font-medium">
                      4 Meds
                    </span>
                  </div>
                  <span className="font-metadata-micro text-metadata-micro text-outline">
                    Patient-reported &amp; OCR Scanned Rx
                  </span>
                </div>

                {/* Col 2 Header */}
                <div className="bg-surface-container-lowest p-space-sm rounded-t-lg shadow-sm border border-outline-variant/30 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-clinical-data text-clinical-data text-error font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-base text-error">bolt</span>
                      2. Emergency STAT Orders
                    </span>
                    <span className="font-clinical-data-mono text-metadata-micro bg-error-container px-1.5 py-0.5 rounded text-on-error-container font-medium">
                      Cath Protocol
                    </span>
                  </div>
                  <span className="font-metadata-micro text-metadata-micro text-outline">
                    In-flight resuscitation &amp; loading doses
                  </span>
                </div>

                {/* Col 3 Header */}
                <div className="bg-surface-container-lowest p-space-sm rounded-t-lg shadow-sm border border-outline-variant/30 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-clinical-data text-clinical-data text-primary font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-base text-primary">verified</span>
                      3. Active Reconciled In-Hospital
                    </span>
                    <span className="font-clinical-data-mono text-metadata-micro bg-primary-container px-1.5 py-0.5 rounded text-on-primary font-medium">
                      Final Decision
                    </span>
                  </div>
                  <span className="font-metadata-micro text-metadata-micro text-outline">
                    Physician validated destination orders
                  </span>
                </div>
              </div>

              {/* COMPARISON ROWS */}
              <div className="flex flex-col gap-space-sm">
                {filteredRows.map(row => (
                  <div key={row.id} className="grid grid-cols-1 md:grid-cols-3 gap-space-sm items-stretch">
                    {/* Col 1: Home */}
                    <div className="bg-surface-container-lowest p-space-base rounded-lg shadow-sm border border-outline-variant/30 flex flex-col justify-between hover:border-primary/40 transition-colors">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className="font-body-strong text-clinical-data text-on-surface">{row.homeMed.name}</span>
                          <span className="font-clinical-data-mono text-[10px] bg-surface-container px-1.5 py-0.5 rounded text-on-surface">
                            {row.homeMed.freq}
                          </span>
                        </div>
                        <p className="font-metadata-micro text-metadata-micro text-on-surface-variant leading-relaxed">
                          {row.homeMed.description}
                        </p>
                      </div>
                      <div className="mt-space-sm pt-2 flex items-center justify-between border-t border-surface-container-high">
                        <span className="font-clinical-data-mono text-[10px] text-primary flex items-center gap-1 bg-surface-container-low px-1.5 py-0.5 rounded">
                          <span className="material-symbols-outlined text-xs">document_scanner</span> {row.homeMed.source}
                        </span>
                        {row.homeMed.confidence && (
                          <span className={`font-clinical-data-mono text-[10px] ${row.homeMed.confColor || "text-on-surface-variant font-bold"}`}>
                            {row.homeMed.confidence}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Col 2: STAT ED */}
                    <div className="bg-surface-container-lowest p-space-base rounded-lg shadow-sm border border-outline-variant/30 flex flex-col justify-between hover:border-error/40 transition-colors">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className={`font-body-strong text-clinical-data ${row.statMed.name.startsWith("No") ? "text-on-surface-variant italic font-normal" : "text-on-surface"}`}>
                            {row.statMed.name}
                          </span>
                          <span className={`font-clinical-data-mono text-[10px] px-1.5 py-0.5 rounded ${row.statMed.badgeBg} ${row.statMed.badgeText} font-bold`}>
                            {row.statMed.badge}
                          </span>
                        </div>
                        <p className="font-metadata-micro text-metadata-micro text-on-surface-variant leading-tight">
                          {row.statMed.description}
                        </p>
                      </div>
                      <div className="mt-space-sm pt-2 flex items-center justify-between border-t border-surface-container-high">
                        <span className="font-clinical-data-mono text-[10px] text-primary flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">done_all</span> {row.statMed.footerText}
                        </span>
                        {row.statMed.footerHighlight && (
                          <span className="font-clinical-data-mono text-[10px] text-on-surface-variant">
                            {row.statMed.footerHighlight}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Col 3: Reconciled Decision */}
                    <div className="bg-surface-container-lowest p-space-base rounded-lg shadow-sm border border-outline-variant/30 flex flex-col justify-between hover:border-primary/60 transition-colors">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className="font-body-strong text-clinical-data text-on-surface">
                            {row.reconciledMed.name}
                          </span>
                          <span className={`font-clinical-data-mono text-[10px] ${row.reconciledMed.decisionBg} ${row.reconciledMed.decisionText} px-2 py-0.5 rounded font-bold uppercase tracking-wider`}>
                            {row.reconciledMed.decision}
                          </span>
                        </div>
                        <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                          {row.reconciledMed.description}
                        </p>
                      </div>
                      <div className="mt-space-sm pt-2 flex items-center justify-between border-t border-surface-container-high">
                        <div className="flex items-center gap-1">
                          <span className={`material-symbols-outlined text-xs ${row.reconciledMed.statusColor}`}>
                            {row.reconciledMed.statusIcon}
                          </span>
                          <span className={`font-metadata-micro text-[10px] font-semibold ${row.reconciledMed.statusColor}`}>
                            {row.reconciledMed.statusNote}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {row.reconciledMed.tagRight && (
                            <span className="font-clinical-data-mono text-[10px] bg-surface-container px-1 py-0.5 rounded text-on-surface">
                              {row.reconciledMed.tagRight}
                            </span>
                          )}
                          <button
                            onClick={() => setEditingRow(row)}
                            className="font-metadata-micro text-[11px] text-secondary hover:underline font-semibold ml-1"
                          >
                            Modify
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* IN-LINE RECONCILIATION SUMMARY BAR */}
              <div className="p-space-base rounded-xl bg-surface-container-low flex flex-col md:flex-row items-center justify-between gap-space-md border border-outline-variant/30">
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-primary text-2xl">published_with_changes</span>
                  <div className="flex flex-col">
                    <span className="font-body-strong text-clinical-data text-on-surface">
                      Reconciliation Summary: 5 Outpatient Lines Reconciled
                    </span>
                    <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                      1 Dose Escalated · 2 Temporarily Held · 1 Discontinued for Safety · 1 STAT Combination Verified
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-space-xs shrink-0 w-full md:w-auto">
                  <button
                    onClick={() => setShowMarModal(true)}
                    className="flex-1 md:flex-initial px-space-md py-2 bg-surface-container-lowest text-on-surface hover:bg-surface-container font-clinical-data text-clinical-data rounded transition-colors flex items-center justify-center gap-1 shadow-sm border border-outline-variant/30"
                  >
                    <span className="material-symbols-outlined text-[15px]">print</span>
                    MAR Flowsheet
                  </button>
                  <button
                    onClick={() => setShowCommitModal(true)}
                    className="flex-1 md:flex-initial px-space-lg py-2 bg-primary text-on-primary hover:bg-primary-container font-clinical-data text-clinical-data font-semibold rounded transition-colors flex items-center justify-center gap-1 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[15px]">done_all</span>
                    Commit Reconciled EHR (5)
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === "current-active" && (
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30 flex flex-col gap-space-md">
              <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
                <div>
                  <h3 className="font-section-title text-section-title text-on-surface">Current Active In-Hospital Orders</h3>
                  <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    All currently active pharmacotherapy orders active on eMAR.
                  </p>
                </div>
                <span className="bg-primary/10 text-primary font-clinical-data-mono text-metadata-micro px-2 py-1 rounded font-bold">
                  Active STEMI Protocol
                </span>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/20 flex items-center justify-between">
                  <div>
                    <span className="font-body-strong text-clinical-data text-on-surface">Aspirin 325 mg Chewable PO</span>
                    <p className="text-metadata-micro text-on-surface-variant">Administered 14:22 IST · Dr. Verma Protocol</p>
                  </div>
                  <span className="bg-primary text-on-primary font-clinical-data-mono text-xs px-2 py-0.5 rounded">GIVEN</span>
                </div>
                <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/20 flex items-center justify-between">
                  <div>
                    <span className="font-body-strong text-clinical-data text-on-surface">Ticagrelor 180 mg PO (2x 90mg)</span>
                    <p className="text-metadata-micro text-on-surface-variant">Administered 14:26 IST · High-potency P2Y12 loading</p>
                  </div>
                  <span className="bg-primary text-on-primary font-clinical-data-mono text-xs px-2 py-0.5 rounded">GIVEN</span>
                </div>
                <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/20 flex items-center justify-between">
                  <div>
                    <span className="font-body-strong text-clinical-data text-on-surface">Atorvastatin 80 mg PO (High-Intensity)</span>
                    <p className="text-metadata-micro text-on-surface-variant">Administered 14:30 IST · Plaque stabilization pre-PCI</p>
                  </div>
                  <span className="bg-primary text-on-primary font-clinical-data-mono text-xs px-2 py-0.5 rounded">GIVEN</span>
                </div>
                <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/20 flex items-center justify-between">
                  <div>
                    <span className="font-body-strong text-clinical-data text-on-surface">Pantoprazole 40 mg IV Push</span>
                    <p className="text-metadata-micro text-on-surface-variant">Administered 14:25 IST · Gastric shield co-administered with aspirin</p>
                  </div>
                  <span className="bg-primary text-on-primary font-clinical-data-mono text-xs px-2 py-0.5 rounded">GIVEN</span>
                </div>
                <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/20 flex items-center justify-between">
                  <div>
                    <span className="font-body-strong text-clinical-data text-on-surface">Glyceryl Trinitrate (NTG) IV Infusion</span>
                    <p className="text-metadata-micro text-on-surface-variant">Titrated at 10 mcg/min · Target SBP &gt; 100 mmHg</p>
                  </div>
                  <span className="bg-secondary-container text-on-secondary-container font-clinical-data-mono text-xs px-2 py-0.5 rounded font-bold">INFUSING</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "discontinued" && (
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30 flex flex-col gap-space-md">
              <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
                <div>
                  <h3 className="font-section-title text-section-title text-on-surface">Discontinued &amp; Historic Medication Archive</h3>
                  <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    Audited record of withdrawn therapies, allergy-prompted cessations, and substituted lines.
                  </p>
                </div>
                <span className="font-clinical-data-mono text-metadata-micro bg-surface-container px-2 py-1 rounded">3 Historic Entries</span>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/30 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-body-strong text-clinical-data text-on-surface">Tab. Clopidogrel 75mg</span>
                      <span className="bg-error-container text-on-error-container font-clinical-data-mono text-[10px] px-1.5 py-0.5 rounded font-semibold">DISCONTINUED 2021</span>
                    </div>
                    <p className="text-metadata-micro text-on-surface-variant mt-1">
                      Reason: Epigastric distress and sub-therapeutic antiplatelet responsiveness identified during primary care evaluation.
                    </p>
                  </div>
                  <span className="text-metadata-micro font-clinical-data-mono text-outline">Apollo OPD Delhi</span>
                </div>
                <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/30 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-body-strong text-clinical-data text-on-surface">Tab. Enalapril 5mg</span>
                      <span className="bg-surface-container text-on-surface font-clinical-data-mono text-[10px] px-1.5 py-0.5 rounded font-semibold">REPLACED 2024</span>
                    </div>
                    <p className="text-metadata-micro text-on-surface-variant mt-1">
                      Reason: Persistent dry cough typical of ACE-inhibitor class. Switched to Telmisartan 40mg ARB regimen.
                    </p>
                  </div>
                  <span className="text-metadata-micro font-clinical-data-mono text-outline">Max Super Speciality</span>
                </div>
                <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/30 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-body-strong text-clinical-data text-on-surface">Amoxicillin/Clavulanic Acid 625mg</span>
                      <span className="bg-error text-on-error font-clinical-data-mono text-[10px] px-1.5 py-0.5 rounded font-bold">ALLERGY BLACKLIST</span>
                    </div>
                    <p className="text-metadata-micro text-on-surface-variant mt-1">
                      Reason: Severe urticaria and angioedema (Type 1 IgE Anaphylaxis) during dental procedure in 2018. Emergency adrenaline given.
                    </p>
                  </div>
                  <span className="text-metadata-micro font-clinical-data-mono text-outline">Hard Stop Enforced</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "interaction-guard" && (
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30 flex flex-col gap-space-md">
              <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
                <div>
                  <h3 className="font-section-title text-section-title text-on-surface">Advanced Interaction &amp; Allergy Guard Matrix</h3>
                  <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    Full pharmacogenomic and molecular cross-reactivity screening.
                  </p>
                </div>
                <span className="bg-error-container text-on-error-container font-clinical-data-mono text-xs px-2 py-0.5 rounded font-bold">
                  2 Clinical Alerts
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-error-container/20 border border-error/30 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-error font-semibold text-clinical-data">
                    <span className="material-symbols-outlined text-lg">dangerous</span>
                    Metformin + Iodinated Radiocontrast
                  </div>
                  <p className="text-metadata-micro text-on-surface-variant leading-relaxed">
                    Severity: <strong>Level 1 - Absolute Pre-Cath Hold</strong>. Iodinated contrast during coronary angiography poses acute kidney injury (AKI) risk. When renal clearance declines, biguanide accumulation triggers life-threatening lactic acidosis.
                  </p>
                  <div className="p-2 bg-surface-container-lowest rounded border border-outline-variant/30 text-[11px] font-clinical-data-mono text-on-surface">
                    Action Plan: Hold for 48 hours post-procedure; re-test serum creatinine &amp; eGFR before resumption.
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-secondary-container/20 border border-secondary/30 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-secondary font-semibold text-clinical-data">
                    <span className="material-symbols-outlined text-lg">sync_problem</span>
                    Ticagrelor + Unfractionated Heparin
                  </div>
                  <p className="text-metadata-micro text-on-surface-variant leading-relaxed">
                    Severity: <strong>Therapeutic Synergy (High Bleeding Risk)</strong>. Potent P2Y12 platelet blockade combined with systemic thrombin inhibition. Mandatory for stent patency during PCI, requiring calibrated Activated Clotting Time (ACT 250-300s).
                  </p>
                  <div className="p-2 bg-surface-container-lowest rounded border border-outline-variant/30 text-[11px] font-clinical-data-mono text-on-surface">
                    Action Plan: Point-of-care ACT monitoring at radial sheath placement; observe femoral/radial site.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "adherence" && (
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30 flex flex-col gap-space-md">
              <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
                <div>
                  <h3 className="font-section-title text-section-title text-on-surface">Refill History &amp; Adherence Telemetry</h3>
                  <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    Outpatient pharmacy dispensation records sourced from Apollo Pharmacy &amp; ABHA Personal Health Records.
                  </p>
                </div>
                <span className="font-clinical-data-mono text-metadata-micro bg-primary/10 text-primary px-2 py-1 rounded font-bold">
                  Overall Adherence: 78%
                </span>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-surface-container-low rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-2xl">pill</span>
                    <div>
                      <span className="font-body-strong text-clinical-data text-on-surface">Amlodipine 5mg</span>
                      <p className="text-metadata-micro text-on-surface-variant">Refilled: 12 Feb 2026 (30 tabs) · Next due: 14 Mar 2026</p>
                    </div>
                  </div>
                  <span className="font-clinical-data-mono text-xs text-primary font-bold">96% MPR (High)</span>
                </div>
                <div className="p-3 bg-surface-container-low rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-2xl">pill</span>
                    <div>
                      <span className="font-body-strong text-clinical-data text-on-surface">Telmisartan 40mg</span>
                      <p className="text-metadata-micro text-on-surface-variant">Refilled: 18 Jan 2026 (30 tabs) · Overdue by 18 days</p>
                    </div>
                  </div>
                  <span className="font-clinical-data-mono text-xs text-secondary font-bold">82% MPR (Moderate)</span>
                </div>
                <div className="p-3 bg-surface-container-low rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-error text-2xl">warning</span>
                    <div>
                      <span className="font-body-strong text-clinical-data text-on-surface">Atorvastatin 20mg</span>
                      <p className="text-metadata-micro text-on-surface-variant">Last refilled: 10 Nov 2025 · Skipped last 2 refill cycles</p>
                    </div>
                  </div>
                  <span className="font-clinical-data-mono text-xs text-error font-bold">46% MPR (Sub-adherent)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL: MULTI-LAYER CLINICAL SAFETY & INTEROPERABILITY GUARD */}
        <div className="lg:col-span-4 flex flex-col gap-space-md">
          {/* SAFETY CARD 1: HARD-STOP ALLERGY ENGINE */}
          <div className="bg-surface-container-lowest p-space-base rounded-xl shadow-sm border border-outline-variant/30 flex flex-col gap-space-sm">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container-high">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-error text-lg">security</span>
                <span className="font-section-title text-clinical-data text-on-surface">Hard-Stop Allergy Verification</span>
              </div>
              <span className="bg-surface-container font-clinical-data-mono text-[10px] text-on-surface-variant px-1.5 py-0.5 rounded font-medium">
                Engine v4.2
              </span>
            </div>

            {/* Penicillin Check */}
            <div className="flex flex-col gap-1 p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <span className="font-body-strong text-clinical-data text-on-surface flex items-center gap-1">
                  <span className="material-symbols-outlined text-primary text-[16px]">check_circle</span>
                  Penicillin Cross-Reactivity: 0%
                </span>
                <span className="font-clinical-data-mono text-[10px] text-primary font-bold">CLEARED</span>
              </div>
              <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                No beta-lactam, cephalosporin, or carbapenem molecules present in current or planned cath orders.
              </p>
            </div>

            {/* Aspirin Intolerance Override Log */}
            <div className="flex flex-col gap-1 p-space-sm rounded-lg bg-secondary-container/40 border border-secondary/30">
              <div className="flex items-center justify-between">
                <span className="font-body-strong text-clinical-data text-on-secondary-container flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-secondary">assignment_turned_in</span>
                  Aspirin Override Logged
                </span>
                <span className="font-clinical-data-mono text-[10px] bg-secondary-container text-on-secondary-container px-1.5 py-0.5 rounded font-bold">
                  OVERRIDDEN
                </span>
              </div>
              <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                <strong>Clinical Rationale:</strong> Emergent STEMI indication supersedes non-anaphylactic gastric distress.
              </p>
              <div className="flex items-center justify-between mt-1 pt-1 border-t border-secondary-container/50 font-clinical-data-mono text-[10px] text-on-secondary-container">
                <span>By: Dr. Rohit Verma (ID 4092)</span>
                <span>+ Pantoprazole 40mg IV</span>
              </div>
            </div>
          </div>

          {/* SAFETY CARD 2: DRUG-DRUG INTERACTION MATRIX & PHYSIOLOGIC IMPACT */}
          <div className="bg-surface-container-lowest p-space-base rounded-xl shadow-sm border border-outline-variant/30 flex flex-col gap-space-sm">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container-high">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-lg">merge_type</span>
                <span className="font-section-title text-clinical-data text-on-surface">Drug-Drug Interaction Matrix</span>
              </div>
              <span className="bg-error-container text-on-error-container font-clinical-data-mono text-[10px] px-1.5 py-0.5 rounded font-bold">
                2 Alerts
              </span>
            </div>

            {/* Interaction 1 */}
            <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-1.5 border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <span className="font-body-strong text-metadata-micro text-on-surface flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-secondary">sync_problem</span>
                  Ticagrelor + Heparin
                </span>
                <span className="font-clinical-data-mono text-[10px] bg-surface-container text-on-surface px-1.5 py-0.5 rounded font-semibold">
                  Therapeutic Intent
                </span>
              </div>
              <p className="font-metadata-micro text-metadata-micro text-on-surface-variant leading-tight">
                Synergistic antiplatelet + antithrombotic increases major hemorrhage risk. Anticipated for PCI. Activated ACT monitoring mandated.
              </p>
              <div className="flex items-center justify-between font-clinical-data-mono text-[10px] text-outline">
                <span>Bleeding Risk: High</span>
                <span className="text-primary font-bold">Standard of Care</span>
              </div>
            </div>

            {/* Interaction 2 */}
            <div className="p-space-sm rounded-lg bg-error-container/40 flex flex-col gap-1.5 border border-error/30">
              <div className="flex items-center justify-between">
                <span className="font-body-strong text-metadata-micro text-error flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-error">dangerous</span>
                  Metformin + Iodinated Contrast
                </span>
                <span className="font-clinical-data-mono text-[10px] bg-error text-on-error px-1.5 py-0.5 rounded font-bold">
                  CONTRAINDICATED
                </span>
              </div>
              <p className="font-metadata-micro text-metadata-micro text-on-error-container leading-tight">
                Contrast-induced acute kidney injury (CI-AKI) can cause catastrophic metformin accumulation and severe lactic acidosis.
              </p>
              <div className="flex items-center justify-between font-clinical-data-mono text-[10px] text-error">
                <span>Action: Strict 48h Withhold</span>
                <span className="font-bold">Interlocked in EHR</span>
              </div>
            </div>

            {/* Interactive Sparkline / Coagulation Trend Graphic */}
            <div className="p-space-sm bg-surface-container rounded-lg flex flex-col gap-1 border border-outline-variant/30">
              <div className="flex items-center justify-between">
                <span className="font-metadata-micro text-metadata-micro font-semibold text-on-surface">
                  Baseline Renal &amp; Coag Profile
                </span>
                <span className="font-clinical-data-mono text-[10px] text-primary font-semibold">
                  eGFR: 78 mL/min · Normal
                </span>
              </div>
              <div className="w-full h-8 flex items-end gap-1 pt-2">
                <div className="flex-1 bg-primary-container h-4 rounded-xs" title="eGFR: 78 mL/min (Normal)"></div>
                <div className="flex-1 bg-primary-container h-5 rounded-xs" title="Creatinine: 0.94 mg/dL"></div>
                <div className="flex-1 bg-primary-container h-3.5 rounded-xs" title="Platelets: 240,000 /uL"></div>
                <div className="flex-1 bg-secondary-container h-6 rounded-xs" title="aPTT: 28.4s (Baseline Normal)"></div>
                <div className="flex-1 bg-error-container h-7 rounded-xs" title="Troponin I: 3.42 ng/mL (Elevated)"></div>
              </div>
              <div className="flex items-center justify-between font-clinical-data-mono text-[9px] text-outline pt-1">
                <span>GFR</span>
                <span>Cr</span>
                <span>Plt</span>
                <span>aPTT</span>
                <span className="text-error font-bold">cTnI (Peak)</span>
              </div>
            </div>
          </div>

          {/* SAFETY CARD 3: ABDM / FHIR R4 PAYLOAD INTEROP READINESS */}
          <div className="bg-surface-container-lowest p-space-base rounded-xl shadow-sm border border-outline-variant/30 flex flex-col gap-space-sm">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container-high">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-lg">cloud_sync</span>
                <span className="font-section-title text-clinical-data text-on-surface">ABDM &amp; FHIR R4 Bundling</span>
              </div>
              <span className="flex items-center gap-1 font-clinical-data-mono text-[10px] text-primary font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-primary inline-block"></span> M2 / M3 Ready
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-metadata-micro font-clinical-data-mono">
                <span className="text-on-surface-variant">Resource Type</span>
                <span className="text-on-surface font-semibold">Bundle: MedicationStatement</span>
              </div>
              <div className="flex items-center justify-between text-metadata-micro font-clinical-data-mono">
                <span className="text-on-surface-variant">Coding Taxonomy</span>
                <span className="text-on-surface font-semibold">SNOMED-CT / RxNorm India</span>
              </div>
              <div className="flex items-center justify-between text-metadata-micro font-clinical-data-mono">
                <span className="text-on-surface-variant">Provenance Digital Signature</span>
                <span className="text-primary font-semibold">Dr. Rohit Verma (ABDM-HPID)</span>
              </div>
              <div className="flex items-center justify-between text-metadata-micro font-clinical-data-mono">
                <span className="text-on-surface-variant">ABHA Consent Status</span>
                <span className="text-on-surface bg-surface-container px-1 rounded">Granted · HIP Validated</span>
              </div>
            </div>
            <div className="p-space-xs bg-surface-container-low rounded flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-secondary text-base">api</span>
              <span className="font-clinical-data-mono text-[10px] text-on-surface-variant truncate">
                urn:uuid:careflow-rec-2026-0301-del8841
              </span>
            </div>
          </div>

          {/* RAPID ACTIONS PANEL */}
          <div className="flex flex-col gap-space-xs">
            <button
              onClick={() => setShowCommitModal(true)}
              className="w-full h-10 px-space-base bg-primary text-on-primary hover:bg-primary-container font-clinical-data text-clinical-data font-semibold rounded-lg shadow-sm flex items-center justify-center gap-space-xs transition-colors"
            >
              <span className="material-symbols-outlined text-lg">check_circle</span>
              Commit Reconciled Regimen to EHR (5 Changes)
            </button>
            <button
              onClick={() => setShowStatModal(true)}
              className="w-full h-9 px-space-base bg-surface-container-lowest text-error hover:bg-error-container hover:text-on-error-container font-clinical-data text-clinical-data font-semibold rounded-lg shadow-sm border border-error/30 flex items-center justify-center gap-space-xs transition-colors"
            >
              <span className="material-symbols-outlined text-base">emergency</span>
              Order Urgent In-Flight STAT Administration
            </button>
            <button
              onClick={() => setShowMarModal(true)}
              className="w-full h-9 px-space-base bg-surface-container-lowest text-on-surface hover:bg-surface-container-high font-clinical-data text-clinical-data rounded-lg shadow-sm border border-outline-variant/30 flex items-center justify-center gap-space-xs transition-colors"
            >
              <span className="material-symbols-outlined text-base">print</span>
              Print Nursing MAR Flowsheet with QR
            </button>
          </div>
        </div>
      </div>

      {/* COMMIT RECONCILED EHR MODAL */}
      {showCommitModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-outline-variant flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-2xl">verified</span>
                <h3 className="font-section-title text-section-title text-on-surface">
                  Commit Reconciled Regimen to EHR
                </h3>
              </div>
              <button onClick={() => setShowCommitModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3 font-clinical-data text-clinical-data">
              <p className="text-on-surface-variant">
                You are about to sign and commit <strong>5 reconciliation directives</strong> into Rahul Sharma&apos;s active EHR
                chart (`DEL-2024-8841`):
              </p>
              <ul className="space-y-2 bg-surface-container-low p-3 rounded-lg border border-outline-variant/20 text-xs">
                <li className="flex items-center gap-2 text-on-surface">
                  <span className="material-symbols-outlined text-secondary text-sm">pause_circle</span>
                  <span><strong>Amlodipine 5mg:</strong> Temporarily held pre-PCI.</span>
                </li>
                <li className="flex items-center gap-2 text-error font-medium">
                  <span className="material-symbols-outlined text-sm">block</span>
                  <span><strong>Telmisartan 40mg:</strong> Held pre-procedure (hypotension &amp; contrast safety).</span>
                </li>
                <li className="flex items-center gap-2 text-error font-bold">
                  <span className="material-symbols-outlined text-sm">lock</span>
                  <span><strong>Metformin 500mg:</strong> Strict 48h withhold for iodinated contrast safety.</span>
                </li>
                <li className="flex items-center gap-2 text-primary font-medium">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  <span><strong>DAPT (Aspirin 325mg + Ticagrelor 180mg):</strong> Committed to post-PCI eMAR.</span>
                </li>
                <li className="flex items-center gap-2 text-primary font-medium">
                  <span className="material-symbols-outlined text-sm">trending_up</span>
                  <span><strong>Atorvastatin:</strong> Escalated from 20mg baseline to 80mg OD statin boost.</span>
                </li>
              </ul>

              <div className="p-3 bg-surface-container rounded border border-outline-variant/30 text-xs">
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span>Signatory Doctor:</span>
                  <span className="font-bold text-on-surface">Dr. Rohit Verma (HPID-DEL-4092)</span>
                </div>
                <div className="flex items-center justify-between text-on-surface-variant mt-1">
                  <span>ABDM Consent Artifact:</span>
                  <span className="font-clinical-data-mono text-primary">GRANTED (M3-HIP-DEL)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container-high">
              <button
                onClick={() => setShowCommitModal(false)}
                className="px-4 py-2 text-clinical-data font-clinical-data text-on-surface-variant hover:bg-surface-container rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowCommitModal(false);
                  showToast("Regimen successfully committed and signed with ABDM HPID. Transmitted to Cath Lab Bay.");
                }}
                className="px-5 py-2 text-clinical-data font-clinical-data bg-primary text-on-primary font-semibold rounded-lg hover:bg-primary-container transition-colors shadow-sm flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">draw</span>
                Sign &amp; Transmit Orders
              </button>
            </div>
          </div>
        </div>
      )}

      {/* URGENT STAT ORDER MODAL */}
      {showStatModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-error/40 flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-error text-2xl">emergency</span>
                <h3 className="font-section-title text-section-title text-error">
                  Order Urgent In-Flight STAT Drug
                </h3>
              </div>
              <button onClick={() => setShowStatModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-3 font-clinical-data text-clinical-data">
              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">Select STAT Medication</label>
                <select
                  value={statDrug}
                  onChange={e => setStatDrug(e.target.value)}
                  className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm text-on-surface"
                >
                  <option value="Heparin 5000 IU IV">Heparin 5000 IU IV (Pre-Cath Bolus)</option>
                  <option value="Atropine 0.5mg IV">Atropine 0.5mg IV (Bradycardia Rescue)</option>
                  <option value="Fentanyl 50 mcg IV">Fentanyl 50 mcg IV (Analgesia)</option>
                  <option value="Metoprolol 2.5mg IV">Metoprolol 2.5mg IV (Rate Control)</option>
                  <option value="Adrenaline 1mg IV (1:10000)">Adrenaline 1mg IV (Resuscitation)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-on-surface block mb-1">Route</label>
                  <select
                    value={statRoute}
                    onChange={e => setStatRoute(e.target.value)}
                    className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm text-on-surface"
                  >
                    <option value="IV Bolus">IV Bolus Push</option>
                    <option value="IV Infusion">IV Infusion</option>
                    <option value="SC">Subcutaneous</option>
                    <option value="PO Chewable">PO Chewable</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-on-surface block mb-1">Urgency Priority</label>
                  <select
                    value={statUrgency}
                    onChange={e => setStatUrgency(e.target.value)}
                    className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm text-error font-bold"
                  >
                    <option value="IMMEDIATE">STAT Immediate (&lt; 2m)</option>
                    <option value="URGENT">Urgent (&lt; 15m)</option>
                    <option value="ON-CALL">On Call to Cath Lab</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-error-container/30 rounded-lg border border-error/30 text-xs text-on-error-container">
                <strong>Safety Verification:</strong> Checked against Penicillin allergy (No cross-reaction). Renal profile verified (eGFR 78 mL/min).
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container-high">
              <button
                onClick={() => setShowStatModal(false)}
                className="px-4 py-2 text-clinical-data font-clinical-data text-on-surface-variant hover:bg-surface-container rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowStatModal(false);
                  showToast(`STAT Order [${statDrug}] dispatched immediately to Bedside Nurse Bay 02.`);
                }}
                className="px-5 py-2 text-clinical-data font-clinical-data bg-error text-on-error font-semibold rounded-lg hover:bg-error/90 transition-colors shadow-sm flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">bolt</span>
                Dispatch STAT Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRINT MAR FLOWSHEET PREVIEW MODAL */}
      {showMarModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-outline-variant flex flex-col gap-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-2xl">print</span>
                <h3 className="font-section-title text-section-title text-on-surface">
                  Medication Administration Record (MAR Flowsheet)
                </h3>
              </div>
              <button onClick={() => setShowMarModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* MAR Printable Card */}
            <div className="border border-outline-variant p-5 rounded-xl bg-surface-container-lowest font-clinical-data flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
                <div className="flex flex-col">
                  <span className="font-bold text-base text-primary uppercase">Apollo Indraprastha · MAR Flowsheet</span>
                  <span className="text-xs text-on-surface-variant">Emergency Resuscitation Unit · Bay 02</span>
                </div>
                <div className="text-right">
                  <span className="font-clinical-data-mono text-xs text-on-surface font-bold">UHID: DEL-2024-8841</span>
                  <p className="text-[11px] text-on-surface-variant">Rahul Sharma · 42M · Token #104</p>
                </div>
              </div>

              <div className="text-xs space-y-2">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-surface-container text-on-surface font-semibold text-left">
                      <th className="p-2 border border-outline-variant">Medication &amp; Dose</th>
                      <th className="p-2 border border-outline-variant">Route / Freq</th>
                      <th className="p-2 border border-outline-variant">Reconciled Status</th>
                      <th className="p-2 border border-outline-variant">Nurse Signature</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 border border-outline-variant font-semibold">Amlodipine 5mg</td>
                      <td className="p-2 border border-outline-variant">PO · Morning</td>
                      <td className="p-2 border border-outline-variant text-secondary font-bold">HOLD PRE-PCI</td>
                      <td className="p-2 border border-outline-variant text-outline italic">Held per Dr. Verma</td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-outline-variant font-semibold">Telmisartan 40mg</td>
                      <td className="p-2 border border-outline-variant">PO · Night</td>
                      <td className="p-2 border border-outline-variant text-error font-bold">HOLD PRE-PROCEDURE</td>
                      <td className="p-2 border border-outline-variant text-outline italic">Held (Contrast alert)</td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-outline-variant font-semibold">Metformin 500mg</td>
                      <td className="p-2 border border-outline-variant">PO · BD</td>
                      <td className="p-2 border border-outline-variant text-error font-bold">STRICT HOLD 48H</td>
                      <td className="p-2 border border-outline-variant text-outline italic">Contrast Lockout</td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-outline-variant font-semibold">Ticagrelor 180mg load + Aspirin 325mg</td>
                      <td className="p-2 border border-outline-variant">STAT PO</td>
                      <td className="p-2 border border-outline-variant text-primary font-bold">GIVEN 14:26 IST</td>
                      <td className="p-2 border border-outline-variant text-primary font-semibold">Ancy (RN-401)</td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-outline-variant font-semibold">Atorvastatin 80mg</td>
                      <td className="p-2 border border-outline-variant">STAT PO / Nightly</td>
                      <td className="p-2 border border-outline-variant text-primary font-bold">GIVEN 14:30 IST</td>
                      <td className="p-2 border border-outline-variant text-primary font-semibold">Ancy (RN-401)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between text-xs text-on-surface-variant pt-2 border-t border-outline-variant/60">
                <span>Certified By: Dr. Rohit Verma (Interventional Cardiology)</span>
                <span className="font-clinical-data-mono">Generated: 07 Sep 2026, 14:45 IST</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container-high">
              <button
                onClick={() => setShowMarModal(false)}
                className="px-4 py-2 text-clinical-data font-clinical-data text-on-surface-variant hover:bg-surface-container rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                  showToast("Sent MAR Flowsheet to Zebra Bedside Network Printer (Bay 02).");
                }}
                className="px-5 py-2 text-clinical-data font-clinical-data bg-primary text-on-primary font-semibold rounded-lg hover:bg-primary-container transition-colors shadow-sm flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">print</span>
                Send to Bedside Printer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HISTORICAL COMPARISON MODAL */}
      {showHistoricalModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-outline-variant flex flex-col gap-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-2xl">difference</span>
                <h3 className="font-section-title text-section-title text-on-surface">
                  Historical Comparison: August 2025 vs Current STEMI Reconciled
                </h3>
              </div>
              <button onClick={() => setShowHistoricalModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-clinical-data">
              <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/40 flex flex-col gap-2">
                <span className="font-bold text-sm text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-secondary">history</span>
                  August 2025 OPD Baseline (Dr. Kulkarni)
                </span>
                <div className="space-y-2 text-on-surface-variant">
                  <div className="p-2 bg-surface-container-lowest rounded border border-outline-variant/30">
                    <strong>Tab. Amlodipine 5mg:</strong> OD Morning for mild hypertension.
                  </div>
                  <div className="p-2 bg-surface-container-lowest rounded border border-outline-variant/30">
                    <strong>Tab. Telmisartan 40mg:</strong> OD Bedtime for BP stability.
                  </div>
                  <div className="p-2 bg-surface-container-lowest rounded border border-outline-variant/30">
                    <strong>Tab. Metformin 500mg:</strong> BD post-meals (HbA1c was 7.4%).
                  </div>
                  <div className="p-2 bg-surface-container-lowest rounded border border-outline-variant/30">
                    <strong>Tab. Atorvastatin 20mg:</strong> HS Bedtime (Sub-adherent per patient).
                  </div>
                  <div className="p-2 bg-surface-container-lowest rounded border border-outline-variant/30 text-outline">
                    <em>No Antiplatelets or Anticoagulants Prescribed</em>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-primary/5 rounded-xl border border-primary/30 flex flex-col gap-2">
                <span className="font-bold text-sm text-primary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-primary">verified</span>
                  Current Reconciled (Dr. Rohit Verma)
                </span>
                <div className="space-y-2 text-on-surface">
                  <div className="p-2 bg-surface-container-lowest rounded border border-secondary/40">
                    <span className="text-secondary font-bold">HOLD PRE-PCI:</span> Amlodipine held until hemodynamics stabilize.
                  </div>
                  <div className="p-2 bg-surface-container-lowest rounded border border-error/40">
                    <span className="text-error font-bold">LOCKED HOLD:</span> Telmisartan held for contrast safety &amp; hypotension risk.
                  </div>
                  <div className="p-2 bg-surface-container-lowest rounded border border-error/40">
                    <span className="text-error font-bold">STRICT HOLD 48H:</span> Metformin withhold to prevent lactic acidosis with contrast.
                  </div>
                  <div className="p-2 bg-surface-container-lowest rounded border border-primary/40">
                    <span className="text-primary font-bold">ESCALATED TO 80MG:</span> High-intensity statin plaque stabilization.
                  </div>
                  <div className="p-2 bg-surface-container-lowest rounded border border-primary/40">
                    <span className="text-primary font-bold">NEW DAPT COMMITTED:</span> Aspirin 325mg + Ticagrelor 180mg load given.
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container-high">
              <button
                onClick={() => setShowHistoricalModal(false)}
                className="px-4 py-2 text-clinical-data font-clinical-data bg-primary text-on-primary rounded-lg font-semibold"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODIFY ROW DECISION DIALOG */}
      {editingRow && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-2xl">edit_note</span>
                <h3 className="font-section-title text-section-title text-on-surface">
                  Modify Reconciled Order
                </h3>
              </div>
              <button onClick={() => setEditingRow(null)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="text-xs space-y-3 font-clinical-data">
              <div>
                <span className="text-on-surface-variant">Medication:</span>
                <p className="font-bold text-sm text-on-surface">{editingRow.reconciledMed.name}</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">Select Physician Decision</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() =>
                      handleDecisionUpdate(
                        editingRow.id,
                        "Hold Pre-PCI",
                        "bg-secondary-container",
                        "text-on-secondary-container",
                        "Temporarily held pre-PCI per physician order."
                      )
                    }
                    className="p-2 rounded border border-secondary text-secondary font-semibold hover:bg-secondary-container/20 text-center"
                  >
                    Hold Pre-PCI
                  </button>
                  <button
                    onClick={() =>
                      handleDecisionUpdate(
                        editingRow.id,
                        "Continue Baseline",
                        "bg-primary-container",
                        "text-on-primary",
                        "Maintain existing baseline dosage with continuous monitoring."
                      )
                    }
                    className="p-2 rounded border border-primary text-primary font-semibold hover:bg-primary/10 text-center"
                  >
                    Continue Baseline
                  </button>
                  <button
                    onClick={() =>
                      handleDecisionUpdate(
                        editingRow.id,
                        "Strict Hold 48h",
                        "bg-error-container",
                        "text-on-error-container",
                        "Strict 48-hour withhold required for procedure safety."
                      )
                    }
                    className="p-2 rounded border border-error text-error font-semibold hover:bg-error-container/20 text-center"
                  >
                    Strict Hold 48h
                  </button>
                  <button
                    onClick={() =>
                      handleDecisionUpdate(
                        editingRow.id,
                        "Dose Escalated",
                        "bg-primary-container",
                        "text-on-primary",
                        "Escalated to acute coronary syndrome standard dose."
                      )
                    }
                    className="p-2 rounded border border-primary text-primary font-semibold hover:bg-primary/10 text-center"
                  >
                    Dose Escalated
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container-high">
              <button
                onClick={() => setEditingRow(null)}
                className="px-4 py-2 text-clinical-data font-clinical-data text-on-surface-variant hover:bg-surface-container rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
