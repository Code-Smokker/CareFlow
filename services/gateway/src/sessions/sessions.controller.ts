import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Headers as ReqHeaders,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Env } from "../common/env";
import { resolveIntakeUrl } from "./intake-url";
import { AppException } from "../common/app-exception";
import { ZodValidationPipe } from "../common/zod-validation.pipe";
import {
  type AnswerSubmissionDto,
  AnswerSubmissionSchema,
  type CreateSessionDto,
  CreateSessionSchema,
  type ConsentBodyDto,
  ConsentBodySchema,
  LanguageBodySchema,
  ResumeBodySchema,
  type RevokeConsentBodyDto,
  RevokeConsentBodySchema,
} from "./dto/session.dto";
import { SessionsService } from "./sessions.service";

@Controller("sessions")
export class SessionsController {
  constructor(
    private readonly sessions: SessionsService,
    private readonly config: ConfigService<Env, true>,
  ) {}

  @Post()
  @HttpCode(201)
  create(@Body(new ZodValidationPipe(CreateSessionSchema)) body: CreateSessionDto) {
    return this.sessions.create(
      resolveIntakeUrl(this.config),
      body.department,
      body.patient,
    );
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.sessions.get(id);
  }

  @Post(":id/resume")
  @HttpCode(200)
  resume(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(ResumeBodySchema))
    body: { resume_token: string },
  ) {
    return this.sessions.resume(id, body);
  }

  @Post(":id/language")
  @HttpCode(204)
  async setLanguage(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(LanguageBodySchema)) body: { language: string },
  ) {
    await this.sessions.setLanguage(id, body);
  }

  @Post(":id/consent")
  @HttpCode(204)
  async recordConsent(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(ConsentBodySchema)) body: ConsentBodyDto,
  ) {
    await this.sessions.recordConsent(id, body);
  }

  @Get(":id/consent/resource")
  async getConsentResource(@Param("id") id: string) {
    return this.sessions.getConsentResource(id);
  }

  @Post(":id/consent/revoke")
  @HttpCode(204)
  async revokeConsent(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(RevokeConsentBodySchema)) body: RevokeConsentBodyDto,
  ) {
    await this.sessions.revokeConsent(id, body.scopes);
  }

  @Post(":id/answer")
  @HttpCode(200)
  submitAnswer(
    @Param("id") id: string,
    @ReqHeaders("idempotency-key") idempotencyKey: string | undefined,
    @Body(new ZodValidationPipe(AnswerSubmissionSchema))
    body: AnswerSubmissionDto,
  ) {
    if (!idempotencyKey) {
      throw new AppException(
        400,
        "missing_idempotency_key",
        "The Idempotency-Key header is required on POST /answer.",
      );
    }
    return this.sessions.submitAnswer(id, idempotencyKey, body);
  }

  @Post(":id/complete")
  @HttpCode(200)
  complete(@Param("id") id: string) {
    return this.sessions.complete(id);
  }

  @Delete(":id")
  @HttpCode(204)
  async purge(@Param("id") id: string) {
    await this.sessions.purge(id);
  }
}
