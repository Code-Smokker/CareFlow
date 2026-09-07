/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";

interface PatientRecord {
  id: string;
  token: string;
  acuity: "STAT" | "EMERGENT" | "WAIT";
  acuityDetail?: string;
  isPulse?: boolean;
  name: string;
  isAbhaVerified: boolean;
  uhid: string;
  abhaId: string;
  age: number;
  gender: "M" | "F" | "Other";
  bloodGroup: string;
  deptPrimary: string;
  deptSecondary: string;
  location: string;
  chiefComplaint: string;
  chiefComplaintDetail: string;
  priorityLabel: "P1 STAT CRITICAL" | "P1 STAT" | "P2 Emergent" | "P3 Routine";
  priorityType: "critical" | "emergent" | "routine";
  doctorName: string;
  doctorSpecialty: string;
  docsCount: number;
  actionLabel: "Open Chart" | "Review" | "Consult" | "Manage";
  avatar: string;
  hasRedFlag: boolean;
  redFlagTitle?: string;
  redFlagTimer?: string;
  vitals: {
    nibp: string;
    nibpStatus: string;
    nibpTime: string;
    nibpColor: "error" | "secondary" | "on-surface" | "primary";
    hr: string;
    hrStatus: string;
    hrTime: string;
    hrColor: "error" | "secondary" | "on-surface" | "primary";
    spo2: string;
    spo2Detail: string;
    spo2Time: string;
    spo2Color: "error" | "secondary" | "on-surface" | "primary";
    bmg: string;
    bmgDetail: string;
    bmgTime: string;
    bmgColor: "error" | "secondary" | "on-surface" | "primary";
  };
  ecgInfo?: {
    lead: string;
    elevation: string;
    isCritical: boolean;
  };
  allergies: Array<{
    name: string;
    detail: string;
    severity: "critical" | "warning" | "info";
  }>;
  meds: string[];
  recentDocs: Array<{
    title: string;
    time: string;
    icon: string;
    iconColor: string;
  }>;
}

const INITIAL_PATIENTS: PatientRecord[] = [
  {
    id: "pat-104",
    token: "#104",
    acuity: "STAT",
    isPulse: true,
    name: "Rahul Sharma",
    isAbhaVerified: true,
    uhid: "DEL-2024-8841",
    abhaId: "91-8842-1920-4491",
    age: 42,
    gender: "M",
    bloodGroup: "B+",
    deptPrimary: "OPD · Interventional Cardio",
    deptSecondary: "Cardiology (Cath & OPD)",
    location: "Walk-in · Bedside Bay 02",
    chiefComplaint: "Crushing retrosternal chest pain (45m)",
    chiefComplaintDetail: "ECG confirmed STEMI · Door-to-Balloon active",
    priorityLabel: "P1 STAT CRITICAL",
    priorityType: "critical",
    doctorName: "Dr. Rohit Verma",
    doctorSpecialty: "Lead Interventional",
    docsCount: 6,
    actionLabel: "Open Chart",
    avatar:
      "https://lh3.googleusercontent.com/aida/AEtjO1U9BicSj5K6RkIwJgGOjQMWcfDbvpfnWdCxXm0nkeFW8w18PZVrCpIfSdNRwRHTmu_I5sjz1WwNG63wFrnl8Tc9pQwSLWwIepmyF-wQHI09XFywT8sJdN-RKDAb9R1FbbDiolfvpgBSqozk4s6-fE78btQwn-G6_9gKlai4PHWoHKmJdNRzNu9mPbIcoMglWnKFvMf_Qz_d7MaUU33KTS6XQ0w9DDKhNhq7fkR5YAYTM_fdkv-QSvsU_RE",
    hasRedFlag: true,
    redFlagTitle: "P1 CRITICAL · Acute Anterior STEMI",
    redFlagTimer: "26 MIN ACTIVE",
    vitals: {
      nibp: "148/92",
      nibpStatus: "Stage 2 HTN",
      nibpTime: "14:32",
      nibpColor: "error",
      hr: "104",
      hrStatus: "Sinus Tach",
      hrTime: "14:32",
      hrColor: "error",
      spo2: "94%",
      spo2Detail: "O2 via Nasal 2L/min",
      spo2Time: "14:30",
      spo2Color: "secondary",
      bmg: "118",
      bmgDetail: "Normal baseline",
      bmgTime: "14:18",
      bmgColor: "primary",
    },
    ecgInfo: {
      lead: "Lead II / V3 Telemetry",
      elevation: "ST Elevation +3.2mm",
      isCritical: true,
    },
    allergies: [
      {
        name: "Penicillin G / Amoxicillin",
        detail: "Type 1 Anaphylaxis ('18)",
        severity: "critical",
      },
      {
        name: "Aspirin (High-dose)",
        detail: "Gastric Intolerance",
        severity: "warning",
      },
    ],
    meds: [
      "Amlodipine 5mg OD",
      "Telmisartan 40mg OD",
      "Metformin 500mg BD",
      "Atorvastatin 20mg HS",
    ],
    recentDocs: [
      {
        title: "Central Lab · HbA1c & Lipid Panel",
        time: "Today 13:40",
        icon: "description",
        iconColor: "text-primary",
      },
      {
        title: "Scanned Rx · Dr. Kulkarni Clinic",
        time: "12-May-24",
        icon: "prescriptions",
        iconColor: "text-secondary",
      },
    ],
  },
  {
    id: "pat-118",
    token: "#118",
    acuity: "STAT",
    isPulse: false,
    name: "Sunita Devi",
    isAbhaVerified: true,
    uhid: "DEL-2024-9104",
    abhaId: "91-4410-2910-8812",
    age: 58,
    gender: "F",
    bloodGroup: "O+",
    deptPrimary: "OPD · Gen Med / Cardio",
    deptSecondary: "Cardiology (Cath & OPD)",
    location: "Triage Bay 04",
    chiefComplaint: "Severe breathlessness, orthopnea, SpO2 91%",
    chiefComplaintDetail: "Suspected Acute LV Failure",
    priorityLabel: "P1 STAT",
    priorityType: "critical",
    doctorName: "Dr. S. K. Gupta",
    doctorSpecialty: "Gen Med / Cardiology",
    docsCount: 4,
    actionLabel: "Review",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCaYE5XIka6Y_1zMjkAuUc2ll2UkzFCWH_ysndQPmnTomX3vsi4w8PHEKOPapOrGdKIyB6AiLFX1YB9mft4bnYRMZRj_r6YZEHUoWggV_JNYqDhYpFqfSjWofGhbPSThMr0yXw-g_lRxeBUW1BI9tT3plHiNy-cHCGz4szOKtcvrg8IAFOuXzEuotCZclG1WfS5_pxnr0olNE-tDFXqiAWXg1QtM4PmRViu2F-rKuru5BLjdiNySsxh",
    hasRedFlag: true,
    redFlagTitle: "P1 CRITICAL · Acute LV Failure & Pulmonary Edema",
    redFlagTimer: "18 MIN ACTIVE",
    vitals: {
      nibp: "162/98",
      nibpStatus: "Hypertensive Crisis",
      nibpTime: "14:28",
      nibpColor: "error",
      hr: "112",
      hrStatus: "Tachycardic",
      hrTime: "14:28",
      hrColor: "error",
      spo2: "91%",
      spo2Detail: "O2 Mask 6L/min",
      spo2Time: "14:25",
      spo2Color: "error",
      bmg: "142",
      bmgDetail: "Elevated Postprandial",
      bmgTime: "14:10",
      bmgColor: "secondary",
    },
    allergies: [
      {
        name: "Sulfa Antibiotics",
        detail: "Severe Urticaria / Angioedema ('19)",
        severity: "critical",
      },
    ],
    meds: [
      "Torsemide 20mg OD",
      "Spironolactone 25mg OD",
      "Ramipril 2.5mg OD",
      "Carvedilol 3.125mg BD",
    ],
    recentDocs: [
      {
        title: "Chest X-Ray Portable (AP View)",
        time: "Today 14:15",
        icon: "radiology",
        iconColor: "text-secondary",
      },
      {
        title: "ABG & Electrolyte Panel",
        time: "Today 14:05",
        icon: "science",
        iconColor: "text-primary",
      },
    ],
  },
  {
    id: "pat-121",
    token: "#121",
    acuity: "WAIT",
    acuityDetail: "Wait 14m",
    name: "Rajesh Patel",
    isAbhaVerified: true,
    uhid: "DEL-2024-99214",
    abhaId: "91-0982-3847-1102",
    age: 34,
    gender: "M",
    bloodGroup: "A+",
    deptPrimary: "OPD · Internal Medicine",
    deptSecondary: "General Medicine",
    location: "Consultation Room 08",
    chiefComplaint: "High grade fever + chills (3d), Dengue screen",
    chiefComplaintDetail: "CBC Platelets: 112,000 /µL",
    priorityLabel: "P3 Routine",
    priorityType: "routine",
    doctorName: "Dr. Vandana Rao",
    doctorSpecialty: "General Medicine",
    docsCount: 2,
    actionLabel: "Consult",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCaYE5XIka6Y_1zMjkAuUc2ll2UkzFCWH_ysndQPmnTomX3vsi4w8PHEKOPapOrGdKIyB6AiLFX1YB9mft4bnYRMZRj_r6YZEHUoWggV_JNYqDhYpFqfSjWofGhbPSThMr0yXw-g_lRxeBUW1BI9tT3plHiNy-cHCGz4szOKtcvrg8IAFOuXzEuotCZclG1WfS5_pxnr0olNE-tDFXqiAWXg1QtM4PmRViu2F-rKuru5BLjdiNySsxh",
    hasRedFlag: false,
    vitals: {
      nibp: "118/76",
      nibpStatus: "Normotensive",
      nibpTime: "14:15",
      nibpColor: "on-surface",
      hr: "88",
      hrStatus: "Normal Sinus",
      hrTime: "14:15",
      hrColor: "on-surface",
      spo2: "98%",
      spo2Detail: "Room Air",
      spo2Time: "14:15",
      spo2Color: "primary",
      bmg: "96",
      bmgDetail: "Normal baseline",
      bmgTime: "14:12",
      bmgColor: "primary",
    },
    allergies: [
      {
        name: "No Known Drug Allergies (NKDA)",
        detail: "Confirmed on intake",
        severity: "info",
      },
    ],
    meds: ["Paracetamol 650mg SOS", "ORS Solution 1L/day", "Zinc 50mg OD"],
    recentDocs: [
      {
        title: "CBC & Dengue NS1 / IgM Rapid",
        time: "Today 13:20",
        icon: "science",
        iconColor: "text-primary",
      },
    ],
  },
  {
    id: "pat-123",
    token: "#123",
    acuity: "WAIT",
    acuityDetail: "Wait 22m",
    name: "Anita Rao",
    isAbhaVerified: true,
    uhid: "DEL-2024-48190",
    abhaId: "91-7719-2041-9943",
    age: 61,
    gender: "F",
    bloodGroup: "B-",
    deptPrimary: "OPD · Orthopaedics",
    deptSecondary: "Orthopaedics",
    location: "Joint Clinic Wing C",
    chiefComplaint: "Bilateral knee pain flare (OA Gr. III)",
    chiefComplaintDetail: "X-Ray pre-op evaluation pending",
    priorityLabel: "P3 Routine",
    priorityType: "routine",
    doctorName: "Dr. M. S. Bedi",
    doctorSpecialty: "Orthopaedics",
    docsCount: 5,
    actionLabel: "Review",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCaYE5XIka6Y_1zMjkAuUc2ll2UkzFCWH_ysndQPmnTomX3vsi4w8PHEKOPapOrGdKIyB6AiLFX1YB9mft4bnYRMZRj_r6YZEHUoWggV_JNYqDhYpFqfSjWofGhbPSThMr0yXw-g_lRxeBUW1BI9tT3plHiNy-cHCGz4szOKtcvrg8IAFOuXzEuotCZclG1WfS5_pxnr0olNE-tDFXqiAWXg1QtM4PmRViu2F-rKuru5BLjdiNySsxh",
    hasRedFlag: false,
    vitals: {
      nibp: "130/82",
      nibpStatus: "Pre-hypertension",
      nibpTime: "14:05",
      nibpColor: "on-surface",
      hr: "74",
      hrStatus: "Regular",
      hrTime: "14:05",
      hrColor: "on-surface",
      spo2: "99%",
      spo2Detail: "Room Air",
      spo2Time: "14:05",
      spo2Color: "primary",
      bmg: "105",
      bmgDetail: "Fasting normal",
      bmgTime: "13:50",
      bmgColor: "primary",
    },
    allergies: [
      {
        name: "Codeine / Tramadol",
        detail: "Severe Emesis / Nausea",
        severity: "warning",
      },
    ],
    meds: [
      "Aceclofenac 100mg BD",
      "Paracetamol 325mg BD",
      "Glucosamine 1500mg OD",
      "Pantoprazole 40mg OD",
    ],
    recentDocs: [
      {
        title: "Bilateral Standing Knee X-Rays",
        time: "10-Jul-24",
        icon: "radiology",
        iconColor: "text-secondary",
      },
      {
        title: "Serum Uric Acid & ESR",
        time: "10-Jul-24",
        icon: "science",
        iconColor: "text-primary",
      },
    ],
  },
  {
    id: "pat-125",
    token: "#125",
    acuity: "EMERGENT",
    isPulse: false,
    name: "Mohammad Farooq",
    isAbhaVerified: true,
    uhid: "DEL-2024-71032",
    abhaId: "91-3382-9011-4519",
    age: 67,
    gender: "M",
    bloodGroup: "O-",
    deptPrimary: "OPD · Pulmonology",
    deptSecondary: "General Medicine",
    location: "Resp Care Unit 03",
    chiefComplaint: "COPD cough & purulent sputum, SpO2 93%",
    chiefComplaintDetail: "ABG ordered · Nebulization underway",
    priorityLabel: "P2 Emergent",
    priorityType: "emergent",
    doctorName: "Dr. Ananya Sen",
    doctorSpecialty: "Pulmonologist",
    docsCount: 3,
    actionLabel: "Manage",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCaYE5XIka6Y_1zMjkAuUc2ll2UkzFCWH_ysndQPmnTomX3vsi4w8PHEKOPapOrGdKIyB6AiLFX1YB9mft4bnYRMZRj_r6YZEHUoWggV_JNYqDhYpFqfSjWofGhbPSThMr0yXw-g_lRxeBUW1BI9tT3plHiNy-cHCGz4szOKtcvrg8IAFOuXzEuotCZclG1WfS5_pxnr0olNE-tDFXqiAWXg1QtM4PmRViu2F-rKuru5BLjdiNySsxh",
    hasRedFlag: false,
    vitals: {
      nibp: "138/86",
      nibpStatus: "Stage 1 HTN",
      nibpTime: "14:10",
      nibpColor: "secondary",
      hr: "96",
      hrStatus: "Borderline Tachy",
      hrTime: "14:10",
      hrColor: "secondary",
      spo2: "93%",
      spo2Detail: "O2 via Venturi 28%",
      spo2Time: "14:10",
      spo2Color: "secondary",
      bmg: "128",
      bmgDetail: "Postprandial",
      bmgTime: "13:45",
      bmgColor: "primary",
    },
    allergies: [
      {
        name: "Ciprofloxacin",
        detail: "Achilles Tendinopathy ('21)",
        severity: "warning",
      },
    ],
    meds: [
      "Budesonide + Formoterol 400mcg BD",
      "Tiotropium 18mcg Inhaler OD",
      "Doxofylline 400mg OD",
    ],
    recentDocs: [
      {
        title: "PFT Spirometry Curves (Pre/Post BD)",
        time: "15-May-24",
        icon: "air",
        iconColor: "text-secondary",
      },
      {
        title: "Sputum Culture & Sensitivity",
        time: "Today 13:10",
        icon: "science",
        iconColor: "text-primary",
      },
    ],
  },
  {
    id: "pat-128",
    token: "#128",
    acuity: "WAIT",
    acuityDetail: "Wait 28m",
    name: "Kavita Nair",
    isAbhaVerified: true,
    uhid: "DEL-2024-30911",
    abhaId: "91-1184-7749-3012",
    age: 29,
    gender: "F",
    bloodGroup: "AB+",
    deptPrimary: "OPD · Neurology",
    deptSecondary: "Neurology",
    location: "Neuro Clinic 11",
    chiefComplaint: "Refractory migraine + photophobia",
    chiefComplaintDetail: "Prior Brain MRI unremarkable (2023)",
    priorityLabel: "P3 Routine",
    priorityType: "routine",
    doctorName: "Dr. R. K. Mohan",
    doctorSpecialty: "Neurology",
    docsCount: 1,
    actionLabel: "Review",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCaYE5XIka6Y_1zMjkAuUc2ll2UkzFCWH_ysndQPmnTomX3vsi4w8PHEKOPapOrGdKIyB6AiLFX1YB9mft4bnYRMZRj_r6YZEHUoWggV_JNYqDhYpFqfSjWofGhbPSThMr0yXw-g_lRxeBUW1BI9tT3plHiNy-cHCGz4szOKtcvrg8IAFOuXzEuotCZclG1WfS5_pxnr0olNE-tDFXqiAWXg1QtM4PmRViu2F-rKuru5BLjdiNySsxh",
    hasRedFlag: false,
    vitals: {
      nibp: "112/72",
      nibpStatus: "Optimal",
      nibpTime: "13:55",
      nibpColor: "on-surface",
      hr: "78",
      hrStatus: "Normal Sinus",
      hrTime: "13:55",
      hrColor: "on-surface",
      spo2: "99%",
      spo2Detail: "Room Air",
      spo2Time: "13:55",
      spo2Color: "primary",
      bmg: "92",
      bmgDetail: "Normal baseline",
      bmgTime: "13:40",
      bmgColor: "primary",
    },
    allergies: [
      {
        name: "NSAIDs (Ibuprofen/Naproxen)",
        detail: "Severe Gastritis & Epigastric Pain",
        severity: "warning",
      },
    ],
    meds: [
      "Topiramate 25mg HS",
      "Zolmitriptan 2.5mg SOS",
      "Propranolol 40mg OD",
    ],
    recentDocs: [
      {
        title: "Brain MRI 1.5T with Angiography",
        time: "18-Nov-23",
        icon: "psychology",
        iconColor: "text-secondary",
      },
    ],
  },
  {
    id: "pat-132",
    token: "#132",
    acuity: "WAIT",
    acuityDetail: "Wait 35m",
    name: "Vikas Gupta",
    isAbhaVerified: true,
    uhid: "DEL-2024-3049",
    abhaId: "91-4920-1847-9204",
    age: 45,
    gender: "M",
    bloodGroup: "B+",
    deptPrimary: "OPD · Endocrinology",
    deptSecondary: "Endocrinology",
    location: "Diabetes Unit 05",
    chiefComplaint: "Routine Diabetic follow-up, HbA1c 7.8%",
    chiefComplaintDetail: "Medication titration pending",
    priorityLabel: "P3 Routine",
    priorityType: "routine",
    doctorName: "Dr. Rekha Bansal",
    doctorSpecialty: "Endocrinologist",
    docsCount: 8,
    actionLabel: "Review",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCaYE5XIka6Y_1zMjkAuUc2ll2UkzFCWH_ysndQPmnTomX3vsi4w8PHEKOPapOrGdKIyB6AiLFX1YB9mft4bnYRMZRj_r6YZEHUoWggV_JNYqDhYpFqfSjWofGhbPSThMr0yXw-g_lRxeBUW1BI9tT3plHiNy-cHCGz4szOKtcvrg8IAFOuXzEuotCZclG1WfS5_pxnr0olNE-tDFXqiAWXg1QtM4PmRViu2F-rKuru5BLjdiNySsxh",
    hasRedFlag: false,
    vitals: {
      nibp: "126/80",
      nibpStatus: "Normal Range",
      nibpTime: "13:50",
      nibpColor: "on-surface",
      hr: "76",
      hrStatus: "Regular",
      hrTime: "13:50",
      hrColor: "on-surface",
      spo2: "98%",
      spo2Detail: "Room Air",
      spo2Time: "13:50",
      spo2Color: "primary",
      bmg: "156",
      bmgDetail: "Postprandial (Target <140)",
      bmgTime: "13:30",
      bmgColor: "secondary",
    },
    allergies: [
      {
        name: "No Known Drug Allergies (NKDA)",
        detail: "Confirmed on intake",
        severity: "info",
      },
    ],
    meds: [
      "Metformin 1000mg BD",
      "Empagliflozin 10mg OD",
      "Glimepiride 1mg OD",
      "Atorvastatin 10mg HS",
    ],
    recentDocs: [
      {
        title: "HbA1c & Microalbuminuria Panel",
        time: "Today 12:45",
        icon: "science",
        iconColor: "text-primary",
      },
      {
        title: "Fundoscopy Screening Report",
        time: "02-Apr-24",
        icon: "visibility",
        iconColor: "text-secondary",
      },
    ],
  },
];

export default function PatientRegistryPage() {
  const [patients, setPatients] = useState<PatientRecord[]>(INITIAL_PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("pat-104");
  const [checkedIds, setCheckedIds] = useState<string[]>(["pat-104"]);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("Cardiology (Cath & OPD)");
  const [selectedFacility, setSelectedFacility] = useState("Apollo Indraprastha Central");
  const [selectedPriority, setSelectedPriority] = useState("All Priority");
  const [selectedAbha, setSelectedAbha] = useState("Verified Only");
  const [selectedClinician, setSelectedClinician] = useState("Dr. R. Verma (My Patients)");
  const [isCompact, setIsCompact] = useState(true);

  // Active filter tags state
  const [filterTags, setFilterTags] = useState<string[]>([
    "Priority: P1 STAT & P2 Emergent",
    "ABHA: Linked M1/M2",
  ]);

  // Modals state
  const [isNewRegModalOpen, setIsNewRegModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isCathStatModalOpen, setIsCathStatModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Registration Form
  const [newRegName, setNewRegName] = useState("");
  const [newRegAge, setNewRegAge] = useState("");
  const [newRegGender, setNewRegGender] = useState<"M" | "F" | "Other">("M");
  const [newRegBlood, setNewRegBlood] = useState("B+");
  const [newRegPhone, setNewRegPhone] = useState("");
  const [newRegDept, setNewRegDept] = useState("Cardiology (Cath & OPD)");
  const [newRegPriority, setNewRegPriority] = useState<"P1 STAT CRITICAL" | "P1 STAT" | "P2 Emergent" | "P3 Routine">("P3 Routine");
  const [newRegComplaint, setNewRegComplaint] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Filtered patients
  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = patient.name.toLowerCase().includes(q);
        const matchUhid = patient.uhid.toLowerCase().includes(q);
        const matchAbha = patient.abhaId.toLowerCase().includes(q);
        const matchToken = patient.token.toLowerCase().includes(q);
        const matchComplaint = patient.chiefComplaint.toLowerCase().includes(q);
        if (!matchName && !matchUhid && !matchAbha && !matchToken && !matchComplaint) {
          return false;
        }
      }

      if (selectedDept !== "All Departments") {
        if (!patient.deptPrimary.includes("Cardio") && selectedDept.includes("Cardio")) {
          // let match if user hasn't explicitly cleared
        }
      }

      if (selectedPriority !== "All Priority") {
        if (selectedPriority.includes("P1") && !patient.priorityLabel.includes("P1")) {
          return false;
        }
        if (selectedPriority.includes("P2") && !patient.priorityLabel.includes("P2")) {
          return false;
        }
        if (selectedPriority.includes("P3") && !patient.priorityLabel.includes("P3")) {
          return false;
        }
      }

      return true;
    });
  }, [patients, searchQuery, selectedDept, selectedPriority]);

  const activePatient = useMemo(() => {
    return patients.find((p) => p.id === selectedPatientId) || patients[0];
  }, [patients, selectedPatientId]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setCheckedIds(patients.map((p) => p.id));
    } else {
      setCheckedIds([]);
    }
  };

  const handleToggleCheck = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedDept("All Departments");
    setSelectedPriority("All Priority");
    setSelectedAbha("All Status");
    setSelectedClinician("All Clinicians");
    setFilterTags([]);
    showToast("Filters reset to default view");
  };

  const removeFilterTag = (tag: string) => {
    setFilterTags((prev) => prev.filter((t) => t !== tag));
    showToast(`Removed filter: ${tag}`);
  };

  const clearAllFilterTags = () => {
    setFilterTags([]);
    showToast("All active filter tags cleared");
  };

  const handleCreatePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRegName.trim()) return;

    const newPat: PatientRecord = {
      id: `pat-${Date.now()}`,
      token: `#${Math.floor(135 + Math.random() * 25)}`,
      acuity: newRegPriority.includes("P1") ? "STAT" : newRegPriority.includes("P2") ? "EMERGENT" : "WAIT",
      acuityDetail: newRegPriority.includes("P3") ? "Wait 10m" : undefined,
      isPulse: newRegPriority.includes("P1"),
      name: newRegName.trim(),
      isAbhaVerified: true,
      uhid: `DEL-2024-${Math.floor(10000 + Math.random() * 90000)}`,
      abhaId: `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      age: Number(newRegAge) || 38,
      gender: newRegGender,
      bloodGroup: newRegBlood,
      deptPrimary: `OPD · ${newRegDept.split(" ")[0]}`,
      deptSecondary: newRegDept,
      location: "Walk-in · Triage Desk 01",
      chiefComplaint: newRegComplaint.trim() || "Acute presentation / General evaluation",
      chiefComplaintDetail: "Walk-in registration · Triage queue active",
      priorityLabel: newRegPriority,
      priorityType: newRegPriority.includes("P1") ? "critical" : newRegPriority.includes("P2") ? "emergent" : "routine",
      doctorName: "Dr. Rohit Verma",
      doctorSpecialty: "Attending Clinician",
      docsCount: 1,
      actionLabel: "Open Chart",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCaYE5XIka6Y_1zMjkAuUc2ll2UkzFCWH_ysndQPmnTomX3vsi4w8PHEKOPapOrGdKIyB6AiLFX1YB9mft4bnYRMZRj_r6YZEHUoWggV_JNYqDhYpFqfSjWofGhbPSThMr0yXw-g_lRxeBUW1BI9tT3plHiNy-cHCGz4szOKtcvrg8IAFOuXzEuotCZclG1WfS5_pxnr0olNE-tDFXqiAWXg1QtM4PmRViu2F-rKuru5BLjdiNySsxh",
      hasRedFlag: newRegPriority.includes("P1"),
      redFlagTitle: newRegPriority.includes("P1") ? "P1 CRITICAL · Urgent Clinical Assessment" : undefined,
      redFlagTimer: newRegPriority.includes("P1") ? "05 MIN ACTIVE" : undefined,
      vitals: {
        nibp: "124/82",
        nibpStatus: "Recorded on arrival",
        nibpTime: "Just now",
        nibpColor: "on-surface",
        hr: "82",
        hrStatus: "Regular",
        hrTime: "Just now",
        hrColor: "on-surface",
        spo2: "98%",
        spo2Detail: "Room Air",
        spo2Time: "Just now",
        spo2Color: "primary",
        bmg: "110",
        bmgDetail: "Random baseline",
        bmgTime: "Just now",
        bmgColor: "primary",
      },
      allergies: [
        {
          name: "No Known Drug Allergies (NKDA)",
          detail: "Reported by patient at intake",
          severity: "info",
        },
      ],
      meds: ["None reported on initial intake"],
      recentDocs: [
        {
          title: "Registration Sheet & ABHA Verification",
          time: "Just now",
          icon: "badge",
          iconColor: "text-primary",
        },
      ],
    };

    setPatients((prev) => [newPat, ...prev]);
    setSelectedPatientId(newPat.id);
    setCheckedIds((prev) => [newPat.id, ...prev]);
    setIsNewRegModalOpen(false);
    setNewRegName("");
    setNewRegAge("");
    setNewRegPhone("");
    setNewRegComplaint("");
    showToast(`Patient ${newPat.name} registered successfully with UHID ${newPat.uhid}`);
  };

  const handleExportCsv = () => {
    const headers = [
      "Token",
      "Patient Name",
      "UHID",
      "ABHA ID",
      "Age",
      "Gender",
      "Blood Group",
      "Department",
      "Chief Complaint",
      "Priority",
      "Attending Clinician",
    ];
    const rows = patients.map((p) => [
      `"${p.token}"`,
      `"${p.name}"`,
      `"${p.uhid}"`,
      `"${p.abhaId}"`,
      p.age,
      p.gender,
      `"${p.bloodGroup}"`,
      `"${p.deptPrimary}"`,
      `"${p.chiefComplaint}"`,
      `"${p.priorityLabel}"`,
      `"${p.doctorName}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Apollo_CareFlow_MPI_Registry_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExportModalOpen(false);
    showToast("Exported patient registry CSV successfully");
  };

  const handleExportFhir = () => {
    const bundle = {
      resourceType: "Bundle",
      type: "searchset",
      total: patients.length,
      entry: patients.map((p) => ({
        resource: {
          resourceType: "Patient",
          id: p.uhid,
          identifier: [
            { system: "https://healthid.ndhm.gov.in", value: p.abhaId },
            { system: "urn:oid:apollo.delhi.uhid", value: p.uhid },
          ],
          name: [{ text: p.name }],
          gender: p.gender === "M" ? "male" : "female",
          birthDate: `${2024 - p.age}-01-01`,
        },
      })),
    };
    const jsonStr =
      "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(bundle, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", jsonStr);
    link.setAttribute(
      "download",
      `Apollo_FHIR_R4_Patient_Bundle_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExportModalOpen(false);
    showToast("Exported FHIR R4 Patient Bundle JSON successfully");
  };

  return (
    <div className="flex flex-col w-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-on-surface text-surface px-4 py-2.5 rounded-lg shadow-2xl border border-outline/30 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="material-symbols-outlined text-primary text-xl">verified</span>
          <span className="text-clinical-data font-clinical-data">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-outline hover:text-surface"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* Title & Action Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-space-md mb-space-base">
        <div>
          <div className="flex items-center gap-space-xs">
            <span className="font-metadata-micro text-metadata-micro text-primary font-semibold tracking-wider uppercase">
              Enterprise MPI System
            </span>
            <span className="text-outline-variant font-metadata-micro text-metadata-micro">/</span>
            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant font-medium">
              Apollo Indraprastha Network
            </span>
          </div>
          <h1 className="font-page-title text-page-title text-on-surface tracking-tight mt-0.5">
            Patient Registry &amp; Unified Master Index
          </h1>
          <p className="font-body-default text-clinical-data text-on-surface-variant mt-0.5">
            Search, reconcile, and federate longitudinal electronic health records across Apollo
            Indraprastha campuses and the ABDM health exchange.
          </p>
        </div>
        {/* Quick Action Toolset */}
        <div className="flex flex-wrap items-center gap-space-xs">
          <button
            onClick={() => setIsNewRegModalOpen(true)}
            className="flex items-center gap-1.5 px-space-md py-1.5 bg-primary-container text-on-primary rounded font-clinical-data text-clinical-data shadow-sm hover:opacity-95 transition-all"
          >
            <span className="material-symbols-outlined text-base leading-none">person_add</span>
            <span>+ New Registration</span>
          </button>
          <button
            onClick={() => setIsQrModalOpen(true)}
            className="flex items-center gap-1.5 px-space-md py-1.5 bg-surface-container-lowest text-on-surface rounded font-clinical-data text-clinical-data shadow-sm hover:bg-surface-container transition-all"
          >
            <span className="material-symbols-outlined text-base text-primary leading-none">
              qr_code_scanner
            </span>
            <span>Scan ABHA QR</span>
          </button>
          <button
            onClick={() => setIsSyncModalOpen(true)}
            className="flex items-center gap-1.5 px-space-md py-1.5 bg-surface-container-lowest text-on-surface rounded font-clinical-data text-clinical-data shadow-sm hover:bg-surface-container transition-all"
          >
            <span className="material-symbols-outlined text-base text-secondary leading-none">
              sync
            </span>
            <span>Sync ABDM Gateway</span>
          </button>
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-1 px-space-sm py-1.5 bg-surface-container-lowest text-on-surface-variant rounded font-clinical-data text-clinical-data shadow-sm hover:bg-surface-container transition-all"
          >
            <span className="material-symbols-outlined text-base leading-none">ios_share</span>
            <span>Export CSV / FHIR</span>
          </button>
        </div>
      </div>

      {/* KPI Matrix Strip (6 Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-space-sm mb-space-base">
        {/* KPI 1 */}
        <div className="bg-surface-container-lowest p-space-sm rounded shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant mb-1">
            <span className="font-metadata-micro text-metadata-micro uppercase tracking-wider font-semibold">
              Total Active Patients
            </span>
            <span className="material-symbols-outlined text-base text-secondary">groups</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-chief-complaint text-page-title text-on-surface font-bold">
              14,820
            </span>
            <span className="font-clinical-data-mono text-metadata-micro text-primary font-semibold">
              +18 today
            </span>
          </div>
          <span className="font-metadata-micro text-metadata-micro text-outline mt-1 truncate">
            Across 6 Apollo Facilities
          </span>
        </div>
        {/* KPI 2 */}
        <div className="bg-surface-container-lowest p-space-sm rounded shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant mb-1">
            <span className="font-metadata-micro text-metadata-micro uppercase tracking-wider font-semibold">
              Today&apos;s Registrations
            </span>
            <span className="material-symbols-outlined text-base text-primary">app_registration</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-chief-complaint text-page-title text-on-surface font-bold">
              64
            </span>
            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
              total
            </span>
          </div>
          <span className="font-metadata-micro text-metadata-micro text-outline mt-1 truncate">
            42 OPD · 22 Walk-ins
          </span>
        </div>
        {/* KPI 3 */}
        <div className="bg-surface-container-lowest p-space-sm rounded shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant mb-1">
            <span className="font-metadata-micro text-metadata-micro uppercase tracking-wider font-semibold">
              Today&apos;s OPD Visits
            </span>
            <span className="material-symbols-outlined text-base text-secondary">clinical_notes</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-chief-complaint text-page-title text-on-surface font-bold">
              84
            </span>
            <span className="font-clinical-data-mono text-metadata-micro text-primary font-semibold">
              Live Queue
            </span>
          </div>
          <span className="font-metadata-micro text-metadata-micro text-outline mt-1 truncate">
            OPD / IPD Consultations
          </span>
        </div>
        {/* KPI 4 */}
        <div className="bg-surface-container-lowest p-space-sm rounded shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant mb-1">
            <span className="font-metadata-micro text-metadata-micro uppercase tracking-wider font-semibold">
              Pending Identity Verification
            </span>
            <span className="material-symbols-outlined text-base text-secondary">fingerprint</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-chief-complaint text-page-title text-secondary font-bold">
              12
            </span>
            <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant font-semibold">
              Needs OTP
            </span>
          </div>
          <span className="font-metadata-micro text-metadata-micro text-outline mt-1 truncate">
            Biometric / OTP queue
          </span>
        </div>
        {/* KPI 5 */}
        <div className="bg-surface-container-lowest p-space-sm rounded shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant mb-1">
            <span className="font-metadata-micro text-metadata-micro uppercase tracking-wider font-semibold">
              ABHA Linked
            </span>
            <span className="material-symbols-outlined text-base text-primary">verified</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-chief-complaint text-page-title text-primary font-bold">
              92.4%
            </span>
            <span className="font-clinical-data-mono text-metadata-micro text-primary font-semibold">
              M1/M2/M3
            </span>
          </div>
          <span className="font-metadata-micro text-metadata-micro text-outline mt-1 truncate">
            National Registry compliant
          </span>
        </div>
        {/* KPI 6 (Red Flag) */}
        <div className="bg-error-container/30 p-space-sm rounded shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-error mb-1">
            <span className="font-metadata-micro text-metadata-micro uppercase tracking-wider font-semibold text-error">
              Active Red Flags
            </span>
            <span className="material-symbols-outlined text-base text-error animate-pulse">
              crisis_alert
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-chief-complaint text-page-title text-error font-bold">
              02
            </span>
            <span className="font-metadata-micro text-metadata-micro text-error font-bold">
              STAT REVIEW
            </span>
          </div>
          <span className="font-metadata-micro text-metadata-micro text-error mt-1 truncate font-medium">
            1 ACS STEMI · 1 Acute HF
          </span>
        </div>
      </div>

      {/* Advanced Clinical Filter Bar */}
      <div className="bg-surface-container-lowest p-space-sm rounded shadow-sm mb-space-sm flex flex-col gap-space-xs">
        <div className="flex flex-wrap items-center gap-space-xs">
          {/* Search */}
          <div className="relative flex-1 min-w-[260px]">
            <span className="material-symbols-outlined absolute left-2 top-2 text-outline text-base">
              search
            </span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 text-clinical-data font-clinical-data bg-surface-container-low text-on-surface placeholder:text-outline rounded focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              placeholder="Filter by Token, Patient Name, UHID, ABHA ID or Contact..."
              type="text"
            />
          </div>
          {/* Department Filter */}
          <div className="flex items-center gap-1 bg-surface-container-low px-2 py-1 rounded text-clinical-data font-clinical-data text-on-surface">
            <span className="text-outline text-metadata-micro uppercase font-semibold">Dept:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-transparent text-clinical-data font-clinical-data font-medium text-on-surface focus:outline-none pr-1 cursor-pointer"
            >
              <option>All Departments</option>
              <option>Cardiology (Cath &amp; OPD)</option>
              <option>General Medicine</option>
              <option>Orthopaedics</option>
              <option>Neurology</option>
              <option>Endocrinology</option>
            </select>
          </div>
          {/* Facility Filter */}
          <div className="flex items-center gap-1 bg-surface-container-low px-2 py-1 rounded text-clinical-data font-clinical-data text-on-surface">
            <span className="text-outline text-metadata-micro uppercase font-semibold">Facility:</span>
            <select
              value={selectedFacility}
              onChange={(e) => setSelectedFacility(e.target.value)}
              className="bg-transparent text-clinical-data font-clinical-data font-medium text-on-surface focus:outline-none cursor-pointer"
            >
              <option>Apollo Indraprastha Central</option>
              <option>Apollo Heart Centre - South Ext</option>
              <option>Apollo Cradle & Children - Noida</option>
            </select>
          </div>
          {/* Priority Filter */}
          <div className="flex items-center gap-1 bg-surface-container-low px-2 py-1 rounded text-clinical-data font-clinical-data text-on-surface">
            <span className="text-outline text-metadata-micro uppercase font-semibold">Priority:</span>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="bg-transparent text-clinical-data font-clinical-data font-medium text-on-surface focus:outline-none cursor-pointer"
            >
              <option>All Priority</option>
              <option>P1 Critical (STAT)</option>
              <option>P2 Emergent</option>
              <option>P3 Routine</option>
            </select>
          </div>
          {/* ABHA Verification Filter */}
          <div className="flex items-center gap-1 bg-surface-container-low px-2 py-1 rounded text-clinical-data font-clinical-data text-on-surface">
            <span className="text-outline text-metadata-micro uppercase font-semibold">ABHA:</span>
            <select
              value={selectedAbha}
              onChange={(e) => setSelectedAbha(e.target.value)}
              className="bg-transparent text-clinical-data font-clinical-data font-medium text-on-surface focus:outline-none cursor-pointer"
            >
              <option>All Status</option>
              <option>Verified Only</option>
              <option>Unlinked / Pending</option>
            </select>
          </div>
          {/* Clinician Assigned */}
          <div className="flex items-center gap-1 bg-surface-container-low px-2 py-1 rounded text-clinical-data font-clinical-data text-on-surface">
            <span className="text-outline text-metadata-micro uppercase font-semibold">Clinician:</span>
            <select
              value={selectedClinician}
              onChange={(e) => setSelectedClinician(e.target.value)}
              className="bg-transparent text-clinical-data font-clinical-data font-medium text-on-surface focus:outline-none cursor-pointer"
            >
              <option>All Clinicians</option>
              <option>Dr. R. Verma (My Patients)</option>
              <option>Dr. S. K. Gupta</option>
              <option>Dr. Vandana Rao</option>
            </select>
          </div>
          {/* Reset & Refresh */}
          <button
            onClick={handleResetFilters}
            className="h-8 px-2 flex items-center justify-center rounded bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
            title="Reset Filters"
          >
            <span className="material-symbols-outlined text-base leading-none">filter_alt_off</span>
          </button>
        </div>
        {/* Active Filter Tags & Secondary Toggles */}
        <div className="flex flex-wrap items-center justify-between text-metadata-micro font-metadata-micro gap-space-xs pt-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-outline uppercase font-semibold tracking-wider">
              Active Filters:
            </span>
            {filterTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded text-on-surface font-medium"
              >
                {tag}
                <span
                  onClick={() => removeFilterTag(tag)}
                  className="material-symbols-outlined text-xs cursor-pointer hover:text-error"
                >
                  close
                </span>
              </span>
            ))}
            {filterTags.length > 0 && (
              <button
                onClick={clearAllFilterTags}
                className="text-primary font-semibold cursor-pointer hover:underline"
              >
                Clear all ({filterTags.length})
              </button>
            )}
          </div>
          <div className="flex items-center gap-space-md">
            {/* Duplicate record merge trigger */}
            <button
              onClick={() => setIsMergeModalOpen(true)}
              className="flex items-center gap-1 text-secondary font-clinical-data font-semibold bg-secondary-container/40 px-2 py-0.5 rounded hover:bg-secondary-container transition-colors"
            >
              <span className="material-symbols-outlined text-xs leading-none">merge</span>
              <span>Merge Duplicates (2 detected)</span>
            </button>
            {/* Layout density toggle */}
            <div className="flex items-center gap-1 bg-surface-container-low p-0.5 rounded">
              <button
                onClick={() => setIsCompact(true)}
                className={`px-2 py-0.5 rounded shadow-2xs font-semibold ${
                  isCompact
                    ? "bg-surface-container-lowest text-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Compact Density
              </button>
              <button
                onClick={() => setIsCompact(false)}
                className={`px-2 py-0.5 rounded ${
                  !isCompact
                    ? "bg-surface-container-lowest text-primary font-semibold"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Comfort
              </button>
            </div>
            {!isDrawerOpen && (
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary font-semibold rounded text-metadata-micro hover:bg-primary/20 transition-colors"
                title="Open Quick Patient Dossier"
              >
                <span className="material-symbols-outlined text-xs">dock_to_left</span>
                <span>Show Dossier</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Workspace 2-Pane Framework: Table (Fluid) + Slide-over Quick Patient Dossier (380px) */}
      <div className="flex flex-col 2xl:flex-row gap-space-sm items-start w-full">
        {/* Left Fluid Stage: High Density Patient Registry Table */}
        <div className="flex-1 w-full bg-surface-container-lowest rounded shadow-sm overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-table-header text-table-header uppercase tracking-wider">
                  <th className="py-2 px-3 w-8 text-center">
                    <input
                      checked={
                        checkedIds.length === patients.length && patients.length > 0
                      }
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded text-primary focus:ring-0 cursor-pointer"
                      type="checkbox"
                    />
                  </th>
                  <th className="py-2 px-3">Token &amp; Acuity</th>
                  <th className="py-2 px-3">Patient Name &amp; Identity</th>
                  <th className="py-2 px-2">Age / Sex / Blood</th>
                  <th className="py-2 px-3">Latest Dept / Visit</th>
                  <th className="py-2 px-3">Chief Complaint &amp; Status</th>
                  <th className="py-2 px-2">Triage Priority</th>
                  <th className="py-2 px-3">Assigned Clinician</th>
                  <th className="py-2 px-2 text-center">Docs &amp; ABHA</th>
                  <th className="py-2 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="font-clinical-data text-clinical-data divide-y-0">
                {filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-outline">
                      <span className="material-symbols-outlined text-3xl block mb-1">
                        person_search
                      </span>
                      <p className="font-body-strong">No patients match the search criteria.</p>
                      <button
                        onClick={handleResetFilters}
                        className="mt-2 text-primary font-semibold hover:underline text-xs"
                      >
                        Reset filters
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((patient) => {
                    const isSelected = selectedPatientId === patient.id;
                    const isChecked = checkedIds.includes(patient.id);
                    const isRahul = patient.id === "pat-104";
                    const isSunita = patient.id === "pat-118";
                    const isRajesh = patient.id === "pat-121";
                    const isFarooq = patient.id === "pat-125";
                    const isVikas = patient.id === "pat-132";

                    let rowBg = "hover:bg-surface-container-low transition-colors cursor-pointer";
                    if (isSelected) {
                      rowBg =
                        "bg-surface-container-low/80 hover:bg-surface-container transition-colors cursor-pointer";
                    } else if (isRajesh || isFarooq || isVikas) {
                      rowBg =
                        "hover:bg-surface-container-low transition-colors cursor-pointer bg-surface-container-low/30";
                    } else {
                      rowBg =
                        "hover:bg-surface-container-low transition-colors cursor-pointer bg-surface-container-lowest";
                    }

                    const rowPadding = isCompact ? "py-2" : "py-3";

                    return (
                      <tr
                        key={patient.id}
                        onClick={() => {
                          setSelectedPatientId(patient.id);
                          if (!isDrawerOpen) setIsDrawerOpen(true);
                        }}
                        className={rowBg}
                      >
                        <td
                          className={`${rowPadding} px-3 text-center`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            checked={isChecked}
                            onChange={() => handleToggleCheck(patient.id)}
                            className="rounded text-primary focus:ring-0 cursor-pointer"
                            type="checkbox"
                          />
                        </td>
                        <td className={`${rowPadding} px-3 whitespace-nowrap`}>
                          <div className="flex items-center gap-1.5">
                            {patient.acuity === "STAT" && (
                              <>
                                <span
                                  className={`w-2 h-2 rounded-full bg-error ${
                                    patient.isPulse ? "animate-ping" : ""
                                  }`}
                                ></span>
                                <span className="font-clinical-data-mono font-bold text-error bg-error-container/40 px-1.5 py-0.5 rounded">
                                  {patient.token}
                                </span>
                                <span className="font-metadata-micro text-metadata-micro text-error font-semibold">
                                  STAT
                                </span>
                              </>
                            )}
                            {patient.acuity === "EMERGENT" && (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                                <span className="font-clinical-data-mono font-bold text-on-secondary-container bg-secondary-container px-1.5 py-0.5 rounded">
                                  {patient.token}
                                </span>
                                <span className="font-metadata-micro text-metadata-micro text-secondary font-semibold">
                                  EMERGENT
                                </span>
                              </>
                            )}
                            {patient.acuity === "WAIT" && (
                              <>
                                <span className="font-clinical-data-mono font-semibold text-secondary bg-secondary-container/40 px-1.5 py-0.5 rounded">
                                  {patient.token}
                                </span>
                                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                                  {patient.acuityDetail}
                                </span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className={`${rowPadding} px-3`}>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1">
                              <span
                                className={`font-body-strong text-clinical-data text-on-surface ${
                                  isSelected ? "font-bold" : "font-semibold"
                                }`}
                              >
                                {patient.name}
                              </span>
                              {patient.isAbhaVerified && (
                                <span
                                  className="material-symbols-outlined text-xs text-primary font-bold"
                                  title="ABHA Verified M1/M2/M3"
                                >
                                  verified
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                              <span>{patient.uhid}</span>
                              <span className="text-outline-variant">·</span>
                              <span className="text-primary font-medium">{patient.abhaId}</span>
                            </div>
                          </div>
                        </td>
                        <td
                          className={`${rowPadding} px-2 whitespace-nowrap font-clinical-data-mono text-metadata-micro`}
                        >
                          <span className="text-on-surface font-semibold">
                            {patient.age}
                            {patient.gender}
                          </span>
                          <span className="text-outline-variant">/</span>
                          <span
                            className={
                              patient.bloodGroup.includes("+") && patient.priorityType === "critical"
                                ? "text-error font-bold"
                                : "text-on-surface-variant"
                            }
                          >
                            {patient.bloodGroup}
                          </span>
                        </td>
                        <td className={`${rowPadding} px-3`}>
                          <div className="flex flex-col">
                            <span className="font-semibold text-on-surface text-metadata-micro">
                              {patient.deptPrimary}
                            </span>
                            <span className="font-metadata-micro text-metadata-micro text-outline">
                              {patient.location}
                            </span>
                          </div>
                        </td>
                        <td className={`${rowPadding} px-3`}>
                          <div className="flex flex-col">
                            <span
                              className={`${
                                patient.priorityType === "critical"
                                  ? "text-error font-semibold"
                                  : patient.priorityType === "emergent"
                                  ? "text-secondary font-semibold"
                                  : "text-on-surface font-medium"
                              } text-clinical-data truncate max-w-xs`}
                            >
                              {patient.chiefComplaint}
                            </span>
                            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                              {patient.chiefComplaintDetail}
                            </span>
                          </div>
                        </td>
                        <td className={`${rowPadding} px-2 whitespace-nowrap`}>
                          {patient.priorityType === "critical" ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-metadata-micro font-clinical-data-mono font-bold bg-error text-on-error shadow-2xs">
                              {patient.priorityLabel}
                            </span>
                          ) : patient.priorityType === "emergent" ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-metadata-micro font-clinical-data-mono font-bold bg-secondary-container text-on-secondary-container">
                              {patient.priorityLabel}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-metadata-micro font-clinical-data-mono font-semibold bg-primary/10 text-primary">
                              {patient.priorityLabel}
                            </span>
                          )}
                        </td>
                        <td className={`${rowPadding} px-3 whitespace-nowrap`}>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`material-symbols-outlined text-sm ${
                                isRahul
                                  ? "text-primary"
                                  : isSunita || isFarooq
                                  ? "text-secondary"
                                  : "text-on-surface-variant"
                              }`}
                            >
                              stethoscope
                            </span>
                            <div className="flex flex-col">
                              <span className="font-body-strong text-metadata-micro text-on-surface">
                                {patient.doctorName}
                              </span>
                              <span className="font-metadata-micro text-[10px] text-outline">
                                {patient.doctorSpecialty}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className={`${rowPadding} px-2 text-center whitespace-nowrap`}>
                          <div className="inline-flex items-center gap-1 bg-surface-container px-1.5 py-0.5 rounded text-metadata-micro font-clinical-data-mono">
                            <span
                              className={`material-symbols-outlined text-xs ${
                                patient.docsCount >= 3 ? "text-primary" : "text-outline"
                              }`}
                            >
                              folder
                            </span>
                            <span className={patient.docsCount >= 3 ? "font-semibold" : ""}>
                              {patient.docsCount} docs
                            </span>
                          </div>
                        </td>
                        <td
                          className={`${rowPadding} px-3 text-right whitespace-nowrap`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="inline-flex items-center gap-1">
                            {patient.actionLabel === "Open Chart" ? (
                              <Link
                                href="/patient-overview"
                                className="bg-primary text-on-primary px-2.5 py-1 rounded text-metadata-micro font-clinical-data font-semibold hover:opacity-90 transition-opacity"
                              >
                                Open Chart
                              </Link>
                            ) : (
                              <button
                                onClick={() => {
                                  setSelectedPatientId(patient.id);
                                  setIsDrawerOpen(true);
                                }}
                                className="bg-surface-container hover:bg-surface-container-high text-on-surface px-2.5 py-1 rounded text-metadata-micro font-clinical-data font-semibold transition-colors"
                              >
                                {patient.actionLabel}
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setSelectedPatientId(patient.id);
                                setIsDrawerOpen(true);
                              }}
                              className="p-1 text-on-surface-variant hover:text-on-surface rounded hover:bg-surface-container"
                            >
                              <span className="material-symbols-outlined text-base leading-none">
                                more_vert
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between px-space-md py-space-sm bg-surface-container-low text-metadata-micro font-metadata-micro text-on-surface-variant gap-2">
            <div className="flex items-center gap-space-md">
              <span>
                Showing <strong className="text-on-surface font-clinical-data-mono">1 – 7</strong> of{" "}
                <strong className="text-on-surface font-clinical-data-mono">14,820</strong> records
              </span>
              <div className="flex items-center gap-1">
                <span>Rows per page:</span>
                <select className="bg-surface-container-lowest px-1.5 py-0.5 rounded text-on-surface font-clinical-data-mono focus:outline-none">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                className="px-2 py-1 bg-surface-container-lowest text-outline rounded hover:bg-surface-container disabled:opacity-40"
                disabled
              >
                <span className="material-symbols-outlined text-xs">first_page</span>
              </button>
              <button
                className="px-2 py-1 bg-surface-container-lowest text-outline rounded hover:bg-surface-container disabled:opacity-40"
                disabled
              >
                <span className="material-symbols-outlined text-xs">chevron_left</span>
              </button>
              <span className="px-2.5 py-1 bg-primary text-on-primary font-clinical-data-mono font-bold rounded">
                1
              </span>
              <button className="px-2.5 py-1 bg-surface-container-lowest text-on-surface hover:bg-surface-container rounded font-clinical-data-mono">
                2
              </button>
              <button className="px-2.5 py-1 bg-surface-container-lowest text-on-surface hover:bg-surface-container rounded font-clinical-data-mono">
                3
              </button>
              <span className="px-1 text-outline">...</span>
              <button className="px-2.5 py-1 bg-surface-container-lowest text-on-surface hover:bg-surface-container rounded font-clinical-data-mono">
                1482
              </button>
              <button className="px-2 py-1 bg-surface-container-lowest text-on-surface rounded hover:bg-surface-container">
                <span className="material-symbols-outlined text-xs">chevron_right</span>
              </button>
              <button className="px-2 py-1 bg-surface-container-lowest text-on-surface rounded hover:bg-surface-container">
                <span className="material-symbols-outlined text-xs">last_page</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right-Side Patient Slide-over Quick Drawer */}
        {isDrawerOpen && (
          <div className="w-full 2xl:w-[380px] shrink-0 bg-surface-container-lowest rounded shadow-md overflow-hidden flex flex-col transition-all">
            {/* Drawer Header */}
            <div className="p-space-sm bg-surface-container-high flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-base">badge</span>
                <div className="flex flex-col">
                  <span className="font-body-strong text-clinical-data text-on-surface font-semibold">
                    Patient Quick Dossier
                  </span>
                  <span
                    className={`font-clinical-data-mono text-metadata-micro ${
                      activePatient.priorityType === "critical"
                        ? "text-error font-bold"
                        : "text-secondary font-medium"
                    }`}
                  >
                    Token {activePatient.token} · {activePatient.location}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Link
                  href="/patient-overview"
                  className="h-7 w-7 flex items-center justify-center rounded text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  title="Pop out view in full workspace"
                >
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                </Link>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="h-7 w-7 flex items-center justify-center rounded text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  title="Close panel"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            </div>

            {/* Primary Workspace CTA Banner */}
            <div className="p-space-sm bg-surface-container-low flex flex-col gap-1.5">
              <Link
                href="/patient-overview"
                className="w-full py-2 px-space-sm bg-primary text-on-primary font-clinical-data text-clinical-data font-semibold rounded shadow-sm hover:bg-primary-container transition-colors flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">clinical_notes</span>
                <span>Open Full Clinical Workspace</span>
              </Link>
              <span className="font-metadata-micro text-metadata-micro text-center text-outline">
                Synchronizes consultation, vitals flowsheet &amp; active telemetry
              </span>
            </div>

            {/* Patient Identity Block */}
            <div className="p-space-sm flex items-start gap-space-sm bg-surface-container-lowest">
              <img
                alt={activePatient.name}
                className={`w-14 h-14 rounded object-cover ring-2 ${
                  activePatient.priorityType === "critical"
                    ? "ring-error"
                    : activePatient.priorityType === "emergent"
                    ? "ring-secondary"
                    : "ring-primary"
                } shadow-sm shrink-0`}
                src={activePatient.avatar}
              />
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="font-body-strong text-subheading text-on-surface font-bold truncate">
                    {activePatient.name}
                  </h2>
                  <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[10px] font-clinical-data-mono font-bold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-xs">verified</span>
                    ABHA M3
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-clinical-data-mono text-metadata-micro text-on-surface-variant mt-0.5">
                  <span>
                    {activePatient.age} Yrs /{" "}
                    {activePatient.gender === "M"
                      ? "Male"
                      : activePatient.gender === "F"
                      ? "Female"
                      : "Other"}
                  </span>
                  <span className="text-outline-variant">·</span>
                  <span
                    className={
                      activePatient.priorityType === "critical"
                        ? "text-error font-bold"
                        : "text-on-surface font-semibold"
                    }
                  >
                    Blood: {activePatient.bloodGroup}
                  </span>
                </div>
                <div className="font-clinical-data-mono text-metadata-micro text-outline mt-0.5 truncate">
                  UHID:{" "}
                  <span className="text-on-surface font-semibold">{activePatient.uhid}</span>
                </div>
                <div className="font-clinical-data-mono text-metadata-micro text-outline truncate">
                  ABHA:{" "}
                  <span className="text-primary font-semibold">{activePatient.abhaId}</span>
                </div>
              </div>
            </div>

            {/* Red Flag Alert Strip */}
            {activePatient.hasRedFlag && (
              <div className="mx-space-sm my-1 p-space-xs bg-error-container/40 rounded flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-error font-body-strong text-clinical-data font-bold">
                    <span className="material-symbols-outlined text-base animate-pulse">
                      crisis_alert
                    </span>
                    <span>{activePatient.redFlagTitle}</span>
                  </div>
                  <span className="bg-error text-on-error font-clinical-data-mono text-[10px] px-1.5 py-0.5 rounded font-bold">
                    STAT
                  </span>
                </div>
                {activePatient.redFlagTimer && (
                  <div className="flex items-center justify-between font-clinical-data-mono text-metadata-micro text-error font-medium px-1">
                    <span>Door-to-Balloon Timer:</span>
                    <span className="font-bold underline tracking-wide">
                      {activePatient.redFlagTimer}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Out-of-Bounds Vitals Matrix */}
            <div className="p-space-sm flex flex-col gap-1">
              <span className="font-metadata-micro text-metadata-micro uppercase font-semibold text-outline tracking-wider">
                Tabular Vitals Matrix (Live Telemetry)
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {/* BP */}
                <div className="bg-surface-container-low p-2 rounded flex flex-col justify-between">
                  <div className="flex items-center justify-between text-metadata-micro font-metadata-micro text-on-surface-variant">
                    <span>NIBP</span>
                    <span className="text-[10px] text-outline">
                      {activePatient.vitals.nibpTime}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span
                      className={`font-clinical-data-mono text-subheading font-bold ${
                        activePatient.vitals.nibpColor === "error"
                          ? "text-error"
                          : activePatient.vitals.nibpColor === "secondary"
                          ? "text-secondary"
                          : "text-on-surface"
                      }`}
                    >
                      {activePatient.vitals.nibp}
                    </span>
                    <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                      mmHg
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-clinical-data-mono font-bold flex items-center gap-0.5 ${
                      activePatient.vitals.nibpColor === "error" ? "text-error" : "text-secondary"
                    }`}
                  >
                    <span className="material-symbols-outlined text-xs">arrow_upward</span>{" "}
                    {activePatient.vitals.nibpStatus}
                  </span>
                </div>
                {/* HR */}
                <div className="bg-surface-container-low p-2 rounded flex flex-col justify-between">
                  <div className="flex items-center justify-between text-metadata-micro font-metadata-micro text-on-surface-variant">
                    <span>Heart Rate</span>
                    <span className="text-[10px] text-outline">{activePatient.vitals.hrTime}</span>
                  </div>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span
                      className={`font-clinical-data-mono text-subheading font-bold ${
                        activePatient.vitals.hrColor === "error"
                          ? "text-error"
                          : activePatient.vitals.hrColor === "secondary"
                          ? "text-secondary"
                          : "text-on-surface"
                      }`}
                    >
                      {activePatient.vitals.hr}
                    </span>
                    <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                      bpm
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-clinical-data-mono font-bold flex items-center gap-0.5 ${
                      activePatient.vitals.hrColor === "error" ? "text-error" : "text-secondary"
                    }`}
                  >
                    <span className="material-symbols-outlined text-xs">arrow_upward</span>{" "}
                    {activePatient.vitals.hrStatus}
                  </span>
                </div>
                {/* SpO2 */}
                <div className="bg-surface-container-low p-2 rounded flex flex-col justify-between">
                  <div className="flex items-center justify-between text-metadata-micro font-metadata-micro text-on-surface-variant">
                    <span>SpO2 (Room Air)</span>
                    <span className="text-[10px] text-outline">
                      {activePatient.vitals.spo2Time}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span
                      className={`font-clinical-data-mono text-subheading font-bold ${
                        activePatient.vitals.spo2Color === "error"
                          ? "text-error"
                          : activePatient.vitals.spo2Color === "secondary"
                          ? "text-secondary"
                          : "text-primary"
                      }`}
                    >
                      {activePatient.vitals.spo2}
                    </span>
                    <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                      RA
                    </span>
                  </div>
                  <span className="text-[10px] font-clinical-data-mono text-secondary font-medium">
                    {activePatient.vitals.spo2Detail}
                  </span>
                </div>
                {/* BMG */}
                <div className="bg-surface-container-low p-2 rounded flex flex-col justify-between">
                  <div className="flex items-center justify-between text-metadata-micro font-metadata-micro text-on-surface-variant">
                    <span>Blood Glucose</span>
                    <span className="text-[10px] text-outline">
                      {activePatient.vitals.bmgTime}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-clinical-data-mono text-subheading text-on-surface font-bold">
                      {activePatient.vitals.bmg}
                    </span>
                    <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                      mg/dL
                    </span>
                  </div>
                  <span className="text-[10px] font-clinical-data-mono text-primary font-medium">
                    {activePatient.vitals.bmgDetail}
                  </span>
                </div>
              </div>
            </div>

            {/* Live ECG Waveform Snippet (Inline SVG) */}
            <div className="px-space-sm pb-space-sm flex flex-col gap-1">
              <div className="flex items-center justify-between text-metadata-micro font-metadata-micro">
                <span className="font-semibold text-outline uppercase">
                  {activePatient.ecgInfo?.lead || "Lead II Rhythm Strip"}
                </span>
                <span
                  className={`${
                    activePatient.ecgInfo?.isCritical ? "text-error" : "text-primary"
                  } font-clinical-data-mono font-bold`}
                >
                  {activePatient.ecgInfo?.elevation || "Regular Sinus Rhythm"}
                </span>
              </div>
              <div className="bg-surface-container-highest/60 p-2 rounded flex flex-col items-center justify-center">
                <svg
                  className={`w-full h-12 ${
                    activePatient.ecgInfo?.isCritical ? "text-error" : "text-primary"
                  }`}
                  fill="none"
                  viewBox="0 0 340 50"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 25 L40 25 L45 28 L50 25 L55 25 L60 20 L65 44 L70 3 L77 34 L82 25 L92 14 L110 14 L120 25 L160 25 L165 28 L170 25 L175 25 L180 20 L185 44 L190 3 L197 34 L202 25 L212 14 L230 14 L240 25 L280 25 L285 28 L290 25 L295 25 L300 20 L305 44 L310 3 L317 34 L322 25 L332 14 L340 14"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                  ></path>
                </svg>
                <div className="w-full flex items-center justify-between text-[10px] font-clinical-data-mono text-outline pt-1">
                  <span>25 mm/s</span>
                  <span>10 mm/mV</span>
                  <span>Filter: 0.05-150 Hz</span>
                </div>
              </div>
            </div>

            {/* Hard-Stop Allergies & Chronic Conditions */}
            <div className="px-space-sm pb-space-sm flex flex-col gap-1.5">
              <span className="font-metadata-micro text-metadata-micro uppercase font-semibold text-outline tracking-wider">
                Hard-Stop Allergies
              </span>
              <div className="flex flex-col gap-1">
                {activePatient.allergies.map((allergy, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-1.5 rounded text-metadata-micro ${
                      allergy.severity === "critical"
                        ? "bg-error-container/30"
                        : "bg-surface-container-low"
                    }`}
                  >
                    <div
                      className={`flex items-center gap-1 ${
                        allergy.severity === "critical"
                          ? "text-error font-bold"
                          : "text-on-surface-variant font-medium"
                      }`}
                    >
                      <span className="material-symbols-outlined text-xs">
                        {allergy.severity === "critical" ? "warning" : "info"}
                      </span>
                      <span>{allergy.name}</span>
                    </div>
                    <span
                      className={`font-clinical-data-mono text-[10px] ${
                        allergy.severity === "critical" ? "text-error" : "text-outline"
                      }`}
                    >
                      {allergy.detail}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Prescribed Regimen */}
            <div className="px-space-sm pb-space-sm flex flex-col gap-1">
              <div className="flex items-center justify-between font-metadata-micro text-metadata-micro">
                <span className="uppercase font-semibold text-outline tracking-wider">
                  Active Regimen
                </span>
                <span className="font-clinical-data-mono text-outline">
                  {activePatient.meds.length} Active Meds
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {activePatient.meds.map((med, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-surface-container-low text-on-surface rounded text-metadata-micro font-clinical-data font-medium"
                  >
                    {med}
                  </span>
                ))}
              </div>
            </div>

            {/* Recent Federated Documents */}
            <div className="px-space-sm pb-space-sm flex flex-col gap-1">
              <span className="font-metadata-micro text-metadata-micro uppercase font-semibold text-outline tracking-wider">
                Recent Documents (ABDM Synced)
              </span>
              <div className="flex flex-col gap-1 font-clinical-data text-metadata-micro">
                {activePatient.recentDocs.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-1.5 bg-surface-container rounded hover:bg-surface-container-high transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className={`material-symbols-outlined text-sm ${doc.iconColor}`}>
                        {doc.icon}
                      </span>
                      <span className="font-semibold text-on-surface truncate max-w-[190px]">
                        {doc.title}
                      </span>
                    </div>
                    <span className="font-clinical-data-mono text-[10px] text-outline">
                      {doc.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Action Footer Strip */}
            <div className="p-space-sm bg-surface-container-high flex items-center justify-between gap-1.5 mt-auto">
              <button
                onClick={() => setIsCathStatModalOpen(true)}
                className="flex-1 py-1.5 px-2 bg-error text-on-error rounded font-clinical-data text-metadata-micro font-bold hover:opacity-90 flex items-center justify-center gap-1 transition-opacity"
              >
                <span className="material-symbols-outlined text-sm">emergency_share</span>
                <span>Cath Lab STAT</span>
              </button>
              <button
                onClick={() =>
                  showToast(
                    `Initiated Bedside Telephony with ${activePatient.name} / Attending Station`
                  )
                }
                className="py-1.5 px-2.5 bg-surface-container-lowest text-on-surface rounded font-clinical-data text-metadata-micro font-semibold hover:bg-surface-container flex items-center justify-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-sm text-secondary">
                  phone_forwarded
                </span>
                <span>Call</span>
              </button>
              <button
                onClick={() =>
                  showToast(`Printed clinical summary snapshot for UHID ${activePatient.uhid}`)
                }
                className="py-1.5 px-2.5 bg-surface-container-lowest text-on-surface rounded font-clinical-data text-metadata-micro font-semibold hover:bg-surface-container flex items-center justify-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-sm text-outline">print</span>
                <span>Summary</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}

      {/* 1. New Registration Modal */}
      {isNewRegModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-xl shadow-2xl overflow-hidden border border-outline-variant">
            <div className="p-space-base bg-surface-container-high flex items-center justify-between border-b border-outline-variant">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">person_add</span>
                <h3 className="font-page-title text-subheading font-bold text-on-surface">
                  + New Patient Registration
                </h3>
              </div>
              <button
                onClick={() => setIsNewRegModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <form onSubmit={handleCreatePatientSubmit} className="p-space-base flex flex-col gap-3">
              <div>
                <label className="text-metadata-micro font-semibold text-outline uppercase block mb-1">
                  Full Name *
                </label>
                <input
                  required
                  value={newRegName}
                  onChange={(e) => setNewRegName(e.target.value)}
                  placeholder="e.g. Meera Krishnan"
                  className="w-full h-8 px-3 text-clinical-data bg-surface-container-low text-on-surface rounded border border-outline-variant focus:outline-none focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-metadata-micro font-semibold text-outline uppercase block mb-1">
                    Age *
                  </label>
                  <input
                    required
                    type="number"
                    value={newRegAge}
                    onChange={(e) => setNewRegAge(e.target.value)}
                    placeholder="45"
                    className="w-full h-8 px-3 text-clinical-data bg-surface-container-low text-on-surface rounded border border-outline-variant focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-metadata-micro font-semibold text-outline uppercase block mb-1">
                    Gender *
                  </label>
                  <select
                    value={newRegGender}
                    onChange={(e) => setNewRegGender(e.target.value as "M" | "F" | "Other")}
                    className="w-full h-8 px-2 text-clinical-data bg-surface-container-low text-on-surface rounded border border-outline-variant focus:outline-none focus:border-primary"
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-metadata-micro font-semibold text-outline uppercase block mb-1">
                    Blood Group
                  </label>
                  <select
                    value={newRegBlood}
                    onChange={(e) => setNewRegBlood(e.target.value)}
                    className="w-full h-8 px-2 text-clinical-data bg-surface-container-low text-on-surface rounded border border-outline-variant focus:outline-none focus:border-primary"
                  >
                    <option>A+</option>
                    <option>B+</option>
                    <option>O+</option>
                    <option>AB+</option>
                    <option>A-</option>
                    <option>B-</option>
                    <option>O-</option>
                    <option>AB-</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-metadata-micro font-semibold text-outline uppercase block mb-1">
                    Mobile Contact
                  </label>
                  <input
                    value={newRegPhone}
                    onChange={(e) => setNewRegPhone(e.target.value)}
                    placeholder="+91 98110 00000"
                    className="w-full h-8 px-3 text-clinical-data bg-surface-container-low text-on-surface rounded border border-outline-variant focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-metadata-micro font-semibold text-outline uppercase block mb-1">
                    Department
                  </label>
                  <select
                    value={newRegDept}
                    onChange={(e) => setNewRegDept(e.target.value)}
                    className="w-full h-8 px-2 text-clinical-data bg-surface-container-low text-on-surface rounded border border-outline-variant focus:outline-none focus:border-primary"
                  >
                    <option>Cardiology (Cath &amp; OPD)</option>
                    <option>General Medicine</option>
                    <option>Orthopaedics</option>
                    <option>Neurology</option>
                    <option>Endocrinology</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-metadata-micro font-semibold text-outline uppercase block mb-1">
                  Triage Priority
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewRegPriority("P1 STAT CRITICAL")}
                    className={`py-1 rounded text-metadata-micro font-bold ${
                      newRegPriority === "P1 STAT CRITICAL"
                        ? "bg-error text-on-error"
                        : "bg-surface-container-low text-on-surface"
                    }`}
                  >
                    P1 STAT
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewRegPriority("P2 Emergent")}
                    className={`py-1 rounded text-metadata-micro font-bold ${
                      newRegPriority === "P2 Emergent"
                        ? "bg-secondary-container text-on-secondary-container"
                        : "bg-surface-container-low text-on-surface"
                    }`}
                  >
                    P2 Emergent
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewRegPriority("P3 Routine")}
                    className={`py-1 rounded text-metadata-micro font-semibold ${
                      newRegPriority === "P3 Routine"
                        ? "bg-primary text-on-primary"
                        : "bg-surface-container-low text-on-surface"
                    }`}
                  >
                    P3 Routine
                  </button>
                </div>
              </div>
              <div>
                <label className="text-metadata-micro font-semibold text-outline uppercase block mb-1">
                  Chief Complaint / Reason for Encounter
                </label>
                <textarea
                  rows={2}
                  value={newRegComplaint}
                  onChange={(e) => setNewRegComplaint(e.target.value)}
                  placeholder="e.g. Sudden onset palpitation and shortness of breath..."
                  className="w-full px-3 py-1.5 text-clinical-data bg-surface-container-low text-on-surface rounded border border-outline-variant focus:outline-none focus:border-primary resize-none"
                ></textarea>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant">
                <button
                  type="button"
                  onClick={() => setIsNewRegModalOpen(false)}
                  className="px-3 py-1.5 rounded text-clinical-data font-medium text-on-surface-variant hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded text-clinical-data font-semibold bg-primary text-on-primary hover:opacity-95 shadow-sm"
                >
                  Complete Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Scan ABHA QR Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-xl shadow-2xl overflow-hidden border border-outline-variant flex flex-col">
            <div className="p-space-base bg-surface-container-high flex items-center justify-between border-b border-outline-variant">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">
                  qr_code_scanner
                </span>
                <h3 className="font-page-title text-subheading font-bold text-on-surface">
                  Scan ABHA QR Code
                </h3>
              </div>
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="p-space-base flex flex-col items-center justify-center gap-4">
              <div className="relative w-56 h-56 bg-surface-container-high rounded-xl border-2 border-dashed border-primary flex flex-col items-center justify-center overflow-hidden">
                <span className="material-symbols-outlined text-5xl text-primary animate-pulse">
                  qr_code_2
                </span>
                <span className="text-metadata-micro text-outline font-clinical-data-mono mt-2">
                  Scanning active...
                </span>
                <div className="absolute inset-x-0 h-0.5 bg-error animate-bounce top-1/2"></div>
              </div>
              <p className="text-center font-metadata-micro text-on-surface-variant">
                Align the patient&apos;s Ayushman Bharat Digital Mission (ABDM) QR card within the frame.
              </p>
              <div className="flex items-center gap-2 w-full">
                <button
                  onClick={() => {
                    setIsQrModalOpen(false);
                    showToast(
                      "ABHA QR scanned: Profile verified for 91-8842-1920-4491 (Rahul Sharma)"
                    );
                  }}
                  className="flex-1 py-2 bg-primary text-on-primary rounded font-clinical-data text-clinical-data font-semibold hover:opacity-95 text-center"
                >
                  Simulate QR Match
                </button>
                <button
                  onClick={() => setIsQrModalOpen(false)}
                  className="py-2 px-4 bg-surface-container rounded text-on-surface font-clinical-data text-clinical-data"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Sync ABDM Gateway Modal */}
      {isSyncModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-xl shadow-2xl overflow-hidden border border-outline-variant flex flex-col">
            <div className="p-space-base bg-surface-container-high flex items-center justify-between border-b border-outline-variant">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-xl animate-spin">
                  sync
                </span>
                <h3 className="font-page-title text-subheading font-bold text-on-surface">
                  ABDM Gateway Node Sync
                </h3>
              </div>
              <button
                onClick={() => setIsSyncModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="p-space-base flex flex-col gap-3 font-clinical-data text-clinical-data">
              <div className="flex items-center justify-between p-2 rounded bg-surface-container-low">
                <span className="text-on-surface font-medium">Gateway Protocol:</span>
                <span className="font-clinical-data-mono font-bold text-primary">FHIR R4 / ABDM M3</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-surface-container-low">
                <span className="text-on-surface font-medium">Active Node:</span>
                <span className="font-clinical-data-mono font-bold text-on-surface">
                  Apollo-IND-GATEWAY-01
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-surface-container-low">
                <span className="text-on-surface font-medium">Network Latency:</span>
                <span className="font-clinical-data-mono font-bold text-primary">28ms</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-surface-container-low">
                <span className="text-on-surface font-medium">Consent Artifacts Polled:</span>
                <span className="font-clinical-data-mono font-bold text-secondary">
                  42 Verified
                </span>
              </div>
              <button
                onClick={() => {
                  setIsSyncModalOpen(false);
                  showToast("ABDM Central Health Stack synchronization completed (42 records updated)");
                }}
                className="w-full py-2 bg-primary text-on-primary rounded font-semibold mt-2 hover:opacity-95"
              >
                Trigger Force Re-sync
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Merge Duplicates Modal */}
      {isMergeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-surface-container-lowest w-full max-w-xl rounded-xl shadow-2xl overflow-hidden border border-outline-variant flex flex-col">
            <div className="p-space-base bg-surface-container-high flex items-center justify-between border-b border-outline-variant">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-xl">merge</span>
                <h3 className="font-page-title text-subheading font-bold text-on-surface">
                  Reconcile Master Patient Index Duplicates
                </h3>
              </div>
              <button
                onClick={() => setIsMergeModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="p-space-base flex flex-col gap-3 font-clinical-data text-clinical-data">
              <p className="text-on-surface-variant text-metadata-micro">
                The MPI deterministic algorithm detected a probable duplicate identity across
                different OPD registration desks:
              </p>
              <div className="grid grid-cols-2 gap-2 text-metadata-micro">
                <div className="p-2 bg-surface-container-low rounded border border-primary/30">
                  <span className="text-primary font-bold block mb-1">Master Record (Retain)</span>
                  <div className="font-clinical-data-mono space-y-0.5">
                    <div>
                      Name: <strong className="text-on-surface">Rahul Sharma</strong>
                    </div>
                    <div>
                      UHID: <strong className="text-on-surface">DEL-2024-8841</strong>
                    </div>
                    <div>ABHA: 91-8842-1920-4491</div>
                    <div>DOB: 12-Apr-1982 (42M)</div>
                    <div>Phone: +91 98102 44321</div>
                  </div>
                </div>
                <div className="p-2 bg-surface-container-low rounded border border-outline-variant">
                  <span className="text-secondary font-bold block mb-1">
                    Duplicate / Legacy Entry
                  </span>
                  <div className="font-clinical-data-mono space-y-0.5 text-on-surface-variant">
                    <div>
                      Name: <strong className="text-on-surface">R. Sharma</strong>
                    </div>
                    <div>
                      UHID: <strong className="text-on-surface">DEL-2023-9912</strong>
                    </div>
                    <div>ABHA: Unlinked (Legacy)</div>
                    <div>DOB: 1982 (42M)</div>
                    <div>Phone: +91 98102 44321</div>
                  </div>
                </div>
              </div>
              <div className="p-2 bg-surface-container rounded text-metadata-micro text-on-surface-variant">
                <strong>Reconciliation Rule:</strong> All 2 historical visits, laboratory panels, and
                radiology scans from DEL-2023-9912 will be unified into DEL-2024-8841 with an ABDM
                alias pointer.
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant">
                <button
                  onClick={() => setIsMergeModalOpen(false)}
                  className="px-3 py-1.5 rounded text-clinical-data text-on-surface-variant hover:bg-surface-container"
                >
                  Dismiss
                </button>
                <button
                  onClick={() => {
                    setIsMergeModalOpen(false);
                    showToast("MPI Records merged: DEL-2023-9912 consolidated into DEL-2024-8841");
                  }}
                  className="px-4 py-1.5 rounded text-clinical-data font-semibold bg-secondary text-on-secondary hover:opacity-95 shadow-sm"
                >
                  Confirm MPI Merge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Export Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-xl shadow-2xl overflow-hidden border border-outline-variant flex flex-col">
            <div className="p-space-base bg-surface-container-high flex items-center justify-between border-b border-outline-variant">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">ios_share</span>
                <h3 className="font-page-title text-subheading font-bold text-on-surface">
                  Export Registry Data
                </h3>
              </div>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="p-space-base flex flex-col gap-3">
              <button
                onClick={handleExportCsv}
                className="p-3 rounded-lg border border-outline-variant hover:border-primary flex items-center justify-between transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-2xl">
                    table_view
                  </span>
                  <div>
                    <span className="font-semibold text-clinical-data text-on-surface block">
                      Download Tabular CSV
                    </span>
                    <span className="text-metadata-micro text-outline">
                      Excel / Google Sheets compatible registry table
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-base text-outline">download</span>
              </button>
              <button
                onClick={handleExportFhir}
                className="p-3 rounded-lg border border-outline-variant hover:border-primary flex items-center justify-between transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-2xl">
                    integration_instructions
                  </span>
                  <div>
                    <span className="font-semibold text-clinical-data text-on-surface block">
                      FHIR R4 Patient Bundle (JSON)
                    </span>
                    <span className="text-metadata-micro text-outline">
                      HL7/FHIR compliant interoperability bundle
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-base text-outline">download</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Cath Lab STAT Alert Modal */}
      {isCathStatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-xl shadow-2xl overflow-hidden border-2 border-error flex flex-col">
            <div className="p-space-base bg-error text-on-error flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xl animate-pulse">
                  emergency_share
                </span>
                <h3 className="font-page-title text-subheading font-bold">
                  STAT Cath Lab Activation
                </h3>
              </div>
              <button
                onClick={() => setIsCathStatModalOpen(false)}
                className="text-on-error hover:opacity-80"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="p-space-base flex flex-col gap-3 font-clinical-data text-clinical-data">
              <div className="p-2 bg-error-container/40 rounded flex flex-col gap-1">
                <span className="text-error font-bold">Patient: {activePatient.name}</span>
                <span className="font-clinical-data-mono text-metadata-micro text-error">
                  UHID: {activePatient.uhid} · {activePatient.age}M · Token {activePatient.token}
                </span>
                <span className="font-clinical-data-mono text-metadata-micro text-error font-semibold">
                  Diagnosis: Acute Anterior STEMI (Lead II/V3 Elevation +3.2mm)
                </span>
              </div>
              <div className="flex flex-col gap-1 text-metadata-micro text-on-surface-variant">
                <span>• Cath Lab 01 Team: Paged &amp; Standby</span>
                <span>• Interventionalist: Dr. Rohit Verma notified</span>
                <span>• Door-to-balloon target: &lt; 90 minutes (26 min elapsed)</span>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant">
                <button
                  onClick={() => setIsCathStatModalOpen(false)}
                  className="px-3 py-1.5 rounded text-clinical-data text-on-surface-variant hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setIsCathStatModalOpen(false);
                    showToast("Cath Lab 01 team activated. Patient transport dispatched to Bay 02.");
                  }}
                  className="px-4 py-1.5 rounded text-clinical-data font-bold bg-error text-on-error hover:opacity-95 shadow-md"
                >
                  Broadcast STAT Activation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
