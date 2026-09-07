"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  HospitalIcon,
  ArrowDropDownIcon,
  StethoscopeIcon,
  SearchIcon,
  QrCodeIcon,
  VolumeUpIcon,
  VolumeOffIcon,
  ChecklistIcon,
  NotificationsIcon,
  CloseIcon,
  CheckIcon,
} from "./Icons";

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export default function Header({ searchQuery = "", onSearchChange }: HeaderProps) {
  const [internalSearch, setInternalSearch] = useState(searchQuery);
  const [audioMuted, setAudioMuted] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showCampusMenu, setShowCampusMenu] = useState(false);
  const [showOpdMenu, setShowOpdMenu] = useState(false);
  const [showDoctorMenu, setShowDoctorMenu] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const [selectedCampus, setSelectedCampus] = useState("Apollo Indraprastha · Central");
  const [selectedOpd, setSelectedOpd] = useState("OPD · Gen Med & Cardiology");
  const [doctorStatus, setDoctorStatus] = useState<"available" | "busy" | "away">("available");

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut ⌘K or / to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setShowNotifications(false);
        setShowOrders(false);
        setShowCampusMenu(false);
        setShowOpdMenu(false);
        setShowDoctorMenu(false);
        setShowQrModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearch = (val: string) => {
    setInternalSearch(val);
    if (onSearchChange) onSearchChange(val);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-14 bg-surface-container-lowest/90 backdrop-blur-md z-40 px-gutter-normal flex items-center justify-between shadow-[0_1px_6px_rgba(0,0,0,0.03)] border-b border-surface-container/70 print:hidden">
        {/* Left: Brand Logo & Station Selectors */}
        <div className="flex items-center gap-space-md shrink-0">
          <div className="flex items-center gap-2.5 pr-space-md border-r border-surface-container/80">
            {/* High-tech pulsing logo */}
            <div className="relative group cursor-pointer">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center text-on-primary shadow-xs transition-transform group-hover:scale-105">
                <svg
                  className="w-4 h-4 text-on-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  <path d="M3.22 12H9.5l1.5-3 2 6 1.5-3h6.28" />
                </svg>
              </div>
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-fixed opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-body-strong text-clinical-data text-primary leading-tight tracking-tight uppercase font-bold">
                CareFlow
              </span>
              <span className="font-metadata-micro text-[10px] text-on-surface-variant font-medium tracking-wide">
                WORKSPACE
              </span>
            </div>
          </div>

          {/* Campus Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowCampusMenu(!showCampusMenu);
                setShowOpdMenu(false);
              }}
              className="hidden xl:flex items-center gap-2.5 px-3 py-1.5 bg-surface-container/70 hover:bg-surface-container rounded-lg cursor-pointer transition-all border border-surface-container hover:border-outline-variant/60"
            >
              <HospitalIcon className="w-4 h-4 text-primary shrink-0" />
              <div className="flex flex-col text-left leading-tight">
                <span className="font-clinical-data text-metadata-micro text-on-surface font-semibold">
                  {selectedCampus}
                </span>
                <span className="font-metadata-micro text-[10px] text-on-surface-variant">
                  Campus Main Unit
                </span>
              </div>
              <ArrowDropDownIcon className="w-3.5 h-3.5 text-on-surface-variant shrink-0 ml-1" />
            </button>

            {showCampusMenu && (
              <div className="absolute top-full left-0 mt-1 w-64 glass-dropdown rounded-xl p-1.5 z-50 border border-surface-container animate-in fade-in slide-in-from-top-1 duration-150">
                <span className="px-2 py-1 text-[10px] font-bold text-outline uppercase tracking-wider block">
                  Switch Hospital Campus
                </span>
                {["Apollo Indraprastha · Central", "Apollo Hospital · South Wing", "Max Super Speciality · Unit 2"].map((camp) => (
                  <button
                    key={camp}
                    onClick={() => {
                      setSelectedCampus(camp);
                      setShowCampusMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-clinical-data flex items-center justify-between transition-colors ${
                      selectedCampus === camp
                        ? "bg-primary-container/15 text-primary font-semibold"
                        : "hover:bg-surface-container text-on-surface"
                    }`}
                  >
                    <span>{camp}</span>
                    {selectedCampus === camp && (
                      <CheckIcon className="w-3.5 h-3.5 text-primary shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Clinic/OPD Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowOpdMenu(!showOpdMenu);
                setShowCampusMenu(false);
              }}
              className="hidden 2xl:flex items-center gap-2.5 px-3 py-1.5 bg-surface-container-low hover:bg-surface-container rounded-lg cursor-pointer transition-all border border-surface-container hover:border-outline-variant/60"
            >
              <StethoscopeIcon className="w-4 h-4 text-secondary shrink-0" />
              <div className="flex flex-col text-left leading-tight">
                <span className="font-clinical-data text-metadata-micro text-on-surface font-semibold">
                  {selectedOpd}
                </span>
                <span className="font-metadata-micro text-[10px] text-on-surface-variant">
                  Wing B · Stations 04-12
                </span>
              </div>
              <ArrowDropDownIcon className="w-3.5 h-3.5 text-on-surface-variant shrink-0 ml-1" />
            </button>

            {showOpdMenu && (
              <div className="absolute top-full left-0 mt-1 w-64 glass-dropdown rounded-xl p-1.5 z-50 border border-surface-container animate-in fade-in slide-in-from-top-1 duration-150">
                <span className="px-2 py-1 text-[10px] font-bold text-outline uppercase tracking-wider block">
                  Select OPD Station Cluster
                </span>
                {["OPD · Gen Med & Cardiology", "OPD · Pulmonary & Chest", "OPD · Emergency Triage", "OPD · Diabetology & Endocrine"].map((opd) => (
                  <button
                    key={opd}
                    onClick={() => {
                      setSelectedOpd(opd);
                      setShowOpdMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-clinical-data flex items-center justify-between transition-colors ${
                      selectedOpd === opd
                        ? "bg-secondary/15 text-secondary font-semibold"
                        : "hover:bg-surface-container text-on-surface"
                    }`}
                  >
                    <span>{opd}</span>
                    {selectedOpd === opd && (
                      <CheckIcon className="w-3.5 h-3.5 text-secondary shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Middle: Universal Search Bar */}
        <div className="flex-1 max-w-xl mx-space-md">
          <div className="relative flex items-center w-full group">
            <SearchIcon className="absolute left-2.5 text-outline group-focus-within:text-primary w-4 h-4 transition-colors pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={internalSearch}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full h-8 pl-8 pr-16 text-clinical-data font-clinical-data bg-surface-container-low/80 hover:bg-surface-container-low text-on-surface placeholder:text-outline/90 rounded-lg border border-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-2xs transition-all"
              placeholder="Search patient by Name, UHID, ABHA ID, Token #, or Scan QR [⌘K]"
            />
            {internalSearch && (
              <button
                onClick={() => handleSearch("")}
                className="absolute right-12 text-outline hover:text-on-surface p-0.5 rounded-full"
              >
                <CloseIcon className="w-3.5 h-3.5" />
              </button>
            )}
            <div className="absolute right-2 flex items-center gap-1.5">
              <button
                onClick={() => setShowQrModal(true)}
                className="text-outline hover:text-primary transition-colors p-0.5 rounded flex items-center"
                title="Scan Patient Barcode / ABHA QR"
              >
                <QrCodeIcon className="w-3.5 h-3.5" />
              </button>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 bg-surface-container font-clinical-data-mono text-[10px] text-on-surface-variant rounded border border-outline-variant/40 shadow-3xs font-semibold">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right: Telemetry Status, Audio Monitor, Alert Dropdowns & Physician Card */}
        <div className="flex items-center gap-space-sm shrink-0">
          {/* FHIR R4 Status Pill */}
          <div
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-surface-container-low/90 rounded-lg border border-surface-container shadow-3xs cursor-pointer hover:bg-surface-container transition-colors"
            title="Fast Healthcare Interoperability Resources (FHIR) API v4.0.1 active. Latency: 22ms"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="font-clinical-data-mono text-[10px] text-on-surface font-semibold">
              FHIR R4 Synced
            </span>
          </div>

          {/* Red Flag Audio Monitor Button */}
          <button
            onClick={() => setAudioMuted(!audioMuted)}
            className={`relative h-8 px-2 flex items-center gap-1.5 rounded-lg transition-all border ${
              audioMuted
                ? "bg-surface-container text-outline border-transparent hover:text-on-surface"
                : "bg-primary-container/10 text-primary-container border-primary-container/30 hover:bg-primary-container/20 shadow-xs"
            }`}
            title={audioMuted ? "Audio Monitor Muted (Click to Unmute)" : "Red Flag Triage Audio Alarm Active"}
          >
            {audioMuted ? (
              <VolumeOffIcon className="w-4 h-4" />
            ) : (
              <VolumeUpIcon className="w-4 h-4 text-primary" />
            )}
            {!audioMuted && (
              <span className="flex items-center gap-0.5 h-3">
                <span className="w-0.5 h-2 bg-primary rounded-full animate-[waveBar_0.8s_ease-in-out_infinite]"></span>
                <span className="w-0.5 h-3 bg-primary rounded-full animate-[waveBar_1.2s_ease-in-out_infinite]"></span>
                <span className="w-0.5 h-1.5 bg-primary rounded-full animate-[waveBar_0.6s_ease-in-out_infinite]"></span>
              </span>
            )}
          </button>

          {/* Pending Orders Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowOrders(!showOrders);
                setShowNotifications(false);
              }}
              className="relative h-8 w-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors border border-transparent hover:border-surface-container"
              title="Pending Orders / Clinical Tasks"
            >
              <ChecklistIcon className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-secondary text-on-secondary rounded-full font-clinical-data-mono text-[9px] flex items-center justify-center leading-none font-bold shadow-xs">
                5
              </span>
            </button>

            {showOrders && (
              <div className="absolute top-full right-0 mt-1 w-80 glass-dropdown rounded-xl p-3 z-50 border border-surface-container animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                  <span className="font-body-strong text-clinical-data text-on-surface">
                    Pending Clinical Orders
                  </span>
                  <span className="bg-secondary/15 text-secondary font-clinical-data-mono text-[10px] px-1.5 py-0.5 rounded font-bold">
                    5 Due
                  </span>
                </div>
                <div className="flex flex-col gap-2 pt-2 max-h-64 overflow-y-auto">
                  {[
                    { id: "1", title: "Stat Troponin-I Repeat (#104 Rahul)", due: "In 15m", urgent: true },
                    { id: "2", title: "IV Furosemide 40mg Push (#118 Sunita)", due: "Immediate", urgent: true },
                    { id: "3", title: "Chest X-Ray Portable (Bay 02)", due: "In 25m", urgent: false },
                    { id: "4", title: "Complete Blood Count Review (#121 Rajesh)", due: "In 40m", urgent: false },
                    { id: "5", title: "Dietician Diabetes Consult (#132 Vikas)", due: "Routine", urgent: false },
                  ].map((order) => (
                    <div
                      key={order.id}
                      className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors flex items-start gap-2 text-left"
                    >
                      <span className={`w-2 h-2 rounded-full mt-1.5 ${order.urgent ? "bg-error" : "bg-primary"}`}></span>
                      <div className="flex-1 min-w-0">
                        <span className="font-clinical-data text-clinical-data text-on-surface block truncate font-medium">
                          {order.title}
                        </span>
                        <span className="font-metadata-micro text-[10px] text-outline">
                          Status: {order.due}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Critical Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowOrders(false);
              }}
              className="relative h-8 w-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors border border-transparent hover:border-surface-container"
              title="Critical Clinical Alerts"
            >
              <NotificationsIcon className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-error text-on-error rounded-full font-clinical-data-mono text-[9px] flex items-center justify-center leading-none font-bold animate-pulse shadow-xs">
                3
              </span>
            </button>

            {showNotifications && (
              <div className="absolute top-full right-0 mt-1 w-80 glass-dropdown rounded-xl p-3 z-50 border border-surface-container animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                  <span className="font-body-strong text-clinical-data text-on-surface">
                    Critical Red Flag Alerts
                  </span>
                  <span className="bg-error text-on-error font-clinical-data-mono text-[10px] px-1.5 py-0.5 rounded font-bold">
                    3 Action Required
                  </span>
                </div>
                <div className="flex flex-col gap-2 pt-2 max-h-64 overflow-y-auto">
                  {[
                    { id: "n1", title: "ST-Elevation Flagged: #104 Rahul Sharma", sub: "V2-V4 ST elevation detected by machine algorithm", time: "3m ago" },
                    { id: "n2", title: "Critical SpO2 Drop (91%): #118 Sunita Devi", sub: "Patient in respiratory distress in Chair 04", time: "6m ago" },
                    { id: "n3", title: "Lab Critical Alert: Fasting Glucose 248 mg/dL", sub: "Urgent endocrinologist counter-sign pending", time: "18m ago" },
                  ].map((alert) => (
                    <div
                      key={alert.id}
                      className="p-2 rounded-lg bg-error-container/20 border border-error-container/50 flex flex-col gap-0.5 text-left"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-body-strong text-clinical-data text-on-error-container font-semibold truncate">
                          {alert.title}
                        </span>
                        <span className="font-clinical-data-mono text-[9px] text-outline">
                          {alert.time}
                        </span>
                      </div>
                      <p className="font-metadata-micro text-[11px] text-on-surface-variant">
                        {alert.sub}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Physician Profile Card with Status Dropdown */}
          <div className="relative border-l border-surface-container pl-space-xs">
            <button
              onClick={() => setShowDoctorMenu(!showDoctorMenu)}
              className="flex items-center gap-2 px-1.5 py-1 rounded-lg hover:bg-surface-container transition-colors"
            >
              <div className="hidden md:flex flex-col text-right">
                <span className="font-clinical-data text-metadata-micro text-on-surface font-semibold leading-tight flex items-center gap-1 justify-end">
                  Dr. R. Verma
                  <span className={`h-1.5 w-1.5 rounded-full ${
                    doctorStatus === "available" ? "bg-primary" : doctorStatus === "busy" ? "bg-error" : "bg-secondary"
                  }`}></span>
                </span>
                <span className="font-metadata-micro text-[10px] text-on-surface-variant leading-tight">
                  Chief of Clinical Services
                </span>
              </div>
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-primary-container text-on-primary flex items-center justify-center text-xs font-bold ring-2 ring-primary/20 shadow-xs">
                  RV
                </div>
                <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-surface-container-lowest ${
                  doctorStatus === "available" ? "bg-primary" : doctorStatus === "busy" ? "bg-error" : "bg-secondary"
                }`}></span>
              </div>
            </button>

            {showDoctorMenu && (
              <div className="absolute top-full right-0 mt-1 w-56 glass-dropdown rounded-xl p-2 z-50 border border-surface-container animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-2 py-1.5 border-b border-surface-container mb-1">
                  <span className="font-body-strong text-clinical-data text-on-surface block font-semibold">
                    Dr. Rohit Verma
                  </span>
                  <span className="font-metadata-micro text-[10px] text-outline">
                    M.D. Internal Medicine · Reg #48291
                  </span>
                </div>
                <span className="px-2 py-1 text-[10px] font-bold text-outline uppercase tracking-wider block">
                  Physician Availability Status
                </span>
                {[
                  { key: "available", label: "Available for Consults", color: "bg-primary" },
                  { key: "busy", label: "In Critical Procedure / STEMI", color: "bg-error" },
                  { key: "away", label: "Break / Rounding Wards", color: "bg-secondary" },
                ].map((st) => (
                  <button
                    key={st.key}
                    onClick={() => {
                      setDoctorStatus(st.key as "available" | "busy" | "away");
                      setShowDoctorMenu(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded-lg text-clinical-data hover:bg-surface-container flex items-center gap-2 text-on-surface transition-colors"
                  >
                    <span className={`h-2 w-2 rounded-full ${st.color}`}></span>
                    <span className="text-[12px]">{st.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* QR Scanner Simulation Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="glass-panel rounded-2xl max-w-sm w-full p-6 shadow-2xl flex flex-col items-center gap-4 text-center border border-surface-container relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-3 right-3 text-outline hover:text-on-surface p-1 rounded-full"
            >
              <CloseIcon className="w-4 h-4" />
            </button>

            <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <QrCodeIcon className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-section-title text-section-title text-on-surface">
                ABHA &amp; Patient QR Scanner
              </h3>
              <p className="text-metadata-micro text-outline mt-1">
                Point workstation barcode gun or camera at the patient token / Ayushman Bharat Health card
              </p>
            </div>

            {/* Viewfinder box with laser scanner animation */}
            <div className="relative w-48 h-48 rounded-xl border-2 border-dashed border-primary/60 bg-surface-container-lowest flex items-center justify-center overflow-hidden shadow-inner">
              <div className="absolute left-0 right-0 h-0.5 bg-primary shadow-[0_0_8px_#005c55] animate-laser"></div>
              <QrCodeIcon className="w-16 h-16 text-outline/20" />
            </div>

            <button
              onClick={() => {
                handleSearch("Rahul Sharma");
                setShowQrModal(false);
              }}
              className="w-full py-2 bg-primary text-on-primary rounded-lg text-clinical-data font-semibold hover:bg-primary-container transition-colors shadow-xs"
            >
              Simulate Instant ABHA Scan
            </button>
          </div>
        </div>
      )}
    </>
  );
}
