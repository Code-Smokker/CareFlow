"use client";

import React from "react";
import Link from "next/link";

interface PagePlaceholderProps {
  title: string;
  category: "Clinical Workspace" | "Operations & Registry";
  icon: string;
  description: string;
  assignedRoute: string;
  expectedModules: string[];
}

export default function PagePlaceholder({
  title,
  category,
  icon,
  description,
  assignedRoute,
  expectedModules,
}: PagePlaceholderProps) {
  return (
    <div className="flex flex-col w-full gap-space-md">
      {/* Header bar */}
      <div className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-sm border border-surface-container/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <div className="h-10 w-10 bg-primary-container/10 text-primary-container rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">{icon}</span>
            </div>
            <div>
              <div className="flex items-center gap-space-xs">
                <h1 className="font-section-title text-section-title text-on-surface">
                  {title}
                </h1>
                <span className="bg-surface-container text-on-surface-variant font-metadata-micro text-metadata-micro px-2 py-0.5 rounded uppercase font-semibold">
                  {category}
                </span>
                <span className="bg-primary-fixed text-on-primary-fixed font-metadata-micro text-metadata-micro px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                  Assigned Slot Ready
                </span>
              </div>
              <p className="font-metadata-micro text-metadata-micro text-outline mt-0.5">
                Route: <code className="font-clinical-data-mono text-primary font-semibold">{assignedRoute}</code> · CareFlow Unified Layout Active
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="h-9 px-space-md bg-surface-container-low hover:bg-surface-container text-on-surface text-clinical-data font-clinical-data rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Back to Clinical Queue</span>
          </Link>
        </div>
      </div>

      {/* Content box */}
      <div className="w-full bg-surface-container-lowest rounded-xl p-8 shadow-sm flex flex-col items-center justify-center gap-space-md border border-dashed border-outline-variant min-h-[360px] text-center">
        <div className="h-16 w-16 bg-surface-container-low text-primary-container rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-3xl">{icon}</span>
        </div>

        <div className="max-w-md flex flex-col gap-1">
          <h2 className="font-section-title text-section-title text-on-surface">
            {title} Page Module
          </h2>
          <p className="text-clinical-data text-on-surface-variant">
            {description}
          </p>
        </div>

        {/* Expected modules list */}
        <div className="bg-surface-container-low p-space-md rounded-lg max-w-lg w-full text-left flex flex-col gap-2 border border-surface-container">
          <span className="font-table-header text-table-header uppercase text-outline tracking-wider">
            Assigned Feature Position for Later Merging:
          </span>
          <ul className="flex flex-col gap-1.5">
            {expectedModules.map((mod, idx) => (
              <li
                key={idx}
                className="flex items-center gap-2 text-clinical-data text-on-surface"
              >
                <span className="material-symbols-outlined text-primary text-base">
                  check_circle
                </span>
                <span>{mod}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-2 text-metadata-micro text-outline font-clinical-data-mono">
          <span className="inline-block w-2 h-2 rounded-full bg-primary animate-ping"></span>
          Ready to merge incoming HTML/TSX code into this assigned position anytime.
        </div>
      </div>
    </div>
  );
}
