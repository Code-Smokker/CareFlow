"use client";

import { useState } from "react";
import { BigButton } from "@careflow/ui/patient";

const COPY = {
  hi: {
    open: "मेरी सहमति वापस लें",
    title: "क्या आप रुकना और अपनी जानकारी मिटाना चाहते हैं?",
    body: "आपने जो बताया है वह हटा दिया जाएगा और डॉक्टर उसे नहीं देखेंगे।",
    yes: "हाँ, मिटा दें",
    no: "नहीं, जारी रखें",
    busy: "मिटाया जा रहा है…",
  },
  en: {
    open: "Withdraw my consent",
    title: "Stop and delete what I've shared?",
    body: "Everything you told us will be removed and your doctor will not see it.",
    yes: "Yes, delete it",
    no: "No, continue",
    busy: "Deleting…",
  },
} as const;

/** Reachable from every screen after consent (beat 2): it stops the session, runs the gateway's wipe (which also
 * deletes any voice note kept for the doctor) and writes to the audit log. Two steps, so a stray tap can't do it. */
export function WithdrawBar({ language, onConfirm }: { language: string; onConfirm: () => Promise<void> }) {
  const t = language === "hi" ? COPY.hi : COPY.en;
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-30 flex justify-center bg-gradient-to-t from-paper via-paper to-transparent px-cf-3 pb-cf-2 pt-cf-4">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="min-h-touch rounded-2xl px-cf-4 font-question text-support font-bold text-muted underline decoration-2 underline-offset-4"
        >
          {t.open}
        </button>
      </div>

      {open && (
        <div role="dialog" aria-modal="true" aria-labelledby="withdraw-title" lang={language} className="fixed inset-0 z-40 flex items-end justify-center bg-ink/60 p-cf-3 sm:items-center">
          <div className="flex w-full max-w-md flex-col gap-cf-3 rounded-3xl bg-paper p-cf-4">
            <h2 id="withdraw-title" className="font-question text-answer font-bold text-ink">{t.title}</h2>
            <p className="font-question text-support text-muted">{t.body}</p>
            {failed && <p role="alert" className="font-question text-support font-bold text-uncertain">Please try once more, or ask the desk.</p>}
            <BigButton
              label={busy ? t.busy : t.yes}
              icon="delete"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                setFailed(false);
                try {
                  await onConfirm();
                } catch {
                  setFailed(true);
                  setBusy(false);
                }
              }}
            />
            <BigButton label={t.no} icon="arrow_back" variant="secondary" disabled={busy} onClick={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
