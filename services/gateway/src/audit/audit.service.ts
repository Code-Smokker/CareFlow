import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

const TRIGGER_NAMES = ["audit_log_no_update", "audit_log_no_delete"] as const;

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async list(params: { limit: number; cursor?: string; resource?: string; action?: string }) {
    const { limit, cursor, resource, action } = params;

    const rows = await this.prisma.auditLog.findMany({
      where: {
        ...(resource ? { resource } : {}),
        ...(action ? { action } : {}),
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
        actor_id: row.actorId,
        actor_role: row.actorRole,
        action: row.action,
        resource: row.resource,
        resource_id: row.resourceId,
        reason: row.reason,
        at: row.at.toISOString(),
      })),
      next_cursor: hasMore ? page[page.length - 1].id : null,
      integrity: await this.checkIntegrity(),
    };
  }

  /** Queries pg_trigger live, on every call — this is what lets the API say "append-only" is
   * enforced right now, not just that a migration once claimed to enforce it. */
  async checkIntegrity() {
    const rows = await this.prisma.$queryRaw<{ tgname: string; tgenabled: string }[]>`
      SELECT tgname, tgenabled
      FROM pg_trigger
      WHERE tgrelid = 'audit_log'::regclass AND NOT tgisinternal
    `;

    const triggers = TRIGGER_NAMES.map((name) => {
      const row = rows.find((r) => r.tgname === name);
      // tgenabled: 'O' = origin (enabled), 'D' = disabled — see Postgres pg_trigger docs.
      return { name, enabled: row ? row.tgenabled !== "D" : false };
    });

    return {
      enforced: triggers.every((t) => t.enabled),
      triggers,
    };
  }
}
