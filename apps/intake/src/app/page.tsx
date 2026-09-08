"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { startSession } from "@/lib/api";

/** No session in the URL means this is a fresh QR scan — the token slip's QR encodes
 * /s/{session_id}?token={resume_token}, printed at registration once POST /v1/sessions runs
 * server-side. This root route stands in for that: create a session and land where scanning
 * the real QR would. Re-scanning an existing slip's QR lands directly on /s/[id] instead. */
export default function RootPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    startSession()
      .then((session) => {
        router.replace(`/s/${session.session_id}?token=${encodeURIComponent(session.resume_token)}`);
      })
      .catch((err) => setError(err instanceof Error ? err.message : String(err)));
  }, [router]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-cf-4 bg-paper p-cf-4 text-center">
      {error ? (
        <>
          <p className="font-question text-answer font-bold text-critical">Could not start — {error}</p>
          <p className="font-question text-support text-muted">Is the gateway running?</p>
        </>
      ) : (
        <p className="font-question text-question font-bold text-ink">Getting ready…</p>
      )}
    </div>
  );
}
