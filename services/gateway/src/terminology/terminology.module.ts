import { Global, Module } from "@nestjs/common";
import { TerminologyController } from "./terminology.controller";
import { TerminologyServiceClient } from "./terminology-service.client";

@Global()
@Module({
  controllers: [TerminologyController],
  providers: [TerminologyServiceClient],
  exports: [TerminologyServiceClient],
})
export class TerminologyModule {}
