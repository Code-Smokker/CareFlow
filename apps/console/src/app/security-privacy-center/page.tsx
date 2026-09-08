"use client";

import React, { useState } from "react";
import Link from "next/link";

interface ConsentArtefact {
  id: string;
  artefactId: string;
  patientName: string;
  patientUhid: string;
  purpose: string;
  status: "ACTIVE" | "EXPIRED" | "REVOKED";
  grantedDate: string;
  expiryDate: string;
  dataTypes: string[];
}

interface SecurityEvent {
  id: string;
  timestamp: string;
  severity: "info" | "warning" | "critical";
  title: string;
  source: string;
  actor: string;
  details: string;
}

export default function SecurityPrivacyCenterPage() {
  const [consentList, setConsentList] = useState<ConsentArtefact[]>([
    {
      id: "c-1",
      artefactId: "CONSENT-ARTEFACT-9921",
      patientName: "Rahul Sharma",
      patientUhid: "DEL-2024-8841",
      purpose: "Emergency Care & Telemetry Access (EMER)",
      status: "ACTIVE",
      grantedDate: "18-Oct-2026 14:02 IST",
      expiryDate: "19-Oct-2026 14:02 IST",
      dataTypes: ["DiagnosticReport", "CarePlan", "MedicationRequest", "Observation"],
    },
    {
      id: "c-2",
      artefactId: "CONSENT-ARTEFACT-8812",
      patientName: "Sunita Devi",
      patientUhid: "MAH-2024-3129",
      purpose: "Routine Care & Consultation (CAREMGT)",
      status: "ACTIVE",
      grantedDate: "15-Oct-2026 10:15 IST",
      expiryDate: "15-Nov-2026 10:15 IST",
      dataTypes: ["DischargeSummary", "Prescription", "LabReports"],
    },
    {
      id: "c-3",
      artefactId: "CONSENT-ARTEFACT-7719",
      patientName: "Mohammad Farooq",
      patientUhid: "KER-2024-1920",
      purpose: "Longitudinal Research & Audit (RESEARCH)",
      status: "EXPIRED",
      grantedDate: "01-Sep-2026 09:00 IST",
      expiryDate: "01-Oct-2026 09:00 IST",
      dataTypes: ["De-identified Vitals", "ECG Waveforms"],
    },
  ]);

  const [events] = useState<SecurityEvent[]>([
    {
      id: "ev-1",
      timestamp: "14:28 IST",
      severity: "info",
      title: "HSM Hardware Key Rotation",
      source: "AWS CloudHSM v2 (FIPS 140-2 Level 3)",
      actor: "System Security Engine",
      details: "Automated 30-day master database key rotation completed without downtime.",
    },
    {
      id: "ev-2",
      timestamp: "14:02 IST",
      severity: "info",
      title: "Emergency Break-Glass Granted",
      source: "Triage Kiosk / Bay 02",
      actor: "Dr. Rohit Verma (Chief)",
      details: "Emergency STEMI override for unassigned patient record #DEL-2024-8841. Audit log sealed.",
    },
    {
      id: "ev-3",
      timestamp: "13:10 IST",
      severity: "warning",
      title: "Untrusted Device Quarantine",
      source: "VLAN 99 WiFi Access Point #14",
      actor: "Network RADIUS Controller",
      details: "Non-MDM enrolled iPad blocked from transmitting CPOE medication orders.",
    },
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRevokeConsent = (artefactId: string) => {
    setConsentList((prev) =>
      prev.map((c) => (c.artefactId === artefactId ? { ...c, status: "REVOKED" } : c))
    );
    showToast(`Revoked Consent Artefact ${artefactId}. Access tokens invalidated.`);
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
          <span className="font-clinical-data-mono text-primary font-semibold">Security &amp; Privacy Center</span>
          <span className="ml-2 px-1.5 py-0.5 rounded bg-primary text-on-primary font-metadata-micro uppercase">
            DPDP Act 2023 Compliant
          </span>
        </div>

        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-space-base pb-space-sm">
          <div className="flex items-center gap-space-sm">
            <div className="h-10 w-10 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-2xl">verified_user</span>
            </div>
            <div>
              <h1 className="font-page-title text-page-title text-on-surface font-semibold">
                Security, Privacy &amp; Compliance Center
              </h1>
              <p className="font-body-default text-clinical-data text-on-surface-variant">
                India Digital Personal Data Protection (DPDP) Act 2023 · ABHA Consent Artifact Ledger &amp; PII Redaction Engine
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => showToast("Generated comprehensive DPDP 2023 Healthcare Compliance Audit (PDF).")}
              className="px-space-md py-1.5 bg-surface-container hover:bg-surface-container-high rounded-lg text-clinical-data font-clinical-data text-on-surface transition-colors flex items-center gap-1 border border-outline-variant/20 shadow-xs"
            >
              <span className="material-symbols-outlined text-sm text-primary">description</span>
              <span>Export Compliance Audit</span>
            </button>
            <button
              onClick={() => showToast("Forced immediate PII re-masking verification across active inference nodes.")}
              className="px-space-md py-1.5 bg-secondary hover:bg-secondary/90 rounded-lg text-clinical-data font-clinical-data text-on-secondary transition-colors flex items-center gap-1 shadow-xs"
            >
              <span className="material-symbols-outlined text-sm">visibility_off</span>
              <span>Verify PII Redaction</span>
            </button>
            <Link
              href="/permission-matrix"
              className="px-space-md py-1.5 bg-primary hover:bg-primary-container rounded-lg text-clinical-data font-clinical-data font-semibold text-on-primary transition-colors flex items-center gap-1 shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">grid_view</span>
              <span>RBAC Matrix</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Compliance Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-sm">
        <div className="p-space-sm bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-outline text-metadata-micro font-semibold uppercase">
            <span>Data Protection at Rest</span>
            <span className="material-symbols-outlined text-primary text-base">enhanced_encryption</span>
          </div>
          <div className="mt-2">
            <span className="font-bold text-clinical-data text-on-surface">AES-256-GCM / HSM</span>
            <div className="text-metadata-micro font-clinical-data-mono text-primary font-semibold flex items-center gap-1 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
              FIPS 140-2 Level 3 Hardware
            </div>
          </div>
        </div>

        <div className="p-space-sm bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-outline text-metadata-micro font-semibold uppercase">
            <span>Data in Transit</span>
            <span className="material-symbols-outlined text-primary text-base">vpn_lock</span>
          </div>
          <div className="mt-2">
            <span className="font-bold text-clinical-data text-on-surface">TLS 1.3 / mTLS Mesh</span>
            <div className="text-metadata-micro font-clinical-data-mono text-primary font-semibold mt-0.5">
              Strict Forward Secrecy
            </div>
          </div>
        </div>

        <div className="p-space-sm bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-outline text-metadata-micro font-semibold uppercase">
            <span>AI PII Redaction Engine</span>
            <span className="material-symbols-outlined text-secondary text-base">masks</span>
          </div>
          <div className="mt-2">
            <span className="font-bold text-clinical-data text-on-surface">Zero PII Leakage</span>
            <div className="text-metadata-micro font-clinical-data-mono text-secondary font-semibold mt-0.5">
              Aadhaar, PAN &amp; Phone Masked
            </div>
          </div>
        </div>

        <div className="p-space-sm bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-outline text-metadata-micro font-semibold uppercase">
            <span>DPDP Compliance Score</span>
            <span className="material-symbols-outlined text-primary text-base">policy</span>
          </div>
          <div className="mt-2">
            <span className="font-bold text-clinical-data text-primary">99.8% Compliant</span>
            <div className="text-metadata-micro font-clinical-data-mono text-outline mt-0.5">
              0 Regulatory Violations
            </div>
          </div>
        </div>
      </div>

      {/* ABHA Electronic Consent Artefact Ledger */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="p-space-sm bg-surface-container-low border-b border-surface-container-high flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-base">how_to_reg</span>
            <span className="font-table-header text-table-header uppercase text-outline">
              ABHA Electronic Consent Artefact Ledger (Patient Sovereignty)
            </span>
          </div>
          <span className="text-metadata-micro font-clinical-data-mono text-outline">
            National Health Authority (NHA) Consent Architecture v1.1
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-clinical-data font-clinical-data">
            <thead>
              <tr className="bg-surface-container-low/50 border-b border-surface-container-high font-table-header text-table-header text-outline uppercase">
                <th className="p-3">Artefact ID</th>
                <th className="p-3">Patient Context</th>
                <th className="p-3">Consent Purpose Code</th>
                <th className="p-3">Granted Scope</th>
                <th className="p-3">Validity Window</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high">
              {consentList.map((c) => (
                <tr key={c.id} className="hover:bg-surface-container-low/30 transition-colors">
                  <td className="p-3 font-clinical-data-mono font-bold text-primary">
                    {c.artefactId}
                  </td>
                  <td className="p-3">
                    <div className="flex flex-col">
                      <span className="font-bold text-on-surface">{c.patientName}</span>
                      <span className="text-metadata-micro font-clinical-data-mono text-outline">
                        {c.patientUhid}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 font-medium text-on-surface">
                    {c.purpose}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1 flex-wrap">
                      {c.dataTypes.map((dt, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded bg-surface-container font-clinical-data-mono text-[10px] text-on-surface-variant"
                        >
                          {dt}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3 font-clinical-data-mono text-metadata-micro">
                    <div className="flex flex-col">
                      <span className="text-outline">From: {c.grantedDate}</span>
                      <span className="text-on-surface">To: {c.expiryDate}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded font-clinical-data-mono text-metadata-micro font-bold ${
                        c.status === "ACTIVE"
                          ? "bg-primary-fixed text-on-primary-fixed"
                          : c.status === "EXPIRED"
                          ? "bg-surface-container text-outline"
                          : "bg-error text-on-error"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    {c.status === "ACTIVE" ? (
                      <button
                        onClick={() => handleRevokeConsent(c.artefactId)}
                        className="px-2 py-1 bg-surface-container text-error rounded text-metadata-micro font-semibold hover:bg-error hover:text-on-error transition-colors"
                      >
                        Revoke
                      </button>
                    ) : (
                      <span className="text-metadata-micro text-outline font-mono">Immutable</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Event Audit Timeline */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-space-base flex flex-col gap-space-sm">
        <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-base">security_update_good</span>
            <span className="font-table-header text-table-header uppercase text-outline">
              Real-time Security Event &amp; Privilege Escalation Audit Timeline
            </span>
          </div>
          <span className="text-metadata-micro font-clinical-data-mono text-outline">
            SHA-256 Tamper-Evident Ledger Block #99218
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="p-space-sm bg-surface-container-low rounded-lg border border-outline-variant/15 flex flex-col md:flex-row md:items-center justify-between gap-space-xs"
            >
              <div className="flex items-start gap-space-sm">
                <span
                  className={`material-symbols-outlined text-lg mt-0.5 ${
                    ev.severity === "critical"
                      ? "text-error"
                      : ev.severity === "warning"
                      ? "text-amber-800"
                      : "text-primary"
                  }`}
                >
                  {ev.severity === "critical"
                    ? "emergency"
                    : ev.severity === "warning"
                    ? "warning"
                    : "check_circle"}
                </span>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-clinical-data text-on-surface">{ev.title}</span>
                    <span className="text-metadata-micro font-clinical-data-mono text-outline">
                      [{ev.source}]
                    </span>
                  </div>
                  <p className="text-metadata-micro text-on-surface-variant leading-snug mt-0.5">
                    {ev.details}
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:items-end text-metadata-micro font-clinical-data-mono text-outline shrink-0">
                <span>Actor: <strong className="text-on-surface">{ev.actor}</strong></span>
                <span>{ev.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
