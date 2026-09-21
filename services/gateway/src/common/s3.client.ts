import { Injectable, type OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CreateBucketCommand, GetObjectCommand, HeadBucketCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import type { Env } from "./env";
import { rootLogger } from "./logger";

/** Thin wrapper over the S3-compatible MinIO instance (docker-compose's `minio` service) — just
 * enough to store an uploaded document's bytes and hand back a storage_uri for Document.storageUri. */
@Injectable()
export class S3StorageClient implements OnModuleInit {
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor(private readonly config: ConfigService<Env, true>) {
    this.bucket = this.config.get("S3_BUCKET", { infer: true });
    this.client = new S3Client({
      endpoint: this.config.get("S3_ENDPOINT", { infer: true }),
      region: "us-east-1", // MinIO ignores this, but the SDK requires a value
      credentials: {
        accessKeyId: this.config.get("S3_ACCESS_KEY", { infer: true }),
        secretAccessKey: this.config.get("S3_SECRET_KEY", { infer: true }),
      },
      forcePathStyle: true, // MinIO — path-style, not virtual-hosted-style buckets
    });
  }

  /** Bytes of an object previously stored by putObject, addressed by its `s3://bucket/key` uri. */
  async getObject(storageUri: string): Promise<{ body: Buffer; contentType: string | undefined }> {
    const prefix = `s3://${this.bucket}/`;
    if (!storageUri.startsWith(prefix)) throw new Error("storage_uri is not in this bucket");
    const out = await this.client.send(new GetObjectCommand({ Bucket: this.bucket, Key: storageUri.slice(prefix.length) }));
    return { body: Buffer.from(await out.Body!.transformToByteArray()), contentType: out.ContentType };
  }

  async onModuleInit() {
    try {
      await this.client.send(new HeadBucketCommand({ Bucket: this.bucket }));
    } catch {
      await this.client.send(new CreateBucketCommand({ Bucket: this.bucket }));
      rootLogger.info({ bucket: this.bucket }, "s3 bucket created");
    }
  }

  /** Returns a `storage_uri` of the form `s3://{bucket}/{key}`, stored on Document.storageUri
   * and passed to docai as `image_ref`. The stub OCR tier (services/docai/app/ocr/stub.py)
   * never opens this — it's what this task's skeleton actually exercises. The `local`/`hosted`
   * tiers do `open(image_ref, "rb")` and assume a filesystem path; teaching them to fetch from
   * S3 first is real, un-started follow-up work, not something this pass needs. */
  async putObject(key: string, body: Buffer, contentType: string): Promise<string> {
    await this.client.send(
      new PutObjectCommand({ Bucket: this.bucket, Key: key, Body: body, ContentType: contentType }),
    );
    return `s3://${this.bucket}/${key}`;
  }
}
