"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";

interface Appointment {
  id: string;
  time: string;
  isActiveNow?: boolean;
  doctorName: string;
  doctorSpecialty: string;
  room: string;
  doctorAvatarInitials?: string;
  token: string;
  acuity: "P1 STAT CRITICAL" | "P1 High Alert" | "P2 Emergent" | "P3 Routine" | "AVAILABLE";
  patientName: string;
  age: number | string;
  gender: string;
  uhid: string;
  abhaId?: string;
  isAbhaVerified?: boolean;
  visitType: string;
  complaint: string;
  status: string;
  statusType: "stat" | "in-lounge" | "in-queue" | "triage-done" | "confirmed" | "available";
  wait: string;
  waitIsAlert?: boolean;
  flags: string;
  flagIcon?: string;
  flagType: "error" | "secondary" | "routine" | "success";
  isOpenSlot?: boolean;
  vitals?: {
    bp: string;
    bpTrend?: "up" | "normal" | "down";
    hr: string;
    hrTrend?: "up" | "normal" | "down";
    spo2: string;
    spo2Detail?: string;
    glucose: string;
  };
  allergies?: string[];
  protocolBanner?: {
    title: string;
    elapsed: string;
    note: string;
    roomBadge: string;
  };
  milestones?: Array<{
    title: string;
    time: string;
    note: string;
    type: "primary" | "error" | "ping";
  }>;
  audit?: {
    bookedVia: string;
    operator: string;
    encounterId: string;
  };
}

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "apt-104",
    time: "14:15 - 14:30",
    isActiveNow: true,
    doctorName: "Dr. Rohit Verma",
    doctorSpecialty: "Cardiology",
    room: "Room 04 · ER Bay 02",
    doctorAvatarInitials: "RV",
    token: "#104",
    acuity: "P1 STAT CRITICAL",
    patientName: "Rahul Sharma",
    age: 42,
    gender: "M",
    uhid: "DEL-2024-8841",
    abhaId: "91-8842-1920-4491@abdm",
    isAbhaVerified: true,
    visitType: "Emergency Walk-in",
    complaint: "Acute Retrosternal Pain",
    status: "In Consult (STAT)",
    statusType: "stat",
    wait: "0m",
    flags: "Suspected STEMI",
    flagIcon: "warning",
    flagType: "error",
    vitals: {
      bp: "148/92",
      bpTrend: "up",
      hr: "104",
      hrTrend: "up",
      spo2: "98%",
      spo2Detail: "2L O2",
      glucose: "118",
    },
    allergies: ["Penicillin Anaphylaxis", "Aspirin Gastric Intolerance"],
    protocolBanner: {
      title: "Acute STEMI Protocol Active",
      elapsed: "28m ELAPSED",
      note: "Target Door-to-Balloon < 90 min. Cath Lab Team Beta notified at 14:22 IST.",
      roomBadge: "ER-BAY-02",
    },
    milestones: [
      {
        title: "Arrived at Triage Desk",
        time: "14:10 IST",
        note: "Walk-in accompanied by brother. Severe acute chest pressure.",
        type: "primary",
      },
      {
        title: "Voice Intake Structured",
        time: "14:18 IST",
        note: "AI Voice ambient draft verified by Nurse Ancy Thomas.",
        type: "primary",
      },
      {
        title: "12-Lead ECG Triaged",
        time: "14:20 IST",
        note: "ST Elevations in V1-V4. STEMI Code 1 triggered.",
        type: "error",
      },
      {
        title: "Bedside Telemetry Live",
        time: "LIVE",
        note: "Continuous lead II & V5 tracking active on Station 04 monitor.",
        type: "ping",
      },
    ],
    audit: {
      bookedVia: "ER Walk-in Triage Kiosk 02",
      operator: "Nurse Ancy Thomas (RN #4419)",
      encounterId: "enc-20241018-0904",
    },
  },
  {
    id: "apt-118",
    time: "14:30 - 14:45",
    doctorName: "Dr. S. Kulkarni",
    doctorSpecialty: "Endocrinology",
    room: "Suite 12 · Endo",
    doctorAvatarInitials: "SK",
    token: "#118",
    acuity: "P1 High Alert",
    patientName: "Sunita Devi",
    age: 58,
    gender: "F",
    uhid: "DEL-2024-9104",
    abhaId: "91-7712-4091-1123@abdm",
    isAbhaVerified: true,
    visitType: "Urgent Referral",
    complaint: "Decomp HF / Orthopnea",
    status: "Checked In - Lounge",
    statusType: "in-lounge",
    wait: "12m",
    waitIsAlert: true,
    flags: "SpO2 91% RA",
    flagIcon: "air",
    flagType: "error",
    vitals: {
      bp: "155/95",
      bpTrend: "up",
      hr: "92",
      hrTrend: "normal",
      spo2: "91%",
      spo2Detail: "Room Air",
      glucose: "142",
    },
    allergies: ["Sulfa Drugs Hypersensitivity"],
    protocolBanner: {
      title: "Desaturation Watch Protocol",
      elapsed: "14m IN LOUNGE",
      note: "Urgent HF decompensation review. High risk of pulmonary congestion.",
      roomBadge: "LOUNGE-BAY-B",
    },
    milestones: [
      {
        title: "Walk-in Intake Form Recorded",
        time: "14:18 IST",
        note: "Referred from Primary Health Center Rohini.",
        type: "primary",
      },
      {
        title: "Triage Vitals Check",
        time: "14:24 IST",
        note: "SpO2 91% on room air detected. Supplemental nasal cannula staged.",
        type: "error",
      },
      {
        title: "Assigned to Dr. Kulkarni",
        time: "14:28 IST",
        note: "Suite 12 standby queue position #1.",
        type: "primary",
      },
    ],
    audit: {
      bookedVia: "Regional Referral Gateway PHC-08",
      operator: "Dr. Alok Sen (Medical Officer)",
      encounterId: "enc-20241018-0918",
    },
  },
  {
    id: "apt-121",
    time: "14:45 - 15:00",
    doctorName: "Dr. Rohit Verma",
    doctorSpecialty: "Cardiology",
    room: "Room 04 · Cardio OPD",
    doctorAvatarInitials: "RV",
    token: "#121",
    acuity: "P3 Routine",
    patientName: "Rajesh Patel",
    age: 34,
    gender: "M",
    uhid: "DEL-2024-99214",
    abhaId: "91-6623-1188-9902@abdm",
    isAbhaVerified: true,
    visitType: "Follow-up Consult",
    complaint: "Post-Op Echo Review",
    status: "Checked In - In Queue",
    statusType: "in-queue",
    wait: "18m",
    flags: "Routine Glycemic Check",
    flagType: "routine",
    vitals: {
      bp: "124/82",
      bpTrend: "normal",
      hr: "76",
      hrTrend: "normal",
      spo2: "99%",
      spo2Detail: "Room Air",
      glucose: "102",
    },
    allergies: ["No Known Drug Allergies (NKDA)"],
    milestones: [
      {
        title: "QR Kiosk Self Check-In",
        time: "14:27 IST",
        note: "Patient scanned ABHA token QR at Tower B entrance.",
        type: "primary",
      },
      {
        title: "2D Echo Report Synced",
        time: "14:32 IST",
        note: "DICOM PACs study 2024-EC-441 attached to encounter.",
        type: "primary",
      },
    ],
    audit: {
      bookedVia: "Patient App (CareFlow Portal)",
      operator: "Self-Service Mobile",
      encounterId: "enc-20241018-0921",
    },
  },
  {
    id: "apt-125",
    time: "15:00 - 15:15",
    doctorName: "Dr. M. Chacko",
    doctorSpecialty: "Pulmonology",
    room: "Suite 08 · Pulmonology",
    doctorAvatarInitials: "MC",
    token: "#125",
    acuity: "P2 Emergent",
    patientName: "Mohammad Farooq",
    age: 67,
    gender: "M",
    uhid: "DEL-2024-71032",
    abhaId: "91-5544-7711-8201@abdm",
    isAbhaVerified: true,
    visitType: "Exacerbation Walk-in",
    complaint: "COPD Bronchospasm",
    status: "Triage Done",
    statusType: "triage-done",
    wait: "08m",
    flags: "Nebulization In-Prog",
    flagIcon: "medication",
    flagType: "secondary",
    vitals: {
      bp: "136/88",
      bpTrend: "normal",
      hr: "98",
      hrTrend: "up",
      spo2: "93%",
      spo2Detail: "Post-Salbutamol",
      glucose: "128",
    },
    allergies: ["Ciprofloxacin Rash"],
    protocolBanner: {
      title: "Acute Bronchospasm Pathway",
      elapsed: "08m INHALATION",
      note: "Duolin 2.5mg nebulization in progress at Triage Bay 3.",
      roomBadge: "NEB-STN-03",
    },
    milestones: [
      {
        title: "Triage Intake",
        time: "14:52 IST",
        note: "Wheezing and dyspnea on minimal exertion.",
        type: "primary",
      },
      {
        title: "Nebulization Commenced",
        time: "14:56 IST",
        note: "Ipratropium + Levosalbutamol via Hudson mask.",
        type: "primary",
      },
    ],
    audit: {
      bookedVia: "OPD Triage Desk",
      operator: "Staff Nurse Priya K. (RN #5012)",
      encounterId: "enc-20241018-0925",
    },
  },
  {
    id: "apt-128",
    time: "15:15 - 15:30",
    doctorName: "Dr. Anjali Nair",
    doctorSpecialty: "General Medicine",
    room: "Suite 02 · Gen Med",
    doctorAvatarInitials: "AN",
    token: "#128",
    acuity: "P3 Routine",
    patientName: "Kavita Nair",
    age: 29,
    gender: "F",
    uhid: "DEL-2024-30911",
    abhaId: "91-3321-9988-7712@abdm",
    isAbhaVerified: true,
    visitType: "Review Consult",
    complaint: "Refractory Migraine",
    status: "Confirmed",
    statusType: "confirmed",
    wait: "--",
    flags: "Scheduled Slot",
    flagType: "routine",
    vitals: {
      bp: "116/74",
      bpTrend: "normal",
      hr: "72",
      hrTrend: "normal",
      spo2: "99%",
      spo2Detail: "Room Air",
      glucose: "96",
    },
    allergies: ["NSAID Gastritis"],
    milestones: [
      {
        title: "Appointment Confirmed via SMS",
        time: "09:00 IST",
        note: "Automated IVR confirmation confirmed slot.",
        type: "primary",
      },
    ],
    audit: {
      bookedVia: "Hospital Call Center",
      operator: "Central Booking Team",
      encounterId: "enc-20241018-0928",
    },
  },
  {
    id: "apt-132",
    time: "15:30 - 15:45",
    doctorName: "Dr. S. Kulkarni",
    doctorSpecialty: "Endocrinology",
    room: "Suite 12 · Endo",
    doctorAvatarInitials: "SK",
    token: "#132",
    acuity: "P3 Routine",
    patientName: "Vikas Gupta",
    age: 45,
    gender: "M",
    uhid: "DEL-2024-3049",
    abhaId: "91-8811-6632-4410@abdm",
    isAbhaVerified: true,
    visitType: "Diabetes Titration",
    complaint: "Routine Checkup",
    status: "Confirmed",
    statusType: "confirmed",
    wait: "--",
    flags: "Telehealth Synced",
    flagIcon: "sync",
    flagType: "routine",
    vitals: {
      bp: "128/84",
      bpTrend: "normal",
      hr: "74",
      hrTrend: "normal",
      spo2: "98%",
      spo2Detail: "Room Air",
      glucose: "156",
    },
    allergies: ["No Known Drug Allergies"],
    milestones: [
      {
        title: "Continuous Glucose Monitor Sync",
        time: "13:40 IST",
        note: "Freestyle Libre 14-day TIR report uploaded (68%).",
        type: "primary",
      },
    ],
    audit: {
      bookedVia: "Chronic Care Follow-up System",
      operator: "Automated Disease Management Agent",
      encounterId: "enc-20241018-0932",
    },
  },
  {
    id: "apt-135",
    time: "15:45 - 16:00",
    doctorName: "Dr. Rohit Verma",
    doctorSpecialty: "Cardiology",
    room: "Room 04 · Cardio",
    doctorAvatarInitials: "RV",
    token: "OPEN",
    acuity: "AVAILABLE",
    patientName: "Open OPD Slot (15 min)",
    age: "--",
    gender: "--",
    uhid: "SLOT-AVAILABLE",
    visitType: "Direct Intake Ready",
    complaint: "Available for Urgent Walk-in or Add-on",
    status: "Available",
    statusType: "available",
    wait: "--",
    flags: "Capacity: 1 Slot",
    flagType: "success",
    isOpenSlot: true,
    audit: {
      bookedVia: "OPD Roster Template Engine",
      operator: "Clinical Capacity Orchestrator",
      encounterId: "slot-20241018-0945",
    },
  },
];

export default function ScheduleOpdSlotsPage() {
  // Main Data States
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [selectedAptId, setSelectedAptId] = useState<string>("apt-104");

  // Filter States
  const [dateFilter, setDateFilter] = useState<"today" | "tomorrow" | "this-week">("today");
  const [currentDateString, setCurrentDateString] = useState<string>("Today (18 Oct 2024)");
  const [selectedDept, setSelectedDept] = useState<string>("All Departments");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("All Clinicians");
  const [viewMode, setViewMode] = useState<"day" | "week" | "list">("day");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isOverbookingOpen, setIsOverbookingOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isCathLabModalOpen, setIsCathLabModalOpen] = useState(false);
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);

  // Quick Action Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  // Form State for Add Appointment
  const [newAptForm, setNewAptForm] = useState({
    patientName: "",
    age: "",
    gender: "M",
    uhid: "",
    doctorName: "Dr. Rohit Verma",
    room: "Room 04 · Cardio OPD",
    acuity: "P3 Routine" as Appointment["acuity"],
    visitType: "Walk-in Consultation",
    complaint: "",
    time: "16:00 - 16:15",
  });

  // Reassign Form State
  const [reassignData, setReassignData] = useState({
    targetDoctor: "Dr. Rohit Verma (Cardiology)",
    targetRoom: "Room 04 · Cardio OPD",
    note: "Emergency load balancing",
  });

  // Selected Appointment Lookup
  const selectedAppointment = useMemo(() => {
    return appointments.find((a) => a.id === selectedAptId) || appointments[0];
  }, [appointments, selectedAptId]);

  // Filtered appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      if (selectedDept !== "All Departments") {
        if (selectedDept.includes("Cardiology") && apt.doctorSpecialty !== "Cardiology") return false;
        if (selectedDept.includes("Endocrinology") && apt.doctorSpecialty !== "Endocrinology") return false;
        if (selectedDept.includes("General Medicine") && apt.doctorSpecialty !== "General Medicine") return false;
        if (selectedDept.includes("Pulmonology") && apt.doctorSpecialty !== "Pulmonology") return false;
      }
      if (selectedDoctor !== "All Clinicians") {
        if (!apt.doctorName.toLowerCase().includes(selectedDoctor.toLowerCase().replace(/dr\.\s*/i, "").split(" ")[0])) {
          return false;
        }
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesPatient = apt.patientName.toLowerCase().includes(q);
        const matchesUhid = apt.uhid.toLowerCase().includes(q);
        const matchesToken = apt.token.toLowerCase().includes(q);
        const matchesComplaint = apt.complaint.toLowerCase().includes(q);
        const matchesDoctor = apt.doctorName.toLowerCase().includes(q);
        if (!matchesPatient && !matchesUhid && !matchesToken && !matchesComplaint && !matchesDoctor) {
          return false;
        }
      }
      return true;
    });
  }, [appointments, selectedDept, selectedDoctor, searchQuery]);

  // Handle Add Appointment Submit
  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAptForm.patientName.trim()) {
      showToast("Please enter the patient's name.");
      return;
    }

    const newId = `apt-${Date.now().toString().slice(-4)}`;
    const nextTokenNumber = appointments.filter((a) => !a.isOpenSlot).length + 101;
    const tokenStr = `#${nextTokenNumber}`;

    const created: Appointment = {
      id: newId,
      time: newAptForm.time,
      doctorName: newAptForm.doctorName,
      doctorSpecialty: newAptForm.doctorName.includes("Verma")
        ? "Cardiology"
        : newAptForm.doctorName.includes("Kulkarni")
        ? "Endocrinology"
        : "General Medicine",
      room: newAptForm.room,
      doctorAvatarInitials: newAptForm.doctorName.split(" ").map((n) => n[0]).join("").slice(0, 2),
      token: tokenStr,
      acuity: newAptForm.acuity,
      patientName: newAptForm.patientName,
      age: newAptForm.age ? parseInt(newAptForm.age) : 40,
      gender: newAptForm.gender,
      uhid: newAptForm.uhid.trim() ? newAptForm.uhid.toUpperCase() : `DEL-2024-${Math.floor(1000 + Math.random() * 9000)}`,
      abhaId: `${Math.floor(10 + Math.random() * 89)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}@abdm`,
      isAbhaVerified: true,
      visitType: newAptForm.visitType,
      complaint: newAptForm.complaint || "Routine Clinical Assessment",
      status: "Checked In - In Queue",
      statusType: "in-queue",
      wait: "0m",
      flags: newAptForm.acuity.includes("P1") ? "High Priority Add-On" : "Roster Scheduled",
      flagType: newAptForm.acuity.includes("P1") ? "error" : "routine",
      vitals: {
        bp: "120/80",
        bpTrend: "normal",
        hr: "75",
        hrTrend: "normal",
        spo2: "98%",
        spo2Detail: "Room Air",
        glucose: "110",
      },
      allergies: ["NKDA (Verified on Intake)"],
      milestones: [
        {
          title: "Walk-in Slot Booked",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          note: "Encounter created via OPD Add Appointment manager.",
          type: "primary",
        },
      ],
      audit: {
        bookedVia: "OPD Fast Add Action",
        operator: "Dr. R. Verma (Attending)",
        encounterId: `enc-20241018-${Math.floor(1000 + Math.random() * 9000)}`,
      },
    };

    setAppointments((prev) => [created, ...prev]);
    setSelectedAptId(newId);
    setIsAddModalOpen(false);
    showToast(`Appointment created for ${created.patientName} (${created.token})!`);
  };

  // Quick Action Handlers
  const handleCheckIn = (aptId: string, name: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === aptId ? { ...a, status: "Checked In - Lounge", statusType: "in-lounge", wait: "0m" } : a))
    );
    showToast(`Patient ${name} checked in to OPD Lounge.`);
  };

  const handleBookOpenSlot = () => {
    setNewAptForm({
      patientName: "",
      age: "45",
      gender: "M",
      uhid: "",
      doctorName: "Dr. Rohit Verma",
      room: "Room 04 · Cardio",
      acuity: "P3 Routine",
      visitType: "Immediate Walk-in Intake",
      complaint: "Chest Discomfort / Follow-up",
      time: "15:45 - 16:00",
    });
    setIsAddModalOpen(true);
  };

  return (
    <div className="flex flex-col w-full gap-space-md">
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

      {/* TOP HEADER & CONTROLS SECTION */}
      <div className="flex flex-col bg-surface-container-lowest rounded-xl shadow-sm p-space-md gap-space-md border border-outline-variant/20">
        {/* Title and Primary Workflow Trigger Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-sm pb-space-sm border-b border-surface-container">
          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-xl">event_available</span>
              <h1 className="font-page-title text-page-title text-on-surface">Schedule &amp; OPD Slots</h1>
              <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-on-surface-variant font-metadata-micro text-metadata-micro font-semibold uppercase tracking-wider">
                Live Roster
              </span>
            </div>
            <p className="font-clinical-data text-clinical-data text-on-surface-variant">
              Manage appointments, clinician availability, and OPD capacity across facility departments
            </p>
          </div>

          {/* High Priority Primary Actions */}
          <div className="flex flex-wrap items-center gap-space-xs">
            <button
              onClick={() => setIsExportOpen(true)}
              className="h-8 px-space-sm bg-surface-container hover:bg-surface-container-high text-on-surface font-clinical-data text-clinical-data font-semibold rounded flex items-center gap-1 transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-base text-secondary">file_download</span>
              Export Schedule (PDF/XLS)
            </button>
            <button
              onClick={() => setIsOverbookingOpen(true)}
              className="h-8 px-space-sm bg-secondary-container text-on-secondary-container hover:opacity-90 font-clinical-data text-clinical-data font-semibold rounded flex items-center gap-1 transition-opacity"
              type="button"
            >
              <span className="material-symbols-outlined text-base">layers</span>
              Overbooking Manager
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="h-8 px-space-md bg-primary hover:bg-primary-container text-on-primary font-clinical-data text-clinical-data font-semibold rounded flex items-center gap-1.5 shadow-sm transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-base">add_circle</span>
              + Add Appointment
            </button>
          </div>
        </div>

        {/* Filter Matrix & Time Selectors */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-sm items-center">
          {/* Date Picker & Stepper */}
          <div className="xl:col-span-4 flex items-center gap-1 bg-surface-container-low p-1 rounded">
            <button
              onClick={() => {
                setCurrentDateString("Yesterday (17 Oct 2024)");
                showToast("Roster switched to Yesterday (17 Oct 2024)");
              }}
              className="h-7 w-7 flex items-center justify-center rounded bg-surface-container-lowest hover:bg-surface-container text-on-surface transition-colors"
              title="Previous Day"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <div className="flex-1 flex items-center justify-center gap-1.5 px-2">
              <span className="material-symbols-outlined text-primary text-base">calendar_today</span>
              <span className="font-clinical-data-mono text-clinical-data text-on-surface font-semibold">
                {currentDateString}
              </span>
            </div>
            <button
              onClick={() => {
                setCurrentDateString("Tomorrow (19 Oct 2024)");
                showToast("Roster switched to Tomorrow (19 Oct 2024)");
              }}
              className="h-7 w-7 flex items-center justify-center rounded bg-surface-container-lowest hover:bg-surface-container text-on-surface transition-colors"
              title="Next Day"
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
            <div className="flex items-center gap-0.5 ml-1 border-l border-outline-variant pl-1">
              <button
                onClick={() => {
                  setDateFilter("today");
                  setCurrentDateString("Today (18 Oct 2024)");
                }}
                className={`px-2 py-0.5 rounded text-metadata-micro font-clinical-data font-semibold transition-colors ${
                  dateFilter === "today"
                    ? "bg-primary text-on-primary"
                    : "text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                Today
              </button>
              <button
                onClick={() => {
                  setDateFilter("tomorrow");
                  setCurrentDateString("Tomorrow (19 Oct 2024)");
                }}
                className={`px-2 py-0.5 rounded text-metadata-micro font-clinical-data font-semibold transition-colors ${
                  dateFilter === "tomorrow"
                    ? "bg-primary text-on-primary"
                    : "text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                Tomorrow
              </button>
              <button
                onClick={() => {
                  setDateFilter("this-week");
                  setCurrentDateString("Week 42 (14 - 20 Oct 2024)");
                }}
                className={`px-2 py-0.5 rounded text-metadata-micro font-clinical-data font-semibold transition-colors ${
                  dateFilter === "this-week"
                    ? "bg-primary text-on-primary"
                    : "text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                This Week
              </button>
            </div>
          </div>

          {/* Facility & Department Selector */}
          <div className="xl:col-span-4 flex items-center gap-space-xs">
            <div className="flex-1 relative">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full h-8 pl-7 pr-6 bg-surface-container-low rounded font-clinical-data text-clinical-data text-on-surface border border-outline-variant focus:outline-none focus:border-primary appearance-none cursor-pointer"
              >
                <option>All Departments</option>
                <option>Cardiology (Wing B)</option>
                <option>General Medicine (Wing A)</option>
                <option>Orthopedics (Wing C)</option>
                <option>Pulmonology (Wing B)</option>
                <option>Endocrinology (Wing D)</option>
              </select>
              <span className="material-symbols-outlined absolute left-2 top-2 text-outline text-sm pointer-events-none">
                domain
              </span>
              <span className="material-symbols-outlined absolute right-2 top-2 text-outline text-sm pointer-events-none">
                arrow_drop_down
              </span>
            </div>
            <div className="flex-1 relative">
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="w-full h-8 pl-7 pr-6 bg-surface-container-low rounded font-clinical-data text-clinical-data text-on-surface border border-outline-variant focus:outline-none focus:border-primary appearance-none cursor-pointer"
              >
                <option>All Clinicians</option>
                <option>Dr. Rohit Verma (Cardiology)</option>
                <option>Dr. Sameer Kulkarni (Endocrinology)</option>
                <option>Dr. Anjali Nair (Gen Med)</option>
                <option>Dr. M. Chacko (Pulmonology)</option>
              </select>
              <span className="material-symbols-outlined absolute left-2 top-2 text-outline text-sm pointer-events-none">
                person
              </span>
              <span className="material-symbols-outlined absolute right-2 top-2 text-outline text-sm pointer-events-none">
                arrow_drop_down
              </span>
            </div>
          </div>

          {/* View Selector & Integrated Quick Search */}
          <div className="xl:col-span-4 flex items-center gap-space-xs">
            {/* View Toggle Buttons */}
            <div className="flex items-center bg-surface-container-low p-0.5 rounded">
              <button
                onClick={() => setViewMode("day")}
                className={`px-2.5 py-1 rounded font-clinical-data text-metadata-micro font-semibold transition-all ${
                  viewMode === "day"
                    ? "bg-surface-container-lowest shadow-sm text-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Day View
              </button>
              <button
                onClick={() => setViewMode("week")}
                className={`px-2.5 py-1 rounded font-clinical-data text-metadata-micro font-semibold transition-all ${
                  viewMode === "week"
                    ? "bg-surface-container-lowest shadow-sm text-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Week View
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-2.5 py-1 rounded font-clinical-data text-metadata-micro font-semibold transition-all ${
                  viewMode === "list"
                    ? "bg-surface-container-lowest shadow-sm text-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                List View
              </button>
            </div>
            {/* Search Bar */}
            <div className="flex-1 relative">
              <span className="material-symbols-outlined absolute left-2 top-2 text-outline text-base pointer-events-none">
                search
              </span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 pl-7 pr-2 font-clinical-data text-clinical-data bg-surface-container-low rounded border border-outline-variant focus:outline-none focus:border-primary text-on-surface placeholder:text-outline"
                placeholder="Search Patient, UHID, Token..."
                type="text"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1.5 text-outline hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-xs">close</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* TOP KPI OPERATIONAL STRIP (Bento Metric Layout) */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-space-xs">
        {/* Total Appointments */}
        <div className="bg-surface-container-lowest p-space-sm rounded-lg flex flex-col justify-between shadow-sm border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase font-semibold">
              Appointments
            </span>
            <span className="material-symbols-outlined text-base text-primary">book_online</span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="font-chief-complaint-mobile text-chief-complaint-mobile text-on-surface leading-tight font-bold">
              142
            </span>
            <span className="font-clinical-data-mono text-metadata-micro text-outline">Today</span>
          </div>
          <div className="flex items-center gap-1 font-metadata-micro text-metadata-micro text-on-surface-variant mt-1 border-t border-surface-container pt-1">
            <span className="text-primary font-bold">88</span> Conf <span className="text-outline">·</span>{" "}
            <span className="text-secondary font-semibold">38</span> Walk <span className="text-outline">·</span>{" "}
            <span className="text-error font-semibold">16</span> Over
          </div>
        </div>

        {/* Checked In */}
        <div className="bg-surface-container-lowest p-space-sm rounded-lg flex flex-col justify-between shadow-sm border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase font-semibold">
              Checked In
            </span>
            <span className="material-symbols-outlined text-base text-secondary">how_to_reg</span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="font-chief-complaint-mobile text-chief-complaint-mobile text-secondary leading-tight font-bold">
              64
            </span>
            <span className="font-clinical-data text-metadata-micro text-on-surface-variant">In lounge</span>
          </div>
          <div className="font-metadata-micro text-metadata-micro text-on-surface-variant mt-1 border-t border-surface-container pt-1 truncate">
            Avg. Wait: <span className="font-clinical-data-mono font-bold text-on-surface">14 mins</span>
          </div>
        </div>

        {/* In Consultation */}
        <div className="bg-surface-container-lowest p-space-sm rounded-lg flex flex-col justify-between shadow-sm border-l-2 border-primary border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase font-semibold">
              Consulting
            </span>
            <span className="material-symbols-outlined text-base text-primary">stethoscope</span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="font-chief-complaint-mobile text-chief-complaint-mobile text-primary leading-tight font-bold">
              18
            </span>
            <span className="font-clinical-data text-metadata-micro text-primary">Active</span>
          </div>
          <div className="font-metadata-micro text-metadata-micro text-on-surface-variant mt-1 border-t border-surface-container pt-1 truncate">
            18 of 22 Suites Occupied
          </div>
        </div>

        {/* Completed */}
        <div className="bg-surface-container-lowest p-space-sm rounded-lg flex flex-col justify-between shadow-sm border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase font-semibold">
              Completed
            </span>
            <span className="material-symbols-outlined text-base text-primary">task_alt</span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="font-chief-complaint-mobile text-chief-complaint-mobile text-on-surface leading-tight font-bold">
              48
            </span>
            <span className="font-clinical-data text-metadata-micro text-outline">Finalized</span>
          </div>
          <div className="font-metadata-micro text-metadata-micro text-on-surface-variant mt-1 border-t border-surface-container pt-1 truncate">
            34% Target Velocity
          </div>
        </div>

        {/* No-Shows */}
        <div className="bg-surface-container-lowest p-space-sm rounded-lg flex flex-col justify-between shadow-sm border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase font-semibold">
              No-Shows
            </span>
            <span className="material-symbols-outlined text-base text-error">person_cancel</span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="font-chief-complaint-mobile text-chief-complaint-mobile text-error leading-tight font-bold">
              06
            </span>
            <span className="font-clinical-data text-metadata-micro text-error font-medium">Re-engage</span>
          </div>
          <div className="font-metadata-micro text-metadata-micro text-error mt-1 border-t border-surface-container pt-1 truncate flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-error inline-block"></span> 4 slots reclaimed
          </div>
        </div>

        {/* Available Slots */}
        <div className="bg-surface-container-lowest p-space-sm rounded-lg flex flex-col justify-between shadow-sm border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase font-semibold">
              Available
            </span>
            <span className="material-symbols-outlined text-base text-on-surface-variant">event_seat</span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="font-chief-complaint-mobile text-chief-complaint-mobile text-on-surface leading-tight font-bold">
              24
            </span>
            <span className="font-clinical-data text-metadata-micro text-on-surface-variant">Slots</span>
          </div>
          <div className="font-metadata-micro text-metadata-micro text-on-surface-variant mt-1 border-t border-surface-container pt-1 truncate">
            Across 6 OPD Wings
          </div>
        </div>

        {/* Capacity Load & Alert */}
        <div className="bg-surface-container-lowest p-space-sm rounded-lg flex flex-col justify-between shadow-sm col-span-2 md:col-span-4 xl:col-span-1 border-l-2 border-secondary border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase font-semibold">
              Load Level
            </span>
            <span className="material-symbols-outlined text-base text-secondary">speed</span>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-chief-complaint-mobile text-chief-complaint-mobile text-on-surface leading-tight font-bold">
              86%
            </span>
            <span className="font-metadata-micro text-metadata-micro font-bold text-error">Cardio 98%</span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-surface-container rounded-full h-1.5 mt-1 overflow-hidden">
            <div className="bg-primary h-1.5 rounded-full" style={{ width: "86%" }}></div>
          </div>
        </div>
      </div>

      {/* MAIN WORKSPACE 2-COLUMN SPLIT: Schedule Grid (70%) + Detail Drawer (30%) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-md items-start">
        {/* LEFT SCHEDULE / OPD ROSTER (xl:col-span-8 or ~70%) */}
        <div className="xl:col-span-8 flex flex-col bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/30">
          {/* Sub-header of the table */}
          <div className="px-space-panel-padding py-space-sm bg-surface-container-low flex items-center justify-between border-b border-surface-container">
            <div className="flex items-center gap-space-sm">
              <span className="font-body-strong text-body-strong text-on-surface">Live Appointment Stream</span>
              <span className="font-clinical-data-mono text-metadata-micro px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-semibold">
                Wing A &amp; B · Morning/Afternoon Block
              </span>
            </div>
            <div className="flex items-center gap-space-xs text-metadata-micro font-clinical-data text-on-surface-variant">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-error inline-block"></span> P1 Critical
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-secondary inline-block"></span> P2 Emergent
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-primary inline-block"></span> P3 Routine
              </span>
            </div>
          </div>

          {/* Schedule Table with High Clinical Density */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container text-on-surface-variant font-table-header text-table-header uppercase border-b border-outline-variant/40">
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">Doctor &amp; Room</th>
                  <th className="py-2.5 px-3">Token / Acuity</th>
                  <th className="py-2.5 px-3">Patient &amp; Demographics</th>
                  <th className="py-2.5 px-3">Visit Type</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Wait</th>
                  <th className="py-2.5 px-3">Flags / Context</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container text-clinical-data font-clinical-data">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-outline">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-3xl">event_busy</span>
                        <p className="font-semibold">No appointments found matching current filters</p>
                        <button
                          onClick={() => {
                            setSelectedDept("All Departments");
                            setSelectedDoctor("All Clinicians");
                            setSearchQuery("");
                          }}
                          className="text-primary text-metadata-micro font-semibold hover:underline"
                        >
                          Clear all filters
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((apt) => {
                    const isSelected = selectedAptId === apt.id;

                    if (apt.isOpenSlot) {
                      return (
                        <tr
                          key={apt.id}
                          onClick={() => setSelectedAptId(apt.id)}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-primary-fixed/20 border-l-4 border-primary"
                              : "bg-surface-bright border-l-4 border-primary hover:bg-surface-container-high/40"
                          }`}
                        >
                          <td className="py-2.5 px-3 font-clinical-data-mono text-primary font-bold whitespace-nowrap">
                            {apt.time}
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <div className="font-body-strong text-primary leading-tight">{apt.doctorName}</div>
                            <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                              {apt.room}
                            </div>
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap" colSpan={2}>
                            <span className="px-2 py-1 rounded bg-primary-fixed/40 text-on-primary-fixed-variant font-clinical-data font-semibold text-metadata-micro flex items-center gap-1 w-fit">
                              <span className="material-symbols-outlined text-xs">event_available</span> OPEN OPD SLOT (15 MIN)
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                              {apt.visitType}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary font-metadata-micro text-metadata-micro font-semibold">
                              Available
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-clinical-data-mono text-outline">--</td>
                          <td className="py-2.5 px-3 font-metadata-micro text-metadata-micro text-primary font-medium">
                            {apt.flags}
                          </td>
                          <td className="py-2.5 px-3 text-right whitespace-nowrap">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBookOpenSlot();
                              }}
                              className="px-2.5 py-1 bg-primary text-on-primary rounded text-metadata-micro font-semibold hover:bg-primary-container shadow-sm flex items-center gap-1 ml-auto"
                            >
                              <span className="material-symbols-outlined text-xs">add</span> Book Walk-in
                            </button>
                          </td>
                        </tr>
                      );
                    }

                    return (
                      <tr
                        key={apt.id}
                        id={`row-${apt.token.replace("#", "")}`}
                        onClick={() => setSelectedAptId(apt.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? apt.acuity === "P1 STAT CRITICAL"
                              ? "bg-primary-fixed/20 border-l-4 border-error"
                              : "bg-surface-container-high border-l-4 border-primary"
                            : "hover:bg-surface-container-high/40"
                        }`}
                      >
                        {/* Time */}
                        <td className="py-2.5 px-3 font-clinical-data-mono font-semibold text-on-surface whitespace-nowrap">
                          {apt.time}
                          {apt.isActiveNow && (
                            <span className="block text-[10px] text-error font-bold font-clinical-data uppercase tracking-tight">
                              Active Now
                            </span>
                          )}
                        </td>

                        {/* Doctor & Room */}
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <div className="font-body-strong text-on-surface leading-tight">{apt.doctorName}</div>
                          <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                            {apt.room}
                          </div>
                        </td>

                        {/* Token & Acuity */}
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <div className="font-clinical-data-mono font-bold text-on-surface">{apt.token}</div>
                          {apt.acuity === "P1 STAT CRITICAL" && (
                            <span className="inline-flex items-center px-1.5 py-0.2 bg-error text-on-error font-metadata-micro text-[10px] rounded font-bold uppercase tracking-wider">
                              P1 STAT CRITICAL
                            </span>
                          )}
                          {apt.acuity === "P1 High Alert" && (
                            <span className="inline-flex items-center px-1.5 py-0.2 bg-error text-on-error font-metadata-micro text-[10px] rounded font-bold uppercase">
                              P1 High Alert
                            </span>
                          )}
                          {apt.acuity === "P2 Emergent" && (
                            <span className="inline-flex items-center px-1.5 py-0.2 bg-secondary text-on-secondary font-metadata-micro text-[10px] rounded font-bold uppercase">
                              P2 Emergent
                            </span>
                          )}
                          {apt.acuity === "P3 Routine" && (
                            <span className="inline-flex items-center px-1.5 py-0.2 bg-surface-container-high text-on-surface font-metadata-micro text-[10px] rounded font-bold uppercase">
                              P3 Routine
                            </span>
                          )}
                        </td>

                        {/* Patient & Demographics */}
                        <td className="py-2.5 px-3">
                          <div className="font-body-strong text-on-surface font-semibold leading-tight">
                            {apt.patientName}
                          </div>
                          <div className="font-metadata-micro text-metadata-micro text-on-surface-variant flex items-center gap-1 font-clinical-data-mono">
                            <span>
                              {apt.age}
                              {apt.gender}
                            </span>{" "}
                            · <span>{apt.uhid}</span>
                          </div>
                        </td>

                        {/* Visit Type */}
                        <td className="py-2.5 px-3">
                          <div className="text-on-surface font-medium leading-tight">{apt.visitType}</div>
                          <div
                            className={`font-metadata-micro text-metadata-micro font-semibold truncate max-w-[140px] ${
                              apt.acuity.includes("P1") ? "text-error" : "text-on-surface-variant"
                            }`}
                          >
                            {apt.complaint}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          {apt.statusType === "stat" && (
                            <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-metadata-micro text-metadata-micro font-bold flex items-center gap-1 w-fit">
                              <span className="h-1.5 w-1.5 rounded-full bg-error animate-pulse"></span> {apt.status}
                            </span>
                          )}
                          {apt.statusType === "in-lounge" && (
                            <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-metadata-micro text-metadata-micro font-semibold flex items-center gap-1 w-fit">
                              <span className="h-1.5 w-1.5 rounded-full bg-secondary"></span> {apt.status}
                            </span>
                          )}
                          {apt.statusType === "in-queue" && (
                            <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-metadata-micro text-metadata-micro font-semibold">
                              {apt.status}
                            </span>
                          )}
                          {apt.statusType === "triage-done" && (
                            <span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-metadata-micro text-metadata-micro font-semibold">
                              {apt.status}
                            </span>
                          )}
                          {apt.statusType === "confirmed" && (
                            <span className="px-2 py-0.5 rounded bg-surface-container-low text-on-surface-variant font-metadata-micro text-metadata-micro">
                              {apt.status}
                            </span>
                          )}
                        </td>

                        {/* Wait */}
                        <td
                          className={`py-2.5 px-3 font-clinical-data-mono ${
                            apt.waitIsAlert ? "text-error font-bold" : "text-on-surface font-semibold"
                          }`}
                        >
                          {apt.wait}
                        </td>

                        {/* Flags / Context */}
                        <td className="py-2.5 px-3">
                          {apt.flagType === "error" ? (
                            <div className="px-1.5 py-0.5 rounded bg-error/10 text-error font-metadata-micro text-metadata-micro font-bold flex items-center gap-1 w-max">
                              <span className="material-symbols-outlined text-xs">
                                {apt.flagIcon || "warning"}
                              </span>{" "}
                              {apt.flags}
                            </div>
                          ) : apt.flagType === "secondary" ? (
                            <div className="px-1.5 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed-variant font-metadata-micro text-metadata-micro flex items-center gap-1 w-max font-semibold">
                              <span className="material-symbols-outlined text-xs">
                                {apt.flagIcon || "medication"}
                              </span>{" "}
                              {apt.flags}
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 font-metadata-micro text-metadata-micro text-on-surface-variant">
                              {apt.flagIcon && (
                                <span className="material-symbols-outlined text-xs">{apt.flagIcon}</span>
                              )}
                              <span>{apt.flags}</span>
                            </div>
                          )}
                        </td>

                        {/* Row Actions */}
                        <td className="py-2.5 px-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            {apt.id === "apt-104" ? (
                              <>
                                <Link
                                  href="/schedule-opd-slots/APT-2024-99182"
                                  onClick={(e) => e.stopPropagation()}
                                  className="px-2 py-1 bg-surface-container hover:bg-surface-container-high text-on-surface rounded text-metadata-micro font-semibold shadow-xs inline-block"
                                >
                                  Detail
                                </Link>
                                <Link
                                  href="/patient-overview"
                                  onClick={(e) => e.stopPropagation()}
                                  className="px-2 py-1 bg-primary text-on-primary rounded text-metadata-micro font-semibold hover:bg-primary-container shadow-sm inline-block"
                                >
                                  Workspace
                                </Link>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setIsCathLabModalOpen(true);
                                  }}
                                  className="px-2 py-1 bg-error text-on-error rounded text-metadata-micro font-semibold hover:opacity-90"
                                >
                                  Cath Lab
                                </button>
                              </>
                            ) : apt.statusType === "in-lounge" ? (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    showToast(`Intake initiated for ${apt.patientName}`);
                                  }}
                                  className="px-2 py-1 bg-surface-container text-on-surface rounded text-metadata-micro font-semibold hover:bg-surface-container-highest"
                                >
                                  Start Intake
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    showToast(`Nurse alerted for ${apt.patientName}`);
                                  }}
                                  className="px-2 py-1 bg-surface-container text-on-surface rounded text-metadata-micro font-semibold hover:bg-surface-container-highest"
                                >
                                  Nurse
                                </button>
                              </>
                            ) : apt.statusType === "in-queue" ? (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedAptId(apt.id);
                                    showToast(`Reviewing ${apt.patientName}'s dossier`);
                                  }}
                                  className="px-2 py-1 bg-surface-container text-on-surface rounded text-metadata-micro font-semibold hover:bg-surface-container-highest"
                                >
                                  Review
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedAptId(apt.id);
                                    setIsReassignModalOpen(true);
                                  }}
                                  className="px-2 py-1 bg-surface-container text-on-surface rounded text-metadata-micro font-semibold hover:bg-surface-container-highest"
                                >
                                  Reassign
                                </button>
                              </>
                            ) : apt.statusType === "triage-done" ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  showToast(`Intake opened for ${apt.patientName}`);
                                }}
                                className="px-2 py-1 bg-surface-container text-on-surface rounded text-metadata-micro font-semibold hover:bg-surface-container-highest"
                              >
                                Open Intake
                              </button>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCheckIn(apt.id, apt.patientName);
                                }}
                                className="px-2 py-1 bg-surface-container text-on-surface rounded text-metadata-micro font-semibold hover:bg-surface-container-highest"
                              >
                                Check In
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination & Status Legend Footer */}
          <div className="px-space-panel-padding py-space-sm bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-space-sm text-metadata-micro font-clinical-data text-on-surface-variant border-t border-surface-container">
            <div className="flex items-center gap-space-sm">
              <span>
                Showing <strong>1-{filteredAppointments.length}</strong> of 142 encounters
              </span>
              <span className="text-outline">·</span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-primary inline-block animate-ping"></span>
                Automatic sync interval: 15s
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                className="px-2.5 py-1 rounded bg-surface-container-lowest text-on-surface font-semibold hover:bg-surface-container transition-colors disabled:opacity-50"
                disabled
              >
                Previous
              </button>
              <button className="px-2.5 py-1 rounded bg-primary text-on-primary font-semibold">1</button>
              <button className="px-2.5 py-1 rounded hover:bg-surface-container text-on-surface font-semibold">2</button>
              <button className="px-2.5 py-1 rounded hover:bg-surface-container text-on-surface font-semibold">3</button>
              <button className="px-2.5 py-1 rounded bg-surface-container-lowest text-on-surface font-semibold hover:bg-surface-container transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SELECTED APPOINTMENT DETAIL DRAWER (xl:col-span-4 or ~30%) */}
        <div className="xl:col-span-4 flex flex-col bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden sticky top-16">
          {selectedAppointment.isOpenSlot ? (
            /* Open Slot Details View */
            <div className="p-space-panel-padding flex flex-col gap-space-md">
              <div className="bg-primary text-on-primary p-space-sm rounded-lg flex items-center justify-between">
                <span className="font-semibold text-clinical-data">Available Clinical OPD Slot</span>
                <span className="material-symbols-outlined">event_available</span>
              </div>
              <div className="p-space-sm bg-surface-container-low rounded-lg flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-outline font-metadata-micro">Time Window:</span>
                  <span className="font-clinical-data-mono font-bold text-on-surface">15:45 - 16:00 (15 min)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline font-metadata-micro">Clinician:</span>
                  <span className="font-semibold text-on-surface">{selectedAppointment.doctorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline font-metadata-micro">Location:</span>
                  <span className="text-on-surface">{selectedAppointment.room}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline font-metadata-micro">Status:</span>
                  <span className="text-primary font-bold">Unreserved / Ready</span>
                </div>
              </div>
              <p className="text-clinical-data text-on-surface-variant">
                This slot is currently vacant in Dr. Verma&apos;s afternoon block. You can allocate an emergency walk-in or pull an overbooked patient from the queue.
              </p>
              <button
                onClick={handleBookOpenSlot}
                className="w-full h-10 bg-primary hover:bg-primary-container text-on-primary font-body-strong text-clinical-data rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-colors"
              >
                <span className="material-symbols-outlined text-base">person_add</span>
                Book Walk-in Patient Now
              </button>
            </div>
          ) : (
            /* Selected Patient Encounter Dossier */
            <>
              {/* Drawer Sticky Banner / Emergency Header */}
              {selectedAppointment.acuity.includes("P1") ? (
                <div className="bg-error text-on-error px-space-panel-padding py-space-xs flex items-center justify-between font-metadata-micro">
                  <span className="flex items-center gap-1 font-bold uppercase tracking-wider">
                    <span className="material-symbols-outlined text-sm animate-pulse">crisis_alert</span>
                    Acuity: {selectedAppointment.acuity} · Red Flag Active
                  </span>
                  <span className="font-clinical-data-mono font-bold">
                    {selectedAppointment.protocolBanner?.roomBadge || "ER-BAY-02"}
                  </span>
                </div>
              ) : selectedAppointment.acuity === "P2 Emergent" ? (
                <div className="bg-secondary text-on-secondary px-space-panel-padding py-space-xs flex items-center justify-between font-metadata-micro">
                  <span className="flex items-center gap-1 font-bold uppercase tracking-wider">
                    <span className="material-symbols-outlined text-sm">priority_high</span>
                    Acuity: P2 Emergent · Fast-Track Intake
                  </span>
                  <span className="font-clinical-data-mono font-bold">
                    {selectedAppointment.protocolBanner?.roomBadge || "PULM-BAY"}
                  </span>
                </div>
              ) : (
                <div className="bg-surface-container-high text-on-surface px-space-panel-padding py-space-xs flex items-center justify-between font-metadata-micro">
                  <span className="flex items-center gap-1 font-semibold uppercase tracking-wider">
                    <span className="material-symbols-outlined text-sm text-primary">schedule</span>
                    Acuity: {selectedAppointment.acuity} · Standard OPD
                  </span>
                  <span className="font-clinical-data-mono font-bold">{selectedAppointment.token}</span>
                </div>
              )}

              {/* Patient Identity Header */}
              <div className="p-space-panel-padding bg-surface-container-low border-b border-surface-container">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-space-xs">
                      <h2 className="font-subheading text-subheading text-on-surface font-bold">
                        {selectedAppointment.patientName}
                      </h2>
                      {selectedAppointment.isAbhaVerified && (
                        <span className="px-1.5 py-0.2 rounded bg-primary text-on-primary font-metadata-micro text-[10px] font-bold">
                          ABHA VERIFIED
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-space-xs font-clinical-data-mono text-metadata-micro text-on-surface-variant mt-0.5">
                      <span>
                        {selectedAppointment.age} Yrs /{" "}
                        {selectedAppointment.gender === "M" ? "Male" : "Female"}
                      </span>
                      <span>·</span>
                      <span>UHID: {selectedAppointment.uhid}</span>
                    </div>
                    {selectedAppointment.abhaId && (
                      <div className="font-clinical-data-mono text-[10px] text-outline mt-0.5">
                        ABHA ID: {selectedAppointment.abhaId}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-clinical-data-mono text-body-strong font-bold text-primary">
                      Token {selectedAppointment.token}
                    </div>
                    <div className="font-metadata-micro text-metadata-micro text-outline">
                      {selectedAppointment.visitType.includes("Walk") ? "Walk-in #09" : "Scheduled Slot"}
                    </div>
                  </div>
                </div>

                {/* Clinician & Room Assigment Card */}
                <div className="mt-space-sm p-space-xs rounded bg-surface-container-lowest flex items-center justify-between border border-surface-container">
                  <div className="flex items-center gap-space-xs">
                    <div className="h-8 w-8 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed font-bold text-xs">
                      {selectedAppointment.doctorAvatarInitials || "DR"}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-clinical-data text-metadata-micro font-bold text-on-surface">
                        {selectedAppointment.doctorName} (Attending)
                      </span>
                      <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                        {selectedAppointment.room}
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-primary text-sm">verified_user</span>
                </div>
              </div>

              <div className="p-space-panel-padding flex flex-col gap-space-md">
                {/* Clinical Door-to-Balloon Timer Alert Banner */}
                {selectedAppointment.protocolBanner && (
                  <div className="bg-error/10 rounded-lg p-space-sm flex flex-col gap-1 border-l-2 border-error">
                    <div className="flex items-center justify-between text-error font-clinical-data text-metadata-micro font-bold">
                      <span className="flex items-center gap-1 uppercase tracking-tight">
                        <span className="material-symbols-outlined text-sm">timer</span>{" "}
                        {selectedAppointment.protocolBanner.title}
                      </span>
                      <span className="font-clinical-data-mono text-body-strong">
                        {selectedAppointment.protocolBanner.elapsed}
                      </span>
                    </div>
                    <p className="font-clinical-data text-metadata-micro text-on-surface-variant">
                      {selectedAppointment.protocolBanner.note}
                    </p>
                  </div>
                )}

                {/* Quick Snapshot Vitals Matrix */}
                {selectedAppointment.vitals && (
                  <div className="flex flex-col gap-1.5">
                    <span className="font-table-header text-table-header uppercase text-outline">
                      Triage Vitals Snapshot (14:20 IST)
                    </span>
                    <div className="grid grid-cols-2 gap-space-xs">
                      <div className="p-space-xs rounded bg-surface-container-low flex flex-col">
                        <span className="font-metadata-micro text-[10px] text-on-surface-variant uppercase">
                          Blood Pressure
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span
                            className={`font-clinical-data-mono text-body-strong font-bold ${
                              selectedAppointment.vitals.bpTrend === "up" ? "text-error" : "text-on-surface"
                            }`}
                          >
                            {selectedAppointment.vitals.bp}
                          </span>
                          <span className="font-metadata-micro text-[10px] text-outline">mmHg</span>
                          {selectedAppointment.vitals.bpTrend === "up" && (
                            <span className="text-error font-clinical-data-mono text-xs font-bold">↑</span>
                          )}
                        </div>
                      </div>
                      <div className="p-space-xs rounded bg-surface-container-low flex flex-col">
                        <span className="font-metadata-micro text-[10px] text-on-surface-variant uppercase">
                          Heart Rate
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span
                            className={`font-clinical-data-mono text-body-strong font-bold ${
                              selectedAppointment.vitals.hrTrend === "up" ? "text-error" : "text-on-surface"
                            }`}
                          >
                            {selectedAppointment.vitals.hr}
                          </span>
                          <span className="font-metadata-micro text-[10px] text-outline">bpm</span>
                          {selectedAppointment.vitals.hrTrend === "up" && (
                            <span className="text-error font-clinical-data-mono text-xs font-bold">↑</span>
                          )}
                        </div>
                      </div>
                      <div className="p-space-xs rounded bg-surface-container-low flex flex-col">
                        <span className="font-metadata-micro text-[10px] text-on-surface-variant uppercase">
                          Oxygen Saturation
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="font-clinical-data-mono text-body-strong font-bold text-on-surface">
                            {selectedAppointment.vitals.spo2}
                          </span>
                          {selectedAppointment.vitals.spo2Detail && (
                            <span className="font-metadata-micro text-[10px] text-primary font-semibold">
                              {selectedAppointment.vitals.spo2Detail}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="p-space-xs rounded bg-surface-container-low flex flex-col">
                        <span className="font-metadata-micro text-[10px] text-on-surface-variant uppercase">
                          Blood Glucose
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="font-clinical-data-mono text-body-strong font-bold text-on-surface">
                            {selectedAppointment.vitals.glucose}
                          </span>
                          <span className="font-metadata-micro text-[10px] text-outline">mg/dL</span>
                          <span className="text-primary text-[10px]">●</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Hard-Stop Allergies & Critical Contraindications */}
                {selectedAppointment.allergies && selectedAppointment.allergies.length > 0 && (
                  <div className="p-space-xs rounded bg-error/5 flex flex-col gap-1 border border-error/20">
                    <span className="font-metadata-micro text-[10px] uppercase font-bold text-error flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">block</span> Hard-Stop Known Alerts
                    </span>
                    <div className="flex flex-wrap gap-1 font-clinical-data text-metadata-micro">
                      {selectedAppointment.allergies.map((allergy, idx) => (
                        <span
                          key={idx}
                          className={`px-1.5 py-0.5 rounded font-semibold font-clinical-data-mono ${
                            allergy.includes("Anaphylaxis") || allergy.includes("Rash") || allergy.includes("Hypersensitivity")
                              ? "bg-error text-on-error"
                              : "bg-surface-container-high text-on-surface"
                          }`}
                        >
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Longitudinal Intake & Triage Timeline */}
                {selectedAppointment.milestones && selectedAppointment.milestones.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="font-table-header text-table-header uppercase text-outline">
                      Check-In &amp; Intake Milestone Log
                    </span>
                    <div className="relative pl-4 space-y-2 before:content-[''] before:absolute before:left-1.5 before:top-1 before:bottom-1 before:w-0.5 before:bg-outline-variant">
                      {selectedAppointment.milestones.map((m, idx) => (
                        <div key={idx} className="relative">
                          <span
                            className={`absolute -left-4 top-1.5 h-2 w-2 rounded-full ring-2 ring-surface-container-lowest ${
                              m.type === "error"
                                ? "bg-error"
                                : m.type === "ping"
                                ? "bg-primary animate-ping"
                                : "bg-primary"
                            }`}
                          ></span>
                          <div className="flex items-center justify-between font-clinical-data text-metadata-micro">
                            <span
                              className={`font-semibold ${
                                m.type === "error"
                                  ? "text-error"
                                  : m.type === "ping"
                                  ? "text-primary font-bold"
                                  : "text-on-surface"
                              }`}
                            >
                              {m.title}
                            </span>
                            <span
                              className={`font-clinical-data-mono ${
                                m.type === "error"
                                  ? "text-error font-bold"
                                  : m.type === "ping"
                                  ? "text-primary font-bold"
                                  : "text-outline"
                              }`}
                            >
                              {m.time}
                            </span>
                          </div>
                          {m.note && (
                            <p className="font-metadata-micro text-[10px] text-on-surface-variant">{m.note}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Direct Operational Action Triggers */}
                <div className="flex flex-col gap-space-xs pt-space-xs border-t border-surface-container">
                  <Link
                    href="/schedule-opd-slots/APT-2024-99182"
                    className="w-full h-9 bg-surface-container-high hover:bg-surface-container text-on-surface font-body-strong text-clinical-data rounded flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                  >
                    <span className="material-symbols-outlined text-base text-primary">feed</span>
                    View Appointment Specifications (#APT-2024-99182)
                  </Link>
                  <Link
                    href="/patient-overview"
                    className="w-full h-9 bg-primary hover:bg-primary-container text-on-primary font-body-strong text-clinical-data rounded flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">clinical_notes</span>
                    Open Full Clinical Workspace
                  </Link>
                  <button
                    onClick={() => setIsCathLabModalOpen(true)}
                    className="w-full h-9 bg-error hover:opacity-90 text-on-error font-body-strong text-clinical-data rounded flex items-center justify-center gap-1.5 shadow-sm transition-opacity"
                  >
                    <span className="material-symbols-outlined text-base">emergency_share</span>
                    Transfer to Cath Lab (Code STEMI)
                  </button>
                  <div className="grid grid-cols-2 gap-space-xs">
                    <button
                      onClick={() => setIsBarcodeModalOpen(true)}
                      className="h-8 bg-surface-container hover:bg-surface-container-high text-on-surface font-clinical-data text-metadata-micro font-semibold rounded flex items-center justify-center gap-1 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">print</span> Print Token &amp; Barcode
                    </button>
                    <button
                      onClick={() => setIsReassignModalOpen(true)}
                      className="h-8 bg-surface-container hover:bg-surface-container-high text-on-surface font-clinical-data text-metadata-micro font-semibold rounded flex items-center justify-center gap-1 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">swap_horiz</span> Reassign / Move
                    </button>
                  </div>
                </div>

                {/* Capacity & Audit Provenance Footnote */}
                {selectedAppointment.audit && (
                  <div className="p-space-xs rounded bg-surface-container-low text-[10px] font-clinical-data-mono text-outline flex flex-col gap-0.5">
                    <span>Booked via: {selectedAppointment.audit.bookedVia}</span>
                    <span>Operator: {selectedAppointment.audit.operator}</span>
                    <span>HL7/FHIR Encounter ID: {selectedAppointment.audit.encounterId}</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: ADD APPOINTMENT / BOOK WALK-IN MODAL */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-lg w-full overflow-hidden">
            <div className="px-5 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">person_add</span>
                <h3 className="font-body-strong text-body-strong text-on-surface">
                  Create OPD Encounter / Appointment
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface rounded p-1"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <form onSubmit={handleAddAppointment} className="p-5 flex flex-col gap-4 text-clinical-data">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-metadata-micro uppercase font-semibold text-outline mb-1">
                    Patient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAptForm.patientName}
                    onChange={(e) => setNewAptForm({ ...newAptForm, patientName: e.target.value })}
                    placeholder="e.g. Ramesh Chandra"
                    className="w-full h-8 px-3 rounded border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-metadata-micro uppercase font-semibold text-outline mb-1">Age</label>
                  <input
                    type="number"
                    value={newAptForm.age}
                    onChange={(e) => setNewAptForm({ ...newAptForm, age: e.target.value })}
                    placeholder="48"
                    className="w-full h-8 px-3 rounded border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-metadata-micro uppercase font-semibold text-outline mb-1">Gender</label>
                  <select
                    value={newAptForm.gender}
                    onChange={(e) => setNewAptForm({ ...newAptForm, gender: e.target.value })}
                    className="w-full h-8 px-2 rounded border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="M">Male (M)</option>
                    <option value="F">Female (F)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-metadata-micro uppercase font-semibold text-outline mb-1">
                    UHID / ABHA ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={newAptForm.uhid}
                    onChange={(e) => setNewAptForm({ ...newAptForm, uhid: e.target.value })}
                    placeholder="e.g. DEL-2024-5510 or 91-xxxx-xxxx-xxxx"
                    className="w-full h-8 px-3 rounded border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-metadata-micro uppercase font-semibold text-outline mb-1">
                    Assigned Clinician
                  </label>
                  <select
                    value={newAptForm.doctorName}
                    onChange={(e) => {
                      const doc = e.target.value;
                      let rm = "Room 04 · Cardio OPD";
                      if (doc.includes("Kulkarni")) rm = "Suite 12 · Endo";
                      if (doc.includes("Nair")) rm = "Suite 02 · Gen Med";
                      if (doc.includes("Chacko")) rm = "Suite 08 · Pulm";
                      setNewAptForm({ ...newAptForm, doctorName: doc, room: rm });
                    }}
                    className="w-full h-8 px-2 rounded border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="Dr. Rohit Verma">Dr. Rohit Verma (Cardio)</option>
                    <option value="Dr. S. Kulkarni">Dr. S. Kulkarni (Endo)</option>
                    <option value="Dr. Anjali Nair">Dr. Anjali Nair (Gen Med)</option>
                    <option value="Dr. M. Chacko">Dr. M. Chacko (Pulm)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-metadata-micro uppercase font-semibold text-outline mb-1">Slot Time</label>
                  <input
                    type="text"
                    value={newAptForm.time}
                    onChange={(e) => setNewAptForm({ ...newAptForm, time: e.target.value })}
                    className="w-full h-8 px-3 rounded border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-metadata-micro uppercase font-semibold text-outline mb-1">
                    Triage Acuity
                  </label>
                  <select
                    value={newAptForm.acuity}
                    onChange={(e) => setNewAptForm({ ...newAptForm, acuity: e.target.value as Appointment["acuity"] })}
                    className="w-full h-8 px-2 rounded border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="P3 Routine">P3 Routine</option>
                    <option value="P2 Emergent">P2 Emergent</option>
                    <option value="P1 High Alert">P1 High Alert</option>
                    <option value="P1 STAT CRITICAL">P1 STAT CRITICAL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-metadata-micro uppercase font-semibold text-outline mb-1">Visit Type</label>
                  <select
                    value={newAptForm.visitType}
                    onChange={(e) => setNewAptForm({ ...newAptForm, visitType: e.target.value })}
                    className="w-full h-8 px-2 rounded border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="Walk-in Consultation">Walk-in Consultation</option>
                    <option value="Urgent Referral">Urgent Referral</option>
                    <option value="Follow-up Consult">Follow-up Consult</option>
                    <option value="Emergency Walk-in">Emergency Walk-in</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-metadata-micro uppercase font-semibold text-outline mb-1">
                    Chief Complaint / Clinical Notes
                  </label>
                  <input
                    type="text"
                    value={newAptForm.complaint}
                    onChange={(e) => setNewAptForm({ ...newAptForm, complaint: e.target.value })}
                    placeholder="e.g. Recurrent palpitations, shortness of breath on exertion"
                    className="w-full h-8 px-3 rounded border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-surface-container text-on-surface hover:bg-surface-container-high font-semibold text-clinical-data"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-primary text-on-primary hover:bg-primary-container font-semibold text-clinical-data shadow-sm flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">check</span>
                  Generate Token &amp; Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: OVERBOOKING MANAGER MODAL */}
      {/* ========================================================================= */}
      {isOverbookingOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-lg w-full overflow-hidden">
            <div className="px-5 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-xl">layers</span>
                <h3 className="font-body-strong text-body-strong text-on-surface">
                  OPD Overbooking &amp; Surge Capacity Controls
                </h3>
              </div>
              <button
                onClick={() => setIsOverbookingOpen(false)}
                className="text-on-surface-variant hover:text-on-surface rounded p-1"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4 text-clinical-data">
              <p className="text-on-surface-variant text-metadata-micro leading-relaxed">
                Control emergency overbooking quotas, walk-in thresholds, and automatic slot reallocation across all active OPD suites.
              </p>

              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-on-surface block">Emergency Walk-in Buffer</span>
                    <span className="text-metadata-micro text-outline">Reserve up to 3 slots/hour for STAT cases</span>
                  </div>
                  <span className="px-2 py-1 rounded bg-primary text-on-primary font-bold text-metadata-micro">
                    +3 SLOTS ACTIVE
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-on-surface block">Cardiology Overbooking Cap</span>
                    <span className="text-metadata-micro text-outline">Currently at 98% capacity load</span>
                  </div>
                  <span className="px-2 py-1 rounded bg-error text-on-error font-bold text-metadata-micro">
                    SURGE LOCKED
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-on-surface block">No-Show Auto-Reclamation</span>
                    <span className="text-metadata-micro text-outline">Reassign slot after 15 min grace period</span>
                  </div>
                  <span className="px-2 py-1 rounded bg-secondary-container text-on-secondary-container font-bold text-metadata-micro">
                    ENABLED
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setIsOverbookingOpen(false)}
                  className="px-3 py-1.5 rounded bg-surface-container text-on-surface hover:bg-surface-container-high font-semibold text-clinical-data"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsOverbookingOpen(false);
                    showToast("Overbooking parameters updated facility-wide.");
                  }}
                  className="px-4 py-1.5 rounded bg-primary text-on-primary hover:bg-primary-container font-semibold text-clinical-data shadow-sm"
                >
                  Save Configuration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: EXPORT SCHEDULE MODAL */}
      {/* ========================================================================= */}
      {isExportOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-md w-full overflow-hidden">
            <div className="px-5 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">download</span>
                <h3 className="font-body-strong text-body-strong text-on-surface">
                  Export Daily Schedule Roster
                </h3>
              </div>
              <button
                onClick={() => setIsExportOpen(false)}
                className="text-on-surface-variant hover:text-on-surface rounded p-1"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4 text-clinical-data">
              <div className="flex flex-col gap-2">
                <label className="text-metadata-micro uppercase font-semibold text-outline">Target Date Range</label>
                <div className="font-semibold text-on-surface bg-surface-container-low px-3 py-2 rounded">
                  {currentDateString}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-metadata-micro uppercase font-semibold text-outline">File Format</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setIsExportOpen(false);
                      showToast("Generating PDF Schedule Roster with barcodes...");
                    }}
                    className="p-3 rounded border border-outline-variant hover:border-primary flex flex-col items-center gap-1 transition-colors group"
                  >
                    <span className="material-symbols-outlined text-2xl text-error">picture_as_pdf</span>
                    <span className="font-bold text-on-surface">PDF Clinical Roster</span>
                    <span className="text-[10px] text-outline">Print-ready format</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsExportOpen(false);
                      showToast("Exporting Excel (XLSX) OPD Roster with metadata...");
                    }}
                    className="p-3 rounded border border-outline-variant hover:border-primary flex flex-col items-center gap-1 transition-colors group"
                  >
                    <span className="material-symbols-outlined text-2xl text-primary">table_view</span>
                    <span className="font-bold text-on-surface">Excel SpreadSheet</span>
                    <span className="text-[10px] text-outline">Audit &amp; MIS format</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: CATH LAB TRANSFER ALERT MODAL */}
      {/* ========================================================================= */}
      {isCathLabModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border-2 border-error max-w-lg w-full overflow-hidden">
            <div className="px-5 py-3 bg-error text-on-error flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xl animate-pulse">emergency</span>
                <h3 className="font-bold text-clinical-data uppercase tracking-wider">
                  STAT TRANSFER · CODE STEMI PROTOCOL
                </h3>
              </div>
              <button
                onClick={() => setIsCathLabModalOpen(false)}
                className="text-on-error hover:opacity-80 rounded p-1"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4 text-clinical-data">
              <div className="p-3 rounded bg-error/10 border-l-4 border-error flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-error">Rahul Sharma (#104 · DEL-2024-8841)</span>
                  <span className="font-clinical-data-mono font-bold text-error">28m ELAPSED</span>
                </div>
                <p className="text-metadata-micro text-on-surface">
                  Door-to-Balloon clock active. Cath Lab Team Beta is on active standby at Lab 02.
                </p>
              </div>

              <div className="space-y-1.5 text-metadata-micro font-clinical-data">
                <div className="flex justify-between border-b border-surface-container pb-1">
                  <span className="text-outline">Receiving Unit:</span>
                  <span className="font-semibold text-on-surface">Cath Lab Suite 02 (Ground Floor)</span>
                </div>
                <div className="flex justify-between border-b border-surface-container pb-1">
                  <span className="text-outline">Cardiologist On-Duty:</span>
                  <span className="font-semibold text-on-surface">Dr. Rohit Verma / Dr. Sandeep Goyal</span>
                </div>
                <div className="flex justify-between border-b border-surface-container pb-1">
                  <span className="text-outline">Pre-Op Meds Administered:</span>
                  <span className="font-semibold text-on-surface">Ticagrelor 180mg, Atorvastatin 80mg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Allergies:</span>
                  <span className="font-semibold text-error">Penicillin Anaphylaxis, Aspirin intolerance</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setIsCathLabModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-surface-container text-on-surface hover:bg-surface-container-high font-semibold text-clinical-data"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCathLabModalOpen(false);
                    showToast("Code STEMI dispatched! Gurney transit to Cath Lab 02 in progress.");
                  }}
                  className="px-4 py-1.5 rounded bg-error text-on-error hover:opacity-90 font-semibold text-clinical-data shadow-sm flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">emergency_share</span>
                  Dispatch Bedside Gurney
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: BARCODE & TOKEN PRINT PREVIEW MODAL */}
      {/* ========================================================================= */}
      {isBarcodeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-sm w-full overflow-hidden">
            <div className="px-5 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">print</span>
                <h3 className="font-body-strong text-body-strong text-on-surface">Thermal Token Slip</h3>
              </div>
              <button
                onClick={() => setIsBarcodeModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface rounded p-1"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="p-5 flex flex-col items-center text-center gap-3">
              {/* Slip Card */}
              <div className="w-full p-4 bg-surface-container-low rounded-lg border border-dashed border-outline font-clinical-data-mono flex flex-col items-center">
                <span className="font-bold text-xs uppercase text-primary">CareFlow Clinical · Indraprastha</span>
                <span className="text-[10px] text-outline">OPD Token Routing Slip</span>
                <div className="my-2 py-1 px-4 bg-surface-container-lowest rounded border border-surface-container text-2xl font-bold text-on-surface">
                  {selectedAppointment.token}
                </div>
                <div className="text-xs font-bold text-on-surface">{selectedAppointment.patientName}</div>
                <div className="text-[10px] text-on-surface-variant">{selectedAppointment.uhid}</div>
                <div className="text-[10px] text-on-surface-variant">
                  {selectedAppointment.doctorName} · {selectedAppointment.room}
                </div>

                {/* Simulated Barcode */}
                <div className="my-3 flex items-center justify-center gap-0.5 h-10 w-full px-4 bg-surface-container-lowest py-1 rounded">
                  <div className="w-1 h-8 bg-black"></div>
                  <div className="w-0.5 h-8 bg-black"></div>
                  <div className="w-1.5 h-8 bg-black"></div>
                  <div className="w-0.5 h-8 bg-black"></div>
                  <div className="w-2 h-8 bg-black"></div>
                  <div className="w-1 h-8 bg-black"></div>
                  <div className="w-0.5 h-8 bg-black"></div>
                  <div className="w-1.5 h-8 bg-black"></div>
                  <div className="w-2 h-8 bg-black"></div>
                  <div className="w-0.5 h-8 bg-black"></div>
                  <div className="w-1 h-8 bg-black"></div>
                </div>
                <span className="text-[9px] text-outline">Scan at Department Terminal</span>
              </div>

              <div className="w-full flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBarcodeModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-surface-container text-on-surface hover:bg-surface-container-high font-semibold text-clinical-data flex-1"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsBarcodeModalOpen(false);
                    showToast(`Token #${selectedAppointment.token} sent to Zebra Thermal Printer 01.`);
                  }}
                  className="px-4 py-1.5 rounded bg-primary text-on-primary hover:bg-primary-container font-semibold text-clinical-data shadow-sm flex items-center justify-center gap-1 flex-1"
                >
                  <span className="material-symbols-outlined text-sm">print</span>
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: REASSIGN / MOVE CLINICIAN OR ROOM MODAL */}
      {/* ========================================================================= */}
      {isReassignModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-md w-full overflow-hidden">
            <div className="px-5 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">swap_horiz</span>
                <h3 className="font-body-strong text-body-strong text-on-surface">Reassign Encounter</h3>
              </div>
              <button
                onClick={() => setIsReassignModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface rounded p-1"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4 text-clinical-data">
              <div className="p-3 bg-surface-container-low rounded">
                <span className="text-metadata-micro text-outline block">Selected Patient:</span>
                <span className="font-bold text-on-surface">
                  {selectedAppointment.patientName} ({selectedAppointment.token})
                </span>
                <span className="text-metadata-micro text-on-surface-variant block">
                  Current: {selectedAppointment.doctorName} · {selectedAppointment.room}
                </span>
              </div>

              <div>
                <label className="block text-metadata-micro uppercase font-semibold text-outline mb-1">
                  Target Clinician
                </label>
                <select
                  value={reassignData.targetDoctor}
                  onChange={(e) => {
                    const doc = e.target.value;
                    let rm = "Room 04 · Cardio OPD";
                    if (doc.includes("Kulkarni")) rm = "Suite 12 · Endo";
                    if (doc.includes("Nair")) rm = "Suite 02 · Gen Med";
                    if (doc.includes("Chacko")) rm = "Suite 08 · Pulm";
                    setReassignData({ ...reassignData, targetDoctor: doc, targetRoom: rm });
                  }}
                  className="w-full h-8 px-2 rounded border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                >
                  <option value="Dr. Rohit Verma (Cardiology)">Dr. Rohit Verma (Cardiology)</option>
                  <option value="Dr. Sameer Kulkarni (Endocrinology)">Dr. Sameer Kulkarni (Endocrinology)</option>
                  <option value="Dr. Anjali Nair (Gen Med)">Dr. Anjali Nair (Gen Med)</option>
                  <option value="Dr. M. Chacko (Pulmonology)">Dr. M. Chacko (Pulmonology)</option>
                </select>
              </div>

              <div>
                <label className="block text-metadata-micro uppercase font-semibold text-outline mb-1">Target Room</label>
                <input
                  type="text"
                  value={reassignData.targetRoom}
                  onChange={(e) => setReassignData({ ...reassignData, targetRoom: e.target.value })}
                  className="w-full h-8 px-3 rounded border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-metadata-micro uppercase font-semibold text-outline mb-1">
                  Transfer Reason / Note
                </label>
                <input
                  type="text"
                  value={reassignData.note}
                  onChange={(e) => setReassignData({ ...reassignData, note: e.target.value })}
                  className="w-full h-8 px-3 rounded border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setIsReassignModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-surface-container text-on-surface hover:bg-surface-container-high font-semibold text-clinical-data"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAppointments((prev) =>
                      prev.map((a) =>
                        a.id === selectedAppointment.id
                          ? {
                              ...a,
                              doctorName: reassignData.targetDoctor.split(" (")[0],
                              room: reassignData.targetRoom,
                            }
                          : a
                      )
                    );
                    setIsReassignModalOpen(false);
                    showToast(`Reassigned ${selectedAppointment.patientName} to ${reassignData.targetDoctor}.`);
                  }}
                  className="px-4 py-1.5 rounded bg-primary text-on-primary hover:bg-primary-container font-semibold text-clinical-data shadow-sm"
                >
                  Confirm Transfer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
