import { Module } from "@nestjs/common";
import { AyurvedaModule } from "../ayurveda/ayurveda.module";
import { VisitsController } from "./visits.controller";
import { VisitsService } from "./visits.service";

@Module({
  imports: [AyurvedaModule],
  controllers: [VisitsController],
  providers: [VisitsService],
  exports: [VisitsService],
})
export class VisitsModule {}
