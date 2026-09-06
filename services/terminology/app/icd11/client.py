"""WHO ICD-11 API client — OAuth2 client_credentials, then the linearization search endpoint,
per docs/15-ai-stack.md ("There is also an official FHIR-facing surface worth looking at before
writing a custom client" — noted, not yet done: this is the plain REST surface, not the FHIR
one, since nobody has been able to exercise either against a live token in this environment).

**Unverified against a live provider.** `ICD_CLIENT_ID`/`ICD_CLIENT_SECRET` are both empty in
this environment (docs/API_KEYS.md: WHO ICD-11 "not obtained") — every request this client
makes will fail at the token step with `ProviderUnavailable` before touching the network. The
request/response shapes below are written from WHO's publicly documented API (OAuth2 token at
`ICD_TOKEN_URL`, `GET {ICD_API_URL}/icd/release/11/2024-01/{linearization}/search?q=`, Bearer
auth, `API-Version: v2` header, `destinationEntities[].title` with `<em class='found'>` marking
the matched substring) — same ASSUMED-shape discipline as services/docai/app/ocr/hosted.py's
unverified vision tier. Confirm the exact shape against the real API the first time credentials
exist, and fix this in one place if it differs.

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

_LINEARIZATION_BY_SYSTEM = {"icd11-tm2": "tm2", "icd11-bio": "mms"}
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


def _parse_search_response(data: dict[str, Any]) -> list[dict[str, Any]]:
    entities = data.get("destinationEntities", [])
    results = []
    for entity in entities:
        code = entity.get("theCode") or entity.get("code")
        entity_id = entity.get("id", "")
        results.append(
            {
                "code": code or entity_id.rstrip("/").rsplit("/", 1)[-1],
                "display": _strip_found_markup(entity.get("title", "")),
                "uri": entity_id,
            }
        )
    return results


async def _search_live(query: str, system: str) -> list[dict[str, Any]]:
    linearization = _LINEARIZATION_BY_SYSTEM.get(system)
    if linearization is None:
        raise ProviderUnavailable(f"No ICD-11 linearization mapped for system={system!r}")

    token = await _get_token()
    url = f"{settings.icd_api_url}/icd/release/11/2024-01/{linearization}/search"
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json",
        "Accept-Language": "en",
        "API-Version": "v2",
    }
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, params={"q": query}, headers=headers)
            response.raise_for_status()
            data = response.json()
    except (httpx.HTTPError, ValueError) as exc:
        raise ProviderUnavailable(f"WHO ICD-11 search call failed: {exc}") from exc

    return _parse_search_response(data)


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
