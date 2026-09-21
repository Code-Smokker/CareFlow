import { Module } from "@nestjs/common";
import { AyurvedaController } from "./ayurveda.controller";
import { AyurvedaService } from "./ayurveda.service";

@Module({
  controllers: [AyurvedaController],
  providers: [AyurvedaService],
  exports: [AyurvedaService],
})
export class AyurvedaModule {}
