import { Body, Controller, Get, HttpCode, Param, Put, Query } from "@nestjs/common";
import { ZodValidationPipe } from "../common/zod-validation.pipe";
import { searchAyurvedicMedicines } from "./ayurveda-medicines";
import { AyurvedaService } from "./ayurveda.service";
import { type SaveAyurvedaExamDto, SaveAyurvedaExamSchema } from "./dto/ayurveda.dto";

@Controller()
export class AyurvedaController {
  constructor(private readonly ayurveda: AyurvedaService) {}

  @Get("ayurveda/vocabulary")
  getVocabulary() {
    return this.ayurveda.getVocabulary();
  }

  @Get("ayurveda/medicines")
  searchMedicines(@Query("q") q?: string, @Query("limit") limit?: string) {
    const lim = limit ? Math.min(50, Math.max(1, parseInt(limit, 10) || 15)) : 15;
    return {
      results: searchAyurvedicMedicines(q || "", lim),
    };
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

  @Get("visits/:id/prescription")
  getPrescription(@Param("id") id: string) {
    return this.ayurveda.getPrescription(id);
  }

  @Put("visits/:id/prescription")
  @HttpCode(200)
  savePrescription(@Param("id") id: string, @Body() body: any) {
    return this.ayurveda.savePrescription(id, body);
  }
}
