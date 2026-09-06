#!/usr/bin/env python3
"""Walks one synthetic patient through the whole CareFlow path against a running local stack:

    session -> consent -> interview (chest pain, tap answers) -> red flag -> triage queue
    -> document upload -> OCR/extraction callback -> timeline -> complete -> summary -> sign
    -> FHIR bundle -> ABHA care-context link

Talks to the real gateway over HTTP + the real Socket.IO event stream — no mocks of our own.
`make demo` runs this. `make dev` must already be running (this only checks, never starts,
the stack, so `make demo` fails fast and obviously instead of half-starting something).

The interview answers are the *tap* path (CLAUDE.md rule 6: every question has a tap
alternative, so this is real production code, not a shortcut) and are copied verbatim from
eval/scripts/chest_pain_acs_radiation.yaml — an existing red-flag fixture — rather than
invented here, so this and the eval harness can't silently drift apart.

Every document uploaded is a synthetic 1x1 PNG with no patient data of any kind (CLAUDE.md
rule 8) — OCR_PROVIDER is `stub` by default in this repo, so the pipeline being exercised here
is upload -> S3 -> Celery job -> GLiNER extraction -> timeline assembly -> gateway callback ->
WebSocket event, not real handwriting recognition. Said plainly in the printed output, not
just this docstring.
"""

from __future__ import annotations

import base64
import sys
import time
from pathlib import Path
from typing import Any

import httpx
import socketio
import yaml

GATEWAY_URL = "http://localhost:4000"
REPO_ROOT = Path(__file__).resolve().parents[2]
RED_FLAG_SCRIPT = REPO_ROOT / "eval" / "scripts" / "chest_pain_acs_radiation.yaml"

# A minimal valid 1x1 PNG — a synthetic stand-in for "the crumpled prescription", not an OCR
# fixture. Real OCR content only matters once OCR_PROVIDER != stub.
_ONE_PIXEL_PNG = base64.b64decode(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="
)

ws_events: list[tuple[str, Any]] = []


def banner(title: str) -> None:
    print(f"\n{'=' * 70}\n{title}\n{'=' * 70}")


def show(label: str, obj: Any) -> None:
    print(f"-- {label} --")
    print(obj if isinstance(obj, str) else obj)


def check_stack_up(client: httpx.Client) -> None:
    checks = {
        "gateway (4000)": f"{GATEWAY_URL}/health",
        "ai (8001)": "http://localhost:8001/health",
        "docai (8002)": "http://localhost:8002/health",
        "terminology (8003)": "http://localhost:8003/health",
    }
    down = []
    for name, url in checks.items():
        try:
            r = client.get(url, timeout=3.0)
            r.raise_for_status()
        except httpx.HTTPError:
            down.append(name)
    if down:
        print(f"ERROR: not reachable: {', '.join(down)}", file=sys.stderr)
        print("Start the stack first: make dev", file=sys.stderr)
        sys.exit(1)


def make_ws_client(session_id: str) -> socketio.Client:
    # session_id/department are handshake query params, not an auth payload
    # (services/gateway/src/websocket/events.gateway.ts) — join both rooms in one connect.
    sio = socketio.Client()
    for event in [
        "slot.filled",
        "question.next",
        "redflag.fired",
        "queue.updated",
        "document.processed",
        "session.resumed",
    ]:
        sio.on(event, lambda data, _e=event: ws_events.append((_e, data)))
    sio.connect(f"{GATEWAY_URL}?session_id={session_id}&department=general", transports=["websocket"])
    return sio


def drain_ws_events() -> None:
    if not ws_events:
        return
    print("-- WebSocket events received since last step --")
    for event, data in ws_events:
        print(f"   [{event}] {data}")
    ws_events.clear()


def main() -> None:
    client = httpx.Client(timeout=10.0)
    check_stack_up(client)

    banner("1. IDENTIFY — mock ABHA QR scan")
    resp = client.post(f"{GATEWAY_URL}/v1/identity/abha/qr", json={"qr_payload": "demo-qr-payload"})
    resp.raise_for_status()
    identity = resp.json()
    show("POST /v1/identity/abha/qr ->", identity)
    print(
        "NOTE (ADR 0007, known gap): this creates its own Patient row and is NOT yet wired to "
        "the intake session below — identify-by-QR and session creation are two separate "
        "patient records today. Shown here as its own step, not chained into the session."
    )

    banner("2. START SESSION")
    resp = client.post(f"{GATEWAY_URL}/v1/sessions")
    resp.raise_for_status()
    session = resp.json()
    show("POST /v1/sessions ->", session)
    session_id = session["session_id"]

    sio = make_ws_client(session_id)
    time.sleep(0.3)

    banner("3. CONSENT — three scopes, one tap-accept")
    resp = client.post(
        f"{GATEWAY_URL}/v1/sessions/{session_id}/consent",
        json={"scopes": ["history", "audio_recording", "abha_lookup"]},
    )
    resp.raise_for_status()
    print(f"POST /v1/sessions/{session_id}/consent -> 204 (scopes recorded)")

    banner("4. INTERVIEW — chief complaint -> chest_pain module")
    resp = client.post(
        f"{GATEWAY_URL}/v1/sessions/{session_id}/answer",
        headers={"Idempotency-Key": "demo-chief-complaint"},
        json={"slot_id": "chief_complaint", "value": "chest_pain", "input_mode": "tap"},
    )
    resp.raise_for_status()
    show("POST /v1/sessions/.../answer (chief_complaint=chest_pain) ->", resp.json())
    time.sleep(0.3)
    drain_ws_events()

    banner("5. INTERVIEW — chest_pain slots (answers from eval/scripts/chest_pain_acs_radiation.yaml)")
    script = yaml.safe_load(RED_FLAG_SCRIPT.read_text())
    fired_flags: list[dict[str, Any]] = []
    for i, ans in enumerate(script["answers"]):
        resp = client.post(
            f"{GATEWAY_URL}/v1/sessions/{session_id}/answer",
            headers={"Idempotency-Key": f"demo-answer-{i}"},
            json={"slot_id": ans["slot_id"], "value": ans["value"], "input_mode": ans["input_mode"]},
        )
        resp.raise_for_status()
        body = resp.json()
        print(f"  answered {ans['slot_id']}={ans['value']!r} -> next: "
              f"{body['next_question']['question'][:60] if body['next_question'].get('question') else None} "
              f"| progress {body['progress'].get('percent')}% "
              f"| red_flags this turn: {[f['rule_id'] for f in body['red_flags']]}")
        fired_flags.extend(body["red_flags"])
        time.sleep(0.15)

    print(f"\nExpected red flag: {script['expected_red_flags']}")
    print(f"Actually fired:    {[f['rule_id'] for f in fired_flags]}")
    assert set(script["expected_red_flags"]) <= {f["rule_id"] for f in fired_flags}, \
        "red flag did not fire as expected — this is a real failure, not cosmetic"
    time.sleep(0.3)
    drain_ws_events()

    banner("6. TRIAGE QUEUE — escalated token")
    resp = client.get(f"{GATEWAY_URL}/v1/visits/queue", params={"department": "general"})
    resp.raise_for_status()
    queue = resp.json()
    show("GET /v1/visits/queue?department=general -> (a bare array — note: the queue.updated "
         "WS event wraps the same tokens in {tokens: [...]}, the REST GET does not) ", queue)
    my_token = next(t for t in queue if any(
        rf["id"] == fired_flags[0]["id"] for rf in t["red_flags"]
    ))
    visit_id = my_token["visit_id"]
    print(f"\nResolved visit_id={visit_id} from the queue (session payload does not expose it — "
          "see docs/18-frontend-handoff.md's 'known gaps' section).")

    banner("7. DOCUMENT — synthetic upload (OCR_PROVIDER=stub, see module docstring)")
    resp = client.post(
        f"{GATEWAY_URL}/v1/sessions/{session_id}/documents",
        files={"file": ("synthetic-prescription.png", _ONE_PIXEL_PNG, "image/png")},
        data={"doc_type_hint": "prescription"},
    )
    resp.raise_for_status()
    upload = resp.json()
    show("POST /v1/sessions/.../documents ->", upload)
    document_id = upload["document_id"]

    status = None
    for _ in range(30):
        resp = client.get(f"{GATEWAY_URL}/v1/documents/{document_id}")
        resp.raise_for_status()
        status = resp.json()
        if status["status"] != "queued":
            break
        time.sleep(0.5)
    show(f"GET /v1/documents/{document_id} (polled until settled) ->", status)
    drain_ws_events()

    banner("8. TIMELINE")
    resp = client.get(f"{GATEWAY_URL}/v1/sessions/{session_id}/timeline")
    resp.raise_for_status()
    show("GET /v1/sessions/.../timeline ->", resp.json())

    banner("9. COMPLETE — generate summary")
    resp = client.post(f"{GATEWAY_URL}/v1/sessions/{session_id}/complete")
    resp.raise_for_status()
    complete = resp.json()
    show("POST /v1/sessions/.../complete ->", complete)

    banner("10. CLINICIAN SUMMARY")
    resp = client.get(f"{GATEWAY_URL}/v1/visits/{visit_id}/summary")
    resp.raise_for_status()
    summary = resp.json()
    show(f"GET /v1/visits/{visit_id}/summary ->", summary)

    banner("11. SIGN — physician signs, FHIR bundle assembled + validated against HAPI")
    resp = client.post(f"{GATEWAY_URL}/v1/visits/{visit_id}/sign", json={"signed_by": "Dr. Demo Physician"})
    resp.raise_for_status()
    signed = resp.json()
    show(f"POST /v1/visits/{visit_id}/sign ->", signed)

    banner("DONE")
    print(f"session_id:          {session_id}")
    print(f"visit_id:            {visit_id}")
    print(f"document_id:         {document_id}")
    print(f"fhir_bundle_id:      {signed['fhir_bundle_id']}")
    print(f"abdm_status:         {signed['abdm_status']}")
    print(f"care_context_status: {signed['care_context_status']}")
    sio.disconnect()


if __name__ == "__main__":
    main()
