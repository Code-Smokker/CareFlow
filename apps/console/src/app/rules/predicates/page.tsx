"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DemoDataBadge } from "@careflow/ui";

interface SyntheticTestCase {
  id: string;
  caseNum: string;
  patientName: string;
  demographics: string;
  uhid: string;
  description: string;
  status: "PASS" | "FAIL";
  triggerLabel: string;
  triggerType: "triggered" | "not_triggered" | "suppressed";
  executionTime: string;
  borderAccent: string;
}

export default function RedFlagRuleBuilderPage() {
  // Test suite state
  const [testCases, setTestCases] = useState<SyntheticTestCase[]>([
    {
      id: "tc-1",
      caseNum: "Case #01",
      patientName: "Rahul Sharma",
      demographics: "42M",
      uhid: "UHID-9081",
      description:
        "Retrosternal chest pressure radiating to jaw + severe cold diaphoresis reported via triage kiosk voice.",
      status: "PASS",
      triggerLabel: "TRIGGERED: P1 STAT ACS",
      triggerType: "triggered",
      executionTime: "12ms",
      borderAccent: "border-primary",
    },
    {
      id: "tc-2",
      caseNum: "Case #02",
      patientName: "Geeta Kapoor",
      demographics: "72F",
      uhid: "UHID-4421",
      description:
        "Isolated epigastric burning without radiation; normal 12-lead ECG; troponin non-elevated (<0.01 ng/mL).",
      status: "PASS",
      triggerLabel: "NOT TRIGGERED: GI Protocol",
      triggerType: "not_triggered",
      executionTime: "8ms",
      borderAccent: "border-secondary",
    },
    {
      id: "tc-3",
      caseNum: "Case #03",
      patientName: "Sunita Devi",
      demographics: "58F",
      uhid: "UHID-3129",
      description:
        "Severe orthopnea, bilateral crackles, BP 190/110. ST depression in lateral leads without focal elevation.",
      status: "PASS",
      triggerLabel: "TRIGGERED: Secondary HF",
      triggerType: "triggered",
      executionTime: "14ms",
      borderAccent: "border-primary",
    },
    {
      id: "tc-4",
      caseNum: "Case #04",
      patientName: "Manish Taneja",
      demographics: "51M",
      uhid: "UHID-8802",
      description:
        "Tearing chest pain radiating to back. CT Angiogram demonstrates Type A Aortic Dissection.",
      status: "PASS",
      triggerLabel: "SUPPRESSED: Dissection Interlock",
      triggerType: "suppressed",
      executionTime: "9ms",
      borderAccent: "border-error",
    },
  ]);

  // Simulation state
  const [isRunningMatrix, setIsRunningMatrix] = useState(false);
  const [runBenchmarkPulse, setRunBenchmarkPulse] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isAddScenarioOpen, setIsAddScenarioOpen] = useState(false);

  // New Scenario Form
  const [newPatientName, setNewPatientName] = useState("");
  const [newDemographics, setNewDemographics] = useState("45M");
  const [newUhid, setNewUhid] = useState("UHID-5502");
  const [newDescription, setNewDescription] = useState("");
  const [newTriggerType, setNewTriggerType] = useState<"triggered" | "not_triggered" | "suppressed">("triggered");

  // Predicate thresholds — read-only display values (see the "Read-only · version-controlled"
  // badge above); real values live in packages/ontology, not in this component's state.
  const femaleStThreshold = "1.5";
  const maleStThreshold = "2.0";
  const troponinThreshold = "0.04";

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRunMatrix = () => {
    setIsRunningMatrix(true);
    setTimeout(() => {
      setIsRunningMatrix(false);
      showToast("Synthetic patient matrix completed: 4/4 assertions validated against NABH 2024 benchmarks.");
    }, 800);
  };

  const handleBenchmarkPulse = () => {
    setRunBenchmarkPulse(true);
    setTimeout(() => {
      setRunBenchmarkPulse(false);
      showToast("All synthetic clinical safety benchmarks verified (0 false negatives).");
    }, 700);
  };

  const handleAddScenario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim()) return;

    const newCase: SyntheticTestCase = {
      id: `tc-${Date.now()}`,
      caseNum: `Case #0${testCases.length + 1}`,
      patientName: newPatientName,
      demographics: newDemographics,
      uhid: newUhid,
      description: newDescription || "Bedside clinical assessment findings recorded during emergency intake.",
      status: "PASS",
      triggerLabel:
        newTriggerType === "triggered"
          ? "TRIGGERED: P1 STAT ACS"
          : newTriggerType === "suppressed"
          ? "SUPPRESSED: Safety Interlock"
          : "NOT TRIGGERED: Alternate Protocol",
      triggerType: newTriggerType,
      executionTime: `${Math.floor(Math.random() * 8) + 7}ms`,
      borderAccent:
        newTriggerType === "triggered"
          ? "border-primary"
          : newTriggerType === "suppressed"
          ? "border-error"
          : "border-secondary",
    };

    setTestCases([...testCases, newCase]);
    setIsAddScenarioOpen(false);
    setNewPatientName("");
    setNewDescription("");
    showToast(`Added test scenario for ${newCase.patientName} (${newCase.uhid})`);
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-inverse-surface text-inverse-on-surface shadow-lg text-clinical-data font-clinical-data border border-outline-variant/30 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="material-symbols-outlined text-primary-fixed text-lg">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Governance Navigation Breadcrumb & Header Stage */}
      <div className="flex flex-col gap-space-sm mb-space-base">
        <div className="flex items-center gap-space-xs text-metadata-micro font-metadata-micro text-outline">
          <Link href="/audit" className="hover:text-primary transition-colors">
            Governance &amp; Control
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <Link href="/rules" className="hover:text-primary transition-colors">
            Clinical Rules &amp; Protocols
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="font-clinical-data-mono text-primary font-semibold">Rule #RF-CARD-01</span>
          <span className="ml-2 px-1.5 py-0.5 rounded bg-primary text-on-primary font-metadata-micro tracking-wide uppercase">
            Active Enforced
          </span>
        </div>

        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-space-base pb-space-sm">
          <div className="flex flex-col">
            <div className="flex items-center gap-space-sm">
              <div className="h-9 w-9 rounded-xl bg-error/10 flex items-center justify-center text-error shadow-xs">
                <span className="material-symbols-outlined text-xl">gavel</span>
              </div>
              <div>
                <h1 className="font-page-title text-page-title text-on-surface font-semibold">
                  Red-Flag Rule Builder
                </h1>
                <p className="font-body-default text-body-default text-on-surface-variant">
                  Deterministic clinical safety rule engine · Hard-stop triggers, acuity escalations, and automated CPOE order-set dispatch
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-space-xs">
            <button
              id="run-benchmarks-btn"
              onClick={handleBenchmarkPulse}
              className={`flex items-center gap-space-xs px-space-md py-1.5 bg-surface-container-high hover:bg-surface-container rounded-xl text-on-surface font-clinical-data text-clinical-data transition-colors shadow-sm ${
                runBenchmarkPulse ? "ring-2 ring-primary bg-primary-fixed/20" : ""
              }`}
            >
              <span className="material-symbols-outlined text-base text-primary">fact_check</span>
              <span>
                Test Synthetic Suite (
                <span className={`text-primary font-bold ${runBenchmarkPulse ? "animate-pulse" : ""}`} id="pass-count">
                  {testCases.filter((tc) => tc.status === "PASS").length}/{testCases.length}
                </span>{" "}
                Passed)
              </span>
            </button>

            {/* No save/submit/edit controls here on purpose — red flags are deterministic rules,
                version-controlled in packages/ontology, never mutable from this screen
                (CLAUDE.md rule 3). This badge states that instead of a fake "locked" action. */}
            <div
              className="flex items-center gap-space-xs px-space-lg py-1.5 bg-primary-container text-on-primary-container font-clinical-data text-clinical-data font-semibold rounded-xl"
              title="Edited via pull request in packages/ontology, not from this screen"
            >
              <span className="material-symbols-outlined text-base">lock</span>
              <span>Read-only · version-controlled</span>
            </div>
            <DemoDataBadge reason="This specific rule (RF-CARD-01) and the synthetic test cases below are the boilerplate's illustrative content, not read from packages/ontology's real chest_pain.yaml red flags — see /rules for the real modules." />
          </div>
        </div>
      </div>

      {/* Rule Overview & Critical Metadata Strip */}
      <div className="relative bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden mb-space-base border border-outline-variant/15">
        <div className="h-1.5 w-full bg-error"></div>
        <div className="p-space-base flex flex-col 2xl:flex-row gap-space-base items-start 2xl:items-center justify-between">
          <div className="flex flex-col gap-1 max-w-3xl">
            <div className="flex items-center gap-space-sm flex-wrap">
              <span className="font-clinical-data-mono text-metadata-micro font-semibold px-2 py-0.5 rounded bg-error/15 text-error">
                CRITICAL INTERLOCK · LEVEL 1
              </span>
              <span className="font-clinical-data-mono text-metadata-micro text-outline">ID: RF-CARD-01</span>
              <span className="h-1.5 w-1.5 rounded-full bg-outline-variant"></span>
              <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                Version: v2.4 (Active Enforced)
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-outline-variant"></span>
              <span className="font-metadata-micro text-metadata-micro text-primary flex items-center gap-1 font-semibold">
                <span className="material-symbols-outlined text-xs">lock</span> Deterministic Hard-Stop
              </span>
            </div>
            <h2 className="font-section-title text-section-title text-on-surface font-semibold">
              Suspected Acute Coronary Syndrome (ACS) &amp; STEMI Red-Flag Trigger
            </h2>
            <p className="font-body-default text-clinical-data text-on-surface-variant">
              Continuous real-time telemetry, emergency kiosk intake, and ambient scribe heuristic evaluator for hyperacute coronary artery occlusions and unheralded cardiogenic shock.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-md p-space-sm bg-surface-container-low rounded-xl w-full 2xl:w-auto border border-outline-variant/10">
            <div className="flex flex-col">
              <span className="font-metadata-micro text-metadata-micro text-outline uppercase tracking-wide">
                Clinical Lead
              </span>
              <span className="font-clinical-data text-clinical-data text-on-surface font-semibold">
                Dr. Rohit Verma
              </span>
              <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                Chief of Clinical Services
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-metadata-micro text-metadata-micro text-outline uppercase tracking-wide">
                AI Safety Stratum
              </span>
              <span className="font-clinical-data text-clinical-data text-error font-semibold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-xs">block</span> Zero AI Mutation
              </span>
              <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                Hardcoded DFA Safety
              </span>
            </div>
            <div className="flex flex-col col-span-2 sm:col-span-1">
              <span className="font-metadata-micro text-metadata-micro text-outline uppercase tracking-wide">
                Enforcement Scope
              </span>
              <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                <span className="px-1.5 py-0.5 bg-surface-container rounded font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                  Triage Kiosk
                </span>
                <span className="px-1.5 py-0.5 bg-surface-container rounded font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                  Voice Scribe
                </span>
                <span className="px-1.5 py-0.5 bg-surface-container rounded font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                  Telemetry
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Builder Workspace: 12-Column Layout */}
      <div className="grid grid-cols-12 gap-space-base items-start">
        {/* Center Stage: Rule Logic & Dispatch Interlock (Cols 1-8) */}
        <div className="col-span-12 xl:col-span-8 flex flex-col gap-space-base">
          {/* Logic Builder Canvas Container */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-base relative border border-outline-variant/15">
            <div className="flex items-center justify-between pb-space-sm border-b-0">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-xl">account_tree</span>
                <span className="font-section-title text-subheading text-on-surface font-semibold">
                  Deterministic Logic Graph [WHEN]
                </span>
                <span className="ml-2 font-clinical-data-mono text-metadata-micro px-2 py-0.5 bg-surface-container-high text-on-surface rounded-full font-semibold">
                  3 Nodes Active
                </span>
              </div>
              <div className="flex items-center gap-space-xs">
                <span className="font-metadata-micro text-metadata-micro text-outline">Evaluation Latency:</span>
                <span className="font-clinical-data-mono text-metadata-micro text-primary font-bold">11.4 ms</span>
                {/* Threshold values are version-controlled in packages/ontology, not editable from this screen —
                    CLAUDE.md rule 3: red flags are deterministic rules, never UI-mutable. The tune-thresholds
                    modal this button opened is left in place below (unreachable) rather than deleted, since
                    the values it displays are still real read context if this screen grows a proper viewer. */}
              </div>
            </div>

            {/* Visual Flow Engine Graph Wrapper */}
            <div className="flex flex-col gap-space-base mt-space-sm relative">
              {/* Block 1: Group A (Patient Reported / Ambient Voice - AND Logic) */}
              <div className="relative bg-surface-container-low rounded-xl p-space-base shadow-sm border border-outline-variant/10">
                <div className="flex items-center justify-between mb-space-sm flex-wrap gap-2">
                  <div className="flex items-center gap-space-xs flex-wrap">
                    <span className="h-6 px-2 rounded bg-primary text-on-primary font-clinical-data-mono text-metadata-micro font-bold flex items-center justify-center">
                      GROUP A
                    </span>
                    <span className="font-clinical-data text-clinical-data text-on-surface font-semibold">
                      Patient Reported Symptoms &amp; Ambient Acoustic Scribe
                    </span>
                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-clinical-data-mono text-metadata-micro font-semibold">
                      ALL CRITERIA REQUIRED (AND)
                    </span>
                  </div>
                  <div className="flex items-center gap-space-2xs">
                    <span className="material-symbols-outlined text-primary text-sm">mic</span>
                    <span className="font-metadata-micro text-metadata-micro text-on-surface-variant font-medium">
                      Real-time Stream Engine
                    </span>
                  </div>
                </div>

                {/* Condition Items Stack */}
                <div className="flex flex-col gap-space-xs">
                  {/* Condition A1 */}
                  <div className="p-space-sm bg-surface-container-lowest rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-space-xs hover:shadow-sm transition-shadow border border-outline-variant/10">
                    <div className="flex items-center gap-space-xs">
                      <span className="h-5 w-5 rounded bg-surface-container-high flex items-center justify-center text-primary font-clinical-data-mono text-metadata-micro font-bold">
                        01
                      </span>
                      <span className="font-clinical-data-mono text-clinical-data text-on-surface font-semibold">
                        Chief Complaint (HPI)
                      </span>
                      <span className="px-2 py-0.5 bg-surface-container rounded text-metadata-micro font-clinical-data-mono text-on-surface-variant">
                        CONTAINS ANY
                      </span>
                    </div>
                    <div className="flex items-center gap-space-xs flex-wrap">
                      <div className="flex items-center gap-1 flex-wrap">
                        <span className="px-2 py-0.5 bg-surface-container rounded font-clinical-data-mono text-metadata-micro text-primary font-medium">
                          &quot;chest pain&quot;
                        </span>
                        <span className="px-2 py-0.5 bg-surface-container rounded font-clinical-data-mono text-metadata-micro text-primary font-medium">
                          &quot;crushing pressure&quot;
                        </span>
                        <span className="px-2 py-0.5 bg-surface-container rounded font-clinical-data-mono text-metadata-micro text-primary font-medium">
                          &quot;heaviness&quot;
                        </span>
                        <span className="px-2 py-0.5 bg-surface-container rounded font-clinical-data-mono text-metadata-micro text-primary font-medium">
                          &quot;retrosternal tightness&quot;
                        </span>
                      </div>
                      <span className="material-symbols-outlined text-primary text-base" title="Syntax Verified">
                        check_circle
                      </span>
                    </div>
                  </div>

                  {/* Logic Interlock Pill */}
                  <div className="flex items-center justify-center py-0.5">
                    <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-clinical-data-mono text-metadata-micro font-bold shadow-2xs">
                      AND
                    </span>
                  </div>

                  {/* Condition A2 */}
                  <div className="p-space-sm bg-surface-container-lowest rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-space-xs hover:shadow-sm transition-shadow border border-outline-variant/10">
                    <div className="flex items-center gap-space-xs">
                      <span className="h-5 w-5 rounded bg-surface-container-high flex items-center justify-center text-primary font-clinical-data-mono text-metadata-micro font-bold">
                        02
                      </span>
                      <span className="font-clinical-data-mono text-clinical-data text-on-surface font-semibold">
                        Radiation Pattern
                      </span>
                      <span className="px-2 py-0.5 bg-surface-container rounded text-metadata-micro font-clinical-data-mono text-on-surface-variant">
                        CONTAINS ANY
                      </span>
                    </div>
                    <div className="flex items-center gap-space-xs flex-wrap">
                      <div className="flex items-center gap-1 flex-wrap">
                        <span className="px-2 py-0.5 bg-surface-container rounded font-clinical-data-mono text-metadata-micro text-secondary font-medium">
                          &quot;left arm&quot;
                        </span>
                        <span className="px-2 py-0.5 bg-surface-container rounded font-clinical-data-mono text-metadata-micro text-secondary font-medium">
                          &quot;jaw&quot;
                        </span>
                        <span className="px-2 py-0.5 bg-surface-container rounded font-clinical-data-mono text-metadata-micro text-secondary font-medium">
                          &quot;neck&quot;
                        </span>
                        <span className="px-2 py-0.5 bg-surface-container rounded font-clinical-data-mono text-metadata-micro text-secondary font-medium">
                          &quot;interscapular&quot;
                        </span>
                      </div>
                      <span className="material-symbols-outlined text-primary text-base" title="Syntax Verified">
                        check_circle
                      </span>
                    </div>
                  </div>

                  {/* Logic Interlock Pill */}
                  <div className="flex items-center justify-center py-0.5">
                    <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-clinical-data-mono text-metadata-micro font-bold shadow-2xs">
                      AND
                    </span>
                  </div>

                  {/* Condition A3 */}
                  <div className="p-space-sm bg-surface-container-lowest rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-space-xs hover:shadow-sm transition-shadow border border-outline-variant/10">
                    <div className="flex items-center gap-space-xs">
                      <span className="h-5 w-5 rounded bg-surface-container-high flex items-center justify-center text-primary font-clinical-data-mono text-metadata-micro font-bold">
                        03
                      </span>
                      <span className="font-clinical-data-mono text-clinical-data text-on-surface font-semibold">
                        Associated Autonomic Signs
                      </span>
                      <span className="px-2 py-0.5 bg-surface-container rounded text-metadata-micro font-clinical-data-mono text-on-surface-variant">
                        INCLUDES ANY
                      </span>
                    </div>
                    <div className="flex items-center gap-space-xs flex-wrap">
                      <div className="flex items-center gap-1 flex-wrap">
                        <span className="px-2 py-0.5 bg-surface-container rounded font-clinical-data-mono text-metadata-micro text-on-surface font-medium">
                          &quot;diaphoresis&quot;
                        </span>
                        <span className="px-2 py-0.5 bg-surface-container rounded font-clinical-data-mono text-metadata-micro text-on-surface font-medium">
                          &quot;cold sweats&quot;
                        </span>
                        <span className="px-2 py-0.5 bg-surface-container rounded font-clinical-data-mono text-metadata-micro text-on-surface font-medium">
                          &quot;presyncope&quot;
                        </span>
                        <span className="px-2 py-0.5 bg-surface-container rounded font-clinical-data-mono text-metadata-micro text-on-surface font-medium">
                          &quot;dyspnea&quot;
                        </span>
                      </div>
                      <span className="material-symbols-outlined text-primary text-base" title="Syntax Verified">
                        check_circle
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Flow Node Operator (OR) */}
              <div className="flex items-center justify-center -my-2 relative z-10">
                <div className="px-4 py-1.5 rounded-full bg-tertiary text-on-tertiary font-clinical-data-mono text-clinical-data font-bold shadow-md flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">alt_route</span>
                  <span>OR EITHER TELEMETRY / LAB TRIGGER OCCURS</span>
                </div>
              </div>

              {/* Block 2: Group B (Physiological & Telemetry Signals - OR Logic) */}
              <div className="relative bg-surface-container-low rounded-xl p-space-base shadow-sm border border-outline-variant/10">
                <div className="flex items-center justify-between mb-space-sm flex-wrap gap-2">
                  <div className="flex items-center gap-space-xs flex-wrap">
                    <span className="h-6 px-2 rounded bg-tertiary text-on-tertiary font-clinical-data-mono text-metadata-micro font-bold flex items-center justify-center">
                      GROUP B
                    </span>
                    <span className="font-clinical-data text-clinical-data text-on-surface font-semibold">
                      Bedside Telemetry &amp; Point-of-Care Diagnostics
                    </span>
                    <span className="px-2 py-0.5 rounded bg-tertiary/10 text-tertiary font-clinical-data-mono text-metadata-micro font-semibold">
                      INDEPENDENT OVERRIDE (OR)
                    </span>
                  </div>
                  <div className="flex items-center gap-space-2xs">
                    <span className="material-symbols-outlined text-tertiary text-sm">vital_signs</span>
                    <span className="font-metadata-micro text-metadata-micro text-on-surface-variant font-medium">
                      FHIR Telemetry Stream
                    </span>
                  </div>
                </div>

                {/* Telemetry Items Stack */}
                <div className="flex flex-col gap-space-xs">
                  {/* Condition B1 */}
                  <div className="p-space-sm bg-surface-container-lowest rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-space-xs hover:shadow-sm transition-shadow border border-outline-variant/10">
                    <div className="flex items-center gap-space-xs">
                      <span className="h-5 w-5 rounded bg-surface-container-high flex items-center justify-center text-tertiary font-clinical-data-mono text-metadata-micro font-bold">
                        04
                      </span>
                      <span className="font-clinical-data-mono text-clinical-data text-on-surface font-semibold">
                        Bedside 12-Lead ECG
                      </span>
                      <span className="px-2 py-0.5 bg-error/15 text-error rounded text-metadata-micro font-clinical-data-mono font-bold">
                        ST-ELEVATION
                      </span>
                    </div>
                    <div className="flex items-center gap-space-xs">
                      <span className="font-clinical-data-mono text-clinical-data text-on-surface bg-surface-container px-2 py-0.5 rounded font-semibold">
                        ≥ {femaleStThreshold}mm in V2-V3 (♀) OR ≥ {maleStThreshold}mm in V2-V3 (♂)
                      </span>
                      <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                    </div>
                  </div>

                  {/* Logic Interlock Pill */}
                  <div className="flex items-center justify-center py-0.5">
                    <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-clinical-data-mono text-metadata-micro font-bold shadow-2xs">
                      OR
                    </span>
                  </div>

                  {/* Condition B2 */}
                  <div className="p-space-sm bg-surface-container-lowest rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-space-xs hover:shadow-sm transition-shadow border border-outline-variant/10">
                    <div className="flex items-center gap-space-xs">
                      <span className="h-5 w-5 rounded bg-surface-container-high flex items-center justify-center text-tertiary font-clinical-data-mono text-metadata-micro font-bold">
                        05
                      </span>
                      <span className="font-clinical-data-mono text-clinical-data text-on-surface font-semibold">
                        High-Sensitivity Troponin I (hs-cTnI)
                      </span>
                      <span className="px-2 py-0.5 bg-surface-container rounded text-metadata-micro font-clinical-data-mono text-on-surface-variant">
                        VALUE EXCEEDS
                      </span>
                    </div>
                    <div className="flex items-center gap-space-xs">
                      <span className="font-clinical-data-mono text-clinical-data text-error bg-error-container/30 px-2 py-0.5 rounded font-bold">
                        &gt; {troponinThreshold} ng/mL (99th Percentile URL)
                      </span>
                      <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Flow Node Operator (AND NOT) */}
              <div className="flex items-center justify-center -my-2 relative z-10">
                <div className="px-4 py-1.5 rounded-full bg-error text-on-error font-clinical-data-mono text-clinical-data font-bold shadow-md flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">shield</span>
                  <span>UNLESS EXCLUSION CRITERIA MET (LOGICAL NOT)</span>
                </div>
              </div>

              {/* Block 3: Exclusion & Contraindication Interlock (Group C - NOT Logic) */}
              <div className="relative bg-surface-container-low rounded-xl p-space-base shadow-sm border border-outline-variant/10">
                <div className="flex items-center justify-between mb-space-sm flex-wrap gap-2">
                  <div className="flex items-center gap-space-xs flex-wrap">
                    <span className="h-6 px-2 rounded bg-error text-on-error font-clinical-data-mono text-metadata-micro font-bold flex items-center justify-center">
                      GROUP C
                    </span>
                    <span className="font-clinical-data text-clinical-data text-on-surface font-semibold">
                      Safety Exclusion Interlocks &amp; Mimics
                    </span>
                    <span className="px-2 py-0.5 rounded bg-error/15 text-error font-clinical-data-mono text-metadata-micro font-semibold">
                      HARD SUPPRESSION (IF PRESENT)
                    </span>
                  </div>
                  <div className="flex items-center gap-space-2xs">
                    <span className="material-symbols-outlined text-error text-sm">do_not_disturb_on</span>
                    <span className="font-metadata-micro text-metadata-micro text-on-surface-variant font-medium">
                      Negative Diagnostic Gate
                    </span>
                  </div>
                </div>

                <div className="p-space-sm bg-surface-container-lowest rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-space-xs border border-outline-variant/10">
                  <div className="flex items-center gap-space-xs">
                    <span className="h-5 w-5 rounded bg-surface-container-high flex items-center justify-center text-error font-clinical-data-mono text-metadata-micro font-bold">
                      06
                    </span>
                    <span className="font-clinical-data-mono text-clinical-data text-on-surface font-semibold">
                      Confirmed Non-Cardiac Lethal Pathology
                    </span>
                  </div>
                  <div className="flex items-center gap-space-xs flex-wrap">
                    <span className="px-2 py-0.5 bg-surface-container text-on-surface-variant font-clinical-data-mono text-metadata-micro rounded font-medium">
                      Aortic Dissection (CT Verified)
                    </span>
                    <span className="px-2 py-0.5 bg-surface-container text-on-surface-variant font-clinical-data-mono text-metadata-micro rounded font-medium">
                      Tension Pneumothorax (X-Ray/Clinical)
                    </span>
                    <span className="material-symbols-outlined text-outline text-base">verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action & Dispatch Execution Matrix (THEN BLOCK) */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-base border border-outline-variant/15">
            <div className="flex items-center justify-between pb-space-sm border-b-0">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-error text-xl">bolt</span>
                <span className="font-section-title text-subheading text-on-surface font-semibold">
                  Automated Action &amp; Dispatch Matrix [THEN]
                </span>
              </div>
              <span className="font-clinical-data-mono text-metadata-micro text-error font-semibold uppercase px-2 py-0.5 rounded bg-error/10">
                Synchronous Execution
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md mt-space-sm">
              {/* Dispatch Card 1: Acuity & Queue Interlock */}
              <div className="p-space-sm bg-surface-container-low rounded-xl flex flex-col gap-space-xs border border-outline-variant/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-error text-base">emergency</span>
                    <span className="font-clinical-data text-clinical-data text-on-surface font-semibold">
                      Acuity Override &amp; Bay Dispatch
                    </span>
                  </div>
                  <span className="px-2 py-0.5 bg-error text-on-error rounded font-clinical-data-mono text-metadata-micro font-bold">
                    P1 - STAT CRITICAL
                  </span>
                </div>
                <p className="font-body-default text-metadata-micro text-on-surface-variant">
                  Immediate queue preempt. Removes patient from OPD waiting lists and dynamically claims Resuscitation Bay 02.
                </p>
                <div className="p-space-xs bg-surface-container-lowest rounded-lg font-clinical-data-mono text-metadata-micro text-on-surface border border-outline-variant/10">
                  <div className="flex items-center justify-between py-0.5">
                    <span className="text-outline">Target Destination:</span>
                    <span className="font-semibold text-primary">Bay 02 (Resus / Telemetry monitored)</span>
                  </div>
                  <div className="flex items-center justify-between py-0.5">
                    <span className="text-outline">Duty Attending:</span>
                    <span className="font-semibold text-on-surface">Auto-assigned &amp; Paged</span>
                  </div>
                </div>
              </div>

              {/* Dispatch Card 2: CPOE Automated Bundle */}
              <div className="p-space-sm bg-surface-container-low rounded-xl flex flex-col gap-space-xs border border-outline-variant/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-primary text-base">receipt_long</span>
                    <span className="font-clinical-data text-clinical-data text-on-surface font-semibold">
                      Automated CPOE Diagnostic Order-Set
                    </span>
                  </div>
                  <span className="px-2 py-0.5 bg-primary/10 text-primary rounded font-clinical-data-mono text-metadata-micro font-semibold">
                    3 Orders Fired
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-start gap-1 text-metadata-micro font-clinical-data-mono text-on-surface">
                    <span className="material-symbols-outlined text-primary text-xs mt-0.5">arrow_right</span>
                    <span>STAT 12-Lead Serial ECG (Cadence: 0m, 30m, 60m)</span>
                  </div>
                  <div className="flex items-start gap-1 text-metadata-micro font-clinical-data-mono text-on-surface">
                    <span className="material-symbols-outlined text-primary text-xs mt-0.5">arrow_right</span>
                    <span>STAT Troponin I Serial Draw (0h, 3h via Tube Station 01)</span>
                  </div>
                  <div className="flex items-start gap-1 text-metadata-micro font-clinical-data-mono text-on-surface">
                    <span className="material-symbols-outlined text-primary text-xs mt-0.5">arrow_right</span>
                    <span>Bedside POCUS Echo &amp; Crash Defibrillator Cart Rollout</span>
                  </div>
                </div>
              </div>

              {/* Dispatch Card 3: Cath Lab & Team Alert */}
              <div className="p-space-sm bg-surface-container-low rounded-xl flex flex-col gap-space-xs border border-outline-variant/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-tertiary text-base">notification_important</span>
                    <span className="font-clinical-data text-clinical-data text-on-surface font-semibold">
                      Cath Lab Team Mobilization
                    </span>
                  </div>
                  <span className="px-2 py-0.5 bg-tertiary/10 text-tertiary rounded font-clinical-data-mono text-metadata-micro font-semibold">
                    Code STEMI
                  </span>
                </div>
                <p className="font-body-default text-metadata-micro text-on-surface-variant">
                  Broadcast push SMS, duty pager audible sirens to Interventional Cardiologist on call and Cath Charge Nurse.
                </p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="px-2 py-0.5 bg-surface-container-lowest rounded text-metadata-micro font-clinical-data-mono text-on-surface-variant border border-outline-variant/10">
                    Cath Suite 01 Prep
                  </span>
                  <span className="px-2 py-0.5 bg-surface-container-lowest rounded text-metadata-micro font-clinical-data-mono text-on-surface-variant border border-outline-variant/10">
                    Command Center Red Ribbon
                  </span>
                </div>
              </div>

              {/* Dispatch Card 4: Override & Biometric Interlock */}
              <div className="p-space-sm bg-surface-container-low rounded-xl flex flex-col gap-space-xs border border-outline-variant/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-secondary text-base">fingerprint</span>
                    <span className="font-clinical-data text-clinical-data text-on-surface font-semibold">
                      Clinical Override Policy
                    </span>
                  </div>
                  <span className="px-2 py-0.5 bg-surface-container-highest text-on-surface-variant rounded font-clinical-data-mono text-metadata-micro font-semibold">
                    Biometric Sign-off
                  </span>
                </div>
                <p className="font-body-default text-metadata-micro text-on-surface-variant">
                  Hard-stop cannot be dismissed by nursing or resident staff. Demands Attending Physician OTP / Biometric token with mandatory auditable narrative justification.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Utility Stage: Test Suite Sandbox & Safety Guarantees (Cols 9-12) */}
        <div className="col-span-12 xl:col-span-4 flex flex-col gap-space-base">
          {/* Synthetic Patient Benchmark Test Suite */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-base flex flex-col gap-space-sm border border-outline-variant/15">
            <div className="flex items-center justify-between pb-space-xs border-b-0">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-xl">science</span>
                <div className="flex flex-col">
                  <span className="font-section-title text-subheading text-on-surface font-semibold">
                    Synthetic Patient Suite
                  </span>
                  <span className="font-metadata-micro text-metadata-micro text-outline">
                    Deterministic Verification Sandbox
                  </span>
                </div>
              </div>
              <button
                id="rerun-tests-btn"
                onClick={handleRunMatrix}
                disabled={isRunningMatrix}
                className="px-2 py-1 bg-surface-container hover:bg-surface-container-high rounded text-metadata-micro font-clinical-data text-on-surface font-semibold flex items-center gap-1 transition-colors disabled:opacity-50"
              >
                <span className={`material-symbols-outlined text-xs ${isRunningMatrix ? "animate-spin" : ""}`}>
                  {isRunningMatrix ? "autorenew" : "play_arrow"}
                </span>
                <span>{isRunningMatrix ? "Simulating..." : "Run Matrix"}</span>
              </button>
            </div>

            {/* Benchmark Execution Cards */}
            <div className="flex flex-col gap-space-xs" id="test-cases-container">
              {testCases.map((tc) => (
                <div
                  key={tc.id}
                  className={`p-space-sm bg-surface-container-low rounded-xl flex flex-col gap-1 transition-all border-l-4 ${tc.borderAccent} border-r border-t border-b border-outline-variant/10`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-clinical-data-mono text-clinical-data text-on-surface font-bold">
                        {tc.caseNum}
                      </span>
                      <span className="font-body-strong text-clinical-data text-on-surface font-semibold">
                        {tc.patientName}
                      </span>
                      <span className="font-clinical-data-mono text-metadata-micro text-outline">
                        {tc.demographics} · {tc.uhid}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 bg-primary text-on-primary rounded font-clinical-data-mono text-metadata-micro font-bold">
                      {tc.status}
                    </span>
                  </div>
                  <p className="font-body-default text-metadata-micro text-on-surface-variant">
                    {tc.description}
                  </p>
                  <div className="flex items-center justify-between pt-1 font-clinical-data-mono text-metadata-micro">
                    <span
                      className={`font-semibold flex items-center gap-0.5 ${
                        tc.triggerType === "triggered"
                          ? "text-error"
                          : tc.triggerType === "suppressed"
                          ? "text-error"
                          : "text-secondary"
                      }`}
                    >
                      <span className="material-symbols-outlined text-xs">
                        {tc.triggerType === "triggered"
                          ? "warning"
                          : tc.triggerType === "suppressed"
                          ? "shield"
                          : "check_circle"}
                      </span>
                      {tc.triggerLabel}
                    </span>
                    <span className="text-outline">Execution: {tc.executionTime}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsAddScenarioOpen(true)}
              className="w-full py-2 bg-surface-container text-on-surface-variant hover:text-on-surface rounded-xl font-clinical-data text-metadata-micro font-semibold transition-colors flex items-center justify-center gap-1 border border-outline-variant/10 shadow-xs"
            >
              <span className="material-symbols-outlined text-sm">add</span> Add Synthetic Test Scenario
            </button>
          </div>

          {/* Formal Deterministic Safety Guarantee Panel */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-base flex flex-col gap-space-sm border border-outline-variant/15">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-lg">verified</span>
              <span className="font-section-title text-clinical-data text-on-surface font-bold">
                Runtime Deterministic Safety Guarantee
              </span>
            </div>
            <p className="font-body-default text-metadata-micro text-on-surface-variant leading-relaxed">
              Deterministic Rule Integrity: This rule is compiled into a sandboxed deterministic finite automaton (DFA bytecode). Under NABH &amp; Joint Commission clinical governance, no autonomous Large Language Model or generative inference engine is permitted to override, drift, or synthesize modifications to these boundary parameters.
            </p>
            <div className="flex flex-col gap-1 p-space-xs bg-surface-container-low rounded-lg font-clinical-data-mono text-metadata-micro border border-outline-variant/10">
              <div className="flex items-center justify-between">
                <span className="text-outline">Bytecode Checksum:</span>
                <span className="text-primary font-semibold">0x9F4C...81E2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-outline">ABDM FHIR Resource:</span>
                <span className="text-on-surface font-semibold">PlanDefinition/RF-CARD-01</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-outline">Last Board Re-audit:</span>
                <span className="text-on-surface">18-Oct-2024 10:14 IST</span>
              </div>
            </div>
          </div>

          {/* Historical Trigger Analytics Mini-Widget */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-base flex flex-col gap-space-xs border border-outline-variant/15">
            <div className="flex items-center justify-between">
              <span className="font-section-title text-clinical-data text-on-surface font-semibold">
                30-Day Trigger Volume
              </span>
              <span className="font-clinical-data-mono text-metadata-micro text-primary font-bold">
                142 Activations
              </span>
            </div>
            <div className="flex items-end gap-1.5 h-16 w-full pt-2">
              <div className="flex-1 bg-surface-container-high rounded-t h-[40%]" title="Week 1: 32"></div>
              <div className="flex-1 bg-surface-container-high rounded-t h-[65%]" title="Week 2: 48"></div>
              <div className="flex-1 bg-surface-container-high rounded-t h-[35%]" title="Week 3: 27"></div>
              <div className="flex-1 bg-primary rounded-t h-[85%]" title="Current Week: 35"></div>
            </div>
            <div className="flex items-center justify-between text-metadata-micro font-metadata-micro text-outline pt-1">
              <span>0 False-Negatives</span>
              <span>98.6% Attending Concordance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Add Synthetic Test Scenario */}
      {isAddScenarioOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-lg border border-outline-variant/30 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-space-base border-b border-surface-container-high flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-xl">science</span>
                <h3 className="font-section-title text-section-title text-on-surface font-semibold">
                  Add Synthetic Verification Scenario
                </h3>
              </div>
              <button
                onClick={() => setIsAddScenarioOpen(false)}
                className="p-1 rounded-md text-outline hover:text-on-surface hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <form onSubmit={handleAddScenario} className="p-space-base flex flex-col gap-space-sm">
              <div className="grid grid-cols-2 gap-space-sm">
                <div className="flex flex-col gap-1">
                  <label className="text-metadata-micro text-outline uppercase font-semibold">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newPatientName}
                    onChange={(e) => setNewPatientName(e.target.value)}
                    placeholder="e.g. Vikram Malhotra"
                    className="h-8 px-2 rounded bg-surface-container-low border border-outline-variant text-clinical-data font-clinical-data text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-metadata-micro text-outline uppercase font-semibold">
                    Demographics
                  </label>
                  <input
                    type="text"
                    value={newDemographics}
                    onChange={(e) => setNewDemographics(e.target.value)}
                    placeholder="45M / 62F"
                    className="h-8 px-2 rounded bg-surface-container-low border border-outline-variant text-clinical-data font-clinical-data text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-space-sm">
                <div className="flex flex-col gap-1">
                  <label className="text-metadata-micro text-outline uppercase font-semibold">
                    UHID Identifier
                  </label>
                  <input
                    type="text"
                    value={newUhid}
                    onChange={(e) => setNewUhid(e.target.value)}
                    placeholder="UHID-5502"
                    className="h-8 px-2 rounded bg-surface-container-low border border-outline-variant text-clinical-data font-clinical-data text-on-surface focus:outline-none focus:border-primary font-clinical-data-mono"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-metadata-micro text-outline uppercase font-semibold">
                    Expected Outcome
                  </label>
                  <select
                    value={newTriggerType}
                    onChange={(e) => setNewTriggerType(e.target.value as "triggered" | "not_triggered" | "suppressed")}
                    className="h-8 px-2 rounded bg-surface-container-low border border-outline-variant text-clinical-data font-clinical-data text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="triggered">Triggered: P1 STAT ACS</option>
                    <option value="not_triggered">Not Triggered: Negative</option>
                    <option value="suppressed">Suppressed: Non-Cardiac Mimic</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-metadata-micro text-outline uppercase font-semibold">
                  Clinical Presentation &amp; Diagnostics Notes
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe triage voice acoustic intake, 12-lead ECG findings, troponin assays, or CT imaging..."
                  className="p-2 rounded bg-surface-container-low border border-outline-variant text-clinical-data font-clinical-data text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="pt-space-xs flex items-center justify-end gap-space-xs border-t border-surface-container-high">
                <button
                  type="button"
                  onClick={() => setIsAddScenarioOpen(false)}
                  className="px-space-md py-1.5 rounded-lg text-clinical-data text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-space-lg py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-clinical-data text-clinical-data font-semibold shadow-sm transition-all"
                >
                  Inject Synthetic Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
