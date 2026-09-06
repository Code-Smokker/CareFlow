from __future__ import annotations

from pydantic import BaseModel

from fastapi import APIRouter

from app.tasks import process_document

router = APIRouter()


class ProcessRequest(BaseModel):
    document_id: str
    image_refs: list[str]


class ProcessResponse(BaseModel):
    job_id: str


@router.post("/process", response_model=ProcessResponse, status_code=202)
async def process(body: ProcessRequest) -> ProcessResponse:
    task = process_document.delay(body.document_id, body.image_refs)
    return ProcessResponse(job_id=task.id)
