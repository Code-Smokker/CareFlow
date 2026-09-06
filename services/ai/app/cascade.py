"""Three-tier pattern everywhere (docs/15-ai-stack.md): hosted API (primary) -> second cloud
option -> open weights on our own machine (offline). One call site, one cascade helper — the
demo must survive a dead venue network, so falling through to the last tier is not optional.
"""

from __future__ import annotations

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


async def cascade(tiers: list[tuple[str, Callable[[], Awaitable[T]]]]) -> T:
    """`tiers` is an ordered list of (name, async thunk). Tries each in order, catching
    ProviderUnavailable, and raises AllProvidersUnavailable only if every tier fails."""
    errors: list[tuple[str, str]] = []
    for name, thunk in tiers:
        try:
            return await thunk()
        except ProviderUnavailable as exc:
            log.warning("provider tier unavailable, falling back", tier=name, error=str(exc))
            errors.append((name, str(exc)))
    raise AllProvidersUnavailable(errors)
