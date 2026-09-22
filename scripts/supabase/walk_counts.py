#!/usr/bin/env python3
"""Read-only proof that a walk-through wrote REAL data: row counts for the operational tables, storage objects per
bucket, and the audit log grouped by action. Prints the database host, table names and counts only — never a
value, URL, key or patient field. Run it with services/docai's venv (it needs asyncpg + boto3):

    services/docai/.venv/bin/python scripts/supabase/walk_counts.py
"""
from __future__ import annotations

import asyncio

import asyncpg
import boto3
from botocore.config import Config

from _env import host_of, load_env, pg_url

ENV = load_env()
TABLES = ["patient", "visit", "intake_session", "consent", "answer", "document", "extraction", "red_flag",
          "summary", "ayurveda_exam_field", "audit_log"]


async def main() -> None:
    conn = await asyncpg.connect(pg_url(ENV), statement_cache_size=0)
    print("database host :", host_of(ENV["DATABASE_URL"]))
    for t in TABLES:
        print(f"  {t:<22}{await conn.fetchval(f'select count(*) from {t}')}")
    print("answers by input_mode:", {r["input_mode"]: r["n"] for r in await conn.fetch(
        "select input_mode, count(*) n from answer group by 1 order by 1")})
    print("answers linked to a stored voice note (audio_uri set):",
          await conn.fetchval("select count(*) from answer where audio_uri is not null"))
    print("audit_log by action:")
    for r in await conn.fetch("select action, count(*) n from audit_log group by 1 order by 1"):
        print(f"  {r['action']:<28}{r['n']}")
    await conn.close()

    client = boto3.client(
        "s3", endpoint_url=ENV["S3_ENDPOINT"], region_name=ENV.get("S3_REGION", "us-east-1"),
        aws_access_key_id=ENV.get("S3_ACCESS_KEY_ID") or ENV.get("S3_ACCESS_KEY"),
        aws_secret_access_key=ENV.get("S3_SECRET_ACCESS_KEY") or ENV.get("S3_SECRET_KEY"),
        config=Config(signature_version="s3v4", s3={"addressing_style": "path"}),
    )
    print("storage objects:")
    for bucket in (ENV.get("S3_BUCKET_AUDIO", "intake-audio"), ENV.get("S3_BUCKET_DOCUMENTS", "intake-documents")):
        page = client.list_objects_v2(Bucket=bucket)
        print(f"  {bucket:<20}{page.get('KeyCount', 0)}")


if __name__ == "__main__":
    asyncio.run(main())
