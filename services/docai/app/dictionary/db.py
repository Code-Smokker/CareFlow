"""Raw SQL against the dictionary_entry table asyncpg — gateway/Prisma owns the migration
(services/gateway/prisma/schema.prisma), this service reads and writes the table directly,
never migrates it (same convention as services/ai and the terminology service, documented in
schema.prisma's own header comment)."""

from __future__ import annotations

import asyncio

import asyncpg

from app.config import settings

_pool: asyncpg.Pool | None = None
_pool_loop: asyncio.AbstractEventLoop | None = None


async def get_pool() -> asyncpg.Pool:
    """One pool per event loop. `app.tasks.process_document` runs each Celery job inside its
    own `asyncio.run(...)` call — a fresh event loop every time — so a pool created on a
    previous job's loop is unusable once that loop closes: asyncpg raises
    `InterfaceError: cannot perform operation: another operation is in progress` on the next
    query. A stale pool is discarded and replaced rather than reused across loops, instead of
    awaiting its (already-broken) close."""
    global _pool, _pool_loop
    current_loop = asyncio.get_running_loop()
    if _pool is not None and _pool_loop is not current_loop:
        _pool = None
    if _pool is None:
        # asyncpg wants a plain postgres:// DSN; Prisma's DATABASE_URL is already that shape.
        _pool = await asyncpg.create_pool(settings.database_url, min_size=1, max_size=5)
        _pool_loop = current_loop
    return _pool


async def close_pool() -> None:
    global _pool, _pool_loop
    if _pool is not None:
        await _pool.close()
        _pool = None
        _pool_loop = None
