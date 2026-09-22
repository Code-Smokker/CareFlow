import { Body, Controller, Get, HttpCode, Param, Post, UploadedFile, UseInterceptors, BadRequestException } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { z } from "zod";
import { ZodValidationPipe } from "../common/zod-validation.pipe";
import { AudioService } from "./audio.service";
import { MAX_AUDIO_BYTES, VoiceService } from "./voice.service";

const PlaybackSchema = z.object({ actor_id: z.string().min(1), actor_role: z.string().min(1) });

@Controller()
export class VoiceController {
  constructor(
    private readonly voice: VoiceService,
    private readonly audio: AudioService,
  ) {}

  @Post("sessions/:id/voice")
  @HttpCode(200)
  @UseInterceptors(FileInterceptor("audio", { limits: { fileSize: MAX_AUDIO_BYTES } }))
  transcribe(@Param("id") sessionId: string, @UploadedFile() file: Express.Multer.File | undefined, @Body() body: { language?: string }) {
    if (!file) throw new BadRequestException("multipart field 'audio' is required");
    return this.voice.transcribe(sessionId, file, body?.language);
  }

  @Get("visits/:id/voice-notes")
  list(@Param("id") visitId: string) {
    return this.audio.listVoiceNotes(visitId);
  }

  @Post("answers/:id/audio-playback")
  @HttpCode(200)
  play(@Param("id") answerId: string, @Body(new ZodValidationPipe(PlaybackSchema)) body: z.infer<typeof PlaybackSchema>) {
    return this.audio.playbackUrl(answerId, body.actor_id, body.actor_role);
  }
}
