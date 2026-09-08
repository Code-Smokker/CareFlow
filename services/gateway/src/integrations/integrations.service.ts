import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class IntegrationsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(params: { limit: number; cursor?: string; outcome?: "success" | "failure"; capability?: string }) {
    const { limit, cursor, outcome, capability } = params;

    const rows = await this.prisma.providerCascadeEvent.findMany({
      where: {
        ...(outcome ? { outcome } : {}),
        ...(capability ? { capability } : {}),
      },
      orderBy: [{ at: "desc" }, { id: "desc" }],
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    const hasMore = rows.length > limit;
    const page = hasMore ? rows.slice(0, limit) : rows;

    return {
      entries: page.map((row) => ({
        id: row.id,
        service: row.service,
        capability: row.capability,
        provider: row.provider,
        outcome: row.outcome,
        latency_ms: row.latencyMs,
        error: row.error,
        at: row.at.toISOString(),
      })),
      next_cursor: hasMore ? page[page.length - 1].id : null,
    };
  }
}
