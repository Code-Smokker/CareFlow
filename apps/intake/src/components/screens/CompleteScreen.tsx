"use client";

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
    </div>
  );
}
