import { Injectable, Logger, type OnModuleDestroy, type OnModuleInit } from "@nestjs/common";
import { SessionsService } from "./sessions.service";

const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // docs/09-security-dpdp.md: "session data expires" —
// checked periodically rather than lazily on read, so a session actually disappears at its
// TTL. Five minutes is a demo-appropriate cadence, not a production SLA.

/** Wraps SessionsService.purgeExpiredSessions() in a plain interval — deliberately not
 * @nestjs/schedule, which isn't a dependency of this service yet and this is thin enough not
 * to need it. */
@Injectable()
export class SessionCleanupScheduler implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SessionCleanupScheduler.name);
  private timer: ReturnType<typeof setInterval> | undefined;

  constructor(private readonly sessions: SessionsService) {}

  onModuleInit(): void {
    this.timer = setInterval(() => {
      this.sessions
        .purgeExpiredSessions()
        .then((count) => {
          if (count > 0) this.logger.log(`purged ${count} expired session(s)`);
        })
        .catch((err) => this.logger.warn(`expired-session cleanup failed: ${err}`));
    }, CLEANUP_INTERVAL_MS);
    this.timer.unref?.(); // never keeps the process alive on its own (matters for tests/CLI runs)
  }

  onModuleDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }
}
