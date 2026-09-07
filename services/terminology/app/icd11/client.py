"""WHO ICD-11 API client — OAuth2 client_credentials, then the MMS search endpoint, per
docs/15-ai-stack.md.

**Verified live 2026-09-07** against a real WHO account. Two things the original
publicly-documented-shape guess got wrong, corrected here:

1. There is no standalone `tm2` linearization to search — `GET .../release/11/{version}/tm2/
   search` 404s. Traditional Medicine Module 2 is **Chapter 26 of the MMS linearization**;
   the way to search it is an MMS search with `chapterFilter=26`, which real TM2 entities
   confirm (title suffixed `(TM2)`, codes like `SK8Y`, `SS56`).
2. The release id must be a real, current version — the assumed default `2024-01` also 404s.
   `icd_release` (settings, default `2026-01`) is WHO's `latestRelease` as of the verification
   date above; there is no `latest` alias, so this needs bumping by hand occasionally (check
   `GET {icd_api_url}/icd/release/11/mms`'s `latestRelease` field).

Cascade (app/cascade.py): live WHO API call -> cached Postgres snapshot (Concept rows already
loaded for this system on some earlier successful live call) -> ProviderUnavailable if neither
has anything. This is what makes docs/07-ayush-terminology.md's "cache the ICD snapshot in
Postgres so the demo works offline" true in practice, not just in the README.
"""

from __future__ import annotations

import re
import time
from typing import Any

import httpx

from app.cascade import ProviderUnavailable, cascade
from app.config import settings
from app.db import get_pool
from app.logging import get_logger

log = get_logger(component="icd11_client")

# Both systems search the MMS linearization — TM2 has no linearization of its own, it's
# Chapter 26 of MMS, isolated at search time with chapterFilter.
_CHAPTER_FILTER_BY_SYSTEM = {"icd11-tm2": "26", "icd11-bio": None}
_FOUND_TAG = re.compile(r"</?em[^>]*>")

_token: str | None = None
_token_expiry: float = 0.0


async def _get_token() -> str:
    global _token, _token_expiry
    if not settings.icd_client_id or not settings.icd_client_secret:
        raise ProviderUnavailable("ICD_CLIENT_ID/ICD_CLIENT_SECRET are not set")

    now = time.time()
    if _token is not None and now < _token_expiry:
        return _token

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                settings.icd_token_url,
                data={
                    "grant_type": "client_credentials",
                    "client_id": settings.icd_client_id,
                    "client_secret": settings.icd_client_secret,
                    "scope": "icdapi_access",
                },
            )
            response.raise_for_status()
            data = response.json()
    except (httpx.HTTPError, ValueError) as exc:
        raise ProviderUnavailable(f"WHO ICD-11 OAuth2 token request failed: {exc}") from exc

    _token = data["access_token"]
    _token_expiry = now + float(data.get("expires_in", 3600)) - 30
    return _token


def _strip_found_markup(title: str) -> str:
    return _FOUND_TAG.sub("", title)


def _parse_search_response(data: dict[str, Any], *, title_suffix: str | None = None) -> list[dict[str, Any]]:
    entities = data.get("destinationEntities", [])
    results = []
    for entity in entities:
        title = _strip_found_markup(entity.get("title", ""))
        # Chapter 26 interleaves TM1 (Kampo/Chinese/Korean-derived) and TM2 (Ayurveda/Unani/
        # Siddha-derived) entities — chapterFilter alone doesn't separate them, but WHO suffixes
        # every title with its module, so that's the actual discriminator.
        if title_suffix is not None and not title.endswith(title_suffix):
            continue
        code = entity.get("theCode") or entity.get("code")
        entity_id = entity.get("id", "")
        results.append(
            {
                "code": code or entity_id.rstrip("/").rsplit("/", 1)[-1],
                "display": title,
                "uri": entity_id,
            }
        )
    return results


_TITLE_SUFFIX_BY_SYSTEM = {"icd11-tm2": "(TM2)", "icd11-bio": None}


async def _search_live(query: str, system: str) -> list[dict[str, Any]]:
    if system not in _CHAPTER_FILTER_BY_SYSTEM:
        raise ProviderUnavailable(f"No ICD-11 mapping for system={system!r}")
    chapter_filter = _CHAPTER_FILTER_BY_SYSTEM[system]

    token = await _get_token()
    url = f"{settings.icd_api_url}/icd/release/11/{settings.icd_release}/mms/search"
    params = {"q": query}
    if chapter_filter is not None:
        params["chapterFilter"] = chapter_filter
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json",
        "Accept-Language": "en",
        "API-Version": "v2",
    }
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, params=params, headers=headers)
            response.raise_for_status()
            data = response.json()
    except (httpx.HTTPError, ValueError) as exc:
        raise ProviderUnavailable(f"WHO ICD-11 search call failed: {exc}") from exc

    return _parse_search_response(data, title_suffix=_TITLE_SUFFIX_BY_SYSTEM[system])


async def _search_cached(query: str, system: str) -> list[dict[str, Any]]:
    # Deliberately not app.search.concepts.search (trigram+embedding ranked search meant for the
    # patient-facing /search endpoint) — this is "do we already have this from an earlier live
    # pull", an exact/substring lookup over whatever this system's cache holds.
    pool = await get_pool()
    rows = await pool.fetch(
        "SELECT code, display FROM concept WHERE system = $1 AND lower(display) LIKE $2 LIMIT 20",
        system,
        f"%{query.lower()}%",
    )
    if not rows:
        raise ProviderUnavailable(f"No cached {system} concepts match {query!r}")
    return [{"code": r["code"], "display": r["display"], "uri": None} for r in rows]


async def search(query: str, system: str) -> list[dict[str, Any]]:
    return await cascade(
        [
            ("live", lambda: _search_live(query, system)),
            ("cached", lambda: _search_cached(query, system)),
        ]
    )
