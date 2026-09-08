/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, use } from "react";
import Link from "next/link";

interface SessionData {
  id: string;
  name: string;
  badge: "PRIMARY" | "SECONDARY";
  badgeStyle: string;
  token: string;
  os: string;
  ip: string;
  lastActive: string;
  icon: string;
  iconBg: string;
  statusDot: string;
}

export default function UserSecurityCredentialDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const userId = resolvedParams.id || "USR-IND-88219";

  const [sessions, setSessions] = useState<SessionData[]>([
    {
      id: "session-card-1",
      name: "Cath Lab Suite 01 Diagnostic Console",
      badge: "PRIMARY",
      badgeStyle: "bg-primary-fixed text-on-primary-fixed",
      token: "#SESS-2024-9918",
      os: "Chrome 128 / macOS Sonoma",
      ip: "10.14.22.41",
      lastActive: "Active 2 minutes ago · Telemetry & CPOE modules loaded",
      icon: "desktop_windows",
      iconBg: "bg-primary text-on-primary",
      statusDot: "bg-primary",
    },
    {
      id: "session-card-2",
      name: 'iPad Pro Mobile Scribe (Rounds)',
      badge: "SECONDARY",
      badgeStyle: "bg-surface-container text-outline",
      token: "#SESS-2024-9904",
      os: "CareFlow iOS v2.4",
      ip: "10.14.22.92",
      lastActive: "Idle 14 minutes ago · Patient overview cached · Biometric standby",
      icon: "tablet",
      iconBg: "bg-secondary-container text-on-secondary-container",
      statusDot: "bg-secondary",
    },
  ]);

  // Modals
  const [isEditPrivilegesOpen, setIsEditPrivilegesOpen] = useState(false);
  const [isResetMfaOpen, setIsResetMfaOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [isAccountSuspended, setIsAccountSuspended] = useState(false);

  // Form states
  const [selectedTier, setSelectedTier] = useState("Level 4 Direct");
  const [enableOverrideRationale, setEnableOverrideRationale] = useState(true);
  const [enableControlledSubstances, setEnableControlledSubstances] = useState(true);
  const [enableEmergencyBedBypass, setEnableEmergencyBedBypass] = useState(true);

  const terminateSingleSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
  };

  const revokeAllSessions = () => {
    setSessions([]);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col gap-space-lg w-full max-w-[1780px] mx-auto">
        {/* Header & Context Banner */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-panel-padding flex flex-col gap-space-md border border-outline-variant/30">
          <div className="flex flex-wrap items-center justify-between gap-space-md">
            <div className="flex items-center gap-space-xs text-metadata-micro font-metadata-micro text-on-surface-variant flex-wrap">
              <Link href="/quality-audit-logs" className="hover:text-primary transition-colors">
                Governance &amp; Control
              </Link>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <Link href="/users-role-permissions" className="hover:text-primary transition-colors">
                Users &amp; Role Permissions
              </Link>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-primary font-semibold">Security Credential #{userId}</span>
            </div>

            <div className="flex items-center gap-space-sm flex-wrap">
              {isAccountSuspended ? (
                <span className="flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-error text-on-error font-clinical-data-mono text-metadata-micro font-semibold shadow-sm">
                  <span className="material-symbols-outlined text-xs">block</span>
                  SUSPENDED BY GOVERNANCE
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-clinical-data-mono text-metadata-micro font-semibold">
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                  ACTIVE · FIDO2 ENFORCED
                </span>
              )}
              <span className="px-space-sm py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-clinical-data-mono text-metadata-micro font-semibold">
                NABH ACCREDITED · TIER-1
              </span>
              <span className="px-space-sm py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-clinical-data-mono text-metadata-micro">
                ABDM M3 ROLE-BOUND
              </span>
            </div>
          </div>

          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-space-lg pt-space-xs">
            <div className="flex items-start sm:items-center gap-space-md">
              <div className="relative shrink-0">
                <img
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shadow-sm ring-2 ring-primary"
                  alt="Dr. Rohit Verma"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSXWff5QiheyNEfb0Qzd4L3K-0_aKjEMvYMyPLC0G6pYnThTQGXBQnwAChyDHGgCuMYyQIMZ9eB3G5ESIyXZH3fYZZUjvfIK6hOLRFMhc2-6Ddl4QZUZkuoR58DRYHz_jPAwQNBg0YY44R0NjFP6CZuOqRYyViRxVlLf__pdOIC7PlUXWZBzH4K4TRUlZn5AYmF3QOxdwOQODCyNd7FpJdSXYBFWEkMzYweYMHo8jF4XS8lmY7-MoV"
                />
                <span
                  className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-on-primary text-[10px] shadow-sm"
                  title="Cryptographically Validated"
                >
                  <span className="material-symbols-outlined text-xs">verified</span>
                </span>
              </div>

              <div className="flex flex-col min-w-0">
                <div className="flex flex-wrap items-baseline gap-space-xs">
                  <h1 className="font-page-title text-page-title text-on-surface font-bold">
                    Dr. Rohit Verma
                  </h1>
                  <span className="font-clinical-data-mono text-subheading text-secondary font-semibold">
                    MD, DM (Cardiology), FACC
                  </span>
                </div>
                <p className="font-body-default text-body-default text-on-surface-variant mt-0.5">
                  Chief of Clinical Services &amp; Senior Interventional Cardiologist · Director of Cardiac Catheterization Laboratories
                </p>
                <div className="flex flex-wrap items-center gap-x-space-md gap-y-1 mt-1 text-metadata-micro font-clinical-data-mono text-outline">
                  <span className="flex items-center gap-1 text-on-surface font-semibold">
                    <span className="material-symbols-outlined text-xs text-primary">badge</span>
                    MCI Registration: #MCI-2009-08821
                  </span>
                  <span className="hidden sm:inline">|</span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">local_hospital</span>
                    Apollo Indraprastha Central (Primary Unit)
                  </span>
                  <span className="hidden sm:inline">|</span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">fingerprint</span>
                    UIDAI Sub-KYC: Synced Nov 2024
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-space-xs shrink-0">
              <button
                onClick={() => setIsEditPrivilegesOpen(true)}
                className="h-9 px-space-md bg-surface-container text-on-surface font-clinical-data text-clinical-data rounded-lg hover:bg-surface-container-high transition-colors flex items-center gap-1.5 shadow-sm border border-outline-variant/20"
              >
                <span className="material-symbols-outlined text-base text-secondary">admin_panel_settings</span>
                <span>Edit Privileges</span>
              </button>

              <button
                onClick={() => setIsResetMfaOpen(true)}
                className="h-9 px-space-md bg-surface-container text-on-surface font-clinical-data text-clinical-data rounded-lg hover:bg-surface-container-high transition-colors flex items-center gap-1.5 shadow-sm border border-outline-variant/20"
              >
                <span className="material-symbols-outlined text-base text-secondary">key</span>
                <span>Reset MFA Key</span>
              </button>

              <button
                onClick={revokeAllSessions}
                disabled={sessions.length === 0}
                className="h-9 px-space-md bg-error-container text-on-error-container font-clinical-data text-clinical-data font-semibold rounded-lg hover:bg-error hover:text-on-error transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-40"
              >
                <span className="material-symbols-outlined text-base">power_settings_new</span>
                <span>Revoke All Sessions ({sessions.length})</span>
              </button>

              <button
                onClick={() => setIsSuspendModalOpen(true)}
                className="h-9 px-space-sm bg-surface-container-highest text-on-surface-variant font-clinical-data text-clinical-data rounded-lg hover:bg-error-container hover:text-on-error-container transition-colors flex items-center"
                title={isAccountSuspended ? "Reactivate Account" : "Suspend Access"}
              >
                <span className="material-symbols-outlined text-base">block</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2-Column Responsive Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
          {/* Left Column: 5 Cols on LG */}
          <div className="lg:col-span-5 flex flex-col gap-space-lg">
            {/* Workforce Profile & Governance */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-panel-padding flex flex-col gap-space-md border border-outline-variant/30">
              <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-lg">clinical_notes</span>
                  <h2 className="font-section-title text-section-title text-on-surface font-bold">
                    Workforce Profile &amp; Governance
                  </h2>
                </div>
                <span className="font-metadata-micro text-metadata-micro px-2 py-0.5 rounded bg-surface-container text-outline uppercase font-semibold">
                  Tier-1 Attending
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md text-clinical-data">
                <div className="flex flex-col p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/10">
                  <span className="font-metadata-micro text-metadata-micro text-outline uppercase tracking-wide">
                    Department
                  </span>
                  <span className="font-body-strong text-on-surface mt-0.5">
                    Interventional Cardiology &amp; Acute Resuscitation
                  </span>
                  <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant mt-1">
                    Code STEMI Unit · Level 4 ICCU
                  </span>
                </div>

                <div className="flex flex-col p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/10">
                  <span className="font-metadata-micro text-metadata-micro text-outline uppercase tracking-wide">
                    Reporting Officer
                  </span>
                  <span className="font-body-strong text-on-surface mt-0.5">
                    Dr. A. Mathur, FRCS
                  </span>
                  <span className="font-clinical-data-mono text-metadata-micro text-primary mt-1 font-semibold">
                    Medical Director · Executive Council
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-space-xs pt-space-xs">
                <span className="font-table-header text-table-header uppercase text-outline font-semibold">
                  Associated Healthcare Facilities
                </span>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/10">
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-primary text-sm">domain</span>
                      <div className="flex flex-col">
                        <span className="font-body-strong text-clinical-data text-on-surface font-semibold">
                          Apollo Indraprastha Central
                        </span>
                        <span className="font-metadata-micro text-metadata-micro text-outline">
                          Main Campus · Cath Labs 01-04, CCU, Ward 6
                        </span>
                      </div>
                    </div>
                    <span className="font-clinical-data-mono text-metadata-micro font-semibold px-2 py-0.5 rounded bg-primary text-on-primary">
                      Full CPOE &amp; Surgical
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/10">
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-secondary text-sm">apartment</span>
                      <div className="flex flex-col">
                        <span className="font-body-strong text-clinical-data text-on-surface font-semibold">
                          Apollo Sector 26 Noida
                        </span>
                        <span className="font-metadata-micro text-metadata-micro text-outline">
                          Satellite Centre · Cross-Consultation Network
                        </span>
                      </div>
                    </div>
                    <span className="font-clinical-data-mono text-metadata-micro font-semibold px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant">
                      Read-Only Affiliate
                    </span>
                  </div>
                </div>
              </div>

              {/* Cryptographic DSC & e-Sign Verification */}
              <div className="flex flex-col gap-space-xs pt-space-xs">
                <span className="font-table-header text-table-header uppercase text-outline font-semibold">
                  Cryptographic DSC &amp; e-Sign Verification
                </span>
                <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-space-xs border border-outline-variant/10">
                  <div className="flex items-start justify-between gap-space-xs">
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-primary text-base">encrypted</span>
                      <span className="font-body-strong text-clinical-data text-on-surface font-semibold">
                        Class 3 Healthcare DSC (e-Mudhra PKI)
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-clinical-data-mono text-metadata-micro font-semibold">
                      VALID DEC 2026
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-metadata-micro font-clinical-data-mono text-on-surface-variant pt-1">
                    <div>
                      Token Serial: <span className="text-on-surface font-semibold">#DSC-IND-9942</span>
                    </div>
                    <div>
                      Hash: <span className="text-on-surface font-semibold">SHA256-RSA:4096</span>
                    </div>
                    <div>
                      ABDM Provider ID: <span className="text-on-surface font-semibold">IN-DL-HP-00412</span>
                    </div>
                    <div>
                      Revocation Status: <span className="text-primary font-semibold">OCSP Stamped OK</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* MFA Keys & Registered Endpoints */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-panel-padding flex flex-col gap-space-md border border-outline-variant/30">
              <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-lg">security</span>
                  <h2 className="font-section-title text-section-title text-on-surface font-bold">
                    MFA Keys &amp; Registered Endpoints
                  </h2>
                </div>
                <span className="flex h-2 w-2 rounded-full bg-primary" title="Zero Trust Health Checked"></span>
              </div>

              <div className="flex flex-col gap-space-sm">
                <span className="font-table-header text-table-header uppercase text-outline font-semibold">
                  Cryptographic Key Bindings
                </span>
                <div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/10">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-lg">vpn_key</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-body-strong text-clinical-data text-on-surface font-semibold">
                        Hardware FIDO2 Security Key (Primary)
                      </span>
                      <span className="font-clinical-data-mono text-metadata-micro text-outline">
                        YubiKey 5C NFC · Serial #YK-88190-21 · Reg. Aug 2023
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-clinical-data-mono text-metadata-micro font-semibold">
                    ENFORCED
                  </span>
                </div>

                <div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/10">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-8 h-8 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-lg">smartphone</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-body-strong text-clinical-data text-on-surface font-semibold">
                        Apollo Authenticator (Backup TOTP)
                      </span>
                      <span className="font-clinical-data-mono text-metadata-micro text-outline">
                        6-digit Time-bound Seed · Verified Nov 2024
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-clinical-data-mono text-metadata-micro font-semibold">
                    STANDBY
                  </span>
                </div>
              </div>

              {/* Authorized Endpoint Hardware */}
              <div className="flex flex-col gap-space-sm pt-space-xs">
                <span className="font-table-header text-table-header uppercase text-outline font-semibold">
                  Authorized Endpoint Hardware
                </span>
                <div className="flex flex-col gap-2">
                  <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between border border-outline-variant/10">
                    <div className="flex items-start gap-space-sm">
                      <span className="material-symbols-outlined text-primary text-lg mt-0.5">
                        desktop_windows
                      </span>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-space-xs">
                          <span className="font-body-strong text-clinical-data text-on-surface font-semibold">
                            Cath Lab Diagnostic Workstation #04
                          </span>
                          <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                        </div>
                        <span className="font-clinical-data-mono text-metadata-micro text-outline">
                          MAC: 3C:52:82:11:9A:01 · Static IP: 10.14.22.41
                        </span>
                        <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant mt-0.5">
                          Location: Floor 2, Cath Suite 01 · Trust Level: High
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-primary text-on-primary font-clinical-data-mono text-metadata-micro font-semibold">
                      ONLINE NOW
                    </span>
                  </div>

                  <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between border border-outline-variant/10">
                    <div className="flex items-start gap-space-sm">
                      <span className="material-symbols-outlined text-secondary text-lg mt-0.5">
                        tablet_mac
                      </span>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-space-xs">
                          <span className="font-body-strong text-clinical-data text-on-surface font-semibold">
                            Clinician iPad Pro M2 (Ward Rounding)
                          </span>
                        </div>
                        <span className="font-clinical-data-mono text-metadata-micro text-outline">
                          MDM Enrolled · Jamf Pro Bound · Serial #DMPX7810A
                        </span>
                        <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant mt-0.5">
                          Subnet: Apollo-WPA3-Clinical · Last ping 12m ago
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-clinical-data-mono text-metadata-micro font-semibold">
                      IDLE
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Security Audit Trail */}
              <div className="flex flex-col gap-space-xs pt-space-xs">
                <span className="font-table-header text-table-header uppercase text-outline font-semibold">
                  Recent Security Audit Trail
                </span>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between p-2 rounded bg-surface text-metadata-micro font-clinical-data-mono border border-outline-variant/10">
                    <span className="text-on-surface">
                      <strong className="text-primary">Today 14:10 IST</strong> · FIDO2 U2F Login
                    </span>
                    <span className="text-outline">Suite 01 (10.14.22.41)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-surface text-metadata-micro font-clinical-data-mono border border-outline-variant/10">
                    <span className="text-on-surface">
                      <strong className="text-secondary">Today 08:30 IST</strong> · Biometric WOW Handshake
                    </span>
                    <span className="text-outline">WOW Unit #12 (10.14.28.10)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-surface text-metadata-micro font-clinical-data-mono border border-outline-variant/10">
                    <span className="text-on-surface">
                      <strong>Yesterday 21:05 IST</strong> · CPOE Controlled Rx Sign
                    </span>
                    <span className="text-outline">DSC e-Sign OK (Token 9942)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 7 Cols on LG */}
          <div className="lg:col-span-7 flex flex-col gap-space-lg">
            {/* Assigned Clinical Privileges & Role Bindings */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-panel-padding flex flex-col gap-space-md border border-outline-variant/30">
              <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-lg">verified_user</span>
                  <h2 className="font-section-title text-section-title text-on-surface font-bold">
                    Assigned Clinical Privileges &amp; Role Bindings
                  </h2>
                </div>
                <span className="font-clinical-data-mono text-metadata-micro text-outline">
                  Policy Set: NABH-2024-CARD-08
                </span>
              </div>

              {/* 3 Clinical Role Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm">
                <div className="flex flex-col p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/10">
                  <div className="flex items-center justify-between mb-1">
                    <span className="material-symbols-outlined text-primary text-base">vital_signs</span>
                    <span className="material-symbols-outlined text-primary text-xs">check_circle</span>
                  </div>
                  <span className="font-body-strong text-clinical-data text-on-surface font-semibold">
                    Attending Interventionalist
                  </span>
                  <p className="font-metadata-micro text-metadata-micro text-on-surface-variant mt-1 leading-snug">
                    Full diagnostic angiography, PCI stent deployment, transcatheter structural valves, temporary pacing.
                  </p>
                  <div className="mt-2 pt-1 border-t border-surface-container-high flex justify-between items-center text-metadata-micro font-clinical-data-mono text-outline">
                    <span>Tier: Level 4 Direct</span>
                    <span className="text-primary font-semibold">Active</span>
                  </div>
                </div>

                <div className="flex flex-col p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/10">
                  <div className="flex items-center justify-between mb-1">
                    <span className="material-symbols-outlined text-secondary text-base">policy</span>
                    <span className="material-symbols-outlined text-primary text-xs">check_circle</span>
                  </div>
                  <span className="font-body-strong text-clinical-data text-on-surface font-semibold">
                    Governance Council
                  </span>
                  <p className="font-metadata-micro text-metadata-micro text-on-surface-variant mt-1 leading-snug">
                    Clinical protocol approvals, high-risk mortality review access, audit sign-off, formulary variance authority.
                  </p>
                  <div className="mt-2 pt-1 border-t border-surface-container-high flex justify-between items-center text-metadata-micro font-clinical-data-mono text-outline">
                    <span>Council Seat: DL-02</span>
                    <span className="text-secondary font-semibold">Voting Member</span>
                  </div>
                </div>

                <div className="flex flex-col p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/10">
                  <div className="flex items-center justify-between mb-1">
                    <span className="material-symbols-outlined text-error text-base">emergency</span>
                    <span className="material-symbols-outlined text-primary text-xs">check_circle</span>
                  </div>
                  <span className="font-body-strong text-clinical-data text-on-surface font-semibold">
                    Emergency Triage Lead
                  </span>
                  <p className="font-metadata-micro text-metadata-micro text-on-surface-variant mt-1 leading-snug">
                    Code STEMI direct Cath Lab mobilization, bed allocation bypass, emergency ICU admission commandeer.
                  </p>
                  <div className="mt-2 pt-1 border-t border-surface-container-high flex justify-between items-center text-metadata-micro font-clinical-data-mono text-outline">
                    <span>Role: Commander</span>
                    <span className="text-primary font-semibold">STAT Authority</span>
                  </div>
                </div>
              </div>

              {/* Risk Stratified Privilege Matrix */}
              <div className="flex flex-col gap-space-xs mt-space-xs">
                <div className="flex items-center justify-between">
                  <span className="font-table-header text-table-header uppercase text-outline font-semibold">
                    Risk Stratified Privilege Matrix (Audit Logged)
                  </span>
                  <span className="font-metadata-micro text-metadata-micro text-outline flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs text-primary">verified</span>
                    Cryptographically Linked to MCI Credential
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-outline-variant/10">
                    <div className="flex items-center gap-space-sm">
                      <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary-container font-clinical-data-mono text-metadata-micro font-bold shrink-0">
                        HIGH RISK
                      </span>
                      <div className="flex flex-col">
                        <span className="font-body-strong text-clinical-data text-on-surface font-semibold">
                          Sign &amp; Finalize Clinical Encounters
                        </span>
                        <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                          Generates legally immutable discharge summaries &amp; surgical registries
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-space-xs self-end sm:self-center shrink-0">
                      <span className="font-clinical-data-mono text-metadata-micro font-semibold px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed">
                        PERMITTED
                      </span>
                      <span className="material-symbols-outlined text-primary text-sm">lock_open</span>
                    </div>
                  </div>

                  <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-outline-variant/10">
                    <div className="flex items-center gap-space-sm">
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-clinical-data-mono text-metadata-micro font-bold shrink-0">
                        HIGH RISK
                      </span>
                      <div className="flex flex-col">
                        <span className="font-body-strong text-clinical-data text-on-surface font-semibold">
                          Override Deterministic Safety Alerts &amp; Clinical Protocols
                        </span>
                        <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                          Requires typed clinical rationale; instantly transmitted to QA review board
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-space-xs self-end sm:self-center shrink-0">
                      <span className="font-clinical-data-mono text-metadata-micro font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                        MANDATORY REASON
                      </span>
                      <span className="material-symbols-outlined text-outline text-sm">assignment_turned_in</span>
                    </div>
                  </div>

                  <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-outline-variant/10">
                    <div className="flex items-center gap-space-sm">
                      <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary-container font-clinical-data-mono text-metadata-micro font-bold shrink-0">
                        HIGH RISK
                      </span>
                      <div className="flex flex-col">
                        <span className="font-body-strong text-clinical-data text-on-surface font-semibold">
                          Prescribe Controlled Substances (Schedule H / X &amp; Narcotics)
                        </span>
                        <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                          Requires dual-factor biometric or DSC token confirmation during CPOE
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-space-xs self-end sm:self-center shrink-0">
                      <span className="font-clinical-data-mono text-metadata-micro font-semibold px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed">
                        DL-2024-88 BOUND
                      </span>
                      <span className="material-symbols-outlined text-primary text-sm">verified</span>
                    </div>
                  </div>

                  <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-outline-variant/10">
                    <div className="flex items-center gap-space-sm">
                      <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary-container font-clinical-data-mono text-metadata-micro font-bold shrink-0">
                        HIGH RISK
                      </span>
                      <div className="flex flex-col">
                        <span className="font-body-strong text-clinical-data text-on-surface font-semibold">
                          Emergency Bed Override &amp; Cath Lab Direct Mobilization
                        </span>
                        <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                          Pre-empts ongoing bookings for Code STEMI P1 emergency cases
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-space-xs self-end sm:self-center shrink-0">
                      <span className="font-clinical-data-mono text-metadata-micro font-semibold px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed">
                        PERMITTED
                      </span>
                      <span className="material-symbols-outlined text-primary text-sm">bolt</span>
                    </div>
                  </div>

                  <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-2 opacity-80 border border-outline-variant/10">
                    <div className="flex items-center gap-space-sm">
                      <span className="px-2 py-0.5 rounded bg-error-container text-on-error-container font-clinical-data-mono text-metadata-micro font-bold shrink-0">
                        RESTRICTED
                      </span>
                      <div className="flex flex-col">
                        <span className="font-body-strong text-clinical-data text-on-surface font-semibold">
                          Bulk Export Longitudinal Patient EHR Records
                        </span>
                        <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                          Exceeds 50 records; Requires Institutional Review Board &amp; CMO Co-sign
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-space-xs self-end sm:self-center shrink-0">
                      <span className="font-clinical-data-mono text-metadata-micro font-semibold px-2 py-0.5 rounded bg-error-container text-on-error-container">
                        DENIED
                      </span>
                      <span className="material-symbols-outlined text-error text-sm">lock</span>
                    </div>
                  </div>

                  <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-2 opacity-80 border border-outline-variant/10">
                    <div className="flex items-center gap-space-sm">
                      <span className="px-2 py-0.5 rounded bg-error-container text-on-error-container font-clinical-data-mono text-metadata-micro font-bold shrink-0">
                        RESTRICTED
                      </span>
                      <div className="flex flex-col">
                        <span className="font-body-strong text-clinical-data text-on-surface font-semibold">
                          Modify Core System Parameters &amp; Clinical Algorithm Weighting
                        </span>
                        <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                          Reserved for Global System Administrators &amp; Medical Informatics Board
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-space-xs self-end sm:self-center shrink-0">
                      <span className="font-clinical-data-mono text-metadata-micro font-semibold px-2 py-0.5 rounded bg-error-container text-on-error-container">
                        DENIED
                      </span>
                      <span className="material-symbols-outlined text-error text-sm">lock</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Session Controls & Real-Time Tokens */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-panel-padding flex flex-col gap-space-md border border-outline-variant/30">
              <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-lg">devices</span>
                  <h2 className="font-section-title text-section-title text-on-surface font-bold">
                    Active Session Controls &amp; Real-Time Tokens
                  </h2>
                </div>
                <span className="font-clinical-data-mono text-metadata-micro px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-semibold">
                  {sessions.length} SESSIONS BOUND
                </span>
              </div>

              <div className="flex flex-col gap-space-sm">
                {sessions.length === 0 ? (
                  <div className="p-space-md text-center bg-surface-container-low rounded-lg text-outline font-clinical-data">
                    Zero active hardware or tablet sessions. Staff member is currently logged out.
                  </div>
                ) : (
                  sessions.map((sess) => (
                    <div
                      key={sess.id}
                      className="p-space-sm rounded-lg bg-surface-container-low flex flex-col md:flex-row md:items-center justify-between gap-space-sm border border-outline-variant/10"
                    >
                      <div className="flex items-start gap-space-sm">
                        <div
                          className={`w-9 h-9 rounded-lg ${sess.iconBg} flex items-center justify-center shrink-0 shadow-sm`}
                        >
                          <span className="material-symbols-outlined text-lg">{sess.icon}</span>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex flex-wrap items-center gap-space-xs">
                            <span className="font-body-strong text-clinical-data text-on-surface font-semibold">
                              {sess.name}
                            </span>
                            <span
                              className={`px-2 py-0.2 rounded font-clinical-data-mono text-[10px] font-bold ${sess.badgeStyle}`}
                            >
                              {sess.badge}
                            </span>
                          </div>
                          <span className="font-clinical-data-mono text-metadata-micro text-on-surface-variant">
                            Token: <strong className="text-on-surface">{sess.token}</strong> · {sess.os} · IP: {sess.ip}
                          </span>
                          <span className="font-metadata-micro text-metadata-micro text-outline mt-0.5 flex items-center gap-1">
                            <span className={`h-1.5 w-1.5 rounded-full ${sess.statusDot} inline-block`}></span>
                            {sess.lastActive}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => terminateSingleSession(sess.id)}
                        className="h-8 px-space-md bg-surface-container text-error font-clinical-data text-metadata-micro font-semibold rounded hover:bg-error hover:text-on-error transition-colors flex items-center justify-center gap-1 shrink-0 self-end md:self-center shadow-sm"
                      >
                        <span className="material-symbols-outlined text-sm">cancel</span>
                        <span>Terminate Session</span>
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="p-space-sm rounded-lg bg-surface flex items-center justify-between text-metadata-micro font-clinical-data-mono text-outline flex-wrap gap-1">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-primary">sync</span>
                  Zero-Trust Heartbeat: Synchronized with RADIUS Auth Controller (Every 60s)
                </span>
                <span className="text-on-surface font-medium">Session Max Life: 8h 00m</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal 1: Edit Privileges */}
      {isEditPrivilegesOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full shadow-xl border border-outline-variant/30 p-space-panel-padding flex flex-col gap-space-md">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-sm">
              <div className="flex items-center gap-2">
                <span className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
                </span>
                <div>
                  <h3 className="font-section-title text-section-title text-on-surface font-bold">
                    Edit Assigned Clinical Privileges
                  </h3>
                  <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    Dr. Rohit Verma (MCI-2009-08821)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditPrivilegesOpen(false)}
                className="h-8 w-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-space-sm font-clinical-data text-clinical-data">
              <div className="flex flex-col gap-1">
                <label className="font-metadata-micro text-metadata-micro uppercase font-semibold text-outline">
                  Clinical Privilege Tier
                </label>
                <select
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value)}
                  className="h-8 px-2 rounded bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none"
                >
                  <option value="Level 4 Direct">Level 4 Direct (Lead Interventionalist)</option>
                  <option value="Level 3 Supervised">Level 3 Supervised (Associate Consultant)</option>
                  <option value="Level 2 Fellow">Level 2 Fellow (Post-Doc Fellow)</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <span className="font-metadata-micro text-metadata-micro uppercase font-semibold text-outline">
                  Deterministic Override Authorities
                </span>
                <label className="flex items-center justify-between p-2 rounded bg-surface-container-low cursor-pointer">
                  <span className="font-medium text-on-surface text-sm">
                    Allow Deterministic Safety Alert Override with Mandatory Reason
                  </span>
                  <input
                    type="checkbox"
                    checked={enableOverrideRationale}
                    onChange={(e) => setEnableOverrideRationale(e.target.checked)}
                    className="accent-primary h-4 w-4"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded bg-surface-container-low cursor-pointer">
                  <span className="font-medium text-on-surface text-sm">
                    Prescribe Controlled Substances (Schedule H/X) via DSC
                  </span>
                  <input
                    type="checkbox"
                    checked={enableControlledSubstances}
                    onChange={(e) => setEnableControlledSubstances(e.target.checked)}
                    className="accent-primary h-4 w-4"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded bg-surface-container-low cursor-pointer">
                  <span className="font-medium text-on-surface text-sm">
                    Emergency Code STEMI Cath Lab Direct Bed Mobilization
                  </span>
                  <input
                    type="checkbox"
                    checked={enableEmergencyBedBypass}
                    onChange={(e) => setEnableEmergencyBedBypass(e.target.checked)}
                    className="accent-primary h-4 w-4"
                  />
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
              <button
                onClick={() => setIsEditPrivilegesOpen(false)}
                className="px-space-md py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-clinical-data text-clinical-data"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Privilege updates committed to Hospital Governance Blockchain Ledger.");
                  setIsEditPrivilegesOpen(false);
                }}
                className="px-space-md py-1.5 rounded bg-primary hover:bg-primary-container text-on-primary font-clinical-data text-clinical-data font-semibold shadow-sm"
              >
                Save Privilege Matrix
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Reset MFA Key */}
      {isResetMfaOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full shadow-xl border border-outline-variant/30 p-space-panel-padding flex flex-col gap-space-md">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-sm">
              <div className="flex items-center gap-2">
                <span className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">key</span>
                </span>
                <div>
                  <h3 className="font-section-title text-section-title text-on-surface font-bold">
                    Reset Hardware MFA Key
                  </h3>
                  <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    Issue FIDO2 Pair Invitation
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsResetMfaOpen(false)}
                className="h-8 w-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <p className="font-body-default text-clinical-data text-on-surface leading-normal">
              This will unbind the existing hardware token (<strong>YubiKey #YK-88190-21</strong>) and generate a secure 15-minute WebAuthn enrollment link sent to Dr. Rohit Verma&apos;s verified hospital email and mobile.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
              <button
                onClick={() => setIsResetMfaOpen(false)}
                className="px-space-md py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-clinical-data text-clinical-data"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Dispatched FIDO2 WebAuthn pairing invitation.");
                  setIsResetMfaOpen(false);
                }}
                className="px-space-md py-1.5 rounded bg-primary hover:bg-primary-container text-on-primary font-clinical-data text-clinical-data font-semibold shadow-sm"
              >
                Dispatch Re-enrollment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Suspend Access */}
      {isSuspendModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full shadow-xl border border-outline-variant/30 p-space-panel-padding flex flex-col gap-space-md">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-sm">
              <div className="flex items-center gap-2">
                <span className="h-8 w-8 rounded-lg bg-error/10 text-error flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">block</span>
                </span>
                <div>
                  <h3 className="font-section-title text-section-title text-on-surface font-bold">
                    {isAccountSuspended ? "Reactivate Clinical Access" : "Suspend Clinical Access"}
                  </h3>
                  <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    Dr. Rohit Verma (EMP-1082)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSuspendModalOpen(false)}
                className="h-8 w-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <p className="font-body-default text-clinical-data text-on-surface leading-normal">
              {isAccountSuspended
                ? "Are you sure you want to restore active clinical and CPOE prescribing privileges for Dr. Rohit Verma?"
                : "Suspending clinical access will immediately lock CPOE ordering, cancel active cryptographic digital signature sessions, and alert the Chief Medical Officer."}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
              <button
                onClick={() => setIsSuspendModalOpen(false)}
                className="px-space-md py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-clinical-data text-clinical-data"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsAccountSuspended(!isAccountSuspended);
                  setIsSuspendModalOpen(false);
                }}
                className={`px-space-md py-1.5 rounded font-clinical-data text-clinical-data font-semibold shadow-sm ${
                  isAccountSuspended
                    ? "bg-primary text-on-primary hover:bg-primary-container"
                    : "bg-error text-on-error hover:bg-error/90"
                }`}
              >
                {isAccountSuspended ? "Confirm Reactivation" : "Confirm Suspension"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
