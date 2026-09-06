import logging
import sys

import structlog

from app.config import settings


def configure_logging() -> None:
    """Structured logs — CLAUDE.md, contracts rule 3. No session_id here: this is a stateless
    lookup service, not part of the interview's session-scoped request path."""
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
    return structlog.get_logger(service="terminology").bind(**initial_values)
