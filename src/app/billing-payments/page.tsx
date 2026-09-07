/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useMemo } from "react";

interface BillingItem {
  id: string;
  name: string;
  code: string;
  amount: number;
  highlight?: boolean;
}

interface BillingEncounter {
  invoiceNo: string;
  patientName: string;
  patientInitials: string;
  age: number;
  gender: "M" | "F";
  uhid: string;
  encounterId: string;
  unitBed: string;
  unitBedBadge?: string;
  conditionSubtitle: string;
  payerName: string;
  policyNo: string;
  tpaProvider: string;
  grossEst: number;
  preAuthAmount: number;
  coPay: number;
  paid: number;
  outstanding: number;
  status: "Pre-Auth Appr." | "Fully Settled" | "Paid in Full" | "Govt Claim Q" | "Partially Paid";
  statusBadgeClass: string;
  attending: string;
  department: string;
  admitTime: string;
  protocolBanner: string;
  protocolIcon: string;
  photoUrl?: string;
  tpaCoverMarginText: string;
  items: BillingItem[];
  subTotal: number;
  buffer: number;
  preAuthRef: string;
}

const BILLING_ENCOUNTERS: BillingEncounter[] = [
  {
    invoiceNo: "INV-2024-99104",
    patientName: "Rahul Sharma",
    patientInitials: "RS",
    age: 42,
    gender: "M",
    uhid: "DEL-2024-8841",
    encounterId: "IPD-2026-00921",
    unitBed: "CCU Bed 01",
    unitBedBadge: "CCU-01",
    conditionSubtitle: "CCU Bed 01 (STEMI)",
    payerName: "ICICI Lombard TPA",
    policyNo: "POL-882190-2024",
    tpaProvider: "MediAssist India",
    grossEst: 420000,
    preAuthAmount: 450000,
    coPay: 0,
    paid: 0,
    outstanding: 420000,
    status: "Pre-Auth Appr.",
    statusBadgeClass: "bg-primary-fixed text-on-primary-fixed font-semibold",
    attending: "Dr. Rohit Verma",
    department: "Cardiology",
    admitTime: "Adm: 18 Oct 04:15 AM",
    protocolBanner: "Acute STEMI Primary PCI Protocol",
    protocolIcon: "cardiology",
    photoUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDT4R076csTdWnfvFgQmES5WNLYUtSzp-ezXeRojJJprXW1vC97JpbkNGiV3ETCYoZdxTxCsF7_Kr9NrG4qNJGNaiSUwLDFU9-cGN27tL1kkgBSWA9CJgokL3lkgrC6d77ytBLh13dC0KF7EecJ9AkVdB_QOTjdJValVorDdHSFcQI7Y8iiFSjF0lCrvfBiVETLuX2qXhy_cHpd-wuE3xzCtoBJXhC-NJz40M-tn5eDOqyLu-0q2Xt2",
    tpaCoverMarginText: "Pre-Auth covers complete PCI procedure. Margin remaining: ₹30,000.",
    subTotal: 380000,
    buffer: 40000,
    preAuthRef: "PRE-AUTH-2024-88412",
    items: [
      { id: "1", name: "Emergency Consultation & Cath Pre-Alert", code: "Stat Code 102 · ER Triaged", amount: 2500 },
      { id: "2", name: "Mindray Continuous Telemetry (Day 1)", code: "CCU Bedside 12-lead vector monitor", amount: 4000 },
      { id: "3", name: "Primary Angioplasty (PCI) + 1x DES", code: "DES Onyx Drug-Eluting Stent (IRDAI Capped Tariff)", amount: 285000, highlight: true },
      { id: "4", name: "Coronary Angiography (Fluoroscopy)", code: "Cath Lab Suite 01 / Image Intensifier", amount: 35000 },
      { id: "5", name: "STAT Cardiac Laboratory Panel", code: "hs-cTnI, Coag PT/INR, Renal, Lipids", amount: 8800 },
      { id: "6", name: "Emergency Pharmacotherapy", code: "Aspirin, Ticagrelor, Heparin, Atorvastatin", amount: 4200 },
      { id: "7", name: "CCU Room Tariff (12-Lead Monitored)", code: "Day 01 · Critical Care Level 3", amount: 12500 },
      { id: "8", name: "Consumables & Contrast (Visipaque)", code: "Iso-osmolar 100ml, Introducer Sheaths", amount: 28000 },
    ],
  },
  {
    invoiceNo: "INV-2024-99088",
    patientName: "Priya Sundaram",
    patientInitials: "PS",
    age: 38,
    gender: "F",
    uhid: "DEL-2023-11904",
    encounterId: "IPD-2026-00812",
    unitBed: "Ward 308-B",
    unitBedBadge: "W3-08B",
    conditionSubtitle: "Ward 308-B (Post-Appy)",
    payerName: "MediAssist / Max Bupa",
    policyNo: "MB-99210-A",
    tpaProvider: "MediAssist India",
    grossEst: 78400,
    preAuthAmount: 78400,
    coPay: 0,
    paid: 78400,
    outstanding: 0,
    status: "Fully Settled",
    statusBadgeClass: "bg-secondary-fixed text-on-secondary-fixed font-semibold",
    attending: "Dr. P. Mehta",
    department: "Gen Surgery",
    admitTime: "Adm: 15 Oct 11:30 AM",
    protocolBanner: "Laparoscopic Appendectomy Protocol",
    protocolIcon: "medical_services",
    tpaCoverMarginText: "100% cashless settlement finalized under GIPSA surgical tariff.",
    subTotal: 74400,
    buffer: 4000,
    preAuthRef: "PRE-AUTH-2024-77192",
    items: [
      { id: "1", name: "Laparoscopic Appendectomy Surgical Fee", code: "Major OT Suite · General Anesthesia", amount: 42000, highlight: true },
      { id: "2", name: "Surgical Consumables & Endo GIA Stapler", code: "Ethicon Endo-surgery Cart", amount: 16500 },
      { id: "3", name: "Ward Bed Charges (3 Days Semi-Private)", code: "Room Tariff 308-B @ ₹4,500/day", amount: 13500 },
      { id: "4", name: "Post-Op Antibiotics & Analgesia (IV)", code: "Cefuroxime, Metronidazole, Paracetamol", amount: 4400 },
      { id: "5", name: "Pre-Operative Ultrasound & Bloods", code: "Abdominal USG, CBC, Electrolytes", amount: 2000 },
    ],
  },
  {
    invoiceNo: "INV-2024-99120",
    patientName: "Rajesh Patel",
    patientInitials: "RP",
    age: 34,
    gender: "M",
    uhid: "DEL-2024-99214",
    encounterId: "OPD-Cardio",
    unitBed: "Consultation Rm 04",
    unitBedBadge: "OPD-04",
    conditionSubtitle: "Cardiology Follow-up",
    payerName: "Self-Pay / UPI",
    policyNo: "UPI-Ref: 88910",
    tpaProvider: "Direct Cashier Desk",
    grossEst: 1850,
    preAuthAmount: 0,
    coPay: 1850,
    paid: 1850,
    outstanding: 0,
    status: "Paid in Full",
    statusBadgeClass: "bg-surface-container text-on-surface-variant font-semibold",
    attending: "Dr. Rohit Verma",
    department: "Cardiology",
    admitTime: "Consult: Today 10:15 AM",
    protocolBanner: "Outpatient Cardiology Evaluation",
    protocolIcon: "stethoscope",
    tpaCoverMarginText: "Immediate POS settlement confirmed via UPI QR code.",
    subTotal: 1850,
    buffer: 0,
    preAuthRef: "UPI-TXN-99481029",
    items: [
      { id: "1", name: "Specialist OPD Consultation", code: "Chief Interventionalist Review", amount: 1200 },
      { id: "2", name: "12-Lead Resting ECG", code: "GE Healthcare Marquette Digital ECG", amount: 450 },
      { id: "3", name: "Random Blood Sugar POC Test", code: "Accu-Chek Inform II Bedside", amount: 200 },
    ],
  },
  {
    invoiceNo: "INV-2024-99042",
    patientName: "Harish Chandra",
    patientInitials: "HC",
    age: 64,
    gender: "M",
    uhid: "DEL-2024-4419",
    encounterId: "IPD-HDU-04",
    unitBed: "HDU Bed 04",
    unitBedBadge: "HDU-04",
    conditionSubtitle: "Transfer AIIMS",
    payerName: "CGHS Delhi Beneficiary",
    policyNo: "CGHS-DEL-0091",
    tpaProvider: "Govt CGHS Portal",
    grossEst: 142000,
    preAuthAmount: 135000,
    coPay: 7000,
    paid: 7000,
    outstanding: 135000,
    status: "Govt Claim Q",
    statusBadgeClass: "bg-secondary-container text-on-secondary-container font-semibold",
    attending: "Dr. Sameer Kulkarni",
    department: "Nephrology",
    admitTime: "Adm: 17 Oct 02:40 PM",
    protocolBanner: "Refractory Hyperkalemia & ESRD Protocol",
    protocolIcon: "vital_signs",
    tpaCoverMarginText: "CGHS empanelled rate applied. Credit letter validated for tertiary referral.",
    subTotal: 135000,
    buffer: 7000,
    preAuthRef: "CGHS-SANCTION-2024-8819",
    items: [
      { id: "1", name: "Emergency Hemodialysis Session (SLED)", code: "Fresenius 5008S Dialysis Unit", amount: 18000, highlight: true },
      { id: "2", name: "HDU Intensive Monitoring (2 Days)", code: "High Dependency Bed @ ₹18,000/day", amount: 36000 },
      { id: "3", name: "Calcium Gluconate & Insulin-Dextrose Infusions", code: "Refractory Hyperkalemia Emergency Protocol", amount: 8500 },
      { id: "4", name: "Duplex Doppler Ultrasound AV Fistula", code: "Vascular Access Patency Mapping", amount: 6500 },
      { id: "5", name: "ALS Ambulance Escort & Paramedic Transfer", code: "AIIMS Tertiary Transit Dedicated Fleet", amount: 12000 },
      { id: "6", name: "Nephrology Specialist Inpatient Rounds", code: "Twice daily critical consults", amount: 9000 },
      { id: "7", name: "Dialyzer, Lines & Bicarbonate Cartridges", code: "Single-use biocompatible high-flux kit", amount: 45000 },
    ],
  },
  {
    invoiceNo: "INV-2024-99131",
    patientName: "Mohammad Farooq",
    patientInitials: "MF",
    age: 67,
    gender: "M",
    uhid: "DEL-2024-71032",
    encounterId: "OPD Resus 03",
    unitBed: "Station 03",
    unitBedBadge: "ER-03",
    conditionSubtitle: "Pulmonology Walk-in",
    payerName: "Cash / Patient Direct",
    policyNo: "Self-Financed",
    tpaProvider: "Patient Direct",
    grossEst: 3200,
    preAuthAmount: 0,
    coPay: 3200,
    paid: 1500,
    outstanding: 1700,
    status: "Partially Paid",
    statusBadgeClass: "bg-error-container text-on-error-container font-semibold",
    attending: "Dr. M. Chacko",
    department: "Pulmonology",
    admitTime: "Arrival: Today 09:20 AM",
    protocolBanner: "COPD Acute Bronchospasm Resuscitation",
    protocolIcon: "air",
    tpaCoverMarginText: "Initial deposit ₹1,500 collected. Balance ₹1,700 due at pharmacy checkout.",
    subTotal: 3200,
    buffer: 0,
    preAuthRef: "RECEIPT-CASH-99131-A",
    items: [
      { id: "1", name: "Emergency Nebulization Suite (x3 Cycles)", code: "Duolin & Budecort continuous aerosol", amount: 1200 },
      { id: "2", name: "Blood Gas Analysis (ABG with Lactate)", code: "Radiometer ABL90 Flex", amount: 1100 },
      { id: "3", name: "Chest X-Ray Digital AP View", code: "Portable DR Unit Station 03", amount: 900 },
    ],
  },
];

export default function BillingPaymentsPage() {
  const [encounters, setEncounters] = useState<BillingEncounter[]>(BILLING_ENCOUNTERS);
  const [selectedInvoiceNo, setSelectedInvoiceNo] = useState<string>("INV-2024-99104");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [encounterFilter, setEncounterFilter] = useState<string>("All");
  const [payerFilter, setPayerFilter] = useState<string>("All");

  // Notifications Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Modals
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [isTpaPortalOpen, setIsTpaPortalOpen] = useState(false);
  const [isBatchClaimsOpen, setIsBatchClaimsOpen] = useState(false);
  const [isReconReportOpen, setIsReconReportOpen] = useState(false);
  const [isInterimBillOpen, setIsInterimBillOpen] = useState(false);
  const [isGatepassOpen, setIsGatepassOpen] = useState(false);
  const [isAddChargeOpen, setIsAddChargeOpen] = useState(false);
  const [isEnhancementOpen, setIsEnhancementOpen] = useState(false);

  // New Invoice form state
  const [newPatientName, setNewPatientName] = useState("");
  const [newUhid, setNewUhid] = useState("");
  const [newEncounterType, setNewEncounterType] = useState("IPD General");
  const [newPayer, setNewPayer] = useState("ICICI Lombard TPA");
  const [newAmount, setNewAmount] = useState("25000");

  // Add charge state
  const [chargeName, setChargeName] = useState("STAT Troponin-I POC Assay");
  const [chargeAmount, setChargeAmount] = useState("1800");

  // Selected encounter
  const selectedEncounter = useMemo(() => {
    return encounters.find((e) => e.invoiceNo === selectedInvoiceNo) || encounters[0];
  }, [encounters, selectedInvoiceNo]);

  // Filtered encounters
  const filteredEncounters = useMemo(() => {
    return encounters.filter((e) => {
      const matchSearch =
        e.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.uhid.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.encounterId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.unitBed.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.payerName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchEncounter =
        encounterFilter === "All" ||
        (encounterFilter === "IPD" && e.encounterId.includes("IPD")) ||
        (encounterFilter === "OPD" && e.encounterId.includes("OPD"));

      const matchPayer =
        payerFilter === "All" ||
        (payerFilter === "TPA" && e.payerName.includes("TPA")) ||
        (payerFilter === "Cash" && (e.payerName.includes("Cash") || e.payerName.includes("Self")));

      return matchSearch && matchEncounter && matchPayer;
    });
  }, [encounters, searchQuery, encounterFilter, payerFilter]);

  // Add charge handler
  const handleAddCharge = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(chargeAmount) || 0;
    setEncounters((prev) =>
      prev.map((enc) => {
        if (enc.invoiceNo === selectedEncounter.invoiceNo) {
          const newItem: BillingItem = {
            id: String(Date.now()),
            name: chargeName,
            code: "Ad-hoc Clinical Charge Entry",
            amount: amt,
          };
          const newItems = [...enc.items, newItem];
          const newSub = enc.subTotal + amt;
          const newGross = newSub + enc.buffer;
          const newOut = newGross - enc.paid;
          return {
            ...enc,
            items: newItems,
            subTotal: newSub,
            grossEst: newGross,
            outstanding: newOut,
          };
        }
        return enc;
      })
    );
    setIsAddChargeOpen(false);
    showToast(`Added charge "${chargeName}" (₹${amt.toLocaleString("en-IN")}) to invoice.`);
  };

  return (
    <div className="flex flex-col w-full gap-space-md">
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

      {/* Top Banner & Financial Header */}
      <div className="bg-surface-container-lowest rounded-xl p-space-panel-padding shadow-sm flex flex-col gap-space-md border border-outline-variant/20">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-base">
          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs flex-wrap">
              <span className="material-symbols-outlined text-primary text-2xl">account_balance_wallet</span>
              <h1 className="font-page-title text-page-title text-on-surface">Hospital Billing &amp; Payments</h1>
              <span className="ml-space-xs px-space-xs py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-metadata-micro text-metadata-micro font-semibold uppercase tracking-wider">
                Live Encounter Ledger
              </span>
            </div>
            <p className="font-subheading text-clinical-data text-on-surface-variant mt-0.5">
              Financial encounter management, insurance TPA pre-authorization, modular clinical billing and receipt ledger
            </p>
          </div>
          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-space-xs">
            <button
              onClick={() => setIsNewInvoiceOpen(true)}
              className="flex items-center gap-space-xs px-space-md py-1.5 bg-primary text-on-primary rounded font-body-strong text-clinical-data hover:opacity-95 shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-base">add_circle</span>
              <span>+ New Invoice</span>
            </button>
            <button
              onClick={() => setIsTpaPortalOpen(true)}
              className="flex items-center gap-space-xs px-space-md py-1.5 bg-secondary-fixed text-on-secondary-fixed font-body-strong text-clinical-data rounded hover:bg-secondary-container transition-colors"
            >
              <span className="material-symbols-outlined text-base">verified_user</span>
              <span>TPA Pre-Auth Portal</span>
            </button>
            <button
              onClick={() => setIsBatchClaimsOpen(true)}
              className="flex items-center gap-space-xs px-space-md py-1.5 bg-surface-container-high text-on-surface font-body-strong text-clinical-data rounded hover:bg-surface-container-highest transition-colors"
            >
              <span className="material-symbols-outlined text-base">send_and_archive</span>
              <span>Batch Claims Dispatch</span>
            </button>
            <button
              onClick={() => setIsReconReportOpen(true)}
              className="flex items-center gap-space-xs px-space-md py-1.5 bg-surface-container-low text-on-surface-variant font-body-strong text-clinical-data rounded hover:text-on-surface hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-base">receipt_long</span>
              <span>Reconciliation Report</span>
            </button>
          </div>
        </div>

        {/* Filters & Selectors Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-space-xs pt-space-xs bg-surface-container-low p-space-sm rounded-lg border border-surface-container">
          <div className="xl:col-span-3 flex items-center gap-space-xs bg-surface-container-lowest px-space-sm py-1.5 rounded shadow-sm border border-outline-variant/20">
            <span className="material-symbols-outlined text-primary text-base">apartment</span>
            <div className="flex flex-col min-w-0">
              <span className="font-metadata-micro text-metadata-micro text-outline uppercase font-semibold">
                Hospital Unit
              </span>
              <span className="font-clinical-data text-clinical-data text-on-surface truncate">
                Apollo Indraprastha · Central
              </span>
            </div>
          </div>
          <div className="xl:col-span-2 flex items-center gap-space-xs bg-surface-container-lowest px-space-sm py-1.5 rounded shadow-sm border border-outline-variant/20">
            <span className="material-symbols-outlined text-secondary text-base">event</span>
            <div className="flex flex-col min-w-0">
              <span className="font-metadata-micro text-metadata-micro text-outline uppercase font-semibold">
                Posting Window
              </span>
              <span className="font-clinical-data text-clinical-data text-on-surface">Today (18 Oct 2024)</span>
            </div>
          </div>
          <div className="xl:col-span-2 flex items-center gap-space-xs bg-surface-container-lowest px-space-sm py-1 rounded shadow-sm border border-outline-variant/20">
            <span className="material-symbols-outlined text-secondary text-base">emergency</span>
            <div className="flex flex-col min-w-0 w-full">
              <span className="font-metadata-micro text-metadata-micro text-outline uppercase font-semibold">
                Encounter Type
              </span>
              <select
                value={encounterFilter}
                onChange={(e) => setEncounterFilter(e.target.value)}
                className="bg-transparent font-clinical-data text-clinical-data text-on-surface focus:outline-none cursor-pointer"
              >
                <option value="All">All (OPD, IPD, ER)</option>
                <option value="IPD">Inpatient (IPD Only)</option>
                <option value="OPD">Outpatient (OPD Only)</option>
              </select>
            </div>
          </div>
          <div className="xl:col-span-2 flex items-center gap-space-xs bg-surface-container-lowest px-space-sm py-1 rounded shadow-sm border border-outline-variant/20">
            <span className="material-symbols-outlined text-primary text-base">health_and_safety</span>
            <div className="flex flex-col min-w-0 w-full">
              <span className="font-metadata-micro text-metadata-micro text-outline uppercase font-semibold">
                Payer Tier
              </span>
              <select
                value={payerFilter}
                onChange={(e) => setPayerFilter(e.target.value)}
                className="bg-transparent font-clinical-data text-clinical-data text-on-surface focus:outline-none cursor-pointer"
              >
                <option value="All">All Payers (TPA, Cash)</option>
                <option value="TPA">Insurance / TPA Only</option>
                <option value="Cash">Direct Cash / Self-Pay</option>
              </select>
            </div>
          </div>
          <div className="xl:col-span-3 flex items-center gap-space-xs bg-surface-container-lowest px-space-sm py-1 rounded shadow-sm border border-outline-variant/20">
            <span className="material-symbols-outlined text-outline text-base">search</span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent font-clinical-data text-clinical-data text-on-surface placeholder:text-outline focus:outline-none"
              placeholder="Search Patient, UHID, Invoice #, IPD #..."
              type="text"
            />
          </div>
        </div>
      </div>

      {/* Financial KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-space-xs">
        {/* KPI 1 */}
        <div className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm flex flex-col justify-between border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="font-metadata-micro text-metadata-micro text-outline uppercase font-semibold">
              Today&apos;s Collections
            </span>
            <span className="material-symbols-outlined text-primary text-sm">payments</span>
          </div>
          <div className="mt-space-xs">
            <div className="font-body-strong text-section-title text-primary tracking-tight">₹18,42,850</div>
            <div className="font-metadata-micro text-metadata-micro text-on-surface-variant truncate">
              OPD &amp; Inpatient Gross
            </div>
          </div>
        </div>
        {/* KPI 2 */}
        <div className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm flex flex-col justify-between border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="font-metadata-micro text-metadata-micro text-outline uppercase font-semibold">
              Pending Invoices
            </span>
            <span className="material-symbols-outlined text-secondary text-sm">pending_actions</span>
          </div>
          <div className="mt-space-xs">
            <div className="font-body-strong text-section-title text-on-surface">42</div>
            <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">
              24 IPD · 18 Outpatient
            </div>
          </div>
        </div>
        {/* KPI 3 */}
        <div className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm flex flex-col justify-between border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="font-metadata-micro text-metadata-micro text-outline uppercase font-semibold">
              Cashless TPA Active
            </span>
            <span className="material-symbols-outlined text-tertiary text-sm">shield</span>
          </div>
          <div className="mt-space-xs">
            <div className="font-body-strong text-section-title text-tertiary">₹34,80,000</div>
            <div className="font-metadata-micro text-metadata-micro text-on-surface-variant truncate">
              14 Claims In-Process
            </div>
          </div>
        </div>
        {/* KPI 4 */}
        <div className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm flex flex-col justify-between border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="font-metadata-micro text-metadata-micro text-outline uppercase font-semibold">
              Direct Cash Settled
            </span>
            <span className="material-symbols-outlined text-primary text-sm">price_check</span>
          </div>
          <div className="mt-space-xs">
            <div className="font-body-strong text-section-title text-on-surface">₹4,12,000</div>
            <div className="font-metadata-micro text-metadata-micro text-on-surface-variant truncate">
              UPI, POS &amp; Cash Desk
            </div>
          </div>
        </div>
        {/* KPI 5 */}
        <div className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm flex flex-col justify-between border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="font-metadata-micro text-metadata-micro text-outline uppercase font-semibold">
              Pending Pre-Auth
            </span>
            <span className="material-symbols-outlined text-on-secondary-container text-sm">schedule</span>
          </div>
          <div className="mt-space-xs">
            <div className="font-body-strong text-section-title text-on-secondary-container">08</div>
            <div className="font-metadata-micro text-metadata-micro text-on-surface-variant truncate">
              Awaiting TPA Query/Appr
            </div>
          </div>
        </div>
        {/* KPI 6 */}
        <div className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm flex flex-col justify-between border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="font-metadata-micro text-metadata-micro text-outline uppercase font-semibold">
              Denial Rate
            </span>
            <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
          </div>
          <div className="mt-space-xs">
            <div className="flex items-baseline gap-1">
              <span className="font-body-strong text-section-title text-primary">1.8%</span>
              <span className="font-metadata-micro text-metadata-micro text-primary">✓ Target &lt;3%</span>
            </div>
            <div className="font-metadata-micro text-metadata-micro text-on-surface-variant truncate">
              IRDAI Benchmarked
            </div>
          </div>
        </div>
        {/* KPI 7 */}
        <div className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm flex flex-col justify-between border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="font-metadata-micro text-metadata-micro text-outline uppercase font-semibold">
              Outstanding Balance
            </span>
            <span className="material-symbols-outlined text-error text-sm">hourglass_bottom</span>
          </div>
          <div className="mt-space-xs">
            <div className="font-body-strong text-section-title text-error">₹6,84,200</div>
            <div className="font-metadata-micro text-metadata-micro text-on-surface-variant truncate">
              Co-Pay &amp; Govt Receivables
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Clinical Billing Workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-md items-start">
        {/* LEFT 65% (Column span 8 in 12-col grid) */}
        <div className="xl:col-span-8 flex flex-col gap-space-sm">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md border border-outline-variant/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-space-sm gap-space-xs border-b border-surface-container">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-xl">receipt</span>
                <h2 className="font-section-title text-section-title text-on-surface">Financial Encounter Ledger</h2>
                <span className="px-space-xs py-0.5 rounded bg-surface-container text-on-surface-variant font-clinical-data-mono text-metadata-micro">
                  {filteredEncounters.length} Active Sessions
                </span>
              </div>
              <div className="flex items-center gap-space-xs text-metadata-micro font-metadata-micro">
                <span className="flex items-center gap-1 text-on-surface-variant">
                  <span className="w-2 h-2 rounded-full bg-primary-container"></span> Selected
                </span>
                <span className="flex items-center gap-1 text-on-surface-variant ml-2">
                  <span className="w-2 h-2 rounded-full bg-surface-container-high"></span> Cleared
                </span>
                <button
                  onClick={() => showToast("Exporting Financial Encounter Ledger to CSV...")}
                  className="ml-space-sm px-space-xs py-1 rounded bg-surface-container text-on-surface font-body-strong text-metadata-micro hover:bg-surface-container-high transition-colors"
                >
                  Export CSV
                </button>
              </div>
            </div>

            {/* Ledger Table Container */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-outline font-table-header text-table-header border-b border-surface-container">
                    <th className="py-2.5 px-space-sm">Invoice #</th>
                    <th className="py-2.5 px-space-sm">Patient &amp; UHID</th>
                    <th className="py-2.5 px-space-sm">Encounter / Unit</th>
                    <th className="py-2.5 px-space-sm">Payer &amp; Policy</th>
                    <th className="py-2.5 px-space-sm text-right">Gross Est.</th>
                    <th className="py-2.5 px-space-sm text-right">Pre-Auth / Insurer</th>
                    <th className="py-2.5 px-space-sm text-right">Patient Co-Pay</th>
                    <th className="py-2.5 px-space-sm text-right">Paid</th>
                    <th className="py-2.5 px-space-sm text-right">Outstanding</th>
                    <th className="py-2.5 px-space-sm text-center">Billing Status</th>
                    <th className="py-2.5 px-space-sm text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container text-on-surface font-clinical-data text-clinical-data">
                  {filteredEncounters.map((enc) => {
                    const isSelected = enc.invoiceNo === selectedEncounter.invoiceNo;
                    return (
                      <tr
                        key={enc.invoiceNo}
                        onClick={() => setSelectedInvoiceNo(enc.invoiceNo)}
                        className={`transition-colors cursor-pointer group ${
                          isSelected
                            ? "bg-surface-container-low ring-1 ring-inset ring-primary/30"
                            : "hover:bg-surface-container-low bg-surface-container-lowest"
                        }`}
                      >
                        <td className="py-3 px-space-sm">
                          <div className="flex items-center gap-1.5">
                            {isSelected && <span className="w-1.5 h-6 bg-primary-container rounded-full"></span>}
                            <span
                              className={`font-clinical-data-mono font-semibold ${
                                isSelected ? "text-primary" : "text-on-surface"
                              }`}
                            >
                              {enc.invoiceNo}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-space-sm">
                          <div className="flex flex-col">
                            <span className="font-body-strong text-on-surface">
                              {enc.patientName} ({enc.age}{enc.gender})
                            </span>
                            <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                              {enc.uhid}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-space-sm">
                          <div className="flex flex-col">
                            <span className="font-body-strong text-on-surface">{enc.encounterId}</span>
                            <span
                              className={`text-metadata-micro font-medium ${
                                enc.conditionSubtitle.includes("STEMI")
                                  ? "text-error"
                                  : "text-on-surface-variant"
                              }`}
                            >
                              {enc.conditionSubtitle}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-space-sm">
                          <div className="flex flex-col">
                            <span className="font-medium text-on-surface">{enc.payerName}</span>
                            <span className="font-clinical-data-mono text-metadata-micro text-outline">
                              {enc.policyNo}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-space-sm text-right font-clinical-data-mono font-semibold text-on-surface">
                          ₹{enc.grossEst.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 px-space-sm text-right font-clinical-data-mono text-primary font-semibold">
                          ₹{enc.preAuthAmount.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 px-space-sm text-right font-clinical-data-mono text-on-surface-variant">
                          ₹{enc.coPay.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 px-space-sm text-right font-clinical-data-mono font-semibold text-primary">
                          ₹{enc.paid.toLocaleString("en-IN")}
                        </td>
                        <td
                          className={`py-3 px-space-sm text-right font-clinical-data-mono font-bold ${
                            enc.outstanding > 0 ? "text-error" : "text-outline"
                          }`}
                        >
                          ₹{enc.outstanding.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 px-space-sm text-center">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full font-metadata-micro text-metadata-micro ${enc.statusBadgeClass}`}
                          >
                            {enc.status}
                          </span>
                        </td>
                        <td className="py-3 px-space-sm text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => {
                                setSelectedInvoiceNo(enc.invoiceNo);
                                setIsInterimBillOpen(true);
                              }}
                              className="p-1 rounded bg-surface-container-highest text-primary hover:bg-primary hover:text-on-primary transition-colors"
                              title="View Full Ledger"
                            >
                              <span className="material-symbols-outlined text-sm">visibility</span>
                            </button>
                            <button
                              onClick={() => {
                                setSelectedInvoiceNo(enc.invoiceNo);
                                setIsAddChargeOpen(true);
                              }}
                              className="p-1 rounded bg-surface-container-highest text-on-surface hover:bg-primary-container hover:text-on-primary transition-colors"
                              title="Add Charges"
                            >
                              <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Ledger Footer Summary */}
            <div className="mt-space-md p-space-sm bg-surface-container-low rounded-lg flex flex-col md:flex-row items-center justify-between gap-space-sm border border-surface-container">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-primary text-base">info</span>
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                  GIPSA PPEN Package Tariffs auto-reconciled under cashless corporate IRDAI guidelines.
                </span>
              </div>
              <div className="flex items-center gap-space-xs font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                <span>Showing {filteredEncounters.length} of 42 Encounters</span>
                <button className="px-2 py-1 bg-surface-container-lowest rounded shadow-sm text-on-surface hover:bg-surface-container border border-outline-variant/20">
                  Prev
                </button>
                <button className="px-2 py-1 bg-surface-container-lowest rounded shadow-sm text-on-surface hover:bg-surface-container border border-outline-variant/20">
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Financial Visual Breakdown Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-xs">
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-xs border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <span className="font-body-strong text-clinical-data text-on-surface">Payer Share Distribution</span>
                <span className="material-symbols-outlined text-outline text-base">pie_chart</span>
              </div>
              {/* SVG Bar Gauge */}
              <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden flex mt-2">
                <div className="bg-primary h-full" style={{ width: "58%" }} title="Corporate TPA 58%"></div>
                <div className="bg-tertiary h-full" style={{ width: "22%" }} title="Govt CGHS/PMJAY 22%"></div>
                <div className="bg-secondary-container h-full" style={{ width: "15%" }} title="Direct Cash 15%"></div>
                <div className="bg-error h-full" style={{ width: "5%" }} title="Unsettled Co-pay 5%"></div>
              </div>
              <div className="grid grid-cols-2 gap-1 text-metadata-micro font-metadata-micro text-on-surface-variant mt-1">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary inline-block"></span> TPA: 58%
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-tertiary inline-block"></span> CGHS: 22%
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-secondary-container inline-block"></span> Cash: 15%
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-error inline-block"></span> Unsettled: 5%
                </span>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-xs border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <span className="font-body-strong text-clinical-data text-on-surface">TPA Approval Velocity</span>
                <span className="material-symbols-outlined text-primary text-base">timer</span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-chief-complaint-mobile text-page-title text-on-surface">42 min</span>
                <span className="font-metadata-micro text-metadata-micro text-primary">↓ 14% vs avg</span>
              </div>
              <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                Average turnaround for emergency cardiac &amp; trauma pre-authorizations
              </span>
            </div>

            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-xs border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <span className="font-body-strong text-clinical-data text-on-surface">ABHA Claims Engine</span>
                <span className="material-symbols-outlined text-primary text-base">cloud_done</span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-chief-complaint-mobile text-page-title text-primary">99.4%</span>
                <span className="font-metadata-micro text-metadata-micro text-primary font-semibold">FHIR Sync</span>
              </div>
              <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                Claims digital adjudication pipeline active without manual gateway errors
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT 35% (Column span 4 in 12-col grid) */}
        <div className="xl:col-span-4 flex flex-col gap-space-sm">
          {/* Active Encounter Inspector Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/20">
            {/* Inspector Sticky-style Top Patient Header */}
            <div className="bg-surface-container p-space-panel-padding">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-space-sm">
                  {selectedEncounter.photoUrl ? (
                    <img
                      className="w-12 h-12 rounded-full object-cover shadow-sm bg-surface-container-highest ring-1 ring-primary/20"
                      alt={selectedEncounter.patientName}
                      src={selectedEncounter.photoUrl}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center text-lg shadow-sm">
                      {selectedEncounter.patientInitials}
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-section-title text-section-title text-on-surface font-bold">
                        {selectedEncounter.patientName}
                      </h3>
                      <span className="font-metadata-micro text-metadata-micro text-outline">
                        {selectedEncounter.age}{selectedEncounter.gender}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-clinical-data-mono text-metadata-micro text-primary font-semibold">
                        UHID: {selectedEncounter.uhid}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-metadata-micro text-[10px] font-bold">
                        ABHA Verified
                      </span>
                    </div>
                  </div>
                </div>
                <span className="px-2 py-1 rounded bg-error-container text-on-error-container font-metadata-micro text-metadata-micro font-bold">
                  {selectedEncounter.unitBedBadge || selectedEncounter.unitBed}
                </span>
              </div>
              <div className="mt-space-sm pt-space-xs flex items-center justify-between text-metadata-micro font-metadata-micro text-on-surface-variant">
                <span>
                  Attending: <strong className="text-on-surface font-medium">{selectedEncounter.attending}</strong> (
                  {selectedEncounter.department})
                </span>
                <span className="font-clinical-data-mono">{selectedEncounter.admitTime}</span>
              </div>
              <div className="mt-1 px-2 py-1 bg-surface-container-low rounded text-clinical-data font-body-strong text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">{selectedEncounter.protocolIcon}</span>
                <span>{selectedEncounter.protocolBanner}</span>
              </div>
            </div>

            {/* Itemized Clinical Billing Breakdown */}
            <div className="p-space-panel-padding flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-base">format_list_bulleted</span>
                  <span className="font-section-title text-subheading text-on-surface">Itemized Clinical Billing</span>
                </div>
                <span className="font-clinical-data-mono text-metadata-micro text-outline">
                  {selectedEncounter.items.length} Tariff Items
                </span>
              </div>
              {/* Items list with dense tabular spacing */}
              <div className="flex flex-col gap-1.5 font-clinical-data text-clinical-data max-h-[380px] overflow-y-auto">
                {selectedEncounter.items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-start justify-between py-1 px-space-xs rounded ${
                      item.highlight ? "bg-surface-container py-1.5" : "bg-surface-container-low"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span
                        className={`font-body-strong ${item.highlight ? "text-primary font-bold" : "text-on-surface"}`}
                      >
                        {item.name}
                      </span>
                      <span className="font-metadata-micro text-metadata-micro text-outline">{item.code}</span>
                    </div>
                    <span
                      className={`font-clinical-data-mono ${
                        item.highlight ? "font-bold text-primary" : "font-semibold text-on-surface"
                      }`}
                    >
                      ₹{item.amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              {/* Subtotal & Contingency Calculator */}
              <div className="mt-space-xs p-space-sm bg-surface-container-high rounded-lg flex flex-col gap-1 text-clinical-data font-clinical-data">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Bill Sub-Total:</span>
                  <span className="font-clinical-data-mono">₹{selectedEncounter.subTotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Estimated 24h Contingency Buffer:</span>
                  <span className="font-clinical-data-mono">₹{selectedEncounter.buffer.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between pt-1 font-body-strong text-subheading text-on-surface border-t border-outline-variant/30">
                  <span>Encounter Total (Estimated):</span>
                  <span className="font-clinical-data-mono text-primary font-bold">
                    ₹{selectedEncounter.grossEst.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* TPA Claim Card */}
              <div className="p-space-sm bg-secondary-fixed rounded-lg flex flex-col gap-space-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-on-secondary-fixed text-base">security</span>
                    <span className="font-body-strong text-clinical-data text-on-secondary-fixed">
                      TPA Claim Status Ledger
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary font-metadata-micro text-metadata-micro font-semibold">
                    100% Cashless
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-space-xs text-metadata-micro font-metadata-micro text-on-secondary-fixed-variant pt-1">
                  <div>
                    <span className="block text-outline">Insurer</span>
                    <strong className="text-on-secondary-fixed text-clinical-data">{selectedEncounter.payerName}</strong>
                  </div>
                  <div>
                    <span className="block text-outline">TPA Provider</span>
                    <strong className="text-on-secondary-fixed text-clinical-data">
                      {selectedEncounter.tpaProvider}
                    </strong>
                  </div>
                  <div>
                    <span className="block text-outline">Pre-Auth Reference</span>
                    <span className="font-clinical-data-mono font-semibold text-on-secondary-fixed">
                      {selectedEncounter.preAuthRef}
                    </span>
                  </div>
                  <div>
                    <span className="block text-outline">Authorized Amount</span>
                    <span className="font-clinical-data-mono font-bold text-primary text-clinical-data">
                      ₹{selectedEncounter.preAuthAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
                <div className="mt-1 p-space-xs bg-surface-container-lowest rounded text-metadata-micro font-metadata-micro text-on-surface flex items-center gap-1.5 border border-outline-variant/20">
                  <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                  <span>{selectedEncounter.tpaCoverMarginText}</span>
                </div>
              </div>

              {/* Action Buttons Deck */}
              <div className="grid grid-cols-2 gap-space-xs pt-space-xs">
                <button
                  onClick={() => setIsEnhancementOpen(true)}
                  className="flex items-center justify-center gap-1 px-space-sm py-2 rounded bg-surface-container text-on-surface font-body-strong text-metadata-micro hover:bg-surface-container-high transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">upgrade</span>
                  <span>Enhancement Req.</span>
                </button>
                <button
                  onClick={() => setIsInterimBillOpen(true)}
                  className="flex items-center justify-center gap-1 px-space-sm py-2 rounded bg-surface-container text-on-surface font-body-strong text-metadata-micro hover:bg-surface-container-high transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">print</span>
                  <span>Print Interim Bill</span>
                </button>
                <button
                  onClick={() => setIsAddChargeOpen(true)}
                  className="flex items-center justify-center gap-1 px-space-sm py-2 rounded bg-surface-container text-on-surface font-body-strong text-metadata-micro hover:bg-surface-container-high transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">price_change</span>
                  <span>Add Co-Pay / Adv</span>
                </button>
                <button
                  onClick={() => setIsGatepassOpen(true)}
                  className="flex items-center justify-center gap-1 px-space-sm py-2 rounded bg-primary text-on-primary font-body-strong text-metadata-micro hover:opacity-95 shadow-sm transition-all"
                >
                  <span className="material-symbols-outlined text-sm">passkey</span>
                  <span>Discharge Gatepass</span>
                </button>
              </div>
            </div>
          </div>

          {/* Financial Compliance & Audit Footer Mini-card */}
          <div className="bg-surface-container-lowest rounded-xl p-space-sm shadow-sm flex items-center justify-between border border-outline-variant/20">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-base">verified</span>
              <div className="flex flex-col">
                <span className="font-body-strong text-metadata-micro text-on-surface">IRDAI Master Circular 2024</span>
                <span className="font-metadata-micro text-metadata-micro text-outline">
                  Digital cashless discharge ready within 3 hours
                </span>
              </div>
            </div>
            <span className="font-clinical-data-mono text-metadata-micro text-primary font-bold">COMPLIANT</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: NEW INVOICE MODAL */}
      {/* ========================================================================= */}
      {isNewInvoiceOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-lg w-full overflow-hidden">
            <div className="px-5 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">add_circle</span>
                <h3 className="font-body-strong text-body-strong text-on-surface">Create New Clinical Invoice</h3>
              </div>
              <button onClick={() => setIsNewInvoiceOpen(false)} className="text-outline hover:text-on-surface p-1 rounded">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="p-5 flex flex-col gap-3 font-clinical-data text-clinical-data">
              <div className="flex flex-col gap-1">
                <label className="text-metadata-micro font-semibold text-outline uppercase">Patient Full Name</label>
                <input
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  placeholder="e.g. Vikramaditya Roy"
                  className="h-9 px-3 bg-surface-container-low rounded border border-outline-variant text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-metadata-micro font-semibold text-outline uppercase">Patient UHID</label>
                  <input
                    value={newUhid}
                    onChange={(e) => setNewUhid(e.target.value)}
                    placeholder="DEL-2024-XXXX"
                    className="h-9 px-3 bg-surface-container-low rounded border border-outline-variant text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-metadata-micro font-semibold text-outline uppercase">Encounter Unit</label>
                  <select
                    value={newEncounterType}
                    onChange={(e) => setNewEncounterType(e.target.value)}
                    className="h-9 px-3 bg-surface-container-low rounded border border-outline-variant text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="IPD General">IPD General Med-Surg</option>
                    <option value="IPD CCU">IPD Intensive Care (CCU)</option>
                    <option value="OPD Consult">OPD Speciality Consult</option>
                    <option value="Emergency Care">Emergency Resuscitation (ER)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-metadata-micro font-semibold text-outline uppercase">Primary Payer</label>
                  <select
                    value={newPayer}
                    onChange={(e) => setNewPayer(e.target.value)}
                    className="h-9 px-3 bg-surface-container-low rounded border border-outline-variant text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="ICICI Lombard TPA">ICICI Lombard TPA</option>
                    <option value="MediAssist / Max Bupa">MediAssist / Max Bupa</option>
                    <option value="Star Health Insurance">Star Health Insurance</option>
                    <option value="Direct Cashier / Self-Pay">Direct Cash / Self-Pay</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-metadata-micro font-semibold text-outline uppercase">Initial Deposit (₹)</label>
                  <input
                    type="number"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="h-9 px-3 bg-surface-container-low rounded border border-outline-variant text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>
            <div className="px-5 py-3 bg-surface-container-low border-t border-surface-container flex items-center justify-end gap-2">
              <button
                onClick={() => setIsNewInvoiceOpen(false)}
                className="px-4 py-1.5 text-on-surface-variant hover:text-on-surface font-body-strong text-clinical-data"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsNewInvoiceOpen(false);
                  showToast(`Invoice created for ${newPatientName || "New Inpatient"}. Ledger folio generated.`);
                }}
                className="px-4 py-1.5 bg-primary text-on-primary font-body-strong text-clinical-data rounded-lg shadow-sm hover:bg-primary/90"
              >
                Generate Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: TPA PRE-AUTH PORTAL MODAL */}
      {/* ========================================================================= */}
      {isTpaPortalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-xl w-full overflow-hidden">
            <div className="px-5 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-xl">verified_user</span>
                <h3 className="font-body-strong text-body-strong text-on-surface">
                  IRDAI National Health Claims Exchange (NHCX)
                </h3>
              </div>
              <button onClick={() => setIsTpaPortalOpen(false)} className="text-outline hover:text-on-surface p-1 rounded">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4 font-clinical-data text-clinical-data">
              <div className="p-3 bg-primary-container/10 border border-primary/20 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">cloud_sync</span>
                  <div>
                    <div className="font-bold text-on-surface">NHCX Cashless Gateway Online</div>
                    <div className="text-metadata-micro text-outline">Connected: ICICI Lombard, MediAssist, Star, Care</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-primary text-on-primary rounded text-metadata-micro font-bold">
                  ACTIVE
                </span>
              </div>
              <div className="flex flex-col gap-2 font-clinical-data-mono text-metadata-micro">
                <div className="flex justify-between p-2 bg-surface-container-low rounded">
                  <span className="text-on-surface font-semibold">Active Pre-Auth Query:</span>
                  <span className="text-primary font-bold">PRE-AUTH-2024-88412</span>
                </div>
                <div className="flex justify-between p-2 bg-surface-container-low rounded">
                  <span className="text-on-surface-variant">Approved Limit:</span>
                  <span className="text-primary font-bold">₹4,50,000 (0% Co-Pay)</span>
                </div>
                <div className="flex justify-between p-2 bg-surface-container-low rounded">
                  <span className="text-on-surface-variant">Enhancement Request Headroom:</span>
                  <span className="text-on-surface">Up to ₹1,50,000 for emergency complication buffer</span>
                </div>
              </div>
            </div>
            <div className="px-5 py-3 bg-surface-container-low border-t border-surface-container flex items-center justify-end gap-2">
              <button
                onClick={() => setIsTpaPortalOpen(false)}
                className="px-4 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface font-body-strong text-clinical-data rounded-lg"
              >
                Close Portal
              </button>
              <button
                onClick={() => {
                  setIsTpaPortalOpen(false);
                  showToast("Real-time TPA status synchronized with insurer server.");
                }}
                className="px-4 py-1.5 bg-primary text-on-primary font-body-strong text-clinical-data rounded-lg shadow-sm"
              >
                Sync All Claims
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: BATCH CLAIMS DISPATCH MODAL */}
      {/* ========================================================================= */}
      {isBatchClaimsOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-lg w-full overflow-hidden">
            <div className="px-5 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">send_and_archive</span>
                <h3 className="font-body-strong text-body-strong text-on-surface">Batch Claims Electronic Dispatch</h3>
              </div>
              <button onClick={() => setIsBatchClaimsOpen(false)} className="text-outline hover:text-on-surface p-1 rounded">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="p-5 flex flex-col gap-3 font-clinical-data text-clinical-data">
              <p className="text-on-surface-variant">
                14 finalized discharge dossiers ready for automated FHIR claims submission to TPA clearinghouses and government insurance schemes.
              </p>
              <div className="p-3 bg-surface-container-low rounded-lg flex flex-col gap-1.5 font-clinical-data-mono text-metadata-micro">
                <div className="flex justify-between">
                  <span className="text-outline">Total Value:</span>
                  <span className="text-on-surface font-bold">₹34,80,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Digital Signatures:</span>
                  <span className="text-primary font-semibold">14/14 Doctor Signatures Verified</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Audit Checks:</span>
                  <span className="text-primary font-semibold">ICD-10 &amp; CPT Coding Complete</span>
                </div>
              </div>
            </div>
            <div className="px-5 py-3 bg-surface-container-low border-t border-surface-container flex items-center justify-end gap-2">
              <button
                onClick={() => setIsBatchClaimsOpen(false)}
                className="px-4 py-1.5 text-on-surface-variant hover:text-on-surface font-body-strong text-clinical-data"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsBatchClaimsOpen(false);
                  showToast("14 Claims dispatched via NHCX gateway. Acknowledgment tokens received.");
                }}
                className="px-4 py-1.5 bg-primary text-on-primary font-body-strong text-clinical-data rounded-lg shadow-sm hover:bg-primary/90"
              >
                Dispatch 14 Claims
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: RECONCILIATION REPORT MODAL */}
      {/* ========================================================================= */}
      {isReconReportOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-xl w-full overflow-hidden">
            <div className="px-5 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">receipt_long</span>
                <h3 className="font-body-strong text-body-strong text-on-surface">Daily Financial Reconciliation</h3>
              </div>
              <button onClick={() => setIsReconReportOpen(false)} className="text-outline hover:text-on-surface p-1 rounded">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4 font-clinical-data text-clinical-data">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 bg-surface-container-low rounded-lg">
                  <div className="font-bold text-primary text-section-title">₹18.42 L</div>
                  <div className="text-metadata-micro text-outline">Gross Billed</div>
                </div>
                <div className="p-3 bg-surface-container-low rounded-lg">
                  <div className="font-bold text-on-surface text-section-title">₹4.12 L</div>
                  <div className="text-metadata-micro text-outline">Cash &amp; POS</div>
                </div>
                <div className="p-3 bg-surface-container-low rounded-lg">
                  <div className="font-bold text-secondary text-section-title">₹14.30 L</div>
                  <div className="text-metadata-micro text-outline">TPA Electronic</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-primary-container/10 border border-primary/20 rounded text-metadata-micro text-primary">
                <span className="material-symbols-outlined text-base">verified</span>
                <span>Day-end bank batch settlement matched with ERP ledger (Variance: ₹0.00).</span>
              </div>
            </div>
            <div className="px-5 py-3 bg-surface-container-low border-t border-surface-container flex items-center justify-end">
              <button
                onClick={() => setIsReconReportOpen(false)}
                className="px-4 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface font-body-strong text-clinical-data rounded-lg"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: PRINT INTERIM BILL MODAL */}
      {/* ========================================================================= */}
      {isInterimBillOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            <div className="px-5 py-3.5 bg-surface-container-low border-b border-surface-container flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">print</span>
                <h3 className="font-body-strong text-body-strong text-on-surface">
                  Interim Bill: {selectedEncounter.invoiceNo}
                </h3>
              </div>
              <button onClick={() => setIsInterimBillOpen(false)} className="text-outline hover:text-on-surface p-1 rounded">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="p-6 overflow-y-auto bg-surface font-clinical-data text-clinical-data flex flex-col gap-4">
              <div className="bg-surface-container-lowest p-6 rounded-lg border border-outline-variant/30 shadow-xs flex flex-col gap-4">
                <div className="flex items-start justify-between border-b border-surface-container pb-3">
                  <div>
                    <h2 className="font-bold text-section-title text-on-surface">APOLLO HOSPITALS INDRAPRASTHA</h2>
                    <p className="text-metadata-micro text-outline">Central Campus · Sarita Vihar, New Delhi - 110076</p>
                    <p className="font-semibold text-primary mt-1">INTERIM CLINICAL FINANCIAL STATEMENT</p>
                  </div>
                  <div className="text-right font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                    <div>Invoice: {selectedEncounter.invoiceNo}</div>
                    <div>Date: 18 Oct 2024, 14:40 IST</div>
                    <div>UHID: {selectedEncounter.uhid}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-metadata-micro bg-surface-container-low p-3 rounded">
                  <div>
                    <span className="text-outline">Patient:</span> <strong>{selectedEncounter.patientName}</strong> (
                    {selectedEncounter.age}Y/{selectedEncounter.gender})
                  </div>
                  <div>
                    <span className="text-outline">Unit/Bed:</span> <strong>{selectedEncounter.unitBed}</strong>
                  </div>
                  <div>
                    <span className="text-outline">Attending:</span> <strong>{selectedEncounter.attending}</strong>
                  </div>
                  <div>
                    <span className="text-outline">Insurance:</span> <strong>{selectedEncounter.payerName}</strong>
                  </div>
                </div>

                <table className="w-full text-left text-metadata-micro border-collapse">
                  <thead>
                    <tr className="border-b border-surface-container font-semibold text-outline">
                      <th className="py-2">Item Description</th>
                      <th className="py-2 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container">
                    {selectedEncounter.items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-2">
                          <div className="font-medium text-on-surface">{item.name}</div>
                          <div className="text-outline text-[10px]">{item.code}</div>
                        </td>
                        <td className="py-2 text-right font-clinical-data-mono font-semibold">
                          ₹{item.amount.toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="border-t border-surface-container pt-3 flex justify-between font-bold text-clinical-data">
                  <span>Grand Total Estimated:</span>
                  <span className="font-clinical-data-mono text-primary text-section-title">
                    ₹{selectedEncounter.grossEst.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
            <div className="px-5 py-3 bg-surface-container-low border-t border-surface-container flex items-center justify-end gap-2">
              <button
                onClick={() => setIsInterimBillOpen(false)}
                className="px-4 py-1.5 text-on-surface-variant hover:text-on-surface font-body-strong text-clinical-data"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setIsInterimBillOpen(false);
                  if (typeof window !== "undefined") {
                    window.print();
                  }
                }}
                className="px-4 py-1.5 bg-primary text-on-primary font-body-strong text-clinical-data rounded-lg shadow-sm hover:bg-primary/90"
              >
                Print Statement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: DISCHARGE GATEPASS MODAL */}
      {/* ========================================================================= */}
      {isGatepassOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-md w-full overflow-hidden text-center p-6">
            <div className="w-12 h-12 rounded-full bg-primary-container/20 text-primary flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-2xl">passkey</span>
            </div>
            <h3 className="font-section-title text-section-title font-bold text-on-surface">Hospital Discharge Gatepass</h3>
            <p className="text-clinical-data text-on-surface-variant mt-1">
              Financial clearance &amp; security gatepass issued for {selectedEncounter.patientName}.
            </p>
            <div className="my-5 p-4 bg-surface-container-low rounded-xl border border-outline-variant/30 flex flex-col items-center gap-2">
              <div className="w-28 h-28 bg-surface-container-lowest rounded-lg p-2 border border-outline-variant flex items-center justify-center">
                <span className="material-symbols-outlined text-6xl text-on-surface">qr_code</span>
              </div>
              <span className="font-clinical-data-mono text-metadata-micro text-outline">
                PASS: #{selectedEncounter.invoiceNo}-GATE-CLEAR
              </span>
              <span className="text-metadata-micro text-primary font-bold">100% FINANCIAL SETTLEMENT VERIFIED</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsGatepassOpen(false)}
                className="flex-1 h-9 bg-surface-container hover:bg-surface-container-high text-on-surface font-body-strong text-clinical-data rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setIsGatepassOpen(false);
                  if (typeof window !== "undefined") {
                    window.print();
                  }
                }}
                className="flex-1 h-9 bg-primary text-on-primary font-body-strong text-clinical-data rounded-lg shadow-sm hover:bg-primary/90"
              >
                Print Gatepass
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 7: ADD CHARGES MODAL */}
      {/* ========================================================================= */}
      {isAddChargeOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-md w-full overflow-hidden">
            <div className="px-5 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">add_shopping_cart</span>
                <h3 className="font-body-strong text-body-strong text-on-surface">Add Clinical Tariff Charge</h3>
              </div>
              <button onClick={() => setIsAddChargeOpen(false)} className="text-outline hover:text-on-surface p-1 rounded">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <form onSubmit={handleAddCharge} className="p-5 flex flex-col gap-3 font-clinical-data text-clinical-data">
              <div className="flex flex-col gap-1">
                <label className="text-metadata-micro font-semibold text-outline uppercase">Service / Procedure Name</label>
                <input
                  value={chargeName}
                  onChange={(e) => setChargeName(e.target.value)}
                  className="h-9 px-3 bg-surface-container-low rounded border border-outline-variant text-on-surface focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-metadata-micro font-semibold text-outline uppercase">Rate Tariff (₹)</label>
                <input
                  type="number"
                  value={chargeAmount}
                  onChange={(e) => setChargeAmount(e.target.value)}
                  className="h-9 px-3 bg-surface-container-low rounded border border-outline-variant text-on-surface focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div className="p-2 bg-surface-container-low rounded text-metadata-micro text-on-surface-variant">
                Applying charge to invoice: <strong>{selectedEncounter.invoiceNo}</strong> ({selectedEncounter.patientName}).
              </div>
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddChargeOpen(false)}
                  className="px-4 py-1.5 text-on-surface-variant hover:text-on-surface font-body-strong"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-primary text-on-primary font-body-strong rounded-lg shadow-sm hover:bg-primary/90"
                >
                  Post to Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 8: ENHANCEMENT REQUEST MODAL */}
      {/* ========================================================================= */}
      {isEnhancementOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 max-w-md w-full overflow-hidden">
            <div className="px-5 py-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-xl">upgrade</span>
                <h3 className="font-body-strong text-body-strong text-on-surface">TPA Pre-Auth Enhancement Request</h3>
              </div>
              <button onClick={() => setIsEnhancementOpen(false)} className="text-outline hover:text-on-surface p-1 rounded">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="p-5 flex flex-col gap-3 font-clinical-data text-clinical-data">
              <p className="text-on-surface-variant">
                Request an upward financial cap revision for {selectedEncounter.patientName} from {selectedEncounter.payerName}.
              </p>
              <div className="p-3 bg-surface-container-low rounded-lg flex flex-col gap-1 text-metadata-micro font-clinical-data-mono">
                <div className="flex justify-between">
                  <span className="text-outline">Current Cap:</span>
                  <span className="font-bold text-on-surface">₹{selectedEncounter.preAuthAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Requested Enhancement:</span>
                  <span className="font-bold text-primary">+ ₹1,00,000 (New Cap: ₹5,50,000)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Clinical Rationale:</span>
                  <span className="text-on-surface">Additional stent deployment &amp; prolonged CCU stay</span>
                </div>
              </div>
            </div>
            <div className="px-5 py-3 bg-surface-container-low border-t border-surface-container flex items-center justify-end gap-2">
              <button
                onClick={() => setIsEnhancementOpen(false)}
                className="px-4 py-1.5 text-on-surface-variant hover:text-on-surface font-body-strong text-clinical-data"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsEnhancementOpen(false);
                  showToast("Enhancement request #ENH-2024-88 transmitted to ICICI Lombard portal.");
                }}
                className="px-4 py-1.5 bg-secondary text-on-secondary font-body-strong text-clinical-data rounded-lg shadow-sm"
              >
                Transmit to Insurer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
