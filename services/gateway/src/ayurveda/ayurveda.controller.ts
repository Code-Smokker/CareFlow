import { Body, Controller, Get, HttpCode, Param, Put } from "@nestjs/common";
import { ZodValidationPipe } from "../common/zod-validation.pipe";
import { AyurvedaService } from "./ayurveda.service";
import { type SaveAyurvedaExamDto, SaveAyurvedaExamSchema } from "./dto/ayurveda.dto";

@Controller()
export class AyurvedaController {
  constructor(private readonly ayurveda: AyurvedaService) {}

  @Get("ayurveda/vocabulary")
  getVocabulary() {
    return this.ayurveda.getVocabulary();
  }

  @Get("visits/:id/ayurveda")
  getRecord(@Param("id") id: string) {
    return this.ayurveda.getRecord(id);
  }

  @Put("visits/:id/ayurveda")
  @HttpCode(200)
  save(@Param("id") id: string, @Body(new ZodValidationPipe(SaveAyurvedaExamSchema)) body: SaveAyurvedaExamDto) {
    return this.ayurveda.saveExam(id, body.recorded_by, body.fields);
  }
}
