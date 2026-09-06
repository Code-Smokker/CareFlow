import { Global, Module } from "@nestjs/common";
import { TerminologyServiceClient } from "./terminology-service.client";

@Global()
@Module({
  providers: [TerminologyServiceClient],
  exports: [TerminologyServiceClient],
})
export class TerminologyModule {}
