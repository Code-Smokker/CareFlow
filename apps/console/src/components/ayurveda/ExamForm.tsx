"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProvenanceBadge } from "@careflow/ui";
import { DiagnosisPicker } from "./DiagnosisPicker";
import {
  type AyurvedaRecord,
  type DiagnosisPick,
  type ExamField,
  type ExamStep,
  optionLabel,
  previewBmi,
  previewVayaBand,
} from "./labels";
import { PrakritiScorePanel } from "./PrakritiScorePanel";
import { VaidyaChip } from "./VaidyaChip";

const RECORDED_BY = "console-user"; // no RBAC until Day 4 — same convention as SignButton's signed_by

const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

/**
 * Steps 2–5. Rendered entirely from the vocabulary the gateway serves (GET /v1/ayurveda/vocabulary)
 * — no option, label or gloss is written here. The Vaidya's edits live in `draft` until Save
 * sends only what changed (partial saves are fine); the server decides whether a value on a
 * patient-reported field is a confirmation or an override, and keeps the patient's original.
 */
export function ExamForm({
  visitId,
  step,
  record,
  reviewStatus,
}: {
  visitId: string;
  step: ExamStep;
  record: AyurvedaRecord;
  reviewStatus: string;
}) {
  const router = useRouter();
  const locked = record.signed;
  const stored = new Map(record.exam.map((e) => [e.field_id, e]));
  const [draft, setDraft] = useState<Record<string, unknown>>({});
  const [state, setState] = useState<{ kind: "idle" | "saving" | "saved" | "error"; message?: string }>({ kind: "idle" });

  const valueOf = (id: string): unknown => (id in draft ? draft[id] : (stored.get(id)?.value ?? null));
  const set = (id: string, value: unknown) => {
    setDraft((d) => ({ ...d, [id]: value }));
    setState({ kind: "idle" });
  };
  const dirty = Object.keys(draft).length;

  const save = async () => {
    setState({ kind: "saving" });
    try {
      const res = await fetch(`/api/visits/${visitId}/ayurveda`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recorded_by: RECORDED_BY,
          fields: Object.entries(draft).map(([field_id, value]) => ({ field_id, value })),
        }),
      });
      const body = await res.json();
      if (!res.ok) {
        setState({ kind: "error", message: body?.error?.message ?? "Save failed — nothing was changed. Try again." });
        return;
      }
      setDraft({});
      setState({ kind: "saved", message: `Saved ${dirty} field${dirty === 1 ? "" : "s"}.` });
      router.refresh();
    } catch {
      setState({ kind: "error", message: "The gateway could not be reached — nothing was saved. Check the connection and try again." });
    }
  };

  const renderReference = (field: ExamField) => {
    const items = record.patient_reference[field.id] ?? [];
    if (items.length === 0) return null;
    return (
      <ul className="mb-space-xs flex flex-col gap-1" aria-label={`Patient reported, for ${field.label}`}>
        {items.map((item) => (
          <li key={item.slot_id} className="flex flex-wrap items-center gap-1 font-metadata-micro text-metadata-micro text-on-surface-variant">
            <span className="material-symbols-outlined text-[14px] leading-none" aria-hidden="true">person</span>
            Patient reported — {item.question}: <b className="text-on-surface">{item.value_label}</b>
            <ProvenanceBadge source={item.source} confidence={item.confidence} />
          </li>
        ))}
      </ul>
    );
  };

  const renderStoredMeta = (field: ExamField) => {
    const s = stored.get(field.id);
    if (!s || field.id in draft) return null;
    return (
      <div className="mt-space-xs flex flex-wrap items-center gap-1 font-metadata-micro text-metadata-micro text-on-surface-variant">
        <VaidyaChip disposition={s.disposition} />
        <span>
          {s.recorded_by} · {new Date(s.recorded_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
        </span>
        {s.original && (
          <span className="flex items-center gap-1">
            · {s.disposition === "confirmed" ? "confirms" : "overrides"} patient-reported <b className="text-on-surface">{s.original.value_label}</b>
            <ProvenanceBadge source={s.original.source} confidence={s.original.confidence} />
          </span>
        )}
      </div>
    );
  };

  const chip = (selected: boolean, suggested: boolean) =>
    `rounded-lg border px-space-sm py-1 text-left transition-colors disabled:opacity-60 ${focusRing} ${
      selected
        ? "border-primary bg-primary-container text-on-primary-container"
        : suggested
          ? "border-dashed border-primary bg-surface-container-lowest text-on-surface"
          : "border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-low"
    }`;

  const renderControl = (field: ExamField) => {
    const value = valueOf(field.id);
    const id = `f-${field.id}`;

    switch (field.type) {
      case "text":
        return (
          <textarea
            id={id}
            rows={4}
            disabled={locked}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => set(field.id, e.target.value)}
            className={`w-full rounded-lg border border-outline-variant bg-surface-container-lowest p-space-sm font-clinical-note text-clinical-note text-on-surface ${focusRing}`}
          />
        );
      case "number": {
        const dobAge = field.id === vayaAgeFieldId && record.computed.vaya.age_source === "dob" ? record.computed.vaya.age_years : null;
        return (
          <div className="flex items-center gap-space-sm">
            <input
              id={id}
              type="number"
              inputMode="decimal"
              min={field.min}
              max={field.max}
              disabled={locked}
              value={typeof value === "number" ? value : ""}
              placeholder={dobAge !== null ? String(dobAge) : undefined}
              onChange={(e) => set(field.id, e.target.value === "" ? null : Number(e.target.value))}
              className={`h-10 w-32 rounded-lg border border-outline-variant bg-surface-container-lowest px-space-sm font-clinical-data text-clinical-data text-on-surface ${focusRing}`}
            />
            {field.unit && <span className="font-clinical-data text-clinical-data text-on-surface-variant">{field.unit}</span>}
            {dobAge !== null && value === null && (
              <span className="font-metadata-micro text-metadata-micro text-on-surface-variant">From date of birth: {dobAge}</span>
            )}
          </div>
        );
      }
      case "enum":
      case "enum_multi": {
        const multi = field.type === "enum_multi";
        const selectedValues = multi ? (Array.isArray(value) ? (value as string[]) : []) : value === null ? [] : [String(value)];
        // A patient-reported pre-fill is offered dashed until the Vaidya confirms or overrides.
        const suggested = !multi ? (record.patient_reference[field.id] ?? []).find((r) => r.suggested_value)?.suggested_value : null;
        const showSuggested = suggested && value === null;
        return (
          <div role={multi ? "group" : "radiogroup"} aria-labelledby={`${id}-label`} className="flex flex-wrap gap-space-xs">
            {field.options?.map((o) => {
              const selected = selectedValues.includes(o.value);
              const isSuggested = Boolean(showSuggested && suggested === o.value);
              return (
                <button
                  key={o.value}
                  type="button"
                  disabled={locked}
                  role={multi ? "checkbox" : "radio"}
                  aria-checked={selected}
                  onClick={() => {
                    if (multi) {
                      set(field.id, selected ? selectedValues.filter((v) => v !== o.value) : [...selectedValues, o.value]);
                    } else {
                      set(field.id, selected ? null : o.value);
                    }
                  }}
                  className={chip(selected, isSuggested)}
                >
                  <span className="block font-body-strong text-body-strong">{o.label}</span>
                  <span className="block font-metadata-micro text-metadata-micro opacity-80">{o.gloss}</span>
                  {isSuggested && <span className="block font-metadata-micro text-metadata-micro text-primary">Patient reported</span>}
                </button>
              );
            })}
            {showSuggested && !locked && (
              <button
                type="button"
                onClick={() => set(field.id, suggested)}
                className={`self-center rounded-lg bg-primary px-space-sm py-1 font-body-strong text-body-strong text-on-primary ${focusRing}`}
              >
                Confirm “{optionLabel(field, suggested)}”
              </button>
            )}
          </div>
        );
      }
      case "computed": {
        const spec = field.computed;
        let text: string | null = null;
        if (spec?.kind === "bmi") {
          const bmi = previewBmi(valueOf(spec.height_field ?? ""), valueOf(spec.weight_field ?? ""));
          text = bmi === null ? null : `${bmi}${field.unit ? ` ${field.unit}` : ""}`;
        } else if (spec?.kind === "vaya_band") {
          const entered = valueOf(spec.age_field ?? "");
          const age = typeof entered === "number" ? Math.floor(entered) : record.computed.vaya.age_years;
          const band = previewVayaBand(age, field);
          const label = field.bands?.find((b) => b.value === band);
          text = band && label ? `${label.label} — ${label.gloss} (age ${age})` : null;
        }
        return (
          <div className="flex flex-col gap-1">
            <p className="font-clinical-note text-clinical-note text-on-surface" aria-live="polite">
              {text ?? <span className="text-on-surface-variant">Calculated once the inputs above are entered.</span>}
            </p>
            {field.source && <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">Cut-offs: {field.source}</p>}
          </div>
        );
      }
      case "namaste_codes":
        return (
          <DiagnosisPicker
            value={Array.isArray(value) ? (value as DiagnosisPick[]) : []}
            onChange={(next) => set(field.id, next)}
            disabled={locked}
          />
        );
    }
  };

  const vayaAgeFieldId = step.sections.flatMap((s) => s.fields).find((f) => f.computed?.kind === "vaya_band")?.computed?.age_field;

  return (
    <div className="flex flex-col gap-space-md">
      {reviewStatus !== "VERIFIED" && (
        <p className="rounded-lg border border-uncertain-container bg-uncertain-container/20 px-space-sm py-space-xs font-metadata-micro text-metadata-micro text-on-surface">
          Vocabulary <b>{reviewStatus}</b> — verify these terms and options with an Ayurveda practitioner before clinical use.
        </p>
      )}
      {locked && (
        <p className="rounded-lg border border-primary-container bg-primary-container/20 px-space-sm py-space-xs font-clinical-data text-clinical-data text-on-surface">
          This visit is signed — the case record is read-only.
        </p>
      )}

      {step.sections.map((section) => (
        <section key={section.id} aria-labelledby={`sec-${step.id}-${section.id}`} className="rounded-lg border border-outline-variant bg-surface-container-lowest">
          <div className="px-space-sm py-space-xs border-b border-outline-variant">
            <h2 id={`sec-${step.id}-${section.id}`} className="font-body-strong text-body-strong text-on-surface">{section.label}</h2>
            <p className="font-metadata-micro text-metadata-micro text-on-surface-variant">{section.gloss}</p>
          </div>
          <div className="flex flex-col gap-space-md p-space-sm">
            {section.link_to_step && (
              <a
                href={`/visit/${visitId}/ayurveda/${section.link_to_step}`}
                className="font-clinical-data text-clinical-data text-primary underline"
              >
                Open {section.label} — patient-reported history (recorded at intake, not re-entered here)
              </a>
            )}
            {section.show_prakriti_score && record.prashna.prakriti_score && (
              <PrakritiScorePanel score={record.prashna.prakriti_score} compact />
            )}
            {section.fields.map((field) => (
              <div key={field.id}>
                <label id={`f-${field.id}-label`} htmlFor={`f-${field.id}`} className="block">
                  <span className="font-body-strong text-body-strong text-on-surface">{field.label}</span>
                  <span className="block font-metadata-micro text-metadata-micro text-on-surface-variant">{field.gloss}</span>
                </label>
                <div className="mt-space-xs">
                  {renderReference(field)}
                  {renderControl(field)}
                  {renderStoredMeta(field)}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {!locked && (
        <div className="sticky bottom-0 -mx-space-xs flex items-center gap-space-sm border-t border-outline-variant bg-surface px-space-xs py-space-sm">
          <button
            type="button"
            onClick={save}
            disabled={dirty === 0 || state.kind === "saving"}
            className={`h-10 rounded-lg bg-primary px-space-lg font-body-strong text-body-strong text-on-primary disabled:opacity-50 ${focusRing}`}
          >
            {state.kind === "saving" ? "Saving…" : `Save ${step.label}`}
          </button>
          <span className="font-clinical-data text-clinical-data text-on-surface-variant" aria-live="polite">
            {dirty > 0 ? `${dirty} unsaved change${dirty === 1 ? "" : "s"}` : state.kind === "saved" ? state.message : "No unsaved changes"}
          </span>
          {state.kind === "error" && (
            <span role="alert" className="font-clinical-data text-clinical-data text-error">{state.message}</span>
          )}
        </div>
      )}
    </div>
  );
}
