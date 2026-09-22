"use client";

/** A full-screen kind message: an expired token, a visit already finished on another device, consent withdrawn.
 * Never blames the patient (patient UI rule) and always says what to do next. */
export function MessageScreen({ icon, title, body, lang }: { icon: string; title: string; body: string; lang?: string }) {
  return (
    <div lang={lang} className="flex min-h-dvh flex-col items-center justify-center gap-cf-4 bg-paper p-cf-4 text-center">
      <span className="material-symbols-outlined text-[72px] text-accent-deep" aria-hidden="true">
        {icon}
      </span>
      <h1 className="font-question text-question font-bold text-ink">{title}</h1>
      <p className="max-w-md font-question text-support text-muted">{body}</p>
    </div>
  );
}
