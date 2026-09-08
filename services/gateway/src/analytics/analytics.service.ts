import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async summary(since?: Date) {
    const windowStart = since ?? startOfToday();
    const windowEnd = new Date();

    const [throughput, flaggedVisits, topComplaints, avgIntake] = await Promise.all([
      this.prisma.visit.count({ where: { startedAt: { gte: windowStart } } }),
      this.prisma.$queryRaw<{ count: bigint }[]>(Prisma.sql`
        SELECT count(DISTINCT v.id) AS count
        FROM visit v
        JOIN intake_session s ON s.visit_id = v.id
        JOIN red_flag rf ON rf.session_id = s.id
        WHERE v.started_at >= ${windowStart}
      `),
      this.prisma.$queryRaw<{ complaint: string; count: bigint }[]>(Prisma.sql`
        SELECT su.structured -> 'chief_complaint' ->> 'value' AS complaint, count(*) AS count
        FROM summary su
        JOIN visit v ON v.id = su.visit_id
        WHERE v.started_at >= ${windowStart}
          AND su.structured -> 'chief_complaint' ->> 'value' IS NOT NULL
        GROUP BY complaint
        ORDER BY count(*) DESC
        LIMIT 5
      `),
      this.prisma.$queryRaw<{ avg_seconds: number | null }[]>(Prisma.sql`
        SELECT avg(EXTRACT(EPOCH FROM (updated_at - created_at)))::float8 AS avg_seconds
        FROM intake_session
        WHERE status = 'completed' AND created_at >= ${windowStart}
      `),
    ]);

    const flaggedCount = Number(flaggedVisits[0]?.count ?? 0);

    return {
      window_start: windowStart.toISOString(),
      window_end: windowEnd.toISOString(),
      opd_throughput: throughput,
      top_complaints: topComplaints.map((row) => ({ complaint: row.complaint, count: Number(row.count) })),
      red_flag_rate: throughput > 0 ? flaggedCount / throughput : 0,
      average_intake_seconds: avgIntake[0]?.avg_seconds ?? null,
    };
  }
}
