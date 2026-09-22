import { randomUUID } from "node:crypto";
import { Injectable } from "@nestjs/common";
import { AiServiceClient, AiServiceUnavailable } from "../ai/ai-service.client";
import { AppException } from "../common/app-exception";
import { sessionLogger } from "../common/logger";
import { PrismaService } from "../prisma/prisma.service";
import { AudioService, audioExtFor, baseMime } from "./audio.service";

export const MAX_AUDIO_BYTES = 10 * 1024 * 1024;

@Injectable()
export class VoiceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ai: AiServiceClient,
    private readonly audio: AudioService,
  ) {}

  /**
   * One spoken answer → a transcript. With a live `voice_note_share` consent the clip is stored FIRST
   * (so it is linked to the answer that follows); without it the bytes are used for transcription and
   * dropped — never written anywhere. If transcription fails, anything stored is deleted: audio that
   * produced no answer is not kept.
   */
  async transcribe(sessionId: string, file: { buffer: Buffer; mimetype: string; size: number }, language?: string) {
    const session = await this.prisma.intakeSession.findUnique({ where: { id: sessionId }, include: { visit: { select: { id: true } } } });
    if (!session) throw new AppException(404, "session_not_found", `No session with id '${sessionId}'.`);
    if (session.status === "completed" || session.status === "withdrawn") {
      throw new AppException(409, "session_closed", "This session is no longer accepting answers.");
    }
    if (file.size > MAX_AUDIO_BYTES) throw new AppException(413, "audio_too_large", "That recording is too long. Try a shorter answer.");
    if (!audioExtFor(file.mimetype)) throw new AppException(415, "unsupported_audio", "This device's recording format isn't supported. You can tap your answer instead.");

    const voiceId = randomUUID();
    const log = sessionLogger(sessionId);
    let stored = false;
    let uri: string | null = null;
    if (await this.audio.hasConsent(sessionId)) {
      try {
        uri = await this.audio.store(session.visit.id, voiceId, file.buffer, file.mimetype);
        stored = true;
      } catch (err) {
        // Storage down is not a reason to lose the patient's answer: transcribe anyway, keep nothing.
        log.warn({ error: String(err) }, "voice note could not be stored — transcribing without keeping it");
      }
    }

    try {
      const result = await this.ai.transcribe(sessionId, file.buffer, language ?? session.language ?? "hi");
      return { voice_id: voiceId, stored, text: result.text, confidence: result.confidence };
    } catch (err) {
      if (uri) await this.audio.deleteUri(uri).catch(() => undefined);
      if (err instanceof AiServiceUnavailable) {
        throw new AppException(503, "asr_unavailable", "We couldn't hear that clearly. You can tap your answer instead.");
      }
      throw err;
    }
  }
}

export { baseMime };
