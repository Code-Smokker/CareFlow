/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function AppointmentDetailPage() {
  const params = useParams();
  const appointmentId = (params?.id as string) || "APT-2024-99182";

  // Quick Action Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Modals
  const [isMoveQueueOpen, setIsMoveQueueOpen] = useState(false);
  const [isReassignOpen, setIsReassignOpen] = useState(false);
  const [isSlipOpen, setIsSlipOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isWristbandModalOpen, setIsWristbandModalOpen] = useState(false);
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);
  const [isRescheduleShiftOpen, setIsRescheduleShiftOpen] = useState(false);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);

  // Form states
  const [smsText, setSmsText] = useState(
    "Apollo Indraprastha Update: Patient Rahul Sharma (#104) is currently in emergency consultation with Dr. Rohit Verma in Room 04. Cath Lab team pre-alerted. Please remain in Triage Lounge Bay B."
  );

  const [reassignDoctor, setReassignDoctor] = useState("Dr. Rohit Verma, MD, DM");
  const [reassignRoom, setReassignRoom] = useState("Room 04 / ER Resuscitation Bay 02");

  return (
    <div className="flex flex-col w-full">
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

      {/* Top Operational Breadcrumb & Status Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-space-sm pb-space-sm">
        <div className="flex items-center gap-space-xs text-metadata-micro font-metadata-micro min-w-0">
          <span className="text-outline uppercase tracking-wider">Operations &amp; Registry</span>
          <span className="text-outline-variant">/</span>
          <Link
            className="text-outline hover:text-primary transition-colors"
            href="/schedule-opd-slots"
          >
            Schedule &amp; OPD Slots
          </Link>
          <span className="text-outline-variant">/</span>
          <span className="text-on-surface font-semibold truncate">
            Appointment #{appointmentId.startsWith("APT") ? appointmentId : "APT-2024-99182"}
          </span>
          <span className="inline-flex items-center gap-1 ml-space-xs px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-clinical-data-mono text-metadata-micro font-bold animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
            [In Consultation - STAT P1]
          </span>
        </div>

        {/* Quick Action Bar */}
        <div className="flex items-center flex-wrap gap-space-xs">
          <button
            onClick={() => setIsMoveQueueOpen(true)}
            className="flex items-center gap-1 h-8 px-space-sm py-1 bg-surface-container-lowest text-on-surface hover:bg-surface-container text-clinical-data font-clinical-data rounded shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined text-sm text-outline">swap_vert</span>
            <span>Move Queue</span>
          </button>
          <button
            onClick={() => setIsReassignOpen(true)}
            className="flex items-center gap-1 h-8 px-space-sm py-1 bg-surface-container-lowest text-on-surface hover:bg-surface-container text-clinical-data font-clinical-data rounded shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined text-sm text-outline">chevron_backward</span>
            <span>Reassign</span>
          </button>
          <button
            onClick={() => setIsSlipOpen(true)}
            className="flex items-center gap-1 h-8 px-space-sm py-1 bg-surface-container-lowest text-on-surface hover:bg-surface-container text-clinical-data font-clinical-data rounded shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined text-sm text-outline">print</span>
            <span>Slip &amp; Token</span>
          </button>
          <button
            onClick={() => setIsCancelModalOpen(true)}
            className="flex items-center gap-1 h-8 px-space-sm py-1 bg-surface-container-lowest text-error hover:bg-error-container text-clinical-data font-clinical-data rounded shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined text-sm text-error">event_busy</span>
            <span>Cancel / Reschedule</span>
          </button>
          <Link
            href="/patient-overview"
            className="flex items-center gap-1 h-8 px-space-md py-1 bg-primary text-on-primary hover:bg-primary-container text-clinical-data font-clinical-data rounded shadow-sm transition-all font-semibold"
          >
            <span className="material-symbols-outlined text-sm text-on-primary">clinical_notes</span>
            <span>Start Encounter Workspace</span>
          </Link>
        </div>
      </div>

      {/* Persistent Critical Patient Banner */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm mb-space-md border border-outline-variant/20">
        {/* Active Emergency Hairline Indicator */}
        <div className="w-full h-1 bg-error rounded-full mb-space-sm"></div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          {/* Patient Identity Group */}
          <div className="flex items-start sm:items-center gap-space-md">
            <div className="relative w-14 h-14 shrink-0 rounded-xl overflow-hidden bg-surface-container-high shadow-inner">
              <img
                className="w-full h-full object-cover"
                alt="Rahul Sharma"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCH4Pkgl4GjPJYm0viYr_e8Nxp0VBw_1QS0tKP5aUW19SNuXMVU82LmqUUcj8dbZ9fqCydG9JlfLHo9pQi1I2E5U8sL7t2XX3HzrKJdIIHV0UD5sYV4PKUWLa6D73T_cvvir6H7B3bzz-_JifdIMj7lM30KKfoR1xpjDvmrO8y5K5POYOT_ASeHhvaXGQkU9y0tvPft25_60KIn6lvAAoyTznEpc8y5oxwnnXp_6coPQ7MTN56ada4e"
              />
              <span className="absolute bottom-0 right-0 px-1 py-0.2 bg-error text-on-error font-clinical-data-mono text-[9px] font-bold rounded-tl">
                STAT
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex flex-wrap items-center gap-x-space-sm gap-y-1">
                <h1 className="font-page-title text-page-title text-on-surface tracking-tight font-bold">
                  Rahul Sharma
                </h1>
                <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-clinical-data-mono text-clinical-data">
                  42Y · Male
                </span>
                <span className="px-2 py-0.5 rounded bg-surface-container-low text-primary font-clinical-data-mono text-clinical-data font-semibold">
                  UHID: DEL-2024-8841
                </span>
                <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-clinical-data-mono text-metadata-micro font-bold uppercase tracking-wider">
                  Token #104
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-space-md gap-y-1 mt-1 text-metadata-micro font-metadata-micro text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-primary">verified</span>
                  ABHA: 91-8842-1920-4491 (Verified)
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-outline">meeting_room</span>
                  ER Resuscitation Bay 02 · Room 04
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-outline">stethoscope</span>
                  Attending: Dr. Rohit Verma (Chief Clinician)
                </span>
              </div>
            </div>
          </div>

          {/* Critical Alert Flash Strip */}
          <div className="flex items-center gap-space-sm bg-error-container text-on-error-container px-space-md py-2 rounded-lg self-stretch sm:self-auto shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-error text-xl animate-bounce">warning</span>
            <div className="flex flex-col">
              <span className="font-body-strong text-clinical-data text-error font-bold leading-none">
                CODE STEMI ACTIVE · CATH LAB LEVEL 1
              </span>
              <span className="font-metadata-micro text-metadata-micro text-on-error-container mt-0.5">
                Door-to-balloon target: &lt; 45m | High Priority Resuscitation Queue
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Column Tactical Clinical Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-normal items-start">
        {/* ========================================================================= */}
        {/* COLUMN 1: Operational Timeline & Intake Lifecycle (25% -> 3 of 12 cols)  */}
        {/* ========================================================================= */}
        <div className="lg:col-span-3 flex flex-col gap-space-md">
          <div className="bg-surface-container-lowest rounded-xl p-space-panel-padding shadow-sm border border-outline-variant/20">
            <div className="flex items-center justify-between pb-space-sm">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-base">history_toggle_off</span>
                <h2 className="font-section-title text-section-title text-on-surface">Lifecycle Milestones</h2>
              </div>
              <span className="font-clinical-data-mono text-metadata-micro text-outline">7 events</span>
            </div>
            <p className="font-metadata-micro text-metadata-micro text-on-surface-variant mb-space-md">
              Continuous operational ledger recorded from initial kiosk scan to present active care stage.
            </p>

            {/* Vertical Milestone Axis */}
            <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-container-highest">
              {/* Event 1 */}
              <div className="relative group">
                <div className="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full bg-primary ring-4 ring-surface-container-lowest"></div>
                <div className="flex items-baseline justify-between">
                  <span className="font-clinical-data-mono text-metadata-micro text-primary font-bold">13:55 IST</span>
                  <span className="font-metadata-micro text-[10px] text-outline">Walk-in</span>
                </div>
                <h3 className="font-body-strong text-clinical-data text-on-surface mt-0.5">Appointment Created</h3>
                <p className="font-metadata-micro text-metadata-micro text-on-surface-variant mt-0.5">
                  Source: Emergency Triage Desk Kiosk #02. Triaged as high-acuity chest discomfort.
                </p>
              </div>

              {/* Event 2 */}
              <div className="relative group">
                <div className="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full bg-primary ring-4 ring-surface-container-lowest"></div>
                <div className="flex items-baseline justify-between">
                  <span className="font-clinical-data-mono text-metadata-micro text-primary font-bold">14:10 IST</span>
                  <span className="font-metadata-micro text-[10px] text-primary font-semibold">Matched</span>
                </div>
                <h3 className="font-body-strong text-clinical-data text-on-surface mt-0.5">
                  Biometric Match Verified
                </h3>
                <p className="font-metadata-micro text-metadata-micro text-on-surface-variant mt-0.5">
                  Aadhaar Biometric eKYC complete. ABHA ID associated. Emergency Token #104 generated.
                </p>
              </div>

              {/* Event 3 */}
              <div className="relative group">
                <div className="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full bg-secondary ring-4 ring-surface-container-lowest"></div>
                <div className="flex items-baseline justify-between">
                  <span className="font-clinical-data-mono text-metadata-micro text-secondary font-bold">
                    14:18 IST
                  </span>
                  <span className="font-metadata-micro text-[10px] text-secondary font-semibold">98.4% conf</span>
                </div>
                <h3 className="font-body-strong text-clinical-data text-on-surface mt-0.5">
                  AI Voice Scribe Intake
                </h3>
                <p className="font-metadata-micro text-metadata-micro text-on-surface-variant mt-0.5">
                  Hinglish/English ambient dialogue parsed. Clinical extraction: Retrosternal pressure, diaphoresis.
                </p>
              </div>

              {/* Event 4 */}
              <div className="relative group">
                <div className="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full bg-error ring-4 ring-surface-container-lowest animate-ping"></div>
                <div className="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full bg-error ring-4 ring-surface-container-lowest"></div>
                <div className="flex items-baseline justify-between">
                  <span className="font-clinical-data-mono text-metadata-micro text-error font-bold">14:22 IST</span>
                  <span className="font-metadata-micro text-[10px] px-1 bg-error-container text-on-error-container font-bold rounded">
                    P1 STAT
                  </span>
                </div>
                <h3 className="font-body-strong text-clinical-data text-error font-bold mt-0.5">
                  Triage Scored: ESI Level 1
                </h3>
                <p className="font-metadata-micro text-metadata-micro text-on-surface-variant mt-0.5">
                  Red Flag Alert dispatched to Cardiology Duty Fellow and Cath Lab Charge Nurse.
                </p>
              </div>

              {/* Event 5 */}
              <div className="relative group">
                <div className="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full bg-primary ring-4 ring-surface-container-lowest"></div>
                <div className="flex items-baseline justify-between">
                  <span className="font-clinical-data-mono text-metadata-micro text-primary font-bold">14:25 IST</span>
                  <span className="font-metadata-micro text-[10px] text-outline">Telemetry</span>
                </div>
                <h3 className="font-body-strong text-clinical-data text-on-surface mt-0.5">
                  Mindray BeneVision N12 Linked
                </h3>
                <p className="font-metadata-micro text-metadata-micro text-on-surface-variant mt-0.5">
                  Continuous 12-lead ECG, NIBP, and Pulse Ox streaming to Station Bay 02 dashboard.
                </p>
              </div>

              {/* Event 6 */}
              <div className="relative group">
                <div className="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full bg-tertiary ring-4 ring-surface-container-lowest"></div>
                <div className="flex items-baseline justify-between">
                  <span className="font-clinical-data-mono text-metadata-micro text-tertiary font-bold">
                    14:28 IST
                  </span>
                  <span className="font-metadata-micro text-[10px] px-1 bg-secondary-container text-on-secondary-container font-bold rounded">
                    Active
                  </span>
                </div>
                <h3 className="font-body-strong text-clinical-data text-on-surface mt-0.5">Consultation Initiated</h3>
                <p className="font-metadata-micro text-metadata-micro text-on-surface-variant mt-0.5">
                  Dr. Rohit Verma signed in bedside. STAT orders placed.
                </p>
              </div>

              {/* Event 7 (Upcoming) */}
              <div className="relative group opacity-85">
                <div className="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full bg-surface-container-highest ring-4 ring-surface-container-lowest"></div>
                <div className="flex items-baseline justify-between">
                  <span className="font-clinical-data-mono text-metadata-micro text-outline font-bold">
                    Est. 14:45 IST
                  </span>
                  <span className="font-metadata-micro text-[10px] text-outline font-semibold">Pre-alerted</span>
                </div>
                <h3 className="font-body-strong text-clinical-data text-on-surface mt-0.5">
                  Cath Lab Hand-off Ready
                </h3>
                <p className="font-metadata-micro text-metadata-micro text-on-surface-variant mt-0.5">
                  Primary PCI team standing by in Lab Suite 01. Transfer gurney assigned.
                </p>
              </div>
            </div>

            {/* Audit & Digital Provenance Box */}
            <div className="mt-space-lg pt-space-md bg-surface-container-low p-space-sm rounded-lg border border-surface-container">
              <span className="font-table-header text-table-header text-outline uppercase tracking-wider block mb-1">
                Audit Ledger &amp; Digital Provenance
              </span>
              <div className="flex flex-col gap-1 text-metadata-micro font-metadata-micro">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Intake Registered By:</span>
                  <span className="text-on-surface font-semibold">Sr. Ancy Thomas (RN #4419)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Attending Sign-off:</span>
                  <span className="text-on-surface font-semibold">Dr. Rohit Verma (Chief Clin.)</span>
                </div>
                <div className="flex justify-between items-center pt-1 mt-1 bg-surface-container-lowest px-1.5 py-1 rounded">
                  <span className="text-outline flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-xs text-primary">fingerprint</span>
                    SHA-256 Sig
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText("7f8c92ae014b99824ff0123");
                      showToast("SHA-256 Signature copied to clipboard!");
                    }}
                    className="font-clinical-data-mono text-[10px] text-primary truncate max-w-[110px] hover:underline cursor-pointer"
                  >
                    7f8c92a...e014b
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* COLUMN 2: Specifications & Clinical Scheduling Details (45% -> 5 of 12)  */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 flex flex-col gap-space-md">
          {/* Primary Appointment Detail Card */}
          <div className="bg-surface-container-lowest rounded-xl p-space-panel-padding shadow-sm border border-outline-variant/20">
            <div className="flex items-center justify-between pb-space-sm mb-space-sm">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-base">calendar_today</span>
                <h2 className="font-section-title text-section-title text-on-surface">
                  Appointment Specifications
                </h2>
              </div>
              <span className="px-2 py-0.5 rounded bg-error-container text-on-error-container font-clinical-data-mono text-metadata-micro font-bold uppercase">
                STAT PROTOCOL
              </span>
            </div>

            {/* Visit Acuity & Type Header */}
            <div className="bg-surface-container-low p-space-md rounded-lg mb-space-md border border-surface-container">
              <span className="font-metadata-micro text-metadata-micro text-outline uppercase font-semibold">
                Encounter Profile
              </span>
              <h3 className="font-subheading text-subheading text-on-surface font-semibold mt-0.5">
                Emergency Walk-in Acute Cardiology Consultation
              </h3>
              <p className="font-clinical-data text-clinical-data text-on-surface-variant mt-1">
                Urgent unannounced clinical intake escalated directly from outpatient reception via Red Flag Protocol.
              </p>
            </div>

            {/* Chief Complaint Highlight Callout */}
            <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm mb-space-md border-l-4 border-error border border-outline-variant/30">
              <div className="flex items-center gap-space-xs text-error mb-1">
                <span className="material-symbols-outlined text-base">emergency</span>
                <span className="font-table-header text-table-header uppercase font-bold tracking-wider">
                  Chief Complaint (Presenting Problem)
                </span>
              </div>
              <blockquote className="font-body-strong text-body-strong text-on-surface pl-space-sm italic">
                &ldquo;Acute retrosternal crushing chest pain radiating to left jaw &amp; shoulder with profuse diaphoresis (45 min duration)&rdquo;
              </blockquote>
              <div className="flex flex-wrap items-center gap-space-sm mt-space-sm text-metadata-micro font-metadata-micro text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-primary">record_voice_over</span>
                  Reported by Attendant Priya Sharma (Wife)
                </span>
                <span>•</span>
                <span className="text-error font-semibold">Onset: ~13:10 IST during rest</span>
              </div>
            </div>

            {/* Specification Data Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm text-clinical-data mb-space-md">
              <div className="bg-surface-container-low p-space-sm rounded-lg border border-surface-container">
                <span className="font-metadata-micro text-metadata-micro text-outline block">Assigned Clinician</span>
                <span className="font-body-strong text-body-strong text-on-surface mt-0.5 block">
                  Dr. Rohit Verma, MD, DM
                </span>
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                  Chief of Clinical Services / Interventional Cardiology
                </span>
              </div>
              <div className="bg-surface-container-low p-space-sm rounded-lg border border-surface-container">
                <span className="font-metadata-micro text-metadata-micro text-outline block">Physical Location</span>
                <span className="font-body-strong text-body-strong text-on-surface mt-0.5 block">
                  Cardiology Wing · Gr Floor
                </span>
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                  Room 04 / ER Resuscitation Bay 02
                </span>
              </div>
              <div className="bg-surface-container-low p-space-sm rounded-lg border border-surface-container">
                <span className="font-metadata-micro text-metadata-micro text-outline block">Expected Duration</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="font-clinical-data-mono text-body-strong text-on-surface font-bold">30 mins</span>
                  <span className="px-1.5 py-0.2 rounded bg-surface-container text-primary font-metadata-micro text-metadata-micro">
                    Extended STAT
                  </span>
                </div>
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                  Normal OPD: 15m (Overridden)
                </span>
              </div>
              <div className="bg-surface-container-low p-space-sm rounded-lg border border-surface-container">
                <span className="font-metadata-micro text-metadata-micro text-outline block">Referral Intake Source</span>
                <span className="font-body-strong text-body-strong text-on-surface mt-0.5 block">
                  ER Triage Kiosk #02
                </span>
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                  Self-Walk-in with attendant Priya Sharma
                </span>
              </div>
            </div>

            {/* Queue Context & Departmental Load Balance */}
            <div className="bg-surface-container-low p-space-md rounded-lg mb-space-md border border-surface-container">
              <div className="flex items-center justify-between mb-space-xs">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-base">format_list_numbered</span>
                  <span className="font-table-header text-table-header text-on-surface uppercase font-bold">
                    Queue Context &amp; Prioritization
                  </span>
                </div>
                <span className="font-clinical-data-mono text-metadata-micro text-primary font-semibold">
                  Priority Slot #01
                </span>
              </div>
              <div className="grid grid-cols-3 gap-space-xs text-center py-space-xs">
                <div className="bg-surface-container-lowest p-2 rounded shadow-xs border border-surface-container">
                  <span className="font-metadata-micro text-metadata-micro text-outline block">Current Position</span>
                  <span className="font-clinical-data-mono text-page-title text-error font-bold leading-tight">01</span>
                  <span className="font-metadata-micro text-[10px] text-error font-semibold">STAT Immediate</span>
                </div>
                <div className="bg-surface-container-lowest p-2 rounded shadow-xs border border-surface-container">
                  <span className="font-metadata-micro text-metadata-micro text-outline block">Active Wait</span>
                  <span className="font-clinical-data-mono text-page-title text-primary font-bold leading-tight">
                    00<span className="text-sm font-normal">m</span>
                  </span>
                  <span className="font-metadata-micro text-[10px] text-primary font-semibold">Zero-Wait Override</span>
                </div>
                <div className="bg-surface-container-lowest p-2 rounded shadow-xs border border-surface-container">
                  <span className="font-metadata-micro text-metadata-micro text-outline block">OPD Room Load</span>
                  <span className="font-clinical-data-mono text-page-title text-on-surface font-bold leading-tight">
                    8<span className="text-xs font-normal text-outline">/14</span>
                  </span>
                  <span className="font-metadata-micro text-[10px] text-outline font-semibold">Station 04 Busy</span>
                </div>
              </div>
            </div>

            {/* Scheduling Conflict Mitigation Banner */}
            <div className="bg-surface-container p-space-sm rounded-lg mb-space-md border border-outline-variant/30">
              <div className="flex items-start gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-base shrink-0 mt-0.5">info</span>
                <div className="flex flex-col text-metadata-micro font-metadata-micro">
                  <span className="font-body-strong text-on-surface font-semibold">Conflict Resolution Managed</span>
                  <p className="text-on-surface-variant mt-0.5">
                    0 hard slot collisions. 1 routine consultation (
                    <strong className="text-on-surface">Rajesh Patel, Token #121</strong>) delayed by 15 mins. Automated
                    bilingual SMS notification dispatched to patient attendant cell.
                  </p>
                </div>
              </div>
            </div>

            {/* Internal Notes & Bedside Directives */}
            <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-outline-variant/20">
              <div className="flex items-center gap-space-xs text-on-surface mb-1">
                <span className="material-symbols-outlined text-base text-outline">edit_note</span>
                <span className="font-table-header text-table-header uppercase font-bold tracking-wider">
                  Internal Notes &amp; Bedside Directives
                </span>
              </div>
              <p className="font-clinical-data text-clinical-data text-on-surface-variant bg-surface-container-low p-space-sm rounded border border-surface-container">
                &ldquo;Patient requires direct monitored gurney transfer. Do NOT divert to standard OPD waiting lounge. Cath
                Lab Team #01 pre-alerted. Two large-bore IVs placed (18G left antecubital).&rdquo;
              </p>
              <div className="flex items-center justify-between text-metadata-micro font-metadata-micro text-outline mt-2 pt-1 border-t border-surface-container">
                <span>Authored by: Triage Officer Dr. M. Iyer</span>
                <span className="font-clinical-data-mono">Logged: 14:23 IST</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* COLUMN 3: Clinical Snapshot & Operational Safety Guards (30% -> 4 of 12)  */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 flex flex-col gap-space-md">
          {/* Red Flag & Clinical Safety Guards */}
          <div className="bg-surface-container-lowest rounded-xl p-space-panel-padding shadow-sm border border-outline-variant/20">
            <div className="flex items-center justify-between pb-space-sm mb-space-sm">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-error text-base">security</span>
                <h2 className="font-section-title text-section-title text-on-surface">Safety Guards &amp; Vitals</h2>
              </div>
              <span className="flex items-center gap-1 font-clinical-data-mono text-metadata-micro text-primary font-semibold">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                LIVE TELEMETRY
              </span>
            </div>

            {/* Critical Hard-Stop Allergy Panel */}
            <div className="bg-error-container text-on-error-container p-space-sm rounded-lg mb-space-md shadow-xs">
              <div className="flex items-center gap-1 mb-1">
                <span className="material-symbols-outlined text-error text-base">crisis_alert</span>
                <span className="font-table-header text-table-header text-error font-bold uppercase">
                  Active Hard-Stop Allergies
                </span>
              </div>
              <div className="flex flex-col gap-1 text-clinical-data font-clinical-data">
                <div className="flex items-center justify-between bg-surface-container-lowest/90 px-2 py-1 rounded">
                  <span className="text-error font-bold">PENICILLIN</span>
                  <span className="text-metadata-micro font-metadata-micro text-on-error-container">
                    Type 1 IgE Anaphylaxis
                  </span>
                </div>
                <div className="flex items-center justify-between bg-surface-container-lowest/90 px-2 py-1 rounded">
                  <span className="text-on-surface font-semibold">ASPIRIN</span>
                  <span className="text-metadata-micro font-metadata-micro text-on-surface-variant">
                    Severe Gastric Intolerance
                  </span>
                </div>
              </div>
            </div>

            {/* Tabular Vitals Matrix */}
            <div className="mb-space-md">
              <div className="flex items-center justify-between mb-space-xs">
                <span className="font-table-header text-table-header text-outline uppercase font-semibold">
                  Hemodynamic Matrix
                </span>
                <span className="font-clinical-data-mono text-metadata-micro text-outline">14:26 IST · N12</span>
              </div>
              <div className="grid grid-cols-2 gap-space-xs">
                {/* BP Metric */}
                <div className="bg-surface-container-low p-space-sm rounded-lg border border-surface-container">
                  <span className="font-metadata-micro text-metadata-micro text-outline block">NIBP Blood Pressure</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-clinical-data-mono text-section-title text-error font-bold">148/92</span>
                    <span className="font-metadata-micro text-metadata-micro text-outline">mmHg</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="px-1 py-0.2 bg-error-container text-error font-clinical-data-mono text-[10px] font-bold rounded">
                      ↑ Stage 2 HTN
                    </span>
                  </div>
                </div>

                {/* Heart Rate Metric */}
                <div className="bg-surface-container-low p-space-sm rounded-lg border border-surface-container">
                  <span className="font-metadata-micro text-metadata-micro text-outline block">Pulse / Heart Rate</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-clinical-data-mono text-section-title text-error font-bold">104</span>
                    <span className="font-metadata-micro text-metadata-micro text-outline">bpm</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="px-1 py-0.2 bg-error-container text-error font-clinical-data-mono text-[10px] font-bold rounded">
                      ↑ Sinus Tach
                    </span>
                  </div>
                </div>

                {/* SpO2 Metric */}
                <div className="bg-surface-container-low p-space-sm rounded-lg border border-surface-container">
                  <span className="font-metadata-micro text-metadata-micro text-outline block">SpO2 Saturation</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-clinical-data-mono text-section-title text-primary font-bold">98</span>
                    <span className="font-metadata-micro text-metadata-micro text-outline">%</span>
                  </div>
                  <span className="font-metadata-micro text-[10px] text-on-surface-variant block mt-1">
                    On 2L O2 Nasal Cannula
                  </span>
                </div>

                {/* POCT Glucose */}
                <div className="bg-surface-container-low p-space-sm rounded-lg border border-surface-container">
                  <span className="font-metadata-micro text-metadata-micro text-outline block">Blood Sugar POCT</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-clinical-data-mono text-section-title text-on-surface font-bold">118</span>
                    <span className="font-metadata-micro text-metadata-micro text-outline">mg/dL</span>
                  </div>
                  <span className="font-metadata-micro text-[10px] text-primary block mt-1 font-semibold">
                    ● Normal Euglycemic
                  </span>
                </div>
              </div>
            </div>

            {/* Diagnostic Waveform / 12-Lead Trigger Graphic */}
            <div className="bg-surface-container-low p-space-sm rounded-lg mb-space-md border border-surface-container">
              <div className="flex items-center justify-between mb-1">
                <span className="font-table-header text-table-header text-on-surface uppercase font-bold">
                  STAT 12-Lead ECG Trigger
                </span>
                <span className="font-clinical-data-mono text-[11px] text-error font-bold">ST-Elevation +3.2mm</span>
              </div>
              <div className="bg-surface-container-lowest p-2 rounded flex flex-col gap-1 border border-surface-container">
                <div className="flex justify-between items-center text-metadata-micro font-clinical-data-mono text-on-surface">
                  <span>Leads: V2, V3, V4</span>
                  <span className="text-error font-semibold">Anteroseptal Infarction Pattern</span>
                </div>
                {/* Diagnostic SVG sparkline wave */}
                <svg
                  className="w-full h-10 text-error overflow-hidden"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  viewBox="0 0 300 40"
                >
                  <path d="M0,20 L40,20 L46,20 L50,14 L55,26 L60,20 L75,20 L80,20 L84,5 L89,35 L94,20 L98,20 L104,11 L110,11 L120,20 L160,20 L166,20 L170,14 L175,26 L180,20 L195,20 L200,20 L204,4 L209,36 L214,19 L218,19 L224,10 L232,10 L242,20 L300,20"></path>
                </svg>
                <span className="text-metadata-micro font-metadata-micro text-outline">
                  Digital telemetry strip recorded at 14:24:12 IST
                </span>
              </div>
            </div>

            {/* Active Medications / Interaction Cross-Check */}
            <div className="mb-space-md">
              <span className="font-table-header text-table-header text-outline uppercase font-semibold block mb-space-xs">
                Current Active Regimen
              </span>
              <div className="space-y-1 text-clinical-data font-clinical-data">
                <div className="flex items-center justify-between p-1.5 bg-surface-container-low rounded border border-surface-container">
                  <span className="text-on-surface font-medium">Amlodipine 5mg</span>
                  <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">OD (Morning)</span>
                </div>
                <div className="flex items-center justify-between p-1.5 bg-surface-container-low rounded border border-surface-container">
                  <span className="text-on-surface font-medium">Telmisartan 40mg</span>
                  <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                    OD (Hypertension)
                  </span>
                </div>
                <div className="flex items-center justify-between p-1.5 bg-error-container text-on-error-container rounded border border-error/20">
                  <span className="font-semibold">Metformin 500mg</span>
                  <span className="font-clinical-data-mono text-metadata-micro font-bold text-error">
                    HOLD (Contrast dye risk)
                  </span>
                </div>
                <div className="flex items-center justify-between p-1.5 bg-surface-container-low rounded border border-surface-container">
                  <span className="text-on-surface font-medium">Atorvastatin 20mg</span>
                  <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">HS (Lipids)</span>
                </div>
              </div>
            </div>

            {/* ABHA M1/M2/M3 Verification Card */}
            <div className="bg-surface-container-low p-space-sm rounded-lg mb-space-md border border-surface-container">
              <div className="flex items-center justify-between text-metadata-micro font-metadata-micro mb-1">
                <span className="text-on-surface font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-primary">verified_user</span>
                  ABHA Consent Node
                </span>
                <span className="font-clinical-data-mono text-primary font-bold">M1 · M2 · M3 Active</span>
              </div>
              <p className="text-metadata-micro font-metadata-micro text-on-surface-variant">
                Emergency Consent Override activated by Attending Physician for acute ischemic event record sync.
              </p>
            </div>

            {/* Operational Command Bar (Column Action Deck) */}
            <div className="pt-space-sm space-y-2">
              <button
                onClick={() => setIsWristbandModalOpen(true)}
                className="w-full h-9 flex items-center justify-center gap-2 bg-primary text-on-primary hover:bg-primary-container text-clinical-data font-clinical-data rounded font-semibold shadow-sm transition-colors"
              >
                <span className="material-symbols-outlined text-base">badge</span>
                <span>Print Wristband &amp; Barcode</span>
              </button>
              <button
                onClick={() => setIsSmsModalOpen(true)}
                className="w-full h-9 flex items-center justify-center gap-2 bg-surface-container text-on-surface hover:bg-surface-container-high text-clinical-data font-clinical-data rounded font-semibold transition-colors"
              >
                <span className="material-symbols-outlined text-base text-outline">sms</span>
                <span>Send Attendant SMS Update</span>
              </button>
              <button
                onClick={() => setIsRescheduleShiftOpen(true)}
                className="w-full h-9 flex items-center justify-center gap-2 bg-surface-container text-on-surface hover:bg-surface-container-high text-clinical-data font-clinical-data rounded font-semibold transition-colors"
              >
                <span className="material-symbols-outlined text-base text-outline">schedule_send</span>
                <span>Reschedule Shift Bookings</span>
              </button>
              <button
                onClick={() => setIsBillModalOpen(true)}
                className="w-full h-9 flex items-center justify-center gap-2 bg-secondary text-on-secondary hover:bg-on-secondary-container text-clinical-data font-clinical-data rounded font-semibold transition-colors"
              >
                <span className="material-symbols-outlined text-base">receipt_long</span>
                <span>Complete &amp; Bill Encounter</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: MOVE QUEUE MODAL */}
      {/* ========================================================================= */}
      {isMoveQueueOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-md w-full overflow-hidden">
            <div className="px-5 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">swap_vert</span>
                <h3 className="font-body-strong text-body-strong text-on-surface">Adjust Queue Priority</h3>
              </div>
              <button
                onClick={() => setIsMoveQueueOpen(false)}
                className="text-on-surface-variant hover:text-on-surface rounded p-1"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4 text-clinical-data">
              <p className="text-on-surface-variant text-metadata-micro">
                Adjust the queue order for <strong className="text-on-surface">Rahul Sharma (Token #104)</strong>. Currently assigned to Priority Slot #01 (STAT Immediate).
              </p>
              <div className="p-3 bg-surface-container-low rounded flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-on-surface">Current Standing:</span>
                  <span className="px-2 py-0.5 bg-error text-on-error font-bold text-xs rounded">Slot #1 (STAT)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-on-surface">Target Position:</span>
                  <select className="h-8 px-2 rounded border border-outline-variant bg-surface-container-lowest text-on-surface">
                    <option>Priority #1 (Immediate STAT Override)</option>
                    <option>Priority #2 (Fast-Track Bay)</option>
                    <option>Priority #3 (Standard Queue)</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setIsMoveQueueOpen(false)}
                  className="px-3 py-1.5 rounded bg-surface-container text-on-surface hover:bg-surface-container-high font-semibold text-clinical-data"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMoveQueueOpen(false);
                    showToast("Queue priority confirmed: Locked at Slot #1 STAT.");
                  }}
                  className="px-4 py-1.5 rounded bg-primary text-on-primary hover:bg-primary-container font-semibold text-clinical-data shadow-sm"
                >
                  Apply Queue Shift
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: REASSIGN MODAL */}
      {/* ========================================================================= */}
      {isReassignOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-md w-full overflow-hidden">
            <div className="px-5 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">swap_horiz</span>
                <h3 className="font-body-strong text-body-strong text-on-surface">Reassign Clinician / Room</h3>
              </div>
              <button
                onClick={() => setIsReassignOpen(false)}
                className="text-on-surface-variant hover:text-on-surface rounded p-1"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4 text-clinical-data">
              <div>
                <label className="block text-metadata-micro uppercase font-semibold text-outline mb-1">
                  Attending Clinician
                </label>
                <select
                  value={reassignDoctor}
                  onChange={(e) => setReassignDoctor(e.target.value)}
                  className="w-full h-8 px-2 rounded border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                >
                  <option value="Dr. Rohit Verma, MD, DM">Dr. Rohit Verma, MD, DM (Cardiology)</option>
                  <option value="Dr. Sandeep Goyal, MD">Dr. Sandeep Goyal, MD (Cath Lab On-Call)</option>
                  <option value="Dr. Sameer Kulkarni, MD">Dr. Sameer Kulkarni, MD (Endo)</option>
                  <option value="Dr. Anjali Nair, MD">Dr. Anjali Nair, MD (Gen Med)</option>
                </select>
              </div>
              <div>
                <label className="block text-metadata-micro uppercase font-semibold text-outline mb-1">
                  Physical Bay / Suite
                </label>
                <input
                  type="text"
                  value={reassignRoom}
                  onChange={(e) => setReassignRoom(e.target.value)}
                  className="w-full h-8 px-3 rounded border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setIsReassignOpen(false)}
                  className="px-3 py-1.5 rounded bg-surface-container text-on-surface hover:bg-surface-container-high font-semibold text-clinical-data"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsReassignOpen(false);
                    showToast(`Reassigned to ${reassignDoctor} at ${reassignRoom}.`);
                  }}
                  className="px-4 py-1.5 rounded bg-primary text-on-primary hover:bg-primary-container font-semibold text-clinical-data shadow-sm"
                >
                  Confirm Reassignment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: SLIP & TOKEN PRINT PREVIEW */}
      {/* ========================================================================= */}
      {isSlipOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-sm w-full overflow-hidden">
            <div className="px-5 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">receipt</span>
                <h3 className="font-body-strong text-body-strong text-on-surface">Encounter Routing Slip</h3>
              </div>
              <button
                onClick={() => setIsSlipOpen(false)}
                className="text-on-surface-variant hover:text-on-surface rounded p-1"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="p-5 flex flex-col items-center text-center gap-3">
              <div className="w-full p-4 bg-surface-container-low rounded-lg border border-dashed border-outline font-clinical-data-mono flex flex-col items-center">
                <span className="font-bold text-xs uppercase text-primary">CareFlow Clinical · Apollo Indraprastha</span>
                <span className="text-[10px] text-outline">EMERGENCY CARDIOLOGY INTAKE SLIP</span>
                <div className="my-2 py-1 px-4 bg-error text-on-error rounded text-2xl font-bold">
                  TOKEN #104
                </div>
                <div className="text-xs font-bold text-on-surface">Rahul Sharma (42M)</div>
                <div className="text-[10px] text-on-surface-variant">UHID: DEL-2024-8841</div>
                <div className="text-[10px] text-on-surface-variant">ABHA: 91-8842-1920-4491@abdm</div>
                <div className="text-[10px] text-error font-bold mt-1">ACUITY: P1 STAT CRITICAL · CODE STEMI</div>
                <div className="text-[10px] text-on-surface-variant">Room 04 / ER Resuscitation Bay 02</div>

                {/* Simulated Barcode */}
                <div className="my-3 flex items-center justify-center gap-0.5 h-10 w-full px-4 bg-surface-container-lowest py-1 rounded">
                  <div className="w-1 h-8 bg-black"></div>
                  <div className="w-0.5 h-8 bg-black"></div>
                  <div className="w-1.5 h-8 bg-black"></div>
                  <div className="w-0.5 h-8 bg-black"></div>
                  <div className="w-2 h-8 bg-black"></div>
                  <div className="w-1 h-8 bg-black"></div>
                  <div className="w-0.5 h-8 bg-black"></div>
                  <div className="w-1.5 h-8 bg-black"></div>
                  <div className="w-2 h-8 bg-black"></div>
                  <div className="w-0.5 h-8 bg-black"></div>
                  <div className="w-1 h-8 bg-black"></div>
                </div>
                <span className="text-[9px] text-outline">Scan to Sync FHIR Encounter enc-20241018-0904</span>
              </div>

              <div className="w-full flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSlipOpen(false)}
                  className="px-3 py-1.5 rounded bg-surface-container text-on-surface hover:bg-surface-container-high font-semibold text-clinical-data flex-1"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSlipOpen(false);
                    showToast("Routing slip sent to Zebra thermal printer.");
                  }}
                  className="px-4 py-1.5 rounded bg-primary text-on-primary hover:bg-primary-container font-semibold text-clinical-data shadow-sm flex items-center justify-center gap-1 flex-1"
                >
                  <span className="material-symbols-outlined text-sm">print</span>
                  Print Slip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: CANCEL / RESCHEDULE MODAL */}
      {/* ========================================================================= */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-md w-full overflow-hidden">
            <div className="px-5 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2 text-error">
                <span className="material-symbols-outlined text-xl">event_busy</span>
                <h3 className="font-body-strong text-body-strong text-on-surface">
                  Cancel or Reschedule Encounter
                </h3>
              </div>
              <button
                onClick={() => setIsCancelModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface rounded p-1"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4 text-clinical-data">
              <div className="p-3 bg-error/10 border-l-4 border-error rounded text-error text-metadata-micro font-semibold">
                WARNING: This encounter is marked STAT P1 (Active STEMI protocol). Cancelling or rescheduling will halt emergency clinical alerting.
              </div>
              <div>
                <label className="block text-metadata-micro uppercase font-semibold text-outline mb-1">
                  Reason for Cancellation / Shift
                </label>
                <select className="w-full h-8 px-2 rounded border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary">
                  <option>Patient Transferred to External Facility</option>
                  <option>Duplicate Encounter Entry</option>
                  <option>Patient Left Against Medical Advice (LAMA)</option>
                  <option>Clinician Requested Reschedule</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setIsCancelModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-surface-container text-on-surface hover:bg-surface-container-high font-semibold text-clinical-data"
                >
                  Abort
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCancelModalOpen(false);
                    showToast("Encounter cancelled and logged to clinical audit trail.");
                  }}
                  className="px-4 py-1.5 rounded bg-error text-on-error hover:opacity-90 font-semibold text-clinical-data shadow-sm"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: WRISTBAND & BARCODE */}
      {/* ========================================================================= */}
      {isWristbandModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-md w-full overflow-hidden">
            <div className="px-5 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">badge</span>
                <h3 className="font-body-strong text-body-strong text-on-surface">Patient Wristband Preview</h3>
              </div>
              <button
                onClick={() => setIsWristbandModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface rounded p-1"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="p-5 flex flex-col items-center text-center gap-3">
              {/* Wristband Representation */}
              <div className="w-full p-4 bg-error-container/30 border-2 border-error rounded-xl flex items-center justify-between font-clinical-data-mono">
                <div className="flex flex-col text-left">
                  <span className="font-bold text-sm text-error">RED FLAG · STAT P1</span>
                  <span className="font-bold text-base text-on-surface">Rahul Sharma (42M)</span>
                  <span className="text-xs text-outline">UHID: DEL-2024-8841</span>
                  <span className="text-[10px] text-error font-semibold mt-1">ALLERGY: PENICILLIN</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-surface-container-lowest p-1 rounded flex items-center justify-center border border-outline-variant">
                    <span className="material-symbols-outlined text-4xl text-on-surface">qr_code_2</span>
                  </div>
                  <span className="text-[9px] text-outline mt-1">TOKEN #104</span>
                </div>
              </div>
              <div className="w-full flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWristbandModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-surface-container text-on-surface hover:bg-surface-container-high font-semibold text-clinical-data flex-1"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsWristbandModalOpen(false);
                    showToast("Hospital wristband dispatched to Triage Desk Label Printer.");
                  }}
                  className="px-4 py-1.5 rounded bg-primary text-on-primary hover:bg-primary-container font-semibold text-clinical-data shadow-sm flex items-center justify-center gap-1 flex-1"
                >
                  <span className="material-symbols-outlined text-sm">print</span>
                  Print Wristband
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: SEND ATTENDANT SMS */}
      {/* ========================================================================= */}
      {isSmsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-md w-full overflow-hidden">
            <div className="px-5 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">sms</span>
                <h3 className="font-body-strong text-body-strong text-on-surface">Send Attendant SMS Notification</h3>
              </div>
              <button
                onClick={() => setIsSmsModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface rounded p-1"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4 text-clinical-data">
              <div className="text-metadata-micro text-on-surface-variant">
                Recipient: <strong className="text-on-surface">Priya Sharma (Wife)</strong> · Mobile: <strong className="text-on-surface">+91 98110-XXXXX</strong>
              </div>
              <div>
                <label className="block text-metadata-micro uppercase font-semibold text-outline mb-1">
                  Message Content (English / Bilingual)
                </label>
                <textarea
                  rows={4}
                  value={smsText}
                  onChange={(e) => setSmsText(e.target.value)}
                  className="w-full p-2.5 rounded border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary text-metadata-micro"
                ></textarea>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setIsSmsModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-surface-container text-on-surface hover:bg-surface-container-high font-semibold text-clinical-data"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSmsModalOpen(false);
                    showToast("SMS dispatched via Apollo Gateway to attendant phone.");
                  }}
                  className="px-4 py-1.5 rounded bg-primary text-on-primary hover:bg-primary-container font-semibold text-clinical-data shadow-sm flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">send</span>
                  Send SMS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 7: RESCHEDULE SHIFT BOOKINGS */}
      {/* ========================================================================= */}
      {isRescheduleShiftOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-md w-full overflow-hidden">
            <div className="px-5 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">schedule_send</span>
                <h3 className="font-body-strong text-body-strong text-on-surface">Conflict Resolution &amp; Shift Shift</h3>
              </div>
              <button
                onClick={() => setIsRescheduleShiftOpen(false)}
                className="text-on-surface-variant hover:text-on-surface rounded p-1"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4 text-clinical-data">
              <p className="text-on-surface-variant text-metadata-micro">
                Because Rahul Sharma (#104) is occupying an extended 30-minute STAT slot, downstream appointments in Room 04 need adjustment:
              </p>
              <div className="p-3 bg-surface-container-low rounded flex items-center justify-between">
                <div>
                  <span className="font-bold text-on-surface">Rajesh Patel (#121)</span>
                  <span className="text-metadata-micro text-outline block">Delayed by 15 mins (15:00 IST)</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-primary text-on-primary font-semibold text-metadata-micro">
                  SMS Dispatched
                </span>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setIsRescheduleShiftOpen(false)}
                  className="px-3 py-1.5 rounded bg-surface-container text-on-surface hover:bg-surface-container-high font-semibold text-clinical-data"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsRescheduleShiftOpen(false);
                    showToast("Shift schedule auto-balanced across afternoon block.");
                  }}
                  className="px-4 py-1.5 rounded bg-primary text-on-primary hover:bg-primary-container font-semibold text-clinical-data shadow-sm"
                >
                  Auto-Balance Shift
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 8: COMPLETE & BILL ENCOUNTER */}
      {/* ========================================================================= */}
      {isBillModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-md w-full overflow-hidden">
            <div className="px-5 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-xl">receipt_long</span>
                <h3 className="font-body-strong text-body-strong text-on-surface">Complete &amp; Bill Encounter</h3>
              </div>
              <button
                onClick={() => setIsBillModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface rounded p-1"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4 text-clinical-data">
              <div className="p-3 bg-surface-container-low rounded flex flex-col gap-1.5 text-metadata-micro">
                <div className="flex justify-between">
                  <span className="text-outline">Emergency Intake Fee:</span>
                  <span className="font-semibold text-on-surface">₹ 1,500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Bedside 12-Lead ECG:</span>
                  <span className="font-semibold text-on-surface">₹ 850</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">POCUS Bedside Echo:</span>
                  <span className="font-semibold text-on-surface">₹ 2,200</span>
                </div>
                <div className="flex justify-between border-t border-surface-container pt-1 font-bold text-on-surface">
                  <span>Total Billable to Date:</span>
                  <span className="text-primary font-clinical-data-mono">₹ 4,550</span>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setIsBillModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-surface-container text-on-surface hover:bg-surface-container-high font-semibold text-clinical-data"
                >
                  Cancel
                </button>
                <Link
                  href="/billing-payments"
                  onClick={() => setIsBillModalOpen(false)}
                  className="px-4 py-1.5 rounded bg-primary text-on-primary hover:bg-primary-container font-semibold text-clinical-data shadow-sm inline-block"
                >
                  Open Billing &amp; Payments
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
