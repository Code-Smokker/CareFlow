"""Raw SQL against provider_cascade_event via asyncpg — gateway/Prisma owns the migration
(services/gateway/prisma/schema.prisma), this service reads and writes the table directly,
never migrates it (same convention as services/docai's dictionary_entry,
services/docai/app/dictionary/db.py)."""

from __future__ import annotations

import asyncio

import asyncpg

from app.config import settings

_pool: asyncpg.Pool | None = None
_pool_loop: asyncio.AbstractEventLoop | None = None


async def get_pool() -> asyncpg.Pool:
    """One pool per event loop — pytest-asyncio (and any other per-call-fresh-loop runner)
    gives each test its own loop, so a pool created on a previous one is unusable: asyncpg
    raises `RuntimeError: Event loop is closed` on the next query. Same fix as
    services/docai/app/dictionary/db.py's get_pool()."""
    global _pool, _pool_loop
    current_loop = asyncio.get_running_loop()
    if _pool is not None and _pool_loop is not current_loop:
        _pool = None
    if _pool is None:
        _pool = await asyncpg.create_pool(settings.database_url, min_size=1, max_size=5)
        _pool_loop = current_loop
    return _pool


async def close_pool() -> None:
    global _pool, _pool_loop
    if _pool is not None:
        await _pool.close()
        _pool = None
        _pool_loop = None
