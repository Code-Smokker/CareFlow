from __future__ import annotations

from typing import Any

from pydantic import BaseModel

from fastapi import APIRouter

from app.celery_app import celery_app

router = APIRouter()

_STATE_MAP: dict[str, str] = {
    "PENDING": "queued",
    "RECEIVED": "queued",
    "STARTED": "processing",
    "RETRY": "processing",
    "SUCCESS": "done",
    "FAILURE": "failed",
    "REVOKED": "failed",
}


class JobResponse(BaseModel):
    status: str
    result: dict[str, Any] | None = None


@router.get("/jobs/{id}", response_model=JobResponse)
async def get_job(id: str) -> JobResponse:
    async_result = celery_app.AsyncResult(id)
    status = _STATE_MAP.get(async_result.state, "queued")
    result = async_result.result if status == "done" else None
    return JobResponse(status=status, result=result)
