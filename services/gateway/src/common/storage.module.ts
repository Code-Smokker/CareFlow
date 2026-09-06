import { Global, Module } from "@nestjs/common";
import { S3StorageClient } from "./s3.client";

@Global()
@Module({
  providers: [S3StorageClient],
  exports: [S3StorageClient],
})
export class StorageModule {}
