import { Controller, Get, Query } from "@nestjs/common";
import { z } from "zod";
import { searchAyurvedicMedicines } from "../ayurveda/ayurveda-medicines";
import { ZodValidationPipe } from "../common/zod-validation.pipe";
import { DocAiServiceClient, DocAiServiceUnavailable } from "./docai-service.client";

const SearchQuerySchema = z.object({
  q: z.string().min(1),
  system: z.enum(["allopathic", "ayush_formulation", "ayush_plant"]).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

/** GET /v1/dictionary/search — search medicine/formulation from real seeded AFI and classical
 * database, drawing from real data instead of hardcoded lists. */
@Controller("dictionary")
export class DictionaryController {
  constructor(private readonly docai: DocAiServiceClient) {}

  @Get("search")
  async search(@Query(new ZodValidationPipe(SearchQuerySchema)) query: z.infer<typeof SearchQuerySchema>) {
    try {
      const results = await this.docai.searchDictionary(query.q, query.system, query.limit);
      if (results && results.length > 0) return { results };
    } catch {
      // Fall back to gateway's own loaded AFI classical formulary dataset
    }

    const fallbacks = searchAyurvedicMedicines(query.q, query.limit);
    return {
      results: fallbacks.map((m) => ({
        id: m.id,
        system: "ayush_formulation" as const,
        canonical_name: m.name,
        synonyms: [m.canonicalName, m.category],
        metadata: {
          category: m.category,
          dosage_form: m.dosageForm,
          default_dose: m.defaultDose,
          default_timing: m.defaultTiming,
          default_duration: m.defaultDuration,
          default_anupana: m.defaultAnupana,
        },
        score: 1.0,
      })),
    };
  }
}
