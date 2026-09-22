import { Module } from "@nestjs/common";
import { VisitsModule } from "../visits/visits.module";
import { VoiceModule } from "../voice/voice.module";
import { SessionCleanupScheduler } from "./session-cleanup.scheduler";
import { DepartmentsController } from "./departments.controller";
import { SessionsController } from "./sessions.controller";
import { SessionsService } from "./sessions.service";

@Module({
  imports: [VisitsModule, VoiceModule],
  controllers: [SessionsController, DepartmentsController],
  providers: [SessionsService, SessionCleanupScheduler],
})
export class SessionsModule {}
