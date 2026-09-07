/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";

interface StudyItem {
  id: string;
  modality: string;
  title: string;
  time: string;
  acc: string;
  matrix: string;
  badge: string;
  badgeColor: string;
  imageSrc?: string;
  isWaveform?: boolean;
  isPending?: boolean;
  findings: string;
  impression: string;
  ctr?: string;
}

const STUDIES: Record<string, StudyItem> = {
  cxr: {
    id: "cxr",
    modality: "DX · GE Definium 646 HD",
    title: "Chest X-Ray (PA View) & Resting 12-Lead Telemetry Strip",
    time: "15-Nov-2025 14:10 IST · Suite 02",
    acc: "DCM-77180",
    matrix: "3024 × 3024 · 16-bit",
    badge: "ACTIVE",
    badgeColor: "bg-primary text-on-primary",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA8IZUGe5Uo6y-G0EznZiDcp5n13eiHXD1kcAFmwZSTPnnDjWkdzCV4lc5Y807N1MtSbmrH0D7ypmae9LZUu7B1DTqeQPECqJMQoQKOX8RAdkXsJh45mvYxC5Z5wNyarUA3DPcW4THm_yY-zXmbC5UOQ2KAJd5v4GEy7BeNbP_f7qAXEMHcJw8xlQNfY_mVe5NO5p27UxjH8nkpPVS12geRhGsamY45g96RunzBkaGKVfet0dNd5VAw",
    findings:
      "Clear bilaterally. No focal airspace consolidation, infiltrates, pneumothorax, or pleural effusion. Costophrenic sulci and cardiophrenic angles are sharp and normal. Cardiac silhouette within normal limits.",
    impression:
      "“Unremarkable cardiopulmonary examination. No radiopaque cardiac enlargement or acute pulmonary pathology. Clear baseline study.”",
    ctr: "0.46",
  },
  ecg: {
    id: "ecg",
    modality: "ECG · GE MAC 5500 HD",
    title: "12-Lead Electrocardiogram — Bedside Telemetry Snapshot",
    time: "Today 14:25 IST (15m Post-X-Ray)",
    acc: "ECG-88210",
    matrix: "12-Channel · 500 Hz High Fidelity",
    badge: "ACUTE",
    badgeColor: "bg-error text-on-error",
    isWaveform: true,
    findings:
      "Marked ST-segment elevation (+4.2mm in V2, +3.8mm in V3, +2.4mm in V4). Reciprocal ST depressions in inferior leads II, III, aVF (-1.8mm). Pathological Q-waves developing in V1-V2.",
    impression:
      "“ACUTE ANTERIOR WALL MYOCARDIAL INFARCTION (STEMI). Emergency primary PCI indicated without delay.”",
  },
  angio: {
    id: "angio",
    modality: "XA · Philips Azurion 7 Biplane",
    title: "Prior Coronary Angiography (Fluoroscopic Cine Run)",
    time: "12-Jun-2021 · Cath Lab 01",
    acc: "ANG-2021-041",
    matrix: "1024 × 1024 · 30 fps DICOM",
    badge: "2021 HIST",
    badgeColor: "bg-surface-container-highest text-on-surface",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBklXCqjd_WYXSKRzIaG8WQE610h7Kp8c_VO5d3dxS930euAi9Ekap9EXzsZH36IYAtPDHh4qyQ0ZIiHaQevMnYttzFeNOdh7ii5220VHNsI86fNpltiUXvRJTMFBE0iGNVD_JDXIVScvyvhk_rN-VKS0mG7ESInc0jgNI6viU-REo0eU2VTXRBTrRd1jQoUU_IaPh-B-P86J5JPWjxURMvw6lS59FCj-iqxn79h3u8B0JFgXw1IwSa",
    findings:
      "Right dominant coronary circulation. Left Main coronary artery normal. Left Anterior Descending (LAD) demonstrated 40% eccentric mid-vessel plaque with TIMI 3 flow. Circumflex and RCA non-obstructive.",
    impression:
      "“Non-critical mid-LAD atherosclerosis (40% stenosis) in 2021. Managed medically. Baseline comparison available for urgent primary PCI.”",
  },
  echo: {
    id: "echo",
    modality: "US · Butterfly iQ+ Handheld",
    title: "Bedside Point-of-Care Ultrasound (POCUS Echo)",
    time: "Today 14:32 IST · ER Resuscitation Bay",
    acc: "PAC-2026-0811",
    matrix: "2D B-Mode & Color Doppler",
    badge: "STAT",
    badgeColor: "bg-secondary-container text-on-secondary-container",
    isPending: true,
    findings:
      "Parasternal and apical windows demonstrate regional wall motion abnormality: severe hypokinesis to akinesis of the anterior septum and apical anterior wall. LVEF visually estimated at ~42%.",
    impression:
      "“Regional anterior septal wall motion abnormality concordant with proximal LAD territorial occlusion. Normal pericardial space; no effusion.”",
  },
};

export default function ImagingAndRadiologyPage() {
  const [activeTab, setActiveTab] = useState<string>("cxr");
  const [selectedStudyId, setSelectedStudyId] = useState<string>("cxr");

  // Viewer controls state
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [isInverted, setIsInverted] = useState<boolean>(false);
  const [isCalipersOn, setIsCalipersOn] = useState<boolean>(true);
  const [rotationDeg, setRotationDeg] = useState<number>(0);

  // Modals state
  const [showOrderModal, setShowOrderModal] = useState<boolean>(false);
  const [showFullScreenModal, setShowFullScreenModal] = useState<boolean>(false);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);
  const [show3dModal, setShow3dModal] = useState<boolean>(false);
  const [showAiAuditModal, setShowAiAuditModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  const currentStudy = STUDIES[selectedStudyId] || STUDIES.cxr;

  const handleRotate = () => {
    setRotationDeg((prev) => (prev + 90) % 360);
    triggerToast(`Rotated ${rotationDeg + 90}°`);
  };

  const handleReset = () => {
    setIsZoomed(false);
    setIsInverted(false);
    setRotationDeg(0);
    setIsCalipersOn(true);
    triggerToast("Viewport reset to default calibration.");
  };

  return (
    <div className="flex flex-col w-full">
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

      {/* RED FLAG PATIENT HEADER & CONTEXT STRIP */}
      <div className="w-full bg-error text-on-error px-space-base py-space-xs flex flex-wrap items-center justify-between shadow-md">
        <div className="flex items-center gap-space-sm flex-wrap">
          <span className="material-symbols-outlined text-base animate-pulse">warning</span>
          <span className="font-body-strong text-body-strong tracking-wide uppercase font-semibold">
            RED FLAG ALERT: Suspected Acute Anterior STEMI
          </span>
          <span className="bg-surface-container-lowest/20 px-space-xs py-0.5 rounded text-metadata-micro font-clinical-data-mono uppercase font-semibold">
            Priority P1 · Immediate Cath Transfer
          </span>
        </div>
        <div className="flex items-center gap-space-lg text-clinical-data flex-wrap">
          <div className="flex items-center gap-space-xs">
            <span className="font-metadata-micro uppercase tracking-wider text-on-error/80 font-medium">
              Known Severe Allergies:
            </span>
            <span className="font-body-strong bg-on-error text-error px-1.5 py-0.5 rounded-sm text-metadata-micro font-bold">
              Penicillin
            </span>
            <span className="font-body-strong bg-on-error text-error px-1.5 py-0.5 rounded-sm text-metadata-micro font-bold">
              Aspirin
            </span>
          </div>
          <div className="flex items-center gap-1 font-clinical-data-mono text-metadata-micro text-on-error/90">
            <span>Door-to-Balloon Timer:</span>
            <span className="bg-surface-container-lowest text-on-surface font-semibold px-1 rounded">
              22 min elapsed
            </span>
          </div>
        </div>
      </div>

      {/* STICKY PATIENT DEMOGRAPHICS STRIP */}
      <section className="w-full bg-surface-container-lowest px-space-base py-space-sm shadow-sm flex flex-wrap items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-md">
          <div className="h-10 w-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-body-strong text-subheading font-bold">
            RS
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs flex-wrap">
              <span className="font-page-title text-section-title text-on-surface font-semibold">
                Rahul Sharma
              </span>
              <span className="bg-surface-container-high text-on-surface px-1.5 py-0.5 rounded text-metadata-micro font-body-default">
                42 Y / Male
              </span>
              <span className="bg-primary/10 text-primary font-clinical-data-mono text-metadata-micro px-1.5 py-0.5 rounded font-semibold">
                ABHA M1/M2 VERIFIED
              </span>
            </div>
            <div className="flex items-center gap-space-md text-metadata-micro text-on-surface-variant font-clinical-data flex-wrap">
              <span>
                UHID: <strong className="font-clinical-data-mono text-on-surface">DEL-2024-8841</strong>
              </span>
              <span>
                Token: <strong className="font-clinical-data-mono text-on-surface">#104 (OPD-EMR)</strong>
              </span>
              <span>
                Location: <strong className="text-on-surface">Bed 04 · Resus Bay (Wing B)</strong>
              </span>
              <span>
                Attending: <strong className="text-on-surface">Dr. R. Verma (Cardiology)</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Quick Vital Indicators */}
        <div className="flex items-center gap-space-sm bg-surface-container-low px-space-md py-1.5 rounded-lg shadow-sm flex-wrap">
          <div className="flex flex-col px-space-xs">
            <span className="text-metadata-micro text-on-surface-variant font-metadata-micro uppercase font-medium">
              HR (ECG)
            </span>
            <span className="text-clinical-data font-clinical-data-mono font-bold text-error flex items-center">
              108 <span className="text-[10px] ml-0.5 font-normal">bpm ↑</span>
            </span>
          </div>
          <div className="w-px h-6 bg-outline-variant hidden sm:block"></div>
          <div className="flex flex-col px-space-xs">
            <span className="text-metadata-micro text-on-surface-variant font-metadata-micro uppercase font-medium">
              NIBP
            </span>
            <span className="text-clinical-data font-clinical-data-mono font-bold text-on-surface">
              88/54 <span className="text-[10px] ml-0.5 font-normal text-tertiary">↓</span>
            </span>
          </div>
          <div className="w-px h-6 bg-outline-variant hidden sm:block"></div>
          <div className="flex flex-col px-space-xs">
            <span className="text-metadata-micro text-on-surface-variant font-metadata-micro uppercase font-medium">
              SpO₂
            </span>
            <span className="text-clinical-data font-clinical-data-mono font-bold text-on-surface">
              94% <span className="text-[10px] ml-0.5 font-normal text-on-surface-variant">4L O₂</span>
            </span>
          </div>
          <div className="w-px h-6 bg-outline-variant hidden sm:block"></div>
          <div className="flex flex-col px-space-xs">
            <span className="text-metadata-micro text-on-surface-variant font-metadata-micro uppercase font-medium">
              hs-cTnI
            </span>
            <span className="text-clinical-data font-clinical-data-mono font-bold text-error flex items-center">
              3,840 <span className="text-[10px] ml-0.5 font-normal">pg/mL ↑↑</span>
            </span>
          </div>
        </div>
      </section>

      {/* HEADER & MODALITY NAVIGATION AREA */}
      <div className="w-full px-space-base pt-space-md pb-space-sm flex flex-col gap-space-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
          <div>
            <div className="flex items-center gap-space-xs flex-wrap">
              <span className="material-symbols-outlined text-primary text-xl">biotech</span>
              <h1 className="font-page-title text-page-title text-on-surface font-semibold">
                Imaging &amp; Diagnostic Radiology Center
              </h1>
              <span className="bg-surface-container text-primary font-clinical-data-mono text-metadata-micro px-2 py-0.5 rounded font-semibold ml-2">
                PACS v5.14.0 Enterprise
              </span>
            </div>
            <p className="font-body-default text-clinical-data text-on-surface-variant mt-0.5">
              Integrated PACS imaging, DICOM studies, bedside radiography, and certified radiologist reports.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center flex-wrap gap-space-xs">
            <button
              onClick={() => setShowOrderModal(true)}
              className="flex items-center gap-1.5 px-space-sm py-1.5 bg-primary text-on-primary font-body-strong text-clinical-data rounded-lg shadow hover:bg-surface-tint transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">add_circle</span>
              <span>Order Radiology Study</span>
            </button>
            <button
              onClick={() => setShowFullScreenModal(true)}
              className="flex items-center gap-1.5 px-space-sm py-1.5 bg-surface-container-lowest text-on-surface font-body-strong text-clinical-data rounded-lg shadow-sm hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">fullscreen</span>
              <span>PACS Full Screen</span>
            </button>
            <button
              onClick={() => setShowCompareModal(true)}
              className="flex items-center gap-1.5 px-space-sm py-1.5 bg-surface-container-lowest text-on-surface font-body-strong text-clinical-data rounded-lg shadow-sm hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">compare</span>
              <span>Compare Chronological</span>
            </button>
            <button
              onClick={() => triggerToast("Exporting comprehensive imaging dossier (DICOM Part 10 + PDF)...")}
              className="flex items-center gap-1.5 px-space-sm py-1.5 bg-surface-container-lowest text-secondary font-body-strong text-clinical-data rounded-lg shadow-sm hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">ios_share</span>
              <span>Export Dossier</span>
            </button>
          </div>
        </div>

        {/* Modality Tabs */}
        <div className="flex items-center gap-space-xs overflow-x-auto pb-1 mt-1 scrollbar-none">
          <button
            onClick={() => {
              setActiveTab("all");
              setSelectedStudyId("cxr");
            }}
            className={`px-space-md py-1.5 rounded-full font-body-strong text-clinical-data flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-surface-container-highest text-on-surface"
                : "bg-surface-container-lowest text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span>All Imaging Studies</span>
            <span className="bg-primary text-on-primary text-metadata-micro px-1.5 py-0.2 rounded-full font-clinical-data-mono font-bold">
              4
            </span>
          </button>
          <button
            onClick={() => {
              setActiveTab("ecg");
              setSelectedStudyId("ecg");
            }}
            className={`px-space-md py-1.5 rounded-full font-body-default text-clinical-data flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer ${
              activeTab === "ecg"
                ? "bg-primary-container text-on-primary-container font-body-strong"
                : "bg-surface-container-lowest text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-base text-error">ecg</span>
            <span>Electrocardiograms (12-Lead)</span>
            <span className="bg-surface-container text-on-surface-variant text-metadata-micro px-1.5 py-0.2 rounded-full font-clinical-data-mono">
              3
            </span>
          </button>
          <button
            onClick={() => {
              setActiveTab("cxr");
              setSelectedStudyId("cxr");
            }}
            className={`px-space-md py-1.5 rounded-full font-body-strong text-clinical-data flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ${
              activeTab === "cxr"
                ? "bg-primary-container text-on-primary-container font-semibold"
                : "bg-surface-container-lowest text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-base text-on-primary-container">radiology</span>
            <span>Chest X-Ray / Radiography</span>
            <span className="bg-surface-container-lowest text-primary text-metadata-micro px-1.5 py-0.2 rounded-full font-clinical-data-mono font-bold">
              1
            </span>
          </button>
          <button
            onClick={() => {
              setActiveTab("angio");
              setSelectedStudyId("angio");
            }}
            className={`px-space-md py-1.5 rounded-full font-body-default text-clinical-data flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer ${
              activeTab === "angio"
                ? "bg-primary-container text-on-primary-container font-body-strong"
                : "bg-surface-container-lowest text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-base text-tertiary">monitor_heart</span>
            <span>Coronary Angiography &amp; Cath</span>
            <span className="bg-surface-container text-on-surface-variant text-metadata-micro px-1.5 py-0.2 rounded-full font-clinical-data-mono">
              1 Prior + 1 Sched
            </span>
          </button>
          <button
            onClick={() => {
              setActiveTab("echo");
              setSelectedStudyId("echo");
            }}
            className={`px-space-md py-1.5 rounded-full font-body-default text-clinical-data flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer ${
              activeTab === "echo"
                ? "bg-primary-container text-on-primary-container font-body-strong"
                : "bg-surface-container-lowest text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-base text-secondary">question_mark</span>
            <span>Echocardiography</span>
            <span className="bg-error-container text-on-error-container text-metadata-micro px-1.5 py-0.2 rounded-full font-clinical-data-mono font-bold">
              1 Pending
            </span>
          </button>
        </div>
      </div>

      {/* MAIN SPLIT DIAGNOSTIC INSPECTION STAGE */}
      <div className="w-full px-space-base py-space-xs pb-space-2xl grid grid-cols-1 xl:grid-cols-12 gap-space-base items-start">
        {/* LEFT PANE: 55% width on high-res desktop (7 of 12 cols = 58.3%) */}
        <div className="xl:col-span-7 flex flex-col gap-space-sm">
          {/* Diagnostic Viewer Frame (Engineered Dark Substrate for DICOM contrast) */}
          <div className="w-full bg-inverse-surface rounded-xl overflow-hidden shadow-xl text-inverse-on-surface flex flex-col">
            {/* Viewer Top Bar & Metadata */}
            <div className="bg-inverse-surface/90 px-space-md py-space-sm flex flex-wrap items-center justify-between gap-space-xs">
              <div className="flex items-center gap-space-sm">
                <div className="h-2.5 w-2.5 rounded-full bg-primary-fixed-dim animate-pulse"></div>
                <div className="flex flex-col">
                  <span className="font-body-strong text-clinical-data text-surface-bright tracking-tight font-semibold">
                    {currentStudy.title}
                  </span>
                  <div className="flex items-center gap-space-sm font-clinical-data-mono text-metadata-micro text-surface-dim flex-wrap">
                    <span>
                      Modality: <strong>{currentStudy.modality}</strong>
                    </span>
                    <span>
                      Acc: <strong>{currentStudy.acc}</strong>
                    </span>
                    <span>
                      Matrix: <strong>{currentStudy.matrix}</strong>
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-space-xs">
                <span className="bg-surface-container-highest/20 text-surface-bright font-clinical-data-mono text-metadata-micro px-2 py-0.5 rounded">
                  {currentStudy.time}
                </span>
              </div>
            </div>

            {/* Interactive Imaging Controls Strip */}
            <div className="bg-surface-variant/10 px-space-md py-1.5 flex flex-wrap items-center justify-between gap-space-xs text-metadata-micro font-clinical-data">
              <div className="flex items-center gap-space-xs flex-wrap">
                <button
                  onClick={() => setIsZoomed(!isZoomed)}
                  className={`flex items-center gap-1 px-2 py-1 rounded transition-colors cursor-pointer ${
                    isZoomed
                      ? "bg-primary text-on-primary font-semibold"
                      : "bg-surface-container-highest/20 text-surface-bright hover:bg-surface-container-highest/30"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">zoom_in</span>
                  <span>{isZoomed ? "140%" : "100%"}</span>
                </button>
                <button
                  onClick={() => triggerToast("Pan mode active: drag canvas to reposition image.")}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-surface-container-highest/20 text-surface-bright hover:bg-surface-container-highest/30 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">pan_tool</span>
                  <span>Pan</span>
                </button>
                <button
                  onClick={() => setIsInverted(!isInverted)}
                  className={`flex items-center gap-1 px-2 py-1 rounded transition-colors cursor-pointer ${
                    isInverted
                      ? "bg-primary text-on-primary font-semibold"
                      : "bg-surface-container-highest/20 text-surface-bright hover:bg-surface-container-highest/30"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">contrast</span>
                  <span>Invert W/L</span>
                </button>
                <button
                  onClick={() => {
                    setIsCalipersOn(!isCalipersOn);
                    triggerToast(`Caliper overlays ${!isCalipersOn ? "enabled" : "hidden"}.`);
                  }}
                  className={`flex items-center gap-1 px-2 py-1 rounded transition-colors cursor-pointer ${
                    isCalipersOn
                      ? "bg-primary text-on-primary font-semibold"
                      : "bg-surface-container-highest/20 text-surface-bright hover:bg-surface-container-highest/30"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">straighten</span>
                  <span>Measure (Caliper)</span>
                </button>
                <button
                  onClick={() => setShowCompareModal(true)}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-surface-container-highest/20 text-surface-bright hover:bg-surface-container-highest/30 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">view_column</span>
                  <span>Side-by-Side</span>
                </button>
              </div>
              <div className="flex items-center gap-space-xs">
                <span className="font-clinical-data-mono text-[11px] text-surface-dim">
                  W: 3500 L: -600
                </span>
                <button
                  onClick={() => triggerToast("DICOM Header Tags: TransferSyntaxUID: 1.2.840.10008.1.2.1, Photometric: MONOCHROME2")}
                  className="p-1 rounded text-surface-bright hover:bg-surface-container-highest/30 cursor-pointer"
                  title="Full DICOM Header Tags"
                >
                  <span className="material-symbols-outlined text-sm">info</span>
                </button>
              </div>
            </div>

            {/* Primary High-Resolution Radiography / Modality Viewport */}
            <div className="relative w-full h-[400px] bg-black flex items-center justify-center overflow-hidden select-none group">
              {/* Ambient Grid Background for Depth & Scientific Alignment */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#9cf2e8_1px,transparent_1px)] [background-size:16px_16px]"></div>

              {/* Viewport Image or Waveform depending on selected study */}
              {currentStudy.imageSrc ? (
                <img
                  src={currentStudy.imageSrc}
                  alt={currentStudy.title}
                  style={{
                    transform: `rotate(${rotationDeg}deg) scale(${isZoomed ? 1.35 : 1})`,
                  }}
                  className={`h-full w-auto max-w-full object-contain filter contrast-125 transition-all duration-300 ${
                    isInverted ? "invert" : ""
                  }`}
                />
              ) : currentStudy.isWaveform ? (
                <div className="w-full h-full flex flex-col justify-center px-6">
                  <span className="text-error font-clinical-data-mono text-sm font-bold mb-2">
                    12-Lead Multi-channel Live Telemetry Vector
                  </span>
                  <svg className="w-full h-40 text-error" fill="none" viewBox="0 0 1000 100">
                    <path
                      d="M 0,55 L 40,55 L 50,55 Q 55,50 60,55 L 70,55 L 75,65 L 82,10 L 90,80 L 98,35 Q 120,32 150,38 L 170,55 L 220,55 
                         L 230,55 Q 235,50 240,55 L 250,55 L 255,65 L 262,8 L 270,82 L 278,33 Q 300,30 330,36 L 350,55 L 400,55 
                         L 410,55 Q 415,50 420,55 L 430,55 L 435,65 L 442,12 L 450,80 L 458,36 Q 480,33 510,39 L 530,55 L 580,55
                         L 590,55 Q 595,50 600,55 L 610,55 L 615,65 L 622,10 L 630,82 L 638,34 Q 660,31 690,37 L 710,55 L 760,55"
                      stroke="#ff5449"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                    />
                  </svg>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-6">
                  <span className="material-symbols-outlined text-secondary text-5xl animate-pulse">
                    radiology
                  </span>
                  <span className="font-page-title text-section-title text-surface-bright mt-2">
                    {currentStudy.title}
                  </span>
                  <span className="text-surface-dim text-clinical-data max-w-md mt-1">
                    {currentStudy.findings}
                  </span>
                </div>
              )}

              {/* Orientation & Anatomical HUD Markers */}
              <div className="absolute top-space-sm left-space-sm text-surface-dim font-clinical-data-mono text-metadata-micro pointer-events-none flex flex-col gap-0.5">
                <span className="text-surface-bright font-bold text-subheading">R</span>
                <span>SHARMA, RAHUL</span>
                <span>ID: DEL-2024-8841</span>
                <span>KVp: 120 | mAs: 4.5</span>
                <span>PA UPRIGHT ERECT</span>
              </div>
              <div className="absolute top-space-sm right-space-sm text-surface-dim font-clinical-data-mono text-metadata-micro text-right pointer-events-none flex flex-col gap-0.5">
                <span className="text-surface-bright font-bold text-subheading">L</span>
                <span>APOLLO INDRAPRASTHA</span>
                <span>RAD ID: DR. S. KAPOOR</span>
                <span>TE: 0.04s · EI: 220</span>
              </div>

              {/* Interactive Measurement Callout Overlay (CTR Measurement) */}
              {isCalipersOn && currentStudy.ctr && (
                <div className="absolute bottom-12 left-1/4 pointer-events-none bg-inverse-surface/80 backdrop-blur-sm px-2 py-1 rounded text-metadata-micro font-clinical-data-mono text-primary-fixed flex items-center gap-1.5 shadow">
                  <span className="material-symbols-outlined text-xs">straighten</span>
                  <span>
                    Cardiac Span: 13.8 cm / Thorax: 30.0 cm [CTR: {currentStudy.ctr} - Normal]
                  </span>
                </div>
              )}

              {/* Bottom Viewport Floating Toolbar */}
              <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-inverse-surface/80 backdrop-blur px-2 py-1 rounded-lg">
                <button
                  onClick={handleRotate}
                  className="p-1 text-surface-bright hover:text-primary-fixed transition-colors cursor-pointer"
                  title="Rotate Clockwise"
                >
                  <span className="material-symbols-outlined text-sm">rotate_right</span>
                </button>
                <button
                  onClick={handleReset}
                  className="p-1 text-surface-bright hover:text-primary-fixed transition-colors cursor-pointer"
                  title="Reset Viewport"
                >
                  <span className="material-symbols-outlined text-sm">restart_alt</span>
                </button>
                <button
                  onClick={() => setIsZoomed(!isZoomed)}
                  className="p-1 text-surface-bright hover:text-primary-fixed transition-colors cursor-pointer"
                  title="Magnifying Loupe"
                >
                  <span className="material-symbols-outlined text-sm">search</span>
                </button>
              </div>
            </div>

            {/* Integrated Secondary Modality: Bedside 12-Lead ECG Waveform Strip */}
            <div className="bg-surface-variant/20 px-space-md py-space-sm flex flex-col gap-1.5">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-error text-base animate-pulse">
                    monitor_heart
                  </span>
                  <span className="font-body-strong text-clinical-data text-surface-bright font-semibold">
                    Bedside 12-Lead Telemetry Strip Snapshot
                  </span>
                  <span className="bg-error/30 text-error-container font-clinical-data-mono text-[10px] px-1.5 py-0.2 rounded font-semibold uppercase">
                    Acquired Today 14:25 IST (15m Post-X-Ray)
                  </span>
                </div>
                <span className="font-clinical-data-mono text-metadata-micro text-surface-dim">
                  25 mm/s · 10 mm/mV · Filter 0.05-150 Hz
                </span>
              </div>

              {/* Interactive ECG Grid Strip Visual */}
              <div className="relative w-full h-28 bg-[#0a1219] rounded-lg overflow-hidden flex flex-col justify-center px-space-sm">
                {/* ECG Millimeter Grid background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1d2a35_1px,transparent_1px),linear-gradient(to_bottom,#1d2a35_1px,transparent_1px)] bg-[size:10px_10px] opacity-40"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#2a3f50_1px,transparent_1px),linear-gradient(to_bottom,#2a3f50_1px,transparent_1px)] bg-[size:50px_50px] opacity-30"></div>

                {/* SVG Waveform depicting ST elevation in Leads V2-V4 & reciprocal depression in II, III, aVF */}
                <svg
                  className="w-full h-full text-error relative z-10"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 1000 100"
                >
                  <path
                    d="M 0,55 L 40,55 L 50,55 Q 55,50 60,55 L 70,55 L 75,65 L 82,10 L 90,80 L 98,35 Q 120,32 150,38 L 170,55 L 220,55 
                       L 230,55 Q 235,50 240,55 L 250,55 L 255,65 L 262,8 L 270,82 L 278,33 Q 300,30 330,36 L 350,55 L 400,55 
                       L 410,55 Q 415,50 420,55 L 430,55 L 435,65 L 442,12 L 450,80 L 458,36 Q 480,33 510,39 L 530,55 L 580,55
                       L 590,55 Q 595,50 600,55 L 610,55 L 615,65 L 622,10 L 630,82 L 638,34 Q 660,31 690,37 L 710,55 L 760,55
                       L 770,55 Q 775,50 780,55 L 790,55 L 795,65 L 802,9 L 810,81 L 818,35 Q 840,32 870,38 L 890,55 L 940,55
                       L 950,55 Q 955,50 960,55 L 970,55 L 975,65 L 982,11 L 990,80 L 1000,38"
                    stroke="#ff5449"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.2"
                  />
                </svg>

                {/* Precordial Lead Annotation Tags */}
                <div className="absolute top-1 left-2 z-20 flex items-center gap-2 flex-wrap">
                  <span className="bg-error/80 text-on-error font-clinical-data-mono text-[10px] font-bold px-1 rounded">
                    Lead V2 · Convex ST-Elevation +4.2 mm
                  </span>
                  <span className="bg-error/80 text-on-error font-clinical-data-mono text-[10px] font-bold px-1 rounded">
                    V3 +3.8 mm
                  </span>
                  <span className="bg-surface-variant/80 text-surface-bright font-clinical-data-mono text-[10px] px-1 rounded font-semibold">
                    HR 106 Sinus Tach
                  </span>
                </div>
                <div className="absolute bottom-1 right-2 z-20 text-surface-dim font-clinical-data-mono text-[10px]">
                  Reciprocal ST depression 1.8mm in II, III, aVF
                </div>
              </div>
            </div>
          </div>

          {/* Thumbnail Multi-Study Carousel at Base */}
          <div className="flex flex-col gap-space-xs mt-1">
            <div className="flex items-center justify-between text-metadata-micro text-on-surface-variant">
              <span className="font-body-strong uppercase tracking-wider font-semibold">
                Related Multimodal Studies (Patient Dossier)
              </span>
              <span className="font-clinical-data-mono font-medium">4 studies indexed</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs">
              {/* Thumb 1: Active Chest PA */}
              <div
                onClick={() => setSelectedStudyId("cxr")}
                className={`bg-surface-container-lowest p-1.5 rounded-lg shadow-sm flex flex-col gap-1 cursor-pointer transition-all ${
                  selectedStudyId === "cxr"
                    ? "ring-2 ring-primary"
                    : "hover:bg-surface-container"
                }`}
              >
                <div className="h-20 bg-inverse-surface rounded overflow-hidden relative flex items-center justify-center">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB30giBVxEtbQi98E8TgRDdu_CnDlxB2srhQu44ZCuABaNVmkdDPm3aHuFZh6ZZkQAwU2zHLTETDIB8fA99J1z6JkbjUvAMEorAFJ4bwWzvHXvY7ulCNBuLtG7ihzy1Ln_r17AcuF_bddefWwVOPoKEY2yfVXCqtPf2ybf3AkYaSFkLVYYcPMqpThW2Vqm66d7RzRaOC1tdc6hSc2Xb5zjzA7nWeAjTK_IO1SKPfqVuIE9-lUYOVEfl"
                    alt="Monochrome miniature thumbnail of PA chest x-ray"
                    className="h-full w-full object-cover opacity-90"
                  />
                  <span className="absolute top-1 left-1 bg-primary text-on-primary font-clinical-data-mono text-[9px] px-1 rounded font-bold">
                    ACTIVE
                  </span>
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-body-strong text-metadata-micro text-on-surface truncate font-semibold">
                    Chest PA View
                  </span>
                  <span className="font-clinical-data-mono text-[10px] text-on-surface-variant">
                    15-Nov 14:10
                  </span>
                </div>
              </div>

              {/* Thumb 2: Bedside 12-Lead ECG */}
              <div
                onClick={() => setSelectedStudyId("ecg")}
                className={`bg-surface-container-lowest p-1.5 rounded-lg shadow-sm flex flex-col gap-1 cursor-pointer transition-all ${
                  selectedStudyId === "ecg"
                    ? "ring-2 ring-primary"
                    : "hover:bg-surface-container"
                }`}
              >
                <div className="h-20 bg-[#0f172a] rounded overflow-hidden relative flex items-center justify-center p-1">
                  <div className="w-full h-8 flex items-center">
                    <svg className="w-full h-full text-error" viewBox="0 0 100 40">
                      <path
                        d="M0,20 L20,20 L25,5 L30,35 L35,10 Q45,8 60,20 L100,20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <span className="absolute top-1 left-1 bg-error text-on-error font-clinical-data-mono text-[9px] px-1 rounded font-bold">
                    ACUTE
                  </span>
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-body-strong text-metadata-micro text-on-surface truncate font-semibold">
                    Bedside 12-Lead ECG
                  </span>
                  <span className="font-clinical-data-mono text-[10px] text-error font-semibold">
                    Today 14:25 IST
                  </span>
                </div>
              </div>

              {/* Thumb 3: Prior Coronary Angiogram (2021) */}
              <div
                onClick={() => setSelectedStudyId("angio")}
                className={`bg-surface-container-lowest p-1.5 rounded-lg shadow-sm flex flex-col gap-1 cursor-pointer transition-all ${
                  selectedStudyId === "angio"
                    ? "ring-2 ring-primary"
                    : "hover:bg-surface-container"
                }`}
              >
                <div className="h-20 bg-inverse-surface rounded overflow-hidden relative flex items-center justify-center">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBklXCqjd_WYXSKRzIaG8WQE610h7Kp8c_VO5d3dxS930euAi9Ekap9EXzsZH36IYAtPDHh4qyQ0ZIiHaQevMnYttzFeNOdh7ii5220VHNsI86fNpltiUXvRJTMFBE0iGNVD_JDXIVScvyvhk_rN-VKS0mG7ESInc0jgNI6viU-REo0eU2VTXRBTrRd1jQoUU_IaPh-B-P86J5JPWjxURMvw6lS59FCj-iqxn79h3u8B0JFgXw1IwSa"
                    alt="Fluoroscopic coronary angiography cine run"
                    className="h-full w-full object-cover opacity-75"
                  />
                  <span className="absolute top-1 left-1 bg-surface-container-highest text-on-surface font-clinical-data-mono text-[9px] px-1 rounded font-bold">
                    2021 HIST
                  </span>
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-body-strong text-metadata-micro text-on-surface truncate font-semibold">
                    Coronary Angio (Cath)
                  </span>
                  <span className="font-clinical-data-mono text-[10px] text-on-surface-variant">
                    12-Jun-2021 · 40% LAD
                  </span>
                </div>
              </div>

              {/* Thumb 4: Emergency Echo Scheduled */}
              <div
                onClick={() => setSelectedStudyId("echo")}
                className={`bg-surface-container-lowest p-1.5 rounded-lg shadow-sm flex flex-col gap-1 cursor-pointer transition-all ${
                  selectedStudyId === "echo"
                    ? "ring-2 ring-primary"
                    : "hover:bg-surface-container"
                }`}
              >
                <div className="h-20 bg-surface-container-high rounded overflow-hidden relative flex flex-col items-center justify-center text-center p-1">
                  <span className="material-symbols-outlined text-secondary text-xl animate-pulse">
                    forward_to_inbox
                  </span>
                  <span className="font-clinical-data-mono text-[9px] text-on-surface-variant mt-1 font-semibold">
                    CATH BAY ECHO
                  </span>
                  <span className="absolute top-1 left-1 bg-secondary-container text-on-secondary-container font-clinical-data-mono text-[9px] px-1 rounded font-bold">
                    STAT
                  </span>
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-body-strong text-metadata-micro text-on-surface truncate font-semibold">
                    Bedside POCUS Echo
                  </span>
                  <span className="font-clinical-data-mono text-[10px] text-secondary font-semibold">
                    En Route to Cath
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANE: 45% width (5 of 12 cols = 41.7%) Certified Radiologist Report */}
        <div className="xl:col-span-5 flex flex-col gap-space-sm">
          {/* Primary Report Card Container */}
          <div className="w-full bg-surface-container-lowest rounded-xl shadow-md p-space-base flex flex-col gap-space-md">
            {/* Report Header & Status Pill */}
            <div className="flex items-start justify-between gap-space-sm flex-wrap">
              <div className="flex flex-col">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-lg">verified</span>
                  <h2 className="font-section-title text-section-title text-on-surface font-semibold">
                    Certified Diagnostic Report
                  </h2>
                </div>
                <span className="font-clinical-data text-metadata-micro text-on-surface-variant mt-0.5">
                  Apollo Diagnostic Imaging Network · PACS Ref #RPT-2025-99321
                </span>
              </div>
              <span className="bg-primary/10 text-primary font-body-strong text-metadata-micro px-2 py-1 rounded flex items-center gap-1 font-bold">
                <span className="material-symbols-outlined text-xs">done_all</span>
                <span>FINAL CERTIFIED</span>
              </span>
            </div>

            {/* Study Specification Grid */}
            <div className="bg-surface-container-low rounded-lg p-space-sm grid grid-cols-2 gap-space-xs text-clinical-data">
              <div>
                <span className="font-metadata-micro text-on-surface-variant uppercase block font-medium">
                  Exam / Procedure
                </span>
                <span className="font-body-strong text-on-surface font-semibold">
                  Chest Radiograph, Single PA View
                </span>
              </div>
              <div>
                <span className="font-metadata-micro text-on-surface-variant uppercase block font-medium">
                  Accession #
                </span>
                <span className="font-clinical-data-mono text-on-surface font-bold">
                  {currentStudy.acc}
                </span>
              </div>
              <div className="col-span-2 mt-1">
                <span className="font-metadata-micro text-on-surface-variant uppercase block font-medium">
                  Clinical Indication
                </span>
                <span className="font-body-default text-on-surface leading-relaxed">
                  Baseline pre-operative assessment &amp; atypical chest discomfort evaluation (2025). Clinical history of hypertension and dyslipidemia.
                </span>
              </div>
            </div>

            {/* Technical Findings Section (Structured Clinical Anatomy) */}
            <div className="flex flex-col gap-space-xs">
              <span className="font-metadata-micro text-outline uppercase tracking-wider font-semibold">
                Technical Anatomical Findings
              </span>
              <div className="flex flex-col gap-2 text-clinical-data">
                {/* Lungs */}
                <div className="bg-surface-container-low/50 p-space-xs rounded flex items-start gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-base shrink-0 mt-0.5">
                    file_copy
                  </span>
                  <div className="flex flex-col">
                    <span className="font-body-strong text-on-surface font-semibold">
                      Lungs &amp; Pleura:
                    </span>
                    <span className="text-on-surface-variant font-body-default leading-relaxed">
                      Clear bilaterally. No focal airspace consolidation, infiltrates, pneumothorax, or pleural effusion. Costophrenic sulci and cardiophrenic angles are sharp and normal.
                    </span>
                  </div>
                </div>

                {/* Heart & CTR */}
                <div className="bg-surface-container-low/50 p-space-xs rounded flex items-start gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-base shrink-0 mt-0.5">
                    favorite
                  </span>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-space-xs">
                      <span className="font-body-strong text-on-surface font-semibold">
                        Heart &amp; Pericardium:
                      </span>
                      <span className="bg-primary/15 text-primary text-[10px] font-clinical-data-mono px-1 rounded font-bold">
                        CTR: 0.46
                      </span>
                    </div>
                    <span className="text-on-surface-variant font-body-default leading-relaxed">
                      Cardiac silhouette is within normal limits of size and morphology. Transverse cardiothoracic ratio is normal (0.46). No evidence of chamber enlargement or pericardial calcification.
                    </span>
                  </div>
                </div>

                {/* Mediastinum & Hila */}
                <div className="bg-surface-container-low/50 p-space-xs rounded flex items-start gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-base shrink-0 mt-0.5">
                    schema
                  </span>
                  <div className="flex flex-col">
                    <span className="font-body-strong text-on-surface font-semibold">
                      Mediastinum &amp; Great Vessels:
                    </span>
                    <span className="text-on-surface-variant font-body-default leading-relaxed">
                      Mediastinal contours are normal. Trachea is midline. Aortic knob configuration is unremarkable without calcific ectasia. Hilar structures show normal vascular arborization without lymphadenopathy.
                    </span>
                  </div>
                </div>

                {/* Bones & Soft Tissues */}
                <div className="bg-surface-container-low/50 p-space-xs rounded flex items-start gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-base shrink-0 mt-0.5">
                    radiology
                  </span>
                  <div className="flex flex-col">
                    <span className="font-body-strong text-on-surface font-semibold">
                      Thoracic Cage &amp; Soft Tissues:
                    </span>
                    <span className="text-on-surface-variant font-body-default leading-relaxed">
                      Bony thorax intact. Visualized ribs, clavicles, and proximal humeri demonstrate normal bone mineral density without acute fracture or focal lytic or sclerotic lesions.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Radiologist Impression (High Contrast Highlight Box) */}
            <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-1">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-base">
                  assignment_turned_in
                </span>
                <span className="font-body-strong text-clinical-data text-on-surface font-semibold">
                  Radiologist Formal Impression
                </span>
              </div>
              <p className="font-body-strong text-clinical-data text-primary leading-relaxed pl-space-md font-medium">
                {currentStudy.impression}
              </p>
            </div>

            {/* Interpreting Physician Credentials & Digital Signature */}
            <div className="flex items-center justify-between bg-surface-bright p-space-sm rounded-lg shadow-sm flex-wrap gap-2">
              <div className="flex items-center gap-space-xs">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaYE5XIka6Y_1zMjkAuUc2ll2UkzFCWH_ysndQPmnTomX3vsi4w8PHEKOPapOrGdKIyB6AiLFX1YB9mft4bnYRMZRj_r6YZEHUoWggV_JNYqDhYpFqfSjWofGhbPSThMr0yXw-g_lRxeBUW1BI9tT3plHiNy-cHCGz4szOKtcvrg8IAFOuXzEuotCZclG1WfS5_pxnr0olNE-tDFXqiAWXg1QtM4PmRViu2F-rKuru5BLjdiNySsxh"
                  alt="Doctor"
                  className="h-9 w-9 rounded-full object-cover ring-1 ring-primary/20"
                />
                <div className="flex flex-col">
                  <span className="font-body-strong text-clinical-data text-on-surface leading-none font-semibold">
                    Dr. Sunita Kapoor, MD
                  </span>
                  <span className="font-metadata-micro text-on-surface-variant leading-tight mt-0.5">
                    Consultant Radiologist · Reg: DMC-2004-18290
                  </span>
                </div>
              </div>
              <div className="flex flex-col text-right">
                <span className="font-clinical-data-mono text-metadata-micro text-primary font-semibold flex items-center gap-1 justify-end">
                  <span className="material-symbols-outlined text-xs">check_circle</span>
                  <span>Digitally Signed &amp; Sealed</span>
                </span>
                <span className="font-clinical-data-mono text-[10px] text-on-surface-variant">
                  15-Nov-2025 15:40 IST (PACS Authenticated)
                </span>
              </div>
            </div>

            {/* Critical Acute Addendum / Emergency Note for STEMI */}
            <div className="bg-error-container/40 p-space-sm rounded-lg flex flex-col gap-1.5 shadow-sm">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <div className="flex items-center gap-space-xs text-error font-body-strong text-clinical-data font-bold">
                  <span className="material-symbols-outlined text-base">emergency_share</span>
                  <span>EMERGENCY CLINICAL ADDENDUM (14:30 IST)</span>
                </div>
                <span className="bg-error text-on-error font-clinical-data-mono text-[10px] px-1.5 py-0.2 rounded font-bold">
                  STAT PRIORITY
                </span>
              </div>
              <p className="font-body-default text-clinical-data text-on-surface-variant leading-relaxed">
                “Bedside Portable Chest X-Ray deferred pending immediate Cath Lab transfer for primary percutaneous coronary intervention (PCI) under Code STEMI protocol. Repeat chest imaging contraindicated to avoid reperfusion delay. Continuous telemetry monitoring active.”
              </p>
              <div className="flex items-center gap-space-sm text-metadata-micro text-on-surface-variant font-clinical-data-mono pt-1 flex-wrap">
                <span>
                  By: <strong>Dr. R. Verma (Lead Interventionalist)</strong>
                </span>
                <span>
                  Cath Lab 01 Prep: <strong className="text-primary font-bold">READY</strong>
                </span>
              </div>
            </div>

            {/* Bottom Action CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-space-xs pt-space-xs">
              <button
                onClick={() => triggerToast("Findings copied to active consultation encounter SOAP draft.")}
                className="w-full sm:flex-1 flex items-center justify-center gap-1.5 px-space-sm py-2 bg-primary text-on-primary font-body-strong text-clinical-data rounded-lg shadow hover:bg-surface-tint transition-colors cursor-pointer font-semibold"
              >
                <span className="material-symbols-outlined text-base">content_copy</span>
                <span>Copy Findings to Encounter</span>
              </button>
              <button
                onClick={() => setShow3dModal(true)}
                className="w-full sm:flex-1 flex items-center justify-center gap-1.5 px-space-sm py-2 bg-surface-container text-on-surface font-body-strong text-clinical-data rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer font-semibold"
              >
                <span className="material-symbols-outlined text-base">3d_rotation</span>
                <span>Launch 3D Web Viewer</span>
              </button>
              <button
                onClick={() => triggerToast("Study pushed to ABHA Health Locker with cryptographic patient consent.")}
                className="flex items-center justify-center p-2 bg-surface-container-low text-primary rounded-lg hover:bg-surface-container transition-colors shadow-sm cursor-pointer"
                title="Push to ABHA Health Locker (Patient Consent Granted)"
              >
                <span className="material-symbols-outlined text-lg">cloud_upload</span>
              </button>
            </div>
          </div>

          {/* Quick AI Diagnostic Provenance Attribution Box */}
          <div className="w-full bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex items-center justify-between">
            <div className="flex items-center gap-space-sm">
              <div className="h-8 w-8 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-base">smart_toy</span>
              </div>
              <div className="flex flex-col">
                <span className="font-body-strong text-clinical-data text-on-surface font-semibold">
                  AI Cardiothoracic Assistant
                </span>
                <span className="font-metadata-micro text-on-surface-variant">
                  Model RadCAD-v4.2 validated · 0.99 AUC Concordance with MD Report
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowAiAuditModal(true)}
              className="text-primary hover:text-surface-tint text-clinical-data font-body-strong flex items-center gap-1 cursor-pointer font-semibold"
            >
              <span>View Audit</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODAL 1: ORDER RADIOLOGY STUDY */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-inverse-surface/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-surface-container-high px-gutter-normal py-space-sm flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary">add_circle</span>
                <h3 className="font-section-title text-section-title font-semibold text-on-surface">
                  Order Diagnostic Radiology Study
                </h3>
              </div>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-gutter-normal flex flex-col gap-space-sm text-clinical-data">
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-on-surface text-metadata-micro uppercase">
                  Select Modality &amp; Protocol
                </label>
                <select className="p-2 bg-surface-container-low rounded border border-outline-variant font-clinical-data">
                  <option>Coronary Angiography (Primary PCI Cath Protocol - STAT)</option>
                  <option>Bedside 2D Echocardiogram (Handheld POCUS)</option>
                  <option>Portable Chest X-Ray (AP Bedside Single View)</option>
                  <option>Computed Tomography Coronary Angiogram (CTCA)</option>
                </select>
              </div>

              <div className="p-space-xs bg-primary-container/20 rounded flex items-center justify-between text-metadata-micro font-clinical-data-mono">
                <span className="text-primary font-semibold">eGFR: 98 mL/min (Contrast Safe)</span>
                <span className="text-on-surface-variant font-bold">NO ALLERGY OVERRIDE NEEDED FOR IODINATED</span>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-on-surface text-metadata-micro uppercase">
                  Clinical Indication / Urgent Justification
                </label>
                <textarea
                  rows={2}
                  defaultValue="Acute anterior STEMI with ongoing chest pain. Emergency coronary revascularization via right radial access."
                  className="p-2 bg-surface-container-low rounded border border-outline-variant"
                />
              </div>

              <div className="flex items-center justify-end gap-space-xs pt-space-xs">
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="px-space-md py-1.5 bg-surface-container-low text-on-surface rounded-lg font-clinical-data cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowOrderModal(false);
                    triggerToast("Radiology study ordered and transmitted to PACS scheduler!");
                  }}
                  className="px-space-md py-1.5 bg-primary text-on-primary rounded-lg font-body-strong text-clinical-data cursor-pointer"
                >
                  Confirm &amp; Transmit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: PACS FULL SCREEN VIEWER */}
      {showFullScreenModal && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black text-white p-space-sm animate-in fade-in duration-150">
          <div className="flex items-center justify-between px-4 py-2 bg-inverse-surface border-b border-outline-variant">
            <div className="flex items-center gap-4">
              <span className="font-clinical-data-mono text-sm font-bold text-primary-fixed">
                PACS FULL SCREEN DIAGNOSTIC CONSOLE · DCM-77180
              </span>
              <span className="text-xs text-surface-dim">Rahul Sharma (42M) · DEL-2024-8841</span>
            </div>
            <button
              onClick={() => setShowFullScreenModal(false)}
              className="px-3 py-1 bg-surface-container text-on-surface rounded hover:bg-surface-variant font-semibold cursor-pointer"
            >
              Exit Full Screen
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center overflow-hidden p-4 relative">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8IZUGe5Uo6y-G0EznZiDcp5n13eiHXD1kcAFmwZSTPnnDjWkdzCV4lc5Y807N1MtSbmrH0D7ypmae9LZUu7B1DTqeQPECqJMQoQKOX8RAdkXsJh45mvYxC5Z5wNyarUA3DPcW4THm_yY-zXmbC5UOQ2KAJd5v4GEy7BeNbP_f7qAXEMHcJw8xlQNfY_mVe5NO5p27UxjH8nkpPVS12geRhGsamY45g96RunzBkaGKVfet0dNd5VAw"
              alt="High-Res PA Radiograph"
              className="h-full w-auto object-contain filter contrast-125"
            />
            <div className="absolute top-8 left-8 font-clinical-data-mono text-xs text-primary-fixed">
              R · KVp 120 · PA UPRIGHT · APOLLO HOSPITAL INDRAPRASTHA
            </div>
            <div className="absolute bottom-8 right-8 font-clinical-data-mono text-xs text-primary-fixed">
              L · DR. S. KAPOOR · CTR: 0.46 NORMAL
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CHRONOLOGICAL COMPARISON */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-inverse-surface/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-surface-container-lowest w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-surface-container-high px-gutter-normal py-space-sm flex items-center justify-between">
              <h3 className="font-section-title text-section-title font-semibold text-on-surface">
                Chronological Multimodal Comparison
              </h3>
              <button
                onClick={() => setShowCompareModal(false)}
                className="text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-gutter-normal grid grid-cols-1 md:grid-cols-2 gap-space-md overflow-y-auto">
              <div className="flex flex-col bg-inverse-surface rounded-lg p-2 text-inverse-on-surface">
                <span className="font-clinical-data-mono text-xs text-primary-fixed font-bold mb-1">
                  12-Jun-2021 · Prior Coronary Angiogram
                </span>
                <div className="h-64 flex items-center justify-center bg-black rounded overflow-hidden">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBklXCqjd_WYXSKRzIaG8WQE610h7Kp8c_VO5d3dxS930euAi9Ekap9EXzsZH36IYAtPDHh4qyQ0ZIiHaQevMnYttzFeNOdh7ii5220VHNsI86fNpltiUXvRJTMFBE0iGNVD_JDXIVScvyvhk_rN-VKS0mG7ESInc0jgNI6viU-REo0eU2VTXRBTrRd1jQoUU_IaPh-B-P86J5JPWjxURMvw6lS59FCj-iqxn79h3u8B0JFgXw1IwSa"
                    alt="2021 Angiogram"
                    className="h-full object-contain opacity-80"
                  />
                </div>
                <span className="text-metadata-micro text-surface-dim mt-2">
                  40% mid-LAD plaque. Preserved distal lumen flow.
                </span>
              </div>

              <div className="flex flex-col bg-inverse-surface rounded-lg p-2 text-inverse-on-surface">
                <span className="font-clinical-data-mono text-xs text-error font-bold mb-1">
                  Today 14:25 IST · Acute 12-Lead ECG STEMI
                </span>
                <div className="h-64 flex flex-col justify-center bg-[#0a1219] rounded p-2 overflow-hidden">
                  <svg className="w-full h-32 text-error" fill="none" viewBox="0 0 400 80">
                    <path
                      d="M 0,40 L 40,40 L 50,40 L 55,60 L 62,8 L 70,70 L 78,25 Q 100,22 130,28 L 150,40 L 200,40 L 210,40 L 215,60 L 222,8 L 230,70 L 238,25 Q 260,22 290,28 L 310,40 L 400,40"
                      stroke="#ff5449"
                      strokeWidth="2.5"
                    />
                  </svg>
                  <span className="text-error text-center font-clinical-data-mono text-xs font-bold mt-2">
                    Acute Thrombotic Progression at prior LAD lesion site
                  </span>
                </div>
                <span className="text-metadata-micro text-surface-dim mt-2">
                  Culprit lesion: Proximal-to-mid LAD 100% acute thrombotic occlusion.
                </span>
              </div>
            </div>
            <div className="p-space-sm bg-surface-container-low flex justify-end">
              <button
                onClick={() => setShowCompareModal(false)}
                className="px-space-md py-1.5 bg-primary text-on-primary rounded font-semibold cursor-pointer"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: 3D WEB VIEWER */}
      {show3dModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-inverse-surface/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-surface-container-lowest w-full max-w-xl rounded-xl shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-surface-container-high px-gutter-normal py-space-sm flex items-center justify-between">
              <h3 className="font-section-title text-section-title font-semibold text-on-surface flex items-center gap-1">
                <span className="material-symbols-outlined text-primary">3d_rotation</span>
                <span>3D Volume Rendering Console</span>
              </h3>
              <button
                onClick={() => setShow3dModal(false)}
                className="text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-gutter-normal flex flex-col items-center justify-center bg-black h-80 relative">
              <div className="w-48 h-48 rounded-full border-2 border-primary/50 flex items-center justify-center animate-spin">
                <span className="material-symbols-outlined text-primary text-6xl">favorite</span>
              </div>
              <span className="absolute bottom-4 font-clinical-data-mono text-xs text-primary-fixed">
                Reconstructing 3D Coronary Tree &amp; Thoracic Cage (WebGL / Three.js)
              </span>
            </div>
            <div className="p-space-sm bg-surface-container-low flex justify-end">
              <button
                onClick={() => setShow3dModal(false)}
                className="px-space-md py-1.5 bg-primary text-on-primary rounded font-semibold cursor-pointer"
              >
                Close 3D Viewer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: AI AUDIT TRAIL */}
      {showAiAuditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-inverse-surface/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-surface-container-high px-gutter-normal py-space-sm flex items-center justify-between">
              <h3 className="font-section-title text-section-title font-semibold text-on-surface flex items-center gap-1">
                <span className="material-symbols-outlined text-primary">smart_toy</span>
                <span>RadCAD-v4.2 Algorithmic Provenance Audit</span>
              </h3>
              <button
                onClick={() => setShowAiAuditModal(false)}
                className="text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-gutter-normal flex flex-col gap-space-sm text-clinical-data">
              <div className="p-3 bg-surface-container-low rounded-lg font-clinical-data-mono text-metadata-micro leading-relaxed">
                <div>Model ID: RadCAD-DenseNet121-v4.2-FDA-Cleared</div>
                <div>Training Set: 140,000 Verified Posteroanterior Radiographs</div>
                <div>Validation AUC: 0.992 (Cardiomegaly), 0.988 (Pneumothorax)</div>
                <div>Inference Time: 34ms @ NVIDIA TensorRT Tensor Core</div>
                <div>Confidence Metric: 99.4% concordance with Dr. Sunita Kapoor MD</div>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setShowAiAuditModal(false)}
                  className="px-space-md py-1.5 bg-primary text-on-primary rounded font-semibold cursor-pointer"
                >
                  Close Audit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
