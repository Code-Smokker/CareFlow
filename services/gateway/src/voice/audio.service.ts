import { Injectable } from "@nestjs/common";
import { AppException } from "../common/app-exception";
import { SIGNED_URL_TTL_SECONDS, S3StorageClient } from "../common/s3.client";
import { rootLogger } from "../common/logger";
import { PrismaService } from "../prisma/prisma.service";

export const VOICE_SCOPE = "voice_note_share";

/** The audio types the `intake-audio` bucket accepts (its allow-list is enforced by Supabase too). */
const EXT_BY_MIME: Record<string, string> = {
  "audio/webm": "webm",
  "audio/ogg": "ogg",
  "audio/mp4": "mp4",
  "audio/wav": "wav",
  "audio/x-wav": "wav",
};
export const baseMime = (mime: string) => mime.split(";")[0].trim().toLowerCase();
export const audioExtFor = (mime: string): string | null => EXT_BY_MIME[baseMime(mime)] ?? null;

/**
 * A patient's spoken answers, kept ONLY with their consent (`voice_note_share`, default OFF — DPDP data
 * minimisation). Owns every rule about that audio in one place:
 *   stored   → `intake-audio/<visit_id>/<answer_id>.<ext>`, private, uploaded BEFORE transcription
 *   played   → a 5-minute signed URL; every play is written to the audit log
 *   deleted  → when the visit is signed, when consent is revoked, when the patient withdraws, or after 24 h
 *              (the Celery job in services/docai) — each deletion is written to the audit log
 * The storage key on an answer is only ever set here, from an object this service put there — never from
 * a value a client sent, so a doctor's playback link cannot be pointed at someone else's file.
 */
@Injectable()
export class AudioService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3: S3StorageClient,
  ) {}

  async hasConsent(sessionId: string): Promise<boolean> {
    return (await this.prisma.consent.count({ where: { sessionId, revokedAt: null, scopes: { has: VOICE_SCOPE } } })) > 0;
  }

  /** Puts the clip in the private bucket and returns its `s3://` uri. */
  async store(visitId: string, voiceId: string, buffer: Buffer, mime: string): Promise<string> {
    const ext = audioExtFor(mime);
    if (!ext) throw new AppException(415, "unsupported_audio", "That audio format can't be kept. Use webm, ogg, mp4 or wav.");
    return this.s3.putObject("audio", `${visitId}/${voiceId}.${ext}`, buffer, baseMime(mime));
  }

  /** The uri of a clip THIS service stored for `visitId` under `voiceId`, or null. */
  async findStored(visitId: string, voiceId: string): Promise<string | null> {
    const keys = await this.s3.list("audio", `${visitId}/${voiceId}.`);
    return keys.length > 0 ? `s3://${this.s3.bucketName("audio")}/${keys[0]}` : null;
  }

  async deleteUri(uri: string): Promise<void> {
    await this.s3.deleteObject(uri);
  }

  /** Deletes every stored clip belonging to these answers, clears the link, and writes one audit row per clip. */
  private async deleteAnswers(answers: { id: string; audioUri: string | null }[], reason: string, actorId: string, actorRole: string): Promise<number> {
    let deleted = 0;
    for (const a of answers) {
      if (!a.audioUri) continue;
      await this.s3.deleteObject(a.audioUri);
      await this.prisma.$transaction([
        this.prisma.answer.update({ where: { id: a.id }, data: { audioUri: null } }),
        this.prisma.auditLog.create({ data: { actorId, actorRole, action: "audio.delete", resource: "answer", resourceId: a.id, reason } }),
      ]);
      deleted += 1;
    }
    if (deleted > 0) rootLogger.info({ deleted, reason }, "voice notes deleted");
    return deleted;
  }

  deleteForVisit(visitId: string, reason: string, actorId = "system", actorRole = "system") {
    return this.prisma.answer
      .findMany({ where: { audioUri: { not: null }, session: { visitId } }, select: { id: true, audioUri: true } })
      .then((rows) => this.deleteAnswers(rows, reason, actorId, actorRole));
  }

  deleteForSession(sessionId: string, reason: string, actorId = "patient", actorRole = "patient") {
    return this.prisma.answer
      .findMany({ where: { audioUri: { not: null }, sessionId }, select: { id: true, audioUri: true } })
      .then((rows) => this.deleteAnswers(rows, reason, actorId, actorRole));
  }

  /** Answers whose audio is still stored AND still consented — what the doctor's screen may offer to play. */
  async listVoiceNotes(visitId: string) {
    const rows = await this.prisma.answer.findMany({
      where: { audioUri: { not: null }, session: { visitId, consents: { some: { revokedAt: null, scopes: { has: VOICE_SCOPE } } } } },
      orderBy: { answeredAt: "asc" },
      select: { id: true, slotId: true, answeredAt: true },
    });
    return rows.map((r) => ({ answer_id: r.id, slot_id: r.slotId, answered_at: r.answeredAt.toISOString() }));
  }

  /** The five-minute signed link. Refuses (410) once the audio is gone or consent was withdrawn, and
   * writes the playback to the audit log BEFORE handing the link out. */
  async playbackUrl(answerId: string, actorId: string, actorRole: string) {
    const answer = await this.prisma.answer.findUnique({ where: { id: answerId }, select: { id: true, audioUri: true, sessionId: true } });
    if (!answer) throw new AppException(404, "answer_not_found", "No such answer.");
    if (!answer.audioUri || !(await this.hasConsent(answer.sessionId))) {
      throw new AppException(410, "audio_gone", "This voice note is no longer available — it was deleted after signing, after 24 hours, or the patient withdrew consent.");
    }
    await this.prisma.auditLog.create({
      data: { actorId, actorRole, action: "audio.play", resource: "answer", resourceId: answer.id, reason: `session ${answer.sessionId}` },
    });
    return { url: await this.s3.signedGetUrl(answer.audioUri, SIGNED_URL_TTL_SECONDS), expires_in_seconds: SIGNED_URL_TTL_SECONDS };
  }
}
