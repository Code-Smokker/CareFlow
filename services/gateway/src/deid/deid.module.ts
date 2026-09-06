import { Global, Module } from "@nestjs/common";
import { DeidController } from "./deid.controller";
import { DeidService } from "./deid.service";

@Global()
@Module({
  controllers: [DeidController],
  providers: [DeidService],
  exports: [DeidService],
})
export class DeidModule {}
