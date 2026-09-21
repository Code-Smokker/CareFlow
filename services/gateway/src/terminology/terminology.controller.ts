import { Body, Controller, Get, HttpCode, Post, Query } from "@nestjs/common";
import { z } from "zod";
import { AppException } from "../common/app-exception";
import { ZodValidationPipe } from "../common/zod-validation.pipe";
import { TerminologyServiceClient, TerminologyServiceUnavailable } from "./terminology-service.client";

const SystemSchema = z.enum(["namaste", "icd11-tm2", "icd11-bio"]);
const SearchQuerySchema = z.object({ q: z.string().min(1), system: SystemSchema.default("namaste") });
const TranslateBodySchema = z.object({ system: SystemSchema, code: z.string().min(1), target: SystemSchema });

/** GET/POST /v1/terminology/* — a thin proxy so browser clients (the doctor web app) reach the
 * terminology service through the gateway, the one edge with CORS. No logic of its own: it does
 * not rank, filter or suggest anything. */
@Controller("terminology")
export class TerminologyController {
  constructor(private readonly terminology: TerminologyServiceClient) {}

  @Get("search")
  async search(@Query(new ZodValidationPipe(SearchQuerySchema)) query: z.infer<typeof SearchQuerySchema>) {
    try {
      return await this.terminology.search(query.q, query.system);
    } catch (err) {
      throw this.unavailable(err);
    }
  }

  @Post("translate")
  @HttpCode(200)
  async translate(@Body(new ZodValidationPipe(TranslateBodySchema)) body: z.infer<typeof TranslateBodySchema>) {
    try {
      return await this.terminology.translate(body.system, body.code, body.target);
    } catch (err) {
      throw this.unavailable(err);
    }
  }

  private unavailable(err: unknown): unknown {
    if (err instanceof TerminologyServiceUnavailable) {
      return new AppException(502, "terminology_unavailable", "The terminology service could not be reached. Check that it is running, then try again.");
    }
    return err;
  }
}
