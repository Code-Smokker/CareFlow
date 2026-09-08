"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignButton({ visitId }: { visitId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<{ fhir_bundle_id: string; abdm_status: string; care_context_status: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  return (
    <div>
      <button
        type="button"
        disabled={pending}
        onClick={async () => {
          setPending(true);
          setErrorMsg(null);
          const res = await fetch(`/api/visits/${visitId}/sign`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ signed_by: "console-user" }),
          });
          const body = await res.json();
          setPending(false);
          if (!res.ok) {
            setErrorMsg(body.message ?? "Sign failed");
            return;
          }
          setResult(body);
          router.refresh();
        }}
        className="self-start px-space-lg py-space-sm rounded-lg bg-primary text-on-primary font-body-strong text-body-strong disabled:opacity-50"
      >
        {pending ? "Signing…" : "Sign this visit"}
      </button>

      {errorMsg && <p className="mt-space-sm text-error font-clinical-data">{errorMsg}</p>}

      {result && (
        <div className="mt-space-md rounded-lg border border-primary-container bg-primary-container/20 p-panel-padding">
          <p className="font-body-strong text-body-strong text-on-surface">Signed.</p>
          <p className="font-clinical-data-mono text-clinical-data-mono text-on-surface-variant">
            bundle {result.fhir_bundle_id} · ABDM {result.abdm_status} · care context {result.care_context_status}
          </p>
          <a
            href={`/fhir?bundleId=${result.fhir_bundle_id}&abdmStatus=${result.abdm_status}&careContextStatus=${encodeURIComponent(result.care_context_status)}`}
            className="mt-space-xs inline-block font-clinical-data text-primary underline"
          >
            View FHIR bundle
          </a>
        </div>
      )}
    </div>
  );
}
