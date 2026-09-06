from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Query

from app.dictionary import search as dictionary_search

router = APIRouter()

_VALID_SYSTEMS = {"allopathic", "ayush_formulation", "ayush_plant"}


@router.get("/dictionary/search")
async def search_dictionary(
    q: str = Query(..., min_length=1),
    system: str | None = Query(default=None),
    limit: int = Query(default=10, ge=1, le=50),
) -> dict[str, list[dict[str, Any]]]:
    if system is not None and system not in _VALID_SYSTEMS:
        system = None
    results = await dictionary_search.search(q, system, limit)
    return {"results": results}
