"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  name: string;
  href: string;
  icon: string;
}

const caseWorkItems: NavItem[] = [
  { name: "OPD Queue", href: "/queue", icon: "emergency" },
  { name: "Triage Board", href: "/triage", icon: "grid_view" },
  { name: "Documents", href: "/documents", icon: "document_scanner" },
  { name: "Medications", href: "/medications", icon: "sync_alt" },
];

const standardsGovernanceItems: NavItem[] = [
  { name: "Terminology", href: "/terminology", icon: "schema" },
  { name: "FHIR / ABDM Gateway", href: "/fhir", icon: "hub" },
  { name: "Audit Log", href: "/audit", icon: "verified_user" },
  { name: "Consent & Privacy", href: "/consent", icon: "policy" },
  { name: "Rules & Red Flags", href: "/rules", icon: "rule_settings" },
  { name: "Integration Logs", href: "/integrations", icon: "cable" },
];

const adminItems: NavItem[] = [{ name: "Analytics", href: "/analytics", icon: "dashboard" }];

function NavSection({ title, items, isLinkActive }: { title: string; items: NavItem[]; isLinkActive: (href: string) => boolean }) {
  return (
    <>
      <div className="px-space-panel-padding mt-space-md mb-space-xs first:mt-0">
        <span className="font-metadata-micro text-metadata-micro text-outline tracking-wider uppercase font-semibold">
          {title}
        </span>
      </div>
      <nav className="flex flex-col gap-0.5 px-space-sm">
        {items.map((item) => {
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
              <span className="material-symbols-outlined text-base">{item.icon}</span>
              <span className="font-clinical-data text-clinical-data">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  const isLinkActive = (href: string) => {
    if (href === "/queue") {
      return pathname === "/" || pathname.startsWith("/queue") || pathname.startsWith("/visit/");
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-64 bg-surface-container-lowest z-30 flex flex-col justify-between shadow-[1px_0_4px_rgba(0,0,0,0.02)] overflow-y-auto print:hidden">
      <div className="flex flex-col py-space-sm">
        <NavSection title="Case Work" items={caseWorkItems} isLinkActive={isLinkActive} />
        <NavSection title="Standards & Governance" items={standardsGovernanceItems} isLinkActive={isLinkActive} />
        <NavSection title="Admin" items={adminItems} isLinkActive={isLinkActive} />
      </div>

      <div className="p-space-sm bg-surface-container-low">
        <div className="flex items-center justify-between px-space-xs py-1 text-metadata-micro font-metadata-micro">
          <span className="text-on-surface-variant flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary inline-block"></span>
            ABHA M1/M2/M3
          </span>
          <span className="text-primary font-semibold">ONLINE</span>
        </div>
        <div className="flex items-center justify-between px-space-xs text-metadata-micro font-clinical-data-mono text-outline pt-1">
          <span className="truncate">CareFlow · SehatNxt</span>
          <span className="material-symbols-outlined text-xs">speed</span>
        </div>
      </div>
    </aside>
  );
}
