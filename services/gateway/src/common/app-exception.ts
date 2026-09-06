import { HttpException } from "@nestjs/common";

/**
 * Every error response is `{ error: { code, message, details? } }` with a machine-readable
 * `code` — docs/03-api-contracts.md. Throw this instead of a bare HttpException so the code
 * survives into the response body, not just the HTTP status.
 */
export class AppException extends HttpException {
  readonly errorCode: string;
  readonly details?: Record<string, unknown>;

  constructor(
    status: number,
    code: string,
    message: string,
    details?: Record<string, unknown>,
  ) {
    super({ code, message, details }, status);
    this.errorCode = code;
    this.details = details;
  }
}
