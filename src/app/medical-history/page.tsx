/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import Link from "next/link";

interface ProblemItem {
  id: string;
  name: string;
  icd: string;
  statusTag: string;
  statusColor: string;
  category: string;
  onset: string;
  duration: string;
  provenanceSource: string;
  provenanceType: "clinician" | "ocr" | "patient";
  verifier: string;
  verHash: string;
  details?: React.ReactNode;
}

export default function MedicalHistoryPage() {
  const [provenanceFilter, setProvenanceFilter] = useState<"all" | "clinician" | "ocr" | "patient">("all");
  const [activeSubTab, setActiveSubTab] = useState<string>("medical-history");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isOverrideOpen, setIsOverrideOpen] = useState<boolean>(false);
  const [isAddProblemOpen, setIsAddProblemOpen] = useState<boolean>(false);
  const [isAddAllergyOpen, setIsAddAllergyOpen] = useState<boolean>(false);
  const [isOcrDocOpen, setIsOcrDocOpen] = useState<boolean>(false);
  const [isFhirModalOpen, setIsFhirModalOpen] = useState<boolean>(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [statinStaged, setStatinStaged] = useState<boolean>(false);
  const [advisoryDismissed, setAdvisoryDismissed] = useState<boolean>(false);
  const [reconciling, setReconciling] = useState<boolean>(false);

  // New problem form state
  const [newProblemName, setNewProblemName] = useState("");
  const [newProblemIcd, setNewProblemIcd] = useState("");
  const [newProblemCategory, setNewProblemCategory] = useState("Endocrine");

  // New allergy form state
  const [newAllergyName, setNewAllergyName] = useState("");
  const [newAllergyType, setNewAllergyType] = useState("Type 1 IgE");
  const [newAllergySeverity, setNewAllergySeverity] = useState("Severe");

  const [problems, setProblems] = useState<ProblemItem[]>([
    {
      id: "t2dm",
      name: "Type 2 Diabetes Mellitus",
      icd: "ICD-10 E11.9",
      statusTag: "Suboptimal Control",
      statusColor: "bg-error-container text-on-error-container",
      category: "Endocrine",
      onset: "March 2019",
      duration: "7+ yrs",
      provenanceSource: "Apollo Central EHR (Node: DEL-APL-01)",
      provenanceType: "clinician",
      verifier: "Dr. A. Kulkarni (Endocrinology)",
      verHash: "Ver. Hash #0912-E11",
      details: (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm p-space-sm rounded-lg bg-surface-container-lowest mt-1 border border-outline-variant/30">
          <div className="flex flex-col">
            <span className="font-metadata-micro text-metadata-micro text-outline">Latest HbA1c</span>
            <span className="font-clinical-data-mono text-clinical-data text-error font-semibold flex items-center gap-1">
              7.8% <span className="material-symbols-outlined text-xs">arrow_upward</span>
            </span>
            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">Target: &lt;6.5%</span>
          </div>
          <div className="flex flex-col">
            <span className="font-metadata-micro text-metadata-micro text-outline">Fasting Plasma Glucose</span>
            <span className="font-clinical-data-mono text-clinical-data text-error font-semibold flex items-center gap-1">
              142 mg/dL <span className="material-symbols-outlined text-xs">arrow_upward</span>
            </span>
            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">Post-prandial: 188</span>
          </div>
          <div className="flex flex-col">
            <span className="font-metadata-micro text-metadata-micro text-outline">Longitudinal Glycemia</span>
            <svg className="w-full h-7 text-primary" fill="none" preserveAspectRatio="none" viewBox="0 0 100 28">
              <path
                d="M0,22 Q25,18 40,24 T75,12 T100,8"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2.5"
              />
              <circle className="fill-error" cx="100" cy="8" r="3" />
            </svg>
            <span className="font-clinical-data-mono text-metadata-micro text-outline">12 mo trajectory (↑)</span>
          </div>
        </div>
      ),
    },
    {
      id: "htn",
      name: "Essential (Primary) Hypertension",
      icd: "ICD-10 I10",
      statusTag: "Therapeutically Controlled",
      statusColor: "bg-primary-fixed text-on-primary-fixed",
      category: "Cardiovascular",
      onset: "October 2021",
      duration: "5+ yrs",
      provenanceSource: "Max Healthcare Node (Ref #MX-89104)",
      provenanceType: "clinician",
      verifier: "Dr. V. Mehra (Cardiovascular)",
      verHash: "FHIR Resource: Condition/8821",
      details: (
        <div className="p-space-sm rounded-lg bg-surface-container-lowest flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mt-1 border border-outline-variant/30">
          <div className="flex items-center gap-space-md">
            <div className="flex flex-col">
              <span className="font-metadata-micro text-metadata-micro text-outline">Current Regimen</span>
              <span className="font-body-strong text-clinical-data text-on-surface">
                Amlodipine 5mg + Telmisartan 40mg PO OD
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-metadata-micro text-metadata-micro text-outline">Mean Sitting BP</span>
              <span className="font-clinical-data-mono text-clinical-data text-primary font-bold">128/82 mmHg</span>
            </div>
          </div>
          <span className="font-clinical-data text-metadata-micro text-outline flex items-center gap-1">
            <span className="material-symbols-outlined text-xs text-primary">check_circle</span> Target Achieved (&lt;130/80)
          </span>
        </div>
      ),
    },
    {
      id: "dyslipidemia",
      name: "Dyslipidemia (Elevated Atherogenic Lipoproteins)",
      icd: "ICD-10 E78.5",
      statusTag: "Active Risk Factor",
      statusColor: "bg-error-container text-on-error-container",
      category: "Metabolic",
      onset: "July 2026",
      duration: "Elevated Non-HDL profile",
      provenanceSource: "Apollo Diagnostic Lab (Ref #LAB-77218-LIPID)",
      provenanceType: "ocr",
      verifier: "Auto-ingested via HL7 v2.5",
      verHash: "Direct Assay",
      details: (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm p-space-sm rounded-lg bg-surface-container-lowest mt-1 border border-outline-variant/30">
          <div className="flex flex-col">
            <span className="font-metadata-micro text-metadata-micro text-outline">Serum Total Chol</span>
            <span className="font-clinical-data-mono text-clinical-data text-on-surface font-semibold">224 mg/dL</span>
          </div>
          <div className="flex flex-col">
            <span className="font-metadata-micro text-metadata-micro text-outline">LDL-C (Direct)</span>
            <span className="font-clinical-data-mono text-clinical-data text-error font-bold flex items-center gap-0.5">
              152 mg/dL <span className="material-symbols-outlined text-xs">arrow_upward</span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-metadata-micro text-metadata-micro text-outline">Triglycerides</span>
            <span className="font-clinical-data-mono text-clinical-data text-error font-semibold">186 mg/dL</span>
          </div>
          <div className="flex flex-col">
            <span className="font-metadata-micro text-metadata-micro text-outline">HDL-C (Protective)</span>
            <span className="font-clinical-data-mono text-clinical-data text-secondary font-semibold">38 mg/dL</span>
          </div>
        </div>
      ),
    },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleAddProblemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProblemName.trim()) return;

    const newProblem: ProblemItem = {
      id: `p-${Date.now()}`,
      name: newProblemName,
      icd: newProblemIcd || "ICD-10 R69",
      statusTag: "Newly Added",
      statusColor: "bg-surface-container text-on-surface font-semibold",
      category: newProblemCategory,
      onset: "Current Encounter",
      duration: "Active",
      provenanceSource: "CareFlow Clinical Terminal · Apollo Indraprastha",
      provenanceType: "clinician",
      verifier: "Dr. Rohit Verma (Chief of Clinical Services)",
      verHash: `Ver. Hash #${Math.floor(1000 + Math.random() * 9000)}`,
      details: (
        <div className="p-space-sm rounded-lg bg-surface-container-lowest mt-1 border border-outline-variant/30 text-clinical-data text-on-surface">
          Clinical problem documented during active encounter. Scheduled for diagnostic staging &amp; treatment review.
        </div>
      ),
    };

    setProblems([newProblem, ...problems]);
    setNewProblemName("");
    setNewProblemIcd("");
    setIsAddProblemOpen(false);
    showToast(`Added clinical problem: "${newProblem.name}" with ICD code ${newProblem.icd}.`);
  };

  const handleAddAllergySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAllergyName.trim()) return;
    setIsAddAllergyOpen(false);
    showToast(`Safety Alert Registered: Allergy to ${newAllergyName} (${newAllergySeverity}) added to hard-stop safety engine.`);
    setNewAllergyName("");
  };

  const handleReconcileExternal = () => {
    setReconciling(true);
    setTimeout(() => {
      setReconciling(false);
      showToast("ABHA Health Information Exchange (HIE): 2 external records reconciled successfully from Max Healthcare & Fortis nodes.");
    }, 1800);
  };

  const filteredProblems = problems.filter((p) => {
    if (provenanceFilter === "all") return true;
    return p.provenanceType === provenanceFilter;
  });

  return (
    <div className="flex flex-col w-full gap-space-md min-h-screen">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-bounce border border-inverse-primary/30 text-clinical-data">
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

      {/* Red Flag Triage & Safety Alert Strip */}
      <div className="w-full bg-error text-on-error rounded-lg px-space-panel-padding py-2 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-xs">
        <div className="flex items-center gap-space-sm min-w-0">
          <div className="p-1 rounded bg-error-container text-on-error-container flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-base">emergency_home</span>
          </div>
          <div className="flex items-center gap-space-xs flex-wrap min-w-0">
            <span className="font-clinical-data-mono text-metadata-micro px-1.5 py-0.5 rounded bg-black/20 tracking-wider uppercase font-bold">
              P1 CRITICAL SAFETY ALERT
            </span>
            <span className="font-body-strong text-body-default truncate">
              Documented IgE-Mediated Anaphylactic Shock: Penicillins (Amoxicillin / Ampicillin Group)
            </span>
            <span className="font-metadata-micro text-metadata-micro text-on-error/80 hidden xl:inline">
              · Emergency Epinephrine Protocol Mandated
            </span>
          </div>
        </div>
        <div className="flex items-center gap-space-xs shrink-0 self-end sm:self-auto">
          <span className="font-clinical-data-mono text-metadata-micro bg-black/25 px-2 py-0.5 rounded">
            Safdarjung ED 2018 Verified
          </span>
          <button
            onClick={() => setIsOverrideOpen(true)}
            className="px-2.5 py-1 rounded bg-surface-container-lowest text-error font-clinical-data text-metadata-micro font-semibold shadow-xs hover:bg-surface-container transition-colors"
          >
            Safety Override Protocol
          </button>
        </div>
      </div>

      {/* Persistent Longitudinal Patient Context Bar */}
      <div className="w-full bg-surface-container-lowest rounded-xl p-space-panel-padding shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-space-base border border-outline-variant/20">
        <div className="flex items-start sm:items-center gap-space-base min-w-0">
          <div className="relative shrink-0">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEodYcQPa5wElv2-_Hwkv4-n-MH1bGUiRa9kBDuiOsyi5c_hteMLS3KeeXohhMSUOHUagLX2mDtBBoJU4I_Tgn4IECfdBybGL9u3QWUuQVOAcIzy0EutDmHDQHDKZvES8Fn2YiJq4qTYqzinGjol8oBrJVj7mrNnUNyCjwqEN1V1WAMG0r7bkciJj-atOrKkjc_oYyLXRbnONtrcmqAwl6fxAyraAGAiZH64-V7cGKakg7QFQWRLOa"
              alt="Clinical portrait of Rahul Sharma"
              className="w-14 h-14 rounded-xl object-cover shadow-sm ring-1 ring-outline-variant/30"
            />
            <span
              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-metadata-micro shadow-xs"
              title="Verified Identity"
            >
              <span className="material-symbols-outlined text-xs">verified</span>
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-space-sm flex-wrap">
              <h1 className="font-page-title text-page-title text-on-surface truncate">Rahul Sharma</h1>
              <span className="font-clinical-data-mono text-clinical-data px-2 py-0.5 rounded bg-surface-container text-secondary font-semibold">
                42 Y · Male
              </span>
              <span className="inline-flex items-center gap-1 font-clinical-data-mono text-metadata-micro px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-semibold">
                <span className="material-symbols-outlined text-xs">fingerprint</span>
                ABHA: 91-8842-1920-4491
              </span>
              <span className="font-clinical-data-mono text-metadata-micro px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">
                UHID: DEL-2024-8841
              </span>
            </div>
            <div className="flex items-center gap-space-md text-on-surface-variant font-clinical-data text-clinical-data mt-1 flex-wrap">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-primary">ward</span> Cardiology OPD Sub-station 07
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-secondary">stethoscope</span> Attending: Dr. R. Verma (Lead Internist)
              </span>
              <span className="flex items-center gap-1 text-error font-medium">
                <span className="material-symbols-outlined text-sm">warning</span> Blood Group: B+ Positive
              </span>
              <span className="font-clinical-data-mono text-metadata-micro px-1.5 py-0.5 rounded bg-error-container text-on-error-container font-semibold">
                FALL RISK: MODERATE
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action Hub */}
        <div className="flex items-center gap-space-xs flex-wrap shrink-0">
          <button
            onClick={() => setIsAddProblemOpen(true)}
            className="h-9 px-3 rounded-lg bg-primary text-on-primary font-clinical-data text-clinical-data font-semibold flex items-center gap-1.5 shadow-sm hover:bg-primary-container hover:text-on-primary-container transition-all"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span>+ Add Clinical Problem</span>
          </button>
          <button
            onClick={handleReconcileExternal}
            disabled={reconciling}
            className="h-9 px-3 rounded-lg bg-surface-container-high text-on-surface font-clinical-data text-clinical-data font-medium flex items-center gap-1.5 hover:bg-surface-variant transition-colors"
          >
            <span className={`material-symbols-outlined text-base text-primary ${reconciling ? "animate-spin" : ""}`}>
              {reconciling ? "sync" : "chevron_forward"}
            </span>
            <span>{reconciling ? "Reconciling Nodes..." : "Reconcile External Records"}</span>
          </button>
          <button
            onClick={() => setIsFhirModalOpen(true)}
            className="h-9 px-3 rounded-lg bg-surface-container-low text-on-surface-variant font-clinical-data text-clinical-data font-medium flex items-center gap-1.5 hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-base text-tertiary">ios_share</span>
            <span>Export FHIR</span>
          </button>
          <button
            onClick={() => setIsAuditModalOpen(true)}
            className="h-9 w-9 rounded-lg bg-surface-container-low text-on-surface-variant flex items-center justify-center hover:bg-surface-container transition-colors"
            title="Audit Trail"
          >
            <span className="material-symbols-outlined text-base">history_toggle_off</span>
          </button>
        </div>
      </div>

      {/* Clinical Sub-Navigation Tabs & Provenance Filter Toolbar */}
      <div className="w-full bg-surface-container-lowest rounded-xl p-space-sm shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-space-sm border border-outline-variant/20">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0">
          <Link
            href="/patient-overview"
            className="px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant font-clinical-data text-clinical-data whitespace-nowrap hover:bg-surface-container hover:text-on-surface transition-colors flex items-center gap-1"
          >
            <span>Chief Complaint &amp; HPI</span>
          </Link>
          <button
            onClick={() => setActiveSubTab("medical-history")}
            className={`px-3 py-1.5 rounded-lg font-clinical-data text-clinical-data font-semibold whitespace-nowrap shadow-xs flex items-center gap-1 transition-all ${
              activeSubTab === "medical-history"
                ? "bg-primary-container text-on-primary-container"
                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <span>Medical History (Active)</span>
            <span className="px-1.5 py-0.2 rounded-full bg-surface-container-lowest text-primary font-clinical-data-mono text-[10px]">
              {problems.length}
            </span>
          </button>
          <button
            onClick={() => {
              setActiveSubTab("surgical");
              document.getElementById("surgical-section")?.scrollIntoView({ behavior: "smooth" });
            }}
            className={`px-3 py-1.5 rounded-lg font-clinical-data text-clinical-data whitespace-nowrap transition-colors ${
              activeSubTab === "surgical"
                ? "bg-primary-container text-on-primary-container font-semibold"
                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            }`}
          >
            Surgical History
          </button>
          <button
            onClick={() => {
              setActiveSubTab("family");
              document.getElementById("family-section")?.scrollIntoView({ behavior: "smooth" });
            }}
            className={`px-3 py-1.5 rounded-lg font-clinical-data text-clinical-data whitespace-nowrap transition-colors ${
              activeSubTab === "family"
                ? "bg-primary-container text-on-primary-container font-semibold"
                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            }`}
          >
            Family Pedigree
          </button>
          <button
            onClick={() => {
              setActiveSubTab("social");
              document.getElementById("social-section")?.scrollIntoView({ behavior: "smooth" });
            }}
            className={`px-3 py-1.5 rounded-lg font-clinical-data text-clinical-data whitespace-nowrap transition-colors ${
              activeSubTab === "social"
                ? "bg-primary-container text-on-primary-container font-semibold"
                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            }`}
          >
            Social &amp; Environmental
          </button>
          <button
            onClick={() => {
              setActiveSubTab("allergies");
              document.getElementById("allergies-section")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-3 py-1.5 rounded-lg bg-error-container text-on-error-container font-clinical-data text-clinical-data font-semibold whitespace-nowrap flex items-center gap-1 hover:brightness-95 transition-all"
          >
            <span>Allergies &amp; Reactions</span>
            <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span>
          </button>
          <button
            onClick={() => {
              showToast("Immunization Registry: Covishield Booster (2022), Hepatitis B (2015), Influenza (2025) Verified.");
            }}
            className="px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant font-clinical-data text-clinical-data whitespace-nowrap hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            Immunizations
          </button>
          <button
            onClick={() => {
              setActiveSubTab("audit");
              document.getElementById("provenance-section")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant font-clinical-data text-clinical-data whitespace-nowrap hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            Audit &amp; Provenance
          </button>
        </div>

        {/* Provenance Trust Filter Toggle Group */}
        <div className="flex items-center gap-1 self-end lg:self-auto bg-surface-container-low p-1 rounded-lg shrink-0">
          <span className="font-metadata-micro text-metadata-micro text-outline px-1 flex items-center gap-0.5 uppercase tracking-wider">
            <span className="material-symbols-outlined text-xs">shield</span> Filter:
          </span>
          <button
            onClick={() => setProvenanceFilter("all")}
            className={`px-2 py-1 rounded font-clinical-data-mono text-metadata-micro transition-all ${
              provenanceFilter === "all"
                ? "bg-surface-container-lowest text-primary font-semibold shadow-xs"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            All ({problems.length + 15})
          </button>
          <button
            onClick={() => setProvenanceFilter("clinician")}
            className={`px-2 py-1 rounded font-clinical-data-mono text-metadata-micro transition-all ${
              provenanceFilter === "clinician"
                ? "bg-surface-container-lowest text-primary font-semibold shadow-xs"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Clinician Verified (14)
          </button>
          <button
            onClick={() => setProvenanceFilter("ocr")}
            className={`px-2 py-1 rounded font-clinical-data-mono text-metadata-micro transition-all ${
              provenanceFilter === "ocr"
                ? "bg-surface-container-lowest text-primary font-semibold shadow-xs"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            AI/OCR (3)
          </button>
          <button
            onClick={() => setProvenanceFilter("patient")}
            className={`px-2 py-1 rounded font-clinical-data-mono text-metadata-micro transition-all ${
              provenanceFilter === "patient"
                ? "bg-surface-container-lowest text-primary font-semibold shadow-xs"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Patient (1)
          </button>
        </div>
      </div>

      {/* Primary Clinical Bento Grid */}
      <div className="grid grid-cols-12 gap-space-md">
        {/* Left Column: Active Diagnoses + Surgical Longitudinal Trail (7 Cols) */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-space-md">
          {/* Section 1: Active Diagnoses & Past Medical History */}
          <div
            id="medical-history-section"
            className="w-full bg-surface-container-lowest rounded-xl p-space-panel-padding shadow-sm flex flex-col gap-space-base border border-outline-variant/20"
          >
            <div className="flex items-center justify-between pb-space-xs">
              <div className="flex items-center gap-space-xs">
                <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-base">clinical_notes</span>
                </div>
                <div>
                  <h2 className="font-section-title text-section-title text-on-surface">
                    Active Diagnoses &amp; Past Medical History
                  </h2>
                  <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    Validated clinical problems with active treatment courses
                  </p>
                </div>
              </div>
              <span className="font-clinical-data-mono text-metadata-micro px-2 py-0.5 rounded bg-surface-container-high text-secondary">
                {filteredProblems.length} Problem{filteredProblems.length === 1 ? "" : "s"} Displayed
              </span>
            </div>

            {filteredProblems.length === 0 ? (
              <div className="p-8 text-center bg-surface-container-low rounded-xl text-on-surface-variant">
                <span className="material-symbols-outlined text-3xl mb-2 text-outline">filter_alt_off</span>
                <p className="font-clinical-data">No clinical problems matching current filter &quot;{provenanceFilter}&quot;.</p>
                <button
                  onClick={() => setProvenanceFilter("all")}
                  className="mt-3 px-3 py-1 bg-primary text-on-primary rounded text-metadata-micro font-semibold"
                >
                  Reset Filter to All
                </button>
              </div>
            ) : (
              filteredProblems.map((prob) => (
                <div
                  key={prob.id}
                  className="p-space-base rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col gap-space-xs relative overflow-hidden border border-outline-variant/20"
                >
                  <div className="flex items-start justify-between gap-space-sm">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-space-xs flex-wrap">
                        <span className="font-body-strong text-body-strong text-on-surface">{prob.name}</span>
                        <span className="font-clinical-data-mono text-metadata-micro px-1.5 py-0.5 rounded bg-primary text-on-primary font-semibold">
                          {prob.icd}
                        </span>
                        <span className={`font-clinical-data text-metadata-micro px-2 py-0.5 rounded font-semibold ${prob.statusColor}`}>
                          {prob.statusTag}
                        </span>
                      </div>
                      <span className="font-clinical-data text-metadata-micro text-on-surface-variant mt-0.5">
                        {prob.category} · Onset {prob.onset} ({prob.duration})
                      </span>
                    </div>
                    <button
                      onClick={() => showToast(`Actions menu for ${prob.name}: Reconciled with ABHA ledger.`)}
                      className="p-1 rounded text-outline hover:text-primary hover:bg-surface-container-lowest transition-colors"
                      title="Problem Options"
                    >
                      <span className="material-symbols-outlined text-base">more_vert</span>
                    </button>
                  </div>

                  {prob.details}

                  {/* Provenance Stamp */}
                  <div className="flex items-center justify-between pt-space-xs text-metadata-micro font-metadata-micro text-on-surface-variant flex-wrap gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`material-symbols-outlined text-sm ${prob.provenanceType === "clinician" ? "text-primary" : prob.provenanceType === "ocr" ? "text-secondary" : "text-outline"}`}>
                        {prob.provenanceType === "clinician" ? "verified_user" : prob.provenanceType === "ocr" ? "biotech" : "person"}
                      </span>
                      <span>
                        Provenance: <strong className="text-on-surface">{prob.provenanceSource}</strong>
                      </span>
                      <span>· Verified by <strong className="text-on-surface">{prob.verifier}</strong></span>
                    </div>
                    <span className="font-clinical-data-mono text-outline">{prob.verHash}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Section 2: Past Surgical History & Procedural Provenance */}
          <div
            id="surgical-section"
            className="w-full bg-surface-container-lowest rounded-xl p-space-panel-padding shadow-sm flex flex-col gap-space-base border border-outline-variant/20"
          >
            <div className="flex items-center justify-between pb-space-xs">
              <div className="flex items-center gap-space-xs">
                <div className="w-8 h-8 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-base">local_hospital</span>
                </div>
                <div>
                  <h2 className="font-section-title text-section-title text-on-surface">Past Surgical History</h2>
                  <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    Major operative procedures, anesthesia logs, and discharge summaries
                  </p>
                </div>
              </div>
              <span className="font-clinical-data-mono text-metadata-micro px-2 py-0.5 rounded bg-surface-container-high text-secondary">
                1 Documented Intervention
              </span>
            </div>

            {/* Surgical Entry Card */}
            <div className="p-space-base rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col gap-space-sm border border-outline-variant/20">
              <div className="flex items-start justify-between gap-space-sm">
                <div className="flex items-center gap-space-sm">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shrink-0 shadow-xs">
                    <span className="material-symbols-outlined text-xl">medical_services</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-space-xs flex-wrap">
                      <span className="font-body-strong text-body-strong text-on-surface">Open Appendectomy</span>
                      <span className="font-clinical-data-mono text-metadata-micro px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-semibold">
                        ICD-9 47.09
                      </span>
                      <span className="font-clinical-data text-metadata-micro px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant">
                        October 2012
                      </span>
                    </div>
                    <span className="font-clinical-data text-metadata-micro text-on-surface-variant mt-0.5">
                      Acute Suppurative Appendicitis with localized peritonitis
                    </span>
                  </div>
                </div>
                <span className="font-clinical-data text-metadata-micro px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-semibold">
                  Uneventful Recovery
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-xs text-clinical-data font-clinical-data p-space-sm rounded-lg bg-surface-container-lowest border border-outline-variant/20">
                <div>
                  <span className="font-metadata-micro text-metadata-micro text-outline block">Operating Facility</span>
                  <span className="text-on-surface font-medium">St. Stephen&apos;s Hospital, Delhi</span>
                </div>
                <div>
                  <span className="font-metadata-micro text-metadata-micro text-outline block">Anesthesia Technique</span>
                  <span className="text-on-surface font-medium">General Endotracheal Anesthesia</span>
                </div>
                <div>
                  <span className="font-metadata-micro text-metadata-micro text-outline block">Complications / Sequelae</span>
                  <span className="text-primary font-semibold">Nil Reported · Primary Intention</span>
                </div>
              </div>

              {/* Document OCR Provenance Pill */}
              <div className="p-space-sm rounded-lg bg-secondary-container/25 flex items-center justify-between flex-wrap gap-space-xs border border-secondary-container/50">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-base text-secondary">document_scanner</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-metadata-micro text-metadata-micro text-on-surface font-semibold">
                      Archived Paper OCR Pipeline
                    </span>
                    <span className="font-clinical-data-mono text-[10px] px-1 rounded bg-secondary-container text-on-secondary-container font-bold">
                      94% Confidence
                    </span>
                    <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                      · Manually Clinician-Validated
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsOcrDocOpen(true)}
                  className="font-clinical-data text-metadata-micro text-tertiary font-semibold hover:underline flex items-center gap-0.5"
                >
                  View Scanned PDF Source <span className="material-symbols-outlined text-xs">open_in_new</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 5: Mandatory Drug Allergies & Adverse Reactions */}
          <div
            id="allergies-section"
            className="w-full bg-surface-container-lowest rounded-xl p-space-panel-padding shadow-sm flex flex-col gap-space-base border border-outline-variant/20"
          >
            <div className="flex items-center justify-between pb-space-xs">
              <div className="flex items-center gap-space-xs">
                <div className="w-8 h-8 rounded-lg bg-error-container text-on-error-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-base">fmd_bad</span>
                </div>
                <div>
                  <h2 className="font-section-title text-section-title text-on-surface">
                    Mandatory Allergies &amp; Adverse Drug Reactions (ADR)
                  </h2>
                  <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    Hard-stop cross-reactive clinical safety registry
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddAllergyOpen(true)}
                className="px-2.5 py-1 rounded bg-error text-on-error font-clinical-data text-metadata-micro font-semibold shadow-xs hover:bg-error-container hover:text-on-error-container transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-xs">add</span> Add Allergy
              </button>
            </div>

            {/* Allergy 1: Penicillin (Severe) */}
            <div className="p-space-base rounded-xl bg-error-container/30 flex flex-col gap-space-xs border border-error/30">
              <div className="flex items-start justify-between gap-space-sm">
                <div className="flex items-center gap-space-sm">
                  <div className="w-9 h-9 rounded-lg bg-error text-on-error flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-lg">dangerous</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-space-xs flex-wrap">
                      <span className="font-body-strong text-body-strong text-error">Penicillins &amp; Beta-Lactam Class</span>
                      <span className="font-clinical-data-mono text-metadata-micro px-2 py-0.5 rounded bg-error text-on-error font-bold">
                        TYPE 1 IgE ANAPHYLAXIS
                      </span>
                      <span className="font-clinical-data text-metadata-micro px-2 py-0.5 rounded bg-surface-container-lowest text-error font-semibold">
                        Contraindication Level: ABSOLUTE
                      </span>
                    </div>
                    <span className="font-clinical-data text-clinical-data text-on-surface mt-0.5">
                      Reaction: Urticaria, laryngeal edema, acute hypotensive bronchospasm within 15 min of IV Ampicillin.
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-space-sm rounded-lg bg-surface-container-lowest flex items-center justify-between text-clinical-data font-clinical-data flex-wrap gap-space-xs mt-1 border border-error/20">
                <div className="flex items-center gap-space-md">
                  <div>
                    <span className="font-metadata-micro text-metadata-micro text-outline block">Event Date</span>
                    <span className="text-on-surface font-semibold">August 2018</span>
                  </div>
                  <div>
                    <span className="font-metadata-micro text-metadata-micro text-outline block">Setting</span>
                    <span className="text-on-surface">Emergency Room, Safdarjung Hospital</span>
                  </div>
                  <div>
                    <span className="font-metadata-micro text-metadata-micro text-outline block">Intervention Required</span>
                    <span className="text-error font-semibold">IM Epinephrine 0.5mg x 2 doses + IV Steroids</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 font-metadata-micro text-metadata-micro text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm text-primary">verified</span>
                  <span>Verified via National EHR Exchange</span>
                </div>
              </div>
            </div>

            {/* Allergy 2: Aspirin (Moderate) */}
            <div className="p-space-base rounded-xl bg-surface-container-low flex flex-col gap-space-xs border border-outline-variant/30">
              <div className="flex items-start justify-between gap-space-sm">
                <div className="flex items-center gap-space-sm">
                  <div className="w-9 h-9 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-lg">warning_amber</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-space-xs flex-wrap">
                      <span className="font-body-strong text-body-strong text-on-surface">
                        Acetylsalicylic Acid (Aspirin / NSAIDs)
                      </span>
                      <span className="font-clinical-data-mono text-metadata-micro px-2 py-0.5 rounded bg-surface-container-high text-secondary font-bold">
                        MODERATE INTOLERANCE
                      </span>
                      <span className="font-clinical-data text-metadata-micro px-2 py-0.5 rounded bg-surface-container-lowest text-on-surface-variant">
                        Caution / Avoid
                      </span>
                    </div>
                    <span className="font-clinical-data text-clinical-data text-on-surface mt-0.5">
                      Reaction: Severe epigastric burning, chemical dyspepsia, erosive gastropathy sensation. No angioedema.
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-space-sm rounded-lg bg-surface-container-lowest flex items-center justify-between text-clinical-data font-clinical-data flex-wrap gap-space-xs mt-1 border border-outline-variant/30">
                <div className="flex items-center gap-space-md">
                  <div>
                    <span className="font-metadata-micro text-metadata-micro text-outline block">Event Date</span>
                    <span className="text-on-surface font-semibold">November 2022</span>
                  </div>
                  <div>
                    <span className="font-metadata-micro text-metadata-micro text-outline block">Alternative Tolerated</span>
                    <span className="text-primary font-medium">Clopidogrel 75mg well tolerated</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 font-metadata-micro text-metadata-micro text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm text-outline">person</span>
                  <span>Patient Self-Reported · Confirmed on Intake</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Family Pedigree + Social/Occupational + Provenance Engine (5 Cols) */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-space-md">
          {/* Section 3: Family Medical History & Genetic Risk Pedigree */}
          <div
            id="family-section"
            className="w-full bg-surface-container-lowest rounded-xl p-space-panel-padding shadow-sm flex flex-col gap-space-base border border-outline-variant/20"
          >
            <div className="flex items-center justify-between pb-space-xs">
              <div className="flex items-center gap-space-xs">
                <div className="w-8 h-8 rounded-lg bg-tertiary-container text-on-tertiary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-base">family_restroom</span>
                </div>
                <div>
                  <h2 className="font-section-title text-section-title text-on-surface">
                    Family Pedigree &amp; Genetic Risk
                  </h2>
                  <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    First-degree cardiovascular &amp; endocrine inheritance
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-error-container text-on-error-container font-clinical-data-mono text-metadata-micro font-bold">
                CAD RISK: HIGH
              </span>
            </div>

            {/* Genetic Alert Visual Banner */}
            <div className="p-space-sm rounded-lg bg-gradient-to-r from-surface-container-high via-surface-container-low to-surface-container-lowest flex items-center gap-space-sm border border-error/20">
              <div className="w-9 h-9 rounded-lg bg-error/10 text-error flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">genetics</span>
              </div>
              <div className="flex flex-col">
                <span className="font-body-strong text-clinical-data text-on-surface">
                  Severe Premature Coronary Artery Disease Clustering
                </span>
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                  Paternal first-degree male sudden cardiac death before age 55 indicates hereditary elevated Lp(a) / familial dyslipidemia phenotype.
                </span>
              </div>
            </div>

            {/* Family Tree Nodes Flow */}
            <div className="flex flex-col gap-space-sm">
              {/* Father Node */}
              <div className="p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors flex items-start justify-between border border-outline-variant/20">
                <div className="flex items-start gap-space-sm">
                  <div className="w-7 h-7 rounded-full bg-error text-on-error flex items-center justify-center font-clinical-data-mono text-metadata-micro font-bold shrink-0">
                    P1
                  </div>
                  <div className="flex flex-col">
                    <span className="font-body-strong text-clinical-data text-on-surface">Father (Deceased)</span>
                    <span className="font-clinical-data text-metadata-micro text-error font-semibold">
                      Fatal Acute Myocardial Infarction at Age 52
                    </span>
                    <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                      History of untreated severe hypertension and heavy smoking.
                    </span>
                  </div>
                </div>
                <span className="font-clinical-data-mono text-metadata-micro px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant shrink-0">
                  1st Degree
                </span>
              </div>

              {/* Mother Node */}
              <div className="p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors flex items-start justify-between border border-outline-variant/20">
                <div className="flex items-start gap-space-sm">
                  <div className="w-7 h-7 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-clinical-data-mono text-metadata-micro font-bold shrink-0">
                    M1
                  </div>
                  <div className="flex flex-col">
                    <span className="font-body-strong text-clinical-data text-on-surface">Mother (Age 68, Alive)</span>
                    <span className="font-clinical-data text-metadata-micro text-on-surface font-medium">
                      Type 2 Diabetes Mellitus (dx age 48) · Primary Hypothyroidism (dx age 54)
                    </span>
                    <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                      Maintained on Metformin 1000mg + Levothyroxine 75mcg OD.
                    </span>
                  </div>
                </div>
                <span className="font-clinical-data-mono text-metadata-micro px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant shrink-0">
                  1st Degree
                </span>
              </div>

              {/* Paternal Uncle Node */}
              <div className="p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors flex items-start justify-between border border-outline-variant/20">
                <div className="flex items-start gap-space-sm">
                  <div className="w-7 h-7 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-clinical-data-mono text-metadata-micro font-bold shrink-0">
                    U1
                  </div>
                  <div className="flex flex-col">
                    <span className="font-body-strong text-clinical-data text-on-surface">Paternal Uncle (Age 64, Alive)</span>
                    <span className="font-clinical-data text-metadata-micro text-secondary font-medium">
                      Coronary Artery Bypass Graft (CABG x 3) at Age 58
                    </span>
                    <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                      Triple vessel coronary occlusive disease, post-angioplasty failure.
                    </span>
                  </div>
                </div>
                <span className="font-clinical-data-mono text-metadata-micro px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant shrink-0">
                  2nd Degree
                </span>
              </div>
            </div>
          </div>

          {/* Section 4: Social, Occupational & Lifestyle Factors */}
          <div
            id="social-section"
            className="w-full bg-surface-container-lowest rounded-xl p-space-panel-padding shadow-sm flex flex-col gap-space-base border border-outline-variant/20"
          >
            <div className="flex items-center justify-between pb-space-xs">
              <div className="flex items-center gap-space-xs">
                <div className="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center">
                  <span className="material-symbols-outlined text-base">psychology</span>
                </div>
                <div>
                  <h2 className="font-section-title text-section-title text-on-surface">
                    Social &amp; Environmental Factors
                  </h2>
                  <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    Behavioral, dietary, and psychosocial health determinants
                  </p>
                </div>
              </div>
            </div>

            {/* Social Factors Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
              {/* Occupation & Stress */}
              <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-1 border border-outline-variant/20">
                <div className="flex items-center gap-1.5 text-secondary">
                  <span className="material-symbols-outlined text-base">work</span>
                  <span className="font-body-strong text-metadata-micro uppercase tracking-wider">
                    Occupation &amp; Workload
                  </span>
                </div>
                <span className="font-body-strong text-clinical-data text-on-surface">Senior Software Architect</span>
                <p className="font-metadata-micro text-metadata-micro text-on-surface-variant leading-relaxed">
                  Sedentary screen desk work &gt;10h/day. Severe occupational mental stress in recent 3 months due to project release cycles.
                </p>
                <span className="font-clinical-data-mono text-metadata-micro text-error font-semibold mt-1">
                  Stress Score: Elevated (8/10)
                </span>
              </div>

              {/* Diet & Nutrition */}
              <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-1 border border-outline-variant/20">
                <div className="flex items-center gap-1.5 text-secondary">
                  <span className="material-symbols-outlined text-base">restaurant</span>
                  <span className="font-body-strong text-metadata-micro uppercase tracking-wider">
                    Nutritional Profile
                  </span>
                </div>
                <span className="font-body-strong text-clinical-data text-on-surface">North Indian Non-Vegetarian</span>
                <p className="font-metadata-micro text-metadata-micro text-on-surface-variant leading-relaxed">
                  High dietary sodium intake, frequent clarified butter (ghee) consumption, irregular meal timings, late dinners (22:30).
                </p>
                <span className="font-clinical-data-mono text-metadata-micro text-secondary font-semibold mt-1">
                  Sodium Index: High &gt;4.2g/day
                </span>
              </div>

              {/* Substances / Alcohol */}
              <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-1 border border-outline-variant/20">
                <div className="flex items-center gap-1.5 text-primary">
                  <span className="material-symbols-outlined text-base">smoke_free</span>
                  <span className="font-body-strong text-metadata-micro uppercase tracking-wider">
                    Substance Exposure
                  </span>
                </div>
                <span className="font-body-strong text-clinical-data text-on-surface">Lifetime Non-Smoker</span>
                <p className="font-metadata-micro text-metadata-micro text-on-surface-variant leading-relaxed">
                  Alcohol: Social infrequent drinker (1-2 standard drinks/month, scotch/wine). Denies tobacco, betel nut, or recreational drug use.
                </p>
              </div>

              {/* Physical Activity */}
              <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-1 border border-outline-variant/20">
                <div className="flex items-center gap-1.5 text-secondary">
                  <span className="material-symbols-outlined text-base">directions_run</span>
                  <span className="font-body-strong text-metadata-micro uppercase tracking-wider">
                    Physical Fitness
                  </span>
                </div>
                <span className="font-body-strong text-clinical-data text-on-surface">Low Baseline Mobility</span>
                <p className="font-metadata-micro text-metadata-micro text-on-surface-variant leading-relaxed">
                  Mean daily step count: 3,400 steps (Smartband sync). No structured aerobic resistance regimen.
                </p>
                <span className="font-clinical-data-mono text-metadata-micro text-error font-semibold mt-1">
                  Metabolic Eq: &lt;1.5 METs
                </span>
              </div>
            </div>
          </div>

          {/* Section 6: Provenance Engine & Audit Snapshot */}
          <div
            id="provenance-section"
            className="w-full bg-surface-container-lowest rounded-xl p-space-panel-padding shadow-sm flex flex-col gap-space-sm border border-outline-variant/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-base">token</span>
                <h3 className="font-body-strong text-clinical-data text-on-surface">Clinical Provenance Ledger</h3>
              </div>
              <span className="font-clinical-data-mono text-metadata-micro text-outline">ABHA Milestones M1/M2/M3</span>
            </div>
            <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-space-xs text-metadata-micro font-metadata-micro border border-outline-variant/20">
              <div className="flex items-center justify-between text-on-surface">
                <span>Aggregated Clinical Entities:</span>
                <span className="font-clinical-data-mono font-semibold">18 Data Nodes</span>
              </div>
              <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden flex">
                <div className="bg-primary h-full" style={{ width: "77%" }} title="Clinician Verified (77%)"></div>
                <div className="bg-secondary h-full" style={{ width: "17%" }} title="OCR Ingested (17%)"></div>
                <div className="bg-tertiary h-full" style={{ width: "6%" }} title="Patient Reported (6%)"></div>
              </div>
              <div className="flex items-center justify-between text-on-surface-variant pt-1">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary inline-block"></span> Clinician (14)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-secondary inline-block"></span> OCR / AI (3)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-tertiary inline-block"></span> Patient (1)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="font-clinical-data text-metadata-micro text-outline">
                Last cryptographically signed: Today 08:44 IST
              </span>
              <button
                onClick={() => setIsAuditModalOpen(true)}
                className="font-clinical-data text-metadata-micro text-primary font-semibold hover:underline flex items-center gap-0.5"
              >
                Full Audit Logs <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Interactive Flowsheet Drawer: Clinical Problem Reconciliation & Notes */}
      {!advisoryDismissed && (
        <div className="w-full bg-surface-container-lowest rounded-xl p-space-panel-padding shadow-sm flex flex-col lg:flex-row items-center justify-between gap-space-base border border-primary/30 bg-gradient-to-r from-surface-container-lowest via-primary-fixed/5 to-surface-container-lowest">
          <div className="flex items-center gap-space-base">
            <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl">smart_toy</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-space-xs">
                <span className="font-body-strong text-body-strong text-on-surface">
                  CareFlow AI Assistant · Cross-Reconciliation Advisory
                </span>
                <span className="font-clinical-data-mono text-metadata-micro px-2 py-0.5 rounded bg-primary text-on-primary font-bold">
                  LIVE SUGGESTION
                </span>
              </div>
              <p className="font-clinical-data text-clinical-data text-on-surface-variant mt-0.5">
                Elevated LDL (152 mg/dL) combined with Strong Paternal Premature CAD History triggers AHA/ACC Class I recommendation for High-Intensity Statin initiation (Atorvastatin 40mg). Current allergy log indicates safe tolerability.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-space-xs shrink-0 w-full lg:w-auto justify-end">
            <button
              onClick={() => {
                setAdvisoryDismissed(true);
                showToast("Advisory dismissed for current encounter.");
              }}
              className="px-3 py-2 rounded-lg bg-surface-container-high text-on-surface font-clinical-data text-clinical-data font-medium hover:bg-surface-variant transition-colors"
            >
              Dismiss Advisory
            </button>
            <button
              onClick={() => {
                setStatinStaged(true);
                showToast("Order Staged: Atorvastatin 40mg PO QHS added to Rx basket pending physician sign-off.");
              }}
              disabled={statinStaged}
              className={`px-4 py-2 rounded-lg font-clinical-data text-clinical-data font-semibold shadow-sm transition-all flex items-center gap-1.5 ${
                statinStaged
                  ? "bg-primary-container text-on-primary-container"
                  : "bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container"
              }`}
            >
              <span className="material-symbols-outlined text-base">
                {statinStaged ? "check_circle" : "receipt_long"}
              </span>
              <span>{statinStaged ? "Statin Order Staged (Rx #9914)" : "Stage Statin Order in Rx Basket"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Safety Override Protocol Dialog */}
      {isOverrideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-surface-container-lowest max-w-lg w-full rounded-2xl p-6 shadow-2xl border border-error flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <div className="flex items-center gap-2 text-error">
                <span className="material-symbols-outlined text-2xl">security</span>
                <h3 className="font-section-title text-section-title font-bold">Clinical Safety Hard-Stop Override</h3>
              </div>
              <button
                onClick={() => setIsOverrideOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="bg-error-container/30 p-3 rounded-lg text-clinical-data text-error font-body-strong flex items-center gap-2">
              <span className="material-symbols-outlined">warning</span>
              Documented IgE Penicillin Anaphylaxis. Overriding this block requires strict dual-authorization.
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-metadata-micro text-outline font-semibold uppercase">Clinical Justification</label>
              <select className="p-2 rounded border border-outline-variant text-clinical-data bg-surface-container-low">
                <option>ICU-monitored rapid desensitization protocol</option>
                <option>False positive history refuted by skin-prick testing</option>
                <option>Extreme emergency with no alternative bactericidal agent</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-metadata-micro text-outline font-semibold uppercase">Physician Credential PIN</label>
              <input
                type="password"
                maxLength={6}
                placeholder="Enter 6-digit PIN"
                className="p-2 rounded border border-outline-variant font-clinical-data-mono text-clinical-data bg-surface-container-low"
              />
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-outline-variant/30">
              <button
                onClick={() => setIsOverrideOpen(false)}
                className="px-4 py-2 rounded bg-surface-container-high text-on-surface text-clinical-data font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsOverrideOpen(false);
                  showToast("Safety override logged with audit hash #OVR-9812-PEN. Pharmacist notified.");
                }}
                className="px-4 py-2 rounded bg-error text-on-error text-clinical-data font-semibold hover:bg-error-container hover:text-on-error-container"
              >
                Authorize Override Protocol
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Clinical Problem Modal */}
      {isAddProblemOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <form
            onSubmit={handleAddProblemSubmit}
            className="bg-surface-container-lowest max-w-lg w-full rounded-2xl p-6 shadow-2xl border border-primary flex flex-col gap-4 animate-in fade-in zoom-in-95"
          >
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-2xl">add_circle</span>
                <h3 className="font-section-title text-section-title font-bold">Add Clinical Problem / Diagnosis</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddProblemOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-metadata-micro text-outline font-semibold uppercase">Diagnosis Name *</label>
              <input
                type="text"
                required
                value={newProblemName}
                onChange={(e) => setNewProblemName(e.target.value)}
                placeholder="e.g., Obstructive Sleep Apnea, Hyperuricemia"
                className="p-2 rounded border border-outline-variant text-clinical-data bg-surface-container-low focus:border-primary focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-metadata-micro text-outline font-semibold uppercase">ICD-10 Code</label>
                <input
                  type="text"
                  value={newProblemIcd}
                  onChange={(e) => setNewProblemIcd(e.target.value)}
                  placeholder="e.g., G47.33, M10.9"
                  className="p-2 rounded border border-outline-variant font-clinical-data-mono text-clinical-data bg-surface-container-low focus:border-primary focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-metadata-micro text-outline font-semibold uppercase">Category</label>
                <select
                  value={newProblemCategory}
                  onChange={(e) => setNewProblemCategory(e.target.value)}
                  className="p-2 rounded border border-outline-variant text-clinical-data bg-surface-container-low focus:border-primary focus:outline-none"
                >
                  <option>Cardiovascular</option>
                  <option>Endocrine</option>
                  <option>Metabolic</option>
                  <option>Respiratory</option>
                  <option>Gastrointestinal</option>
                  <option>Musculoskeletal</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-outline-variant/30">
              <button
                type="button"
                onClick={() => setIsAddProblemOpen(false)}
                className="px-4 py-2 rounded bg-surface-container-high text-on-surface text-clinical-data font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-primary text-on-primary text-clinical-data font-semibold hover:bg-primary-container hover:text-on-primary-container"
              >
                Save Clinical Problem
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Allergy Modal */}
      {isAddAllergyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <form
            onSubmit={handleAddAllergySubmit}
            className="bg-surface-container-lowest max-w-lg w-full rounded-2xl p-6 shadow-2xl border border-error flex flex-col gap-4 animate-in fade-in zoom-in-95"
          >
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <div className="flex items-center gap-2 text-error">
                <span className="material-symbols-outlined text-2xl">fmd_bad</span>
                <h3 className="font-section-title text-section-title font-bold">Register Drug Allergy / Adverse Reaction</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddAllergyOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-metadata-micro text-outline font-semibold uppercase">Substance / Medication *</label>
              <input
                type="text"
                required
                value={newAllergyName}
                onChange={(e) => setNewAllergyName(e.target.value)}
                placeholder="e.g., Ciprofloxacin, Sulfa drugs, Latex"
                className="p-2 rounded border border-outline-variant text-clinical-data bg-surface-container-low focus:border-error focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-metadata-micro text-outline font-semibold uppercase">Reaction Mechanism</label>
                <select
                  value={newAllergyType}
                  onChange={(e) => setNewAllergyType(e.target.value)}
                  className="p-2 rounded border border-outline-variant text-clinical-data bg-surface-container-low"
                >
                  <option>Type 1 IgE (Anaphylaxis)</option>
                  <option>Type 2 Cytotoxic</option>
                  <option>Type 3 Immune Complex</option>
                  <option>Type 4 Cell-Mediated</option>
                  <option>Idiosyncratic Intolerance</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-metadata-micro text-outline font-semibold uppercase">Severity</label>
                <select
                  value={newAllergySeverity}
                  onChange={(e) => setNewAllergySeverity(e.target.value)}
                  className="p-2 rounded border border-outline-variant text-clinical-data bg-surface-container-low"
                >
                  <option>Severe (Hard-Stop Block)</option>
                  <option>Moderate (Warning / Caution)</option>
                  <option>Mild</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-outline-variant/30">
              <button
                type="button"
                onClick={() => setIsAddAllergyOpen(false)}
                className="px-4 py-2 rounded bg-surface-container-high text-on-surface text-clinical-data font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-error text-on-error text-clinical-data font-semibold hover:bg-error-container hover:text-on-error-container"
              >
                Register Safety Alert
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Scanned Document OCR Modal */}
      {isOcrDocOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-surface-container-lowest max-w-2xl w-full rounded-2xl p-6 shadow-2xl border border-secondary flex flex-col gap-4 animate-in fade-in zoom-in-95 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <div className="flex items-center gap-2 text-secondary">
                <span className="material-symbols-outlined text-2xl">document_scanner</span>
                <div>
                  <h3 className="font-section-title text-section-title font-bold">Archived Paper OCR Pipeline</h3>
                  <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    St. Stephen&apos;s Hospital · Operative Summary 2012 (Doc Ref #SSH-SURG-12-8801)
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOcrDocOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="bg-secondary-container/20 p-3 rounded-lg flex items-center justify-between text-clinical-data font-clinical-data">
              <span className="text-secondary font-semibold">OCR Confidence: 94.2%</span>
              <span className="text-on-surface-variant text-metadata-micro">Ingested: 14-Oct-2024 via ABHA OCR Core</span>
            </div>
            <div className="p-4 rounded-lg bg-surface-container-low font-clinical-data-mono text-clinical-data leading-relaxed text-on-surface border border-outline-variant/30 whitespace-pre-wrap">
{`PATIENT: Rahul Sharma | AGE: 30 Y | SEX: Male
FACILITY: St. Stephen's Hospital, Tis Hazari, Delhi
PROCEDURE: Open Appendectomy (Gridiron incision)
FINDINGS: Suppurative acute appendicitis with serosal hyperemia and fibrinous exudate. No free perforation.
ANESTHESIA: General Endotracheal Anesthesia. Hemodynamics stable throughout.
POST-OP COURSE: Uneventful recovery. Drain removed Post-Op Day 2. Afebrile at discharge. Sutures removed Day 8.`}
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsOcrDocOpen(false)}
                className="px-4 py-2 rounded bg-primary text-on-primary text-clinical-data font-semibold"
              >
                Close Document Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FHIR Export Modal */}
      {isFhirModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-surface-container-lowest max-w-2xl w-full rounded-2xl p-6 shadow-2xl border border-tertiary flex flex-col gap-4 animate-in fade-in zoom-in-95 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <div className="flex items-center gap-2 text-tertiary">
                <span className="material-symbols-outlined text-2xl">terminal</span>
                <h3 className="font-section-title text-section-title font-bold">FHIR R4 Bundle Export (Condition &amp; AllergyIntolerance)</h3>
              </div>
              <button
                onClick={() => setIsFhirModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <pre className="p-4 rounded-lg bg-inverse-surface text-inverse-on-surface font-clinical-data-mono text-metadata-micro leading-relaxed overflow-x-auto max-h-80">
{`{
  "resourceType": "Bundle",
  "type": "collection",
  "timestamp": "${new Date().toISOString()}",
  "entry": [
    {
      "resource": {
        "resourceType": "Condition",
        "id": "del-t2dm-8821",
        "clinicalStatus": { "coding": [{ "code": "active" }] },
        "code": {
          "coding": [{ "system": "http://hl7.org/fhir/sid/icd-10", "code": "E11.9", "display": "Type 2 diabetes mellitus" }]
        },
        "subject": { "reference": "Patient/DEL-2024-8841", "display": "Rahul Sharma" }
      }
    },
    {
      "resource": {
        "resourceType": "AllergyIntolerance",
        "id": "del-pen-0912",
        "clinicalStatus": { "coding": [{ "code": "active" }] },
        "criticality": "high",
        "category": ["medication"],
        "code": { "coding": [{ "display": "Penicillins & Beta-Lactam Class" }] }
      }
    }
  ]
}`}
            </pre>
            <div className="flex justify-between items-center pt-2">
              <span className="font-metadata-micro text-metadata-micro text-outline">ABHA M3 Compliant Schema</span>
              <button
                onClick={() => {
                  setIsFhirModalOpen(false);
                  showToast("FHIR R4 JSON Bundle copied to clipboard and downloaded.");
                }}
                className="px-4 py-2 rounded bg-tertiary text-on-tertiary text-clinical-data font-semibold flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">download</span>
                Download JSON Bundle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audit Logs Modal */}
      {isAuditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-surface-container-lowest max-w-xl w-full rounded-2xl p-6 shadow-2xl border border-outline flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <div className="flex items-center gap-2 text-on-surface">
                <span className="material-symbols-outlined text-2xl text-primary">history</span>
                <h3 className="font-section-title text-section-title font-bold">Clinical Audit &amp; Provenance Ledger</h3>
              </div>
              <button
                onClick={() => setIsAuditModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-2 font-clinical-data text-clinical-data max-h-72 overflow-y-auto pr-1">
              <div className="p-3 bg-surface-container-low rounded-lg flex flex-col gap-1 border border-outline-variant/30">
                <div className="flex items-center justify-between">
                  <span className="font-body-strong text-primary">Cryptographic Signature Validated</span>
                  <span className="font-clinical-data-mono text-metadata-micro text-outline">Today 08:44 IST</span>
                </div>
                <span className="text-metadata-micro text-on-surface-variant">
                  Signed by Dr. Rohit Verma (UID: DOC-DEL-0412) via Apollo Hospital Central Root CA.
                </span>
              </div>
              <div className="p-3 bg-surface-container-low rounded-lg flex flex-col gap-1 border border-outline-variant/30">
                <div className="flex items-center justify-between">
                  <span className="font-body-strong text-secondary">HL7 Ingestion: Lipid Panel</span>
                  <span className="font-clinical-data-mono text-metadata-micro text-outline">Yesterday 16:30 IST</span>
                </div>
                <span className="text-metadata-micro text-on-surface-variant">
                  Lab Node Apollo Diagnostics Delhi (Ref #LAB-77218-LIPID). Auto-mapped to ICD-10 E78.5.
                </span>
              </div>
              <div className="p-3 bg-surface-container-low rounded-lg flex flex-col gap-1 border border-outline-variant/30">
                <div className="flex items-center justify-between">
                  <span className="font-body-strong text-outline">ABHA Consent Granted</span>
                  <span className="font-clinical-data-mono text-metadata-micro text-outline">05-Sep-2026 11:20 IST</span>
                </div>
                <span className="text-metadata-micro text-on-surface-variant">
                  Consent Artifact #CA-918842-DEL granted for 12 months data exchange across Ayushman Bharat Network.
                </span>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsAuditModalOpen(false)}
                className="px-4 py-2 rounded bg-surface-container-high text-on-surface text-clinical-data font-medium"
              >
                Close Audit Logs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
