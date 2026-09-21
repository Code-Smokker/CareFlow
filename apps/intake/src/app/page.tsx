"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { BigButton, SpeakerButton } from "@careflow/ui/patient";
import { startSession } from "@/lib/api";
import { useQrScanner } from "@/lib/useQrScanner";

/** ADR 0002: CareFlow is a session, not a kiosk — this screen is what makes that visible rather
 * than rhetorical. A patient's own phone skips it entirely (scanning the token slip's QR with
 * the phone's own camera app opens /s/{id}?token=... directly, landing on SessionPage below).
 * This in-page scanner exists for the case ADR 0002 actually calls out: a *shared* device
 * (kiosk, volunteer's tablet, registration desk) that needs to attach to whichever patient is
 * in front of it right now, one token slip at a time — design/patient-ui's CheckInScreen,
 * adopted per the product decision, with its fake 6-digit-code modal dropped (no gateway
 * endpoint resolves a short code to a session; inventing one here would mean a component
 * shape that outruns the contract, which CLAUDE.md rules out — see docs/16). */
export default function RootPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [startingFresh, setStartingFresh] = useState(false);

  const handleDecode = useCallback(
    (text: string) => {
      try {
        const url = new URL(text, window.location.origin);
        if (url.origin !== window.location.origin) throw new Error("not our origin");
        router.push(url.pathname + url.search);
      } catch {
        setError("That QR code isn't a CareFlow token slip.");
      }
    },
    [router],
  );

  const scanner = useQrScanner(handleDecode);

  const handleFresh = async () => {
    setStartingFresh(true);
    setError(null);
    try {
      // Staff configure a desk or kiosk with /?dept=ayurveda; a patient's own phone never sets it.
      const department = new URLSearchParams(window.location.search).get("dept") ?? undefined;
      const session = await startSession(department);
      router.replace(`/s/${session.session_id}?token=${encodeURIComponent(session.resume_token)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStartingFresh(false);
    }
  };

  const speak = () => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.speak(
      new SpeechSynthesisUtterance("Scan the QR code on your token slip to begin, or start a new visit."),
    );
  };

  return (
    <div className="flex min-h-dvh flex-col gap-cf-4 bg-paper p-cf-4">
      <div className="flex items-center gap-cf-3">
        <SpeakerButton onPlay={speak} />
        <h1 className="font-question text-question font-bold text-ink">Your care journey starts here</h1>
      </div>
      <p className="font-question text-support text-muted">Scan the QR code on your token slip to begin.</p>

      {scanner.supported ? (
        <div className="relative overflow-hidden rounded-2xl border-2 border-line-strong bg-ink">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video ref={scanner.videoRef} className="aspect-square w-full object-cover" muted playsInline />
          {!scanner.scanning && (
            <div className="absolute inset-0 flex items-center justify-center">
              <BigButton label="Start scan" icon="qr_code_scanner" onClick={scanner.start} />
            </div>
          )}
        </div>
      ) : (
        <p className="rounded-xl bg-uncertain-soft p-cf-3 font-question text-support font-bold text-uncertain">
          This device can&apos;t scan QR codes in-page — ask reception for help, or start a new visit below.
        </p>
      )}

      {(error || scanner.error) && (
        <p className="rounded-xl bg-critical-soft p-cf-3 font-question text-support font-bold text-critical">
          {error ?? scanner.error}
        </p>
      )}

      <div className="mt-auto flex flex-col gap-cf-2">
        <div className="flex items-center gap-cf-2">
          <div className="h-px flex-1 bg-line" />
          <span className="font-question text-support font-bold text-faint">OR</span>
          <div className="h-px flex-1 bg-line" />
        </div>
        <BigButton
          label="Start a new visit"
          icon="add_circle"
          variant="secondary"
          onClick={handleFresh}
          disabled={startingFresh}
        />
      </div>
    </div>
  );
}
