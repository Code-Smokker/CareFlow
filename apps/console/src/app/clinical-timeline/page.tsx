/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";

interface ParameterDetail {
  id: string;
  name: string;
  subname: string;
  value: string;
  secondaryValue?: string;
  unit: string;
  status: string;
  statusColor: "error" | "secondary" | "primary" | "on-surface";
  measuredTime: string;
  deviceSource: string;
  deviceSerial: string;
  operator: string;
  technique: string;
  fhirResource: string;
  clinicalNote: string;
  shaHash: string;
}

const PARAMETER_DETAILS: Record<string, ParameterDetail> = {
  sbp: {
    id: "sbp",
    name: "Systolic Blood Pressure & Hemodynamics",
    subname: "Systolic BP (SBP)",
    value: "148",
    secondaryValue: "/ 92",
    unit: "mmHg",
    status: "Stage 2 HTN Emergency Urgency",
    statusColor: "error",
    measuredTime: "14:21:08 IST Today STAT",
    deviceSource: "Mindray BeneVision N12",
    deviceSerial: "#MN-99201-DL-IND (Port 3)",
    operator: "Sr. Ancy Thomas, RN (#4419)",
    technique: "Adult Std (25-35cm) Right Arm",
    fhirResource: "Observation/obs-99812-bp",
    clinicalNote:
      "Secondary acute sympathetic hypertensive surge paired with tachycardia in setting of anterior myocardial injury. Post-sublingual Nitroglycerin response noted with SBP declining from 152 → 148 mmHg. Perfusion adequate (MAP 110.6, Shock Index 0.70).",
    shaHash: "sha256:4a0c8b21...d8e34f",
  },
  dbp: {
    id: "dbp",
    name: "Diastolic Blood Pressure",
    subname: "Diastolic BP (DBP)",
    value: "92",
    unit: "mmHg",
    status: "Elevated Diastolic Afterload",
    statusColor: "error",
    measuredTime: "14:21:08 IST Today STAT",
    deviceSource: "Mindray BeneVision N12",
    deviceSerial: "#MN-99201-DL-IND (Port 3)",
    operator: "Sr. Ancy Thomas, RN (#4419)",
    technique: "Adult Std (25-35cm) Right Arm",
    fhirResource: "Observation/obs-99812-dbp",
    clinicalNote:
      "Increased systemic vascular resistance (SVR) driven by intense sympathetic tone. Diastolic pressure maintained above critical coronary perfusion threshold (>60 mmHg).",
    shaHash: "sha256:7c9e2b14...a1f092",
  },
  map: {
    id: "map",
    name: "Mean Arterial Pressure (MAP)",
    subname: "Mean Arterial (MAP)",
    value: "110.6",
    unit: "mmHg",
    status: "Hyperdynamic Organ Perfusion",
    statusColor: "on-surface",
    measuredTime: "14:21:08 IST Calculated",
    deviceSource: "Mindray Automated Algorithmic Engine",
    deviceSerial: "Auto-derived [DBP + 1/3(PP)]",
    operator: "Automated Telemetry Engine",
    technique: "Mathematical Integration",
    fhirResource: "Observation/obs-99813-map",
    clinicalNote:
      "Calculated MAP of 110.6 mmHg indicates robust vital organ perfusion pressure despite acute LAD coronary occlusion. No evidence of impending cardiogenic shock at current timestamp.",
    shaHash: "sha256:3d1f882a...cc7810",
  },
  hr: {
    id: "hr",
    name: "Heart Rate & Cardiac Chronotropy",
    subname: "Heart Rate / Pulse",
    value: "104",
    unit: "bpm",
    status: "Sinus Tachycardia (Adrenergic)",
    statusColor: "secondary",
    measuredTime: "14:21:05 IST Today STAT",
    deviceSource: "Mindray N12 Continuous 5-Lead ECG",
    deviceSerial: "#MN-99201-DL-IND (Lead II/V3)",
    operator: "Sr. Ancy Thomas, RN (#4419)",
    technique: "Continuous Vector Cardiography",
    fhirResource: "Observation/obs-99814-hr",
    clinicalNote:
      "Sinus tachycardia rate 104 bpm reflecting compensatory adrenergic discharge and ischemic pain stress. Beta-blocker administration held pending primary percutaneous intervention and hemodynamic monitoring in Cath Lab.",
    shaHash: "sha256:8f2a11...4b3912",
  },
  spo2: {
    id: "spo2",
    name: "Pulse Oximetry & Oxygenation",
    subname: "SpO2 Oxygen Sat",
    value: "98%",
    unit: "on 2L NC",
    status: "Adequately Re-oxygenated",
    statusColor: "primary",
    measuredTime: "14:21:02 IST Today STAT",
    deviceSource: "Masimo SET Bedside Pulse Oximeter",
    deviceSerial: "POCT-SPO2-8812 (Right Index)",
    operator: "Sr. Ancy Thomas, RN (#4419)",
    technique: "Dual-Wavelength Plethysmography (PI 4.8)",
    fhirResource: "Observation/obs-99815-spo2",
    clinicalNote:
      "Triage room-air desaturation (93%) rapidly corrected upon initiating 2L/min nasal cannula supplemental oxygen. Current saturation 98% with stable pulse waveform morphology.",
    shaHash: "sha256:2d991b...99ca01",
  },
  rr: {
    id: "rr",
    name: "Respiratory Rate & Ventilation",
    subname: "Respiratory Rate",
    value: "20",
    unit: "/min",
    status: "Eupneic, Symmetrical",
    statusColor: "on-surface",
    measuredTime: "14:21:05 IST Today STAT",
    deviceSource: "Mindray Thoracic Impedance",
    deviceSerial: "#MN-99201-DL-IND (Lead I/II)",
    operator: "Automated Transthoracic Sensor",
    technique: "Transthoracic Bio-impedance",
    fhirResource: "Observation/obs-99816-rr",
    clinicalNote:
      "Respiratory rate normalized from triage peak of 24/min down to 20/min post-analgesia and supplemental oxygen. No paradoxical abdominal movement or accessory muscle use noted.",
    shaHash: "sha256:5e4a77...31bc99",
  },
  temp: {
    id: "temp",
    name: "Core Body Temperature",
    subname: "Body Temperature",
    value: "98.6°F",
    secondaryValue: "(37.0°C)",
    unit: "Tympanic IR",
    status: "Normothermic Baseline",
    statusColor: "primary",
    measuredTime: "14:20:45 IST Today",
    deviceSource: "Welch Allyn Braun ThermoScan PRO 6000",
    deviceSerial: "#WA-TMP-4019",
    operator: "Sr. Ancy Thomas, RN (#4419)",
    technique: "Right Tympanic Membrane Infrared",
    fhirResource: "Observation/obs-99817-temp",
    clinicalNote:
      "Normothermic core reading confirms absence of pyrexia or systemic septic trigger. Temperature target maintained prior to catheterization laboratory transfer.",
    shaHash: "sha256:1a8b99...ee4102",
  },
  bgl: {
    id: "bgl",
    name: "Capillary Blood Glucose (POCT)",
    subname: "Blood Glucose Bedside",
    value: "118",
    unit: "mg/dL",
    status: "Euglycemic Target Range",
    statusColor: "primary",
    measuredTime: "14:18:22 IST Today",
    deviceSource: "Roche Accu-Chek Inform II Bedside",
    deviceSerial: "#ROCHE-POCT-0881",
    operator: "Sr. Ancy Thomas, RN (#4419)",
    technique: "Capillary Lateral Fingerstick",
    fhirResource: "Observation/obs-99818-glucose",
    clinicalNote:
      "Bedside glucose 118 mg/dL confirms absence of acute hypo- or severe hyperglycemia. Patient has known type 2 diabetes managed on Metformin (held today for radiocontrast precaution).",
    shaHash: "sha256:9b2c33...77ff44",
  },
  pain: {
    id: "pain",
    name: "Numerical Rating Scale (NRS) Pain",
    subname: "NRS Pain Score (0-10)",
    value: "6 / 10",
    unit: "Substernal",
    status: "Partial Relief Post-NTG (Was 9/10)",
    statusColor: "error",
    measuredTime: "14:20:10 IST Today STAT",
    deviceSource: "Standardized Patient Self-Report",
    deviceSerial: "Validated NRS 11-Point Scale",
    operator: "Sr. Ancy Thomas, RN (#4419)",
    technique: "Verbal Bedside Inquiry",
    fhirResource: "Observation/obs-99819-pain",
    clinicalNote:
      "Retrosternal crushing chest pain with radiation into left mandible and arm. Decreased from initial peak 9/10 to 6/10 following chewable aspirin 300mg and sublingual nitroglycerin 0.4mg spray.",
    shaHash: "sha256:44aa11...88ee22",
  },
  si: {
    id: "si",
    name: "Shock Index (Heart Rate / SBP)",
    subname: "Shock Index",
    value: "0.70",
    unit: "HR / SBP Ratio",
    status: "Compensated Normoperfusion (<0.90)",
    statusColor: "primary",
    measuredTime: "14:21:08 IST Calculated",
    deviceSource: "Automated Early Warning Engine",
    deviceSerial: "Mathematical Ratio (104 / 148)",
    operator: "Automated Clinical Decision Support",
    technique: "Real-time Hemodynamic Ratio",
    fhirResource: "Observation/obs-99820-shock-index",
    clinicalNote:
      "Shock index 0.70 is well below the 0.90 threshold for occult hypoperfusion. SBP remains appropriately elevated to maintain cardiac output against tachycardia.",
    shaHash: "sha256:77bb22...99ff33",
  },
  news2: {
    id: "news2",
    name: "NEWS2 National Early Warning Score",
    subname: "NEWS2 Acute Score",
    value: "Score: 7",
    unit: "Aggregate",
    status: "CRITICAL TRIGGER · Urgent MD Review",
    statusColor: "error",
    measuredTime: "14:21:10 IST Today STAT",
    deviceSource: "Royal College of Physicians NEWS2 Standard",
    deviceSerial: "EHR Clinical Risk Calculator v2.4",
    operator: "Sr. Ancy Thomas, RN (#4419)",
    technique: "Composite Multi-parameter Score",
    fhirResource: "Observation/obs-99821-news2",
    clinicalNote:
      "Aggregate NEWS2 score of 7 meets high-risk critical threshold triggering mandatory continuous telemetry, senior registrar bedside attendance (Dr. R. Verma), and priority Cath Lab activation.",
    shaHash: "sha256:11ee33...55aa88",
  },
};

export default function ClinicalTimelinePage() {
  const [selectedParamId, setSelectedParamId] = useState<string>("sbp");
  const [activeTimeframe, setActiveTimeframe] = useState<string>("Today (STAT High-Freq)");

  // Modals
  const [isVitalsModalOpen, setIsVitalsModalOpen] = useState(false);
  const [isTelemetryModalOpen, setIsTelemetryModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isRhythmModalOpen, setIsRhythmModalOpen] = useState(false);
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);
  const [isRnNoteModalOpen, setIsRnNoteModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states for Record Bedside Vitals
  const [formSbp, setFormSbp] = useState("148");
  const [formDbp, setFormDbp] = useState("92");
  const [formHr, setFormHr] = useState("104");
  const [formSpo2, setFormSpo2] = useState("98");
  const [formO2Device, setFormO2Device] = useState("2L NC O2");
  const [formRr, setFormRr] = useState("20");
  const [formTemp, setFormTemp] = useState("98.6");
  const [formPain, setFormPain] = useState("6 - Severe Pain (Decreased from 9)");
  const [formNursePin, setFormNursePin] = useState("");

  // RN Note modal state
  const [rnNoteText, setRnNoteText] = useState(
    "Patient administered IV Ondansetron 4mg for nausea. Repeated ECG leads V2-V4 verify persisting ST elevation +3.2mm. Cath lab transport team standing by at Bed ER-02."
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleVitalsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVitalsModalOpen(false);
    showToast(
      `Bedside observation (${formSbp}/${formDbp} mmHg, HR ${formHr}, SpO2 ${formSpo2}%) charted & broadcasted to FHIR R4 repository.`
    );
  };

  const currentParam = PARAMETER_DETAILS[selectedParamId] || PARAMETER_DETAILS["sbp"];

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

      {/* Persistent Patient Clinical Context Header */}
      <section className="bg-surface-container-lowest rounded-xl shadow-sm p-space-panel-padding mb-space-base flex flex-col gap-space-sm">
        {/* Top Row: Identification, Bed, Attending & Urgent Actions */}
        <div className="flex flex-wrap items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md min-w-0">
            <div className="relative">
              <img
                className="w-12 h-12 rounded-full object-cover shadow-sm ring-2 ring-error"
                alt="Rahul Sharma"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgSrlGY1wGLzT-e4Cj7s_fyVaz9OwDsCnQnw6RfdMbWk-VNRfHxlZxAelnDA5g_STkURffj0bxEdONH6-97EpFGkb4fQHUY32816MUObiBoEhC8LTMRzBxd1fZtS4Z50SVAXjIw3aXk7lA3n0igocjE1OEe96mOS-bdHsIpDmm27SPjhFN_864ccXbgiLcz3t0wU46rcfkL12xrCgr7VIsdlLv3d926ZYTN8vYBXGwMDyVyxtkpB23"
              />
              <span
                className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-error rounded-full ring-2 ring-surface-container-lowest"
                title="Critical Status"
              ></span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-space-xs flex-wrap">
                <h1 className="font-page-title text-page-title text-on-surface tracking-tight truncate">
                  Rahul Sharma
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-metadata-micro text-metadata-micro font-semibold">
                  42Y / M
                </span>
                <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-clinical-data-mono text-metadata-micro font-bold">
                  Token #104
                </span>
                <span className="px-2 py-0.5 rounded-full bg-primary-container/15 text-primary font-clinical-data-mono text-metadata-micro font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">verified_user</span> ABHA
                  91-8842-1920-4491
                </span>
              </div>
              <div className="flex items-center gap-space-md text-on-surface-variant font-metadata-micro text-metadata-micro mt-0.5 flex-wrap">
                <span className="font-clinical-data-mono">UHID: DEL-2024-8841</span>
                <span>•</span>
                <span className="flex items-center gap-1 font-body-strong text-primary">
                  <span className="material-symbols-outlined text-xs">meeting_room</span> Bed:
                  ER-02 (Resus Bay)
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">stethoscope</span> Attending:
                  Dr. Rohit Verma (Interventional Cardiology)
                </span>
                <span>•</span>
                <span className="text-on-surface-variant/80 font-clinical-data-mono">
                  Encounter: ENC-DEL-2026-90214
                </span>
              </div>
            </div>
          </div>
          {/* Header Primary Clinical CTAs */}
          <div className="flex items-center gap-space-xs flex-wrap">
            <button
              onClick={() => setIsVitalsModalOpen(true)}
              className="bg-primary hover:bg-primary-container text-on-primary px-3 py-1.5 rounded-lg font-body-strong text-clinical-data flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              id="btnOpenRecordVitals"
            >
              <span className="material-symbols-outlined text-base">add_circle</span> Record Bedside
              Vitals
            </button>
            <button
              onClick={() => setIsTelemetryModalOpen(true)}
              className="bg-surface-container hover:bg-surface-container-high text-on-surface px-3 py-1.5 rounded-lg font-body-strong text-clinical-data flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base text-primary">sync</span> Import
              Mindray Telemetry
            </button>
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface px-2.5 py-1.5 rounded-lg font-body-default text-clinical-data flex items-center gap-1 transition-all cursor-pointer"
              title="Compare against previous encounters"
            >
              <span className="material-symbols-outlined text-base">compare_arrows</span> Compare
            </button>
            <button
              onClick={() => setIsPdfModalOpen(true)}
              className="bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface px-2.5 py-1.5 rounded-lg font-body-default text-clinical-data flex items-center gap-1 transition-all cursor-pointer"
              title="Export Certified Medical Record PDF"
            >
              <span className="material-symbols-outlined text-base">picture_as_pdf</span> PDF
            </button>
            <button
              onClick={() => setIsRhythmModalOpen(true)}
              className="bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface px-2.5 py-1.5 rounded-lg font-body-default text-clinical-data flex items-center gap-1 transition-all cursor-pointer"
              title="Print Bedside Lead II Rhythm Strip"
            >
              <span className="material-symbols-outlined text-base">print</span> Rhythm Strip
            </button>
          </div>
        </div>
        {/* Red Flag Strip: STEMI Alert */}
        <div className="w-full bg-error-container text-on-error-container px-space-md py-2 rounded-lg flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-space-sm min-w-0">
            <span className="material-symbols-outlined text-error text-xl animate-pulse shrink-0">
              emergency
            </span>
            <div className="flex items-center gap-space-xs flex-wrap min-w-0">
              <span className="font-body-strong text-clinical-data tracking-wide uppercase text-error">
                RED FLAG ALERT:
              </span>
              <span className="font-body-strong text-clinical-data text-on-error-container truncate">
                SUSPECTED ACUTE ANTERIOR STEMI — IMMEDIATE CATH LAB INTERVENTION PROTOCOL ACTIVE
              </span>
            </div>
          </div>
          <div className="flex items-center gap-space-xs shrink-0 pl-space-sm">
            <span className="bg-error text-on-error font-clinical-data-mono text-metadata-micro px-2 py-0.5 rounded uppercase font-bold tracking-wide">
              P1 STAT
            </span>
            <span className="text-error font-clinical-data-mono text-metadata-micro font-semibold">
              Cath Lab Bay 01 Ready
            </span>
          </div>
        </div>
        {/* Allergy & Intolerance Banner */}
        <div className="flex items-center justify-between px-space-md py-1.5 bg-surface-container-low rounded-lg text-metadata-micro font-metadata-micro text-on-surface-variant">
          <div className="flex items-center gap-space-sm flex-wrap">
            <span className="font-body-strong text-on-surface uppercase flex items-center gap-1">
              <span className="material-symbols-outlined text-error text-sm">warning</span> Known
              Allergies:
            </span>
            <span className="bg-error/15 text-error px-2 py-0.5 rounded font-clinical-data-mono font-semibold flex items-center gap-1">
              Penicillin{" "}
              <span className="text-on-surface-variant font-normal">
                (Anaphylaxis · Grade IV)
              </span>
            </span>
            <span className="bg-surface-container-highest text-on-surface px-2 py-0.5 rounded font-clinical-data-mono flex items-center gap-1">
              Aspirin{" "}
              <span className="text-on-surface-variant font-normal">
                (Gastric Intolerance · Buffered 300mg Chewed given 13:58)
              </span>
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-space-xs text-on-surface-variant font-clinical-data-mono">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary"></span>
            Bedside Nurse: Sr. Ancy Thomas, RN · Ward Shift 08:00–16:00
          </div>
        </div>
      </section>

      {/* Top KPI Strip: 8 Vital Signs at 14:21 STAT */}
      <section className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-space-xs mb-space-base">
        {/* 1. Blood Pressure */}
        <div
          onClick={() => setSelectedParamId("sbp")}
          className={`bg-surface-container-lowest p-space-sm rounded-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer bg-error/5 ${
            selectedParamId === "sbp" || selectedParamId === "dbp" ? "ring-2 ring-primary" : ""
          }`}
        >
          <div className="flex items-center justify-between text-metadata-micro font-metadata-micro text-on-surface-variant">
            <span className="font-semibold uppercase tracking-wider">BP Arterial</span>
            <span className="material-symbols-outlined text-error text-sm">trending_up</span>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-1">
              <span className="font-page-title text-page-title text-error font-bold tracking-tight">
                148
              </span>
              <span className="font-page-title text-page-title text-on-surface font-semibold">
                /92
              </span>
            </div>
            <span className="font-metadata-micro text-metadata-micro text-error font-medium">
              mmHg · S2 HTN High
            </span>
          </div>
          <div className="flex items-center justify-between text-metadata-micro font-clinical-data-mono text-on-surface-variant/80 pt-1">
            <span className="truncate">Mindray N12</span>
            <span className="text-error font-bold">↑ 18%</span>
          </div>
        </div>

        {/* 2. Heart Rate */}
        <div
          onClick={() => setSelectedParamId("hr")}
          className={`bg-surface-container-lowest p-space-sm rounded-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer bg-amber-500/5 ${
            selectedParamId === "hr" ? "ring-2 ring-primary" : ""
          }`}
        >
          <div className="flex items-center justify-between text-metadata-micro font-metadata-micro text-on-surface-variant">
            <span className="font-semibold uppercase tracking-wider">Heart Rate</span>
            <span className="material-symbols-outlined text-on-secondary-fixed-variant text-sm">
              monitor_heart
            </span>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-1">
              <span className="font-page-title text-page-title text-on-secondary-fixed-variant font-bold tracking-tight">
                104
              </span>
              <span className="font-clinical-data text-clinical-data text-on-surface-variant">
                bpm
              </span>
            </div>
            <span className="font-metadata-micro text-metadata-micro text-on-secondary-fixed-variant font-medium truncate">
              Sinus Tachycardia
            </span>
          </div>
          <div className="flex items-center justify-between text-metadata-micro font-clinical-data-mono text-on-surface-variant/80 pt-1">
            <span>Lead II Conti</span>
            <span className="text-on-secondary-fixed-variant font-semibold">14:21:05</span>
          </div>
        </div>

        {/* 3. SpO2 */}
        <div
          onClick={() => setSelectedParamId("spo2")}
          className={`bg-surface-container-lowest p-space-sm rounded-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer ${
            selectedParamId === "spo2" ? "ring-2 ring-primary" : ""
          }`}
        >
          <div className="flex items-center justify-between text-metadata-micro font-metadata-micro text-on-surface-variant">
            <span className="font-semibold uppercase tracking-wider">SpO2 (Oxygen)</span>
            <span className="material-symbols-outlined text-primary text-sm">air</span>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-1">
              <span className="font-page-title text-page-title text-primary font-bold tracking-tight">
                98%
              </span>
            </div>
            <span className="font-metadata-micro text-metadata-micro text-primary font-medium">
              on 2L NC (Rebound 93%)
            </span>
          </div>
          <div className="flex items-center justify-between text-metadata-micro font-clinical-data-mono text-on-surface-variant/80 pt-1">
            <span>Pleth Index 4.8</span>
            <span className="text-primary font-bold">STABLE</span>
          </div>
        </div>

        {/* 4. Resp Rate */}
        <div
          onClick={() => setSelectedParamId("rr")}
          className={`bg-surface-container-lowest p-space-sm rounded-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer ${
            selectedParamId === "rr" ? "ring-2 ring-primary" : ""
          }`}
        >
          <div className="flex items-center justify-between text-metadata-micro font-metadata-micro text-on-surface-variant">
            <span className="font-semibold uppercase tracking-wider">Resp Rate</span>
            <span className="material-symbols-outlined text-on-surface-variant text-sm">
              file_copy
            </span>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-1">
              <span className="font-page-title text-page-title text-on-surface font-bold tracking-tight">
                20
              </span>
              <span className="font-clinical-data text-clinical-data text-on-surface-variant">
                /min
              </span>
            </div>
            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant font-medium">
              Eupneic, Symmetrical
            </span>
          </div>
          <div className="flex items-center justify-between text-metadata-micro font-clinical-data-mono text-on-surface-variant/80 pt-1">
            <span>Thoracic Imp</span>
            <span className="text-on-surface-variant">12–20 Target</span>
          </div>
        </div>

        {/* 5. Temperature */}
        <div
          onClick={() => setSelectedParamId("temp")}
          className={`bg-surface-container-lowest p-space-sm rounded-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer ${
            selectedParamId === "temp" ? "ring-2 ring-primary" : ""
          }`}
        >
          <div className="flex items-center justify-between text-metadata-micro font-metadata-micro text-on-surface-variant">
            <span className="font-semibold uppercase tracking-wider">Temperature</span>
            <span className="material-symbols-outlined text-primary text-sm">thermostat</span>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-1">
              <span className="font-page-title text-page-title text-on-surface font-bold tracking-tight">
                98.6°F
              </span>
            </div>
            <span className="font-metadata-micro text-metadata-micro text-primary font-medium">
              37.0°C · Normothermic
            </span>
          </div>
          <div className="flex items-center justify-between text-metadata-micro font-clinical-data-mono text-on-surface-variant/80 pt-1">
            <span>Tympanic CORD</span>
            <span className="text-primary font-semibold">NORMAL</span>
          </div>
        </div>

        {/* 6. Blood Glucose */}
        <div
          onClick={() => setSelectedParamId("bgl")}
          className={`bg-surface-container-lowest p-space-sm rounded-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer ${
            selectedParamId === "bgl" ? "ring-2 ring-primary" : ""
          }`}
        >
          <div className="flex items-center justify-between text-metadata-micro font-metadata-micro text-on-surface-variant">
            <span className="font-semibold uppercase tracking-wider">Glucose POCT</span>
            <span className="material-symbols-outlined text-primary text-sm">bloodtype</span>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-1">
              <span className="font-page-title text-page-title text-on-surface font-bold tracking-tight">
                118
              </span>
              <span className="font-clinical-data text-clinical-data text-on-surface-variant">
                mg/dL
              </span>
            </div>
            <span className="font-metadata-micro text-metadata-micro text-primary font-medium">
              Bedside Capillary
            </span>
          </div>
          <div className="flex items-center justify-between text-metadata-micro font-clinical-data-mono text-on-surface-variant/80 pt-1">
            <span>Accu-Chek G-8</span>
            <span className="text-primary">Euglycemic</span>
          </div>
        </div>

        {/* 7. Pain Score */}
        <div
          onClick={() => setSelectedParamId("pain")}
          className={`bg-surface-container-lowest p-space-sm rounded-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer bg-error/5 ${
            selectedParamId === "pain" ? "ring-2 ring-primary" : ""
          }`}
        >
          <div className="flex items-center justify-between text-metadata-micro font-metadata-micro text-on-surface-variant">
            <span className="font-semibold uppercase tracking-wider">Pain (NRS)</span>
            <span className="material-symbols-outlined text-error text-sm">
              sentiment_very_dissatisfied
            </span>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-1">
              <span className="font-page-title text-page-title text-error font-bold tracking-tight">
                6
              </span>
              <span className="font-clinical-data text-clinical-data text-on-surface-variant">
                / 10
              </span>
            </div>
            <span className="font-metadata-micro text-metadata-micro text-error font-medium truncate">
              Substernal · 9/10 Pre-NTG
            </span>
          </div>
          <div className="flex items-center justify-between text-metadata-micro font-clinical-data-mono text-on-surface-variant/80 pt-1">
            <span>Verbal Nurse RN</span>
            <span className="text-primary font-semibold">↓ -3</span>
          </div>
        </div>

        {/* 8. Shock Index / MAP */}
        <div
          onClick={() => setSelectedParamId("map")}
          className={`bg-surface-container-lowest p-space-sm rounded-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer bg-surface-container-low ${
            selectedParamId === "map" || selectedParamId === "si" ? "ring-2 ring-primary" : ""
          }`}
        >
          <div className="flex items-center justify-between text-metadata-micro font-metadata-micro text-on-surface-variant">
            <span className="font-semibold uppercase tracking-wider">MAP / Shock Ind.</span>
            <span className="material-symbols-outlined text-tertiary text-sm">calculate</span>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-1">
              <span className="font-page-title text-page-title text-on-surface font-bold tracking-tight">
                110.6
              </span>
              <span className="font-clinical-data text-clinical-data text-on-surface-variant">
                MAP
              </span>
            </div>
            <span className="font-metadata-micro text-metadata-micro text-tertiary font-semibold truncate">
              Shock Index: 0.70
            </span>
          </div>
          <div className="flex items-center justify-between text-metadata-micro font-clinical-data-mono text-on-surface-variant/80 pt-1">
            <span>Cut-off &lt;0.90</span>
            <span className="text-primary font-bold">PERFUSED</span>
          </div>
        </div>
      </section>

      {/* Main Grid: Left Flowsheet Matrix (65%) & Right Inspector Drawer (35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-base">
        {/* LEFT COLUMN: Timeframe Selector + Flowsheet Matrix + ECG Curves (lg:col-span-8) */}
        <div className="lg:col-span-8 flex flex-col gap-space-base">
          {/* Viewport Timeframe Selector Tabs */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-sm flex items-center justify-between gap-space-sm flex-wrap">
            <div className="flex items-center gap-1 overflow-x-auto py-0.5">
              {[
                "Today (STAT High-Freq)",
                "24 Hours",
                "7 Days",
                "30 Days",
                "6 Months",
                "1 Year (Longitudinal)",
                "All Encounters",
              ].map((tf) => (
                <button
                  key={tf}
                  onClick={() => {
                    setActiveTimeframe(tf);
                    showToast(`Timeframe switched: ${tf}`);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-clinical-data text-clinical-data transition-all cursor-pointer ${
                    activeTimeframe === tf
                      ? "bg-primary text-on-primary font-semibold shadow-xs"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-space-xs text-metadata-micro font-clinical-data-mono text-on-surface-variant pl-space-xs shrink-0">
              <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span>Live Auto-Refresh: 10s</span>
            </div>
          </div>

          {/* Longitudinal Parameter Matrix & Flowsheet (Hospital Grid) */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="px-space-panel-padding py-space-sm bg-surface-container-low flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-base">table_chart</span>
                <h2 className="font-section-title text-section-title text-on-surface">
                  Longitudinal Flowsheet &amp; Vital Matrix
                </h2>
              </div>
              <div className="flex items-center gap-space-sm text-metadata-micro font-metadata-micro text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-error inline-block"></span> Critical Red
                  Flag
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-on-secondary-fixed-variant inline-block"></span>{" "}
                  Out of Range
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary inline-block"></span> Normal /
                  Target
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container text-on-surface-variant font-table-header text-table-header">
                    <th className="p-space-sm sticky left-0 bg-surface-container z-10 w-52 min-w-52">
                      Parameter &amp; Bounds
                    </th>
                    {/* Col 1 STAT Selected */}
                    <th className="p-space-sm bg-primary/10 text-on-surface min-w-36">
                      <div className="flex items-center gap-1 text-primary">
                        <span className="material-symbols-outlined text-xs">radio_button_checked</span>
                        <span className="font-bold">Today 14:21 STAT</span>
                      </div>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        ER Resus Bay · Mindray
                      </div>
                    </th>
                    {/* Col 2 */}
                    <th className="p-space-sm min-w-36">
                      <div className="font-bold text-on-surface">Today 14:05</div>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Triage Bedside · CORDEX
                      </div>
                    </th>
                    {/* Col 3 */}
                    <th className="p-space-sm min-w-36">
                      <div className="font-bold text-on-surface">12-Aug-2026</div>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        OPD · Dr. Kulkarni
                      </div>
                    </th>
                    {/* Col 4 */}
                    <th className="p-space-sm min-w-36">
                      <div className="font-bold text-on-surface">04-Jul-2026</div>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Apollo Central Lab
                      </div>
                    </th>
                    {/* Col 5 */}
                    <th className="p-space-sm min-w-36">
                      <div className="font-bold text-on-surface">19-May-2026</div>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Routine Rx Refill
                      </div>
                    </th>
                    {/* Col 6 */}
                    <th className="p-space-sm min-w-36">
                      <div className="font-bold text-on-surface">15-Nov-2025</div>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Pre-op Baseline
                      </div>
                    </th>
                    {/* Col 7 Ref */}
                    <th className="p-space-sm min-w-28 text-on-surface-variant/80">
                      <div className="font-bold">Target Ref</div>
                      <div className="font-metadata-micro text-metadata-micro font-normal">
                        AHA/ACC 2026
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container font-clinical-data text-clinical-data">
                  {/* Systolic BP */}
                  <tr
                    onClick={() => setSelectedParamId("sbp")}
                    className={`hover:bg-surface-container-low transition-colors cursor-pointer group ${
                      selectedParamId === "sbp" ? "bg-primary/10 font-bold" : ""
                    }`}
                  >
                    <td className="p-space-sm sticky left-0 bg-surface-container-lowest group-hover:bg-surface-container-low z-10">
                      <div className="font-body-strong text-on-surface flex items-center justify-between">
                        <span>Systolic BP (SBP)</span>
                        <span className="material-symbols-outlined text-xs text-primary">
                          arrow_forward_ios
                        </span>
                      </div>
                      <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                        mmHg · Arterial Non-Invasive
                      </div>
                    </td>
                    <td className="p-space-sm bg-primary/15 font-clinical-data-mono font-bold text-error">
                      <div className="flex items-center justify-between">
                        <span>↑ 148</span>
                        <span className="px-1 bg-error/20 text-error font-metadata-micro text-metadata-micro rounded">
                          STAT
                        </span>
                      </div>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Mindray N12
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-error font-bold">
                      <span>↑ 152</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Triage Desk RN
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-on-surface font-medium">
                      <span>132</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Omron Digital
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-on-surface font-medium">
                      <span>128</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Hospital Clinic
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-on-surface font-medium">
                      <span>130</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Community POCT
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-on-surface font-medium">
                      <span>126</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Dr. Rao Baseline
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                      &lt; 130 mmHg
                    </td>
                  </tr>

                  {/* Diastolic BP */}
                  <tr
                    onClick={() => setSelectedParamId("dbp")}
                    className={`hover:bg-surface-container-low transition-colors cursor-pointer group ${
                      selectedParamId === "dbp" ? "bg-primary/10 font-bold" : ""
                    }`}
                  >
                    <td className="p-space-sm sticky left-0 bg-surface-container-lowest group-hover:bg-surface-container-low z-10">
                      <div className="font-body-strong text-on-surface">Diastolic BP (DBP)</div>
                      <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                        mmHg · Arterial Diastole
                      </div>
                    </td>
                    <td className="p-space-sm bg-primary/10 font-clinical-data-mono font-bold text-error">
                      <div className="flex items-center justify-between">
                        <span>↑ 92</span>
                        <span className="material-symbols-outlined text-xs text-error">warning</span>
                      </div>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Mindray N12
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-error font-semibold">
                      <span>↑ 96</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Triage Desk RN
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-on-surface">
                      <span>82</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Omron Digital
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-on-surface">
                      <span>80</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Hospital Clinic
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-on-surface">
                      <span>84</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Community POCT
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-on-surface">
                      <span>78</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Dr. Rao Baseline
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                      &lt; 80 mmHg
                    </td>
                  </tr>

                  {/* Mean Arterial Pressure */}
                  <tr
                    onClick={() => setSelectedParamId("map")}
                    className={`hover:bg-surface-container-low transition-colors cursor-pointer group ${
                      selectedParamId === "map" ? "bg-primary/10 font-bold" : ""
                    }`}
                  >
                    <td className="p-space-sm sticky left-0 bg-surface-container-lowest group-hover:bg-surface-container-low z-10">
                      <div className="font-body-strong text-on-surface">Mean Arterial (MAP)</div>
                      <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                        mmHg · Calculated [DBP + 1/3(PP)]
                      </div>
                    </td>
                    <td className="p-space-sm bg-primary/10 font-clinical-data-mono font-bold text-on-surface">
                      <span>110.6</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Auto Calculated
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-on-surface font-semibold">
                      <span>114.6</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Auto Calculated
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-on-surface">
                      <span>98.6</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Calculated
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-on-surface">
                      <span>96.0</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Calculated
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-on-surface">
                      <span>99.3</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Calculated
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-on-surface">
                      <span>94.0</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Calculated
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                      70 – 100 mmHg
                    </td>
                  </tr>

                  {/* Heart Rate */}
                  <tr
                    onClick={() => setSelectedParamId("hr")}
                    className={`hover:bg-surface-container-low transition-colors cursor-pointer group ${
                      selectedParamId === "hr" ? "bg-primary/10 font-bold" : ""
                    }`}
                  >
                    <td className="p-space-sm sticky left-0 bg-surface-container-lowest group-hover:bg-surface-container-low z-10">
                      <div className="font-body-strong text-on-surface">Heart Rate / Pulse</div>
                      <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                        bpm · Continuous ECG Telemetry
                      </div>
                    </td>
                    <td className="p-space-sm bg-primary/10 font-clinical-data-mono font-bold text-on-secondary-fixed-variant">
                      <div className="flex items-center justify-between">
                        <span>↑ 104</span>
                        <span className="px-1 bg-secondary-container text-on-secondary-container font-metadata-micro text-metadata-micro rounded">
                          TACHY
                        </span>
                      </div>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Mindray ECG II
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-on-secondary-fixed-variant font-semibold">
                      <span>↑ 108</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Pulse Ox Triage
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-on-surface">
                      <span>76</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Nurse Palpation
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-on-surface">
                      <span>72</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Clinic Exam
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-on-surface">
                      <span>74</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        POCT Unit
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-on-surface">
                      <span>68</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        12-Lead ECG Ref
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                      60 – 90 bpm
                    </td>
                  </tr>

                  {/* SpO2 Saturation */}
                  <tr
                    onClick={() => setSelectedParamId("spo2")}
                    className={`hover:bg-surface-container-low transition-colors cursor-pointer group ${
                      selectedParamId === "spo2" ? "bg-primary/10 font-bold" : ""
                    }`}
                  >
                    <td className="p-space-sm sticky left-0 bg-surface-container-lowest group-hover:bg-surface-container-low z-10">
                      <div className="font-body-strong text-on-surface">SpO2 Oxygen Sat</div>
                      <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                        % · Pulse Oximetry Finger
                      </div>
                    </td>
                    <td className="p-space-sm bg-primary/10 font-clinical-data-mono font-bold text-primary">
                      <div className="flex items-center justify-between">
                        <span>98%</span>
                        <span className="text-primary font-metadata-micro text-metadata-micro font-normal">
                          2L NC
                        </span>
                      </div>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Mindray Sensor
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-on-secondary-fixed-variant font-semibold">
                      <div className="flex items-center justify-between">
                        <span>↓ 93%</span>
                        <span className="text-error font-metadata-micro text-metadata-micro font-bold">
                          RA
                        </span>
                      </div>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Triage Bedside
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-on-surface">
                      <span>98%</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Room Air
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-on-surface">
                      <span>99%</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Room Air
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-on-surface">
                      <span>98%</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Room Air
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-on-surface">
                      <span>99%</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Pre-op Exam
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                      ≥ 95% on RA
                    </td>
                  </tr>

                  {/* Respiratory Rate */}
                  <tr
                    onClick={() => setSelectedParamId("rr")}
                    className={`hover:bg-surface-container-low transition-colors cursor-pointer group ${
                      selectedParamId === "rr" ? "bg-primary/10 font-bold" : ""
                    }`}
                  >
                    <td className="p-space-sm sticky left-0 bg-surface-container-lowest group-hover:bg-surface-container-low z-10">
                      <div className="font-body-strong text-on-surface">Respiratory Rate</div>
                      <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                        breaths/min · Impedance
                      </div>
                    </td>
                    <td className="p-space-sm bg-primary/10 font-clinical-data-mono text-on-surface font-bold">
                      <span>20</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Mindray Thoracic
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-on-secondary-fixed-variant font-semibold">
                      <span>↑ 24</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Tachypneic (Pain)
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-on-surface">
                      <span>16</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        OPD Clinical
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-on-surface">
                      <span>14</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        OPD Clinical
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-on-surface">
                      <span>16</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Clinic Exam
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-on-surface">
                      <span>14</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Pre-op Exam
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                      12 – 20 /min
                    </td>
                  </tr>

                  {/* Body Temperature */}
                  <tr
                    onClick={() => setSelectedParamId("temp")}
                    className={`hover:bg-surface-container-low transition-colors cursor-pointer group ${
                      selectedParamId === "temp" ? "bg-primary/10 font-bold" : ""
                    }`}
                  >
                    <td className="p-space-sm sticky left-0 bg-surface-container-lowest group-hover:bg-surface-container-low z-10">
                      <div className="font-body-strong text-on-surface">Body Temperature</div>
                      <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                        °F / °C · Tympanic IR
                      </div>
                    </td>
                    <td className="p-space-sm bg-primary/10 font-clinical-data-mono text-primary font-bold">
                      <span>98.6°F</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        37.0°C · Tympanic
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-on-surface font-medium">
                      <span>98.8°F</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        37.1°C · CORDEX
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-on-surface">
                      <span>98.4°F</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        36.9°C · Oral
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-on-surface">
                      <span>98.2°F</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        36.8°C · Oral
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-on-surface">
                      <span>98.6°F</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        37.0°C · Oral
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-on-surface">
                      <span>98.4°F</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        36.9°C · Oral
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                      97.8 – 99.1 °F
                    </td>
                  </tr>

                  {/* Blood Glucose */}
                  <tr
                    onClick={() => setSelectedParamId("bgl")}
                    className={`hover:bg-surface-container-low transition-colors cursor-pointer group ${
                      selectedParamId === "bgl" ? "bg-primary/10 font-bold" : ""
                    }`}
                  >
                    <td className="p-space-sm sticky left-0 bg-surface-container-lowest group-hover:bg-surface-container-low z-10">
                      <div className="font-body-strong text-on-surface">
                        Blood Glucose Bedside
                      </div>
                      <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                        mg/dL · POCT Capillary
                      </div>
                    </td>
                    <td className="p-space-sm bg-primary/10 font-clinical-data-mono text-primary font-bold">
                      <span>118</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Accu-Chek G8
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-on-surface font-medium">
                      <span>124</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Triage Capillary
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-on-surface">
                      <span>108 (F)</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Apollo Lab FBS
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-on-surface">
                      <span>102 (F)</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Apollo Lab FBS
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-on-surface">
                      <span>110 (R)</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Pharmacy Check
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-on-surface">
                      <span>96 (F)</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Pre-op Baseline
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                      70 – 140 mg/dL
                    </td>
                  </tr>

                  {/* Body Weight & BMI */}
                  <tr
                    onClick={() => setSelectedParamId("sbp")}
                    className="hover:bg-surface-container-low transition-colors cursor-pointer group"
                  >
                    <td className="p-space-sm sticky left-0 bg-surface-container-lowest group-hover:bg-surface-container-low z-10">
                      <div className="font-body-strong text-on-surface">Body Weight &amp; BMI</div>
                      <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                        kg · Calculated BMI (kg/m²)
                      </div>
                    </td>
                    <td className="p-space-sm bg-primary/10 font-clinical-data-mono text-on-surface font-medium">
                      <span>78.4 kg</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        BMI 26.2 (Overweight)
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-on-surface">
                      <span>78.4 kg</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Stated / Est.
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-on-surface">
                      <span>77.8 kg</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Seca Digital Scale
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-on-surface">
                      <span>76.5 kg</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Seca Digital Scale
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-on-surface">
                      <span>76.0 kg</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Clinic Scale
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-on-surface">
                      <span>75.2 kg</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Pre-op Scale
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                      BMI 18.5 – 24.9
                    </td>
                  </tr>

                  {/* NRS Pain Score */}
                  <tr
                    onClick={() => setSelectedParamId("pain")}
                    className={`hover:bg-surface-container-low transition-colors cursor-pointer group ${
                      selectedParamId === "pain" ? "bg-primary/10 font-bold" : ""
                    }`}
                  >
                    <td className="p-space-sm sticky left-0 bg-surface-container-lowest group-hover:bg-surface-container-low z-10">
                      <div className="font-body-strong text-on-surface">
                        NRS Pain Score (0-10)
                      </div>
                      <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                        Substernal Ischemic Rating
                      </div>
                    </td>
                    <td className="p-space-sm bg-primary/10 font-clinical-data-mono font-bold text-error">
                      <div className="flex items-center justify-between">
                        <span>6 / 10</span>
                        <span className="text-primary font-metadata-micro text-metadata-micro font-semibold">
                          Post-NTG
                        </span>
                      </div>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Nurse Ancy RN
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-error font-bold">
                      <div className="flex items-center justify-between">
                        <span>9 / 10</span>
                        <span className="px-1 bg-error text-on-error font-metadata-micro text-metadata-micro rounded">
                          PEAK
                        </span>
                      </div>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Triage Nurse Report
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-primary">
                      <span>0 / 10</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Asymptomatic
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-primary">
                      <span>0 / 10</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Asymptomatic
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-primary">
                      <span>0 / 10</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Asymptomatic
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-primary">
                      <span>0 / 10</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Asymptomatic
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                      0 / 10
                    </td>
                  </tr>

                  {/* Shock Index */}
                  <tr
                    onClick={() => setSelectedParamId("si")}
                    className={`hover:bg-surface-container-low transition-colors cursor-pointer group ${
                      selectedParamId === "si" ? "bg-primary/10 font-bold" : ""
                    }`}
                  >
                    <td className="p-space-sm sticky left-0 bg-surface-container-lowest group-hover:bg-surface-container-low z-10">
                      <div className="font-body-strong text-on-surface">
                        Shock Index (HR / SBP)
                      </div>
                      <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                        Clinical Hypoperfusion Index
                      </div>
                    </td>
                    <td className="p-space-sm bg-primary/10 font-clinical-data-mono font-bold text-tertiary">
                      <span>0.70</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Compensated Norm
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-tertiary font-semibold">
                      <span>0.71</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Compensated
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-on-surface">
                      <span>0.58</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Resting Normal
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-on-surface">
                      <span>0.56</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Resting Normal
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-on-surface">
                      <span>0.57</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Resting Normal
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-on-surface">
                      <span>0.54</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Resting Normal
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                      &lt; 0.90
                    </td>
                  </tr>

                  {/* NEWS2 Score */}
                  <tr
                    onClick={() => setSelectedParamId("news2")}
                    className={`hover:bg-surface-container-low transition-colors cursor-pointer group ${
                      selectedParamId === "news2" ? "bg-primary/10 font-bold" : ""
                    }`}
                  >
                    <td className="p-space-sm sticky left-0 bg-surface-container-lowest group-hover:bg-surface-container-low z-10">
                      <div className="font-body-strong text-on-surface">NEWS2 Acute Score</div>
                      <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                        National Early Warning Score
                      </div>
                    </td>
                    <td className="p-space-sm bg-primary/10 font-clinical-data-mono font-bold text-error">
                      <div className="flex items-center justify-between">
                        <span>Score: 7</span>
                        <span className="px-1.5 py-0.5 rounded bg-error text-on-error font-metadata-micro text-metadata-micro">
                          CRITICAL
                        </span>
                      </div>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Urgent Resus Bay
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-error font-bold">
                      <div className="flex items-center justify-between">
                        <span>Score: 8</span>
                        <span className="px-1.5 py-0.5 rounded bg-error text-on-error font-metadata-micro text-metadata-micro">
                          HIGH RISK
                        </span>
                      </div>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Triage Assessment
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-primary font-bold">
                      <span>Score: 0</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Baseline Low
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-primary font-bold">
                      <span>Score: 0</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Baseline Low
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-primary font-bold">
                      <span>Score: 0</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Baseline Low
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-primary font-bold">
                      <span>Score: 0</span>
                      <div className="font-metadata-micro text-metadata-micro font-normal text-on-surface-variant">
                        Baseline Low
                      </div>
                    </td>
                    <td className="p-space-sm font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                      Score 0 – 2 (Low)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Longitudinal Interactive Trend Curves & ECG Telemetry Strip */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-base">
            {/* Blood Pressure Trajectory */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-panel-padding flex flex-col justify-between">
              <div className="flex items-center justify-between mb-space-sm">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-error text-base">show_chart</span>
                  <h3 className="font-body-strong text-body-strong text-on-surface">
                    BP Trajectory (Longitudinal to STAT)
                  </h3>
                </div>
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant font-clinical-data-mono">
                  15-Nov-2025 → Today 14:21
                </span>
              </div>
              {/* Inline SVG Multi-line Chart */}
              <div className="relative w-full h-44 bg-surface-container-low rounded-lg p-2 flex flex-col justify-between">
                <div className="flex items-center justify-between font-metadata-micro text-metadata-micro text-on-surface-variant/70">
                  <span>160 mmHg</span>
                  <span className="text-error font-clinical-data-mono font-semibold">
                    Acute Ischemic Surge (152/96)
                  </span>
                </div>
                <svg
                  className="w-full h-28 overflow-visible"
                  preserveAspectRatio="none"
                  viewBox="0 0 360 100"
                >
                  {/* Threshold bands */}
                  <line
                    className="text-error/30"
                    stroke="currentColor"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                    x1="0"
                    x2="360"
                    y1="35"
                    y2="35"
                  ></line>
                  <text className="fill-error font-clinical-data-mono text-[9px]" x="4" y="32">
                    Target Threshold 130 SBP
                  </text>
                  {/* Systolic Curve (Red line) */}
                  <path
                    d="M 10,65 L 70,68 L 130,62 L 190,58 L 250,55 L 290,12 L 340,24"
                    fill="none"
                    stroke="#ba1a1a"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                  ></path>
                  {/* Diastolic Curve (Blue-gray line) */}
                  <path
                    d="M 10,85 L 70,86 L 130,82 L 190,80 L 250,78 L 290,48 L 340,54"
                    fill="none"
                    stroke="#4c5e83"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  ></path>
                  {/* Data markers */}
                  <circle cx="10" cy="65" fill="#ba1a1a" r="3"></circle>
                  <circle cx="70" cy="68" fill="#ba1a1a" r="3"></circle>
                  <circle cx="130" cy="62" fill="#ba1a1a" r="3"></circle>
                  <circle cx="190" cy="58" fill="#ba1a1a" r="3"></circle>
                  <circle cx="250" cy="55" fill="#ba1a1a" r="3"></circle>
                  {/* Triage Peak 152 */}
                  <circle
                    className="animate-ping opacity-75"
                    cx="290"
                    cy="12"
                    fill="#ba1a1a"
                    r="4.5"
                  ></circle>
                  <circle cx="290" cy="12" fill="#ba1a1a" r="4"></circle>
                  {/* Post-NTG Current 148 */}
                  <circle cx="340" cy="24" fill="#005c55" r="4" stroke="#ffffff" strokeWidth="1.5"></circle>
                </svg>
                <div className="flex items-center justify-between font-metadata-micro text-metadata-micro text-on-surface-variant">
                  <span>Nov &apos;25 (126/78)</span>
                  <span>May &apos;26 (130/84)</span>
                  <span>Jul &apos;26 (128/80)</span>
                  <span>Aug &apos;26 (132/82)</span>
                  <span className="text-error font-bold">14:05 (152)</span>
                  <span className="text-primary font-bold">14:21 (148)</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-space-xs text-metadata-micro font-metadata-micro text-on-surface-variant">
                <div className="flex items-center gap-space-sm">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-1 bg-error inline-block rounded"></span> SBP Systolic
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-1 bg-secondary inline-block rounded"></span> DBP
                    Diastolic
                  </span>
                </div>
                <span className="text-primary font-clinical-data-mono font-semibold">
                  Response: -4 mmHg post-NTG
                </span>
              </div>
            </div>

            {/* Heart Rate & 12-Lead ECG Telemetry Snippet */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-panel-padding flex flex-col justify-between">
              <div className="flex items-center justify-between mb-space-sm">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-error text-base">monitor_heart</span>
                  <h3 className="font-body-strong text-body-strong text-on-surface">
                    Bedside Lead V2-V4 Telemetry
                  </h3>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-error text-on-error font-clinical-data-mono text-metadata-micro font-bold animate-pulse">
                  ST-ELEVATION +3.2mm
                </span>
              </div>
              {/* Real-Time Telemetry Rhythm Graphic with ST elevation */}
              <div className="relative w-full h-44 bg-inverse-surface text-inverse-on-surface rounded-lg p-space-sm flex flex-col justify-between overflow-hidden">
                <div className="flex items-center justify-between font-clinical-data-mono text-metadata-micro z-10">
                  <span className="text-inverse-primary font-bold">
                    MINDRAY N12 · LEAD V3 (25mm/s 10mm/mV)
                  </span>
                  <span className="text-error-container font-bold">HR: 104 BPM SINUS TACHY</span>
                </div>
                {/* ECG Grid Background & Waveform */}
                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80d5cb_1px,transparent_1px),linear-gradient(to_bottom,#80d5cb_1px,transparent_1px)] bg-[size:10px_10px]"></div>
                <svg
                  className="w-full h-24 my-auto relative z-10"
                  preserveAspectRatio="none"
                  viewBox="0 0 320 80"
                >
                  {/* Beat 1: baseline */}
                  <path
                    d="M 0,45 L 20,45 L 25,40 L 30,48 L 33,10 L 38,65 L 42,42 L 55,20 L 75,45"
                    fill="none"
                    stroke="#80d5cb"
                    strokeLinecap="round"
                    strokeWidth="2"
                  ></path>
                  {/* Beat 2: Pathological ST elevation (V2/V3 pattern) */}
                  <path
                    d="M 75,45 L 95,45 L 100,38 L 105,48 L 108,8 L 114,68 L 118,22 L 145,22 L 165,45"
                    fill="none"
                    stroke="#ffdad6"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                  ></path>
                  {/* Highlight annotation over ST elevation */}
                  <rect
                    fill="rgba(186, 26, 26, 0.35)"
                    height="18"
                    rx="2"
                    width="32"
                    x="116"
                    y="16"
                  ></rect>
                  <text
                    className="fill-white font-clinical-data-mono text-[8px] font-bold"
                    x="120"
                    y="28"
                  >
                    ST +3.2
                  </text>
                  {/* Beat 3 */}
                  <path
                    d="M 165,45 L 185,45 L 190,38 L 195,48 L 198,8 L 204,68 L 208,22 L 235,22 L 255,45"
                    fill="none"
                    stroke="#ffdad6"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                  ></path>
                  {/* Beat 4 tail */}
                  <path
                    d="M 255,45 L 275,45 L 280,38 L 285,48 L 288,10 L 294,66 L 298,24 L 320,35"
                    fill="none"
                    stroke="#80d5cb"
                    strokeLinecap="round"
                    strokeWidth="2"
                  ></path>
                </svg>
                <div className="flex items-center justify-between font-clinical-data-mono text-metadata-micro text-inverse-on-surface/80 z-10">
                  <span>Filter: Diagnostic 0.05-150Hz</span>
                  <span className="text-error">Tombstone Morphology V2-V4</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-space-xs text-metadata-micro font-metadata-micro text-on-surface-variant">
                <span>SpO2 Rebound: 93% → 98% (2L NC)</span>
                <span className="font-clinical-data-mono text-on-surface font-semibold">
                  Cath Lab Team paged 14:10
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Observation Detail & Telemetry Inspector (35% width / lg:col-span-4) */}
        <div className="lg:col-span-4 flex flex-col gap-space-base">
          {/* Active Inspector Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-panel-padding flex flex-col justify-between">
            <div>
              {/* Header of Inspector */}
              <div className="flex items-center justify-between pb-space-sm bg-surface-container-low -mx-space-panel-padding -mt-space-panel-padding p-space-panel-padding rounded-t-xl mb-space-base">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-lg">biotech</span>
                  <div className="flex flex-col">
                    <span className="font-metadata-micro text-metadata-micro text-outline uppercase font-semibold">
                      Observation Detail Inspector
                    </span>
                    <span className="font-subheading text-subheading text-on-surface font-semibold">
                      {currentParam.name}
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-primary text-on-primary font-clinical-data-mono text-metadata-micro font-bold">
                  ACTIVE FOCUS
                </span>
              </div>
              {/* Selected Cell Highlight Block */}
              <div className="bg-surface-container p-space-md rounded-lg mb-space-base flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase font-semibold">
                    Selected Value &amp; Parameter
                  </span>
                  <div className="flex items-baseline gap-1 my-0.5">
                    <span
                      className={`font-page-title text-page-title font-bold ${
                        currentParam.statusColor === "error"
                          ? "text-error"
                          : currentParam.statusColor === "secondary"
                          ? "text-secondary"
                          : "text-primary"
                      }`}
                    >
                      {currentParam.value}
                    </span>
                    {currentParam.secondaryValue && (
                      <span className="font-body-strong text-body-strong text-on-surface">
                        {currentParam.secondaryValue}
                      </span>
                    )}
                    <span className="font-clinical-data text-clinical-data text-on-surface-variant">
                      {currentParam.unit}
                    </span>
                  </div>
                  <span
                    className={`font-metadata-micro text-metadata-micro font-semibold ${
                      currentParam.statusColor === "error"
                        ? "text-error"
                        : currentParam.statusColor === "secondary"
                        ? "text-secondary"
                        : "text-primary"
                    }`}
                  >
                    {currentParam.status}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-metadata-micro text-metadata-micro text-on-surface-variant block">
                    Measured At
                  </span>
                  <span className="font-clinical-data-mono text-clinical-data text-on-surface font-bold">
                    {currentParam.measuredTime.split(" ")[0]} IST
                  </span>
                  <span className="font-metadata-micro text-metadata-micro text-primary font-medium block">
                    Today STAT
                  </span>
                </div>
              </div>
              {/* Parameter Metadata Specifications */}
              <div className="flex flex-col gap-space-sm mb-space-base">
                <h4 className="font-metadata-micro text-metadata-micro text-outline uppercase font-bold tracking-wider">
                  Device &amp; Provenance Metadata
                </h4>
                <div className="flex flex-col gap-2 font-clinical-data text-clinical-data">
                  <div className="flex items-center justify-between p-2 rounded bg-surface-container-low">
                    <span className="text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">
                        settings_input_hdmi
                      </span>{" "}
                      Device Source
                    </span>
                    <span className="font-clinical-data-mono font-semibold text-on-surface">
                      {currentParam.deviceSource}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-surface-container-low">
                    <span className="text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">fingerprint</span> Device
                      Serial &amp; Port
                    </span>
                    <span className="font-clinical-data-mono text-metadata-micro text-on-surface">
                      {currentParam.deviceSerial}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-surface-container-low">
                    <span className="text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">assignment_ind</span>{" "}
                      Operator Clinician
                    </span>
                    <span className="font-semibold text-on-surface">
                      {currentParam.operator}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-surface-container-low">
                    <span className="text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">rule</span> Technique /
                      Cuff
                    </span>
                    <span className="text-on-surface">{currentParam.technique}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-surface-container-low">
                    <span className="text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">verified</span> FHIR R4
                      Resource
                    </span>
                    <span className="font-clinical-data-mono text-metadata-micro text-primary font-bold">
                      {currentParam.fhirResource}
                    </span>
                  </div>
                </div>
              </div>
              {/* Clinical Interpretation Note Box */}
              <div className="bg-primary/5 p-space-md rounded-lg mb-space-base flex flex-col gap-space-xs">
                <div className="flex items-center justify-between">
                  <span className="font-metadata-micro text-metadata-micro text-primary uppercase font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">psychology</span> Clinical
                    Interpretation
                  </span>
                  <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                    Dr. R. Verma
                  </span>
                </div>
                <p className="font-body-default text-clinical-data text-on-surface leading-relaxed">
                  {currentParam.clinicalNote}
                </p>
                <div className="flex items-center gap-space-xs font-clinical-data-mono text-metadata-micro text-outline pt-1 truncate">
                  <span className="material-symbols-outlined text-xs">lock</span>{" "}
                  {currentParam.shaHash}
                </div>
              </div>
            </div>
            {/* Operational Action Group */}
            <div className="flex flex-col gap-space-xs pt-space-xs">
              <button
                onClick={() =>
                  showToast(
                    `Confirmed and charted ${currentParam.subname} to Cardiology Assessment Note.`
                  )
                }
                className="w-full bg-primary hover:bg-primary-container text-on-primary py-2 px-space-md rounded-lg font-body-strong text-clinical-data flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">check_circle</span> Confirm
                &amp; Chart to Cardiology Note
              </button>
              <div className="grid grid-cols-2 gap-space-xs">
                <button
                  onClick={() => setIsAlarmModalOpen(true)}
                  className="bg-surface-container hover:bg-surface-container-high text-on-surface py-2 px-space-xs rounded-lg font-body-default text-clinical-data flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base text-tertiary">tune</span>{" "}
                  Set Alarm Gates
                </button>
                <button
                  onClick={() => setIsRnNoteModalOpen(true)}
                  className="bg-surface-container hover:bg-surface-container-high text-on-surface py-2 px-space-xs rounded-lg font-body-default text-clinical-data flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base text-secondary">
                    edit_note
                  </span>{" "}
                  Add RN Note
                </button>
              </div>
            </div>
          </div>

          {/* Quick Entry Mini-Panel / Manual Trigger */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-panel-padding flex flex-col gap-space-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-base">add_box</span>
                <span className="font-subheading text-subheading text-on-surface font-semibold">
                  Bedside Fast Entry
                </span>
              </div>
              <span className="font-metadata-micro text-metadata-micro text-on-surface-variant font-clinical-data-mono">
                STATION ER-02
              </span>
            </div>
            <p className="font-body-default text-clinical-data text-on-surface-variant">
              Directly capture manual vitals or stream continuous bluetooth telemetry from Mindray
              BeneVision or Welch Allyn Spot monitors.
            </p>
            <button
              onClick={() => setIsVitalsModalOpen(true)}
              className="w-full bg-surface-container-low hover:bg-surface-container text-primary font-body-strong text-clinical-data py-2 px-space-md rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              id="btnQuickManualEntry"
            >
              <span className="material-symbols-outlined text-base">bluetooth_searching</span> Pair
              Bluetooth Monitor or Input Manually
            </button>
          </div>
        </div>
      </div>

      {/* MODALS */}

      {/* 1. Record Bedside Vitals Modal */}
      {isVitalsModalOpen && (
        <div className="fixed inset-0 bg-inverse-surface/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-surface-container-lowest rounded-xl shadow-xl max-w-2xl w-full p-space-panel-padding flex flex-col gap-space-base max-h-[921px] overflow-y-auto border border-outline-variant">
            <div className="flex items-center justify-between pb-space-sm bg-surface-container-low -mx-space-panel-padding -mt-space-panel-padding p-space-panel-padding rounded-t-xl">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-xl">vital_signs</span>
                <div>
                  <h3 className="font-section-title text-section-title text-on-surface">
                    Record Bedside Observations
                  </h3>
                  <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    Patient: Rahul Sharma (UHID DEL-2024-8841 · Bed ER-02)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsVitalsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <form onSubmit={handleVitalsSubmit} className="flex flex-col gap-space-base">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                {/* Blood Pressure inputs */}
                <div className="flex flex-col gap-1">
                  <label className="font-body-strong text-clinical-data text-on-surface">
                    Systolic / Diastolic BP (mmHg)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      required
                      value={formSbp}
                      onChange={(e) => setFormSbp(e.target.value)}
                      className="w-full bg-surface-container-low text-on-surface px-3 py-2 rounded-lg font-clinical-data-mono text-clinical-data focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant"
                      placeholder="Systolic"
                      type="number"
                    />
                    <span className="text-on-surface-variant font-bold">/</span>
                    <input
                      required
                      value={formDbp}
                      onChange={(e) => setFormDbp(e.target.value)}
                      className="w-full bg-surface-container-low text-on-surface px-3 py-2 rounded-lg font-clinical-data-mono text-clinical-data focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant"
                      placeholder="Diastolic"
                      type="number"
                    />
                  </div>
                </div>
                {/* Heart Rate */}
                <div className="flex flex-col gap-1">
                  <label className="font-body-strong text-clinical-data text-on-surface">
                    Heart Rate (bpm)
                  </label>
                  <input
                    required
                    value={formHr}
                    onChange={(e) => setFormHr(e.target.value)}
                    className="w-full bg-surface-container-low text-on-surface px-3 py-2 rounded-lg font-clinical-data-mono text-clinical-data focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant"
                    type="number"
                  />
                </div>
                {/* SpO2 */}
                <div className="flex flex-col gap-1">
                  <label className="font-body-strong text-clinical-data text-on-surface">
                    SpO2 Saturation (%)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      required
                      value={formSpo2}
                      onChange={(e) => setFormSpo2(e.target.value)}
                      className="w-full bg-surface-container-low text-on-surface px-3 py-2 rounded-lg font-clinical-data-mono text-clinical-data focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant"
                      type="number"
                    />
                    <select
                      value={formO2Device}
                      onChange={(e) => setFormO2Device(e.target.value)}
                      className="bg-surface-container-low text-on-surface px-2 py-2 rounded-lg font-clinical-data text-clinical-data focus:outline-none border border-outline-variant"
                    >
                      <option>2L NC O2</option>
                      <option>Room Air</option>
                      <option>4L Face Mask</option>
                      <option>10L NRBM</option>
                    </select>
                  </div>
                </div>
                {/* Resp Rate */}
                <div className="flex flex-col gap-1">
                  <label className="font-body-strong text-clinical-data text-on-surface">
                    Respiratory Rate (/min)
                  </label>
                  <input
                    required
                    value={formRr}
                    onChange={(e) => setFormRr(e.target.value)}
                    className="w-full bg-surface-container-low text-on-surface px-3 py-2 rounded-lg font-clinical-data-mono text-clinical-data focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant"
                    type="number"
                  />
                </div>
                {/* Body Temp */}
                <div className="flex flex-col gap-1">
                  <label className="font-body-strong text-clinical-data text-on-surface">
                    Body Temperature (°F)
                  </label>
                  <input
                    required
                    value={formTemp}
                    onChange={(e) => setFormTemp(e.target.value)}
                    className="w-full bg-surface-container-low text-on-surface px-3 py-2 rounded-lg font-clinical-data-mono text-clinical-data focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant"
                    step="0.1"
                    type="number"
                  />
                </div>
                {/* Pain Score */}
                <div className="flex flex-col gap-1">
                  <label className="font-body-strong text-clinical-data text-on-surface">
                    Pain Score (0 - 10 NRS)
                  </label>
                  <select
                    value={formPain}
                    onChange={(e) => setFormPain(e.target.value)}
                    className="w-full bg-surface-container-low text-on-surface px-3 py-2 rounded-lg font-clinical-data text-clinical-data focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant"
                  >
                    <option>0 - No Pain</option>
                    <option>4 - Moderate</option>
                    <option>6 - Severe Pain (Decreased from 9)</option>
                    <option>8 - Very Severe</option>
                    <option>10 - Unbearable</option>
                  </select>
                </div>
              </div>
              {/* Provenance & Signature */}
              <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-2">
                <div className="flex items-center justify-between text-metadata-micro font-metadata-micro text-on-surface-variant">
                  <span className="font-semibold uppercase">Nurse Electronic Verification</span>
                  <span className="font-clinical-data-mono">Sr. Ancy Thomas, RN (#4419)</span>
                </div>
                <div className="flex items-center gap-space-sm">
                  <input
                    value={formNursePin}
                    onChange={(e) => setFormNursePin(e.target.value)}
                    className="bg-surface-container-lowest text-on-surface px-3 py-1.5 rounded font-clinical-data-mono text-clinical-data w-52 focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant"
                    placeholder="Enter Nurse 4-Digit PIN"
                    type="password"
                  />
                  <span className="text-metadata-micro font-metadata-micro text-on-surface-variant">
                    Attests clinical accuracy under NABH/JCI protocol
                  </span>
                </div>
              </div>
              {/* Form Actions */}
              <div className="flex items-center justify-end gap-space-xs pt-space-xs">
                <button
                  type="button"
                  onClick={() => setIsVitalsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-default text-clinical-data cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-body-strong text-clinical-data flex items-center gap-1 shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">save</span> Save &amp;
                  Broadcast Vitals
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Import Mindray Telemetry Modal */}
      {isTelemetryModalOpen && (
        <div className="fixed inset-0 bg-inverse-surface/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-surface-container-lowest rounded-xl shadow-xl max-w-md w-full p-space-panel-padding flex flex-col gap-3 border border-outline-variant">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl animate-spin">
                  sync
                </span>
                <h3 className="font-page-title text-subheading font-bold text-on-surface">
                  Mindray BeneVision Telemetry
                </h3>
              </div>
              <button
                onClick={() => setIsTelemetryModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="space-y-2 text-clinical-data font-clinical-data">
              <div className="p-2.5 rounded bg-surface-container-low flex justify-between">
                <span className="text-on-surface-variant">Monitor Unit:</span>
                <span className="font-clinical-data-mono font-bold text-on-surface">
                  BeneVision N12 (Bed ER-02)
                </span>
              </div>
              <div className="p-2.5 rounded bg-surface-container-low flex justify-between">
                <span className="text-on-surface-variant">Active Protocol:</span>
                <span className="font-clinical-data-mono font-bold text-primary">HL7 / FHIR MLLP Stream</span>
              </div>
              <div className="p-2.5 rounded bg-surface-container-low flex justify-between">
                <span className="text-on-surface-variant">Realtime Packets:</span>
                <span className="font-clinical-data-mono text-secondary font-semibold">
                  1,240 pkts / 10s · 0 Drops
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                setIsTelemetryModalOpen(false);
                showToast("Mindray BeneVision continuous telemetry stream synced (14:21:15 IST).");
              }}
              className="w-full py-2 bg-primary text-on-primary rounded font-semibold hover:opacity-95 mt-2"
            >
              Confirm Stream Synchronization
            </button>
          </div>
        </div>
      )}

      {/* 3. Encounter Compare Modal */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 bg-inverse-surface/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-surface-container-lowest rounded-xl shadow-xl max-w-2xl w-full p-space-panel-padding flex flex-col gap-3 border border-outline-variant">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">compare_arrows</span>
                <h3 className="font-page-title text-subheading font-bold text-on-surface">
                  Encounter Multi-Point Comparison
                </h3>
              </div>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="overflow-x-auto text-clinical-data font-clinical-data">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container text-on-surface-variant text-metadata-micro uppercase">
                    <th className="p-2">Parameter</th>
                    <th className="p-2 text-error font-bold">Today 14:21 (STAT)</th>
                    <th className="p-2">Today 14:05 (Triage)</th>
                    <th className="p-2">12-Aug-2026 (OPD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  <tr>
                    <td className="p-2 font-semibold">Blood Pressure</td>
                    <td className="p-2 font-clinical-data-mono font-bold text-error">148/92 mmHg</td>
                    <td className="p-2 font-clinical-data-mono text-error">152/96 mmHg</td>
                    <td className="p-2 font-clinical-data-mono text-on-surface">132/82 mmHg</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold">Heart Rate</td>
                    <td className="p-2 font-clinical-data-mono font-bold text-secondary">104 bpm</td>
                    <td className="p-2 font-clinical-data-mono text-secondary">108 bpm</td>
                    <td className="p-2 font-clinical-data-mono text-on-surface">76 bpm</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold">SpO2 Oxygen</td>
                    <td className="p-2 font-clinical-data-mono text-primary font-bold">98% (2L NC)</td>
                    <td className="p-2 font-clinical-data-mono text-error">93% (RA)</td>
                    <td className="p-2 font-clinical-data-mono text-on-surface">98% (RA)</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold">Pain (NRS)</td>
                    <td className="p-2 font-clinical-data-mono text-error font-bold">6 / 10</td>
                    <td className="p-2 font-clinical-data-mono text-error">9 / 10 (Peak)</td>
                    <td className="p-2 font-clinical-data-mono text-primary">0 / 10</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold">NEWS2 Score</td>
                    <td className="p-2 font-clinical-data-mono text-error font-bold">Score: 7</td>
                    <td className="p-2 font-clinical-data-mono text-error">Score: 8</td>
                    <td className="p-2 font-clinical-data-mono text-primary">Score: 0</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex justify-end pt-2 border-t border-outline-variant">
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="px-4 py-1.5 bg-surface-container text-on-surface rounded font-medium"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. PDF Export Modal */}
      {isPdfModalOpen && (
        <div className="fixed inset-0 bg-inverse-surface/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-surface-container-lowest rounded-xl shadow-xl max-w-md w-full p-space-panel-padding flex flex-col gap-3 border border-outline-variant">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">picture_as_pdf</span>
                <h3 className="font-page-title text-subheading font-bold text-on-surface">
                  Certified Medical Record PDF
                </h3>
              </div>
              <button
                onClick={() => setIsPdfModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="p-3 bg-surface-container-low rounded space-y-1.5 text-metadata-micro">
              <div className="font-bold text-on-surface text-clinical-data">
                Apollo Indraprastha Hospitals · Department of Emergency Medicine
              </div>
              <div>Patient: Rahul Sharma (UHID: DEL-2024-8841 · 42Y / M)</div>
              <div>Encounter: ENC-DEL-2026-90214 · Attending: Dr. Rohit Verma</div>
              <div className="text-primary font-clinical-data-mono">
                Digital Signature: SHA256-CERTIFIED-MED-REC
              </div>
            </div>
            <button
              onClick={() => {
                setIsPdfModalOpen(false);
                showToast("Generating certified hospital PDF download...");
              }}
              className="w-full py-2 bg-primary text-on-primary rounded font-semibold hover:opacity-95 mt-1"
            >
              Download PDF Summary
            </button>
          </div>
        </div>
      )}

      {/* 5. Rhythm Strip Modal */}
      {isRhythmModalOpen && (
        <div className="fixed inset-0 bg-inverse-surface/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-surface-container-lowest rounded-xl shadow-xl max-w-xl w-full p-space-panel-padding flex flex-col gap-3 border border-outline-variant">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">print</span>
                <h3 className="font-page-title text-subheading font-bold text-on-surface">
                  Bedside Rhythm Strip (Lead II / V3)
                </h3>
              </div>
              <button
                onClick={() => setIsRhythmModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="bg-inverse-surface text-inverse-on-surface p-4 rounded-lg font-clinical-data-mono text-metadata-micro space-y-2">
              <div className="flex justify-between text-inverse-primary font-bold">
                <span>LEAD V3 · SPEED 25mm/s · CAL 10mm/mV</span>
                <span className="text-error">ST +3.2mm</span>
              </div>
              <div className="border border-outline/30 p-2 rounded flex items-center justify-center bg-black/40">
                <svg className="w-full h-16 text-error" fill="none" viewBox="0 0 320 60">
                  <path
                    d="M 0,30 L 30,30 L 35,26 L 40,34 L 43,6 L 48,46 L 52,18 L 80,18 L 100,30 L 130,30 L 135,26 L 140,34 L 143,6 L 148,46 L 152,18 L 180,18 L 200,30 L 230,30 L 235,26 L 240,34 L 243,6 L 248,46 L 252,18 L 280,18 L 300,30 L 320,30"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </div>
              <div className="flex justify-between text-outline">
                <span>PR: 158ms · QRS: 92ms · QTc: 464ms</span>
                <span>Tombstone Morphology V2-V4</span>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant">
              <button
                onClick={() => setIsRhythmModalOpen(false)}
                className="px-3 py-1.5 bg-surface-container text-on-surface rounded font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setIsRhythmModalOpen(false);
                  showToast("Calibrated rhythm strip printed on bedside thermal unit.");
                }}
                className="px-4 py-1.5 bg-primary text-on-primary rounded font-semibold hover:opacity-95"
              >
                Print to Thermal Unit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Alarm Settings Modal */}
      {isAlarmModalOpen && (
        <div className="fixed inset-0 bg-inverse-surface/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-surface-container-lowest rounded-xl shadow-xl max-w-md w-full p-space-panel-padding flex flex-col gap-3 border border-outline-variant">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-xl">tune</span>
                <h3 className="font-page-title text-subheading font-bold text-on-surface">
                  Telemetry Alarm Thresholds
                </h3>
              </div>
              <button
                onClick={() => setIsAlarmModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="space-y-3 font-clinical-data text-clinical-data">
              <div>
                <label className="text-metadata-micro text-outline font-semibold uppercase block mb-1">
                  Systolic BP Alarm Gates (mmHg)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    defaultValue="90"
                    placeholder="Low Gate"
                    className="px-3 py-1.5 bg-surface-container-low rounded border border-outline-variant text-on-surface font-clinical-data-mono"
                  />
                  <input
                    defaultValue="160"
                    placeholder="High Gate"
                    className="px-3 py-1.5 bg-surface-container-low rounded border border-outline-variant text-on-surface font-clinical-data-mono"
                  />
                </div>
              </div>
              <div>
                <label className="text-metadata-micro text-outline font-semibold uppercase block mb-1">
                  Heart Rate Alarm Gates (bpm)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    defaultValue="50"
                    placeholder="Brady Gate"
                    className="px-3 py-1.5 bg-surface-container-low rounded border border-outline-variant text-on-surface font-clinical-data-mono"
                  />
                  <input
                    defaultValue="120"
                    placeholder="Tachy Gate"
                    className="px-3 py-1.5 bg-surface-container-low rounded border border-outline-variant text-on-surface font-clinical-data-mono"
                  />
                </div>
              </div>
              <div>
                <label className="text-metadata-micro text-outline font-semibold uppercase block mb-1">
                  SpO2 Critical Floor (%)
                </label>
                <input
                  defaultValue="92"
                  className="w-full px-3 py-1.5 bg-surface-container-low rounded border border-outline-variant text-on-surface font-clinical-data-mono"
                />
              </div>
            </div>
            <button
              onClick={() => {
                setIsAlarmModalOpen(false);
                showToast("Bedside alarm thresholds committed to Mindray N12.");
              }}
              className="w-full py-2 bg-primary text-on-primary rounded font-semibold hover:opacity-95 mt-1"
            >
              Save Alarm Gates
            </button>
          </div>
        </div>
      )}

      {/* 7. RN Note Modal */}
      {isRnNoteModalOpen && (
        <div className="fixed inset-0 bg-inverse-surface/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-surface-container-lowest rounded-xl shadow-xl max-w-lg w-full p-space-panel-padding flex flex-col gap-3 border border-outline-variant">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-xl">edit_note</span>
                <h3 className="font-page-title text-subheading font-bold text-on-surface">
                  Add Clinical Nurse Annotation
                </h3>
              </div>
              <button
                onClick={() => setIsRnNoteModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <textarea
              rows={4}
              value={rnNoteText}
              onChange={(e) => setRnNoteText(e.target.value)}
              className="w-full p-3 bg-surface-container-low text-on-surface text-clinical-data rounded-lg border border-outline-variant focus:outline-none focus:ring-1 focus:ring-primary"
            ></textarea>
            <div className="flex justify-between items-center text-metadata-micro text-on-surface-variant">
              <span>Author: Sr. Ancy Thomas, RN (#4419)</span>
              <span>Ward Shift: 08:00 - 16:00</span>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant">
              <button
                onClick={() => setIsRnNoteModalOpen(false)}
                className="px-4 py-1.5 bg-surface-container text-on-surface rounded font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsRnNoteModalOpen(false);
                  showToast("Nurse observation note saved to patient clinical timeline.");
                }}
                className="px-4 py-1.5 bg-primary text-on-primary rounded font-semibold hover:opacity-95"
              >
                Append to EHR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
