"""Tests write real rows (and real audit_log rows, which can never be deleted), so they must NEVER run against
the Supabase project that holds patient data. This runs before the app's settings are read: tests default to the
local Docker Postgres + MinIO. Override with TEST_DATABASE_URL / TEST_S3_ENDPOINT; set ALLOW_TESTS_ON_REMOTE_DB=1
only if you really mean to test a hosted database."""

import os

_LOCAL_DB = "postgresql://careflow:careflow@localhost:5433/careflow"
_url = os.environ.get("TEST_DATABASE_URL", _LOCAL_DB)
if "supabase." in _url and os.environ.get("ALLOW_TESTS_ON_REMOTE_DB") != "1":
    raise RuntimeError("Refusing to run tests against a Supabase database. Unset TEST_DATABASE_URL to use local Docker Postgres.")
os.environ["DATABASE_URL"] = _url
os.environ["DIRECT_URL"] = os.environ.get("TEST_DIRECT_URL", _url)
if not os.environ.get("TEST_S3_ENDPOINT"):
    os.environ.update(S3_ENDPOINT="http://localhost:9000", S3_REGION="us-east-1", S3_ACCESS_KEY_ID="careflow", S3_SECRET_ACCESS_KEY="careflow123")
    os.environ.pop("S3_ACCESS_KEY", None)
    os.environ.pop("S3_SECRET_KEY", None)
else:
    os.environ["S3_ENDPOINT"] = os.environ["TEST_S3_ENDPOINT"]


import boto3 as _boto3
import pytest as _pytest
from botocore.config import Config as _Config


@_pytest.fixture(scope="session", autouse=True)
def _ensure_test_buckets():
    """On the local MinIO the buckets do not exist until something creates them (the gateway does at boot)."""
    if "supabase" in os.environ["S3_ENDPOINT"]:
        return
    client = _boto3.client(
        "s3", endpoint_url=os.environ["S3_ENDPOINT"], region_name=os.environ.get("S3_REGION", "us-east-1"),
        aws_access_key_id=os.environ["S3_ACCESS_KEY_ID"], aws_secret_access_key=os.environ["S3_SECRET_ACCESS_KEY"],
        config=_Config(s3={"addressing_style": "path"}),
    )
    existing = {b["Name"] for b in client.list_buckets()["Buckets"]}
    for name in ("intake-audio", "intake-documents"):
        if name not in existing:
            client.create_bucket(Bucket=name)
