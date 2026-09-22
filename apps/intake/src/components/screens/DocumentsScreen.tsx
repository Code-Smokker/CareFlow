"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BigButton, SpeakerButton } from "@careflow/ui/patient";
import { type DocumentFinding, getDocumentReading, uploadDocument } from "@/lib/api";

type Step = "choose" | "camera" | "review";
interface Page {
  documentId: string;
  previewUrl: string;
  status: "queued" | "processing" | "done" | "failed";
  findings: DocumentFinding[];
}

const COPY = {
  hi: {
    title: "पुरानी रिपोर्ट या पर्ची?",
    intro: "अगर आप पुरानी पर्चियाँ या रिपोर्ट लाए हैं, तो अभी उनकी फ़ोटो लें।",
    photo: "फ़ोटो लें",
    gallery: "गैलरी से चुनें",
    none: "मेरे पास कुछ नहीं है",
    done: "हो गया",
    another: "एक और पन्ना जोड़ें",
    prescription: "पर्ची",
    lab: "जाँच रिपोर्ट",
    guide: "पन्ने को इस फ़्रेम में रखें",
    shoot: "फ़ोटो खींचें",
    retake: "फिर से लें",
    use: "यह पन्ना ठीक है",
    reading: "आपका दस्तावेज़ पढ़ा जा रहा है…",
    found: "हमें मिला:",
    confirm: "डॉक्टर पुष्टि करेंगे",
    unclear: "हम इसे साफ़ नहीं पढ़ पाए — आपके डॉक्टर फ़ोटो खुद देखेंगे।",
    noCamera: "कैमरा यहाँ उपलब्ध नहीं है — कृपया गैलरी से फ़ोटो चुनें।",
  },
  en: {
    title: "Old reports or prescriptions?",
    intro: "If you brought any old prescriptions or reports, take a photo of them now.",
    photo: "Take a photo",
    gallery: "Choose from gallery",
    none: "I don't have any",
    done: "Done",
    another: "Add another page",
    prescription: "Prescription",
    lab: "Lab report",
    guide: "Keep the page inside the frame",
    shoot: "Take photo",
    retake: "Retake",
    use: "Use this page",
    reading: "Reading your document…",
    found: "We found:",
    confirm: "Doctor will confirm",
    unclear: "We couldn't read this clearly — your doctor will look at the photo themselves.",
    noCamera: "The camera isn't available here — please choose a photo from your gallery.",
  },
} as const;

/** Crops the frame under the on-screen guide out of the (object-fit: cover) video, and returns a JPEG. The guide IS
 * the crop: what the patient lined up inside it is what is kept. (jscanify/OpenCV.js was not added — it is a ~9 MB
 * CDN download, which would break the "works without internet" rule for the demo.) */
async function captureGuide(video: HTMLVideoElement, box: DOMRect, guide: { x: number; y: number; w: number; h: number }): Promise<Blob> {
  const vw = video.videoWidth;
  const vh = video.videoHeight;
  const scale = Math.max(box.width / vw, box.height / vh);
  const offX = (vw * scale - box.width) / 2;
  const offY = (vh * scale - box.height) / 2;
  const sx = (guide.x * box.width + offX) / scale;
  const sy = (guide.y * box.height + offY) / scale;
  const sw = (guide.w * box.width) / scale;
  const sh = (guide.h * box.height) / scale;
  const outW = Math.min(1600, Math.round(sw));
  const canvas = document.createElement("canvas");
  canvas.width = outW;
  canvas.height = Math.round((sh / sw) * outW);
  canvas.getContext("2d")!.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("capture failed"))), "image/jpeg", 0.9));
}

const GUIDE = { x: 0.06, y: 0.08, w: 0.88, h: 0.84 };
const READ_POLL_MS = 2000;
const READ_GIVE_UP_MS = 60_000;

/** Beat 7. Live rear camera with a page guide (file picker as the fallback — a phone over plain http has no camera API),
 * multi-page with retake, upload to the private intake-documents bucket, OCR, and "We found: …" chips. Every value read is
 * marked "Doctor will confirm" (CLAUDE.md rule 5: OCR output is never auto-accepted; handwriting cannot be told apart
 * from print reliably, so none is treated as final). Skipping is always one tap. */
export function DocumentsScreen({ sessionId, onDone, language }: { sessionId: string; onDone: () => void; language: string }) {
  const t = language === "hi" ? COPY.hi : COPY.en;
  const [step, setStep] = useState<Step>("choose");
  const [docType, setDocType] = useState<"prescription" | "lab_report">("prescription");
  const [pages, setPages] = useState<Page[]>([]);
  const [shot, setShot] = useState<{ blob: Blob; url: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraOk = typeof window !== "undefined" && window.isSecureContext && !!navigator.mediaDevices?.getUserMedia;

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);
  useEffect(() => stopCamera, [stopCamera]);

  const speak = () => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(`${t.title} ${t.intro}`);
    u.lang = language === "hi" ? "hi-IN" : "en-IN";
    window.speechSynthesis.speak(u);
  };

  const openCamera = async () => {
    setMessage(null);
    if (!cameraOk) {
      setMessage(t.noCamera);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 } }, audio: false });
      streamRef.current = stream;
      setStep("camera");
    } catch {
      setMessage(t.noCamera);
    }
  };
  useEffect(() => {
    if (step === "camera" && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      void videoRef.current.play().catch(() => undefined);
    }
  }, [step]);

  const shoot = async () => {
    const video = videoRef.current;
    const box = boxRef.current?.getBoundingClientRect();
    if (!video || !box || !video.videoWidth) return;
    const blob = await captureGuide(video, box, GUIDE);
    stopCamera();
    setShot({ blob, url: URL.createObjectURL(blob) });
    setStep("review");
  };

  const readLater = useCallback(async (documentId: string) => {
    const started = Date.now();
    while (Date.now() - started < READ_GIVE_UP_MS) {
      await new Promise((r) => setTimeout(r, READ_POLL_MS));
      try {
        const reading = await getDocumentReading(documentId);
        setPages((ps) => ps.map((p) => (p.documentId === documentId ? { ...p, status: reading.status, findings: reading.findings } : p)));
        if (reading.status === "done" || reading.status === "failed") return;
      } catch {
        return;
      }
    }
  }, []);

  const usePage = async (blob: Blob, previewUrl: string) => {
    setBusy(true);
    setMessage(null);
    try {
      const file = new File([blob], `page-${pages.length + 1}.jpg`, { type: "image/jpeg" });
      const { document_id } = await uploadDocument(sessionId, file, docType);
      setPages((ps) => [...ps, { documentId: document_id, previewUrl, status: "queued", findings: [] }]);
      setShot(null);
      setStep("choose");
      void readLater(document_id);
    } catch {
      setMessage(language === "hi" ? "फ़ोटो भेजी नहीं जा सकी। कृपया एक बार फिर कोशिश करें।" : "That photo didn't send. Please try once more.");
    } finally {
      setBusy(false);
    }
  };

  const onFile = (file: File | undefined) => file && usePage(file, URL.createObjectURL(file));

  if (step === "camera") {
    return (
      <div className="fixed inset-0 z-20 flex flex-col bg-ink">
        <div ref={boxRef} className="relative flex-1 overflow-hidden">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video ref={videoRef} className="absolute inset-0 h-full w-full object-cover" playsInline muted />
          <div
            className="pointer-events-none absolute rounded-2xl border-4 border-dashed border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]"
            style={{ left: `${GUIDE.x * 100}%`, top: `${GUIDE.y * 100}%`, width: `${GUIDE.w * 100}%`, height: `${GUIDE.h * 100}%` }}
          />
          <p className="absolute inset-x-0 top-cf-3 text-center font-question text-support font-bold text-white">{t.guide}</p>
        </div>
        <div className="flex items-center justify-center gap-cf-3 bg-ink p-cf-3">
          <BigButton label={t.shoot} icon="photo_camera" onClick={shoot} />
          <BigButton label={t.none} icon="close" variant="secondary" onClick={() => { stopCamera(); setStep("choose"); }} />
        </div>
      </div>
    );
  }

  if (step === "review" && shot) {
    return (
      <div lang={language} className="flex min-h-dvh flex-col gap-cf-3 bg-paper p-cf-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={shot.url} alt="" className="max-h-[60dvh] w-full rounded-2xl border-2 border-line-strong object-contain" />
        {message && <p role="alert" className="font-question text-support font-bold text-uncertain">{message}</p>}
        <BigButton label={busy ? t.reading : t.use} icon="check" disabled={busy} onClick={() => usePage(shot.blob, shot.url)} />
        <BigButton label={t.retake} icon="replay" variant="secondary" disabled={busy} onClick={() => { setShot(null); void openCamera(); }} />
      </div>
    );
  }

  return (
    <div lang={language} className="flex min-h-dvh flex-col gap-cf-3 bg-paper p-cf-4 pb-cf-7">
      <div className="flex items-center gap-cf-3">
        <SpeakerButton onPlay={speak} />
        <h1 className="font-question text-question font-bold text-ink">{t.title}</h1>
      </div>
      <p className="font-question text-support text-muted">{t.intro}</p>

      <div role="radiogroup" aria-label="Document type" className="flex gap-cf-2">
        {(["prescription", "lab_report"] as const).map((k) => (
          <button
            key={k}
            type="button"
            role="radio"
            aria-checked={docType === k}
            onClick={() => setDocType(k)}
            className={`min-h-touch flex-1 rounded-2xl border-2 px-cf-3 font-question text-support font-bold ${docType === k ? "border-accent bg-accent-soft text-accent-deep" : "border-line-strong bg-surface text-ink"}`}
          >
            {k === "prescription" ? t.prescription : t.lab}
          </button>
        ))}
      </div>

      <input ref={fileRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      <BigButton label={pages.length ? t.another : t.photo} icon="photo_camera" disabled={busy} onClick={openCamera} />
      <BigButton label={t.gallery} icon="photo_library" variant="secondary" disabled={busy} onClick={() => fileRef.current?.click()} />
      {message && <p role="alert" className="font-question text-support font-bold text-uncertain">{message}</p>}

      {pages.map((page, i) => (
        <section key={page.documentId} className="flex flex-col gap-cf-2 rounded-2xl border-2 border-line bg-surface p-cf-3" aria-label={`Page ${i + 1}`}>
          <div className="flex items-center gap-cf-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={page.previewUrl} alt="" className="h-16 w-16 shrink-0 rounded-xl border-2 border-line object-cover" />
            <p className="font-question text-support font-bold text-ink">
              {page.status === "done" ? (page.findings.length ? t.found : t.unclear) : page.status === "failed" ? t.unclear : t.reading}
            </p>
          </div>
          {page.status === "done" && page.findings.length > 0 && (
            <ul className="flex flex-wrap gap-cf-2">
              {page.findings.slice(0, 12).map((f, j) => (
                <li key={`${f.field}-${j}`} className="rounded-2xl border-2 border-line-strong bg-paper px-cf-3 py-cf-1">
                  <span className="block font-question text-answer font-bold text-ink">{f.value}</span>
                  <span className="block font-mono text-[11px] font-bold uppercase tracking-wide text-uncertain">{t.confirm}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      <BigButton label={pages.length > 0 ? t.done : t.none} icon="check" variant={pages.length > 0 ? "primary" : "secondary"} disabled={busy} onClick={onDone} />
    </div>
  );
}
