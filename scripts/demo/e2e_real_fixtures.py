#!/usr/bin/env python3
"""The gateway-driven E2E docs/13-demo-script.md describes, run against real fixtures instead
of synthetic stand-ins — the walk `make demo` (scripts/demo/demo.py) deliberately does NOT do
(that script's own docstring: "every document uploaded is a synthetic 1x1 PNG... OCR_PROVIDER
is stub by default"). This one:

  - transcribes the real Hindi audio clip through the real ai service (Sarvam STT)
  - fills two real slots (duration, associated) from that real transcript through the real
    /fill-slot cascade (services/ai/app/llm/fill_slot.py)
  - submits those as input_mode=voice answers through the gateway, remaining chest_pain slots
    as tap (same fixture values as eval/scripts/chest_pain_acs_radiation.yaml, so the red flag
    fires deterministically — CLAUDE.md rule 6 supports mixed voice/tap input per session, this
    isn't a shortcut)
  - uploads the real prescription photo through the gateway's document endpoint, exercising the
    real hosted OCR tier end to end, S3 ref included (the bug fixed in
    services/docai/app/ocr/hosted.py this session)
  - completes the session, reads the clinician summary, signs it, and reports whether the
    assembled FHIR bundle validated against the local HAPI server with zero issues

Never pass eval/real-inputs/* paths directly to any service call — this script's own caller
copies the two fixtures into a temp directory first and passes THOSE paths in. Passing the
eval/real-inputs path directly to a script that can write/move files is what deleted the
original audio fixture earlier this session.

`make dev` must already be running. Talks to the real gateway (session/consent/answer/document/
complete/summary/sign) and the real ai service (/transcribe, /fill-slot) directly — the gateway
does not itself proxy either of those two calls (services/gateway/src/ai/ai-service.client.ts
only calls evaluate-flags and summarise), matching the architecture: the browser/PWA client
calls ai service directly for ASR/slot-fill, then submits the resolved value to the gateway.
That is what "through the gateway, end to end" means for everything except those two calls.
"""

from __future__ import annotations

import sys
import time
from pathlib import Path
from typing import Any

import httpx

GATEWAY_URL = "http://localhost:4000"
AI_URL = "http://localhost:8001"

# Same red-flag fixture demo.py uses (eval/scripts/chest_pain_acs_radiation.yaml), in the
# ontology module's real slot order (packages/ontology/modules/chest_pain.yaml) — the interview
# is a strict state machine (CLAUDE.md rule 1) and rejects an out-of-order answer with
# slot_mismatch, confirmed live. `duration` and `associated` are voice=True: their values come
# from the real ASR + /fill-slot calls above, substituted into this same sequence in their
# normal turn rather than answered separately.
_INTERVIEW_ORDER = [
    {"slot_id": "site", "value": "central_chest", "voice": False},
    {"slot_id": "onset", "value": "gradual", "voice": False},
    {"slot_id": "duration", "value": None, "voice": True},  # filled from real transcript
    {"slot_id": "character", "value": "tightness", "voice": False},
    {"slot_id": "radiation", "value": "left_arm", "voice": False},
    {"slot_id": "associated", "value": None, "voice": True},  # filled from real transcript
    {"slot_id": "exacerbating", "value": ["rest"], "voice": False},
    {"slot_id": "timing", "value": "constant", "voice": False},
    {"slot_id": "severity", "value": 5, "voice": False},
]
_EXPECTED_RED_FLAG = "acs_radiation"

_DURATION_SCHEMA = {"type": "string", "enum": ["30_min", "1_hour", "few_hours", "1_day", "2_days", "3_days", "1_week"]}
_ASSOCIATED_SCHEMA = {
    "type": "array",
    "items": {"type": "string", "enum": ["sweating", "nausea", "breathlessness", "palpitations", "dizziness", "none"]},
}

timings: dict[str, float] = {}


def banner(title: str) -> None:
    print(f"\n{'=' * 70}\n{title}\n{'=' * 70}")


def timed(label: str):
    class _Timer:
        def __enter__(self):
            self.start = time.perf_counter()
            return self

        def __exit__(self, *exc):
            timings[label] = time.perf_counter() - self.start
            print(f"  [{label}] {timings[label] * 1000:.0f}ms")

    return _Timer()


def check_stack_up(client: httpx.Client) -> None:
    checks = {
        "gateway (4000)": f"{GATEWAY_URL}/health",
        "ai (8001)": f"{AI_URL}/health",
        "docai (8002)": "http://localhost:8002/health",
        "hapi-fhir (8090)": "http://localhost:8090/fhir/metadata",
    }
    down = [name for name, url in checks.items() if not _ok(client, url)]
    if down:
        print(f"ERROR: not reachable: {', '.join(down)}", file=sys.stderr)
        print("Start the stack first: make dev", file=sys.stderr)
        sys.exit(1)


def _ok(client: httpx.Client, url: str) -> bool:
    try:
        client.get(url, timeout=3.0).raise_for_status()
        return True
    except httpx.HTTPError:
        return False


def main(audio_path: Path, image_path: Path) -> None:
    for p in (audio_path, image_path):
        if not p.is_file():
            print(f"ERROR: fixture not found at {p}", file=sys.stderr)
            sys.exit(1)

    client = httpx.Client(timeout=60.0)
    check_stack_up(client)

    banner("1. TRANSCRIBE — real Hindi audio, real Sarvam STT")
    with timed("transcribe"):
        resp = client.post(f"{AI_URL}/transcribe", json={"audio_ref": str(audio_path), "language": "hi-IN"})
        resp.raise_for_status()
        transcript = resp.json()
    print(f"  text: {transcript['text']!r}  confidence: {transcript['confidence']}")

    banner("2. FILL-SLOT — duration, from the real transcript, real LLM cascade")
    with timed("fill_slot_duration"):
        resp = client.post(
            f"{AI_URL}/fill-slot",
            json={"slot_schema": _DURATION_SCHEMA, "utterance": transcript["text"], "context": {}},
        )
        resp.raise_for_status()
        duration_result = resp.json()
    print(f"  value: {duration_result['value']!r}  confidence: {duration_result['confidence']}")
    assert duration_result["value"] is not None, "real voice pipeline failed to extract duration"

    banner("3. FILL-SLOT — associated symptoms, from the real transcript")
    with timed("fill_slot_associated"):
        resp = client.post(
            f"{AI_URL}/fill-slot",
            json={"slot_schema": _ASSOCIATED_SCHEMA, "utterance": transcript["text"], "context": {}},
        )
        resp.raise_for_status()
        associated_result = resp.json()
    print(f"  value: {associated_result['value']!r}  confidence: {associated_result['confidence']}")
    assert associated_result["value"] == ["sweating"], (
        f"expected real voice pipeline to extract ['sweating'], got {associated_result['value']!r} — "
        "the red flag below depends on this"
    )

    banner("4. START SESSION + CONSENT")
    with timed("session_create"):
        resp = client.post(f"{GATEWAY_URL}/v1/sessions")
        resp.raise_for_status()
        session_id = resp.json()["session_id"]
    resp = client.post(
        f"{GATEWAY_URL}/v1/sessions/{session_id}/consent",
        json={"scopes": ["history", "audio_recording", "documents"]},
    )
    resp.raise_for_status()
    print(f"  session_id: {session_id}")

    banner("5. INTERVIEW — chief_complaint (tap) + real-voice duration/associated + rest (tap)")
    with timed("interview"):
        resp = client.post(
            f"{GATEWAY_URL}/v1/sessions/{session_id}/answer",
            headers={"Idempotency-Key": "e2e-chief-complaint"},
            json={"slot_id": "chief_complaint", "value": "chest_pain", "input_mode": "tap"},
        )
        resp.raise_for_status()

        voice_values = {"duration": duration_result, "associated": associated_result}
        fired_flags: list[dict[str, Any]] = []
        for i, ans in enumerate(_INTERVIEW_ORDER):
            if ans["voice"]:
                result = voice_values[ans["slot_id"]]
                payload = {
                    "slot_id": ans["slot_id"],
                    "value": result["value"],
                    "input_mode": "voice",
                    "confidence": result["confidence"],
                }
                tag = "voice"
            else:
                payload = {"slot_id": ans["slot_id"], "value": ans["value"], "input_mode": "tap"}
                tag = "tap"
            resp = client.post(
                f"{GATEWAY_URL}/v1/sessions/{session_id}/answer",
                headers={"Idempotency-Key": f"e2e-{i}"},
                json=payload,
            )
            resp.raise_for_status()
            body = resp.json()
            fired_flags.extend(body["red_flags"])
            print(f"  [{tag}] {payload['slot_id']}={payload['value']!r}")

    fired_ids = {f["rule_id"] for f in fired_flags}
    print(f"\n  expected red flag: {_EXPECTED_RED_FLAG}  fired: {sorted(fired_ids)}")
    assert _EXPECTED_RED_FLAG in fired_ids, "red flag did not fire — real voice slots didn't feed the rule correctly"

    banner("6. TRIAGE QUEUE")
    resp = client.get(f"{GATEWAY_URL}/v1/visits/queue", params={"department": "general"})
    resp.raise_for_status()
    queue = resp.json()
    my_token = next(t for t in queue if any(rf["id"] == fired_flags[0]["id"] for rf in t["red_flags"]))
    visit_id = my_token["visit_id"]
    print(f"  visit_id: {visit_id}")

    banner("7. DOCUMENT — real prescription photo, real hosted OCR, through the gateway -> S3 -> docai")
    with timed("document_upload"):
        resp = client.post(
            f"{GATEWAY_URL}/v1/sessions/{session_id}/documents",
            files={"file": ("prescription.png", image_path.read_bytes(), "image/png")},
            data={"doc_type_hint": "prescription"},
        )
        resp.raise_for_status()
        document_id = resp.json()["document_id"]
    print(f"  document_id: {document_id}")

    with timed("document_processing"):
        status = None
        for _ in range(60):
            resp = client.get(f"{GATEWAY_URL}/v1/documents/{document_id}")
            resp.raise_for_status()
            status = resp.json()
            if status["status"] != "queued":
                break
            time.sleep(1.0)
    print(f"  final status: {status['status'] if status else 'unknown'}")
    if status and status.get("status") == "failed":
        print(f"  WARNING: document processing failed: {status}")

    banner("8. TIMELINE")
    resp = client.get(f"{GATEWAY_URL}/v1/sessions/{session_id}/timeline")
    resp.raise_for_status()
    timeline = resp.json()
    print(f"  {len(timeline)} timeline event(s)")

    banner("9. COMPLETE — generate summary")
    with timed("complete"):
        resp = client.post(f"{GATEWAY_URL}/v1/sessions/{session_id}/complete")
        resp.raise_for_status()

    banner("10. CLINICIAN SUMMARY")
    with timed("summary"):
        resp = client.get(f"{GATEWAY_URL}/v1/visits/{visit_id}/summary")
        resp.raise_for_status()
        summary = resp.json()
    chief_complaint = next((f["value"] for f in summary.get("fields", []) if f["field_path"] == "chief_complaint"), None)
    print(f"  chief_complaint: {chief_complaint}  ({len(summary.get('fields', []))} field(s) total)")

    banner("11. SIGN — FHIR bundle assembled + validated against HAPI")
    hapi_issue_count = 0
    with timed("sign_and_validate"):
        resp = client.post(f"{GATEWAY_URL}/v1/visits/{visit_id}/sign", json={"signed_by": "Dr. E2E Physician"})
        if resp.status_code == 422:
            body = resp.json()
            issues = body.get("error", {}).get("details", {}).get("issues", [])
            hapi_issue_count = len(issues)
            print(f"  FHIR bundle FAILED validation: {hapi_issue_count} issue(s)")
            for issue in issues:
                print(f"    - {issue}")
        else:
            resp.raise_for_status()
            signed = resp.json()
            print(f"  fhir_bundle_id: {signed['fhir_bundle_id']}")
            print("  HAPI validation: PASSED (0 issues)")

    banner("DONE — PER-STAGE TIMINGS")
    total = 0.0
    for label, seconds in timings.items():
        print(f"  {label:<24} {seconds * 1000:8.0f} ms")
        total += seconds
    print(f"  {'TOTAL':<24} {total * 1000:8.0f} ms")
    print(f"\n  session_id:              {session_id}")
    print(f"  visit_id:                {visit_id}")
    print(f"  document_id:             {document_id}")
    print(f"  document_status:         {status['status'] if status else 'unknown'}")
    print(f"  hapi_validation_issues:  {hapi_issue_count}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("usage: e2e_real_fixtures.py <path-to-audio-clip> <path-to-prescription-image>", file=sys.stderr)
        sys.exit(1)
    main(Path(sys.argv[1]), Path(sys.argv[2]))
