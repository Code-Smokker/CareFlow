import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { ZodValidationPipe } from "../common/zod-validation.pipe";
import { type EditSummaryFieldDto, EditSummaryFieldSchema, type SignVisitDto, SignVisitSchema } from "./dto/visit.dto";
import { VisitsService } from "./visits.service";

@Controller("visits")
export class VisitsController {
  constructor(private readonly visits: VisitsService) {}

  @Get(":id/summary")
  getSummary(@Param("id") id: string) {
    return this.visits.getSummary(id);
  }

  @Patch(":id/summary")
  editSummary(@Param("id") id: string, @Body(new ZodValidationPipe(EditSummaryFieldSchema)) body: EditSummaryFieldDto) {
    return this.visits.editSummaryField(id, body.field_path, body.value);
  }

  @Post(":id/sign")
  sign(@Param("id") id: string, @Body(new ZodValidationPipe(SignVisitSchema)) body: SignVisitDto) {
    return this.visits.sign(id, body.signed_by);
  }
}
