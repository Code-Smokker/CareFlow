import os
import sys
import time
from contextlib import asynccontextmanager

import structlog
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles

from app.logging import configure_logging, get_logger

# Must run before any router module is imported: each binds its own module-level logger at
# import time, and structlog's lazy proxy resolves the active renderer on that logger's first
# use — configuring after the import would leave those loggers on structlog's plain-console
# default while only this module's own logger got JSON.
configure_logging()
log = get_logger()

from app.config import settings  # noqa: E402
from app.db import close_pool  # noqa: E402
from app.errors import AppError, app_error_handler, unhandled_error_handler  # noqa: E402
from app.logging import bind_session  # noqa: E402
from app.routers import evaluate_flags, fill_slot, health, summarise, synthesise, transcribe  # noqa: E402


@asynccontextmanager
async def lifespan(_app: FastAPI):
    log.info(
        "ai service starting",
        asr_provider=settings.asr_provider,
        tts_provider=settings.tts_provider,
        llm_provider=settings.llm_provider,
        # A process running from a since-deleted directory (e.g. the repo got moved/renamed
        # after this process started) still answers /health — it just fails every request that
        # touches a path baked in at import time. These two lines are the tell: if they don't
        # match this repo's actual location, restart the service, don't trust its health check.
        python_executable=sys.executable,
        cwd=os.getcwd(),
    )
    yield
    await close_pool()


app = FastAPI(title="CareFlow AI Service", lifespan=lifespan)

app.include_router(health.router)
app.include_router(transcribe.router)
app.include_router(fill_slot.router)
app.include_router(evaluate_flags.router)
app.include_router(summarise.router)
app.include_router(synthesise.router)

app.add_exception_handler(AppError, app_error_handler)
app.add_exception_handler(Exception, unhandled_error_handler)

settings.tts_cache_dir.mkdir(parents=True, exist_ok=True)
app.mount("/audio", StaticFiles(directory=settings.tts_cache_dir), name="audio")


@app.middleware("http")
async def logging_middleware(request: Request, call_next):
    """session_id on every log line (CLAUDE.md, contracts rule 3) — the gateway sets
    X-Session-Id; packages/contracts/openapi/ai.yaml's request bodies don't carry it since
    most of these endpoints (fill-slot, evaluate-flags) are pure functions of their inputs."""
    structlog.contextvars.clear_contextvars()
    bind_session(request.headers.get("x-session-id"))
    started_at = time.perf_counter()
    response = await call_next(request)
    log.info(
        "request",
        method=request.method,
        path=request.url.path,
        status=response.status_code,
        duration_ms=round((time.perf_counter() - started_at) * 1000, 2),
    )
    return response
