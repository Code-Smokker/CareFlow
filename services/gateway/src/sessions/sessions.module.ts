import { Module } from "@nestjs/common";
import { VisitsModule } from "../visits/visits.module";
import { SessionsController } from "./sessions.controller";
import { SessionsService } from "./sessions.service";

@Module({
  imports: [VisitsModule],
  controllers: [SessionsController],
  providers: [SessionsService],
})
export class SessionsModule {}
