#!/usr/bin/env python3
"""`make storage-setup` — creates the two PRIVATE buckets with their size and MIME limits. Idempotent:
running it again only re-asserts the same settings. Uses the service role key over Supabase's Storage REST
API (the S3 protocol has no way to set a bucket's size limit or MIME allow-list). Never prints a key.

  intake-audio      private · 10 MB · audio/webm, audio/ogg, audio/mp4, audio/wav
  intake-documents  private · 15 MB · image/jpeg, image/png, image/webp, application/pdf

No public bucket, and no storage RLS policy that grants anon/authenticated anything — only the gateway
touches storage. For STORAGE_PROVIDER=minio the gateway creates its buckets itself on start."""
from __future__ import annotations

import asyncio
import json
import sys
import urllib.error
import urllib.request

from _env import load_env, pg_url

ENV = load_env()
MB = 1024 * 1024
BUCKETS = [
    {"id": ENV.get("S3_BUCKET_AUDIO", "intake-audio"), "public": False, "file_size_limit": 10 * MB,
     "allowed_mime_types": ["audio/webm", "audio/ogg", "audio/mp4", "audio/wav"]},
    {"id": ENV.get("S3_BUCKET_DOCUMENTS", "intake-documents"), "public": False, "file_size_limit": 15 * MB,
     "allowed_mime_types": ["image/jpeg", "image/png", "image/webp", "application/pdf"]},
]


def call(method: str, path: str, body: dict | None = None):
    key = ENV["SUPABASE_SERVICE_ROLE_KEY"]
    req = urllib.request.Request(
        ENV["SUPABASE_URL"].rstrip("/") + "/storage/v1" + path, method=method,
        data=json.dumps(body).encode() if body is not None else None,
        headers={"apikey": key, "Authorization": f"Bearer {key}", "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return r.status, json.loads(r.read() or "null")
    except urllib.error.HTTPError as e:
        return e.code, None


async def policies() -> list[str]:
    try:
        import asyncpg
    except ImportError:
        return ["(asyncpg not available — policy check skipped)"]
    conn = await asyncpg.connect(pg_url(ENV), statement_cache_size=0, timeout=20)
    rows = await conn.fetch("select policyname from pg_policies where schemaname='storage'")
    await conn.close()
    return [r["policyname"] for r in rows]


def main() -> int:
    if ENV.get("STORAGE_PROVIDER", "supabase" if "supabase.co" in ENV.get("S3_ENDPOINT", "") else "minio") != "supabase":
        print("STORAGE_PROVIDER is not supabase — the gateway creates its MinIO buckets on start. Nothing to do.")
        return 0
    bad = 0
    for spec in BUCKETS:
        status, existing = call("GET", f"/bucket/{spec['id']}")
        payload = {k: v for k, v in spec.items() if k != "id"}
        if status == 200:
            status, _ = call("PUT", f"/bucket/{spec['id']}", payload)
            action = "updated (already existed)"
        else:
            status, _ = call("POST", "/bucket", {"id": spec["id"], "name": spec["id"], **payload})
            action = "created"
        ok = status in (200, 201)
        _, got = call("GET", f"/bucket/{spec['id']}")
        good = bool(got) and got.get("public") is False and got.get("file_size_limit") == spec["file_size_limit"] and sorted(got.get("allowed_mime_types") or []) == sorted(spec["allowed_mime_types"])
        print(f"{spec['id']:18} {action if ok else f'FAILED (HTTP {status})':26} private={got and got.get('public') is False}  limit={got and got.get('file_size_limit', 0) // MB} MB  mime={len((got or {}).get('allowed_mime_types') or [])} types  {'OK' if ok and good else 'MISMATCH'}")
        bad += 0 if ok and good else 1
    pol = asyncio.run(policies())
    print(f"storage.objects policies (must be none — only the gateway touches storage): {pol or 'none'}")
    if pol and not pol[0].startswith("("):
        bad += 1
    return 1 if bad else 0


sys.exit(main())
