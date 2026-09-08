"use client";

import React, { useState, useEffect } from "react";

export default function CpoeOrdersPage() {
  // Timer state
  const [minutes, setMinutes] = useState(26);
  const [seconds, setSeconds] = useState(14);

  // Tab state
  const [activeTab, setActiveTab] = useState<"active" | "cath" | "nursing" | "completed" | "discontinued">("active");

  // Modals & Interactivity
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [showPocusModal, setShowPocusModal] = useState(false);
  const [showProtocolModal, setShowProtocolModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showIntraOpRxModal, setShowIntraOpRxModal] = useState(false);
  const [showNurseTaskModal, setShowNurseTaskModal] = useState(false);
  const [showEcgModal, setShowEcgModal] = useState(false);

  // Hand-off state
  const [handoffState, setHandoffState] = useState<"standby" | "in-motion">("standby");

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // CPOE form
  const [orderCategory, setOrderCategory] = useState("Interventional Cardiology / Cath Lab Suite");
  const [orderName, setOrderName] = useState("Unfractionated Heparin Bolus (70 units/kg STAT on radial sheath cannulation)");
  const [orderPriority, setOrderPriority] = useState("STAT P1 (Immediate <15 min)");
  const [orderRoute, setOrderRoute] = useState("IV Direct Radial Sheath Flush");
  const [orderInstructions, setOrderInstructions] = useState("Target ACT between 250-300 seconds. Draw repeat ACT at 30 minutes post-bolus.");

  // Secondary orders list additions
  const [customOrders, setCustomOrders] = useState<Array<{ id: string; name: string; category: string; priority: string; time: string }>>([]);

  // Increment timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prevSec => {
        if (prevSec >= 59) {
          setMinutes(prevMin => prevMin + 1);
          return 0;
        }
        return prevSec + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleHandoff = () => {
    setHandoffState("in-motion");
    showToast("Transfer Team notified · Bay 02 to Cath Lab 01 en route");
  };

  const handleCreateOrder = () => {
    if (!orderName.trim()) return;
    const newOrd = {
      id: "ord-" + Date.now(),
      name: orderName,
      category: orderCategory,
      priority: orderPriority,
      time: `${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2, "0")} IST`,
    };
    setCustomOrders(prev => [newOrd, ...prev]);
    setShowOrderModal(false);
    showToast(`CPOE Order [${orderName.slice(0, 32)}...] logged & dispatched to Pharmacy/Cath Lab.`);
  };

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <div className="flex flex-col w-full">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary-container text-on-primary-container px-space-md py-space-sm rounded-xl shadow-2xl flex items-center gap-space-sm border border-primary/20 animate-in fade-in slide-in-from-bottom-2">
          <span className="material-symbols-outlined text-2xl text-primary">check_circle</span>
          <div className="flex flex-col">
            <span className="font-body-strong text-clinical-data font-bold">Cath Lab Action Verified</span>
            <span className="font-metadata-micro text-metadata-micro opacity-90 font-clinical-data-mono">{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* STICKY PATIENT CLINICAL BANNER WITH ACTIVE RED FLAG & STEMI PATHWAY TRACKER */}
      <section className="bg-surface-container-lowest shadow-sm rounded-xl p-space-md mb-space-md border border-outline-variant/30">
        {/* Red Flag Acute Alert Ribbon */}
        <div className="bg-error text-on-error px-space-md py-space-xs rounded-lg flex items-center justify-between shadow-sm mb-space-sm flex-wrap gap-2">
          <div className="flex items-center gap-space-sm flex-wrap">
            <span className="material-symbols-outlined text-base animate-pulse">crisis_alert</span>
            <span className="font-body-strong text-body-strong tracking-wide uppercase">
              P1 Critical Pathway: Acute Anterior STEMI Emergency Protocol
            </span>
            <span className="bg-surface-container-lowest text-error px-space-xs py-0.5 rounded text-metadata-micro font-clinical-data-mono font-bold">
              ACC/AHA &lt;90m Door-to-Balloon
            </span>
          </div>
          <div className="flex items-center gap-space-md">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-sm">schedule</span>
              <span className="font-metadata-micro text-metadata-micro uppercase">Door-to-Balloon Elapsed:</span>
              <span className="font-clinical-data-mono text-subheading font-bold tracking-tight text-white" id="d2b-counter">
                {formattedTime}
              </span>
            </div>
            <span className="h-4 w-px bg-error-container opacity-40"></span>
            <div className="flex items-center gap-space-xs">
              <span className="h-2 w-2 rounded-full bg-surface-container-lowest animate-ping"></span>
              <span className="font-metadata-micro text-metadata-micro uppercase font-semibold">
                Cath Lab 01 Prep Stage 2 Active
              </span>
            </div>
          </div>
        </div>

        {/* Patient Metadata Row */}
        <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary font-section-title font-bold shadow-inner">
                RS
              </div>
              <span className="absolute -bottom-1 -right-1 bg-primary text-on-primary text-[9px] font-clinical-data-mono px-1 rounded-full font-bold">
                ER-02
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-space-xs flex-wrap">
                <h1 className="font-section-title text-section-title text-on-surface">Rahul Sharma</h1>
                <span className="font-body-strong text-body-strong text-on-surface-variant">42Y / Male</span>
                <span className="bg-primary-fixed text-on-primary-fixed px-space-xs py-0.5 rounded text-metadata-micro font-clinical-data-mono font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">verified</span> ABHA: 91-8842-1920-4491
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-space-md gap-y-0 text-metadata-micro font-clinical-data-mono text-on-surface-variant mt-0.5">
                <span>
                  <strong className="text-on-surface">Token:</strong> #104
                </span>
                <span>
                  <strong className="text-on-surface">UHID:</strong> DEL-2024-8841
                </span>
                <span>
                  <strong className="text-on-surface">Bed:</strong> Emergency Resus Bay 02
                </span>
                <span>
                  <strong className="text-on-surface">Attending:</strong> Dr. Rohit Verma (Cardiology)
                </span>
                <span className="text-error font-semibold flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-xs">warning</span> NPO · PENICILLIN ANAPHYLAXIS
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Pill Strip */}
          <div className="flex items-center gap-space-xs overflow-x-auto py-1">
            <div className="bg-surface-container-low px-space-sm py-1 rounded flex flex-col min-w-[76px] border border-outline-variant/20">
              <span className="font-metadata-micro text-metadata-micro text-outline">BP Arterial</span>
              <span className="font-clinical-data-mono text-clinical-data text-on-surface font-bold">
                142/92 <span className="text-metadata-micro font-normal text-outline">mmHg</span>
              </span>
            </div>
            <div className="bg-surface-container-low px-space-sm py-1 rounded flex flex-col min-w-[64px] border border-outline-variant/20">
              <span className="font-metadata-micro text-metadata-micro text-outline">Heart Rate</span>
              <span className="font-clinical-data-mono text-clinical-data text-error font-bold flex items-center gap-0.5">
                104 <span className="material-symbols-outlined text-xs">arrow_upward</span>
              </span>
            </div>
            <div className="bg-surface-container-low px-space-sm py-1 rounded flex flex-col min-w-[64px] border border-outline-variant/20">
              <span className="font-metadata-micro text-metadata-micro text-outline">SpO2 (2L NC)</span>
              <span className="font-clinical-data-mono text-clinical-data text-primary font-bold">98%</span>
            </div>
            <div className="bg-surface-container-low px-space-sm py-1 rounded flex flex-col min-w-[82px] border border-outline-variant/20">
              <span className="font-metadata-micro text-metadata-micro text-outline">Contrast eGFR</span>
              <span className="font-clinical-data-mono text-clinical-data text-primary font-bold">
                98 <span className="text-metadata-micro font-normal text-outline">mL/min</span>
              </span>
            </div>
            <div className="bg-primary-container text-on-primary-container px-space-sm py-1 rounded flex flex-col justify-center text-right shadow-xs">
              <span className="font-metadata-micro text-metadata-micro uppercase tracking-wider font-semibold opacity-80">
                Cath Team
              </span>
              <span className="font-clinical-data-mono text-clinical-data font-bold">STANDBY BAY 02</span>
            </div>
          </div>
        </div>
      </section>

      {/* COMMAND CONTROL & NAVIGATION BAR */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-sm mb-space-md">
        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl shadow-sm overflow-x-auto w-full lg:w-auto border border-outline-variant/30">
          <button
            onClick={() => setActiveTab("active")}
            className={`font-body-strong text-clinical-data px-space-sm py-1.5 rounded-lg flex items-center gap-space-xs transition-all ${
              activeTab === "active"
                ? "bg-surface-container-lowest text-primary shadow-sm"
                : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <span className="material-symbols-outlined text-sm">medical_services</span>
            <span>Active Clinical Orders</span>
            <span className="bg-primary-container text-on-primary-container font-clinical-data-mono text-metadata-micro px-1.5 py-0.2 rounded-full font-bold">
              {4 + customOrders.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("cath")}
            className={`font-body-strong text-clinical-data px-space-sm py-1.5 rounded-lg flex items-center gap-space-xs transition-colors ${
              activeTab === "cath"
                ? "bg-surface-container-lowest text-error shadow-sm"
                : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <span className="material-symbols-outlined text-sm">emergency</span>
            <span>Emergency Cath Procedures</span>
            <span className="bg-error text-on-error font-clinical-data-mono text-metadata-micro px-1.5 py-0.2 rounded-full font-bold">
              2
            </span>
          </button>
          <button
            onClick={() => setActiveTab("nursing")}
            className={`font-body-strong text-clinical-data px-space-sm py-1.5 rounded-lg flex items-center gap-space-xs transition-colors ${
              activeTab === "nursing"
                ? "bg-surface-container-lowest text-primary shadow-sm"
                : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <span>Nursing Tasks</span>
            <span className="bg-surface-container-high text-on-surface font-clinical-data-mono text-metadata-micro px-1.5 py-0.2 rounded-full font-semibold">
              3
            </span>
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`font-body-strong text-clinical-data px-space-sm py-1.5 rounded-lg flex items-center gap-space-xs transition-colors ${
              activeTab === "completed"
                ? "bg-surface-container-lowest text-primary shadow-sm"
                : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <span>Completed &amp; Signed</span>
            <span className="bg-surface-container-high text-on-surface font-clinical-data-mono text-metadata-micro px-1.5 py-0.2 rounded-full font-semibold">
              6
            </span>
          </button>
          <button
            onClick={() => setActiveTab("discontinued")}
            className={`font-body-strong text-clinical-data px-space-sm py-1.5 rounded-lg transition-colors ${
              activeTab === "discontinued"
                ? "bg-surface-container-lowest text-primary shadow-sm"
                : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <span>Discontinued (0)</span>
          </button>
        </div>

        {/* Action Action Group */}
        <div className="flex items-center gap-space-xs w-full lg:w-auto justify-end flex-wrap">
          <button
            onClick={() => setShowPrintModal(true)}
            className="bg-surface-container-lowest text-on-surface hover:bg-surface-container font-body-strong text-clinical-data px-space-sm py-2 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors border border-outline-variant/30"
            title="Print Hardcopy Procedural Documentation"
          >
            <span className="material-symbols-outlined text-base text-secondary">print</span>
            <span className="hidden sm:inline">Print Consent &amp; Orders</span>
          </button>
          <button
            onClick={() => setShowProtocolModal(true)}
            className="bg-surface-container-high text-primary hover:bg-surface-container-highest font-body-strong text-clinical-data px-space-sm py-2 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-base">bolt</span>
            <span>ACS / STEMI Protocol Set</span>
          </button>
          <button
            onClick={() => setShowOrderModal(true)}
            className="bg-primary hover:bg-primary-container text-on-primary font-body-strong text-clinical-data px-space-md py-2 rounded-lg shadow-md flex items-center gap-1.5 transition-all"
            id="open-order-modal-btn"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span>+ New Clinical Order (CPOE)</span>
          </button>
        </div>
      </div>

      {/* PRIMARY WORKSPACE SPLIT: CENTER ORDERS LEDGER (8 COLS) VS RIGHT PROCEDURAL PRE-OP MATRIX (4 COLS) */}
      <div className="grid grid-cols-12 gap-space-md items-start">
        {/* LEFT & CENTER (8 COLUMNS): Multi-Category Clinical Orders Ledger */}
        <div className="col-span-12 xl:col-span-8 flex flex-col gap-space-md min-w-0">
          {/* Active Protocol Banner Strip */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex items-center justify-between border border-outline-variant/30">
            <div className="flex items-center gap-space-md">
              <div className="w-10 h-10 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">cardiology</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-space-xs">
                  <span className="font-section-title text-section-title text-on-surface">
                    Acute Anterior STEMI Emergency Pathway
                  </span>
                  <span className="bg-primary text-on-primary text-[10px] font-clinical-data-mono uppercase px-1.5 py-0.5 rounded font-bold">
                    Bundle Active
                  </span>
                </div>
                <span className="font-body-default text-metadata-micro text-on-surface-variant">
                  Auth #ORD-2024-99120 · Initiated by Dr. Rohit Verma at 14:18 IST · Target Door-to-Balloon &lt; 90 min
                </span>
              </div>
            </div>
            <div className="flex items-center gap-space-xs">
              <span className="font-metadata-micro text-metadata-micro font-clinical-data-mono text-outline">
                5 of 6 Items Executed
              </span>
              <div className="w-24 bg-surface-container-high h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: "83%" }}></div>
              </div>
            </div>
          </div>

          {/* User Added Custom Orders */}
          {customOrders.map(ord => (
            <div key={ord.id} className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md border border-primary/40 animate-in fade-in">
              <div className="flex items-start justify-between gap-space-sm mb-space-xs">
                <div className="flex items-start gap-space-sm">
                  <div className="w-8 h-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-lg">check_circle</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-body-strong text-subheading text-on-surface font-bold">{ord.name}</span>
                      <span className="bg-primary-container text-on-primary-container font-clinical-data-mono text-metadata-micro px-1.5 py-0.5 rounded font-bold">
                        {ord.priority}
                      </span>
                    </div>
                    <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                      Category: {ord.category} · Dispatched at {ord.time}
                    </span>
                  </div>
                </div>
                <span className="bg-primary text-on-primary font-clinical-data-mono text-metadata-micro px-2 py-0.5 rounded font-bold">
                  ACTIVE
                </span>
              </div>
            </div>
          ))}

          {/* Order #1: Emergency PPCI (High Priority Hero Card) */}
          {(activeTab === "active" || activeTab === "cath") && (
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md transition-all hover:shadow-md border border-outline-variant/30">
              <div className="flex items-start justify-between gap-space-sm mb-space-xs">
                <div className="flex items-start gap-space-sm">
                  <div className="w-8 h-8 rounded-lg bg-error-container text-on-error-container flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-lg">ecg_heart</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex flex-wrap items-center gap-space-xs">
                      <span className="font-body-strong text-subheading text-on-surface font-bold">
                        Emergency Primary PCI with Coronary Angiography (± Drug-Eluting Stent)
                      </span>
                      <span className="bg-error text-on-error font-clinical-data-mono text-metadata-micro px-1.5 py-0.5 rounded font-bold">
                        STAT P1
                      </span>
                    </div>
                    <span className="font-metadata-micro text-metadata-micro text-on-surface-variant mt-0.5">
                      Category: Interventional Cardiology · Destination: Cath Lab 01 (Biplane Room A)
                    </span>
                  </div>
                </div>
                <span className="bg-primary-container text-on-primary-container text-metadata-micro font-clinical-data-mono px-2 py-1 rounded font-bold whitespace-nowrap flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-surface-container-lowest animate-ping"></span>
                  AUTHORIZED &amp; MOBILIZED
                </span>
              </div>

              {/* Order Body Details */}
              <div className="bg-surface-container-low rounded-lg p-space-sm my-space-xs flex flex-col gap-space-2xs text-clinical-data border border-outline-variant/20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-space-xs text-metadata-micro font-clinical-data-mono">
                  <div>
                    <span className="text-outline">Ordering MD:</span>{" "}
                    <strong className="text-on-surface">Dr. Rohit Verma (Cardiology)</strong>
                  </div>
                  <div>
                    <span className="text-outline">Authorized At:</span> <strong className="text-on-surface">14:24 IST</strong>
                  </div>
                  <div>
                    <span className="text-outline">Cath Room Status:</span>{" "}
                    <span className="text-primary font-bold">Ready for Inflow (Bay 01)</span>
                  </div>
                </div>
                <div className="text-body-default text-clinical-data text-on-surface mt-1">
                  <strong className="font-body-strong text-primary">Procedural Prep:</strong> Primary access: Right Radial Artery
                  (Barbeau test patent); Right Groin shaved as secondary backup. Administer IV Heparin bolus per interventional
                  protocol on sheath insertion.
                </div>
              </div>
              <div className="flex items-center justify-between pt-space-xs text-metadata-micro text-on-surface-variant flex-wrap gap-2">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-primary">verified_user</span>
                  <span>Interventionalist Dr. V. Menon acknowledged dispatch at 14:26 IST</span>
                </span>
                <div className="flex items-center gap-space-xs">
                  <button
                    onClick={() => setShowProtocolModal(true)}
                    className="px-space-xs py-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded text-metadata-micro font-body-strong transition-colors"
                  >
                    Review Full Protocol
                  </button>
                  <button
                    onClick={() => showToast("Cath Prep Log updated: Radial sheath tray sterile verified.")}
                    className="px-space-sm py-1 bg-surface-container text-primary hover:bg-surface-container-high rounded text-metadata-micro font-body-strong transition-colors"
                  >
                    Update Prep Log
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Order #2: Bedside POCUS Echo */}
          {(activeTab === "active" || activeTab === "cath") && (
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md transition-all hover:shadow-md border border-outline-variant/30">
              <div className="flex items-start justify-between gap-space-sm mb-space-xs">
                <div className="flex items-start gap-space-sm">
                  <div className="w-8 h-8 rounded-lg bg-surface-container text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-lg">question_mark</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-space-xs flex-wrap">
                      <span className="font-body-strong text-subheading text-on-surface">
                        Bedside Point-of-Care Echocardiography (POCUS Echo)
                      </span>
                      <span className="bg-secondary-container text-on-secondary-container font-clinical-data-mono text-metadata-micro px-1.5 py-0.5 rounded font-bold">
                        STAT Bedside
                      </span>
                    </div>
                    <span className="font-metadata-micro text-metadata-micro text-on-surface-variant mt-0.5">
                      Cart: Butterfly iQ+ Handheld Ultrasound (Unit ER-US-02) · Bay 02 Bedside
                    </span>
                  </div>
                </div>
                <span className="bg-secondary-container text-on-secondary-container text-metadata-micro font-clinical-data-mono px-2 py-1 rounded font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs animate-spin">progress_activity</span> IN PROGRESS
                </span>
              </div>
              <div className="bg-surface-container-low rounded-lg p-space-sm my-space-xs text-clinical-data border border-outline-variant/20">
                <p className="font-body-default text-clinical-data text-on-surface">
                  <strong className="font-body-strong">Clinical Indication:</strong> Rapidly evaluate anterior and apical
                  regional wall motion abnormalities (RWMA); compute visual LVEF baseline; rigorously exclude mechanical
                  complications (acute MR, free wall rupture, pericardial effusion).
                </p>
                <div className="mt-2 flex items-center justify-between text-metadata-micro font-clinical-data-mono text-on-surface-variant pt-1 flex-wrap gap-1">
                  <span>Operator: Dr. Sneha Rao (Senior ER Registrar)</span>
                  <span className="text-primary font-semibold">Cine-loops auto-mirroring to PACS</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-space-xs flex-wrap gap-2">
                <span className="text-metadata-micro text-outline flex items-center gap-1 font-clinical-data-mono">
                  <span className="material-symbols-outlined text-sm">wifi_tethering</span> PACS Study UID: 1.2.840.113619.2.441
                </span>
                <button
                  onClick={() => setShowPocusModal(true)}
                  className="px-space-sm py-1 bg-surface-container-high text-on-surface hover:bg-surface-container-highest rounded text-metadata-micro font-body-strong transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-xs">visibility</span> View Real-time Stream
                </button>
              </div>
            </div>
          )}

          {/* Order #3: Serial 12-Lead Electrocardiograms */}
          {(activeTab === "active" || activeTab === "nursing") && (
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md transition-all hover:shadow-md border border-outline-variant/30">
              <div className="flex items-start justify-between gap-space-sm mb-space-xs">
                <div className="flex items-start gap-space-sm">
                  <div className="w-8 h-8 rounded-lg bg-surface-container text-secondary flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-lg">ssid_chart</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-space-xs flex-wrap">
                      <span className="font-body-strong text-subheading text-on-surface">
                        Serial 12-Lead ECG Monitoring Protocol
                      </span>
                      <span className="bg-surface-container-high text-on-surface font-clinical-data-mono text-metadata-micro px-1.5 py-0.5 rounded font-bold">
                        Every 15-30 min
                      </span>
                    </div>
                    <span className="font-metadata-micro text-metadata-micro text-on-surface-variant mt-0.5">
                      Cadence: 0h (Baseline), +30m post-antiplatelet, +60m pre-puncture
                    </span>
                  </div>
                </div>
                <span className="bg-surface-container text-primary text-metadata-micro font-clinical-data-mono px-2 py-1 rounded font-bold">
                  NEXT DUE: 14:55 IST
                </span>
              </div>
              {/* Serial ECG Progression Visual Ledger */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-xs my-space-xs">
                <div className="p-space-xs rounded-lg bg-surface-container-low flex flex-col justify-between border border-outline-variant/20">
                  <div className="flex items-center justify-between text-metadata-micro font-clinical-data-mono">
                    <span className="font-bold text-on-surface">0h Baseline (14:15)</span>
                    <span className="text-error font-bold flex items-center">
                      <span className="material-symbols-outlined text-xs">check_circle</span> COMPLETE
                    </span>
                  </div>
                  <div className="py-1">
                    <span className="text-error font-clinical-data-mono text-clinical-data font-bold">
                      +3.2mm ST Elev (V1-V4)
                    </span>
                    <p className="text-metadata-micro text-on-surface-variant">
                      Hyperacute T waves, reciprocal II/III/aVF depression
                    </p>
                  </div>
                  <button
                    onClick={() => setShowEcgModal(true)}
                    className="text-primary text-metadata-micro font-body-strong hover:underline flex items-center gap-0.5 text-left"
                  >
                    View ECG Strip (PDF) <span className="material-symbols-outlined text-xs">open_in_new</span>
                  </button>
                </div>
                <div className="p-space-xs rounded-lg bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-primary/40">
                  <div className="flex items-center justify-between text-metadata-micro font-clinical-data-mono">
                    <span className="font-bold text-on-surface">+30m Check (14:45)</span>
                    <span className="text-primary font-bold animate-pulse">ACQUIRING NOW</span>
                  </div>
                  <div className="py-1">
                    <span className="text-on-surface-variant font-clinical-data-mono text-clinical-data">
                      Technician at Bedside
                    </span>
                    <p className="text-metadata-micro text-outline">GE MAC 5500HD Cart synchronized</p>
                  </div>
                  <button
                    onClick={() => showToast("Trace uploaded and matched to Study UID.")}
                    className="text-left text-primary text-metadata-micro font-body-strong hover:underline"
                  >
                    Confirm Trace Upload →
                  </button>
                </div>
                <div className="p-space-xs rounded-lg bg-surface-container-low opacity-70 flex flex-col justify-between border border-outline-variant/20">
                  <div className="flex items-center justify-between text-metadata-micro font-clinical-data-mono">
                    <span className="font-bold text-on-surface">+60m Cath Transit</span>
                    <span className="text-outline font-semibold">SCHEDULED 15:15</span>
                  </div>
                  <div className="py-1">
                    <span className="text-outline font-clinical-data-mono text-clinical-data">Pre-balloon dilation</span>
                    <p className="text-metadata-micro text-outline">Cath lab holding bay acquisition</p>
                  </div>
                  <span className="text-metadata-micro text-outline font-clinical-data-mono">Queued</span>
                </div>
              </div>
            </div>
          )}

          {/* Order #4: Continuous Telemetry Gateway */}
          {(activeTab === "active" || activeTab === "nursing") && (
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md transition-all hover:shadow-md border border-outline-variant/30">
              <div className="flex items-start justify-between gap-space-sm mb-space-xs">
                <div className="flex items-start gap-space-sm">
                  <div className="w-8 h-8 rounded-lg bg-surface-container text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-lg">monitor_heart</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-space-xs flex-wrap">
                      <span className="font-body-strong text-subheading text-on-surface">
                        Continuous 12-Lead Holter &amp; Telemetry Gateway
                      </span>
                      <span className="bg-primary text-on-primary font-clinical-data-mono text-metadata-micro px-1.5 py-0.5 rounded font-bold">
                        STREAMING
                      </span>
                    </div>
                    <span className="font-metadata-micro text-metadata-micro text-on-surface-variant mt-0.5">
                      Channel ID: <span className="font-clinical-data-mono text-on-surface font-semibold">ER-03-MON</span> · Mindray
                      BeneVision N12 hooked to Cath Lab console
                    </span>
                  </div>
                </div>
                <span className="text-metadata-micro font-clinical-data-mono text-primary flex items-center gap-1 font-semibold">
                  <span className="h-2 w-2 rounded-full bg-primary animate-ping"></span> 0% Packet Loss
                </span>
              </div>
              {/* Mini Live Waveform Visualization Card */}
              <div className="bg-inverse-surface text-inverse-on-surface rounded-lg p-space-sm my-space-xs">
                <div className="flex items-center justify-between text-metadata-micro font-clinical-data-mono mb-1 text-outline-variant">
                  <span>Lead II / V2 Combined Telemetry (Real-Time)</span>
                  <span className="text-primary-fixed">HR: 104 BPM · Sinus Rhythm with Occasional PVCs</span>
                </div>
                {/* Minimal Inline SVG ECG Sparkline Waveform */}
                <div className="w-full h-12 overflow-hidden flex items-center">
                  <svg className="w-full h-10 text-primary-fixed" preserveAspectRatio="none" viewBox="0 0 500 40">
                    <path
                      d="M0,20 L40,20 L48,15 L52,25 L56,20 L70,20 L75,8 L80,36 L85,4 L90,26 L94,20 L110,20 L120,24 L130,20 L160,20 L168,15 L172,25 L176,20 L190,20 L195,8 L200,36 L205,4 L210,26 L214,20 L230,20 L240,24 L250,20 L280,20 L288,15 L292,25 L296,20 L310,20 L315,8 L320,36 L325,4 L330,26 L334,20 L350,20 L360,24 L370,20 L400,20 L408,15 L412,25 L416,20 L430,20 L435,8 L440,36 L445,4 L450,26 L454,20 L470,20 L480,24 L500,20"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex items-center justify-between text-metadata-micro text-on-surface-variant pt-1 flex-wrap gap-2">
                <span>
                  Defibrillator Synchronizer:{" "}
                  <strong className="text-on-surface font-clinical-data-mono">Zoll R-Series Synced at Bedside</strong>
                </span>
                <button
                  onClick={() => showToast("Alarm Gates configured: Bradycardia < 50, Tachycardia > 140, ST Dev > 2mm.")}
                  className="text-primary font-body-strong hover:underline text-metadata-micro"
                >
                  Configure Telemetry Alarm Gates
                </button>
              </div>
            </div>
          )}

          {/* Order #5: STAT Blood Draws & Laboratory Clearances Matrix */}
          {(activeTab === "active" || activeTab === "completed") && (
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md transition-all hover:shadow-md border border-outline-variant/30">
              <div className="flex items-start justify-between gap-space-sm mb-space-sm">
                <div className="flex items-start gap-space-sm">
                  <div className="w-8 h-8 rounded-lg bg-surface-container text-tertiary flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-lg">science</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-space-xs flex-wrap">
                      <span className="font-body-strong text-subheading text-on-surface">
                        STAT Blood Draws &amp; Interventional Lab Panel
                      </span>
                      <span className="bg-error text-on-error font-clinical-data-mono text-metadata-micro px-1.5 py-0.5 rounded font-bold">
                        STAT Core Lab
                      </span>
                    </div>
                    <span className="font-metadata-micro text-metadata-micro text-on-surface-variant mt-0.5">
                      Specimens Collected 14:22 IST · Pneumatic Tube Station Tube-ER-01 to Central Bio-Core
                    </span>
                  </div>
                </div>
                <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                  Batch #LAB-99231
                </span>
              </div>
              {/* Tabular Vitals & Lab Clearance Matrix */}
              <div className="overflow-x-auto rounded-lg border border-outline-variant/20">
                <table className="w-full text-left font-clinical-data text-clinical-data">
                  <thead className="bg-surface-container text-on-surface font-table-header text-table-header uppercase">
                    <tr>
                      <th className="py-2 px-space-sm">Investigation</th>
                      <th className="py-2 px-space-sm">Status / ETA</th>
                      <th className="py-2 px-space-sm">Current Result</th>
                      <th className="py-2 px-space-sm">Reference Range</th>
                      <th className="py-2 px-space-sm text-right">Clearance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    <tr className="bg-surface-container-lowest hover:bg-surface-container-low transition-colors">
                      <td className="py-2 px-space-sm font-body-strong text-on-surface">
                        High-Sensitivity Troponin I (0h Baseline)
                      </td>
                      <td className="py-2 px-space-sm">
                        <span className="text-secondary font-clinical-data-mono text-metadata-micro flex items-center gap-1 font-bold">
                          <span className="material-symbols-outlined text-xs animate-spin">progress_activity</span> IN ANALYZER
                          (ETA 14:50)
                        </span>
                      </td>
                      <td className="py-2 px-space-sm font-clinical-data-mono text-outline font-semibold">Running...</td>
                      <td className="py-2 px-space-sm font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                        &lt; 14 ng/L
                      </td>
                      <td className="py-2 px-space-sm text-right">
                        <span className="bg-surface-container text-on-surface-variant text-metadata-micro font-clinical-data-mono px-1.5 py-0.5 rounded">
                          PENDING
                        </span>
                      </td>
                    </tr>
                    <tr className="bg-surface-container-low/50 hover:bg-surface-container-low transition-colors">
                      <td className="py-2 px-space-sm font-body-strong text-on-surface">
                        Pre-Cath Coagulation Profile (PT/INR, aPTT)
                      </td>
                      <td className="py-2 px-space-sm">
                        <span className="text-secondary font-clinical-data-mono text-metadata-micro flex items-center gap-1 font-bold">
                          <span className="material-symbols-outlined text-xs">hourglass_top</span> IN LAB (Centrifuged)
                        </span>
                      </td>
                      <td className="py-2 px-space-sm font-clinical-data-mono text-on-surface font-semibold">
                        INR 1.08 · aPTT 28.4s
                      </td>
                      <td className="py-2 px-space-sm font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                        INR 0.8-1.2 · aPTT 25-35s
                      </td>
                      <td className="py-2 px-space-sm text-right">
                        <span className="bg-primary-container text-on-primary-container text-metadata-micro font-clinical-data-mono px-1.5 py-0.5 rounded font-bold">
                          NORMAL
                        </span>
                      </td>
                    </tr>
                    <tr className="bg-surface-container-lowest hover:bg-surface-container-low transition-colors">
                      <td className="py-2 px-space-sm font-body-strong text-on-surface">
                        Renal Profile for Contrast Clearance (eGFR / Serum Cr)
                      </td>
                      <td className="py-2 px-space-sm">
                        <span className="text-primary font-clinical-data-mono text-metadata-micro flex items-center gap-1 font-bold">
                          <span className="material-symbols-outlined text-xs">done_all</span> COMPLETED (14:30)
                        </span>
                      </td>
                      <td className="py-2 px-space-sm font-clinical-data-mono text-primary font-bold">
                        Cr 0.88 mg/dL · eGFR 98
                      </td>
                      <td className="py-2 px-space-sm font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                        &gt; 60 mL/min/1.73m²
                      </td>
                      <td className="py-2 px-space-sm text-right">
                        <span className="bg-primary text-on-primary text-metadata-micro font-clinical-data-mono px-1.5 py-0.5 rounded font-bold">
                          CONTRAST SAFE
                        </span>
                      </td>
                    </tr>
                    <tr className="bg-surface-container-low/50 hover:bg-surface-container-low transition-colors">
                      <td className="py-2 px-space-sm font-body-strong text-on-surface">
                        Rapid Bedside Hemoglucotest &amp; ABG (i-STAT)
                      </td>
                      <td className="py-2 px-space-sm">
                        <span className="text-primary font-clinical-data-mono text-metadata-micro flex items-center gap-1 font-bold">
                          <span className="material-symbols-outlined text-xs">done_all</span> VERIFIED
                        </span>
                      </td>
                      <td className="py-2 px-space-sm font-clinical-data-mono text-on-surface font-semibold">
                        Glu: 144 mg/dL · pH: 7.39 · Lac: 1.4
                      </td>
                      <td className="py-2 px-space-sm font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                        Lactate &lt; 2.0 mmol/L
                      </td>
                      <td className="py-2 px-space-sm text-right">
                        <span className="bg-primary-container text-on-primary-container text-metadata-micro font-clinical-data-mono px-1.5 py-0.5 rounded font-bold">
                          CLEARED
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN (4 COLUMNS): Cath Lab Pre-Op Checklist, Verification Ledger & Hand-off */}
        <div className="col-span-12 xl:col-span-4 flex flex-col gap-space-md min-w-0">
          {/* Checklist Progress Summary Card */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30">
            <div className="flex items-center justify-between pb-space-xs">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-xl">fact_check</span>
                <span className="font-section-title text-section-title text-on-surface">Cath Lab Readiness Ledger</span>
              </div>
              <span className="bg-primary-container text-on-primary-container font-clinical-data-mono text-clinical-data font-bold px-2 py-0.5 rounded">
                6 / 7 Cleared
              </span>
            </div>
            {/* Micro Step Progress Meter */}
            <div className="w-full bg-surface-container h-2.5 rounded-full overflow-hidden my-space-xs">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{ width: handoffState === "in-motion" ? "100%" : "85%" }}
              ></div>
            </div>
            <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
              Strict joint commission accreditation safety criteria for rapid interventional cardiology transfer.
            </p>
            {/* Dynamic Checklist Items */}
            <div className="flex flex-col gap-space-xs mt-space-sm">
              {/* Item 1 */}
              <div className="p-space-xs rounded-lg bg-surface-container-low flex items-start gap-space-xs border border-outline-variant/20">
                <span className="material-symbols-outlined text-primary text-base mt-0.5">check_circle</span>
                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-body-strong text-clinical-data text-on-surface">Biometrics &amp; Identity Confirmed</span>
                    <span className="text-primary font-clinical-data-mono text-metadata-micro font-bold">VERIFIED</span>
                  </div>
                  <span className="text-metadata-micro text-on-surface-variant font-clinical-data-mono">
                    2x ID Wristbands Scanned · Photo ID Confirmed
                  </span>
                </div>
              </div>
              {/* Item 2 */}
              <div className="p-space-xs rounded-lg bg-surface-container-low flex items-start gap-space-xs border border-outline-variant/20">
                <span className="material-symbols-outlined text-primary text-base mt-0.5">check_circle</span>
                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-body-strong text-clinical-data text-on-surface">Continuous O2 Titration Active</span>
                    <span className="text-primary font-clinical-data-mono text-metadata-micro font-bold">VERIFIED</span>
                  </div>
                  <span className="text-metadata-micro text-on-surface-variant font-clinical-data-mono">
                    Target SpO2 94-98% · Current: 98% on 2L Nasal Cannula
                  </span>
                </div>
              </div>
              {/* Item 3 */}
              <div className="p-space-xs rounded-lg bg-surface-container-low flex items-start gap-space-xs border border-outline-variant/20">
                <span className="material-symbols-outlined text-primary text-base mt-0.5">check_circle</span>
                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-body-strong text-clinical-data text-on-surface">Dual Antiplatelet Loading Given</span>
                    <span className="text-primary font-clinical-data-mono text-metadata-micro font-bold">VERIFIED</span>
                  </div>
                  <span className="text-metadata-micro text-on-surface-variant font-clinical-data-mono">
                    Aspirin 325mg PO chewed + Ticagrelor 180mg PO at 14:20
                  </span>
                </div>
              </div>
              {/* Item 4 */}
              <div className="p-space-xs rounded-lg bg-surface-container-low flex items-start gap-space-xs border border-outline-variant/20">
                <span className="material-symbols-outlined text-primary text-base mt-0.5">check_circle</span>
                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-body-strong text-clinical-data text-on-surface">Dual 18G Intravenous Access</span>
                    <span className="text-primary font-clinical-data-mono text-metadata-micro font-bold">VERIFIED</span>
                  </div>
                  <span className="text-metadata-micro text-on-surface-variant font-clinical-data-mono">
                    Left Forearm (18G green) &amp; Right Forearm (18G green) Patent
                  </span>
                </div>
              </div>
              {/* Item 5 */}
              <div className="p-space-xs rounded-lg bg-surface-container-low flex items-start gap-space-xs border border-outline-variant/20">
                <span className="material-symbols-outlined text-primary text-base mt-0.5">check_circle</span>
                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-body-strong text-clinical-data text-on-surface">Contrast Clearance Authorized</span>
                    <span className="text-primary font-clinical-data-mono text-metadata-micro font-bold">VERIFIED</span>
                  </div>
                  <span className="text-metadata-micro text-on-surface-variant font-clinical-data-mono">
                    eGFR 98 mL/min verified · Iso-osmolar Visipaque queued
                  </span>
                </div>
              </div>
              {/* Item 6: Consent Clearance Card */}
              <div className="p-space-xs rounded-lg bg-surface-container-low flex items-start gap-space-xs border border-outline-variant/20">
                <span className="material-symbols-outlined text-primary text-base mt-0.5">verified</span>
                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-body-strong text-clinical-data text-on-surface">Procedural &amp; PCI Consent</span>
                    <span className="text-primary font-clinical-data-mono text-metadata-micro font-bold">COUNTERSIGNED</span>
                  </div>
                  <span className="text-metadata-micro text-on-surface-variant font-clinical-data-mono">
                    Signed by Sunita Sharma (Wife) &amp; Dr. Rohit Verma (MD)
                  </span>
                  <div className="mt-1 flex items-center gap-space-xs">
                    <button
                      onClick={() => setShowConsentModal(true)}
                      className="text-primary text-[11px] font-body-strong hover:underline flex items-center gap-0.5"
                    >
                      <span className="material-symbols-outlined text-xs">draw</span> View E-Signatures
                    </button>
                    <span className="text-outline text-xs">·</span>
                    <span className="text-metadata-micro text-outline font-clinical-data-mono">Hash #c79a..10f</span>
                  </div>
                </div>
              </div>
              {/* Item 7: IN PROGRESS Transfer Step */}
              <div
                className={`p-space-xs rounded-lg flex items-start gap-space-xs shadow-sm border ${
                  handoffState === "in-motion"
                    ? "bg-primary text-on-primary border-primary"
                    : "bg-error-container text-on-error-container border-error/30"
                }`}
              >
                <span className="material-symbols-outlined text-base mt-0.5 animate-bounce">airport_shuttle</span>
                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-body-strong text-clinical-data font-bold">
                      {handoffState === "in-motion" ? "Transfer Team En Route" : "Transfer Transport Team Standby"}
                    </span>
                    <span
                      className={`font-clinical-data-mono text-metadata-micro px-1.5 py-0.2 rounded font-bold ${
                        handoffState === "in-motion" ? "bg-white text-primary" : "bg-error text-on-error"
                      }`}
                    >
                      {handoffState === "in-motion" ? "EN ROUTE" : "ACTION NEEDED"}
                    </span>
                  </div>
                  <span className="text-metadata-micro font-clinical-data-mono opacity-90">
                    ER Transfer Gurney &amp; Transport Monitor hooked at Bay 02
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Consent & Signatures Snapshot Box */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-sm border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <span className="font-body-strong text-body-strong text-on-surface">Procedural Legal Consent</span>
              <span className="bg-surface-container text-on-surface text-metadata-micro font-clinical-data-mono px-1.5 py-0.5 rounded">
                Form CF-PCI-04
              </span>
            </div>
            <div className="bg-surface-container-low rounded-lg p-space-sm flex flex-col gap-1 text-metadata-micro font-clinical-data-mono border border-outline-variant/20">
              <div className="flex justify-between">
                <span className="text-outline">Patient/Surrogate:</span>
                <span className="text-on-surface font-semibold">Sunita Sharma (Spouse)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">Witness / Nurse:</span>
                <span className="text-on-surface">Sister Anjali K. (RN #3918)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">Operating Clinician:</span>
                <span className="text-on-surface font-semibold">Dr. Rohit Verma (Reg #DEL-6621)</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-outline">Signed At:</span>
                <span className="text-primary font-bold">14:22:08 IST (Aadhaar OTP Verified)</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-space-xs">
              <button
                onClick={() => setShowConsentModal(true)}
                className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface py-2 rounded-lg text-metadata-micro font-body-strong flex items-center justify-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">visibility</span> Review Document
              </button>
              <button
                onClick={() => {
                  window.print();
                  showToast("Downloaded PDF bundle for Legal Consent CF-PCI-04.");
                }}
                className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface py-2 rounded-lg text-metadata-micro font-body-strong flex items-center justify-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">download</span> PDF Bundle
              </button>
            </div>
          </div>

          {/* Final Procedural Authorization CTAs */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-xs border border-outline-variant/30">
            <button
              onClick={handleHandoff}
              disabled={handoffState === "in-motion"}
              className={`w-full font-body-strong text-body-strong py-3 rounded-lg shadow-md flex items-center justify-center gap-space-xs transition-all ${
                handoffState === "in-motion"
                  ? "bg-surface-container text-on-surface-variant cursor-not-allowed"
                  : "bg-primary hover:bg-primary-container text-on-primary"
              }`}
              id="authorize-handoff-btn"
            >
              {handoffState === "in-motion" ? (
                <>
                  <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                  <span>Transit Escort In Motion...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">directions_run</span>
                  <span>Authorize Physical Cath Lab Hand-off</span>
                </>
              )}
            </button>
            <div className="grid grid-cols-2 gap-space-xs pt-1">
              <button
                onClick={() => setShowIntraOpRxModal(true)}
                className="bg-surface-container hover:bg-surface-container-high text-on-surface py-2 rounded-lg text-clinical-data font-body-strong flex items-center justify-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-base text-primary">medication</span>
                <span>Log Intra-Op Rx</span>
              </button>
              <button
                onClick={() => setShowNurseTaskModal(true)}
                className="bg-surface-container hover:bg-surface-container-high text-on-surface py-2 rounded-lg text-clinical-data font-body-strong flex items-center justify-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-base text-secondary">assignment_add</span>
                <span>Add Nurse Task</span>
              </button>
            </div>
            <span className="text-center font-metadata-micro text-metadata-micro font-clinical-data-mono text-outline pt-1">
              Authorized personnel only · Audit trail encrypted SHA-256
            </span>
          </div>
        </div>
      </div>

      {/* MODAL: NEW CLINICAL ORDER ENTRY (CPOE) */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-inverse-surface/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col border border-outline-variant">
            {/* Modal Header */}
            <div className="bg-surface-container p-space-md flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-xl">add_task</span>
                <span className="font-section-title text-section-title text-on-surface">
                  Physician Order Entry (CPOE)
                </span>
              </div>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-on-surface-variant hover:text-on-surface w-8 h-8 rounded flex items-center justify-center hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Modal Body Form */}
            <div className="p-space-md flex flex-col gap-space-sm max-h-[768px] overflow-y-auto font-clinical-data">
              <div className="bg-surface-container-low p-space-xs rounded-lg text-metadata-micro font-clinical-data-mono flex items-center justify-between">
                <span>
                  Patient: <strong>Rahul Sharma</strong> · 42Y/M
                </span>
                <span className="text-error font-bold">NPO · PENICILLIN ALLERGY</span>
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-body-strong text-clinical-data text-on-surface">
                  Order Set / Clinical Category
                </label>
                <select
                  value={orderCategory}
                  onChange={e => setOrderCategory(e.target.value)}
                  className="bg-surface-container-lowest text-on-surface text-clinical-data font-clinical-data p-2 rounded-lg shadow-sm border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option>Interventional Cardiology / Cath Lab Suite</option>
                  <option>STAT Emergency Pharmacology (Anticoagulants / Inotropes)</option>
                  <option>Bedside Point-of-Care Imaging &amp; Diagnostics</option>
                  <option>STAT Diagnostic Laboratory Pathology</option>
                  <option>Post-Procedure Critical Care ICU Placement</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-body-strong text-clinical-data text-on-surface">
                  Order Nomenclature or Drug Name
                </label>
                <input
                  type="text"
                  value={orderName}
                  onChange={e => setOrderName(e.target.value)}
                  className="bg-surface-container-lowest text-on-surface text-clinical-data font-clinical-data p-2 rounded-lg shadow-sm border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-space-sm">
                <div className="flex flex-col gap-1">
                  <label className="font-body-strong text-clinical-data text-on-surface">Priority Stratum</label>
                  <select
                    value={orderPriority}
                    onChange={e => setOrderPriority(e.target.value)}
                    className="bg-surface-container-lowest text-on-surface text-clinical-data font-clinical-data p-2 rounded-lg shadow-sm border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option>STAT P1 (Immediate &lt;15 min)</option>
                    <option>Urgent P2 (&lt;2 hours)</option>
                    <option>Routine Floor Order</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-body-strong text-clinical-data text-on-surface">Administration Route</label>
                  <input
                    type="text"
                    value={orderRoute}
                    onChange={e => setOrderRoute(e.target.value)}
                    className="bg-surface-container-lowest text-on-surface text-clinical-data font-clinical-data p-2 rounded-lg shadow-sm border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-body-strong text-clinical-data text-on-surface">
                  Procedural Instructions &amp; Safety Limits
                </label>
                <textarea
                  rows={2}
                  value={orderInstructions}
                  onChange={e => setOrderInstructions(e.target.value)}
                  className="bg-surface-container-lowest text-on-surface text-clinical-data font-clinical-data p-2 rounded-lg shadow-sm border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Enter clinical titration parameters, contraindications, or specific nursing actions..."
                ></textarea>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-surface-container p-space-md flex items-center justify-between border-t border-surface-container-high">
              <span className="font-metadata-micro text-metadata-micro text-outline font-clinical-data-mono">
                Ordering Physician: Dr. Rohit Verma (Authorized)
              </span>
              <div className="flex items-center gap-space-xs">
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-space-md py-1.5 rounded-lg text-clinical-data font-body-strong transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateOrder}
                  className="bg-primary hover:bg-primary-container text-on-primary px-space-md py-1.5 rounded-lg text-clinical-data font-body-strong shadow transition-all flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">lock</span> Sign &amp; Dispatch Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PROCEDURAL LEGAL CONSENT REVIEW */}
      {showConsentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-inverse-surface/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col border border-outline-variant">
            <div className="bg-surface-container p-space-md flex items-center justify-between border-b border-surface-container-high">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">verified</span>
                <span className="font-section-title text-section-title text-on-surface">
                  Form CF-PCI-04: Informed Procedural Consent
                </span>
              </div>
              <button onClick={() => setShowConsentModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="p-space-md space-y-3 font-clinical-data text-xs text-on-surface">
              <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/30 space-y-1">
                <p>
                  <strong>Procedure:</strong> Primary Percutaneous Coronary Intervention (PPCI), Coronary Angiography ±
                  Stenting, with possible Femoral/Radial Arterial Access.
                </p>
                <p>
                  <strong>Risks Explained:</strong> Bleeding, vascular injury, contrast-induced nephropathy, stroke, arrhythmia,
                  stent thrombosis, emergency CABG conversion.
                </p>
              </div>
              <div className="border border-outline-variant/40 rounded-lg p-3 space-y-2 bg-surface-container-lowest">
                <div className="flex justify-between font-clinical-data-mono">
                  <span>Patient Surrogate:</span>
                  <strong>Sunita Sharma (Spouse)</strong>
                </div>
                <div className="flex justify-between font-clinical-data-mono">
                  <span>Aadhaar E-Sign Verification:</span>
                  <strong className="text-primary">OTP Verified (Mobile Ending **4491)</strong>
                </div>
                <div className="flex justify-between font-clinical-data-mono">
                  <span>Attending Cardiologist:</span>
                  <strong>Dr. Rohit Verma (MD, DM Cardiology)</strong>
                </div>
                <div className="flex justify-between font-clinical-data-mono">
                  <span>Timestamp:</span>
                  <span>14:22:08 IST (07-Sep-2026)</span>
                </div>
              </div>
            </div>
            <div className="bg-surface-container p-space-md flex justify-end gap-2 border-t border-surface-container-high">
              <button
                onClick={() => setShowConsentModal(false)}
                className="px-4 py-2 bg-primary text-on-primary rounded-lg font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: POCUS ECHO STREAM */}
      {showPocusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-inverse-surface/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col border border-outline-variant">
            <div className="bg-surface-container p-space-md flex items-center justify-between border-b border-surface-container-high">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">stream</span>
                <span className="font-section-title text-section-title text-on-surface">
                  POCUS Bedside Echo Live Cine-Loop
                </span>
              </div>
              <button onClick={() => setShowPocusModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="p-4 bg-black flex flex-col items-center justify-center gap-2 text-white">
              <div className="w-full h-48 bg-neutral-900 rounded-lg flex items-center justify-center flex-col gap-2 border border-neutral-800">
                <span className="material-symbols-outlined text-4xl text-primary animate-pulse">radar</span>
                <span className="text-xs font-clinical-data-mono text-neutral-400">Apical 4-Chamber (A4C) View Mirroring</span>
                <span className="text-[11px] text-error font-bold font-clinical-data-mono">
                  Regional Wall Hypokinesia: Apical &amp; Anteroseptal Segments
                </span>
              </div>
            </div>
            <div className="p-4 bg-surface-container-lowest text-xs font-clinical-data text-on-surface space-y-1">
              <div className="flex justify-between">
                <span>Calculated Visual LVEF:</span>
                <strong className="text-error">38 - 40% (Moderately Depressed)</strong>
              </div>
              <div className="flex justify-between">
                <span>Pericardial Effusion:</span>
                <strong className="text-primary">None detected (Ruled Out)</strong>
              </div>
            </div>
            <div className="bg-surface-container p-space-md flex justify-end">
              <button
                onClick={() => setShowPocusModal(false)}
                className="px-4 py-2 bg-primary text-on-primary rounded-lg font-semibold text-xs"
              >
                Close Stream
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ACS / STEMI PROTOCOL SET REVIEW */}
      {showProtocolModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-inverse-surface/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col border border-outline-variant max-h-[85vh] overflow-y-auto">
            <div className="bg-surface-container p-space-md flex items-center justify-between border-b border-surface-container-high">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">bolt</span>
                <span className="font-section-title text-section-title text-on-surface">
                  Acute Anterior STEMI Emergency Pathway Bundle
                </span>
              </div>
              <button onClick={() => setShowProtocolModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="p-space-md space-y-3 font-clinical-data text-xs text-on-surface">
              <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold">1. Dual Antiplatelet Therapy (DAPT)</span>
                  <span className="text-primary font-bold">EXECUTED</span>
                </div>
                <p className="text-on-surface-variant">Aspirin 325mg PO chewed + Ticagrelor 180mg PO loading dose.</p>
              </div>
              <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold">2. High-Intensity Statin Plaque Stabilization</span>
                  <span className="text-primary font-bold">EXECUTED</span>
                </div>
                <p className="text-on-surface-variant">Atorvastatin 80mg PO OD administered.</p>
              </div>
              <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold">3. Anticoagulation Pre-Cath Staging</span>
                  <span className="text-secondary font-bold">STAGED FOR SHEATH INSERTION</span>
                </div>
                <p className="text-on-surface-variant">Unfractionated Heparin 5000 IU IV (or 70 U/kg) on radial puncture.</p>
              </div>
              <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold">4. Emergency Cath Lab 01 Activation</span>
                  <span className="text-primary font-bold">STAGE 2 ACTIVE</span>
                </div>
                <p className="text-on-surface-variant">Cath interventional team standby, room sterile prep complete.</p>
              </div>
            </div>
            <div className="bg-surface-container p-space-md flex justify-end">
              <button
                onClick={() => setShowProtocolModal(false)}
                className="px-4 py-2 bg-primary text-on-primary rounded-lg font-semibold text-xs"
              >
                Close Protocol View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PRINT HARDCOPY DOCUMENTATION */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-inverse-surface/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col border border-outline-variant">
            <div className="bg-surface-container p-space-md flex items-center justify-between border-b border-surface-container-high">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">print</span>
                <span className="font-section-title text-section-title text-on-surface">
                  Print Patient Orders &amp; Consent Dossier
                </span>
              </div>
              <button onClick={() => setShowPrintModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="p-space-md text-xs font-clinical-data space-y-3">
              <p>Ready to print 4 procedural documents for patient <strong>Rahul Sharma (DEL-2024-8841)</strong>:</p>
              <ul className="list-disc pl-5 space-y-1 text-on-surface-variant">
                <li>Form CF-PCI-04: Countersigned Consent with Aadhaar OTP Log</li>
                <li>PPCI Interventional Order Set Sheet</li>
                <li>Bedside MAR Flowsheet with Antiplatelet Administration Signature</li>
                <li>Cath Lab Handover Checklist (6/7 Cleared)</li>
              </ul>
            </div>
            <div className="bg-surface-container p-space-md flex justify-end gap-2 border-t border-surface-container-high">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 bg-surface-container-high text-on-surface rounded-lg text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  window.print();
                  showToast("Dossier sent to Zebra Bedside Printer.");
                  setShowPrintModal(false);
                }}
                className="px-5 py-2 bg-primary text-on-primary rounded-lg font-semibold text-xs flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">print</span> Print All Documents
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: LOG INTRA-OP RX */}
      {showIntraOpRxModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-inverse-surface/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col border border-outline-variant">
            <div className="bg-surface-container p-space-md flex items-center justify-between border-b border-surface-container-high">
              <span className="font-section-title text-section-title text-on-surface">Log Intra-Operative Rx</span>
              <button onClick={() => setShowIntraOpRxModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="p-space-md space-y-3 text-xs font-clinical-data">
              <div>
                <label className="font-semibold block mb-1">Medication Administered</label>
                <select className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg">
                  <option>Heparin 5,000 IU IV Bolus</option>
                  <option>Nitroglycerin 200 mcg Intracoronary</option>
                  <option>Adenosine 120 mcg Intracoronary</option>
                  <option>Verapamil 200 mcg Intracoronary (No-Reflow)</option>
                </select>
              </div>
              <div>
                <label className="font-semibold block mb-1">Dose &amp; Access Port</label>
                <input
                  type="text"
                  defaultValue="5000 IU via 6F Radial Sheath"
                  className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg"
                />
              </div>
            </div>
            <div className="bg-surface-container p-space-md flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowIntraOpRxModal(false);
                  showToast("Intra-op medication logged into eMAR.");
                }}
                className="px-4 py-2 bg-primary text-on-primary rounded-lg font-semibold text-xs"
              >
                Commit Dose
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD NURSE TASK */}
      {showNurseTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-inverse-surface/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col border border-outline-variant">
            <div className="bg-surface-container p-space-md flex items-center justify-between border-b border-surface-container-high">
              <span className="font-section-title text-section-title text-on-surface">Add Bedside Nurse Task</span>
              <button onClick={() => setShowNurseTaskModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="p-space-md space-y-3 text-xs font-clinical-data">
              <div>
                <label className="font-semibold block mb-1">Task Nomenclature</label>
                <input
                  type="text"
                  defaultValue="Check distal radial pulse & Barbeau test q15m post-sheath insertion"
                  className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Assigned Nurse</label>
                <input
                  type="text"
                  defaultValue="Sister Anjali K. (RN #3918)"
                  className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-lg"
                />
              </div>
            </div>
            <div className="bg-surface-container p-space-md flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowNurseTaskModal(false);
                  showToast("Bedside nursing task added & dispatched.");
                }}
                className="px-4 py-2 bg-primary text-on-primary rounded-lg font-semibold text-xs"
              >
                Dispatch Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VIEW ECG STRIP */}
      {showEcgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-inverse-surface/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col border border-outline-variant">
            <div className="bg-surface-container p-space-md flex items-center justify-between border-b border-surface-container-high">
              <span className="font-section-title text-section-title text-on-surface">
                12-Lead Electrocardiogram Baseline (14:15 IST)
              </span>
              <button onClick={() => setShowEcgModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="p-4 bg-red-50/50 flex flex-col items-center justify-center border-y border-outline-variant/30">
              <div className="w-full h-40 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] flex items-center justify-center flex-col gap-2">
                <span className="material-symbols-outlined text-4xl text-error">ecg</span>
                <span className="font-clinical-data-mono text-xs text-error font-bold">
                  Leads V1-V4: ST Elevation +3.2mm · Hyperacute T-waves
                </span>
                <span className="text-[11px] text-on-surface-variant">Reciprocal ST depression in Inferior Leads II, III, aVF</span>
              </div>
            </div>
            <div className="p-space-md bg-surface-container flex justify-end">
              <button
                onClick={() => setShowEcgModal(false)}
                className="px-4 py-2 bg-primary text-on-primary rounded-lg font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
