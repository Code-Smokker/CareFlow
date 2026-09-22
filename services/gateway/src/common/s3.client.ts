import { Injectable, type OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  CreateBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { Env } from "./env";
import { rootLogger } from "./logger";

export type BucketKind = "documents" | "audio";
export type StorageProvider = "supabase" | "minio";

/** Signed URLs handed to the doctor live this long — never longer (docs/09). */
export const SIGNED_URL_TTL_SECONDS = 300;

/**
 * S3 client for the two private buckets — `intake-documents` (prescription and report photos) and
 * `intake-audio` (patient voice notes, only with consent). Same code path for Supabase Storage
 * (S3 protocol) and local MinIO: only the endpoint, region and keys differ (rule 9: MinIO stays as the
 * offline fallback). Neither bucket is ever public; only the gateway reads or writes them, and the
 * doctor's screen receives a short-lived signed URL, never a bucket or a key.
 *
 * On Supabase the buckets are created by `make storage-setup` (which sets their size and MIME limits),
 * not here — this client only checks they exist and says so if not. On MinIO it creates them, as before.
 */
@Injectable()
export class S3StorageClient implements OnModuleInit {
  private readonly client: S3Client;
  readonly provider: StorageProvider;
  private readonly buckets: Record<BucketKind, string>;

  constructor(private readonly config: ConfigService<Env, true>) {
    const endpoint = this.config.get("S3_ENDPOINT", { infer: true });
    this.provider = this.config.get("STORAGE_PROVIDER", { infer: true }) ?? (endpoint.includes("supabase.co") ? "supabase" : "minio");
    this.buckets = {
      documents: this.config.get("S3_BUCKET_DOCUMENTS", { infer: true }),
      audio: this.config.get("S3_BUCKET_AUDIO", { infer: true }),
    };
    const get = <K extends keyof Env>(k: K) => this.config.get(k, { infer: true }) as Env[K];
    this.client = new S3Client({
      endpoint,
      region: get("S3_REGION"),
      credentials: {
        accessKeyId: get("S3_ACCESS_KEY_ID") ?? get("S3_ACCESS_KEY") ?? "careflow",
        secretAccessKey: get("S3_SECRET_ACCESS_KEY") ?? get("S3_SECRET_KEY") ?? "careflow123",
      },
      forcePathStyle: true, // Supabase and MinIO both require path-style buckets
    });
  }

  bucketName(kind: BucketKind): string {
    return this.buckets[kind];
  }

  async onModuleInit() {
    for (const name of Object.values(this.buckets)) {
      try {
        await this.client.send(new HeadBucketCommand({ Bucket: name }));
      } catch {
        if (this.provider === "minio") {
          await this.client.send(new CreateBucketCommand({ Bucket: name }));
          rootLogger.info({ bucket: name }, "s3 bucket created (minio)");
        } else {
          // Not fatal: the gateway can still serve everything that needs no storage, but an upload would fail.
          rootLogger.warn({ bucket: name, provider: this.provider }, "storage bucket not found — run `make storage-setup`");
        }
      }
    }
  }

  private uriOf(bucket: string, key: string): string {
    return `s3://${bucket}/${key}`;
  }

  /** `s3://bucket/key` → its parts. Only ever called with URIs this client minted. */
  private parse(storageUri: string): { bucket: string; key: string } {
    const m = /^s3:\/\/([^/]+)\/(.+)$/.exec(storageUri);
    if (!m) throw new Error("not an s3:// storage_uri");
    return { bucket: m[1], key: m[2] };
  }

  /** Stores bytes and returns the `storage_uri` kept on the database row (and handed to docai as
   * `image_ref`). `contentType` must be the bare MIME type (no `;codecs=` parameter): the buckets'
   * allow-lists match on it. */
  async putObject(kind: BucketKind, key: string, body: Buffer, contentType: string): Promise<string> {
    const bucket = this.buckets[kind];
    await this.client.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType.split(";")[0].trim() }));
    return this.uriOf(bucket, key);
  }

  async getObject(storageUri: string): Promise<{ body: Buffer; contentType: string | undefined }> {
    const { bucket, key } = this.parse(storageUri);
    const out = await this.client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    return { body: Buffer.from(await out.Body!.transformToByteArray()), contentType: out.ContentType };
  }

  /** A time-limited GET link for the doctor's screen. */
  async signedGetUrl(storageUri: string, ttlSeconds = SIGNED_URL_TTL_SECONDS): Promise<string> {
    const { bucket, key } = this.parse(storageUri);
    return getSignedUrl(this.client, new GetObjectCommand({ Bucket: bucket, Key: key }), { expiresIn: Math.min(ttlSeconds, SIGNED_URL_TTL_SECONDS) });
  }

  /** Idempotent: deleting a key that is already gone succeeds (S3 semantics). */
  async deleteObject(storageUri: string): Promise<void> {
    const { bucket, key } = this.parse(storageUri);
    await this.client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
  }

  async exists(storageUri: string): Promise<boolean> {
    try {
      await this.getObject(storageUri);
      return true;
    } catch {
      return false;
    }
  }

  async list(kind: BucketKind, prefix = ""): Promise<string[]> {
    const out = await this.client.send(new ListObjectsV2Command({ Bucket: this.buckets[kind], Prefix: prefix }));
    return (out.Contents ?? []).map((o) => o.Key!).filter(Boolean);
  }
}
