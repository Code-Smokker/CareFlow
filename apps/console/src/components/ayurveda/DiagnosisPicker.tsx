"use client";

import { useState } from "react";
import { StatusBadge } from "@careflow/ui";
import type { DiagnosisPick } from "./labels";

type Concept = { system: string; code: string; display: string };
type Translation = {
  matched: boolean;
  target_code?: string | null;
  target_display?: string | null;
  reviewed_by?: string | null;
};

/** Vyadhi Vinishchaya — the Vaidya searches NAMASTE and picks. CareFlow never suggests or ranks
 * a diagnosis (CLAUDE.md rule 2): nothing is searched until the Vaidya types, and the results are
 * listed alphabetically with no score shown, so order carries no implied preference. Picking a
 * concept fetches its linked ICD-11 TM2 code from the terminology crosswalk (/translate). */
export function DiagnosisPicker({
  value,
  onChange,
  disabled,
}: {
  value: DiagnosisPick[];
  onChange: (next: DiagnosisPick[]) => void;
  disabled?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Concept[] | null>(null);
  const [busy, setBusy] = useState<"search" | string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const search = async () => {
    if (!query.trim()) return;
    setBusy("search");
    setMessage(null);
    const res = await fetch(`/api/terminology/search?q=${encodeURIComponent(query.trim())}&system=namaste`);
    if (!res.ok) {
      setResults([]);
      setMessage("The terminology service could not be reached. Check that it is running, then search again.");
    } else {
      const found = (await res.json()) as Concept[];
      setResults([...found].sort((a, b) => a.display.localeCompare(b.display)));
    }
    setBusy(null);
  };

  const pick = async (concept: Concept) => {
    if (value.some((d) => d.code === concept.code)) return;
    setBusy(concept.code);
    setMessage(null);
    let icd11: DiagnosisPick["icd11"] = null;
    let reviewed = false;
    const res = await fetch("/api/terminology/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system: "namaste", code: concept.code, target: "icd11-tm2" }),
    });
    if (res.ok) {
      const t = (await res.json()) as Translation;
      if (t.matched && t.target_code) {
        icd11 = { code: t.target_code, display: t.target_display ?? null };
        reviewed = Boolean(t.reviewed_by);
      }
    } else {
      setMessage("Picked, but the ICD-11 TM2 link could not be fetched — it is recorded as unlinked.");
    }
    onChange([...value, { code: concept.code, display: concept.display, icd11, mapping_reviewed: reviewed }]);
    setBusy(null);
  };

  return (
    <div className="flex flex-col gap-space-sm">
      {value.length > 0 && (
        <ul aria-label="Picked diagnoses" className="flex flex-col gap-space-xs">
          {value.map((d) => (
            <li key={d.code} className="flex items-start justify-between gap-space-sm rounded-lg border border-primary bg-primary-container/20 px-space-sm py-space-xs">
              <div className="min-w-0">
                <p className="font-body-strong text-body-strong text-on-surface">{d.display}</p>
                <p className="font-clinical-data-mono text-clinical-data-mono text-on-surface-variant">NAMASTE {d.code}</p>
                <p className="mt-0.5 flex flex-wrap items-center gap-1 font-clinical-data-mono text-clinical-data-mono text-on-surface-variant">
                  {d.icd11 ? (
                    <>
                      ICD-11 TM2 {d.icd11.code}
                      {d.icd11.display ? ` — ${d.icd11.display}` : ""}
                      {!d.mapping_reviewed && <StatusBadge tone="uncertain" label="Mapping not yet reviewed" />}
                    </>
                  ) : (
                    <StatusBadge tone="neutral" label="No ICD-11 TM2 link" />
                  )}
                </p>
              </div>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => onChange(value.filter((x) => x.code !== d.code))}
                  className="shrink-0 rounded-lg border border-outline-variant px-space-sm py-1 font-clinical-data text-clinical-data text-on-surface-variant hover:bg-surface-container-low focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                  aria-label={`Remove ${d.display}`}
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {!disabled && (
        <>
          <div className="flex items-center gap-space-sm">
            <label className="sr-only" htmlFor="namaste-search">Search NAMASTE diagnoses</label>
            <input
              id="namaste-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), search())}
              placeholder="Search NAMASTE — e.g. jwara, amavata…"
              className="flex-1 h-10 px-space-sm rounded-lg border border-outline-variant bg-surface-container-lowest font-clinical-data text-clinical-data text-on-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            />
            <button
              type="button"
              onClick={search}
              disabled={busy !== null}
              className="h-10 px-space-lg rounded-lg bg-primary text-on-primary font-body-strong text-body-strong disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {busy === "search" ? "Searching…" : "Search"}
            </button>
          </div>
          <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">
            Results are listed alphabetically. CareFlow does not suggest or rank a diagnosis — you pick.
          </p>
        </>
      )}

      {message && <p role="alert" className="font-clinical-data text-clinical-data text-uncertain">{message}</p>}

      {results !== null && !disabled && (
        <ul aria-label="NAMASTE search results" className="flex flex-col gap-space-xs max-h-72 overflow-auto">
          {results.length === 0 && !message && (
            <li className="font-clinical-data text-clinical-data text-on-surface-variant">
              No NAMASTE concepts match. If the terminology service has no NAMASTE export loaded, nothing can be found — see infra/seed/namaste.
            </li>
          )}
          {results.map((c) => (
            <li key={c.code} className="flex items-center justify-between gap-space-sm rounded-lg border border-outline-variant bg-surface-container-lowest px-space-sm py-space-xs">
              <span className="min-w-0">
                <span className="font-clinical-note text-clinical-note text-on-surface">{c.display}</span>{" "}
                <span className="font-clinical-data-mono text-clinical-data-mono text-on-surface-variant">{c.code}</span>
              </span>
              <button
                type="button"
                onClick={() => pick(c)}
                disabled={busy !== null || value.some((d) => d.code === c.code)}
                className="shrink-0 rounded-lg border border-primary px-space-sm py-1 font-body-strong text-body-strong text-primary disabled:opacity-50 hover:bg-primary-container/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                aria-label={`Pick ${c.display}`}
              >
                {value.some((d) => d.code === c.code) ? "Picked" : busy === c.code ? "Picking…" : "Pick"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
