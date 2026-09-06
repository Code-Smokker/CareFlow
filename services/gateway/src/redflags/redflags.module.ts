import { Module } from "@nestjs/common";
import { VisitsModule } from "../visits/visits.module";
import { RedFlagsController } from "./redflags.controller";

@Module({
  imports: [VisitsModule],
  controllers: [RedFlagsController],
})
export class RedFlagsModule {}
