import { HttpStatus, type PipeTransform } from "@nestjs/common";
import type { ZodType } from "zod";
import { AppException } from "./app-exception";

/**
 * Zod at every boundary that touches the network (CLAUDE.md conventions). Use per-parameter:
 * `@Body(new ZodValidationPipe(AnswerSubmissionSchema)) body: AnswerSubmission`.
 */
export class ZodValidationPipe<T> implements PipeTransform {
  constructor(private readonly schema: ZodType<T>) {}

  transform(value: unknown): T {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      throw new AppException(
        HttpStatus.BAD_REQUEST,
        "validation_error",
        "Request body failed validation.",
        {
          issues: result.error.issues,
        },
      );
    }
    return result.data;
  }
}
