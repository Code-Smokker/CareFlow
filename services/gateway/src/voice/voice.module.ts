import { Module } from "@nestjs/common";
import { AudioService } from "./audio.service";
import { VoiceController } from "./voice.controller";
import { VoiceService } from "./voice.service";

@Module({
  controllers: [VoiceController],
  providers: [AudioService, VoiceService],
  exports: [AudioService],
})
export class VoiceModule {}
