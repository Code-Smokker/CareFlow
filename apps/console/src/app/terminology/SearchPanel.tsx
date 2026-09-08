"use client";

import { useState } from "react";
import { StatusBadge } from "@careflow/ui";

type System = "namaste" | "icd11-tm2" | "icd11-bio";
type ConceptSummary = { system: System; code: string; display: string; score: number };
type ConceptMapMatch = {
  matched: boolean;
  equivalence: string | null;
  target_system?: System;
  target_code?: string | null;
  target_display?: string | null;
  reviewed_by?: string | null;
};

const SYSTEM_LABEL: Record<System, string> = {
  namaste: "NAMASTE",
  "icd11-tm2": "ICD-11 TM2",
  "icd11-bio": "ICD-11 Biomedicine",
};

export function SearchPanel() {
  const [query, setQuery] = useState("");
  const [system, setSystem] = useState<System>("namaste");
  const [results, setResults] = useState<ConceptSummary[]>([]);
  const [pending, setPending] = useState(false);
  const [translation, setTranslation] = useState<Record<string, ConceptMapMatch | "pending" | "error">>({});

  const search = async () => {
    if (!query) return;
    setPending(true);
    const res = await fetch(`/api/terminology/search?q=${encodeURIComponent(query)}&system=${system}`);
    setResults(res.ok ? await res.json() : []);
    setPending(false);
  };

  const translate = async (concept: ConceptSummary) => {
    const target: System = concept.system === "namaste" ? "icd11-tm2" : "namaste";
    setTranslation((t) => ({ ...t, [concept.code]: "pending" }));
    const res = await fetch("/api/terminology/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system: concept.system, code: concept.code, target }),
    });
    const body = res.ok ? await res.json() : "error";
    setTranslation((t) => ({ ...t, [concept.code]: body }));
  };

  return (
    <div>
      <div className="flex items-center gap-space-sm mb-space-md">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          placeholder="Search a term, e.g. jwara, chest pain…"
          className="flex-1 h-10 px-space-sm rounded-lg border border-outline-variant bg-surface-container-lowest font-clinical-data text-clinical-data text-on-surface"
        />
        <select
          value={system}
          onChange={(e) => setSystem(e.target.value as System)}
          className="h-10 px-space-sm rounded-lg border border-outline-variant bg-surface-container-lowest font-clinical-data text-clinical-data text-on-surface"
        >
          {(Object.keys(SYSTEM_LABEL) as System[]).map((s) => (
            <option key={s} value={s}>{SYSTEM_LABEL[s]}</option>
          ))}
        </select>
        <button
          onClick={search}
          disabled={pending}
          className="h-10 px-space-lg rounded-lg bg-primary text-on-primary font-body-strong text-body-strong disabled:opacity-50"
        >
          {pending ? "Searching…" : "Search"}
        </button>
      </div>

      <div className="flex flex-col gap-space-sm">
        {results.map((concept) => {
          const t = translation[concept.code];
          return (
            <div key={concept.code} className="rounded-lg border border-outline-variant bg-surface-container-lowest p-panel-padding">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body-strong text-body-strong text-on-surface">{concept.display}</p>
                  <p className="font-clinical-data-mono text-clinical-data-mono text-on-surface-variant">
                    {SYSTEM_LABEL[concept.system]} · {concept.code} · match {Math.round(concept.score * 100)}%
                  </p>
                </div>
                <button
                  onClick={() => translate(concept)}
                  className="px-space-sm py-1 rounded-md bg-surface-container text-on-surface font-clinical-data text-clinical-data"
                >
                  Dual-code
                </button>
              </div>
              {t === "pending" && <p className="mt-space-xs font-metadata-micro text-on-surface-variant">Translating…</p>}
              {t === "error" && <p className="mt-space-xs font-metadata-micro text-error">Translation failed.</p>}
              {t && t !== "pending" && t !== "error" && (
                <div className="mt-space-sm flex items-center gap-space-sm">
                  {t.matched ? (
                    <>
                      <StatusBadge tone="good" label={`${t.target_display} (${t.target_code})`} />
                      <span className="font-metadata-micro text-on-surface-variant">{t.equivalence}</span>
                      {!t.reviewed_by && (
                        <StatusBadge tone="uncertain" label="Unreviewed mapping" />
                      )}
                    </>
                  ) : (
                    <StatusBadge tone="uncertain" label="No mapping found" />
                  )}
                </div>
              )}
            </div>
          );
        })}
        {results.length === 0 && !pending && (
          <p className="font-clinical-data text-on-surface-variant">Search to see ranked concepts.</p>
        )}
      </div>
    </div>
  );
}
