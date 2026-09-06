import type { NextFunction, Request, Response } from "express";
import { rootLogger, sessionLogger } from "./logger";

declare module "express" {
  interface Request {
    /** session_id-scoped child logger when the route has a session :id param, else root. */
    log: typeof rootLogger;
  }
}

/**
 * One structured line per request, with session_id attached whenever the route carries one —
 * CLAUDE.md: "session_id on every log line" / contracts rule 3: "session_id on every log line
 * across every service." Nest resolves route params after middleware runs, so we read the
 * session id straight off the URL rather than from req.params.
 */
export function requestLogMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const sessionIdMatch = req.originalUrl.match(/\/v1\/sessions\/([^/?]+)/);
  const log = sessionIdMatch ? sessionLogger(sessionIdMatch[1]) : rootLogger;
  req.log = log;

  const startedAt = process.hrtime.bigint();
  res.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
    log.info(
      {
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        duration_ms: Math.round(durationMs * 100) / 100,
      },
      "request",
    );
  });

  next();
}
