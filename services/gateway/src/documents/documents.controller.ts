import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ZodValidationPipe } from "../common/zod-validation.pipe";
import { DocumentsService } from "./documents.service";
import { type ProcessCallbackDto, ProcessCallbackSchema, UploadDocumentBodySchema } from "./dto/document.dto";

@Controller()
export class DocumentsController {
  constructor(private readonly documents: DocumentsService) {}

  @Post("sessions/:id/documents")
  @HttpCode(202)
  @UseInterceptors(FileInterceptor("file"))
  upload(
    @Param("id") sessionId: string,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body(new ZodValidationPipe(UploadDocumentBodySchema))
    body: { doc_type_hint?: string | null },
  ) {
    if (!file) {
      throw new BadRequestException("multipart field 'file' is required");
    }
    return this.documents.upload(sessionId, file, body);
  }

  @Get("documents/:id")
  getStatus(@Param("id") id: string) {
    return this.documents.getStatus(id);
  }

  @Get("sessions/:id/timeline")
  getTimeline(@Param("id") sessionId: string) {
    return this.documents.getTimeline(sessionId);
  }

  /** Internal — docai's Celery worker calls this, never a client (see DocumentsService.
   * handleCallback and services/docai/app/config.py's GATEWAY_CALLBACK_URL). Not part of
   * packages/contracts/openapi/gateway.yaml on purpose: it's a worker-to-gateway webhook, not
   * a public API surface. */
  @Post("internal/documents/callback")
  @HttpCode(204)
  async callback(@Body(new ZodValidationPipe(ProcessCallbackSchema)) body: ProcessCallbackDto) {
    await this.documents.handleCallback(body);
  }
}
