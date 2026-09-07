"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  name: string;
  href: string;
  icon: string;
  badge?: {
    text: string;
    className: string;
  };
  badges?: Array<{
    text: string;
    className: string;
  }>;
}

const clinicalWorkspaceItems: NavItem[] = [
  {
    name: "Clinical Queue",
    href: "/",
    icon: "emergency",
    badges: [
      { text: "2", className: "bg-error text-on-error font-bold" },
      { text: "18", className: "bg-surface-container text-on-surface" },
    ],
  },
  {
    name: "Patient Overview",
    href: "/patient-overview",
    icon: "person_search",
  },
  {
    name: "Medical History",
    href: "/medical-history",
    icon: "clinical_notes",
    badge: {
      text: "3",
      className: "bg-primary-container text-on-primary-container font-clinical-data-mono text-[10px] px-1.5 rounded-sm font-semibold",
    },
  },
  {
    name: "Problems & Multi-Coding",
    href: "/problems",
    icon: "schema",
    badge: {
      text: "ICD-11",
      className: "bg-surface-container text-primary font-clinical-data-mono text-[10px] px-1.5 rounded-sm font-semibold",
    },
  },
  {
    name: "Clinical Timeline",
    href: "/clinical-timeline",
    icon: "timeline",
  },
  {
    name: "Consultation & AI",
    href: "/consultation-workspace",
    icon: "edit_note",
    badge: {
      text: "ACTIVE",
      className: "font-metadata-micro text-primary-container font-semibold text-[10px]",
    },
  },
  {
    name: "What Changed? (Delta)",
    href: "/consultation-followup",
    icon: "compare_arrows",
    badge: {
      text: "DIFF",
      className: "bg-error/15 text-error font-clinical-data-mono text-[9px] px-1.5 rounded-sm font-bold",
    },
  },
  {
    name: "AI Clinical Assistant",
    href: "/clinical-assistant",
    icon: "smart_toy",
    badge: {
      text: "CDSS",
      className: "bg-primary-container text-on-primary-container font-clinical-data-mono text-[9px] px-1.5 rounded-sm font-semibold",
    },
  },
  {
    name: "Documents & OCR",
    href: "/document-tray",
    icon: "document_scanner",
    badge: {
      text: "3",
      className: "bg-secondary-container text-on-secondary-container font-clinical-data-mono text-[10px] px-1.5 rounded-sm",
    },
  },
  {
    name: "Imaging & Radiology",
    href: "/imaging",
    icon: "radiology",
    badge: {
      text: "PACS",
      className: "bg-surface-container text-primary font-clinical-data-mono text-[10px] px-1.5 rounded-sm font-semibold",
    },
  },
  {
    name: "Med Reconciliation",
    href: "/medication-reconciliation",
    icon: "sync_alt",
    badge: {
      text: "5",
      className: "bg-primary text-on-primary font-clinical-data-mono text-[10px] px-1.5 rounded-full font-bold",
    },
  },
  {
    name: "Triage Command",
    href: "/triage-command",
    icon: "grid_view",
  },
  {
    name: "CPOE & Cath Orders",
    href: "/cpoe",
    icon: "assignment_turned_in",
    badge: {
      text: "STAT P1",
      className: "bg-error text-on-error font-clinical-data-mono text-[9px] px-1.5 rounded-full font-bold",
    },
  },
  {
    name: "Care Plan & Pathway",
    href: "/care-plan",
    icon: "route",
    badge: {
      text: "v2.4",
      className: "bg-surface-container text-primary font-clinical-data-mono text-[10px] px-1.5 rounded-sm font-semibold",
    },
  },
  {
    name: "Print Clinical Summary",
    href: "/clinical-summary/print",
    icon: "print",
  },
];

const operationsHmsItems: NavItem[] = [
  {
    name: "Patient Registry",
    href: "/patient-registry",
    icon: "contacts",
  },
  {
    name: "Appointments & Slots",
    href: "/schedule-opd-slots",
    icon: "calendar_month",
  },
  {
    name: "Admissions / IPD",
    href: "/admissions-ipd",
    icon: "hotel",
  },
  {
    name: "Discharge & Referrals",
    href: "/discharge-referrals",
    icon: "output",
  },
  {
    name: "Billing & Payments",
    href: "/billing-payments",
    icon: "receipt_long",
  },
  {
    name: "Pharmacy & Lab",
    href: "/pharmacy-lab",
    icon: "medication",
  },
  {
    name: "Operations Command",
    href: "/operations-command",
    icon: "dashboard",
  },
];

const adminGovernanceItems: NavItem[] = [
  {
    name: "Quality & Audit Logs",
    href: "/quality-audit-logs",
    icon: "verified_user",
  },
  {
    name: "Clinical Rules & Protocols",
    href: "/clinical-rules-protocols",
    icon: "rule_settings",
  },
  {
    name: "Red-Flag Rule Builder",
    href: "/red-flag-rule-builder",
    icon: "gavel",
    badge: {
      text: "RF-01",
      className: "bg-error/15 text-error font-clinical-data-mono text-[9px] px-1.5 rounded-sm font-bold",
    },
  },
  {
    name: "Users & Role Permissions",
    href: "/users-role-permissions",
    icon: "badge",
  },
  {
    name: "Permission Matrix",
    href: "/permission-matrix",
    icon: "grid_view",
  },
  {
    name: "Access & Active Sessions",
    href: "/access-active-sessions",
    icon: "devices",
  },
  {
    name: "ABDM & FHIR Gateway",
    href: "/abdm-fhir-gateway",
    icon: "hub",
    badge: {
      text: "M1-M3",
      className: "bg-primary-fixed text-on-primary-fixed font-clinical-data-mono text-[9px] px-1.5 rounded-sm font-bold",
    },
  },
  {
    name: "Integration Logs",
    href: "/integration-logs",
    icon: "cable",
  },
  {
    name: "Security & Privacy Center",
    href: "/security-privacy-center",
    icon: "policy",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isLinkActive = (href: string) => {
    if (href === "/") {
      return pathname === "/" || pathname === "/clinical-queue";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-64 bg-surface-container-lowest z-30 flex flex-col justify-between shadow-[1px_0_4px_rgba(0,0,0,0.02)] overflow-y-auto print:hidden">
      <div className="flex flex-col py-space-sm">
        {/* Section 1: Clinical Workspace */}
        <div className="px-space-panel-padding mb-space-xs">
          <span className="font-metadata-micro text-metadata-micro text-outline tracking-wider uppercase font-semibold">
            Clinical Workspace
          </span>
        </div>
        <nav className="flex flex-col gap-0.5 px-space-sm">
          {clinicalWorkspaceItems.map((item) => {
            const active = isLinkActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center justify-between px-space-sm py-1.5 transition-colors rounded text-clinical-data ${
                  active
                    ? "bg-primary-container text-on-primary-container font-semibold"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                }`}
              >
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-base">
                    {item.icon}
                  </span>
                  <span className="font-clinical-data text-clinical-data">
                    {item.name}
                  </span>
                </div>

                {item.badges && (
                  <div className="flex items-center gap-1">
                    {item.badges.map((b, idx) => (
                      <span
                        key={idx}
                        className={`${b.className} font-clinical-data-mono text-[10px] px-1 rounded-sm leading-none py-0.5`}
                      >
                        {b.text}
                      </span>
                    ))}
                  </div>
                )}

                {item.badge && (
                  <span className={item.badge.className}>
                    {item.badge.text}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Section 2: Operations & HMS */}
        <div className="px-space-panel-padding mt-space-md mb-space-xs">
          <span className="font-metadata-micro text-metadata-micro text-outline tracking-wider uppercase font-semibold">
            Operations &amp; HMS
          </span>
        </div>
        <nav className="flex flex-col gap-0.5 px-space-sm">
          {operationsHmsItems.map((item) => {
            const active = isLinkActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-space-xs px-space-sm py-1.5 transition-colors rounded text-clinical-data ${
                  active
                    ? "bg-primary-container text-on-primary-container font-semibold"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {item.icon}
                </span>
                <span className="font-clinical-data text-clinical-data">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Section 3: Admin & Governance */}
        <div className="px-space-panel-padding mt-space-md mb-space-xs">
          <span className="font-metadata-micro text-metadata-micro text-outline tracking-wider uppercase font-semibold">
            Admin &amp; Governance
          </span>
        </div>
        <nav className="flex flex-col gap-0.5 px-space-sm">
          {adminGovernanceItems.map((item) => {
            const active = isLinkActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-space-xs px-space-sm py-1.5 transition-colors rounded text-clinical-data ${
                  active
                    ? "bg-primary-container text-on-primary-container font-semibold"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {item.icon}
                </span>
                <span className="font-clinical-data text-clinical-data">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer with ABHA Gateway Telemetry */}
      <div className="p-space-sm bg-surface-container-low">
        <div className="flex items-center justify-between px-space-xs py-1 text-metadata-micro font-metadata-micro">
          <span className="text-on-surface-variant flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary inline-block"></span>
            ABHA M1/M2/M3
          </span>
          <span className="text-primary font-semibold">ONLINE</span>
        </div>
        <div className="flex items-center justify-between px-space-xs text-metadata-micro font-clinical-data-mono text-outline pt-1">
          <span className="truncate">CareFlow v2.4 · SehatNxt</span>
          <span className="material-symbols-outlined text-xs">speed</span>
        </div>
      </div>
    </aside>
  );
}
