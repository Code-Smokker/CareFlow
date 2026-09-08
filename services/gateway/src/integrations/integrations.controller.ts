import { Controller, Get, Query } from "@nestjs/common";
import { IntegrationsService } from "./integrations.service";

@Controller("integration-events")
export class IntegrationsController {
  constructor(private readonly integrations: IntegrationsService) {}

  @Get()
  list(
    @Query("limit") limit?: string,
    @Query("cursor") cursor?: string,
    @Query("outcome") outcome?: "success" | "failure",
    @Query("capability") capability?: string,
  ) {
    const parsedLimit = limit ? Math.min(Math.max(parseInt(limit, 10) || 50, 1), 200) : 50;
    return this.integrations.list({ limit: parsedLimit, cursor, outcome, capability });
  }
}
