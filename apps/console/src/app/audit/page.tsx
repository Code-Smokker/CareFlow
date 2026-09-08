"use client";

import React, { useState } from "react";
import { DemoDataBadge } from "@careflow/ui";

interface AuditEvent {
  id: string;
  timestampTime: string;
  timestampDate: string;
  actorName: string;
  actorRole: string;
  actorMci?: string;
  authMethod: string;
  patientName: string;
  patientUhid: string;
  patientAbha: string;
  patientDemographics: string;
  actionTitle: string;
  actionSubtitle: string;
  actionClassification: string;
  actionClassColor: string;
  actionIcon: string;
  actionIconColor: string;
  reason: string;
  reasonSub: string;
  clinicalJustification: string;
  sourceDevice: string;
  sourceGateway: string;
  stateBadge: string;
  stateBadgeStyle: string;
  stateIcon: string;
  aiAttribution?: {
    model: string;
    confidence: string;
    audioNode?: string;
    clinicianDelta: string;
    intervention: string;
  };
  cryptoProof: {
    blockNumber: string;
    sha256: string;
    merkleRoot: string;
    fhirAuditEvent: string;
  };
}

const AUDIT_EVENTS: AuditEvent[] = [
  {
    id: "AUD-2024-8841-SIGN-09",
    timestampTime: "14:35:12 IST",
    timestampDate: "18-OCT-2024",
    actorName: "Dr. Rohit Verma",
    actorRole: "Chief Clinician · Card.",
    actorMci: "MCI: 2009-08821",
    authMethod: "RSA 4096-bit SmartCard (FIPS 140-2)",
    patientName: "Rahul Sharma",
    patientUhid: "DEL-2024-8841",
    patientAbha: "91-8842-1920-4491",
    patientDemographics: "52M · CCU-01",
    actionTitle: "Digitally Signed Encounter & CPOE Cath Orders",
    actionSubtitle: "Code STEMI Protocol 01",
    actionClassification: "LEVEL-1 CRITICAL",
    actionClassColor: "bg-error/10 text-error",
    actionIcon: "draw",
    actionIconColor: "text-primary",
    reason: "Acute Anterior STEMI Protocol Activation",
    reasonSub: "Door-to-balloon: 28m",
    clinicalJustification:
      '"Emergency Cath Lab mobilization for acute anterior STEMI with ongoing ST elevation in V1-V4 (>3.5mm), reciprocal depressions in II, III, aVF. Positive Bedside Troponin-I at 4.2 ng/mL. Aspirin + Ticagrelor given with gastric protective IV proton pump."',
    sourceDevice: "Station 04",
    sourceGateway: "Mindray N12 Gateway",
    stateBadge: "FHIR R4 SHA-256",
    stateBadgeStyle: "bg-primary/10 text-primary font-semibold",
    stateIcon: "lock",
    aiAttribution: {
      model: "CareLLM-Clin-R2",
      confidence: "98.4%",
      audioNode: "ER Triage Mic #02",
      clinicianDelta: "3.2%",
      intervention: "Added STAT Aspirin 325mg order & confirmed cath mobilization",
    },
    cryptoProof: {
      blockNumber: "#9,182,042 · Committed 14:35:12.802 IST",
      sha256: "c79a40ec91b24e88f01b34a17de880f0892f24a4185790a618f0a99182bb1930",
      merkleRoot: "#MRK-8812-701A",
      fhirAuditEvent: "AuditEvent/8841-SIGN-09",
    },
  },
  {
    id: "AUD-2024-8841-MED-04",
    timestampTime: "14:26:40 IST",
    timestampDate: "18-OCT-2024",
    actorName: "Sr. Ancy Thomas, RN",
    actorRole: "CCU Lead Nurse",
    actorMci: "INC: RN-2015-4412",
    authMethod: "Biometric FIDO2 YubiKey",
    patientName: "Rahul Sharma",
    patientUhid: "DEL-2024-8841",
    patientAbha: "91-8842-1920-4491",
    patientDemographics: "52M · CCU-01",
    actionTitle: "Administered STAT Aspirin 325mg + Ticagrelor 180mg",
    actionSubtitle: "Hard-Stop Override Verified",
    actionClassification: "MEDICATION OVERRIDE",
    actionClassColor: "bg-error/10 text-error",
    actionIcon: "medication",
    actionIconColor: "text-secondary",
    reason: "Allergy Override: Buffered formulation + IV Pantoprazole",
    reasonSub: "Co-signed: Dr. Verma",
    clinicalJustification:
      '"Documented mild NSAID dyspepsia history. Benefit of emergency antiplatelet loading in evolving anterior infarction heavily supersedes risk. Buffered formulation co-prescribed with Pantoprazole 40mg IV. Attending cardiologist co-signature validated."',
    sourceDevice: "Bed CCU-01",
    sourceGateway: "Handheld Scanner #9 (Zebra TC52)",
    stateBadge: "Verified & Scanned",
    stateBadgeStyle: "bg-surface-container text-on-surface font-semibold",
    stateIcon: "check_circle",
    aiAttribution: {
      model: "CareRx-Safety-v3",
      confidence: "99.1%",
      audioNode: "Barcode Optical Engine",
      clinicianDelta: "0.8%",
      intervention: "Clinical pharmacist emergency override dual-verification",
    },
    cryptoProof: {
      blockNumber: "#9,181,994 · Committed 14:26:40.418 IST",
      sha256: "8e2f1c841ba59902bd33e144a95610d32b509312ad910c224ef4819ca1e002fa",
      merkleRoot: "#MRK-8812-701A",
      fhirAuditEvent: "AuditEvent/8841-MED-04",
    },
  },
  {
    id: "AUD-2024-8841-AI-SCRIBE-02",
    timestampTime: "14:22:15 IST",
    timestampDate: "18-OCT-2024",
    actorName: "AI Ambient Scribe v4.2",
    actorRole: "Autonomous Model: CareLLM-Clin-R2",
    actorMci: "NHA Sandbox ID: CF-AI-0091",
    authMethod: "mTLS Certificate (Vault HSM)",
    patientName: "Rahul Sharma",
    patientUhid: "DEL-2024-8841",
    patientAbha: "91-8842-1920-4491",
    patientDemographics: "52M · Bed CCU-01",
    actionTitle: "Ambient Audio Stream Parsed (Hindi/English)",
    actionSubtitle: "High Confidence (98.4%)",
    actionClassification: "AI GENERATED DRAFT",
    actionClassColor: "bg-tertiary/10 text-tertiary",
    actionIcon: "graphic_eq",
    actionIconColor: "text-tertiary",
    reason: "Real-time clinical transcription & symptom extraction",
    reasonSub: "Bilingual acoustic matrix",
    clinicalJustification:
      '"Automated ambient acoustic capture and NLP synthesis of physician-patient intake dialogue. Detected crushing retrosternal chest pain radiating to jaw and diaphoresis lasting 45 mins. SNOMED CT: 29857009 (Chest pain) flagged with high probability."',
    sourceDevice: "ER Triage Mic #02",
    sourceGateway: "Beamforming 8-Mic Array",
    stateBadge: "Pending MD Sign",
    stateBadgeStyle: "bg-secondary-container/60 text-on-secondary-container font-semibold",
    stateIcon: "hourglass_empty",
    aiAttribution: {
      model: "CareLLM-Clin-R2 (Quantized 8-bit)",
      confidence: "98.4%",
      audioNode: "ER Triage Mic #02",
      clinicianDelta: "0.0% (Pre-Sign)",
      intervention: "Synthesized draft history of present illness & ROS",
    },
    cryptoProof: {
      blockNumber: "#9,181,962 · Committed 14:22:15.119 IST",
      sha256: "d591b3200af7390c581a0248c8914ba149e88931b209fa23984e112d8ae68301",
      merkleRoot: "#MRK-8812-701A",
      fhirAuditEvent: "AuditEvent/8841-AI-SCRIBE-02",
    },
  },
  {
    id: "AUD-2024-9104-RX-MOD-01",
    timestampTime: "14:18:02 IST",
    timestampDate: "18-OCT-2024",
    actorName: "Dr. Sameer Kulkarni, MD",
    actorRole: "Consultant · Int. Med.",
    actorMci: "MCI: 2012-04981",
    authMethod: "ADFS 2FA Kerberos Ticket",
    patientName: "Sunita Devi",
    patientUhid: "DEL-2024-9104",
    patientAbha: "91-4991-8821-3310",
    patientDemographics: "58F · OPD Room 12",
    actionTitle: "Modified Metformin to Insulin Glargine",
    actionSubtitle: "Dosage: 14 units QHS",
    actionClassification: "THERAPY MODIFICATION",
    actionClassColor: "bg-secondary/10 text-secondary",
    actionIcon: "change_circle",
    actionIconColor: "text-secondary",
    reason: "Decompensated HF & eGFR Fluctuation",
    reasonSub: "eGFR drops to 32 mL/min",
    clinicalJustification:
      '"Routine quarterly diabetes review revealed worsening renal clearance with serum creatinine rising to 1.84 mg/dL (eGFR 32 mL/min/1.73m2). Metformin discontinued immediately due to lactic acidosis risk. Basal insulin glargine initiated with SMBG titration protocol."',
    sourceDevice: "OPD Wing B",
    sourceGateway: "Station 12 Dell WS",
    stateBadge: "Committed EHR",
    stateBadgeStyle: "bg-surface-container text-on-surface font-semibold",
    stateIcon: "done_all",
    aiAttribution: {
      model: "CareCDSS-RenalAlert-v2",
      confidence: "99.4%",
      audioNode: "Station 12 Key Logger & EHR Form",
      clinicianDelta: "1.4%",
      intervention: "Accepted automated alert recommendation to cease Biguanide",
    },
    cryptoProof: {
      blockNumber: "#9,181,912 · Committed 14:18:02.664 IST",
      sha256: "34fa99148dce0b09419b882310ca77d341982bca881e194faec9184511029411",
      merkleRoot: "#MRK-8812-700F",
      fhirAuditEvent: "AuditEvent/9104-RX-MOD-01",
    },
  },
  {
    id: "AUD-2023-11904-PHARM-88",
    timestampTime: "14:12:30 IST",
    timestampDate: "18-OCT-2024",
    actorName: "Pharm. K. Ramanathan",
    actorRole: "Central Pharmacy Lead",
    actorMci: "PCI: DL-6610-PH",
    authMethod: "SmartCard PIN + Biometric",
    patientName: "Priya Sundaram",
    patientUhid: "DEL-2023-11904",
    patientAbha: "91-7712-4019-8832",
    patientDemographics: "42F · Day Surgery Fl 2",
    actionTitle: "Dispensed Post-Op Kit #RX-9912",
    actionSubtitle: "2D Barcode Validated",
    actionClassification: "PHARMACY DISPENSE",
    actionClassColor: "bg-primary/10 text-primary",
    actionIcon: "inventory_2",
    actionIconColor: "text-secondary",
    reason: "Post-Lap Appendectomy Discharge Verification",
    reasonSub: "Patient counseling complete",
    clinicalJustification:
      '"Discharge medication pack dispensed containing Cefuroxime Axetil 500mg BD x 5 days, Paracetamol 650mg TDS PRN, and Pantoprazole 40mg OD. Verified against pre-op allergy checklist. Patient and attendant counselled on dosing and alarm signs."',
    sourceDevice: "Pharmacy Pod #02",
    sourceGateway: "Honeywell Xenon Ultra",
    stateBadge: "Dispensed & Logged",
    stateBadgeStyle: "bg-surface-container text-on-surface font-semibold",
    stateIcon: "check_circle",
    aiAttribution: {
      model: "CareRx-InventoryTracker",
      confidence: "99.8%",
      audioNode: "Optical Scanner Gun #2",
      clinicianDelta: "0.2%",
      intervention: "Batch #B491 expiration confirmed valid (Exp: 2026-08)",
    },
    cryptoProof: {
      blockNumber: "#9,181,870 · Committed 14:12:30.149 IST",
      sha256: "72199b40caef819203a58d198124fa88390bca214819a9e1029410ca512401bc",
      merkleRoot: "#MRK-8812-700F",
      fhirAuditEvent: "AuditEvent/11904-PHARM-88",
    },
  },
  {
    id: "AUD-2024-4419-TRIAGE-02",
    timestampTime: "14:05:18 IST",
    timestampDate: "18-OCT-2024",
    actorName: "Preeti S., RN",
    actorRole: "Triage Nurse",
    actorMci: "INC: RN-2018-9901",
    authMethod: "Apple FaceID Managed Device",
    patientName: "Harish Chandra",
    patientUhid: "DEL-2024-4419",
    patientAbha: "91-3312-0049-7104",
    patientDemographics: "68M · ER Bed 04",
    actionTitle: "ESI-2 Elevation & Nephrology Alert",
    actionSubtitle: "Critical Lab Cascade",
    actionClassification: "TRIAGE ESCALATION",
    actionClassColor: "bg-error/10 text-error",
    actionIcon: "priority_high",
    actionIconColor: "text-error",
    reason: "Refractory Hyperkalemia (K+ 6.2 mEq/L)",
    reasonSub: "Urgent HD Bed Request",
    clinicalJustification:
      '"Critical STAT point-of-care chemistry confirmed severe hyperkalemia at 6.2 mEq/L with peaked T-waves on rhythm strip. Triaged from ESI-3 to ESI-2 priority. Calcium gluconate 10% IV ordered and acute hemodialysis unit alerted for immediate session."',
    sourceDevice: "Triage Kiosk #01",
    sourceGateway: "iPad Pro AirWatch MDM",
    stateBadge: "Escalated to HDU",
    stateBadgeStyle: "bg-error/10 text-error font-semibold",
    stateIcon: "e911_emergency",
    aiAttribution: {
      model: "CareTriage-AI-Critical",
      confidence: "99.5%",
      audioNode: "Radiometer ABL90 POC Analyzer",
      clinicianDelta: "0.0%",
      intervention: "Triggered emergency Nephrology duty pager automatically",
    },
    cryptoProof: {
      blockNumber: "#9,181,811 · Committed 14:05:18.910 IST",
      sha256: "9140aa31b8192a084128f9103c8014ba5901248109310cae182390ba048123fa",
      merkleRoot: "#MRK-8812-700E",
      fhirAuditEvent: "AuditEvent/4419-TRIAGE-02",
    },
  },
];

export default function QualityAuditLogsPage() {
  const [selectedEventId, setSelectedEventId] = useState<string>("AUD-2024-8841-SIGN-09");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("All");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [rowsPerPage, setRowsPerPage] = useState<string>("100");
  const [activeTags, setActiveTags] = useState<string[]>([
    "Triage: P1, P2",
    "FHIR Sync: Verified Committed",
    "Override Events Included",
  ]);

  // Modals
  const [isVerifyMerkleOpen, setIsVerifyMerkleOpen] = useState(false);
  const [isExportArchiveOpen, setIsExportArchiveOpen] = useState(false);
  const [isProofVerified, setIsProofVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const selectedEvent =
    AUDIT_EVENTS.find((e) => e.id === selectedEventId) || AUDIT_EVENTS[0];

  const filteredEvents = AUDIT_EVENTS.filter((evt) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      evt.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.patientUhid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.actionTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      roleFilter === "All" ||
      (roleFilter === "Clinician" && evt.actorRole.includes("Clinician")) ||
      (roleFilter === "Nurse" && evt.actorRole.includes("Nurse")) ||
      (roleFilter === "AI" && evt.actorName.includes("AI")) ||
      (roleFilter === "Pharmacist" && evt.actorRole.includes("Pharmacy"));

    return matchesSearch && matchesRole;
  });

  const removeTag = (tag: string) => {
    setActiveTags(activeTags.filter((t) => t !== tag));
  };

  const handleVerifyProof = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsProofVerified(true);
    }, 900);
  };

  return (
    <div className="flex flex-col w-full gap-space-md">
      {/* Governance Header Strip */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-sm bg-surface-container-lowest p-space-panel-padding rounded-xl shadow-sm border border-outline-variant/30">
        <div className="flex flex-col gap-space-2xs">
          <div className="flex items-center gap-space-xs flex-wrap">
            <span className="inline-flex items-center justify-center p-1 bg-primary/10 text-primary rounded">
              <span className="material-symbols-outlined text-base">verified_user</span>
            </span>
            <span className="font-metadata-micro text-metadata-micro text-primary uppercase font-bold tracking-wider">
              Clinical Governance &amp; AI Provenance Ledger
            </span>
          </div>
          <h1 className="font-page-title text-page-title text-on-surface tracking-tight">
            Quality &amp; Audit Logs
          </h1>
          <p className="font-body-default text-clinical-data text-on-surface-variant">
            Continuous, tamper-evident audit stream tracking clinical decision support, human-in-the-loop overrides, and AI telemetry verification across all inpatient and outpatient endpoints.
          </p>
          <DemoDataBadge reason="An audit_log table exists (DB-trigger-enforced, append-only) but no gateway endpoint reads it back yet. Everything below is placeholder content." />
        </div>

        <div className="flex items-center gap-space-xs shrink-0 self-start lg:self-center flex-wrap">
          <button
            onClick={() => setIsExportArchiveOpen(true)}
            className="flex items-center gap-1.5 px-space-md py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface font-clinical-data text-clinical-data rounded shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined text-base text-primary">download</span>
            <span>Export Immutable Archive</span>
          </button>
          <button
            onClick={() => {
              setIsProofVerified(false);
              setIsVerifyMerkleOpen(true);
            }}
            className="flex items-center gap-1.5 px-space-md py-1.5 bg-primary hover:bg-primary-container text-on-primary font-clinical-data text-clinical-data font-semibold rounded shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined text-base">account_tree</span>
            <span>Verify Merkle Root</span>
          </button>
        </div>
      </div>

      {/* Top KPI Quality Metrics Strip: Bento Grid of 8 Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-space-xs">
        {/* Metric 1: Intake Completeness */}
        <div className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm flex flex-col justify-between border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant font-medium">
              Intake Comp.
            </span>
            <span className="material-symbols-outlined text-primary text-sm">fact_check</span>
          </div>
          <div className="my-1">
            <span className="font-section-title text-section-title text-on-surface font-bold">
              98.6%
            </span>
          </div>
          <div className="flex items-center gap-1 text-primary">
            <span className="material-symbols-outlined text-xs">trending_up</span>
            <span className="font-metadata-micro text-metadata-micro font-semibold">+1.2% this wk</span>
          </div>
        </div>

        {/* Metric 2: History Completeness */}
        <div className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm flex flex-col justify-between border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant font-medium">
              Hx Completeness
            </span>
            <span className="material-symbols-outlined text-secondary text-sm">history_edu</span>
          </div>
          <div className="my-1">
            <span className="font-section-title text-section-title text-on-surface font-bold">
              96.4%
            </span>
          </div>
          <div className="flex items-center gap-1 text-on-surface-variant">
            <span className="font-metadata-micro text-metadata-micro">Target ≥95%</span>
          </div>
        </div>

        {/* Metric 3: Red-Flag Sensitivity */}
        <div className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm flex flex-col justify-between border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="font-metadata-micro text-metadata-micro text-error font-medium">
              Red-Flag Sens.
            </span>
            <span className="material-symbols-outlined text-error text-sm">emergency</span>
          </div>
          <div className="my-1">
            <span className="font-section-title text-section-title text-error font-bold">
              99.8%
            </span>
          </div>
          <div className="flex items-center gap-1 text-on-surface-variant">
            <span className="font-metadata-micro text-metadata-micro text-error font-medium">
              0 missed STEMI
            </span>
          </div>
        </div>

        {/* Metric 4: AI Confidence */}
        <div className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm flex flex-col justify-between border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant font-medium">
              AI Confidence
            </span>
            <span className="material-symbols-outlined text-primary text-sm">psychology</span>
          </div>
          <div className="my-1 flex items-baseline gap-1">
            <span className="font-section-title text-section-title text-on-surface font-bold">
              94.2%
            </span>
            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">High</span>
          </div>
          <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden flex">
            <div className="bg-primary h-full" style={{ width: "94.2%" }}></div>
            <div className="bg-secondary-container h-full" style={{ width: "4.6%" }}></div>
            <div className="bg-error h-full" style={{ width: "1.2%" }}></div>
          </div>
        </div>

        {/* Metric 5: Voice Fallback */}
        <div className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm flex flex-col justify-between border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant font-medium">
              Voice Fallback
            </span>
            <span className="material-symbols-outlined text-tertiary text-sm">mic</span>
          </div>
          <div className="my-1">
            <span className="font-section-title text-section-title text-on-surface font-bold">
              2.1%
            </span>
          </div>
          <div className="flex items-center gap-1 text-on-surface-variant">
            <span className="font-metadata-micro text-metadata-micro truncate">Hinglish ambient OK</span>
          </div>
        </div>

        {/* Metric 6: OCR Verification */}
        <div className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm flex flex-col justify-between border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant font-medium">
              OCR Verification
            </span>
            <span className="material-symbols-outlined text-secondary text-sm">document_scanner</span>
          </div>
          <div className="my-1">
            <span className="font-section-title text-section-title text-on-surface font-bold">
              97.4%
            </span>
          </div>
          <div className="flex items-center gap-1 text-on-surface-variant">
            <span className="font-metadata-micro text-metadata-micro truncate">Rx gate active</span>
          </div>
        </div>

        {/* Metric 7: MD Correction */}
        <div className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm flex flex-col justify-between border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant font-medium">
              MD Correction
            </span>
            <span className="material-symbols-outlined text-primary text-sm">edit_note</span>
          </div>
          <div className="my-1">
            <span className="font-section-title text-section-title text-on-surface font-bold">
              3.2%
            </span>
          </div>
          <div className="flex items-center gap-1 text-primary">
            <span className="material-symbols-outlined text-xs">check_circle</span>
            <span className="font-metadata-micro text-metadata-micro font-semibold">High fidelity</span>
          </div>
        </div>

        {/* Metric 8: Median Intake */}
        <div className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm flex flex-col justify-between border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant font-medium">
              Median Intake
            </span>
            <span className="material-symbols-outlined text-primary text-sm">timer</span>
          </div>
          <div className="my-1">
            <span className="font-section-title text-section-title text-on-surface font-bold">
              3m 42s
            </span>
          </div>
          <div className="flex items-center gap-1 text-on-surface-variant">
            <span className="font-metadata-micro text-metadata-micro line-through text-outline">8m 00s</span>
            <span className="font-metadata-micro text-metadata-micro font-semibold text-primary">-54%</span>
          </div>
        </div>
      </div>

      {/* Multi-Factor Filter Bar */}
      <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm flex flex-col gap-space-sm border border-outline-variant/30">
        <div className="flex flex-wrap items-center gap-space-xs">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[280px]">
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-outline text-base">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audit log by UHID, Actor, Session ID, Patient Name..."
              className="w-full h-8 pl-8 pr-3 text-clinical-data font-clinical-data bg-surface-container-low text-on-surface placeholder:text-outline rounded focus:outline-none focus:bg-surface-container transition-all border border-outline-variant/20 focus:border-primary"
            />
          </div>

          {/* Facility Dropdown */}
          <div className="flex items-center h-8 px-2.5 bg-surface-container-low hover:bg-surface-container rounded cursor-pointer transition-colors text-clinical-data font-clinical-data text-on-surface border border-outline-variant/20">
            <span className="material-symbols-outlined text-sm text-outline mr-1.5">apartment</span>
            <span className="truncate max-w-[150px]">Apollo Indraprastha</span>
            <span className="material-symbols-outlined text-xs text-outline ml-1">expand_more</span>
          </div>

          {/* Department Dropdown */}
          <div className="relative">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              aria-label="Department Filter"
              className="appearance-none h-8 pl-7 pr-6 bg-surface-container-low hover:bg-surface-container rounded cursor-pointer transition-colors text-clinical-data font-clinical-data text-on-surface border border-outline-variant/20 focus:outline-none"
            >
              <option value="All">All Depts (Cardio, ER, Med)</option>
              <option value="Cardio">Cardiology Suite</option>
              <option value="ER">Emergency / Triage</option>
              <option value="Med">Internal Medicine</option>
              <option value="Pharm">Central Pharmacy</option>
            </select>
            <span className="material-symbols-outlined text-sm text-outline absolute left-2 top-2 pointer-events-none">
              local_hospital
            </span>
            <span className="material-symbols-outlined text-xs text-outline absolute right-1.5 top-2.5 pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Date Dropdown */}
          <div className="flex items-center h-8 px-2.5 bg-surface-container-low hover:bg-surface-container rounded cursor-pointer transition-colors text-clinical-data font-clinical-data text-on-surface border border-outline-variant/20">
            <span className="material-symbols-outlined text-sm text-outline mr-1.5">calendar_today</span>
            <span>Today (18 Oct 2024)</span>
            <span className="material-symbols-outlined text-xs text-outline ml-1">expand_more</span>
          </div>

          {/* Clinician */}
          <div className="flex items-center h-8 px-2.5 bg-surface-container-low hover:bg-surface-container rounded cursor-pointer transition-colors text-clinical-data font-clinical-data text-on-surface border border-outline-variant/20">
            <span className="material-symbols-outlined text-sm text-outline mr-1.5">person</span>
            <span className="truncate">All Clinicians</span>
            <span className="material-symbols-outlined text-xs text-outline ml-1">expand_more</span>
          </div>

          {/* Device Filter */}
          <div className="flex items-center h-8 px-2.5 bg-surface-container-low hover:bg-surface-container rounded cursor-pointer transition-colors text-clinical-data font-clinical-data text-on-surface border border-outline-variant/20">
            <span className="material-symbols-outlined text-sm text-outline mr-1.5">devices</span>
            <span>All Workstations</span>
            <span className="material-symbols-outlined text-xs text-outline ml-1">expand_more</span>
          </div>

          {/* Actor Role Filter */}
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              aria-label="Actor Role Filter"
              className="appearance-none h-8 pl-7 pr-6 bg-surface-container-low hover:bg-surface-container rounded cursor-pointer transition-colors text-clinical-data font-clinical-data text-on-surface border border-outline-variant/20 focus:outline-none"
            >
              <option value="All">Role: All</option>
              <option value="Clinician">Attending MDs</option>
              <option value="Nurse">Nursing Staff</option>
              <option value="AI">AI Agents &amp; Scribe</option>
              <option value="Pharmacist">Pharmacists</option>
            </select>
            <span className="material-symbols-outlined text-sm text-outline absolute left-2 top-2 pointer-events-none">
              badge
            </span>
            <span className="material-symbols-outlined text-xs text-outline absolute right-1.5 top-2.5 pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Quick Reset */}
          <button
            onClick={() => {
              setSearchQuery("");
              setDepartmentFilter("All");
              setRoleFilter("All");
              setActiveTags([]);
            }}
            className="h-8 px-2 text-on-surface-variant hover:text-error flex items-center gap-1 font-metadata-micro text-metadata-micro transition-colors rounded hover:bg-surface-container-low"
            title="Reset Filters"
          >
            <span className="material-symbols-outlined text-sm">filter_alt_off</span>
            <span>Clear</span>
          </button>
        </div>

        {/* Active Tag Filters Row */}
        <div className="flex flex-wrap items-center gap-space-xs pt-1">
          <span className="font-metadata-micro text-metadata-micro text-outline uppercase font-semibold">
            Active Strata:
          </span>
          {activeTags.map((tag) => (
            <span
              key={tag}
              className={`inline-flex items-center gap-1 font-metadata-micro text-metadata-micro px-2 py-0.5 rounded ${
                tag.includes("Override")
                  ? "bg-primary/10 text-primary font-semibold"
                  : "bg-surface-container text-on-surface"
              }`}
            >
              <span>{tag}</span>
              <button
                onClick={() => removeTag(tag)}
                className="material-symbols-outlined text-xs hover:text-error transition-colors"
                title="Remove filter"
              >
                close
              </button>
            </span>
          ))}
          <span className="ml-auto font-clinical-data-mono text-metadata-micro text-on-surface-variant">
            Showing {filteredEvents.length} of 1,482 events · Stream latency: 14ms
          </span>
        </div>
      </div>

      {/* Main Workspace Stage: Table + Inspector Split Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-md items-start">
        {/* Append-Only Clinical Audit Event Table (8 cols on XL) */}
        <div className="xl:col-span-8 bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col border border-outline-variant/30">
          <div className="px-space-panel-padding py-space-sm flex items-center justify-between bg-surface-container-low/50 border-b border-outline-variant/20">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-base">receipt_long</span>
              <h2 className="font-section-title text-section-title text-on-surface font-bold">
                Append-Only Clinical Audit Ledger
              </h2>
              <span className="px-2 py-0.5 bg-primary/10 text-primary font-clinical-data-mono text-metadata-micro rounded font-semibold">
                WORM-Compliant Storage
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                Live Shard #IND-AP-01
              </span>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container text-on-surface font-table-header text-table-header uppercase">
                  <th className="py-2.5 px-3 whitespace-nowrap">Timestamp</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Actor &amp; Role</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Patient / Session</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Clinical Action</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Clinical Reason &amp; Context</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Source / Device</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">State</th>
                  <th className="py-2.5 px-3 text-right whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="font-clinical-data text-clinical-data divide-y divide-surface-container">
                {filteredEvents.map((evt) => {
                  const isSelected = evt.id === selectedEventId;
                  return (
                    <tr
                      key={evt.id}
                      onClick={() => setSelectedEventId(evt.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-primary/5 hover:bg-primary/10 ring-1 ring-inset ring-primary/30"
                          : "hover:bg-surface-container-low"
                      }`}
                    >
                      <td className="py-2.5 px-3 font-clinical-data-mono text-metadata-micro whitespace-nowrap text-on-surface">
                        <div className="font-semibold text-primary">{evt.timestampTime}</div>
                        <div className="text-on-surface-variant text-[10px]">{evt.timestampDate}</div>
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="font-body-strong text-clinical-data text-on-surface">
                          {evt.actorName}
                        </div>
                        <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                          {evt.actorRole}
                        </div>
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="font-body-strong text-clinical-data text-on-surface">
                          {evt.patientName}
                        </div>
                        <div className="font-clinical-data-mono text-metadata-micro text-primary">
                          {evt.patientUhid}
                        </div>
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1 font-semibold text-on-surface">
                          <span className={`material-symbols-outlined text-sm ${evt.actionIconColor}`}>
                            {evt.actionIcon}
                          </span>
                          <span className="truncate max-w-[180px]">{evt.actionTitle}</span>
                        </div>
                        <div className="font-metadata-micro text-metadata-micro text-outline">
                          {evt.actionSubtitle}
                        </div>
                      </td>

                      <td className="py-2.5 px-3 max-w-[200px]">
                        <div
                          className="truncate font-body-default text-clinical-data text-on-surface"
                          title={evt.reason}
                        >
                          {evt.reason}
                        </div>
                        <div
                          className={`font-metadata-micro text-metadata-micro ${
                            evt.reasonSub.includes("STEMI") || evt.reasonSub.includes("28m")
                              ? "text-error font-medium"
                              : "text-outline"
                          }`}
                        >
                          {evt.reasonSub}
                        </div>
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="font-clinical-data text-on-surface">{evt.sourceDevice}</div>
                        <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                          {evt.sourceGateway}
                        </div>
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-clinical-data-mono text-metadata-micro ${evt.stateBadgeStyle}`}
                        >
                          <span className="material-symbols-outlined text-[11px]">{evt.stateIcon}</span>
                          <span>{evt.stateBadge}</span>
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEventId(evt.id);
                          }}
                          className={`px-2 py-1 font-clinical-data text-metadata-micro font-semibold rounded transition-colors ${
                            isSelected
                              ? "bg-primary text-on-primary shadow-sm hover:bg-primary-container"
                              : "bg-surface-container hover:bg-surface-container-high text-on-surface"
                          }`}
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Ledger Table Footer / Pagination */}
          <div className="px-space-panel-padding py-space-sm bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-space-xs border-t border-outline-variant/20">
            <div className="flex items-center gap-space-sm">
              <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                Rows per view:
              </span>
              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(e.target.value)}
                aria-label="Rows per view"
                className="bg-surface-container-lowest text-on-surface font-clinical-data-mono text-metadata-micro rounded px-2 py-1 focus:outline-none border border-outline-variant/20"
              >
                <option value="25">25 events</option>
                <option value="50">50 events</option>
                <option value="100">100 events</option>
              </select>
              <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                Page 1 of 15 (1,482 total records)
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                className="p-1 rounded bg-surface-container text-outline hover:text-on-surface cursor-not-allowed"
                disabled
              >
                <span className="material-symbols-outlined text-sm">first_page</span>
              </button>
              <button
                className="p-1 rounded bg-surface-container text-outline hover:text-on-surface cursor-not-allowed"
                disabled
              >
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <button className="px-2.5 py-1 rounded bg-primary text-on-primary font-clinical-data-mono text-metadata-micro font-semibold">
                1
              </button>
              <button className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-clinical-data-mono text-metadata-micro">
                2
              </button>
              <button className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-clinical-data-mono text-metadata-micro">
                3
              </button>
              <span className="px-1 text-outline font-clinical-data-mono text-metadata-micro">...</span>
              <button className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-clinical-data-mono text-metadata-micro">
                15
              </button>
              <button className="p-1 rounded bg-surface-container text-on-surface hover:bg-surface-container-high">
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
              <button className="p-1 rounded bg-surface-container text-on-surface hover:bg-surface-container-high">
                <span className="material-symbols-outlined text-sm">last_page</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right-Side Docked Inspector (4 cols on XL) */}
        <div className="xl:col-span-4 flex flex-col gap-space-sm">
          {/* Provenance Inspector Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col border border-outline-variant/30">
            {/* Inspector Title Header */}
            <div className="p-space-panel-padding bg-surface-container-low/70 flex items-start justify-between border-b border-outline-variant/20">
              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-primary">
                  <span className="material-symbols-outlined text-sm">policy</span>
                  <span className="font-metadata-micro text-metadata-micro uppercase font-bold tracking-wider">
                    Audit &amp; Provenance Inspector
                  </span>
                </div>
                <span className="font-section-title text-section-title text-on-surface font-bold mt-0.5">
                  {selectedEvent.id}
                </span>
                <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                  {selectedEvent.cryptoProof.blockNumber}
                </span>
              </div>
              <span className="px-2 py-0.5 bg-primary/10 text-primary font-clinical-data-mono text-metadata-micro rounded font-bold">
                VERIFIED
              </span>
            </div>

            {/* Inspector Body */}
            <div className="p-space-panel-padding flex flex-col gap-space-md">
              {/* Actor & Subject Profile Strip */}
              <div className="grid grid-cols-2 gap-space-sm bg-surface-container-low p-space-sm rounded-lg border border-outline-variant/20">
                <div className="flex flex-col">
                  <span className="font-metadata-micro text-metadata-micro text-outline uppercase font-semibold">
                    Clinician / Signer
                  </span>
                  <span className="font-body-strong text-clinical-data text-on-surface mt-0.5">
                    {selectedEvent.actorName}
                  </span>
                  {selectedEvent.actorMci && (
                    <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                      {selectedEvent.actorMci}
                    </span>
                  )}
                  <span className="font-metadata-micro text-metadata-micro text-primary mt-0.5 truncate">
                    {selectedEvent.authMethod}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="font-metadata-micro text-metadata-micro text-outline uppercase font-semibold">
                    Patient Record
                  </span>
                  <span className="font-body-strong text-clinical-data text-on-surface mt-0.5">
                    {selectedEvent.patientName} ({selectedEvent.patientDemographics})
                  </span>
                  <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                    UHID: {selectedEvent.patientUhid}
                  </span>
                  <span className="font-clinical-data-mono text-metadata-micro text-secondary truncate">
                    ABHA: {selectedEvent.patientAbha}
                  </span>
                </div>
              </div>

              {/* Action Category */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-metadata-micro text-metadata-micro text-outline uppercase font-semibold">
                    Action Classification
                  </span>
                  <span
                    className={`px-2 py-0.5 font-metadata-micro text-metadata-micro font-bold rounded ${selectedEvent.actionClassColor}`}
                  >
                    {selectedEvent.actionClassification}
                  </span>
                </div>
                <div className="font-body-strong text-clinical-data text-on-surface bg-surface-container p-2 rounded">
                  {selectedEvent.actionTitle}
                </div>
              </div>

              {/* Clinical Justification & Evidence */}
              <div className="flex flex-col gap-1">
                <span className="font-metadata-micro text-metadata-micro text-outline uppercase font-semibold">
                  Clinical Justification &amp; Indication
                </span>
                <div className="font-body-default text-clinical-data text-on-surface bg-surface-container-low p-space-sm rounded leading-relaxed border border-outline-variant/20">
                  {selectedEvent.clinicalJustification}
                </div>
              </div>

              {/* AI Model Scribe Provenance & Human Delta */}
              {selectedEvent.aiAttribution && (
                <div className="flex flex-col gap-1.5 bg-surface-container/50 p-space-sm rounded-lg border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <span className="font-metadata-micro text-metadata-micro text-primary uppercase font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">auto_awesome</span>
                      AI Attribution &amp; Human Modification
                    </span>
                    <span className="font-clinical-data-mono text-metadata-micro text-primary font-bold">
                      Delta: {selectedEvent.aiAttribution.clinicianDelta}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 font-metadata-micro text-metadata-micro text-on-surface-variant">
                    <div className="flex items-center justify-between">
                      <span>Model Confidence:</span>
                      <span className="font-clinical-data-mono text-on-surface font-semibold">
                        {selectedEvent.aiAttribution.confidence} ({selectedEvent.aiAttribution.model})
                      </span>
                    </div>
                    {selectedEvent.aiAttribution.audioNode && (
                      <div className="flex items-center justify-between">
                        <span>Audio / Ingestion Node:</span>
                        <span className="font-clinical-data-mono text-on-surface">
                          {selectedEvent.aiAttribution.audioNode}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span>Clinician Intervention:</span>
                      <span className="text-primary font-semibold text-right max-w-[200px] truncate">
                        {selectedEvent.aiAttribution.intervention}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Cryptographic Provenance Block */}
              <div className="flex flex-col gap-1.5 bg-surface-container-high/40 p-space-sm rounded-lg border border-outline-variant/20">
                <div className="flex items-center justify-between">
                  <span className="font-metadata-micro text-metadata-micro text-outline uppercase font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs text-primary">fingerprint</span>
                    Cryptographic Provenance
                  </span>
                  <span className="font-metadata-micro text-metadata-micro text-primary font-bold">
                    HSM Hardware Signed
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    Immutable SHA-256 Digest:
                  </span>
                  <div className="bg-surface-container-lowest p-1.5 rounded font-clinical-data-mono text-[11px] text-on-surface break-all leading-tight select-all border border-outline-variant/20">
                    {selectedEvent.cryptoProof.sha256}
                  </div>
                </div>

                <div className="flex items-center justify-between text-metadata-micro font-clinical-data-mono pt-1">
                  <span className="text-on-surface-variant">Merkle Root:</span>
                  <span className="text-primary font-semibold">
                    {selectedEvent.cryptoProof.merkleRoot}
                  </span>
                </div>

                <div className="flex items-center justify-between text-metadata-micro font-clinical-data-mono">
                  <span className="text-on-surface-variant">FHIR AuditEvent:</span>
                  <span className="text-secondary font-semibold">
                    {selectedEvent.cryptoProof.fhirAuditEvent}
                  </span>
                </div>
              </div>

              {/* Inspector Action Buttons */}
              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={() => setIsExportArchiveOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-space-md bg-primary hover:bg-primary-container text-on-primary font-clinical-data text-clinical-data font-semibold rounded shadow-sm transition-colors"
                >
                  <span className="material-symbols-outlined text-base">picture_as_pdf</span>
                  <span>Export Complete Audit Dossier (PDF)</span>
                </button>
                <button
                  onClick={() => {
                    setIsProofVerified(false);
                    setIsVerifyMerkleOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-space-md bg-surface-container hover:bg-surface-container-high text-on-surface font-clinical-data text-clinical-data font-semibold rounded transition-colors"
                >
                  <span className="material-symbols-outlined text-base text-primary">verified</span>
                  <span>Verify Merkle Tree Proof Against HSM</span>
                </button>
              </div>
            </div>
          </div>

          {/* Real-Time Anomaly & Governance Watchdog Mini-Card */}
          <div className="bg-surface-container-lowest p-space-panel-padding rounded-xl shadow-sm flex flex-col gap-space-xs border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <span className="font-metadata-micro text-metadata-micro text-primary uppercase font-bold tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">security</span>
                Governance Watchdog Status
              </span>
              <span className="inline-flex items-center gap-1 text-primary font-metadata-micro text-metadata-micro font-semibold">
                <span className="h-2 w-2 rounded-full bg-primary inline-block"></span>
                ACTIVE MONITORING
              </span>
            </div>

            <p className="font-body-default text-metadata-micro text-on-surface-variant leading-normal">
              AI confidence thresholds are pinned to &gt;90% for autonomous note drafts. Any diagnostic divergence between clinician sign-off and AI draft triggers an automatic secondary QA audit ticket for the peer review committee.
            </p>

            <div className="flex items-center justify-between pt-1 font-clinical-data-mono text-metadata-micro">
              <span className="text-outline">Next Automated Integrity Scrub:</span>
              <span className="text-on-surface font-semibold">15:00:00 IST (in 24m)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal 1: Merkle Root Proof Verification */}
      {isVerifyMerkleOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full shadow-xl border border-outline-variant/30 p-space-panel-padding flex flex-col gap-space-md">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-sm">
              <div className="flex items-center gap-2">
                <span className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">account_tree</span>
                </span>
                <div>
                  <h3 className="font-section-title text-section-title text-on-surface font-bold">
                    Cryptographic Integrity Verification
                  </h3>
                  <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    Hardware Security Module (HSM) Merkle Proof
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsVerifyMerkleOpen(false)}
                className="h-8 w-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-space-sm">
              <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-1.5 font-clinical-data-mono text-metadata-micro">
                <div className="flex justify-between">
                  <span className="text-outline">Event Under Audit:</span>
                  <span className="text-on-surface font-bold">{selectedEvent.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Committed Block:</span>
                  <span className="text-primary font-semibold">
                    {selectedEvent.cryptoProof.blockNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Merkle Root:</span>
                  <span className="text-primary font-semibold">
                    {selectedEvent.cryptoProof.merkleRoot}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5 pt-1">
                  <span className="text-outline">SHA-256 Checksum:</span>
                  <span className="bg-surface-container-lowest p-1 rounded break-all text-[11px] text-on-surface select-all">
                    {selectedEvent.cryptoProof.sha256}
                  </span>
                </div>
              </div>

              {isProofVerified ? (
                <div className="p-3 bg-primary/10 border border-primary/30 rounded-lg flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-primary text-xl">verified</span>
                  <div>
                    <div className="font-body-strong text-clinical-data text-primary font-bold">
                      Proof Valid &amp; Tamper-Evident
                    </div>
                    <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                      Zero chain divergence detected across 3 distributed validator nodes.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-surface-container-low rounded-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-outline text-lg">shield</span>
                  <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    Ready to query distributed validator consensus against FIPS 140-2 Level 3 HSM.
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
              <button
                onClick={() => setIsVerifyMerkleOpen(false)}
                className="px-space-md py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-clinical-data text-clinical-data"
              >
                Close
              </button>
              <button
                onClick={handleVerifyProof}
                disabled={isVerifying}
                className="px-space-md py-1.5 rounded bg-primary hover:bg-primary-container text-on-primary font-clinical-data text-clinical-data font-semibold flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                {isVerifying ? (
                  <>
                    <span className="material-symbols-outlined text-base animate-spin">refresh</span>
                    <span>Validating Hashes...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">verified</span>
                    <span>Execute Proof Check</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Export Immutable Archive */}
      {isExportArchiveOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full shadow-xl border border-outline-variant/30 p-space-panel-padding flex flex-col gap-space-md">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-sm">
              <div className="flex items-center gap-2">
                <span className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">download</span>
                </span>
                <div>
                  <h3 className="font-section-title text-section-title text-on-surface font-bold">
                    Export Immutable Archive
                  </h3>
                  <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    ABDM M3 &amp; HIPAA Legal Compliance Pack
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsExportArchiveOpen(false)}
                className="h-8 w-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-space-sm">
              <p className="font-body-default text-clinical-data text-on-surface-variant">
                Select export format for the verified clinical audit ledger:
              </p>
              <div className="flex flex-col gap-2">
                <label className="flex items-center justify-between p-2.5 rounded-lg border border-outline-variant/30 hover:bg-surface-container-low cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-base">picture_as_pdf</span>
                    <span className="font-body-strong text-clinical-data text-on-surface">
                      PDF/A-3 Cryptographic Dossier
                    </span>
                  </div>
                  <input type="radio" name="format" defaultChecked className="accent-primary" />
                </label>
                <label className="flex items-center justify-between p-2.5 rounded-lg border border-outline-variant/30 hover:bg-surface-container-low cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-base">code</span>
                    <span className="font-body-strong text-clinical-data text-on-surface">
                      FHIR R4 JSON-ND (Bulk Data)
                    </span>
                  </div>
                  <input type="radio" name="format" className="accent-primary" />
                </label>
                <label className="flex items-center justify-between p-2.5 rounded-lg border border-outline-variant/30 hover:bg-surface-container-low cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-outline text-base">table_view</span>
                    <span className="font-body-strong text-clinical-data text-on-surface">
                      WORM CSV with Signature Hashes
                    </span>
                  </div>
                  <input type="radio" name="format" className="accent-primary" />
                </label>
              </div>

              <div className="p-2.5 bg-surface-container-low rounded-lg text-metadata-micro font-clinical-data-mono text-on-surface-variant">
                Includes digital certificate signed by Apollo IND HSM Root Authority.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
              <button
                onClick={() => setIsExportArchiveOpen(false)}
                className="px-space-md py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-clinical-data text-clinical-data"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Immutable audit dossier generated and downloaded successfully!");
                  setIsExportArchiveOpen(false);
                }}
                className="px-space-md py-1.5 rounded bg-primary hover:bg-primary-container text-on-primary font-clinical-data text-clinical-data font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-base">file_download</span>
                <span>Download Archive</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
