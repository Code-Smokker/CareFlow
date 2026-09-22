"use client";

import { type AnsweredLine, lineIcon, lineLabel } from "@/lib/machine";

/** What the patient has told us so far, as big icon + label chips ("Chest pain · 2 days · Sweating"). Tap one to change
 * that answer (beat 4). The chief complaint is shown but locked: changing it would restart the questions. */
export function AnswerChips({ lines, onEdit, heading }: { lines: AnsweredLine[]; onEdit?: (slotId: string) => void; heading: string }) {
  if (lines.length === 0) return null;
  return (
    <section aria-label={heading} className="flex flex-col gap-cf-1">
      <p className="font-question text-support font-bold text-muted">{heading}</p>
      <ul className="-mx-cf-4 flex gap-cf-2 overflow-x-auto px-cf-4 pb-cf-1">
        {lines.map((line) => {
          const editable = line.editable !== false && !!line.question && !!onEdit;
          const icon = lineIcon(line);
          return (
            <li key={line.slot_id} className="shrink-0">
              <button
                type="button"
                disabled={!editable}
                onClick={() => onEdit?.(line.slot_id)}
                aria-label={`${line.question_text} ${lineLabel(line)}${editable ? ". Tap to change." : ""}`}
                className={`flex min-h-touch max-w-[220px] items-center gap-cf-2 rounded-2xl border-2 px-cf-3 ${
                  editable ? "border-line-strong bg-surface text-ink" : "border-line bg-accent-soft text-accent-deep"
                }`}
              >
                <span className="material-symbols-outlined text-[24px]" aria-hidden="true">
                  {icon ?? (editable ? "edit" : "check_circle")}
                </span>
                <span className="truncate font-question text-support font-bold">{lineLabel(line)}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
