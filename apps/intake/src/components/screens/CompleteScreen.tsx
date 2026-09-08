"use client";

/** "What happens next" folded in from design/patient-ui's ScreenComplete (adopted whole per
 * product decision) — answers the one question every patient in a queue actually has, cheaply. */
export function CompleteScreen() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-cf-4 bg-accent-soft p-cf-4 text-center">
      <span className="material-symbols-outlined text-[80px] text-accent-deep" aria-hidden="true">
        task_alt
      </span>
      <h1 className="font-question text-question font-bold text-accent-deep">Thank you</h1>
      <p className="font-question text-support text-ink">
        Please wait to be called. Your doctor already has everything you told us.
      </p>
      <div className="mt-cf-3 flex w-full max-w-md flex-col gap-cf-1 rounded-2xl border-2 border-line-strong bg-surface p-cf-4 text-left">
        <h2 className="font-question text-answer font-bold text-ink">What happens next?</h2>
        <p className="font-question text-support text-muted">
          A nurse will call you when the doctor is ready. You don&apos;t need to repeat anything — it&apos;s already
          with your care team.
        </p>
      </div>
    </div>
  );
}
