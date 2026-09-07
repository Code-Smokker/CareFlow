"use client";

import React, { useState } from "react";
import Link from "next/link";

type PermissionState = "allowed" | "restricted" | "denied";

interface PermissionRow {
  id: string;
  category: "Clinical Encounter" | "Orders & Medication" | "Hospital Operations" | "Governance & Admin";
  name: string;
  description: string;
  isHighRisk?: boolean;
}

const ROLES = [
  { id: "lead", name: "Lead Consultant", icon: "badge", dept: "Dr. Rohit Verma" },
  { id: "attending", name: "Attending Physician", icon: "stethoscope", dept: "Specialist OPD" },
  { id: "resident", name: "Resident Doctor", icon: "school", dept: "Clinical Trainee" },
  { id: "nurse", name: "Triage / Staff RN", icon: "health_and_safety", dept: "Inpatient / ER" },
  { id: "pharmacist", name: "Clinical Pharmacist", icon: "medication", dept: "Central Dispense" },
  { id: "pathologist", name: "Lab Pathologist", icon: "biotech", dept: "Central Diagnostics" },
  { id: "admin", name: "Hospital Admin", icon: "admin_panel_settings", dept: "Operations Exec" },
  { id: "auditor", name: "Compliance Auditor", icon: "policy", dept: "NABH / Quality" },
];

const PERMISSIONS: PermissionRow[] = [
  // Clinical Encounter
  {
    id: "p_view_record",
    category: "Clinical Encounter",
    name: "View Patient Record & Timeline",
    description: "Access longitudinal clinical EHR, past encounters, and vitals history.",
  },
  {
    id: "p_edit_intake",
    category: "Clinical Encounter",
    name: "Edit Patient Intake & Triage ESI",
    description: "Record chief complaints, initial vital signs, and assign emergency acuity.",
  },
  {
    id: "p_ambient_scribe",
    category: "Clinical Encounter",
    name: "Ambient Voice Transcription & SOAP Draft",
    description: "Operate microphone stream to capture and draft clinical dialogue.",
  },
  {
    id: "p_sign_encounter",
    category: "Clinical Encounter",
    name: "Sign Encounter via Medical DSC (e-Sign)",
    description: "Cryptographically seal clinical notes into legal immutable records.",
    isHighRisk: true,
  },
  {
    id: "p_break_glass",
    category: "Clinical Encounter",
    name: "Break-Glass Emergency Access",
    description: "Emergency bypass for unassigned patient records during STAT code.",
    isHighRisk: true,
  },

  // Orders & Medication
  {
    id: "p_cpoe_orders",
    category: "Orders & Medication",
    name: "CPOE Diagnostic & Lab Orders",
    description: "Order stat blood panels, imaging examinations, and bedside point-of-care assays.",
  },
  {
    id: "p_narcotics_cpoe",
    category: "Orders & Medication",
    name: "Prescribe Schedule H/X & Narcotics",
    description: "Dual-attestation CPOE for high-potency opioids and controlled sedatives.",
    isHighRisk: true,
  },
  {
    id: "p_dispense_meds",
    category: "Orders & Medication",
    name: "Dispense Medication from Pharmacy Vault",
    description: "Confirm physical dispensing from hospital pharmacy automation vaults.",
  },
  {
    id: "p_generic_sub",
    category: "Orders & Medication",
    name: "Approve Generic Therapeutic Substitution",
    description: "Substitute brand drugs with bioequivalent hospital formulary drugs.",
  },

  // Hospital Operations
  {
    id: "p_bed_commandeer",
    category: "Hospital Operations",
    name: "Commandeer Inpatient / ICU Bed",
    description: "Pre-empt ongoing reservations to admit emergency Code STEMI / ICU patients.",
    isHighRisk: true,
  },
  {
    id: "p_tpa_billing",
    category: "Hospital Operations",
    name: "Authorize TPA Cashless Insurance Billing",
    description: "Commit final tariff invoices and cashless insurance pre-authorizations.",
  },
  {
    id: "p_discharge_patient",
    category: "Hospital Operations",
    name: "Discharge Patient & Generate Summary",
    description: "Authorize formal hospital discharge and generate patient handoff bundle.",
  },
  {
    id: "p_transfer_referral",
    category: "Hospital Operations",
    name: "Initiate Inter-Facility Critical Transfer",
    description: "Dispatch ACLS ambulance and transfer patient custody to receiving tertiary unit.",
  },

  // Governance & Admin
  {
    id: "p_modify_rules",
    category: "Governance & Admin",
    name: "Modify Clinical Safety Rules & DFA Graphs",
    description: "Change deterministic hard-stop boundaries, red flags, and algorithms.",
    isHighRisk: true,
  },
  {
    id: "p_manage_users_mfa",
    category: "Governance & Admin",
    name: "Manage User Roles & MFA Credentials",
    description: "Provision hospital accounts, bind FIDO2 hardware tokens, reset credentials.",
    isHighRisk: true,
  },
  {
    id: "p_audit_ledger",
    category: "Governance & Admin",
    name: "View Full Cryptographic Audit Ledger",
    description: "Inspect immutable SHA-256 block chain logs and access audit trails.",
  },
  {
    id: "p_bulk_export",
    category: "Governance & Admin",
    name: "Export Bulk Health Data (>50 Records)",
    description: "Export longitudinal patient datasets for epidemiological or research audits.",
    isHighRisk: true,
  },
];

// Initial RBAC Matrix mapping [permissionId][roleId]
const INITIAL_MATRIX: Record<string, Record<string, PermissionState>> = {
  p_view_record: {
    lead: "allowed",
    attending: "allowed",
    resident: "allowed",
    nurse: "allowed",
    pharmacist: "allowed",
    pathologist: "allowed",
    admin: "restricted",
    auditor: "allowed",
  },
  p_edit_intake: {
    lead: "allowed",
    attending: "allowed",
    resident: "allowed",
    nurse: "allowed",
    pharmacist: "denied",
    pathologist: "denied",
    admin: "denied",
    auditor: "denied",
  },
  p_ambient_scribe: {
    lead: "allowed",
    attending: "allowed",
    resident: "allowed",
    nurse: "restricted",
    pharmacist: "denied",
    pathologist: "denied",
    admin: "denied",
    auditor: "denied",
  },
  p_sign_encounter: {
    lead: "allowed",
    attending: "allowed",
    resident: "restricted",
    nurse: "denied",
    pharmacist: "denied",
    pathologist: "denied",
    admin: "denied",
    auditor: "denied",
  },
  p_break_glass: {
    lead: "allowed",
    attending: "allowed",
    resident: "restricted",
    nurse: "restricted",
    pharmacist: "denied",
    pathologist: "denied",
    admin: "denied",
    auditor: "denied",
  },

  p_cpoe_orders: {
    lead: "allowed",
    attending: "allowed",
    resident: "allowed",
    nurse: "restricted",
    pharmacist: "denied",
    pathologist: "allowed",
    admin: "denied",
    auditor: "denied",
  },
  p_narcotics_cpoe: {
    lead: "allowed",
    attending: "allowed",
    resident: "restricted",
    nurse: "denied",
    pharmacist: "restricted",
    pathologist: "denied",
    admin: "denied",
    auditor: "denied",
  },
  p_dispense_meds: {
    lead: "denied",
    attending: "denied",
    resident: "denied",
    nurse: "restricted",
    pharmacist: "allowed",
    pathologist: "denied",
    admin: "denied",
    auditor: "denied",
  },
  p_generic_sub: {
    lead: "allowed",
    attending: "allowed",
    resident: "denied",
    nurse: "denied",
    pharmacist: "allowed",
    pathologist: "denied",
    admin: "denied",
    auditor: "denied",
  },

  p_bed_commandeer: {
    lead: "allowed",
    attending: "allowed",
    resident: "denied",
    nurse: "restricted",
    pharmacist: "denied",
    pathologist: "denied",
    admin: "allowed",
    auditor: "denied",
  },
  p_tpa_billing: {
    lead: "denied",
    attending: "denied",
    resident: "denied",
    nurse: "denied",
    pharmacist: "denied",
    pathologist: "denied",
    admin: "allowed",
    auditor: "restricted",
  },
  p_discharge_patient: {
    lead: "allowed",
    attending: "allowed",
    resident: "restricted",
    nurse: "denied",
    pharmacist: "denied",
    pathologist: "denied",
    admin: "denied",
    auditor: "denied",
  },
  p_transfer_referral: {
    lead: "allowed",
    attending: "allowed",
    resident: "restricted",
    nurse: "denied",
    pharmacist: "denied",
    pathologist: "denied",
    admin: "restricted",
    auditor: "denied",
  },

  p_modify_rules: {
    lead: "restricted",
    attending: "denied",
    resident: "denied",
    nurse: "denied",
    pharmacist: "denied",
    pathologist: "denied",
    admin: "restricted",
    auditor: "denied",
  },
  p_manage_users_mfa: {
    lead: "denied",
    attending: "denied",
    resident: "denied",
    nurse: "denied",
    pharmacist: "denied",
    pathologist: "denied",
    admin: "allowed",
    auditor: "denied",
  },
  p_audit_ledger: {
    lead: "allowed",
    attending: "restricted",
    resident: "denied",
    nurse: "denied",
    pharmacist: "denied",
    pathologist: "denied",
    admin: "allowed",
    auditor: "allowed",
  },
  p_bulk_export: {
    lead: "restricted",
    attending: "denied",
    resident: "denied",
    nurse: "denied",
    pharmacist: "denied",
    pathologist: "denied",
    admin: "restricted",
    auditor: "restricted",
  },
};

export default function PermissionMatrixPage() {
  const [matrix, setMatrix] = useState(INITIAL_MATRIX);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cell Inspection Drawer / Modal
  const [activeCell, setActiveCell] = useState<{
    permission: PermissionRow;
    role: typeof ROLES[0];
    state: PermissionState;
  } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleState = (permissionId: string, roleId: string) => {
    const currentState = matrix[permissionId]?.[roleId] || "denied";
    const nextState: PermissionState =
      currentState === "allowed"
        ? "restricted"
        : currentState === "restricted"
        ? "denied"
        : "allowed";

    setMatrix((prev) => ({
      ...prev,
      [permissionId]: {
        ...prev[permissionId],
        [roleId]: nextState,
      },
    }));

    showToast(`Updated permission for ${roleId} → ${nextState.toUpperCase()}`);
  };

  const displayedRoles = ROLES.filter((r) => {
    if (selectedRoleFilter === "all") return true;
    return r.id === selectedRoleFilter;
  });

  const displayedPermissions = PERMISSIONS.filter((p) => {
    if (categoryFilter === "all") return true;
    return p.category === categoryFilter;
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
          <Link href="/users-role-permissions" className="hover:text-primary transition-colors">
            Users &amp; Role Permissions
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="font-clinical-data-mono text-primary font-semibold">Permission Matrix</span>
          <span className="ml-2 px-1.5 py-0.5 rounded bg-primary text-on-primary font-metadata-micro uppercase">
            RBAC v2.4 Active
          </span>
        </div>

        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-space-base pb-space-sm">
          <div className="flex items-center gap-space-sm">
            <div className="h-10 w-10 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-2xl">grid_view</span>
            </div>
            <div>
              <h1 className="font-page-title text-page-title text-on-surface font-semibold">
                Enterprise Roles &amp; Permission Matrix
              </h1>
              <p className="font-body-default text-clinical-data text-on-surface-variant">
                Hospital-wide Role-Based Access Control (RBAC) &amp; Privileged Access Management (PAM)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => showToast("Exported complete RBAC Policy Matrix (CSV format).")}
              className="px-space-md py-1.5 bg-surface-container hover:bg-surface-container-high rounded-lg text-clinical-data font-clinical-data text-on-surface transition-colors flex items-center gap-1 border border-outline-variant/20 shadow-xs"
            >
              <span className="material-symbols-outlined text-sm text-primary">download</span>
              <span>Export Policy (CSV)</span>
            </button>
            <button
              onClick={() => showToast("Loaded immutable policy audit change ledger.")}
              className="px-space-md py-1.5 bg-secondary hover:bg-secondary/90 rounded-lg text-clinical-data font-clinical-data text-on-secondary transition-colors flex items-center gap-1 shadow-xs"
            >
              <span className="material-symbols-outlined text-sm">history</span>
              <span>Audit Changes</span>
            </button>
            <Link
              href="/users-role-permissions"
              className="px-space-md py-1.5 bg-primary hover:bg-primary-container rounded-lg text-clinical-data font-clinical-data font-semibold text-on-primary transition-colors flex items-center gap-1 shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">badge</span>
              <span>User Directory</span>
            </Link>
          </div>
        </div>
      </div>

      {/* High-Risk Policy Alert Strip */}
      <div className="p-space-sm bg-surface-container-low rounded-xl border border-outline-variant/30 flex items-center justify-between flex-wrap gap-2 text-metadata-micro">
        <div className="flex items-center gap-2 text-on-surface">
          <span className="material-symbols-outlined text-error text-lg">shield</span>
          <span>
            <strong>Zero Trust Interlocks Enforced:</strong> All changes to High-Risk permissions demand Dual Medical Director Co-sign and biometric MFA attestation.
          </span>
        </div>
        <div className="flex items-center gap-3 font-clinical-data-mono">
          <span className="flex items-center gap-1 text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-600"></span> Allowed (Full)
          </span>
          <span className="flex items-center gap-1 text-amber-800">
            <span className="h-2 w-2 rounded-full bg-amber-600"></span> Restricted (Dual Co-Sign)
          </span>
          <span className="flex items-center gap-1 text-slate-600">
            <span className="h-2 w-2 rounded-full bg-slate-400"></span> Denied
          </span>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-sm border border-outline-variant/30 flex items-center justify-between flex-wrap gap-space-sm">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-metadata-micro font-semibold text-outline uppercase">Filter Category:</span>
          {["all", "Clinical Encounter", "Orders & Medication", "Hospital Operations", "Governance & Admin"].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-lg text-metadata-micro font-clinical-data font-medium transition-colors ${
                  categoryFilter === cat
                    ? "bg-primary text-on-primary shadow-xs font-semibold"
                    : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                {cat === "all" ? "All Categories" : cat}
              </button>
            )
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-metadata-micro font-semibold text-outline uppercase">Role View:</span>
          <select
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
            className="h-8 px-2 rounded-lg bg-surface-container-low border border-outline-variant text-clinical-data font-clinical-data text-on-surface focus:outline-none focus:border-primary"
          >
            <option value="all">All 8 Roles</option>
            {ROLES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Interactive Matrix Grid Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-surface-container-high">
              <th className="p-3 font-table-header text-table-header uppercase text-outline min-w-[280px]">
                Permission / Action Name
              </th>
              {displayedRoles.map((role) => (
                <th
                  key={role.id}
                  className="p-3 text-center border-l border-surface-container-high min-w-[130px]"
                >
                  <div className="flex flex-col items-center">
                    <span className="material-symbols-outlined text-primary text-base">{role.icon}</span>
                    <span className="font-clinical-data text-metadata-micro font-bold text-on-surface text-center">
                      {role.name}
                    </span>
                    <span className="text-[10px] text-outline truncate">{role.dept}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-high text-clinical-data font-clinical-data">
            {displayedPermissions.map((perm) => (
              <tr key={perm.id} className="hover:bg-surface-container-low/30 transition-colors">
                {/* Row Header */}
                <td className="p-3">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="font-body-strong text-clinical-data text-on-surface font-semibold">
                        {perm.name}
                      </span>
                      {perm.isHighRisk && (
                        <span className="px-1.5 py-0.2 rounded bg-error/15 text-error font-clinical-data-mono text-[9px] font-bold">
                          HIGH RISK
                        </span>
                      )}
                    </div>
                    <span className="text-metadata-micro text-outline mt-0.5">{perm.description}</span>
                  </div>
                </td>

                {/* Role Cells */}
                {displayedRoles.map((role) => {
                  const state = matrix[perm.id]?.[role.id] || "denied";
                  return (
                    <td
                      key={role.id}
                      className="p-2.5 text-center border-l border-surface-container-high"
                    >
                      <button
                        onClick={() => handleToggleState(perm.id, role.id)}
                        onDoubleClick={() => setActiveCell({ permission: perm, role, state })}
                        className={`w-full py-1.5 px-2 rounded-lg font-clinical-data-mono text-metadata-micro font-semibold transition-all flex items-center justify-center gap-1 shadow-2xs ${
                          state === "allowed"
                            ? "bg-emerald-100 text-emerald-900 border border-emerald-300 hover:bg-emerald-200"
                            : state === "restricted"
                            ? "bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200"
                            : "bg-surface-container text-slate-600 border border-outline-variant/20 hover:bg-surface-container-high"
                        }`}
                        title="Click to cycle Allowed / Restricted / Denied. Double click to view audit policy."
                      >
                        <span className="material-symbols-outlined text-xs">
                          {state === "allowed"
                            ? "check_circle"
                            : state === "restricted"
                            ? "shield"
                            : "block"}
                        </span>
                        <span className="capitalize">{state}</span>
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal: Cell Policy Inspector */}
      {activeCell && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-md border border-outline-variant/30 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-space-base border-b border-surface-container-high flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-xl">policy</span>
                <h3 className="font-section-title text-section-title text-on-surface font-semibold">
                  Permission Policy Detail
                </h3>
              </div>
              <button
                onClick={() => setActiveCell(null)}
                className="p-1 rounded-md text-outline hover:text-on-surface hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="p-space-base flex flex-col gap-space-sm text-clinical-data text-on-surface">
              <div className="p-space-sm bg-surface-container-low rounded-lg border border-outline-variant/15 flex flex-col gap-1">
                <span className="font-bold text-on-surface">{activeCell.permission.name}</span>
                <span className="text-metadata-micro text-outline">{activeCell.permission.description}</span>
                <div className="flex items-center justify-between pt-1 border-t border-surface-container-high font-clinical-data-mono text-metadata-micro">
                  <span>Target Role: <strong>{activeCell.role.name}</strong></span>
                  <span className="uppercase font-bold text-primary">{activeCell.state}</span>
                </div>
              </div>

              <div className="text-metadata-micro text-on-surface-variant leading-relaxed">
                Inherited from <strong>CareFlow NABH-2024 Tier-1 Access Control Standard</strong>. All changes create a cryptographic block record in the governance ledger.
              </div>

              <div className="pt-space-xs flex items-center justify-end gap-space-xs border-t border-surface-container-high">
                <button
                  type="button"
                  onClick={() => setActiveCell(null)}
                  className="px-space-md py-1.5 rounded-lg text-clinical-data text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleToggleState(activeCell.permission.id, activeCell.role.id);
                    setActiveCell(null);
                  }}
                  className="px-space-lg py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-clinical-data text-clinical-data font-semibold shadow-sm transition-all"
                >
                  Toggle Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
