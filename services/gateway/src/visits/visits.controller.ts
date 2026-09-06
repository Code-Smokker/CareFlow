import { Body, Controller, Get, Header, HttpCode, Param, Patch, Post, Query } from "@nestjs/common";
import { ZodValidationPipe } from "../common/zod-validation.pipe";
import { type EditSummaryFieldDto, EditSummaryFieldSchema, type SignVisitDto, SignVisitSchema } from "./dto/visit.dto";
import { VisitsService } from "./visits.service";

@Controller("visits")
export class VisitsController {
  constructor(private readonly visits: VisitsService) {}

  // Declared before :id/summary — a literal segment must be matched before a param route in
  // the same position, though "queue" vs ":id/summary" don't actually collide (different
  // segment counts). Defensive convention regardless.
  @Get("queue")
  getQueue(@Query("department") department?: string) {
    return this.visits.getQueue(department);
  }

  @Get(":id/summary")
  getSummary(@Param("id") id: string) {
    return this.visits.getSummary(id);
  }

  @Patch(":id/summary")
  editSummary(@Param("id") id: string, @Body(new ZodValidationPipe(EditSummaryFieldSchema)) body: EditSummaryFieldDto) {
    return this.visits.editSummaryField(id, body.field_path, body.value);
  }

  @Get(":id/printable-summary")
  @Header("Content-Type", "text/html")
  getPrintableSummary(@Param("id") id: string) {
    return this.visits.getPrintableSummary(id);
  }

  @Post(":id/sign")
  @HttpCode(200)
  sign(@Param("id") id: string, @Body(new ZodValidationPipe(SignVisitSchema)) body: SignVisitDto) {
    return this.visits.sign(id, body.signed_by);
  }
}
