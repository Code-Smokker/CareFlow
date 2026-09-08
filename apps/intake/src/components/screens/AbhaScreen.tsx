"use client";

import { useState } from "react";
import { BigButton, NumberPad, SpeakerButton } from "@careflow/ui/patient";
import { identifyByAbhaQr, requestAbhaOtp, verifyAbhaOtp } from "@/lib/api";
import { useQrScanner } from "@/lib/useQrScanner";

export interface AbhaLinkResult {
  patientId: string;
  abhaAddress: string | null;
}

type Step = "choice" | "scan" | "mobile" | "otp";

/** design/patient-ui's AbhaScanScreen + AbhaOtpScreen, merged into one component the way our
 * QuestionScreen merges several input widgets into one file (docs/16). ABHA is Module D —
 * real v3 request/response shapes against the mock gateway (ADR 0006), never a blocker: every
 * step shows an equally-prominent Skip, per the product decision that a patient without an
 * ABHA ID must be able to continue. */
export function AbhaScreen({
  onLinked,
  onSkip,
}: {
  onLinked: (result: AbhaLinkResult) => void;
  onSkip: () => void;
}) {
  const [step, setStep] = useState<Step>("choice");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [txnId, setTxnId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scanner = useQrScanner(async (qrPayload) => {
    setBusy(true);
    setError(null);
    try {
      const result = await identifyByAbhaQr(qrPayload);
      onLinked({ patientId: result.patient_id, abhaAddress: result.demographics.abha_address ?? null });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  });

  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  };

  const sendOtp = async () => {
    setBusy(true);
    setError(null);
    try {
      const result = await requestAbhaOtp({ mobile });
      setTxnId(result.txn_id);
      setStep("otp");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const verify = async () => {
    if (!txnId) return;
    setBusy(true);
    setError(null);
    try {
      const result = await verifyAbhaOtp(txnId, otp);
      onLinked({ patientId: result.patient_id, abhaAddress: null });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setOtp("");
    } finally {
      setBusy(false);
    }
  };

  const SkipLink = (
    <button type="button" onClick={onSkip} className="min-h-touch font-question text-support font-bold text-muted underline">
      Skip — I don&apos;t have ABHA
    </button>
  );

  if (step === "choice") {
    return (
      <div className="flex min-h-dvh flex-col justify-center gap-cf-4 bg-paper p-cf-4">
        <div className="flex items-center gap-cf-3">
          <SpeakerButton onPlay={() => speak("Do you have an ABHA health ID? This is optional.")} />
          <h1 className="font-question text-question font-bold text-ink">Have an ABHA ID?</h1>
        </div>
        <p className="font-question text-support text-muted">
          Linking it lets your doctor see past visits. Totally optional — you can continue without one.
        </p>
        <div className="flex flex-col gap-cf-3">
          <BigButton label="Scan my ABHA QR" icon="qr_code_scanner" onClick={() => setStep("scan")} />
          <BigButton label="Verify with mobile number" icon="sms" variant="secondary" onClick={() => setStep("mobile")} />
        </div>
        <div className="mt-cf-2 text-center">{SkipLink}</div>
      </div>
    );
  }

  if (step === "scan") {
    return (
      <div className="flex min-h-dvh flex-col gap-cf-4 bg-paper p-cf-4">
        <div className="flex items-center gap-cf-3">
          <SpeakerButton onPlay={() => speak("Point the camera at your ABHA QR code.")} />
          <h1 className="font-question text-question font-bold text-ink">Scan your ABHA QR</h1>
        </div>
        {scanner.supported ? (
          <div className="relative overflow-hidden rounded-2xl border-2 border-line-strong bg-ink">
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video ref={scanner.videoRef} className="aspect-square w-full object-cover" muted playsInline />
            {!scanner.scanning && (
              <div className="absolute inset-0 flex items-center justify-center">
                <BigButton label="Start camera" icon="videocam" onClick={scanner.start} disabled={busy} />
              </div>
            )}
          </div>
        ) : (
          <p className="rounded-xl bg-uncertain-soft p-cf-3 font-question text-support font-bold text-uncertain">
            This device can&apos;t scan QR codes in-page. Try mobile verification instead, or skip.
          </p>
        )}
        {error && (
          <p className="rounded-xl bg-critical-soft p-cf-3 font-question text-support font-bold text-critical">{error}</p>
        )}
        <button
          type="button"
          onClick={() => {
            scanner.stop();
            setStep("choice");
          }}
          className="min-h-touch font-question text-support font-bold text-muted underline"
        >
          Back
        </button>
        <div className="mt-auto text-center">{SkipLink}</div>
      </div>
    );
  }

  if (step === "mobile") {
    return (
      <div className="flex min-h-dvh flex-col gap-cf-4 bg-paper p-cf-4">
        <div className="flex items-center gap-cf-3">
          <SpeakerButton onPlay={() => speak("Enter the mobile number linked to your ABHA ID.")} />
          <h1 className="font-question text-question font-bold text-ink">Your mobile number</h1>
        </div>
        <NumberPad value={mobile} onChange={setMobile} maxLength={10} placeholder="XXXXXXXXXX" />
        {error && (
          <p className="rounded-xl bg-critical-soft p-cf-3 font-question text-support font-bold text-critical">{error}</p>
        )}
        <BigButton label="Send OTP" icon="arrow_forward" onClick={sendOtp} disabled={mobile.length !== 10 || busy} />
        <button type="button" onClick={() => setStep("choice")} className="min-h-touch font-question text-support font-bold text-muted underline">
          Back
        </button>
        <div className="mt-auto text-center">{SkipLink}</div>
      </div>
    );
  }

  // step === "otp"
  return (
    <div className="flex min-h-dvh flex-col gap-cf-4 bg-paper p-cf-4">
      <div className="flex items-center gap-cf-3">
        <SpeakerButton onPlay={() => speak("Enter the code sent to your phone.")} />
        <h1 className="font-question text-question font-bold text-ink">Enter the code</h1>
      </div>
      <p className="font-question text-support text-muted">Sent to your mobile number.</p>
      <NumberPad value={otp} onChange={setOtp} maxLength={6} placeholder="XXXXXX" />
      <p className="font-mono text-[11px] text-faint">ABDM_MODE=mock — demo code is 000000.</p>
      {error && (
        <p className="rounded-xl bg-critical-soft p-cf-3 font-question text-support font-bold text-critical">{error}</p>
      )}
      <BigButton label="Verify" icon="check_circle" onClick={verify} disabled={otp.length < 6 || busy} />
      <button type="button" onClick={() => setStep("mobile")} className="min-h-touch font-question text-support font-bold text-muted underline">
        Back
      </button>
      <div className="mt-auto text-center">{SkipLink}</div>
    </div>
  );
}
