"""Shared helpers for the scripts in this folder. Reads the repo-root .env without any dependency and
never prints a value: callers may print NAMES, hosts and counts only."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def load_env() -> dict[str, str]:
    env: dict[str, str] = {}
    for line in (ROOT / ".env").read_text().splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            env[k.strip()] = v.strip().split(" #")[0].strip()
    return env


def pg_url(env: dict[str, str], name: str = "DATABASE_URL") -> str:
    """asyncpg wants postgres://, and knows nothing of Prisma's ?pgbouncer / ?connection_limit params."""
    return re.sub(r"\?.*$", "", env[name].replace("postgresql://", "postgres://"))


def host_of(url: str) -> str:
    m = re.search(r"@([^:/?]+)", url)
    return m.group(1) if m else "?"


def is_supabase(env: dict[str, str]) -> bool:
    return "supabase" in env.get("DATABASE_URL", "")
