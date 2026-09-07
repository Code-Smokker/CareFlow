"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";

interface TransitionPatient {
  id: string;
  name: string;
  initials: string;
  age: number;
  gender: "M" | "F";
  uhid: string;
  ipdNo: string;
  bed: string;
  ward: string;
  attending: string;
  department: string;
  type: string;
  clinicalState: string;
  barriers: string;
  targetTime: string;
  readinessStatus: "ready" | "in-progress" | "delayed" | "active-day0";
  readinessLabel: string;
  readinessBadgeClass: string;
  diagnosisCode: string;
  diagnosisText: string;
  medsNote: string;
  woundNote: string;
  signedBy: string;
  counselingNote: string;
  followUp: string;
  pharmacyKit: string;
  insuranceNote: string;
  abhaSyncToken: string;
  pdfFileName: string;
  pdfSize: string;
  checklistState: boolean[];
}

const INITIAL_PATIENTS: TransitionPatient[] = [
  {
    id: "p1",
    name: "Rahul Sharma",
    initials: "RS",
    age: 42,
    gender: "M",
    uhid: "8841",
    ipdNo: "IPD-2026-00921",
    bed: "CCU · Bed 01",
    ward: "Coronary Care Unit",
    attending: "Dr. Rohit Verma",
    department: "Cardiology",
    type: "PCI Pathway",
    clinicalState: "Active STEMI (Post-Cath Stabilization)",
    barriers: "4 Days Inpatient Req.",
    targetTime: "Target: 22-Oct",
    readinessStatus: "active-day0",
    readinessLabel: "Day 0 Active",
    readinessBadgeClass: "bg-surface-container text-on-surface",
    diagnosisCode: "ICD-10 I21.0 Anterior STEMI (Primary PCI)",
    diagnosisText: "Acute Transmural MI of Anterior Wall; Drug-eluting stent LAD",
    medsNote: "DAPT (Aspirin 75mg + Ticagrelor 90mg BD), Atorvastatin 80mg, Metoprolol 25mg",
    woundNote: "Right radial artery puncture site intact with TR Band applied; no hematoma",
    signedBy: "Dr. Rohit Verma (Cardiology Lead) · Pending Post-Op Echo",
    counselingNote: "Cardiac rehabilitation phase 1 orientation scheduled for Day 2",
    followUp: "28 Oct 2024, 11:00 AM · Dr. Rohit Verma (Cardio OPD Room 04)",
    pharmacyKit: "Kit #RX-9940 Pending Cath Lab stabilization",
    insuranceNote: "ICICI Lombard Cashless approved ₹4,50,000 · Inpatient Active",
    abhaSyncToken: "ABDM-2024-918842-CARE-ENCOUNTER-ACTIVE",
    pdfFileName: "Inpatient_Dossier_RahulSharma.pdf",
    pdfSize: "4.2 MB · Live Encrypted",
    checklistState: [true, true, true, false, false, true, false, true, true],
  },
  {
    id: "p2",
    name: "Priya Sundaram",
    initials: "PS",
    age: 38,
    gender: "F",
    uhid: "11904",
    ipdNo: "IPD-2026-00812",
    bed: "Bed 308-B",
    ward: "Ward 03 (Surg)",
    attending: "Dr. P. Mehta",
    department: "Gen Surgery",
    type: "Routine Surgical",
    clinicalState: "Post-Lap Appy Day 3 (Afebrile)",
    barriers: "All Clear (Rx OK)",
    targetTime: "Target: 15:30 IST",
    readinessStatus: "ready",
    readinessLabel: "READY EXIT",
    readinessBadgeClass: "bg-primary-container text-on-primary animate-pulse font-bold",
    diagnosisCode: "ICD-10 K35.80 Uncomplicated Appendicitis",
    diagnosisText: "Acute appendicitis; uncomplicated laparoscopic appendectomy completed",
    medsNote: "Pain meds & Oral Cefuroxime 500mg BD prescribed (5 days course)",
    woundNote: "Dry, clean, healing by primary intention; surgical port sites inspected",
    signedBy: "Signed by Dr. P. Mehta (MCI #38192) · 14:10 IST",
    counselingNote: "Dietary plan shared with patient and family attendant; high fiber advised",
    followUp: "25 Oct 2024, 10:30 AM · Dr. Mehta (Room 108)",
    pharmacyKit: "Kit #RX-9912 verified with bilingual schedule labels",
    insuranceNote: "MediAssist Settled: ₹78,400 / Co-pay: ₹0",
    abhaSyncToken: "ABDM Token #9928-ABHA-DISCHARGE Synced",
    pdfFileName: "Discharge_Summary_PriyaSundaram.pdf",
    pdfSize: "3.4 MB · Digitally Encrypted SHA-256",
    checklistState: [true, true, true, true, true, true, true, true, true],
  },
  {
    id: "p3",
    name: "Harish Chandra",
    initials: "HC",
    age: 64,
    gender: "M",
    uhid: "4419",
    ipdNo: "IPD-2026-00790",
    bed: "HDU · Bed 04",
    ward: "High Dependency Unit",
    attending: "Dr. Sameer Kulkarni",
    department: "Nephrology",
    type: "Ext. Tertiary Referral",
    clinicalState: "End-Stage Renal Disease (Cr 4.8)",
    barriers: "AIIMS Bed Acc.",
    targetTime: "Target: 16:00 IST",
    readinessStatus: "delayed",
    readinessLabel: "TRANSFER PEND",
    readinessBadgeClass: "bg-secondary-container text-on-secondary-container font-semibold",
    diagnosisCode: "ICD-10 N18.6 End-Stage Renal Disease",
    diagnosisText: "ESRD on maintenance hemodialysis; hyperkalemia stabilized",
    medsNote: "Sodium polystyrene sulfonate, Amlodipine 10mg, Sevelamer 800mg TDS",
    woundNote: "Left forearm Cimino AV fistula active with audible thrill and bruit",
    signedBy: "Signed by Dr. Sameer Kulkarni · Transfer Clinical Summary Attached",
    counselingNote: "Fluid restriction (<1.2 L/day) and potassium-sparing dietary protocol reviewed",
    followUp: "AIIMS Tertiary Nephrology Center · Dialysis Unit Slot B-12",
    pharmacyKit: "Emergency travel med pack prepared with transport cooling",
    insuranceNote: "Direct CGHS empanelled transfer pre-approved",
    abhaSyncToken: "ABDM-2024-TRANSFER-REF-77192-AIIMS",
    pdfFileName: "InterFacility_Transfer_Summary_HarishChandra.pdf",
    pdfSize: "2.9 MB · Transport Authenticated",
    checklistState: [true, true, true, true, true, false, true, true, false],
  },
  {
    id: "p4",
    name: "Mohammad Farooq",
    initials: "MF",
    age: 67,
    gender: "M",
    uhid: "71032",
    ipdNo: "ENC-2026-90412",
    bed: "OPD Resus · Station 03",
    ward: "Pulmonology Short Stay",
    attending: "Dr. M. Chacko",
    department: "Pulmonology",
    type: "Step-Down Home",
    clinicalState: "COPD Exacerbation (Resolved)",
    barriers: "Inhaler Technique Edu",
    targetTime: "Target: 15:15 IST",
    readinessStatus: "in-progress",
    readinessLabel: "DOCS SIGNED",
    readinessBadgeClass: "bg-tertiary-fixed text-on-tertiary-fixed font-semibold",
    diagnosisCode: "ICD-10 J44.1 COPD with Acute Exacerbation",
    diagnosisText: "Chronic Obstructive Pulmonary Disease exacerbation; post bronchodilator response stable",
    medsNote: "Tiotropium 18mcg Inhaler OD, Formoterol/Budesonide 400/12 MDI BD, Oral Prednisolone taper",
    woundNote: "No surgical incisions; IV cannula site in right hand clear and patent",
    signedBy: "Signed by Dr. M. Chacko · 13:45 IST",
    counselingNote: "Spacer chamber cleaning instructions and peak flow meter monitoring advised",
    followUp: "02 Nov 2024, 09:30 AM · Dr. Chacko (Chest Clinic Station 02)",
    pharmacyKit: "Kit #RX-9931 Inhaler devices demonstrated by clinical pharmacist",
    insuranceNote: "Cashless settlement completed through Star Health Insurance",
    abhaSyncToken: "ABDM-2024-DISCHARGE-90412-CHEST",
    pdfFileName: "Pulmonology_Discharge_Summary_MFarooq.pdf",
    pdfSize: "2.1 MB · Certified PDF",
    checklistState: [true, true, true, true, false, true, true, true, true],
  },
  {
    id: "p5",
    name: "Anita Rao",
    initials: "AR",
    age: 61,
    gender: "F",
    uhid: "48190",
    ipdNo: "IPD-2026-00855",
    bed: "Ortho Ward · Bed 02",
    ward: "Orthopedic Care Center",
    attending: "Dr. M. S. Bedi",
    department: "Orthopedics",
    type: "Routine Orthopedic",
    clinicalState: "Post-Bilateral Knee Arthroscopy",
    barriers: "TPA Clearance Pend",
    targetTime: "Target: 16:30 IST",
    readinessStatus: "delayed",
    readinessLabel: "BILLING PEND",
    readinessBadgeClass: "bg-secondary-fixed text-on-secondary-fixed font-semibold",
    diagnosisCode: "ICD-10 M23.2 Meniscus tear bilateral knee",
    diagnosisText: "Bilateral degenerative meniscal tear; diagnostic and therapeutic arthroscopy Day 2",
    medsNote: "Paracetamol 650mg QDS, Tramadol PRN, Pantoprazole 40mg OD, DVT Prophylaxis Enoxaparin",
    woundNote: "Bilateral knee dressing clean, dry, elastic compression stockings applied",
    signedBy: "Signed by Dr. M. S. Bedi · 14:00 IST",
    counselingNote: "Weight-bearing as tolerated with walker frame; quadriceps strengthening regimen",
    followUp: "26 Oct 2024, 11:30 AM · Ortho Clinic Dr. Bedi",
    pharmacyKit: "Kit #RX-9920 Ready at central dispensary",
    insuranceNote: "HDFC ERGO TPA Final Bill sent (₹1,12,000); awaiting discharge clearance authorization",
    abhaSyncToken: "ABDM-2024-ORTHO-855-PENDING",
    pdfFileName: "Ortho_Discharge_Summary_AnitaRao.pdf",
    pdfSize: "3.1 MB · Digital Signature Attached",
    checklistState: [true, true, true, true, true, true, false, false, true],
  },
];

export default function DischargeReferralsPage() {
  const [patients, setPatients] = useState<TransitionPatient[]>(INITIAL_PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("p2"); // Default Priya Sundaram
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");

  // Notifications Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Modals
  const [isInitiateDischargeOpen, setIsInitiateDischargeOpen] = useState<boolean>(false);
  const [isNewReferralOpen, setIsNewReferralOpen] = useState<boolean>(false);
  const [isBatchAbhaOpen, setIsBatchAbhaOpen] = useState<boolean>(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState<boolean>(false);
  const [isPrintSummaryOpen, setIsPrintSummaryOpen] = useState<boolean>(false);
  const [isTrackTransferOpen, setIsTrackTransferOpen] = useState<boolean>(false);

  // New Discharge Form State
  const [newDischargeName, setNewDischargeName] = useState("");
  const [newDischargeUhid, setNewDischargeUhid] = useState("");
  const [newDischargeBed, setNewDischargeBed] = useState("");
  const [newDischargeType, setNewDischargeType] = useState("Routine Discharge Home");
  const [newDischargeAttending, setNewDischargeAttending] = useState("Dr. Rohit Verma");

  // New Referral Form State
  const [referralTargetFacility, setReferralTargetFacility] = useState("AIIMS Delhi · Tertiary Care");
  const [referralAmbulanceType, setReferralAmbulanceType] = useState("ALS (Advanced Life Support)");
  const [referralReason, setReferralReason] = useState("Tertiary Hemodialysis & Specialist Evaluation");

  // Currently selected patient
  const selectedPatient = useMemo(() => {
    return patients.find((p) => p.id === selectedPatientId) || patients[0];
  }, [patients, selectedPatientId]);

  // Filtered Patients List
  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.uhid.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.ipdNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.bed.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.attending.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.clinicalState.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDept =
        departmentFilter === "All" || p.department.toLowerCase() === departmentFilter.toLowerCase();

      const matchesType =
        typeFilter === "All" ||
        p.type.toLowerCase().includes(typeFilter.toLowerCase()) ||
        (typeFilter === "Referral" && p.type.toLowerCase().includes("referral")) ||
        (typeFilter === "Discharge" && !p.type.toLowerCase().includes("referral"));

      return matchesSearch && matchesDept && matchesType;
    });
  }, [patients, searchQuery, departmentFilter, typeFilter]);

  // Checklist verification step toggle
  const toggleChecklistStep = (index: number) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === selectedPatient.id) {
          const newCheck = [...p.checklistState];
          newCheck[index] = !newCheck[index];
          return { ...p, checklistState: newCheck };
        }
        return p;
      })
    );
  };

  const clearedStepsCount = selectedPatient.checklistState.filter(Boolean).length;

  return (
    <div className="flex flex-col w-full">
      {/* Toast Alert */}
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

      {/* Operational Header & Controls */}
      <div className="flex flex-col gap-space-md mb-space-lg">
        <div className="flex flex-wrap items-center justify-between gap-space-base">
          <div>
            <div className="flex items-center gap-space-xs text-metadata-micro font-metadata-micro text-primary font-semibold tracking-wider uppercase">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              Clinical Transitions &amp; Bed Logistics
            </div>
            <h1 className="font-page-title text-page-title text-on-surface tracking-tight mt-0.5">
              Discharge &amp; Referral Management
            </h1>
            <p className="font-body-default text-clinical-data text-on-surface-variant">
              Coordinate inpatient discharge planning, inter-facility transfers, clinical handoffs, and external referrals.
            </p>
          </div>
          {/* Global Actions */}
          <div className="flex items-center flex-wrap gap-space-xs">
            <button
              onClick={() => setIsBatchAbhaOpen(true)}
              className="px-space-md h-9 bg-surface-container hover:bg-surface-container-high text-on-surface font-body-strong text-clinical-data rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-base text-secondary">verified</span>
              Batch ABHA Push
            </button>
            <button
              onClick={() => setIsAuditModalOpen(true)}
              className="px-space-md h-9 bg-surface-container hover:bg-surface-container-high text-on-surface font-body-strong text-clinical-data rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-base text-secondary">analytics</span>
              Discharge Audit Summary
            </button>
            <button
              onClick={() => setIsNewReferralOpen(true)}
              className="px-space-md h-9 bg-secondary-container hover:bg-surface-container-high text-on-secondary-container font-body-strong text-clinical-data rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-base">outgoing_mail</span>
              + New External Referral
            </button>
            <button
              onClick={() => setIsInitiateDischargeOpen(true)}
              className="px-space-lg h-9 bg-primary-container hover:bg-primary text-on-primary font-body-strong text-clinical-data rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-base">assignment_turned_in</span>
              + Initiate Discharge
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-surface-container-lowest rounded-xl p-space-sm flex flex-wrap items-center gap-space-sm shadow-sm border border-outline-variant/20">
          <div className="flex items-center gap-1.5 px-space-sm py-1.5 bg-surface-container-low rounded-lg text-on-surface font-clinical-data text-clinical-data">
            <span className="material-symbols-outlined text-primary text-base">domain</span>
            <span className="font-semibold">Apollo Indraprastha · Central Campus</span>
          </div>
          <div className="flex items-center gap-1.5 px-space-sm py-1.5 bg-surface-container-low rounded-lg text-on-surface font-clinical-data text-clinical-data">
            <span className="material-symbols-outlined text-outline text-base">calendar_today</span>
            <span>Today (18 Oct 2024)</span>
            <span className="material-symbols-outlined text-outline text-xs ml-1">expand_more</span>
          </div>
          <div className="relative">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="h-8 pl-8 pr-7 bg-surface-container-low text-on-surface rounded-lg font-clinical-data text-clinical-data appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="All">Dept: All Departments</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Gen Surgery">Gen Surgery</option>
              <option value="Nephrology">Nephrology</option>
              <option value="Pulmonology">Pulmonology</option>
              <option value="Orthopedics">Orthopedics</option>
            </select>
            <span className="material-symbols-outlined absolute left-2 top-1.5 text-outline text-base pointer-events-none">
              local_hospital
            </span>
            <span className="material-symbols-outlined absolute right-2 top-1.5 text-outline text-xs pointer-events-none">
              expand_more
            </span>
          </div>
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-8 pl-8 pr-7 bg-surface-container-low text-on-surface rounded-lg font-clinical-data text-clinical-data appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="All">Type: All Discharges &amp; Transfers</option>
              <option value="Discharge">Routine Discharges Only</option>
              <option value="Referral">Inter-Hospital Referrals Only</option>
            </select>
            <span className="material-symbols-outlined absolute left-2 top-1.5 text-outline text-base pointer-events-none">
              swap_horiz
            </span>
            <span className="material-symbols-outlined absolute right-2 top-1.5 text-outline text-xs pointer-events-none">
              expand_more
            </span>
          </div>
          {/* Search Input */}
          <div className="flex-1 min-w-[280px] relative">
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-outline text-base">search</span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 text-clinical-data font-clinical-data bg-surface-container-low text-on-surface placeholder:text-outline rounded-lg focus:outline-none focus:bg-surface-container-lowest transition-all border border-transparent focus:border-primary"
              placeholder="Search patient by Name, UHID, IPD #, Discharge Status or Receiving Facility..."
              type="text"
            />
          </div>
          <button
            onClick={() => {
              setSearchQuery("");
              setDepartmentFilter("All");
              setTypeFilter("All");
              showToast("Filters reset to default view.");
            }}
            className="h-8 w-8 flex items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
            title="Reset Filters"
          >
            <span className="material-symbols-outlined text-base">filter_list_off</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-space-sm mb-space-lg">
        {/* Planned Discharges */}
        <div className="bg-surface-container-lowest p-space-sm rounded-xl flex flex-col justify-between shadow-sm border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase tracking-wider">
              Planned Discharges
            </span>
            <span className="material-symbols-outlined text-primary text-base">event_upcoming</span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="font-page-title text-page-title text-on-surface font-bold">28</span>
            <span className="font-metadata-micro text-metadata-micro text-outline">Across all wards</span>
          </div>
          <div className="w-full bg-surface-container h-1 rounded-full mt-2 overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: "70%" }}></div>
          </div>
        </div>

        {/* Medically Cleared */}
        <div className="bg-surface-container-lowest p-space-sm rounded-xl flex flex-col justify-between shadow-sm border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase tracking-wider">
              Medically Cleared
            </span>
            <span className="material-symbols-outlined text-primary-container text-base">check_circle</span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="font-page-title text-page-title text-primary-container font-bold">14</span>
            <span className="font-metadata-micro text-metadata-micro text-outline">50% completed</span>
          </div>
          <div className="w-full bg-surface-container h-1 rounded-full mt-2 overflow-hidden">
            <div className="bg-primary-container h-full rounded-full" style={{ width: "50%" }}></div>
          </div>
        </div>

        {/* Pending Docs */}
        <div className="bg-surface-container-lowest p-space-sm rounded-xl flex flex-col justify-between shadow-sm border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase tracking-wider">
              Pending Docs
            </span>
            <span className="material-symbols-outlined text-error text-base">edit_note</span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="font-page-title text-page-title text-error font-bold">08</span>
            <span className="font-metadata-micro text-metadata-micro text-error font-semibold">MD Sign-off</span>
          </div>
          <div className="w-full bg-surface-container h-1 rounded-full mt-2 overflow-hidden">
            <div className="bg-error h-full rounded-full" style={{ width: "28%" }}></div>
          </div>
        </div>

        {/* Pending Pharmacy */}
        <div className="bg-surface-container-lowest p-space-sm rounded-xl flex flex-col justify-between shadow-sm border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase tracking-wider">
              Pending Pharmacy
            </span>
            <span className="material-symbols-outlined text-tertiary text-base">medication</span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="font-page-title text-page-title text-tertiary font-bold">04</span>
            <span className="font-metadata-micro text-metadata-micro text-outline">Dispensing kit</span>
          </div>
          <div className="w-full bg-surface-container h-1 rounded-full mt-2 overflow-hidden">
            <div className="bg-tertiary h-full rounded-full" style={{ width: "14%" }}></div>
          </div>
        </div>

        {/* Pending Billing */}
        <div className="bg-surface-container-lowest p-space-sm rounded-xl flex flex-col justify-between shadow-sm border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase tracking-wider">
              Pending Billing
            </span>
            <span className="material-symbols-outlined text-secondary text-base">receipt_long</span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="font-page-title text-page-title text-secondary font-bold">06</span>
            <span className="font-metadata-micro text-metadata-micro text-outline">TPA Settlement</span>
          </div>
          <div className="w-full bg-surface-container h-1 rounded-full mt-2 overflow-hidden">
            <div className="bg-secondary h-full rounded-full" style={{ width: "21%" }}></div>
          </div>
        </div>

        {/* External Referrals */}
        <div className="bg-surface-container-lowest p-space-sm rounded-xl flex flex-col justify-between shadow-sm border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase tracking-wider">
              External Referrals
            </span>
            <span className="material-symbols-outlined text-secondary text-base">airport_shuttle</span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="font-page-title text-page-title text-on-surface font-bold">07</span>
            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant font-medium">
              4 Done / 3 Pend
            </span>
          </div>
          <div className="w-full bg-surface-container h-1 rounded-full mt-2 overflow-hidden">
            <div className="bg-secondary-container h-full rounded-full" style={{ width: "57%" }}></div>
          </div>
        </div>

        {/* Avg Turnaround */}
        <div className="bg-surface-container-lowest p-space-sm rounded-xl flex flex-col justify-between shadow-sm border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase tracking-wider">
              Avg Turnaround
            </span>
            <span className="material-symbols-outlined text-primary text-base">timer</span>
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-page-title text-page-title text-primary font-bold">2h 40m</span>
            <span className="font-metadata-micro text-metadata-micro text-primary-fixed-dim bg-primary-container px-1 py-0.5 rounded ml-1 font-semibold">
              T: &lt;3h
            </span>
          </div>
          <div className="w-full bg-surface-container h-1 rounded-full mt-2 overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: "88%" }}></div>
          </div>
        </div>
      </div>

      {/* Main Content Layout (70% Worklist / 30% Readiness Inspector Drawer) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
        {/* Left Column: Discharge & Referral Worklist (8 Cols on XL) */}
        <div className="xl:col-span-8 flex flex-col gap-space-md">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/20">
            {/* Table Header Control Bar */}
            <div className="px-space-panel-padding py-space-sm bg-surface-container-low flex flex-wrap items-center justify-between gap-space-sm border-b border-surface-container">
              <div className="flex items-center gap-space-sm">
                <span className="font-section-title text-subheading text-on-surface">Active Transition Worklist</span>
                <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-clinical-data-mono text-metadata-micro font-bold">
                  {filteredPatients.length} Active Tracking
                </span>
              </div>
              <div className="flex items-center gap-space-xs text-metadata-micro font-metadata-micro text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary-container"></span> Ready
                </span>
                <span className="flex items-center gap-1 ml-2">
                  <span className="w-2 h-2 rounded-full bg-tertiary"></span> In-Progress
                </span>
                <span className="flex items-center gap-1 ml-2">
                  <span className="w-2 h-2 rounded-full bg-error"></span> Delayed
                </span>
                <button
                  onClick={() => {
                    setPatients(INITIAL_PATIENTS);
                    showToast("Worklist data refreshed with live inpatient census.");
                  }}
                  className="ml-2 p-1 hover:bg-surface-container rounded transition-colors text-on-surface"
                  title="Reload List"
                >
                  <span className="material-symbols-outlined text-sm">refresh</span>
                </button>
              </div>
            </div>

            {/* High Density Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-clinical-data text-clinical-data border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant font-table-header text-table-header uppercase tracking-wider border-b border-surface-container">
                    <th className="py-2.5 px-3">Patient &amp; UHID</th>
                    <th className="py-2.5 px-3">IPD / Bed</th>
                    <th className="py-2.5 px-3">Attending</th>
                    <th className="py-2.5 px-3">Type &amp; Clinical State</th>
                    <th className="py-2.5 px-3">Barriers &amp; Target</th>
                    <th className="py-2.5 px-3">Readiness</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {filteredPatients.map((patient) => {
                    const isSelected = patient.id === selectedPatient.id;
                    return (
                      <tr
                        key={patient.id}
                        onClick={() => setSelectedPatientId(patient.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-surface-container-high/60 ring-1 ring-inset ring-primary/30"
                            : "hover:bg-surface-container-low bg-surface-container-lowest"
                        }`}
                      >
                        {/* Patient & UHID */}
                        <td className="py-3 px-3 align-top">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                                isSelected
                                  ? "bg-primary-fixed text-on-primary-fixed"
                                  : "bg-surface-container-high text-primary"
                              }`}
                            >
                              {patient.initials}
                            </div>
                            <div>
                              <div className="font-body-strong text-clinical-data text-on-surface leading-snug flex items-center gap-1">
                                {patient.name}
                                {isSelected && (
                                  <span className="material-symbols-outlined text-primary text-xs" title="Selected Record">
                                    check_circle
                                  </span>
                                )}
                              </div>
                              <div className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                                {patient.age}{patient.gender} · UHID: {patient.uhid}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* IPD / Bed */}
                        <td className="py-3 px-3 align-top">
                          <div className="font-clinical-data-mono text-metadata-micro font-semibold text-on-surface">
                            {patient.ipdNo}
                          </div>
                          <div className="text-metadata-micro text-on-surface-variant font-medium">
                            {patient.bed}
                          </div>
                        </td>

                        {/* Attending */}
                        <td className="py-3 px-3 align-top">
                          <div className="text-clinical-data text-on-surface">{patient.attending}</div>
                          <div className="font-metadata-micro text-metadata-micro text-outline">{patient.department}</div>
                        </td>

                        {/* Type & Clinical State */}
                        <td className="py-3 px-3 align-top">
                          <div className="inline-block px-1.5 py-0.5 rounded bg-surface-container font-clinical-data-mono text-metadata-micro text-secondary font-medium">
                            {patient.type}
                          </div>
                          <div className="text-metadata-micro text-on-surface-variant mt-0.5 line-clamp-1">
                            {patient.clinicalState}
                          </div>
                        </td>

                        {/* Barriers & Target */}
                        <td className="py-3 px-3 align-top">
                          <div
                            className={`text-metadata-micro font-medium flex items-center gap-1 ${
                              patient.barriers.includes("All Clear")
                                ? "text-primary-container font-semibold"
                                : patient.barriers.includes("Req") || patient.barriers.includes("Acc")
                                ? "text-error font-semibold"
                                : "text-secondary font-semibold"
                            }`}
                          >
                            {patient.barriers.includes("All Clear") && (
                              <span className="material-symbols-outlined text-xs">done_all</span>
                            )}
                            {patient.barriers.includes("AIIMS") && (
                              <span className="material-symbols-outlined text-xs">warning</span>
                            )}
                            {patient.barriers.includes("TPA") && (
                              <span className="material-symbols-outlined text-xs">pending</span>
                            )}
                            {patient.barriers}
                          </div>
                          <div className="font-clinical-data-mono text-metadata-micro text-outline">
                            {patient.targetTime}
                          </div>
                        </td>

                        {/* Readiness */}
                        <td className="py-3 px-3 align-top">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-metadata-micro text-metadata-micro ${patient.readinessBadgeClass}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                patient.readinessStatus === "ready"
                                  ? "bg-on-primary-container"
                                  : patient.readinessStatus === "delayed"
                                  ? "bg-secondary"
                                  : "bg-tertiary"
                              }`}
                            ></span>
                            {patient.readinessLabel}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-3 align-top text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          {patient.readinessStatus === "ready" ? (
                            <>
                              <button
                                onClick={() => {
                                  showToast(`Final exit approved for ${patient.name}. Bed vacating signal dispatched.`);
                                }}
                                className="px-2 py-1 rounded bg-primary-container hover:bg-primary text-on-primary text-metadata-micro font-body-strong transition-colors mr-1 shadow-sm"
                              >
                                Approve Exit
                              </button>
                              <button
                                onClick={() => setIsPrintSummaryOpen(true)}
                                className="px-2 py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface text-metadata-micro font-body-strong transition-colors"
                              >
                                Print
                              </button>
                            </>
                          ) : patient.readinessStatus === "delayed" ? (
                            patient.type.includes("Referral") ? (
                              <>
                                <Link
                                  href="/discharge-referrals/REF-2024-08912"
                                  className="px-2 py-1 rounded bg-secondary hover:bg-secondary/80 text-on-secondary text-metadata-micro font-body-strong transition-colors mr-1 inline-block"
                                >
                                  Track Transfer
                                </Link>
                                <button
                                  onClick={() => showToast(`Calling AIIMS Delhi Emergency Dispatch: +91 11 2659 3600...`)}
                                  className="px-2 py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface text-metadata-micro font-body-strong transition-colors"
                                >
                                  Call
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => showToast(`TPA follow-up ping sent to HDFC ERGO Desk.`)}
                                className="px-2 py-1 rounded bg-secondary hover:bg-secondary/80 text-on-secondary text-metadata-micro font-body-strong transition-colors"
                              >
                                Expedite TPA
                              </button>
                            )
                          ) : patient.readinessStatus === "in-progress" ? (
                            <button
                              onClick={() => {
                                showToast(`Clinical discharge clearance confirmed for ${patient.name}.`);
                              }}
                              className="px-2 py-1 rounded bg-primary-container hover:bg-primary text-on-primary text-metadata-micro font-body-strong transition-colors"
                            >
                              Clear Discharge
                            </button>
                          ) : (
                            <>
                              <Link
                                href={`/admissions-ipd/${patient.ipdNo}`}
                                className="inline-block px-2 py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface text-metadata-micro font-body-strong transition-colors mr-1"
                              >
                                View Plan
                              </Link>
                              <button
                                onClick={() => showToast(`Editing discharge pathway for ${patient.name}...`)}
                                className="px-2 py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface text-metadata-micro font-body-strong transition-colors"
                              >
                                Edit
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Summary / Footer Note */}
            <div className="px-space-panel-padding py-2.5 bg-surface-container-low flex items-center justify-between text-metadata-micro font-metadata-micro text-on-surface-variant border-t border-surface-container">
              <span>Showing {filteredPatients.length} of 28 Active Transitions Scheduled for Today</span>
              <div className="flex items-center gap-2">
                <span className="font-clinical-data-mono">Auto-refresh in 45s</span>
                <span className="material-symbols-outlined text-xs text-primary animate-spin">autorenew</span>
              </div>
            </div>
          </div>

          {/* Facility Bed Velocity & Transition Analytics Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            {/* Bed Turnover Pace */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <span className="font-body-strong text-clinical-data text-on-surface">
                  Bed Turnover Pace (Daily Target vs Actual)
                </span>
                <span className="px-1.5 py-0.5 rounded bg-primary-fixed text-on-primary-fixed-variant font-clinical-data-mono text-metadata-micro font-semibold">
                  91% Velocity
                </span>
              </div>
              {/* Inline Sparkline / Flow Visual */}
              <div className="my-space-sm">
                <svg className="w-full h-16 text-primary" fill="none" viewBox="0 0 300 60">
                  <path
                    d="M0 50 Q 50 45, 80 32 T 150 25 T 220 18 T 300 10"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                  ></path>
                  <path
                    d="M0 50 Q 50 45, 80 32 T 150 25 T 220 18 T 300 10 L 300 60 L 0 60 Z"
                    fill="currentColor"
                    fillOpacity="0.08"
                  ></path>
                  <circle className="fill-primary" cx="220" cy="18" r="4"></circle>
                  <circle className="fill-primary-container" cx="300" cy="10" r="4"></circle>
                </svg>
              </div>
              <div className="flex items-center justify-between text-metadata-micro font-metadata-micro text-on-surface-variant">
                <span>Morning Wave: 11 / 12 Discharged</span>
                <span className="font-semibold text-primary">Afternoon Wave: 17 Projected</span>
              </div>
            </div>

            {/* Transfer Network Coordination Status */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <span className="font-body-strong text-clinical-data text-on-surface">
                  Ambulance &amp; Inter-Hospital Channel
                </span>
                <span className="px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-clinical-data-mono text-metadata-micro font-semibold">
                  ALS Fleet (3/4 Avail)
                </span>
              </div>
              <div className="space-y-1.5 my-space-sm">
                <div className="flex items-center justify-between text-metadata-micro font-metadata-micro">
                  <span className="text-on-surface">AIIMS Delhi · Tertiary Hemodialysis</span>
                  <span className="text-error font-semibold">Awaiting Bed Ack (12 min)</span>
                </div>
                <div className="w-full bg-surface-container h-1 rounded-full overflow-hidden">
                  <div className="bg-error h-full rounded-full" style={{ width: "45%" }}></div>
                </div>
                <div className="flex items-center justify-between text-metadata-micro font-metadata-micro">
                  <span className="text-on-surface">Max Super Specialty · Step-down Rehab</span>
                  <span className="text-primary-container font-semibold">En Route (ETA 18 min)</span>
                </div>
                <div className="w-full bg-surface-container h-1 rounded-full overflow-hidden">
                  <div className="bg-primary-container h-full rounded-full" style={{ width: "80%" }}></div>
                </div>
              </div>
              <div className="flex items-center justify-between text-metadata-micro font-metadata-micro text-on-surface-variant">
                <span>Central Dispatch Control: +91 11 2692 5858</span>
                <Link
                  href="/discharge-referrals/REF-2024-08912"
                  className="text-primary font-semibold hover:underline cursor-pointer flex items-center gap-0.5"
                >
                  Live Fleet Map →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Discharge Readiness Checklist & Handoff Inspector (4 Cols on XL) */}
        <div className="xl:col-span-4 flex flex-col gap-space-md">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-panel-padding flex flex-col gap-space-md border border-outline-variant/20">
            {/* Inspector Title & Patient Anchor */}
            <div className="flex flex-col gap-space-xs pb-space-sm bg-surface-container-low -mx-space-panel-padding -mt-space-panel-padding p-space-panel-padding rounded-t-xl border-b border-surface-container">
              <div className="flex items-center justify-between">
                <span className="font-metadata-micro text-metadata-micro uppercase tracking-wider text-primary font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">checklist_rtl</span>
                  Handoff Inspector
                </span>
                <span
                  className={`px-2 py-0.5 rounded font-clinical-data-mono text-metadata-micro font-bold ${
                    clearedStepsCount === 9
                      ? "bg-primary-container text-on-primary"
                      : "bg-surface-container text-on-surface"
                  }`}
                >
                  {clearedStepsCount}/9 CLEARED
                </span>
              </div>
              <div className="flex items-start justify-between mt-1">
                <div>
                  <h2 className="font-section-title text-section-title text-on-surface leading-tight font-bold">
                    {selectedPatient.name}
                  </h2>
                  <div className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                    {selectedPatient.age}Y / {selectedPatient.gender === "M" ? "Male" : "Female"} · UHID: DEL-2023-{selectedPatient.uhid}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-body-strong text-clinical-data text-on-surface">{selectedPatient.bed}</div>
                  <div className="font-metadata-micro text-metadata-micro text-outline">{selectedPatient.ward}</div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1 text-metadata-micro font-metadata-micro text-on-surface-variant">
                <span>
                  Attending: <strong>{selectedPatient.attending}</strong> ({selectedPatient.department})
                </span>
                <span className="text-primary font-semibold truncate max-w-[140px] text-right">
                  {selectedPatient.type}
                </span>
              </div>
            </div>

            {/* 9-Point Multi-Disciplinary Checklist Flow */}
            <div className="flex flex-col gap-2.5">
              <span className="font-table-header text-table-header uppercase text-outline tracking-wider">
                Multi-Disciplinary Verification Steps
              </span>

              {/* Item 1 */}
              <div
                onClick={() => toggleChecklistStep(0)}
                className="flex items-start gap-2.5 p-2 bg-surface-container-low rounded-lg transition-colors hover:bg-surface-container cursor-pointer select-none"
              >
                <span
                  className={`material-symbols-outlined text-base shrink-0 mt-0.5 ${
                    selectedPatient.checklistState[0] ? "text-primary-container" : "text-outline"
                  }`}
                >
                  {selectedPatient.checklistState[0] ? "check_circle" : "radio_button_unchecked"}
                </span>
                <div className="flex-1">
                  <div className="font-body-strong text-metadata-micro text-on-surface">
                    1. Final Inpatient Diagnosis Documented
                  </div>
                  <div className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                    {selectedPatient.diagnosisCode}
                  </div>
                </div>
              </div>

              {/* Item 2 */}
              <div
                onClick={() => toggleChecklistStep(1)}
                className="flex items-start gap-2.5 p-2 bg-surface-container-low rounded-lg transition-colors hover:bg-surface-container cursor-pointer select-none"
              >
                <span
                  className={`material-symbols-outlined text-base shrink-0 mt-0.5 ${
                    selectedPatient.checklistState[1] ? "text-primary-container" : "text-outline"
                  }`}
                >
                  {selectedPatient.checklistState[1] ? "check_circle" : "radio_button_unchecked"}
                </span>
                <div className="flex-1">
                  <div className="font-body-strong text-metadata-micro text-on-surface">
                    2. Medication Reconciliation Completed
                  </div>
                  <div className="text-metadata-micro text-on-surface-variant">{selectedPatient.medsNote}</div>
                </div>
              </div>

              {/* Item 3 */}
              <div
                onClick={() => toggleChecklistStep(2)}
                className="flex items-start gap-2.5 p-2 bg-surface-container-low rounded-lg transition-colors hover:bg-surface-container cursor-pointer select-none"
              >
                <span
                  className={`material-symbols-outlined text-base shrink-0 mt-0.5 ${
                    selectedPatient.checklistState[2] ? "text-primary-container" : "text-outline"
                  }`}
                >
                  {selectedPatient.checklistState[2] ? "check_circle" : "radio_button_unchecked"}
                </span>
                <div className="flex-1">
                  <div className="font-body-strong text-metadata-micro text-on-surface">
                    3. Wound Inspection &amp; Dressing Verified
                  </div>
                  <div className="text-metadata-micro text-on-surface-variant">{selectedPatient.woundNote}</div>
                </div>
              </div>

              {/* Item 4 */}
              <div
                onClick={() => toggleChecklistStep(3)}
                className="flex items-start gap-2.5 p-2 bg-surface-container-low rounded-lg transition-colors hover:bg-surface-container cursor-pointer select-none"
              >
                <span
                  className={`material-symbols-outlined text-base shrink-0 mt-0.5 ${
                    selectedPatient.checklistState[3] ? "text-primary-container" : "text-outline"
                  }`}
                >
                  {selectedPatient.checklistState[3] ? "check_circle" : "radio_button_unchecked"}
                </span>
                <div className="flex-1">
                  <div className="font-body-strong text-metadata-micro text-on-surface">
                    4. Discharge Summary Digitally Signed
                  </div>
                  <div className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                    {selectedPatient.signedBy}
                  </div>
                </div>
              </div>

              {/* Item 5 */}
              <div
                onClick={() => toggleChecklistStep(4)}
                className="flex items-start gap-2.5 p-2 bg-surface-container-low rounded-lg transition-colors hover:bg-surface-container cursor-pointer select-none"
              >
                <span
                  className={`material-symbols-outlined text-base shrink-0 mt-0.5 ${
                    selectedPatient.checklistState[4] ? "text-primary-container" : "text-outline"
                  }`}
                >
                  {selectedPatient.checklistState[4] ? "check_circle" : "radio_button_unchecked"}
                </span>
                <div className="flex-1">
                  <div className="font-body-strong text-metadata-micro text-on-surface">
                    5. Discharge Counseling &amp; Diet Guidance
                  </div>
                  <div className="text-metadata-micro text-on-surface-variant">{selectedPatient.counselingNote}</div>
                </div>
              </div>

              {/* Item 6 */}
              <div
                onClick={() => toggleChecklistStep(5)}
                className="flex items-start gap-2.5 p-2 bg-surface-container-low rounded-lg transition-colors hover:bg-surface-container cursor-pointer select-none"
              >
                <span
                  className={`material-symbols-outlined text-base shrink-0 mt-0.5 ${
                    selectedPatient.checklistState[5] ? "text-primary-container" : "text-outline"
                  }`}
                >
                  {selectedPatient.checklistState[5] ? "check_circle" : "radio_button_unchecked"}
                </span>
                <div className="flex-1">
                  <div className="font-body-strong text-metadata-micro text-on-surface">
                    6. Follow-up OPD Appointment Booked
                  </div>
                  <div className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                    {selectedPatient.followUp}
                  </div>
                </div>
              </div>

              {/* Item 7 */}
              <div
                onClick={() => toggleChecklistStep(6)}
                className="flex items-start gap-2.5 p-2 bg-surface-container-low rounded-lg transition-colors hover:bg-surface-container cursor-pointer select-none"
              >
                <span
                  className={`material-symbols-outlined text-base shrink-0 mt-0.5 ${
                    selectedPatient.checklistState[6] ? "text-primary-container" : "text-outline"
                  }`}
                >
                  {selectedPatient.checklistState[6] ? "check_circle" : "radio_button_unchecked"}
                </span>
                <div className="flex-1">
                  <div className="font-body-strong text-metadata-micro text-on-surface">
                    7. Discharge Meds Dispensed by Pharmacy
                  </div>
                  <div className="text-metadata-micro text-on-surface-variant">{selectedPatient.pharmacyKit}</div>
                </div>
              </div>

              {/* Item 8 */}
              <div
                onClick={() => toggleChecklistStep(7)}
                className="flex items-start gap-2.5 p-2 bg-surface-container-low rounded-lg transition-colors hover:bg-surface-container cursor-pointer select-none"
              >
                <span
                  className={`material-symbols-outlined text-base shrink-0 mt-0.5 ${
                    selectedPatient.checklistState[7] ? "text-primary-container" : "text-outline"
                  }`}
                >
                  {selectedPatient.checklistState[7] ? "check_circle" : "radio_button_unchecked"}
                </span>
                <div className="flex-1">
                  <div className="font-body-strong text-metadata-micro text-on-surface">
                    8. Insurance TPA Settlement Cleared
                  </div>
                  <div className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                    {selectedPatient.insuranceNote}
                  </div>
                </div>
              </div>

              {/* Item 9 */}
              <div
                onClick={() => toggleChecklistStep(8)}
                className="flex items-start gap-2.5 p-2 bg-surface-container-low rounded-lg transition-colors hover:bg-surface-container cursor-pointer select-none"
              >
                <span
                  className={`material-symbols-outlined text-base shrink-0 mt-0.5 ${
                    selectedPatient.checklistState[8] ? "text-primary-container" : "text-outline"
                  }`}
                >
                  {selectedPatient.checklistState[8] ? "check_circle" : "radio_button_unchecked"}
                </span>
                <div className="flex-1">
                  <div className="font-body-strong text-metadata-micro text-on-surface">
                    9. ABHA Digital Health Record Pushed
                  </div>
                  <div className="font-clinical-data-mono text-metadata-micro text-primary font-semibold">
                    {selectedPatient.abhaSyncToken}
                  </div>
                </div>
              </div>
            </div>

            {/* Final Disposition Action Stack */}
            <div className="flex flex-col gap-2 pt-space-xs border-t border-surface-container">
              <button
                onClick={() => {
                  showToast(
                    `Final discharge approved for ${selectedPatient.name}. Bed ${selectedPatient.bed} status updated to turnover cleaning.`
                  );
                }}
                className="w-full h-10 bg-primary-container hover:bg-primary text-on-primary font-body-strong text-clinical-data rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span className="material-symbols-outlined text-base">hotel</span>
                Approve Final Discharge &amp; Vacate Bed
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setIsPrintSummaryOpen(true)}
                  className="h-8 bg-surface-container hover:bg-surface-container-high text-on-surface font-body-strong text-metadata-micro rounded-lg flex items-center justify-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">print</span>
                  Print Summary &amp; QR
                </button>
                <button
                  onClick={() => {
                    showToast(
                      `Bilingual SMS link dispatched to patient mobile (+91 98110-XXXXX) for ${selectedPatient.name}.`
                    );
                  }}
                  className="h-8 bg-surface-container hover:bg-surface-container-high text-on-surface font-body-strong text-metadata-micro rounded-lg flex items-center justify-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">sms</span>
                  SMS Patient Link
                </button>
              </div>
              <button
                onClick={() => {
                  showToast(
                    `Housekeeping team dispatched to ${selectedPatient.bed} for terminal UV disinfection.`
                  );
                }}
                className="w-full h-8 bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface font-body-strong text-metadata-micro rounded-lg flex items-center justify-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-sm text-secondary">cleaning_services</span>
                Initiate Room Cleaning Alert (Housekeeping)
              </button>
            </div>
          </div>

          {/* Quick Document Preview Chip */}
          <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm flex items-center justify-between border border-outline-variant/20">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="material-symbols-outlined text-primary text-xl shrink-0">picture_as_pdf</span>
              <div className="truncate">
                <div className="font-body-strong text-metadata-micro text-on-surface leading-tight truncate">
                  {selectedPatient.pdfFileName}
                </div>
                <div className="font-clinical-data-mono text-metadata-micro text-outline truncate">
                  {selectedPatient.pdfSize}
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsPdfViewerOpen(true)}
              className="px-2.5 py-1 rounded bg-surface-container text-on-surface text-metadata-micro font-body-strong hover:bg-surface-container-high transition-colors shrink-0"
            >
              View
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: INITIATE DISCHARGE MODAL */}
      {/* ========================================================================= */}
      {isInitiateDischargeOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-lg w-full overflow-hidden">
            <div className="px-5 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">assignment_turned_in</span>
                <h3 className="font-body-strong text-body-strong text-on-surface">Initiate Inpatient Discharge Order</h3>
              </div>
              <button
                onClick={() => setIsInitiateDischargeOpen(false)}
                className="text-outline hover:text-on-surface p-1 rounded"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4 font-clinical-data text-clinical-data">
              <div className="flex flex-col gap-1">
                <label className="text-metadata-micro font-semibold text-outline uppercase">Select Inpatient</label>
                <select
                  value={newDischargeName}
                  onChange={(e) => {
                    setNewDischargeName(e.target.value);
                    if (e.target.value === "Rahul Sharma") {
                      setNewDischargeUhid("8841");
                      setNewDischargeBed("CCU-01");
                    } else if (e.target.value === "Harish Chandra") {
                      setNewDischargeUhid("4419");
                      setNewDischargeBed("HDU-04");
                    } else {
                      setNewDischargeUhid("11904");
                      setNewDischargeBed("Bed 308-B");
                    }
                  }}
                  className="w-full h-9 px-3 bg-surface-container-low rounded border border-outline-variant text-on-surface focus:outline-none focus:border-primary"
                >
                  <option value="">-- Choose Admitted Patient --</option>
                  <option value="Priya Sundaram">Priya Sundaram (UHID: 11904 · Bed 308-B)</option>
                  <option value="Harish Chandra">Harish Chandra (UHID: 4419 · HDU-04)</option>
                  <option value="Mohammad Farooq">Mohammad Farooq (UHID: 71032 · OPD-03)</option>
                  <option value="Anita Rao">Anita Rao (UHID: 48190 · Ortho Bed 02)</option>
                  <option value="Rahul Sharma">Rahul Sharma (UHID: 8841 · CCU-01)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-metadata-micro font-semibold text-outline uppercase">Transition Pathway</label>
                  <select
                    value={newDischargeType}
                    onChange={(e) => setNewDischargeType(e.target.value)}
                    className="w-full h-9 px-3 bg-surface-container-low rounded border border-outline-variant text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="Routine Discharge Home">Routine Discharge Home</option>
                    <option value="Step-Down Skilled Nursing">Step-Down Skilled Nursing</option>
                    <option value="Home Healthcare (Apollo HomeCare)">Home Healthcare (Apollo HomeCare)</option>
                    <option value="Discharge Against Medical Advice (DAMA)">DAMA / LAMA</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-metadata-micro font-semibold text-outline uppercase">Attending Sign-off</label>
                  <select
                    value={newDischargeAttending}
                    onChange={(e) => setNewDischargeAttending(e.target.value)}
                    className="w-full h-9 px-3 bg-surface-container-low rounded border border-outline-variant text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="Dr. P. Mehta">Dr. P. Mehta (Gen Surgery)</option>
                    <option value="Dr. Rohit Verma">Dr. Rohit Verma (Cardiology)</option>
                    <option value="Dr. Sameer Kulkarni">Dr. Sameer Kulkarni (Nephrology)</option>
                    <option value="Dr. M. Chacko">Dr. M. Chacko (Pulmonology)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-primary-container/10 border border-primary-container/20 rounded-lg flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-base shrink-0 mt-0.5">info</span>
                <span className="text-metadata-micro text-on-surface-variant">
                  Initiating discharge sets the target completion timer to &lt;3 hours and triggers automatic alerts to Pharmacy, Nursing, and Cashless Insurance Desks.
                </span>
              </div>
            </div>
            <div className="px-5 py-3 bg-surface-container-low border-t border-surface-container flex items-center justify-end gap-2">
              <button
                onClick={() => setIsInitiateDischargeOpen(false)}
                className="px-4 py-1.5 text-on-surface-variant hover:text-on-surface font-body-strong text-clinical-data"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsInitiateDischargeOpen(false);
                  const uhidStr = newDischargeUhid ? ` (UHID: ${newDischargeUhid}, Bed: ${newDischargeBed})` : "";
                  showToast(
                    `Discharge order initiated for ${newDischargeName || "Selected Patient"}${uhidStr}. Pharmacy & Billing tasks alerted.`
                  );
                }}
                className="px-4 py-1.5 bg-primary-container hover:bg-primary text-on-primary font-body-strong text-clinical-data rounded-lg shadow-sm"
              >
                Initiate Pathway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: NEW EXTERNAL REFERRAL MODAL */}
      {/* ========================================================================= */}
      {isNewReferralOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-lg w-full overflow-hidden">
            <div className="px-5 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-xl">outgoing_mail</span>
                <h3 className="font-body-strong text-body-strong text-on-surface">External Facility Transfer Referral</h3>
              </div>
              <button onClick={() => setIsNewReferralOpen(false)} className="text-outline hover:text-on-surface p-1 rounded">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4 font-clinical-data text-clinical-data">
              <div className="flex flex-col gap-1">
                <label className="text-metadata-micro font-semibold text-outline uppercase">Receiving Tertiary Facility</label>
                <select
                  value={referralTargetFacility}
                  onChange={(e) => setReferralTargetFacility(e.target.value)}
                  className="w-full h-9 px-3 bg-surface-container-low rounded border border-outline-variant text-on-surface focus:outline-none focus:border-primary"
                >
                  <option value="AIIMS Delhi · Tertiary Care & Dialysis">AIIMS Delhi · Tertiary Care &amp; Dialysis</option>
                  <option value="Max Super Specialty · Step-down Cardiac Rehab">Max Super Specialty · Step-down Cardiac Rehab</option>
                  <option value="Fortis Escorts Heart Institute">Fortis Escorts Heart Institute</option>
                  <option value="Medanta The Medicity · Liver Transplant">Medanta The Medicity · Liver Transplant</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-metadata-micro font-semibold text-outline uppercase">Ambulance Fleet Category</label>
                  <select
                    value={referralAmbulanceType}
                    onChange={(e) => setReferralAmbulanceType(e.target.value)}
                    className="w-full h-9 px-3 bg-surface-container-low rounded border border-outline-variant text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="ALS (Advanced Life Support)">ALS (Advanced Life Support)</option>
                    <option value="BLS (Basic Life Support)">BLS (Basic Life Support)</option>
                    <option value="Neonatal Transport (NICU)">Neonatal Transport (NICU)</option>
                    <option value="Air Ambulance Critical Care">Air Ambulance Critical Care</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-metadata-micro font-semibold text-outline uppercase">Clinical Acuity</label>
                  <select className="w-full h-9 px-3 bg-surface-container-low rounded border border-outline-variant text-on-surface focus:outline-none focus:border-primary">
                    <option value="STAT Transfer (< 30 min)">STAT Transfer (&lt; 30 min)</option>
                    <option value="Priority (< 2 hours)">Priority (&lt; 2 hours)</option>
                    <option value="Scheduled Daytime Transfer">Scheduled Daytime Transfer</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-metadata-micro font-semibold text-outline uppercase">Reason for Inter-Hospital Transfer</label>
                <textarea
                  value={referralReason}
                  onChange={(e) => setReferralReason(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 bg-surface-container-low rounded border border-outline-variant text-on-surface focus:outline-none focus:border-primary text-clinical-data"
                  placeholder="Specify clinical indication and required subspecialty services..."
                />
              </div>

              <div className="flex items-center gap-2 p-2 bg-secondary-container/20 rounded text-metadata-micro text-on-surface-variant">
                <span className="material-symbols-outlined text-secondary text-base">local_shipping</span>
                <span>Inter-facility transfer dispatch token #IFT-2024-8819 will be attached to FHIR encounter.</span>
              </div>
            </div>
            <div className="px-5 py-3 bg-surface-container-low border-t border-surface-container flex items-center justify-end gap-2">
              <button
                onClick={() => setIsNewReferralOpen(false)}
                className="px-4 py-1.5 text-on-surface-variant hover:text-on-surface font-body-strong text-clinical-data"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsNewReferralOpen(false);
                  showToast(`External referral dispatched to ${referralTargetFacility}. Fleet unit alerted.`);
                }}
                className="px-4 py-1.5 bg-secondary hover:bg-secondary/90 text-on-secondary font-body-strong text-clinical-data rounded-lg shadow-sm"
              >
                Transmit Referral
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: BATCH ABHA PUSH MODAL */}
      {/* ========================================================================= */}
      {isBatchAbhaOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-lg w-full overflow-hidden">
            <div className="px-5 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">verified</span>
                <h3 className="font-body-strong text-body-strong text-on-surface">ABDM Digital Locker Batch Synchronization</h3>
              </div>
              <button onClick={() => setIsBatchAbhaOpen(false)} className="text-outline hover:text-on-surface p-1 rounded">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="p-5 flex flex-col gap-3 font-clinical-data text-clinical-data">
              <p className="text-on-surface-variant">
                Synchronize certified FHIR R4 Inpatient Discharge Summaries directly to patient Ayushman Bharat Health Accounts (ABHA) via the National Health Authority Gateway.
              </p>
              <div className="bg-surface-container-low rounded-lg p-3 flex flex-col gap-2 font-clinical-data-mono text-metadata-micro">
                <div className="flex items-center justify-between">
                  <span className="text-on-surface font-bold">Records in Queue:</span>
                  <span className="text-primary font-bold">5 Certified Records</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant">ABDM Consent Manager:</span>
                  <span className="text-on-surface">M1/M2/M3 Bridge Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant">Cryptographic Signatures:</span>
                  <span className="text-primary-container font-semibold">100% SHA-256 Validated</span>
                </div>
              </div>
              <div className="p-2.5 bg-primary-container/10 border border-primary/20 rounded flex items-center gap-2 text-metadata-micro text-primary">
                <span className="material-symbols-outlined text-base">cloud_sync</span>
                <span>Automatic push notifications will be dispatched to patient registered mobile numbers.</span>
              </div>
            </div>
            <div className="px-5 py-3 bg-surface-container-low border-t border-surface-container flex items-center justify-end gap-2">
              <button
                onClick={() => setIsBatchAbhaOpen(false)}
                className="px-4 py-1.5 text-on-surface-variant hover:text-on-surface font-body-strong text-clinical-data"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsBatchAbhaOpen(false);
                  showToast("Batch ABHA synchronization completed: 5 bundles queued on ABDM Bridge.");
                }}
                className="px-4 py-1.5 bg-primary text-on-primary font-body-strong text-clinical-data rounded-lg shadow-sm hover:bg-primary/90"
              >
                Execute Batch Push
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: DISCHARGE AUDIT SUMMARY MODAL */}
      {/* ========================================================================= */}
      {isAuditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-xl w-full overflow-hidden">
            <div className="px-5 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-xl">analytics</span>
                <h3 className="font-body-strong text-body-strong text-on-surface">Hospital Discharge Velocity &amp; Quality Audit</h3>
              </div>
              <button onClick={() => setIsAuditModalOpen(false)} className="text-outline hover:text-on-surface p-1 rounded">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4 font-clinical-data text-clinical-data">
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 bg-surface-container-low rounded-lg text-center">
                  <div className="font-page-title text-section-title font-bold text-primary">2h 40m</div>
                  <div className="text-metadata-micro text-on-surface-variant">Mean Discharge Time</div>
                </div>
                <div className="p-3 bg-surface-container-low rounded-lg text-center">
                  <div className="font-page-title text-section-title font-bold text-secondary">94.8%</div>
                  <div className="text-metadata-micro text-on-surface-variant">Checklist Compliance</div>
                </div>
                <div className="p-3 bg-surface-container-low rounded-lg text-center">
                  <div className="font-page-title text-section-title font-bold text-error">42 min</div>
                  <div className="text-metadata-micro text-on-surface-variant">Avg TPA Delay Lag</div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-metadata-micro font-semibold text-outline uppercase">Bottleneck Breakdown (Current Month)</span>
                <div className="flex flex-col gap-1.5 text-metadata-micro">
                  <div className="flex items-center justify-between">
                    <span>Insurance TPA Settlement Approvals</span>
                    <span className="font-bold text-on-surface">48%</span>
                  </div>
                  <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                    <div className="bg-secondary h-full rounded-full" style={{ width: "48%" }}></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Attending Physician Physical Signatures</span>
                    <span className="font-bold text-on-surface">26%</span>
                  </div>
                  <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                    <div className="bg-error h-full rounded-full" style={{ width: "26%" }}></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Inpatient Pharmacy Medication Dispensing</span>
                    <span className="font-bold text-on-surface">16%</span>
                  </div>
                  <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                    <div className="bg-tertiary h-full rounded-full" style={{ width: "16%" }}></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Patient Transportation / Ambulance Fleet</span>
                    <span className="font-bold text-on-surface">10%</span>
                  </div>
                  <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: "10%" }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-5 py-3 bg-surface-container-low border-t border-surface-container flex items-center justify-end">
              <button
                onClick={() => setIsAuditModalOpen(false)}
                className="px-4 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface font-body-strong text-clinical-data rounded-lg"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: DOCUMENT PDF VIEWER MODAL */}
      {/* ========================================================================= */}
      {isPdfViewerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-5 py-3.5 bg-surface-container-low border-b border-surface-container flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">picture_as_pdf</span>
                <div>
                  <h3 className="font-body-strong text-body-strong text-on-surface leading-tight">
                    {selectedPatient.pdfFileName}
                  </h3>
                  <span className="text-metadata-micro text-outline font-clinical-data-mono">
                    Patient: {selectedPatient.name} · UHID: {selectedPatient.uhid}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    showToast(`Downloading certified PDF for ${selectedPatient.name}...`);
                  }}
                  className="px-2.5 py-1 bg-surface-container hover:bg-surface-container-high text-on-surface rounded text-metadata-micro font-body-strong flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  Download
                </button>
                <button
                  onClick={() => setIsPdfViewerOpen(false)}
                  className="text-outline hover:text-on-surface p-1 rounded"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>
            </div>

            {/* Document Preview Canvas */}
            <div className="p-6 overflow-y-auto bg-surface font-clinical-data text-clinical-data flex flex-col gap-4">
              <div className="bg-surface-container-lowest p-6 rounded-lg border border-outline-variant/30 shadow-xs flex flex-col gap-4">
                <div className="flex items-start justify-between border-b border-surface-container pb-4">
                  <div>
                    <h2 className="font-bold text-section-title text-on-surface">APOLLO INDRAPRASTHA HOSPITAL</h2>
                    <p className="text-metadata-micro text-on-surface-variant">Sarita Vihar, New Delhi · NABH &amp; JCI Accredited</p>
                    <p className="font-semibold text-primary mt-1">OFFICIAL CLINICAL DISCHARGE CERTIFICATE</p>
                  </div>
                  <div className="text-right font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                    <div>Encounter: {selectedPatient.ipdNo}</div>
                    <div>Date: 18 Oct 2024, 14:10 IST</div>
                    <div className="text-primary font-bold">STATUS: FINAL SIGNED</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-metadata-micro bg-surface-container-low p-3 rounded">
                  <div>
                    <span className="text-outline">Patient Name:</span>
                    <div className="font-bold text-on-surface">{selectedPatient.name}</div>
                  </div>
                  <div>
                    <span className="text-outline">Age/Gender:</span>
                    <div className="font-bold text-on-surface">{selectedPatient.age}Y / {selectedPatient.gender}</div>
                  </div>
                  <div>
                    <span className="text-outline">Bed / Ward:</span>
                    <div className="font-bold text-on-surface">{selectedPatient.bed} ({selectedPatient.ward})</div>
                  </div>
                  <div>
                    <span className="text-outline">Attending Doctor:</span>
                    <div className="font-bold text-on-surface">{selectedPatient.attending}</div>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-metadata-micro font-bold text-outline uppercase">Discharge Working Diagnosis</span>
                  <div className="p-2.5 bg-surface-container-low rounded font-semibold text-on-surface">
                    {selectedPatient.diagnosisCode}
                  </div>
                  <p className="text-metadata-micro text-on-surface-variant">{selectedPatient.diagnosisText}</p>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-metadata-micro font-bold text-outline uppercase">Discharge Medications &amp; Dosage</span>
                  <div className="p-2.5 bg-surface-container-low rounded text-metadata-micro text-on-surface font-clinical-data-mono">
                    {selectedPatient.medsNote}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-metadata-micro">
                  <div className="p-2.5 bg-surface-container-low rounded">
                    <span className="text-outline font-semibold">Post-Discharge Care &amp; Wound Instructions:</span>
                    <p className="text-on-surface mt-1">{selectedPatient.woundNote}</p>
                  </div>
                  <div className="p-2.5 bg-surface-container-low rounded">
                    <span className="text-outline font-semibold">Scheduled Follow-up Clinic:</span>
                    <p className="text-on-surface mt-1 font-bold">{selectedPatient.followUp}</p>
                  </div>
                </div>

                <div className="border-t border-surface-container pt-3 flex items-center justify-between text-metadata-micro">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-base">verified</span>
                    <span>ABDM Sync: <strong>{selectedPatient.abhaSyncToken}</strong></span>
                  </div>
                  <div className="text-right font-clinical-data-mono text-outline">
                    Cryptographic Stamp: #APOLLO-DISHA-88419-MCI
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: PRINT SUMMARY & QR SHEET MODAL */}
      {/* ========================================================================= */}
      {isPrintSummaryOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-md w-full overflow-hidden text-center p-6">
            <div className="w-12 h-12 rounded-full bg-primary-container/20 text-primary flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-2xl">qr_code_2</span>
            </div>
            <h3 className="font-section-title text-section-title font-bold text-on-surface">
              Print Discharge Sheet &amp; QR
            </h3>
            <p className="text-clinical-data text-on-surface-variant mt-1">
              High-resolution QR code containing bilingual discharge summary, follow-up token, and pharmacy dispensing pass for {selectedPatient.name}.
            </p>

            <div className="my-5 p-4 bg-surface-container-low rounded-xl border border-outline-variant/30 flex flex-col items-center gap-2">
              <div className="w-32 h-32 bg-surface-container-lowest rounded-lg p-2 border border-outline-variant flex items-center justify-center">
                <span className="material-symbols-outlined text-7xl text-on-surface">qr_code</span>
              </div>
              <span className="font-clinical-data-mono text-metadata-micro text-outline">
                TOKEN: #DIS-2024-{selectedPatient.uhid}
              </span>
              <span className="text-metadata-micro text-primary font-semibold">
                Valid for Pharmacy Pickup &amp; Gate Pass Clearance
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPrintSummaryOpen(false)}
                className="flex-1 h-9 bg-surface-container hover:bg-surface-container-high text-on-surface font-body-strong text-clinical-data rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setIsPrintSummaryOpen(false);
                  if (typeof window !== "undefined") {
                    window.print();
                  }
                }}
                className="flex-1 h-9 bg-primary-container hover:bg-primary text-on-primary font-body-strong text-clinical-data rounded-lg shadow-sm"
              >
                Print to Unit #01
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 7: TRACK TRANSFER MODAL */}
      {/* ========================================================================= */}
      {isTrackTransferOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-lg w-full overflow-hidden">
            <div className="px-5 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-xl">map</span>
                <h3 className="font-body-strong text-body-strong text-on-surface">Active Ambulance Dispatch &amp; Transfer Telemetry</h3>
              </div>
              <button onClick={() => setIsTrackTransferOpen(false)} className="text-outline hover:text-on-surface p-1 rounded">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4 font-clinical-data text-clinical-data">
              <div className="p-3 bg-surface-container-low rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-body-strong text-on-surface">Ambulance Unit ALS-03 (DL-1CA-9921)</div>
                  <div className="text-metadata-micro text-outline">Driver: Vinod Kumar (+91 98110-33291) · Paramedic: J. Paul</div>
                </div>
                <span className="px-2 py-0.5 bg-primary-container text-on-primary rounded text-metadata-micro font-bold">
                  EN ROUTE
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-metadata-micro font-metadata-micro">
                  <span>Transit Route: Apollo Sarita Vihar → AIIMS Ansari Nagar</span>
                  <span className="font-bold text-primary">ETA: 18 min (8.4 km)</span>
                </div>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full animate-pulse" style={{ width: "65%" }}></div>
                </div>
              </div>

              <div className="p-3 bg-surface-container-low rounded-lg flex flex-col gap-1.5 text-metadata-micro font-clinical-data-mono">
                <div className="flex justify-between">
                  <span className="text-outline">Patient in Transport:</span>
                  <span className="text-on-surface font-bold">Harish Chandra (64M)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Telemetry Link:</span>
                  <span className="text-primary font-semibold">Mindray T1 Satellite Synced</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Receiving Point:</span>
                  <span className="text-on-surface font-semibold">AIIMS Trauma / Dialysis Emergency Gate 4</span>
                </div>
              </div>
            </div>
            <div className="px-5 py-3 bg-surface-container-low border-t border-surface-container flex items-center justify-end">
              <button
                onClick={() => setIsTrackTransferOpen(false)}
                className="px-4 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface font-body-strong text-clinical-data rounded-lg"
              >
                Close Tracking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
