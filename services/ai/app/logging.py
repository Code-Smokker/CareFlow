import logging
import sys

import structlog

from app.config import settings


def configure_logging() -> None:
    """Structured logs, session_id on every line — CLAUDE.md, contracts rule 3. Bind session_id
    per request with `bind_session(session_id)`; every log call after that carries it until
    `structlog.contextvars.clear_contextvars()` at the end of the request."""
    logging.basicConfig(format="%(message)s", stream=sys.stdout, level=settings.log_level.upper())
    structlog.configure(
        processors=[
            structlog.contextvars.merge_contextvars,
            structlog.processors.add_log_level,
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.EventRenamer("msg"),
            structlog.processors.JSONRenderer(),
        ],
        wrapper_class=structlog.make_filtering_bound_logger(logging.getLevelName(settings.log_level.upper())),
        context_class=dict,
        logger_factory=structlog.PrintLoggerFactory(),
        cache_logger_on_first_use=True,
    )


def get_logger(**initial_values: object) -> structlog.BoundLogger:
    return structlog.get_logger(service="ai").bind(**initial_values)


def bind_session(session_id: str | None) -> None:
    if session_id:
        structlog.contextvars.bind_contextvars(session_id=session_id)
