import { Module } from "@nestjs/common";
import { VisitsModule } from "../visits/visits.module";
import { SessionCleanupScheduler } from "./session-cleanup.scheduler";
import { SessionsController } from "./sessions.controller";
import { SessionsService } from "./sessions.service";

@Module({
  imports: [VisitsModule],
  controllers: [SessionsController],
  providers: [SessionsService, SessionCleanupScheduler],
})
export class SessionsModule {}
