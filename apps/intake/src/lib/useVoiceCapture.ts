"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GATEWAY_BASE } from "./gateway-client";

export interface VoiceCaptureResult {
  transcript: string;
  transcriptConfidence: number;
  value: unknown;
  confidence: number;
  needsClarification: boolean;
  /** Issued by the gateway; links the answer to a stored voice note (only exists if the patient consented). */
  voiceId: string | null;
  stored: boolean;
}

/** Stop this long after the patient last spoke. */
const SILENCE_MS = 1400;
/** Never record longer than this in one go. */
const MAX_RECORDING_MS = 20_000;
/** Give up waiting for a transcript after this — the patient is offered the tap options instead. */
const TRANSCRIBE_TIMEOUT_MS = 5_000;
/** Below this a transcript is treated as "I didn't catch that". */
const MIN_TRANSCRIPT_CONFIDENCE = 0.4;
const SPEECH_RMS = 0.035;

function pickMimeType(): string {
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"];
  return candidates.find((c) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(c)) ?? "";
}

/**
 * Records with MediaRecorder, stops itself when the patient stops talking (VAD on a WebAudio analyser), sends the clip
 * to the GATEWAY (`POST /v1/sessions/{id}/voice`) — which keeps it only if the patient ticked "Share my voice
 * recording with the doctor" — then asks the ai service to fit the transcript into the slot. The clip never
 * touches this app's disk.
 *
 * A microphone needs a secure context: https:// or localhost on the same device. Over plain http on a LAN
 * address `navigator.mediaDevices` does not exist; `supported` is false and the caller shows the tap options.
 */
export function useVoiceCapture(language: string, sessionId: string) {
  const [listening, setListening] = useState(false);
  const [levels, setLevels] = useState<number[]>([]);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [supported] = useState(() => typeof window !== "undefined" && window.isSecureContext && !!navigator.mediaDevices?.getUserMedia);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timersRef = useRef<{ raf?: number; max?: ReturnType<typeof setTimeout> }>({});
  const audioCtxRef = useRef<AudioContext | null>(null);

  const cleanup = useCallback(() => {
    if (timersRef.current.raf) cancelAnimationFrame(timersRef.current.raf);
    if (timersRef.current.max) clearTimeout(timersRef.current.max);
    timersRef.current = {};
    void audioCtxRef.current?.close().catch(() => undefined);
    audioCtxRef.current = null;
    setLevels([]);
  }, []);

  useEffect(() => cleanup, [cleanup]);

  /** `onAutoStop` fires when silence (or the time limit) ends the recording — the caller then processes it. */
  const start = useCallback(
    async (onAutoStop: () => void) => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      const mimeType = pickMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data);
      recorder.start();
      recorderRef.current = recorder;
      setTranscript(null);
      setListening(true);

      // Voice-activity detection: RMS of the mic signal, sampled every animation frame.
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      ctx.createMediaStreamSource(stream).connect(analyser);
      const buf = new Float32Array(analyser.fftSize);
      let heardSpeech = false;
      let lastVoice = performance.now();
      let lastPaint = 0;
      let fired = false;
      const tick = (now: number) => {
        analyser.getFloatTimeDomainData(buf);
        const rms = Math.sqrt(buf.reduce((s, v) => s + v * v, 0) / buf.length);
        if (rms > SPEECH_RMS) {
          heardSpeech = true;
          lastVoice = now;
        }
        if (now - lastPaint > 90) {
          lastPaint = now;
          setLevels((l) => [...l.slice(-4), Math.min(1, rms * 8)]);
        }
        if (!fired && heardSpeech && now - lastVoice > SILENCE_MS) {
          fired = true;
          onAutoStop();
          return;
        }
        timersRef.current.raf = requestAnimationFrame(tick);
      };
      timersRef.current.raf = requestAnimationFrame(tick);
      timersRef.current.max = setTimeout(() => {
        if (!fired) {
          fired = true;
          onAutoStop();
        }
      }, MAX_RECORDING_MS);
    },
    [],
  );

  const stopAndProcess = useCallback(
    async (slotSchema: unknown, utteranceContext: Record<string, unknown>): Promise<VoiceCaptureResult | null> => {
      const recorder = recorderRef.current;
      if (!recorder) return null;
      cleanup();

      const blob = await new Promise<Blob>((resolve) => {
        recorder.onstop = () => resolve(new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" }));
        if (recorder.state !== "inactive") recorder.stop();
        recorder.stream.getTracks().forEach((t) => t.stop());
      });
      recorderRef.current = null;
      setListening(false);
      setAttempts((a) => a + 1);
      if (blob.size < 800) return null; // nothing was said

      const form = new FormData();
      form.append("audio", blob, "clip");
      form.append("language", language);
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TRANSCRIBE_TIMEOUT_MS);
      let heard: { voice_id: string; stored: boolean; text: string; confidence: number };
      try {
        const res = await fetch(`${GATEWAY_BASE}/v1/sessions/${sessionId}/voice`, { method: "POST", body: form, signal: controller.signal });
        if (!res.ok) return null;
        heard = await res.json();
      } catch {
        return null; // timed out or offline — the caller says "I didn't catch that", and the tap options are right there
      } finally {
        clearTimeout(timer);
      }
      if (!heard.text || heard.confidence < MIN_TRANSCRIPT_CONFIDENCE) return null;
      setTranscript(heard.text); // shown in the patient's own script

      const fillRes = await fetch("/api/fill-slot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slot_schema: slotSchema, utterance: heard.text, context: utteranceContext }),
      }).catch(() => null);
      if (!fillRes?.ok) return null;
      const filled: { value: unknown; confidence: number; needs_clarification: boolean } = await fillRes.json();

      return {
        transcript: heard.text,
        transcriptConfidence: heard.confidence,
        value: filled.value,
        confidence: filled.confidence,
        needsClarification: filled.needs_clarification,
        voiceId: heard.voice_id,
        stored: heard.stored,
      };
    },
    [language, sessionId, cleanup],
  );

  return { listening, levels, transcript, attempts, supported, start, stopAndProcess };
}
