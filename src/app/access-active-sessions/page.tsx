"use client";

import React, { useState } from "react";
import Link from "next/link";

interface ActiveSessionRecord {
  id: string;
  userName: string;
  userRole: string;
  userDept: string;
  deviceHostname: string;
  deviceType: "desktop" | "mobile_wow" | "tablet" | "kiosk";
  ipAddress: string;
  subnet: string;
  facilityLocation: string;
  authType: string;
  authBadgeStyle: string;
  loginTime: string;
  lastActivity: string;
  status: "verified" | "flagged" | "expired";
}

export default function AccessActiveSessionsPage() {
  const [sessions, setSessions] = useState<ActiveSessionRecord[]>([
    {
      id: "sess-1",
      userName: "Dr. Rohit Verma",
      userRole: "Chief of Clinical Services",
      userDept: "Interventional Cardiology",
      deviceHostname: "Cath-Lab-Diagnostic-04",
      deviceType: "desktop",
      ipAddress: "10.14.2.81",
      subnet: "VLAN 20 (Cath Suite)",
      facilityLocation: "Apollo Central · Cath Lab 01",
      authType: "Hardware FIDO2 YubiKey",
      authBadgeStyle: "bg-primary-fixed text-on-primary-fixed",
      loginTime: "Today 14:02 IST",
      lastActivity: "2 mins ago",
      status: "verified",
    },
    {
      id: "sess-2",
      userName: "Sr. Ancy Thomas, RN",
      userRole: "Charge Triage Nurse",
      userDept: "Emergency Resuscitation",
      deviceHostname: "WOW-Mobile-Cart-02",
      deviceType: "mobile_wow",
      ipAddress: "10.14.8.19",
      subnet: "VLAN 40 (Nursing Mobile)",
      facilityLocation: "Emergency Bay 02",
      authType: "Biometric TouchID",
      authBadgeStyle: "bg-secondary-container text-on-secondary-container",
      loginTime: "Today 13:45 IST",
      lastActivity: "Just now",
      status: "verified",
    },
    {
      id: "sess-3",
      userName: "Kiosk Guest Account",
      userRole: "Self-Checkin Terminal",
      userDept: "OPD Lounge Intake",
      deviceHostname: "Kiosk-Reception-01",
      deviceType: "kiosk",
      ipAddress: "192.168.100.12",
      subnet: "Public Guest VLAN",
      facilityLocation: "OPD Wing B Lobby",
      authType: "Single-Factor OTP",
      authBadgeStyle: "bg-amber-100 text-amber-900",
      loginTime: "Today 11:20 IST",
      lastActivity: "Idle (42m ago)",
      status: "expired",
    },
    {
      id: "sess-4",
      userName: "Dr. Sameer Kulkarni",
      userRole: "Senior Attending Physician",
      userDept: "Endocrinology & Nephro",
      deviceHostname: "Dell-Precision-5820",
      deviceType: "desktop",
      ipAddress: "10.14.22.18",
      subnet: "VLAN 22 (Clinical Stations)",
      facilityLocation: "Wing B · Station 08",
      authType: "Apollo TOTP App",
      authBadgeStyle: "bg-surface-container text-on-surface",
      loginTime: "Today 08:30 IST",
      lastActivity: "14 mins ago",
      status: "verified",
    },
    {
      id: "sess-5",
      userName: "Pharm. K. Ramanathan",
      userRole: "Chief Pharmacist",
      userDept: "Central Dispensing Vault",
      deviceHostname: "Vault-Dispense-Term-01",
      deviceType: "desktop",
      ipAddress: "10.14.30.04",
      subnet: "VLAN 30 (Pharmacy)",
      facilityLocation: "Central Pharmacy Basement",
      authType: "FIDO2 Security Key",
      authBadgeStyle: "bg-primary-fixed text-on-primary-fixed",
      loginTime: "Today 09:15 IST",
      lastActivity: "4 mins ago",
      status: "verified",
    },
    {
      id: "sess-6",
      userName: "Unregistered Tablet MAC",
      userRole: "Unknown Handheld",
      userDept: "Ward 4 Floor 2",
      deviceHostname: "iPad-MDM-Untrusted",
      deviceType: "tablet",
      ipAddress: "10.14.99.14",
      subnet: "VLAN 99 (Quarantine)",
      facilityLocation: "Corridor Near Cath Suite",
      authType: "Password Auth",
      authBadgeStyle: "bg-error text-on-error",
      loginTime: "Today 13:10 IST",
      lastActivity: "Attempted CPOE access",
      status: "flagged",
    },
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleTerminateSession = (id: string, name: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    showToast(`Terminated active session for ${name}. Radius credentials invalidated.`);
  };

  const handleLockSession = (id: string, name: string) => {
    showToast(`Dispatched biometric lock screen challenge to ${name}'s endpoint.`);
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
          <span className="font-clinical-data-mono text-primary font-semibold">Access &amp; Active Sessions</span>
          <span className="ml-2 px-1.5 py-0.5 rounded bg-primary text-on-primary font-metadata-micro uppercase">
            RADIUS 802.1X Synced
          </span>
        </div>

        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-space-base pb-space-sm">
          <div className="flex items-center gap-space-sm">
            <div className="h-10 w-10 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-2xl">devices</span>
            </div>
            <div>
              <h1 className="font-page-title text-page-title text-on-surface font-semibold">
                Access &amp; Active Sessions Control Center
              </h1>
              <p className="font-body-default text-clinical-data text-on-surface-variant">
                Zero-Trust endpoint telemetry, 802.1X RADIUS heartbeat, and emergency session revocation console
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => showToast("Downloaded live RADIUS 802.1X enterprise authentication log.")}
              className="px-space-md py-1.5 bg-surface-container hover:bg-surface-container-high rounded-lg text-clinical-data font-clinical-data text-on-surface transition-colors flex items-center gap-1 border border-outline-variant/20 shadow-xs"
            >
              <span className="material-symbols-outlined text-sm text-primary">download</span>
              <span>Download RADIUS Log</span>
            </button>
            <button
              onClick={() => showToast("Enforced re-authentication challenge across all Floor 3 Workstations.")}
              className="px-space-md py-1.5 bg-secondary hover:bg-secondary/90 rounded-lg text-clinical-data font-clinical-data text-on-secondary transition-colors flex items-center gap-1 shadow-xs"
            >
              <span className="material-symbols-outlined text-sm">lock_reset</span>
              <span>Global Lock (Floor 3)</span>
            </button>
            <button
              onClick={() => {
                setSessions((prev) => prev.filter((s) => s.status === "verified"));
                showToast("Revoked all suspicious and expired remote sessions.");
              }}
              className="px-space-md py-1.5 bg-error hover:bg-error/90 text-on-error rounded-lg text-clinical-data font-clinical-data font-semibold transition-colors flex items-center gap-1 shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">power_settings_new</span>
              <span>Revoke Remote Sessions</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Strip (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-sm">
        <div className="bg-surface-container-lowest p-space-sm rounded-xl border border-outline-variant/30 shadow-sm flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-metadata-micro font-metadata-micro text-outline uppercase font-semibold">
              Total Active Sessions
            </span>
            <span className="text-page-title font-page-title text-on-surface font-bold mt-1">184</span>
            <span className="text-metadata-micro text-primary font-medium flex items-center gap-1 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
              All Units Synchronized
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">devices</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-sm rounded-xl border border-outline-variant/30 shadow-sm flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-metadata-micro font-metadata-micro text-outline uppercase font-semibold">
              Clinician Workstations
            </span>
            <span className="text-page-title font-page-title text-on-surface font-bold mt-1">68</span>
            <span className="text-metadata-micro text-on-surface-variant font-medium mt-0.5">
              Fixed Cath / Diagnostic PCs
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-surface-container text-secondary flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">desktop_windows</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-sm rounded-xl border border-outline-variant/30 shadow-sm flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-metadata-micro font-metadata-micro text-outline uppercase font-semibold">
              Mobile &amp; Bedside WOW Carts
            </span>
            <span className="text-page-title font-page-title text-on-surface font-bold mt-1">94</span>
            <span className="text-metadata-micro text-on-surface-variant font-medium mt-0.5">
              Jamf Pro &amp; InTune Bound
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-surface-container text-secondary flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">tablet_mac</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-space-sm rounded-xl border border-error/30 shadow-sm flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-metadata-micro font-metadata-micro text-error uppercase font-bold">
              Suspicious / High-Risk
            </span>
            <span className="text-page-title font-page-title text-error font-bold mt-1">2</span>
            <span className="text-metadata-micro text-error font-semibold mt-0.5">
              Quarantine Action Required
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-error/15 text-error flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">gpp_maybe</span>
          </div>
        </div>
      </div>

      {/* Live Session Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="p-space-sm bg-surface-container-low border-b border-surface-container-high flex items-center justify-between">
          <span className="font-table-header text-table-header uppercase text-outline">
            Active Endpoint Session Ledger ({sessions.length} Live Connections)
          </span>
          <span className="text-metadata-micro font-clinical-data-mono text-outline">
            Heartbeat Frequency: 60s · RADIUS Token Lease: 8h
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-clinical-data font-clinical-data">
            <thead>
              <tr className="bg-surface-container-low/50 border-b border-surface-container-high font-table-header text-table-header text-outline uppercase">
                <th className="p-3">User &amp; Department</th>
                <th className="p-3">Device / Hostname</th>
                <th className="p-3">Network &amp; Location</th>
                <th className="p-3">Auth Type</th>
                <th className="p-3">Login / Last Activity</th>
                <th className="p-3">Security Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high">
              {sessions.map((sess) => (
                <tr key={sess.id} className="hover:bg-surface-container-low/30 transition-colors">
                  <td className="p-3">
                    <div className="flex flex-col">
                      <span className="font-bold text-on-surface">{sess.userName}</span>
                      <span className="text-metadata-micro text-outline">{sess.userRole}</span>
                      <span className="text-metadata-micro text-on-surface-variant">{sess.userDept}</span>
                    </div>
                  </td>

                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-base">
                        {sess.deviceType === "desktop"
                          ? "desktop_windows"
                          : sess.deviceType === "mobile_wow"
                          ? "laptop_mac"
                          : sess.deviceType === "tablet"
                          ? "tablet_mac"
                          : "point_of_sale"}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-clinical-data-mono font-semibold text-on-surface">
                          {sess.deviceHostname}
                        </span>
                        <span className="text-metadata-micro text-outline capitalize">
                          {sess.deviceType.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="p-3">
                    <div className="flex flex-col">
                      <span className="font-clinical-data-mono font-bold text-on-surface">
                        {sess.ipAddress}
                      </span>
                      <span className="text-metadata-micro text-outline">{sess.subnet}</span>
                      <span className="text-metadata-micro text-on-surface-variant font-medium">
                        {sess.facilityLocation}
                      </span>
                    </div>
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded font-clinical-data-mono text-metadata-micro font-semibold ${sess.authBadgeStyle}`}
                    >
                      {sess.authType}
                    </span>
                  </td>

                  <td className="p-3">
                    <div className="flex flex-col font-clinical-data-mono text-metadata-micro">
                      <span className="text-on-surface">{sess.loginTime}</span>
                      <span className="text-primary font-semibold">{sess.lastActivity}</span>
                    </div>
                  </td>

                  <td className="p-3">
                    {sess.status === "verified" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-clinical-data-mono text-metadata-micro font-bold">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
                        VERIFIED
                      </span>
                    ) : sess.status === "expired" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-clinical-data-mono text-metadata-micro font-bold">
                        EXPIRED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-error text-on-error font-clinical-data-mono text-metadata-micro font-bold animate-pulse">
                        FLAGGED UNTRUSTED
                      </span>
                    )}
                  </td>

                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleLockSession(sess.id, sess.userName)}
                        className="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors"
                        title="Lock Screen"
                      >
                        <span className="material-symbols-outlined text-base">lock</span>
                      </button>
                      <button
                        onClick={() => handleTerminateSession(sess.id, sess.userName)}
                        className="p-1 rounded hover:bg-error-container text-on-surface-variant hover:text-error transition-colors"
                        title="Force Terminate Session"
                      >
                        <span className="material-symbols-outlined text-base">cancel</span>
                      </button>
                    </div>
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
