"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Wraps getUserMedia + the native BarcodeDetector API (Chrome/Android — the realistic browser
 * on a shared OPD kiosk or a patient's own phone; no bundled decoder library, no CDN dependency,
 * per docs/00's "every external dependency has a local fallback": here the fallback for an
 * unsupported browser is `supported === false`, which callers must render around, not paper
 * over with a fake success. Never triggers getUserMedia's native permission prompt until
 * `start()` is called — that dialog is why this can't be exercised by browser automation
 * (see docs/13-demo-script.md's manual voice/camera checklist). */
export function useQrScanner(onDecode: (text: string) => void) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supported = typeof window !== "undefined" && "BarcodeDetector" in window && "mediaDevices" in navigator;

  const stop = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setScanning(false);
  }, []);

  const start = useCallback(async () => {
    if (!supported) {
      setError("This device can't scan QR codes in-page.");
      return;
    }
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setScanning(true);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const detector = new (window as any).BarcodeDetector({ formats: ["qr_code"] });
      const tick = async () => {
        if (!videoRef.current || videoRef.current.readyState < 2) {
          rafRef.current = requestAnimationFrame(tick);
          return;
        }
        try {
          const codes = await detector.detect(videoRef.current);
          if (codes.length > 0 && codes[0].rawValue) {
            onDecode(codes[0].rawValue);
            stop();
            return;
          }
        } catch {
          // Transient decode errors (frame mid-transition) — keep polling.
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      setError("Couldn't open the camera — check permission, or use the option below instead.");
      setScanning(false);
    }
  }, [supported, onDecode, stop]);

  useEffect(() => stop, [stop]);

  return { videoRef, supported, scanning, error, start, stop };
}
