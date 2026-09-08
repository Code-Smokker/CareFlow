/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import Link from "next/link";

interface ReviewSignProps {
  onBackToEdit?: () => void;
}

export default function ReviewSignPage({ onBackToEdit }: ReviewSignProps) {
  const [legalAckChecked, setLegalAckChecked] = useState<boolean>(true);
  const [isSigning, setIsSigning] = useState<boolean>(false);
  const [isSigned, setIsSigned] = useState<boolean>(false);
  const [showPacsModal, setShowPacsModal] = useState<boolean>(false);
  const [toast, setToast] = useState<{ title: string; message: string; icon: string } | null>(null);

  const showToast = (title: string, message: string, icon: string = "info") => {
    setToast({ title, message, icon });
    setTimeout(() => {
      setToast(null);
    }, 3800);
  };

  const handleFinalSign = () => {
    if (!legalAckChecked) {
      showToast("Certification Required", "Please check the mandatory clinical certification box before finalizing.", "warning");
      return;
    }

    setIsSigning(true);
    showToast("Generating Cryptographic Token", "Hashing FHIR bundle with SHA-256 and signing with HSM RSA-4096...", "sync");

    setTimeout(() => {
      setIsSigning(false);
      setIsSigned(true);
      showToast("Encounter Sealed & Locked", "Committed to ABDM Health Data Locker and Apollo Indraprastha EHR.", "verified");
    }, 900);
  };

  const handleSaveDraft = () => {
    showToast("Draft Suspended", "Encounter draft saved. Attending signature pending.", "pause_circle");
  };

  return (
    <div className="flex flex-col w-full pb-space-2xl">
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
            <span className="material-symbols-outlined text-sm">draw</span>
            Review &amp; Sign
          </span>
          <Link
            href="/document-tray"
            className="px-2.5 py-1 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface font-medium transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">document_scanner</span>
            Document Tray &amp; OCR
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-space-xs font-clinical-data-mono text-metadata-micro text-outline">
          <span className="h-2 w-2 rounded-full bg-primary inline-block animate-pulse"></span>
          <span>HSM Keystore: <strong>ONLINE</strong></span>
        </div>
      </div>

      {/* Top Progress Indicator / Audit Breadcrumb */}
      <div className="flex items-center justify-between py-space-xs mb-space-sm px-space-xs flex-wrap gap-2">
        <div className="flex items-center gap-space-sm text-metadata-micro font-metadata-micro text-on-surface-variant flex-wrap">
          {onBackToEdit ? (
            <button
              onClick={onBackToEdit}
              className="flex items-center gap-1 text-primary font-semibold hover:underline"
            >
              <span className="material-symbols-outlined text-sm">check_circle</span> 1. Clinical Intake
            </button>
          ) : (
            <Link
              href="/consultation-workspace"
              className="flex items-center gap-1 text-primary font-semibold hover:underline"
            >
              <span className="material-symbols-outlined text-sm">check_circle</span> 1. Clinical Intake
            </Link>
          )}
          <span className="text-outline-variant font-clinical-data-mono">/</span>
          <span className="flex items-center gap-1 text-primary font-semibold">
            <span className="material-symbols-outlined text-sm">check_circle</span> 2. Triage &amp; Vitals
          </span>
          <span className="text-outline-variant font-clinical-data-mono">/</span>
          <span className="flex items-center gap-1 text-primary font-semibold">
            <span className="material-symbols-outlined text-sm">check_circle</span> 3. Orders &amp; Interventions
          </span>
          <span className="text-outline-variant font-clinical-data-mono">/</span>
          <span className="flex items-center gap-1 text-on-surface font-bold bg-secondary-container text-on-secondary-container px-space-xs py-0.5 rounded">
            <span className="material-symbols-outlined text-sm">draw</span> 4. Review &amp; Sign
          </span>
        </div>
        <div className="flex items-center gap-space-md flex-wrap">
          <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">
            FHIR Audit Trail ID: <strong className="text-on-surface font-semibold">#AUD-2024-8841-SIGN</strong>
          </span>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
            <span className="font-metadata-micro text-metadata-micro text-primary font-semibold uppercase tracking-wider">
              HSM Keystore Online
            </span>
          </div>
        </div>
      </div>

      {/* Patient & Encounter Status Header with Alert Stripe */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden mb-space-base">
        {/* Active Critical Alert Ribbon */}
        <div className="bg-error px-panel-padding py-1.5 flex items-center justify-between text-on-error flex-wrap gap-2">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-base">crisis_alert</span>
            <span className="font-body-strong text-clinical-data tracking-wide uppercase">
              P1 High Alert: STEMI Protocol Activated · STAT Primary PCI Triggered
            </span>
          </div>
          <div className="flex items-center gap-space-md text-metadata-micro font-clinical-data-mono flex-wrap">
            <span className="bg-surface-container-lowest/20 px-2 py-0.5 rounded font-semibold">
              DOOR-TO-BALLOON: 18m ELAPSED
            </span>
            <span>FALL RISK: YES</span>
            <span className="bg-error-container text-on-error-container px-1.5 py-0.5 rounded font-bold">
              ALLERGY: PENICILLIN (ANAPHYLAXIS)
            </span>
          </div>
        </div>

        {/* Main Header Body */}
        <div className="p-panel-padding flex flex-col xl:flex-row xl:items-center justify-between gap-space-base">
          <div className="flex items-start gap-space-base">
            <div className="h-14 w-14 rounded-xl bg-surface-container-high flex items-center justify-center text-primary font-page-title text-page-title shrink-0">
              RS
            </div>
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-space-sm">
                <h1 className="font-page-title text-page-title text-on-surface">Rahul Sharma</h1>
                <span className="font-clinical-data-mono text-clinical-data text-on-surface-variant bg-surface-container px-space-xs py-0.5 rounded">
                  42M · Male
                </span>
                <span className="bg-primary/10 text-primary font-clinical-data-mono text-metadata-micro px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">verified</span> ABHA: 91-8842-1920-4491
                </span>
                <span className="font-clinical-data-mono text-metadata-micro text-outline bg-surface-container-low px-2 py-0.5 rounded">
                  UHID: DEL-2024-8841
                </span>
                <span className="bg-tertiary-fixed text-on-tertiary-fixed font-clinical-data-mono text-metadata-micro font-bold px-2 py-0.5 rounded">
                  TOKEN #104
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-space-lg gap-y-1 mt-space-xs text-clinical-data font-clinical-data text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-outline">meeting_room</span> Emergency OPD · Cardiology Bay 02
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-outline">fingerprint</span> Encounter #ENC-90214
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-outline">schedule</span> Today, 14:35 IST (42 mins active)
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col xl:items-end justify-center bg-surface-container-low p-space-md rounded-xl">
            <div className="flex items-center gap-space-xs mb-1">
              <span className={`h-2 w-2 rounded-full ${isSigned ? "bg-primary" : "bg-secondary"}`}></span>
              <span className={`font-metadata-micro text-metadata-micro font-bold uppercase tracking-wider ${isSigned ? "text-primary" : "text-secondary"}`}>
                Document Status
              </span>
            </div>
            <div className="font-body-strong text-body-strong text-on-surface flex items-center gap-1">
              <span className="material-symbols-outlined text-base text-primary">
                {isSigned ? "verified" : "pending_actions"}
              </span>
              {isSigned ? "SIGNED & SEALED — FINAL ENCOUNTER LOCKED" : "DRAFT — PENDING FINAL CLINICIAN SIGNATURE"}
            </div>
            <div className="font-metadata-micro text-metadata-micro text-on-surface-variant mt-0.5">
              Attending: <span className="font-semibold text-on-surface">Dr. Rohit Verma, MD, DM</span> (Reg: MCI-2009-08821)
            </div>
          </div>
        </div>
      </div>

      {/* Encounter Readiness & Compliance Checklist Banner */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-panel-padding mb-space-base">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-space-sm mb-space-sm flex-wrap gap-2">
          <div className="flex items-center gap-space-sm">
            <div className="h-7 w-7 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-base">task_alt</span>
            </div>
            <div className="flex flex-col">
              <span className="font-section-title text-section-title text-on-surface">
                Encounter Readiness &amp; Regulatory Checklist
              </span>
              <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                Validated under National Digital Health Mission &amp; NABH 5th Edition Standards
              </span>
            </div>
          </div>
          <div className="flex items-center gap-space-sm">
            <span className="font-clinical-data-mono text-clinical-data font-bold text-primary bg-primary-fixed/40 px-2.5 py-1 rounded">
              6 of 6 SAFETY CHECKS PASSED
            </span>
            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">Zero Blockers</span>
          </div>
        </div>

        {/* 6 Clinical Checklist Chips */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-sm">
          <div className="flex items-start gap-space-sm p-space-sm bg-surface-container-low rounded-lg">
            <span className="material-symbols-outlined text-primary text-base mt-0.5">check_circle</span>
            <div className="flex flex-col">
              <span className="font-body-strong text-clinical-data text-on-surface">Identity &amp; ABHA Verified</span>
              <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                Biometric/OTP ABHA M1 linked, Token #104
              </span>
            </div>
          </div>

          <div className="flex items-start gap-space-sm p-space-sm bg-surface-container-low rounded-lg">
            <span className="material-symbols-outlined text-primary text-base mt-0.5">check_circle</span>
            <div className="flex flex-col">
              <span className="font-body-strong text-clinical-data text-on-surface">Red Flag Protocol Executed</span>
              <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                STAT ECG completed; Aspirin 325mg logged
              </span>
            </div>
          </div>

          <div className="flex items-start gap-space-sm p-space-sm bg-surface-container-low rounded-lg">
            <span className="material-symbols-outlined text-primary text-base mt-0.5">check_circle</span>
            <div className="flex flex-col">
              <span className="font-body-strong text-clinical-data text-on-surface">Mandatory Allergies Reviewed</span>
              <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                Penicillin Anaphylaxis logged with severe tag
              </span>
            </div>
          </div>

          <div className="flex items-start gap-space-sm p-space-sm bg-surface-container-low rounded-lg">
            <span className="material-symbols-outlined text-primary text-base mt-0.5">check_circle</span>
            <div className="flex flex-col">
              <span className="font-body-strong text-clinical-data text-on-surface">Medications Reconciled</span>
              <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                0 duplicate prescriptions, 0 cross-allergy hits
              </span>
            </div>
          </div>

          <div className="flex items-start gap-space-sm p-space-sm bg-surface-container-low rounded-lg">
            <span className="material-symbols-outlined text-primary text-base mt-0.5">check_circle</span>
            <div className="flex flex-col">
              <span className="font-body-strong text-clinical-data text-on-surface">Diagnostic Coding Confirmed</span>
              <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                ICD-10 I21.0 &amp; ICD-11 BD10 mapped
              </span>
            </div>
          </div>

          <div className="flex items-start gap-space-sm p-space-sm bg-surface-container-low rounded-lg">
            <span className="material-symbols-outlined text-primary text-base mt-0.5">check_circle</span>
            <div className="flex flex-col">
              <span className="font-body-strong text-clinical-data text-on-surface">FHIR R4 Schema Validated</span>
              <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                Encounter &amp; Condition resources verified (0 errors)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Encounter Audit & Clinical Dossier Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-base mb-space-base">
        {/* Left Column: Clinical Summary, Vitals & Diagnostics (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-space-base">
          {/* Chief Complaint & AI Voice Provenance Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-panel-padding">
            <div className="flex items-center justify-between mb-space-sm flex-wrap gap-2">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-lg">mic</span>
                <h2 className="font-section-title text-section-title text-on-surface">Intake &amp; Chief Complaint</h2>
              </div>
              <div className="flex items-center gap-space-xs bg-surface-container px-2 py-1 rounded font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-xs">auto_awesome</span>
                <span>AI Ambient Transcription · 98.4% Confidence</span>
              </div>
            </div>

            <div className="p-space-md bg-surface-container-low rounded-lg">
              <p className="font-chief-complaint text-section-title text-on-surface font-semibold tracking-tight">
                &ldquo;Acute retrosternal crushing chest pain radiating to the left jaw and shoulder, accompanied by profuse diaphoresis and mild nausea. Onset 13:40 IST while at rest.&rdquo;
              </p>
              <div className="flex flex-wrap items-center gap-space-md mt-space-sm pt-space-xs text-metadata-micro font-metadata-micro text-outline">
                <span className="flex items-center gap-1 font-clinical-data-mono">
                  <span className="material-symbols-outlined text-xs">history</span> Onset: 55 min prior to arrival
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">record_voice_over</span> Ambient Voice Intake (14:18 IST)
                </span>
                <span>·</span>
                <span className="text-primary font-semibold">Verified by Dr. R. Verma</span>
              </div>
            </div>

            {/* Tabular Vitals Matrix */}
            <div className="mt-space-md">
              <div className="flex items-center justify-between mb-space-xs flex-wrap gap-1">
                <span className="font-table-header text-table-header text-on-surface-variant uppercase tracking-wider">
                  Recorded Physical Telemetry &amp; Vitals (14:15 IST)
                </span>
                <span className="font-clinical-data-mono text-metadata-micro text-outline">
                  Source: Mindray BeneVision N12
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs">
                <div className="p-space-sm bg-error-container/40 rounded-lg">
                  <span className="font-metadata-micro text-metadata-micro text-on-error-container block font-semibold">
                    Blood Pressure
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-clinical-data-mono text-page-title text-error font-bold">148/92</span>
                    <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">mmHg</span>
                  </div>
                  <span className="font-clinical-data-mono text-metadata-micro text-error font-semibold flex items-center gap-0.5 mt-1">
                    <span className="material-symbols-outlined text-xs">arrow_upward</span> High (Stage 2 HTN)
                  </span>
                </div>

                <div className="p-space-sm bg-error-container/40 rounded-lg">
                  <span className="font-metadata-micro text-metadata-micro text-on-error-container block font-semibold">
                    Heart Rate
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-clinical-data-mono text-page-title text-error font-bold">104</span>
                    <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">bpm</span>
                  </div>
                  <span className="font-clinical-data-mono text-metadata-micro text-error font-semibold flex items-center gap-0.5 mt-1">
                    <span className="material-symbols-outlined text-xs">arrow_upward</span> Tachycardia
                  </span>
                </div>

                <div className="p-space-sm bg-surface-container rounded-lg">
                  <span className="font-metadata-micro text-metadata-micro text-on-surface-variant block font-semibold">
                    SpO2
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-clinical-data-mono text-page-title text-secondary font-bold">94%</span>
                    <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">Room Air</span>
                  </div>
                  <span className="font-clinical-data-mono text-metadata-micro text-secondary font-semibold flex items-center gap-0.5 mt-1">
                    <span className="material-symbols-outlined text-xs">arrow_downward</span> Borderline Low
                  </span>
                </div>

                <div className="p-space-sm bg-surface-container-low rounded-lg">
                  <span className="font-metadata-micro text-metadata-micro text-on-surface-variant block font-semibold">
                    Body Temp / RR
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-clinical-data-mono text-page-title text-on-surface font-bold">98.6°F</span>
                    <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">/ 20 rpm</span>
                  </div>
                  <span className="font-clinical-data-mono text-metadata-micro text-primary font-semibold flex items-center gap-0.5 mt-1">
                    <span className="material-symbols-outlined text-xs">check</span> Normal Baseline
                  </span>
                </div>
              </div>
            </div>

            {/* Physical Examination Observations */}
            <div className="mt-space-md p-space-sm bg-surface-container-low rounded-lg">
              <span className="font-table-header text-table-header text-on-surface-variant uppercase tracking-wider block mb-1">
                Clinician Physical Examination Findings
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-space-md gap-y-1 text-clinical-data font-clinical-data text-on-surface">
                <div>
                  <strong className="text-on-surface-variant font-semibold">General:</strong> Diaphoretic, acute distress, anxious facies, cold clammy peripheries.
                </div>
                <div>
                  <strong className="text-on-surface-variant font-semibold">Cardiovascular:</strong> S1/S2 heard, sinus tachycardia, no audible murmurs or gallop.
                </div>
                <div>
                  <strong className="text-on-surface-variant font-semibold">Respiratory:</strong> Clear bilateral breath sounds, no rales or ronchi, equal air entry.
                </div>
                <div>
                  <strong className="text-on-surface-variant font-semibold">Abdomen/Extremities:</strong> Soft, non-tender, no pedal edema, peripheral pulses palpable.
                </div>
              </div>
            </div>
          </div>

          {/* Diagnosis & Diagnostic Coding Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-panel-padding">
            <div className="flex items-center justify-between mb-space-sm flex-wrap gap-2">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-error text-lg">medical_information</span>
                <h2 className="font-section-title text-section-title text-on-surface">Clinical Diagnoses &amp; Formal Codes</h2>
              </div>
              <span className="font-clinical-data-mono text-metadata-micro bg-surface-container-high px-2 py-0.5 rounded font-semibold text-on-surface">
                WHO ICD-10 &amp; ICD-11 Standard
              </span>
            </div>

            <div className="space-y-space-xs">
              {/* Primary Diagnosis */}
              <div className="p-space-sm bg-error-container/20 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-space-xs">
                <div className="flex items-center gap-space-sm">
                  <span className="bg-error text-on-error font-clinical-data-mono text-metadata-micro font-bold px-2 py-0.5 rounded">
                    PRIMARY
                  </span>
                  <div>
                    <span className="font-body-strong text-clinical-data text-on-surface">
                      Acute Anterior ST-Elevation Myocardial Infarction (STEMI)
                    </span>
                    <span className="block font-metadata-micro text-metadata-micro text-on-surface-variant">
                      Confirmed with regional anterior wall ST elevation &gt; 2.5mm in V2-V4
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-space-xs shrink-0">
                  <span className="bg-surface-container-lowest text-on-surface font-clinical-data-mono text-metadata-micro px-2 py-1 rounded shadow-sm font-semibold">
                    ICD-10: I21.0
                  </span>
                  <span className="bg-surface-container-lowest text-on-surface font-clinical-data-mono text-metadata-micro px-2 py-1 rounded shadow-sm font-semibold">
                    ICD-11: BD10
                  </span>
                </div>
              </div>

              {/* Secondary Diagnosis 1 */}
              <div className="p-space-sm bg-surface-container-low rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-space-xs">
                <div className="flex items-center gap-space-sm">
                  <span className="bg-surface-container-high text-on-surface-variant font-clinical-data-mono text-metadata-micro font-bold px-2 py-0.5 rounded">
                    SECONDARY
                  </span>
                  <div>
                    <span className="font-body-strong text-clinical-data text-on-surface">
                      Essential (Primary) Hypertension
                    </span>
                    <span className="block font-metadata-micro text-metadata-micro text-on-surface-variant">
                      Sub-optimally managed; known history for 6 years
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-space-xs shrink-0">
                  <span className="bg-surface-container-lowest text-on-surface font-clinical-data-mono text-metadata-micro px-2 py-1 rounded shadow-sm font-semibold">
                    ICD-10: I10
                  </span>
                  <span className="bg-surface-container-lowest text-on-surface font-clinical-data-mono text-metadata-micro px-2 py-1 rounded shadow-sm font-semibold">
                    ICD-11: BA00
                  </span>
                </div>
              </div>

              {/* Secondary Diagnosis 2 */}
              <div className="p-space-sm bg-surface-container-low rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-space-xs">
                <div className="flex items-center gap-space-sm">
                  <span className="bg-surface-container-high text-on-surface-variant font-clinical-data-mono text-metadata-micro font-bold px-2 py-0.5 rounded">
                    SECONDARY
                  </span>
                  <div>
                    <span className="font-body-strong text-clinical-data text-on-surface">
                      Type 2 Diabetes Mellitus without Complications
                    </span>
                    <span className="block font-metadata-micro text-metadata-micro text-on-surface-variant">
                      Presumed metabolic risk factor contributing to acute coronary event
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-space-xs shrink-0">
                  <span className="bg-surface-container-lowest text-on-surface font-clinical-data-mono text-metadata-micro px-2 py-1 rounded shadow-sm font-semibold">
                    ICD-10: E11.9
                  </span>
                  <span className="bg-surface-container-lowest text-on-surface font-clinical-data-mono text-metadata-micro px-2 py-1 rounded shadow-sm font-semibold">
                    ICD-11: 5A11
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Executed Emergency Orders & Interventions Table */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-panel-padding">
            <div className="flex items-center justify-between mb-space-sm flex-wrap gap-2">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-lg">prescriptions</span>
                <h2 className="font-section-title text-section-title text-on-surface">
                  Executed Emergency Orders &amp; Interventions
                </h2>
              </div>
              <span className="font-metadata-micro text-metadata-micro text-primary font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">check_circle</span> All verified against Penicillin Anaphylaxis
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container text-on-surface-variant font-table-header text-table-header">
                    <th className="p-space-sm rounded-l">Time</th>
                    <th className="p-space-sm">Intervention / Medication</th>
                    <th className="p-space-sm">Dosage / Route</th>
                    <th className="p-space-sm">Administered By</th>
                    <th className="p-space-sm rounded-r">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container font-clinical-data text-clinical-data text-on-surface">
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="p-space-sm font-clinical-data-mono text-metadata-micro text-outline">14:22 IST</td>
                    <td className="p-space-sm">
                      <span className="font-body-strong block">Chewable Aspirin (Disprin)</span>
                      <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                        Emergency Antiplatelet Loading Dose
                      </span>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono">325 mg · Oral Chew</td>
                    <td className="p-space-sm">Sr. Ancy Thomas (RN #4419)</td>
                    <td className="p-space-sm">
                      <span className="bg-primary/10 text-primary font-clinical-data-mono text-metadata-micro font-bold px-2 py-0.5 rounded">
                        EXECUTED
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="p-space-sm font-clinical-data-mono text-metadata-micro text-outline">14:24 IST</td>
                    <td className="p-space-sm">
                      <span className="font-body-strong block">Ticagrelor (Brilinta)</span>
                      <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                        P2Y12 Inhibitor Dual Antiplatelet
                      </span>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono">180 mg (2x90mg) · Oral</td>
                    <td className="p-space-sm">Sr. Ancy Thomas (RN #4419)</td>
                    <td className="p-space-sm">
                      <span className="bg-primary/10 text-primary font-clinical-data-mono text-metadata-micro font-bold px-2 py-0.5 rounded">
                        EXECUTED
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="p-space-sm font-clinical-data-mono text-metadata-micro text-outline">14:20 IST</td>
                    <td className="p-space-sm">
                      <span className="font-body-strong block">12-Lead Diagnostic ECG</span>
                      <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                        GE MAC 5500HD · STEMI Alert Confirmed
                      </span>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono">Bedside · Lead II/V1-V6</td>
                    <td className="p-space-sm">Tech. M. Raghavan</td>
                    <td className="p-space-sm">
                      <span className="bg-primary/10 text-primary font-clinical-data-mono text-metadata-micro font-bold px-2 py-0.5 rounded">
                        RECORDED
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="p-space-sm font-clinical-data-mono text-metadata-micro text-outline">14:25 IST</td>
                    <td className="p-space-sm">
                      <span className="font-body-strong block">High-Sensitivity Troponin I (hs-cTnI)</span>
                      <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                        STAT Cardiac Biomarker Panel Drawn
                      </span>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono">5 mL Venous Blood</td>
                    <td className="p-space-sm">Pathology STAT Courier</td>
                    <td className="p-space-sm">
                      <span className="bg-secondary-container text-on-secondary-container font-clinical-data-mono text-metadata-micro font-bold px-2 py-0.5 rounded">
                        LAB PROCESSING
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="p-space-sm font-clinical-data-mono text-metadata-micro text-outline">14:28 IST</td>
                    <td className="p-space-sm">
                      <span className="font-body-strong block">Cath Lab Team Mobilization</span>
                      <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                        Primary Percutaneous Coronary Intervention Prep
                      </span>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono">Immediate Handover Bay</td>
                    <td className="p-space-sm">Dr. Rohit Verma</td>
                    <td className="p-space-sm">
                      <span className="bg-primary text-on-primary font-clinical-data-mono text-metadata-micro font-bold px-2 py-0.5 rounded">
                        TRANSFERRED
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Evidence, ECG Diagnostic Strip & Digital Signatures (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-space-base">
          {/* Diagnostic Artifact Card: Bedside 12-Lead ECG */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-panel-padding">
            <div className="flex items-center justify-between mb-space-xs flex-wrap gap-1">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-base">monitor_heart</span>
                <span className="font-body-strong text-clinical-data text-on-surface">STAT 12-Lead ECG Strip</span>
              </div>
              <span className="font-clinical-data-mono text-metadata-micro text-error font-bold bg-error-container px-1.5 py-0.5 rounded">
                V2-V4 ST ELEVATION
              </span>
            </div>
            <p className="font-metadata-micro text-metadata-micro text-on-surface-variant mb-space-sm">
              Logged 14:20 IST · Acquired via GE Healthcare PACS Bridge #MAC-5500
            </p>

            {/* Simulated ECG Telemetry Graph Waveform */}
            <div className="w-full h-32 bg-on-surface rounded-lg p-2 relative overflow-hidden flex items-center justify-center">
              <svg className="w-full h-full text-primary" preserveAspectRatio="none" viewBox="0 0 400 100">
                <path
                  d="M0,50 L20,50 L25,48 L30,52 L35,50 L50,50 L55,42 L60,80 L70,10 L78,65 L85,45 L95,45 L105,47 L120,50 
                     L140,50 L145,48 L150,52 L155,50 L170,50 L175,42 L180,80 L190,10 L198,65 L205,45 L215,45 L225,47 L240,50 
                     L260,50 L265,48 L270,52 L275,50 L290,50 L295,42 L300,80 L310,10 L318,65 L325,45 L335,45 L345,47 L360,50 L400,50"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
              <div className="absolute bottom-1 right-2 text-[9px] font-clinical-data-mono text-surface-tint">
                25mm/s · 10mm/mV · HR 104bpm
              </div>
              <div className="absolute top-1 left-2 text-[9px] font-clinical-data-mono text-error font-bold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-error animate-ping"></span> ST &gt;2.8mm ELEVATION CONFIRMED
              </div>
            </div>

            <div className="mt-space-sm flex items-center justify-between text-metadata-micro font-clinical-data-mono">
              <span className="text-on-surface-variant">DICOM UID: .1.2.840.10008...</span>
              <button
                onClick={() => setShowPacsModal(true)}
                className="text-primary hover:text-on-primary-fixed-variant font-semibold flex items-center gap-0.5"
              >
                Full PACS Viewer <span className="material-symbols-outlined text-xs">open_in_new</span>
              </button>
            </div>
          </div>

          {/* Clinical Attending Verification Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-panel-padding">
            <span className="font-table-header text-table-header text-on-surface-variant uppercase tracking-wider block mb-space-xs">
              Signing Physician Credentials
            </span>
            <div className="flex items-center gap-space-sm mb-space-sm">
              <img
                className="w-12 h-12 rounded-full object-cover ring-1 ring-surface-variant"
                alt="Dr. Rohit Verma"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuLNBagHsd6zKfxxVi-EB_qHs6ihMgxaXZIiUlJxw79BcrxrjKGbEzbFW3aLT038bfEEtl0UVatXJdU5Qk3bhA9shQWWL0eZQfHP8ALzvL0VELMywhBimI3ayEXaQfhMxQo4QQZmudwNZUr99h4vibWcI3lr_qiabOaRFtjUeFGpyfyA-bAbehyI1FNRll5WJQiHbEig3KLuAD2aSVLqA57hygBNOB6aR1y2rffUZAHAh1LouxnibH"
              />
              <div className="flex flex-col">
                <span className="font-body-strong text-body-strong text-on-surface">Dr. Rohit Verma, MD, DM</span>
                <span className="font-metadata-micro text-metadata-micro text-primary font-semibold">
                  Chief of Cardiology &amp; Cath Lab Services
                </span>
                <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                  Registration: MCI-2009-08821
                </span>
              </div>
            </div>

            <div className="p-space-sm bg-surface-container-low rounded-lg space-y-1 text-metadata-micro font-metadata-micro">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Digital Certificate:</span>
                <span className="font-clinical-data-mono text-primary font-semibold">Class 3 Healthcare FIPS 140-2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Token State:</span>
                <span className="font-clinical-data-mono text-on-surface font-semibold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span> HSM Hardware Key Synced
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Co-Signer Required:</span>
                <span className="text-on-surface">Dr. A. Kulkarni (Cardiology Fellow - Paged)</span>
              </div>
            </div>
          </div>

          {/* Regulatory DPDP & Legal Compliance Box */}
          <div className="bg-surface-container-low rounded-xl p-panel-padding">
            <div className="flex items-center gap-space-xs mb-space-xs text-primary">
              <span className="material-symbols-outlined text-base">policy</span>
              <span className="font-body-strong text-clinical-data font-semibold">Legal &amp; Regulatory Certification</span>
            </div>
            <p className="font-metadata-micro text-metadata-micro text-on-surface-variant leading-relaxed">
              In accordance with the <strong>Indian Digital Personal Data Protection (DPDP) Act</strong>, the{" "}
              <strong>National Medical Commission (NMC) EHR Guidelines</strong>, and{" "}
              <strong>ABHA / ABDM Milestone 3 Protocols</strong>:
            </p>
            <p className="font-metadata-micro text-metadata-micro text-on-surface-variant leading-relaxed mt-1">
              By executing this cryptographic digital signature, the attending clinician certifies that this electronic health record is complete, clinically verified, and constitutes the permanent legal record of the encounter. Modifications post-signing require formal addendum auditing.
            </p>
            <div className="mt-space-sm pt-space-xs flex items-center justify-between text-metadata-micro font-clinical-data-mono text-outline">
              <span>SHA-256 Checksum Ready</span>
              <span className="text-primary font-semibold">ABHA M3 Vault Staged</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Final Signing Execution Bar (Sticky Panel) */}
      <div className="sticky bottom-0 bg-surface-container-lowest shadow-md rounded-xl p-panel-padding z-30 border-t border-surface-container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-space-base">
          {/* Checkbox Acknowledgement */}
          <div className="flex items-start gap-space-sm max-w-xl">
            <input
              checked={legalAckChecked}
              onChange={(e) => setLegalAckChecked(e.target.checked)}
              className="mt-1 h-4 w-4 rounded text-primary focus:ring-primary border-outline cursor-pointer"
              id="signLegalAck"
              type="checkbox"
            />
            <label
              className="font-metadata-micro text-metadata-micro text-on-surface cursor-pointer select-none"
              htmlFor="signLegalAck"
            >
              I certify that I have personally evaluated patient <strong className="text-on-surface font-semibold">Rahul Sharma</strong>, verified the diagnostic conclusions (Acute STEMI), reviewed all administered medications against penicillin anaphylaxis alerts, and authorize immediate Cath Lab transfer.
            </label>
          </div>

          {/* Action Buttons Basket */}
          <div className="flex flex-wrap items-center gap-space-sm shrink-0 w-full md:w-auto justify-end">
            {onBackToEdit ? (
              <button
                onClick={onBackToEdit}
                className="px-space-md py-2 bg-surface-container hover:bg-surface-container-high text-on-surface font-body-strong text-clinical-data rounded-lg transition-colors flex items-center gap-1"
                type="button"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                Back to Edit
              </button>
            ) : (
              <Link
                href="/consultation-workspace"
                className="px-space-md py-2 bg-surface-container hover:bg-surface-container-high text-on-surface font-body-strong text-clinical-data rounded-lg transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                Back to Edit
              </Link>
            )}
            <button
              onClick={handleSaveDraft}
              className="px-space-md py-2 bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface font-body-strong text-clinical-data rounded-lg transition-colors flex items-center gap-1"
              type="button"
            >
              <span className="material-symbols-outlined text-base">pause_circle</span>
              Save Draft &amp; Suspend
            </button>
            <button
              onClick={handleFinalSign}
              disabled={isSigning}
              className={`px-space-lg py-2.5 rounded-lg font-body-strong text-clinical-data shadow-sm transition-all flex items-center gap-space-xs ${
                isSigned
                  ? "bg-primary-container text-on-primary-container"
                  : "bg-primary hover:bg-on-primary-fixed-variant text-on-primary"
              }`}
              id="finalSignBtn"
              type="button"
            >
              <span className="material-symbols-outlined text-lg">
                {isSigned ? "verified" : isSigning ? "refresh" : "lock"}
              </span>
              <span>
                {isSigned
                  ? "Encounter Finalized & Locked"
                  : isSigning
                  ? "Signing & Encrypting..."
                  : "Sign & Finalize Encounter"}
              </span>
              {!isSigned && (
                <span className="bg-on-primary/20 text-on-primary font-clinical-data-mono text-metadata-micro px-1.5 py-0.5 rounded ml-1">
                  EHR COMMIT
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Cryptographic Feedback Strip */}
        {isSigned && (
          <div className="mt-space-sm pt-space-xs flex items-center justify-between font-clinical-data-mono text-metadata-micro bg-surface-container-high px-space-md py-1.5 rounded-lg flex-wrap gap-2 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-primary font-bold">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              <span>CRYPTOGRAPHICALLY SEALED: RSA-4096 / SHA-256</span>
            </div>
            <span className="text-outline truncate max-w-xs">Hash: 8f4e22c9b10904f8102a9918ef81d4a...</span>
            <span className="text-on-surface font-semibold">Committed to ABDM Health Data Locker</span>
          </div>
        )}
      </div>

      {/* Full PACS Viewer Modal */}
      {showPacsModal && (
        <div className="fixed inset-0 bg-on-surface/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-outline-variant animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-surface-container pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">monitor_heart</span>
                <h3 className="font-section-title text-base font-semibold text-on-surface">
                  PACS DICOM 12-Lead Holter Stream: Station 02
                </h3>
              </div>
              <button
                onClick={() => setShowPacsModal(false)}
                className="h-8 w-8 rounded-lg hover:bg-surface-container flex items-center justify-center text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="space-y-3 font-clinical-data-mono text-xs">
              <div className="p-3 bg-surface-container-low rounded-xl text-on-surface space-y-1">
                <p><strong>Series UID:</strong> 1.2.840.10008.5.1.4.1.1.9.1.1.8841</p>
                <p><strong>Device:</strong> GE MAC 5500HD · Sampling Rate: 500 Hz High-Fidelity</p>
                <p><strong>Interpretation:</strong> Acute Anterior Myocardial Infarction. ST Elevation V2: 3.1mm, V3: 2.8mm, V4: 2.4mm.</p>
              </div>
              <div className="w-full h-48 bg-on-surface rounded-xl p-3 flex items-center justify-center relative overflow-hidden">
                <svg className="w-full h-full text-primary" preserveAspectRatio="none" viewBox="0 0 600 100">
                  <path
                    d="M0,50 L30,50 L40,42 L50,85 L65,8 L75,68 L85,45 L100,45 L120,50 L150,50 L160,42 L170,85 L185,8 L195,68 L205,45 L220,45 L240,50 L270,50 L280,42 L290,85 L305,8 L315,68 L325,45 L340,45 L360,50 L390,50 L400,42 L410,85 L425,8 L435,68 L445,45 L460,45 L480,50 L510,50 L520,42 L530,85 L545,8 L555,68 L565,45 L580,45 L600,50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                <span className="absolute bottom-2 right-3 text-[10px] text-surface-tint">DICOM Calibrated Calibration: 10mm/mV 25mm/s</span>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-surface-container">
              <button
                onClick={() => setShowPacsModal(false)}
                className="px-4 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container"
              >
                Close DICOM Viewer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating System Toast */}
      {toast && (
        <div className="fixed bottom-24 right-6 bg-inverse-surface text-inverse-on-surface px-space-md py-space-sm rounded-xl shadow-xl flex items-center gap-space-sm z-50 border border-outline-variant/40 animate-in fade-in slide-in-from-bottom-3 duration-200">
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
