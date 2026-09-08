"use client";

import { useRef, useState } from "react";
import { BigButton, SpeakerButton } from "@careflow/ui/patient";
import { uploadDocument } from "@/lib/api";

export function DocumentsScreen({ sessionId, onDone }: { sessionId: string; onDone: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploaded, setUploaded] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const result = await uploadDocument(sessionId, file);
      setUploaded((u) => [...u, result.document_id]);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col gap-cf-4 bg-paper p-cf-4">
      <div className="flex items-center gap-cf-3">
        <SpeakerButton onPlay={() => {}} />
        <h1 className="font-question text-question font-bold text-ink">Old reports or prescriptions?</h1>
      </div>
      <p className="font-question text-support text-muted">
        If you brought any old prescriptions or reports, take a photo of them now.
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      <BigButton
        label={uploading ? "Reading your document…" : "Take a photo"}
        icon="photo_camera"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      />

      {uploaded.length > 0 && (
        <p className="text-center font-question text-support font-bold text-good">
          {uploaded.length} document{uploaded.length > 1 ? "s" : ""} added
        </p>
      )}

      <BigButton label={uploaded.length > 0 ? "Done" : "I don't have any"} icon="check" variant="secondary" onClick={onDone} />
    </div>
  );
}
