/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircleIcon } from "@careflow/ui";

export default function TriageCommandPage() {
  const [isPlayingAudio, setIsPlayingAudio] = useState(true);
  const [audioProgress, setAudioProgress] = useState(56);
  const [elapsedSeconds, setElapsedSeconds] = useState(702); // 00:11:42
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [nitroDispensed, setNitroDispensed] = useState(false);
  const [resusTransferred, setResusTransferred] = useState(false);
  const [pagedCardiologist, setPagedCardiologist] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const [showEcgModal, setShowEcgModal] = useState(false);

  // Live timer simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatElapsed = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `00:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleConfirmNitro = () => {
    setNitroDispensed(true);
    showToast("Order Dispatched: Sublingual Nitroglycerin 0.4mg SL dispensed at Bay 02.");
  };

  const handleTransferResus = () => {
    setResusTransferred(true);
    showToast("STAT Transfer: Rahul Sharma transferred to Resuscitation Bay 01. Code STEMI team alert broadcast.");
  };

  const handlePageCardio = () => {
    setPagedCardiologist(true);
    showToast("Urgent Page Transmitted: Dr. Sameer Kulkarni (On-Call Interventional Cardiology) paged.");
  };

  const handleAcknowledge = () => {
    setAcknowledged(true);
    showToast("Protocol Signed: Emergency ACS STEMI Pathway acknowledged and locked into chart.");
  };

  return (
    <div className="flex flex-col w-full gap-space-base -mt-space-xs">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 border border-outline-variant animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircleIcon className="w-5 h-5 text-primary-fixed" />
          <span className="text-clinical-data font-clinical-data font-medium">
            {toastMessage}
          </span>
        </div>
      )}

      {/* Persistent Safety Context Bar */}
      <div className="w-full bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant">
        <div className="bg-error px-panel-padding py-2 flex items-center justify-between text-on-error">
          <div className="flex items-center gap-space-sm flex-wrap">
            <span
              className="material-symbols-outlined text-xl animate-pulse"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              emergency_home
            </span>
            <span className="font-body-strong text-body-strong tracking-wide uppercase font-bold">
              P1 CRITICAL RED FLAG · Suspected ACS / STEMI Protocol Activated
            </span>
          </div>
          <div className="flex items-center gap-space-base flex-wrap">
            <span className="font-clinical-data-mono text-metadata-micro bg-error-container text-on-error-container px-2 py-0.5 rounded-full font-bold">
              TIMI RISK: 5 (High)
            </span>
            <div className="flex items-center gap-1 font-clinical-data-mono text-metadata-micro font-bold">
              <span className="material-symbols-outlined text-sm">timer</span>
              <span>{formatElapsed(elapsedSeconds)}</span> ELAPSED
            </div>
          </div>
        </div>

        <div className="px-panel-padding py-space-sm flex flex-wrap items-center justify-between gap-space-md bg-surface-container-lowest">
          <div className="flex items-center gap-space-md flex-wrap">
            <div className="relative">
              <img
                className="w-11 h-11 rounded-full object-cover shadow-sm ring-2 ring-error/40"
                alt="Rahul Sharma"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQ2CABn97HBKDdFtRfc2iOnHBatQO6aDhDjTDorxusjRG4LAvbySya8vddV6NNrWZif77stNYBZOa7FAQUwDPVsEGxmgPnprR4ar-ha9XGTV2CG6p1aVf3_XYTxtyp903Km18bAXkFWrLm9X0x8HCdsTAJpuU9ABRkDr5q955er8LGnY3o_RxW8PEyqCGlsWzBsUIcR8wKSwyjXmBqrENkOXWTpBQBNZhASiFLGX7at0-csPynKpoV"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-error rounded-full flex items-center justify-center text-[9px] font-bold text-on-error">
                !
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-space-xs flex-wrap">
                <h1 className="font-section-title text-section-title text-on-surface font-bold">
                  Rahul Sharma
                </h1>
                <span className="font-clinical-data text-clinical-data text-on-surface-variant font-medium">
                  (42 M)
                </span>
                <span className="bg-primary-container text-on-primary-container px-2 py-0.5 rounded-full font-metadata-micro text-metadata-micro font-semibold ml-1">
                  ABHA VERIFIED
                </span>
              </div>
              <div className="flex items-center gap-space-sm font-clinical-data-mono text-metadata-micro text-outline flex-wrap">
                <span>
                  Token <strong className="text-on-surface font-semibold">#104</strong>
                </span>
                <span>•</span>
                <span>
                  UHID: <strong className="text-on-surface font-semibold">DEL-2024-8841</strong>
                </span>
                <span>•</span>
                <span>ABHA: 91-8842-1920-4491</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-space-lg flex-wrap">
            <div className="flex flex-col text-right">
              <span className="font-metadata-micro text-metadata-micro text-outline uppercase tracking-wider">
                Current Location
              </span>
              <span className="font-body-strong text-body-strong text-error flex items-center gap-1 justify-end font-semibold">
                <span className="material-symbols-outlined text-sm">meeting_room</span>
                Triage Bay 02 · Bed A
              </span>
            </div>
            <div className="h-8 w-px bg-surface-variant hidden sm:block"></div>
            <div className="flex flex-col text-right">
              <span className="font-metadata-micro text-metadata-micro text-outline uppercase tracking-wider">
                Primary Vitals (14:24)
              </span>
              <div className="flex items-center gap-space-xs font-clinical-data-mono text-clinical-data">
                <span className="text-error font-bold">BP 148/92</span>
                <span className="text-outline">|</span>
                <span className="text-on-surface font-bold">HR 104</span>
                <span className="text-outline">|</span>
                <span className="text-primary font-bold">SpO₂ 97%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Split Canvas: 60% Left / 40% Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-base items-start">
        {/* LEFT COLUMN (60% ~ 7 Cols Desktop) */}
        <div className="lg:col-span-7 flex flex-col gap-space-base">
          {/* 1. Detection Banner & Voice Provenance */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant">
            <div className="bg-surface-container-low px-panel-padding py-space-sm flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-lg">verified_user</span>
                <h2 className="font-section-title text-section-title text-on-surface font-semibold">
                  Algorithmic Detection &amp; Patient Voice Provenance
                </h2>
              </div>
              <span className="bg-primary text-on-primary font-clinical-data-mono text-metadata-micro px-2 py-0.5 rounded font-bold">
                CONFIDENCE 98.4%
              </span>
            </div>

            <div className="p-panel-padding flex flex-col gap-space-md">
              {/* Rule trigger badge & meta */}
              <div className="bg-surface-container rounded-lg p-space-sm flex flex-col gap-1 border border-outline-variant/60">
                <div className="flex items-center justify-between">
                  <span className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase tracking-wider font-semibold">
                    Triggered Protocol Rule
                  </span>
                  <span className="font-clinical-data-mono text-metadata-micro text-secondary font-semibold">
                    AHA/ACC STEMI Trigger Algorithm v4.2
                  </span>
                </div>
                <p className="font-body-strong text-body-strong text-error font-semibold">
                  Acute retrosternal chest pain + Radiation to left jaw &amp; left upper extremity + Profuse diaphoresis
                </p>
                <div className="flex items-center gap-space-base pt-1 font-clinical-data-mono text-metadata-micro text-on-surface-variant flex-wrap">
                  <span>
                    <strong className="text-on-surface">Source:</strong> Patient Voice Kiosk 02
                  </span>
                  <span>•</span>
                  <span>
                    <strong className="text-on-surface">Timestamp:</strong> Today 14:18:22 IST
                  </span>
                  <span>•</span>
                  <span>
                    <strong className="text-on-surface">Model:</strong> Clinical Intake NLP v4.2
                  </span>
                </div>
              </div>

              {/* Dual Language Verbatim Box */}
              <div className="bg-surface-container-low rounded-lg p-space-md flex flex-col gap-space-xs border border-outline-variant">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-secondary font-metadata-micro text-metadata-micro font-semibold uppercase">
                    <span className="material-symbols-outlined text-sm">record_voice_over</span>
                    Patient Verbatim Transcript (Dual Hinglish &amp; English)
                  </div>
                  <span className="font-clinical-data-mono text-metadata-micro text-outline">
                    Acoustic Stress Index: 0.89 (Severe)
                  </span>
                </div>
                <p className="font-subheading text-subheading text-on-surface font-semibold italic bg-surface-container-lowest p-space-sm rounded border border-outline-variant/50">
                  “Seene mein bahut pressure ho raha hai, crushing pain hai aur left haath aur jabde tak ja raha hai, 40 minute se paseena aa raha hai.”
                </p>
                <p className="font-body-default text-body-default text-on-surface-variant px-1">
                  <span className="font-body-strong text-body-strong text-on-surface font-semibold">Translated:</span> “There is immense pressure in my chest, crushing pain radiating into my left arm and jaw; profuse cold sweating for the last 40 minutes.”
                </p>
              </div>

              {/* Interactive Audio Waveform Player */}
              <div className="bg-surface-container-highest rounded-lg p-space-sm flex flex-col gap-space-xs border border-outline-variant">
                <div className="flex items-center justify-between font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-primary">mic</span>
                    Voice Intake Recording #REC-8841-A
                  </span>
                  <span className="font-bold text-on-surface">00:42 / 01:15</span>
                </div>

                <div className="flex items-center gap-space-sm">
                  <button
                    onClick={() => {
                      setIsPlayingAudio(!isPlayingAudio);
                      showToast(isPlayingAudio ? "Audio playback paused." : "Streaming patient voice intake recording...");
                    }}
                    className="w-8 h-8 rounded-full bg-primary hover:bg-primary-container text-on-primary flex items-center justify-center transition-colors shadow-sm shrink-0"
                  >
                    <span className="material-symbols-outlined text-base">
                      {isPlayingAudio ? "pause" : "play_arrow"}
                    </span>
                  </button>

                  {/* Stylized Waveform Graphic */}
                  <div
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const pct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                      setAudioProgress(pct);
                    }}
                    className="flex-1 relative h-9 flex items-center gap-0.5 cursor-pointer select-none"
                  >
                    {/* Simulated Waveform Amplitude Bars */}
                    {[12, 16, 24, 32, 20, 28, 36, 24, 16, 28, 32, 36, 20, 32, 24, 28, 36, 32, 16, 24, 20].map(
                      (h, idx) => (
                        <div
                          key={idx}
                          className={`w-1 rounded-full transition-all ${
                            idx <= Math.floor((audioProgress / 100) * 33)
                              ? "bg-primary"
                              : "bg-outline-variant"
                          } ${isPlayingAudio ? "animate-pulse" : ""}`}
                          style={{ height: `${h}px` }}
                        ></div>
                      )
                    )}
                    {/* Scrubber indicator */}
                    <div className="h-9 w-1 bg-error rounded-full animate-pulse shadow-sm"></div>
                    {[28, 16, 20, 32, 24, 12, 20, 28, 24, 16, 8].map((h, idx) => (
                      <div
                        key={`tail-${idx}`}
                        className="w-1 bg-outline-variant rounded-full"
                        style={{ height: `${h}px` }}
                      ></div>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 font-clinical-data-mono text-metadata-micro text-on-surface-variant shrink-0">
                    <span className="material-symbols-outlined text-sm">speed</span>
                    <span>1.0x</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Supporting Clinical Criteria & Multi-System Intake */}
          <div className="bg-surface-container-lowest rounded-xl p-panel-padding shadow-sm flex flex-col gap-space-md border border-outline-variant">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-lg">clinical_notes</span>
                <h2 className="font-section-title text-section-title text-on-surface font-semibold">
                  Supporting Clinical Criteria &amp; Presentation
                </h2>
              </div>
              <span className="font-clinical-data-mono text-metadata-micro text-outline">
                Intake Logged: 14:19
              </span>
            </div>

            {/* 3-block micro metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm">
              <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-1 border border-outline-variant">
                <span className="font-metadata-micro text-metadata-micro text-outline uppercase font-semibold">
                  Onset Mechanism
                </span>
                <div className="font-body-strong text-body-strong text-on-surface font-semibold">
                  13:40 (45 mins ago)
                </div>
                <span className="font-clinical-data text-metadata-micro text-on-surface-variant">
                  Brisk walk to transit bus stand
                </span>
              </div>

              <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-1 border border-outline-variant">
                <span className="font-metadata-micro text-metadata-micro text-outline uppercase font-semibold">
                  Radiation Vector
                </span>
                <div className="font-body-strong text-body-strong text-error font-semibold">
                  Left Arm + Mandible
                </div>
                <span className="font-clinical-data text-metadata-micro text-on-surface-variant">
                  Typical ischemic distribution
                </span>
              </div>

              <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-1 border border-outline-variant">
                <span className="font-metadata-micro text-metadata-micro text-outline uppercase font-semibold">
                  Autonomic Findings
                </span>
                <div className="font-body-strong text-body-strong text-on-surface font-semibold">
                  Diaphoresis / Nausea
                </div>
                <span className="font-clinical-data text-metadata-micro text-on-surface-variant">
                  Cold clammy skin, rest dyspnea
                </span>
              </div>
            </div>

            {/* Review of Systems Visual Chips */}
            <div className="flex flex-col gap-space-xs">
              <span className="font-metadata-micro text-metadata-micro text-outline uppercase tracking-wider font-semibold">
                Structured Review of Systems (ROS)
              </span>
              <div className="flex flex-wrap gap-space-xs">
                <span className="bg-error-container text-on-error-container px-2.5 py-1 rounded font-clinical-data-mono text-clinical-data font-semibold flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-sm">priority_high</span>
                  + Chest pressure (8/10 Retrosternal)
                </span>
                <span className="bg-error-container text-on-error-container px-2.5 py-1 rounded font-clinical-data-mono text-clinical-data font-semibold flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-sm">water_drop</span>
                  + Cold Sweats (Diaphoretic)
                </span>
                <span className="bg-error-container text-on-error-container px-2.5 py-1 rounded font-clinical-data-mono text-clinical-data font-semibold flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-sm">air</span>
                  + Exertional Dyspnea
                </span>
                <span className="bg-surface-container-high text-on-surface px-2.5 py-1 rounded font-clinical-data-mono text-clinical-data flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-outline">remove</span>
                  - Syncope
                </span>
                <span className="bg-surface-container-high text-on-surface px-2.5 py-1 rounded font-clinical-data-mono text-clinical-data flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-outline">remove</span>
                  - Palpitations
                </span>
                <span className="bg-surface-container-high text-on-surface px-2.5 py-1 rounded font-clinical-data-mono text-clinical-data flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-outline">remove</span>
                  - Fever / Cough
                </span>
              </div>
            </div>
          </div>

          {/* 3. Emergency Protocol Checklist (ACS Rapid Pathway) */}
          <div className="bg-surface-container-lowest rounded-xl p-panel-padding shadow-sm flex flex-col gap-space-md border border-outline-variant">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-lg">fact_check</span>
                <h2 className="font-section-title text-section-title text-on-surface font-semibold">
                  Emergency Protocol Checklist: STEMI / ACS Pathway
                </h2>
              </div>
              <span className="bg-surface-container-high text-on-surface px-2.5 py-0.5 rounded font-clinical-data-mono text-metadata-micro font-bold">
                {nitroDispensed ? "3 / 4 EXECUTED" : "2 / 4 EXECUTED"}
              </span>
            </div>

            <div className="flex flex-col gap-space-xs">
              {/* Step 1: Aspirin */}
              <div className="flex items-center justify-between p-space-sm bg-surface-container-low rounded-lg border border-outline-variant/60">
                <div className="flex items-center gap-space-sm">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-on-primary">
                    <span className="material-symbols-outlined text-base">check</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-body-strong text-body-strong text-on-surface font-semibold">
                      Aspirin 325 mg (Chewable Non-Enteric Coated)
                    </span>
                    <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                      Administered at 14:22 by Sister Ancy Thomas (RN)
                    </span>
                  </div>
                </div>
                <span className="font-clinical-data-mono text-metadata-micro text-primary font-semibold bg-surface-container-lowest px-2 py-1 rounded border border-outline-variant">
                  VERIFIED
                </span>
              </div>

              {/* Step 2: STAT ECG with result flag */}
              <div className="flex flex-col p-space-sm bg-surface-container-low rounded-lg gap-space-xs border border-outline-variant/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-on-primary">
                      <span className="material-symbols-outlined text-base">check</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-body-strong text-body-strong text-on-surface font-semibold">
                        STAT Bedside 12-Lead Electrocardiogram (ECG)
                      </span>
                      <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                        Recorded at 14:25 · Machine Cart 04
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowEcgModal(true)}
                    className="flex items-center gap-1 font-clinical-data text-metadata-micro text-primary hover:underline font-semibold"
                  >
                    <span>View Trace</span>
                    <span className="material-symbols-outlined text-xs">open_in_new</span>
                  </button>
                </div>

                {/* ECG alert pill inside row */}
                <div className="ml-9 p-space-xs bg-error-container text-on-error-container rounded flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-sm font-bold text-error">monitor_heart</span>
                  <span className="font-clinical-data-mono text-clinical-data font-semibold">
                    ECG FINDING: ST Elevation &gt;2mm in Leads V2, V3, V4 (Anterior Ischemia)
                  </span>
                </div>
              </div>

              {/* Step 3: Troponin Running */}
              <div className="flex items-center justify-between p-space-sm bg-surface-container rounded-lg border border-outline-variant/60">
                <div className="flex items-center gap-space-sm">
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-on-secondary animate-pulse">
                    <span className="material-symbols-outlined text-base">hourglass_top</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-space-xs flex-wrap">
                      <span className="font-body-strong text-body-strong text-on-surface font-semibold">
                        High-Sensitivity Troponin I (hs-cTnI)
                      </span>
                      <span className="bg-secondary-container text-on-secondary-container font-clinical-data-mono text-[10px] px-1.5 py-0.2 rounded uppercase font-bold">
                        Processing
                      </span>
                    </div>
                    <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                      Sample drawn 14:20 · STAT Lab ID: LAB-9921 · Expected ETA 14:40
                    </span>
                  </div>
                </div>
                <span className="font-clinical-data-mono text-metadata-micro text-secondary font-bold">
                  ~14 MIN LEFT
                </span>
              </div>

              {/* Step 4: Sublingual Nitroglycerin Pending Action */}
              <div className="flex items-center justify-between p-space-sm bg-surface-container-low rounded-lg border border-outline-variant/60">
                <div className="flex items-center gap-space-sm">
                  <div className="w-6 h-6 rounded-full bg-surface-dim flex items-center justify-center text-outline">
                    <span className="material-symbols-outlined text-base">medication</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-space-xs flex-wrap">
                      <span className="font-body-strong text-body-strong text-on-surface font-semibold">
                        Sublingual Nitroglycerin 0.4mg SL
                      </span>
                      <span
                        className={`font-clinical-data-mono text-[10px] px-1.5 py-0.2 rounded uppercase font-bold ${
                          nitroDispensed
                            ? "bg-primary text-on-primary"
                            : "bg-surface-variant text-on-surface-variant"
                        }`}
                      >
                        {nitroDispensed ? "Dispensed" : "Pending Order"}
                      </span>
                    </div>
                    <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                      Vitals Check: BP 148/92 mmHg &gt; 90 systolic. No PDE5i inhibitor use in 48h. Safe to proceed.
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleConfirmNitro}
                  disabled={nitroDispensed}
                  className={`px-3 py-1 rounded text-metadata-micro font-body-strong transition-colors shadow-sm ${
                    nitroDispensed
                      ? "bg-surface-container text-primary font-bold border border-primary/30"
                      : "bg-primary hover:bg-primary-container text-on-primary"
                  }`}
                >
                  {nitroDispensed ? "Dispensed at 14:28" : "Confirm & Dispense"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (40% ~ 5 Cols Desktop) */}
        <div className="lg:col-span-5 flex flex-col gap-space-base">
          {/* 1. Correlated Longitudinal Risk Factors */}
          <div className="bg-surface-container-lowest rounded-xl p-panel-padding shadow-sm flex flex-col gap-space-md border border-outline-variant">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-lg">history_edu</span>
                <h2 className="font-section-title text-section-title text-on-surface font-semibold">
                  Longitudinal Risk Synthesis
                </h2>
              </div>
              <span className="font-clinical-data-mono text-metadata-micro text-error font-semibold bg-error-container text-on-error-container px-2 py-0.5 rounded">
                VERY HIGH RISK
              </span>
            </div>

            <div className="flex flex-col gap-space-sm">
              {/* Family History Highlight */}
              <div className="bg-surface-container-low p-space-sm rounded-lg flex items-start gap-space-sm border border-outline-variant">
                <span className="material-symbols-outlined text-error text-lg shrink-0 mt-0.5">
                  family_restroom
                </span>
                <div className="flex flex-col">
                  <span className="font-body-strong text-body-strong text-on-surface font-semibold">
                    Premature CAD in First-Degree Relative
                  </span>
                  <p className="font-clinical-data text-clinical-data text-on-surface-variant">
                    Biological father suffered fatal acute myocardial infarction at age 52. Documented Apollo Delhi EHR (2018).
                  </p>
                </div>
              </div>

              {/* Comorbidities Grid */}
              <div className="grid grid-cols-2 gap-space-xs">
                <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col border border-outline-variant">
                  <span className="font-metadata-micro text-metadata-micro text-outline uppercase font-semibold">
                    Metabolic
                  </span>
                  <span className="font-body-strong text-body-strong text-on-surface font-semibold">
                    Type 2 DM (7 Yrs)
                  </span>
                  <span className="font-clinical-data-mono text-metadata-micro text-error font-semibold">
                    HbA1c: 7.8% (Uncontrolled)
                  </span>
                </div>

                <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col border border-outline-variant">
                  <span className="font-metadata-micro text-metadata-micro text-outline uppercase font-semibold">
                    Cardiovascular
                  </span>
                  <span className="font-body-strong text-body-strong text-on-surface font-semibold">
                    Hypertension
                  </span>
                  <span className="font-clinical-data text-metadata-micro text-on-surface-variant">
                    On Amlodipine 5mg daily
                  </span>
                </div>
              </div>

              {/* Lipid profile spark context */}
              <div className="bg-surface-container-low p-space-sm rounded-lg flex items-center justify-between border border-outline-variant">
                <div className="flex flex-col">
                  <span className="font-metadata-micro text-metadata-micro text-outline uppercase font-semibold">
                    Atherogenic Dyslipidemia
                  </span>
                  <span className="font-clinical-data-mono text-clinical-data text-on-surface font-semibold">
                    LDL: 152 mg/dL · Non-HDL: 184 mg/dL
                  </span>
                  <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    Apollo Lab Panel · 14 Jul 2026
                  </span>
                </div>
                <span className="material-symbols-outlined text-error text-xl">trending_up</span>
              </div>
            </div>
          </div>

          {/* 2. Action & Escalation Command Box */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant">
            <div className="bg-surface-container-high px-panel-padding py-space-sm flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-error text-lg">local_police</span>
                <h2 className="font-section-title text-section-title text-on-surface font-semibold">
                  Escalation &amp; Command Console
                </h2>
              </div>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-error"></span>
              </span>
            </div>

            <div className="p-panel-padding flex flex-col gap-space-md">
              {/* Care Team Assignment */}
              <div className="flex items-center justify-between p-space-sm bg-surface-container-low rounded-lg border border-outline-variant">
                <div className="flex items-center gap-space-xs">
                  <img
                    className="w-9 h-9 rounded-full object-cover ring-1 ring-outline-variant"
                    alt="Dr. Verma"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjT37uRxovKxIFHUM4vmAXKRE1UOx3n6ghyPJt2yfdjFoQNk0FJd2XEz-HCySyobV7z1bZj9BB7M1aMX-5UDGcHePccculx3NY7qd105naa1-yj66Ahnz3-1Ubmqd2T-6DTTOW68xPpYhHAxTcjZUK0LIeGDvZNYIZ-tj3kJi8zYha9T52ZGxs4DaMb4qGnZd1ENXzllFSymv_AGw6ccAErq_DfywEiKFscpQYAKAcyPD-DS9Hfppz"
                  />
                  <div className="flex flex-col">
                    <span className="font-clinical-data text-metadata-micro text-outline uppercase font-semibold">
                      Assigned Attending
                    </span>
                    <span className="font-body-strong text-body-strong text-on-surface font-bold">
                      Dr. Rohit Verma
                    </span>
                    <span className="font-metadata-micro text-metadata-micro text-primary font-semibold">
                      Chief of Clinical Services
                    </span>
                  </div>
                </div>

                <div className="flex flex-col text-right">
                  <span className="font-clinical-data text-metadata-micro text-outline uppercase font-semibold">
                    Triage Nurse
                  </span>
                  <span className="font-body-strong text-body-strong text-on-surface font-bold">
                    Sr. Ancy Thomas
                  </span>
                  <span className="font-metadata-micro text-metadata-micro text-secondary font-semibold">
                    Station 02 Lead
                  </span>
                </div>
              </div>

              {/* Command Action Buttons */}
              <div className="flex flex-col gap-space-xs">
                <button
                  onClick={handleTransferResus}
                  className="w-full bg-error hover:bg-error/90 text-on-error font-body-strong text-body-strong py-2.5 px-space-md rounded-lg flex items-center justify-center gap-space-xs transition-colors shadow-sm uppercase tracking-wide font-bold active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined text-lg">emergency_share</span>
                  <span>
                    {resusTransferred ? "Transferred to Resuscitation Bay 01" : "Transfer to Resuscitation Bay STAT"}
                  </span>
                </button>

                <button
                  onClick={handlePageCardio}
                  className={`w-full font-body-strong text-body-strong py-2.5 px-space-md rounded-lg flex items-center justify-center gap-space-xs transition-colors shadow-sm font-bold active:scale-[0.98] ${
                    pagedCardiologist
                      ? "bg-secondary text-on-secondary"
                      : "bg-primary hover:bg-primary-container text-on-primary"
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">ring_volume</span>
                  <span>
                    {pagedCardiologist
                      ? "Cardiologist Paged (Dr. Kulkarni En Route)"
                      : "Page On-Call Cardiologist (Dr. Kulkarni)"}
                  </span>
                </button>

                <div className="grid grid-cols-2 gap-space-xs pt-1">
                  <button
                    onClick={handleAcknowledge}
                    className={`font-body-strong text-clinical-data py-2 px-space-sm rounded-lg flex items-center justify-center gap-1 transition-colors font-semibold shadow-xs ${
                      acknowledged
                        ? "bg-primary text-on-primary"
                        : "bg-surface-container-high hover:bg-surface-container text-on-surface"
                    }`}
                  >
                    <span className="material-symbols-outlined text-base text-primary">draw</span>
                    <span>{acknowledged ? "Signed & Locked" : "Acknowledge & Sign"}</span>
                  </button>

                  <button
                    onClick={() => showToast("Clinical de-escalation note template appended to chart.")}
                    className="bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant font-body-strong text-clinical-data py-2 px-space-sm rounded-lg flex items-center justify-center gap-1 transition-colors font-semibold border border-outline-variant"
                  >
                    <span className="material-symbols-outlined text-base">edit_note</span>
                    <span>De-escalate / Note</span>
                  </button>
                </div>
              </div>

              {/* Quick Access Code Blue Overrides */}
              <div className="bg-surface-container-low p-space-sm rounded-lg flex items-center justify-between text-metadata-micro border border-outline-variant">
                <span className="font-clinical-data-mono text-outline flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">shield</span>
                  Hospital Clinical Bypass Auth
                </span>
                <span className="font-clinical-data-mono text-primary font-bold">BYPASS ENABLED</span>
              </div>
            </div>
          </div>

          {/* 3. Precise Audit Log */}
          <div className="bg-surface-container-lowest rounded-xl p-panel-padding shadow-sm flex flex-col gap-space-sm border border-outline-variant">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-outline text-lg">event_note</span>
                <h3 className="font-section-title text-section-title text-on-surface font-semibold">
                  Triage Chain of Custody &amp; Audit Log
                </h3>
              </div>
              <button
                onClick={() => showToast("Audit log synchronized with ABHA M3 Gateway.")}
                className="text-outline hover:text-on-surface transition-colors"
                title="Refresh log"
              >
                <span className="material-symbols-outlined text-sm">refresh</span>
              </button>
            </div>

            <div className="flex flex-col gap-space-sm pl-2">
              {/* Item 1 */}
              <div className="flex items-start gap-space-sm">
                <span className="font-clinical-data-mono text-metadata-micro text-secondary shrink-0 pt-0.5 font-bold">
                  14:18:22
                </span>
                <div className="flex flex-col">
                  <span className="font-body-strong text-body-strong text-on-surface font-semibold">
                    Detected by Voice Intake Engine
                  </span>
                  <span className="font-clinical-data text-metadata-micro text-on-surface-variant">
                    Acoustic stress trigger + symptom matrix matched (Confidence 98.4%)
                  </span>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-start gap-space-sm">
                <span className="font-clinical-data-mono text-metadata-micro text-secondary shrink-0 pt-0.5 font-bold">
                  14:20:05
                </span>
                <div className="flex flex-col">
                  <span className="font-body-strong text-body-strong text-on-surface font-semibold">
                    Acknowledged by Sister Ancy Thomas
                  </span>
                  <span className="font-clinical-data text-metadata-micro text-on-surface-variant">
                    Assigned triage bed A at Bay 02; vitals cuff attached
                  </span>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-start gap-space-sm">
                <span className="font-clinical-data-mono text-metadata-micro text-secondary shrink-0 pt-0.5 font-bold">
                  14:22:15
                </span>
                <div className="flex flex-col">
                  <span className="font-body-strong text-body-strong text-on-surface font-semibold">
                    STAT ECG Dispatched to Bay 02
                  </span>
                  <span className="font-clinical-data text-metadata-micro text-on-surface-variant">
                    Technician Rajesh logged order reception
                  </span>
                </div>
              </div>

              {/* Item 4 */}
              <div className="flex items-start gap-space-sm">
                <span className="font-clinical-data-mono text-metadata-micro text-secondary shrink-0 pt-0.5 font-bold">
                  14:26:00
                </span>
                <div className="flex flex-col">
                  <span className="font-body-strong text-body-strong text-on-surface font-semibold">
                    Dr. Rohit Verma Assigned as Lead Attending
                  </span>
                  <span className="font-clinical-data text-metadata-micro text-on-surface-variant">
                    STEMI protocol acknowledged with dual sign-off pending
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ECG Modal */}
      {showEcgModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-outline-variant flex flex-col">
            <div className="p-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-error text-xl font-bold">monitor_heart</span>
                <h3 className="font-section-title text-on-surface font-bold">
                  STAT Bedside 12-Lead ECG Trace (Cart 04)
                </h3>
              </div>
              <button
                onClick={() => setShowEcgModal(false)}
                className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-inverse-surface text-primary-fixed p-4 rounded-xl space-y-2">
                <div className="flex justify-between font-clinical-data-mono text-xs text-inverse-on-surface/80 border-b border-inverse-surface/40 pb-2">
                  <span>Lead V2 - V4 Anterior Surface</span>
                  <span className="text-error font-bold">ST Elevation &gt;2.5mm</span>
                </div>
                <svg
                  className="w-full h-24 stroke-primary-fixed fill-none"
                  preserveAspectRatio="none"
                  viewBox="0 0 400 60"
                >
                  <path
                    d="M0,30 L40,30 L45,26 L50,30 L60,30 L65,36 L70,8 L78,54 L84,20 L98,20 L110,30 L150,30 L155,26 L160,30 L170,30 L175,36 L180,8 L188,54 L194,20 L208,20 L220,30 L260,30 L265,26 L270,30 L280,30 L285,36 L290,8 L298,54 L304,20 L318,20 L330,30 L370,30 L375,26 L380,30 L400,30"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  ></path>
                </svg>
              </div>

              <div className="p-3 bg-error-container text-on-error-container rounded-lg text-xs font-clinical-data space-y-1">
                <p className="font-bold uppercase">Automated Diagnostic Interpretation:</p>
                <p>
                  Acute Anteroseptal ST-Segment Elevation Myocardial Infarction. Reciprocal ST depression in inferior leads (III, aVF).
                  Notify Cardiac Catheterization Laboratory immediately.
                </p>
              </div>

              <div className="flex justify-between items-center pt-2">
                <Link
                  href="/patient-overview"
                  className="text-primary text-xs font-semibold hover:underline flex items-center gap-1"
                >
                  <span>Open Full Patient Chart</span>
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </Link>

                <button
                  onClick={() => setShowEcgModal(false)}
                  className="px-4 py-2 bg-primary text-on-primary rounded font-clinical-data text-xs font-semibold"
                >
                  Close Trace
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
