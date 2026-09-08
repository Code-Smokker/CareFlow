"use client";

import React, { useState } from "react";
import Link from "next/link";

interface FhirBundleRecord {
  id: string;
  bundleId: string;
  resourceType: "Composition" | "Encounter" | "Observation" | "DiagnosticReport" | "MedicationRequest";
  patientUhid: string;
  patientName: string;
  status: "Synced" | "Pending" | "Failed";
  validation: "Schema Pass" | "Warning" | "Validation Error";
  latency: string;
  timestamp: string;
  payloadJson: string;
}

export default function AbdmFhirGatewayPage() {
  const [selectedBundle, setSelectedBundle] = useState<FhirBundleRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "synced" | "failed">("all");

  const [bundles, setBundles] = useState<FhirBundleRecord[]>([
    {
      id: "b-1",
      bundleId: "BUNDLE-2026-99120",
      resourceType: "Composition",
      patientUhid: "DEL-2024-8841",
      patientName: "Rahul Sharma",
      status: "Synced",
      validation: "Schema Pass",
      latency: "38ms",
      timestamp: "14:28:10 IST",
      payloadJson: JSON.stringify(
        {
          resourceType: "Bundle",
          id: "BUNDLE-2026-99120",
          meta: { profile: ["https://nrces.in/ndhm/fhir/r4/StructureDefinition/DischargeSummaryRecord"] },
          type: "document",
          timestamp: "2026-10-18T14:28:10+05:30",
          entry: [
            {
              fullUrl: "urn:uuid:comp-88219",
              resource: {
                resourceType: "Composition",
                status: "final",
                type: { coding: [{ system: "http://snomed.info/sct", code: "373942005", display: "Discharge summary" }] },
                subject: { reference: "Patient/DEL-2024-8841", display: "Rahul Sharma" },
                author: [{ reference: "Practitioner/USR-IND-88219", display: "Dr. Rohit Verma" }],
              },
            },
          ],
        },
        null,
        2
      ),
    },
    {
      id: "b-2",
      bundleId: "BUNDLE-2026-99118",
      resourceType: "DiagnosticReport",
      patientUhid: "DEL-2024-8841",
      patientName: "Rahul Sharma",
      status: "Synced",
      validation: "Schema Pass",
      latency: "42ms",
      timestamp: "14:18:45 IST",
      payloadJson: JSON.stringify(
        {
          resourceType: "DiagnosticReport",
          id: "DR-cTnI-0912",
          status: "final",
          code: { coding: [{ system: "http://loinc.org", code: "49563-0", display: "Troponin I.cardiac [Mass/volume]" }] },
          subject: { reference: "Patient/DEL-2024-8841" },
          valueQuantity: { value: 1.42, unit: "ng/mL", system: "http://unitsofmeasure.org", code: "ng/mL" },
        },
        null,
        2
      ),
    },
    {
      id: "b-3",
      bundleId: "BUNDLE-2026-99105",
      resourceType: "MedicationRequest",
      patientUhid: "DEL-2024-8841",
      patientName: "Rahul Sharma",
      status: "Synced",
      validation: "Schema Pass",
      latency: "34ms",
      timestamp: "14:12:02 IST",
      payloadJson: JSON.stringify(
        {
          resourceType: "MedicationRequest",
          id: "MR-DAPT-4412",
          status: "active",
          intent: "order",
          medicationCodeableConcept: { coding: [{ code: "TICAGRELOR-180", display: "Ticagrelor 180mg STAT" }] },
        },
        null,
        2
      ),
    },
    {
      id: "b-4",
      bundleId: "BUNDLE-2026-99092",
      resourceType: "Observation",
      patientUhid: "MAH-2024-3129",
      patientName: "Sunita Devi",
      status: "Synced",
      validation: "Warning",
      latency: "64ms",
      timestamp: "13:50:11 IST",
      payloadJson: JSON.stringify(
        {
          resourceType: "Observation",
          id: "OBS-BP-3129",
          status: "final",
          code: { coding: [{ system: "http://loinc.org", code: "85354-9", display: "Blood pressure panel" }] },
          note: [{ text: "Systolic BP 190 mmHg requires immediate vasodilatory protocol." }],
        },
        null,
        2
      ),
    },
    {
      id: "b-5",
      bundleId: "BUNDLE-2026-99081",
      resourceType: "Encounter",
      patientUhid: "KER-2024-1920",
      patientName: "Mohammad Farooq",
      status: "Failed",
      validation: "Validation Error",
      latency: "182ms",
      timestamp: "13:42:00 IST",
      payloadJson: JSON.stringify(
        {
          resourceType: "Encounter",
          id: "ENC-FAIL-1920",
          error: "NRCES Schema: Missing mandatory .serviceProvider organization identifier.",
          status: "in-progress",
        },
        null,
        2
      ),
    },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRetryBundle = (bundle: FhirBundleRecord) => {
    setBundles((prev) =>
      prev.map((b) => (b.id === bundle.id ? { ...b, status: "Synced", validation: "Schema Pass" } : b))
    );
    showToast(`Retried ${bundle.bundleId}: Successfully validated against NRCES schema and ingested!`);
    if (selectedBundle?.id === bundle.id) {
      setSelectedBundle({ ...bundle, status: "Synced", validation: "Schema Pass" });
    }
  };

  const filteredBundles = bundles.filter((b) => {
    if (activeTab === "synced") return b.status === "Synced";
    if (activeTab === "failed") return b.status === "Failed";
    return true;
  });

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
          <span className="font-clinical-data-mono text-primary font-semibold">ABDM &amp; FHIR Gateway</span>
          <span className="ml-2 px-1.5 py-0.5 rounded bg-primary text-on-primary font-metadata-micro uppercase">
            M1 · M2 · M3 LIVE
          </span>
        </div>

        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-space-base pb-space-sm">
          <div className="flex items-center gap-space-sm">
            <div className="h-10 w-10 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-2xl">hub</span>
            </div>
            <div>
              <h1 className="font-page-title text-page-title text-on-surface font-semibold">
                ABDM &amp; FHIR R4 Gateway Monitor
              </h1>
              <p className="font-body-default text-clinical-data text-on-surface-variant">
                Ayushman Bharat Digital Mission (ABDM) Integration Console · HAPI FHIR R4 Validator &amp; Ingestion Pipeline
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => showToast("Triggered schema synchronization with NRCES National Directory.")}
              className="px-space-md py-1.5 bg-surface-container hover:bg-surface-container-high rounded-lg text-clinical-data font-clinical-data text-on-surface transition-colors flex items-center gap-1 border border-outline-variant/20 shadow-xs"
            >
              <span className="material-symbols-outlined text-sm text-primary">sync</span>
              <span>Sync NRCES Schemas</span>
            </button>
            <button
              onClick={() => showToast("Flushed outbound dead-letter queue (14 retried).")}
              className="px-space-md py-1.5 bg-secondary hover:bg-secondary/90 rounded-lg text-clinical-data font-clinical-data text-on-secondary transition-colors flex items-center gap-1 shadow-xs"
            >
              <span className="material-symbols-outlined text-sm">restart_alt</span>
              <span>Flush Retry Queue</span>
            </button>
            <Link
              href="/patient-registry"
              className="px-space-md py-1.5 bg-primary hover:bg-primary-container rounded-lg text-clinical-data font-clinical-data font-semibold text-on-primary transition-colors flex items-center gap-1 shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">badge</span>
              <span>ABHA Registry</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Top Status Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-space-sm">
        <div className="p-space-sm bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-outline text-metadata-micro font-semibold uppercase">
            <span>FHIR R4 Server</span>
            <span className="material-symbols-outlined text-primary text-base">dns</span>
          </div>
          <div className="mt-2">
            <span className="font-bold text-clinical-data text-on-surface">HAPI FHIR v6.8.0</span>
            <div className="text-metadata-micro font-clinical-data-mono text-primary font-semibold flex items-center gap-1 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
              ONLINE · 42ms
            </div>
          </div>
        </div>

        <div className="p-space-sm bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-outline text-metadata-micro font-semibold uppercase">
            <span>ABDM Bridge</span>
            <span className="material-symbols-outlined text-primary text-base">cloud_sync</span>
          </div>
          <div className="mt-2">
            <span className="font-bold text-clinical-data text-on-surface">Gateway v1.0</span>
            <div className="text-metadata-micro font-clinical-data-mono text-primary font-semibold flex items-center gap-1 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
              CONNECTED · 99.98%
            </div>
          </div>
        </div>

        <div className="p-space-sm bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-outline text-metadata-micro font-semibold uppercase">
            <span>Validation Ratio</span>
            <span className="material-symbols-outlined text-primary text-base">fact_check</span>
          </div>
          <div className="mt-2">
            <span className="font-bold text-clinical-data text-on-surface">99.4% PASS</span>
            <div className="text-metadata-micro font-clinical-data-mono text-on-surface-variant mt-0.5">
              1,248 / 1,256 Valid
            </div>
          </div>
        </div>

        <div className="p-space-sm bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-outline text-metadata-micro font-semibold uppercase">
            <span>ABHA Link Rate</span>
            <span className="material-symbols-outlined text-primary text-base">link</span>
          </div>
          <div className="mt-2">
            <span className="font-bold text-clinical-data text-on-surface">98.2% Linked</span>
            <div className="text-metadata-micro font-clinical-data-mono text-on-surface-variant mt-0.5">
              Token #104 Active
            </div>
          </div>
        </div>

        <div className="p-space-sm bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-outline text-metadata-micro font-semibold uppercase">
            <span>Outbound Queue</span>
            <span className="material-symbols-outlined text-secondary text-base">outgoing_mail</span>
          </div>
          <div className="mt-2">
            <span className="font-bold text-clinical-data text-on-surface">14 In-Flight</span>
            <div className="text-metadata-micro font-clinical-data-mono text-secondary font-semibold mt-0.5">
              0 Critical Deadlocks
            </div>
          </div>
        </div>

        <div className="p-space-sm bg-surface-container-lowest rounded-xl border border-error/30 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-error text-metadata-micro font-bold uppercase">
            <span>Failed Bundles</span>
            <span className="material-symbols-outlined text-error text-base">error</span>
          </div>
          <div className="mt-2">
            <span className="font-bold text-clinical-data text-error">1 in Retry Queue</span>
            <div className="text-metadata-micro font-clinical-data-mono text-error mt-0.5">
              Action Required
            </div>
          </div>
        </div>
      </div>

      {/* Milestone Health Bar */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-base border border-outline-variant/30 flex flex-col gap-space-sm">
        <span className="font-table-header text-table-header uppercase text-outline">
          Ayushman Bharat Digital Mission (ABDM) Milestone Readiness
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm">
          <div className="p-space-sm bg-surface-container-low rounded-xl border border-outline-variant/15 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-clinical-data text-on-surface">Milestone M1: ABHA Registration</span>
              <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-clinical-data-mono text-[10px] font-bold">
                ACTIVE 100%
              </span>
            </div>
            <p className="text-metadata-micro text-on-surface-variant leading-snug">
              Aadhaar &amp; Mobile OTP verification; ABHA number generation &amp; QR scan integration online.
            </p>
          </div>

          <div className="p-space-sm bg-surface-container-low rounded-xl border border-outline-variant/15 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-clinical-data text-on-surface">Milestone M2: HIP / HIU Services</span>
              <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-clinical-data-mono text-[10px] font-bold">
                HPR / HFR SYNCED
              </span>
            </div>
            <p className="text-metadata-micro text-on-surface-variant leading-snug">
              Healthcare Professionals Registry (Dr. Rohit Verma) &amp; Facility Registry (Apollo Central) verified.
            </p>
          </div>

          <div className="p-space-sm bg-surface-container-low rounded-xl border border-outline-variant/15 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-clinical-data text-on-surface">Milestone M3: Data Exchange</span>
              <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-clinical-data-mono text-[10px] font-bold">
                FHIR R4 ACTIVE
              </span>
            </div>
            <p className="text-metadata-micro text-on-surface-variant leading-snug">
              Consent Artefact processing &amp; end-to-end encrypted health record push to patient Personal Health Locker.
            </p>
          </div>
        </div>
      </div>

      {/* Ingestion & Outbound Bundle Stream Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="p-space-sm bg-surface-container-low border-b border-surface-container-high flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="font-table-header text-table-header uppercase text-outline">
              FHIR R4 Ingestion &amp; Outbound Transaction Ledger
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-2 py-0.5 rounded text-metadata-micro font-semibold transition-colors ${
                  activeTab === "all"
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container text-on-surface-variant"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab("synced")}
                className={`px-2 py-0.5 rounded text-metadata-micro font-semibold transition-colors ${
                  activeTab === "synced"
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container text-on-surface-variant"
                }`}
              >
                Synced
              </button>
              <button
                onClick={() => setActiveTab("failed")}
                className={`px-2 py-0.5 rounded text-metadata-micro font-semibold transition-colors ${
                  activeTab === "failed"
                    ? "bg-error text-on-error"
                    : "bg-surface-container text-on-surface-variant"
                }`}
              >
                Failed
              </button>
            </div>
          </div>
          <span className="text-metadata-micro font-clinical-data-mono text-outline">
            Profile: nrces.in/ndhm/fhir/r4/StructureDefinition
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-clinical-data font-clinical-data">
            <thead>
              <tr className="bg-surface-container-low/50 border-b border-surface-container-high font-table-header text-table-header text-outline uppercase">
                <th className="p-3">Bundle ID</th>
                <th className="p-3">Resource Type</th>
                <th className="p-3">Patient Context</th>
                <th className="p-3">Sync Status</th>
                <th className="p-3">NRCES Validation</th>
                <th className="p-3">Latency</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high">
              {filteredBundles.map((b) => (
                <tr
                  key={b.id}
                  onClick={() => setSelectedBundle(b)}
                  className="hover:bg-surface-container-low/40 transition-colors cursor-pointer"
                >
                  <td className="p-3 font-clinical-data-mono font-bold text-primary">
                    {b.bundleId}
                  </td>
                  <td className="p-3 font-semibold text-on-surface">
                    {b.resourceType}
                  </td>
                  <td className="p-3">
                    <div className="flex flex-col">
                      <span className="font-semibold text-on-surface">{b.patientName}</span>
                      <span className="text-metadata-micro font-clinical-data-mono text-outline">
                        {b.patientUhid}
                      </span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded font-clinical-data-mono text-metadata-micro font-bold ${
                        b.status === "Synced"
                          ? "bg-primary-fixed text-on-primary-fixed"
                          : "bg-error text-on-error"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`text-metadata-micro font-semibold ${
                        b.validation === "Schema Pass"
                          ? "text-primary"
                          : b.validation === "Warning"
                          ? "text-amber-800"
                          : "text-error"
                      }`}
                    >
                      {b.validation}
                    </span>
                  </td>
                  <td className="p-3 font-clinical-data-mono text-metadata-micro text-outline">
                    {b.latency}
                  </td>
                  <td className="p-3 font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                    {b.timestamp}
                  </td>
                  <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      {b.status === "Failed" && (
                        <button
                          onClick={() => handleRetryBundle(b)}
                          className="px-2 py-1 bg-primary text-on-primary rounded text-metadata-micro font-semibold hover:bg-primary-container transition-colors"
                        >
                          Retry
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedBundle(b)}
                        className="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors"
                        title="Inspect JSON Payload"
                      >
                        <span className="material-symbols-outlined text-base">code</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* JSON Payload Inspector Drawer / Modal */}
      {selectedBundle && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-2xl border border-outline-variant/30 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            <div className="p-space-base border-b border-surface-container-high flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-xl">data_object</span>
                <div>
                  <h3 className="font-section-title text-section-title text-on-surface font-semibold">
                    FHIR R4 Bundle Payload Inspector
                  </h3>
                  <span className="text-metadata-micro font-clinical-data-mono text-outline">
                    {selectedBundle.bundleId} · {selectedBundle.resourceType}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedBundle(null)}
                className="p-1 rounded-md text-outline hover:text-on-surface hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="p-space-base overflow-y-auto flex-1 bg-slate-950 text-slate-100 font-clinical-data-mono text-xs">
              <pre className="whitespace-pre-wrap">{selectedBundle.payloadJson}</pre>
            </div>

            <div className="p-space-base bg-surface-container-low border-t border-surface-container-high flex items-center justify-between flex-wrap gap-2">
              <div className="text-metadata-micro font-clinical-data-mono text-outline">
                Validation: <strong className="text-primary">{selectedBundle.validation}</strong>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(selectedBundle.payloadJson);
                    showToast("Copied JSON bundle payload to clipboard.");
                  }}
                  className="px-3 py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface text-metadata-micro font-semibold transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-xs">content_copy</span>
                  <span>Copy JSON</span>
                </button>
                {selectedBundle.status === "Failed" && (
                  <button
                    onClick={() => handleRetryBundle(selectedBundle)}
                    className="px-3 py-1.5 rounded bg-primary hover:bg-primary-container text-on-primary text-metadata-micro font-semibold transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs">restart_alt</span>
                    <span>Retry Push</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
