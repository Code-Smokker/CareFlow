"use client";

import React, { useState } from "react";
import Link from "next/link";

interface TrajectoryPoint {
  date: string;
  value: number;
  label: string;
  note: string;
  x: number;
  y: number;
  isCurrent?: boolean;
}

const HBA1C_POINTS: TrajectoryPoint[] = [
  {
    date: "10-Mar-2024",
    value: 7.2,
    label: "7.2%",
    note: "Metformin 500mg BID",
    x: 120,
    y: 106,
  },
  {
    date: "15-Aug-2025",
    value: 7.5,
    label: "7.5%",
    note: "Routine OPD Follow-up",
    x: 390,
    y: 85,
  },
  {
    date: "04-Jul-2026",
    value: 7.8,
    label: "7.8% [CURRENT]",
    note: "STEMI Admission Draw",
    x: 630,
    y: 55,
    isCurrent: true,
  },
];

export default function LaboratoryTrajectoryPage() {
  const [isLogScale, setIsLogScale] = useState<boolean>(false);
  const [selectedPoint, setSelectedPoint] = useState<TrajectoryPoint | null>(HBA1C_POINTS[2]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [showPdfModal, setShowPdfModal] = useState<boolean>(false);
  const [showRuleModal, setShowRuleModal] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  const handleDownloadCsv = () => {
    const csvContent =
      "Date,HbA1c_Percentage,Status,ClinicalNote\n" +
      HBA1C_POINTS.map((p) => `"${p.date}",${p.value},"${p.isCurrent ? "Current" : "Historical"}","${p.note}"`).join(
        "\n"
      );
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Rahul_Sharma_HbA1c_Trajectory.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast("HbA1c trajectory dataset exported (CSV).");
  };

  return (
    <div className="flex flex-col w-full gap-space-md">
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

      {/* TOP BREADCRUMB & QUICK ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
        <div className="flex items-center gap-space-xs text-on-surface-variant flex-wrap">
          <span className="font-metadata-micro text-metadata-micro uppercase tracking-wider text-outline font-semibold">
            Clinical Workspace
          </span>
          <span className="material-symbols-outlined text-xs text-outline">chevron_right</span>
          <Link
            href="/pharmacy-lab"
            className="font-metadata-micro text-metadata-micro uppercase tracking-wider text-outline hover:text-primary font-semibold transition-colors"
          >
            Investigations
          </Link>
          <span className="material-symbols-outlined text-xs text-outline">chevron_right</span>
          <span className="font-clinical-data text-clinical-data text-primary font-semibold">
            Laboratory Trajectory &amp; Assay Inspector
          </span>
        </div>

        <div className="flex items-center gap-space-xs flex-wrap">
          <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant bg-surface-container px-space-xs py-0.5 rounded font-semibold">
            LIS-SYNC: INSTANT
          </span>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1 px-space-sm py-1 bg-surface-container-lowest text-on-surface font-clinical-data text-clinical-data rounded shadow-sm hover:bg-surface-container transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm text-outline">print</span>
            <span>Print Flowsheet</span>
          </button>
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-1 px-space-sm py-1 bg-surface-container-lowest text-on-surface font-clinical-data text-clinical-data rounded shadow-sm hover:bg-surface-container transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm text-outline">share</span>
            <span>Share FHIR DiagnosticReport</span>
          </button>
        </div>
      </div>

      {/* PERSISTENT PATIENT SAFETY BANNER */}
      <div className="bg-surface-container-lowest rounded-lg shadow-sm flex flex-col overflow-hidden">
        {/* Red Flag Strip */}
        <div className="bg-error text-on-error px-space-panel-padding py-1.5 flex flex-wrap items-center justify-between gap-space-xs">
          <div className="flex items-center gap-space-xs flex-wrap">
            <span className="material-symbols-outlined text-base animate-pulse">crisis_alert</span>
            <span className="font-body-strong text-body-strong uppercase tracking-wide font-semibold">
              RED FLAG ALERT: Suspected Acute Anterior STEMI
            </span>
            <span className="font-metadata-micro text-metadata-micro bg-error-container text-on-error-container px-1.5 py-0.5 rounded-sm ml-space-xs font-clinical-data-mono font-bold">
              Triage: P1-Immediate
            </span>
          </div>
          <div className="flex items-center gap-space-md flex-wrap">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">warning</span>
              <span className="font-clinical-data text-clinical-data font-semibold">CRITICAL ALLERGIES:</span>
              <span className="font-clinical-data-mono text-clinical-data bg-on-error/20 px-1.5 py-0.5 rounded font-bold">
                Penicillin
              </span>
              <span className="font-clinical-data-mono text-clinical-data bg-on-error/20 px-1.5 py-0.5 rounded font-bold">
                Aspirin
              </span>
            </div>
            <span className="font-clinical-data-mono text-metadata-micro text-on-error/80 font-medium">
              Cath Lab Prep: STAGE 2 ACTIVATED
            </span>
          </div>
        </div>

        {/* Patient Context Details */}
        <div className="p-space-panel-padding flex flex-wrap items-center justify-between gap-space-md bg-surface-container-lowest">
          <div className="flex items-center gap-space-md min-w-0">
            <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-section-title text-section-title font-bold shrink-0">
              RS
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-space-sm flex-wrap">
                <h1 className="font-page-title text-page-title text-on-surface font-semibold">
                  Rahul Sharma
                </h1>
                <span className="font-clinical-data-mono text-clinical-data text-on-surface-variant bg-surface-container px-space-xs py-0.5 rounded font-medium">
                  42 Y / Male
                </span>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-xs">verified</span>
                  <span className="font-clinical-data-mono text-metadata-micro font-semibold">
                    ABHA M3 VERIFIED
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-space-md gap-y-0.5 text-on-surface-variant mt-0.5 font-clinical-data-mono text-metadata-micro">
                <span>
                  UHID: <strong className="text-on-surface font-semibold">DEL-2024-8841</strong>
                </span>
                <span>·</span>
                <span>
                  ABHA ID: <strong className="text-on-surface font-semibold">91-8842-1920-4491</strong>
                </span>
                <span>·</span>
                <span>
                  OPD Token: <strong className="text-on-surface font-semibold">#104 (Station 07)</strong>
                </span>
                <span>·</span>
                <span>
                  Bed/Unit: <strong className="text-primary font-semibold">ICCU-Bed 04</strong>
                </span>
                <span>·</span>
                <span>
                  Attending: <strong className="text-on-surface font-semibold">Dr. R. Verma (Cardiology)</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-space-sm shrink-0 flex-wrap">
            <div className="flex flex-col items-end text-right">
              <span className="font-metadata-micro text-metadata-micro text-outline font-medium">
                Current Glycemic State
              </span>
              <span className="font-clinical-data-mono text-clinical-data text-error font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">trending_up</span> HbA1c 7.8% (eAG 177 mg/dL)
              </span>
            </div>
            <button
              onClick={() => triggerToast("Added HbA1c 7.8% trajectory finding to active encounter note.")}
              className="h-9 px-space-md bg-primary text-on-primary rounded font-clinical-data text-clinical-data flex items-center gap-1.5 shadow-sm hover:bg-primary-container transition-colors cursor-pointer font-semibold"
            >
              <span className="material-symbols-outlined text-sm">assignment_add</span>
              <span>Add to Encounter</span>
            </button>
          </div>
        </div>
      </div>

      {/* SPLIT-PANE CLINICAL DIAGNOSTIC INSPECTOR */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-md items-start">
        {/* LEFT PANE (approx 60% width -> 7 cols on 12-col grid) */}
        <div className="xl:col-span-7 flex flex-col gap-space-md min-w-0">
          {/* Primary Assay Card */}
          <div className="bg-surface-container-lowest rounded-lg shadow-sm p-space-panel-padding flex flex-col gap-space-md">
            {/* Header & LOINC Metadata */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-space-sm">
              <div className="flex flex-col">
                <div className="flex items-center gap-space-xs">
                  <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary-container font-clinical-data-mono text-metadata-micro font-semibold uppercase">
                    Quantitative Chemistry
                  </span>
                  <span className="font-clinical-data-mono text-metadata-micro text-outline">
                    Panel: Metabolic · Endocrine
                  </span>
                </div>
                <h2 className="font-chief-complaint text-page-title text-on-surface mt-1 font-semibold">
                  Glycated Hemoglobin (HbA1c)
                </h2>
                <p className="font-metadata-micro text-metadata-micro text-on-surface-variant flex items-center gap-1 mt-0.5 flex-wrap">
                  <span>
                    LOINC: <strong>4548-4</strong>
                  </span>
                  <span>·</span>
                  <span>
                    Method: <strong>Ion-Exchange HPLC (NGSP Certified)</strong>
                  </span>
                  <span>·</span>
                  <span className="text-primary font-semibold">Apollo Central Reference Pathology</span>
                </p>
              </div>

              <div className="flex items-center gap-space-xs">
                <button
                  onClick={() => {
                    setIsLogScale(!isLogScale);
                    triggerToast(`Scale switched to ${!isLogScale ? "Logarithmic" : "Linear"}.`);
                  }}
                  className={`p-1.5 rounded transition-colors cursor-pointer ${
                    isLogScale
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant"
                  }`}
                  title="Toggle Logarithmic Scale"
                >
                  <span className="material-symbols-outlined text-base">tune</span>
                </button>
                <button
                  onClick={handleDownloadCsv}
                  className="p-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface-variant rounded transition-colors cursor-pointer"
                  title="Download Graph Dataset (CSV)"
                >
                  <span className="material-symbols-outlined text-base">download</span>
                </button>
              </div>
            </div>

            {/* Current Value Hero & Metric Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
              {/* Primary Metric Box */}
              <div className="sm:col-span-2 bg-surface-container-low rounded p-space-md flex flex-col justify-between">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <span className="font-table-header text-table-header uppercase text-outline font-semibold">
                    Current Verified Baseline
                  </span>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-clinical-data-mono text-metadata-micro font-bold">
                    <span className="material-symbols-outlined text-xs">priority_high</span>
                    <span>SUB-OPTIMAL GLYCEMIC CONTROL</span>
                  </span>
                </div>
                <div className="flex items-baseline gap-space-sm my-space-xs">
                  <span className="font-chief-complaint text-chief-complaint text-error font-bold tracking-tight">
                    7.8
                  </span>
                  <span className="font-section-title text-section-title text-on-surface-variant font-semibold">
                    %
                  </span>
                  <span className="font-clinical-data-mono text-clinical-data text-error font-semibold flex items-center ml-2">
                    <span className="material-symbols-outlined text-base">arrow_upward</span> +0.3% vs Prior OPD
                  </span>
                </div>
                {/* Range Bounds Bar */}
                <div className="flex flex-col gap-1">
                  <div className="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden flex">
                    <div className="bg-primary h-full" style={{ width: "35%" }} title="Non-Diabetic: <5.7%"></div>
                    <div className="bg-secondary-container h-full" style={{ width: "25%" }} title="Target Zone: 5.7 - 6.5%"></div>
                    <div className="bg-error h-full" style={{ width: "40%" }} title="Elevated / Action Required: >6.5%"></div>
                  </div>
                  <div className="flex items-center justify-between font-clinical-data-mono text-[10px] text-outline pt-0.5 flex-wrap">
                    <span>Normal (&lt;5.7%)</span>
                    <span>Target (&lt;6.5%)</span>
                    <span className="text-error font-bold">Current: 7.8%</span>
                    <span>Critical (&gt;8.0%)</span>
                  </div>
                </div>
              </div>

              {/* Secondary Metric: eAG */}
              <div className="bg-surface-container-low rounded p-space-md flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="font-table-header text-table-header uppercase text-outline font-semibold">
                    Estimated Avg Glucose
                  </span>
                  <span className="material-symbols-outlined text-base text-outline">water_drop</span>
                </div>
                <div className="flex flex-col my-space-xs">
                  <div className="flex items-baseline gap-1">
                    <span className="font-page-title text-page-title text-on-surface font-bold">177</span>
                    <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">mg/dL</span>
                  </div>
                  <span className="font-clinical-data-mono text-clinical-data text-on-surface-variant font-medium">
                    9.8 mmol/L
                  </span>
                </div>
                <div className="font-metadata-micro text-metadata-micro text-on-surface-variant bg-surface-container-lowest p-1.5 rounded font-clinical-data-mono">
                  Formula: 28.7 × HbA1c − 46.7
                </div>
              </div>
            </div>

            {/* Multi-Year Longitudinal Trajectory Visualization (Clean SVG) */}
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-space-xs">
                  <span className="font-section-title text-subheading text-on-surface font-semibold">
                    Longitudinal Assay Trajectory
                  </span>
                  <span className="font-metadata-micro text-metadata-micro text-error font-clinical-data-mono bg-error/10 px-2 py-0.5 rounded font-bold">
                    Ascending Glycemic Drift: +0.6% over 28 Months
                  </span>
                </div>
                <div className="flex items-center gap-space-md font-clinical-data text-metadata-micro text-on-surface-variant">
                  <span className="flex items-center gap-1 font-medium">
                    <span className="h-2 w-2 rounded-full bg-primary inline-block"></span> Safe Zone (&lt;6.5%)
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <span className="h-2 w-2 rounded-full bg-error inline-block"></span> Uncontrolled Drift
                  </span>
                </div>
              </div>

              {/* Interactive SVG Area */}
              <div className="w-full bg-surface-container-low rounded-lg p-space-md relative overflow-hidden">
                <svg className="w-full h-56 overflow-visible" preserveAspectRatio="none" viewBox="0 0 740 240">
                  <defs>
                    <linearGradient id="driftGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#ba1a1a" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#ba1a1a" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="targetZone" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#0f766e" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#0f766e" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>

                  {/* Safe Band (<6.5% zone: from Y=130 to Y=200) */}
                  <rect fill="url(#targetZone)" height="70" rx="4" width="650" x="50" y="130" />
                  <line
                    stroke="#005c55"
                    strokeDasharray="3 3"
                    strokeOpacity="0.6"
                    strokeWidth="1.5"
                    x1="50"
                    x2="700"
                    y1="130"
                    y2="130"
                  />
                  <text className="font-clinical-data-mono text-[10px] font-semibold" fill="#005c55" x="56" y="124">
                    ADA/RSSDI Target Bound (6.5%)
                  </text>

                  {/* Severe Action Threshold (>8.0% zone: Y=40) */}
                  <line
                    stroke="#ba1a1a"
                    strokeDasharray="4 4"
                    strokeOpacity="0.4"
                    strokeWidth="1.5"
                    x1="50"
                    x2="700"
                    y1="40"
                    y2="40"
                  />
                  <text className="font-clinical-data-mono text-[10px] font-semibold" fill="#ba1a1a" x="56" y="34">
                    Action Threshold (8.0%)
                  </text>

                  {/* Grid Horizontal Reference Lines */}
                  <line stroke="#d7e4f0" strokeWidth="1" x1="50" x2="700" y1="85" y2="85" />

                  {/* Y-Axis Labels */}
                  <text className="font-clinical-data-mono text-[11px]" fill="#6e7977" textAnchor="end" x="35" y="44">
                    8.0%
                  </text>
                  <text className="font-clinical-data-mono text-[11px]" fill="#6e7977" textAnchor="end" x="35" y="89">
                    7.5%
                  </text>
                  <text className="font-clinical-data-mono text-[11px]" fill="#6e7977" textAnchor="end" x="35" y="134">
                    6.5%
                  </text>
                  <text className="font-clinical-data-mono text-[11px]" fill="#6e7977" textAnchor="end" x="35" y="180">
                    5.7%
                  </text>

                  {/* Trajectory Area fill */}
                  <path d="M 120 106 L 390 85 L 630 55 L 630 200 L 120 200 Z" fill="url(#driftGradient)" />

                  {/* Trajectory Line */}
                  <path
                    d="M 120 106 L 390 85 L 630 55"
                    fill="none"
                    stroke="#ba1a1a"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                  />

                  {/* Event Node 1: 10-Mar-2024 (7.2%) */}
                  <g
                    className="cursor-pointer group"
                    onClick={() => {
                      setSelectedPoint(HBA1C_POINTS[0]);
                      triggerToast("Selected point: 10-Mar-2024 (7.2% - Metformin 500mg BID)");
                    }}
                  >
                    <line stroke="#d7e4f0" strokeDasharray="2 2" strokeWidth="1" x1="120" x2="120" y1="106" y2="200" />
                    <circle cx="120" cy="106" fill="#ffffff" r="6" stroke="#ba1a1a" strokeWidth="3" />
                    <text
                      className="font-clinical-data-mono text-[12px] font-bold"
                      fill="#101d25"
                      textAnchor="middle"
                      x="120"
                      y="94"
                    >
                      7.2%
                    </text>
                    <text
                      className="font-clinical-data-mono text-[11px] font-semibold"
                      fill="#3e4947"
                      textAnchor="middle"
                      x="120"
                      y="218"
                    >
                      10-Mar-2024
                    </text>
                    <text className="font-metadata-micro text-[10px]" fill="#6e7977" textAnchor="middle" x="120" y="232">
                      Metformin 500mg BID
                    </text>
                  </g>

                  {/* Event Node 2: 15-Aug-2025 (7.5%) */}
                  <g
                    className="cursor-pointer group"
                    onClick={() => {
                      setSelectedPoint(HBA1C_POINTS[1]);
                      triggerToast("Selected point: 15-Aug-2025 (7.5% - Routine Follow-up)");
                    }}
                  >
                    <line stroke="#d7e4f0" strokeDasharray="2 2" strokeWidth="1" x1="390" x2="390" y1="85" y2="200" />
                    <circle cx="390" cy="85" fill="#ffffff" r="6" stroke="#ba1a1a" strokeWidth="3" />
                    <text
                      className="font-clinical-data-mono text-[12px] font-bold"
                      fill="#101d25"
                      textAnchor="middle"
                      x="390"
                      y="73"
                    >
                      7.5%
                    </text>
                    <text
                      className="font-clinical-data-mono text-[11px] font-semibold"
                      fill="#3e4947"
                      textAnchor="middle"
                      x="390"
                      y="218"
                    >
                      15-Aug-2025
                    </text>
                    <text className="font-metadata-micro text-[10px]" fill="#6e7977" textAnchor="middle" x="390" y="232">
                      Routine OPD Follow-up
                    </text>
                  </g>

                  {/* Event Node 3: 04-Jul-2026 (7.8% CURRENT) */}
                  <g
                    className="cursor-pointer group"
                    onClick={() => {
                      setSelectedPoint(HBA1C_POINTS[2]);
                      triggerToast("Selected point: 04-Jul-2026 (7.8% - STEMI Admission Draw)");
                    }}
                  >
                    <line stroke="#ba1a1a" strokeDasharray="2 2" strokeWidth="1.5" x1="630" x2="630" y1="55" y2="200" />
                    <circle cx="630" cy="55" fill="#ba1a1a" r="8" stroke="#ffffff" strokeWidth="2.5" />
                    <circle
                      className="animate-ping"
                      cx="630"
                      cy="55"
                      fill="none"
                      opacity="0.4"
                      r="13"
                      stroke="#ba1a1a"
                      strokeWidth="1"
                    />
                    <text
                      className="font-clinical-data-mono text-[13px] font-bold"
                      fill="#ba1a1a"
                      textAnchor="middle"
                      x="630"
                      y="42"
                    >
                      7.8% [CURRENT]
                    </text>
                    <text
                      className="font-clinical-data-mono text-[11px] font-bold"
                      fill="#ba1a1a"
                      textAnchor="middle"
                      x="630"
                      y="218"
                    >
                      04-Jul-2026
                    </text>
                    <text
                      className="font-metadata-micro text-[10px] font-semibold"
                      fill="#ba1a1a"
                      textAnchor="middle"
                      x="630"
                      y="232"
                    >
                      STEMI Admission Draw
                    </text>
                  </g>
                </svg>
              </div>
            </div>

            {/* Selected Point Focus Pill */}
            {selectedPoint && (
              <div className="bg-primary/5 border border-primary/20 rounded p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">insights</span>
                  <span className="text-clinical-data text-on-surface">
                    Selected Data Point: <strong>{selectedPoint.date}</strong> — <span className="font-bold text-primary">{selectedPoint.label}</span> ({selectedPoint.note})
                  </span>
                </div>
                <span className="text-metadata-micro text-outline font-clinical-data-mono">{selectedPoint.value}% HbA1c</span>
              </div>
            )}

            {/* Specimen & Provenance Chain Accordion Card */}
            <div className="bg-surface-container rounded p-space-md flex flex-col gap-space-xs">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <span className="font-table-header text-table-header text-on-surface uppercase tracking-wider flex items-center gap-1.5 font-semibold">
                  <span className="material-symbols-outlined text-sm text-primary">fingerprint</span>
                  <span>Specimen Chain of Custody &amp; LIS Provenance</span>
                </span>
                <span className="font-clinical-data-mono text-metadata-micro text-primary font-semibold">
                  HL7 v2.5 / FHIR Compliant
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-space-sm pt-1">
                <div className="flex flex-col">
                  <span className="font-metadata-micro text-metadata-micro text-outline">Sample Collection</span>
                  <span className="font-clinical-data-mono text-clinical-data text-on-surface font-semibold">
                    04-Jul-2026 · 08:30 IST
                  </span>
                  <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    10h Fasting Verified
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-metadata-micro text-metadata-micro text-outline">Specimen Identifier</span>
                  <span className="font-clinical-data-mono text-clinical-data text-on-surface font-semibold">
                    SPEC-88210-BLD
                  </span>
                  <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    Whole Blood (EDTA Vacutainer)
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-metadata-micro text-metadata-micro text-outline">Ingestion Ingress</span>
                  <span className="font-clinical-data-mono text-clinical-data text-on-surface font-semibold">
                    Direct LIS Bridge
                  </span>
                  <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    DiagnosticReport #DR-99214
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-metadata-micro text-metadata-micro text-outline">Signing Pathologist</span>
                  <span className="font-clinical-data-mono text-clinical-data text-on-surface font-semibold">
                    Dr. Anjali Nair, MD
                  </span>
                  <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    Reg: MCI-2011-94812
                  </span>
                </div>
              </div>
            </div>

            {/* Associated Metabolic Observations (Same Blood Draw) */}
            <div className="flex flex-col gap-space-xs mt-space-xs">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <h3 className="font-section-title text-subheading text-on-surface font-semibold">
                  Associated Metabolic Profile (Simultaneous Draw: 08:30 IST)
                </h3>
                <span className="font-metadata-micro text-metadata-micro text-outline">
                  EDTA + Fluoride/Serum Tubes
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm">
                {/* Observation 1: Fasting Glucose */}
                <div className="bg-surface-container-low p-space-sm rounded flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-clinical-data text-clinical-data font-semibold text-on-surface">
                      Fasting Plasma Glucose
                    </span>
                    <span className="font-clinical-data-mono text-[10px] px-1.5 py-0.5 rounded bg-error/15 text-error font-bold">
                      HIGH
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 my-1">
                    <span className="font-section-title text-section-title text-error font-bold font-clinical-data-mono">
                      162
                    </span>
                    <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">mg/dL</span>
                  </div>
                  <div className="flex items-center justify-between text-on-surface-variant font-clinical-data-mono text-metadata-micro">
                    <span>Ref: 70 - 99 mg/dL</span>
                    <span className="text-error font-semibold">↑ +63 mg/dL</span>
                  </div>
                </div>

                {/* Observation 2: Serum LDL */}
                <div className="bg-surface-container-low p-space-sm rounded flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-clinical-data text-clinical-data font-semibold text-on-surface">
                      Serum LDL Cholesterol
                    </span>
                    <span className="font-clinical-data-mono text-[10px] px-1.5 py-0.5 rounded bg-error/15 text-error font-bold">
                      HIGH
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 my-1">
                    <span className="font-section-title text-section-title text-error font-bold font-clinical-data-mono">
                      152
                    </span>
                    <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">mg/dL</span>
                  </div>
                  <div className="flex items-center justify-between text-on-surface-variant font-clinical-data-mono text-metadata-micro">
                    <span>Ref: &lt;100 (CAD: &lt;55)</span>
                    <span className="text-error font-semibold">↑ Severe Risk</span>
                  </div>
                </div>

                {/* Observation 3: Triglycerides */}
                <div className="bg-surface-container-low p-space-sm rounded flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-clinical-data text-clinical-data font-semibold text-on-surface">
                      Serum Triglycerides
                    </span>
                    <span className="font-clinical-data-mono text-[10px] px-1.5 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-bold">
                      BORDERLINE
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 my-1">
                    <span className="font-section-title text-section-title text-on-surface font-bold font-clinical-data-mono">
                      190
                    </span>
                    <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">mg/dL</span>
                  </div>
                  <div className="flex items-center justify-between text-on-surface-variant font-clinical-data-mono text-metadata-micro">
                    <span>Ref: &lt;150 mg/dL</span>
                    <span className="text-secondary font-semibold">Moderate Elevation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANE (approx 40% width -> 5 cols on 12-col grid) */}
        <div className="xl:col-span-5 flex flex-col gap-space-md min-w-0">
          {/* Clinical Synthesis & CAD Correlation Card */}
          <div className="bg-surface-container-lowest rounded-lg shadow-sm p-space-panel-padding flex flex-col gap-space-md">
            {/* Assistant Context Header */}
            <div className="flex items-center justify-between pb-space-xs">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-xl">clinical_notes</span>
                <div>
                  <h3 className="font-section-title text-subheading text-on-surface font-bold">
                    Clinical Synthesis &amp; Decision Support
                  </h3>
                  <span className="font-metadata-micro text-metadata-micro text-outline">
                    Clinician Reviewable · Non-Autonomous Reasoning
                  </span>
                </div>
              </div>
              <span className="font-clinical-data-mono text-metadata-micro px-2 py-0.5 bg-primary/10 text-primary font-semibold rounded">
                EHR-AI v2.4
              </span>
            </div>

            {/* Synthesis Body Callout */}
            <div className="bg-surface-container-low p-space-md rounded-lg flex flex-col gap-space-sm">
              <div className="flex items-center gap-1.5 text-primary">
                <span className="material-symbols-outlined text-base">analytics</span>
                <span className="font-body-strong text-clinical-data font-semibold">
                  Glycemic Progression in CAD Context
                </span>
              </div>
              <p className="font-body-default text-clinical-data text-on-surface leading-relaxed">
                Progressive elevation in HbA1c (<strong className="text-error">7.8%</strong> vs prior 7.2%) accelerates endothelial dysfunction and microvascular coronary resistance. In the acute setting of <strong>Anterior STEMI</strong>, acute stress hyperglycemia combined with baseline insulin resistance increases the risk of no-reflow phenomenon and infarct expansion.
              </p>
              <div className="p-space-sm bg-surface-container rounded font-clinical-data text-metadata-micro text-on-surface-variant flex flex-col gap-1">
                <span className="font-bold text-on-surface">Target Protocol:</span>
                <span>
                  Maintain strict peri-procedural capillary blood glucose target:{" "}
                  <strong>140 – 180 mg/dL (7.8 – 10.0 mmol/L)</strong>. Avoid hypoglycemia (&lt;70 mg/dL).
                </span>
              </div>
            </div>

            {/* Evidence Citations */}
            <div className="flex flex-col gap-space-xs">
              <span className="font-table-header text-table-header uppercase text-outline font-semibold">
                Clinical Evidence &amp; Provenance Citations
              </span>

              {/* Citation 1 */}
              <div
                onClick={() => setShowPdfModal(true)}
                className="bg-surface-container p-space-sm rounded flex items-center justify-between hover:bg-surface-container-high cursor-pointer transition-colors group"
              >
                <div className="flex items-start gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-base mt-0.5">description</span>
                  <div className="flex flex-col">
                    <span className="font-clinical-data text-clinical-data text-on-surface font-semibold group-hover:text-primary transition-colors">
                      [Source 1] Apollo Central Lab Report #LAB-77218
                    </span>
                    <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                      Sample: EDTA Whole Blood · Spectrophotometric Verification (Page 1)
                    </span>
                  </div>
                </div>
                <button className="flex items-center gap-1 text-primary font-clinical-data text-metadata-micro font-semibold hover:underline">
                  <span>Inspect PDF</span>
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                </button>
              </div>

              {/* Citation 2 */}
              <div
                onClick={() => setShowRuleModal(true)}
                className="bg-surface-container p-space-sm rounded flex items-center justify-between hover:bg-surface-container-high cursor-pointer transition-colors group"
              >
                <div className="flex items-start gap-space-xs">
                  <span className="material-symbols-outlined text-secondary text-base mt-0.5">menu_book</span>
                  <div className="flex flex-col">
                    <span className="font-clinical-data text-clinical-data text-on-surface font-semibold group-hover:text-primary transition-colors">
                      [Source 2] ACC/AHA STEMI Guidelines 2024
                    </span>
                    <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                      Section 7.4: In-hospital Glycemic Targets during Acute Coronary Syndromes
                    </span>
                  </div>
                </div>
                <button className="flex items-center gap-1 text-secondary font-clinical-data text-metadata-micro font-semibold hover:underline">
                  <span>View Rule</span>
                  <span className="material-symbols-outlined text-sm">visibility</span>
                </button>
              </div>
            </div>

            {/* Immediate Clinician Actions Panel */}
            <div className="flex flex-col gap-space-xs pt-space-xs">
              <span className="font-table-header text-table-header uppercase text-outline font-semibold">
                Immediate Clinician Actions
              </span>
              <div className="flex flex-col gap-space-xs">
                {/* Action 1 */}
                <button
                  onClick={() => triggerToast("Added HbA1c trajectory findings to current encounter note draft.")}
                  className="w-full text-left p-space-sm rounded bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface transition-all group flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-primary group-hover:text-on-primary text-lg">
                      note_add
                    </span>
                    <span className="font-clinical-data text-clinical-data font-semibold">
                      Add Trajectory Finding to Current Encounter Note
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-sm opacity-60 group-hover:opacity-100">
                    arrow_forward
                  </span>
                </button>

                {/* Action 2 */}
                <button
                  onClick={() => triggerToast("STAT Endocrinology / Diabetes Consult requested for ICCU-Bed 04.")}
                  className="w-full text-left p-space-sm rounded bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface transition-all group flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-primary group-hover:text-on-primary text-lg">
                      medical_services
                    </span>
                    <span className="font-clinical-data text-clinical-data font-semibold">
                      Order STAT Endocrinology / Diabetes Consult
                    </span>
                  </div>
                  <span className="font-clinical-data-mono text-metadata-micro px-1.5 py-0.5 rounded bg-error-container text-on-error-container font-bold group-hover:bg-on-primary group-hover:text-primary">
                    STAT P1
                  </span>
                </button>

                {/* Action 3 */}
                <button
                  onClick={() => triggerToast("Repeat Bedside Point-of-Care Glucose (Q2H) protocol activated.")}
                  className="w-full text-left p-space-sm rounded bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface transition-all group flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-primary group-hover:text-on-primary text-lg">
                      bloodtype
                    </span>
                    <span className="font-clinical-data text-clinical-data font-semibold">
                      Order Repeat Bedside Point-of-Care Glucose (Q2H)
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-sm opacity-60 group-hover:opacity-100">
                    arrow_forward
                  </span>
                </button>

                {/* Action 4 */}
                <button
                  onClick={() => {
                    triggerToast("Generating Diagnostic Longitudinal Trend Report (PDF)...");
                    window.print();
                  }}
                  className="w-full text-left p-space-sm rounded bg-surface-container-low hover:bg-surface-container text-on-surface transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-outline text-lg">picture_as_pdf</span>
                    <span className="font-clinical-data text-clinical-data">
                      Export Diagnostic Longitudinal Trend (PDF)
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-sm text-outline">download</span>
                </button>
              </div>
            </div>

            {/* Pathologist Digital Signature Footnote */}
            <div className="pt-space-xs flex items-center justify-between text-on-surface-variant font-clinical-data-mono text-metadata-micro bg-surface-container-low p-space-sm rounded flex-wrap gap-2">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-primary">verified_user</span>
                <span>Digitally Signed: 04-Jul-2026 09:12 IST</span>
              </div>
              <span className="text-primary font-bold">SHA-256 VERIFIED</span>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: LAB REPORT PDF INSPECTION */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-inverse-surface/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-surface-container-lowest w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="bg-surface-container-high px-gutter-normal py-space-sm flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary">description</span>
                <h3 className="font-section-title text-section-title font-semibold text-on-surface">
                  Apollo Central Lab Report #LAB-77218 (Page 1)
                </h3>
              </div>
              <button
                onClick={() => setShowPdfModal(false)}
                className="text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-gutter-normal flex flex-col gap-space-sm overflow-y-auto">
              <div className="border border-outline-variant p-4 rounded-lg bg-surface font-clinical-data-mono text-xs leading-relaxed">
                <div className="font-bold text-sm text-primary mb-2">APOLLO HOSPITALS INDRAPRASTHA · CENTRAL PATHOLOGY</div>
                <div>PATIENT: RAHUL SHARMA | UHID: DEL-2024-8841 | AGE/GENDER: 42Y/M</div>
                <div>COLLECTED: 04-JUL-2026 08:30 IST | REPORTED: 04-JUL-2026 09:12 IST</div>
                <div className="my-2 border-t border-outline-variant"></div>
                <div className="font-bold">INVESTIGATION: GLYCATED HEMOGLOBIN (HbA1c)</div>
                <div>RESULT: 7.8 % [HIGH] (REFERENCE: 4.0 - 5.6%)</div>
                <div>METHOD: Ion-Exchange High Performance Liquid Chromatography (HPLC - Bio-Rad Variant II)</div>
                <div>ESTIMATED AVERAGE GLUCOSE (eAG): 177 mg/dL</div>
                <div className="my-2 border-t border-outline-variant"></div>
                <div>SIGNATURE: Dr. Anjali Nair, MD Pathologist (DMC-94812)</div>
              </div>
            </div>
            <div className="p-space-sm bg-surface-container-low flex justify-end gap-space-xs">
              <button
                onClick={() => setShowPdfModal(false)}
                className="px-space-md py-1.5 bg-primary text-on-primary rounded font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CLINICAL RULE GUIDELINE */}
      {showRuleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-inverse-surface/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-surface-container-lowest w-full max-w-xl rounded-xl shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-surface-container-high px-gutter-normal py-space-sm flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary">menu_book</span>
                <h3 className="font-section-title text-section-title font-semibold text-on-surface">
                  ACC/AHA STEMI Guidelines 2024 · Section 7.4
                </h3>
              </div>
              <button
                onClick={() => setShowRuleModal(false)}
                className="text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-gutter-normal flex flex-col gap-space-sm text-clinical-data">
              <p className="leading-relaxed text-on-surface">
                <strong>Recommendation 7.4.1 (Class I, Level of Evidence B):</strong> In patients hospitalized with acute coronary syndromes (ACS), blood glucose should be maintained between 140 and 180 mg/dL (7.8 to 10.0 mmol/L) to prevent microvascular injury, myocardial no-reflow, and heightened mortality while strictly avoiding hypoglycemia (&lt;70 mg/dL).
              </p>
              <div className="p-2 bg-surface-container-low rounded font-clinical-data-mono text-metadata-micro text-outline">
                Source Document: DOI: 10.1161/CIR.0000000000001208
              </div>
            </div>
            <div className="p-space-sm bg-surface-container-low flex justify-end">
              <button
                onClick={() => setShowRuleModal(false)}
                className="px-space-md py-1.5 bg-primary text-on-primary rounded font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: SHARE FHIR DIAGNOSTICREPORT */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-inverse-surface/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-xl shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-surface-container-high px-gutter-normal py-space-sm flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary">share</span>
                <h3 className="font-section-title text-section-title font-semibold text-on-surface">
                  Share FHIR DiagnosticReport
                </h3>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-gutter-normal flex flex-col gap-space-sm text-clinical-data">
              <p className="text-on-surface-variant text-metadata-micro">
                Bundle resource: <code>DiagnosticReport/DR-99214</code> + <code>Observation/LOINC-4548-4</code> with verified ABDM consent artifact.
              </p>
              <div className="flex flex-col gap-1">
                <label className="text-metadata-micro font-semibold uppercase text-outline">Destination</label>
                <select className="p-2 bg-surface-container-low rounded border border-outline-variant font-clinical-data">
                  <option>ABHA Health Locker (Patient Mobile App)</option>
                  <option>Cath Lab Primary Operating System</option>
                  <option>Inter-Hospital Transfer (AIIMS New Delhi)</option>
                </select>
              </div>
            </div>
            <div className="p-space-sm bg-surface-container-low flex justify-end gap-space-xs">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-space-md py-1.5 bg-surface-container text-on-surface rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowShareModal(false);
                  triggerToast("FHIR DiagnosticReport shared successfully via ABDM gateway!");
                }}
                className="px-space-md py-1.5 bg-primary text-on-primary rounded font-semibold cursor-pointer"
              >
                Transmit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
