"use client";

import { useCallback, useRef, useState } from "react";

export interface VoiceCaptureResult {
  transcript: string;
  transcriptConfidence: number;
  value: unknown;
  confidence: number;
  needsClarification: boolean;
}

/** Records via MediaRecorder, then relays through this app's own /api/transcribe and
 * /api/fill-slot (see those routes' docstrings for why — no direct browser path to the ai
 * service exists). Three failed attempts and the caller should fall back to tap-only
 * (docs/10 "no dead ends") — this hook counts attempts but leaves that decision to the caller. */
export function useVoiceCapture(language: string) {
  const [listening, setListening] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const start = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
    chunksRef.current = [];
    recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
    recorder.start();
    mediaRecorderRef.current = recorder;
    setListening(true);
  }, []);

  const stopAndProcess = useCallback(
    async (slotSchema: unknown, utteranceContext: Record<string, unknown>): Promise<VoiceCaptureResult | null> => {
      const recorder = mediaRecorderRef.current;
      if (!recorder) return null;

      const blob = await new Promise<Blob>((resolve) => {
        recorder.onstop = () => resolve(new Blob(chunksRef.current, { type: "audio/webm" }));
        recorder.stop();
        recorder.stream.getTracks().forEach((t) => t.stop());
      });
      setListening(false);
      setAttempts((a) => a + 1);

      const form = new FormData();
      form.append("audio", blob, "clip.webm");
      form.append("language", language);
      const transcribeRes = await fetch("/api/transcribe", { method: "POST", body: form });
      if (!transcribeRes.ok) return null;
      const transcript: { text: string; confidence: number } = await transcribeRes.json();
      if (!transcript.text) return null;

      const fillRes = await fetch("/api/fill-slot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slot_schema: slotSchema, utterance: transcript.text, context: utteranceContext }),
      });
      if (!fillRes.ok) return null;
      const filled: { value: unknown; confidence: number; needs_clarification: boolean } = await fillRes.json();

      return {
        transcript: transcript.text,
        transcriptConfidence: transcript.confidence,
        value: filled.value,
        confidence: filled.confidence,
        needsClarification: filled.needs_clarification,
      };
    },
    [language],
  );

  return { listening, attempts, start, stopAndProcess };
}
