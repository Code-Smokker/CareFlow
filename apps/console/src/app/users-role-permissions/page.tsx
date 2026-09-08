/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import Link from "next/link";

interface HardwareSession {
  device: string;
  ip: string;
  icon: string;
}

interface PrivilegeItem {
  title: string;
  subtitle: string;
  icon: string;
  allowed: boolean;
}

interface StaffUser {
  id: string;
  name: string;
  credentials: string;
  empId: string;
  avatarUrl?: string;
  avatarInitials?: string;
  avatarBg?: string;
  rolePrimary: string;
  roleSecondary: string;
  roleTier: string;
  deptPrimary: string;
  deptUnit: string;
  facility: string;
  facilitySub?: string;
  status: "ACTIVE" | "SUSPENDED" | "REVERIFY";
  statusLabel: string;
  mfaMethod: string;
  mfaIcon: string;
  mfaIconColor: string;
  lastSeenTime: string;
  lastSeenIp: string;
  activeSessionsCount: number;
  isPrivileged?: boolean;
  privileges: PrivilegeItem[];
  hardwareSessions: HardwareSession[];
}

const STAFF_USERS: StaffUser[] = [
  {
    id: "rohit",
    name: "Dr. Rohit Verma, MD, DM",
    credentials: "MCI-DEL-28492",
    empId: "EMP-1082",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCaYE5XIka6Y_1zMjkAuUc2ll2UkzFCWH_ysndQPmnTomX3vsi4w8PHEKOPapOrGdKIyB6AiLFX1YB9mft4bnYRMZRj_r6YZEHUoWggV_JNYqDhYpFqfSjWofGhbPSThMr0yXw-g_lRxeBUW1BI9tT3plHiNy-cHCGz4szOKtcvrg8IAFOuXzEuotCZclG1WfS5_pxnr0olNE-tDFXqiAWXg1QtM4PmRViu2F-rKuru5BLjdiNySsxh",
    rolePrimary: "Chief Clinician",
    roleSecondary: "Lead Interventionalist",
    roleTier: "Lead Consultant",
    deptPrimary: "Cardiology",
    deptUnit: "Cath Lab & CCU",
    facility: "Central (Primary)",
    facilitySub: "+ Noida Privileges",
    status: "ACTIVE",
    statusLabel: "ACTIVE · VERIFIED",
    mfaMethod: "FIDO2 YubiKey 5C",
    mfaIcon: "key",
    mfaIconColor: "text-primary",
    lastSeenTime: "3 mins ago",
    lastSeenIp: "10.14.22.41 (Stn 04)",
    activeSessionsCount: 2,
    isPrivileged: true,
    privileges: [
      {
        title: "High-Alert Prescription (Schedule X/H)",
        subtitle: "Cath Lab CCU & Cardiology Wards",
        icon: "medication",
        allowed: true,
      },
      {
        title: "Diagnostic Lab Authorization (Sign-off)",
        subtitle: "Coronary Angiography & Echo Reports",
        icon: "upload_file",
        allowed: true,
      },
      {
        title: "Emergency Break-Glass Access",
        subtitle: "All Units · Auto Audit Trailed",
        icon: "lock_open",
        allowed: true,
      },
      {
        title: "Financial & Tariff Override",
        subtitle: "Requires Finance Dir Co-Sign",
        icon: "account_balance_wallet",
        allowed: false,
      },
    ],
    hardwareSessions: [
      { device: 'Station 04 (CCU Desk)', ip: "10.14.22.41", icon: "desktop_windows" },
      { device: 'iPad Pro 12.9" (Rounds)', ip: "10.14.22.95", icon: "tablet_mac" },
    ],
  },
  {
    id: "sameer",
    name: "Dr. Sameer Kulkarni, MD",
    credentials: "MCI-MAH-49210",
    empId: "EMP-1422",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAEJyUHlMUPIXoJ2NkekTCxHsLAC2uXxK5rllX79JiWqLdPsUS7aOzniOHFCvuDOHg_00de9U2QRs1M8OHqMcivtf7Co781yMmaCK8-reCLlN-DvxqIYcYtswBieAMf-uAd2UcSIGUG8gR-wfF5QqQv1bsZLzpUfvYxsyBKi-61-vRclVGEijQxmUHxi8XYXfErgJfmjSQTy2Fv3PfEUoay5yLPZw6IxSKLHOEICUnUy3C6RyP2b2-R",
    rolePrimary: "Senior Attending",
    roleSecondary: "Attending Consultant",
    roleTier: "Attending Specialist",
    deptPrimary: "Endocrinology",
    deptUnit: "Nephro / HDU OPD",
    facility: "Apollo Central",
    status: "ACTIVE",
    statusLabel: "ACTIVE · VERIFIED",
    mfaMethod: "TOTP Authenticator",
    mfaIcon: "phone_android",
    mfaIconColor: "text-secondary",
    lastSeenTime: "18 mins ago",
    lastSeenIp: "10.14.22.18 (Wing B)",
    activeSessionsCount: 1,
    isPrivileged: true,
    privileges: [
      {
        title: "Insulin & Endocrine Protocol Initiation",
        subtitle: "ICU & Inpatient Ward Protocols",
        icon: "medication",
        allowed: true,
      },
      {
        title: "STAT Point-of-Care Glucose Sign-Off",
        subtitle: "Bedside Diagnostics Validated",
        icon: "fact_check",
        allowed: true,
      },
      {
        title: "Emergency Break-Glass Access",
        subtitle: "Internal Medicine & HDU",
        icon: "lock_open",
        allowed: true,
      },
      {
        title: "Surgical Cath Lab Authorization",
        subtitle: "Restricted to Interventionalists",
        icon: "block",
        allowed: false,
      },
    ],
    hardwareSessions: [
      { device: "Dell Precision 5820 (OPD Rm 12)", ip: "10.14.22.18", icon: "desktop_windows" },
    ],
  },
  {
    id: "anjali",
    name: "Dr. Anjali Nair, MD",
    credentials: "MCI-KER-19348",
    empId: "EMP-2104",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCHehCN-Jn0MvazpXNZU7WMd-OZaoaWk8XwxkAuV3VAAlXLA9e-UXvNRMx4RmJ6Hgjvhr_qrjEmmCMUKIH8ZVMVrVFONgHWTY-w6CBAITR1L07L2kmwNO4JS2CXT8yIXNbhKQkqEm8O863X00cnnFjKXqIx8mB5BbRbkdRgPdXmlWQsUxQYt7DR-qMGpXLBX40gQKpuJGmsW34hTDPfruD47iLeuIc_IJm58K2JSFOS7txn24TwQfIs",
    rolePrimary: "Duty Pathologist",
    roleSecondary: "Clinical Diagnostics",
    roleTier: "Consultant Pathologist",
    deptPrimary: "Central Diag Labs",
    deptUnit: "Immuno & Hematology",
    facility: "Apollo Central",
    status: "ACTIVE",
    statusLabel: "ACTIVE · VERIFIED",
    mfaMethod: "TOTP Authenticator",
    mfaIcon: "phone_android",
    mfaIconColor: "text-secondary",
    lastSeenTime: "12 mins ago",
    lastSeenIp: "10.14.30.08 (Lab Core)",
    activeSessionsCount: 1,
    isPrivileged: true,
    privileges: [
      {
        title: "Critical Lab Value Release (STAT hs-cTnI)",
        subtitle: "Direct EHR Laboratory Release",
        icon: "science",
        allowed: true,
      },
      {
        title: "Blood Bank Cross-Match Release",
        subtitle: "Emergency Transfusion Packs",
        icon: "bloodtype",
        allowed: true,
      },
      {
        title: "Emergency Break-Glass Access",
        subtitle: "Diagnostic History Records",
        icon: "lock_open",
        allowed: true,
      },
      {
        title: "Direct Inpatient CPOE Prescribing",
        subtitle: "Requires Clinical Attending",
        icon: "block",
        allowed: false,
      },
    ],
    hardwareSessions: [
      { device: "Sysmex LIS Gateway Workstation", ip: "10.14.30.08", icon: "desktop_windows" },
    ],
  },
  {
    id: "ancy",
    name: "Sr. Ancy Thomas, RN",
    credentials: "INC-DEL-77821",
    empId: "EMP-3044",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAZmb0wO1tpKIgKt5IWzz2BbTGCt9osPnPLUYVle9GGjF32GUz7i_ronJ8CZ5N6YW9r46gJljB-PWVi44hm5SX7y4PagXLWl-RpoXeKWLkPKhMLQlgCltZ3Esi1fxIJ0WXN2rx5lkYo7-cOOcIL-0DjwQ3-t2RLIXZayqHMDoBgdvFNnK0lWzsxWQq40OrzJIMoAf-7ObSPxLOUX7FIznbpLT2x2kPneOXRoSjbyXC4ukMDohD_LucJ",
    rolePrimary: "Charge Nurse",
    roleSecondary: "Critical Care RN",
    roleTier: "Nurse Supervisor",
    deptPrimary: "Coronary Care Unit",
    deptUnit: "CCU Beds 01-16",
    facility: "Apollo Central",
    status: "ACTIVE",
    statusLabel: "ACTIVE · VERIFIED",
    mfaMethod: "Biometric TouchID",
    mfaIcon: "fingerprint",
    mfaIconColor: "text-primary",
    lastSeenTime: "5 mins ago",
    lastSeenIp: "10.14.22.88 (WOW Cart)",
    activeSessionsCount: 1,
    isPrivileged: true,
    privileges: [
      {
        title: "STAT Medication Administration & BCMA",
        subtitle: "Barcoded Med Administration",
        icon: "medication",
        allowed: true,
      },
      {
        title: "Critical Telemetry Alarm Acknowledge",
        subtitle: "Central Station Channel 01-16",
        icon: "notifications",
        allowed: true,
      },
      {
        title: "High-Alert Drug Dual Verification Witness",
        subtitle: "Narcotics & Vasopressors",
        icon: "shield",
        allowed: true,
      },
      {
        title: "Permanent Legal Discharge Sign-Off",
        subtitle: "Requires Attending MD",
        icon: "block",
        allowed: false,
      },
    ],
    hardwareSessions: [
      { device: "Workstation on Wheels (WOW Cart 03)", ip: "10.14.22.88", icon: "laptop_mac" },
    ],
  },
  {
    id: "ramanathan",
    name: "Pharm. K. Ramanathan",
    credentials: "PCI-DL-55291",
    empId: "EMP-4190",
    avatarInitials: "KR",
    avatarBg: "bg-secondary-container text-on-secondary-container",
    rolePrimary: "Chief Pharmacist",
    roleSecondary: "Narcotics Dispenser",
    roleTier: "Pharmacy Officer",
    deptPrimary: "Central Pharmacy",
    deptUnit: "Dispense Vault 02",
    facility: "Apollo Central",
    status: "ACTIVE",
    statusLabel: "ACTIVE · VERIFIED",
    mfaMethod: "FIDO2 Token",
    mfaIcon: "key",
    mfaIconColor: "text-primary",
    lastSeenTime: "8 mins ago",
    lastSeenIp: "10.14.40.12 (Dispense)",
    activeSessionsCount: 1,
    isPrivileged: true,
    privileges: [
      {
        title: "Vault Narcotic Dispensing (Schedule X)",
        subtitle: "Automated Pyxis Dispensing Access",
        icon: "inventory_2",
        allowed: true,
      },
      {
        title: "Drug-Drug Hard Stop Clinical Override",
        subtitle: "Pharmacist Intervention Gatekeeper",
        icon: "security",
        allowed: true,
      },
      {
        title: "Pneumatic Pod Pneumatic Dispatch Launch",
        subtitle: "High-Speed Tube Station 01-08",
        icon: "send",
        allowed: true,
      },
      {
        title: "Clinical Diagnosis Modification",
        subtitle: "Restricted to Physicians",
        icon: "block",
        allowed: false,
      },
    ],
    hardwareSessions: [
      { device: "Pharmacy Terminal Vault 02", ip: "10.14.40.12", icon: "desktop_windows" },
    ],
  },
  {
    id: "preeti",
    name: "Preeti Sharma, BSN",
    credentials: "INC-DEL-90112",
    empId: "EMP-3321",
    avatarInitials: "PS",
    avatarBg: "bg-secondary-container text-on-secondary-container",
    rolePrimary: "Triage Nurse",
    roleSecondary: "Red-Flag Assessor",
    roleTier: "Staff Nurse Tier 2",
    deptPrimary: "Emergency Medicine",
    deptUnit: "Kiosk 01-03",
    facility: "Apollo Central",
    status: "ACTIVE",
    statusLabel: "ACTIVE · VERIFIED",
    mfaMethod: "TOTP Authenticator",
    mfaIcon: "phone_android",
    mfaIconColor: "text-secondary",
    lastSeenTime: "22 mins ago",
    lastSeenIp: "10.14.10.02 (Triage)",
    activeSessionsCount: 1,
    privileges: [
      {
        title: "Emergency Severity Index (ESI) Assignment",
        subtitle: "Triage Acuity Level 1-5",
        icon: "emergency",
        allowed: true,
      },
      {
        title: "Point-of-Care ECG Order Trigger",
        subtitle: "Fast-Track Door-to-ECG <10m",
        icon: "vital_signs",
        allowed: true,
      },
      {
        title: "Resuscitation Bay Direct Escalation",
        subtitle: "Level 1 STEMI & Stroke Alerts",
        icon: "campaign",
        allowed: true,
      },
      {
        title: "Controlled Substances Vault Access",
        subtitle: "Requires Pharmacy Lead",
        icon: "block",
        allowed: false,
      },
    ],
    hardwareSessions: [
      { device: "Triage Kiosk #01 iPad AirWatch", ip: "10.14.10.02", icon: "tablet_mac" },
    ],
  },
  {
    id: "rajesh",
    name: "Rajesh V. Mehta",
    credentials: "ADM-DEL-1102",
    empId: "EMP-5091",
    avatarInitials: "RM",
    avatarBg: "bg-surface-container-high text-on-surface-variant",
    rolePrimary: "Billing Lead",
    roleSecondary: "Revenue Cycle Ops",
    roleTier: "Finance Officer",
    deptPrimary: "Revenue Cycle",
    deptUnit: "Billing Terminal Desk",
    facility: "Apollo Central",
    status: "ACTIVE",
    statusLabel: "ACTIVE · VERIFIED",
    mfaMethod: "TOTP Authenticator",
    mfaIcon: "phone_android",
    mfaIconColor: "text-secondary",
    lastSeenTime: "1 hr ago",
    lastSeenIp: "10.14.50.05 (Fin)",
    activeSessionsCount: 1,
    privileges: [
      {
        title: "TPA & Insurance Pre-Auth Adjudication",
        subtitle: "Cashless Approvals < ₹5,00,000",
        icon: "payments",
        allowed: true,
      },
      {
        title: "Final Hospital Discharge Invoice Clearance",
        subtitle: "Release Financial Gatekeeper",
        icon: "receipt_long",
        allowed: true,
      },
      {
        title: "Corporate Discount Authorizations",
        subtitle: "Up to 15% Standard Tariff",
        icon: "price_check",
        allowed: true,
      },
      {
        title: "Clinical Electronic Health Records Access",
        subtitle: "Restricted to Protected Fin Ledger",
        icon: "block",
        allowed: false,
      },
    ],
    hardwareSessions: [
      { device: "Billing Terminal Desk 04", ip: "10.14.50.05", icon: "desktop_windows" },
    ],
  },
  {
    id: "menon",
    name: "Dr. V. Menon (Locum CTVS)",
    credentials: "MCI-TN-09121",
    empId: "EMP-9982 (EXPIRED)",
    avatarInitials: "VM",
    avatarBg: "bg-error text-on-error",
    rolePrimary: "Guest Surgeon",
    roleSecondary: "Privileges Lapsed",
    roleTier: "Visiting Consultant",
    deptPrimary: "Cardiothoracic (CTVS)",
    deptUnit: "OT Complex 04",
    facility: "Apollo Central",
    status: "SUSPENDED",
    statusLabel: "SUSPENDED / EXPIRED",
    mfaMethod: "None (Locked)",
    mfaIcon: "block",
    mfaIconColor: "text-error",
    lastSeenTime: "4 days ago",
    lastSeenIp: "192.168.1.100 (Ext)",
    activeSessionsCount: 0,
    privileges: [
      {
        title: "Operating Theater Complex Access",
        subtitle: "Lapsed: Credential Expiration",
        icon: "meeting_room",
        allowed: false,
      },
      {
        title: "CPOE Prescriptions & Clinical Charting",
        subtitle: "Suspended Pending Council Renewal",
        icon: "edit_off",
        allowed: false,
      },
      {
        title: "EHR Patient Record Search",
        subtitle: "Locked Out",
        icon: "lock",
        allowed: false,
      },
    ],
    hardwareSessions: [],
  },
];

export default function UsersRolePermissionsPage() {
  const [selectedUserId, setSelectedUserId] = useState<string>("rohit");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [deptFilter, setDeptFilter] = useState<string>("");
  const [facilityFilter, setFacilityFilter] = useState<string>("central");
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Modals
  const [isProvisionOpen, setIsProvisionOpen] = useState(false);
  const [isMfaPolicyOpen, setIsMfaPolicyOpen] = useState(false);
  const [isBulkRevokeOpen, setIsBulkRevokeOpen] = useState(false);
  const [isPermissionsDossierOpen, setIsPermissionsDossierOpen] = useState(false);
  const [isElevationLogOpen, setIsElevationLogOpen] = useState(false);

  // New user form state
  const [newUserName, setNewUserName] = useState("");
  const [newUserRole, setNewUserRole] = useState("Doctor / Lead Consultant");
  const [newUserDept, setNewUserDept] = useState("Cardiology & Cath Lab");
  const [newUserMci, setNewUserMci] = useState("");

  const selectedUser =
    STAFF_USERS.find((u) => u.id === selectedUserId) || STAFF_USERS[0];

  const filteredUsers = STAFF_USERS.filter((user) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.credentials.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.deptPrimary.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      !roleFilter ||
      (roleFilter === "doctor" && user.rolePrimary.toLowerCase().includes("clinician")) ||
      (roleFilter === "doctor" && user.rolePrimary.toLowerCase().includes("attending")) ||
      (roleFilter === "nurse" && user.rolePrimary.toLowerCase().includes("nurse")) ||
      (roleFilter === "pharmacist" && user.rolePrimary.toLowerCase().includes("pharmacist")) ||
      (roleFilter === "lab" && user.rolePrimary.toLowerCase().includes("pathologist")) ||
      (roleFilter === "billing" && user.rolePrimary.toLowerCase().includes("billing"));

    const matchesDept =
      !deptFilter ||
      (deptFilter === "cardio" && user.deptPrimary.toLowerCase().includes("cardio")) ||
      (deptFilter === "em" && user.deptPrimary.toLowerCase().includes("emergency")) ||
      (deptFilter === "ccu" && user.deptPrimary.toLowerCase().includes("coronary")) ||
      (deptFilter === "nephro" && user.deptUnit.toLowerCase().includes("nephro")) ||
      (deptFilter === "pharm" && user.deptPrimary.toLowerCase().includes("pharmacy")) ||
      (deptFilter === "lab" && user.deptPrimary.toLowerCase().includes("diag"));

    const matchesStatus =
      !statusFilter ||
      (statusFilter === "active" && user.status === "ACTIVE") ||
      (statusFilter === "suspended" && user.status === "SUSPENDED");

    return matchesSearch && matchesRole && matchesDept && matchesStatus;
  });

  return (
    <div className="flex flex-col w-full gap-space-lg pb-space-2xl">
      {/* Header & Context Banner */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-space-md bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30">
        <div className="flex flex-col gap-space-2xs">
          <div className="flex items-center gap-space-xs flex-wrap">
            <span className="font-metadata-micro text-metadata-micro text-primary uppercase font-bold tracking-wider bg-surface-container px-2 py-0.5 rounded">
              IAM &amp; Privileged Governance
            </span>
            <span className="text-outline-variant">•</span>
            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant font-medium">
              ABDM Tier-3 Federated Registry
            </span>
          </div>
          <h1 className="font-page-title text-page-title text-on-surface font-semibold tracking-tight">
            Users &amp; Role Permissions
          </h1>
          <p className="font-body-default text-body-default text-on-surface-variant">
            Healthcare workforce identity, credentialing, department mapping, and cryptographic access lifecycle across hospital units.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-space-xs">
          <button
            onClick={() => setIsMfaPolicyOpen(true)}
            className="flex items-center gap-space-xs px-space-md py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded font-clinical-data text-clinical-data font-semibold transition-colors"
          >
            <span className="material-symbols-outlined text-base">security_update_good</span>
            <span>MFA Policy</span>
          </button>
          <button
            onClick={() => alert("Access roster successfully exported as cryptographically verified CSV.")}
            className="flex items-center gap-space-xs px-space-md py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded font-clinical-data text-clinical-data font-semibold transition-colors"
          >
            <span className="material-symbols-outlined text-base">download</span>
            <span>Export Access Roster</span>
          </button>
          <button
            onClick={() => setIsBulkRevokeOpen(true)}
            className="flex items-center gap-space-xs px-space-md py-2 bg-error-container hover:bg-error/20 text-on-error-container rounded font-clinical-data text-clinical-data font-semibold transition-colors"
          >
            <span className="material-symbols-outlined text-base">power_settings_new</span>
            <span>Bulk Revoke Sessions</span>
          </button>
          <button
            onClick={() => setIsProvisionOpen(true)}
            className="flex items-center gap-space-xs px-space-md py-2 bg-primary hover:bg-primary-container text-on-primary rounded font-clinical-data text-clinical-data font-semibold shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            <span>+ Provision New User</span>
          </button>
        </div>
      </div>

      {/* KPI Matrix (8 Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-space-sm">
        <div className="flex flex-col bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-outline-variant/20">
          <span className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase font-semibold">
            Total Provisioned
          </span>
          <span className="font-chief-complaint text-page-title text-on-surface font-bold mt-1">
            482
          </span>
          <span className="font-metadata-micro text-metadata-micro text-outline mt-0.5">
            Across 6 Apollo Units
          </span>
        </div>

        <div className="flex flex-col bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-outline-variant/20">
          <span className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase font-semibold">
            Active Clinicians
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-chief-complaint text-page-title text-primary font-bold">128</span>
            <span className="font-clinical-data text-metadata-micro text-on-surface-variant font-medium">
              MD / DM
            </span>
          </div>
          <span className="font-metadata-micro text-metadata-micro text-outline mt-0.5">
            All Privileges Active
          </span>
        </div>

        <div className="flex flex-col bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-outline-variant/20">
          <span className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase font-semibold">
            Nursing Staff
          </span>
          <span className="font-chief-complaint text-page-title text-on-surface font-bold mt-1">
            214
          </span>
          <span className="font-metadata-micro text-metadata-micro text-outline mt-0.5">
            Charge &amp; Triage RNs
          </span>
        </div>

        <div className="flex flex-col bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-outline-variant/20">
          <span className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase font-semibold">
            Pharm &amp; Labs
          </span>
          <span className="font-chief-complaint text-page-title text-on-surface font-bold mt-1">
            76
          </span>
          <span className="font-metadata-micro text-metadata-micro text-outline mt-0.5">
            Tech &amp; Dispense Cert
          </span>
        </div>

        <div className="flex flex-col bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-outline-variant/20">
          <span className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase font-semibold">
            Admin &amp; Reg
          </span>
          <span className="font-chief-complaint text-page-title text-on-surface font-bold mt-1">
            48
          </span>
          <span className="font-metadata-micro text-metadata-micro text-outline mt-0.5">
            Billing &amp; Ward Ops
          </span>
        </div>

        <div className="flex flex-col bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-outline-variant/20">
          <span className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase font-semibold">
            MFA Compliance
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="font-chief-complaint text-page-title text-primary font-bold">99.6%</span>
            <span className="material-symbols-outlined text-primary text-sm">verified</span>
          </div>
          <span className="font-metadata-micro text-metadata-micro text-outline mt-0.5">
            Hardware / TOTP
          </span>
        </div>

        <div className="flex flex-col bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-outline-variant/20">
          <span className="font-metadata-micro text-metadata-micro text-on-surface-variant uppercase font-semibold">
            Active Sessions
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="font-chief-complaint text-page-title text-on-surface font-bold">164</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
          </div>
          <span className="font-metadata-micro text-metadata-micro text-outline mt-0.5">
            Zero Ephemeral Drift
          </span>
        </div>

        <div className="flex flex-col bg-surface-container-lowest p-space-md rounded-lg shadow-sm border border-outline-variant/20">
          <span className="font-metadata-micro text-metadata-micro text-error uppercase font-semibold">
            Flagged / Lock
          </span>
          <div className="flex items-center gap-1 mt-1">
            <span className="font-chief-complaint text-page-title text-error font-bold">2</span>
            <span className="material-symbols-outlined text-error text-base">gpp_maybe</span>
          </div>
          <span className="font-metadata-micro text-metadata-micro text-error mt-0.5">
            Action Mandatory
          </span>
        </div>
      </div>

      {/* Filter & Query Control Panel */}
      <div className="flex flex-col bg-surface-container-lowest p-space-md rounded-xl shadow-sm gap-space-sm border border-outline-variant/30">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-space-sm items-center">
          <div className="xl:col-span-2 relative">
            <span className="material-symbols-outlined absolute left-space-sm top-2 text-outline text-base">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search staff name, MCI registration, employee ID, email..."
              className="w-full h-9 pl-8 pr-3 text-clinical-data font-clinical-data bg-surface-container-low text-on-surface rounded focus:outline-none focus:bg-surface-container-lowest focus:shadow-sm border border-outline-variant/20 focus:border-primary"
            />
          </div>

          <div className="flex flex-col">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              aria-label="Role Archetype"
              className="h-9 px-space-sm bg-surface-container-low text-on-surface text-clinical-data font-clinical-data rounded focus:outline-none focus:shadow-sm border border-outline-variant/20"
            >
              <option value="">Role: All Active Roles</option>
              <option value="doctor">Doctor / Lead Consultant</option>
              <option value="nurse">Registered Nurse / Triage</option>
              <option value="pharmacist">Dispensing Pharmacist</option>
              <option value="lab">Lab Specimen Technologist</option>
              <option value="billing">Hospital Billing Admin</option>
            </select>
          </div>

          <div className="flex flex-col">
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              aria-label="Department"
              className="h-9 px-space-sm bg-surface-container-low text-on-surface text-clinical-data font-clinical-data rounded focus:outline-none focus:shadow-sm border border-outline-variant/20"
            >
              <option value="">Department: All Depts</option>
              <option value="cardio">Cardiology &amp; Cath Lab</option>
              <option value="em">Emergency Medicine &amp; Triage</option>
              <option value="ccu">Coronary Care Unit (CCU)</option>
              <option value="nephro">Nephrology &amp; Dialysis</option>
              <option value="pharm">Central Pharmacy</option>
              <option value="lab">Diagnostic Labs (Core)</option>
            </select>
          </div>

          <div className="flex flex-col">
            <select
              value={facilityFilter}
              onChange={(e) => setFacilityFilter(e.target.value)}
              aria-label="Facility Scope"
              className="h-9 px-space-sm bg-surface-container-low text-on-surface text-clinical-data font-clinical-data rounded focus:outline-none focus:shadow-sm border border-outline-variant/20"
            >
              <option value="central">Apollo Indraprastha · Central</option>
              <option value="noida">Apollo Hospital · Noida Unit</option>
              <option value="all">All Federated Facilities</option>
            </select>
          </div>

          <div className="flex flex-col">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Account Status"
              className="h-9 px-space-sm bg-surface-container-low text-on-surface text-clinical-data font-clinical-data rounded focus:outline-none focus:shadow-sm border border-outline-variant/20"
            >
              <option value="">Status: All Statuses</option>
              <option value="active">Active &amp; Verified</option>
              <option value="suspended">Suspended / Locked</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-space-xs flex-wrap gap-2">
          <div className="flex items-center gap-space-xs flex-wrap">
            <span className="font-metadata-micro text-metadata-micro text-outline uppercase font-semibold">
              Active Filters:
            </span>
            <span className="inline-flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded text-on-surface-variant font-clinical-data text-metadata-micro">
              Facility: Apollo Central
            </span>
            <span className="inline-flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded text-on-surface-variant font-clinical-data text-metadata-micro">
              Status: All
            </span>
            <button
              onClick={() => {
                setSearchQuery("");
                setRoleFilter("");
                setDeptFilter("");
                setStatusFilter("");
              }}
              className="font-metadata-micro text-metadata-micro text-primary font-semibold ml-space-xs hover:underline"
            >
              Clear All
            </button>
          </div>
          <div className="flex items-center gap-space-sm">
            <span className="font-clinical-data text-metadata-micro text-on-surface-variant">
              Showing <span className="font-semibold text-on-surface">{filteredUsers.length}</span> of 482 matching records
            </span>
          </div>
        </div>
      </div>

      {/* Workforce Directory & Context Split Canvas */}
      <div className="grid grid-cols-1 2xl:grid-cols-12 gap-space-lg items-start">
        {/* Table Main Canvas (Span 9 on 2XL) */}
        <div className="2xl:col-span-9 flex flex-col bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/30">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-table-header text-table-header uppercase border-b border-outline-variant/20">
                  <th className="py-3 px-4 whitespace-nowrap">Staff Member &amp; Credentials</th>
                  <th className="py-3 px-3 whitespace-nowrap">Role Archetype</th>
                  <th className="py-3 px-3 whitespace-nowrap">Primary Dept &amp; Unit</th>
                  <th className="py-3 px-3 whitespace-nowrap">Facility Scope</th>
                  <th className="py-3 px-3 whitespace-nowrap">Status</th>
                  <th className="py-3 px-3 whitespace-nowrap">MFA Method</th>
                  <th className="py-3 px-3 whitespace-nowrap">Last Telemetry &amp; IP</th>
                  <th className="py-3 px-3 whitespace-nowrap">Sessions</th>
                  <th className="py-3 px-4 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low text-clinical-data font-clinical-data text-on-surface">
                {filteredUsers.map((user) => {
                  const isSelected = user.id === selectedUserId;
                  return (
                    <tr
                      key={user.id}
                      onClick={() => setSelectedUserId(user.id)}
                      className={`transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-primary/5 ring-1 ring-inset ring-primary/30"
                          : user.status === "SUSPENDED"
                          ? "bg-error-container/20 hover:bg-error-container/30"
                          : "hover:bg-surface-container-low/50"
                      }`}
                    >
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-space-xs">
                          <div className="relative shrink-0">
                            {user.avatarUrl ? (
                              <img
                                alt={user.name}
                                src={user.avatarUrl}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div
                                className={`w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs ${user.avatarBg}`}
                              >
                                {user.avatarInitials}
                              </div>
                            )}
                            <span
                              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-surface-container-lowest ${
                                user.status === "ACTIVE" ? "bg-primary" : "bg-error"
                              }`}
                            ></span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-body-strong text-clinical-data text-on-surface font-semibold">
                              {user.name}
                            </span>
                            <span className="font-metadata-micro text-metadata-micro text-outline font-clinical-data-mono">
                              {user.credentials} · {user.empId}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span
                            className={`font-clinical-data text-clinical-data font-semibold ${
                              user.rolePrimary.includes("Chief")
                                ? "text-primary"
                                : "text-secondary"
                            }`}
                          >
                            {user.rolePrimary}
                          </span>
                          <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                            {user.roleSecondary}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-clinical-data text-clinical-data text-on-surface">
                            {user.deptPrimary}
                          </span>
                          <span className="font-metadata-micro text-metadata-micro text-outline">
                            {user.deptUnit}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-clinical-data text-clinical-data text-on-surface">
                            {user.facility}
                          </span>
                          {user.facilitySub && (
                            <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                              {user.facilitySub}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        {user.status === "ACTIVE" ? (
                          <span className="inline-flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded text-primary font-semibold text-metadata-micro">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> ACTIVE · VERIFIED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-error text-on-error px-2 py-0.5 rounded font-semibold text-metadata-micro shadow-sm">
                            <span className="material-symbols-outlined text-xs">warning</span> SUSPENDED
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <span className={`material-symbols-outlined ${user.mfaIconColor} text-sm`}>
                            {user.mfaIcon}
                          </span>
                          <span className="font-clinical-data text-metadata-micro font-medium">
                            {user.mfaMethod}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-3 font-clinical-data-mono text-metadata-micro whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-on-surface">{user.lastSeenTime}</span>
                          <span className="text-outline">{user.lastSeenIp}</span>
                        </div>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center justify-center px-2 py-0.5 rounded font-clinical-data-mono text-metadata-micro font-semibold ${
                            user.activeSessionsCount > 0
                              ? "bg-surface-container text-on-surface"
                              : "bg-surface-container text-outline"
                          }`}
                        >
                          {user.activeSessionsCount} Active
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        {user.status === "SUSPENDED" ? (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                alert(`Initiated credential re-verification for ${user.name}`);
                              }}
                              className="px-2 py-1 bg-primary text-on-primary rounded font-clinical-data text-metadata-micro font-semibold hover:bg-primary-container transition-colors"
                            >
                              Re-verify
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedUserId(user.id);
                                setIsPermissionsDossierOpen(true);
                              }}
                              className="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
                              title="Audit Dossier"
                            >
                              <span className="material-symbols-outlined text-base">history</span>
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              href={`/users-role-permissions/${user.id === "rohit" ? "USR-IND-88219" : user.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="p-1 rounded hover:bg-primary/10 text-on-surface-variant hover:text-primary transition-colors"
                              title="View Full Credential Dossier"
                            >
                              <span className="material-symbols-outlined text-base">badge</span>
                            </Link>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedUserId(user.id);
                                setIsPermissionsDossierOpen(true);
                              }}
                              className="p-1 rounded hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors"
                              title="Edit Access Matrix"
                            >
                              <span className="material-symbols-outlined text-base">edit</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                alert(`Revoked active sessions for ${user.name}`);
                              }}
                              className="p-1 rounded hover:bg-error-container text-on-surface-variant hover:text-error transition-colors"
                              title="Revoke Active Session"
                            >
                              <span className="material-symbols-outlined text-base">lock_reset</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedUserId(user.id);
                                setIsElevationLogOpen(true);
                              }}
                              className="p-1 rounded hover:bg-surface-container text-on-surface-variant"
                              title="Privilege History"
                            >
                              <span className="material-symbols-outlined text-base">more_vert</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination & Table Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-space-md bg-surface-container-low/30 gap-space-sm border-t border-outline-variant/20">
            <div className="flex items-center gap-space-xs text-metadata-micro font-clinical-data-mono text-outline flex-wrap">
              <span>SHA-256 Roster Digest: 8f72...a19c</span>
              <span>•</span>
              <span>Sync Status: Automated LDAP / Keycloak Verified</span>
            </div>
            <div className="flex items-center gap-space-xs">
              <button
                className="px-space-sm py-1 bg-surface-container text-on-surface-variant rounded text-clinical-data font-clinical-data hover:bg-surface-container-high transition-colors"
                disabled
              >
                Previous
              </button>
              <span className="px-2 py-1 bg-primary text-on-primary rounded text-clinical-data font-clinical-data-mono font-semibold">
                1
              </span>
              <button className="px-2 py-1 hover:bg-surface-container text-on-surface rounded text-clinical-data font-clinical-data-mono">
                2
              </button>
              <button className="px-2 py-1 hover:bg-surface-container text-on-surface rounded text-clinical-data font-clinical-data-mono">
                3
              </button>
              <span className="text-outline">...</span>
              <button className="px-2 py-1 hover:bg-surface-container text-on-surface rounded text-clinical-data font-clinical-data-mono">
                24
              </button>
              <button className="px-space-sm py-1 bg-surface-container text-on-surface rounded text-clinical-data font-clinical-data hover:bg-surface-container-high transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Right Side-Over Preview Drawer: Selected Identity Dossier (Span 3 on 2XL) */}
        <div className="2xl:col-span-3 flex flex-col bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden sticky top-20 border border-outline-variant/30">
          {/* Drawer Header */}
          <div className="p-space-lg bg-surface-container-low flex flex-col gap-space-xs border-b border-outline-variant/20">
            <div className="flex items-center justify-between">
              <span className="font-metadata-micro text-metadata-micro text-primary font-bold uppercase tracking-wider">
                Identity Focus
              </span>
              <span className="inline-flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded text-primary font-semibold text-metadata-micro">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span> PRIVILEGED ACCESS
              </span>
            </div>

            <div className="flex items-center gap-space-sm mt-1">
              {selectedUser.avatarUrl ? (
                <img
                  alt={selectedUser.name}
                  src={selectedUser.avatarUrl}
                  className="w-12 h-12 rounded-full object-cover shrink-0"
                />
              ) : (
                <div
                  className={`w-12 h-12 rounded-full font-bold flex items-center justify-center text-sm shrink-0 ${selectedUser.avatarBg}`}
                >
                  {selectedUser.avatarInitials}
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <h2 className="font-subheading text-subheading text-on-surface font-semibold truncate">
                  {selectedUser.name}
                </h2>
                <span className="font-metadata-micro text-metadata-micro text-on-surface-variant truncate">
                  {selectedUser.rolePrimary} · {selectedUser.facility}
                </span>
                <span className="font-clinical-data-mono text-metadata-micro text-outline">
                  {selectedUser.empId} · {selectedUser.credentials}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="p-space-md flex flex-col gap-space-xs bg-surface-container-low/40 border-b border-outline-variant/20">
            <Link
              href={`/users-role-permissions/${selectedUser.id === "rohit" ? "USR-IND-88219" : selectedUser.id}`}
              className="w-full flex items-center justify-between p-space-sm bg-primary/10 hover:bg-primary/20 text-primary rounded shadow-sm transition-colors text-left border border-primary/20"
            >
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-base">
                  badge
                </span>
                <div className="flex flex-col">
                  <span className="font-clinical-data text-clinical-data font-semibold text-primary">
                    Security Credential View (#{selectedUser.id === "rohit" ? "USR-IND-88219" : selectedUser.empId})
                  </span>
                  <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    Cryptographic DSC, FIDO2 endpoints & NABH audit view
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-primary text-sm">arrow_forward</span>
            </Link>

            <button
              onClick={() => setIsPermissionsDossierOpen(true)}
              className="w-full flex items-center justify-between p-space-sm bg-surface-container-lowest hover:bg-surface-container rounded shadow-sm transition-colors text-left border border-outline-variant/10"
            >
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-base">
                  shield_with_heart
                </span>
                <div className="flex flex-col">
                  <span className="font-clinical-data text-clinical-data font-semibold text-on-surface">
                    View Complete Permissions Dossier
                  </span>
                  <span className="font-metadata-micro text-metadata-micro text-outline">
                    Cath lab, Schedule III drugs, surgical overrides
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline text-sm">chevron_right</span>
            </button>

            <button
              onClick={() => setIsElevationLogOpen(true)}
              className="w-full flex items-center justify-between p-space-sm bg-surface-container-lowest hover:bg-surface-container rounded shadow-sm transition-colors text-left border border-outline-variant/10"
            >
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-base">bolt</span>
                <div className="flex flex-col">
                  <span className="font-clinical-data text-clinical-data font-semibold text-on-surface">
                    Emergency Privileges Elevation Log
                  </span>
                  <span className="font-metadata-micro text-metadata-micro text-outline">
                    Break-glass audit history (0 in last 30d)
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline text-sm">chevron_right</span>
            </button>

            <button
              onClick={() =>
                alert(`Security credential reset token dispatched to ${selectedUser.name}'s registered mobile.`)
              }
              className="w-full flex items-center justify-between p-space-sm bg-surface-container-lowest hover:bg-surface-container rounded shadow-sm transition-colors text-left border border-outline-variant/10"
            >
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-on-surface-variant text-base">
                  lock_reset
                </span>
                <div className="flex flex-col">
                  <span className="font-clinical-data text-clinical-data font-semibold text-on-surface">
                    Reset Security Credentials
                  </span>
                  <span className="font-metadata-micro text-metadata-micro text-outline">
                    Force re-enrollment of MFA token or PIN
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline text-sm">chevron_right</span>
            </button>
          </div>

          {/* Privilege Scope Tree */}
          <div className="p-space-lg flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <span className="font-metadata-micro text-metadata-micro text-outline uppercase font-semibold">
                Active Privileges Matrix
              </span>
              <span className="font-metadata-micro text-metadata-micro text-primary font-semibold">
                Role Tier: {selectedUser.roleTier}
              </span>
            </div>

            <div className="space-y-space-xs">
              {selectedUser.privileges.map((item, idx) => (
                <div
                  key={idx}
                  className="p-space-sm bg-surface-container-low rounded flex items-center justify-between border border-outline-variant/10"
                >
                  <div className="flex items-center gap-space-xs">
                    <span
                      className={`material-symbols-outlined text-base ${
                        item.allowed ? "text-primary" : "text-outline"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-clinical-data text-clinical-data font-medium text-on-surface">
                        {item.title}
                      </span>
                      <span className="font-metadata-micro text-metadata-micro text-outline">
                        {item.subtitle}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`material-symbols-outlined text-base ${
                      item.allowed ? "text-primary" : "text-outline"
                    }`}
                  >
                    {item.allowed ? "check_circle" : "remove_circle_outline"}
                  </span>
                </div>
              ))}
            </div>

            {/* Real-Time Concurrency Breakdown */}
            <div className="flex flex-col gap-space-xs pt-space-xs">
              <span className="font-metadata-micro text-metadata-micro text-outline uppercase font-semibold">
                Active Hardware Sessions
              </span>
              {selectedUser.hardwareSessions.length > 0 ? (
                selectedUser.hardwareSessions.map((session, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-space-xs bg-surface-container rounded font-clinical-data-mono text-metadata-micro"
                  >
                    <div className="flex items-center gap-1 text-on-surface">
                      <span className="material-symbols-outlined text-sm">{session.icon}</span>
                      <span>{session.device}</span>
                    </div>
                    <span className="text-primary font-semibold">{session.ip}</span>
                  </div>
                ))
              ) : (
                <div className="p-space-xs bg-surface-container rounded font-clinical-data-mono text-metadata-micro text-outline text-center">
                  Zero active hardware sessions
                </div>
              )}
            </div>

            {/* Terminal Actions */}
            <div className="flex items-center gap-space-xs pt-space-xs">
              <button
                onClick={() => setIsPermissionsDossierOpen(true)}
                className="flex-1 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded font-clinical-data text-clinical-data font-semibold transition-colors border border-outline-variant/20"
              >
                Modify Matrix
              </button>
              <button
                onClick={() => alert(`Terminated all active hardware sessions for ${selectedUser.name}`)}
                className="py-2 px-space-md bg-error-container hover:bg-error/20 text-on-error-container rounded font-clinical-data text-clinical-data font-semibold transition-colors flex items-center justify-center"
                title="Terminate All Active Sessions"
              >
                <span className="material-symbols-outlined text-base">logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal 1: Provision New User */}
      {isProvisionOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full shadow-xl border border-outline-variant/30 p-space-panel-padding flex flex-col gap-space-md">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-sm">
              <div className="flex items-center gap-2">
                <span className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">person_add</span>
                </span>
                <div>
                  <h3 className="font-section-title text-section-title text-on-surface font-bold">
                    Provision Workforce Identity
                  </h3>
                  <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    NHA ABDM Healthcare Professionals Registry (HPR) Federation
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsProvisionOpen(false)}
                className="h-8 w-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-space-sm font-clinical-data text-clinical-data">
              <div className="flex flex-col gap-1">
                <label className="font-metadata-micro text-metadata-micro uppercase font-semibold text-outline">
                  Staff Full Name
                </label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Dr. Kavita Nair, MD"
                  className="w-full h-8 px-3 rounded bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-space-sm">
                <div className="flex flex-col gap-1">
                  <label className="font-metadata-micro text-metadata-micro uppercase font-semibold text-outline">
                    Role Archetype
                  </label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                    className="h-8 px-2 rounded bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none"
                  >
                    <option value="Doctor / Lead Consultant">Doctor / Lead Consultant</option>
                    <option value="Registered Nurse / Triage">Registered Nurse / Triage</option>
                    <option value="Dispensing Pharmacist">Dispensing Pharmacist</option>
                    <option value="Lab Specimen Technologist">Lab Specimen Technologist</option>
                    <option value="Hospital Billing Admin">Hospital Billing Admin</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-metadata-micro text-metadata-micro uppercase font-semibold text-outline">
                    Medical Council Reg / License
                  </label>
                  <input
                    type="text"
                    value={newUserMci}
                    onChange={(e) => setNewUserMci(e.target.value)}
                    placeholder="MCI-DEL-XXXXX"
                    className="h-8 px-3 rounded bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-metadata-micro text-metadata-micro uppercase font-semibold text-outline">
                  Primary Department &amp; Physical Unit
                </label>
                <select
                  value={newUserDept}
                  onChange={(e) => setNewUserDept(e.target.value)}
                  className="h-8 px-2 rounded bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none"
                >
                  <option value="Cardiology & Cath Lab">Cardiology &amp; Cath Lab Suite</option>
                  <option value="Emergency Medicine">Emergency Medicine &amp; Resus Bay</option>
                  <option value="Coronary Care Unit">Coronary Care Unit (CCU)</option>
                  <option value="Central Pharmacy">Central Pharmacy Dispense Vault</option>
                  <option value="Clinical Diagnostics">Central Diagnostic Labs</option>
                </select>
              </div>

              <div className="p-2.5 bg-surface-container-low rounded-lg text-metadata-micro text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-primary">verified</span>
                <span>
                  Automatic FIDO2 YubiKey provisioning invitation will be dispatched to staff email.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
              <button
                onClick={() => setIsProvisionOpen(false)}
                className="px-space-md py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-clinical-data text-clinical-data"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`Successfully provisioned account for ${newUserName || "New Clinician"}`);
                  setIsProvisionOpen(false);
                }}
                className="px-space-md py-1.5 rounded bg-primary hover:bg-primary-container text-on-primary font-clinical-data text-clinical-data font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-base">check</span>
                <span>Complete Provisioning</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: MFA Policy */}
      {isMfaPolicyOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full shadow-xl border border-outline-variant/30 p-space-panel-padding flex flex-col gap-space-md">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-sm">
              <div className="flex items-center gap-2">
                <span className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">security_update_good</span>
                </span>
                <div>
                  <h3 className="font-section-title text-section-title text-on-surface font-bold">
                    Enterprise MFA Policy
                  </h3>
                  <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    Hardware Security &amp; FIPS 140-2 Standards
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMfaPolicyOpen(false)}
                className="h-8 w-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-2.5 font-clinical-data text-clinical-data">
              <div className="p-3 bg-surface-container-low rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-body-strong text-on-surface">FIDO2 / WebAuthn Hardware Keys</div>
                  <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    Mandatory for Lead Clinicians &amp; Pharmacy Vault
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-clinical-data-mono text-metadata-micro font-bold">
                  ENFORCED
                </span>
              </div>

              <div className="p-3 bg-surface-container-low rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-body-strong text-on-surface">TOTP Authenticator Apps</div>
                  <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    Permitted for General Nursing &amp; Administrative Staff
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-clinical-data-mono text-metadata-micro font-bold">
                  ACTIVE
                </span>
              </div>

              <div className="p-3 bg-surface-container-low rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-body-strong text-on-surface">SMS OTP Fallback</div>
                  <div className="font-metadata-micro text-metadata-micro text-error font-medium">
                    Strictly disabled per ABDM Security Standard M3
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-error-container text-on-error-container font-clinical-data-mono text-metadata-micro font-bold">
                  DISABLED
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
              <button
                onClick={() => setIsMfaPolicyOpen(false)}
                className="px-space-md py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-clinical-data text-clinical-data"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Bulk Revoke Sessions */}
      {isBulkRevokeOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full shadow-xl border border-outline-variant/30 p-space-panel-padding flex flex-col gap-space-md">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-sm">
              <div className="flex items-center gap-2">
                <span className="h-8 w-8 rounded-lg bg-error/10 text-error flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">power_settings_new</span>
                </span>
                <div>
                  <h3 className="font-section-title text-section-title text-on-surface font-bold">
                    Emergency Session Revocation
                  </h3>
                  <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    Privileged Access Incident Mitigation
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsBulkRevokeOpen(false)}
                className="h-8 w-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <p className="font-body-default text-clinical-data text-on-surface leading-normal">
              Are you sure you want to terminate all <strong>164 active hardware and tablet sessions</strong> across Apollo Central Campus? This forces all workstations back to biometric login prompts immediately.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
              <button
                onClick={() => setIsBulkRevokeOpen(false)}
                className="px-space-md py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-clinical-data text-clinical-data"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Executed emergency token revocation. All active sessions invalidated.");
                  setIsBulkRevokeOpen(false);
                }}
                className="px-space-md py-1.5 rounded bg-error text-on-error font-clinical-data text-clinical-data font-semibold shadow-sm"
              >
                Confirm Session Revocation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Complete Permissions Dossier */}
      {isPermissionsDossierOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full shadow-xl border border-outline-variant/30 p-space-panel-padding flex flex-col gap-space-md">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-sm">
              <div className="flex items-center gap-2">
                <span className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">shield_with_heart</span>
                </span>
                <div>
                  <h3 className="font-section-title text-section-title text-on-surface font-bold">
                    Full Permissions Matrix: {selectedUser.name}
                  </h3>
                  <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    {selectedUser.empId} · Role Tier: {selectedUser.roleTier}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPermissionsDossierOpen(false)}
                className="h-8 w-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-2 max-h-96 overflow-y-auto pr-1">
              {selectedUser.privileges.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-surface-container-low rounded-lg flex items-center justify-between border border-outline-variant/20"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`material-symbols-outlined text-base ${
                        item.allowed ? "text-primary" : "text-outline"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <div>
                      <div className="font-body-strong text-clinical-data text-on-surface">
                        {item.title}
                      </div>
                      <div className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded font-clinical-data-mono text-metadata-micro font-bold ${
                      item.allowed
                        ? "bg-primary/10 text-primary"
                        : "bg-surface-container text-outline"
                    }`}
                  >
                    {item.allowed ? "AUTHORIZED" : "RESTRICTED"}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
              <button
                onClick={() => setIsPermissionsDossierOpen(false)}
                className="px-space-md py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-clinical-data text-clinical-data"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 5: Elevation Log */}
      {isElevationLogOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full shadow-xl border border-outline-variant/30 p-space-panel-padding flex flex-col gap-space-md">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-sm">
              <div className="flex items-center gap-2">
                <span className="h-8 w-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">bolt</span>
                </span>
                <div>
                  <h3 className="font-section-title text-section-title text-on-surface font-bold">
                    Emergency Elevation Log
                  </h3>
                  <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
                    {selectedUser.name} · Break-Glass Audit Stream
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsElevationLogOpen(false)}
                className="h-8 w-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="p-3 bg-surface-container-low rounded-lg text-metadata-micro font-clinical-data-mono text-on-surface-variant flex flex-col gap-2">
              <div className="flex justify-between">
                <span>Elevations in last 30d:</span>
                <span className="text-primary font-bold">0 Zero</span>
              </div>
              <div className="flex justify-between">
                <span>Last Historical Elevation:</span>
                <span className="text-on-surface">14-Feb-2024 · Code Black Surge</span>
              </div>
              <div className="flex justify-between">
                <span>Justification on File:</span>
                <span className="text-on-surface">Immediate OT Complex access for donor heart</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
              <button
                onClick={() => setIsElevationLogOpen(false)}
                className="px-space-md py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-clinical-data text-clinical-data"
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
