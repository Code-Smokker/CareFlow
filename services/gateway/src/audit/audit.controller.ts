import { Controller, Get, Query } from "@nestjs/common";
import { AuditService } from "./audit.service";

@Controller("audit-log")
export class AuditController {
  constructor(private readonly audit: AuditService) {}

  @Get()
  list(
    @Query("limit") limit?: string,
    @Query("cursor") cursor?: string,
    @Query("resource") resource?: string,
    @Query("action") action?: string,
  ) {
    const parsedLimit = limit ? Math.min(Math.max(parseInt(limit, 10) || 50, 1), 200) : 50;
    return this.audit.list({ limit: parsedLimit, cursor, resource, action });
  }
}
