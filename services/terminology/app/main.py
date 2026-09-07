import os
import sys
import time
from contextlib import asynccontextmanager

import structlog
from fastapi import FastAPI, Request

from app.logging import configure_logging, get_logger

# Same ordering constraint as services/docai/app/main.py: must run before any router module is
# imported, since each binds its own module-level logger at import time.
configure_logging()
log = get_logger()

from app.db import close_pool
from app.errors import (
    AppError,
    app_error_handler,
    unhandled_error_handler,
)
from app.routers import concept, fhir, health, search, translate


@asynccontextmanager
async def lifespan(_app: FastAPI):
    log.info(
        "terminology service starting",
        # See services/ai/app/main.py's identical fields: a process still running from a
        # deleted/renamed directory answers /health fine but fails every request touching a
        # path baked in at import time. Mismatch here means restart, not "it's healthy."
        python_executable=sys.executable,
        cwd=os.getcwd(),
    )
    yield
    await close_pool()


app = FastAPI(title="CareFlow Terminology Service", lifespan=lifespan)

app.include_router(health.router)
app.include_router(search.router)
app.include_router(concept.router)
app.include_router(translate.router)
app.include_router(fhir.router)

app.add_exception_handler(AppError, app_error_handler)
app.add_exception_handler(Exception, unhandled_error_handler)


@app.middleware("http")
async def logging_middleware(request: Request, call_next):
    structlog.contextvars.clear_contextvars()
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
