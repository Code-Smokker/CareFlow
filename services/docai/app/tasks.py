"""The Celery task behind POST /process. Runs OCR, then the (stub, for now) extractor, then
posts the result back to the gateway — this worker can't emit document.processed itself since
the gateway alone owns the Socket.IO server (docs/01-architecture.md); see config.py's
gateway_callback_url.
"""

from __future__ import annotations

import asyncio
from typing import Any

import httpx

from app.celery_app import celery_app
from app.config import settings
from app.extract import stub as stub_extractor
from app.logging import get_logger
from app.ocr import service as ocr_service

log = get_logger()


@celery_app.task(name="docai.process_document", bind=True)
def process_document(self, document_id: str, image_refs: list[str]) -> dict[str, Any]:
    result = asyncio.run(_process_document_async(document_id, image_refs))
    return result


async def _process_document_async(document_id: str, image_refs: list[str]) -> dict[str, Any]:
    extractions: list[dict[str, Any]] = []
    for image_ref in image_refs:
        ocr_result = await ocr_service.read(image_ref)
        extractions.extend(stub_extractor.extract(ocr_result))

    # Stub tier: no dates are read from the document yet (that's C2's timeline assembly over
    # real extractions), so there is nothing honest to report here — an empty list, not an
    # invented one (docs/06-document-ai.md: never invent a precise date).
    result = {
        "document_id": document_id,
        "extractions": extractions,
        "timeline_events": [],
        "quality_score": 1.0 if extractions else 0.0,
    }

    await _post_callback(result)
    return result


async def _post_callback(result: dict[str, Any]) -> None:
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(settings.gateway_callback_url, json=result)
            response.raise_for_status()
    except httpx.HTTPError as exc:
        log.error("gateway callback failed", document_id=result["document_id"], error=str(exc))
        raise
