import time
from contextlib import asynccontextmanager

import structlog
from fastapi import FastAPI, Request

from app.logging import configure_logging, get_logger

# Same ordering constraint as services/ai/app/main.py: must run before any router module
# is imported, since each binds its own module-level logger at import time.
configure_logging()
log = get_logger()

from app.config import settings  # noqa: E402
from app.dictionary.db import close_pool  # noqa: E402
from app.errors import AppError, app_error_handler, unhandled_error_handler  # noqa: E402
from app.logging import bind_session  # noqa: E402
from app.routers import classify, dictionary, health, jobs, process  # noqa: E402


@asynccontextmanager
async def lifespan(_app: FastAPI):
    log.info("docai service starting", ocr_provider=settings.ocr_provider)
    yield
    await close_pool()


app = FastAPI(title="CareFlow DocAI Service", lifespan=lifespan)

app.include_router(health.router)
app.include_router(classify.router)
app.include_router(process.router)
app.include_router(jobs.router)
app.include_router(dictionary.router)

app.add_exception_handler(AppError, app_error_handler)
app.add_exception_handler(Exception, unhandled_error_handler)


@app.middleware("http")
async def logging_middleware(request: Request, call_next):
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
