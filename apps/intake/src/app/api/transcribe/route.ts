import { mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

/**
 * services/ai's /transcribe takes `audio_ref` as a local filesystem path — "MinIO/S3 fetch
 * isn't wired into this service yet" (services/ai/app/routers/transcribe.py). There is no
 * upload-audio-to-object-storage endpoint anywhere in the contracts to build against instead.
 * This relay uses the mechanism that already exists rather than inventing one: both this
 * Next.js server and the ai service run as local processes on the same machine in dev/demo, so
 * writing the recorded clip to a shared temp path and passing that path as audio_ref genuinely
 * works today. It would not survive a real multi-host deployment — that needs the ai service's
 * own S3 wiring, which is out of scope here (docs/19-frontend-status.md-style disclosure, not a
 * silent assumption).
 */
export async function POST(req: Request) {
  const form = await req.formData();
  const audio = form.get("audio") as File | null;
  const language = (form.get("language") as string | null) ?? "hi";
  if (!audio) {
    return Response.json({ error: { code: "missing_audio", message: "audio is required" } }, { status: 400 });
  }

  const dir = path.join(tmpdir(), "careflow-intake-audio");
  await mkdir(dir, { recursive: true });
  const filePath = path.join(dir, `${Date.now()}-${Math.random().toString(36).slice(2)}.webm`);
  await writeFile(filePath, Buffer.from(await audio.arrayBuffer()));

  const aiServiceUrl = process.env.AI_SERVICE_URL ?? "http://localhost:8001";
  const res = await fetch(`${aiServiceUrl}/transcribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ audio_ref: filePath, language, streaming: false }),
  });
  const body = await res.json();
  return Response.json(body, { status: res.status });
}
