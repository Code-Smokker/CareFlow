import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import type { Request, Response } from "express";
import { rootLogger } from "./logger";

/**
 * Every error response is `{ error: { code, message, details? } }` — docs/03-api-contracts.md.
 * Anything not thrown as an AppException (a raw HttpException, a Zod validation failure caught
 * upstream, an unexpected throw) still comes out in this shape rather than leaking a stack
 * trace to the patient's screen.
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = "internal_error";
    let message = "Something went wrong. Please try again.";
    let details: Record<string, unknown> | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse();
      if (typeof body === "object" && body !== null && "code" in body) {
        const b = body as {
          code: string;
          message: string;
          details?: Record<string, unknown>;
        };
        code = b.code;
        message = b.message;
        details = b.details;
      } else {
        code = status === HttpStatus.NOT_FOUND ? "not_found" : "http_error";
        message = typeof body === "string" ? body : exception.message;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const log = request.log ?? rootLogger;
    log.error({ code, status, err: exception }, "request_failed");

    response.status(status).json({ error: { code, message, details } });
  }
}
