"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";

interface BedPatient {
  bedId: string;
  bedName: string;
  ward: "CCU" | "HDU" | "Med-Surg";
  wardName: string;
  floor: string;
  tower: string;
  status: "occupied" | "available" | "turnover" | "reserved" | "critical";
  statusLabel: string;
  acuity: "P1 CRITICAL" | "P1 HIGH" | "P2 STABLE" | "P2 Sub-Acute" | "RESERVED" | "AVAILABLE" | "TURNOVER";
  patientName: string;
  age: number | string;
  gender: string;
  uhid: string;
  ipdNo: string;
  abhaId?: string;
  isAbhaVerified?: boolean;
  dayCount: string;
  diagnosis: string;
  attending: string;
  payer: string;
  payerAmount?: string;
  preAuthRef?: string;
  badges: string[];
  vitals?: {
    hr: string;
    bp?: string;
    spo2: string;
    note?: string;
  };
  ecgWave?: boolean;
  turnaroundEta?: string;
  cleaningProgress?: number;
  housekeeper?: string;
  reservedFor?: string;
  reservedEta?: string;
  holdRequestedBy?: string;
  checklist?: {
    biometricVerified: boolean;
    consentSigned: boolean;
    allergyBand: boolean;
    allergyText?: string;
    wristbandBarcoded: boolean;
    statBloods: boolean;
  };
  losEstimate?: string;
  carePathway?: string;
}

const INITIAL_BEDS: BedPatient[] = [
  // SECTION 1: CCU
  {
    bedId: "ccu-01",
    bedName: "CCU-01",
    ward: "CCU",
    wardName: "Coronary Care Unit (CCU) & Resuscitation",
    floor: "Floor 2 · Wing A",
    tower: "Tower A - Critical Care & Cardiac",
    status: "critical",
    statusLabel: "P1 CRITICAL",
    acuity: "P1 CRITICAL",
    patientName: "Rahul Sharma",
    age: 42,
    gender: "M",
    uhid: "DEL-2024-8841",
    ipdNo: "IPD #00921",
    abhaId: "91-8842-1920-4491",
    isAbhaVerified: true,
    dayCount: "Day 0",
    diagnosis: "Acute Anterior STEMI (Primary PCI)",
    attending: "Dr. Rohit Verma, MD, DM",
    payer: "ICICI Lombard General Insurance",
    payerAmount: "₹4,50,000",
    preAuthRef: "#IL-DEL-882910-CASHLESS",
    badges: ["Fall Risk", "Telemetry Resus", "Admitted 14:20"],
    vitals: { hr: "118 bpm", bp: "148/92", spo2: "94%" },
    ecgWave: true,
    checklist: {
      biometricVerified: true,
      consentSigned: true,
      allergyBand: true,
      allergyText: "PENICILLIN",
      wristbandBarcoded: true,
      statBloods: true,
    },
    losEstimate: "4 – 5 Days · Post-PCI Care Pathway",
    carePathway: "D0",
  },
  {
    bedId: "ccu-02",
    bedName: "CCU-02",
    ward: "CCU",
    wardName: "Coronary Care Unit (CCU) & Resuscitation",
    floor: "Floor 2 · Wing A",
    tower: "Tower A - Critical Care & Cardiac",
    status: "occupied",
    statusLabel: "P1 HIGH",
    acuity: "P1 HIGH",
    patientName: "Sunita Devi",
    age: 58,
    gender: "F",
    uhid: "DEL-2024-9104",
    ipdNo: "IPD #00874",
    abhaId: "91-7712-4091-1123",
    isAbhaVerified: true,
    dayCount: "Day 1",
    diagnosis: "Decompensated Heart Failure",
    attending: "Dr. S. Kulkarni",
    payer: "Star Health Cashless",
    payerAmount: "₹3,20,000",
    preAuthRef: "#SH-DEL-441029",
    badges: ["High-Flow O2", "Strict Fluid Bal"],
    vitals: { hr: "84 bpm", bp: "132/88", spo2: "97%", note: "HFNC 50L" },
    checklist: {
      biometricVerified: true,
      consentSigned: true,
      allergyBand: true,
      allergyText: "SULFA DRUGS",
      wristbandBarcoded: true,
      statBloods: true,
    },
    losEstimate: "3 – 4 Days · HF Protocol",
    carePathway: "D1",
  },
  {
    bedId: "ccu-03",
    bedName: "CCU-03",
    ward: "CCU",
    wardName: "Coronary Care Unit (CCU) & Resuscitation",
    floor: "Floor 2 · Wing A",
    tower: "Tower A - Critical Care & Cardiac",
    status: "occupied",
    statusLabel: "P2 STABLE",
    acuity: "P2 STABLE",
    patientName: "Manpreet Singh",
    age: 61,
    gender: "M",
    uhid: "DEL-2024-5510",
    ipdNo: "IPD #00762",
    abhaId: "91-3321-9988-7712",
    isAbhaVerified: true,
    dayCount: "Day 2",
    diagnosis: "Post-CABG x3 Vessels Day 2",
    attending: "Dr. V. Menon (CTVS)",
    payer: "HDFC ERGO Health",
    payerAmount: "₹6,00,000",
    preAuthRef: "#HE-CABG-9912",
    badges: ["Step-Down Pending", "Chest Tube Out"],
    vitals: { hr: "76 bpm", bp: "120/78", spo2: "99%", note: "Extubated" },
    checklist: {
      biometricVerified: true,
      consentSigned: true,
      allergyBand: false,
      wristbandBarcoded: true,
      statBloods: true,
    },
    losEstimate: "6 – 7 Days · CTVS Recovery",
    carePathway: "D2",
  },
  {
    bedId: "ccu-04",
    bedName: "CCU-04",
    ward: "CCU",
    wardName: "Coronary Care Unit (CCU) & Resuscitation",
    floor: "Floor 2 · Wing A",
    tower: "Tower A - Critical Care & Cardiac",
    status: "reserved",
    statusLabel: "RESERVED",
    acuity: "RESERVED",
    patientName: "Cath Lab Post-PCI Hand-off",
    age: "--",
    gender: "--",
    uhid: "EM-CAR-114",
    ipdNo: "HOLD-002",
    dayCount: "Holding",
    diagnosis: "Primary PCI in Cath Lab 2 (ETA: 35 mins)",
    attending: "Dr. Rohit Verma",
    payer: "Reserved for Direct Transfer",
    badges: ["IABP Ready", "Stat Setup"],
    reservedFor: "Cath Lab Direct Post-PCI Hand-off",
    reservedEta: "ETA: 35 mins",
    holdRequestedBy: "Dr. Rohit Verma",
  },
  {
    bedId: "ccu-05",
    bedName: "CCU-05",
    ward: "CCU",
    wardName: "Coronary Care Unit (CCU) & Resuscitation",
    floor: "Floor 2 · Wing A",
    tower: "Tower A - Critical Care & Cardiac",
    status: "available",
    statusLabel: "AVAILABLE",
    acuity: "AVAILABLE",
    patientName: "Ready for Direct Admission",
    age: "--",
    gender: "--",
    uhid: "VACANT-BED",
    ipdNo: "READY",
    dayCount: "Clean",
    diagnosis: "Sanitized & Terminal Cleaned · 14:05 IST",
    attending: "Available for Emergency Intake",
    payer: "Unassigned",
    badges: ["Philips IntelliVue X3 OK", "Central O2 Verified"],
  },
  {
    bedId: "ccu-06",
    bedName: "CCU-06",
    ward: "CCU",
    wardName: "Coronary Care Unit (CCU) & Resuscitation",
    floor: "Floor 2 · Wing A",
    tower: "Tower A - Critical Care & Cardiac",
    status: "turnover",
    statusLabel: "TURNOVER",
    acuity: "TURNOVER",
    patientName: "Terminal Disinfection",
    age: "--",
    gender: "--",
    uhid: "TURNOVER-CYCLE",
    ipdNo: "CLEAN-06",
    dayCount: "In Progress",
    diagnosis: "Housekeeping in Progress (Sunita R.)",
    attending: "Housekeeping Unit 02",
    payer: "Unassigned",
    badges: ["Discharged: 13:45 IST"],
    turnaroundEta: "ETA: 12 min",
    cleaningProgress: 65,
    housekeeper: "Sunita R. (Staff #19)",
  },

  // SECTION 2: HDU
  {
    bedId: "hdu-01",
    bedName: "HDU-01",
    ward: "HDU",
    wardName: "Cardiology Step-Down & HDU",
    floor: "Floor 2 · Wing B",
    tower: "Tower A - Critical Care & Cardiac",
    status: "occupied",
    statusLabel: "OCCUPIED",
    acuity: "P2 Sub-Acute",
    patientName: "Vikramaditya Roy",
    age: 52,
    gender: "M",
    uhid: "DEL-2024-3091",
    ipdNo: "IPD #00654",
    abhaId: "91-1182-9901-4411",
    isAbhaVerified: true,
    dayCount: "Day 3",
    diagnosis: "Non-STEMI Post-Stent",
    attending: "Dr. Rohit Verma",
    payer: "ICICI Lombard Cashless",
    payerAmount: "₹2,80,000",
    badges: ["Step-Down Protocol", "Telemetry active"],
    losEstimate: "3 Days · Step-Down",
    carePathway: "D3",
  },
  {
    bedId: "hdu-02",
    bedName: "HDU-02",
    ward: "HDU",
    wardName: "Cardiology Step-Down & HDU",
    floor: "Floor 2 · Wing B",
    tower: "Tower A - Critical Care & Cardiac",
    status: "occupied",
    statusLabel: "TRANSFER PEND",
    acuity: "P2 Sub-Acute",
    patientName: "Asha G. Pillai",
    age: 67,
    gender: "F",
    uhid: "DEL-2024-4418",
    ipdNo: "IPD #00591",
    abhaId: "91-4411-9988-2231",
    isAbhaVerified: true,
    dayCount: "Day 4",
    diagnosis: "Heart Block Pacemaker Implantation",
    attending: "Dr. K. Srinivas",
    payer: "CGHS Verified",
    payerAmount: "₹1,90,000",
    badges: ["Transfer to Ward 304 Ready", "Ambulatory"],
    losEstimate: "4 Days",
    carePathway: "D4",
  },
  {
    bedId: "hdu-03",
    bedName: "HDU-03",
    ward: "HDU",
    wardName: "Cardiology Step-Down & HDU",
    floor: "Floor 2 · Wing B",
    tower: "Tower A - Critical Care & Cardiac",
    status: "available",
    statusLabel: "AVAILABLE",
    acuity: "AVAILABLE",
    patientName: "Bed Sanitized & Ready",
    age: "--",
    gender: "--",
    uhid: "VACANT-HDU",
    ipdNo: "READY",
    dayCount: "Clean",
    diagnosis: "Turnaround complete 14:18 IST",
    attending: "Available for Step-down Intake",
    payer: "Unassigned",
    badges: ["Telemetry X3 Ready", "Sanitized"],
  },
  {
    bedId: "hdu-04",
    bedName: "HDU-04",
    ward: "HDU",
    wardName: "Cardiology Step-Down & HDU",
    floor: "Floor 2 · Wing B",
    tower: "Tower A - Critical Care & Cardiac",
    status: "occupied",
    statusLabel: "OCCUPIED",
    acuity: "P2 Sub-Acute",
    patientName: "Karanveer Sethi",
    age: 49,
    gender: "M",
    uhid: "DEL-2024-7712",
    ipdNo: "IPD #00602",
    abhaId: "91-9901-2233-4411",
    isAbhaVerified: true,
    dayCount: "Day 1",
    diagnosis: "Atrial Fibrillation with RVR",
    attending: "Dr. Rohit Verma",
    payer: "Star Health Approved",
    payerAmount: "₹2,10,000",
    badges: ["Rate Control Protocol", "Anticoagulation Active"],
    losEstimate: "2 – 3 Days",
    carePathway: "D1",
  },

  // SECTION 3: MED-SURG WARD
  {
    bedId: "bed-301",
    bedName: "Bed 301",
    ward: "Med-Surg",
    wardName: "General Medical & Surgical Ward",
    floor: "Floor 3 · 24 Beds",
    tower: "Tower A - Critical Care & Cardiac",
    status: "occupied",
    statusLabel: "Occupied",
    acuity: "P2 STABLE",
    patientName: "Rajeev Mehra",
    age: 54,
    gender: "M",
    uhid: "DEL-2024-1189",
    ipdNo: "IPD #00511",
    dayCount: "Day 1",
    diagnosis: "Laparoscopic Cholecystectomy Post-Op Day 1",
    attending: "Dr. Arvind Saxena",
    payer: "Max Bupa · ₹1.8L",
    payerAmount: "₹1,80,000",
    badges: ["Surgical Post-Op", "Diet Tolerated"],
    losEstimate: "2 Days",
    carePathway: "D1",
  },
  {
    bedId: "bed-302",
    bedName: "Bed 302",
    ward: "Med-Surg",
    wardName: "General Medical & Surgical Ward",
    floor: "Floor 3 · 24 Beds",
    tower: "Tower A - Critical Care & Cardiac",
    status: "available",
    statusLabel: "Available",
    acuity: "AVAILABLE",
    patientName: "Unoccupied",
    age: "--",
    gender: "--",
    uhid: "VACANT-MS",
    ipdNo: "READY",
    dayCount: "--",
    diagnosis: "Terminal sanitized & linen replaced",
    attending: "—",
    payer: "—",
    badges: ["Linen Replaced", "Sanitized"],
  },
  {
    bedId: "bed-303",
    bedName: "Bed 303",
    ward: "Med-Surg",
    wardName: "General Medical & Surgical Ward",
    floor: "Floor 3 · 24 Beds",
    tower: "Tower A - Critical Care & Cardiac",
    status: "turnover",
    statusLabel: "Cleaning",
    acuity: "TURNOVER",
    patientName: "Housekeeping: Rajesh K.",
    age: "--",
    gender: "--",
    uhid: "TURNOVER-MS",
    ipdNo: "CLEAN",
    dayCount: "ETA 18m",
    diagnosis: "Discharge deep clean & UV sanitization",
    attending: "—",
    payer: "—",
    badges: ["UV Disinfection Active"],
    turnaroundEta: "ETA 18m",
  },
  {
    bedId: "bed-304",
    bedName: "Bed 304",
    ward: "Med-Surg",
    wardName: "General Medical & Surgical Ward",
    floor: "Floor 3 · 24 Beds",
    tower: "Tower A - Critical Care & Cardiac",
    status: "critical",
    statusLabel: "Critical Alert",
    acuity: "P1 CRITICAL",
    patientName: "Geeta Kapoor",
    age: 72,
    gender: "F",
    uhid: "DEL-2024-4419",
    ipdNo: "IPD #00489",
    dayCount: "Day 4",
    diagnosis: "Acute Exacerbation COPD · NPO Required",
    attending: "Dr. P. Singhal",
    payer: "CGHS Verified",
    payerAmount: "₹2,50,000",
    badges: ["NPO Required", "BiPAP Standby"],
    losEstimate: "5 Days",
    carePathway: "D4",
  },
];

export default function AdmissionsIpdPage() {
  const [beds, setBeds] = useState<BedPatient[]>(INITIAL_BEDS);
  const [selectedBedId, setSelectedBedId] = useState<string>("ccu-01");

  // Filters
  const [selectedTower, setSelectedTower] = useState<string>("Tower A - Critical Care & Cardiac");
  const [selectedFloor, setSelectedFloor] = useState<string>("Floor 2 & 3 (Cardiac / Med-Surg)");
  const [selectedWard, setSelectedWard] = useState<string>("All Ward Types");
  const [selectedUnit, setSelectedUnit] = useState<string>("Cardiology, CCU, Med-Surg, HDU");
  const [selectedStatus, setSelectedStatus] = useState<string>("All Statuses (Occupied / Free / Clean)");
  const [selectedPayer, setSelectedPayer] = useState<string>("TPA / Cashless, Cash, CGHS");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modals
  const [isNewAdmissionOpen, setIsNewAdmissionOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isTurnaroundOpen, setIsTurnaroundOpen] = useState(false);
  const [isExportCensusOpen, setIsExportCensusOpen] = useState(false);
  const [isFloorMapOpen, setIsFloorMapOpen] = useState(false);
  const [isFaceSheetOpen, setIsFaceSheetOpen] = useState(false);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Selected Patient Lookup
  const selectedBed = useMemo(() => {
    return beds.find((b) => b.bedId === selectedBedId) || beds[0];
  }, [beds, selectedBedId]);

  // Filtered Bed Patients
  const filteredBeds = useMemo(() => {
    return beds.filter((b) => {
      if (selectedWard !== "All Ward Types") {
        if (selectedWard.includes("CCU") && b.ward !== "CCU") return false;
        if (selectedWard.includes("HDU") && b.ward !== "HDU") return false;
        if (selectedWard.includes("Med-Surg") && b.ward !== "Med-Surg") return false;
      }
      if (selectedStatus !== "All Statuses (Occupied / Free / Clean)") {
        if (selectedStatus.includes("Available Only") && b.status !== "available") return false;
        if (selectedStatus.includes("Turnover") && b.status !== "turnover") return false;
        if (selectedStatus.includes("Red Flag") && b.status !== "critical") return false;
        if (selectedStatus.includes("Reserved") && b.status !== "reserved") return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const mName = b.patientName.toLowerCase().includes(q);
        const mUhid = b.uhid.toLowerCase().includes(q);
        const mBed = b.bedName.toLowerCase().includes(q);
        const mDx = b.diagnosis.toLowerCase().includes(q);
        if (!mName && !mUhid && !mBed && !mDx) return false;
      }
      return true;
    });
  }, [beds, selectedWard, selectedStatus, searchQuery]);

  // Section Subsets
  const ccuBeds = useMemo(() => filteredBeds.filter((b) => b.ward === "CCU"), [filteredBeds]);
  const hduBeds = useMemo(() => filteredBeds.filter((b) => b.ward === "HDU"), [filteredBeds]);
  const medSurgBeds = useMemo(() => filteredBeds.filter((b) => b.ward === "Med-Surg"), [filteredBeds]);

  // Form State for New Admission
  const [newAdmForm, setNewAdmForm] = useState({
    patientName: "",
    age: "48",
    gender: "M",
    uhid: "",
    targetBed: "CCU-05",
    diagnosis: "Acute Coronary Syndrome",
    attending: "Dr. Rohit Verma, MD, DM",
    payer: "ICICI Lombard Cashless",
    payerAmount: "₹3,50,000",
  });

  const handleCreateAdmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdmForm.patientName.trim()) {
      showToast("Please enter patient name.");
      return;
    }

    const uhidVal = newAdmForm.uhid.trim() ? newAdmForm.uhid.toUpperCase() : `DEL-2024-${Math.floor(1000 + Math.random() * 9000)}`;
    const ipdVal = `IPD #${Math.floor(1000 + Math.random() * 9000)}`;

    const targetBed = newAdmForm.targetBed;
    setBeds((prev) =>
      prev.map((b) => {
        if (b.bedName === targetBed) {
          return {
            ...b,
            status: "occupied",
            statusLabel: "P1 HIGH",
            acuity: "P1 HIGH",
            patientName: newAdmForm.patientName,
            age: newAdmForm.age,
            gender: newAdmForm.gender,
            uhid: uhidVal,
            ipdNo: ipdVal,
            dayCount: "Day 0",
            diagnosis: newAdmForm.diagnosis,
            attending: newAdmForm.attending,
            payer: newAdmForm.payer,
            payerAmount: newAdmForm.payerAmount,
            badges: ["Direct Admission", "Telemetry Active"],
            vitals: { hr: "88 bpm", bp: "130/85", spo2: "98%" },
            checklist: {
              biometricVerified: true,
              consentSigned: true,
              allergyBand: false,
              wristbandBarcoded: true,
              statBloods: true,
            },
            losEstimate: "3 – 4 Days",
            carePathway: "D0",
          };
        }
        return b;
      })
    );

    const updatedTarget = beds.find((b) => b.bedName === targetBed);
    if (updatedTarget) setSelectedBedId(updatedTarget.bedId);

    setIsNewAdmissionOpen(false);
    showToast(`Admitted ${newAdmForm.patientName} to ${targetBed} (${ipdVal})!`);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Toast Notification Alert */}
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

      {/* Command Header & Operational Facility Ribbon */}
      <div className="flex flex-col gap-space-sm mb-space-base">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          <div>
            <div className="flex items-center gap-space-xs mb-0.5">
              <span className="font-metadata-micro text-metadata-micro text-primary font-bold tracking-wider uppercase">
                Apollo Indraprastha · Central Campus (Main Hospital)
              </span>
              <span className="h-1 w-1 rounded-full bg-outline-variant"></span>
              <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-primary inline-block animate-ping"></span>
                Census Real-time Engine
              </span>
            </div>
            <h1 className="font-page-title text-page-title text-on-surface">Admissions &amp; IPD Bed Board</h1>
            <p className="font-body-default text-body-default text-on-surface-variant">
              Real-time inpatient bed occupancy, ward census, patient acuity, and admission pipeline
            </p>
          </div>

          {/* Main Action Buttons */}
          <div className="flex flex-wrap items-center gap-space-xs">
            <button
              onClick={() => setIsNewAdmissionOpen(true)}
              className="flex items-center gap-1.5 px-space-md py-2 bg-primary-container text-on-primary-container font-body-strong text-clinical-data rounded hover:opacity-95 shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-base">add_circle</span>
              <span>+ New Admission Request</span>
            </button>
            <button
              onClick={() => setIsTransferOpen(true)}
              className="flex items-center gap-1.5 px-space-md py-2 bg-surface-container-lowest text-on-surface font-body-strong text-clinical-data rounded hover:bg-surface-container shadow-sm transition-all border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-base text-secondary">swap_horiz</span>
              <span>Bed Transfer Manager</span>
            </button>
            <button
              onClick={() => setIsTurnaroundOpen(true)}
              className="relative flex items-center gap-1.5 px-space-md py-2 bg-surface-container-lowest text-on-surface font-body-strong text-clinical-data rounded hover:bg-surface-container shadow-sm transition-all border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-base text-primary">cleaning_services</span>
              <span>Bed Turnaround</span>
              <span className="px-1.5 py-0.2 bg-secondary-container text-on-secondary-container font-clinical-data-mono text-metadata-micro rounded-full font-bold">
                14
              </span>
            </button>
            <button
              onClick={() => setIsExportCensusOpen(true)}
              className="flex items-center gap-1 px-space-sm py-2 bg-surface-container-lowest text-on-surface-variant font-clinical-data text-clinical-data rounded hover:bg-surface-container shadow-sm transition-all border border-outline-variant/30"
              title="Export Inpatient Census"
            >
              <span className="material-symbols-outlined text-base">ios_share</span>
              <span>Census (FHIR/CSV)</span>
            </button>
          </div>
        </div>

        {/* Operational Filter Control Matrix */}
        <div className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-space-sm border border-outline-variant/20">
          <div className="flex flex-wrap items-center gap-space-xs flex-1">
            {/* Building */}
            <div className="flex items-center gap-1 px-space-sm py-1.5 bg-surface-container-low rounded text-on-surface text-clinical-data font-clinical-data">
              <span className="material-symbols-outlined text-outline text-sm">domain</span>
              <span className="text-metadata-micro text-outline uppercase font-semibold">Tower:</span>
              <select
                value={selectedTower}
                onChange={(e) => setSelectedTower(e.target.value)}
                className="bg-transparent text-clinical-data font-clinical-data font-medium focus:outline-none cursor-pointer"
              >
                <option>Tower A - Critical Care &amp; Cardiac</option>
                <option>Tower B - Med-Surg Oncology</option>
                <option>Tower C - Mother &amp; Child</option>
              </select>
            </div>
            {/* Floor */}
            <div className="flex items-center gap-1 px-space-sm py-1.5 bg-surface-container-low rounded text-on-surface text-clinical-data font-clinical-data">
              <span className="material-symbols-outlined text-outline text-sm">layers</span>
              <span className="text-metadata-micro text-outline uppercase font-semibold">Floor:</span>
              <select
                value={selectedFloor}
                onChange={(e) => setSelectedFloor(e.target.value)}
                className="bg-transparent text-clinical-data font-clinical-data font-medium focus:outline-none cursor-pointer"
              >
                <option>Floor 2 &amp; 3 (Cardiac / Med-Surg)</option>
                <option>Floor 4 (Transplant &amp; Hepato)</option>
                <option>Floor 5 (Post-Op Surgical)</option>
              </select>
            </div>
            {/* Ward Type */}
            <div className="flex items-center gap-1 px-space-sm py-1.5 bg-surface-container-low rounded text-on-surface text-clinical-data font-clinical-data">
              <span className="material-symbols-outlined text-outline text-sm">bed</span>
              <span className="text-metadata-micro text-outline uppercase font-semibold">Ward:</span>
              <select
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                className="bg-transparent text-clinical-data font-clinical-data font-medium focus:outline-none cursor-pointer"
              >
                <option>All Ward Types</option>
                <option>Coronary Care (CCU)</option>
                <option>High Dependency (HDU)</option>
                <option>Step-Down &amp; Telemetry</option>
                <option>General Med-Surg</option>
              </select>
            </div>
            {/* Specialty */}
            <div className="flex items-center gap-1 px-space-sm py-1.5 bg-surface-container-low rounded text-on-surface text-clinical-data font-clinical-data">
              <span className="material-symbols-outlined text-outline text-sm">monitor_heart</span>
              <span className="text-metadata-micro text-outline uppercase font-semibold">Unit:</span>
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                className="bg-transparent text-clinical-data font-clinical-data font-medium focus:outline-none cursor-pointer"
              >
                <option>Cardiology, CCU, Med-Surg, HDU</option>
                <option>Neurosurgery &amp; Stroke</option>
                <option>Pulmonology &amp; Respiratory</option>
              </select>
            </div>
            {/* Bed Status */}
            <div className="flex items-center gap-1 px-space-sm py-1.5 bg-surface-container-low rounded text-on-surface text-clinical-data font-clinical-data">
              <span className="material-symbols-outlined text-outline text-sm">hotel</span>
              <span className="text-metadata-micro text-outline uppercase font-semibold">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-transparent text-clinical-data font-clinical-data font-medium focus:outline-none cursor-pointer"
              >
                <option>All Statuses (Occupied / Free / Clean)</option>
                <option>Available Only (Cleaned)</option>
                <option>Turnover / Cleaning Pending</option>
                <option>Red Flag Acuity High</option>
                <option>Reserved for Cath Lab / OT</option>
              </select>
            </div>
            {/* Payer */}
            <div className="flex items-center gap-1 px-space-sm py-1.5 bg-surface-container-low rounded text-on-surface text-clinical-data font-clinical-data">
              <span className="material-symbols-outlined text-outline text-sm">verified_user</span>
              <span className="text-metadata-micro text-outline uppercase font-semibold">Payer:</span>
              <select
                value={selectedPayer}
                onChange={(e) => setSelectedPayer(e.target.value)}
                className="bg-transparent text-clinical-data font-clinical-data font-medium focus:outline-none cursor-pointer"
              >
                <option>TPA / Cashless, Cash, CGHS</option>
                <option>Pre-Auth Verified Only</option>
                <option>Corporate Self-Pay</option>
              </select>
            </div>
          </div>
          {/* Live Search Input */}
          <div className="relative w-full xl:w-80 min-w-0">
            <span className="material-symbols-outlined absolute left-space-sm top-1/2 -translate-y-1/2 text-outline text-base">
              search
            </span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 text-clinical-data font-clinical-data bg-surface-container-low text-on-surface placeholder:text-outline rounded focus:outline-none focus:bg-surface-container-lowest transition-all border border-outline-variant/30"
              placeholder="Search admitted patient by Name, UHID, Bed #..."
              type="text"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-2 text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-xs">close</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Matrix Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-space-xs mb-space-base">
        {/* 1. Total Beds */}
        <div className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm flex flex-col justify-between border border-outline-variant/20">
          <div className="flex items-center justify-between text-on-surface-variant mb-1">
            <span className="font-metadata-micro text-metadata-micro uppercase tracking-wider font-semibold">
              Total Beds
            </span>
            <span className="material-symbols-outlined text-sm text-outline">single_bed</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-chief-complaint text-chief-complaint-mobile text-on-surface font-bold leading-none">
              420
            </span>
            <span className="font-clinical-data text-metadata-micro text-on-surface-variant font-medium">Licensed</span>
          </div>
          <span className="font-clinical-data-mono text-metadata-micro text-outline mt-1 truncate">
            Tower A/B/C Active
          </span>
        </div>

        {/* 2. Occupied Rate */}
        <div className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm flex flex-col justify-between border border-outline-variant/20">
          <div className="flex items-center justify-between text-on-surface-variant mb-1">
            <span className="font-metadata-micro text-metadata-micro uppercase tracking-wider font-semibold">
              Occupied
            </span>
            <span className="material-symbols-outlined text-sm text-secondary">hotel</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-chief-complaint text-chief-complaint-mobile text-on-surface font-bold leading-none">
              368
            </span>
            <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant font-semibold">
              87.6%
            </span>
          </div>
          <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-1 overflow-hidden">
            <div className="bg-secondary h-full rounded-full" style={{ width: "87.6%" }}></div>
          </div>
        </div>

        {/* 3. Available Beds */}
        <div className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm flex flex-col justify-between border border-outline-variant/20">
          <div className="flex items-center justify-between text-on-surface-variant mb-1">
            <span className="font-metadata-micro text-metadata-micro uppercase tracking-wider font-semibold">
              Available
            </span>
            <span className="material-symbols-outlined text-sm text-primary">check_circle</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-chief-complaint text-chief-complaint-mobile text-primary font-bold leading-none">
              38
            </span>
            <span className="font-clinical-data text-metadata-micro text-primary font-semibold">Clean</span>
          </div>
          <span className="font-clinical-data text-metadata-micro text-primary truncate">Ready for intake</span>
        </div>

        {/* 4. Cleaning / Turnover */}
        <div className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm flex flex-col justify-between border border-outline-variant/20">
          <div className="flex items-center justify-between text-on-surface-variant mb-1">
            <span className="font-metadata-micro text-metadata-micro uppercase tracking-wider font-semibold">
              Cleaning
            </span>
            <span className="material-symbols-outlined text-sm text-secondary-container">autorenew</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-chief-complaint text-chief-complaint-mobile text-secondary font-bold leading-none">
              14
            </span>
            <span className="font-clinical-data text-metadata-micro text-on-surface-variant">Turnover</span>
          </div>
          <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant truncate">
            ETA &lt;25m Housekeeping
          </span>
        </div>

        {/* 5. Reserved */}
        <div className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm flex flex-col justify-between border border-outline-variant/20">
          <div className="flex items-center justify-between text-on-surface-variant mb-1">
            <span className="font-metadata-micro text-metadata-micro uppercase tracking-wider font-semibold">
              Reserved
            </span>
            <span className="material-symbols-outlined text-sm text-outline">event_available</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-chief-complaint text-chief-complaint-mobile text-on-surface font-bold leading-none">
              12
            </span>
            <span className="font-clinical-data text-metadata-micro text-on-surface-variant">Elective</span>
          </div>
          <span className="font-clinical-data text-metadata-micro text-outline truncate">Cath Lab &amp; OT holds</span>
        </div>

        {/* 6. Negative Pressure Isolation */}
        <div className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm flex flex-col justify-between border border-outline-variant/20">
          <div className="flex items-center justify-between text-on-surface-variant mb-1">
            <span className="font-metadata-micro text-metadata-micro uppercase tracking-wider font-semibold">
              Isolation
            </span>
            <span className="material-symbols-outlined text-sm text-tertiary">masks</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-chief-complaint text-chief-complaint-mobile text-tertiary font-bold leading-none">
              08
            </span>
            <span className="font-clinical-data text-metadata-micro text-tertiary font-semibold">Neg-Pres</span>
          </div>
          <span className="font-clinical-data-mono text-metadata-micro text-outline truncate">Active HEPA 12 ACH</span>
        </div>

        {/* 7. ICU Acuity Alert */}
        <div className="bg-error-container p-space-sm rounded-lg shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-error-container mb-1">
            <span className="font-metadata-micro text-metadata-micro uppercase tracking-wider font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">warning</span>
              ICU / CCU 94.2%
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-chief-complaint text-chief-complaint-mobile text-on-error-container font-bold leading-none">
              02
            </span>
            <span className="font-clinical-data text-metadata-micro text-on-error-container font-semibold">
              CCU Left
            </span>
          </div>
          <span className="font-clinical-data text-metadata-micro text-on-error-container font-medium truncate">
            Critical Capacity Warning
          </span>
        </div>

        {/* 8. Pending Emergency */}
        <div className="bg-secondary-fixed p-space-sm rounded-lg shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-secondary-fixed-variant mb-1">
            <span className="font-metadata-micro text-metadata-micro uppercase tracking-wider font-semibold">
              Pending ED
            </span>
            <span className="material-symbols-outlined text-sm text-on-secondary-fixed">emergency</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-chief-complaint text-chief-complaint-mobile text-on-secondary-fixed font-bold leading-none">
              06
            </span>
            <span className="font-clinical-data text-metadata-micro text-on-secondary-fixed font-semibold">Queue</span>
          </div>
          <span className="font-clinical-data text-metadata-micro text-on-secondary-fixed font-medium truncate">
            Awaiting Bed Allocation
          </span>
        </div>
      </div>

      {/* Main Multi-Pane Workspace: Ward Grids + Slide-Over Admission Dossier */}
      <div className="grid grid-cols-1 2xl:grid-cols-12 gap-space-base items-start">
        {/* Bed Board Sections: Left / Center (8 cols on 2xl) */}
        <div className="2xl:col-span-8 flex flex-col gap-space-base min-w-0">
          {/* SECTION 1: Coronary Care Unit (CCU) & Resuscitation (Floor 2, Wing A) */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/20">
            {/* Section Header Bar */}
            <div className="px-space-panel-padding py-space-sm bg-surface-container-low flex flex-wrap items-center justify-between gap-space-xs border-b border-surface-container">
              <div className="flex items-center gap-space-sm">
                <span className="p-1 bg-primary-container text-on-primary-container rounded flex items-center justify-center">
                  <span className="material-symbols-outlined text-base">emergency_home</span>
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-section-title text-section-title text-on-surface">
                      Coronary Care Unit (CCU) &amp; Resuscitation
                    </h2>
                    <span className="px-2 py-0.5 bg-error-container text-on-error-container font-clinical-data-mono text-metadata-micro font-bold rounded">
                      P1 High Acuity
                    </span>
                  </div>
                  <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    Floor 2 · Wing A · 12 Resus &amp; Telemetry Beds · 10 Occupied, 1 Cath Lab Hold, 1 Turnover
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-space-sm">
                <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant bg-surface-container px-2 py-1 rounded">
                  Telemetry Bandwidth: 100% Locked
                </span>
                <button
                  onClick={() => setIsFloorMapOpen(true)}
                  className="text-primary hover:text-on-primary-container font-body-strong text-clinical-data flex items-center gap-0.5"
                >
                  <span>View Floor Map</span>
                  <span className="material-symbols-outlined text-sm">map</span>
                </button>
              </div>
            </div>

            {/* High-Density Bed Cards Grid (Section 1) */}
            <div className="p-space-base grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-sm">
              {ccuBeds.map((bed) => {
                const isSelected = selectedBedId === bed.bedId;

                if (bed.status === "available") {
                  return (
                    <div
                      key={bed.bedId}
                      onClick={() => setSelectedBedId(bed.bedId)}
                      className={`relative bg-surface-container-lowest rounded-lg p-space-sm shadow-sm hover:shadow-md transition-all cursor-pointer border ${
                        isSelected ? "border-primary ring-2 ring-primary/20" : "border-outline-variant/30"
                      }`}
                    >
                      <div className="absolute top-0 left-0 right-0 h-1 bg-primary rounded-t-lg"></div>
                      <div className="flex items-start justify-between mt-1 mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-clinical-data-mono text-clinical-data-mono font-bold text-on-surface bg-surface-container px-1.5 py-0.5 rounded">
                            {bed.bedName}
                          </span>
                          <span className="px-1.5 py-0.5 bg-primary text-on-primary font-clinical-data-mono text-metadata-micro font-bold rounded">
                            AVAILABLE
                          </span>
                        </div>
                        <span className="material-symbols-outlined text-sm text-primary">verified</span>
                      </div>
                      <div className="mb-2">
                        <span className="font-body-strong text-body-strong text-primary">Ready for Direct Admission</span>
                        <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                          Sanitized &amp; Terminal Cleaned · 14:05 IST
                        </p>
                      </div>
                      <div className="bg-surface-container-low p-space-xs rounded mb-2 text-metadata-micro font-clinical-data flex flex-col gap-0.5">
                        <span>Philips IntelliVue X3 Tested OK</span>
                        <span>Central O2 / Suction Verified</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setNewAdmForm({ ...newAdmForm, targetBed: bed.bedName });
                          setIsNewAdmissionOpen(true);
                        }}
                        className="w-full py-1.5 bg-primary-container text-on-primary-container text-metadata-micro font-body-strong rounded hover:opacity-90 transition-all flex items-center justify-center gap-1"
                      >
                        <span className="material-symbols-outlined text-xs">assignment_ind</span>
                        <span>Assign Emergency Intake</span>
                      </button>
                    </div>
                  );
                }

                if (bed.status === "reserved") {
                  return (
                    <div
                      key={bed.bedId}
                      onClick={() => setSelectedBedId(bed.bedId)}
                      className={`relative bg-surface-container-lowest rounded-lg p-space-sm shadow-sm hover:shadow-md transition-all border-dashed cursor-pointer border ${
                        isSelected ? "border-tertiary ring-2 ring-tertiary/20" : "border-outline-variant/40"
                      }`}
                    >
                      <div className="absolute top-0 left-0 right-0 h-1 bg-outline rounded-t-lg"></div>
                      <div className="flex items-start justify-between mt-1 mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-clinical-data-mono text-clinical-data-mono font-bold text-on-surface bg-surface-container px-1.5 py-0.5 rounded">
                            {bed.bedName}
                          </span>
                          <span className="px-1.5 py-0.5 bg-tertiary-fixed text-on-tertiary-fixed font-clinical-data-mono text-metadata-micro font-bold rounded">
                            RESERVED
                          </span>
                        </div>
                        <span className="material-symbols-outlined text-sm text-tertiary">lock_clock</span>
                      </div>
                      <div className="mb-2">
                        <span className="font-body-strong text-body-strong text-on-surface">{bed.patientName}</span>
                        <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                          {bed.diagnosis}
                        </p>
                      </div>
                      <div className="bg-surface-container-low p-space-xs rounded mb-2">
                        <span className="font-clinical-data text-clinical-data text-on-surface truncate block">
                          Hold requested: {bed.holdRequestedBy}
                        </span>
                        <span className="font-clinical-data-mono text-metadata-micro text-outline">
                          Pt Token: EM-CAR-114 · Stat Setup
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-metadata-micro font-clinical-data text-on-surface-variant pt-2">
                        <span className="flex items-center gap-1 text-primary">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>IABP Ready
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            showToast("Cath Lab hold modified.");
                          }}
                          className="text-xs text-secondary font-semibold hover:underline"
                        >
                          Modify Hold
                        </button>
                      </div>
                    </div>
                  );
                }

                if (bed.status === "turnover") {
                  return (
                    <div
                      key={bed.bedId}
                      onClick={() => setSelectedBedId(bed.bedId)}
                      className={`relative bg-surface-container-lowest rounded-lg p-space-sm shadow-sm hover:shadow-md transition-all cursor-pointer border ${
                        isSelected ? "border-secondary ring-2 ring-secondary/20" : "border-outline-variant/30"
                      }`}
                    >
                      <div className="absolute top-0 left-0 right-0 h-1 bg-secondary-container rounded-t-lg"></div>
                      <div className="flex items-start justify-between mt-1 mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-clinical-data-mono text-clinical-data-mono font-bold text-on-surface bg-surface-container px-1.5 py-0.5 rounded">
                            {bed.bedName}
                          </span>
                          <span className="px-1.5 py-0.5 bg-secondary-container text-on-secondary-container font-clinical-data-mono text-metadata-micro font-bold rounded">
                            TURNOVER
                          </span>
                        </div>
                        <span className="material-symbols-outlined text-sm text-secondary animate-spin">sync</span>
                      </div>
                      <div className="mb-2">
                        <span className="font-body-strong text-body-strong text-on-surface">Terminal Disinfection</span>
                        <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                          Housekeeping in Progress ({bed.housekeeper})
                        </p>
                      </div>
                      <div className="bg-surface-container-low p-space-xs rounded mb-2">
                        <div className="flex justify-between text-metadata-micro font-clinical-data-mono mb-1">
                          <span>Clean Cycle</span>
                          <span className="font-bold text-secondary">{bed.turnaroundEta}</span>
                        </div>
                        <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                          <div
                            className="bg-secondary h-full rounded-full"
                            style={{ width: `${bed.cleaningProgress || 65}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-metadata-micro font-clinical-data text-on-surface-variant pt-1">
                        <span>Discharged: 13:45 IST</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            showToast("Housekeeping pinged for priority turnaround.");
                          }}
                          className="text-xs text-primary font-semibold hover:underline"
                        >
                          Ping Housekeeping
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={bed.bedId}
                    onClick={() => setSelectedBedId(bed.bedId)}
                    className={`relative bg-surface-container-lowest rounded-lg p-space-sm shadow-sm hover:shadow-md transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-gradient-to-br from-primary/5 via-surface-container-lowest to-surface-container-lowest shadow-md border-primary ring-2 ring-primary/20"
                        : "border-outline-variant/30"
                    }`}
                  >
                    {/* Active Flag Strip */}
                    <div
                      className={`absolute top-0 left-0 right-0 h-1 rounded-t-lg ${
                        bed.status === "critical"
                          ? "bg-error"
                          : bed.acuity === "P1 HIGH"
                          ? "bg-error-container"
                          : "bg-secondary"
                      }`}
                    ></div>
                    <div className="flex items-start justify-between mt-1 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-clinical-data-mono text-clinical-data-mono font-bold text-on-surface bg-surface-container px-1.5 py-0.5 rounded">
                          {bed.bedName}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 font-clinical-data-mono text-metadata-micro font-bold rounded ${
                            bed.status === "critical"
                              ? "bg-error text-on-error"
                              : bed.acuity === "P1 HIGH"
                              ? "bg-error-container text-on-error-container"
                              : "bg-secondary-fixed text-on-secondary-fixed"
                          }`}
                        >
                          {bed.statusLabel}
                        </span>
                      </div>
                      {bed.status === "critical" ? (
                        <span className="font-metadata-micro text-metadata-micro text-primary font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">sensors</span> LIVE
                        </span>
                      ) : (
                        <span className="font-metadata-micro text-metadata-micro text-secondary font-medium">
                          {bed.vitals?.note || "Monitored"}
                        </span>
                      )}
                    </div>

                    {/* Patient Info */}
                    <div className="mb-2">
                      <div className="flex items-baseline justify-between">
                        <span className="font-body-strong text-body-strong text-on-surface">{bed.patientName}</span>
                        <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                          {bed.age}
                          {bed.gender} · {bed.dayCount}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-metadata-micro font-clinical-data-mono text-on-surface-variant">
                        <span>UHID: {bed.uhid}</span>
                        <span>•</span>
                        <span>{bed.ipdNo}</span>
                      </div>
                    </div>

                    {/* Diagnosis & Attending */}
                    <div className="bg-surface-container-low p-space-xs rounded mb-2 flex flex-col gap-0.5">
                      <span className="font-clinical-data text-clinical-data text-on-surface font-semibold truncate">
                        Dx: {bed.diagnosis}
                      </span>
                      <span className="font-metadata-micro text-metadata-micro text-on-surface-variant truncate">
                        Attending: {bed.attending}
                      </span>
                    </div>

                    {/* Acuity Badges */}
                    <div className="flex flex-wrap items-center gap-1 mb-2">
                      {bed.badges.map((badge, idx) => (
                        <span
                          key={idx}
                          className={`px-1.5 py-0.5 font-metadata-micro text-metadata-micro rounded ${
                            badge.includes("Fall")
                              ? "bg-error-container text-on-error-container font-bold flex items-center gap-0.5"
                              : badge.includes("High-Flow")
                              ? "bg-secondary-container text-on-secondary-container font-medium"
                              : "bg-surface-container text-on-surface-variant"
                          }`}
                        >
                          {badge.includes("Fall") && (
                            <span className="material-symbols-outlined text-xs">priority_high</span>
                          )}
                          {badge}
                        </span>
                      ))}
                    </div>

                    {/* Telemetry Strip Preview */}
                    {bed.ecgWave ? (
                      <div className="bg-surface-container p-1 rounded flex items-center justify-between text-metadata-micro font-clinical-data-mono text-on-surface-variant">
                        <span>HR {bed.vitals?.hr}</span>
                        {/* Inline ECG wave sparkline */}
                        <svg
                          className="h-4 w-28 text-error"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          viewBox="0 0 100 20"
                        >
                          <polyline points="0,10 15,10 20,2 25,18 30,10 45,10 50,2 55,18 60,10 75,10 80,2 85,18 90,10 100,10"></polyline>
                        </svg>
                        <span>SpO2 {bed.vitals?.spo2}</span>
                      </div>
                    ) : bed.vitals ? (
                      <div className="bg-surface-container p-1 rounded flex items-center justify-between text-metadata-micro font-clinical-data-mono text-on-surface-variant">
                        <span>HR {bed.vitals.hr}</span>
                        {bed.vitals.bp && <span>BP {bed.vitals.bp}</span>}
                        <span>SpO2 {bed.vitals.spo2}</span>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: Cardiology Step-Down & HDU (Floor 2, Wing B) */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/20">
            <div className="px-space-panel-padding py-space-sm bg-surface-container-low flex items-center justify-between border-b border-surface-container">
              <div className="flex items-center gap-space-sm">
                <span className="p-1 bg-secondary text-on-secondary rounded flex items-center justify-center">
                  <span className="material-symbols-outlined text-base">hotel_class</span>
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-section-title text-section-title text-on-surface">Cardiology Step-Down &amp; HDU</h2>
                    <span className="px-2 py-0.5 bg-secondary-fixed text-on-secondary-fixed font-clinical-data-mono text-metadata-micro font-bold rounded">
                      P2 Sub-Acute
                    </span>
                  </div>
                  <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    Floor 2 · Wing B · 16 Beds · 14 Occupied · 2 Available · 3 Transfer Ready
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-space-xs">
                <span className="px-2 py-1 bg-surface-container text-on-surface font-clinical-data-mono text-metadata-micro rounded">
                  Nurse Ratio 1:2
                </span>
              </div>
            </div>

            {/* Dense Tabular/Card Grid for HDU */}
            <div className="p-space-base grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-xs">
              {hduBeds.map((bed) => {
                const isSelected = selectedBedId === bed.bedId;

                if (bed.status === "available") {
                  return (
                    <div
                      key={bed.bedId}
                      onClick={() => setSelectedBedId(bed.bedId)}
                      className={`p-space-sm bg-surface-container-low rounded-lg shadow-sm flex flex-col justify-between cursor-pointer border ${
                        isSelected ? "border-primary ring-2 ring-primary/20" : "border-transparent hover:border-outline-variant"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-clinical-data-mono text-clinical-data font-bold text-on-surface">
                          {bed.bedName}
                        </span>
                        <span className="px-1.5 py-0.2 bg-primary text-on-primary font-metadata-micro text-metadata-micro rounded font-bold">
                          AVAILABLE
                        </span>
                      </div>
                      <div className="mb-1">
                        <span className="font-body-strong text-clinical-data text-primary block truncate">
                          {bed.patientName}
                        </span>
                        <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                          {bed.diagnosis}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-metadata-micro font-clinical-data pt-1">
                        <span className="text-on-surface-variant">Direct Intake</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setNewAdmForm({ ...newAdmForm, targetBed: bed.bedName });
                            setIsNewAdmissionOpen(true);
                          }}
                          className="text-primary font-bold hover:underline"
                        >
                          Reserve
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={bed.bedId}
                    onClick={() => setSelectedBedId(bed.bedId)}
                    className={`p-space-sm bg-surface-container-low rounded-lg shadow-sm flex flex-col justify-between cursor-pointer border ${
                      isSelected ? "border-primary ring-2 ring-primary/20" : "border-transparent hover:border-outline-variant"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-clinical-data-mono text-clinical-data font-bold text-on-surface">
                        {bed.bedName}
                      </span>
                      <span
                        className={`px-1.5 py-0.2 font-metadata-micro text-metadata-micro rounded font-bold ${
                          bed.statusLabel === "TRANSFER PEND"
                            ? "bg-tertiary text-on-tertiary"
                            : "bg-secondary text-on-secondary"
                        }`}
                      >
                        {bed.statusLabel}
                      </span>
                    </div>
                    <div className="mb-1">
                      <span className="font-body-strong text-clinical-data text-on-surface block truncate">
                        {bed.patientName}
                      </span>
                      <span className="font-metadata-micro text-metadata-micro text-on-surface-variant truncate block">
                        {bed.age}
                        {bed.gender} · Dx: {bed.diagnosis}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-metadata-micro font-clinical-data-mono text-outline pt-1">
                      <span>LOS: {bed.dayCount}</span>
                      <span
                        className={
                          bed.statusLabel === "TRANSFER PEND" ? "text-tertiary font-bold" : "text-primary font-medium"
                        }
                      >
                        {bed.payer}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 3: General Medical & Surgical Ward (Floor 3) */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/20">
            <div className="px-space-panel-padding py-space-sm bg-surface-container-low flex flex-wrap items-center justify-between gap-space-xs border-b border-surface-container">
              <div className="flex items-center gap-space-sm">
                <span className="p-1 bg-surface-variant text-on-surface-variant rounded flex items-center justify-center">
                  <span className="material-symbols-outlined text-base">domain_verification</span>
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-section-title text-section-title text-on-surface">
                      General Medical &amp; Surgical Ward
                    </h2>
                    <span className="px-2 py-0.5 bg-surface-container text-on-surface font-clinical-data-mono text-metadata-micro font-semibold rounded">
                      Floor 3 · 24 Beds
                    </span>
                  </div>
                  <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    Beds 301 to 324 · 20 Occupied · 2 Available · 2 Cleaning
                  </p>
                </div>
              </div>
              {/* Quick Acuity Status Palette Guide */}
              <div className="flex items-center gap-2 text-metadata-micro font-clinical-data-mono">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-primary"></span>Available (2)
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-secondary"></span>Occupied (20)
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-secondary-container"></span>Cleaning (2)
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-error"></span>Critical Red Flag
                </span>
              </div>
            </div>

            {/* High Density Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container text-outline font-table-header text-table-header uppercase">
                    <th className="py-2 px-space-sm">Bed #</th>
                    <th className="py-2 px-space-sm">Status</th>
                    <th className="py-2 px-space-sm">Patient (Name / UHID)</th>
                    <th className="py-2 px-space-sm">Primary Diagnosis</th>
                    <th className="py-2 px-space-sm">Attending Clinician</th>
                    <th className="py-2 px-space-sm">LOS</th>
                    <th className="py-2 px-space-sm">Payer / Pre-Auth</th>
                    <th className="py-2 px-space-sm text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="font-clinical-data text-clinical-data divide-y divide-surface-container-low">
                  {medSurgBeds.map((bed) => {
                    const isSelected = selectedBedId === bed.bedId;

                    return (
                      <tr
                        key={bed.bedId}
                        onClick={() => setSelectedBedId(bed.bedId)}
                        className={`transition-colors cursor-pointer ${
                          isSelected ? "bg-primary-fixed/20" : "hover:bg-surface-container-low"
                        }`}
                      >
                        <td className="py-2 px-space-sm font-clinical-data-mono font-bold text-on-surface">
                          {bed.bedName}
                        </td>
                        <td className="py-2 px-space-sm">
                          <span
                            className={`px-2 py-0.5 rounded text-metadata-micro font-bold ${
                              bed.status === "available"
                                ? "bg-primary text-on-primary"
                                : bed.status === "critical"
                                ? "bg-error-container text-on-error-container"
                                : bed.status === "turnover"
                                ? "bg-secondary-container text-on-secondary-container"
                                : "bg-secondary text-on-secondary"
                            }`}
                          >
                            {bed.statusLabel}
                          </span>
                        </td>
                        <td className="py-2 px-space-sm">
                          {bed.status === "available" ? (
                            <span className="text-outline italic">Unoccupied</span>
                          ) : (
                            <div>
                              <div className="font-body-strong text-on-surface">
                                {bed.patientName} {bed.age !== "--" && `(${bed.age}${bed.gender})`}
                              </div>
                              <div className="font-clinical-data-mono text-metadata-micro text-outline">
                                UHID: {bed.uhid}
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="py-2 px-space-sm text-on-surface">
                          <span className={bed.status === "critical" ? "text-error font-medium" : ""}>
                            {bed.diagnosis}
                          </span>
                        </td>
                        <td className="py-2 px-space-sm text-on-surface-variant">{bed.attending}</td>
                        <td className="py-2 px-space-sm font-clinical-data-mono">
                          {bed.status === "turnover" ? (
                            <span className="text-secondary font-bold">{bed.dayCount}</span>
                          ) : (
                            bed.dayCount
                          )}
                        </td>
                        <td className="py-2 px-space-sm">
                          {bed.payer !== "—" ? (
                            <span className="px-1.5 py-0.5 rounded bg-surface-container text-metadata-micro text-on-surface-variant">
                              {bed.payer}
                            </span>
                          ) : (
                            <span className="text-outline">—</span>
                          )}
                        </td>
                        <td className="py-2 px-space-sm text-right">
                          {bed.status === "available" ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setNewAdmForm({ ...newAdmForm, targetBed: bed.bedName });
                                setIsNewAdmissionOpen(true);
                              }}
                              className="px-2 py-1 bg-primary-container text-on-primary-container text-metadata-micro font-bold rounded hover:opacity-90"
                            >
                              Assign
                            </button>
                          ) : bed.status === "turnover" ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                showToast("Housekeeping update refreshed.");
                              }}
                              className="p-1 text-on-surface-variant hover:text-primary rounded"
                            >
                              <span className="material-symbols-outlined text-base">refresh</span>
                            </button>
                          ) : bed.status === "critical" ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                showToast(`Critical alert notified for ${bed.patientName}.`);
                              }}
                              className="p-1 text-on-surface-variant hover:text-error rounded"
                            >
                              <span className="material-symbols-outlined text-base">notification_important</span>
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedBedId(bed.bedId);
                              }}
                              className="p-1 text-on-surface-variant hover:text-primary rounded hover:bg-surface-container"
                            >
                              <span className="material-symbols-outlined text-base">more_vert</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side Context Slide-Over Drawer: 'Selected Admission Dossier' (4 cols on 2xl) */}
        <div className="2xl:col-span-4 flex flex-col gap-space-sm">
          <div className="bg-surface-container-lowest rounded-xl shadow-md overflow-hidden sticky top-16 border border-outline-variant/30">
            {/* Red Flag Hairline Indicator */}
            <div
              className={`h-1.5 w-full ${
                selectedBed.status === "critical"
                  ? "bg-error"
                  : selectedBed.status === "available"
                  ? "bg-primary"
                  : selectedBed.status === "turnover"
                  ? "bg-secondary-container"
                  : "bg-secondary"
              }`}
            ></div>

            {/* Dossier Header */}
            <div className="p-space-panel-padding bg-surface-container-low flex flex-col gap-space-xs border-b border-surface-container">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`p-1 rounded flex items-center justify-center ${
                      selectedBed.status === "critical"
                        ? "bg-error-container text-on-error-container"
                        : "bg-primary-container text-on-primary-container"
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm font-bold">assignment_late</span>
                  </span>
                  <span
                    className={`font-metadata-micro text-metadata-micro font-bold uppercase tracking-wider ${
                      selectedBed.status === "critical" ? "text-error" : "text-primary"
                    }`}
                  >
                    {selectedBed.status === "critical"
                      ? "STAT Emergency Admission"
                      : `${selectedBed.wardName} Admission`}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="px-2 py-0.5 bg-primary text-on-primary font-clinical-data-mono text-metadata-micro font-bold rounded">
                    Bed {selectedBed.bedName}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-section-title text-section-title text-on-surface font-bold">
                  {selectedBed.patientName}
                </h3>
                {selectedBed.uhid !== "VACANT-BED" && selectedBed.uhid !== "VACANT-MS" && (
                  <div className="flex flex-wrap items-center gap-2 text-metadata-micro font-clinical-data-mono text-on-surface-variant mt-0.5">
                    <span>
                      {selectedBed.age} Yrs · {selectedBed.gender === "M" ? "Male" : "Female"}
                    </span>
                    <span>•</span>
                    <span>UHID: {selectedBed.uhid}</span>
                  </div>
                )}
                {selectedBed.abhaId && (
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 bg-primary-container text-on-primary-container font-clinical-data-mono text-metadata-micro rounded font-bold">
                      ABHA: {selectedBed.abhaId}
                    </span>
                    <span className="material-symbols-outlined text-sm text-primary" title="ABHA M1/M2/M3 Verified">
                      verified
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Clinical & Financial Summary Blocks */}
            <div className="p-space-panel-padding flex flex-col gap-space-sm">
              {/* Admission Order Specs */}
              <div className="p-space-sm bg-surface-container-low rounded-lg flex flex-col gap-1 border border-surface-container">
                <span className="font-metadata-micro text-metadata-micro uppercase tracking-wider text-outline font-bold">
                  Admission Order Details
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="font-body-strong text-clinical-data text-on-surface">
                    {selectedBed.diagnosis}
                  </span>
                  <span
                    className={`font-clinical-data-mono text-metadata-micro font-bold ${
                      selectedBed.status === "critical" ? "text-error" : "text-primary"
                    }`}
                  >
                    {selectedBed.status === "critical" ? "STAT" : "ACTIVE"}
                  </span>
                </div>
                <div className="text-metadata-micro font-clinical-data text-on-surface-variant flex items-center justify-between">
                  <span>Requesting: {selectedBed.attending}</span>
                  <span className="font-clinical-data-mono">Admitted 14:20 IST</span>
                </div>
                <div className="text-metadata-micro font-clinical-data text-on-surface-variant">
                  Target Unit: <strong className="text-on-surface">{selectedBed.wardName} · Telemetry Link Active</strong>
                </div>
              </div>

              {/* Payer & TPA Coverage Banner */}
              {selectedBed.payer && selectedBed.payer !== "—" && (
                <div className="p-space-sm bg-surface-container-low rounded-lg flex flex-col gap-1 border border-surface-container">
                  <div className="flex items-center justify-between">
                    <span className="font-metadata-micro text-metadata-micro uppercase tracking-wider text-outline font-bold">
                      Payer &amp; Pre-Authorization
                    </span>
                    <span className="px-1.5 py-0.2 bg-primary-fixed text-on-primary-fixed font-clinical-data-mono text-metadata-micro font-bold rounded">
                      APPROVED
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-body-strong text-clinical-data text-on-surface">{selectedBed.payer}</span>
                    {selectedBed.payerAmount && (
                      <span className="font-clinical-data-mono text-clinical-data font-bold text-primary">
                        {selectedBed.payerAmount}
                      </span>
                    )}
                  </div>
                  <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    Pre-Auth Reference: {selectedBed.preAuthRef || "#CASHLESS-APPROVED"} · Co-pay: 0%
                  </p>
                </div>
              )}

              {/* Required Inpatient Checkpoints & Compliance */}
              <div className="flex flex-col gap-1.5">
                <span className="font-metadata-micro text-metadata-micro uppercase tracking-wider text-outline font-bold">
                  Inpatient Intake Checklist
                </span>
                <div className="flex items-center justify-between p-2 bg-surface-container-low rounded text-clinical-data font-clinical-data border border-surface-container">
                  <span className="flex items-center gap-1.5 text-on-surface">
                    <span className="material-symbols-outlined text-base text-primary">check_circle</span>
                    Biometric e-KYC Identity Verified
                  </span>
                  <span className="font-clinical-data-mono text-metadata-micro text-outline">ABHA Gate</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-surface-container-low rounded text-clinical-data font-clinical-data border border-surface-container">
                  <span className="flex items-center gap-1.5 text-on-surface">
                    <span className="material-symbols-outlined text-base text-primary">check_circle</span>
                    Procedural &amp; Admission Consent
                  </span>
                  <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                    Spouse (Priya S.)
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-error-container rounded text-clinical-data font-clinical-data shadow-xs">
                  <span className="flex items-center gap-1.5 text-on-error-container font-semibold">
                    <span className="material-symbols-outlined text-base text-error">priority_high</span>
                    Hard-Stop Allergy Band Attached
                  </span>
                  <span className="font-clinical-data-mono text-metadata-micro text-on-error-container font-bold">
                    {selectedBed.checklist?.allergyText || "PENICILLIN"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-surface-container-low rounded text-clinical-data font-clinical-data border border-surface-container">
                  <span className="flex items-center gap-1.5 text-on-surface">
                    <span className="material-symbols-outlined text-base text-primary">check_circle</span>
                    Inpatient Wristband Barcoded
                  </span>
                  <span className="font-clinical-data-mono text-metadata-micro text-outline">#IPD-921</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-surface-container-low rounded text-clinical-data font-clinical-data border border-surface-container">
                  <span className="flex items-center gap-1.5 text-on-surface">
                    <span className="material-symbols-outlined text-base text-primary">check_circle</span>
                    STAT Baseline Troponin-I &amp; Bloods
                  </span>
                  <span className="font-clinical-data-mono text-metadata-micro text-tertiary font-bold">
                    Lab Processing
                  </span>
                </div>
              </div>

              {/* Care Pathway Expected LOS */}
              <div className="p-space-sm bg-surface-container rounded-lg flex items-center justify-between border border-outline-variant/30">
                <div className="flex flex-col">
                  <span className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase font-semibold">
                    Estimated Length of Stay (LOS)
                  </span>
                  <span className="font-body-strong text-body-strong text-on-surface">
                    {selectedBed.losEstimate || "4 – 5 Days · Post-PCI Care Pathway"}
                  </span>
                </div>
                <div className="h-8 w-8 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm font-clinical-data-mono font-bold text-clinical-data">
                  {selectedBed.carePathway || "D0"}
                </div>
              </div>

              {/* Operational Drawer CTAs */}
              <div className="flex flex-col gap-space-xs pt-space-xs border-t border-surface-container">
                <button
                  onClick={() => showToast(`Bed occupancy & clinical hand-off confirmed for ${selectedBed.patientName}.`)}
                  className="w-full py-2.5 bg-primary-container text-on-primary-container font-body-strong text-clinical-data rounded hover:opacity-95 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-base">how_to_reg</span>
                  <span>Confirm Bed Occupancy &amp; Hand-off</span>
                </button>
                <div className="grid grid-cols-2 gap-space-xs">
                  <button
                    onClick={() => setIsTransferOpen(true)}
                    className="py-2 bg-surface-container-low text-on-surface font-body-strong text-clinical-data rounded hover:bg-surface-container transition-all flex items-center justify-center gap-1 border border-surface-container"
                  >
                    <span className="material-symbols-outlined text-sm text-secondary">swap_horiz</span>
                    <span>Transfer Bed</span>
                  </button>
                  <button
                    onClick={() => setIsFaceSheetOpen(true)}
                    className="py-2 bg-surface-container-low text-on-surface font-body-strong text-clinical-data rounded hover:bg-surface-container transition-all flex items-center justify-center gap-1 border border-surface-container"
                  >
                    <span className="material-symbols-outlined text-sm text-outline">description</span>
                    <span>Print Face Sheet</span>
                  </button>
                </div>
                <Link
                  href={selectedBed.ipdNo ? `/admissions-ipd/${selectedBed.ipdNo}` : "/admissions-ipd/IPD-2026-00921"}
                  className="w-full py-2 bg-surface-container-lowest text-primary font-body-strong text-clinical-data rounded hover:bg-surface-container-low transition-all flex items-center justify-center gap-1 border border-outline-variant/30"
                >
                  <span className="material-symbols-outlined text-sm">clinical_notes</span>
                  <span>Open Full IPD Clinical Chart</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: NEW ADMISSION REQUEST MODAL */}
      {/* ========================================================================= */}
      {isNewAdmissionOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-lg w-full overflow-hidden">
            <div className="px-5 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">add_circle</span>
                <h3 className="font-body-strong text-body-strong text-on-surface">New Inpatient Admission Order</h3>
              </div>
              <button
                onClick={() => setIsNewAdmissionOpen(false)}
                className="text-on-surface-variant hover:text-on-surface rounded p-1"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateAdmission} className="p-5 flex flex-col gap-3 text-clinical-data">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-metadata-micro uppercase font-semibold text-outline mb-1">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAdmForm.patientName}
                    onChange={(e) => setNewAdmForm({ ...newAdmForm, patientName: e.target.value })}
                    placeholder="e.g. Anand Mahindra"
                    className="w-full h-8 px-3 rounded border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-metadata-micro uppercase font-semibold text-outline mb-1">Age</label>
                  <input
                    type="number"
                    value={newAdmForm.age}
                    onChange={(e) => setNewAdmForm({ ...newAdmForm, age: e.target.value })}
                    className="w-full h-8 px-3 rounded border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-metadata-micro uppercase font-semibold text-outline mb-1">Gender</label>
                  <select
                    value={newAdmForm.gender}
                    onChange={(e) => setNewAdmForm({ ...newAdmForm, gender: e.target.value })}
                    className="w-full h-8 px-2 rounded border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="M">Male (M)</option>
                    <option value="F">Female (F)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-metadata-micro uppercase font-semibold text-outline mb-1">UHID</label>
                  <input
                    type="text"
                    value={newAdmForm.uhid}
                    onChange={(e) => setNewAdmForm({ ...newAdmForm, uhid: e.target.value })}
                    placeholder="DEL-2024-XXXX"
                    className="w-full h-8 px-3 rounded border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-metadata-micro uppercase font-semibold text-outline mb-1">Target Bed</label>
                  <select
                    value={newAdmForm.targetBed}
                    onChange={(e) => setNewAdmForm({ ...newAdmForm, targetBed: e.target.value })}
                    className="w-full h-8 px-2 rounded border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="CCU-05">CCU-05 (Available Clean)</option>
                    <option value="HDU-03">HDU-03 (Available Clean)</option>
                    <option value="Bed 302">Bed 302 (Med-Surg Available)</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-metadata-micro uppercase font-semibold text-outline mb-1">
                    Primary Admitting Diagnosis
                  </label>
                  <input
                    type="text"
                    value={newAdmForm.diagnosis}
                    onChange={(e) => setNewAdmForm({ ...newAdmForm, diagnosis: e.target.value })}
                    className="w-full h-8 px-3 rounded border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-metadata-micro uppercase font-semibold text-outline mb-1">
                    Attending Physician
                  </label>
                  <select
                    value={newAdmForm.attending}
                    onChange={(e) => setNewAdmForm({ ...newAdmForm, attending: e.target.value })}
                    className="w-full h-8 px-2 rounded border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="Dr. Rohit Verma, MD, DM">Dr. Rohit Verma, MD, DM (Cardio)</option>
                    <option value="Dr. S. Kulkarni">Dr. S. Kulkarni (Endo)</option>
                    <option value="Dr. V. Menon (CTVS)">Dr. V. Menon (CTVS)</option>
                    <option value="Dr. Arvind Saxena">Dr. Arvind Saxena (Surgery)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-metadata-micro uppercase font-semibold text-outline mb-1">Payer</label>
                  <input
                    type="text"
                    value={newAdmForm.payer}
                    onChange={(e) => setNewAdmForm({ ...newAdmForm, payer: e.target.value })}
                    className="w-full h-8 px-3 rounded border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setIsNewAdmissionOpen(false)}
                  className="px-3 py-1.5 rounded bg-surface-container text-on-surface hover:bg-surface-container-high font-semibold text-clinical-data"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-primary text-on-primary hover:bg-primary-container font-semibold text-clinical-data shadow-sm"
                >
                  Confirm &amp; Allocate Bed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: BED TRANSFER MANAGER */}
      {/* ========================================================================= */}
      {isTransferOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-md w-full overflow-hidden">
            <div className="px-5 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-xl">swap_horiz</span>
                <h3 className="font-body-strong text-body-strong text-on-surface">Inpatient Bed Transfer Order</h3>
              </div>
              <button
                onClick={() => setIsTransferOpen(false)}
                className="text-on-surface-variant hover:text-on-surface rounded p-1"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4 text-clinical-data">
              <div className="p-3 bg-surface-container-low rounded border border-surface-container">
                <span className="text-metadata-micro text-outline block">Selected Inpatient:</span>
                <span className="font-bold text-on-surface">{selectedBed.patientName}</span>
                <span className="text-metadata-micro text-on-surface-variant block">
                  Current: {selectedBed.bedName} ({selectedBed.wardName})
                </span>
              </div>

              <div>
                <label className="block text-metadata-micro uppercase font-semibold text-outline mb-1">
                  Destination Ward &amp; Bed
                </label>
                <select className="w-full h-8 px-2 rounded border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary">
                  <option>HDU-03 (Cardiology Step-Down Floor 2)</option>
                  <option>Bed 302 (Med-Surg Floor 3)</option>
                  <option>CCU-05 (Coronary Care Floor 2)</option>
                </select>
              </div>

              <div>
                <label className="block text-metadata-micro uppercase font-semibold text-outline mb-1">
                  Clinical Transfer Rationale
                </label>
                <select className="w-full h-8 px-2 rounded border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary">
                  <option>Clinical Acuity Step-Down</option>
                  <option>Escalation to Critical Care (CCU)</option>
                  <option>Post-Procedure Observation</option>
                  <option>Patient / Attendant Room Upgrade</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setIsTransferOpen(false)}
                  className="px-3 py-1.5 rounded bg-surface-container text-on-surface hover:bg-surface-container-high font-semibold text-clinical-data"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsTransferOpen(false);
                    showToast(`Transfer order for ${selectedBed.patientName} created and routed to nursing.`);
                  }}
                  className="px-4 py-1.5 rounded bg-primary text-on-primary hover:bg-primary-container font-semibold text-clinical-data shadow-sm"
                >
                  Initiate Transfer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: BED TURNAROUND MANAGER */}
      {/* ========================================================================= */}
      {isTurnaroundOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-lg w-full overflow-hidden">
            <div className="px-5 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">cleaning_services</span>
                <h3 className="font-body-strong text-body-strong text-on-surface">
                  Housekeeping &amp; Bed Turnaround Queue
                </h3>
              </div>
              <button
                onClick={() => setIsTurnaroundOpen(false)}
                className="text-on-surface-variant hover:text-on-surface rounded p-1"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="p-5 flex flex-col gap-3 text-clinical-data">
              <p className="text-metadata-micro text-on-surface-variant">
                14 beds currently in cleaning cycle across Campus Units. Average turnover time: <strong>18.4 mins</strong>.
              </p>
              <div className="space-y-2">
                <div className="p-3 bg-surface-container-low rounded flex items-center justify-between border border-surface-container">
                  <div>
                    <span className="font-bold text-on-surface">Bed CCU-06 (Coronary Care)</span>
                    <span className="text-metadata-micro text-outline block">Sunita R. · Deep Disinfection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-clinical-data-mono font-bold text-secondary text-xs">ETA: 12m</span>
                    <button
                      onClick={() => showToast("CCU-06 marked clean and ready for admission.")}
                      className="px-2 py-1 bg-primary text-on-primary rounded text-metadata-micro font-bold hover:bg-primary-container"
                    >
                      Mark Clean
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-surface-container-low rounded flex items-center justify-between border border-surface-container">
                  <div>
                    <span className="font-bold text-on-surface">Bed 303 (Med-Surg Floor 3)</span>
                    <span className="text-metadata-micro text-outline block">Rajesh K. · UV Sanitization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-clinical-data-mono font-bold text-secondary text-xs">ETA: 18m</span>
                    <button
                      onClick={() => showToast("Bed 303 marked clean and ready for admission.")}
                      className="px-2 py-1 bg-primary text-on-primary rounded text-metadata-micro font-bold hover:bg-primary-container"
                    >
                      Mark Clean
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setIsTurnaroundOpen(false)}
                  className="px-4 py-1.5 rounded bg-surface-container text-on-surface hover:bg-surface-container-high font-semibold text-clinical-data"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: CENSUS EXPORT */}
      {/* ========================================================================= */}
      {isExportCensusOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-sm w-full overflow-hidden">
            <div className="px-5 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">ios_share</span>
                <h3 className="font-body-strong text-body-strong text-on-surface">Export Inpatient Census</h3>
              </div>
              <button
                onClick={() => setIsExportCensusOpen(false)}
                className="text-on-surface-variant hover:text-on-surface rounded p-1"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="p-5 flex flex-col gap-3 text-clinical-data">
              <button
                onClick={() => {
                  setIsExportCensusOpen(false);
                  showToast("FHIR R4 Inpatient Census JSON generated.");
                }}
                className="p-3 rounded border border-outline-variant hover:border-primary flex items-center gap-3 transition-colors text-left"
              >
                <span className="material-symbols-outlined text-2xl text-primary">data_object</span>
                <div>
                  <span className="font-bold text-on-surface block">FHIR R4 Bundle JSON</span>
                  <span className="text-metadata-micro text-outline">Standard Encounter/Location schema</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsExportCensusOpen(false);
                  showToast("CSV Bed Occupancy spreadsheet downloaded.");
                }}
                className="p-3 rounded border border-outline-variant hover:border-primary flex items-center gap-3 transition-colors text-left"
              >
                <span className="material-symbols-outlined text-2xl text-secondary">table_view</span>
                <div>
                  <span className="font-bold text-on-surface block">CSV / Excel Format</span>
                  <span className="text-metadata-micro text-outline">Bed master, payer, and acuity columns</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: FLOOR MAP VIEW */}
      {/* ========================================================================= */}
      {isFloorMapOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-2xl w-full overflow-hidden">
            <div className="px-5 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">map</span>
                <h3 className="font-body-strong text-body-strong text-on-surface">
                  Floor 2 Schematic Map · Wing A (CCU) &amp; Wing B (HDU)
                </h3>
              </div>
              <button
                onClick={() => setIsFloorMapOpen(false)}
                className="text-on-surface-variant hover:text-on-surface rounded p-1"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="p-6 flex flex-col items-center gap-4">
              <div className="w-full bg-surface-container-low p-4 rounded-xl border border-outline-variant flex flex-col gap-3 font-clinical-data-mono text-xs">
                <div className="flex justify-between font-bold text-outline text-[10px] uppercase">
                  <span>NORTH WING (ELEVATORS &amp; CATH LAB CORRIDOR)</span>
                  <span>EXIT / GURNEY BAY</span>
                </div>
                <div className="grid grid-cols-6 gap-2 text-center font-bold">
                  <div className="p-3 bg-error-container text-error rounded border border-error">CCU-01 (STAT)</div>
                  <div className="p-3 bg-error-container/60 text-error rounded border border-error/50">CCU-02</div>
                  <div className="p-3 bg-secondary-container text-secondary rounded border border-secondary">CCU-03</div>
                  <div className="p-3 bg-surface-container-high text-outline rounded border border-dashed border-outline">CCU-04 (HOLD)</div>
                  <div className="p-3 bg-primary-container text-on-primary-container rounded border border-primary">CCU-05 (FREE)</div>
                  <div className="p-3 bg-surface-container text-secondary rounded border border-secondary">CCU-06 (CLEAN)</div>
                </div>
                <div className="py-2 bg-surface-container-lowest rounded text-center text-outline font-semibold">
                  CENTRAL NURSING COMMAND STATION &amp; MEDICATION DISPENSARY (STATION 02)
                </div>
                <div className="grid grid-cols-4 gap-2 text-center font-bold">
                  <div className="p-3 bg-secondary-container text-secondary rounded">HDU-01</div>
                  <div className="p-3 bg-tertiary-container text-on-tertiary-container rounded">HDU-02 (TRANSFER)</div>
                  <div className="p-3 bg-primary-container text-on-primary-container rounded">HDU-03 (FREE)</div>
                  <div className="p-3 bg-secondary-container text-secondary rounded">HDU-04</div>
                </div>
              </div>
              <button
                onClick={() => setIsFloorMapOpen(false)}
                className="px-4 py-1.5 bg-primary text-on-primary rounded font-semibold text-clinical-data"
              >
                Close Map
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: PRINT FACE SHEET */}
      {/* ========================================================================= */}
      {isFaceSheetOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-md w-full overflow-hidden">
            <div className="px-5 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">description</span>
                <h3 className="font-body-strong text-body-strong text-on-surface">Inpatient Face Sheet Preview</h3>
              </div>
              <button
                onClick={() => setIsFaceSheetOpen(false)}
                className="text-on-surface-variant hover:text-on-surface rounded p-1"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="p-5 flex flex-col gap-3 font-clinical-data text-clinical-data">
              <div className="p-4 bg-surface-container-low rounded-lg border border-surface-container flex flex-col gap-2 font-clinical-data-mono text-xs">
                <div className="flex justify-between border-b pb-1">
                  <span className="font-bold text-primary">APOLLO INDRAPRASTHA IPD</span>
                  <span>{selectedBed.ipdNo}</span>
                </div>
                <div className="flex justify-between">
                  <span>Patient:</span>
                  <span className="font-bold text-on-surface">{selectedBed.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bed Location:</span>
                  <span className="font-bold text-on-surface">{selectedBed.bedName} ({selectedBed.ward})</span>
                </div>
                <div className="flex justify-between">
                  <span>Attending:</span>
                  <span>{selectedBed.attending}</span>
                </div>
                <div className="flex justify-between">
                  <span>Diagnosis:</span>
                  <span>{selectedBed.diagnosis}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payer:</span>
                  <span>{selectedBed.payer}</span>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFaceSheetOpen(false)}
                  className="px-3 py-1.5 rounded bg-surface-container text-on-surface hover:bg-surface-container-high font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsFaceSheetOpen(false);
                    showToast(`Face sheet for ${selectedBed.patientName} sent to network printer.`);
                  }}
                  className="px-4 py-1.5 rounded bg-primary text-on-primary hover:bg-primary-container font-semibold shadow-sm"
                >
                  Print Face Sheet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
