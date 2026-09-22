import { randomUUID } from "node:crypto";
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, type DocumentType } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { S3StorageClient } from "../common/s3.client";
import { DocAiServiceClient } from "../docai/docai-service.client";
import { EventsGateway } from "../websocket/events.gateway";
import type { ProcessCallbackDto, UploadDocumentBodyDto } from "./dto/document.dto";

/** docai's /classify enum (prescription | lab_report | discharge_summary | other) doesn't
 * match Document.type's Prisma enum 1:1 — a caller's doc_type_hint is free text on the wire
 * (packages/contracts/openapi/gateway.yaml), so this maps the ones that do line up and falls
 * back to `unknown` rather than guessing. */
const DOC_TYPE_HINTS: Record<string, DocumentType> = {
  prescription: "prescription",
  lab_report: "lab",
  lab: "lab",
  discharge_summary: "discharge",
  discharge: "discharge",
  imaging: "imaging",
};

/** docai's extraction pipeline field labels (app/extract/pipeline.py, C2) -> the coarse
 * ExtractionEntityType Prisma enum. Anything not clearly one of the four stays `unknown`
 * rather than guessing — the enum's own schema comment: "never mislabel its output as one
 * of the other four just to satisfy this enum." `ayurveda` is the dictionary-decided system
 * for a medication span that matched the AFI formulation or AYUSH plant dictionary (the AYUSH
 * labelling fix — pipeline.py no longer emits the old `ayush_formulation`/`ayush_plant` split
 * here); `unknown` is a medication span that matched no dictionary at all — still "medication"
 * shaped, so it still belongs in this category, just without a resolved identity yet. */
const ENTITY_TYPE_BY_FIELD: Record<string, "condition" | "medication" | "observation" | "procedure"> = {
  diagnosis: "condition",
  drug: "medication",
  dose: "medication",
  frequency: "medication",
  duration: "medication",
  ayurveda: "medication",
  unknown: "medication",
  analyte: "observation",
  value: "observation",
  unit: "observation",
  procedure: "procedure",
};

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3: S3StorageClient,
    private readonly docai: DocAiServiceClient,
    private readonly events: EventsGateway,
  ) {}

  async upload(
    sessionId: string,
    file: { buffer: Buffer; mimetype: string; originalname: string },
    body: UploadDocumentBodyDto,
  ): Promise<{ document_id: string; status: "queued" }> {
    await this.prisma.intakeSession.findUniqueOrThrow({ where: { id: sessionId } });

    const key = `${sessionId}/${randomUUID()}-${file.originalname}`;
    const storageUri = await this.s3.putObject("documents", key, file.buffer, file.mimetype);

    const docType = body.doc_type_hint ? (DOC_TYPE_HINTS[body.doc_type_hint] ?? "unknown") : "unknown";
    const document = await this.prisma.document.create({
      data: { sessionId, type: docType, storageUri, ocrStatus: "queued" },
    });

    // Fire-and-forget from this request's point of view: the result comes back over the
    // gateway callback (handleCallback below), not this response — docs/06-document-ai.md,
    // /process is long-running and async by contract.
    await this.docai.process(document.id, [storageUri]);

    return { document_id: document.id, status: "queued" };
  }

  /** Every document uploaded across all of a visit's sessions, oldest first. */
  async listForVisit(visitId: string) {
    const visit = await this.prisma.visit.findUnique({ where: { id: visitId }, select: { id: true } });
    if (!visit) throw new NotFoundException(`Visit ${visitId} not found`);
    const documents = await this.prisma.document.findMany({
      where: { session: { visitId } },
      include: { extractions: true },
      orderBy: { createdAt: "asc" },
    });
    return documents.map((d) => ({
      document_id: d.id,
      session_id: d.sessionId,
      type: d.type,
      ocr_status: d.ocrStatus,
      page_count: d.pageCount,
      quality_score: d.qualityScore,
      created_at: d.createdAt.toISOString(),
      extractions: d.extractions.map((e) => ({
        id: e.id,
        field: String((e.payload as Prisma.JsonObject).field ?? e.entityType),
        value: String((e.payload as Prisma.JsonObject).value ?? ""),
        confidence: e.confidence,
        bounding_box: e.bbox,
        entity_type: e.entityType,
        confirmed_by: e.confirmedBy,
      })),
    }));
  }

  /** A human accepts one extracted value. The extraction row and its audit row land in one
   * transaction: an acceptance with no trace, or a trace of an acceptance that rolled back, cannot exist. */
  async confirmExtraction(extractionId: string, actorId: string, actorRole: string) {
    const extraction = await this.prisma.extraction.findUnique({ where: { id: extractionId } });
    if (!extraction) throw new NotFoundException(`Extraction ${extractionId} not found`);
    if (extraction.confirmedAt) throw new ConflictException("This value was already confirmed.");
    const confirmedAt = new Date();
    await this.prisma.$transaction([
      this.prisma.extraction.update({ where: { id: extractionId }, data: { confirmedBy: actorId, confirmedAt } }),
      this.prisma.auditLog.create({
        data: { actorId, actorRole, action: "extraction.confirm", resource: "extraction", resourceId: extractionId, reason: `document ${extraction.documentId}` },
      }),
    ]);
    return { id: extractionId, confirmed_by: actorId, confirmed_at: confirmedAt.toISOString() };
  }

  async getFile(documentId: string) {
    const document = await this.prisma.document.findUnique({ where: { id: documentId } });
    if (!document) throw new NotFoundException(`Document ${documentId} not found`);
    return this.s3.getObject(document.storageUri);
  }

  async getStatus(documentId: string) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
      include: { extractions: true },
    });
    if (!document) throw new NotFoundException(`Document ${documentId} not found`);

    return {
      status: document.ocrStatus,
      quality_score: document.qualityScore,
      extractions: document.extractions.map((e) => ({
        field: (e.payload as Prisma.JsonObject).field as string,
        value: (e.payload as Prisma.JsonObject).value as string,
        confidence: e.confidence,
        bounding_box: e.bbox,
      })),
    };
  }

  /** docs/01-architecture.md: only the gateway owns the Socket.IO server, so docai's Celery
   * worker can't emit document.processed itself — it POSTs its ProcessResult here instead
   * (GATEWAY_CALLBACK_URL), and this is what actually persists it and emits the WS event. */
  async handleCallback(payload: ProcessCallbackDto): Promise<void> {
    const document = await this.prisma.document.findUniqueOrThrow({
      where: { id: payload.document_id },
    });

    await this.prisma.$transaction([
      this.prisma.document.update({
        where: { id: document.id },
        data: {
          ocrStatus: "done",
          qualityScore: payload.quality_score,
          timelineEvents: payload.timeline_events as unknown as Prisma.InputJsonValue,
        },
      }),
      ...payload.extractions.map((extraction) =>
        this.prisma.extraction.create({
          data: {
            documentId: document.id,
            entityType: ENTITY_TYPE_BY_FIELD[extraction.field] ?? "unknown",
            payload: { field: extraction.field, value: extraction.value },
            bbox: extraction.bounding_box ?? undefined,
            confidence: extraction.confidence,
          },
        }),
      ),
    ]);

    this.events.emitToSession(document.sessionId, "document.processed", {
      document_id: document.id,
      extractions: payload.extractions.map((e) => ({
        field: e.field,
        value: e.value,
        confidence: e.confidence,
        bounding_box: e.bounding_box,
      })),
    });
  }

  /** Cross-document ordering: each Document carries its own docai-assembled TimelineEvent[]
   * (C2, services/docai/app/timeline/assemble.py) verbatim in `timelineEvents` — this just
   * concatenates every document's events for the session and sorts by occurred_at. A document
   * still queued/failed contributes nothing (docai hasn't produced events for it yet). */
  async getTimeline(sessionId: string) {
    await this.prisma.intakeSession.findUniqueOrThrow({ where: { id: sessionId } });
    const documents = await this.prisma.document.findMany({
      where: { sessionId, timelineEvents: { not: Prisma.JsonNull } },
      select: { timelineEvents: true },
    });
    const events = documents.flatMap((d) => d.timelineEvents as unknown as {
      event_id: string;
      occurred_at: string;
      kind: string;
      summary: string;
      approximate: boolean;
    }[]);
    return events.sort((a, b) => a.occurred_at.localeCompare(b.occurred_at));
  }
}
