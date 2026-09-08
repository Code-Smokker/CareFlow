/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import Link from "next/link";

interface DeltaItem {
  id: string;
  category: "vitals" | "biomarkers" | "medications" | "symptoms";
  parameter: string;
  baseline: string;
  current: string;
  delta: string;
  significance: string;
  severity: "critical" | "warning" | "stable" | "info";
  clinicalNote: string;
}

export default function ConsultationFollowupPage() {
  const [activeFilter, setActiveFilter] = useState<
    "all" | "biomarkers" | "medications" | "symptoms" | "vitals"
  >("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isNoteInserted, setIsNoteInserted] = useState(false);
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);

  const deltaItems: DeltaItem[] = [
    // Vitals
    {
      id: "v1",
      category: "vitals",
      parameter: "Blood Pressure (NIBP)",
      baseline: "132/84 mmHg",
      current: "148/92 mmHg",
      delta: "+16 / +8 mmHg",
      significance: "Hypertensive Surge",
      severity: "warning",
      clinicalNote: "Sympathetic hyperstimulation secondary to acute ischemic chest discomfort.",
    },
    {
      id: "v2",
      category: "vitals",
      parameter: "Heart Rate (HR)",
      baseline: "74 bpm (Sinus Rhythm)",
      current: "104 bpm (Sinus Tachycardia)",
      delta: "+30 bpm",
      significance: "Sinus Tachycardia",
      severity: "warning",
      clinicalNote: "Compensatory tachycardia in response to acute myocardial ischemia and stress.",
    },
    {
      id: "v3",
      category: "vitals",
      parameter: "Oxygen Saturation (SpO2)",
      baseline: "98% (Room Air)",
      current: "91% initial → 98% (2L NC)",
      delta: "-7% room air drop",
      significance: "Acute Desaturation",
      severity: "critical",
      clinicalNote: "Mild pulmonary venous congestion / transient ventilation-perfusion mismatch.",
    },
    {
      id: "v4",
      category: "vitals",
      parameter: "Respiratory Rate (RR)",
      baseline: "16 breaths/min",
      current: "24 breaths/min",
      delta: "+8 breaths/min",
      significance: "Tachypnea",
      severity: "warning",
      clinicalNote: "Reflective of dyspnea and sympathetic activation.",
    },

    // Symptoms
    {
      id: "s1",
      category: "symptoms",
      parameter: "Chief Complaint & Chest Pain",
      baseline: "Asymptomatic at rest; mild exertional dyspnea (NYHA I)",
      current: "Acute retrosternal crushing pain, radiation to left jaw/arm (onset 45m)",
      delta: "New Acute Onset",
      significance: "P1 STAT STEMI Red Flag",
      severity: "critical",
      clinicalNote: "Classic ischemic presentation consistent with acute coronary occlusion.",
    },
    {
      id: "s2",
      category: "symptoms",
      parameter: "Autonomic Symptoms",
      baseline: "None reported. No presyncope.",
      current: "Profuse cold diaphoresis, nausea, lightheadedness",
      delta: "Marked Surge",
      significance: "Acute Autonomic Crisis",
      severity: "critical",
      clinicalNote: "Vagotonic and adrenergic storm accompanying acute anterior wall ischemia.",
    },
    {
      id: "s3",
      category: "symptoms",
      parameter: "Functional Tolerance",
      baseline: "Walks 2.5 km daily without angina",
      current: "Bedbound in Bay 02; unable to tolerate flat position",
      delta: "Complete functional arrest",
      significance: "Acute Functional Decline",
      severity: "warning",
      clinicalNote: "Requires emergency hemodynamic stabilization and urgent PCI reperfusion.",
    },

    // Biomarkers
    {
      id: "b1",
      category: "biomarkers",
      parameter: "High-Sensitivity Troponin I (hs-cTnI)",
      baseline: "< 0.01 ng/mL (Normal)",
      current: "1.42 ng/mL (Markedly Elevated)",
      delta: "+1.41 ng/mL",
      significance: "Acute Myocardial Necrosis",
      severity: "critical",
      clinicalNote: ">35x 99th percentile URL. Diagnostic of acute myocardial infarction.",
    },
    {
      id: "b2",
      category: "biomarkers",
      parameter: "Glycated Hemoglobin (HbA1c)",
      baseline: "7.2% (Moderate control)",
      current: "7.8% (Suboptimal control)",
      delta: "+0.6%",
      significance: "Glycemic Deterioration",
      severity: "warning",
      clinicalNote: "Suboptimal glycemic control over past quarter; accelerates macrovascular atheroma.",
    },
    {
      id: "b3",
      category: "biomarkers",
      parameter: "LDL Cholesterol",
      baseline: "138 mg/dL",
      current: "152 mg/dL",
      delta: "+14 mg/dL",
      significance: "Atherogenic Progression",
      severity: "warning",
      clinicalNote: "Significantly above ESC/ACC target (<55 mg/dL for post-MI patients). High-intensity statin mandatory.",
    },

    // Medications
    {
      id: "m1",
      category: "medications",
      parameter: "Metformin 500mg BD",
      baseline: "Active · Oral twice daily with meals",
      current: "Active · Continued (Monitor lactic acidosis in Cath Lab)",
      delta: "Maintained",
      significance: "Continued Therapy",
      severity: "stable",
      clinicalNote: "Hold contrast nephropathy precautions in place; monitor post-procedure eGFR.",
    },
    {
      id: "m2",
      category: "medications",
      parameter: "Telmisartan 40mg OD",
      baseline: "Active · Oral once daily morning",
      current: "HOLD · Temporarily suspended",
      delta: "Suspended",
      significance: "Hypotension Prevention",
      severity: "warning",
      clinicalNote: "Suspended during acute coronary catheterization to preserve renal perfusion pressure.",
    },
    {
      id: "m3",
      category: "medications",
      parameter: "Dual Antiplatelet Loading (DAPT)",
      baseline: "None",
      current: "Aspirin 325mg (chewed) + Ticagrelor 180mg STAT",
      delta: "New STAT Order",
      significance: "Emergent Guideline Loading",
      severity: "critical",
      clinicalNote: "Administered at 14:12 IST in Triage Resuscitation Bay 02.",
    },
    {
      id: "m4",
      category: "medications",
      parameter: "High-Intensity Statin + Anticoagulation",
      baseline: "None",
      current: "Atorvastatin 80mg PO + Heparin 5000 IU IV bolus",
      delta: "New Acute Regimen",
      significance: "Plaque Stabilization & Antithrombotic",
      severity: "critical",
      clinicalNote: "Immediate plaque stabilization and catheter thrombosis prophylaxis.",
    },
  ];

  const filteredItems = deltaItems.filter((item) => {
    if (activeFilter === "all") return true;
    return item.category === activeFilter;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleInsertNote = () => {
    setIsNoteInserted(true);
    showToast("Longitudinal Delta Summary inserted into Consultation SOAP Assessment & Plan!");
  };

  return (
    <div className="flex flex-col w-full gap-space-base pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-inverse-surface text-inverse-on-surface shadow-lg text-clinical-data font-clinical-data border border-outline-variant/30 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="material-symbols-outlined text-primary-fixed text-lg">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Patient Context Banner */}
      <div className="w-full bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="bg-error px-gutter-normal py-2 flex items-center justify-between text-on-error flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg animate-pulse">emergency</span>
            <span className="font-clinical-data font-bold tracking-wide uppercase text-metadata-micro sm:text-clinical-data">
              P1 CRITICAL RED FLAG · Suspected STEMI Protocol Active · Door-to-Balloon &lt; 90m
            </span>
          </div>
          <div className="flex items-center gap-3 text-metadata-micro font-clinical-data-mono font-semibold">
            <span>ER Bay 02 (Resus Monitored)</span>
            <span>•</span>
            <span>Attending: Dr. Rohit Verma</span>
          </div>
        </div>

        <div className="p-space-base flex flex-wrap items-center justify-between gap-space-base">
          <div className="flex items-center gap-space-md flex-wrap">
            <div className="relative">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQ2CABn97HBKDdFtRfc2iOnHBatQO6aDhDjTDorxusjRG4LAvbySya8vddV6NNrWZif77stNYBZOa7FAQUwDPVsEGxmgPnprR4ar-ha9XGTV2CG6p1aVf3_XYTxtyp903Km18bAXkFWrLm9X0x8HCdsTAJpuU9ABRkDr5q955er8LGnY3o_RxW8PEyqCGlsWzBsUIcR8wKSwyjXmBqrENkOXWTpBQBNZhASiFLGX7at0-csPynKpoV"
                alt="Rahul Sharma"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-error"
              />
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-error text-on-error text-[9px] font-bold">
                !
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-section-title text-section-title text-on-surface font-bold">
                  Rahul Sharma
                </h1>
                <span className="font-clinical-data text-on-surface-variant font-medium">(42 M)</span>
                <span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container font-metadata-micro font-semibold">
                  ABHA VERIFIED
                </span>
                <span className="px-2 py-0.5 rounded-full bg-error/15 text-error font-clinical-data-mono text-metadata-micro font-bold">
                  Token #104 · P1 STAT
                </span>
              </div>
              <div className="flex items-center gap-x-space-md gap-y-1 mt-1 text-metadata-micro font-clinical-data-mono text-outline flex-wrap">
                <span>UHID: DEL-2024-8841</span>
                <span>|</span>
                <span>ABHA ID: 91-8842-1920-4491</span>
                <span>|</span>
                <span className="text-error font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">block</span>
                  ALLERGY: Penicillin (Severe Anaphylaxis)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/consultation-workspace"
              className="px-space-md py-1.5 bg-surface-container text-on-surface rounded-lg text-clinical-data font-clinical-data hover:bg-surface-container-high transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span>Back to Consultation</span>
            </Link>
            <Link
              href="/patient-overview"
              className="px-space-md py-1.5 bg-primary/10 text-primary rounded-lg text-clinical-data font-clinical-data hover:bg-primary/20 transition-colors flex items-center gap-1 font-semibold"
            >
              <span className="material-symbols-outlined text-sm">dashboard</span>
              <span>Patient Overview</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Header & Encounter Comparison Selector */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-base border border-outline-variant/30 flex flex-col gap-space-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-base pb-space-sm border-b border-surface-container-high">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">compare_arrows</span>
              <h2 className="font-page-title text-subheading text-on-surface font-semibold">
                Longitudinal Delta Diff · What Changed?
              </h2>
            </div>
            <p className="font-body-default text-clinical-data text-on-surface-variant mt-0.5">
              Comparative encounter diff evaluating disease evolution, hemodynamic deterioration, and therapeutic alterations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleInsertNote}
              disabled={isNoteInserted}
              className={`px-space-md py-2 rounded-lg text-clinical-data font-clinical-data font-semibold flex items-center gap-1.5 shadow-sm transition-all ${
                isNoteInserted
                  ? "bg-primary-container text-on-primary-container opacity-80"
                  : "bg-primary hover:bg-primary-container text-on-primary"
              }`}
            >
              <span className="material-symbols-outlined text-base">
                {isNoteInserted ? "done_all" : "post_add"}
              </span>
              <span>{isNoteInserted ? "Delta Inserted in SOAP" : "+ Insert Delta Summary to Note"}</span>
            </button>
            <button
              onClick={() => setIsSignModalOpen(true)}
              className="px-space-md py-2 bg-secondary hover:bg-secondary/90 text-on-secondary rounded-lg text-clinical-data font-clinical-data font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <span className="material-symbols-outlined text-base">verified</span>
              <span>Acknowledge &amp; Sign</span>
            </button>
          </div>
        </div>

        {/* Encounter Comparison Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md p-space-sm bg-surface-container-low rounded-xl border border-outline-variant/20">
          {/* Baseline Encounter */}
          <div className="flex items-start gap-space-sm p-space-sm bg-surface-container-lowest rounded-lg border border-outline-variant/15">
            <div className="w-8 h-8 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-base">history</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-metadata-micro font-metadata-micro text-outline uppercase font-semibold">
                Baseline Encounter (T-1)
              </span>
              <span className="text-clinical-data font-clinical-data font-bold text-on-surface">
                14-Aug-2025 · Routine OPD Cardiology
              </span>
              <span className="text-metadata-micro font-metadata-micro text-on-surface-variant">
                Consultant: Dr. Rohit Verma · Apollo Central OPD Suite 04
              </span>
            </div>
          </div>

          {/* Current Encounter */}
          <div className="flex items-start gap-space-sm p-space-sm bg-surface-container-lowest rounded-lg border border-error/30 ring-1 ring-error/20">
            <div className="w-8 h-8 rounded-lg bg-error text-on-error flex items-center justify-center shrink-0 animate-pulse">
              <span className="material-symbols-outlined text-base">emergency</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-metadata-micro font-metadata-micro text-error uppercase font-bold flex items-center gap-1">
                <span>Current Acute Encounter (Today)</span>
                <span className="h-1.5 w-1.5 rounded-full bg-error"></span>
              </span>
              <span className="text-clinical-data font-clinical-data font-bold text-on-surface">
                Today 18-Oct-2026 · STAT Emergency STEMI
              </span>
              <span className="text-metadata-micro font-metadata-micro text-on-surface-variant">
                Resuscitation Bay 02 · Lead: Dr. Rohit Verma · Cath Lab Standby
              </span>
            </div>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-metadata-micro font-clinical-data font-semibold transition-colors ${
              activeFilter === "all"
                ? "bg-primary text-on-primary shadow-xs"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            All Changes ({deltaItems.length})
          </button>
          <button
            onClick={() => setActiveFilter("biomarkers")}
            className={`px-3 py-1.5 rounded-lg text-metadata-micro font-clinical-data font-semibold transition-colors flex items-center gap-1 ${
              activeFilter === "biomarkers"
                ? "bg-error text-on-error shadow-xs"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            <span className="material-symbols-outlined text-xs">science</span>
            Critical Biomarkers (3)
          </button>
          <button
            onClick={() => setActiveFilter("medications")}
            className={`px-3 py-1.5 rounded-lg text-metadata-micro font-clinical-data font-semibold transition-colors flex items-center gap-1 ${
              activeFilter === "medications"
                ? "bg-secondary text-on-secondary shadow-xs"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            <span className="material-symbols-outlined text-xs">medication</span>
            Medication Changes (4)
          </button>
          <button
            onClick={() => setActiveFilter("symptoms")}
            className={`px-3 py-1.5 rounded-lg text-metadata-micro font-clinical-data font-semibold transition-colors flex items-center gap-1 ${
              activeFilter === "symptoms"
                ? "bg-primary text-on-primary shadow-xs"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            <span className="material-symbols-outlined text-xs">vital_signs</span>
            Symptom Trajectory (3)
          </button>
          <button
            onClick={() => setActiveFilter("vitals")}
            className={`px-3 py-1.5 rounded-lg text-metadata-micro font-clinical-data font-semibold transition-colors flex items-center gap-1 ${
              activeFilter === "vitals"
                ? "bg-primary text-on-primary shadow-xs"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            <span className="material-symbols-outlined text-xs">monitor_heart</span>
            Vitals Delta (4)
          </button>
        </div>
      </div>

      {/* 3-Column Comparison Table / Grid */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="grid grid-cols-12 bg-surface-container-low px-4 py-3 border-b border-surface-container-high font-table-header text-table-header text-outline uppercase">
          <div className="col-span-12 md:col-span-3">Clinical Parameter / Domain</div>
          <div className="hidden md:block col-span-3">Baseline (14-Aug-2025)</div>
          <div className="hidden md:block col-span-3">Current (18-Oct-2026)</div>
          <div className="hidden md:block col-span-3 text-right">Delta &amp; Clinical Impact</div>
        </div>

        <div className="divide-y divide-surface-container-high">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-12 px-4 py-3.5 hover:bg-surface-container-low/40 transition-colors items-start gap-y-2 md:gap-y-0"
            >
              {/* Col 1: Parameter */}
              <div className="col-span-12 md:col-span-3 flex flex-col pr-2">
                <span className="font-body-strong text-clinical-data text-on-surface font-semibold">
                  {item.parameter}
                </span>
                <span className="font-metadata-micro text-metadata-micro text-outline capitalize mt-0.5">
                  Category: {item.category}
                </span>
              </div>

              {/* Col 2: Baseline */}
              <div className="col-span-6 md:col-span-3 flex flex-col pr-2">
                <span className="md:hidden text-metadata-micro text-outline font-semibold">Baseline:</span>
                <span className="font-clinical-data-mono text-clinical-data text-on-surface-variant">
                  {item.baseline}
                </span>
              </div>

              {/* Col 3: Current */}
              <div className="col-span-6 md:col-span-3 flex flex-col pr-2">
                <span className="md:hidden text-metadata-micro text-outline font-semibold">Current:</span>
                <span
                  className={`font-clinical-data-mono text-clinical-data font-bold ${
                    item.severity === "critical"
                      ? "text-error"
                      : item.severity === "warning"
                      ? "text-amber-800"
                      : "text-on-surface"
                  }`}
                >
                  {item.current}
                </span>
                <p className="font-metadata-micro text-metadata-micro text-on-surface-variant mt-0.5 leading-snug">
                  {item.clinicalNote}
                </p>
              </div>

              {/* Col 4: Delta Tag */}
              <div className="col-span-12 md:col-span-3 flex md:flex-col md:items-end justify-between md:justify-center gap-1">
                <span
                  className={`px-2 py-0.5 rounded font-clinical-data-mono text-metadata-micro font-bold ${
                    item.severity === "critical"
                      ? "bg-error/15 text-error"
                      : item.severity === "warning"
                      ? "bg-amber-100 text-amber-900"
                      : item.severity === "stable"
                      ? "bg-surface-container text-on-surface-variant"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {item.delta}
                </span>
                <span className="text-metadata-micro font-clinical-data font-semibold text-on-surface">
                  {item.significance}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Footer Bar */}
      <div className="flex flex-wrap items-center justify-between p-space-base bg-surface-container-low rounded-xl border border-outline-variant/30 gap-space-sm">
        <div className="flex items-center gap-space-xs text-metadata-micro text-on-surface-variant">
          <span className="material-symbols-outlined text-base text-primary">verified_user</span>
          <span>
            Longitudinal diff computed via CareFlow FHIR R4 Delta Engine v2.4 against Apollo Health Cloud.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast("Exported PDF longitudinal comparison sheet.")}
            className="px-space-md py-1.5 bg-surface-container text-on-surface hover:bg-surface-container-high rounded-lg text-clinical-data font-clinical-data transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">print</span>
            <span>Print Diff</span>
          </button>
          <button
            onClick={handleInsertNote}
            className="px-space-md py-1.5 bg-primary hover:bg-primary-container text-on-primary rounded-lg text-clinical-data font-clinical-data font-semibold transition-colors flex items-center gap-1 shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">post_add</span>
            <span>Insert to SOAP Note</span>
          </button>
        </div>
      </div>

      {/* Modal: Acknowledge & Sign */}
      {isSignModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-md border border-outline-variant/30 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-space-base border-b border-surface-container-high flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-xl">verified</span>
                <h3 className="font-section-title text-section-title text-on-surface font-semibold">
                  Acknowledge Longitudinal Delta
                </h3>
              </div>
              <button
                onClick={() => setIsSignModalOpen(false)}
                className="p-1 rounded-md text-outline hover:text-on-surface hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="p-space-base flex flex-col gap-space-sm text-clinical-data text-on-surface">
              <p className="text-metadata-micro text-on-surface-variant leading-relaxed">
                By acknowledging, you confirm review of the 14 longitudinal parameter shifts between 14-Aug-2025 and 18-Oct-2026. This attestation will be permanently timestamped in the FHIR CarePlan audit trail.
              </p>

              <div className="p-space-sm bg-surface-container-low rounded-lg flex flex-col gap-1 border border-outline-variant/10 font-clinical-data-mono text-metadata-micro">
                <div className="flex justify-between">
                  <span className="text-outline">Clinician:</span>
                  <span className="font-semibold text-on-surface">Dr. Rohit Verma, MD, DM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">DSC Status:</span>
                  <span className="text-primary font-semibold">Class 3 Verified (Token 9942)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Action:</span>
                  <span className="text-error font-semibold">Pre-Cath Lab STEMI Handoff</span>
                </div>
              </div>

              <div className="pt-space-xs flex items-center justify-end gap-space-xs border-t border-surface-container-high">
                <button
                  type="button"
                  onClick={() => setIsSignModalOpen(false)}
                  className="px-space-md py-1.5 rounded-lg text-clinical-data text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSignModalOpen(false);
                    showToast("Longitudinal diff acknowledged and digitally attested by Dr. Rohit Verma.");
                  }}
                  className="px-space-lg py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-clinical-data text-clinical-data font-semibold shadow-sm transition-all"
                >
                  Sign Attestation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
