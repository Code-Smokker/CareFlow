"""Three-tier pattern everywhere (docs/15-ai-stack.md): hosted API (primary) -> second cloud
option -> open weights on our own machine (offline). One call site, one cascade helper — the
demo must survive a dead venue network, so falling through to the last tier is not optional.
"""

from __future__ import annotations

import time
from typing import Awaitable, Callable, TypeVar

from app.logging import get_logger

T = TypeVar("T")

log = get_logger(component="cascade")


class ProviderUnavailable(Exception):
    """Raised by an adapter when it cannot serve this request right now — missing credentials,
    network error, non-2xx response, timeout. Never raised for "the model declined to answer";
    that's a normal result, not a failure."""


class AllProvidersUnavailable(Exception):
    def __init__(self, tier_errors: list[tuple[str, str]]):
        detail = "; ".join(f"{name}: {error}" for name, error in tier_errors)
        super().__init__(f"All providers exhausted: {detail}")
        self.tier_errors = tier_errors


async def _record_event(capability: str, provider: str, outcome: str, latency_ms: int, error: str | None) -> None:
    """Best-effort — this is telemetry for /integrations (docs/19-frontend-status.md), never
    allowed to break the actual cascade. A DB hiccup here is logged and swallowed, not raised."""
    try:
        from app.db import get_pool

        pool = await get_pool()
        await pool.execute(
            """
            INSERT INTO provider_cascade_event (service, capability, provider, outcome, latency_ms, error)
            VALUES ($1, $2, $3, $4, $5, $6)
            """,
            "ai",
            capability,
            provider,
            outcome,
            latency_ms,
            error,
        )
    except Exception as exc:  # noqa: BLE001 — telemetry write, never propagate
        log.warning("failed to record cascade event", capability=capability, provider=provider, error=str(exc))


async def cascade(tiers: list[tuple[str, Callable[[], Awaitable[T]]]], capability: str) -> T:
    """`tiers` is an ordered list of (name, async thunk). Tries each in order, catching
    ProviderUnavailable, and raises AllProvidersUnavailable only if every tier fails.
    `capability` names the call site (e.g. "llm.fill_slot") for provider_cascade_event —
    every attempt, success or failure, is recorded there."""
    errors: list[tuple[str, str]] = []
    for name, thunk in tiers:
        start = time.monotonic()
        try:
            result = await thunk()
            latency_ms = round((time.monotonic() - start) * 1000)
            await _record_event(capability, name, "success", latency_ms, None)
            return result
        except ProviderUnavailable as exc:
            latency_ms = round((time.monotonic() - start) * 1000)
            log.warning("provider tier unavailable, falling back", tier=name, error=str(exc))
            await _record_event(capability, name, "failure", latency_ms, str(exc))
            errors.append((name, str(exc)))
    raise AllProvidersUnavailable(errors)
