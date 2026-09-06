import { Global, Module } from "@nestjs/common";
import { HisAdapterService } from "./his-adapter.service";

@Global()
@Module({
  providers: [HisAdapterService],
  exports: [HisAdapterService],
})
export class HisModule {}
