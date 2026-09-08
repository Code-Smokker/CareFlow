/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function ProblemsDiagnosesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "stat" | "active" | "suboptimal" | "resolved">("all");

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCathModal, setShowCathModal] = useState(false);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [showDisambigModal, setShowDisambigModal] = useState(false);
  const [showFhirModal, setShowFhirModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showOcrModal, setShowOcrModal] = useState(false);
  const [showMetforminModal, setShowMetforminModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New diagnosis form state
  const [newDiagName, setNewDiagName] = useState("");
  const [newDiagIcd10, setNewDiagIcd10] = useState("");
  const [newDiagCategory, setNewDiagCategory] = useState<"stat" | "active" | "suboptimal">("active");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Keyboard shortcut ⌘F / Ctrl+F
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        const input = document.getElementById("ontologySearchInput");
        if (input) input.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isVisible = (type: "stat" | "active" | "suboptimal" | "resolved", textToMatch: string) => {
    if (activeFilter !== "all" && activeFilter !== type) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return textToMatch.toLowerCase().includes(q);
  };

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

      {/* PATIENT CONTEXT BANNER */}
      <div className="relative overflow-hidden bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex flex-col gap-space-xs border border-outline-variant/30">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-error via-error to-primary"></div>
        <div className="flex flex-wrap items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-md">
            <div className="relative">
              <img
                className="w-12 h-12 rounded-xl object-cover shadow-sm ring-1 ring-outline-variant"
                alt="Rahul Sharma"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlfKN39liavBlY9pzYC3NX8NLafxhzLnuetYbxfdlXtq0wgBquva37shccRzI6xlRS5LsP8D4xA4hquVcp9jkjOfpYzzoC8e0P4LWWfJvlkXeKaa8GWcubjXlr0tAEXqwCoz-wbwq2KUkJtYEgsYeBfBLBbQLd0t6jKnIq1lZ8SMjl5SeS2vshfWqXqeBQCotEOmmBmW98e1lMOGATsYH8ccpzex7tXOVo5kXQdmgDbxamzUE0vle8"
              />
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-error text-on-error font-clinical-data-mono text-[9px] font-bold shadow">
                P1
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-space-xs flex-wrap">
                <span className="font-page-title text-page-title text-on-surface tracking-tight">Rahul Sharma</span>
                <span className="font-clinical-data-mono text-clinical-data text-on-surface-variant">42 Y · Male</span>
                <span className="bg-primary-fixed text-on-primary-fixed font-clinical-data-mono text-metadata-micro px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                  ABHA Verified · 91-8842-1920-4491
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-space-md gap-y-0.5 text-metadata-micro font-metadata-micro text-on-surface-variant">
                <span>
                  UHID: <strong className="text-on-surface font-clinical-data-mono">DEL-2024-8841</strong>
                </span>
                <span>
                  Token: <strong className="text-on-surface font-clinical-data-mono">#104 (STAT Emergent)</strong>
                </span>
                <span>
                  Attending: <strong className="text-on-surface">Dr. Rohit Verma (Chief of Clinical Services)</strong>
                </span>
                <span>
                  Department: <strong className="text-on-surface">Cardiology Resus Wing B</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Badges & Telemetry Pulse */}
          <div className="flex items-center gap-space-xs bg-surface-container-low px-space-md py-1.5 rounded-lg shadow-sm border border-outline-variant/30">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-error"></span>
              </span>
              <span className="font-clinical-data-mono text-metadata-micro text-error font-semibold uppercase">
                STEMI Door-to-Balloon Active: 38m elapsed
              </span>
            </div>
            <div className="h-4 w-px bg-surface-dim mx-1"></div>
            <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">
              Target PCI: &lt; 90 min
            </span>
          </div>
        </div>

        {/* Alert Ribbon Strip */}
        <div className="flex flex-wrap items-center justify-between gap-space-xs pt-1 mt-1 bg-error-container/40 -mx-space-md -mb-space-md px-space-md py-1.5 text-on-error-container border-t border-error/20">
          <div className="flex items-center gap-space-xs flex-wrap">
            <span className="material-symbols-outlined text-sm text-error">warning</span>
            <span className="font-body-strong text-metadata-micro uppercase tracking-wide text-error">
              Red Flag Clinical Alerts:
            </span>
            <span className="font-clinical-data text-metadata-micro font-semibold">
              Anterior STEMI with Hypoperfusion Risk
            </span>
            <span className="text-outline-variant">·</span>
            <span className="font-clinical-data text-metadata-micro font-semibold">
              Pre-Cath Angio Queue Position #1
            </span>
            <span className="text-outline-variant">·</span>
            <span className="font-clinical-data text-metadata-micro">Allergies: NKDA (Verified)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-clinical-data-mono text-metadata-micro">
              Multi-Coding Concordance: 100% (ICD-10, ICD-11, SNOMED, NAMASTE)
            </span>
          </div>
        </div>
      </div>

      {/* OPERATIONAL COMMAND & SEARCH BAR */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex flex-col lg:flex-row items-center justify-between gap-space-md border border-outline-variant/30">
        <div className="relative flex-1 w-full">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-lg">search</span>
          <input
            id="ontologySearchInput"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-24 text-clinical-data font-clinical-data bg-surface-container-low text-on-surface placeholder:text-outline rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary shadow-sm transition-all border border-outline-variant/30"
            placeholder="Search condition, terminology, SNOMED CT, ICD-10, ICD-11, or NAMASTE concept..."
            type="text"
          />
          <div className="absolute right-2.5 top-2 flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-surface-container font-clinical-data-mono text-[10px] text-on-surface-variant rounded shadow-xs">
              ⌘F
            </kbd>
            <span
              onClick={() => setSearchQuery("")}
              className="material-symbols-outlined text-outline hover:text-primary cursor-pointer text-lg"
              title="Clear search"
            >
              tune
            </span>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap items-center gap-space-xs shrink-0 w-full lg:w-auto">
          <button
            onClick={() => setActiveFilter(activeFilter === "stat" ? "all" : "stat")}
            className={`px-3 py-1.5 rounded-lg font-clinical-data text-metadata-micro flex items-center gap-1.5 shadow-sm transition-opacity ${
              activeFilter === "stat"
                ? "bg-error text-on-error font-bold ring-2 ring-error/50"
                : "bg-error text-on-error opacity-90 hover:opacity-100"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
            Working STAT (1)
          </button>
          <button
            onClick={() => setActiveFilter(activeFilter === "active" ? "all" : "active")}
            className={`px-3 py-1.5 rounded-lg font-clinical-data text-metadata-micro flex items-center gap-1 transition-colors ${
              activeFilter === "active"
                ? "bg-primary text-on-primary font-bold shadow-sm"
                : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
            }`}
          >
            Active Problems (3)
          </button>
          <button
            onClick={() => setActiveFilter(activeFilter === "suboptimal" ? "all" : "suboptimal")}
            className={`px-3 py-1.5 rounded-lg font-clinical-data text-metadata-micro flex items-center gap-1 transition-colors ${
              activeFilter === "suboptimal"
                ? "bg-secondary text-on-secondary font-bold shadow-sm"
                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            Chronic Sub-optimal (2)
          </button>
          <button
            onClick={() => setActiveFilter(activeFilter === "resolved" ? "all" : "resolved")}
            className={`px-3 py-1.5 rounded-lg font-clinical-data text-metadata-micro flex items-center gap-1 transition-colors ${
              activeFilter === "resolved"
                ? "bg-surface-dim text-on-surface font-bold shadow-sm"
                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            Resolved (1)
          </button>
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-space-xs shrink-0 w-full lg:w-auto justify-end flex-wrap">
          <button
            onClick={() => setShowAddModal(true)}
            className="h-9 px-3 bg-primary text-on-primary rounded-lg font-clinical-data text-clinical-data flex items-center gap-1.5 shadow-sm hover:bg-primary-container transition-colors"
          >
            <span className="material-symbols-outlined text-base">add</span>
            + Add Problem / Diagnosis
          </button>
          <Link
            href="/medication-reconciliation"
            className="h-9 px-3 bg-surface-container text-on-surface rounded-lg font-clinical-data text-clinical-data flex items-center gap-1.5 shadow-sm hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-base">sync_alt</span>
            Reconcile
          </Link>
          <button
            onClick={() => setShowDisambigModal(true)}
            className="h-9 px-3 bg-secondary text-on-secondary rounded-lg font-clinical-data text-clinical-data flex items-center gap-1.5 shadow-sm hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-base">hub</span>
            Cross-Map ICD-11 &amp; NAMASTE
          </button>
        </div>
      </div>

      {/* PRIMARY WORKSPACE SPLIT: LEFT (2/3) DIAGNOSTIC STREAMS | RIGHT (1/3) TERMINOLOGY INSPECTOR */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-md">
        {/* LEFT COLUMN: Diagnostic & Problem Registry Streams */}
        <div className="xl:col-span-8 flex flex-col gap-space-md">
          {/* SECTION 1: Encounter Working STAT Diagnosis (Hyper-Acute Emergency) */}
          {isVisible("stat", "Acute Transmural Myocardial Infarction STEMI Anterior I21.0 BD10.0 57054005 Hridshoola") && (
            <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/30">
              <div className="bg-gradient-to-r from-error/15 via-error/5 to-surface-container-lowest px-space-panel-padding py-space-sm flex items-center justify-between border-b border-error/20">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-error text-xl animate-pulse">crisis_alert</span>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-section-title text-section-title text-on-surface">
                        Encounter Working STAT Diagnosis
                      </span>
                      <span className="bg-error text-on-error font-clinical-data-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                        P1 Hyper-Acute
                      </span>
                    </div>
                    <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                      Immediate Interventional Pathway · Primary PCI Mandated
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-clinical-data-mono text-metadata-micro text-error font-bold bg-error-container/60 px-2 py-1 rounded">
                    DOOR-TO-DEVICE CLOCK RUNNING
                  </span>
                </div>
              </div>

              <div className="p-space-panel-padding flex flex-col gap-space-md">
                {/* Diagnosis Lead Card */}
                <div className="bg-surface-container-low rounded-xl p-space-md shadow-sm border border-outline-variant/20">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-space-sm">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-page-title text-subheading text-error font-bold">
                          Acute Transmural Myocardial Infarction of Anterior Wall (STEMI)
                        </span>
                        <span className="px-2 py-0.5 rounded bg-error/10 text-error font-clinical-data-mono text-metadata-micro font-bold">
                          STAT CODE BLUE CAT-1
                        </span>
                      </div>
                      {/* Ontology Cross-Tags */}
                      <div className="flex flex-wrap items-center gap-space-xs mt-space-xs">
                        <span className="bg-surface-container-highest px-2 py-0.5 rounded font-clinical-data-mono text-metadata-micro text-on-surface font-semibold flex items-center gap-1">
                          <span className="text-outline text-[10px]">ICD-10</span>
                          <span className="text-error font-bold">I21.0</span>
                        </span>
                        <span className="bg-surface-container-highest px-2 py-0.5 rounded font-clinical-data-mono text-metadata-micro text-on-surface font-semibold flex items-center gap-1">
                          <span className="text-outline text-[10px]">ICD-11 MMS</span>
                          <span className="text-primary font-bold">BD10.0</span>
                        </span>
                        <span className="bg-surface-container-highest px-2 py-0.5 rounded font-clinical-data-mono text-metadata-micro text-on-surface font-semibold flex items-center gap-1">
                          <span className="text-outline text-[10px]">SNOMED CT</span>
                          <span className="text-tertiary font-bold">57054005</span>
                        </span>
                        <span className="bg-surface-container px-2 py-0.5 rounded font-clinical-data-mono text-metadata-micro text-on-surface flex items-center gap-1">
                          <span className="text-outline text-[10px]">AYUSH NAMASTE</span>
                          <span className="text-secondary font-medium">Hridshoola (ND-CS-04)</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => setShowCathModal(true)}
                        className="px-3 py-1.5 bg-primary text-on-primary rounded font-clinical-data text-metadata-micro flex items-center gap-1 shadow-sm hover:bg-primary-container transition-colors"
                        title="Cath Lab Protocol Activated"
                      >
                        <span className="material-symbols-outlined text-sm">bolt</span>
                        Trigger Cath Lab
                      </button>
                      <button
                        onClick={() => setShowEvidenceModal(true)}
                        className="p-1.5 bg-surface-container hover:bg-surface-container-high rounded text-on-surface transition-colors"
                        title="Clinical Evidence Inspector"
                      >
                        <span className="material-symbols-outlined text-base">visibility</span>
                      </button>
                    </div>
                  </div>

                  {/* Provenance & Evidence Drawer Inside STAT Card */}
                  <div className="mt-space-md grid grid-cols-1 md:grid-cols-3 gap-space-sm">
                    <div className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm border border-outline-variant/30">
                      <span className="font-metadata-micro text-metadata-micro text-outline uppercase tracking-wider block mb-1">
                        Telemetry Provenance
                      </span>
                      <p className="font-clinical-data text-clinical-data text-on-surface font-semibold">Bedside 12-Lead ECG</p>
                      <span className="font-clinical-data-mono text-metadata-micro text-error font-semibold">
                        Leads V2-V4 ST elevation +3.2mm
                      </span>
                      <div className="mt-1 text-[11px] text-on-surface-variant font-metadata-micro">
                        Auto-captured: 14:02 IST · Station 08
                      </div>
                    </div>
                    <div className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm border border-outline-variant/30">
                      <span className="font-metadata-micro text-metadata-micro text-outline uppercase tracking-wider block mb-1">
                        Clinical Manifestation
                      </span>
                      <p className="font-clinical-data text-clinical-data text-on-surface font-semibold">
                        Crushing substernal pressure
                      </p>
                      <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                        Radiating to left mandibular jaw, cold diaphoresis, acute nausea.
                      </span>
                      <div className="mt-1 text-[11px] text-primary font-clinical-data-mono font-semibold">
                        Verified: Dr. Rohit Verma
                      </div>
                    </div>
                    <div className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm border border-outline-variant/30">
                      <span className="font-metadata-micro text-metadata-micro text-outline uppercase tracking-wider block mb-1">
                        Laboratory Staging
                      </span>
                      <div className="flex items-center justify-between">
                        <span className="font-clinical-data text-clinical-data text-on-surface font-semibold">
                          High-Sens Troponin I
                        </span>
                        <span className="font-clinical-data-mono text-metadata-micro text-error font-bold px-1.5 py-0.5 rounded bg-error/10">
                          ↑ 1,480 ng/L
                        </span>
                      </div>
                      <div className="w-full bg-surface-container h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-error h-full rounded-full" style={{ width: "88%" }}></div>
                      </div>
                      <div className="flex justify-between items-center mt-1 text-[10px] font-clinical-data-mono text-outline">
                        <span>Ref: &lt; 14 ng/L</span>
                        <span className="text-error font-bold">105x Cutoff</span>
                      </div>
                    </div>
                  </div>

                  {/* Physiological Real-Time Sparkline Component */}
                  <div className="mt-space-md bg-surface-container-lowest p-space-sm rounded-lg shadow-sm flex flex-col md:flex-row items-center justify-between gap-space-sm border border-outline-variant/30">
                    <div className="flex items-center gap-space-sm">
                      <span className="material-symbols-outlined text-primary text-xl">monitor_heart</span>
                      <div className="flex flex-col">
                        <span className="font-clinical-data text-clinical-data font-semibold text-on-surface">
                          Lead V3 Continuous Vector Monitor
                        </span>
                        <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                          Real-time ST Segment Elevation Resolution Tracking
                        </span>
                      </div>
                    </div>
                    {/* Inline ECG Wave Vector Visualization */}
                    <div className="flex-1 max-w-md w-full h-10 flex items-center">
                      <svg className="w-full h-10 text-error" fill="none" viewBox="0 0 300 40">
                        <path
                          d="M0,20 L40,20 L50,18 L55,20 L65,20 L70,8 L75,34 L82,10 L88,12 L95,14 L110,18 L130,20 L170,20 L180,18 L185,20 L195,20 L200,6 L205,36 L212,10 L218,12 L225,14 L240,18 L260,20 L300,20"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-clinical-data-mono text-metadata-micro text-on-surface font-bold">+3.2 mm</span>
                      <span className="text-[10px] block font-metadata-micro text-outline">Active Injury Current</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: Active Longitudinal Problem List (Chronic Baseline) */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-panel-padding flex flex-col gap-space-md border border-outline-variant/30">
            <div className="flex flex-wrap items-center justify-between gap-space-xs">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-xl">folder_managed</span>
                <div className="flex flex-col">
                  <span className="font-section-title text-section-title text-on-surface">
                    Active Longitudinal Problem List
                  </span>
                  <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    Continuous Medical History &amp; Chronic Care Continuum
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-space-xs text-metadata-micro font-clinical-data-mono text-outline">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-primary"></span> 3 Active Co-morbidities
                </span>
                <span>·</span>
                <span>FHIR Profile: US-Core/ABDM Condition</span>
              </div>
            </div>

            {/* Problem Card 1: Type 2 Diabetes Mellitus */}
            {isVisible("suboptimal", "Type 2 Diabetes Mellitus E11.9 5A11 44054006 Madhumeha ND-DM-02 HbA1c") && (
              <div className="p-space-md bg-surface-container-low rounded-xl shadow-sm flex flex-col gap-space-sm hover:shadow transition-shadow border border-outline-variant/20">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-space-sm">
                  <div className="flex items-start gap-space-sm">
                    <div className="mt-1 h-8 w-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
                      <span className="material-symbols-outlined text-lg">water_drop</span>
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-subheading text-subheading text-on-surface font-semibold">
                          Type 2 Diabetes Mellitus without acute complications
                        </span>
                        <span className="bg-error-container text-on-error-container font-clinical-data-mono text-metadata-micro px-2 py-0.5 rounded font-semibold">
                          SUB-OPTIMALLY CONTROLLED
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-space-xs mt-1 text-metadata-micro font-clinical-data-mono">
                        <span className="bg-surface-container-highest text-on-surface px-1.5 py-0.5 rounded">
                          ICD-10: E11.9
                        </span>
                        <span className="bg-surface-container-highest text-on-surface px-1.5 py-0.5 rounded">
                          ICD-11: 5A11
                        </span>
                        <span className="bg-surface-container-highest text-on-surface px-1.5 py-0.5 rounded">
                          SNOMED: 44054006
                        </span>
                        <span className="bg-secondary-container text-on-secondary-container px-1.5 py-0.5 rounded">
                          Ayurveda NAMASTE: Madhumeha (ND-DM-02)
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left md:text-right shrink-0">
                    <span className="font-clinical-data-mono text-metadata-micro text-on-surface font-semibold block">
                      Onset: March 2019 (7+ Yrs)
                    </span>
                    <span className="font-metadata-micro text-metadata-micro text-outline block">
                      Dr. Sameer Kulkarni (Endocrine/IM)
                    </span>
                  </div>
                </div>

                {/* Chronic Lab Telemetry Bar HbA1c */}
                <div className="bg-surface-container-lowest p-space-sm rounded-lg flex flex-col md:flex-row items-center justify-between gap-space-md mt-1 shadow-sm border border-outline-variant/30">
                  <div className="flex items-center gap-space-md w-full md:w-auto">
                    <div className="flex flex-col">
                      <span className="text-metadata-micro font-metadata-micro text-outline uppercase">
                        Latest HbA1c Index
                      </span>
                      <span className="font-clinical-data-mono text-subheading text-error font-bold">7.8 %</span>
                    </div>
                    <div className="flex flex-col text-[11px] font-metadata-micro text-on-surface-variant">
                      <span>Drawn: 04-Jul-2026 (Apollo Health Check)</span>
                      <span className="text-outline">Target Range for CAD patient: &lt; 7.0 %</span>
                    </div>
                  </div>
                  {/* Inline Diagnostic Range Indicator */}
                  <div className="w-full md:w-64 flex flex-col gap-1">
                    <div className="flex justify-between text-[10px] font-clinical-data-mono text-outline">
                      <span>&lt;5.7 Normal</span>
                      <span>6.5 Pre-DM</span>
                      <span className="text-error font-bold">Current: 7.8</span>
                    </div>
                    <div className="h-2 w-full bg-surface-container rounded-full relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 bg-primary w-2/5 rounded-l-full"></div>
                      <div className="absolute left-2/5 top-0 bottom-0 bg-secondary w-1/4"></div>
                      <div className="absolute left-[65%] top-0 bottom-0 bg-error w-[35%] rounded-r-full"></div>
                      <div className="absolute top-0 bottom-0 w-1 bg-on-surface shadow-sm" style={{ left: "78%" }}></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setShowMetforminModal(true)}
                      className="px-2.5 py-1 bg-surface-container text-on-surface hover:bg-surface-container-high rounded font-clinical-data text-metadata-micro transition-colors"
                    >
                      Adjust Metformin
                    </button>
                    <button
                      onClick={() => showToast("Audited: Metformin is currently on STRICT 48h HOLD due to radiocontrast.")}
                      className="p-1 text-outline hover:text-on-surface"
                    >
                      <span className="material-symbols-outlined text-base">more_vert</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Problem Card 2: Essential Hypertension */}
            {isVisible("active", "Essential Primary Hypertension I10 BA00 59621000 Uccharaktachapa Telmisartan") && (
              <div className="p-space-md bg-surface-container-low rounded-xl shadow-sm flex flex-col gap-space-sm hover:shadow transition-shadow border border-outline-variant/20">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-space-sm">
                  <div className="flex items-start gap-space-sm">
                    <div className="mt-1 h-8 w-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
                      <span className="material-symbols-outlined text-lg">compress</span>
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-subheading text-subheading text-on-surface font-semibold">
                          Essential (Primary) Hypertension
                        </span>
                        <span className="bg-surface-container-highest text-on-surface font-clinical-data-mono text-metadata-micro px-2 py-0.5 rounded font-semibold">
                          CHRONIC · MONITORED
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-space-xs mt-1 text-metadata-micro font-clinical-data-mono">
                        <span className="bg-surface-container-highest text-on-surface px-1.5 py-0.5 rounded">
                          ICD-10: I10
                        </span>
                        <span className="bg-surface-container-highest text-on-surface px-1.5 py-0.5 rounded">
                          ICD-11: BA00
                        </span>
                        <span className="bg-surface-container-highest text-on-surface px-1.5 py-0.5 rounded">
                          SNOMED: 59621000
                        </span>
                        <span className="bg-surface-container text-on-surface px-1.5 py-0.5 rounded">
                          NAMASTE: Uccharaktachapa
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left md:text-right shrink-0">
                    <span className="font-clinical-data-mono text-metadata-micro text-on-surface font-semibold block">
                      Onset: Oct 2021 (5+ Yrs)
                    </span>
                    <span className="font-metadata-micro text-metadata-micro text-outline block">
                      Sync: Max Healthcare Federated Node
                    </span>
                  </div>
                </div>
                <div className="bg-surface-container-lowest p-space-sm rounded-lg flex items-center justify-between text-metadata-micro font-clinical-data shadow-sm border border-outline-variant/30 flex-wrap gap-2">
                  <div className="flex items-center gap-space-md">
                    <span className="text-on-surface-variant">
                      Baseline BP Trend: <strong className="font-clinical-data-mono text-on-surface">144/92 mmHg</strong>
                    </span>
                    <span className="text-outline">·</span>
                    <span className="text-on-surface-variant">
                      Medication: <strong className="text-primary">Telmisartan 40mg OD</strong>
                    </span>
                  </div>
                  <span className="bg-surface-container px-2 py-0.5 rounded font-clinical-data-mono text-[10px] text-on-surface">
                    Contraindicated with Acute Nitro
                  </span>
                </div>
              </div>
            )}

            {/* Problem Card 3: Atherogenic Dyslipidemia */}
            {isVisible("active", "Atherogenic Dyslipidemia Elevated LDL Hypertriglyceridemia E78.5 5C80.4 370992007 Cholesterol") && (
              <div className="p-space-md bg-surface-container-low rounded-xl shadow-sm flex flex-col gap-space-sm hover:shadow transition-shadow border border-outline-variant/20">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-space-sm">
                  <div className="flex items-start gap-space-sm">
                    <div className="mt-1 h-8 w-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
                      <span className="material-symbols-outlined text-lg">vital_signs</span>
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-subheading text-subheading text-on-surface font-semibold">
                          Atherogenic Dyslipidemia (Elevated LDL &amp; Hypertriglyceridemia)
                        </span>
                        <span className="bg-secondary-container text-on-secondary-container font-clinical-data-mono text-metadata-micro px-2 py-0.5 rounded font-semibold">
                          ACTIVE METABOLIC RISK
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-space-xs mt-1 text-metadata-micro font-clinical-data-mono">
                        <span className="bg-surface-container-highest text-on-surface px-1.5 py-0.5 rounded">
                          ICD-10: E78.5
                        </span>
                        <span className="bg-surface-container-highest text-on-surface px-1.5 py-0.5 rounded">
                          ICD-11: 5C80.4
                        </span>
                        <span className="bg-surface-container-highest text-on-surface px-1.5 py-0.5 rounded">
                          SNOMED: 370992007
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left md:text-right shrink-0">
                    <span className="font-clinical-data-mono text-metadata-micro text-on-surface font-semibold block">
                      Onset: July 2026
                    </span>
                    <span className="font-metadata-micro text-metadata-micro text-outline block">
                      Lab EHR Direct Flow
                    </span>
                  </div>
                </div>
                <div className="bg-surface-container-lowest p-space-sm rounded-lg grid grid-cols-2 md:grid-cols-4 gap-space-xs text-metadata-micro font-clinical-data-mono shadow-sm border border-outline-variant/30">
                  <div>
                    <span className="text-outline block text-[10px]">LDL Cholesterol</span>
                    <span className="text-error font-bold">152 mg/dL (High)</span>
                  </div>
                  <div>
                    <span className="text-outline block text-[10px]">Serum Triglycerides</span>
                    <span className="text-error font-bold">190 mg/dL (High)</span>
                  </div>
                  <div>
                    <span className="text-outline block text-[10px]">HDL Cholesterol</span>
                    <span className="text-on-surface font-semibold">38 mg/dL (Low)</span>
                  </div>
                  <div>
                    <span className="text-outline block text-[10px]">Total Chol / HDL</span>
                    <span className="text-on-surface font-semibold">5.2 Ratio</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 3: Resolved & Historical Surgical Conditions */}
          {isVisible("resolved", "Acute Suppurative Appendicitis Post-Appendectomy K35.80 47.09") && (
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-panel-padding flex flex-col gap-space-md border border-outline-variant/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-secondary text-xl">history_edu</span>
                  <div className="flex flex-col">
                    <span className="font-section-title text-section-title text-on-surface">
                      Resolved &amp; Historical Surgical Procedures
                    </span>
                    <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                      Archived Epworth &amp; Operative Records
                    </span>
                  </div>
                </div>
                <span className="bg-surface-container text-on-surface font-clinical-data-mono text-metadata-micro px-2 py-0.5 rounded">
                  1 Archived
                </span>
              </div>
              <div className="p-space-md bg-surface-container-low/60 rounded-xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md opacity-90 hover:opacity-100 transition-opacity border border-outline-variant/20">
                <div className="flex items-start gap-space-sm">
                  <div className="mt-1 h-8 w-8 rounded-lg bg-surface-container flex items-center justify-center text-outline shrink-0">
                    <span className="material-symbols-outlined text-lg">medical_services</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-subheading text-subheading text-on-surface font-semibold">
                        Acute Suppurative Appendicitis (Post-Appendectomy)
                      </span>
                      <span className="bg-surface-container-highest text-on-surface-variant font-clinical-data-mono text-metadata-micro px-2 py-0.5 rounded">
                        RESOLVED · SURGICALLY CURED
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-space-xs mt-1 text-metadata-micro font-clinical-data-mono text-on-surface-variant">
                      <span>ICD-10: K35.80</span>
                      <span>·</span>
                      <span>Procedure: Open Appendectomy (ICD-9-CM 47.09)</span>
                      <span>·</span>
                      <span>Verified via Archived OCR Scan · Oct 2012</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-space-sm shrink-0">
                  <span className="font-clinical-data-mono text-metadata-micro text-outline">St. Stephen&apos;s Hospital</span>
                  <button
                    onClick={() => setShowOcrModal(true)}
                    className="px-2.5 py-1 bg-surface-container hover:bg-surface-container-high rounded text-on-surface font-clinical-data text-metadata-micro flex items-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">attachment</span>
                    View OCR Scan
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN (4/12): Terminology, Differential Engine & Multicoding Inspector */}
        <div className="xl:col-span-4 flex flex-col gap-space-md">
          {/* Inspector Panel: Ontology Concordance Engine */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-panel-padding flex flex-col gap-space-md border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-xl">schema</span>
                <span className="font-section-title text-section-title text-on-surface">Dual-Coding Inspector</span>
              </div>
              <span className="bg-primary-fixed text-on-primary-fixed font-clinical-data-mono text-[10px] px-1.5 py-0.5 rounded font-bold">
                ABHA / WHO SYNCD
              </span>
            </div>
            <p className="font-clinical-data text-clinical-data text-on-surface-variant leading-relaxed">
              Real-time cross-ontology semantic bridging across Indian &amp; International standards:
            </p>

            {/* Dynamic Concept Matrix */}
            <div className="flex flex-col gap-space-xs bg-surface-container-low p-space-sm rounded-xl shadow-sm border border-outline-variant/20">
              <div className="flex items-center justify-between pb-1 text-metadata-micro font-table-header text-outline uppercase tracking-wider">
                <span>Standard</span>
                <span>Concept Code &amp; Term</span>
                <span>Status</span>
              </div>
              <div className="bg-surface-container-lowest p-2 rounded-lg flex items-center justify-between shadow-sm border border-outline-variant/20">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-surface-container font-clinical-data-mono text-[10px] text-on-surface font-bold">
                    ICD-10
                  </span>
                  <span className="font-clinical-data-mono text-clinical-data text-error font-bold">I21.0</span>
                </div>
                <span className="font-clinical-data text-metadata-micro text-on-surface-variant truncate max-w-[140px]">
                  Ant Wall STEMI
                </span>
                <span className="material-symbols-outlined text-primary text-base">check_circle</span>
              </div>
              <div className="bg-surface-container-lowest p-2 rounded-lg flex items-center justify-between shadow-sm border border-outline-variant/20">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-surface-container font-clinical-data-mono text-[10px] text-on-surface font-bold">
                    ICD-11
                  </span>
                  <span className="font-clinical-data-mono text-clinical-data text-primary font-bold">BD10.0</span>
                </div>
                <span className="font-clinical-data text-metadata-micro text-on-surface-variant truncate max-w-[140px]">
                  STEMI Ant Wall
                </span>
                <span className="material-symbols-outlined text-primary text-base">check_circle</span>
              </div>
              <div className="bg-surface-container-lowest p-2 rounded-lg flex items-center justify-between shadow-sm border border-outline-variant/20">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-surface-container font-clinical-data-mono text-[10px] text-on-surface font-bold">
                    SNOMED
                  </span>
                  <span className="font-clinical-data-mono text-clinical-data text-tertiary font-bold">57054005</span>
                </div>
                <span className="font-clinical-data text-metadata-micro text-on-surface-variant truncate max-w-[140px]">
                  Myocardial Infarction
                </span>
                <span className="material-symbols-outlined text-primary text-base">check_circle</span>
              </div>
              <div className="bg-surface-container-lowest p-2 rounded-lg flex items-center justify-between shadow-sm border border-outline-variant/20">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-surface-container font-clinical-data-mono text-[10px] text-on-surface font-bold">
                    AYUSH
                  </span>
                  <span className="font-clinical-data-mono text-clinical-data text-secondary font-bold">ND-CS-04</span>
                </div>
                <span className="font-clinical-data text-metadata-micro text-on-surface-variant truncate max-w-[140px]">
                  Hridshoola Rog
                </span>
                <span className="material-symbols-outlined text-primary text-base">check_circle</span>
              </div>
            </div>

            <button
              onClick={() => setShowDisambigModal(true)}
              className="w-full py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg font-clinical-data text-clinical-data flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-base">find_replace</span>
              Run Full Semantic Disambiguation
            </button>
          </div>

          {/* Differential Diagnostic Ranking Engine */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-panel-padding flex flex-col gap-space-md border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-tertiary text-xl">account_tree</span>
                <span className="font-section-title text-section-title text-on-surface">AI Differential Rule-Outs</span>
              </div>
              <span className="font-clinical-data-mono text-metadata-micro text-outline">Evidence Model v4.1</span>
            </div>
            <div className="flex flex-col gap-space-xs">
              {/* Rule-out 1 */}
              <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-1 shadow-sm border border-outline-variant/20">
                <div className="flex items-center justify-between">
                  <span className="font-clinical-data text-clinical-data font-semibold text-on-surface">
                    Aortic Dissection (Type A)
                  </span>
                  <span className="px-1.5 py-0.5 bg-surface-container-highest text-outline font-clinical-data-mono text-[10px] rounded font-bold">
                    RULED OUT
                  </span>
                </div>
                <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                  Symmetrical radial/femoral pulses. Mediastinal silhouette normal on supine portable radiograph. No tearing interscapular pain.
                </p>
              </div>
              {/* Rule-out 2 */}
              <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-1 shadow-sm border border-outline-variant/20">
                <div className="flex items-center justify-between">
                  <span className="font-clinical-data text-clinical-data font-semibold text-on-surface">
                    Pulmonary Embolism (Massive)
                  </span>
                  <span className="px-1.5 py-0.5 bg-surface-container-highest text-outline font-clinical-data-mono text-[10px] rounded font-bold">
                    RULED OUT
                  </span>
                </div>
                <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                  Absence of S1Q3T3 pattern. D-Dimer negative from pre-admission ED panel. Clear bilateral pulmonary auscultation.
                </p>
              </div>
              {/* Rule-out 3 */}
              <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-1 shadow-sm border border-outline-variant/20">
                <div className="flex items-center justify-between">
                  <span className="font-clinical-data text-clinical-data font-semibold text-on-surface">
                    Acute Pericarditis
                  </span>
                  <span className="px-1.5 py-0.5 bg-surface-container-highest text-outline font-clinical-data-mono text-[10px] rounded font-bold">
                    RULED OUT
                  </span>
                </div>
                <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                  Regional localized ST elevation (V2-V4 only) rather than diffuse concavity. No PR segment depression in limb leads.
                </p>
              </div>
            </div>
            <div className="p-space-sm bg-surface-container rounded-lg flex items-center gap-space-xs text-metadata-micro font-metadata-micro text-on-surface">
              <span className="material-symbols-outlined text-primary text-base">verified</span>
              <span>Verified by Dr. Rohit Verma at 14:08 IST</span>
            </div>
          </div>

          {/* Action Dossier Bar */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-panel-padding flex flex-col gap-space-sm border border-outline-variant/30">
            <span className="font-table-header text-table-header text-outline uppercase tracking-wider">
              Clinical Action &amp; Export
            </span>
            <button
              onClick={() => setShowFhirModal(true)}
              className="w-full h-10 bg-primary text-on-primary font-clinical-data text-clinical-data rounded-lg flex items-center justify-center gap-2 shadow-sm hover:bg-primary-container transition-colors"
            >
              <span className="material-symbols-outlined text-base">save</span>
              Commit to FHIR R4 Condition Bundle
            </button>
            <button
              onClick={() => setShowPrintModal(true)}
              className="w-full h-10 bg-surface-container text-on-surface hover:bg-surface-container-high font-clinical-data text-clinical-data rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-base">print</span>
              Print Longitudinal Problem Dossier
            </button>
            <Link
              href="/consultation-workspace"
              className="w-full h-10 bg-surface-container-low text-on-surface hover:bg-surface-container font-clinical-data text-clinical-data rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-base">edit_note</span>
              Link Problem to New Encounter Note
            </Link>
          </div>
        </div>
      </div>

      {/* MODAL: ADD PROBLEM / DIAGNOSIS */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-outline-variant flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-2xl">add_circle</span>
                <h3 className="font-section-title text-section-title text-on-surface">Add Clinical Problem / Diagnosis</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-3 font-clinical-data text-clinical-data">
              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">Condition / Diagnosis Name</label>
                <input
                  type="text"
                  placeholder="e.g. Chronic Kidney Disease, Stage 2"
                  value={newDiagName}
                  onChange={e => setNewDiagName(e.target.value)}
                  className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-on-surface block mb-1">ICD-10 Code</label>
                  <input
                    type="text"
                    placeholder="e.g. N18.2"
                    value={newDiagIcd10}
                    onChange={e => setNewDiagIcd10(e.target.value)}
                    className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-on-surface block mb-1">Clinical Status</label>
                  <select
                    value={newDiagCategory}
                    onChange={e => setNewDiagCategory(e.target.value as "stat" | "active" | "suboptimal")}
                    className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm"
                  >
                    <option value="active">Active Chronic</option>
                    <option value="suboptimal">Sub-optimally Controlled</option>
                    <option value="stat">STAT Acute</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-surface-container-low rounded-lg text-xs text-on-surface-variant">
                <strong>Auto-Mapping Engine:</strong> Automatic lookups for ICD-11 MMS, SNOMED CT Concept ID, and AYUSH NAMASTE vocabulary will be generated upon save.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container-high">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-clinical-data font-clinical-data text-on-surface-variant hover:bg-surface-container rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  showToast(`Added [${newDiagName || "Chronic Condition"}] to active problem list.`);
                }}
                className="px-5 py-2 text-clinical-data font-clinical-data bg-primary text-on-primary font-semibold rounded-lg hover:bg-primary-container transition-colors shadow-sm"
              >
                Save &amp; Index Condition
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TRIGGER CATH LAB */}
      {showCathModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-error/40 flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-error text-2xl">bolt</span>
                <h3 className="font-section-title text-section-title text-error">Trigger Cath Lab Protocol</h3>
              </div>
              <button onClick={() => setShowCathModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3 font-clinical-data text-clinical-data text-sm">
              <p className="text-on-surface">
                Confirming activation of <strong>Primary PCI Protocol CAT-1</strong> for patient <strong>Rahul Sharma (42M)</strong>.
              </p>
              <div className="p-3 bg-error-container/30 border border-error/30 rounded-lg text-xs space-y-1">
                <div>• Cath Lab 01 reserved &amp; interventional team alerted.</div>
                <div>• Loading doses: Aspirin 325mg + Ticagrelor 180mg confirmed given.</div>
                <div>• Door-to-Balloon elapsed: 38 minutes (Within 90m guideline).</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container-high">
              <button
                onClick={() => setShowCathModal(false)}
                className="px-4 py-2 text-clinical-data font-clinical-data text-on-surface-variant hover:bg-surface-container rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowCathModal(false);
                  showToast("Cath Lab 01 STEMI Protocol Dispatched. Patient transport initiated.");
                }}
                className="px-5 py-2 text-clinical-data font-clinical-data bg-error text-on-error font-semibold rounded-lg hover:bg-error/90 transition-colors shadow-sm flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-base">emergency</span>
                Activate Protocol
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CLINICAL EVIDENCE INSPECTOR */}
      {showEvidenceModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-outline-variant flex flex-col gap-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-2xl">visibility</span>
                <h3 className="font-section-title text-section-title text-on-surface">
                  STAT STEMI Diagnostic Evidence Dossier
                </h3>
              </div>
              <button onClick={() => setShowEvidenceModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4 font-clinical-data text-clinical-data text-xs">
              <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/20">
                <span className="font-bold text-sm text-error block mb-1">Electrocardiographic Criteria</span>
                <p className="text-on-surface-variant leading-relaxed">
                  ST-segment elevation &gt; 2.5 mm in contiguous precordial leads V2-V4. Reciprocal ST depression in inferior leads III &amp; aVF. Concordance score 100% with acute occlusion of the Proximal Left Anterior Descending (LAD) artery.
                </p>
              </div>

              <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/20">
                <span className="font-bold text-sm text-on-surface block mb-1">High-Sensitivity Troponin I Kinetics</span>
                <div className="flex items-center justify-between font-clinical-data-mono text-xs py-1 border-b border-outline-variant/30">
                  <span>Sample 1 (T=0 Arrival):</span>
                  <span className="text-error font-bold">1,480 ng/L (Upper Ref &lt; 14 ng/L)</span>
                </div>
                <div className="flex items-center justify-between font-clinical-data-mono text-xs py-1">
                  <span>Delta Velocity:</span>
                  <span className="text-error font-bold">+1,240 ng/L/hr (Acute Necrosis Pattern)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container-high">
              <button
                onClick={() => setShowEvidenceModal(false)}
                className="px-4 py-2 text-clinical-data font-clinical-data bg-primary text-on-primary rounded-lg font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SEMANTIC DISAMBIGUATION / CROSS-MAPPING */}
      {showDisambigModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-outline-variant flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-2xl">hub</span>
                <h3 className="font-section-title text-section-title text-on-surface">
                  Cross-Ontology Semantic Concordance Matrix
                </h3>
              </div>
              <button onClick={() => setShowDisambigModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3 font-clinical-data text-clinical-data text-xs">
              <p className="text-on-surface-variant">
                Verified terminology relationships between Indian Ayush NAMASTE National Portal and WHO / NLM International Standards:
              </p>

              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-surface-container text-on-surface font-semibold text-left">
                    <th className="p-2 border border-outline-variant">Standard</th>
                    <th className="p-2 border border-outline-variant">System URI</th>
                    <th className="p-2 border border-outline-variant">Code</th>
                    <th className="p-2 border border-outline-variant">Concept Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border border-outline-variant font-bold text-error">ICD-10</td>
                    <td className="p-2 border border-outline-variant font-clinical-data-mono">http://hl7.org/fhir/sid/icd-10</td>
                    <td className="p-2 border border-outline-variant font-clinical-data-mono font-bold">I21.0</td>
                    <td className="p-2 border border-outline-variant">ST elevation (STEMI) myocardial infarction of anterior wall</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-outline-variant font-bold text-primary">ICD-11 MMS</td>
                    <td className="p-2 border border-outline-variant font-clinical-data-mono">http://id.who.int/icd11/mms</td>
                    <td className="p-2 border border-outline-variant font-clinical-data-mono font-bold">BD10.0</td>
                    <td className="p-2 border border-outline-variant">Acute transmural myocardial infarction of anterior wall</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-outline-variant font-bold text-tertiary">SNOMED CT</td>
                    <td className="p-2 border border-outline-variant font-clinical-data-mono">http://snomed.info/sct</td>
                    <td className="p-2 border border-outline-variant font-clinical-data-mono font-bold">57054005</td>
                    <td className="p-2 border border-outline-variant">Acute myocardial infarction of anterior wall</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-outline-variant font-bold text-secondary">AYUSH NAMASTE</td>
                    <td className="p-2 border border-outline-variant font-clinical-data-mono">https://namstp.ayush.gov.in</td>
                    <td className="p-2 border border-outline-variant font-clinical-data-mono font-bold">ND-CS-04</td>
                    <td className="p-2 border border-outline-variant">Hridshoola (Cardiovascular ischemic syndrome)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container-high">
              <button
                onClick={() => setShowDisambigModal(false)}
                className="px-4 py-2 text-clinical-data font-clinical-data bg-primary text-on-primary rounded-lg font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: FHIR R4 CONDITION BUNDLE */}
      {showFhirModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-outline-variant flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-2xl">save</span>
                <h3 className="font-section-title text-section-title text-on-surface">
                  Commit FHIR R4 Condition Bundle
                </h3>
              </div>
              <button onClick={() => setShowFhirModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3 font-clinical-data text-clinical-data text-xs">
              <p className="text-on-surface-variant">
                Committing 4 verified Condition resources into ABDM Health Repository:
              </p>
              <pre className="bg-surface-container p-3 rounded-lg font-clinical-data-mono text-[11px] text-on-surface overflow-x-auto max-h-48">
{`{
  "resourceType": "Bundle",
  "type": "collection",
  "entry": [
    {
      "resource": {
        "resourceType": "Condition",
        "clinicalStatus": "active",
        "verificationStatus": "confirmed",
        "code": {
          "coding": [
            { "system": "http://hl7.org/fhir/sid/icd-10", "code": "I21.0" },
            { "system": "http://snomed.info/sct", "code": "57054005" }
          ]
        },
        "subject": { "reference": "Patient/DEL-2024-8841" }
      }
    }
  ]
}`}
              </pre>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container-high">
              <button
                onClick={() => setShowFhirModal(false)}
                className="px-4 py-2 text-clinical-data font-clinical-data text-on-surface-variant hover:bg-surface-container rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowFhirModal(false);
                  showToast("FHIR R4 Condition Bundle signed and synced with ABDM HIP node.");
                }}
                className="px-5 py-2 text-clinical-data font-clinical-data bg-primary text-on-primary font-semibold rounded-lg"
              >
                Sign &amp; Sync
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PRINT PROBLEM DOSSIER */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-outline-variant flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-2xl">print</span>
                <h3 className="font-section-title text-section-title text-on-surface">
                  Print Longitudinal Problem Dossier
                </h3>
              </div>
              <button onClick={() => setShowPrintModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="border border-outline-variant p-4 rounded-xl space-y-3 text-xs font-clinical-data bg-surface-container-lowest">
              <div className="flex justify-between border-b border-outline-variant/60 pb-2">
                <div>
                  <h4 className="font-bold text-sm text-primary">APOLLO INDRAPRASTHA HOSPITAL</h4>
                  <span className="text-on-surface-variant">Longitudinal Clinical Problem Registry</span>
                </div>
                <div className="text-right">
                  <span className="font-bold">Rahul Sharma (42M)</span>
                  <p className="font-clinical-data-mono text-outline">UHID: DEL-2024-8841</p>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between font-bold text-error">
                  <span>1. Acute Transmural STEMI (Anterior Wall)</span>
                  <span className="font-clinical-data-mono">ICD-10: I21.0</span>
                </div>
                <div className="flex justify-between text-on-surface">
                  <span>2. Type 2 Diabetes Mellitus (HbA1c 7.8%)</span>
                  <span className="font-clinical-data-mono">ICD-10: E11.9</span>
                </div>
                <div className="flex justify-between text-on-surface">
                  <span>3. Essential Hypertension (BP 144/92 baseline)</span>
                  <span className="font-clinical-data-mono">ICD-10: I10</span>
                </div>
                <div className="flex justify-between text-on-surface">
                  <span>4. Atherogenic Dyslipidemia (LDL 152 mg/dL)</span>
                  <span className="font-clinical-data-mono">ICD-10: E78.5</span>
                </div>
                <div className="flex justify-between text-outline italic">
                  <span>5. Appendectomy 2012 (Resolved)</span>
                  <span className="font-clinical-data-mono">ICD-9-CM: 47.09</span>
                </div>
              </div>
              <div className="border-t border-outline-variant/60 pt-2 flex justify-between text-[11px] text-on-surface-variant">
                <span>Attending: Dr. Rohit Verma (Chief of Clinical Services)</span>
                <span>Date: 07 Sep 2026</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container-high">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 text-clinical-data font-clinical-data text-on-surface-variant hover:bg-surface-container rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                  showToast("Dossier sent to local network printer.");
                }}
                className="px-5 py-2 text-clinical-data font-clinical-data bg-primary text-on-primary font-semibold rounded-lg flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-base">print</span>
                Print Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VIEW OCR SCAN */}
      {showOcrModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-outline-variant flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-2xl">document_scanner</span>
                <h3 className="font-section-title text-section-title text-on-surface">
                  Archived OCR Document Scan
                </h3>
              </div>
              <button onClick={() => setShowOcrModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant/30 space-y-2 font-clinical-data text-xs">
              <div className="flex justify-between font-bold text-on-surface">
                <span>St. Stephen&apos;s Hospital · Discharge Summary</span>
                <span className="font-clinical-data-mono">Dated: 18-Oct-2012</span>
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                Patient admitted with right lower quadrant tenderness and rebound tenderness (Alvarado score 8). Emergency gridiron incision open appendectomy performed. Suppurative appendix removed without perforation. Uneventful recovery.
              </p>
              <div className="flex justify-between text-[11px] text-outline pt-2 border-t border-outline-variant/30">
                <span>Surgeon: Dr. M. Joseph</span>
                <span>OCR Confidence: 94.8%</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container-high">
              <button
                onClick={() => setShowOcrModal(false)}
                className="px-4 py-2 text-clinical-data font-clinical-data bg-primary text-on-primary rounded-lg font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADJUST METFORMIN */}
      {showMetforminModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-2xl">medication</span>
                <h3 className="font-section-title text-section-title text-on-surface">
                  Adjust Glycemic Management
                </h3>
              </div>
              <button onClick={() => setShowMetforminModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3 font-clinical-data text-clinical-data text-xs">
              <div className="p-3 bg-error-container/30 border border-error/30 rounded-lg text-error">
                <strong>CRITICAL PRE-PCI SAFETY DIRECTIVE:</strong> Metformin is currently on <strong>STRICT 48-HOUR HOLD</strong> to prevent contrast-induced acute kidney injury and fatal lactic acidosis.
              </div>
              <p className="text-on-surface-variant">
                Patient is transitioned to Sliding Scale Regular Insulin SC PRN for emergency glycemic control (Target: 140-180 mg/dL).
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container-high">
              <button
                onClick={() => setShowMetforminModal(false)}
                className="px-4 py-2 text-clinical-data font-clinical-data text-on-surface-variant hover:bg-surface-container rounded-lg"
              >
                Cancel
              </button>
              <Link
                href="/medication-reconciliation"
                className="px-5 py-2 text-clinical-data font-clinical-data bg-primary text-on-primary font-semibold rounded-lg"
              >
                Go to Med Reconciliation
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
