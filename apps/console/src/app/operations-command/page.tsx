"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function OperationsCommandCenterPage() {
  // Modals
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [showAlertBroadcastModal, setShowAlertBroadcastModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [showExpediteModal, setShowExpediteModal] = useState(false);
  const [showPodModal, setShowPodModal] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="flex flex-col w-full gap-space-md">
      {/* FLOATING TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-on-primary px-gutter-normal py-space-sm rounded-xl shadow-2xl flex items-center gap-space-sm animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="material-symbols-outlined text-xl">verified</span>
          <div className="flex flex-col">
            <span className="font-body-strong text-clinical-data">{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-on-primary hover:opacity-80 ml-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* EXECUTIVE CONTROL HEADER & TELEMETRY SCRIM */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-panel-padding flex flex-col xl:flex-row xl:items-center xl:justify-between gap-space-md">
        <div className="flex flex-col gap-space-2xs min-w-0">
          <div className="flex items-center gap-space-xs flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-space-xs py-0.5 rounded bg-primary text-on-primary font-clinical-data text-metadata-micro font-semibold uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-fixed animate-pulse"></span>
              Live Ops Command
            </span>
            <span className="font-clinical-data-mono text-metadata-micro text-outline">·</span>
            <span className="font-clinical-data text-clinical-data font-semibold text-primary">
              Apollo Indraprastha · Central Campus
            </span>
            <span className="font-clinical-data-mono text-metadata-micro text-outline">|</span>
            <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-primary">sync</span> Real-Time Synchronized
              (Updated 3s ago)
            </span>
          </div>
          <h1 className="font-page-title text-page-title text-on-surface tracking-tight">
            Hospital Operations Command Center
          </h1>
          <p className="font-body-default text-clinical-data text-on-surface-variant">
            Real-time executive operational control, hospital-wide capacity telemetry, emergency throughput and
            clinical safety gatekeeper.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-sm shrink-0">
          <div className="bg-surface-container-low px-space-sm py-1.5 rounded flex items-center gap-space-sm">
            <div className="flex flex-col">
              <span className="font-metadata-micro text-metadata-micro text-outline uppercase font-semibold">
                Duty Command Lead
              </span>
              <span className="font-clinical-data text-clinical-data text-on-surface font-semibold">
                Dr. R. Verma · S. Mukherjee
              </span>
            </div>
            <span className="bg-surface-container px-1.5 py-0.5 rounded font-clinical-data-mono text-metadata-micro text-on-surface-variant font-medium">
              Day Shift B
            </span>
          </div>
          <div className="flex items-center gap-space-xs flex-wrap">
            <button
              onClick={() => setShowIncidentModal(true)}
              className="h-9 px-space-sm bg-error text-on-error rounded font-body-strong text-clinical-data flex items-center gap-1.5 shadow-sm hover:opacity-95 transition-opacity cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">crisis_alert</span>
              Incident Command
            </button>
            <button
              onClick={() => setShowAlertBroadcastModal(true)}
              className="h-9 px-space-sm bg-surface-container-low hover:bg-surface-container text-on-surface rounded font-body-strong text-clinical-data flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base text-primary">broadcast_on_personal</span>
              Alert Broadcast
            </button>
            <button
              onClick={() => setShowResourceModal(true)}
              className="h-9 px-space-sm bg-primary text-on-primary rounded font-body-strong text-clinical-data flex items-center gap-1 shadow-sm hover:opacity-95 transition-opacity cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">tune</span>
              Resource Allocator
            </button>
            <button
              onClick={() => triggerToast("Executive Operational Brief (PDF) generated and downloaded.")}
              className="h-9 w-9 bg-surface-container-low hover:bg-surface-container text-on-surface-variant rounded flex items-center justify-center transition-colors cursor-pointer"
              title="Export Executive Brief"
            >
              <span className="material-symbols-outlined text-base">download</span>
            </button>
          </div>
        </div>
      </div>

      {/* REAL-TIME EMERGENCY PRIORITY OPERATIONAL STRIP */}
      <div className="flex flex-col lg:flex-row gap-space-sm">
        <div className="flex-1 bg-error text-on-error rounded-xl p-space-sm px-space-md shadow-sm flex items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-sm min-w-0">
            <span className="h-8 w-8 rounded bg-on-error/20 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-lg animate-bounce">e911_emergency</span>
            </span>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-space-xs flex-wrap">
                <span className="font-body-strong text-metadata-micro bg-on-error text-error px-1 rounded uppercase font-bold tracking-wider">
                  STAT Override
                </span>
                <span className="font-body-strong text-clinical-data font-bold">
                  Cath Lab Suite 01 · Active Code STEMI
                </span>
                <span className="font-clinical-data-mono text-metadata-micro opacity-90">
                  (Token #104 · Rahul Sharma, 54M)
                </span>
              </div>
              <p className="font-clinical-data text-metadata-micro truncate opacity-95">
                Primary PCI underway · Door-to-balloon clock:{" "}
                <span className="font-clinical-data-mono font-bold">28m 14s</span> (Target &lt;60m). Interventional team
                in situ.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-space-xs shrink-0">
            <span className="hidden sm:inline-block px-2 py-1 rounded bg-on-error/15 font-clinical-data-mono text-metadata-micro font-bold">
              CARDIAC 01 ENGAGED
            </span>
          </div>
        </div>
        <div className="bg-surface-container-lowest text-on-surface rounded-xl p-space-sm px-space-md shadow-sm flex items-center justify-between gap-space-md lg:w-96 shrink-0">
          <div className="flex items-center gap-space-xs min-w-0">
            <span className="h-8 w-8 rounded bg-surface-container flex items-center justify-center text-secondary shrink-0">
              <span className="material-symbols-outlined text-base">hotel</span>
            </span>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-space-xs">
                <span className="font-clinical-data text-clinical-data font-semibold text-error">
                  CCU Surge Caution
                </span>
                <span className="font-clinical-data-mono text-metadata-micro text-error font-bold">94.2%</span>
              </div>
              <p className="font-metadata-micro text-metadata-micro text-on-surface-variant truncate">
                Only 2 beds free. Step-down expedite enabled.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowExpediteModal(true)}
            className="px-space-xs py-1 rounded bg-surface-container text-primary font-clinical-data text-metadata-micro font-semibold hover:bg-surface-container-high transition-colors shrink-0 cursor-pointer"
          >
            Expedite 3
          </button>
        </div>
      </div>

      {/* 10 MISSION-CRITICAL EXECUTIVE OPERATIONS KPIS (5 DOMAINS) */}
      <div className="grid grid-cols-2 md:grid-cols-5 xl:grid-cols-10 gap-space-xs">
        {/* KPI 1 */}
        <div className="bg-surface-container-lowest rounded-lg p-space-sm shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-outline">
            <span className="font-metadata-micro text-metadata-micro uppercase font-semibold">1. OPD Load</span>
            <span className="material-symbols-outlined text-xs">group</span>
          </div>
          <div className="my-1">
            <div className="font-page-title text-section-title text-on-surface font-bold">
              142{" "}
              <span className="font-clinical-data text-metadata-micro text-on-surface-variant font-normal">/ 86%</span>
            </div>
            <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">
              Avg wait: <span className="font-clinical-data-mono font-semibold text-primary">14m</span>
            </div>
          </div>
          <div className="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
            <div className="bg-primary h-full w-[86%]"></div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-surface-container-lowest rounded-lg p-space-sm shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-outline">
            <span className="font-metadata-micro text-metadata-micro uppercase font-semibold">2. IPD Bed Cap</span>
            <span className="material-symbols-outlined text-xs">single_bed</span>
          </div>
          <div className="my-1">
            <div className="font-page-title text-section-title text-on-surface font-bold">
              368{" "}
              <span className="font-clinical-data text-metadata-micro text-on-surface-variant font-normal">
                / 420
              </span>
            </div>
            <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">
              Free clean: <span className="font-clinical-data-mono font-semibold text-primary">38 beds</span>
            </div>
          </div>
          <div className="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
            <div className="bg-primary h-full w-[87.6%]"></div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-surface-container-lowest rounded-lg p-space-sm shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-error">
            <span className="font-metadata-micro text-metadata-micro uppercase font-semibold">3. CCU/ICU</span>
            <span className="material-symbols-outlined text-xs">warning</span>
          </div>
          <div className="my-1">
            <div className="font-page-title text-section-title text-error font-bold">94.2%</div>
            <div className="font-metadata-micro text-metadata-micro text-error font-semibold">2 Beds Free (Amber)</div>
          </div>
          <div className="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
            <div className="bg-error h-full w-[94.2%]"></div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-surface-container-lowest rounded-lg p-space-sm shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-outline">
            <span className="font-metadata-micro text-metadata-micro uppercase font-semibold">4. Triage ED</span>
            <span className="material-symbols-outlined text-xs">emergency</span>
          </div>
          <div className="my-1">
            <div className="font-page-title text-section-title text-on-surface font-bold">
              18{" "}
              <span className="font-clinical-data text-metadata-micro text-error font-semibold">2 STAT</span>
            </div>
            <div className="font-metadata-micro text-metadata-micro text-primary font-semibold">0m wait on P1</div>
          </div>
          <div className="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
            <div className="bg-tertiary h-full w-[72%]"></div>
          </div>
        </div>

        {/* KPI 5 */}
        <div className="bg-surface-container-lowest rounded-lg p-space-sm shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-outline">
            <span className="font-metadata-micro text-metadata-micro uppercase font-semibold">5. Cath/OT</span>
            <span className="material-symbols-outlined text-xs">vital_signs</span>
          </div>
          <div className="my-1">
            <div className="font-page-title text-section-title text-on-surface font-bold">
              82%{" "}
              <span className="font-clinical-data text-metadata-micro text-on-surface-variant font-normal">Active</span>
            </div>
            <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">PCI in Suite 01</div>
          </div>
          <div className="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
            <div className="bg-primary h-full w-[82%]"></div>
          </div>
        </div>

        {/* KPI 6 */}
        <div className="bg-surface-container-lowest rounded-lg p-space-sm shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-outline">
            <span className="font-metadata-micro text-metadata-micro uppercase font-semibold">6. Lab Tests</span>
            <span className="material-symbols-outlined text-xs">chips</span>
          </div>
          <div className="my-1">
            <div className="font-page-title text-section-title text-on-surface font-bold">
              486{" "}
              <span className="font-clinical-data text-metadata-micro text-on-surface-variant font-normal">Vol</span>
            </div>
            <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">
              TAT: <span className="font-clinical-data-mono font-semibold text-on-surface">26m</span>
            </div>
          </div>
          <div className="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
            <div className="bg-secondary h-full w-[65%]"></div>
          </div>
        </div>

        {/* KPI 7 */}
        <div className="bg-surface-container-lowest rounded-lg p-space-sm shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-outline">
            <span className="font-metadata-micro text-metadata-micro uppercase font-semibold">7. Pharmacy</span>
            <span className="material-symbols-outlined text-xs">medication</span>
          </div>
          <div className="my-1">
            <div className="font-page-title text-section-title text-on-surface font-bold">
              312{" "}
              <span className="font-clinical-data text-metadata-micro text-on-surface-variant font-normal">Rx</span>
            </div>
            <div className="font-metadata-micro text-metadata-micro text-primary font-semibold">100% Intercept</div>
          </div>
          <div className="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
            <div className="bg-primary h-full w-[90%]"></div>
          </div>
        </div>

        {/* KPI 8 */}
        <div className="bg-surface-container-lowest rounded-lg p-space-sm shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-outline">
            <span className="font-metadata-micro text-metadata-micro uppercase font-semibold">8. Discharge</span>
            <span className="material-symbols-outlined text-xs">output</span>
          </div>
          <div className="my-1">
            <div className="font-page-title text-section-title text-on-surface font-bold">
              14{" "}
              <span className="font-clinical-data text-metadata-micro text-on-surface-variant font-normal">/ 28</span>
            </div>
            <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">8 Wait MD Sign</div>
          </div>
          <div className="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
            <div className="bg-primary h-full w-[50%]"></div>
          </div>
        </div>

        {/* KPI 9 */}
        <div className="bg-surface-container-lowest rounded-lg p-space-sm shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-outline">
            <span className="font-metadata-micro text-metadata-micro uppercase font-semibold">9. Referrals</span>
            <span className="material-symbols-outlined text-xs">swap_horiz</span>
          </div>
          <div className="my-1">
            <div className="font-page-title text-section-title text-on-surface font-bold">
              07{" "}
              <span className="font-clinical-data text-metadata-micro text-on-surface-variant font-normal">Act</span>
            </div>
            <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">3 Tert. Pending</div>
          </div>
          <div className="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
            <div className="bg-tertiary h-full w-[57%]"></div>
          </div>
        </div>

        {/* KPI 10 */}
        <div className="bg-surface-container-lowest rounded-lg p-space-sm shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-outline">
            <span className="font-metadata-micro text-metadata-micro uppercase font-semibold">10. TPA / Ins.</span>
            <span className="material-symbols-outlined text-xs">payments</span>
          </div>
          <div className="my-1">
            <div className="font-page-title text-section-title text-on-surface font-bold">₹34.8L</div>
            <div className="font-metadata-micro text-metadata-micro text-primary font-semibold">98.2% Clean</div>
          </div>
          <div className="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
            <div className="bg-primary h-full w-[98.2%]"></div>
          </div>
        </div>
      </div>

      {/* OPERATIONAL COMMAND WORKSPACE: 4 QUADRANTS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-space-md">
        {/* Quadrant 1: Outpatient & Clinic Capacity Telemetry */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-panel-padding flex flex-col gap-space-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-xl">view_agenda</span>
              <h2 className="font-section-title text-section-title text-on-surface">
                Quadrant 1 · Outpatient Capacity &amp; Clinic Velocity
              </h2>
            </div>
            <Link
              className="text-primary font-clinical-data text-metadata-micro font-semibold hover:underline flex items-center gap-0.5"
              href="/schedule-opd-slots"
            >
              OPD Schedule <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          {/* Department Load Indicators */}
          <div className="flex flex-col gap-space-sm">
            <div className="flex items-center justify-between text-metadata-micro font-metadata-micro text-outline">
              <span>DEPARTMENT LOAD DISTRIBUTION</span>
              <span className="font-clinical-data-mono">18 CLINICIANS ACTIVE · 64 WAITING</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
              {/* Cardio Overbooked */}
              <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-body-strong text-clinical-data text-on-surface">Cardiology OPD</span>
                  <span className="font-clinical-data-mono text-metadata-micro bg-error-container text-on-error-container px-1.5 py-0.5 rounded font-bold">
                    98% Overbooked
                  </span>
                </div>
                <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                  <div className="bg-error h-full w-[98%]"></div>
                </div>
                <div className="flex justify-between font-metadata-micro text-metadata-micro text-on-surface-variant">
                  <span>Token #48 currently in Room 06</span>
                  <span className="font-clinical-data-mono">Wait: 22m</span>
                </div>
              </div>
              {/* Gen Med */}
              <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-body-strong text-clinical-data text-on-surface">General Medicine</span>
                  <span className="font-clinical-data-mono text-metadata-micro bg-surface-container text-primary px-1.5 py-0.5 rounded font-bold">
                    82% Operational
                  </span>
                </div>
                <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[82%]"></div>
                </div>
                <div className="flex justify-between font-metadata-micro text-metadata-micro text-on-surface-variant">
                  <span>5 Physicians online · 34 treated</span>
                  <span className="font-clinical-data-mono">Wait: 12m</span>
                </div>
              </div>
              {/* Orthopedics */}
              <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-body-strong text-clinical-data text-on-surface">Orthopedics &amp; Trauma</span>
                  <span className="font-clinical-data-mono text-metadata-micro bg-surface-container text-on-surface-variant px-1.5 py-0.5 rounded font-bold">
                    74% Capacity
                  </span>
                </div>
                <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full w-[74%]"></div>
                </div>
                <div className="flex justify-between font-metadata-micro text-metadata-micro text-on-surface-variant">
                  <span>Plaster room clear · 3 Consults</span>
                  <span className="font-clinical-data-mono">Wait: 9m</span>
                </div>
              </div>
              {/* Pulmonology */}
              <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-body-strong text-clinical-data text-on-surface">Pulmonology &amp; Chest</span>
                  <span className="font-clinical-data-mono text-metadata-micro bg-surface-container text-primary px-1.5 py-0.5 rounded font-bold">
                    88% Load
                  </span>
                </div>
                <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[88%]"></div>
                </div>
                <div className="flex justify-between font-metadata-micro text-metadata-micro text-on-surface-variant">
                  <span>PFT Lab queue at 4 patients</span>
                  <span className="font-clinical-data-mono">Wait: 16m</span>
                </div>
              </div>
            </div>
          </div>
          {/* Velocity Metric Histogram */}
          <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-space-xs">
            <div className="flex items-center justify-between">
              <span className="font-metadata-micro text-metadata-micro uppercase font-semibold text-outline">
                Hourly Arrival vs Service Throughput (08:00 - 14:00)
              </span>
              <span className="font-clinical-data-mono text-metadata-micro text-primary">
                Peak Velocity: 34 pts/hr @ 11:30
              </span>
            </div>
            <div className="h-16 flex items-end gap-1.5 pt-2">
              <div className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-primary-container/40 rounded-t h-8"></div>
                <span className="font-clinical-data-mono text-[9px] text-outline">08h</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-primary-container/60 rounded-t h-11"></div>
                <span className="font-clinical-data-mono text-[9px] text-outline">09h</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-primary-container/80 rounded-t h-14"></div>
                <span className="font-clinical-data-mono text-[9px] text-outline">10h</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-primary rounded-t h-16"></div>
                <span className="font-clinical-data-mono text-[9px] text-primary font-bold">11h</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-primary-container/90 rounded-t h-13"></div>
                <span className="font-clinical-data-mono text-[9px] text-outline">12h</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-primary-container/70 rounded-t h-10"></div>
                <span className="font-clinical-data-mono text-[9px] text-outline">13h</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-primary-container rounded-t h-12"></div>
                <span className="font-clinical-data-mono text-[9px] text-outline">14h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quadrant 2: Inpatient & Bed Logistics Command */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-panel-padding flex flex-col gap-space-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-xl">bed</span>
              <h2 className="font-section-title text-section-title text-on-surface">
                Quadrant 2 · Inpatient &amp; Bed Logistics Command
              </h2>
            </div>
            <Link
              className="text-primary font-clinical-data text-metadata-micro font-semibold hover:underline flex items-center gap-0.5"
              href="/admissions-ipd"
            >
              Live Bed Board <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          {/* Inpatient Wards Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs">
            <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="font-body-strong text-clinical-data text-on-surface">Cardiac CCU</span>
                <span className="h-2 w-2 rounded-full bg-error animate-ping"></span>
              </div>
              <div className="my-1">
                <div className="font-page-title text-section-title text-error font-bold">10 / 12</div>
                <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">2 Beds Available</div>
              </div>
              <span className="font-clinical-data-mono text-[10px] text-error font-semibold uppercase">
                Surge Protocol On
              </span>
            </div>
            <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="font-body-strong text-clinical-data text-on-surface">Step-Down HDU</span>
                <span className="h-2 w-2 rounded-full bg-primary"></span>
              </div>
              <div className="my-1">
                <div className="font-page-title text-section-title text-on-surface font-bold">14 / 16</div>
                <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">2 Clean Beds Ready</div>
              </div>
              <span className="font-clinical-data-mono text-[10px] text-primary font-semibold uppercase">
                Step-In Transit
              </span>
            </div>
            <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="font-body-strong text-clinical-data text-on-surface">Med-Surg (Fl 3)</span>
                <span className="h-2 w-2 rounded-full bg-secondary"></span>
              </div>
              <div className="my-1">
                <div className="font-page-title text-section-title text-on-surface font-bold">20 / 24</div>
                <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">4 Beds Clean</div>
              </div>
              <span className="font-clinical-data-mono text-[10px] text-secondary font-semibold uppercase">
                Nominal Flow
              </span>
            </div>
            <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="font-body-strong text-clinical-data text-on-surface">Post-Op (Fl 4)</span>
                <span className="h-2 w-2 rounded-full bg-primary"></span>
              </div>
              <div className="my-1">
                <div className="font-page-title text-section-title text-on-surface font-bold">18 / 20</div>
                <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">2 Reserved OT In</div>
              </div>
              <span className="font-clinical-data-mono text-[10px] text-primary font-semibold uppercase">
                Holding Stable
              </span>
            </div>
          </div>
          {/* Housekeeping Turnover Board */}
          <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-space-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-base text-primary">cleaning_services</span>
                <span className="font-body-strong text-clinical-data text-on-surface">
                  Housekeeping Rapid Turnover Queue
                </span>
              </div>
              <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                14 Beds in Cycle · Avg 16m
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-xs">
              <div className="bg-surface-container-lowest p-2 rounded flex items-center justify-between">
                <div>
                  <div className="font-clinical-data-mono text-clinical-data font-bold text-on-surface">Bed CCU-04</div>
                  <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    Disinfect Stage (UV-C)
                  </div>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-surface-container font-clinical-data-mono text-metadata-micro text-primary font-semibold">
                  4m left
                </span>
              </div>
              <div className="bg-surface-container-lowest p-2 rounded flex items-center justify-between">
                <div>
                  <div className="font-clinical-data-mono text-clinical-data font-bold text-on-surface">Bed 312-B</div>
                  <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    Linen &amp; Terminal Strip
                  </div>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-surface-container font-clinical-data-mono text-metadata-micro text-on-surface-variant font-semibold">
                  8m left
                </span>
              </div>
              <div className="bg-surface-container-lowest p-2 rounded flex items-center justify-between">
                <div>
                  <div className="font-clinical-data-mono text-clinical-data font-bold text-on-surface">Bed HDU-08</div>
                  <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    Nurse Inspection / Sign
                  </div>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-primary-container text-on-primary-container font-clinical-data-mono text-metadata-micro font-semibold">
                  Ready 1m
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quadrant 3: Diagnostics & Pharmacy Bottleneck Radar */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-panel-padding flex flex-col gap-space-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-xl">chips</span>
              <h2 className="font-section-title text-section-title text-on-surface">
                Quadrant 3 · Diagnostics &amp; Central Pharmacy Radar
              </h2>
            </div>
            <div className="flex items-center gap-space-sm">
              <Link
                className="text-primary font-clinical-data text-metadata-micro font-semibold hover:underline flex items-center gap-0.5"
                href="/pharmacy-lab"
              >
                Lab &amp; Rx Console <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
            {/* Central Lab Analyzer Status */}
            <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-space-xs">
              <span className="font-metadata-micro text-metadata-micro text-outline font-semibold uppercase">
                Central Lab Analyzers
              </span>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between bg-surface-container-lowest p-2 rounded">
                  <div className="flex items-center gap-space-xs">
                    <span className="h-2 w-2 rounded-full bg-primary"></span>
                    <div>
                      <div className="font-clinical-data text-clinical-data font-semibold text-on-surface">
                        Siemens Atellica IM
                      </div>
                      <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                        Immunoassay · STAT hs-cTnI running
                      </div>
                    </div>
                  </div>
                  <span className="font-clinical-data-mono text-metadata-micro font-bold text-primary">
                    ONLINE (18 STAT)
                  </span>
                </div>
                <div className="flex items-center justify-between bg-surface-container-lowest p-2 rounded">
                  <div className="flex items-center gap-space-xs">
                    <span className="h-2 w-2 rounded-full bg-primary"></span>
                    <div>
                      <div className="font-clinical-data text-clinical-data font-semibold text-on-surface">
                        Sysmex XN-9000
                      </div>
                      <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                        Automated Hematology Track
                      </div>
                    </div>
                  </div>
                  <span className="font-clinical-data-mono text-metadata-micro font-semibold text-primary">
                    ONLINE (0 Backlog)
                  </span>
                </div>
                <div className="flex items-center justify-between bg-surface-container-lowest p-2 rounded">
                  <div className="flex items-center gap-space-xs">
                    <span className="h-2 w-2 rounded-full bg-primary"></span>
                    <div>
                      <div className="font-clinical-data text-clinical-data font-semibold text-on-surface">
                        Stago STA R Max 3
                      </div>
                      <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                        Coagulation · PT/INR + D-Dimer
                      </div>
                    </div>
                  </div>
                  <span className="font-clinical-data-mono text-metadata-micro font-semibold text-primary">
                    ONLINE (QC Valid)
                  </span>
                </div>
              </div>
            </div>

            {/* Pneumatic Tube & STAT Pharmacy Dispatch */}
            <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-space-xs">
              <span className="font-metadata-micro text-metadata-micro text-outline font-semibold uppercase">
                Pharmacy Pneumatic Pods
              </span>
              <div className="flex flex-col gap-1.5">
                <div
                  onClick={() => setShowPodModal(true)}
                  className="bg-surface-container-lowest p-2 rounded flex flex-col gap-1 cursor-pointer hover:bg-surface-container-high transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-clinical-data text-clinical-data font-semibold text-on-surface">
                      Pod #04 → CCU Resus Bay
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-error-container text-on-error-container font-clinical-data-mono text-metadata-micro font-bold">
                      STAT In-Flight
                    </span>
                  </div>
                  <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    Heparin IV drip + Norepinephrine 4mg/4mL
                  </p>
                  <div className="w-full bg-surface-container h-1 rounded-full overflow-hidden">
                    <div className="bg-error h-full w-[80%] animate-pulse"></div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-2 rounded flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-clinical-data text-clinical-data font-semibold text-on-surface">
                      Pod #07 → Floor 4 Post-Op
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-surface-container font-clinical-data-mono text-metadata-micro text-primary font-semibold">
                      In Route
                    </span>
                  </div>
                  <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    Post-op Cefuroxime IV 1.5g + Paracetamol IV
                  </p>
                  <div className="w-full bg-surface-container h-1 rounded-full overflow-hidden">
                    <div className="bg-primary h-full w-[45%]"></div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-2 rounded flex items-center justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-sm text-primary">security</span>
                    <span className="font-clinical-data text-metadata-micro text-on-surface font-medium">
                      100% Allergy Intercept Gatekeeper
                    </span>
                  </div>
                  <span className="font-clinical-data-mono text-metadata-micro text-primary font-bold">
                    0 Overrides
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quadrant 4: Care Transitions & Financial Authorization Flow */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-panel-padding flex flex-col gap-space-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-xl">sync_alt</span>
              <h2 className="font-section-title text-section-title text-on-surface">
                Quadrant 4 · Care Transitions &amp; Financial Gateways
              </h2>
            </div>
            <div className="flex items-center gap-space-sm">
              <Link
                className="text-primary font-clinical-data text-metadata-micro font-semibold hover:underline flex items-center gap-0.5"
                href="/discharge-referrals"
              >
                Referrals <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
              <Link
                className="text-primary font-clinical-data text-metadata-micro font-semibold hover:underline flex items-center gap-0.5"
                href="/billing-payments"
              >
                Billing TPA <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
            {/* Referral & Transfer Activity */}
            <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-space-xs">
              <span className="font-metadata-micro text-metadata-micro text-outline font-semibold uppercase">
                Inter-Facility Tertiary Transfer
              </span>
              <div className="bg-surface-container-lowest p-2 rounded flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-clinical-data text-clinical-data font-bold text-on-surface">
                    Harish Chandra (68M)
                  </span>
                  <span className="font-clinical-data-mono text-metadata-micro text-secondary font-bold">
                    AIIMS Tertiary Transfer
                  </span>
                </div>
                <div className="font-metadata-micro text-metadata-micro text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-primary">airport_shuttle</span>
                  ALS Ambulance #DL-1T-4819 departs 15:45 IST
                </div>
                <div className="flex items-center justify-between text-[11px] font-clinical-data-mono pt-1">
                  <span className="text-outline">Escort: Dr. S. Nair</span>
                  <span className="text-primary font-semibold">Telemetry Paired</span>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-2 rounded flex items-center justify-between">
                <div>
                  <span className="font-clinical-data text-clinical-data font-medium text-on-surface">
                    Max Saket ECMO Request
                  </span>
                  <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    Bed acceptance confirmation pending
                  </div>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-surface-container font-clinical-data-mono text-metadata-micro text-on-surface-variant font-bold">
                  Pending 14m
                </span>
              </div>
            </div>

            {/* Insurance Pre-Auth Ledger */}
            <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-space-xs">
              <span className="font-metadata-micro text-metadata-micro text-outline font-semibold uppercase">
                TPA Pre-Auth &amp; Settlement Gate
              </span>
              <div className="flex flex-col gap-1.5">
                <div className="bg-surface-container-lowest p-2 rounded flex items-center justify-between">
                  <div>
                    <div className="font-clinical-data text-clinical-data font-bold text-on-surface">
                      Rahul Sharma (Cath Lab)
                    </div>
                    <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                      ICICI Lombard · Emergency PCI G-Pass
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-clinical-data-mono text-clinical-data font-bold text-primary">
                      ₹4,50,000
                    </span>
                    <div className="font-metadata-micro text-metadata-micro text-primary font-semibold">
                      APPROVED (STAT)
                    </div>
                  </div>
                </div>
                <div className="bg-surface-container-lowest p-2 rounded flex items-center justify-between">
                  <div>
                    <div className="font-clinical-data text-clinical-data font-bold text-on-surface">
                      Priya Sundaram (Ortho)
                    </div>
                    <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                      MediAssist TPA · Discharge Settlement
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-clinical-data-mono text-clinical-data font-bold text-on-surface">
                      ₹78,400
                    </span>
                    <div className="font-metadata-micro text-metadata-micro text-primary font-semibold">
                      CLEARED (0m)
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between px-1 text-metadata-micro font-clinical-data-mono text-outline">
                  <span>
                    Clean Claim Ratio: <strong className="text-on-surface">98.2%</strong>
                  </span>
                  <span className="text-primary font-semibold">Zero Billing Blocks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DIRECT EXECUTIVE CLICK-THROUGH CONTROLS */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-sm px-space-panel-padding flex items-center justify-between gap-space-sm flex-wrap">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-base text-primary">terminal</span>
          <span className="font-body-strong text-clinical-data text-on-surface">
            Direct Operational Workspace Portals:
          </span>
        </div>
        <div className="flex items-center gap-space-xs flex-wrap">
          <Link
            className="px-space-sm py-1.5 rounded bg-surface-container-low hover:bg-surface-container text-on-surface font-body-strong text-clinical-data flex items-center gap-1 transition-colors"
            href="/admissions-ipd"
          >
            <span className="material-symbols-outlined text-sm text-primary">hotel</span>
            Bed Board
          </Link>
          <Link
            className="px-space-sm py-1.5 rounded bg-surface-container-low hover:bg-surface-container text-on-surface font-body-strong text-clinical-data flex items-center gap-1 transition-colors"
            href="/schedule-opd-slots"
          >
            <span className="material-symbols-outlined text-sm text-primary">calendar_today</span>
            Schedule &amp; OPD
          </Link>
          <Link
            className="px-space-sm py-1.5 rounded bg-surface-container-low hover:bg-surface-container text-on-surface font-body-strong text-clinical-data flex items-center gap-1 transition-colors"
            href="/pharmacy-lab"
          >
            <span className="material-symbols-outlined text-sm text-primary">local_pharmacy</span>
            Pharmacy Dispense
          </Link>
          <Link
            className="px-space-sm py-1.5 rounded bg-surface-container-low hover:bg-surface-container text-on-surface font-body-strong text-clinical-data flex items-center gap-1 transition-colors"
            href="/orders"
          >
            <span className="material-symbols-outlined text-sm text-primary">chips</span>
            Diagnostic Labs
          </Link>
          <Link
            className="px-space-sm py-1.5 rounded bg-surface-container-low hover:bg-surface-container text-on-surface font-body-strong text-clinical-data flex items-center gap-1 transition-colors"
            href="/discharge-referrals"
          >
            <span className="material-symbols-outlined text-sm text-primary">output</span>
            Discharges &amp; Referrals
          </Link>
          <Link
            className="px-space-sm py-1.5 rounded bg-surface-container-low hover:bg-surface-container text-on-surface font-body-strong text-clinical-data flex items-center gap-1 transition-colors"
            href="/billing-payments"
          >
            <span className="material-symbols-outlined text-sm text-primary">receipt_long</span>
            Hospital Billing
          </Link>
        </div>
      </div>

      {/* MODAL 1: INCIDENT COMMAND */}
      {showIncidentModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-4 border border-error/40 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-surface-variant">
              <div className="flex items-center gap-2 text-error">
                <span className="material-symbols-outlined text-xl">crisis_alert</span>
                <h3 className="font-page-title text-section-title text-on-surface font-semibold">
                  Hospital Incident Command Activation
                </h3>
              </div>
              <button
                onClick={() => setShowIncidentModal(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface rounded hover:bg-surface-container cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-3 font-clinical-data text-clinical-data">
              <div className="p-3 bg-error-container text-on-error-container rounded-lg">
                <span className="font-bold">Active Protocol: Mass Casualty / Level-1 Cardiac Surge</span>
                <p className="text-metadata-micro mt-1">
                  Activating incident command locks external elective transfers, converts HDU-B to acute triage holding, and mobilizes on-call interventionalists.
                </p>
              </div>
              <div>
                <label className="font-table-header uppercase text-on-surface-variant">Command Officer</label>
                <input
                  type="text"
                  defaultValue="Dr. R. Verma (Chief of Clinical Services)"
                  className="w-full h-9 px-3 bg-surface-container-low rounded border border-outline-variant mt-1"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-surface-variant">
              <button
                onClick={() => setShowIncidentModal(false)}
                className="px-4 py-2 bg-surface-container rounded text-on-surface font-body-strong text-clinical-data cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowIncidentModal(false);
                  triggerToast("Incident command protocol verified & logged in Central Registry.");
                }}
                className="px-4 py-2 bg-error text-on-error rounded font-body-strong text-clinical-data cursor-pointer"
              >
                Confirm Protocol Activation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ALERT BROADCAST */}
      {showAlertBroadcastModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-4 border border-outline-variant animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-surface-variant">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-xl">broadcast_on_personal</span>
                <h3 className="font-page-title text-section-title text-on-surface font-semibold">
                  Hospital-Wide Alert Broadcast
                </h3>
              </div>
              <button
                onClick={() => setShowAlertBroadcastModal(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface rounded hover:bg-surface-container cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-3 font-clinical-data text-clinical-data">
              <div>
                <label className="font-table-header uppercase text-on-surface-variant">Target Channels</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <label className="flex items-center gap-2 p-2 bg-surface-container-low rounded cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-primary" />
                    <span>Emergency &amp; Resus Bays</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 bg-surface-container-low rounded cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-primary" />
                    <span>Cath Labs &amp; OTs</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 bg-surface-container-low rounded cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-primary" />
                    <span>Inpatient Nursing Stations</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 bg-surface-container-low rounded cursor-pointer">
                    <input type="checkbox" className="accent-primary" />
                    <span>Outpatient Clinics</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="font-table-header uppercase text-on-surface-variant">Broadcast Content</label>
                <textarea
                  rows={3}
                  defaultValue="Code STEMI Level 1 in progress. Cath Lab 01 active. All nursing units clear elevator bank C for priority transit."
                  className="w-full p-2 bg-surface-container-low rounded border border-outline-variant mt-1 font-clinical-data"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-surface-variant">
              <button
                onClick={() => setShowAlertBroadcastModal(false)}
                className="px-4 py-2 bg-surface-container rounded text-on-surface font-body-strong text-clinical-data cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAlertBroadcastModal(false);
                  triggerToast("High-priority alert broadcast transmitted across 4 channels.");
                }}
                className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary rounded font-body-strong text-clinical-data cursor-pointer"
              >
                Send Alert Broadcast
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: RESOURCE ALLOCATOR */}
      {showResourceModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-xl w-full p-6 shadow-2xl flex flex-col gap-4 border border-outline-variant animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-surface-variant">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-xl">tune</span>
                <h3 className="font-page-title text-section-title text-on-surface font-semibold">
                  Dynamic Resource &amp; Surge Allocation
                </h3>
              </div>
              <button
                onClick={() => setShowResourceModal(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface rounded hover:bg-surface-container cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-3 font-clinical-data text-clinical-data">
              <div className="p-3 bg-surface-container-low rounded-lg flex justify-between items-center">
                <div>
                  <span className="font-bold text-on-surface">Cardiology OPD Overflow</span>
                  <span className="block text-metadata-micro text-outline">Current wait: 22m · 98% Overbooked</span>
                </div>
                <button
                  onClick={() => triggerToast("Room 08 assigned as overflow consultation suite.")}
                  className="px-3 py-1 bg-primary text-on-primary rounded font-body-strong text-metadata-micro cursor-pointer"
                >
                  Open Room 08
                </button>
              </div>
              <div className="p-3 bg-surface-container-low rounded-lg flex justify-between items-center">
                <div>
                  <span className="font-bold text-on-surface">Pneumatic Tube Pressure Boost</span>
                  <span className="block text-metadata-micro text-outline">Increase pressure to 4.5 Bar for STAT Pods</span>
                </div>
                <button
                  onClick={() => triggerToast("Pneumatic compressor boosted to 4.5 Bar.")}
                  className="px-3 py-1 bg-surface-container hover:bg-surface-container-high rounded text-on-surface font-body-strong text-metadata-micro cursor-pointer"
                >
                  Boost Pressure
                </button>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-surface-variant">
              <button
                onClick={() => setShowResourceModal(false)}
                className="px-4 py-2 bg-surface-container rounded text-on-surface font-body-strong text-clinical-data cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: EXPEDITE STEP-DOWN TRANSFERS */}
      {showExpediteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-4 border border-outline-variant animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-surface-variant">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-xl">hotel</span>
                <h3 className="font-page-title text-section-title text-on-surface font-semibold">
                  Expedite 3 Step-Down Transfers
                </h3>
              </div>
              <button
                onClick={() => setShowExpediteModal(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface rounded hover:bg-surface-container cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="font-clinical-data text-clinical-data text-on-surface-variant">
              Move 3 clinically stabilized CCU patients to HDU to relieve CCU surge (current occupancy 94.2%).
            </p>
            <div className="flex flex-col gap-2 font-clinical-data-mono text-metadata-micro">
              <div className="p-2 bg-surface-container-low rounded flex justify-between">
                <span>1. Manpreet Singh (Post-CABG Day 2)</span>
                <span className="text-primary font-bold">CCU-03 → HDU-02</span>
              </div>
              <div className="p-2 bg-surface-container-low rounded flex justify-between">
                <span>2. Geeta Kapoor (Stable Arrhythmia)</span>
                <span className="text-primary font-bold">CCU-05 → HDU-06</span>
              </div>
              <div className="p-2 bg-surface-container-low rounded flex justify-between">
                <span>3. Rajeev Mehra (Pre-discharge)</span>
                <span className="text-primary font-bold">CCU-07 → Ward 304</span>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-surface-variant">
              <button
                onClick={() => setShowExpediteModal(false)}
                className="px-4 py-2 bg-surface-container rounded text-on-surface font-body-strong text-clinical-data cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowExpediteModal(false);
                  triggerToast("3 transfer orders confirmed and porter staff dispatched.");
                }}
                className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary rounded font-body-strong text-clinical-data cursor-pointer"
              >
                Confirm Transfers
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: PNEUMATIC POD STATUS */}
      {showPodModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-4 border border-outline-variant animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-surface-variant">
              <div className="flex items-center gap-2 text-error">
                <span className="material-symbols-outlined text-xl">airwave</span>
                <h3 className="font-page-title text-section-title text-on-surface font-semibold">
                  Pod #04 Telemetry
                </h3>
              </div>
              <button
                onClick={() => setShowPodModal(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface rounded hover:bg-surface-container cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-2 font-clinical-data text-clinical-data">
              <div className="flex justify-between">
                <span>Payload:</span>
                <strong className="text-on-surface">Heparin IV drip + Norepinephrine</strong>
              </div>
              <div className="flex justify-between">
                <span>Target:</span>
                <strong className="text-primary">CCU Resus Bay (Station 01)</strong>
              </div>
              <div className="flex justify-between">
                <span>Transit Status:</span>
                <span className="text-error font-bold font-clinical-data-mono">80% Traversed (ETA 8s)</span>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-surface-variant">
              <button
                onClick={() => setShowPodModal(false)}
                className="px-4 py-2 bg-surface-container rounded text-on-surface font-body-strong text-clinical-data cursor-pointer"
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
