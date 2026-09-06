import { Body, Controller, HttpCode, Param, Post } from "@nestjs/common";
import { VisitsService } from "../visits/visits.service";
import { ZodValidationPipe } from "../common/zod-validation.pipe";
import { type AcknowledgeRedFlagDto, AcknowledgeRedFlagSchema } from "./dto/acknowledge.dto";

@Controller("redflags")
export class RedFlagsController {
  constructor(private readonly visits: VisitsService) {}

  @Post(":id/acknowledge")
  @HttpCode(200)
  acknowledge(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(AcknowledgeRedFlagSchema)) body: AcknowledgeRedFlagDto,
  ) {
    return this.visits.acknowledge(id, body.actor_id, body.actor_role);
  }
}
