import type { LoggerService } from "@nestjs/common";
import pino, { type Logger } from "pino";

/**
 * Root pino logger. Structured, never console.log — CLAUDE.md: "Structured logs (pino /
 * structlog) with session_id on every line." Get a request- or session-scoped child via
 * `.child({ session_id })` at the call site rather than threading a logger through every
 * function signature.
 */
export const rootLogger: Logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  base: { service: "gateway" },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export function sessionLogger(sessionId: string): Logger {
  return rootLogger.child({ session_id: sessionId });
}

/** Adapts pino to Nest's internal LoggerService so framework logs (bootstrap, routes) go
 * through the same structured sink instead of Nest's default console logger. */
export class PinoNestLogger implements LoggerService {
  log(message: unknown, context?: string) {
    rootLogger.info({ context }, String(message));
  }
  error(message: unknown, trace?: string, context?: string) {
    rootLogger.error({ context, trace }, String(message));
  }
  warn(message: unknown, context?: string) {
    rootLogger.warn({ context }, String(message));
  }
  debug(message: unknown, context?: string) {
    rootLogger.debug({ context }, String(message));
  }
  verbose(message: unknown, context?: string) {
    rootLogger.trace({ context }, String(message));
  }
}
