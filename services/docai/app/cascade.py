"""Three-tier pattern (docs/15-ai-stack.md): hosted API (primary) -> second cloud option
(skipped here, OCR has no documented second cloud tier the way speech has Bhashini) -> open
weights on our own machine -> stub. See docs/06-document-ai.md's OCR reality check for why the
`local` tier is unexercised on this machine specifically.
"""

from __future__ import annotations

from typing import Awaitable, Callable, TypeVar

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
