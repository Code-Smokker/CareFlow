import { Controller, Get, Param } from "@nestjs/common";
import { DeidService } from "./deid.service";

/** docs/09-security-dpdp.md: "keep a debug view that shows the before and after. It demos in
 * five seconds." Internal-only, same convention as documents.controller.ts's
 * /internal/documents/callback — this is demo/ops scaffolding, not a patient- or
 * physician-facing endpoint, and carries no clinical record of its own (DeidService's ring
 * buffer is in-memory and capped). */
@Controller("internal/deid")
export class DeidController {
  constructor(private readonly deid: DeidService) {}

  @Get("debug/:sessionId")
  getDebugLog(@Param("sessionId") sessionId: string) {
    return { session_id: sessionId, entries: this.deid.getDebugLog(sessionId) };
  }
}
