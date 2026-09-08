"use client";

import React, { useState } from "react";
import Link from "next/link";

interface DrugCandidate {
  id: string;
  name: string;
  label: string;
  badge: string;
  badgeType: "recommended" | "moderate" | "warning";
  description: string;
  matchScore: string;
  probLabel: string;
  drugName: string;
  strength: string;
  dosage: string;
  frequency: string;
  route: string;
}

const DRUG_CANDIDATES: Record<string, DrugCandidate> = {
  telmisartan: {
    id: "telmisartan",
    name: "Candidate A: Telmisartan 40mg",
    label: "Telmisartan 40mg",
    badge: "Recommended",
    badgeType: "recommended",
    description: "Oral · Once Daily · Anti-hypertensive ARB · Matches prior OPD record from 2025",
    matchScore: "84% Match",
    probLabel: "High Bio-Prob",
    drugName: "Telmisartan",
    strength: "40mg",
    dosage: "1 Tablet",
    frequency: "Once Daily (OD)",
    route: "Oral",
  },
  "telpres-ct": {
    id: "telpres-ct",
    name: "Candidate B: Telpres-CT 40/12.5mg (Chlorthalidone Combo)",
    label: "Telpres-CT 40/12.5mg",
    badge: "Moderate",
    badgeType: "moderate",
    description: "Oral · Once Daily · Suffix “CT” not detected in handwriting",
    matchScore: "56% Match",
    probLabel: "Moderate",
    drugName: "Telpres-CT",
    strength: "40/12.5mg",
    dosage: "1 Tablet",
    frequency: "Once Daily (OD)",
    route: "Oral",
  },
  tolbutamide: {
    id: "tolbutamide",
    name: "Candidate C: Tolbutamide 500mg",
    label: "Tolbutamide 500mg",
    badge: "Safety Override Warning",
    badgeType: "warning",
    description: "Sulfonylurea · Dose mismatch (40mg vs 500mg) · High hypoglycemia risk",
    matchScore: "14% Match",
    probLabel: "Flagged",
    drugName: "Tolbutamide",
    strength: "500mg",
    dosage: "1 Tablet",
    frequency: "Twice Daily (BD)",
    route: "Oral",
  },
};

export default function DocumentTrayPage() {
  // Zoom & Canvas states
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [overlaysActive, setOverlaysActive] = useState<boolean>(true);
  const [rotation, setRotation] = useState<number>(0);

  // Cross-pane entity hover/selection sync
  const [activeEntityId, setActiveEntityId] = useState<string | null>("card-entity-2");

  // Candidate selection & editing
  const [selectedCandidateKey, setSelectedCandidateKey] = useState<string>("telmisartan");
  const [isTelmisartanConfirmed, setIsTelmisartanConfirmed] = useState<boolean>(false);
  const [formParams, setFormParams] = useState({
    drugName: "Telmisartan",
    strength: "40mg",
    dosage: "1 Tablet",
    frequency: "Once Daily (OD)",
    route: "Oral",
  });

  // Workflow states
  const [isCommitted, setIsCommitted] = useState<boolean>(false);
  const [isCommitting, setIsCommitting] = useState<boolean>(false);
  const [highConfidenceAccepted, setHighConfidenceAccepted] = useState<boolean>(false);
  const [toast, setToast] = useState<{ title: string; message: string; icon: string } | null>(null);

  const showToast = (title: string, message: string, icon: string = "info") => {
    setToast({ title, message, icon });
    setTimeout(() => {
      setToast(null);
    }, 3600);
  };

  const handleZoomIn = () => {
    if (zoomLevel < 160) setZoomLevel((prev) => prev + 15);
  };

  const handleZoomOut = () => {
    if (zoomLevel > 70) setZoomLevel((prev) => prev - 15);
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
    setRotation(0);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleCandidateChange = (key: string) => {
    setSelectedCandidateKey(key);
    const candidate = DRUG_CANDIDATES[key];
    if (candidate) {
      setFormParams({
        drugName: candidate.drugName,
        strength: candidate.strength,
        dosage: candidate.dosage,
        frequency: candidate.frequency,
        route: candidate.route,
      });
      showToast("Candidate Selected", `${candidate.label} mapped to form parameters.`, "swap_horiz");
    }
  };

  const handleConfirmCandidate = () => {
    setIsTelmisartanConfirmed(true);
    showToast(
      "Entity Confirmed",
      `${formParams.drugName} ${formParams.strength} ${formParams.frequency} verified by clinician.`,
      "check_circle"
    );
  };

  const handleAcceptHighConfidence = () => {
    setHighConfidenceAccepted(true);
    showToast("High Confidence Entities Accepted", "Entities #1 (Amlodipine), #3 (Metformin), and #4 (Vitals) approved.", "done_all");
  };

  const handleCommitEHR = () => {
    setIsCommitting(true);
    showToast("Transmitting to FHIR Server", "Validating MedicationRequest and Observation bundle against HAPI-FHIR R4...", "sync");
    setTimeout(() => {
      setIsCommitting(false);
      setIsCommitted(true);
      showToast("EHR Updated", "4 extracted clinical resources locked to Rahul Sharma's chart.", "verified");
    }, 900);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Sibling Sub-Navigation Strip */}
      <div className="flex items-center justify-between bg-surface-container-lowest border border-outline-variant/60 rounded-xl px-space-base py-2 mb-space-sm shadow-xs">
        <div className="flex items-center gap-space-xs overflow-x-auto text-clinical-data">
          <span className="font-metadata-micro text-outline uppercase font-semibold mr-1">Workspace Modes:</span>
          <Link
            href="/patient-overview"
            className="px-2.5 py-1 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface font-medium transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">person_search</span>
            Patient Overview
          </Link>
          <Link
            href="/clinical-timeline"
            className="px-2.5 py-1 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface font-medium transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">timeline</span>
            Clinical Timeline
          </Link>
          <Link
            href="/consultation-workspace"
            className="px-2.5 py-1 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface font-medium transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">smart_toy</span>
            Consultation Workspace
          </Link>
          <span className="px-2.5 py-1 rounded-lg bg-primary-container text-on-primary-container font-semibold flex items-center gap-1 shadow-2xs">
            <span className="material-symbols-outlined text-sm">document_scanner</span>
            Document Tray &amp; OCR
          </span>
        </div>
        <div className="hidden md:flex items-center gap-space-xs font-clinical-data-mono text-metadata-micro text-outline">
          <span className="h-2 w-2 rounded-full bg-primary inline-block"></span>
          <span>Optical Engine: <strong>MedOCR v3.1</strong></span>
        </div>
      </div>

      {/* Persistent Clinical Top Context Banner */}
      <div className="w-full bg-surface-container-lowest shadow-sm rounded-xl p-panel-padding mb-space-md">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-space-md">
          {/* Left Metadata Cluster */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-space-lg">
            <div className="flex items-center gap-space-sm">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-xl">document_scanner</span>
              </div>
              <div>
                <div className="flex items-center gap-space-xs">
                  <span className="font-page-title text-subheading text-on-surface">
                    Handwritten Clinical Prescription &amp; Follow-up Note
                  </span>
                  <span className="bg-surface-container-high text-on-surface-variant font-metadata-micro text-metadata-micro px-space-xs py-0.5 rounded">
                    PDF · 300 DPI
                  </span>
                </div>
                <div className="flex items-center gap-space-xs mt-0.5 text-metadata-micro font-metadata-micro text-on-surface-variant">
                  <span className="font-body-strong text-primary">Rahul Sharma</span>
                  <span>· 42M</span>
                  <span className="font-clinical-data-mono px-1 py-0.5 bg-surface-container rounded text-on-surface">
                    UHID: DEL-2024-8841
                  </span>
                  <span className="font-clinical-data-mono text-secondary font-semibold">Token #104</span>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-space-sm pl-space-md border-l border-surface-variant/40">
              <div className="flex flex-col">
                <span className="font-metadata-micro text-metadata-micro text-outline uppercase tracking-wider">
                  Provenance Source
                </span>
                <span className="font-clinical-data text-metadata-micro text-on-surface">
                  Apollo Clinic Saket · Aug 12, 2026
                </span>
              </div>
              <div className="flex flex-col pl-space-sm">
                <span className="font-metadata-micro text-metadata-micro text-outline uppercase tracking-wider">
                  Engine Pipeline
                </span>
                <span className="font-clinical-data text-metadata-micro text-primary flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary"></span>
                  MedOCR v3.1 (Handwriting-BioBERT)
                </span>
              </div>
            </div>
          </div>

          {/* Right Global Actions */}
          <div className="flex items-center flex-wrap gap-space-xs shrink-0">
            <button
              onClick={() => showToast("Re-scanning document...", "Running optical pass at 600 DPI...", "rotate_left")}
              className="h-9 px-space-sm bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg font-clinical-data text-clinical-data flex items-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-sm text-outline">rotate_left</span>
              <span>Re-scan</span>
            </button>
            <button
              onClick={() => showToast("Document Rejected", "Prescription marked as corrupt / illegible for manual review.", "block")}
              className="h-9 px-space-sm bg-error-container hover:bg-error-container/80 text-on-error-container rounded-lg font-clinical-data text-clinical-data flex items-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">block</span>
              <span>Reject Doc</span>
            </button>
            <button
              onClick={handleAcceptHighConfidence}
              className={`h-9 px-space-sm rounded-lg font-clinical-data text-clinical-data flex items-center gap-1 transition-colors ${
                highConfidenceAccepted
                  ? "bg-primary-container text-on-primary-container font-semibold"
                  : "bg-surface-container-high hover:bg-surface-variant text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-sm text-primary">done_all</span>
              <span>{highConfidenceAccepted ? "High-Conf Accepted (3)" : "Accept High-Confidence (3)"}</span>
            </button>
            <button
              onClick={handleCommitEHR}
              disabled={isCommitting}
              className={`h-9 px-space-md rounded-lg font-body-strong text-clinical-data flex items-center gap-1.5 shadow-sm transition-all ${
                isCommitted
                  ? "bg-surface-container-highest text-primary"
                  : "bg-primary hover:bg-primary-container text-on-primary"
              }`}
            >
              <span className="material-symbols-outlined text-sm">
                {isCommitted ? "verified" : isCommitting ? "sync" : "add_task"}
              </span>
              <span>{isCommitted ? "Committed to Patient Chart" : "Commit Extracted Data"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dual-Pane Workspace */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-space-md items-start">
        {/* LEFT PANE: Document Viewer Canvas (6 cols) */}
        <div className="lg:col-span-6 flex flex-col bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden sticky top-16">
          {/* Canvas Control Toolbar */}
          <div className="flex items-center justify-between px-space-panel-padding py-space-xs bg-surface-container-low flex-wrap gap-2">
            <div className="flex items-center gap-space-xs">
              <span className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase font-semibold">
                Optical Resolution: 2400 × 3300 px
              </span>
              <span className="px-1.5 py-0.5 bg-surface-container rounded font-clinical-data-mono text-metadata-micro text-primary">
                Page 1 / 1
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleZoomOut}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-surface-container text-on-surface-variant transition-colors"
                title="Zoom Out"
              >
                <span className="material-symbols-outlined text-base">zoom_out</span>
              </button>
              <span className="font-clinical-data-mono text-metadata-micro text-on-surface px-1">
                {zoomLevel}%
              </span>
              <button
                onClick={handleZoomIn}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-surface-container text-on-surface-variant transition-colors"
                title="Zoom In"
              >
                <span className="material-symbols-outlined text-base">zoom_in</span>
              </button>
              <div className="w-px h-4 bg-surface-variant mx-1"></div>
              <button
                onClick={handleResetZoom}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-surface-container text-on-surface-variant transition-colors"
                title="Fit to Pane"
              >
                <span className="material-symbols-outlined text-base">fit_screen</span>
              </button>
              <button
                onClick={handleRotate}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-surface-container text-on-surface-variant transition-colors"
                title="Rotate 90deg"
              >
                <span className="material-symbols-outlined text-base">rotate_right</span>
              </button>
              <div className="w-px h-4 bg-surface-variant mx-1"></div>
              <button
                onClick={() => setOverlaysActive(!overlaysActive)}
                className={`px-2 py-1 flex items-center gap-1 rounded font-metadata-micro text-metadata-micro transition-colors ${
                  overlaysActive
                    ? "bg-primary-container text-on-primary-container font-semibold"
                    : "bg-surface-container text-on-surface-variant"
                }`}
              >
                <span className="material-symbols-outlined text-xs">
                  {overlaysActive ? "layers" : "layers_clear"}
                </span>
                <span>{overlaysActive ? "Overlay On" : "Overlay Off"}</span>
              </button>
            </div>
          </div>

          {/* Scanned Prescription Realistic Artboard */}
          <div className="relative w-full overflow-auto bg-surface-dim/40 p-space-md flex justify-center max-h-[760px] select-none">
            {/* Document Sheet Simulation */}
            <div
              className="relative w-full max-w-[580px] bg-[#FEFEFD] shadow-md rounded-sm p-8 text-[#1E293B] overflow-hidden transition-transform duration-200"
              style={{
                transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                transformOrigin: "top center",
              }}
            >
              {/* Background Paper Texture Effect */}
              <svg className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <filter id="noiseFilter">
                  <feTurbulence baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" type="fractalNoise" />
                </filter>
                <rect filter="url(#noiseFilter)" height="100%" width="100%" />
              </svg>

              {/* Medical Header Letterhead */}
              <div className="flex items-start justify-between pb-4 border-b border-[#CBD5E1]">
                <div>
                  <div className="text-[17px] font-bold text-[#0F172A] leading-tight">Dr. Sameer Kulkarni</div>
                  <div className="text-[11px] text-[#475569] font-medium leading-tight">
                    MD (Medicine), DM (Cardiology) · AIIMS New Delhi
                  </div>
                  <div className="text-[10px] text-[#64748B] mt-0.5">
                    Regd. No: DMC-44812 / 2008 · Fellow ESC
                  </div>
                  <div className="text-[10px] text-[#64748B]">
                    Apollo Indraprastha Specialty Clinics, South Delhi
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-bold text-primary">APOLLO CLINICAL NETWORK</div>
                  <div className="text-[10px] text-[#64748B]">Tel: +91 11 4052 8800</div>
                  <div className="text-[10px] text-[#64748B] font-mono">Date: 12-08-2026</div>
                  <div className="text-[10px] text-error font-semibold mt-1">EMERGENCY OPD CLINIC</div>
                </div>
              </div>

              {/* Patient Identity Details Row */}
              <div className="grid grid-cols-4 gap-2 py-3 text-[11px] border-b border-[#E2E8F0] text-[#334155] font-sans">
                <div>
                  <span className="text-[#64748B]">Pt Name:</span>{" "}
                  <span className="font-semibold text-[#0F172A]">Rahul Sharma</span>
                </div>
                <div>
                  <span className="text-[#64748B]">Age/Sex:</span>{" "}
                  <span className="font-semibold text-[#0F172A]">42 Y / Male</span>
                </div>
                <div>
                  <span className="text-[#64748B]">UHID:</span>{" "}
                  <span className="font-mono text-[#0F172A]">DEL-8841</span>
                </div>
                <div>
                  <span className="text-[#64748B]">Token:</span>{" "}
                  <span className="font-bold text-primary">104</span>
                </div>
              </div>

              {/* Clinical Vitals / Observation Note */}
              <div className="relative mt-4 mb-3">
                <div className="text-[11px] uppercase tracking-wider font-bold text-[#475569]">
                  Vitals &amp; Clinical Notes:
                </div>
                <div className="text-[12px] text-[#1E293B] font-mono mt-1 flex items-center gap-4">
                  <span>PR: 78 bpm regular</span>
                  <span>SpO2: 98% (RA)</span>
                </div>

                {/* Bounding Box 4 (Vitals) */}
                <div
                  onMouseEnter={() => setActiveEntityId("card-entity-4")}
                  onClick={() => setActiveEntityId("card-entity-4")}
                  className={`relative group mt-2 p-1.5 rounded cursor-pointer transition-all ${
                    overlaysActive
                      ? activeEntityId === "card-entity-4"
                        ? "bg-tertiary-fixed/60 ring-2 ring-tertiary shadow-md scale-[1.01]"
                        : "bg-tertiary-fixed/30 ring-2 ring-tertiary hover:bg-tertiary-fixed/50"
                      : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-mono text-[#0F172A] font-semibold">
                      BP: 142/88 mmHg, Wt: 82 kg
                    </span>
                    {overlaysActive && (
                      <span className="bg-tertiary text-on-tertiary text-[9px] font-mono px-1 rounded">
                        Entity #4 · 99%
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Prescription Symbol & Handwritten Script Area */}
              <div className="mt-4 relative">
                <div className="text-[28px] font-serif font-black text-primary leading-none mb-3">℞</div>

                {/* Medical Prescription Items */}
                <div className="space-y-4 font-serif text-[15px] italic text-[#1E3A8A]">
                  {/* Bounding Box 1 (Amlodipine - Confirmed 96%) */}
                  <div
                    onMouseEnter={() => setActiveEntityId("card-entity-1")}
                    onClick={() => setActiveEntityId("card-entity-1")}
                    className={`relative p-2 rounded cursor-pointer transition-all ${
                      overlaysActive
                        ? activeEntityId === "card-entity-1"
                          ? "bg-primary-fixed/50 ring-2 ring-primary shadow-md scale-[1.01]"
                          : "bg-primary-fixed/20 ring-2 ring-primary hover:bg-primary-fixed/40"
                        : ""
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[16px] font-bold text-[#0F2942] tracking-wide">
                        1. Tab. Amlodipine 5 mg — 1 Tab OD (Morning)
                      </span>
                      {overlaysActive && (
                        <span className="bg-primary text-on-primary text-[9px] font-mono font-sans not-italic px-1.5 py-0.5 rounded">
                          Entity #1 · 96%
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-sans not-italic text-[#64748B] mt-0.5">
                      Duration: 30 days · After Breakfast
                    </div>
                  </div>

                  {/* Bounding Box 2 (Telmisartan - AMBER WARN 72%) */}
                  <div
                    onMouseEnter={() => setActiveEntityId("card-entity-2")}
                    onClick={() => setActiveEntityId("card-entity-2")}
                    className={`relative p-2.5 rounded shadow-sm cursor-pointer transition-all ${
                      overlaysActive
                        ? activeEntityId === "card-entity-2"
                          ? "bg-[#FDE68A] ring-2 ring-[#D97706] shadow-md scale-[1.01]"
                          : "bg-[#FEF3C7] ring-2 ring-dashed ring-[#D97706] hover:bg-[#FDE68A]"
                        : ""
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-[17px] font-bold text-[#92400E] font-cursive tracking-wider">
                          2. Tab. Telm.... 40 mg OD (Bedtime)
                        </span>
                        <div className="text-[11px] font-sans not-italic text-[#B45309] font-medium flex items-center gap-1 mt-0.5">
                          <span className="material-symbols-outlined text-[13px]">warning</span>
                          {isTelmisartanConfirmed
                            ? "Confirmed by Clinician: Telmisartan 40mg"
                            : "Ambiguous handwriting script · Review Required"}
                        </div>
                      </div>
                      {overlaysActive && (
                        <span className="bg-[#D97706] text-white text-[9px] font-mono font-sans not-italic px-1.5 py-0.5 rounded animate-pulse">
                          Entity #2 · {isTelmisartanConfirmed ? "Confirmed" : "72%"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bounding Box 3 (Metformin - Confirmed 98%) */}
                  <div
                    onMouseEnter={() => setActiveEntityId("card-entity-3")}
                    onClick={() => setActiveEntityId("card-entity-3")}
                    className={`relative p-2 rounded cursor-pointer transition-all ${
                      overlaysActive
                        ? activeEntityId === "card-entity-3"
                          ? "bg-primary-fixed/50 ring-2 ring-primary shadow-md scale-[1.01]"
                          : "bg-primary-fixed/20 ring-2 ring-primary hover:bg-primary-fixed/40"
                        : ""
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[16px] font-bold text-[#0F2942] tracking-wide">
                        3. Tab. Metformin 500 mg — BD with meals
                      </span>
                      {overlaysActive && (
                        <span className="bg-primary text-on-primary text-[9px] font-mono font-sans not-italic px-1.5 py-0.5 rounded">
                          Entity #3 · 98%
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-sans not-italic text-[#64748B] mt-0.5">
                      Duration: 60 days · Post prandial blood check
                    </div>
                  </div>
                </div>
              </div>

              {/* Doctor Advice & Followup */}
              <div className="mt-6 pt-4 border-t border-[#E2E8F0] text-[11px] text-[#475569]">
                <div className="font-bold text-[#1E293B]">ADVICE / INVESTIGATIONS:</div>
                <ul className="list-disc list-inside mt-1 space-y-0.5">
                  <li>Serum Creatinine, Electrolytes &amp; Lipid Profile after 3 weeks</li>
                  <li>Salt-restricted diet, 30 min daily brisk walk</li>
                  <li>Maintain home BP charting twice daily</li>
                </ul>
              </div>

              {/* Doctor Signature Seal Bottom */}
              <div className="mt-8 pt-4 flex justify-between items-end">
                <div className="text-[10px] text-[#94A3B8]">
                  Verified by Apollo OCR Engine · Session ID #CF-9821
                </div>
                <div className="text-right">
                  <div className="font-serif italic text-[16px] text-[#1E3A8A] font-bold -mb-1">
                    Dr. S. Kulkarni
                  </div>
                  <div className="text-[10px] font-semibold text-[#475569]">
                    Consultant Cardiologist &amp; Physician
                  </div>
                  <div className="text-[9px] text-[#94A3B8]">Reg. No. 44812</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Legend & OCR Status */}
          <div className="px-space-panel-padding py-space-xs bg-surface-container-lowest flex items-center justify-between text-metadata-micro font-metadata-micro text-on-surface-variant flex-wrap gap-2">
            <div className="flex items-center gap-space-md">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block"></span> High Conf (&gt;90%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D97706] inline-block"></span> Ambiguous (&lt;80%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary inline-block"></span> Clinical Vitals
              </span>
            </div>
            <span className="font-clinical-data-mono text-outline">Hover highlights target card</span>
          </div>
        </div>

        {/* RIGHT PANE: Extracted Structured Entities & Verification Panel (6 cols) */}
        <div className="lg:col-span-6 flex flex-col space-y-space-md">
          {/* Panel Header & Progress Tracker */}
          <div className="bg-surface-container-lowest rounded-xl p-panel-padding shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
            <div>
              <div className="flex items-center gap-space-xs">
                <span className="font-section-title text-section-title text-on-surface">Extracted Clinical Entities</span>
                <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-clinical-data-mono text-metadata-micro font-bold">
                  4 Detected
                </span>
              </div>
              <p className="font-body-default text-metadata-micro text-on-surface-variant mt-0.5">
                {isTelmisartanConfirmed
                  ? "All 4 extracted entities verified and ready for EHR chart commit."
                  : "1 prescription candidate requires mandatory clinical pharmacist / physician confirmation."}
              </p>
            </div>
            <div className="flex items-center gap-space-sm shrink-0">
              <div className="flex flex-col text-right">
                <span className="font-metadata-micro text-metadata-micro text-outline">Confidence Score</span>
                <span className="font-clinical-data-mono text-clinical-data font-bold text-primary">
                  {isTelmisartanConfirmed ? "96.5% Avg" : "87.5% Avg"}
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-clinical-data-mono text-metadata-micro font-bold text-primary">
                {isTelmisartanConfirmed ? "4/4" : "3/4"}
              </div>
            </div>
          </div>

          {/* ENTITY 2 (AMBER URGENT RESOLUTION CARD) */}
          <div
            onMouseEnter={() => setActiveEntityId("card-entity-2")}
            className={`bg-surface-container-lowest rounded-xl shadow-sm border-l-4 p-panel-padding transition-all ${
              isTelmisartanConfirmed ? "border-primary" : "border-[#D97706]"
            } ${activeEntityId === "card-entity-2" ? "ring-2 ring-primary shadow-md" : ""}`}
          >
            {/* Header Bar */}
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div className="flex items-center gap-space-xs">
                <span
                  className={`w-6 h-6 rounded font-clinical-data-mono text-metadata-micro font-bold flex items-center justify-center ${
                    isTelmisartanConfirmed
                      ? "bg-primary-fixed text-on-primary-fixed"
                      : "bg-[#FEF3C7] text-[#B45309]"
                  }`}
                >
                  2
                </span>
                <div>
                  <div className="flex items-center gap-space-xs flex-wrap">
                    <span className="font-body-strong text-body-strong text-on-surface">
                      Medication: {formParams.drugName} Candidate
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded font-clinical-data-mono text-metadata-micro font-semibold flex items-center gap-1 ${
                        isTelmisartanConfirmed
                          ? "bg-primary-fixed/40 text-on-primary-fixed-variant"
                          : "bg-[#FEF3C7] text-[#92400E]"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[12px]">
                        {isTelmisartanConfirmed ? "verified" : "flag"}
                      </span>
                      {isTelmisartanConfirmed ? "Verified" : "72% Confidence"}
                    </span>
                  </div>
                  <span className="font-metadata-micro text-metadata-micro text-outline">
                    Raw Token Stream: &ldquo;Tab Telm... 40mg OD&rdquo;
                  </span>
                </div>
              </div>
              <span
                className={`font-metadata-micro text-metadata-micro px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  isTelmisartanConfirmed
                    ? "bg-primary-container text-on-primary-container"
                    : "bg-error-container text-on-error-container"
                }`}
              >
                {isTelmisartanConfirmed ? "Approved" : "Review Needed"}
              </span>
            </div>

            {/* Raw OCR Snippet Crop Preview */}
            <div className="mt-space-sm p-2 bg-surface-container-low rounded-lg flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-outline text-base">crop</span>
                <div className="flex flex-col">
                  <span className="font-metadata-micro text-metadata-micro text-on-surface-variant font-semibold">
                    Cropped Scan Snippet (Line 2):
                  </span>
                  <span className="font-serif italic font-bold text-[#1E3A8A] text-subheading bg-surface-container-lowest px-2 py-0.5 rounded shadow-inner">
                    Tab. Telm.... 40 mg OD
                  </span>
                </div>
              </div>
              <span className="font-clinical-data-mono text-metadata-micro text-outline">
                BoundingBox: [184, 492, 532, 540]
              </span>
            </div>

            {/* 3-Way Candidate Match Resolution */}
            <div className="mt-space-md">
              <div className="flex items-center justify-between mb-space-xs flex-wrap gap-1">
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase font-semibold">
                  AI Suggested Matches (RxNorm / Indian Pharmacopoeia):
                </span>
                <span className="font-metadata-micro text-metadata-micro text-primary">
                  Matched via Contextual Hypertension Dx
                </span>
              </div>
              <div className="space-y-space-xs">
                {Object.entries(DRUG_CANDIDATES).map(([key, c]) => {
                  const isChecked = selectedCandidateKey === key;
                  return (
                    <label
                      key={key}
                      onClick={() => handleCandidateChange(key)}
                      className={`flex items-start justify-between p-space-sm rounded-lg cursor-pointer transition-colors block ${
                        isChecked
                          ? c.badgeType === "warning"
                            ? "bg-error-container/40 ring-1 ring-error"
                            : "bg-primary-fixed/25 ring-1 ring-primary"
                          : c.badgeType === "warning"
                          ? "bg-error-container/20 hover:bg-error-container/40"
                          : "bg-surface-container hover:bg-surface-container-high"
                      }`}
                    >
                      <div className="flex items-start gap-space-xs">
                        <input
                          checked={isChecked}
                          onChange={() => handleCandidateChange(key)}
                          className="mt-1 text-primary focus:ring-primary h-4 w-4"
                          name="drug-candidate"
                          type="radio"
                          value={key}
                        />
                        <div className="flex flex-col">
                          <div className="flex items-center gap-space-xs flex-wrap">
                            <span
                              className={`font-body-strong text-clinical-data ${
                                c.badgeType === "warning" ? "text-on-error-container" : "text-on-surface"
                              }`}
                            >
                              {c.name}
                            </span>
                            <span
                              className={`font-clinical-data-mono text-[10px] px-1.5 py-0.2 rounded font-bold ${
                                c.badgeType === "recommended"
                                  ? "bg-primary text-on-primary"
                                  : c.badgeType === "warning"
                                  ? "bg-error text-on-error"
                                  : "bg-surface-variant text-on-surface-variant"
                              }`}
                            >
                              {c.badge}
                            </span>
                          </div>
                          <span
                            className={`font-metadata-micro text-metadata-micro ${
                              c.badgeType === "warning" ? "text-on-error-container" : "text-on-surface-variant"
                            }`}
                          >
                            {c.description}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span
                          className={`font-clinical-data-mono text-clinical-data font-bold ${
                            c.badgeType === "warning" ? "text-error" : "text-primary"
                          }`}
                        >
                          {c.matchScore}
                        </span>
                        <span className="block text-[10px] text-outline">{c.probLabel}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Editable Structured Fields */}
            <div className="mt-space-md pt-space-sm bg-surface-container-low rounded-lg p-space-sm">
              <div className="flex items-center justify-between mb-space-xs">
                <span className="font-metadata-micro text-metadata-micro text-on-surface font-semibold uppercase">
                  Parsed Form Parameters
                </span>
                <span className="font-metadata-micro text-metadata-micro text-outline">Click field to override</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-space-xs">
                <div>
                  <label className="block font-metadata-micro text-[10px] text-outline uppercase">Drug Name</label>
                  <input
                    className="w-full h-8 px-2 bg-surface-container-lowest text-on-surface font-clinical-data text-clinical-data rounded focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                    type="text"
                    value={formParams.drugName}
                    onChange={(e) => setFormParams({ ...formParams, drugName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block font-metadata-micro text-[10px] text-outline uppercase">Strength</label>
                  <input
                    className="w-full h-8 px-2 bg-surface-container-lowest text-on-surface font-clinical-data text-clinical-data rounded focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                    type="text"
                    value={formParams.strength}
                    onChange={(e) => setFormParams({ ...formParams, strength: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block font-metadata-micro text-[10px] text-outline uppercase">Dosage</label>
                  <input
                    className="w-full h-8 px-2 bg-surface-container-lowest text-on-surface font-clinical-data text-clinical-data rounded focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                    type="text"
                    value={formParams.dosage}
                    onChange={(e) => setFormParams({ ...formParams, dosage: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block font-metadata-micro text-[10px] text-outline uppercase">Frequency</label>
                  <select
                    className="w-full h-8 px-1 bg-surface-container-lowest text-on-surface font-clinical-data text-clinical-data rounded focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                    value={formParams.frequency}
                    onChange={(e) => setFormParams({ ...formParams, frequency: e.target.value })}
                  >
                    <option value="Once Daily (OD)">Once Daily (OD)</option>
                    <option value="Twice Daily (BD)">Twice Daily (BD)</option>
                    <option value="Thrice Daily (TDS)">Thrice Daily (TDS)</option>
                    <option value="At Bedtime (HS)">At Bedtime (HS)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-metadata-micro text-[10px] text-outline uppercase">Route</label>
                  <input
                    className="w-full h-8 px-2 bg-surface-container-lowest text-on-surface font-clinical-data text-clinical-data rounded focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                    type="text"
                    value={formParams.route}
                    onChange={(e) => setFormParams({ ...formParams, route: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Resolution CTA Footers */}
            <div className="mt-space-md flex flex-wrap items-center justify-between gap-space-xs pt-space-xs">
              <div className="flex items-center gap-space-xs">
                <button
                  onClick={() => showToast("Manual Edit Enabled", "Fields unlocked for direct doctor adjustment.", "edit_note")}
                  className="h-8 px-space-sm bg-surface-container hover:bg-surface-container-high text-on-surface font-clinical-data text-clinical-data rounded flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">edit_note</span>
                  <span>Manual Text Edit</span>
                </button>
                <button
                  onClick={() => showToast("Entity Marked Unreadable", "Flagged for manual pharmacist verification request.", "visibility_off")}
                  className="h-8 px-space-sm bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-clinical-data text-clinical-data rounded flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">visibility_off</span>
                  <span>Mark Unreadable</span>
                </button>
              </div>
              <button
                onClick={handleConfirmCandidate}
                className="h-8 px-space-md bg-primary hover:bg-primary-container text-on-primary font-body-strong text-clinical-data rounded flex items-center gap-1 shadow-sm transition-colors"
              >
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span>Confirm {formParams.drugName} {formParams.strength}</span>
              </button>
            </div>
          </div>

          {/* ENTITY 1 (GREEN HIGH CONFIDENCE: AMLODIPINE) */}
          <div
            onMouseEnter={() => setActiveEntityId("card-entity-1")}
            className={`bg-surface-container-lowest rounded-xl shadow-sm p-panel-padding flex flex-col md:flex-row md:items-center justify-between gap-space-sm transition-all hover:bg-surface-container-low/50 ${
              activeEntityId === "card-entity-1" ? "ring-2 ring-primary bg-surface-container-high" : ""
            }`}
          >
            <div className="flex items-start gap-space-xs">
              <span className="w-6 h-6 rounded bg-primary-fixed text-on-primary-fixed font-clinical-data-mono text-metadata-micro font-bold flex items-center justify-center shrink-0">
                1
              </span>
              <div>
                <div className="flex items-center gap-space-xs">
                  <span className="font-body-strong text-clinical-data text-on-surface">
                    Amlodipine Besylate 5mg
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-primary-fixed/40 text-on-primary-fixed-variant font-clinical-data-mono text-metadata-micro font-bold">
                    96% Conf
                  </span>
                </div>
                <div className="flex items-center gap-space-sm font-metadata-micro text-metadata-micro text-on-surface-variant mt-0.5 flex-wrap">
                  <span>Dose: 1 Tab</span>
                  <span>· Freq: OD (Morning)</span>
                  <span>· Route: Oral</span>
                  <span>· Duration: 30 Days</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-space-xs shrink-0 self-end md:self-center">
              <span className="flex items-center gap-1 font-metadata-micro text-metadata-micro text-primary font-semibold px-2 py-1 bg-surface-container rounded">
                <span className="material-symbols-outlined text-sm">verified</span>
                Auto-Approved
              </span>
              <button
                onClick={() => showToast("Modify Amlodipine", "Editing dosage parameters for Entity #1.", "edit")}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-surface-container text-outline transition-colors"
                title="Modify parameters"
              >
                <span className="material-symbols-outlined text-base">edit</span>
              </button>
            </div>
          </div>

          {/* ENTITY 3 (GREEN HIGH CONFIDENCE: METFORMIN) */}
          <div
            onMouseEnter={() => setActiveEntityId("card-entity-3")}
            className={`bg-surface-container-lowest rounded-xl shadow-sm p-panel-padding flex flex-col md:flex-row md:items-center justify-between gap-space-sm transition-all hover:bg-surface-container-low/50 ${
              activeEntityId === "card-entity-3" ? "ring-2 ring-primary bg-surface-container-high" : ""
            }`}
          >
            <div className="flex items-start gap-space-xs">
              <span className="w-6 h-6 rounded bg-primary-fixed text-on-primary-fixed font-clinical-data-mono text-metadata-micro font-bold flex items-center justify-center shrink-0">
                3
              </span>
              <div>
                <div className="flex items-center gap-space-xs">
                  <span className="font-body-strong text-clinical-data text-on-surface">
                    Metformin Hydrochloride 500mg
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-primary-fixed/40 text-on-primary-fixed-variant font-clinical-data-mono text-metadata-micro font-bold">
                    98% Conf
                  </span>
                </div>
                <div className="flex items-center gap-space-sm font-metadata-micro text-metadata-micro text-on-surface-variant mt-0.5 flex-wrap">
                  <span>Dose: 1 Tab</span>
                  <span>· Freq: BD (Twice Daily with meals)</span>
                  <span>· Route: Oral</span>
                  <span>· Duration: 60 Days</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-space-xs shrink-0 self-end md:self-center">
              <span className="flex items-center gap-1 font-metadata-micro text-metadata-micro text-primary font-semibold px-2 py-1 bg-surface-container rounded">
                <span className="material-symbols-outlined text-sm">verified</span>
                Auto-Approved
              </span>
              <button
                onClick={() => showToast("Modify Metformin", "Editing dosage parameters for Entity #3.", "edit")}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-surface-container text-outline transition-colors"
                title="Modify parameters"
              >
                <span className="material-symbols-outlined text-base">edit</span>
              </button>
            </div>
          </div>

          {/* ENTITY 4 (BLUE CLINICAL VITAL SIGN: BP & WT) */}
          <div
            onMouseEnter={() => setActiveEntityId("card-entity-4")}
            className={`bg-surface-container-lowest rounded-xl shadow-sm p-panel-padding flex flex-col md:flex-row md:items-center justify-between gap-space-sm transition-all hover:bg-surface-container-low/50 ${
              activeEntityId === "card-entity-4" ? "ring-2 ring-primary bg-surface-container-high" : ""
            }`}
          >
            <div className="flex items-start gap-space-xs">
              <span className="w-6 h-6 rounded bg-tertiary-fixed text-on-tertiary-fixed font-clinical-data-mono text-metadata-micro font-bold flex items-center justify-center shrink-0">
                4
              </span>
              <div>
                <div className="flex items-center gap-space-xs">
                  <span className="font-body-strong text-clinical-data text-on-surface">
                    Clinical Vitals Observation
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-tertiary-fixed-dim/40 text-on-tertiary-fixed-variant font-clinical-data-mono text-metadata-micro font-bold">
                    99% Conf
                  </span>
                </div>
                <div className="flex items-center gap-space-sm font-metadata-micro text-metadata-micro text-on-surface-variant mt-0.5 flex-wrap">
                  <span className="font-clinical-data-mono font-bold text-on-surface">
                    Blood Pressure: 142/88 mmHg
                  </span>
                  <span>· Weight: 82.0 kg</span>
                  <span>· LOINC: 85354-9</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-space-xs shrink-0 self-end md:self-center">
              <span className="flex items-center gap-1 font-metadata-micro text-metadata-micro text-tertiary font-semibold px-2 py-1 bg-surface-container rounded">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                Links to Flowsheet
              </span>
              <button
                onClick={() => showToast("Modify Vitals", "Editing vitals observation parameters for Entity #4.", "edit")}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-surface-container text-outline transition-colors"
                title="Modify parameters"
              >
                <span className="material-symbols-outlined text-base">edit</span>
              </button>
            </div>
          </div>

          {/* Comparative Interaction Matrix */}
          <div className="bg-surface-container-low rounded-xl p-space-md flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-primary text-xl">security</span>
              <div>
                <span className="font-body-strong text-clinical-data text-on-surface">
                  Clinical Safety Check: Zero Drug-Drug Interactions Detected
                </span>
                <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                  Amlodipine (CCB) + Telmisartan (ARB) + Metformin (Biguanide) is a standard guideline-directed dual-path therapy.
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-primary text-base">check_circle</span>
          </div>
        </div>
      </div>

      {/* BOTTOM WORKFLOW ACTION FOOTER */}
      <div className="w-full mt-space-md bg-surface-container-lowest rounded-xl shadow-sm p-panel-padding flex flex-col md:flex-row items-center justify-between gap-space-md">
        {/* Legal & Clinical Safety Compliance Statement */}
        <div className="flex items-center gap-space-sm max-w-2xl">
          <span className="material-symbols-outlined text-primary text-xl shrink-0">policy</span>
          <p className="font-body-default text-metadata-micro text-on-surface-variant leading-relaxed">
            <span className="font-body-strong text-on-surface">
              Indian Medical Council &amp; ABDM Digital Health Safety:
            </span>{" "}
            Prescription entities parsed by optical character models are non-authoritative until signed off by a licensed clinician.
            Entities committed will instantly update Rahul Sharma&apos;s FHIR MedicationRequest resource and Active Vitals graph.
          </p>
        </div>

        {/* Final Execution Buttons */}
        <div className="flex items-center gap-space-xs shrink-0 w-full md:w-auto justify-end">
          <button
            onClick={() => showToast("Draft Saved", "Extracted entities state cached locally in browser.", "save")}
            className="h-10 px-space-md bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg font-clinical-data text-clinical-data flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-base text-outline">save</span>
            <span>Save Draft</span>
          </button>
          <button
            onClick={handleCommitEHR}
            disabled={isCommitting}
            className={`h-10 px-space-lg rounded-lg font-body-strong text-clinical-data flex items-center gap-2 shadow-sm transition-transform active:scale-95 ${
              isCommitted
                ? "bg-surface-container-highest text-primary"
                : "bg-primary hover:bg-primary-container text-on-primary"
            }`}
          >
            <span className="material-symbols-outlined text-base">
              {isCommitted ? "verified" : isCommitting ? "sync" : "check"}
            </span>
            <span>
              {isCommitted
                ? "Committed to Patient Chart (4 items)"
                : isCommitting
                ? "Transmitting to FHIR..."
                : "Commit Extracted Entities to EHR (4 items)"}
            </span>
          </button>
        </div>
      </div>

      {/* Floating System Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-inverse-surface text-inverse-on-surface px-space-md py-space-sm rounded-xl shadow-xl flex items-center gap-space-sm z-50 border border-outline-variant/40 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="material-symbols-outlined text-primary-fixed-dim text-lg">
            {toast.icon}
          </span>
          <div className="flex flex-col">
            <span className="font-clinical-data text-metadata-micro font-bold">{toast.title}</span>
            <span className="font-clinical-data-mono text-[11px] opacity-80">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
