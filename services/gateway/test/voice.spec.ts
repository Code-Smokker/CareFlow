import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { AiServiceUnavailable } from "../src/ai/ai-service.client";
import { validateEnv } from "../src/common/env";
import { S3StorageClient } from "../src/common/s3.client";
import { OntologyService } from "../src/ontology/ontology.service";
import { PrismaService } from "../src/prisma/prisma.service";
import { SessionsService } from "../src/sessions/sessions.service";
import { AudioService } from "../src/voice/audio.service";
import { VoiceService } from "../src/voice/voice.service";

const KEY = Buffer.alloc(32, 9).toString("base64");
/** A ConfigService over the real environment (.env → Supabase Storage), plus the test encryption key. */
const env = validateEnv({ ...process.env, FIELD_ENCRYPTION_KEY: KEY }); // the SAME validation + defaults the app boots with
const config = { get: (k: keyof typeof env) => env[k] } as never;
const CLIP = Buffer.from("\x1aE\xdf\xa3 not-really-webm-but-bytes ");

/** Real Postgres + real Supabase Storage. The audit rows this creates cannot be deleted (append-only trigger). */
describe("consent-gated voice notes — real Postgres + real object storage", () => {
  let prisma: PrismaService;
  let s3: S3StorageClient;
  let audio: AudioService;
  let voice: VoiceService;
  let sessions: SessionsService;
  let asrOk = true;
  const visitIds: string[] = [];

  beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.$connect();
    s3 = new S3StorageClient(config);
    await s3.onModuleInit(); // creates the two buckets on MinIO, exactly as the app does at boot
    audio = new AudioService(prisma, s3);
    const ai = { transcribe: async () => { if (!asrOk) throw new AiServiceUnavailable("down"); return { text: "मुझे दो दिन से बुखार है", confidence: 0.93 }; }, evaluateFlags: async () => { throw new AiServiceUnavailable("local fallback"); } } as never;
    voice = new VoiceService(prisma, ai, audio);
    const ontology = new OntologyService();
    ontology.onModuleInit();
    const events = { emitToSession: () => undefined, emitToDepartment: () => undefined } as never;
    sessions = new SessionsService(prisma, ontology, events, ai, { applyRedFlagsToQueue: async () => undefined, broadcastQueue: async () => undefined } as never, {} as never, config, audio);
  });

  afterAll(async () => {
    for (const v of visitIds) for (const k of await s3.list("audio", `${v}/`)) await s3.deleteObject(`s3://${s3.bucketName("audio")}/${k}`);
    await prisma.answer.deleteMany({ where: { session: { visitId: { in: visitIds } } } });
    await prisma.consent.deleteMany({ where: { session: { visitId: { in: visitIds } } } });
    const found = await prisma.visit.findMany({ where: { id: { in: visitIds } }, select: { patientId: true } });
    await prisma.intakeSession.deleteMany({ where: { visitId: { in: visitIds } } });
    await prisma.visit.deleteMany({ where: { id: { in: visitIds } } });
    await prisma.patient.deleteMany({ where: { id: { in: found.map((v) => v.patientId) } } });
    await prisma.$disconnect();
  });

  async function newSession(scopes: string[]) {
    const r = await sessions.create("http://intake.test", "general");
    visitIds.push(r.visit_id);
    if (scopes.length) await prisma.consent.create({ data: { patientId: (await prisma.visit.findUniqueOrThrow({ where: { id: r.visit_id } })).patientId, sessionId: r.session_id, scopes } });
    return r;
  }
  const clip = { buffer: CLIP, mimetype: "audio/webm;codecs=opus", size: CLIP.length };
  const answerWithVoice = async (s: { session_id: string }, voiceId: string, extra: Record<string, unknown> = {}) => {
    await sessions.submitAnswer(s.session_id, randomUUID(), { slot_id: "chief_complaint", value: "fever", input_mode: "voice", confidence: 0.9, voice_id: voiceId, ...extra } as never);
    return prisma.answer.findFirstOrThrow({ where: { sessionId: s.session_id, slotId: "chief_complaint" } });
  };

  it("WITHOUT consent: transcribes, returns stored=false, and writes nothing to storage", async () => {
    const s = await newSession(["history", "audio_recording"]); // note: no voice_note_share
    const r = await voice.transcribe(s.session_id, clip, "hi");
    expect(r).toMatchObject({ stored: false, text: "मुझे दो दिन से बुखार है", confidence: 0.93 });
    expect(await s3.list("audio", `${s.visit_id}/`)).toEqual([]);
    const a = await answerWithVoice(s, r.voice_id);
    expect(a.audioUri).toBeNull();
  });

  it("WITH consent: stores the clip at intake-audio/<visit>/<voice_id>.webm BEFORE transcribing and links it to the answer", async () => {
    const s = await newSession(["history", "voice_note_share"]);
    const r = await voice.transcribe(s.session_id, clip, "hi");
    expect(r.stored).toBe(true);
    expect(await s3.list("audio", `${s.visit_id}/`)).toEqual([`${s.visit_id}/${r.voice_id}.webm`]);
    const a = await answerWithVoice(s, r.voice_id);
    expect(a.id).toBe(r.voice_id); // the answer IS the voice id: <visit>/<answer_id>.webm
    expect(a.audioUri).toBe(`s3://${s3.bucketName("audio")}/${s.visit_id}/${r.voice_id}.webm`);
    expect(await audio.listVoiceNotes(s.visit_id)).toEqual([expect.objectContaining({ answer_id: a.id, slot_id: "chief_complaint" })]);
  });

  it("never trusts a client-supplied audio_uri: a doctor's link can only be signed for what the gateway stored", async () => {
    const s = await newSession(["history"]);
    const a = await answerWithVoice(s, randomUUID(), { audio_uri: "s3://intake-documents/someone-elses/prescription.jpg" });
    expect(a.audioUri).toBeNull();
  });

  it("playback: a 5-minute signed URL that serves the real bytes, and every play is audited", async () => {
    const s = await newSession(["history", "voice_note_share"]);
    const r = await voice.transcribe(s.session_id, clip, "hi");
    const a = await answerWithVoice(s, r.voice_id);

    const out = await audio.playbackUrl(a.id, "dr-voice-test", "clinician");
    expect(out.expires_in_seconds).toBe(300);
    expect(new URL(out.url).searchParams.get("X-Amz-Expires")).toBe("300");
    const fetched = await fetch(out.url);
    expect(fetched.status).toBe(200);
    expect(Buffer.from(await fetched.arrayBuffer()).equals(CLIP)).toBe(true);

    const plays = await prisma.auditLog.findMany({ where: { action: "audio.play", resourceId: a.id } });
    expect(plays).toHaveLength(1);
    expect(plays[0]).toMatchObject({ actorId: "dr-voice-test", actorRole: "clinician" });
  });

  it("REVOKING consent deletes the audio immediately, audits it, and playback then returns 410", async () => {
    const s = await newSession(["history", "voice_note_share"]);
    const r = await voice.transcribe(s.session_id, clip, "hi");
    const a = await answerWithVoice(s, r.voice_id);
    expect(await s3.list("audio", `${s.visit_id}/`)).toHaveLength(1);

    await sessions.revokeConsent(s.session_id, ["voice_note_share"]);

    expect(await s3.list("audio", `${s.visit_id}/`)).toEqual([]);
    expect((await prisma.answer.findUniqueOrThrow({ where: { id: a.id } })).audioUri).toBeNull();
    const del = await prisma.auditLog.findMany({ where: { action: "audio.delete", resourceId: a.id } });
    expect(del).toHaveLength(1);
    expect(del[0].reason).toMatch(/consent revoked/);
    await expect(audio.playbackUrl(a.id, "dr", "clinician")).rejects.toMatchObject({ errorCode: "audio_gone" });
  });

  it("signing (deleteForVisit) and the patient withdrawing (purge) each delete the audio and audit it", async () => {
    const a1 = await newSession(["voice_note_share"]);
    const r1 = await voice.transcribe(a1.session_id, clip, "hi");
    const ans1 = await answerWithVoice(a1, r1.voice_id);
    expect(await audio.deleteForVisit(a1.visit_id, "visit signed", "dr-sign", "clinician")).toBe(1);
    expect(await s3.list("audio", `${a1.visit_id}/`)).toEqual([]);
    expect((await prisma.auditLog.findFirstOrThrow({ where: { action: "audio.delete", resourceId: ans1.id } })).actorId).toBe("dr-sign");

    const a2 = await newSession(["voice_note_share"]);
    const r2 = await voice.transcribe(a2.session_id, clip, "hi");
    await answerWithVoice(a2, r2.voice_id);
    await sessions.purge(a2.session_id);
    expect(await s3.list("audio", `${a2.visit_id}/`)).toEqual([]);
  });

  it("if no provider can transcribe, the stored clip is deleted (audio that produced no answer is not kept) and the message is kind", async () => {
    const s = await newSession(["voice_note_share"]);
    asrOk = false;
    await expect(voice.transcribe(s.session_id, clip, "hi")).rejects.toMatchObject({ errorCode: "asr_unavailable" });
    asrOk = true;
    expect(await s3.list("audio", `${s.visit_id}/`)).toEqual([]);
  });

  it("rejects an oversize or unsupported recording before storing anything", async () => {
    const s = await newSession(["voice_note_share"]);
    await expect(voice.transcribe(s.session_id, { ...clip, mimetype: "audio/mpeg" }, "hi")).rejects.toMatchObject({ errorCode: "unsupported_audio" });
    await expect(voice.transcribe(s.session_id, { ...clip, size: 11 * 1024 * 1024 }, "hi")).rejects.toMatchObject({ errorCode: "audio_too_large" });
    expect(await s3.list("audio", `${s.visit_id}/`)).toEqual([]);
  });
});
