/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircleIcon } from "@careflow/ui";

interface Patient {
  id: string;
  token: string;
  name: string;
  age: number;
  gender: "M" | "F";
  uhid: string;
  abhaId?: string;
  bloodGroup: string;
  priority: "P1" | "P2" | "P3";
  acuityTag: string;
  acuitySubtag: string;
  waitTime: string;
  chiefComplaint: string;
  subtext: string;
  vitals: {
    bp: string;
    hr: string;
    spo2: string;
    resp?: string;
    temp?: string;
    bmg?: string;
    tempAlert?: boolean;
    spo2Alert?: boolean;
  };
  assignedTo: string;
  location: string;
  intakeStatusText: string;
  intakeProgressPct: number;
  actionButtonLabel: string;
  photoUrl?: string;
  audioQuote: string;
  audioDuration: string;
  audioTranslation?: string;
  ecgLead?: string;
  ecgStElevation?: string;
  ecgFlag?: string;
}

const initialRedFlags: Patient[] = [
  {
    id: "rf-1",
    token: "#104",
    name: "Rahul Sharma",
    age: 42,
    gender: "M",
    bloodGroup: "O+ve",
    uhid: "CF-IND-2024-884920",
    abhaId: "91-8842-1920-4491",
    priority: "P1",
    acuityTag: "P1 · SUSPECTED ACS/STEMI",
    acuitySubtag: "ECG Anomaly V2-V4",
    waitTime: "4m",
    chiefComplaint: "“Crushing retrosternal chest pain radiating to left jaw & diaphoresis (45m)”",
    subtext: "Assigned: Nurse Ancy (St-02) · Vitals Alert: HR 104 ↑",
    vitals: {
      bp: "148/92",
      hr: "104",
      spo2: "94%",
      bmg: "118",
    },
    assignedTo: "Nurse Ancy (St-02)",
    location: "OPD Bay 2",
    intakeStatusText: "CareFlow Voice Intake",
    intakeProgressPct: 98,
    actionButtonLabel: "Transfer to Resus Bay",
    photoUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDgnos9HAVxielAQwv7FRp6eTqKBkgsKF1-6RZgjPEuWU2dncv0pZ3IPozOx_eLUZvL-yKNTApP-l6axojWQZOtjEdANlxpEUqs1x_swAEay-6YZxhpYtjEjwzWldAygdmelCYYS3t6PCuI_5N3wrvTqJSfnkxcCttYJwtXA6tKDwTigIUj6jcECciiugtQ8BYPsfmeWqZeMrT4J5qMz9vW-KjpWdZ19egh_KKIvvPjraz_6fNVL6TZ",
    audioQuote:
      "“Started suddenly after climbing stairs... feeling squeezing heavy pressure on my chest and numb cold sweat in my left jaw.”",
    audioDuration: "0:14 / 0:45",
    audioTranslation: "Spoken in Hindi (Auto-translated to English Medical Terminology)",
    ecgLead: "Lead V3 - Anterior",
    ecgStElevation: "ST +3.2mm",
    ecgFlag:
      "Flag: ST elevation in V2-V4 anterior leads. Immediate Catheterization Lab Alert protocol triggered.",
  },
  {
    id: "rf-2",
    token: "#118",
    name: "Sunita Devi",
    age: 58,
    gender: "F",
    bloodGroup: "B+ve",
    uhid: "CF-IND-2024-441092",
    abhaId: "91-1192-3304-8812",
    priority: "P1",
    acuityTag: "P1 · ACUTE DECOMPENSATED HF",
    acuitySubtag: "SpO2 91% RA ↓",
    waitTime: "7m",
    chiefComplaint: "“Severe breathlessness, orthopnea, bilateral pedal edema since last midnight”",
    subtext: "Assigned: Nurse Priya (St-04) · Resp: 28/min ↑",
    vitals: {
      bp: "162/98",
      hr: "112",
      spo2: "91%",
      resp: "28/min",
      bmg: "134",
      spo2Alert: true,
    },
    assignedTo: "Nurse Priya (St-04)",
    location: "Emergency Triage St-04",
    intakeStatusText: "Kiosk & PulseOx Stream",
    intakeProgressPct: 92,
    actionButtonLabel: "O2 STAT & Resus",
    photoUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    audioQuote:
      "“I cannot lie down flat without choking for air. My feet have swollen completely since yesterday night.”",
    audioDuration: "0:22 / 0:50",
    audioTranslation: "Spoken in Punjabi (Auto-translated to English Medical Terminology)",
    ecgLead: "Lead II - Inferior",
    ecgStElevation: "Sinus Tachycardia 112 bpm",
    ecgFlag:
      "Flag: Bilateral basal crepitations noted. B-profile Kerley B lines on bedside lung ultrasound.",
  },
];

const initialStandardQueue: Patient[] = [
  {
    id: "st-1",
    token: "#121",
    name: "Rajesh Patel",
    age: 34,
    gender: "M",
    bloodGroup: "A+ve",
    uhid: "UHID-99214",
    priority: "P3",
    acuityTag: "P3",
    acuitySubtag: "Suspected Dengue / Malaria Screen",
    waitTime: "12m",
    chiefComplaint: "High grade fever + chills (3d)",
    subtext: "Suspected Dengue / Malaria Screen",
    vitals: {
      bp: "118/76",
      hr: "88",
      temp: "102.4°F",
      spo2: "98%",
      tempAlert: true,
    },
    assignedTo: "Dr. A. Sen",
    location: "OPD Room 06",
    intakeStatusText: "95% Audio OK",
    intakeProgressPct: 95,
    actionButtonLabel: "Assign Bay",
    audioQuote: "“Shivering since 3 days, body aches, severe headache behind the eyes.”",
    audioDuration: "0:10 / 0:30",
  },
  {
    id: "st-2",
    token: "#123",
    name: "Anita Rao",
    age: 61,
    gender: "F",
    bloodGroup: "O+ve",
    uhid: "UHID-48190",
    priority: "P3",
    acuityTag: "P3",
    acuitySubtag: "Known Osteoarthritis · Difficulty Walking",
    waitTime: "18m",
    chiefComplaint: "Bilateral knee joint pain flare",
    subtext: "Known Osteoarthritis · Difficulty Walking",
    vitals: {
      bp: "134/82",
      hr: "76",
      temp: "98.4°F",
      spo2: "99%",
    },
    assignedTo: "Dr. K. Nambiar",
    location: "Ortho Bay 02",
    intakeStatusText: "100% Complete",
    intakeProgressPct: 100,
    actionButtonLabel: "Call Patient",
    audioQuote: "“Severe swelling in right knee after standing in kitchen. Pain score 7/10.”",
    audioDuration: "0:12 / 0:25",
  },
  {
    id: "st-3",
    token: "#125",
    name: "Mohammad Farooq",
    age: 67,
    gender: "M",
    bloodGroup: "B+ve",
    uhid: "UHID-71032",
    priority: "P2",
    acuityTag: "P2",
    acuitySubtag: "AECOPD Flare · SpO2 93% Room Air",
    waitTime: "8m",
    chiefComplaint: "COPD cough & purulent sputum",
    subtext: "AECOPD Flare · SpO2 93% Room Air",
    vitals: {
      bp: "142/88",
      hr: "94",
      spo2: "93%",
      resp: "24",
      spo2Alert: true,
    },
    assignedTo: "Dr. M. Chacko",
    location: "Pulmo St-01",
    intakeStatusText: "85% Kiosk OCR",
    intakeProgressPct: 85,
    actionButtonLabel: "Nebulizer Bay",
    audioQuote: "“Coughing yellow sputum for 4 days, heavy tightness in chest when breathing.”",
    audioDuration: "0:18 / 0:40",
  },
  {
    id: "st-4",
    token: "#128",
    name: "Kavita Nair",
    age: 29,
    gender: "F",
    bloodGroup: "AB+ve",
    uhid: "UHID-30911",
    priority: "P3",
    acuityTag: "P3",
    acuitySubtag: "VAS Pain Score 8/10 · Nausea",
    waitTime: "24m",
    chiefComplaint: "Refractory migraine + photophobia",
    subtext: "VAS Pain Score 8/10 · Nausea",
    vitals: {
      bp: "124/80",
      hr: "72",
      temp: "98.6°F",
      spo2: "99%",
    },
    assignedTo: "Dr. R. Verma",
    location: "OPD Room 01",
    intakeStatusText: "100% Complete",
    intakeProgressPct: 100,
    actionButtonLabel: "Quiet Ward",
    audioQuote: "“Throbbing pain on right hemisphere of head with light sensitivity since this morning.”",
    audioDuration: "0:15 / 0:35",
  },
];

export default function ClinicalQueuePage() {
  const [redFlags, setRedFlags] = useState<Patient[]>(initialRedFlags);
  const [standardQueue, setStandardQueue] = useState<Patient[]>(initialStandardQueue);
  const [selectedPatient, setSelectedPatient] = useState<Patient>(initialRedFlags[0]);
  const [acuityFilter, setAcuityFilter] = useState<"all" | "p2" | "p3">("all");
  const [isQueueHeld, setIsQueueHeld] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [acknowledgedMap, setAcknowledgedMap] = useState<{ [id: string]: boolean }>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showAddWalkinModal, setShowAddWalkinModal] = useState(false);

  // Walk-in form states
  const [walkinName, setWalkinName] = useState("");
  const [walkinAge, setWalkinAge] = useState("");
  const [walkinGender, setWalkinGender] = useState<"M" | "F">("M");
  const [walkinPriority, setWalkinPriority] = useState<"P1" | "P2" | "P3">("P2");
  const [walkinComplaint, setWalkinComplaint] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAcknowledge = (id: string, name: string) => {
    setAcknowledgedMap((prev) => ({ ...prev, [id]: true }));
    showToast(`Acknowledged alert for ${name}.`);
  };

  const handleTransferResus = (patient: Patient) => {
    showToast(`Order Dispatched: ${patient.name} (${patient.token}) transferred to Resuscitation Bay 01.`);
  };

  const handleCodeStemi = () => {
    showToast("CODE STEMI INITIATED: Interventional Cardiology Cath Lab Alert broadcast triggered.");
  };

  const handleAddWalkinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkinName.trim() || !walkinComplaint.trim()) return;

    const newPatient: Patient = {
      id: `walkin-${Date.now()}`,
      token: `#${130 + Math.floor(Math.random() * 50)}`,
      name: walkinName,
      age: parseInt(walkinAge) || 40,
      gender: walkinGender,
      bloodGroup: "B+ve",
      uhid: `UHID-${Math.floor(10000 + Math.random() * 89999)}`,
      priority: walkinPriority,
      acuityTag: walkinPriority,
      acuitySubtag: "Direct Walk-in Intake",
      waitTime: "1m",
      chiefComplaint: walkinComplaint,
      subtext: "Walk-in Station Intake",
      vitals: {
        bp: "128/82",
        hr: "84",
        spo2: "97%",
      },
      assignedTo: "Dr. R. Verma",
      location: "Triage Station St-02",
      intakeStatusText: "100% Complete",
      intakeProgressPct: 100,
      actionButtonLabel: "Assign Bay",
      audioQuote: `“${walkinComplaint}”`,
      audioDuration: "0:10 / 0:25",
    };

    if (walkinPriority === "P1") {
      setRedFlags([newPatient, ...redFlags]);
    } else {
      setStandardQueue([newPatient, ...standardQueue]);
    }
    setSelectedPatient(newPatient);
    setShowAddWalkinModal(false);
    setWalkinName("");
    setWalkinAge("");
    setWalkinComplaint("");
    showToast(`Added ${newPatient.name} (${newPatient.token}) to live clinical triage queue.`);
  };

  const filteredStandardQueue = standardQueue.filter((p) => {
    if (acuityFilter === "p2") return p.priority === "P2";
    if (acuityFilter === "p3") return p.priority === "P3";
    return true;
  });

  return (
    <div className="flex flex-col w-full gap-space-md">
      {/* Dynamic Toast Feedback Pill */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 border border-outline-variant animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircleIcon className="w-5 h-5 text-primary-fixed" />
          <span className="text-clinical-data font-clinical-data font-medium">
            {toastMessage}
          </span>
        </div>
      )}

      {/* Command Center Header Area */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-sm bg-surface-container-lowest p-space-md rounded shadow-sm">
        <div className="flex flex-wrap items-center gap-space-md">
          <div className="flex items-center gap-space-xs">
            <span
              className="material-symbols-outlined text-primary text-xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              grid_view
            </span>
            <h1 className="font-page-title text-page-title text-on-surface tracking-tight">
              Triage Command Center · Station St-02
            </h1>
          </div>

          <div className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-1 rounded">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
            <span className="font-clinical-data-mono text-metadata-micro text-primary uppercase font-bold tracking-wider">
              Live Telemetry Sync
            </span>
          </div>

          <div className="flex items-center gap-space-xs bg-secondary-container px-space-sm py-1 rounded">
            <span className="material-symbols-outlined text-on-secondary-container text-sm">
              graphic_eq
            </span>
            <span className="font-clinical-data text-metadata-micro text-on-secondary-container font-semibold">
              Audio Intake: 4 Streams Synced
            </span>
          </div>
        </div>

        <div className="flex items-center gap-space-xs shrink-0">
          <button
            onClick={() => {
              setIsQueueHeld(!isQueueHeld);
              showToast(isQueueHeld ? "Triage queue intake resumed." : "Triage queue intake put on hold.");
            }}
            className={`flex items-center gap-space-xs px-space-sm h-8 text-clinical-data font-clinical-data font-semibold rounded transition-colors shadow-sm ${
              isQueueHeld
                ? "bg-error text-on-error"
                : "bg-surface-container hover:bg-surface-container-high text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-base">
              {isQueueHeld ? "play_circle" : "pause_circle"}
            </span>
            <span>{isQueueHeld ? "Resume Triage Queue" : "Hold Triage Queue"}</span>
          </button>

          <button
            onClick={() => setShowAddWalkinModal(true)}
            className="flex items-center gap-space-xs px-space-sm h-8 bg-primary hover:bg-primary-container text-on-primary text-clinical-data font-clinical-data font-semibold rounded transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            <span>Add Walk-in Triage</span>
          </button>
        </div>
      </div>

      {/* Top Actionable Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-space-sm">
        {/* Critical Red Flags */}
        <div className="flex flex-col bg-surface-container-lowest p-space-sm rounded shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-error"></div>
          <div className="flex items-center justify-between pl-space-xs mb-1">
            <span className="font-metadata-micro text-metadata-micro text-error uppercase font-bold tracking-wider">
              Critical Red Flags
            </span>
            <span className="material-symbols-outlined text-error text-base animate-pulse">crisis_alert</span>
          </div>
          <div className="flex items-baseline gap-space-xs pl-space-xs">
            <span className="font-chief-complaint text-chief-complaint text-error leading-none">02</span>
            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant font-medium">
              Immediate Override
            </span>
          </div>
          <div className="mt-2 pl-space-xs flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-error"></span>
            <span className="font-metadata-micro text-[10px] text-error font-semibold uppercase">
              STEMI &amp; Acute ADHF
            </span>
          </div>
        </div>

        {/* Ready for Consult */}
        <div className="flex flex-col bg-surface-container-lowest p-space-sm rounded shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
          <div className="flex items-center justify-between pl-space-xs mb-1">
            <span className="font-metadata-micro text-metadata-micro text-outline uppercase font-bold tracking-wider">
              Ready for Consult
            </span>
            <span className="material-symbols-outlined text-primary text-base">how_to_reg</span>
          </div>
          <div className="flex items-baseline gap-space-xs pl-space-xs">
            <span className="font-chief-complaint text-chief-complaint text-primary leading-none">14</span>
            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant font-medium">
              Triage Scored
            </span>
          </div>
          <div className="mt-2 pl-space-xs flex items-center gap-1">
            <span className="font-metadata-micro text-[10px] text-on-surface-variant">
              4 Gen Med · 6 Card · 4 Ortho
            </span>
          </div>
        </div>

        {/* Voice Intake Stream */}
        <div className="flex flex-col bg-surface-container-lowest p-space-sm rounded shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-tertiary"></div>
          <div className="flex items-center justify-between pl-space-xs mb-1">
            <span className="font-metadata-micro text-metadata-micro text-outline uppercase font-bold tracking-wider">
              Voice Intake
            </span>
            <span className="material-symbols-outlined text-tertiary text-base">mic</span>
          </div>
          <div className="flex items-baseline gap-space-xs pl-space-xs">
            <span className="font-chief-complaint text-chief-complaint text-tertiary leading-none">04</span>
            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant font-medium">
              Transcribing Kiosks
            </span>
          </div>
          <div className="mt-2 pl-space-xs flex items-center gap-1">
            <span className="font-clinical-data-mono text-[10px] text-tertiary font-medium">
              Auto-SOAP Pipeline Active
            </span>
          </div>
        </div>

        {/* Avg Wait Time */}
        <div className="flex flex-col bg-surface-container-lowest p-space-sm rounded shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary"></div>
          <div className="flex items-center justify-between pl-space-xs mb-1">
            <span className="font-metadata-micro text-metadata-micro text-outline uppercase font-bold tracking-wider">
              Avg Wait Time
            </span>
            <span className="material-symbols-outlined text-secondary text-base">schedule</span>
          </div>
          <div className="flex items-baseline gap-space-xs pl-space-xs">
            <span className="font-chief-complaint text-chief-complaint text-on-surface leading-none">
              14<span className="text-subheading font-subheading font-normal text-on-surface-variant">m</span>
            </span>
            <span className="font-metadata-micro text-metadata-micro text-primary font-semibold">Target &lt;20m</span>
          </div>
          <div className="mt-2 pl-space-xs flex items-center gap-2">
            <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
              <div className="bg-primary h-1.5 rounded-full" style={{ width: "70%" }}></div>
            </div>
            <span className="font-clinical-data-mono text-[10px] text-on-surface-variant">70%</span>
          </div>
        </div>

        {/* Resuscitation Bays */}
        <div className="flex flex-col bg-surface-container-lowest p-space-sm rounded shadow-sm relative overflow-hidden col-span-2 md:col-span-1">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-error-container"></div>
          <div className="flex items-center justify-between pl-space-xs mb-1">
            <span className="font-metadata-micro text-metadata-micro text-outline uppercase font-bold tracking-wider">
              Resus Bays
            </span>
            <span className="material-symbols-outlined text-error text-base">emergency_home</span>
          </div>
          <div className="flex items-baseline gap-space-xs pl-space-xs">
            <span className="font-chief-complaint text-chief-complaint text-on-surface leading-none">
              1<span className="text-subheading font-subheading font-normal text-outline">/4</span>
            </span>
            <span className="font-metadata-micro text-metadata-micro text-primary font-semibold">3 Open</span>
          </div>
          <div className="mt-2 pl-space-xs flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-error"></span>
            <span className="font-clinical-data text-[10px] text-on-surface-variant">
              Bay 1 (Occupied) · Bays 2-4 (Ready)
            </span>
          </div>
        </div>
      </div>

      {/* Main Multi-Pane Command Center Stage */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-md items-start">
        {/* Left / Center 70% (8 Cols on xl) */}
        <div className="xl:col-span-8 flex flex-col gap-space-md">
          {/* RED FLAG PRIORITY QUEUE */}
          <div className="flex flex-col gap-space-sm bg-surface-container-lowest p-space-md rounded shadow-sm">
            <div className="flex items-center justify-between pb-space-xs">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-error text-xl animate-bounce">warning</span>
                <h2 className="font-section-title text-section-title text-on-surface">Red Flag Priority Queue</h2>
                <span className="bg-error text-on-error font-clinical-data-mono text-metadata-micro px-2 py-0.5 rounded-full font-bold">
                  2 CRITICAL
                </span>
              </div>
              <span className="font-metadata-micro text-metadata-micro text-outline">Auto-refreshed 2s ago</span>
            </div>

            {/* Alert Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-sm">
              {redFlags.map((patient) => {
                const isSelected = selectedPatient.id === patient.id;
                const isAck = acknowledgedMap[patient.id];

                return (
                  <div
                    key={patient.id}
                    onClick={() => setSelectedPatient(patient)}
                    className={`flex flex-col justify-between bg-error-container/30 p-space-sm rounded shadow-sm relative overflow-hidden transition-all hover:shadow-md cursor-pointer border ${
                      isSelected ? "ring-2 ring-error border-error" : "border-transparent"
                    }`}
                  >
                    <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-error"></div>
                    <div className="pl-space-xs">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-space-xs">
                          <span className="font-clinical-data-mono text-body-strong text-error font-bold">
                            {patient.token}
                          </span>
                          <span className="font-body-strong text-body-strong text-on-surface font-semibold">
                            {patient.name}
                          </span>
                          <span className="font-clinical-data text-clinical-data text-on-surface-variant">
                            {patient.age}{patient.gender}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 bg-error text-on-error px-1.5 py-0.5 rounded font-clinical-data-mono text-[10px] font-bold">
                          <span className="material-symbols-outlined text-xs">timer</span>
                          <span>Wait: {patient.waitTime}</span>
                        </div>
                      </div>

                      {/* Rule detection chip */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        <span className="bg-error text-on-error px-1.5 py-0.5 rounded font-clinical-data-mono text-metadata-micro font-bold tracking-tight uppercase">
                          {patient.acuityTag}
                        </span>
                        <span className="bg-surface-container-lowest text-error px-1.5 py-0.5 rounded font-clinical-data text-metadata-micro font-medium">
                          {patient.acuitySubtag}
                        </span>
                      </div>

                      {/* Exact Patient Words */}
                      <div className="bg-surface-container-lowest/80 p-space-xs rounded mb-space-sm">
                        <p className="font-clinical-data text-clinical-data text-on-surface italic line-clamp-2">
                          {patient.chiefComplaint}
                        </p>
                      </div>

                      <div className="flex items-center justify-between font-metadata-micro text-metadata-micro text-on-surface-variant mb-space-sm">
                        <span>
                          Assigned: <strong className="text-on-surface">{patient.assignedTo}</strong>
                        </span>
                        <span className="font-clinical-data-mono text-error font-bold">
                          Vitals Alert: HR {patient.vitals.hr} ↑
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-space-xs pt-space-xs pl-space-xs">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTransferResus(patient);
                        }}
                        className="flex-1 h-7 bg-error text-on-error text-clinical-data font-clinical-data font-semibold rounded hover:bg-on-error-container transition-colors flex items-center justify-center gap-1 shadow-sm"
                      >
                        <span className="material-symbols-outlined text-xs">local_shipping</span>
                        <span>{patient.actionButtonLabel}</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAcknowledge(patient.id, patient.name);
                        }}
                        className={`px-space-sm h-7 text-clinical-data font-clinical-data font-medium rounded transition-colors shadow-sm ${
                          isAck
                            ? "bg-primary text-on-primary"
                            : "bg-surface-container hover:bg-surface-container-high text-on-surface"
                        }`}
                      >
                        {isAck ? "Acknowledged" : "Acknowledge"}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          showToast(`Calling ${patient.name} (${patient.token}) over PA system.`);
                        }}
                        className="px-space-xs h-7 bg-surface-container hover:bg-surface-container-high text-on-surface rounded transition-colors shadow-sm"
                        title="Call Patient"
                      >
                        <span className="material-symbols-outlined text-sm">campaign</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STANDARD CLINICAL QUEUE TABLE */}
          <div className="flex flex-col bg-surface-container-lowest p-space-md rounded shadow-sm">
            <div className="flex items-center justify-between pb-space-sm">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-xl">view_list</span>
                <h2 className="font-section-title text-section-title text-on-surface">
                  Standard Clinical Triage Stream
                </h2>
                <span className="bg-surface-container text-on-surface-variant font-clinical-data-mono text-metadata-micro px-2 py-0.5 rounded font-semibold">
                  18 In Flow
                </span>
              </div>

              <div className="flex items-center gap-space-xs">
                <span className="font-metadata-micro text-metadata-micro text-outline">Filter Acuity:</span>
                <button
                  onClick={() => setAcuityFilter("all")}
                  className={`px-2 py-0.5 font-clinical-data text-metadata-micro rounded font-medium transition-colors ${
                    acuityFilter === "all"
                      ? "bg-primary-container text-on-primary-container font-semibold"
                      : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  All Acuity
                </button>
                <button
                  onClick={() => setAcuityFilter("p2")}
                  className={`px-2 py-0.5 font-clinical-data text-metadata-micro rounded font-medium transition-colors ${
                    acuityFilter === "p2"
                      ? "bg-primary-container text-on-primary-container font-semibold"
                      : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  P2 Emergent
                </button>
                <button
                  onClick={() => setAcuityFilter("p3")}
                  className={`px-2 py-0.5 font-clinical-data text-metadata-micro rounded font-medium transition-colors ${
                    acuityFilter === "p3"
                      ? "bg-primary-container text-on-primary-container font-semibold"
                      : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  P3 Urgent
                </button>
              </div>
            </div>

            {/* Density Table Container */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant font-table-header text-table-header uppercase tracking-wider">
                    <th className="py-2 px-space-xs pl-space-sm">Token</th>
                    <th className="py-2 px-space-xs">Patient Details</th>
                    <th className="py-2 px-space-xs">Chief Complaint &amp; Acuity</th>
                    <th className="py-2 px-space-xs">Vitals Snapshot</th>
                    <th className="py-2 px-space-xs">Intake Status</th>
                    <th className="py-2 px-space-xs">Assigned Bay/Doc</th>
                    <th className="py-2 px-space-xs text-right pr-space-sm">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-transparent font-clinical-data text-clinical-data">
                  {filteredStandardQueue.map((patient, idx) => {
                    const isSelected = selectedPatient.id === patient.id;
                    const isEven = idx % 2 === 1;

                    return (
                      <tr
                        key={patient.id}
                        onClick={() => setSelectedPatient(patient)}
                        className={`transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-primary-container/15 font-semibold"
                            : isEven
                            ? "bg-surface-container-low/30 hover:bg-surface-container-low/60"
                            : "bg-surface-container-lowest hover:bg-surface-container-low/60"
                        }`}
                      >
                        <td className="py-2.5 px-space-xs pl-space-sm font-clinical-data-mono font-bold text-primary">
                          {patient.token}
                        </td>
                        <td className="py-2.5 px-space-xs">
                          <div className="flex flex-col">
                            <span className="font-body-strong text-body-strong text-on-surface">
                              {patient.name}
                            </span>
                            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                              {patient.age}{patient.gender} · {patient.uhid}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-space-xs max-w-xs">
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1">
                              <span
                                className={`font-clinical-data-mono text-[10px] px-1 rounded font-bold ${
                                  patient.priority === "P2"
                                    ? "bg-error-container text-on-error-container"
                                    : "bg-secondary-container text-on-secondary-container"
                                }`}
                              >
                                {patient.priority}
                              </span>
                              <span className="text-on-surface truncate">{patient.chiefComplaint}</span>
                            </div>
                            <span className="font-metadata-micro text-metadata-micro text-outline truncate">
                              {patient.subtext}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-space-xs">
                          <div className="flex flex-col font-clinical-data-mono text-metadata-micro">
                            <span className="text-on-surface">
                              BP: {patient.vitals.bp} · HR: {patient.vitals.hr}
                            </span>
                            {patient.vitals.tempAlert && (
                              <span className="text-error font-bold">
                                Temp: {patient.vitals.temp} ↑ · SpO2: {patient.vitals.spo2}
                              </span>
                            )}
                            {patient.vitals.spo2Alert && (
                              <span className="text-error font-bold">
                                SpO2: {patient.vitals.spo2} ↓ · Resp: {patient.vitals.resp}
                              </span>
                            )}
                            {!patient.vitals.tempAlert && !patient.vitals.spo2Alert && (
                              <span className="text-on-surface">
                                Temp: {patient.vitals.temp || "98.6°F"} · SpO2: {patient.vitals.spo2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-space-xs">
                          <div className="flex flex-col gap-1 w-28">
                            <div className="flex items-center justify-between text-[10px] font-metadata-micro">
                              <span className="text-primary font-bold">{patient.intakeStatusText}</span>
                            </div>
                            <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-primary h-1.5 rounded-full"
                                style={{ width: `${patient.intakeProgressPct}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-space-xs">
                          <div className="flex flex-col">
                            <span className="font-body-strong text-metadata-micro text-on-surface">
                              {patient.assignedTo}
                            </span>
                            <span className="font-metadata-micro text-metadata-micro text-outline">
                              {patient.location}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-space-xs text-right pr-space-sm">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              showToast(`Action executed: ${patient.actionButtonLabel} for ${patient.name}`);
                            }}
                            className="px-2 py-1 bg-surface-container hover:bg-surface-container-high text-on-surface font-clinical-data text-metadata-micro font-medium rounded transition-colors shadow-sm"
                          >
                            {patient.actionButtonLabel}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Dock 30% (4 Cols on xl) - SELECTED PATIENT TIER-1 DOCK */}
        <div className="xl:col-span-4 flex flex-col gap-space-md">
          <div className="bg-surface-container-lowest p-space-md rounded shadow-sm flex flex-col gap-space-md relative overflow-hidden">
            {/* Sticky Red Flag Indicator Header on the Dock */}
            <div
              className={`p-space-xs rounded -mx-space-xs -mt-space-xs flex items-center justify-between ${
                selectedPatient.priority === "P1"
                  ? "bg-error text-on-error"
                  : "bg-primary text-on-primary"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base animate-pulse">
                  {selectedPatient.priority === "P1" ? "crisis_alert" : "how_to_reg"}
                </span>
                <span className="font-body-strong text-metadata-micro uppercase font-bold tracking-wider">
                  {selectedPatient.priority === "P1" ? "Tier-1 Resus Target" : "Triage Active Inspect"}
                </span>
              </div>
              <span className="font-clinical-data-mono text-[10px] bg-black/20 px-1.5 py-0.5 rounded font-bold">
                TOKEN {selectedPatient.token}
              </span>
            </div>

            {/* Patient Header & Demographic Pill */}
            <div className="flex items-start gap-space-sm">
              <img
                className="w-14 h-14 rounded object-cover shadow-sm shrink-0 ring-1 ring-outline-variant"
                alt="Patient portrait"
                src={
                  selectedPatient.photoUrl ||
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuDgnos9HAVxielAQwv7FRp6eTqKBkgsKF1-6RZgjPEuWU2dncv0pZ3IPozOx_eLUZvL-yKNTApP-l6axojWQZOtjEdANlxpEUqs1x_swAEay-6YZxhpYtjEjwzWldAygdmelCYYS3t6PCuI_5N3wrvTqJSfnkxcCttYJwtXA6tKDwTigIUj6jcECciiugtQ8BYPsfmeWqZeMrT4J5qMz9vW-KjpWdZ19egh_KKIvvPjraz_6fNVL6TZ"
                }
              />
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-section-title text-section-title text-on-surface font-bold truncate">
                    {selectedPatient.name}
                  </h3>
                  <span className="bg-primary/10 text-primary font-clinical-data-mono text-[10px] px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-xs">verified</span> ABHA
                  </span>
                </div>
                <span className="font-clinical-data text-clinical-data text-on-surface-variant">
                  {selectedPatient.age} Yrs · {selectedPatient.gender === "M" ? "Male" : "Female"} · {selectedPatient.bloodGroup}
                </span>
                <span className="font-clinical-data-mono text-metadata-micro text-outline truncate">
                  UHID: {selectedPatient.uhid}
                </span>
              </div>
            </div>

            {/* Live Telemetry Vitals Matrix */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-metadata-micro text-metadata-micro text-outline uppercase font-bold tracking-wider">
                  Live Telemetry Strip (St-02)
                </span>
                <span className="font-clinical-data-mono text-metadata-micro text-primary flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping"></span> Live Bedside
                </span>
              </div>

              <div className="grid grid-cols-2 gap-space-xs">
                <div className="bg-surface-container-low p-2 rounded flex flex-col">
                  <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    Blood Pressure
                  </span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="font-clinical-data-mono text-body-strong text-error font-bold">
                      {selectedPatient.vitals.bp}
                    </span>
                    <span className="font-clinical-data-mono text-metadata-micro text-error">↑ mmHg</span>
                  </div>
                </div>

                <div className="bg-surface-container-low p-2 rounded flex flex-col">
                  <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    Heart Rate
                  </span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="font-clinical-data-mono text-body-strong text-error font-bold">
                      {selectedPatient.vitals.hr}
                    </span>
                    <span className="font-clinical-data-mono text-metadata-micro text-error">↑ Sinus Tach</span>
                  </div>
                </div>

                <div className="bg-surface-container-low p-2 rounded flex flex-col">
                  <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    SpO2 (Room Air)
                  </span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="font-clinical-data-mono text-body-strong text-on-surface font-bold">
                      {selectedPatient.vitals.spo2}
                    </span>
                    <span className="font-clinical-data-mono text-metadata-micro text-outline">Low Normal</span>
                  </div>
                </div>

                <div className="bg-surface-container-low p-2 rounded flex flex-col">
                  <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    BMG / Cap Glucose
                  </span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="font-clinical-data-mono text-body-strong text-on-surface font-bold">
                      {selectedPatient.vitals.bmg || "118"}
                    </span>
                    <span className="font-clinical-data-mono text-metadata-micro text-outline">mg/dL</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Voice Snippet Player with Audio Waveform & AI Transcription */}
            <div className="flex flex-col gap-1.5 bg-surface-container-low p-space-sm rounded">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-primary text-sm">record_voice_over</span>
                  <span className="font-metadata-micro text-metadata-micro text-on-surface font-bold uppercase tracking-wider">
                    Triage Audio Intake
                  </span>
                </div>
                <span className="bg-primary-container text-on-primary-container font-clinical-data-mono text-[10px] px-1.5 rounded font-bold">
                  98% AI Match
                </span>
              </div>

              {/* Waveform SVG representation */}
              <div className="flex items-center gap-2 bg-surface-container-lowest p-2 rounded mt-1">
                <button
                  onClick={() => {
                    setIsPlayingAudio(!isPlayingAudio);
                    showToast(isPlayingAudio ? "Audio paused." : "Playing triage voice stream...");
                  }}
                  className="h-7 w-7 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-sm hover:bg-primary-container transition-colors"
                >
                  <span className="material-symbols-outlined text-base">
                    {isPlayingAudio ? "pause" : "play_arrow"}
                  </span>
                </button>

                <div className="flex-1 flex items-center gap-0.5 h-6">
                  <span className={`w-1 bg-primary rounded-full ${isPlayingAudio ? "h-5 animate-pulse" : "h-3"}`}></span>
                  <span className={`w-1 bg-primary rounded-full ${isPlayingAudio ? "h-6 animate-pulse" : "h-5"}`}></span>
                  <span className={`w-1 bg-primary rounded-full ${isPlayingAudio ? "h-4 animate-pulse" : "h-2"}`}></span>
                  <span className={`w-1 bg-primary rounded-full ${isPlayingAudio ? "h-6 animate-pulse" : "h-4"}`}></span>
                  <span className={`w-1 bg-primary rounded-full ${isPlayingAudio ? "h-5 animate-pulse" : "h-6"}`}></span>
                  <span className={`w-1 bg-primary rounded-full ${isPlayingAudio ? "h-4 animate-pulse" : "h-3"}`}></span>
                  <span className={`w-1 bg-primary rounded-full ${isPlayingAudio ? "h-6 animate-pulse" : "h-5"}`}></span>
                  <span className={`w-1 bg-primary rounded-full ${isPlayingAudio ? "h-5 animate-pulse" : "h-4"}`}></span>
                  <span className="w-1 bg-primary rounded-full h-2"></span>
                  <span className="w-1 bg-primary-container rounded-full h-4"></span>
                  <span className="w-1 bg-outline-variant rounded-full h-5"></span>
                  <span className="w-1 bg-outline-variant rounded-full h-2"></span>
                  <span className="w-1 bg-outline-variant rounded-full h-4"></span>
                  <span className="w-1 bg-outline-variant rounded-full h-6"></span>
                  <span className="w-1 bg-outline-variant rounded-full h-3"></span>
                  <span className="w-1 bg-outline-variant rounded-full h-2"></span>
                </div>
                <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant shrink-0">
                  {selectedPatient.audioDuration}
                </span>
              </div>

              <p className="font-clinical-data text-clinical-data text-on-surface mt-1 italic leading-tight">
                {selectedPatient.audioQuote}
              </p>

              <div className="flex items-center gap-1 mt-1 text-metadata-micro text-outline font-metadata-micro">
                <span className="material-symbols-outlined text-xs">translate</span>
                <span>{selectedPatient.audioTranslation || "Spoken in Hindi (Auto-translated to English)"}</span>
              </div>
            </div>

            {/* ECG Strip Preview */}
            <div className="flex flex-col gap-1.5 bg-surface-container-low p-space-sm rounded">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-error text-sm">monitor_heart</span>
                  <span className="font-metadata-micro text-metadata-micro text-error font-bold uppercase tracking-wider">
                    12-Lead ECG Analysis
                  </span>
                </div>
                <span className="font-clinical-data-mono text-[10px] text-error font-bold bg-error-container/60 px-1 rounded">
                  CRITICAL ELEVATION
                </span>
              </div>

              {/* ECG Waveform Graphical Simulation */}
              <div className="bg-inverse-surface text-primary-fixed p-2 rounded flex flex-col gap-1 overflow-hidden shadow-inner">
                <div className="flex items-center justify-between font-clinical-data-mono text-[10px] text-inverse-on-surface/70 border-b border-inverse-surface/40 pb-1">
                  <span>{selectedPatient.ecgLead || "Lead V3 - Anterior"}</span>
                  <span className="text-error font-bold">{selectedPatient.ecgStElevation || "ST +3.2mm"}</span>
                </div>
                <svg
                  className="w-full h-12 stroke-primary-fixed fill-none"
                  preserveAspectRatio="none"
                  viewBox="0 0 300 50"
                >
                  <path
                    d="M0,25 L30,25 L35,22 L40,25 L50,25 L55,30 L60,5 L68,45 L74,18 L85,18 L95,25 L130,25 L135,22 L140,25 L150,25 L155,30 L160,5 L168,45 L174,18 L185,18 L195,25 L230,25 L235,22 L240,25 L250,25 L255,30 L260,5 L268,45 L274,18 L285,18 L295,25 L300,25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.75"
                  ></path>
                </svg>
              </div>

              <span className="font-clinical-data-mono text-metadata-micro text-error font-semibold leading-tight">
                {selectedPatient.ecgFlag ||
                  "Flag: ST elevation in V2-V4 anterior leads. Immediate Catheterization Lab Alert protocol triggered."}
              </span>
            </div>

            {/* Emergency Action Execution Buttons */}
            <div className="flex flex-col gap-space-xs pt-space-xs">
              <button
                onClick={handleCodeStemi}
                className="w-full h-9 bg-error text-on-error font-clinical-data text-body-strong font-bold rounded hover:bg-on-error-container transition-colors flex items-center justify-center gap-2 shadow-sm uppercase tracking-wider active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-lg animate-ping">crisis_alert</span>
                <span>Code STEMI Alert · Notify Cath Lab</span>
              </button>

              <div className="grid grid-cols-2 gap-space-xs">
                <button
                  onClick={() => showToast(`Dispatched: ${selectedPatient.name} transferred to Bay 01.`)}
                  className="h-8 bg-surface-container-high text-on-surface hover:bg-surface-container-highest font-clinical-data text-clinical-data font-semibold rounded transition-colors shadow-sm flex items-center justify-center gap-1 active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined text-sm">airline_seat_flat</span>
                  <span>Bay 01 Transfer</span>
                </button>
                <button
                  onClick={() => showToast(`Notification broadcasted to Dr. Verma STAT for ${selectedPatient.name}.`)}
                  className="h-8 bg-surface-container-high text-on-surface hover:bg-surface-container-highest font-clinical-data text-clinical-data font-semibold rounded transition-colors shadow-sm flex items-center justify-center gap-1 active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined text-sm">person_check</span>
                  <span>Dr. Verma STAT</span>
                </button>
              </div>

              <Link
                href="/patient-overview"
                className="w-full h-8 bg-primary hover:bg-primary-container text-on-primary font-clinical-data text-clinical-data font-semibold rounded transition-colors shadow-sm flex items-center justify-center gap-1.5 active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-sm">open_in_new</span>
                <span>Open Comprehensive Clinical Workspace</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Add Walk-in Modal */}
      {showAddWalkinModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-outline-variant flex flex-col">
            <div className="p-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">person_add</span>
                <h3 className="font-section-title text-on-surface">Add Walk-in Triage Patient</h3>
              </div>
              <button
                onClick={() => setShowAddWalkinModal(false)}
                className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddWalkinSubmit} className="p-6 space-y-4 text-clinical-data">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-on-surface-variant uppercase">Patient Full Name</label>
                  <input
                    type="text"
                    required
                    value={walkinName}
                    onChange={(e) => setWalkinName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full h-9 px-3 bg-surface-container-low rounded border border-outline-variant text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-on-surface-variant uppercase">Age</label>
                    <input
                      type="number"
                      required
                      value={walkinAge}
                      onChange={(e) => setWalkinAge(e.target.value)}
                      placeholder="45"
                      className="w-full h-9 px-3 bg-surface-container-low rounded border border-outline-variant text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-on-surface-variant uppercase">Gender</label>
                    <select
                      value={walkinGender}
                      onChange={(e) => setWalkinGender(e.target.value as "M" | "F")}
                      className="w-full h-9 px-2 bg-surface-container-low rounded border border-outline-variant text-on-surface focus:outline-none focus:border-primary"
                    >
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-on-surface-variant uppercase">Triage Stratum Acuity</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setWalkinPriority("P1")}
                    className={`h-9 rounded font-bold text-xs flex items-center justify-center transition-colors ${
                      walkinPriority === "P1"
                        ? "bg-error text-on-error"
                        : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                    }`}
                  >
                    P1 Critical STAT
                  </button>
                  <button
                    type="button"
                    onClick={() => setWalkinPriority("P2")}
                    className={`h-9 rounded font-bold text-xs flex items-center justify-center transition-colors ${
                      walkinPriority === "P2"
                        ? "bg-error-container text-on-error-container"
                        : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                    }`}
                  >
                    P2 Emergent
                  </button>
                  <button
                    type="button"
                    onClick={() => setWalkinPriority("P3")}
                    className={`h-9 rounded font-bold text-xs flex items-center justify-center transition-colors ${
                      walkinPriority === "P3"
                        ? "bg-secondary-container text-on-secondary-container"
                        : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                    }`}
                  >
                    P3 Urgent
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-on-surface-variant uppercase">Chief Complaint &amp; Intake Note</label>
                <textarea
                  required
                  rows={3}
                  value={walkinComplaint}
                  onChange={(e) => setWalkinComplaint(e.target.value)}
                  placeholder="Describe sudden onset symptoms, duration, location, radiation..."
                  className="w-full p-3 bg-surface-container-low rounded border border-outline-variant text-on-surface focus:outline-none focus:border-primary text-xs resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddWalkinModal(false)}
                  className="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded font-clinical-data text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-on-primary hover:bg-primary-container rounded font-clinical-data text-xs font-semibold shadow-sm"
                >
                  Admit to Triage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
