/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";

interface DiagnosticOrder {
  id: string;
  time: string;
  patient: {
    name: string;
    ageGender: string;
    uhid: string;
    bed: string;
    bedClass: string;
    avatar: string;
  };
  investigation: {
    name: string;
    loinc: string;
    category: "stat" | "biochem" | "hema" | "radiology" | "micro";
  };
  orderingMd: {
    name: string;
    role: string;
  };
  priority: "STAT P1 CATH" | "STAT P1" | "STAT CRITICAL" | "URGENT" | "ROUTINE";
  priorityClass: string;
  specimenStatus: {
    status: string;
    statusClass: string;
    device: string;
    icon?: string;
    ping?: boolean;
  };
  currentResult: {
    main: string;
    eta?: string;
    isError?: boolean;
    isWarning?: boolean;
  };
  verification: {
    badge: string;
    badgeClass: string;
  };
  specimenAudit: {
    barcode: string;
    type: string;
    tubeSpec: string;
    steps: Array<{
      step: number;
      title: string;
      time: string;
      desc: string;
      status: "complete" | "active" | "projected";
    }>;
    alertGate?: {
      title: string;
      presentation: string;
      pathologist: string;
      cathLinked: boolean;
    };
    hilIndex: {
      hemolysis: string;
      icterus: string;
      lipemia: string;
      suitability: string;
      qcScore: string;
    };
  };
}

const DIAGNOSTIC_ORDERS: DiagnosticOrder[] = [
  {
    id: "ORD-2026-99201",
    time: "14:20 IST · Today",
    patient: {
      name: "Rahul Sharma",
      ageGender: "42M",
      uhid: "DEL-2024-8841",
      bed: "CCU-01",
      bedClass: "text-error font-semibold",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC2xU4Fr2siwN3yl1Iiybe56aS2fCz9yxa8ozEdaGzGTJqm-4Cf9COtjv6ciJA4NzEa9wm3MXkYUxYkNGN6zpKnWy0E7x2j1SNmaotPwaxa-oX-Ddx-8XVXhpD8vCRIEDbC7VT9OnnzwyGItr1m53fv69wzDWU8Ywy7NicnEGNMv0RHMIC-h4Xu0OZn9JvexC5if6dMC30QlcdyqHsVF0cBUJ4o01zd50IK06yeH4KYivrbWmxcJARE",
    },
    investigation: {
      name: "High-Sensitivity Troponin I (hs-cTnI)",
      loinc: "LOINC: 89579-7",
      category: "stat",
    },
    orderingMd: {
      name: "Dr. Rohit Verma",
      role: "Cardiology Attending",
    },
    priority: "STAT P1 CATH",
    priorityClass: "bg-error text-on-error",
    specimenStatus: {
      status: "In Analyzer",
      statusClass: "text-tertiary font-semibold",
      device: "Siemens Atellica #01",
      ping: true,
    },
    currentResult: {
      main: "Running",
      eta: "(ETA ~14:50)",
    },
    verification: {
      badge: "CRITICAL PROTOCOL",
      badgeClass: "bg-error-container text-on-error-container font-semibold",
    },
    specimenAudit: {
      barcode: "#990142-01",
      type: "Venous Whole Blood",
      tubeSpec: "Lithium Heparin (Green Top) · Vacutainer 4.0 mL",
      steps: [
        {
          step: 1,
          title: "CPOE Order Signed",
          time: "14:20 IST",
          desc: "Electronically signed by Dr. Rohit Verma (Cardiology)",
          status: "complete",
        },
        {
          step: 2,
          title: "Phlebotomy Collected",
          time: "14:23 IST",
          desc: "Drawn at bedside by Sr. Preeti S. (2x Barcode Wristband Scanned)",
          status: "complete",
        },
        {
          step: 3,
          title: "Pneumatic Tube Dispatch",
          time: "14:25 IST",
          desc: "Station Bay 02 → Central Core Lab (Carrier ID #44)",
          status: "complete",
        },
        {
          step: 4,
          title: "Core Lab Reception & QC",
          time: "14:28 IST",
          desc: "Verified: Zero Hemolysis · 3000 RPM Centrifuged",
          status: "complete",
        },
        {
          step: 5,
          title: "Loaded on Immunoassay Line",
          time: "14:32 IST",
          desc: "Siemens Atellica IM #01 (Chamber B2) · Chemiluminescence in progress",
          status: "active",
        },
        {
          step: 6,
          title: "Result Readout & Auto-Verify",
          time: "14:50 IST (Est)",
          desc: "Automated telemetry push to Cath Suite 01 upon completion",
          status: "projected",
        },
      ],
      alertGate: {
        title: "Critical Alert Gate Active",
        presentation:
          "Anterior STEMI with ongoing ischemic window. Attending cardiologist requested instant direct interrupt.",
        pathologist: "Dr. Anjali Nair, MD",
        cathLinked: true,
      },
      hilIndex: {
        hemolysis: "4 mg/dL",
        icterus: "0.1",
        lipemia: "12",
        suitability: "Suitable for high-sensitivity cardiac chemiluminescence",
        qcScore: "0.02 (CLEAR)",
      },
    },
  },
  {
    id: "ORD-2026-99198",
    time: "14:20 IST · Today",
    patient: {
      name: "Rahul Sharma",
      ageGender: "42M",
      uhid: "DEL-2024-8841",
      bed: "CCU-01",
      bedClass: "text-error font-semibold",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC2xU4Fr2siwN3yl1Iiybe56aS2fCz9yxa8ozEdaGzGTJqm-4Cf9COtjv6ciJA4NzEa9wm3MXkYUxYkNGN6zpKnWy0E7x2j1SNmaotPwaxa-oX-Ddx-8XVXhpD8vCRIEDbC7VT9OnnzwyGItr1m53fv69wzDWU8Ywy7NicnEGNMv0RHMIC-h4Xu0OZn9JvexC5if6dMC30QlcdyqHsVF0cBUJ4o01zd50IK06yeH4KYivrbWmxcJARE",
    },
    investigation: {
      name: "Bedside 12-Lead ECG",
      loinc: "DICOM-ECG · 11524-6",
      category: "stat",
    },
    orderingMd: {
      name: "Dr. Rohit Verma",
      role: "Cardiology",
    },
    priority: "STAT P1",
    priorityClass: "bg-error text-on-error",
    specimenStatus: {
      status: "Verified at Bedside",
      statusClass: "text-primary font-medium",
      device: "GE MAC 5500 Sync",
      icon: "check_circle",
    },
    currentResult: {
      main: "ST-Elev +3.2mm (V2-V4)",
      isError: true,
    },
    verification: {
      badge: "ACKNOWLEDGED",
      badgeClass: "bg-surface-container text-on-surface-variant font-medium",
    },
    specimenAudit: {
      barcode: "#990142-ECG",
      type: "DICOM Waveform Telemetry",
      tubeSpec: "10-Electrode Precordial Cable · Silver/Silver-Chloride Pads",
      steps: [
        {
          step: 1,
          title: "ECG Requisition Initiated",
          time: "14:18 IST",
          desc: "Triage STEMI alert triggered at ER Station 02",
          status: "complete",
        },
        {
          step: 2,
          title: "Precordial Leads Placed",
          time: "14:21 IST",
          desc: "Leads V1-V6 applied by Nurse Ancy (Zero tremor artifact)",
          status: "complete",
        },
        {
          step: 3,
          title: "Continuous 12-Lead Acquisition",
          time: "14:24 IST",
          desc: "Captured via GE MAC 5500HD · Auto-interpreted by Marquette 12SL",
          status: "complete",
        },
        {
          step: 4,
          title: "PACS Telemetry Synchronized",
          time: "14:26 IST",
          desc: "DICOM ECG streamed to Cath Lab Console & Attending Mobile",
          status: "complete",
        },
      ],
      alertGate: {
        title: "STEMI Criteria Met",
        presentation: "Acute anterior myocardial infarction with >2mm ST-elevation in contiguous precordial leads.",
        pathologist: "Dr. Rohit Verma, MD DM",
        cathLinked: true,
      },
      hilIndex: {
        hemolysis: "N/A",
        icterus: "N/A",
        lipemia: "N/A",
        suitability: "Clean electrical baseline · Minimal baseline wander",
        qcScore: "PASS (10/10 Leads)",
      },
    },
  },
  {
    id: "ORD-2026-99203",
    time: "14:20 IST · Today",
    patient: {
      name: "Rahul Sharma",
      ageGender: "42M",
      uhid: "DEL-2024-8841",
      bed: "CCU-01",
      bedClass: "text-error font-semibold",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC2xU4Fr2siwN3yl1Iiybe56aS2fCz9yxa8ozEdaGzGTJqm-4Cf9COtjv6ciJA4NzEa9wm3MXkYUxYkNGN6zpKnWy0E7x2j1SNmaotPwaxa-oX-Ddx-8XVXhpD8vCRIEDbC7VT9OnnzwyGItr1m53fv69wzDWU8Ywy7NicnEGNMv0RHMIC-h4Xu0OZn9JvexC5if6dMC30QlcdyqHsVF0cBUJ4o01zd50IK06yeH4KYivrbWmxcJARE",
    },
    investigation: {
      name: "Pre-PCI Renal Clearance (eGFR + Cr)",
      loinc: "LOINC: 33914-3",
      category: "stat",
    },
    orderingMd: {
      name: "Dr. Rohit Verma",
      role: "Cardiology",
    },
    priority: "STAT P1",
    priorityClass: "bg-error text-on-error",
    specimenStatus: {
      status: "Completed (14:26)",
      statusClass: "text-on-surface font-medium",
      device: "Abbott i-STAT POC",
      icon: "task_alt",
    },
    currentResult: {
      main: "Cr 0.88 mg/dL · eGFR 98",
    },
    verification: {
      badge: "CONTRAST SAFE",
      badgeClass: "bg-primary-fixed text-on-primary-fixed-variant font-bold",
    },
    specimenAudit: {
      barcode: "#990142-03",
      type: "Whole Blood Point-of-Care",
      tubeSpec: "i-STAT CHEM8+ Cartridge · Heparinized Syringe 1.0 mL",
      steps: [
        {
          step: 1,
          title: "Bedside Arterial/Venous Draw",
          time: "14:22 IST",
          desc: "Sample loaded directly into i-STAT electrochemical cartridge",
          status: "complete",
        },
        {
          step: 2,
          title: "Biosensor Enzymatic Readout",
          time: "14:25 IST",
          desc: "Creatinine 0.88 mg/dL · BUN 14 mg/dL · eGFR 98 mL/min (CKD-EPI)",
          status: "complete",
        },
        {
          step: 3,
          title: "Contrast Safety Flag Passed",
          time: "14:26 IST",
          desc: "Pre-Cath clearance confirmed for Visipaque / Omnipaque contrast",
          status: "complete",
        },
      ],
      hilIndex: {
        hemolysis: "< 10 mg/dL",
        icterus: "0.0",
        lipemia: "Normal",
        suitability: "Point-of-care amperometric biosensor verified",
        qcScore: "PASS (0.01)",
      },
    },
  },
  {
    id: "ORD-2026-99205",
    time: "14:20 IST · Today",
    patient: {
      name: "Rahul Sharma",
      ageGender: "42M",
      uhid: "DEL-2024-8841",
      bed: "CCU-01",
      bedClass: "text-error font-semibold",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC2xU4Fr2siwN3yl1Iiybe56aS2fCz9yxa8ozEdaGzGTJqm-4Cf9COtjv6ciJA4NzEa9wm3MXkYUxYkNGN6zpKnWy0E7x2j1SNmaotPwaxa-oX-Ddx-8XVXhpD8vCRIEDbC7VT9OnnzwyGItr1m53fv69wzDWU8Ywy7NicnEGNMv0RHMIC-h4Xu0OZn9JvexC5if6dMC30QlcdyqHsVF0cBUJ4o01zd50IK06yeH4KYivrbWmxcJARE",
    },
    investigation: {
      name: "Coagulation Profile (PT / INR / aPTT)",
      loinc: "LOINC: 5902-2",
      category: "stat",
    },
    orderingMd: {
      name: "Dr. Rohit Verma",
      role: "Cardiology",
    },
    priority: "STAT P1",
    priorityClass: "bg-error text-on-error",
    specimenStatus: {
      status: "In Lab (Centrifuged)",
      statusClass: "text-on-surface font-medium",
      device: "Stago STA-R Max",
      icon: "hourglass_top",
    },
    currentResult: {
      main: "PT 11.8s · INR 1.08 · 28.4s",
    },
    verification: {
      badge: "VERIFIED NORMAL",
      badgeClass: "bg-surface-container text-on-surface-variant font-semibold",
    },
    specimenAudit: {
      barcode: "#990142-05",
      type: "Citrated Platelet-Poor Plasma",
      tubeSpec: "3.2% Sodium Citrate (Light Blue Top) · Vacutainer 2.7 mL",
      steps: [
        {
          step: 1,
          title: "Venipuncture Collection",
          time: "14:22 IST",
          desc: "Exact 9:1 blood to anticoagulant ratio confirmed",
          status: "complete",
        },
        {
          step: 2,
          title: "Double Centrifugation (3000g)",
          time: "14:27 IST",
          desc: "Platelet-poor plasma isolated at Core Hematology",
          status: "complete",
        },
        {
          step: 3,
          title: "STA-R Max Mechanical Clot Detection",
          time: "14:31 IST",
          desc: "PT 11.8s (INR 1.08), aPTT 28.4s within baseline parameters",
          status: "complete",
        },
      ],
      hilIndex: {
        hemolysis: "< 5 mg/dL",
        icterus: "0.1",
        lipemia: "8",
        suitability: "Zero fibrin micro-clots detected",
        qcScore: "OPTIMAL",
      },
    },
  },
  {
    id: "ORD-2026-99170",
    time: "13:50 IST · Today",
    patient: {
      name: "Harish Chandra",
      ageGender: "64M",
      uhid: "DEL-2024-1082",
      bed: "HDU-04",
      bedClass: "text-secondary font-semibold",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCaYE5XIka6Y_1zMjkAuUc2ll2UkzFCWH_ysndQPmnTomX3vsi4w8PHEKOPapOrGdKIyB6AiLFX1YB9mft4bnYRMZRj_r6YZEHUoWggV_JNYqDhYpFqfSjWofGhbPSThMr0yXw-g_lRxeBUW1BI9tT3plHiNy-cHCGz4szOKtcvrg8IAFOuXzEuotCZclG1WfS5_pxnr0olNE-tDFXqiAWXg1QtM4PmRViu2F-rKuru5BLjdiNySsxh",
    },
    investigation: {
      name: "STAT Serum Electrolytes & Renal",
      loinc: "LOINC: 24326-1",
      category: "biochem",
    },
    orderingMd: {
      name: "Dr. Sameer Kulkarni",
      role: "Nephrology Consult",
    },
    priority: "STAT CRITICAL",
    priorityClass: "bg-error text-on-error font-bold",
    specimenStatus: {
      status: "Completed (14:02)",
      statusClass: "text-primary font-medium",
      device: "Roche Cobas 8000",
      icon: "check_circle",
    },
    currentResult: {
      main: "↑ K+ 6.2 mEq/L (CRITICAL)",
      isError: true,
    },
    verification: {
      badge: "DIALYSIS PREP",
      badgeClass: "bg-error text-on-error font-bold",
    },
    specimenAudit: {
      barcode: "#990170-K",
      type: "Serum Separator Gel",
      tubeSpec: "SST Gold Top Clot Activator · Vacutainer 5.0 mL",
      steps: [
        {
          step: 1,
          title: "Draw in Nephro HDU-04",
          time: "13:50 IST",
          desc: "Urgent hyperkalemia protocol initiated",
          status: "complete",
        },
        {
          step: 2,
          title: "Roche Cobas Ion-Selective Electrode",
          time: "14:02 IST",
          desc: "Serum Potassium measured at 6.2 mEq/L (Normal 3.5-5.0)",
          status: "complete",
        },
        {
          step: 3,
          title: "Critical Telephonic Escalation",
          time: "14:04 IST",
          desc: "Duty Pathologist readback confirmed to Dr. Kulkarni",
          status: "complete",
        },
      ],
      alertGate: {
        title: "Severe Hyperkalemia Alert",
        presentation: "K+ 6.2 mEq/L with ECG peaked T waves. Urgent Calcium Gluconate and Hemodialysis prepped.",
        pathologist: "Dr. Anjali Nair, MD",
        cathLinked: false,
      },
      hilIndex: {
        hemolysis: "Zero (True in-vivo hyperkalemia)",
        icterus: "0.2",
        lipemia: "14",
        suitability: "Verified non-hemolyzed draw",
        qcScore: "QC PASS",
      },
    },
  },
  {
    id: "ORD-2026-99154",
    time: "13:30 IST · Today",
    patient: {
      name: "Sunita Devi",
      ageGender: "58F",
      uhid: "DEL-2024-7104",
      bed: "CCU-02",
      bedClass: "text-error font-semibold",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCaYE5XIka6Y_1zMjkAuUc2ll2UkzFCWH_ysndQPmnTomX3vsi4w8PHEKOPapOrGdKIyB6AiLFX1YB9mft4bnYRMZRj_r6YZEHUoWggV_JNYqDhYpFqfSjWofGhbPSThMr0yXw-g_lRxeBUW1BI9tT3plHiNy-cHCGz4szOKtcvrg8IAFOuXzEuotCZclG1WfS5_pxnr0olNE-tDFXqiAWXg1QtM4PmRViu2F-rKuru5BLjdiNySsxh",
    },
    investigation: {
      name: "NT-proBNP & Arterial Blood Gas",
      loinc: "LOINC: 33762-6",
      category: "biochem",
    },
    orderingMd: {
      name: "Dr. Sameer Kulkarni",
      role: "Cardiology",
    },
    priority: "URGENT",
    priorityClass: "bg-secondary text-on-secondary",
    specimenStatus: {
      status: "Completed",
      statusClass: "text-primary font-medium",
      device: "Radiometer ABL90",
      icon: "check_circle",
    },
    currentResult: {
      main: "NT-proBNP 4,820 pg/mL",
      isWarning: true,
    },
    verification: {
      badge: "VERIFIED - DR. NAIR",
      badgeClass: "bg-surface-container text-on-surface-variant font-semibold",
    },
    specimenAudit: {
      barcode: "#990154-BNP",
      type: "Heparinized Arterial Blood",
      tubeSpec: "Blood Gas Syringe · Radiometer SafePICO 2.0 mL",
      steps: [
        {
          step: 1,
          title: "Radial Artery Blood Gas Puncture",
          time: "13:30 IST",
          desc: "Radial artery drawn on room air, iced container",
          status: "complete",
        },
        {
          step: 2,
          title: "Radiometer ABL90 Flex Optical Readout",
          time: "13:38 IST",
          desc: "pH 7.34 · PaO2 68 mmHg · PaCO2 42 mmHg · Lactate 1.8",
          status: "complete",
        },
        {
          step: 3,
          title: "NT-proBNP Chemiluminescence",
          time: "13:46 IST",
          desc: "4,820 pg/mL (Decompensated acute heart failure range)",
          status: "complete",
        },
      ],
      hilIndex: {
        hemolysis: "Clean",
        icterus: "0.1",
        lipemia: "10",
        suitability: "Arterial draw validated with pO2/pCO2 consistency",
        qcScore: "PASSED",
      },
    },
  },
];

export default function OrdersAndDiagnosticsPage() {
  const [activeTab, setActiveTab] = useState<string>("stat");
  const [searchQuery, setSearchQuery] = useState("Rahul Sharma · UHID: DEL-2024-8841");
  const [selectedOrderId, setSelectedOrderId] = useState<string>("ORD-2026-99201");

  // Modals
  const [showPhlebotomyModal, setShowPhlebotomyModal] = useState(false);
  const [showAnalyzerModal, setShowAnalyzerModal] = useState(false);
  const [showBatchVerifyModal, setShowBatchVerifyModal] = useState(false);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [showTraceModal, setShowTraceModal] = useState(false);
  const [showRawLogModal, setShowRawLogModal] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const selectedOrder =
    DIAGNOSTIC_ORDERS.find((o) => o.id === selectedOrderId) || DIAGNOSTIC_ORDERS[0];

  const filteredOrders = DIAGNOSTIC_ORDERS.filter((order) => {
    if (activeTab === "stat" && order.investigation.category !== "stat") return false;
    if (activeTab === "biochem" && order.investigation.category !== "biochem") return false;
    if (activeTab === "hema" && order.investigation.category !== "hema") return false;
    if (activeTab === "radiology" && order.investigation.category !== "radiology") return false;
    if (activeTab === "micro" && order.investigation.category !== "micro") return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      order.id.toLowerCase().includes(q) ||
      order.patient.name.toLowerCase().includes(q) ||
      order.patient.uhid.toLowerCase().includes(q) ||
      order.investigation.name.toLowerCase().includes(q) ||
      order.orderingMd.name.toLowerCase().includes(q) ||
      order.specimenAudit.barcode.toLowerCase().includes(q)
    );
  });

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

      {/* TOP OPERATIONAL CONTEXT HEADER */}
      <div className="bg-surface-container-lowest rounded-xl p-panel-padding shadow-sm flex flex-col gap-space-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-sm">
          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-xl">chips</span>
              <h1 className="font-page-title text-page-title text-on-surface">Orders &amp; Diagnostics</h1>
              <span className="px-2 py-0.5 rounded-full bg-error text-on-error font-metadata-micro text-metadata-micro font-semibold uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-on-error animate-ping"></span>
                STAT Cascade Active
              </span>
            </div>
            <p className="font-clinical-data text-clinical-data text-on-surface-variant mt-0.5">
              Hospital diagnostic order lifecycle, specimen tracking, automated analyzer integration, and critical laboratory alerts
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-space-xs">
            <button
              onClick={() => setShowPhlebotomyModal(true)}
              className="px-space-md py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-clinical-data text-clinical-data flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">hub</span>
              <span>Phlebotomy Worklist</span>
              <span className="px-1.5 py-0.2 bg-surface-container-highest text-on-surface-variant font-clinical-data-mono text-metadata-micro rounded">
                22
              </span>
            </button>
            <button
              onClick={() => setShowAnalyzerModal(true)}
              className="px-space-md py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-clinical-data text-clinical-data flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">fact_check</span>
              <span>Analyzer Health &amp; QC Logs</span>
            </button>
            <button
              onClick={() => setShowBatchVerifyModal(true)}
              className="px-space-md py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-clinical-data text-clinical-data flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">verified</span>
              <span>Batch Verify Cleared</span>
            </button>
            <button
              onClick={() => setShowNewOrderModal(true)}
              className="px-space-md py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-body-strong text-body-strong flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">add_circle</span>
              <span>+ New Diagnostic Order</span>
            </button>
          </div>
        </div>

        {/* Facility Locator & Modality Tabs */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-space-sm pt-space-xs">
          <div className="flex items-center gap-space-xs text-on-surface-variant">
            <div className="flex items-center gap-1.5 px-space-sm py-1 bg-surface-container-low rounded-lg">
              <span className="material-symbols-outlined text-primary text-base">domain</span>
              <span className="font-clinical-data text-clinical-data text-on-surface font-semibold">
                Apollo Central Diagnostic Laboratories &amp; Imaging Suite
              </span>
              <span className="material-symbols-outlined text-on-surface-variant text-sm">expand_more</span>
            </div>
            <span className="font-clinical-data-mono text-metadata-micro text-outline">LIS-CORE-R4 #SYS-09</span>
          </div>
          {/* Diagnostic Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto bg-surface-container-low p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1 font-clinical-data text-clinical-data rounded transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === "all"
                  ? "bg-primary text-on-primary font-semibold shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              All Diagnostic Orders
            </button>
            <button
              onClick={() => setActiveTab("stat")}
              className={`px-3 py-1 font-clinical-data text-clinical-data rounded font-semibold shadow-xs flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === "stat"
                  ? "bg-primary text-on-primary"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-on-primary animate-pulse"></span>
              STAT / Emergency (18)
            </button>
            <button
              onClick={() => setActiveTab("biochem")}
              className={`px-3 py-1 font-clinical-data text-clinical-data rounded transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === "biochem"
                  ? "bg-primary text-on-primary font-semibold shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Biochemistry &amp; Immunoassay
            </button>
            <button
              onClick={() => setActiveTab("hema")}
              className={`px-3 py-1 font-clinical-data text-clinical-data rounded transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === "hema"
                  ? "bg-primary text-on-primary font-semibold shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Hematology &amp; Coagulation
            </button>
            <button
              onClick={() => setActiveTab("radiology")}
              className={`px-3 py-1 font-clinical-data text-clinical-data rounded transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === "radiology"
                  ? "bg-primary text-on-primary font-semibold shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Radiology / PACS
            </button>
            <button
              onClick={() => setActiveTab("micro")}
              className={`px-3 py-1 font-clinical-data text-clinical-data rounded transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === "micro"
                  ? "bg-primary text-on-primary font-semibold shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Microbiology
            </button>
          </div>
        </div>

        {/* Quick Search Row */}
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-lg">
            search
          </span>
          <input
            className="w-full h-10 pl-10 pr-32 bg-surface-container-low rounded-lg text-clinical-data font-clinical-data text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest transition-colors shadow-inner"
            placeholder="Search by Order ID, Patient Name, UHID, Barcode, Analyte or Ordering Doctor..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute right-2 top-2 flex items-center gap-1.5">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="px-2 py-0.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-clinical-data-mono text-metadata-micro cursor-pointer"
              >
                ESC to Clear
              </button>
            )}
            <button
              onClick={() => triggerToast("Filter parameters applied to diagnostic order queue.")}
              className="p-1 rounded hover:bg-surface-container text-on-surface-variant cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">filter_alt</span>
            </button>
          </div>
        </div>
      </div>

      {/* TOP DIAGNOSTIC KPI STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-space-xs">
        <div className="bg-surface-container-lowest rounded-lg p-space-sm shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-metadata-micro text-metadata-micro uppercase tracking-wider">
              Total Orders Today
            </span>
            <span className="material-symbols-outlined text-base text-primary">receipt_long</span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-chief-complaint-mobile text-chief-complaint-mobile text-on-surface font-bold">
              486
            </span>
            <span className="font-metadata-micro text-metadata-micro text-primary flex items-center">
              ↑ 14% vs avg
            </span>
          </div>
          <span className="font-metadata-micro text-metadata-micro text-outline mt-1 truncate">
            Total specimens booked
          </span>
        </div>

        <div className="bg-surface-container-lowest rounded-lg p-space-sm shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-metadata-micro text-metadata-micro uppercase tracking-wider text-error font-semibold">
              STAT Emergency
            </span>
            <span className="material-symbols-outlined text-base text-error">e911_emergency</span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-chief-complaint-mobile text-chief-complaint-mobile text-error font-bold">
              18
            </span>
            <span className="font-clinical-data-mono text-metadata-micro text-error font-semibold">
              &lt; 30m target
            </span>
          </div>
          <span className="font-metadata-micro text-metadata-micro text-on-surface-variant mt-1 truncate">
            Cardiac, Stroke ABG, Pre-Op
          </span>
        </div>

        <div className="bg-surface-container-lowest rounded-lg p-space-sm shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-metadata-micro text-metadata-micro uppercase tracking-wider">
              Pending Phlebotomy
            </span>
            <span className="material-symbols-outlined text-base text-secondary">colorize</span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-chief-complaint-mobile text-chief-complaint-mobile text-on-surface font-bold">
              22
            </span>
            <span className="font-clinical-data-mono text-metadata-micro text-secondary">avg 11 mins</span>
          </div>
          <span className="font-metadata-micro text-metadata-micro text-outline mt-1 truncate">
            Bedside collection queue
          </span>
        </div>

        <div className="bg-surface-container-lowest rounded-lg p-space-sm shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-metadata-micro text-metadata-micro uppercase tracking-wider">
              On Analyzers
            </span>
            <span className="material-symbols-outlined text-base text-tertiary">memory</span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-chief-complaint-mobile text-chief-complaint-mobile text-on-surface font-bold">
              41
            </span>
            <span className="font-clinical-data-mono text-metadata-micro text-tertiary font-semibold">
              2 Lines Active
            </span>
          </div>
          <span className="font-metadata-micro text-metadata-micro text-outline mt-1 truncate">
            Atellica &amp; Sysmex XN
          </span>
        </div>

        <div className="bg-surface-container-lowest rounded-lg p-space-sm shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-metadata-micro text-metadata-micro uppercase tracking-wider">
              Ready for Review
            </span>
            <span className="material-symbols-outlined text-base text-primary">rate_review</span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-chief-complaint-mobile text-chief-complaint-mobile text-on-surface font-bold">
              34
            </span>
            <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">
              Path Sign-off
            </span>
          </div>
          <span className="font-metadata-micro text-metadata-micro text-outline mt-1 truncate">
            Awaiting digital verification
          </span>
        </div>

        <div className="bg-error-container text-on-error-container rounded-lg p-space-sm shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-metadata-micro text-metadata-micro uppercase tracking-wider font-semibold">
              Critical Results
            </span>
            <span className="material-symbols-outlined text-base">crisis_alert</span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-chief-complaint-mobile text-chief-complaint-mobile font-bold">04</span>
            <span className="font-clinical-data-mono text-metadata-micro font-semibold uppercase">
              Action Req
            </span>
          </div>
          <span className="font-metadata-micro text-metadata-micro mt-1 truncate">
            Mandatory Doc &amp; MD Ping
          </span>
        </div>

        <div className="bg-surface-container-lowest rounded-lg p-space-sm shadow-sm flex flex-col justify-between col-span-2 md:col-span-4 xl:col-span-1">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-metadata-micro text-metadata-micro uppercase tracking-wider">
              Hemolyzed / Re-draw
            </span>
            <span className="material-symbols-outlined text-base text-outline">sync_problem</span>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-chief-complaint-mobile text-chief-complaint-mobile text-on-surface font-bold">
              02
            </span>
            <span className="font-clinical-data-mono text-metadata-micro text-outline">Re-ordered</span>
          </div>
          <span className="font-metadata-micro text-metadata-micro text-outline mt-1 truncate">
            Auto-dispatch sent to CCU
          </span>
        </div>
      </div>

      {/* MAIN MULTI-PANE WORKSPACE (65% Worklist Table / 35% Live Specimen Chain of Custody) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-md items-start">
        {/* LEFT PANEL: Orders Worklist (Col 1-8 / 65%) */}
        <div className="xl:col-span-8 flex flex-col gap-space-sm">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
            {/* Table Header Controls */}
            <div className="px-space-md py-2.5 bg-surface-container-low flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <span className="font-section-title text-section-title text-on-surface">
                  Emergency Diagnostic Order Worklist
                </span>
                <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-clinical-data-mono text-metadata-micro font-semibold">
                  Live Socket: Active
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => triggerToast("Socket updated: 0 new STAT laboratory events.")}
                  className="p-1 rounded hover:bg-surface-container text-on-surface-variant cursor-pointer"
                  title="Auto-refresh (every 15s)"
                >
                  <span className="material-symbols-outlined text-base animate-spin">autorenew</span>
                </button>
                <button
                  onClick={() => triggerToast("Column layout adjusted for clinical density.")}
                  className="p-1 rounded hover:bg-surface-container text-on-surface-variant cursor-pointer"
                  title="Column Density"
                >
                  <span className="material-symbols-outlined text-base">view_column</span>
                </button>
                <button
                  onClick={() => triggerToast("Exporting Diagnostic Worklist (HL7 / CSV format)...")}
                  className="p-1 rounded hover:bg-surface-container text-on-surface-variant cursor-pointer"
                  title="Export CSV/HL7"
                >
                  <span className="material-symbols-outlined text-base">download</span>
                </button>
              </div>
            </div>

            {/* Density Optimized Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container text-on-surface-variant font-table-header text-table-header uppercase tracking-wider">
                    <th className="py-2 px-3">Order ID &amp; Time</th>
                    <th className="py-2 px-3">Patient &amp; Location</th>
                    <th className="py-2 px-3">Investigation / LOINC</th>
                    <th className="py-2 px-3">Ordering MD</th>
                    <th className="py-2 px-3">Priority</th>
                    <th className="py-2 px-3">Specimen Status</th>
                    <th className="py-2 px-3">Current Result</th>
                    <th className="py-2 px-3">Verification</th>
                    <th className="py-2 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="font-clinical-data text-clinical-data divide-y-0">
                  {filteredOrders.map((order) => {
                    const isSelected = order.id === selectedOrderId;
                    return (
                      <tr
                        key={order.id}
                        onClick={() => setSelectedOrderId(order.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-primary-fixed/20 hover:bg-primary-fixed/30"
                            : "bg-surface-container-lowest hover:bg-surface-container-low"
                        }`}
                      >
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span
                              className={`font-clinical-data-mono font-semibold ${
                                isSelected ? "text-primary" : "text-on-surface"
                              }`}
                            >
                              {order.id}
                            </span>
                            <span className="font-metadata-micro text-metadata-micro text-outline">
                              {order.time}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex flex-col">
                            <span className="font-body-strong text-on-surface">
                              {order.patient.name}
                            </span>
                            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                              {order.patient.ageGender} ·{" "}
                              <span className={order.patient.bedClass}>{order.patient.bed}</span>
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex flex-col">
                            <span className="font-semibold text-on-surface">
                              {order.investigation.name}
                            </span>
                            <span className="font-clinical-data-mono text-metadata-micro text-outline">
                              {order.investigation.loinc}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span className="text-on-surface">{order.orderingMd.name}</span>
                          <span className="block font-metadata-micro text-metadata-micro text-outline">
                            {order.orderingMd.role}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded font-clinical-data-mono text-metadata-micro font-bold tracking-tight ${order.priorityClass}`}
                          >
                            {order.priority}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span className={`flex items-center gap-1 ${order.specimenStatus.statusClass}`}>
                            {order.specimenStatus.ping && (
                              <span className="w-2 h-2 rounded-full bg-tertiary animate-ping"></span>
                            )}
                            {order.specimenStatus.icon && (
                              <span className="material-symbols-outlined text-sm">
                                {order.specimenStatus.icon}
                              </span>
                            )}
                            {order.specimenStatus.status}
                          </span>
                          <span className="block font-metadata-micro text-metadata-micro text-outline">
                            {order.specimenStatus.device}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          {order.currentResult.isError ? (
                            <div className="p-1 rounded bg-error-container text-on-error-container font-clinical-data-mono text-metadata-micro font-bold">
                              {order.currentResult.main}
                            </div>
                          ) : order.currentResult.isWarning ? (
                            <span className="font-clinical-data-mono text-error font-medium">
                              {order.currentResult.main}
                            </span>
                          ) : order.currentResult.eta ? (
                            <div className="flex items-center gap-1.5">
                              <span className="font-clinical-data-mono text-primary font-bold">
                                {order.currentResult.main}
                              </span>
                              <span className="font-clinical-data-mono text-metadata-micro text-outline">
                                {order.currentResult.eta}
                              </span>
                            </div>
                          ) : (
                            <span className="font-clinical-data-mono text-on-surface font-medium">
                              {order.currentResult.main}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded font-metadata-micro text-metadata-micro ${order.verification.badgeClass}`}
                          >
                            {order.verification.badge}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            {order.id === "ORD-2026-99198" ? (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowTraceModal(true);
                                  }}
                                  className="px-2 py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-metadata-micro text-metadata-micro font-semibold cursor-pointer"
                                >
                                  View Trace
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    triggerToast("Cath Lab transfer initiated for Rahul Sharma.");
                                  }}
                                  className="px-2 py-1 rounded bg-error text-on-error font-metadata-micro text-metadata-micro font-semibold cursor-pointer"
                                >
                                  Cath Transfer
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedOrderId(order.id);
                                    triggerToast(`Auditing specimen ${order.specimenAudit.barcode}`);
                                  }}
                                  className="px-2 py-1 rounded bg-primary text-on-primary font-metadata-micro text-metadata-micro font-semibold shadow-xs cursor-pointer"
                                >
                                  Inspect Specimen
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowRawLogModal(true);
                                  }}
                                  className="p-1 rounded hover:bg-surface-container text-on-surface-variant cursor-pointer"
                                  title="Live Run Diagnostics"
                                >
                                  <span className="material-symbols-outlined text-base">monitoring</span>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination & Realtime Health Footer */}
            <div className="p-space-sm bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-space-sm">
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                  Showing {filteredOrders.length} of 18 STAT Orders
                </span>
                <span className="h-3 w-px bg-outline-variant"></span>
                <span className="font-metadata-micro text-metadata-micro text-outline">
                  Filter: Priority=STAT, Ward=CCU/HDU
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button className="px-2 py-1 rounded bg-surface-container text-on-surface-variant text-metadata-micro font-clinical-data-mono disabled:opacity-40 cursor-pointer">
                  Previous
                </button>
                <span className="px-2 py-1 text-metadata-micro font-clinical-data-mono text-on-surface font-bold bg-surface-container-lowest rounded shadow-xs">
                  1
                </span>
                <button className="px-2 py-1 rounded bg-surface-container text-on-surface-variant text-metadata-micro font-clinical-data-mono cursor-pointer">
                  2
                </button>
                <button className="px-2 py-1 rounded bg-surface-container text-on-surface-variant text-metadata-micro font-clinical-data-mono cursor-pointer">
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Core Analyzers Operational Feeds & Diagnostics Throughput */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-base">
                    precision_manufacturing
                  </span>
                  <span className="font-body-strong text-body-strong text-on-surface">
                    Siemens Atellica IM #01
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-clinical-data-mono text-metadata-micro font-bold">
                  CALIBRATED &amp; QC PASS
                </span>
              </div>
              <div className="flex items-center justify-between mt-1 text-on-surface-variant">
                <span className="font-metadata-micro text-metadata-micro">
                  Current Slot: Rack 04 · Position B2
                </span>
                <span className="font-clinical-data-mono text-metadata-micro text-primary font-semibold">
                  Running: hs-cTnI #99201
                </span>
              </div>
              {/* Real-time SVG throughput sparkline */}
              <div className="w-full h-12 bg-surface-container-low rounded p-1 flex items-end">
                <svg
                  className="w-full h-full text-primary"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 200 40"
                >
                  <path
                    d="M0,35 Q20,32 40,28 T80,15 T120,22 T160,8 T200,12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle className="fill-primary animate-ping" cx="160" cy="8" r="3" />
                  <circle
                    className="fill-surface-container-lowest stroke-primary stroke-2"
                    cx="160"
                    cy="8"
                    r="2.5"
                  />
                </svg>
              </div>
              <div className="flex items-center justify-between text-outline font-metadata-micro text-metadata-micro">
                <span>Reagent Wells: 94% Capacity</span>
                <span>Batch TAT: 18m 40s</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-secondary text-base">science</span>
                  <span className="font-body-strong text-body-strong text-on-surface">
                    Sysmex XN-9100 Hematology
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-clinical-data-mono text-metadata-micro font-bold">
                  READY
                </span>
              </div>
              <div className="flex items-center justify-between mt-1 text-on-surface-variant">
                <span className="font-metadata-micro text-metadata-micro">
                  CBC / Diff / Retic Tube Feeder
                </span>
                <span className="font-clinical-data-mono text-metadata-micro text-on-surface font-semibold">
                  Idle · Waiting Rack
                </span>
              </div>
              {/* Real-time SVG throughput sparkline */}
              <div className="w-full h-12 bg-surface-container-low rounded p-1 flex items-end">
                <svg
                  className="w-full h-full text-secondary"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 200 40"
                >
                  <path
                    d="M0,30 Q25,30 50,22 T100,18 T150,26 T200,20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle className="fill-secondary" cx="200" cy="20" r="2.5" />
                </svg>
              </div>
              <div className="flex items-center justify-between text-outline font-metadata-micro text-metadata-micro">
                <span>Laser Diode Quality: Nominal</span>
                <span>Flag Rate: 1.2%</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Specimen Chain of Custody & Critical Alert Inspector (Col 9-12 / 35%) */}
        <div className="xl:col-span-4 flex flex-col gap-space-sm">
          {/* Specimen Detail Banner */}
          <div className="bg-surface-container-lowest rounded-xl p-panel-padding shadow-sm flex flex-col gap-space-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-error text-xl">vital_signs</span>
                <span className="font-body-strong text-body-strong text-on-surface">
                  Live Specimen Audit
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-error text-on-error font-clinical-data-mono text-metadata-micro font-bold animate-pulse">
                ACTIVE STAT AUDIT
              </span>
            </div>

            {/* Patient Demographics Context */}
            <div className="p-space-sm bg-surface-container-low rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <img
                  className="w-10 h-10 rounded-full object-cover shadow-xs"
                  alt={`Portrait of ${selectedOrder.patient.name}`}
                  src={selectedOrder.patient.avatar}
                />
                <div className="flex flex-col">
                  <span className="font-body-strong text-body-strong text-on-surface">
                    {selectedOrder.patient.name} ({selectedOrder.patient.ageGender})
                  </span>
                  <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                    UHID: {selectedOrder.patient.uhid}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-body-strong text-clinical-data text-error font-bold">
                  {selectedOrder.patient.bed}
                </span>
                <span className="block font-metadata-micro text-metadata-micro text-outline">
                  Cath Bay 01
                </span>
              </div>
            </div>

            {/* Specimen Metadata Microcard */}
            <div className="grid grid-cols-2 gap-space-xs font-clinical-data text-clinical-data bg-surface-container-low p-space-sm rounded-lg">
              <div>
                <span className="text-metadata-micro font-metadata-micro text-outline block">
                  Specimen Barcode
                </span>
                <span className="font-clinical-data-mono font-bold text-on-surface">
                  {selectedOrder.specimenAudit.barcode}
                </span>
              </div>
              <div>
                <span className="text-metadata-micro font-metadata-micro text-outline block">
                  Specimen Type
                </span>
                <span className="font-medium text-on-surface flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
                  {selectedOrder.specimenAudit.type}
                </span>
              </div>
              <div className="col-span-2 pt-1">
                <span className="text-metadata-micro font-metadata-micro text-outline block">
                  Tube Specification
                </span>
                <span className="font-clinical-data-mono text-metadata-micro text-on-surface">
                  {selectedOrder.specimenAudit.tubeSpec}
                </span>
              </div>
            </div>

            {/* Chain-of-Custody Longitudinal Stepper */}
            <div className="flex flex-col pt-space-xs">
              <span className="font-body-strong text-clinical-data text-on-surface mb-2 flex items-center justify-between">
                <span>Specimen Chain-of-Custody</span>
                <span className="font-clinical-data-mono text-metadata-micro text-primary">Live Tracking</span>
              </span>
              <div className="relative pl-5 space-y-3.5 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-outline-variant">
                {selectedOrder.specimenAudit.steps.map((step) => {
                  const isComplete = step.status === "complete";
                  const isActive = step.status === "active";
                  const isProjected = step.status === "projected";

                  return (
                    <div
                      key={step.step}
                      className={`relative flex flex-col ${isProjected ? "opacity-60" : ""}`}
                    >
                      {isActive ? (
                        <>
                          <span className="absolute -left-5 top-0.5 w-2.5 h-2.5 rounded-full bg-tertiary animate-ping"></span>
                          <span className="absolute -left-5 top-0.5 w-2.5 h-2.5 rounded-full bg-tertiary"></span>
                        </>
                      ) : isComplete ? (
                        <span className="absolute -left-5 top-0.5 w-2.5 h-2.5 rounded-full bg-primary shadow-xs"></span>
                      ) : (
                        <span className="absolute -left-5 top-0.5 w-2.5 h-2.5 rounded-full bg-outline"></span>
                      )}
                      <div className="flex items-baseline justify-between">
                        <span
                          className={`font-body-strong text-clinical-data ${
                            isActive ? "text-tertiary font-bold" : "text-on-surface font-semibold"
                          }`}
                        >
                          {step.title}
                        </span>
                        <span
                          className={`font-clinical-data-mono text-metadata-micro ${
                            isActive ? "text-tertiary font-bold" : "text-outline"
                          }`}
                        >
                          {step.time}
                        </span>
                      </div>
                      <p
                        className={`font-clinical-data text-metadata-micro ${
                          isActive ? "text-on-surface" : "text-on-surface-variant"
                        }`}
                      >
                        {step.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STAT Critical Alert Gate Box */}
            {selectedOrder.specimenAudit.alertGate && (
              <div className="bg-error-container text-on-error-container p-space-sm rounded-lg flex flex-col gap-1.5 shadow-sm mt-space-xs">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base font-bold">warning</span>
                  <span className="font-body-strong text-clinical-data font-bold uppercase tracking-tight">
                    {selectedOrder.specimenAudit.alertGate.title}
                  </span>
                </div>
                <p className="font-clinical-data text-metadata-micro leading-snug">
                  Presentation:{" "}
                  <strong className="font-semibold">
                    {selectedOrder.specimenAudit.alertGate.presentation}
                  </strong>
                </p>
                <div className="flex items-center justify-between pt-1 font-metadata-micro text-metadata-micro">
                  <span>
                    Duty Pathologist:{" "}
                    <strong>{selectedOrder.specimenAudit.alertGate.pathologist}</strong>
                  </span>
                  <span className="font-clinical-data-mono font-semibold">
                    Cath Monitor: {selectedOrder.specimenAudit.alertGate.cathLinked ? "Linked" : "Standby"}
                  </span>
                </div>
              </div>
            )}

            {/* Operational Action Bar */}
            <div className="grid grid-cols-2 gap-space-xs pt-space-xs">
              <button
                onClick={() =>
                  triggerToast(
                    `Pneumatic dispatch ping sent to Bay 02! Carrier ID #44 transit verified.`
                  )
                }
                className="px-2 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-clinical-data text-metadata-micro font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">notifications_active</span>
                Pneumatic Ping
              </button>
              <button
                onClick={() =>
                  triggerToast(
                    `Reprinting Barcode Label ${selectedOrder.specimenAudit.barcode} on Thermal Tray B.`
                  )
                }
                className="px-2 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-clinical-data text-metadata-micro font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">print</span>
                Reprint Label
              </button>
              <button
                onClick={() => setShowRawLogModal(true)}
                className="px-2 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-clinical-data text-metadata-micro font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">analytics</span>
                Analyzer Raw Log
              </button>
              <button
                onClick={() =>
                  triggerToast(
                    `Diagnostic bundle pushed to ABHA Health Locker and HL7 FHIR DiagnosticReport repository.`
                  )
                }
                className="px-2 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-clinical-data text-metadata-micro font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">send</span>
                Push to FHIR
              </button>
            </div>
          </div>

          {/* Secondary Specimen Reference Card / Hemolysis Control */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-xs">
            <div className="flex items-center justify-between">
              <span className="font-body-strong text-clinical-data text-on-surface">
                Specimen Quality Integrity
              </span>
              <span className="px-1.5 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-clinical-data-mono text-metadata-micro font-semibold">
                QC INDEX: {selectedOrder.specimenAudit.hilIndex.qcScore}
              </span>
            </div>
            <div className="flex items-center gap-space-sm mt-1">
              <img
                className="w-16 h-16 rounded-lg object-cover shadow-xs"
                alt="Laboratory vacuum blood specimen tube"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJcLJoEvEz6DFPZ0F-Qkwx5sBUZd4a8Gg-bFW3nEb1_AdcKeEfYoNt4RB2V9dJhJlPb-iI0vxFG2t1a_c0ZhgTu1c4WI05b4Z5RAUaNhNCmI5ugMm5kcJD-IFlZUqcCWEMCl2_iom9Kd56CTzxHTAZ7zDxZlqZW7twhENgOSzbR12WzjTjuDkL6j_JsRZgRAv3EQqkbRkBiIXyVbOQBvSCdu9k4Fr2imY-ExnhHGD-vGEuLIG6jCtD"
              />
              <div className="flex flex-col text-clinical-data font-clinical-data text-on-surface-variant">
                <span className="text-on-surface font-medium">HIL Analyzer Interference Index</span>
                <span className="font-clinical-data-mono text-metadata-micro text-outline">
                  Hemolysis: {selectedOrder.specimenAudit.hilIndex.hemolysis} · Icterus:{" "}
                  {selectedOrder.specimenAudit.hilIndex.icterus} · Lipemia:{" "}
                  {selectedOrder.specimenAudit.hilIndex.lipemia}
                </span>
                <span className="font-metadata-micro text-metadata-micro text-primary font-medium mt-0.5">
                  {selectedOrder.specimenAudit.hilIndex.suitability}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: PHLEBOTOMY WORKLIST */}
      {showPhlebotomyModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-2xl w-full p-6 shadow-2xl flex flex-col gap-4 border border-outline-variant animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-surface-variant">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">hub</span>
                <h3 className="font-page-title text-section-title text-on-surface font-semibold">
                  Bedside Phlebotomy Dispatch Worklist
                </h3>
              </div>
              <button
                onClick={() => setShowPhlebotomyModal(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface rounded hover:bg-surface-container cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-2 font-clinical-data text-clinical-data">
              <div className="p-3 bg-surface-container-low rounded-lg flex justify-between items-center">
                <div>
                  <span className="font-bold text-on-surface">Rahul Sharma · CCU-01</span>
                  <span className="block text-metadata-micro text-on-surface-variant">
                    hs-cTnI + CBC + Coagulation (Draw completed 14:23 IST)
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-clinical-data-mono text-metadata-micro font-bold">
                  COLLECTED
                </span>
              </div>
              <div className="p-3 bg-surface-container-low rounded-lg flex justify-between items-center">
                <div>
                  <span className="font-bold text-on-surface">Sunita Devi · CCU-02</span>
                  <span className="block text-metadata-micro text-on-surface-variant">
                    Repeat Serum K+ &amp; Arterial Blood Gas (Due 15:00 IST)
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-clinical-data-mono text-metadata-micro font-bold">
                  DISPATCHED
                </span>
              </div>
              <div className="p-3 bg-surface-container-low rounded-lg flex justify-between items-center">
                <div>
                  <span className="font-bold text-on-surface">Kavita Nair · Ward 304</span>
                  <span className="block text-metadata-micro text-on-surface-variant">
                    Fasting Lipid Profile + HbA1c Morning Batch
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-clinical-data-mono text-metadata-micro font-bold">
                  QUEUED
                </span>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-surface-variant">
              <button
                onClick={() => setShowPhlebotomyModal(false)}
                className="px-4 py-2 bg-surface-container rounded text-on-surface font-body-strong text-clinical-data cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowPhlebotomyModal(false);
                  triggerToast("Phlebotomy mobile fleet notified with CCU priority routes.");
                }}
                className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary rounded font-body-strong text-clinical-data cursor-pointer"
              >
                Dispatch Mobile Tech
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ANALYZER HEALTH & QC LOGS */}
      {showAnalyzerModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-2xl w-full p-6 shadow-2xl flex flex-col gap-4 border border-outline-variant animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-surface-variant">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">fact_check</span>
                <h3 className="font-page-title text-section-title text-on-surface font-semibold">
                  Automated Analyzer Quality Control &amp; Health
                </h3>
              </div>
              <button
                onClick={() => setShowAnalyzerModal(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface rounded hover:bg-surface-container cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-3 font-clinical-data text-clinical-data">
              <div className="p-3 bg-surface-container-low rounded-lg flex items-center justify-between">
                <div>
                  <span className="font-bold text-on-surface">Siemens Atellica IM #01</span>
                  <span className="block text-metadata-micro text-outline">
                    Chemiluminescence Immunoassay · Daily 3-Level QC passed 06:30 IST
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-clinical-data-mono text-metadata-micro font-bold">
                  99.8% QC PRECISION
                </span>
              </div>
              <div className="p-3 bg-surface-container-low rounded-lg flex items-center justify-between">
                <div>
                  <span className="font-bold text-on-surface">Sysmex XN-9100 Hematology</span>
                  <span className="block text-metadata-micro text-outline">
                    Fluorescence Flow Cytometry · Background counts nominal
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-clinical-data-mono text-metadata-micro font-bold">
                  CALIBRATED
                </span>
              </div>
              <div className="p-3 bg-surface-container-low rounded-lg flex items-center justify-between">
                <div>
                  <span className="font-bold text-on-surface">Roche Cobas 8000 Clinical Chemistry</span>
                  <span className="block text-metadata-micro text-outline">
                    Ion-Selective Electrodes &amp; Photometric Core · Zero drift
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-clinical-data-mono text-metadata-micro font-bold">
                  STABLE
                </span>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-surface-variant">
              <button
                onClick={() => setShowAnalyzerModal(false)}
                className="px-4 py-2 bg-surface-container rounded text-on-surface font-body-strong text-clinical-data cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowAnalyzerModal(false);
                  triggerToast("Self-diagnostic ping executed across all 6 core laboratory lines.");
                }}
                className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary rounded font-body-strong text-clinical-data cursor-pointer"
              >
                Run Self-Calibration Check
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: BATCH VERIFY CLEARED */}
      {showBatchVerifyModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-4 border border-outline-variant animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-surface-variant">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-xl">verified</span>
                <h3 className="font-page-title text-section-title text-on-surface font-semibold">
                  Batch Digital Verification
                </h3>
              </div>
              <button
                onClick={() => setShowBatchVerifyModal(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface rounded hover:bg-surface-container cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="font-clinical-data text-clinical-data text-on-surface-variant">
              Bulk sign and digitally verify 34 cleared laboratory results with normal reference ranges.
            </p>
            <div className="p-3 bg-surface-container-low rounded-lg flex flex-col gap-2 font-clinical-data text-clinical-data">
              <div className="flex justify-between">
                <span>Total Cleared Results:</span>
                <span className="font-clinical-data-mono font-bold text-primary">34 Parameters</span>
              </div>
              <div className="flex justify-between">
                <span>Critical Exclusions:</span>
                <span className="font-semibold text-error">4 Critical Results Held for Path Review</span>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-surface-variant">
              <button
                onClick={() => setShowBatchVerifyModal(false)}
                className="px-4 py-2 bg-surface-container rounded text-on-surface font-body-strong text-clinical-data cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowBatchVerifyModal(false);
                  triggerToast("34 diagnostic results digitally signed and pushed to EMR charts.");
                }}
                className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary rounded font-body-strong text-clinical-data cursor-pointer"
              >
                Sign &amp; Release All Cleared
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: NEW DIAGNOSTIC ORDER */}
      {showNewOrderModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-xl w-full p-6 shadow-2xl flex flex-col gap-4 border border-outline-variant animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-surface-variant">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-xl">add_circle</span>
                <h3 className="font-page-title text-section-title text-on-surface font-semibold">
                  New Diagnostic Requisition
                </h3>
              </div>
              <button
                onClick={() => setShowNewOrderModal(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface rounded hover:bg-surface-container cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-3 font-clinical-data text-clinical-data">
              <div>
                <label className="font-table-header uppercase text-on-surface-variant">Target Patient</label>
                <input
                  type="text"
                  defaultValue="Rahul Sharma · 42M · UHID-8841 · CCU-01"
                  className="w-full h-9 px-3 bg-surface-container-low rounded border border-outline-variant mt-1"
                />
              </div>
              <div>
                <label className="font-table-header uppercase text-on-surface-variant">Investigation / Panel</label>
                <input
                  type="text"
                  defaultValue="High-Sensitivity Cardiac Troponin I (hs-cTnI) Repeat (3h Serial)"
                  className="w-full h-9 px-3 bg-surface-container-low rounded border border-outline-variant mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-table-header uppercase text-on-surface-variant">Priority</label>
                  <select className="w-full h-9 px-3 bg-surface-container-low rounded border border-outline-variant mt-1">
                    <option>STAT Emergency (&lt;30m)</option>
                    <option>Urgent (&lt;90m)</option>
                    <option>Routine</option>
                  </select>
                </div>
                <div>
                  <label className="font-table-header uppercase text-on-surface-variant">Tube / Specimen</label>
                  <select className="w-full h-9 px-3 bg-surface-container-low rounded border border-outline-variant mt-1">
                    <option>Green Top Lithium Heparin (4.0 mL)</option>
                    <option>Purple Top EDTA (3.0 mL)</option>
                    <option>Gold Top SST (5.0 mL)</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-surface-variant">
              <button
                onClick={() => setShowNewOrderModal(false)}
                className="px-4 py-2 bg-surface-container rounded text-on-surface font-body-strong text-clinical-data cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowNewOrderModal(false);
                  triggerToast("Diagnostic Order ORD-2026-99222 dispatched to Phlebotomy Bedside Queue.");
                }}
                className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary rounded font-body-strong text-clinical-data cursor-pointer"
              >
                Create &amp; Dispatch Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: 12-LEAD ECG TRACE VIEWER */}
      {showTraceModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-3xl w-full p-6 shadow-2xl flex flex-col gap-4 border border-outline-variant animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-surface-variant">
              <div className="flex items-center gap-2 text-error">
                <span className="material-symbols-outlined text-xl">ecg</span>
                <h3 className="font-page-title text-section-title text-on-surface font-semibold">
                  12-Lead Electrocardiogram Trace · Rahul Sharma (CCU-01)
                </h3>
              </div>
              <button
                onClick={() => setShowTraceModal(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface rounded hover:bg-surface-container cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-4 bg-surface-container-high rounded-lg flex flex-col gap-2">
              <div className="flex justify-between font-clinical-data-mono text-metadata-micro text-error font-bold">
                <span>LEAD V2 - V4: +3.2mm ST SEGMENT ELEVATION</span>
                <span>RECIPROCAL DEPRESSION III, aVF</span>
              </div>
              <div className="w-full h-36 bg-surface-container-lowest rounded p-2 overflow-hidden flex items-center justify-center border border-outline-variant/30">
                <svg className="w-full h-full text-error" fill="none" preserveAspectRatio="none" viewBox="0 0 600 60">
                  <path
                    d="M0,30 L30,30 L35,27 L40,33 L45,30 L55,30 L60,10 L68,52 L73,15 L80,30 L110,30 L115,27 L120,33 L125,30 L135,30 L140,10 L148,52 L153,15 L160,30 L190,30 L195,27 L200,33 L205,30 L215,30 L220,10 L228,52 L233,15 L240,30 L270,30 L275,27 L280,33 L285,30 L295,30 L300,10 L308,52 L313,15 L320,30 L350,30 L355,27 L360,33 L365,30 L375,30 L380,10 L388,52 L393,15 L400,30 L430,30 L435,27 L440,33 L445,30 L455,30 L460,10 L468,52 L473,15 L480,30 L510,30 L515,27 L520,33 L525,30 L535,30 L540,10 L548,52 L553,15 L560,30 L600,30"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                Acquired: Today 14:24 IST · Device: GE MAC 5500HD · Auto-interpreted by Marquette 12SL
              </span>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-surface-variant">
              <button
                onClick={() => setShowTraceModal(false)}
                className="px-4 py-2 bg-surface-container rounded text-on-surface font-body-strong text-clinical-data cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowTraceModal(false);
                  triggerToast("Full 12-lead vector PDF sent to printer and linked to Cath Lab suite.");
                }}
                className="px-4 py-2 bg-error text-on-error rounded font-body-strong text-clinical-data cursor-pointer"
              >
                Print 12-Lead Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: ANALYZER RAW LOG */}
      {showRawLogModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-4 border border-outline-variant animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-surface-variant">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-xl">analytics</span>
                <h3 className="font-page-title text-section-title text-on-surface font-semibold">
                  Analyzer Raw Data Stream
                </h3>
              </div>
              <button
                onClick={() => setShowRawLogModal(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface rounded hover:bg-surface-container cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-3 bg-surface-container-low rounded-lg font-clinical-data-mono text-metadata-micro flex flex-col gap-1 text-on-surface">
              <div>[14:32:04] TUBE_BARCODE=#990142-01 RACK=04 POS=B2</div>
              <div>[14:32:11] SAMPLE_ASPIRATED=15.0uL DILUTION=1:1 REAGENT_LOT=ATEL-9901A</div>
              <div>[14:32:25] INCUBATION_TEMP=37.02C PHOTOMULTIPLIER_VOLTAGE=840V</div>
              <div>[14:32:40] CHEMILUMINESCENCE_RLU=148201 BLANK_SUB=120 RLU_DELTA=+148081</div>
              <div>[14:32:55] ESTIMATED_CONCENTRATION=RUNNING CALIBRATION_CURVE=4PL PASS</div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-surface-variant">
              <button
                onClick={() => setShowRawLogModal(false)}
                className="px-4 py-2 bg-surface-container rounded text-on-surface font-body-strong text-clinical-data cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowRawLogModal(false);
                  triggerToast("Raw telemetry logs exported.");
                }}
                className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary rounded font-body-strong text-clinical-data cursor-pointer"
              >
                Export Raw Hex Dump
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
