"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";

interface SubsystemBridge {
  id: string;
  name: string;
  protocol: string;
  endpoint: string;
  p95Latency: string;
  errorRate24h: string;
  lastSuccess: string;
  status: "online" | "degraded";
  description: string;
  throughput: string;
}

interface DiagnosticLogItem {
  id: string;
  timestamp: string;
  bridgeName: string;
  action: string;
  status: "OK" | "WARN" | "ERR";
  duration: string;
  details: string;
}

export default function IntegrationLogsPage() {
  const [bridges, setBridges] = useState<SubsystemBridge[]>([
    {
      id: "pacs",
      name: "PACS DICOM Radiology Server",
      protocol: "DIMSE / DICOMweb C-STORE (Port 104)",
      endpoint: "dicom.apollo-central.internal:104",
      p95Latency: "88 ms",
      errorRate24h: "0.02%",
      lastSuccess: "Just now",
      status: "online",
      description: "Cardiac cath angiogram runs & multidetector CT angiography slices streaming.",
      throughput: "14.2 MB/s",
    },
    {
      id: "lis",
      name: "LIS Central Laboratory System",
      protocol: "HL7 v2.5 MLLP (Port 2575)",
      endpoint: "lis-broker.apollo.internal:2575",
      p95Latency: "24 ms",
      errorRate24h: "0.00%",
      lastSuccess: "1 min ago",
      status: "online",
      description: "Roche Cobas & Beckman Coulter automated analyzer result feeds (hs-cTnI, CBC).",
      throughput: "128 msg/min",
    },
    {
      id: "pharmacy",
      name: "Pharmacy Vault Dispense System",
      protocol: "REST API / TLS 1.3",
      endpoint: "https://vault-api.apollo.internal/v2/dispense",
      p95Latency: "45 ms",
      errorRate24h: "0.01%",
      lastSuccess: "3 mins ago",
      status: "online",
      description: "Omnicell robotic vault dispensing & pneumatic tube station tracking.",
      throughput: "42 req/min",
    },
    {
      id: "his",
      name: "Central Hospital Information System (HIS)",
      protocol: "HL7 FHIR R4 (HAPI Engine)",
      endpoint: "https://fhir.apollo.internal/r4",
      p95Latency: "38 ms",
      errorRate24h: "0.04%",
      lastSuccess: "Just now",
      status: "online",
      description: "Master Patient Index (MPI), bed census, billing tariffs, and insurance ledger.",
      throughput: "310 req/min",
    },
    {
      id: "whisper",
      name: "Whisper Speech AI Scribe Engine",
      protocol: "WSS Streaming WebSocket",
      endpoint: "wss://scribe.careflow.internal/stream",
      p95Latency: "112 ms",
      errorRate24h: "0.12%",
      lastSuccess: "2 mins ago",
      status: "online",
      description: "Acoustic ambient microphone streaming with medical domain vocabulary.",
      throughput: "4 concurrent streams",
    },
    {
      id: "sms",
      name: "Patient SMS & WhatsApp Gateway",
      protocol: "HTTPS / DLT Verified (Airtel Enterprise)",
      endpoint: "https://dlt-sms.telecom.gov.in/api",
      p95Latency: "240 ms",
      errorRate24h: "0.34%",
      lastSuccess: "5 mins ago",
      status: "degraded",
      description: "Transactional discharge summaries, OTP verification, and appointment slips.",
      throughput: "18 sms/min",
    },
    {
      id: "radius",
      name: "RADIUS 802.1X Auth Controller",
      protocol: "RADIUS UDP (Port 1812/1813)",
      endpoint: "radius-auth.apollo.internal:1812",
      p95Latency: "12 ms",
      errorRate24h: "0.00%",
      lastSuccess: "Just now",
      status: "online",
      description: "Zero-Trust network access control for WOW carts, clinician tablets, and workstations.",
      throughput: "184 active leases",
    },
    {
      id: "poct",
      name: "Point-of-Care Bedside Devices (POCT)",
      protocol: "Bluetooth LE / ASTM 1381",
      endpoint: "poct-gateway.apollo.internal:9000",
      p95Latency: "18 ms",
      errorRate24h: "0.05%",
      lastSuccess: "1 min ago",
      status: "online",
      description: "i-STAT portable blood gas & Accu-Chek Inform II bedside glucometers.",
      throughput: "24 syncs/hr",
    },
  ]);

  const [logs, setLogs] = useState<DiagnosticLogItem[]>([
    {
      id: "l-1",
      timestamp: "14:28:11 IST",
      bridgeName: "Central HIS (FHIR R4)",
      action: "Composition.create",
      status: "OK",
      duration: "38ms",
      details: "Discharge summary bundle committed for Rahul Sharma (DEL-2024-8841).",
    },
    {
      id: "l-2",
      timestamp: "14:26:04 IST",
      bridgeName: "PACS DICOM",
      action: "C-STORE Image Ingestion",
      status: "OK",
      duration: "94ms",
      details: "Stored series #04 (Right radial coronary angiogram LAD stent view, 48 frames).",
    },
    {
      id: "l-3",
      timestamp: "14:22:15 IST",
      bridgeName: "SMS / WhatsApp Gateway",
      action: "SendTransactionalSMS",
      status: "WARN",
      duration: "410ms",
      details: "DLT operator latency spike (+170ms) on secondary queue.",
    },
    {
      id: "l-4",
      timestamp: "14:18:45 IST",
      bridgeName: "LIS Laboratory System",
      action: "ORU^R01 Lab Observation",
      status: "OK",
      duration: "22ms",
      details: "hs-cTnI result received: 1.42 ng/mL (STAT flag triggered).",
    },
    {
      id: "l-5",
      timestamp: "14:15:30 IST",
      bridgeName: "Whisper Speech AI Engine",
      action: "VoiceTokenTranscription",
      status: "OK",
      duration: "105ms",
      details: "Processed 4m 12s clinical consultation audio stream. Confidence 98.4%.",
    },
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const prevLogsCounterRef = useRef(100);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handlePingBridge = (bridge: SubsystemBridge) => {
    setBridges((prev) =>
      prev.map((b) => (b.id === bridge.id ? { ...b, lastSuccess: "Just now" } : b))
    );
    const newLogItem: DiagnosticLogItem = {
      id: `ping-${prevLogsCounterRef.current++}`,
      timestamp: "Just now",
      bridgeName: bridge.name,
      action: "HealthCheckPing",
      status: "OK",
      duration: bridge.p95Latency,
      details: `Synthetic ping to ${bridge.endpoint} succeeded.`,
    };
    setLogs((prev) => [newLogItem, ...prev]);
    showToast(`ICMP & TCP synthetic ping to ${bridge.endpoint} succeeded (Latency: ${bridge.p95Latency}).`);
  };

  return (
    <div className="flex flex-col w-full gap-space-base pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-inverse-surface text-inverse-on-surface shadow-lg text-clinical-data font-clinical-data border border-outline-variant/30 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="material-symbols-outlined text-primary-fixed text-lg">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Stage */}
      <div className="flex flex-col gap-space-sm">
        <div className="flex items-center gap-space-xs text-metadata-micro font-metadata-micro text-outline">
          <Link href="/quality-audit-logs" className="hover:text-primary transition-colors">
            Governance &amp; Control
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="font-clinical-data-mono text-primary font-semibold">Integration Details &amp; Logs</span>
          <span className="ml-2 px-1.5 py-0.5 rounded bg-primary text-on-primary font-metadata-micro uppercase">
            8 Bridges Monitored
          </span>
        </div>

        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-space-base pb-space-sm">
          <div className="flex items-center gap-space-sm">
            <div className="h-10 w-10 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-2xl">cable</span>
            </div>
            <div>
              <h1 className="font-page-title text-page-title text-on-surface font-semibold">
                Hospital Subsystem Bridges &amp; Integration Logs
              </h1>
              <p className="font-body-default text-clinical-data text-on-surface-variant">
                Live health monitors, throughput metrics, and real-time MLLP / DICOM / REST diagnostic streams
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => showToast("Synthetic health check ping sent across all 8 subsystem interfaces.")}
              className="px-space-md py-1.5 bg-surface-container hover:bg-surface-container-high rounded-lg text-clinical-data font-clinical-data text-on-surface transition-colors flex items-center gap-1 border border-outline-variant/20 shadow-xs"
            >
              <span className="material-symbols-outlined text-sm text-primary">network_check</span>
              <span>Health Check All</span>
            </button>
            <button
              onClick={() => showToast("Downloaded raw diagnostic trace log (CSV & PCAP bundle).")}
              className="px-space-md py-1.5 bg-secondary hover:bg-secondary/90 rounded-lg text-clinical-data font-clinical-data text-on-secondary transition-colors flex items-center gap-1 shadow-xs"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              <span>Export Trace Logs</span>
            </button>
            <Link
              href="/abdm-fhir-gateway"
              className="px-space-md py-1.5 bg-primary hover:bg-primary-container rounded-lg text-clinical-data font-clinical-data font-semibold text-on-primary transition-colors flex items-center gap-1 shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">hub</span>
              <span>ABDM Gateway</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 8 Subsystem Bridge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-sm">
        {bridges.map((b) => (
          <div
            key={b.id}
            className="p-space-sm bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm flex flex-col justify-between gap-space-xs hover:border-primary/40 transition-all"
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-clinical-data text-on-surface">{b.name}</span>
                <span
                  className={`px-2 py-0.5 rounded font-clinical-data-mono text-[10px] font-bold flex items-center gap-1 ${
                    b.status === "online"
                      ? "bg-primary-fixed text-on-primary-fixed"
                      : "bg-amber-100 text-amber-900"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      b.status === "online" ? "bg-primary animate-pulse" : "bg-amber-600"
                    }`}
                  ></span>
                  {b.status.toUpperCase()}
                </span>
              </div>
              <span className="text-[11px] font-clinical-data-mono text-primary font-semibold">
                {b.protocol}
              </span>
              <p className="text-metadata-micro text-on-surface-variant leading-snug">
                {b.description}
              </p>
            </div>

            <div className="pt-2 border-t border-surface-container-high flex flex-col gap-1 text-metadata-micro font-clinical-data-mono">
              <div className="flex justify-between text-outline">
                <span>Endpoint:</span>
                <span className="text-on-surface truncate max-w-[150px]">{b.endpoint}</span>
              </div>
              <div className="flex justify-between text-outline">
                <span>P95 Latency:</span>
                <span className="font-bold text-primary">{b.p95Latency}</span>
              </div>
              <div className="flex justify-between text-outline">
                <span>Error Rate (24h):</span>
                <span className="text-on-surface">{b.errorRate24h}</span>
              </div>
              <div className="flex items-center justify-between pt-1 mt-1 border-t border-surface-container-high">
                <span className="text-outline">Throughput: {b.throughput}</span>
                <button
                  onClick={() => handlePingBridge(b)}
                  className="px-2 py-0.5 rounded bg-surface-container hover:bg-surface-container-high text-primary font-semibold text-metadata-micro flex items-center gap-0.5"
                >
                  <span className="material-symbols-outlined text-xs">play_arrow</span> Ping
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Real-Time Diagnostic Stream Log */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="p-space-sm bg-surface-container-low border-b border-surface-container-high flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-base">receipt_long</span>
            <span className="font-table-header text-table-header uppercase text-outline">
              Real-time Subsystem Message &amp; Transaction Stream
            </span>
          </div>
          <span className="text-metadata-micro font-clinical-data-mono text-outline">
            Buffer: Last 200 Transactions · Auto-refresh: 1s
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-clinical-data font-clinical-data">
            <thead>
              <tr className="bg-surface-container-low/50 border-b border-surface-container-high font-table-header text-table-header text-outline uppercase">
                <th className="p-3">Timestamp</th>
                <th className="p-3">Bridge / System</th>
                <th className="p-3">Action / Protocol</th>
                <th className="p-3">Status</th>
                <th className="p-3">Duration</th>
                <th className="p-3">Transaction Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-surface-container-low/30 transition-colors">
                  <td className="p-3 font-clinical-data-mono text-metadata-micro text-outline whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="p-3 font-bold text-on-surface whitespace-nowrap">
                    {log.bridgeName}
                  </td>
                  <td className="p-3 font-clinical-data-mono text-metadata-micro text-primary font-semibold whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded font-clinical-data-mono text-metadata-micro font-bold ${
                        log.status === "OK"
                          ? "bg-primary-fixed text-on-primary-fixed"
                          : log.status === "WARN"
                          ? "bg-amber-100 text-amber-900"
                          : "bg-error text-on-error"
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="p-3 font-clinical-data-mono text-metadata-micro text-outline whitespace-nowrap">
                    {log.duration}
                  </td>
                  <td className="p-3 text-metadata-micro text-on-surface-variant">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
