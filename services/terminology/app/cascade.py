"""Same shape as services/docai/app/cascade.py and services/ai/app/cascade.py — one tiered
fallback primitive shared by convention, not by import, across the three Python services."""

from __future__ import annotations

from collections.abc import Awaitable, Callable
from typing import TypeVar

from app.logging import get_logger

T = TypeVar("T")

log = get_logger(component="cascade")


class ProviderUnavailable(Exception):
    """Raised by an adapter when it cannot serve this request right now."""


class AllProvidersUnavailable(Exception):
    def __init__(self, tier_errors: list[tuple[str, str]]):
        detail = "; ".join(f"{name}: {error}" for name, error in tier_errors)
        super().__init__(f"All providers exhausted: {detail}")
        self.tier_errors = tier_errors


async def cascade(tiers: list[tuple[str, Callable[[], Awaitable[T]]]]) -> T:
    errors: list[tuple[str, str]] = []
    for name, thunk in tiers:
        try:
            return await thunk()
        except ProviderUnavailable as exc:
            log.warning("provider tier unavailable, falling back", tier=name, error=str(exc))
            errors.append((name, str(exc)))
    raise AllProvidersUnavailable(errors)
