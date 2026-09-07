/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";

interface ChatMessage {
  id: string;
  sender: "clinician" | "assistant";
  timestamp: string;
  text?: string;
  structuredCards?: Array<{
    title: string;
    badge: string;
    badgeStyle: string;
    details: string[];
    evidence: string;
  }>;
  citations?: Array<{ label: string; pmid?: string; url?: string }>;
}

export default function ClinicalAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "clinician",
      timestamp: "14:14 IST",
      text: "Assess reperfusion pathway suitability and verify dual antiplatelet loading dose in view of renal profile and penicillin anaphylaxis.",
    },
    {
      id: "msg-2",
      sender: "assistant",
      timestamp: "14:14:02 IST",
      structuredCards: [
        {
          title: "1. Reperfusion Target & Cath Lab Mobilization",
          badge: "PRIMARY PCI STAT",
          badgeStyle: "bg-error text-on-error",
          details: [
            "Primary PCI indicated within 90 minutes Door-to-Balloon target (ACC/AHA Class I-A).",
            "Current elapsed time from medical contact: 28 minutes (Well within golden window).",
            "Cath Lab Suite 01 status: Mobilized & Sterile team alerted.",
          ],
          evidence: "ACC/AHA 2024 STEMI Reperfusion Guidelines §4.1",
        },
        {
          title: "2. Dual Antiplatelet Strategy (DAPT)",
          badge: "VERIFIED SAFE",
          badgeStyle: "bg-primary text-on-primary",
          details: [
            "Aspirin 325 mg PO (chewed) + Ticagrelor 180 mg PO STAT loading verified.",
            "No active gastrointestinal hemorrhage or thrombocytopenia contraindications.",
            "P2Y12 loading confirmed before radial sheath insertion.",
          ],
          evidence: "ESC 2023 ACS Guidelines §7.2",
        },
        {
          title: "3. Allergy Clearance Check (Zero Beta-Lactam Overlap)",
          badge: "HARD-STOP CLEARED",
          badgeStyle: "bg-amber-800 text-amber-50",
          details: [
            "Penicillin anaphylaxis history locked in EHR.",
            "Zero cephalosporin or penicillin cross-reactivity in antiplatelet/heparin regimen.",
            "If pre-op prophylactic coverage is required by surgical team: Ciprofloxacin 400mg IV or Vancomycin 1g IV recommended.",
          ],
          evidence: "Joint Task Force on Practice Parameters (JTFPP) Drug Allergy 2022",
        },
        {
          title: "4. Contrast-Induced Nephropathy (CIN) Risk Stratification",
          badge: "LOW RISK (MEHRAN 2)",
          badgeStyle: "bg-surface-container-high text-on-surface",
          details: [
            "Baseline Serum Creatinine: 1.0 mg/dL | Baseline eGFR: 98 mL/min/1.73m².",
            "Mehran Score: 2 (Estimated post-PCI dialytic risk: <0.1%).",
            "Hydration Protocol: 0.9% Normal Saline at 1 mL/kg/h starting pre-procedure.",
          ],
          evidence: "KDIGO 2023 Acute Kidney Injury & Contrast Safety Panel",
        },
      ],
      citations: [
        { label: "ACC/AHA 2024 Recomm. 1.1", url: "#" },
        { label: "TIMI Risk Score Calculator: Score 5", url: "#" },
        { label: "PubMed PMID: 38192011", pmid: "38192011" },
      ],
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedCitation, setSelectedCitation] = useState<string>("ACC/AHA 2024 Recomm. 1.1");
  const messageIdCounterRef = useRef(100);

  const quickPrompts = [
    "Reperfusion Checklist",
    "DDI Contraindication Scan",
    "Antibiotic Allergy Alternative",
    "Discharge Pathway Preview",
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputPrompt;
    if (!text.trim()) return;

    messageIdCounterRef.current += 1;
    const userMsg: ChatMessage = {
      id: `msg-${messageIdCounterRef.current}`,
      sender: "clinician",
      timestamp: "Just now",
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      messageIdCounterRef.current += 1;
      const aiResponse: ChatMessage = {
        id: `msg-${messageIdCounterRef.current}`,
        sender: "assistant",
        timestamp: "Just now",
        text: `Clinical evaluation for query "${text}":\nParameters verified against active FHIR chart for Rahul Sharma (42M). All therapeutic directives align with 2024 ACC/AHA Class I evidence. Attending attestation required before CPOE execution.`,
        citations: [
          { label: "ACC/AHA 2024 Clinical Guidelines", url: "#" },
          { label: "UpToDate: Acute Coronary Syndromes (Updated 2024)", url: "#" },
        ],
      };
      setMessages((prev) => [...prev, aiResponse]);
      showToast("Grounded response generated with ACC/AHA 2024 citations.");
    }, 700);
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

      {/* Patient Header Banner */}
      <div className="w-full bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-space-base flex flex-wrap items-center justify-between gap-space-base">
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
                CareFlow AI Clinical Assistant
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container font-clinical-data-mono text-metadata-micro font-semibold">
                CDSS Class IIb Validated
              </span>
              <span className="px-2 py-0.5 rounded-full bg-error/15 text-error font-clinical-data-mono text-metadata-micro font-bold">
                Active Context: Rahul Sharma (42M)
              </span>
            </div>
            <p className="font-body-default text-metadata-micro text-on-surface-variant mt-0.5">
              Multimodal Clinical Reasoning Copilot · Grounded in ACC/AHA, ESC, UpToDate, and FHIR R4 Patient Parameters
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/patient-overview"
            className="px-space-md py-1.5 bg-surface-container text-on-surface hover:bg-surface-container-high rounded-lg text-clinical-data font-clinical-data transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">dashboard</span>
            <span>Patient Overview</span>
          </Link>
          <Link
            href="/cpoe"
            className="px-space-md py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-clinical-data font-clinical-data font-semibold transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">bolt</span>
            <span>Cath Lab Orders</span>
          </Link>
        </div>
      </div>

      {/* 3-Pane Clinical AI Workspace */}
      <div className="grid grid-cols-12 gap-space-base items-start">
        {/* Left Pane: Clinical Context & Grounding Anchors (Cols 1-3 on XL) */}
        <div className="col-span-12 xl:col-span-3 flex flex-col gap-space-base">
          {/* Active Patient Dossier */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-base border border-outline-variant/30 flex flex-col gap-space-sm">
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
              <span className="font-table-header text-table-header uppercase text-outline">
                Patient Dossier
              </span>
              <span className="px-2 py-0.5 rounded bg-error/15 text-error font-clinical-data-mono text-metadata-micro font-bold">
                P1 STAT STEMI
              </span>
            </div>

            <div className="flex flex-col gap-1 text-clinical-data">
              <div className="flex justify-between py-0.5 border-b border-surface-container-low">
                <span className="text-outline">Patient:</span>
                <span className="font-semibold text-on-surface">Rahul Sharma (42M)</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-surface-container-low">
                <span className="text-outline">UHID:</span>
                <span className="font-clinical-data-mono text-on-surface">DEL-2024-8841</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-surface-container-low">
                <span className="text-outline">Location:</span>
                <span className="font-semibold text-primary">Bay 02 (Telemetry Monitored)</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-outline">Attending:</span>
                <span className="text-on-surface font-semibold">Dr. Rohit Verma</span>
              </div>
            </div>
          </div>

          {/* Grounded Clinical Vectors */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-base border border-outline-variant/30 flex flex-col gap-space-sm">
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
              <span className="font-table-header text-table-header uppercase text-outline">
                Grounded Clinical Vectors
              </span>
              <span className="material-symbols-outlined text-primary text-sm">lock</span>
            </div>

            <div className="flex flex-col gap-2">
              <div className="p-space-xs bg-surface-container-low rounded-lg border border-outline-variant/15 flex flex-col gap-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-clinical-data font-bold text-on-surface">Verified 12-Lead ECG</span>
                  <span className="text-error font-bold text-metadata-micro">+3.2mm ST V2-V4</span>
                </div>
                <span className="text-metadata-micro text-outline">
                  Lead II, III, aVF reciprocal depression confirmed.
                </span>
              </div>

              <div className="p-space-xs bg-surface-container-low rounded-lg border border-outline-variant/15 flex flex-col gap-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-clinical-data font-bold text-on-surface">STAT Troponin I</span>
                  <span className="text-error font-bold text-metadata-micro">1.42 ng/mL</span>
                </div>
                <span className="text-metadata-micro text-outline">
                  Baseline eGFR: 98 mL/min (Contrast fluoroscopy safe).
                </span>
              </div>

              <div className="p-space-xs bg-error/10 rounded-lg border border-error/20 flex flex-col gap-0.5">
                <div className="flex items-center justify-between text-error font-bold text-clinical-data">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">warning</span>
                    Hard-Stop Allergy
                  </span>
                  <span className="text-metadata-micro font-clinical-data-mono">ANAPHYLAXIS</span>
                </div>
                <span className="text-metadata-micro text-error leading-snug">
                  Penicillin / Beta-lactam class: Severe anaphylaxis documented.
                </span>
              </div>
            </div>
          </div>

          {/* Guideline Context Loaded */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-base border border-outline-variant/30 flex flex-col gap-space-sm">
            <span className="font-table-header text-table-header uppercase text-outline">
              Guideline Knowledge Vector Store
            </span>
            <div className="flex flex-col gap-1.5 text-metadata-micro">
              <div className="p-2 rounded bg-surface-container-low border border-outline-variant/10 flex items-center justify-between">
                <span className="font-medium text-on-surface">2024 ACC/AHA STEMI Reperfusion</span>
                <span className="text-primary font-bold">v3.2</span>
              </div>
              <div className="p-2 rounded bg-surface-container-low border border-outline-variant/10 flex items-center justify-between">
                <span className="font-medium text-on-surface">ESC ACS Dual Antiplatelet Guidelines</span>
                <span className="text-secondary font-bold">2023</span>
              </div>
              <div className="p-2 rounded bg-surface-container-low border border-outline-variant/10 flex items-center justify-between">
                <span className="font-medium text-on-surface">PMJAY / GIPSA Clinical Tariff Pathway</span>
                <span className="text-outline font-bold">Tier-1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Pane: Clinical Reasoning Chat & Copilot Stream (Cols 4-8 on XL) */}
        <div className="col-span-12 xl:col-span-6 flex flex-col gap-space-base">
          {/* Disclaimer Banner */}
          <div className="p-space-sm bg-surface-container-low rounded-xl border border-outline-variant/20 flex items-center gap-space-sm text-metadata-micro text-on-surface-variant">
            <span className="material-symbols-outlined text-primary text-lg shrink-0">info</span>
            <span>
              <strong>Clinical Decision Support (CDSS) Notice:</strong> Deterministic safety interlocks override generative AI suggestions. Final legal attestation required by Dr. Rohit Verma before order execution.
            </span>
          </div>

          {/* Dialogue Thread */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-base border border-outline-variant/30 flex flex-col gap-space-md min-h-[500px]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col gap-1 ${
                  msg.sender === "clinician" ? "items-end" : "items-start"
                }`}
              >
                <div className="flex items-center gap-2 text-metadata-micro text-outline">
                  <span className="font-semibold">
                    {msg.sender === "clinician" ? "Dr. Rohit Verma (Chief Clinician)" : "CareFlow Copilot"}
                  </span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                {msg.text && (
                  <div
                    className={`p-space-md rounded-2xl max-w-xl text-clinical-data whitespace-pre-line leading-relaxed shadow-xs ${
                      msg.sender === "clinician"
                        ? "bg-primary text-on-primary rounded-tr-none font-medium"
                        : "bg-surface-container-low text-on-surface rounded-tl-none border border-outline-variant/15"
                    }`}
                  >
                    {msg.text}
                  </div>
                )}

                {msg.structuredCards && (
                  <div className="flex flex-col gap-space-sm w-full mt-1">
                    {msg.structuredCards.map((card, idx) => (
                      <div
                        key={idx}
                        className="p-space-sm bg-surface-container-low rounded-xl border border-outline-variant/15 flex flex-col gap-1 shadow-xs hover:border-primary/30 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-body-strong text-clinical-data text-on-surface font-semibold">
                            {card.title}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded font-clinical-data-mono text-metadata-micro font-bold ${card.badgeStyle}`}
                          >
                            {card.badge}
                          </span>
                        </div>
                        <ul className="list-disc list-inside text-metadata-micro text-on-surface-variant flex flex-col gap-0.5 mt-1">
                          {card.details.map((detail, dIdx) => (
                            <li key={dIdx}>{detail}</li>
                          ))}
                        </ul>
                        <div className="flex items-center justify-between pt-1 mt-1 border-t border-surface-container-high text-metadata-micro font-clinical-data-mono text-outline">
                          <span>Evidence: {card.evidence}</span>
                          <button
                            onClick={() => {
                              setSelectedCitation(card.evidence);
                              showToast(`Loaded evidence document: ${card.evidence}`);
                            }}
                            className="text-primary hover:underline"
                          >
                            Inspect Source →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {msg.citations && (
                  <div className="flex items-center gap-1.5 flex-wrap mt-1">
                    <span className="text-metadata-micro text-outline font-semibold">Grounded in:</span>
                    {msg.citations.map((cit, cIdx) => (
                      <button
                        key={cIdx}
                        onClick={() => {
                          setSelectedCitation(cit.label);
                          showToast(`Opened citation: ${cit.label}`);
                        }}
                        className="px-2 py-0.5 rounded bg-surface-container hover:bg-surface-container-high text-metadata-micro font-clinical-data text-primary font-medium transition-colors"
                      >
                        {cit.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-primary font-clinical-data text-metadata-micro animate-pulse">
                <span className="material-symbols-outlined text-base animate-spin">autorenew</span>
                <span>Evaluating against ACC/AHA 2024 clinical ontology...</span>
              </div>
            )}
          </div>

          {/* Action Triggers Strip */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => showToast("Copied rationale and citation matrix to active Progress Note.")}
              className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg text-metadata-micro font-clinical-data font-semibold transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">content_copy</span>
              <span>Copy Rationale to Note</span>
            </button>
            <button
              onClick={() => showToast("Recommendations exported directly to CPOE Diagnostic & Cath Orders.")}
              className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-metadata-micro font-clinical-data font-semibold transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">post_add</span>
              <span>Add Recommendation to Orders</span>
            </button>
            <button
              onClick={() => showToast("Case flagged for multidisciplinary Morbidity & Mortality audit review.")}
              className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg text-metadata-micro font-clinical-data font-semibold transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">flag</span>
              <span>Flag for Multidisciplinary Review</span>
            </button>
          </div>

          {/* Bottom Input Dock */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-sm border border-outline-variant/30 flex flex-col gap-space-xs">
            {/* Quick Prompt Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-metadata-micro text-outline font-semibold">Quick Directives:</span>
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2 py-0.5 rounded bg-surface-container-low hover:bg-surface-container text-metadata-micro font-clinical-data text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={() => showToast("Microphone speech-to-text active (listening in EN-IN)...")}
                className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary transition-colors shrink-0"
                title="Voice Query Input"
              >
                <span className="material-symbols-outlined text-lg">mic</span>
              </button>

              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
                placeholder="Ask clinical copilot: contrast nephropathy precautions, second-line antiplatelets, D-t-B targets..."
                className="flex-1 h-9 px-3 rounded-lg bg-surface-container-low border border-outline-variant text-clinical-data font-clinical-data text-on-surface focus:outline-none focus:border-primary"
              />

              <button
                onClick={() => handleSendMessage()}
                disabled={!inputPrompt.trim()}
                className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-clinical-data text-clinical-data font-semibold transition-all disabled:opacity-40 flex items-center gap-1 shrink-0"
              >
                <span>Send</span>
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Pane: Evidence Dock & Guideline Inspector (Cols 9-12 on XL) */}
        <div className="col-span-12 xl:col-span-3 flex flex-col gap-space-base">
          {/* Active Citation Detail */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-base border border-outline-variant/30 flex flex-col gap-space-sm">
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
              <span className="font-table-header text-table-header uppercase text-outline">
                Evidence Inspector
              </span>
              <span className="px-2 py-0.5 rounded bg-primary text-on-primary font-clinical-data-mono text-metadata-micro font-bold">
                CLASS I-A
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <h3 className="font-body-strong text-clinical-data text-on-surface font-semibold">
                {selectedCitation}
              </h3>
              <p className="font-body-default text-metadata-micro text-on-surface-variant leading-relaxed">
                &quot;In patients with acute STEMI presenting within 12 hours of symptom onset, primary percutaneous coronary intervention (PCI) is recommended over fibrinolytic therapy if the anticipated door-to-balloon time is less than 90 minutes.&quot;
              </p>
              <div className="p-2 bg-surface-container-low rounded-lg border border-outline-variant/10 text-metadata-micro font-clinical-data-mono text-outline mt-1">
                <div>Source: American Heart Association / ACC</div>
                <div>Year: 2024 Official Guideline Update</div>
                <div>Certainty: High (Randomized Controlled Trials)</div>
              </div>
            </div>
          </div>

          {/* Model Rationale & Audit Score */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-base border border-outline-variant/30 flex flex-col gap-space-sm">
            <span className="font-table-header text-table-header uppercase text-outline">
              Inference Audit Trail
            </span>
            <div className="flex flex-col gap-1 text-metadata-micro font-clinical-data-mono">
              <div className="flex justify-between py-1 border-b border-surface-container-high">
                <span className="text-outline">Confidence Score:</span>
                <span className="text-primary font-bold">98.4%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-surface-container-high">
                <span className="text-outline">Retrieval Latency:</span>
                <span className="text-on-surface font-semibold">38 ms</span>
              </div>
              <div className="flex justify-between py-1 border-b border-surface-container-high">
                <span className="text-outline">Safety Gate:</span>
                <span className="text-primary font-bold">DFA Deterministic PASS</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-outline">Audit Token:</span>
                <span className="text-on-surface">#CDSS-2024-88910</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
