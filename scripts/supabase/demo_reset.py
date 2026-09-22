#!/usr/bin/env python3
"""`make demo-reset` for Supabase — a clean slate for a demo.

CLEARS:  visits, patients, sessions, answers, consents, documents + extractions, red flags, summaries, the
         Ayurvedic exam records, the audit log, AI provider telemetry, and every object in the two storage
         buckets (voice notes and document photos).
KEEPS:   all reference data — NAMASTE concepts + embeddings, concept maps, the drug / AFI / plant dictionaries —
         and the schema. It never touches those tables (their row counts are checked before and after and the
         script aborts if they changed).

Destructive by design, so it refuses to run without --yes, and it prints the database host (never the URL or
password) and what it is about to delete. Needs boto3 (run it with services/docai's venv — `make demo-reset`
does)."""
from __future__ import annotations

import argparse
import asyncio
import sys

import asyncpg
import boto3
from botocore.config import Config

from _env import host_of, load_env, pg_url

ENV = load_env()
OPERATIONAL = ["red_flag", "answer", "extraction", "document", "consent", "ayurveda_exam_field", "summary",
               "intake_session", "visit", "patient", "audit_log", "provider_cascade_event"]
REFERENCE = ["concept", "concept_map", "dictionary_entry"]


def buckets() -> list[str]:
    return [ENV.get("S3_BUCKET_AUDIO", "intake-audio"), ENV.get("S3_BUCKET_DOCUMENTS", "intake-documents")]


def s3():
    return boto3.client(
        "s3", endpoint_url=ENV["S3_ENDPOINT"], region_name=ENV.get("S3_REGION", "us-east-1"),
        aws_access_key_id=ENV.get("S3_ACCESS_KEY_ID") or ENV.get("S3_ACCESS_KEY"),
        aws_secret_access_key=ENV.get("S3_SECRET_ACCESS_KEY") or ENV.get("S3_SECRET_KEY"),
        config=Config(signature_version="s3v4", s3={"addressing_style": "path"}),
    )


def empty_bucket(client, bucket: str) -> int:
    deleted, token = 0, None
    while True:
        page = client.list_objects_v2(Bucket=bucket, **({"ContinuationToken": token} if token else {}))
        keys = [{"Key": o["Key"]} for o in page.get("Contents", [])]
        if keys:
            client.delete_objects(Bucket=bucket, Delete={"Objects": keys})
            deleted += len(keys)
        if not page.get("IsTruncated"):
            return deleted
        token = page["NextContinuationToken"]


async def main(yes: bool) -> int:
    conn = await asyncpg.connect(pg_url(ENV), statement_cache_size=0, timeout=20)
    counts = {t: await conn.fetchval(f"select count(*) from {t}") for t in OPERATIONAL}
    ref_before = {t: await conn.fetchval(f"select count(*) from {t}") for t in REFERENCE}
    print(f"target database : {host_of(ENV['DATABASE_URL'])}")
    print("will delete     :", {k: v for k, v in counts.items() if v})
    print("will keep       :", ref_before)
    if not yes:
        print("\nRefusing to run without --yes (this deletes data).")
        return 2

    await conn.execute("TRUNCATE " + ", ".join(OPERATIONAL))  # one statement: FKs among these tables are satisfied together
    ref_after = {t: await conn.fetchval(f"select count(*) from {t}") for t in REFERENCE}
    await conn.close()
    if ref_after != ref_before:
        print("ABORT: reference data changed", ref_before, ref_after)
        return 1

    client = s3()
    removed = {b: empty_bucket(client, b) for b in buckets()}
    print("cleared rows    :", sum(counts.values()), "| storage objects removed:", removed)
    print("reference data  : unchanged", ref_after)
    return 0


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--yes", action="store_true")
    sys.exit(asyncio.run(main(ap.parse_args().yes)))
