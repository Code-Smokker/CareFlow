import { Global, Module } from "@nestjs/common";
import { DocAiServiceClient } from "./docai-service.client";

@Global()
@Module({
  providers: [DocAiServiceClient],
  exports: [DocAiServiceClient],
})
export class DocAiModule {}
