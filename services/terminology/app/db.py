"""Raw SQL against the concept/concept_map tables via asyncpg — gateway/Prisma owns the
migration (services/gateway/prisma/schema.prisma), this service reads and writes them directly,
never migrates them (same convention as services/docai/app/dictionary/db.py, documented in
schema.prisma's own header comment)."""

from __future__ import annotations

import asyncpg

from app.config import settings

_pool: asyncpg.Pool | None = None


async def get_pool() -> asyncpg.Pool:
    global _pool
    if _pool is None:
        # asyncpg wants a plain postgres:// DSN; Prisma's DATABASE_URL is already that shape.
        _pool = await asyncpg.create_pool(settings.database_url, min_size=1, max_size=5)
    return _pool


async def close_pool() -> None:
    global _pool
    if _pool is not None:
        await _pool.close()
        _pool = None
