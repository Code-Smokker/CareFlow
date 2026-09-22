"""The one S3 client for this service — Supabase Storage (S3 protocol) or local MinIO, chosen purely by
env. Path-style addressing and SigV4 are required by both."""

from __future__ import annotations

import boto3
from botocore.config import Config

from app.config import settings


def s3_client():
    return boto3.client(
        "s3",
        endpoint_url=settings.s3_endpoint,
        region_name=settings.s3_region,
        aws_access_key_id=settings.resolved_s3_access_key_id,
        aws_secret_access_key=settings.resolved_s3_secret_access_key,
        config=Config(signature_version="s3v4", s3={"addressing_style": "path"}),
    )
