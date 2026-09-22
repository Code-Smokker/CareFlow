import { Module } from "@nestjs/common";
import { AyurvedaModule } from "../ayurveda/ayurveda.module";
import { VoiceModule } from "../voice/voice.module";
import { VisitsController } from "./visits.controller";
import { VisitsService } from "./visits.service";

@Module({
  imports: [AyurvedaModule, VoiceModule],
  controllers: [VisitsController],
  providers: [VisitsService],
  exports: [VisitsService],
})
export class VisitsModule {}
