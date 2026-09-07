"use client";

import React, { useState } from "react";
import Link from "next/link";

interface ProtocolPipelineStep {
  label: string;
  icon: string;
  badge: string;
  badgeStyle: string;
}

interface Protocol {
  id: string;
  code: string;
  version: string;
  category: string;
  title: string;
  owner: string;
  status: "ACTIVE · ENFORCED" | "HARD-STOP LOCK" | "UNDER BOARD REVIEW" | "DRAFT REVISION";
  statusStyle: string;
  codeBadgeStyle: string;
  interlockType: "Deterministic Interlocks" | "Zero AI / Single-User Override" | "Dual Mapping Logic";
  interlockDesc: string;
  isHardStop?: boolean;
  council: string;
  evidence: string;
  changelogRecent: string;
  triggersPerMo: string;
  runtimeMs: string;
  pipelineSteps: ProtocolPipelineStep[];
  evidenceDetails: {
    title: string;
    description: string;
  }[];
  versionHistory: {
    version: string;
    date: string;
    isCurrent?: boolean;
    description: string;
  }[];
  past24h: {
    invocations: string;
    bypasses: string;
    avgMetricLabel: string;
    avgMetricValue: string;
  };
}

const PROTOCOLS: Protocol[] = [
  {
    id: "PROTO-CV-01",
    code: "PROTO-CV-01",
    version: "v3.2",
    category: "Cardiovascular & STEMI",
    title: "ACS & Code STEMI Fast-Track Pathway",
    owner: "Dr. Rohit Verma, MD, DM (Chief of Clinical Services)",
    status: "ACTIVE · ENFORCED",
    statusStyle: "bg-primary text-on-primary",
    codeBadgeStyle: "bg-surface-container-low text-primary",
    interlockType: "Deterministic Interlocks",
    interlockDesc: "Mandatory 12-lead ECG <10m, Dual Antiplatelet STAT loading, Cath Lab activation bypass for Triage P1.",
    council: "Apollo Clinical Governance Board · Effective to Aug 2025",
    evidence: "ACC/AHA 2024 STEMI Door-to-Balloon <90m Guidelines",
    changelogRecent: "v3.2: Added Ticagrelor gastric intolerance co-prescription check",
    triggersPerMo: "142 Triggers / mo",
    runtimeMs: "1.2ms",
    pipelineSteps: [
      {
        label: "Trigger: Chief Complaint Chest Pain / Triage P1",
        icon: "sensors",
        badge: "PASS",
        badgeStyle: "text-primary font-bold",
      },
      {
        label: "Interlock: ECG acquisition <10 min timestamp",
        icon: "timer",
        badge: "STAT",
        badgeStyle: "text-primary font-bold",
      },
      {
        label: "Loading: Aspirin 325mg + Ticagrelor 180mg",
        icon: "medication",
        badge: "ORDER SET",
        badgeStyle: "text-secondary font-bold",
      },
      {
        label: "Action: Cath Lab On-Call Paging + D-t-B Clock",
        icon: "notification_important",
        badge: "ACTIVE",
        badgeStyle: "font-bold text-on-primary-container",
      },
    ],
    evidenceDetails: [
      {
        title: "ACC/AHA Joint Guidelines 2024",
        description:
          "Class I, Level of Evidence A: Primary PCI within 90 minutes of medical contact for STEMI presentations.",
      },
      {
        title: "Apollo Clinical Audit Board Standard",
        description:
          "Mandates continuous automated audit logging with monthly adverse variance reports sent to Chief of Medical Staff.",
      },
    ],
    versionHistory: [
      {
        version: "v3.2",
        date: "14-Aug-2024",
        isCurrent: true,
        description:
          "Approved by Clinical Ethics & Safety Council. Added buffered Aspirin formulation exception for documented mild gastritis.",
      },
      {
        version: "v3.1",
        date: "02-Jul-2024",
        description:
          "Tightened door-to-balloon target from 90m to 60m in-house. Added auto-notification trigger to telemetry nursing lead.",
      },
      {
        version: "v3.0",
        date: "12-Jan-2024",
        description:
          "Initial migration to FHIR PlanDefinition v4.0 schema. Dual antiplatelet order-set modernized to Ticagrelor first-line.",
      },
    ],
    past24h: {
      invocations: "14",
      bypasses: "0",
      avgMetricLabel: "Avg D-t-B",
      avgMetricValue: "48m",
    },
  },
  {
    id: "PROTO-CC-04",
    code: "PROTO-CC-04",
    version: "v2.8",
    category: "Sepsis & Critical Care",
    title: "Adult Sepsis & Septic Shock Bundle",
    owner: "Dr. Sameer Kulkarni, MD (Critical Care Dir.)",
    status: "ACTIVE · ENFORCED",
    statusStyle: "bg-primary text-on-primary",
    codeBadgeStyle: "bg-surface-container-low text-primary",
    interlockType: "Deterministic Interlocks",
    interlockDesc: "Hour-1 Bundle: Serum Lactate >2 mmol/L triggers auto-blood cultures prior to broad-spectrum IV bolus.",
    council: "Surviving Sepsis Campaign (SSC) 2023 · Hospital Critical Care Board",
    evidence: "30 mL/kg crystalloid for MAP <65 mmHg or Lactate ≥4.0",
    changelogRecent: "v2.8: Integrated Norepinephrine peripheral line 2h bridge safety rule",
    triggersPerMo: "218 Triggers / mo",
    runtimeMs: "0.8ms",
    pipelineSteps: [
      {
        label: "Trigger: qSOFA ≥2 or SIRS Criteria Triggered",
        icon: "warning",
        badge: "PASS",
        badgeStyle: "text-primary font-bold",
      },
      {
        label: "Interlock: Blood Cultures x2 Prior to IV Antibiotics",
        icon: "science",
        badge: "HARD-LOCK",
        badgeStyle: "text-error font-bold",
      },
      {
        label: "Resuscitation: Balanced Crystalloid 30 mL/kg IV STAT",
        icon: "water_drop",
        badge: "ORDER SET",
        badgeStyle: "text-secondary font-bold",
      },
      {
        label: "Action: ICU Vasopressor Line Prep if MAP <65 mmHg",
        icon: "hotel",
        badge: "STANDBY",
        badgeStyle: "font-bold text-on-primary-container",
      },
    ],
    evidenceDetails: [
      {
        title: "Surviving Sepsis Campaign (SSC) 2023 Guidelines",
        description:
          "Strong recommendation: Measure lactate level, obtain blood cultures before administering antibiotics, administer broad-spectrum antibiotics within 1 hour.",
      },
      {
        title: "NABH Clinical Care Standard CC-4",
        description:
          "Zero-tolerance policy on antibiotic administration prior to blood culture sample barcode verification.",
      },
    ],
    versionHistory: [
      {
        version: "v2.8",
        date: "20-Sep-2024",
        isCurrent: true,
        description:
          "Integrated Norepinephrine peripheral line 2h bridge safety rule while central venous catheter access is secured.",
      },
      {
        version: "v2.5",
        date: "05-May-2024",
        description:
          "Updated crystalloid choice to balanced electrolyte solution (Plasmalyte-A) over normal saline to decrease hyperchloremic acidosis.",
      },
    ],
    past24h: {
      invocations: "18",
      bypasses: "0",
      avgMetricLabel: "Avg Lactate TAT",
      avgMetricValue: "18m",
    },
  },
  {
    id: "PROTO-NR-02",
    code: "PROTO-NR-02",
    version: "v3.0",
    category: "Stroke & Neuro",
    title: "Acute Ischemic Stroke & Thrombolysis",
    owner: "Dr. Anjali Nair, DM (Head of Neurology)",
    status: "ACTIVE · ENFORCED",
    statusStyle: "bg-primary text-on-primary",
    codeBadgeStyle: "bg-surface-container-low text-primary",
    interlockType: "Deterministic Interlocks",
    interlockDesc: "LKW Window <4.5h, Immediate Non-contrast Head CT exclusion of hemorrhage, Tenecteplase 0.25 mg/kg.",
    council: "AHA/ASA 2023 Guidelines for Early Management of Ischemic Stroke",
    evidence: "BP systolic <185 mmHg target pre-thrombolytic gate",
    changelogRecent: "v3.0: Transitioned primary IV lytic preference to Tenecteplase single bolus",
    triggersPerMo: "58 Triggers / mo",
    runtimeMs: "1.4ms",
    pipelineSteps: [
      {
        label: "Trigger: FAST+ Positive / LKW <4.5 Hours",
        icon: "neurology",
        badge: "PASS",
        badgeStyle: "text-primary font-bold",
      },
      {
        label: "Interlock: Non-Contrast CT Brain Head Gatekeeper",
        icon: "radiology",
        badge: "NO BLEED",
        badgeStyle: "text-primary font-bold",
      },
      {
        label: "Hemodynamic Gate: Systolic BP < 185 mmHg Target",
        icon: "vital_signs",
        badge: "CHECKED",
        badgeStyle: "text-secondary font-bold",
      },
      {
        label: "Action: IV Tenecteplase 0.25 mg/kg Single Bolus",
        icon: "syringe",
        badge: "AUTHORIZED",
        badgeStyle: "font-bold text-on-primary-container",
      },
    ],
    evidenceDetails: [
      {
        title: "AHA/ASA Stroke Thrombolysis Guidelines 2023",
        description:
          "Tenecteplase is recommended as an alternative to alteplase for eligible patients with acute ischemic stroke who meet IV thrombolysis criteria.",
      },
    ],
    versionHistory: [
      {
        version: "v3.0",
        date: "01-Jul-2024",
        isCurrent: true,
        description: "Transitioned primary IV lytic preference to Tenecteplase single bolus for enhanced door-to-needle velocity.",
      },
    ],
    past24h: {
      invocations: "6",
      bypasses: "0",
      avgMetricLabel: "Door-to-Needle",
      avgMetricValue: "34m",
    },
  },
  {
    id: "RULE-SAFE-01",
    code: "RULE-SAFE-01",
    version: "v4.1",
    category: "Allergy Hard-Stops",
    title: "Beta-Lactam Anaphylaxis Hard-Stop Interlock",
    owner: "Pharmacy & Therapeutics Safety Committee",
    status: "HARD-STOP LOCK",
    statusStyle: "bg-error text-on-error",
    codeBadgeStyle: "bg-error-container text-on-error-container",
    interlockType: "Zero AI / Single-User Override",
    interlockDesc: "Hard-stops dispensing of Penicillins, Carbapenems, & 1st-Gen Cephalosporins without dual-MD biometric override.",
    isHardStop: true,
    council: "EAACI / ISMP Drug Allergy Hard-Stop Protocols · Mandate 2024",
    evidence: "Pharmacopeia Cross-Reactivity Ontology v6.2",
    changelogRecent: "v4.1: Extended to cover synthetic Penem precursors & oral dry suspensions",
    triggersPerMo: "411 Interventions / mo",
    runtimeMs: "0.4ms",
    pipelineSteps: [
      {
        label: "Ingestion: CPOE Prescribing Rx Event",
        icon: "prescriptions",
        badge: "INGEST",
        badgeStyle: "text-primary font-bold",
      },
      {
        label: "Cross-Reference: EHR Allergy Registry (SNOMED: 91936005)",
        icon: "security",
        badge: "MATCH",
        badgeStyle: "text-error font-bold",
      },
      {
        label: "Safety Gate: Hard-Stop Pharmacy Dispense Lock",
        icon: "block",
        badge: "LOCKED",
        badgeStyle: "text-error font-bold",
      },
      {
        label: "Resolution: Dual Biometric Attending MD Override",
        icon: "fingerprint",
        badge: "DUAL-KEY",
        badgeStyle: "font-bold text-on-primary-container",
      },
    ],
    evidenceDetails: [
      {
        title: "ISMP High-Alert Medication Safety Standard 2024",
        description:
          "Absolute electronic hard-stops on severe anaphylaxis histories; AI clinical draft assistants are strictly prohibited from dismissing allergy locks.",
      },
    ],
    versionHistory: [
      {
        version: "v4.1",
        date: "10-Aug-2024",
        isCurrent: true,
        description: "Extended to cover synthetic Penem precursors and pediatric dry oral suspensions.",
      },
    ],
    past24h: {
      invocations: "38",
      bypasses: "0",
      avgMetricLabel: "Prevented Reactions",
      avgMetricValue: "38 / 38",
    },
  },
  {
    id: "PROTO-RAD-07",
    code: "PROTO-RAD-07",
    version: "v2.4",
    category: "Pharmacotherapy",
    title: "Contrast Induced AKI & Metformin Hold",
    owner: "Dr. S. Kulkarni & Radiology Safety",
    status: "ACTIVE · ENFORCED",
    statusStyle: "bg-primary text-on-primary",
    codeBadgeStyle: "bg-surface-container-low text-primary",
    interlockType: "Deterministic Interlocks",
    interlockDesc: "Mandatory 48h pre/post Metformin suspension for eGFR <60 or arterial contrast injection to prevent lactic acidosis.",
    council: "ESUR Guidelines on Contrast Media v10.0",
    evidence: "ESUR Guidelines on Contrast Media v10.0",
    changelogRecent: "v2.4: Auto-hydration order-set trigger for eGFR between 30-44 mL/min",
    triggersPerMo: "97 Triggers / mo",
    runtimeMs: "0.6ms",
    pipelineSteps: [
      {
        label: "Trigger: Contrast CPOE Order Generated",
        icon: "radiology",
        badge: "PASS",
        badgeStyle: "text-primary font-bold",
      },
      {
        label: "Interlock: Check eGFR and Active Biguanide Meds",
        icon: "fact_check",
        badge: "VERIFY",
        badgeStyle: "text-primary font-bold",
      },
      {
        label: "Order-Set: Auto-Suspend Metformin x 48 Hours",
        icon: "medication_liquid",
        badge: "HOLD",
        badgeStyle: "text-secondary font-bold",
      },
      {
        label: "Action: Nurse Handover Flag & Renal Follow-up Lab",
        icon: "assignment_turned_in",
        badge: "COMMITTED",
        badgeStyle: "font-bold text-on-primary-container",
      },
    ],
    evidenceDetails: [
      {
        title: "European Society of Urogenital Radiology (ESUR)",
        description: "In patients with eGFR <30 mL/min/1.73m2 receiving IV contrast, metformin must be withheld from time of contrast administration.",
      },
    ],
    versionHistory: [
      {
        version: "v2.4",
        date: "18-Jun-2024",
        isCurrent: true,
        description: "Auto-hydration order-set trigger for eGFR between 30-44 mL/min.",
      },
    ],
    past24h: {
      invocations: "11",
      bypasses: "0",
      avgMetricLabel: "Adherence",
      avgMetricValue: "100%",
    },
  },
  {
    id: "PROTO-RES-03",
    code: "PROTO-RES-03",
    version: "v1.9",
    category: "Cardiovascular & STEMI",
    title: "Hyperkalemia Emergent Resuscitation",
    owner: "Dr. Rohit Verma & Emergency Lead",
    status: "ACTIVE · ENFORCED",
    statusStyle: "bg-primary text-on-primary",
    codeBadgeStyle: "bg-surface-container-low text-primary",
    interlockType: "Deterministic Interlocks",
    interlockDesc: "Serum K+ >6.0 mmol/L prompts 10% IV Calcium Gluconate cardioprotection + Regular Insulin 10U in 50mL D50.",
    council: "ERC / AHA Resuscitation Science Standards",
    evidence: "ERC / AHA Resuscitation Science Standards",
    changelogRecent: "v1.9: Added mandatory continuous cardiac telemetry requirement",
    triggersPerMo: "64 Triggers / mo",
    runtimeMs: "0.5ms",
    pipelineSteps: [
      {
        label: "Trigger: Chemistry Lab K+ > 6.0 mEq/L Reported",
        icon: "science",
        badge: "CRITICAL",
        badgeStyle: "text-error font-bold",
      },
      {
        label: "Cardioprotection: 10% Calcium Gluconate 10mL IV",
        icon: "heart_plus",
        badge: "STAT 5M",
        badgeStyle: "text-primary font-bold",
      },
      {
        label: "Shifting: Regular Insulin 10U + 50mL 50% Dextrose",
        icon: "medication",
        badge: "ORDER SET",
        badgeStyle: "text-secondary font-bold",
      },
      {
        label: "Action: Urgent Nephrology / Hemodialysis Pager",
        icon: "call",
        badge: "PAGED",
        badgeStyle: "font-bold text-on-primary-container",
      },
    ],
    evidenceDetails: [
      {
        title: "AHA/ERC Emergency Cardiovascular Care 2024",
        description: "Immediate membrane stabilization with calcium is required when ECG shows tented T-waves or QRS widening.",
      },
    ],
    versionHistory: [
      {
        version: "v1.9",
        date: "12-May-2024",
        isCurrent: true,
        description: "Added mandatory continuous cardiac telemetry requirement on monitor channel 01.",
      },
    ],
    past24h: {
      invocations: "4",
      bypasses: "0",
      avgMetricLabel: "Door-to-Calcium",
      avgMetricValue: "6.5m",
    },
  },
  {
    id: "PROTO-AY-02",
    code: "PROTO-AY-02",
    version: "v1.2",
    category: "Ayurveda / NAMASTE",
    title: "NAMASTE & Dual-Coding Clinical Pathway",
    owner: "AYUSH Integrative Clinical Committee",
    status: "UNDER BOARD REVIEW",
    statusStyle: "bg-secondary-container text-on-secondary-container",
    codeBadgeStyle: "bg-surface-container text-secondary",
    interlockType: "Dual Mapping Logic",
    interlockDesc: "Automatic cross-walk translation between ICD-11, SNOMED-CT, and National AYUSH Morbidity Codes (NAMASTE).",
    council: "Ministry of Ayush & ABDM India Integration Protocol Draft",
    evidence: "Ministry of Ayush & ABDM India Integration Protocol Draft",
    changelogRecent: "v1.2: Added herb-drug pharmacokinetic interaction contraindication warnings",
    triggersPerMo: "Review Stage: 3/4 Signed",
    runtimeMs: "2.1ms",
    pipelineSteps: [
      {
        label: "Ingestion: OPD Ayurvedic / Integrative Clinical Notes",
        icon: "spa",
        badge: "INTAKE",
        badgeStyle: "text-secondary font-bold",
      },
      {
        label: "Ontology Cross-Walk: NAMASTE Code → SNOMED CT Concept",
        icon: "account_tree",
        badge: "MAP",
        badgeStyle: "text-secondary font-bold",
      },
      {
        label: "Drug Safety Filter: Herbal-Pharmaceutical CYP450 Interactions",
        icon: "shield",
        badge: "VERIFIED",
        badgeStyle: "text-primary font-bold",
      },
      {
        label: "Action: ABDM FHIR DiagnosticReport Generation",
        icon: "cloud_upload",
        badge: "FHIR R4",
        badgeStyle: "font-bold text-on-primary-container",
      },
    ],
    evidenceDetails: [
      {
        title: "National Ayush Morbidity and Standardized Terminologies Electronic (NAMASTE) Portal",
        description: "Standardized dual coding protocol mandated under ABDM Milestone 3 for pan-India healthcare facility interoperability.",
      },
    ],
    versionHistory: [
      {
        version: "v1.2",
        date: "28-Aug-2024",
        isCurrent: true,
        description: "Added herb-drug pharmacokinetic interaction contraindication warnings (Ashwagandha, Guggulu).",
      },
    ],
    past24h: {
      invocations: "19",
      bypasses: "0",
      avgMetricLabel: "Mapping Accuracy",
      avgMetricValue: "99.2%",
    },
  },
  {
    id: "PROTO-NUR-11",
    code: "PROTO-NUR-11",
    version: "v3.5",
    category: "Respiratory",
    title: "Morse Scale Fall Mitigation & Bed Alarms",
    owner: "Nursing Quality & Patient Safety Board",
    status: "ACTIVE · ENFORCED",
    statusStyle: "bg-primary text-on-primary",
    codeBadgeStyle: "bg-surface-container-low text-primary",
    interlockType: "Deterministic Interlocks",
    interlockDesc: "Morse score ≥45 triggers automatic bed-exit telemetry alarm, yellow wristband dispense, and PT consult.",
    council: "NABH Standard PS-3 & Joint Commission Inpatient Safety",
    evidence: "NABH Standard PS-3 & Joint Commission Inpatient Safety",
    changelogRecent: "v3.5: Added automated nursing handover checklist sync at 07:00 & 19:00",
    triggersPerMo: "520 Triggers / mo",
    runtimeMs: "0.3ms",
    pipelineSteps: [
      {
        label: "Trigger: Nursing Intake Fall Assessment (Morse Score)",
        icon: "checklist",
        badge: "EVAL",
        badgeStyle: "text-primary font-bold",
      },
      {
        label: "Threshold Gate: Morse Score ≥ 45 Detected",
        icon: "priority_high",
        badge: "HIGH RISK",
        badgeStyle: "text-error font-bold",
      },
      {
        label: "Hardware Interlock: Smart Bed Alarm Sensor Activation",
        icon: "single_bed",
        badge: "ARMED",
        badgeStyle: "text-primary font-bold",
      },
      {
        label: "Action: Yellow ID Wristband Print + PT Consult",
        icon: "badge",
        badge: "COMMITTED",
        badgeStyle: "font-bold text-on-primary-container",
      },
    ],
    evidenceDetails: [
      {
        title: "NABH Hospital Accreditation 5th Edition (Patient Safety 3)",
        description: "Structured fall risk evaluation required within 4 hours of inpatient admission and re-evaluated post-sedation.",
      },
    ],
    versionHistory: [
      {
        version: "v3.5",
        date: "15-Jul-2024",
        isCurrent: true,
        description: "Added automated nursing handover checklist sync at 07:00 & 19:00 shifts.",
      },
    ],
    past24h: {
      invocations: "42",
      bypasses: "0",
      avgMetricLabel: "Fall Incidents",
      avgMetricValue: "0 Zero",
    },
  },
];

export default function ClinicalRulesProtocolsPage() {
  const [selectedProtocolId, setSelectedProtocolId] = useState<string>("PROTO-CV-01");
  const [activeTab, setActiveTab] = useState<string>("All Protocols (34)");

  // Modals
  const [isProposeOpen, setIsProposeOpen] = useState(false);
  const [isSimulateOpen, setIsSimulateOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationSuccess, setSimulationSuccess] = useState(false);

  // Proposal form state
  const [proposalTitle, setProposalTitle] = useState("");
  const [proposalDomain, setProposalDomain] = useState("Cardiovascular");
  const [proposalInterlock, setProposalInterlock] = useState("");

  const selectedProtocol =
    PROTOCOLS.find((p) => p.id === selectedProtocolId) || PROTOCOLS[0];

  const filteredProtocols = PROTOCOLS.filter((p) => {
    if (activeTab === "All Protocols (34)") return true;
    if (activeTab.includes("Cardiovascular") && p.category.includes("Cardio")) return true;
    if (activeTab.includes("Sepsis") && p.category.includes("Sepsis")) return true;
    if (activeTab.includes("Stroke") && p.category.includes("Stroke")) return true;
    if (activeTab.includes("Pharmacotherapy") && p.category.includes("Pharm")) return true;
    if (activeTab.includes("Allergy") && p.category.includes("Allergy")) return true;
    if (activeTab.includes("Ayurveda") && p.category.includes("Ayurveda")) return true;
    if (activeTab.includes("Respiratory") && p.category.includes("Respiratory")) return true;
    return true;
  });

  const handleRunSimulation = () => {
    setSimulationRunning(true);
    setSimulationSuccess(false);
    setTimeout(() => {
      setSimulationRunning(false);
      setSimulationSuccess(true);
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Protocol Governance Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-space-md mb-space-lg">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-space-xs mb-1 flex-wrap">
            <span className="px-2 py-0.5 rounded bg-primary text-on-primary font-clinical-data-mono text-metadata-micro tracking-wider uppercase font-semibold">
              Governance Level 4
            </span>
            <span className="text-on-surface-variant font-metadata-micro text-metadata-micro">
              · NABH 5th Ed. &amp; ABDM Compliant
            </span>
          </div>
          <h1 className="font-page-title text-page-title text-on-surface tracking-tight">
            Clinical Rules &amp; Protocols
          </h1>
          <p className="font-subheading text-subheading text-on-surface-variant">
            Hospital clinical guidelines, deterministic safety interlocks, and evidence-based clinical pathway library
          </p>
        </div>

        {/* Actions Panel */}
        <div className="flex flex-wrap items-center gap-space-xs">
          <button
            onClick={() => alert("Protocol Registry successfully exported as FHIR PlanDefinition Bundle (JSON).")}
            className="flex items-center gap-1.5 px-3 py-2 bg-surface-container-lowest text-on-surface font-clinical-data text-clinical-data rounded hover:bg-surface-container transition-colors shadow-sm border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-base text-primary">download</span>
            <span>Export Protocol Registry</span>
          </button>
          <Link
            href="/quality-audit-logs"
            className="flex items-center gap-1.5 px-3 py-2 bg-surface-container-lowest text-on-surface font-clinical-data text-clinical-data rounded hover:bg-surface-container transition-colors shadow-sm border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-base text-secondary">fact_check</span>
            <span>Audit Active Rules</span>
          </Link>
          <button
            onClick={() => setIsImportOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-surface-container text-on-surface font-clinical-data text-clinical-data rounded hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-base text-tertiary">cloud_download</span>
            <span>Import National Guideline</span>
          </button>
          <button
            onClick={() => setIsProposeOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-primary text-on-primary font-body-strong text-body-strong rounded hover:bg-primary-container transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span>Propose New Protocol</span>
          </button>
          <Link
            href="/red-flag-rule-builder"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-error/15 text-error hover:bg-error hover:text-on-error font-body-strong text-body-strong rounded transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-base">gavel</span>
            <span>Red-Flag Rule Builder</span>
          </Link>
        </div>
      </div>

      {/* KPI & Compliance Matrix Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-space-sm mb-space-lg">
        <div className="bg-surface-container-lowest p-space-sm rounded shadow-sm flex flex-col justify-between border border-outline-variant/20">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-metadata-micro text-metadata-micro uppercase tracking-wider">
              Total Managed
            </span>
            <span className="material-symbols-outlined text-base text-primary">menu_book</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-page-title text-page-title text-on-surface font-bold">34</span>
            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
              Core Pathways
            </span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-sm rounded shadow-sm flex flex-col justify-between border border-outline-variant/20">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-metadata-micro text-metadata-micro uppercase tracking-wider">
              Active &amp; Enforced
            </span>
            <span className="material-symbols-outlined text-base text-primary">verified_user</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-page-title text-page-title text-primary font-bold">28</span>
            <span className="font-clinical-data-mono text-metadata-micro text-primary font-semibold">
              100% Deterministic
            </span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-sm rounded shadow-sm flex flex-col justify-between border border-outline-variant/20">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-metadata-micro text-metadata-micro uppercase tracking-wider">
              Board Review
            </span>
            <span className="material-symbols-outlined text-base text-secondary">rate_review</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-page-title text-page-title text-secondary font-bold">4</span>
            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
              Pending Sign-off
            </span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-sm rounded shadow-sm flex flex-col justify-between border border-outline-variant/20">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-metadata-micro text-metadata-micro uppercase tracking-wider">
              Draft Revisions
            </span>
            <span className="material-symbols-outlined text-base text-outline">edit_note</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-page-title text-page-title text-on-surface font-bold">2</span>
            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
              In Sandbox
            </span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-sm rounded shadow-sm flex flex-col justify-between border border-outline-variant/20">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-metadata-micro text-metadata-micro uppercase tracking-wider">
              Retired / Archive
            </span>
            <span className="material-symbols-outlined text-base text-outline">inventory_2</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-page-title text-page-title text-outline font-bold">9</span>
            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
              Deprecations
            </span>
          </div>
        </div>

        <div className="bg-surface-container-low p-space-sm rounded flex flex-col justify-between border border-outline-variant/20">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-metadata-micro text-metadata-micro uppercase tracking-wider font-semibold">
              Evidence Standards
            </span>
            <span className="material-symbols-outlined text-base text-tertiary">hub</span>
          </div>
          <div className="mt-1">
            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant block leading-tight">
              ACC/AHA 2024 · SSC 2023
            </span>
            <span className="font-metadata-micro text-metadata-micro text-primary font-semibold block leading-tight mt-0.5">
              NABH 5th Ed · ABDM R4
            </span>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Protocol Stage */}
      <div className="grid grid-cols-1 2xl:grid-cols-12 gap-space-lg">
        {/* Left Panel: Category Tabs & Protocol Cards Flow (8 cols) */}
        <div className="2xl:col-span-8 flex flex-col gap-space-md">
          {/* Filter Tabs Strip */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              "All Protocols (34)",
              "Cardiovascular & STEMI (6)",
              "Sepsis & Critical Care (4)",
              "Stroke & Neuro (3)",
              "Respiratory (5)",
              "Pharmacotherapy (8)",
              "Allergy Hard-Stops (4)",
              "Ayurveda / NAMASTE (4)",
            ].map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded font-clinical-data text-clinical-data whitespace-nowrap transition-colors ${
                    isActive
                      ? "bg-primary text-on-primary font-semibold shadow-sm"
                      : "bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container border border-outline-variant/20"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Protocol Cards Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-space-md">
            {filteredProtocols.map((proto) => {
              const isSelected = proto.id === selectedProtocolId;
              return (
                <div
                  key={proto.id}
                  onClick={() => setSelectedProtocolId(proto.id)}
                  className={`bg-surface-container-lowest rounded shadow-sm p-space-panel-padding flex flex-col justify-between hover:bg-surface-bright transition-all cursor-pointer border ${
                    isSelected
                      ? "ring-2 ring-primary border-primary bg-primary/5 shadow-md"
                      : "border-outline-variant/20"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-space-xs mb-2">
                      <span
                        className={`px-2 py-0.5 rounded font-clinical-data-mono text-metadata-micro font-semibold ${proto.codeBadgeStyle}`}
                      >
                        {proto.code} · {proto.version}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded font-clinical-data-mono text-metadata-micro uppercase font-bold tracking-wide ${proto.statusStyle}`}
                      >
                        {proto.status}
                      </span>
                    </div>

                    <h3 className="font-section-title text-section-title text-on-surface font-bold leading-snug">
                      {proto.title}
                    </h3>
                    <p className="font-metadata-micro text-metadata-micro text-on-surface-variant mt-0.5">
                      Clinical Owner:{" "}
                      <span className="font-semibold text-on-surface">{proto.owner}</span>
                    </p>

                    {/* Deterministic Interlocks Box */}
                    <div
                      className={`mt-space-sm p-space-xs rounded flex flex-col gap-1 ${
                        proto.isHardStop
                          ? "bg-error-container/30 text-on-error-container border border-error/20"
                          : "bg-surface-container-low"
                      }`}
                    >
                      <div
                        className={`flex items-center gap-1.5 ${
                          proto.isHardStop ? "text-error" : "text-primary"
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">
                          {proto.isHardStop ? "block" : "lock"}
                        </span>
                        <span className="font-clinical-data text-metadata-micro font-semibold uppercase tracking-wider">
                          {proto.interlockType}
                        </span>
                      </div>
                      <p className="font-clinical-data text-clinical-data text-on-surface leading-snug">
                        {proto.interlockDesc}
                      </p>
                    </div>

                    {/* Evidence & Council Info */}
                    <div className="mt-space-sm flex flex-col gap-1 text-on-surface-variant font-metadata-micro text-metadata-micro">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-outline">verified</span>
                        <span className="truncate">{proto.council}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-outline">source</span>
                        <span className="truncate">{proto.evidence}</span>
                      </div>
                      <div className="flex items-center gap-1 text-secondary">
                        <span className="material-symbols-outlined text-xs">history</span>
                        <span className="truncate">{proto.changelogRecent}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="mt-space-md pt-space-xs flex items-center justify-between border-t border-outline-variant/20">
                    <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                      {proto.triggersPerMo}
                    </span>
                    <div className="flex items-center gap-space-xs">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProtocolId(proto.id);
                        }}
                        className="px-2 py-1 bg-surface-container text-on-surface hover:bg-surface-container-high rounded font-clinical-data text-metadata-micro font-semibold transition-colors"
                      >
                        Inspect Logic
                      </button>
                      <Link
                        href="/quality-audit-logs"
                        onClick={(e) => e.stopPropagation()}
                        className="px-2 py-1 bg-primary text-on-primary hover:bg-primary-container rounded font-clinical-data text-metadata-micro font-semibold transition-colors shadow-sm"
                      >
                        Audit Logs
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel: Protocol Lifecycle & Evidence Inspector (4 cols) */}
        <div className="2xl:col-span-4 flex flex-col gap-space-md">
          {/* Sticky Inspector Container */}
          <div className="bg-surface-container-lowest rounded shadow-sm p-space-panel-padding flex flex-col gap-space-md border border-outline-variant/30">
            {/* Header of Inspector */}
            <div className="flex items-start justify-between pb-space-xs border-b border-outline-variant/20">
              <div className="flex flex-col">
                <span className="font-metadata-micro text-metadata-micro text-primary uppercase font-bold tracking-wider flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-primary inline-block"></span>
                  Selected Protocol Inspector
                </span>
                <h2 className="font-section-title text-section-title text-on-surface font-bold mt-1">
                  {selectedProtocol.title}
                </h2>
                <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                  {selectedProtocol.code} · Production {selectedProtocol.version}
                </span>
              </div>
            </div>

            {/* Deterministic Execution Guarantee Box */}
            <div className="bg-primary text-on-primary p-space-sm rounded flex flex-col gap-1 shadow-sm">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-primary-fixed">verified</span>
                <span className="font-body-strong text-clinical-data uppercase font-bold tracking-wider">
                  Deterministic Guarantee
                </span>
              </div>
              <p className="font-clinical-data text-clinical-data leading-snug text-on-primary">
                All rules in this protocol execute deterministically within the CareFlow Kernel. AI clinical assistants and voice transcription systems cannot relax or bypass these interlocks.
              </p>
            </div>

            {/* Visual Flow Logic Diagram */}
            <div className="bg-surface-container-low p-space-sm rounded flex flex-col gap-2 border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <span className="font-table-header text-table-header text-on-surface font-bold uppercase tracking-wider">
                  Deterministic Logic Pipeline
                </span>
                <span className="font-metadata-micro text-metadata-micro text-primary font-clinical-data-mono font-semibold">
                  Runtime: {selectedProtocol.runtimeMs}
                </span>
              </div>

              {/* Flowchart Diagram */}
              <div className="py-2 flex flex-col gap-2 font-clinical-data-mono text-metadata-micro">
                {selectedProtocol.pipelineSteps.map((step, idx) => (
                  <React.Fragment key={idx}>
                    <div className="flex items-center justify-between p-2 rounded bg-surface-container-lowest shadow-sm border border-outline-variant/10">
                      <span className="flex items-center gap-1 text-on-surface">
                        <span className="material-symbols-outlined text-xs text-primary">
                          {step.icon}
                        </span>
                        <span className="truncate max-w-[240px]">{step.label}</span>
                      </span>
                      <span className={step.badgeStyle}>{step.badge}</span>
                    </div>

                    {idx < selectedProtocol.pipelineSteps.length - 1 && (
                      <div className="flex justify-center -my-1 text-outline">
                        <span className="material-symbols-outlined text-xs">arrow_downward</span>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Evidence & Governance Reference Details */}
            <div className="flex flex-col gap-2">
              <span className="font-table-header text-table-header text-on-surface-variant uppercase tracking-wider">
                Evidence Provenance
              </span>
              <div className="flex flex-col gap-1.5 text-clinical-data font-clinical-data">
                {selectedProtocol.evidenceDetails.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded bg-surface-container-low flex flex-col gap-0.5 border border-outline-variant/10"
                  >
                    <span className="font-semibold text-on-surface">{item.title}</span>
                    <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit & Version Change Log */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-table-header text-table-header text-on-surface-variant uppercase tracking-wider">
                  Version History &amp; Changelog
                </span>
                <span className="font-metadata-micro text-metadata-micro text-secondary font-semibold">
                  {selectedProtocol.versionHistory.length} Releases
                </span>
              </div>
              <div className="flex flex-col gap-2 relative pl-3">
                <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-outline-variant"></div>
                {selectedProtocol.versionHistory.map((ver, idx) => (
                  <div key={idx} className="flex flex-col relative mt-1">
                    <div
                      className={`absolute -left-[15px] top-1.5 h-2 w-2 rounded-full ${
                        ver.isCurrent ? "bg-primary" : "bg-outline"
                      } ring-2 ring-surface-container-lowest`}
                    ></div>
                    <div className="flex items-baseline justify-between">
                      <span className="font-clinical-data-mono text-metadata-micro text-on-surface font-semibold">
                        {ver.version} · {ver.date}
                      </span>
                      <span
                        className={`font-metadata-micro text-metadata-micro font-semibold ${
                          ver.isCurrent ? "text-primary" : "text-outline"
                        }`}
                      >
                        {ver.isCurrent ? "Current" : "Superseded"}
                      </span>
                    </div>
                    <p className="font-metadata-micro text-metadata-micro text-on-surface-variant leading-tight mt-0.5">
                      {ver.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Direct Actions */}
            <div className="pt-space-sm flex flex-col gap-2">
              <Link
                href="/red-flag-rule-builder"
                className="w-full py-2 px-3 bg-error/15 text-error hover:bg-error hover:text-on-error font-clinical-data text-clinical-data font-semibold rounded flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-base">gavel</span>
                <span>Open in Red-Flag Rule Builder (#RF-CARD-01)</span>
              </Link>

              <button
                onClick={() =>
                  alert(`Exporting ${selectedProtocol.title} official Clinical Protocol Dossier (PDF)...`)
                }
                className="w-full py-2 px-3 bg-surface-container hover:bg-surface-container-high text-on-surface font-clinical-data text-clinical-data font-semibold rounded flex items-center justify-center gap-1.5 transition-colors border border-outline-variant/20"
              >
                <span className="material-symbols-outlined text-base text-primary">picture_as_pdf</span>
                <span>Export Protocol Booklet (PDF)</span>
              </button>

              <button
                onClick={() => {
                  setSimulationSuccess(false);
                  setIsSimulateOpen(true);
                }}
                className="w-full py-2 px-3 bg-primary text-on-primary hover:bg-primary-container font-clinical-data text-clinical-data font-semibold rounded flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-base">terminal</span>
                <span>Simulate in Sandbox Environment</span>
              </button>

              <button
                onClick={() =>
                  alert("Scheduled annual recertification review with Clinical Governance Board for Q4.")
                }
                className="w-full py-1.5 px-3 bg-transparent text-secondary hover:bg-surface-container text-metadata-micro font-clinical-data rounded flex items-center justify-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-xs">edit_calendar</span>
                <span>Schedule Annual Board Recertification</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Card: Live Runtime Diagnostics */}
          <div className="bg-surface-container-lowest rounded shadow-sm p-space-panel-padding flex flex-col gap-2 border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <span className="font-table-header text-table-header text-on-surface font-bold uppercase tracking-wider">
                Protocol Telemetry (Past 24h)
              </span>
              <span className="px-1.5 py-0.5 rounded bg-surface-container text-primary font-clinical-data-mono text-metadata-micro font-semibold">
                All Nodes Green
              </span>
            </div>
            <div className="grid grid-cols-3 gap-space-xs text-center">
              <div className="p-2 rounded bg-surface-container-low flex flex-col">
                <span className="font-page-title text-page-title text-primary font-bold">
                  {selectedProtocol.past24h.invocations}
                </span>
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                  Invocations
                </span>
              </div>
              <div className="p-2 rounded bg-surface-container-low flex flex-col">
                <span className="font-page-title text-page-title text-on-surface font-bold">
                  {selectedProtocol.past24h.bypasses}
                </span>
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                  Bypasses
                </span>
              </div>
              <div className="p-2 rounded bg-surface-container-low flex flex-col">
                <span className="font-page-title text-page-title text-tertiary font-bold">
                  {selectedProtocol.past24h.avgMetricValue}
                </span>
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                  {selectedProtocol.past24h.avgMetricLabel}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal 1: Propose New Protocol */}
      {isProposeOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full shadow-xl border border-outline-variant/30 p-space-panel-padding flex flex-col gap-space-md">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-sm">
              <div className="flex items-center gap-2">
                <span className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">add_circle</span>
                </span>
                <div>
                  <h3 className="font-section-title text-section-title text-on-surface font-bold">
                    Propose New Clinical Protocol
                  </h3>
                  <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    Clinical Governance Board Submission Form
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsProposeOpen(false)}
                className="h-8 w-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-space-sm font-clinical-data text-clinical-data">
              <div className="flex flex-col gap-1">
                <label className="font-metadata-micro text-metadata-micro uppercase font-semibold text-outline">
                  Protocol Pathway Name
                </label>
                <input
                  type="text"
                  value={proposalTitle}
                  onChange={(e) => setProposalTitle(e.target.value)}
                  placeholder="e.g. Acute Pulmonary Embolism Thrombolysis Protocol"
                  className="w-full h-8 px-3 rounded bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-space-sm">
                <div className="flex flex-col gap-1">
                  <label className="font-metadata-micro text-metadata-micro uppercase font-semibold text-outline">
                    Clinical Domain
                  </label>
                  <select
                    value={proposalDomain}
                    onChange={(e) => setProposalDomain(e.target.value)}
                    className="h-8 px-2 rounded bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none"
                  >
                    <option value="Cardiovascular">Cardiovascular</option>
                    <option value="Critical Care">Critical Care</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Pulmonology">Pulmonology</option>
                    <option value="Pharmacotherapy">Pharmacotherapy</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-metadata-micro text-metadata-micro uppercase font-semibold text-outline">
                    Evidence Guideline
                  </label>
                  <input
                    type="text"
                    defaultValue="ACC/AHA / ESC 2024"
                    className="h-8 px-3 rounded bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-metadata-micro text-metadata-micro uppercase font-semibold text-outline">
                  Mandatory Deterministic Interlock Conditions
                </label>
                <textarea
                  rows={3}
                  value={proposalInterlock}
                  onChange={(e) => setProposalInterlock(e.target.value)}
                  placeholder="Describe non-negotiable safety conditions that the CareFlow engine must enforce without override (e.g. mandatory CTPA before lytic administration)..."
                  className="w-full p-2.5 rounded bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary resize-none text-clinical-data"
                />
              </div>

              <div className="p-2.5 bg-surface-container-low rounded-lg text-metadata-micro text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-primary">info</span>
                <span>
                  Proposals undergo automated sandbox syntax validation prior to committee review.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
              <button
                onClick={() => setIsProposeOpen(false)}
                className="px-space-md py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-clinical-data text-clinical-data"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Protocol draft submitted to Clinical Governance Board Sandbox!");
                  setIsProposeOpen(false);
                }}
                className="px-space-md py-1.5 rounded bg-primary hover:bg-primary-container text-on-primary font-clinical-data text-clinical-data font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-base">send</span>
                <span>Submit to Sandbox</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Sandbox Simulator */}
      {isSimulateOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full shadow-xl border border-outline-variant/30 p-space-panel-padding flex flex-col gap-space-md">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-sm">
              <div className="flex items-center gap-2">
                <span className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">terminal</span>
                </span>
                <div>
                  <h3 className="font-section-title text-section-title text-on-surface font-bold">
                    Sandbox Rule Engine Simulator
                  </h3>
                  <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    Test {selectedProtocol.code} against simulated patient synthetic encounters
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSimulateOpen(false)}
                className="h-8 w-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-space-sm font-clinical-data-mono text-metadata-micro">
              <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-1.5">
                <div className="flex justify-between">
                  <span className="text-outline">Engine Target:</span>
                  <span className="text-on-surface font-bold">{selectedProtocol.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Synthetic Encounter:</span>
                  <span className="text-primary font-semibold">SYNTH-PT-8891 (54M · Chest Pain)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Interlock Rigidity:</span>
                  <span className="text-error font-bold">DETERMINISTIC · ZERO BYPASS</span>
                </div>
              </div>

              {simulationSuccess ? (
                <div className="p-3 bg-primary/10 border border-primary/30 rounded-lg flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-primary font-bold">
                    <span className="material-symbols-outlined text-base">check_circle</span>
                    <span>All 4 Interlock Pipeline Gates Passed (0.9ms)</span>
                  </div>
                  <p className="text-on-surface-variant text-[11px] font-clinical-data">
                    ECG gate triggered &lt;10m requirement; CPOE dual-antiplatelet order automatically staged with zero syntax conflicts.
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-surface-container-low rounded-lg text-on-surface-variant text-[11px]">
                  Simulates full HL7 FHIR trigger sequence and checks for deadlocks, timing races, or illegal override attempts.
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
              <button
                onClick={() => setIsSimulateOpen(false)}
                className="px-space-md py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-clinical-data text-clinical-data"
              >
                Close
              </button>
              <button
                onClick={handleRunSimulation}
                disabled={simulationRunning}
                className="px-space-md py-1.5 rounded bg-primary hover:bg-primary-container text-on-primary font-clinical-data text-clinical-data font-semibold flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                {simulationRunning ? (
                  <>
                    <span className="material-symbols-outlined text-base animate-spin">refresh</span>
                    <span>Simulating Engine...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">play_arrow</span>
                    <span>Run Synthetic Simulation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Import National Guideline */}
      {isImportOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full shadow-xl border border-outline-variant/30 p-space-panel-padding flex flex-col gap-space-md">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-sm">
              <div className="flex items-center gap-2">
                <span className="h-8 w-8 rounded-lg bg-tertiary/10 text-tertiary flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">cloud_download</span>
                </span>
                <div>
                  <h3 className="font-section-title text-section-title text-on-surface font-bold">
                    Import National Guidelines
                  </h3>
                  <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    ABDM &amp; ICMR Central Protocol Repository
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsImportOpen(false)}
                className="h-8 w-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <label className="flex items-center justify-between p-2.5 rounded-lg border border-outline-variant/30 hover:bg-surface-container-low cursor-pointer">
                <div className="flex flex-col">
                  <span className="font-body-strong text-clinical-data text-on-surface">
                    ICMR National Sepsis Care Bundle 2024
                  </span>
                  <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    Standardized Indian Critical Care Society PlanDefinition
                  </span>
                </div>
                <input type="radio" name="guideline" defaultChecked className="accent-primary" />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg border border-outline-variant/30 hover:bg-surface-container-low cursor-pointer">
                <div className="flex flex-col">
                  <span className="font-body-strong text-clinical-data text-on-surface">
                    Ministry of Ayush NAMASTE Ontology v2.0
                  </span>
                  <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    National AYUSH Morbidity dual-coding ontology
                  </span>
                </div>
                <input type="radio" name="guideline" className="accent-primary" />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg border border-outline-variant/30 hover:bg-surface-container-low cursor-pointer">
                <div className="flex flex-col">
                  <span className="font-body-strong text-clinical-data text-on-surface">
                    NHA ABDM Anti-Microbial Stewardship Standard
                  </span>
                  <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    Carbapenem restriction rules with ICMR red-lines
                  </span>
                </div>
                <input type="radio" name="guideline" className="accent-primary" />
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
              <button
                onClick={() => setIsImportOpen(false)}
                className="px-space-md py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-clinical-data text-clinical-data"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("National guideline bundle imported into Board Review staging queue.");
                  setIsImportOpen(false);
                }}
                className="px-space-md py-1.5 rounded bg-primary hover:bg-primary-container text-on-primary font-clinical-data text-clinical-data font-semibold shadow-sm"
              >
                Import Guideline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
