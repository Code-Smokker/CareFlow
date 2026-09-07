"use client";

import React, { useState } from "react";

interface MedicationItem {
  id: string;
  name: string;
  dosage: string;
  instructions: string;
  batch: string;
  expiry: string;
  bin: string;
  qty: string;
  barcode: string;
  scanned: boolean;
}

interface SafetyIntercept {
  title: string;
  status: "CLEARED" | "OVERRIDE VERIFIED" | "VALIDATED" | "WARNING";
  statusColor: string;
  description: string;
  icon: string;
}

interface PharmacyOrder {
  id: string;
  time: string;
  priority: "STAT P1" | "Discharge Pack" | "P1 HIGH PRIORITY" | "STAT RESUS" | "Routine ER" | "Restricted Narcotic";
  priorityClass: string;
  category: "all" | "stat" | "ipd" | "opd" | "restricted";
  patient: {
    name: string;
    ageGender: string;
    uhid: string;
    bed: string;
    bedColorClass: string;
  };
  prescriber: {
    name: string;
    regNo: string;
    department: string;
  };
  medications: MedicationItem[];
  stockBin: string;
  safetySummary: {
    badge: string;
    badgeClass: string;
    note: string;
    icon: string;
  };
  status: "DISPENSED" | "PACKAGED" | "VERIFYING" | "DISPATCHED" | "READY";
  statusClass: string;
  statusDetail: string;
  safetyIntercepts: SafetyIntercept[];
  pharmacist: {
    name: string;
    regNo: string;
    signedTime: string;
  };
}

const PHARMACY_ORDERS: PharmacyOrder[] = [
  {
    id: "RX-2026-99214",
    time: "14:24 IST",
    priority: "STAT P1",
    priorityClass: "bg-error text-on-error font-bold",
    category: "stat",
    patient: {
      name: "Rahul Sharma",
      ageGender: "42M",
      uhid: "DEL-2024-8841",
      bed: "CCU-01",
      bedColorClass: "text-error",
    },
    prescriber: {
      name: "Dr. Rohit Verma",
      regNo: "MCI-2009-08821",
      department: "Cardiology · Attending",
    },
    medications: [
      {
        id: "m1",
        name: "Tab Ticagrelor 90mg (Brilinta)",
        dosage: "180mg Loading STAT",
        instructions: "2 tabs STAT for Primary PCI prep",
        batch: "BTL-90-2024A",
        expiry: "DEC 2026",
        bin: "Bin 42-A",
        qty: "2 Tabs",
        barcode: "890103294821",
        scanned: true,
      },
      {
        id: "m2",
        name: "Tab Aspirin 325mg (Ecosprin Chew)",
        dosage: "325mg Chewable STAT",
        instructions: "Chew immediately with water",
        batch: "ASP-325-88",
        expiry: "NOV 2025",
        bin: "Bin 12-C",
        qty: "1 Tab",
        barcode: "890123984120",
        scanned: true,
      },
      {
        id: "m3",
        name: "Tab Atorvastatin 80mg (Atorva)",
        dosage: "80mg OD (STAT Dose)",
        instructions: "Oral after loading",
        batch: "ATV-80-99",
        expiry: "JAN 2027",
        bin: "Bin 15-B",
        qty: "1 Tab",
        barcode: "890459203911",
        scanned: true,
      },
      {
        id: "m4",
        name: "Inj Unfractionated Heparin 5000 IU",
        dosage: "5000 IU IV Bolus",
        instructions: "Direct IV Push via central/peripheral line",
        batch: "HEP-5K-01",
        expiry: "AUG 2025",
        bin: "Emergency Tray",
        qty: "1 Vial",
        barcode: "890881920194",
        scanned: true,
      },
    ],
    stockBin: "Bin #42",
    safetySummary: {
      badge: "Allergy Cleared",
      badgeClass: "bg-primary-fixed text-on-primary-fixed-variant",
      note: "Aspirin Override + IV Pantoprazole",
      icon: "verified",
    },
    status: "DISPENSED",
    statusClass: "bg-primary text-on-primary",
    statusDetail: "Nurse Ancy (CCU)",
    safetyIntercepts: [
      {
        title: "Allergy Cross-Check: Penicillin Anaphylaxis",
        status: "CLEARED",
        statusColor: "bg-primary-fixed text-on-primary-fixed-variant",
        description: "Confirmed: ZERO beta-lactam components in acute coronary bundle. No cross-reactivity triggers detected.",
        icon: "shield",
      },
      {
        title: "Aspirin Gastric Sensitivity Override",
        status: "OVERRIDE VERIFIED",
        statusColor: "bg-secondary-container text-on-secondary-container",
        description: "Prescribed concomitantly with IV Pantoprazole 40mg mucosa protectant. Attending physician signed high-risk override at 14:23.",
        icon: "report",
      },
      {
        title: "Dual Antiplatelet (DAPT) Dosing",
        status: "VALIDATED",
        statusColor: "bg-primary-fixed text-on-primary-fixed-variant",
        description: "Ticagrelor 180mg STAT Loading (90mg x 2 tabs) compliant with ACC/AHA STEMI Guideline protocols for acute PCI preparation.",
        icon: "verified",
      },
    ],
    pharmacist: {
      name: "K. Ramanathan, B.Pharm",
      regNo: "DPC-88192 · Chief Dispensing Pharmacist",
      signedTime: "Today 14:26:15 IST",
    },
  },
  {
    id: "RX-2026-99220",
    time: "14:32 IST",
    priority: "Discharge Pack",
    priorityClass: "bg-surface-container text-on-surface-variant font-semibold",
    category: "opd",
    patient: {
      name: "Priya Sundaram",
      ageGender: "38F",
      uhid: "DEL-2024-4920",
      bed: "Ward 308-B",
      bedColorClass: "text-on-surface-variant",
    },
    prescriber: {
      name: "Dr. P. Mehta",
      regNo: "MCI-2012-04319",
      department: "Gen Surgery · Unit II",
    },
    medications: [
      {
        id: "m5",
        name: "Tab Cefuroxime Axetil 500mg",
        dosage: "500mg BD x 5 days",
        instructions: "Post meals morning and evening",
        batch: "CFX-500-12",
        expiry: "MAR 2026",
        bin: "Bin 18-A",
        qty: "10 Tabs",
        barcode: "890204918230",
        scanned: true,
      },
      {
        id: "m6",
        name: "Tab Paracetamol 650mg",
        dosage: "650mg SOS for pain > 4/10",
        instructions: "Minimum 6 hours gap between doses",
        batch: "PCM-650-77",
        expiry: "OCT 2026",
        bin: "Bin 04-D",
        qty: "15 Tabs",
        barcode: "890334819023",
        scanned: true,
      },
      {
        id: "m7",
        name: "Tab Pantoprazole 40mg",
        dosage: "40mg OD x 7 days",
        instructions: "Empty stomach 30 mins before breakfast",
        batch: "PAN-40-60",
        expiry: "FEB 2027",
        bin: "Bin 08-B",
        qty: "7 Tabs",
        barcode: "890998120441",
        scanned: true,
      },
    ],
    stockBin: "Bin #18",
    safetySummary: {
      badge: "Interactions Clean",
      badgeClass: "bg-surface-container text-primary",
      note: "No hepatic or renal flags",
      icon: "check_circle",
    },
    status: "PACKAGED",
    statusClass: "bg-tertiary-container text-on-tertiary-container",
    statusDetail: "Discharge Bag #402",
    safetyIntercepts: [
      {
        title: "Allergy Screening: Cephalosporins",
        status: "CLEARED",
        statusColor: "bg-primary-fixed text-on-primary-fixed-variant",
        description: "Patient EHR record confirms no history of beta-lactam or cephalosporin hypersensitivity.",
        icon: "shield",
      },
      {
        title: "Drug-Drug Interaction Analysis",
        status: "VALIDATED",
        statusColor: "bg-primary-fixed text-on-primary-fixed-variant",
        description: "Zero significant CYP450 interactions detected between Cefuroxime, Paracetamol, and Pantoprazole.",
        icon: "verified",
      },
      {
        title: "Discharge Counseling Protocol",
        status: "VALIDATED",
        statusColor: "bg-primary-fixed text-on-primary-fixed-variant",
        description: "Bilingual patient information leaflet (English/Hindi) generated with pictorial dosage schedule.",
        icon: "fact_check",
      },
    ],
    pharmacist: {
      name: "S. Swaminathan, M.Pharm",
      regNo: "DPC-94021 · Senior Clinical Pharmacist",
      signedTime: "Today 14:35:40 IST",
    },
  },
  {
    id: "RX-2026-99228",
    time: "14:40 IST",
    priority: "P1 HIGH PRIORITY",
    priorityClass: "bg-secondary-container text-on-secondary-container font-bold",
    category: "ipd",
    patient: {
      name: "Sunita Devi",
      ageGender: "58F",
      uhid: "DEL-2024-7104",
      bed: "CCU-02",
      bedColorClass: "text-error",
    },
    prescriber: {
      name: "Dr. S. Kulkarni",
      regNo: "MCI-2015-09122",
      department: "Cardiology · Senior Reg",
    },
    medications: [
      {
        id: "m8",
        name: "Inj Furosemide (Lasix) 40mg",
        dosage: "40mg IV STAT Slow Push",
        instructions: "Administer over 2-3 mins via IV cannula",
        batch: "LAS-40-44",
        expiry: "MAY 2026",
        bin: "Bin 09-A",
        qty: "2 Amps",
        barcode: "890554129038",
        scanned: true,
      },
      {
        id: "m9",
        name: "Tab Spironolactone 25mg",
        dosage: "25mg OD Post-Lunch",
        instructions: "Monitor serum potassium at 24h",
        batch: "SPI-25-18",
        expiry: "NOV 2026",
        bin: "Bin 11-C",
        qty: "14 Tabs",
        barcode: "890887162534",
        scanned: true,
      },
      {
        id: "m10",
        name: "Tab Sacubitril/Valsartan 24/26mg",
        dosage: "24/26mg BD",
        instructions: "Target dose titration post acute phase",
        batch: "SAC-50-91",
        expiry: "SEP 2026",
        bin: "Bin 21-A",
        qty: "14 Tabs",
        barcode: "890119283746",
        scanned: false,
      },
    ],
    stockBin: "Bin #09",
    safetySummary: {
      badge: "Renal: eGFR 48 mL/min",
      badgeClass: "bg-surface-container text-on-surface",
      note: "Potassium monitored (4.2 mEq/L)",
      icon: "analytics",
    },
    status: "VERIFYING",
    statusClass: "bg-secondary text-on-secondary animate-pulse",
    statusDetail: "Pharm. Ramanathan",
    safetyIntercepts: [
      {
        title: "Renal Clearance eGFR Screening",
        status: "VALIDATED",
        statusColor: "bg-primary-fixed text-on-primary-fixed-variant",
        description: "Patient eGFR 48 mL/min (CKD Stage 3a). Starting dosage of Sacubitril/Valsartan adjusted to lowest 24/26mg tier safely.",
        icon: "analytics",
      },
      {
        title: "Hyperkalemia Dual Aldosterone Alert",
        status: "OVERRIDE VERIFIED",
        statusColor: "bg-secondary-container text-on-secondary-container",
        description: "Concomitant Spironolactone + ARNI requires daily K+ monitoring. Attending signed lab monitoring trigger.",
        icon: "report",
      },
      {
        title: "Blood Pressure Parameter Intercept",
        status: "CLEARED",
        statusColor: "bg-primary-fixed text-on-primary-fixed-variant",
        description: "Current BP 138/84 mmHg. Meets guideline threshold (>100 mmHg systolic) for ARNI initiation.",
        icon: "verified",
      },
    ],
    pharmacist: {
      name: "K. Ramanathan, B.Pharm",
      regNo: "DPC-88192 · Chief Dispensing Pharmacist",
      signedTime: "In-Review (Pending Final Barcode)",
    },
  },
  {
    id: "RX-2026-99235",
    time: "14:48 IST",
    priority: "STAT RESUS",
    priorityClass: "bg-error text-on-error font-bold",
    category: "stat",
    patient: {
      name: "Harish Chandra",
      ageGender: "64M",
      uhid: "DEL-2024-1082",
      bed: "HDU-04",
      bedColorClass: "text-secondary",
    },
    prescriber: {
      name: "Dr. S. Kulkarni",
      regNo: "MCI-2015-09122",
      department: "Nephro / HDU",
    },
    medications: [
      {
        id: "m11",
        name: "Inj Calcium Gluconate 10% 10ml",
        dosage: "10ml IV STAT over 5 mins",
        instructions: "Cardioprotection for severe hyperkalemia under cardiac monitor",
        batch: "CAG-10-82",
        expiry: "JAN 2026",
        bin: "Fridge (Cold)",
        qty: "1 Amp",
        barcode: "890772183920",
        scanned: true,
      },
      {
        id: "m12",
        name: "25% Dextrose 100ml + 10U Regular Insulin",
        dosage: "IV Infusion over 30 mins",
        instructions: "Intracellular potassium shift regimen with blood sugar checks at 30m, 60m",
        batch: "DEX-25-10U",
        expiry: "AUG 2025",
        bin: "Cold Box 02",
        qty: "1 Pack",
        barcode: "890443918273",
        scanned: true,
      },
    ],
    stockBin: "Fridge (Cold)",
    safetySummary: {
      badge: "K+ 6.8 mEq/L Urgent",
      badgeClass: "bg-error-container text-on-error-container font-bold",
      note: "Telemetry ECG Peaked T-waves",
      icon: "priority_high",
    },
    status: "DISPATCHED",
    statusClass: "bg-primary text-on-primary",
    statusDetail: "ALS Code Runner",
    safetyIntercepts: [
      {
        title: "Critical Lab Value Verification",
        status: "CLEARED",
        statusColor: "bg-error text-on-error",
        description: "Verified STAT Point-of-Care K+ 6.8 mEq/L confirmed by Central Biochemistry Lab. Immediate membrane stabilization indicated.",
        icon: "emergency",
      },
      {
        title: "Insulin-Dextrose Ratio Compliance",
        status: "VALIDATED",
        statusColor: "bg-primary-fixed text-on-primary-fixed-variant",
        description: "10 Units Regular Actrapid in 100ml 25% Dextrose (25g glucose) complies with hospital severe hyperkalemia protocol.",
        icon: "verified",
      },
    ],
    pharmacist: {
      name: "T. Sengupta, M.Pharm",
      regNo: "DPC-76210 · Critical Care Pharmacist",
      signedTime: "Today 14:49:10 IST",
    },
  },
  {
    id: "RX-2026-99241",
    time: "14:52 IST",
    priority: "Routine ER",
    priorityClass: "bg-surface-container text-on-surface-variant font-semibold",
    category: "ipd",
    patient: {
      name: "Mohammad Farooq",
      ageGender: "67M",
      uhid: "DEL-2024-3044",
      bed: "Resus 03",
      bedColorClass: "text-on-surface-variant",
    },
    prescriber: {
      name: "Dr. M. Chacko",
      regNo: "MCI-2018-05211",
      department: "Pulmonology",
    },
    medications: [
      {
        id: "m13",
        name: "Duolin Respules (L-Salbutamol+Ipra)",
        dosage: "1 Respule Nebulisation STAT x 3",
        instructions: "Every 20 mins with oxygen flow 6-8 L/min",
        batch: "DUO-25-33",
        expiry: "MAR 2027",
        bin: "Bin 27-B",
        qty: "3 Respules",
        barcode: "890665129381",
        scanned: true,
      },
      {
        id: "m14",
        name: "Budecort 0.5mg Respules",
        dosage: "0.5mg Nebulisation BD",
        instructions: "Administer after bronchodilator respule",
        batch: "BUD-05-90",
        expiry: "JUN 2026",
        bin: "Bin 27-C",
        qty: "2 Respules",
        barcode: "890223910294",
        scanned: true,
      },
    ],
    stockBin: "Bin #27",
    safetySummary: {
      badge: "Clean",
      badgeClass: "bg-surface-container text-primary",
      note: "Standard Bronchodilator Protocol",
      icon: "check_circle",
    },
    status: "READY",
    statusClass: "bg-secondary-container text-on-secondary-container",
    statusDetail: "Bin Cart 04",
    safetyIntercepts: [
      {
        title: "Tachycardia & Arrhythmia Cross-Check",
        status: "CLEARED",
        statusColor: "bg-primary-fixed text-on-primary-fixed-variant",
        description: "Baseline pulse 92 bpm, sinus rhythm. Levosalbutamol preferred to minimize beta-1 adrenergic cardiac stimulation.",
        icon: "shield",
      },
      {
        title: "Steroid Inhaler Post-Care Alert",
        status: "VALIDATED",
        statusColor: "bg-primary-fixed text-on-primary-fixed-variant",
        description: "Nursing instruction to rinse mouth post budesonide nebulization attached to medication bag.",
        icon: "fact_check",
      },
    ],
    pharmacist: {
      name: "K. Ramanathan, B.Pharm",
      regNo: "DPC-88192 · Chief Dispensing Pharmacist",
      signedTime: "Today 14:54:22 IST",
    },
  },
  {
    id: "RX-2026-99249",
    time: "15:02 IST",
    priority: "Restricted Narcotic",
    priorityClass: "bg-error text-on-error font-bold",
    category: "restricted",
    patient: {
      name: "Devendra Joshi",
      ageGender: "51M",
      uhid: "DEL-2024-5519",
      bed: "Surg ICU-03",
      bedColorClass: "text-error",
    },
    prescriber: {
      name: "Dr. K. Anand",
      regNo: "MCI-2004-01928",
      department: "Anesthesia / Pain Medicine",
    },
    medications: [
      {
        id: "m15",
        name: "Inj Fentanyl 50mcg/ml (2ml Ampoule)",
        dosage: "50mcg IV STAT post-op",
        instructions: "Schedule X NDPS dual-witness sign-off required",
        batch: "FNT-50-01X",
        expiry: "DEC 2025",
        bin: "Narcotics Safe #1",
        qty: "1 Ampoule",
        barcode: "890998811223",
        scanned: true,
      },
    ],
    stockBin: "Narcotics Safe",
    safetySummary: {
      badge: "Schedule X / NDPS Strict",
      badgeClass: "bg-error-container text-on-error-container font-bold",
      note: "Dual Biometric Signatures Required",
      icon: "lock",
    },
    status: "VERIFYING",
    statusClass: "bg-secondary text-on-secondary animate-pulse",
    statusDetail: "Requires 2nd Witness",
    safetyIntercepts: [
      {
        title: "NDPS Central Register Dual Key Check",
        status: "OVERRIDE VERIFIED",
        statusColor: "bg-error-container text-on-error-container font-bold",
        description: "Physical dual-lock narcotic vault accessed. Verified batch number entered in Form 3C Controlled Register.",
        icon: "lock",
      },
      {
        title: "Respiratory Depression & Naloxone Stock Check",
        status: "CLEARED",
        statusColor: "bg-primary-fixed text-on-primary-fixed-variant",
        description: "Patient on continuous EtCO2 & SpO2 monitor. Inj Naloxone 0.4mg bedside emergency kit confirmed active.",
        icon: "verified_user",
      },
    ],
    pharmacist: {
      name: "K. Ramanathan, B.Pharm",
      regNo: "DPC-88192 · Chief Dispensing Pharmacist",
      signedTime: "Witness 1 Recorded",
    },
  },
];

export default function PharmacyAndDispensingPage() {
  const [activeTab, setActiveTab] = useState<"all" | "stat" | "ipd" | "opd" | "restricted">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<string>("RX-2026-99214");

  // Modal States
  const [showStockAuditModal, setShowStockAuditModal] = useState(false);
  const [showControlledRegisterModal, setShowControlledRegisterModal] = useState(false);
  const [showBatchDispenseModal, setShowBatchDispenseModal] = useState(false);
  const [showDirectRxModal, setShowDirectRxModal] = useState(false);
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [showTubeModal, setShowTubeModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showDiagnosticsModal, setShowDiagnosticsModal] = useState(false);
  const [showIndentModal, setShowIndentModal] = useState(false);
  const [indentItemName, setIndentItemName] = useState("");

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const selectedOrder =
    PHARMACY_ORDERS.find((o) => o.id === selectedOrderId) || PHARMACY_ORDERS[0];

  const filteredOrders = PHARMACY_ORDERS.filter((order) => {
    if (activeTab === "stat" && order.category !== "stat") return false;
    if (activeTab === "ipd" && order.category !== "ipd") return false;
    if (activeTab === "opd" && order.category !== "opd") return false;
    if (activeTab === "restricted" && order.category !== "restricted") return false;

    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      order.id.toLowerCase().includes(query) ||
      order.patient.name.toLowerCase().includes(query) ||
      order.patient.uhid.toLowerCase().includes(query) ||
      order.patient.bed.toLowerCase().includes(query) ||
      order.prescriber.name.toLowerCase().includes(query) ||
      order.medications.some((m) => m.name.toLowerCase().includes(query))
    );
  });

  const handleIndent = (itemName: string) => {
    setIndentItemName(itemName);
    setShowIndentModal(true);
  };

  return (
    <div className="flex flex-col w-full gap-space-md">
      {/* FLOATING TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-on-primary px-gutter-normal py-space-sm rounded-xl shadow-2xl flex items-center gap-space-sm animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="material-symbols-outlined text-xl">check_circle</span>
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

      {/* TOP HEADER & TITLE STRIP */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-sm bg-surface-container-lowest p-space-panel-padding rounded-xl shadow-sm">
        <div className="flex flex-col">
          <div className="flex items-center gap-space-xs mb-0.5">
            <span className="inline-flex items-center justify-center p-1 bg-primary text-on-primary rounded">
              <span className="material-symbols-outlined text-sm">medication</span>
            </span>
            <span className="font-metadata-micro text-metadata-micro text-primary uppercase font-bold tracking-wider">
              In-House Pharmacy Services · Central Node
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-surface-container text-on-surface-variant rounded font-clinical-data-mono text-metadata-micro font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-primary inline-block animate-pulse"></span> CDSCO / NABH Compliant
            </span>
          </div>
          <h1 className="font-page-title text-page-title text-on-surface tracking-tight">
            Pharmacy &amp; Dispensing
          </h1>
          <p className="font-clinical-data text-clinical-data text-on-surface-variant">
            Central in-house pharmacy dispensing queue, e-prescription validation, formulary stock control, and clinical safety intercepts.
          </p>
        </div>
        {/* Right Header Actions */}
        <div className="flex flex-wrap items-center gap-space-xs">
          <button
            onClick={() => setShowStockAuditModal(true)}
            className="flex items-center gap-1.5 h-9 px-space-sm bg-surface-container hover:bg-surface-container-high text-on-surface font-body-strong text-clinical-data rounded transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm text-secondary">inventory_2</span>
            <span>Stock Inventory Audit</span>
          </button>
          <button
            onClick={() => setShowControlledRegisterModal(true)}
            className="flex items-center gap-1.5 h-9 px-space-sm bg-surface-container hover:bg-surface-container-high text-on-surface font-body-strong text-clinical-data rounded transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm text-error">lock</span>
            <span>Controlled Drug Register</span>
          </button>
          <button
            onClick={() => setShowBatchDispenseModal(true)}
            className="flex items-center gap-1.5 h-9 px-space-sm bg-secondary-container hover:bg-secondary-fixed text-on-secondary-container font-body-strong text-clinical-data rounded transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">checklist_rtl</span>
            <span>Batch Dispense Verified</span>
          </button>
          <button
            onClick={() => setShowDirectRxModal(true)}
            className="flex items-center gap-1.5 h-9 px-space-md bg-primary hover:bg-primary-container text-on-primary font-body-strong text-clinical-data rounded shadow-sm transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>+ Direct Walk-in Rx</span>
          </button>
        </div>
      </div>

      {/* PHARMACY FACILITY SELECTOR & QUEUE CONTROLS */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-space-sm bg-surface-container-lowest p-space-sm rounded-xl shadow-sm">
        <div className="flex flex-wrap items-center gap-space-xs">
          <div className="flex items-center gap-1.5 px-space-sm py-1.5 bg-surface-container-low rounded text-on-surface font-clinical-data text-clinical-data">
            <span className="material-symbols-outlined text-primary text-base">domain</span>
            <span className="font-semibold text-on-surface">Apollo Central Inpatient &amp; Emergency Pharmacy</span>
            <span className="text-on-surface-variant font-metadata-micro">(Main Wing - Gr Floor)</span>
          </div>
          <div className="h-5 w-px bg-surface-variant mx-1 hidden lg:block"></div>
          {/* Queue Category Tabs */}
          <div className="flex flex-wrap items-center gap-1">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-space-sm py-1 rounded font-body-strong text-clinical-data transition-colors cursor-pointer ${
                activeTab === "all"
                  ? "bg-primary text-on-primary shadow-sm"
                  : "bg-surface-container-low hover:bg-surface-container text-on-surface-variant"
              }`}
            >
              All Orders (312)
            </button>
            <button
              onClick={() => setActiveTab("stat")}
              className={`flex items-center gap-1 px-space-sm py-1 rounded font-body-strong text-clinical-data transition-colors cursor-pointer ${
                activeTab === "stat"
                  ? "bg-error text-on-error shadow-sm"
                  : "bg-surface-container-low hover:bg-surface-container text-error"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-error animate-ping"></span>
              Emergency STAT (03)
            </button>
            <button
              onClick={() => setActiveTab("ipd")}
              className={`px-space-sm py-1 rounded font-body-strong text-clinical-data transition-colors cursor-pointer ${
                activeTab === "ipd"
                  ? "bg-primary text-on-primary shadow-sm"
                  : "bg-surface-container-low hover:bg-surface-container text-on-surface-variant"
              }`}
            >
              IPD Ward Dispensing
            </button>
            <button
              onClick={() => setActiveTab("opd")}
              className={`px-space-sm py-1 rounded font-body-strong text-clinical-data transition-colors cursor-pointer ${
                activeTab === "opd"
                  ? "bg-primary text-on-primary shadow-sm"
                  : "bg-surface-container-low hover:bg-surface-container text-on-surface-variant"
              }`}
            >
              OPD Discharge Kits
            </button>
            <button
              onClick={() => setActiveTab("restricted")}
              className={`flex items-center gap-1 px-space-sm py-1 rounded font-body-strong text-clinical-data transition-colors cursor-pointer ${
                activeTab === "restricted"
                  ? "bg-error text-on-error shadow-sm"
                  : "bg-surface-container-low hover:bg-surface-container text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-xs text-error">shield</span>
              Restricted / Narcotics (Sch H/X)
            </button>
          </div>
        </div>
        {/* Universal Search Bar */}
        <div className="relative w-full xl:w-96">
          <span className="material-symbols-outlined absolute left-space-sm top-2.5 text-outline text-base">
            search
          </span>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-8 bg-surface-container-low text-on-surface font-clinical-data text-clinical-data rounded focus:outline-none focus:bg-surface-container-lowest placeholder:text-outline shadow-inner"
            placeholder="Search Rx ID, Patient, Bed #, Molecule or Clinician..."
            type="text"
          />
          <span className="material-symbols-outlined absolute right-space-sm top-2.5 text-outline text-sm">
            barcode_scanner
          </span>
        </div>
      </div>

      {/* KPI TELEMETRY STRIP (7 Metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-7 gap-space-xs">
        {/* Total Today */}
        <div className="flex flex-col justify-between p-space-sm bg-surface-container-lowest rounded-lg shadow-sm">
          <span className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase tracking-wider">
            Prescriptions Today
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="font-clinical-data-mono text-section-title text-on-surface font-bold">312</span>
            <span className="font-metadata-micro text-metadata-micro text-primary flex items-center">↑ 8.2%</span>
          </div>
          <div className="w-full bg-surface-container h-1 rounded-full mt-2 overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: "82%" }}></div>
          </div>
        </div>
        {/* Pending Review */}
        <div className="flex flex-col justify-between p-space-sm bg-surface-container-lowest rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase tracking-wider">
              Pharmacist Review
            </span>
            <span className="h-2 w-2 rounded-full bg-secondary"></span>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="font-clinical-data-mono text-section-title text-secondary font-bold">14</span>
            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">Awaiting clearance</span>
          </div>
          <span className="font-metadata-micro text-metadata-micro text-outline truncate mt-1">
            Avg turnaround 3.4 min
          </span>
        </div>
        {/* STAT In-Flight */}
        <div className="flex flex-col justify-between p-space-sm bg-surface-container-lowest rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-metadata-micro text-metadata-micro text-error uppercase tracking-wider font-bold">
              STAT In-Flight
            </span>
            <span className="material-symbols-outlined text-error text-sm animate-pulse">emergency</span>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="font-clinical-data-mono text-section-title text-error font-bold">03</span>
            <span className="font-metadata-micro text-metadata-micro text-error font-semibold">&lt; 10 min ETA</span>
          </div>
          <span className="font-metadata-micro text-metadata-micro text-on-surface-variant truncate mt-1">
            Cath Lab &amp; Resus
          </span>
        </div>
        {/* Ready for Pickup */}
        <div className="flex flex-col justify-between p-space-sm bg-surface-container-lowest rounded-lg shadow-sm">
          <span className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase tracking-wider">
            Ready for Ward / Tube
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="font-clinical-data-mono text-section-title text-tertiary font-bold">28</span>
            <span className="font-metadata-micro text-metadata-micro text-tertiary">Packaged</span>
          </div>
          <span className="font-metadata-micro text-metadata-micro text-outline truncate mt-1">
            Pneumatic Tray B active
          </span>
        </div>
        {/* Dispensed Today */}
        <div className="flex flex-col justify-between p-space-sm bg-surface-container-lowest rounded-lg shadow-sm">
          <span className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase tracking-wider">
            Dispensed Today
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="font-clinical-data-mono text-section-title text-primary font-bold">267</span>
            <span className="font-metadata-micro text-metadata-micro text-primary font-semibold">0 Errors</span>
          </div>
          <span className="font-metadata-micro text-metadata-micro text-outline truncate mt-1">
            98.9% First-pass audit
          </span>
        </div>
        {/* Low Stock */}
        <div className="flex flex-col justify-between p-space-sm bg-surface-container-lowest rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase tracking-wider">
              Stock Warnings
            </span>
            <span className="material-symbols-outlined text-secondary text-sm">warning</span>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="font-clinical-data-mono text-section-title text-on-surface font-bold">04</span>
            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">Formulary</span>
          </div>
          <span className="font-metadata-micro text-metadata-micro text-outline truncate mt-1">
            Tenecteplase 50mg (1 left)
          </span>
        </div>
        {/* Safety Intercepts */}
        <div className="flex flex-col justify-between p-space-sm bg-surface-container-lowest rounded-lg shadow-sm col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="font-metadata-micro text-metadata-micro text-primary uppercase tracking-wider font-bold">
              Safety Intercepts
            </span>
            <span className="material-symbols-outlined text-primary text-sm">security</span>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="font-clinical-data-mono text-section-title text-primary font-bold">06</span>
            <span className="font-metadata-micro text-metadata-micro text-primary font-semibold">Prevented</span>
          </div>
          <span className="font-metadata-micro text-metadata-micro text-outline truncate mt-1">
            Dose / Allergy blocks
          </span>
        </div>
      </div>

      {/* MAIN 2-COLUMN WORKSPACE (66% Queue left, 34% Dispensing Verification right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
        {/* LEFT COLUMN: PRESCRIPTION QUEUE (lg:col-span-8) */}
        <div className="lg:col-span-8 flex flex-col gap-space-sm">
          {/* Queue Table Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
            {/* Table Header Bar */}
            <div className="flex items-center justify-between px-space-md py-space-sm bg-surface-container-low">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-base">view_list</span>
                <h2 className="font-section-title text-body-strong text-on-surface uppercase tracking-wider">
                  Active Pharmacy Prescription Queue
                </h2>
                <span className="px-2 py-0.5 bg-primary-fixed text-on-primary-fixed-variant rounded font-clinical-data-mono text-metadata-micro font-bold">
                  LIVE SYNC
                </span>
              </div>
              <div className="flex items-center gap-space-xs text-metadata-micro font-clinical-data text-on-surface-variant">
                <span>Showing {filteredOrders.length} of 312 active Rx</span>
                <button
                  onClick={() => triggerToast("Live pharmacy queue refreshed with Central HIS!")}
                  className="p-1 hover:bg-surface-container rounded transition-colors text-on-surface cursor-pointer"
                  title="Refresh Live Queue"
                >
                  <span className="material-symbols-outlined text-sm">refresh</span>
                </button>
              </div>
            </div>

            {/* Density-Optimized Clinical Queue Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-clinical-data text-clinical-data">
                <thead>
                  <tr className="bg-surface-container text-on-surface-variant font-table-header text-table-header uppercase tracking-wider">
                    <th className="py-2.5 px-3">Rx ID &amp; Time</th>
                    <th className="py-2.5 px-3">Patient &amp; Bed #</th>
                    <th className="py-2.5 px-3">Prescriber</th>
                    <th className="py-2.5 px-3">Medications &amp; Dosage</th>
                    <th className="py-2.5 px-3">Stock</th>
                    <th className="py-2.5 px-3">Safety Clearance</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {filteredOrders.map((order) => {
                    const isSelected = order.id === selectedOrderId;
                    return (
                      <tr
                        key={order.id}
                        onClick={() => setSelectedOrderId(order.id)}
                        className={`transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-surface-container-low ring-1 ring-primary/30"
                            : "bg-surface-container-lowest hover:bg-surface-container-low"
                        }`}
                      >
                        <td className="py-3 px-3 align-top whitespace-nowrap">
                          <div className="flex flex-col">
                            <span
                              className={`font-clinical-data-mono text-clinical-data-mono font-bold ${
                                isSelected ? "text-primary" : "text-on-surface"
                              }`}
                            >
                              {order.id}
                            </span>
                            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                              {order.time}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded font-clinical-data-mono text-metadata-micro w-fit ${order.priorityClass}`}
                            >
                              {order.priority.includes("STAT") && (
                                <span className="material-symbols-outlined text-xs">bolt</span>
                              )}
                              {order.priority}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 align-top">
                          <div className="flex flex-col min-w-[130px]">
                            <span className="font-body-strong text-body-strong text-on-surface leading-tight">
                              {order.patient.name}
                            </span>
                            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                              {order.patient.ageGender} · UHID-{order.patient.uhid.split("-").pop()}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 font-clinical-data-mono text-metadata-micro font-semibold mt-0.5 ${order.patient.bedColorClass}`}
                            >
                              <span className="material-symbols-outlined text-xs">bed</span> {order.patient.bed}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 align-top whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="font-body-strong text-clinical-data text-on-surface">
                              {order.prescriber.name}
                            </span>
                            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                              {order.prescriber.department}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 align-top min-w-[220px]">
                          <div className="flex flex-col gap-1">
                            {order.medications.map((med, idx) => (
                              <div key={med.id} className="flex items-center gap-1 text-on-surface">
                                <span className="font-clinical-data-mono text-metadata-micro text-primary font-bold">
                                  {idx + 1}.
                                </span>
                                <span className={idx === 0 ? "font-semibold" : ""}>{med.name}</span>
                                <span className="text-on-surface-variant text-metadata-micro">
                                  ({med.dosage})
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-3 align-top whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface-container font-metadata-micro text-metadata-micro text-on-surface font-semibold">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary"></span> {order.stockBin}
                          </span>
                        </td>
                        <td className="py-3 px-3 align-top min-w-[150px]">
                          <div className="flex flex-col gap-1">
                            <span
                              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-metadata-micro text-metadata-micro font-bold ${order.safetySummary.badgeClass}`}
                            >
                              <span className="material-symbols-outlined text-xs">
                                {order.safetySummary.icon}
                              </span>{" "}
                              {order.safetySummary.badge}
                            </span>
                            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant leading-tight">
                              {order.safetySummary.note}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 align-top whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-clinical-data-mono text-metadata-micro font-bold ${order.statusClass}`}
                          >
                            <span className="material-symbols-outlined text-xs">
                              {order.status === "DISPENSED"
                                ? "done_all"
                                : order.status === "PACKAGED"
                                ? "inventory"
                                : order.status === "DISPATCHED"
                                ? "local_shipping"
                                : order.status === "VERIFYING"
                                ? "hourglass_top"
                                : "check_circle"}
                            </span>
                            {order.status}
                          </span>
                          <span className="block font-metadata-micro text-metadata-micro text-on-surface-variant mt-0.5">
                            {order.statusDetail}
                          </span>
                        </td>
                        <td className="py-3 px-3 align-top text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOrderId(order.id);
                                triggerToast(`Prescription ${order.id} loaded in inspector.`);
                              }}
                              className="px-2 py-1 bg-surface-container hover:bg-surface-variant rounded text-on-surface font-body-strong text-metadata-micro transition-colors cursor-pointer"
                              title="View Rx Sheet"
                            >
                              View
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOrderId(order.id);
                                triggerToast(`Auditing items for Rx ${order.id}`);
                              }}
                              className="px-2 py-1 bg-primary text-on-primary hover:bg-primary-container rounded font-body-strong text-metadata-micro transition-colors cursor-pointer"
                              title="View Verification Details"
                            >
                              Audit
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination & Queue Status Footer */}
            <div className="flex items-center justify-between px-space-md py-2 bg-surface-container-low font-clinical-data text-metadata-micro text-on-surface-variant">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                <span>
                  Live Automated Barcode Dispenser Interface: <strong>Ready (Tray 01-12)</strong>
                </span>
              </div>
              <div className="flex items-center gap-space-xs font-clinical-data-mono">
                <span className="px-2 py-1 bg-surface-container-lowest rounded font-semibold text-on-surface">
                  Page 1 of 63
                </span>
                <button className="p-1 hover:bg-surface-container rounded text-outline hover:text-on-surface cursor-pointer">
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <button className="p-1 hover:bg-surface-container rounded text-on-surface cursor-pointer">
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* INLINE RICH VISUAL: PHARMACY DISPENSE VELOCITY & SAFETY INTERCEPT TELEMETRY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
            {/* Velocity Chart Card */}
            <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-base">speed</span>
                  <span className="font-body-strong text-clinical-data text-on-surface">
                    Dispensing Velocity &amp; Turnaround (24h)
                  </span>
                </div>
                <span className="font-clinical-data-mono text-metadata-micro text-primary font-bold">
                  AVG: 4.8 min
                </span>
              </div>
              <p className="font-clinical-data text-metadata-micro text-on-surface-variant mb-3">
                Stat orders target &lt;10 min; Routine Ward kits target &lt;45 min.
              </p>
              {/* Inline SVG Hourly Histogram */}
              <div className="h-24 w-full flex items-end">
                <svg
                  className="w-full h-full overflow-visible"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 400 90"
                >
                  {/* Gridlines */}
                  <line stroke="#d7e4f0" strokeDasharray="2 2" strokeWidth="1" x1="0" x2="400" y1="20" y2="20" />
                  <line stroke="#d7e4f0" strokeDasharray="2 2" strokeWidth="1" x1="0" x2="400" y1="50" y2="50" />
                  <line stroke="#d7e4f0" strokeWidth="1" x1="0" x2="400" y1="80" y2="80" />
                  {/* Histogram bars (Hourly volume) */}
                  <rect className="fill-surface-variant" height="35" rx="2" width="18" x="10" y="45" />
                  <rect className="fill-surface-variant" height="25" rx="2" width="18" x="36" y="55" />
                  <rect className="fill-surface-variant" height="20" rx="2" width="18" x="62" y="60" />
                  <rect className="fill-secondary-container" height="40" rx="2" width="18" x="88" y="40" />
                  <rect className="fill-secondary" height="55" rx="2" width="18" x="114" y="25" />
                  <rect className="fill-primary" height="65" rx="2" width="18" x="140" y="15" />
                  <rect className="fill-primary" height="70" rx="2" width="18" x="166" y="10" />
                  <rect className="fill-primary" height="58" rx="2" width="18" x="192" y="22" />
                  <rect className="fill-primary" height="62" rx="2" width="18" x="218" y="18" />
                  <rect className="fill-secondary" height="52" rx="2" width="18" x="244" y="28" />
                  <rect className="fill-primary" height="68" rx="2" width="18" x="270" y="12" />
                  <rect className="fill-primary" height="60" rx="2" width="18" x="296" y="20" />
                  <rect className="fill-secondary" height="45" rx="2" width="18" x="322" y="35" />
                  <rect className="fill-surface-variant" height="30" rx="2" width="18" x="348" y="50" />
                  <rect className="fill-surface-variant" height="15" rx="2" width="18" x="374" y="65" />
                  {/* Trendline overlay */}
                  <path
                    d="M19,45 C60,50 110,25 150,12 C180,5 230,22 280,14 C330,10 360,45 383,65"
                    fill="none"
                    stroke="#0047bf"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <div className="flex justify-between font-clinical-data-mono text-metadata-micro text-outline mt-2 pt-1 border-t-0">
                <span>08:00</span>
                <span>11:00</span>
                <span>14:00 (Current Peak)</span>
                <span>17:00</span>
                <span>20:00</span>
              </div>
            </div>

            {/* Formulary & Automation Status Card */}
            <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-base">
                    precision_manufacturing
                  </span>
                  <span className="font-body-strong text-clinical-data text-on-surface">
                    Pneumatic Tube &amp; Robot Dispensary
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-primary-fixed text-on-primary-fixed-variant rounded font-clinical-data-mono text-metadata-micro font-bold">
                  ONLINE
                </span>
              </div>
              <div className="flex flex-col gap-2 my-auto">
                {/* Pneumatic Line 1 */}
                <div className="flex items-center justify-between p-2 bg-surface-container-low rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">adjust</span>
                    <div className="flex flex-col">
                      <span className="font-body-strong text-clinical-data text-on-surface">
                        Pneumatic Sta-01 (CCU &amp; Cath Lab)
                      </span>
                      <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                        Pressure: 4.2 Bar · Last launch: 6m ago
                      </span>
                    </div>
                  </div>
                  <span className="font-clinical-data-mono text-metadata-micro text-primary font-bold">
                    READY
                  </span>
                </div>
                {/* Pneumatic Line 2 */}
                <div className="flex items-center justify-between p-2 bg-surface-container-low rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">adjust</span>
                    <div className="flex flex-col">
                      <span className="font-body-strong text-clinical-data text-on-surface">
                        Pneumatic Sta-02 (IPD Towers Wing B)
                      </span>
                      <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                        Carriers Queued: 2 · Auto-shutter
                      </span>
                    </div>
                  </div>
                  <span className="font-clinical-data-mono text-metadata-micro text-secondary font-bold">
                    IN TRANSIT
                  </span>
                </div>
                {/* Robot Carousel */}
                <div className="flex items-center justify-between p-2 bg-surface-container-low rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary text-sm">smart_toy</span>
                    <div className="flex flex-col">
                      <span className="font-body-strong text-clinical-data text-on-surface">
                        BD Pyxis Automated Dispensing Units
                      </span>
                      <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                        18/18 Floor satellite stations synchronized
                      </span>
                    </div>
                  </div>
                  <span className="font-clinical-data-mono text-metadata-micro text-tertiary font-bold">
                    100% SYNC
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="font-metadata-micro text-metadata-micro text-outline">
                  Scheduled maintenance: Sunday 03:00 AM IST
                </span>
                <button
                  onClick={() => setShowDiagnosticsModal(true)}
                  className="text-primary font-body-strong text-metadata-micro hover:underline cursor-pointer"
                >
                  Diagnostics
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PHARMACIST CLINICAL REVIEW & DISPENSING SAFETY PANEL (lg:col-span-4) */}
        <div className="lg:col-span-4 flex flex-col gap-space-sm">
          {/* Master Verification Container */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
            {/* Active Patient Header Banner */}
            <div className="p-space-md bg-surface-container text-on-surface">
              <div className="flex items-center justify-between mb-1.5">
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-error text-on-error font-clinical-data-mono text-metadata-micro font-bold">
                  <span className="material-symbols-outlined text-xs">priority_high</span> STAT ACTIVE VERIFICATION
                </span>
                <span className="font-clinical-data-mono text-metadata-micro font-semibold text-on-surface-variant">
                  {selectedOrder.id}
                </span>
              </div>
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <h3 className="font-section-title text-section-title text-on-surface font-bold">
                    {selectedOrder.patient.name}
                  </h3>
                  <div className="flex items-center gap-2 font-clinical-data text-clinical-data text-on-surface-variant mt-0.5">
                    <span>{selectedOrder.patient.ageGender}</span>
                    <span>·</span>
                    <span className="font-clinical-data-mono">UHID: {selectedOrder.patient.uhid}</span>
                    <span>·</span>
                    <span className={`font-bold ${selectedOrder.patient.bedColorClass}`}>
                      {selectedOrder.patient.bed}
                    </span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full bg-surface-container-lowest flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-primary text-xl">person</span>
                </div>
              </div>
              <div className="mt-2 pt-2 flex items-center justify-between font-metadata-micro text-metadata-micro text-on-surface-variant border-t border-surface-variant/40">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-primary">stethoscope</span>
                  <span>
                    Prescriber: <strong>{selectedOrder.prescriber.name}</strong> ({selectedOrder.prescriber.regNo})
                  </span>
                </span>
                <span className="font-clinical-data-mono">Rx Time: {selectedOrder.time}</span>
              </div>
            </div>

            {/* Emergency Clinical Safety Intercept Shield */}
            <div className="p-space-md bg-surface-container-lowest flex flex-col gap-space-sm border-b border-surface-variant/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-base">verified_user</span>
                  <span className="font-body-strong text-clinical-data text-on-surface uppercase tracking-wider">
                    Clinical Safety Intercept Shield
                  </span>
                </div>
                <span className="font-metadata-micro text-metadata-micro text-primary font-bold">
                  PASS {selectedOrder.safetyIntercepts.length}/{selectedOrder.safetyIntercepts.length}
                </span>
              </div>
              {/* Safety Checks Stack */}
              <div className="flex flex-col gap-2">
                {selectedOrder.safetyIntercepts.map((intercept, idx) => (
                  <div key={idx} className="p-2.5 bg-surface-container-low rounded-lg flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="font-body-strong text-clinical-data text-on-surface flex items-center gap-1">
                        <span className="material-symbols-outlined text-primary text-sm">
                          {intercept.icon}
                        </span>
                        {intercept.title}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded font-clinical-data-mono text-metadata-micro font-bold ${intercept.statusColor}`}
                      >
                        {intercept.status}
                      </span>
                    </div>
                    <p className="font-clinical-data text-metadata-micro text-on-surface-variant">
                      {intercept.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Dispensing Line-Item Verification (Scan & Batch Tracking) */}
            <div className="p-space-md bg-surface-container-low flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <span className="font-body-strong text-clinical-data text-on-surface uppercase tracking-wider">
                  Item Batch Scan &amp; Barcode Audit
                </span>
                <span className="font-clinical-data-mono text-metadata-micro text-primary font-bold">
                  {selectedOrder.medications.filter((m) => m.scanned).length} of {selectedOrder.medications.length} Scanned
                </span>
              </div>
              {/* Items List */}
              {selectedOrder.medications.map((med, idx) => (
                <div
                  key={med.id}
                  className="p-2.5 bg-surface-container-lowest rounded-lg shadow-sm flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-body-strong text-clinical-data text-on-surface">
                        {idx + 1}. {med.name}
                      </span>
                      <span className="font-clinical-data-mono text-metadata-micro text-outline">
                        Batch: {med.batch} · Exp: {med.expiry}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-clinical-data-mono text-body-strong text-primary font-bold">
                        Qty: {med.qty}
                      </span>
                      <span className="block font-metadata-micro text-metadata-micro text-on-surface-variant">
                        {med.bin}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="inline-flex items-center gap-1 text-primary font-clinical-data text-metadata-micro font-semibold">
                      <span className="material-symbols-outlined text-xs">qr_code_scanner</span> Barcode{" "}
                      {med.barcode} Verified
                    </span>
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pharmacist Digital Sign-Off & Attestation */}
            <div className="p-space-md bg-surface-container-lowest flex flex-col gap-space-sm">
              <div className="p-2.5 bg-surface-container-low rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">badge</span>
                  <div className="flex flex-col">
                    <span className="font-body-strong text-clinical-data text-on-surface">
                      {selectedOrder.pharmacist.name}
                    </span>
                    <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                      {selectedOrder.pharmacist.regNo}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-primary-fixed text-on-primary-fixed-variant font-clinical-data-mono text-metadata-micro font-bold">
                    DIGITALLY SIGNED
                  </span>
                  <span className="block font-clinical-data-mono text-metadata-micro text-on-surface-variant mt-0.5">
                    {selectedOrder.pharmacist.signedTime}
                  </span>
                </div>
              </div>

              {/* Action Operations Footer */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setShowLabelModal(true)}
                  className="w-full h-10 flex items-center justify-center gap-2 bg-primary hover:bg-primary-container text-on-primary font-body-strong text-clinical-data rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">print</span>
                  <span>Print Bilingual Labels with QR &amp; Expiry</span>
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setShowTubeModal(true)}
                    className="h-9 flex items-center justify-center gap-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface font-body-strong text-clinical-data rounded transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm text-tertiary">airwave</span>
                    <span>Send via Tube Sta-02</span>
                  </button>
                  <button
                    onClick={() => setShowReceiptModal(true)}
                    className="h-9 flex items-center justify-center gap-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface font-body-strong text-clinical-data rounded transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm text-secondary">receipt_long</span>
                    <span>Reprint Receipt</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* INVENTORY CRITICAL WATCHLIST (Formulary Low Stock) */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-error text-base">notification_important</span>
                <span className="font-body-strong text-clinical-data text-on-surface uppercase tracking-wider">
                  Emergency Buffer Alerts
                </span>
              </div>
              <span className="px-1.5 py-0.5 bg-error-container text-on-error-container font-clinical-data-mono text-metadata-micro font-bold rounded">
                4 ITEMS
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between p-2 bg-surface-container-low rounded text-clinical-data">
                <div className="flex flex-col">
                  <span className="font-semibold text-on-surface">Inj. Tenecteplase 50mg</span>
                  <span className="font-metadata-micro text-metadata-micro text-error font-bold">
                    1 vial left in Central Fridge (Min: 4)
                  </span>
                </div>
                <button
                  onClick={() => handleIndent("Inj. Tenecteplase 50mg")}
                  className="px-2 py-1 bg-surface-container text-on-surface font-body-strong text-metadata-micro rounded hover:bg-surface-container-high cursor-pointer"
                >
                  Indent
                </button>
              </div>
              <div className="flex items-center justify-between p-2 bg-surface-container-low rounded text-clinical-data">
                <div className="flex flex-col">
                  <span className="font-semibold text-on-surface">Tab Ticagrelor 90mg (Brilinta)</span>
                  <span className="font-metadata-micro text-metadata-micro text-secondary font-bold">
                    28 tabs in Bin #42 (Buffer low)
                  </span>
                </div>
                <button
                  onClick={() => handleIndent("Tab Ticagrelor 90mg (Brilinta)")}
                  className="px-2 py-1 bg-surface-container text-on-surface font-body-strong text-metadata-micro rounded hover:bg-surface-container-high cursor-pointer"
                >
                  Indent
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: STOCK INVENTORY AUDIT */}
      {showStockAuditModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-2xl w-full p-6 shadow-2xl flex flex-col gap-4 border border-outline-variant animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-surface-variant">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">inventory_2</span>
                <h3 className="font-page-title text-section-title text-on-surface font-semibold">
                  Formulary &amp; Central Stock Inventory Audit
                </h3>
              </div>
              <button
                onClick={() => setShowStockAuditModal(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface rounded hover:bg-surface-container cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-3 font-clinical-data text-clinical-data">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-surface-container-low rounded-lg">
                  <span className="font-metadata-micro text-on-surface-variant uppercase">Total Active SKUs</span>
                  <div className="font-clinical-data-mono text-section-title font-bold text-primary">1,482</div>
                </div>
                <div className="p-3 bg-surface-container-low rounded-lg">
                  <span className="font-metadata-micro text-on-surface-variant uppercase">Near Expiry (&lt;90d)</span>
                  <div className="font-clinical-data-mono text-section-title font-bold text-secondary">18</div>
                </div>
                <div className="p-3 bg-surface-container-low rounded-lg">
                  <span className="font-metadata-micro text-on-surface-variant uppercase">Stock Value</span>
                  <div className="font-clinical-data-mono text-section-title font-bold text-on-surface">₹42.8 Lakh</div>
                </div>
              </div>
              <div className="p-3 bg-surface-container-low rounded-lg">
                <span className="font-body-strong text-on-surface">Audit Cycle: FY 2026-Q3 Physical Stock Count</span>
                <p className="text-metadata-micro text-on-surface-variant mt-1">
                  Last verified by Internal Audit Committee on 01-Sep-2026. Zero variance reported across high-cost thrombolytics and oncology injectables.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-surface-variant">
              <button
                onClick={() => {
                  setShowStockAuditModal(false);
                  triggerToast("Stock audit report PDF exported.");
                }}
                className="px-4 py-2 bg-surface-container hover:bg-surface-container-high rounded text-on-surface font-body-strong text-clinical-data cursor-pointer"
              >
                Download CSV / Audit Report
              </button>
              <button
                onClick={() => {
                  setShowStockAuditModal(false);
                  triggerToast("Formulary sync completed with ERP.");
                }}
                className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary rounded font-body-strong text-clinical-data cursor-pointer"
              >
                Run Barcode Scan Reconciliation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CONTROLLED DRUG REGISTER (Schedule H / X / NDPS) */}
      {showControlledRegisterModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-2xl w-full p-6 shadow-2xl flex flex-col gap-4 border border-error/30 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-surface-variant">
              <div className="flex items-center gap-2 text-error">
                <span className="material-symbols-outlined text-xl">lock</span>
                <h3 className="font-page-title text-section-title text-on-surface font-semibold">
                  Controlled Drug Register · Schedule X &amp; NDPS Vault
                </h3>
              </div>
              <button
                onClick={() => setShowControlledRegisterModal(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface rounded hover:bg-surface-container cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-3 font-clinical-data text-clinical-data">
              <div className="p-3 bg-error-container text-on-error-container rounded-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-xl">security</span>
                <span className="font-semibold text-metadata-micro">
                  CDSCO Statutory Compliance Rule 65: Mandatory Dual-Key Biometric Audit &amp; Physician Witness
                </span>
              </div>
              <table className="w-full text-left text-clinical-data divide-y divide-surface-container">
                <thead className="bg-surface-container text-on-surface-variant font-table-header uppercase">
                  <tr>
                    <th className="p-2">Molecule / Form</th>
                    <th className="p-2">Vault Balance</th>
                    <th className="p-2">Last Issued To</th>
                    <th className="p-2">Witness</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  <tr>
                    <td className="p-2 font-semibold">Inj Fentanyl 50mcg/ml</td>
                    <td className="p-2 font-clinical-data-mono text-error font-bold">14 Amps</td>
                    <td className="p-2">Surg ICU-03 (Dr. Anand)</td>
                    <td className="p-2 font-clinical-data-mono text-metadata-micro">Pharm. Ramanathan</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold">Inj Morphine 10mg/ml</td>
                    <td className="p-2 font-clinical-data-mono font-bold">22 Amps</td>
                    <td className="p-2">Palliative Ward (Dr. Joshi)</td>
                    <td className="p-2 font-clinical-data-mono text-metadata-micro">Pharm. Sengupta</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold">Tab Midazolam 7.5mg</td>
                    <td className="p-2 font-clinical-data-mono font-bold">48 Tabs</td>
                    <td className="p-2">Cath Lab Sedation Unit</td>
                    <td className="p-2 font-clinical-data-mono text-metadata-micro">Nurse Ancy</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-surface-variant">
              <button
                onClick={() => setShowControlledRegisterModal(false)}
                className="px-4 py-2 bg-surface-container rounded text-on-surface font-body-strong text-clinical-data cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowControlledRegisterModal(false);
                  triggerToast("Biometric verification verified. Central NDPS register signed.");
                }}
                className="px-4 py-2 bg-error text-on-error rounded font-body-strong text-clinical-data cursor-pointer"
              >
                Sign Statutory Form 3C
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: BATCH DISPENSE VERIFIED */}
      {showBatchDispenseModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-4 border border-outline-variant animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-surface-variant">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-xl">checklist_rtl</span>
                <h3 className="font-page-title text-section-title text-on-surface font-semibold">
                  Batch Dispense Verified Orders
                </h3>
              </div>
              <button
                onClick={() => setShowBatchDispenseModal(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface rounded hover:bg-surface-container cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="font-clinical-data text-clinical-data text-on-surface-variant">
              Bulk dispense 4 verified ward orders with single-click pneumatic tube routing and auto-bedside barcode sync.
            </p>
            <div className="p-3 bg-surface-container-low rounded-lg flex flex-col gap-2">
              <div className="flex justify-between text-clinical-data">
                <span>Verified Packages:</span>
                <span className="font-clinical-data-mono font-bold text-primary">4 Prescriptions (12 Items)</span>
              </div>
              <div className="flex justify-between text-clinical-data">
                <span>Target Wings:</span>
                <span className="font-semibold text-on-surface">CCU-01, Ward 308-B, CCU-02, Resus 03</span>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-surface-variant">
              <button
                onClick={() => setShowBatchDispenseModal(false)}
                className="px-4 py-2 bg-surface-container rounded text-on-surface font-body-strong text-clinical-data cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowBatchDispenseModal(false);
                  triggerToast("Batch dispense completed: 4 prescriptions dispatched to floor carts.");
                }}
                className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary rounded font-body-strong text-clinical-data cursor-pointer"
              >
                Authorize &amp; Dispatch All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: DIRECT WALK-IN RX */}
      {showDirectRxModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-xl w-full p-6 shadow-2xl flex flex-col gap-4 border border-outline-variant animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-surface-variant">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-xl">add_circle</span>
                <h3 className="font-page-title text-section-title text-on-surface font-semibold">
                  Direct Walk-In Prescription Entry
                </h3>
              </div>
              <button
                onClick={() => setShowDirectRxModal(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface rounded hover:bg-surface-container cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-3 font-clinical-data text-clinical-data">
              <div>
                <label className="font-table-header uppercase text-on-surface-variant">Patient Name / UHID</label>
                <input
                  type="text"
                  placeholder="Enter patient name, UHID or ABHA ID..."
                  defaultValue="Meera Krishnan · UHID-9021"
                  className="w-full h-9 px-3 bg-surface-container-low rounded border border-outline-variant mt-1"
                />
              </div>
              <div>
                <label className="font-table-header uppercase text-on-surface-variant">Prescribing Doctor</label>
                <input
                  type="text"
                  placeholder="Doctor name and registration number..."
                  defaultValue="Dr. K. Nambiar (General Medicine)"
                  className="w-full h-9 px-3 bg-surface-container-low rounded border border-outline-variant mt-1"
                />
              </div>
              <div>
                <label className="font-table-header uppercase text-on-surface-variant">Add Medication(s)</label>
                <textarea
                  rows={3}
                  defaultValue="Tab Metformin 500mg BD x 30d&#10;Tab Telmisartan 40mg OD x 30d"
                  className="w-full p-2 bg-surface-container-low rounded border border-outline-variant mt-1 font-clinical-data-mono"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-surface-variant">
              <button
                onClick={() => setShowDirectRxModal(false)}
                className="px-4 py-2 bg-surface-container rounded text-on-surface font-body-strong text-clinical-data cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDirectRxModal(false);
                  triggerToast("Walk-in prescription RX-2026-99255 created and queued for dispensing.");
                }}
                className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary rounded font-body-strong text-clinical-data cursor-pointer"
              >
                Create Prescription &amp; Bill
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: PRINT BILINGUAL LABELS */}
      {showLabelModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-4 border border-outline-variant animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-surface-variant">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-xl">print</span>
                <h3 className="font-page-title text-section-title text-on-surface font-semibold">
                  Bilingual Prescription Label Preview
                </h3>
              </div>
              <button
                onClick={() => setShowLabelModal(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface rounded hover:bg-surface-container cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-4 bg-surface-container-low rounded-lg border-2 border-dashed border-outline-variant flex flex-col gap-2 font-clinical-data">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="font-bold text-on-surface">{selectedOrder.patient.name}</span>
                  <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                    {selectedOrder.patient.uhid} · {selectedOrder.patient.bed}
                  </span>
                </div>
                <div className="h-10 w-10 bg-surface-container flex items-center justify-center rounded">
                  <span className="material-symbols-outlined text-2xl">qr_code_2</span>
                </div>
              </div>
              <div className="p-2 bg-surface-container-lowest rounded border border-surface-variant">
                <span className="font-bold text-on-surface text-clinical-data">
                  {selectedOrder.medications[0]?.name}
                </span>
                <div className="text-metadata-micro text-primary font-semibold mt-0.5">
                  खुराक: 2 गोलियां तुरंत (Take 2 tablets immediately)
                </div>
                <div className="font-clinical-data-mono text-metadata-micro text-outline mt-1">
                  Batch: {selectedOrder.medications[0]?.batch} · Exp: {selectedOrder.medications[0]?.expiry}
                </div>
              </div>
              <span className="font-metadata-micro text-metadata-micro text-center text-outline">
                Apollo Indraprastha Hospital Pharmacy · Helpline: 1860-500-1066
              </span>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-surface-variant">
              <button
                onClick={() => setShowLabelModal(false)}
                className="px-4 py-2 bg-surface-container rounded text-on-surface font-body-strong text-clinical-data cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowLabelModal(false);
                  triggerToast("Thermal labels sent to Zebra ZD421 Printer (Tray 02).");
                }}
                className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary rounded font-body-strong text-clinical-data cursor-pointer"
              >
                Print Thermal Labels (4)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: SEND VIA TUBE */}
      {showTubeModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-4 border border-outline-variant animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-surface-variant">
              <div className="flex items-center gap-2 text-tertiary">
                <span className="material-symbols-outlined text-xl">airwave</span>
                <h3 className="font-page-title text-section-title text-on-surface font-semibold">
                  Pneumatic Dispatch Terminal
                </h3>
              </div>
              <button
                onClick={() => setShowTubeModal(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface rounded hover:bg-surface-container cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-3 bg-surface-container-low rounded-lg flex flex-col gap-2 font-clinical-data text-clinical-data">
              <div className="flex justify-between">
                <span>Destination:</span>
                <strong className="text-on-surface">{selectedOrder.patient.bed} (Pneumatic Sta-01)</strong>
              </div>
              <div className="flex justify-between">
                <span>Carrier Barcode:</span>
                <span className="font-clinical-data-mono text-primary font-bold">#TUBE-CCU-982</span>
              </div>
              <div className="flex justify-between">
                <span>Tube Pressure:</span>
                <span className="font-clinical-data-mono text-secondary font-bold">4.2 Bar (Nominal)</span>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-surface-variant">
              <button
                onClick={() => setShowTubeModal(false)}
                className="px-4 py-2 bg-surface-container rounded text-on-surface font-body-strong text-clinical-data cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowTubeModal(false);
                  triggerToast(`Carrier #TUBE-CCU-982 launched to ${selectedOrder.patient.bed}! Transit time: ~42s.`);
                }}
                className="px-4 py-2 bg-tertiary text-on-tertiary rounded font-body-strong text-clinical-data cursor-pointer"
              >
                Launch Pneumatic Carrier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 7: REPRINT RECEIPT */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-4 border border-outline-variant animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-surface-variant">
              <div className="flex items-center gap-2 text-secondary">
                <span className="material-symbols-outlined text-xl">receipt_long</span>
                <h3 className="font-page-title text-section-title text-on-surface font-semibold">
                  Medication Dispense Receipt
                </h3>
              </div>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface rounded hover:bg-surface-container cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-3 bg-surface-container-low rounded-lg flex flex-col gap-2 font-clinical-data-mono text-metadata-micro">
              <div className="text-center font-bold text-on-surface pb-1 border-b border-surface-variant">
                APOLLO HOSPITALS PHARMACY
              </div>
              <div className="flex justify-between">
                <span>Receipt #:</span>
                <span>RCP-2026-88192</span>
              </div>
              <div className="flex justify-between">
                <span>Patient:</span>
                <span>{selectedOrder.patient.name}</span>
              </div>
              <div className="flex justify-between">
                <span>UHID:</span>
                <span>{selectedOrder.patient.uhid}</span>
              </div>
              <div className="flex justify-between">
                <span>Billed To:</span>
                <span>Corporate Insurance (TPA Auto)</span>
              </div>
              <div className="flex justify-between font-bold text-on-surface pt-1 border-t border-surface-variant">
                <span>Total Amount:</span>
                <span>₹1,480.00 (Zero Co-pay)</span>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-surface-variant">
              <button
                onClick={() => setShowReceiptModal(false)}
                className="px-4 py-2 bg-surface-container rounded text-on-surface font-body-strong text-clinical-data cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowReceiptModal(false);
                  triggerToast("Dispense receipt sent to POS Printer 01.");
                }}
                className="px-4 py-2 bg-secondary text-on-secondary rounded font-body-strong text-clinical-data cursor-pointer"
              >
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 8: PNEUMATIC & ROBOT DIAGNOSTICS */}
      {showDiagnosticsModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-4 border border-outline-variant animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-surface-variant">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-xl">precision_manufacturing</span>
                <h3 className="font-page-title text-section-title text-on-surface font-semibold">
                  Pneumatic &amp; BD Pyxis Diagnostics
                </h3>
              </div>
              <button
                onClick={() => setShowDiagnosticsModal(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface rounded hover:bg-surface-container cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-2 font-clinical-data text-clinical-data">
              <div className="p-3 bg-surface-container-low rounded-lg flex items-center justify-between">
                <span>Pneumatic Compressor Pressure:</span>
                <span className="font-clinical-data-mono font-bold text-primary">4.25 Bar (Optimal)</span>
              </div>
              <div className="p-3 bg-surface-container-low rounded-lg flex items-center justify-between">
                <span>Diverter Valves Status:</span>
                <span className="font-clinical-data-mono font-bold text-primary">6/6 Responsive</span>
              </div>
              <div className="p-3 bg-surface-container-low rounded-lg flex items-center justify-between">
                <span>Pyxis ADU Sync Latency:</span>
                <span className="font-clinical-data-mono font-bold text-primary">12ms (HL7 Interface)</span>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-surface-variant">
              <button
                onClick={() => setShowDiagnosticsModal(false)}
                className="px-4 py-2 bg-surface-container rounded text-on-surface font-body-strong text-clinical-data cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowDiagnosticsModal(false);
                  triggerToast("Self-test packet sent through Tube Stations 01 and 02: All signals passed.");
                }}
                className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary rounded font-body-strong text-clinical-data cursor-pointer"
              >
                Run Hardware Self-Test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 9: INDENT RESTOCK */}
      {showIndentModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-4 border border-outline-variant animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-surface-variant">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-xl">inventory</span>
                <h3 className="font-page-title text-section-title text-on-surface font-semibold">
                  Raise Emergency Indent
                </h3>
              </div>
              <button
                onClick={() => setShowIndentModal(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface rounded hover:bg-surface-container cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-3 font-clinical-data text-clinical-data">
              <div>
                <label className="font-table-header uppercase text-on-surface-variant">Item</label>
                <div className="font-bold text-on-surface p-2 bg-surface-container-low rounded mt-1">
                  {indentItemName}
                </div>
              </div>
              <div>
                <label className="font-table-header uppercase text-on-surface-variant">Indent Quantity</label>
                <input
                  type="number"
                  defaultValue={10}
                  className="w-full h-9 px-3 bg-surface-container-low rounded border border-outline-variant mt-1 font-clinical-data-mono font-bold"
                />
              </div>
              <div>
                <label className="font-table-header uppercase text-on-surface-variant">Priority</label>
                <select className="w-full h-9 px-3 bg-surface-container-low rounded border border-outline-variant mt-1">
                  <option>STAT Emergency Restock (&lt; 1 Hour)</option>
                  <option>Next Routine Supply Run (24 Hours)</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-surface-variant">
              <button
                onClick={() => setShowIndentModal(false)}
                className="px-4 py-2 bg-surface-container rounded text-on-surface font-body-strong text-clinical-data cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowIndentModal(false);
                  triggerToast(`Indent PO-2026-4410 raised for ${indentItemName} to Central Medical Store.`);
                }}
                className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary rounded font-body-strong text-clinical-data cursor-pointer"
              >
                Submit Indent Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
