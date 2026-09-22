import { Global, Module } from "@nestjs/common";
import { DictionaryController } from "./dictionary.controller";
import { DocAiServiceClient } from "./docai-service.client";

@Global()
@Module({
  controllers: [DictionaryController],
  providers: [DocAiServiceClient],
  exports: [DocAiServiceClient],
})
export class DocAiModule {}
