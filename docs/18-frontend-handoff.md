# 18 — Frontend handoff

Everything the four Next.js apps (`apps/intake`, `apps/clinician`, `apps/triage`, `apps/admin`
— not scaffolded yet, apps/README.md) need to start building against the real backend. Every
request/response and WebSocket payload below is copied verbatim from a live run of `make demo`
(scripts/demo/demo.py) against the local stack on 2026-09-07, not hand-written from the spec —
where a shape in `packages/contracts/openapi/gateway.yaml` is the authority (it is), it's
noted, but the JSON here is real.

CORS is configured for browser-origin requests with credentials (`services/gateway/src/
main.ts`, `src/websocket/events.gateway.ts`) — see "CORS" below before you debug a fetch that
works in curl but not the browser.

---

## Ports and base URLs

| Service | URL | Notes |
|---|---|---|
| Gateway (HTTP) | `http://localhost:4000` | All REST calls, prefixed `/v1` except `/health` |
| Gateway (WebSocket) | `ws://localhost:4000` | Socket.IO, query-param handshake, see below |
| ai service | `http://localhost:8001` | Not called directly by any frontend — gateway proxies it |
| docai service | `http://localhost:8002` | Same — document processing is gateway-mediated |
| terminology service | `http://localhost:8003` | Same |
| HAPI FHIR UI | `http://localhost:8090` | For eyeballing an assembled bundle, not a frontend dependency |
| intake (you'll run this) | `http://localhost:3000` | apps/README.md |
| clinician | `http://localhost:3001` | |
| triage | `http://localhost:3002` | |
| admin | `http://localhost:3003` | |

Start the backend with `make dev` (starts infra + gateway + ai + docai + terminology, waits for
every health check, prints this same table). `make dev-down` stops it; infra (Postgres/Redis/
MinIO/HAPI) stays up — `make down` for that.

### Env vars the frontend needs

Not established elsewhere yet — this is the convention to use. Put in `apps/intake/.env.local`
(Next.js convention; each app gets its own):

```
NEXT_PUBLIC_GATEWAY_URL=http://localhost:4000
NEXT_PUBLIC_GATEWAY_WS_URL=ws://localhost:4000
```

No API key or auth token needed for local dev — there is no RBAC/auth yet (Day 4,
`packages/contracts/openapi/gateway.yaml`'s note on `POST /v1/redflags/{id}/acknowledge`).
`actor_id`/`actor_role` on clinician-side calls are plain caller-supplied strings for now.

### CORS

`services/gateway/src/main.ts` calls `app.enableCors({ origin: [...], credentials: true })`.
The origin list is `PUBLIC_WEB_URL` (`.env`, defaults to `http://localhost:3000`) plus any
comma-separated `CORS_ORIGINS`. It is **not** `origin: "*"` — wildcard can't be combined with
`credentials: true` (browsers reject it outright), and the allow-list is what makes credentialed
fetches (cookies, once session auth exists) work at all. If you scaffold `clinician`/`triage`/
`admin` on ports 3001–3003, add them to `CORS_ORIGINS` in `.env` or their fetches will fail
silently with an opaque CORS error, not a 4xx you can read.

Verified live from a browser-origin request (not curl without an `Origin` header, which
succeeds even against a broken CORS config and proves nothing):

```
$ curl -i http://localhost:4000/health -H "Origin: http://localhost:3000"
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Credentials: true
Vary: Origin
...
{"status":"ok","database":"ok"}
```

The Socket.IO handshake (including its `polling` fallback before the `websocket` upgrade)
carries the same headers — verified against `GET /socket.io/?EIO=4&transport=polling` with the
same `Origin` header.

---

## Session lifecycle

### Create

```
POST /v1/sessions
```
No body. Response (real, from a live run):
```json
{
  "session_id": "2e48c1aa-156f-48cc-a198-181f9aa38065",
  "resume_token": "kKiEjmlHW2Z467V9UrnRFh52QKj__PsX",
  "qr_url": "http://localhost:3000/intake/2e48c1aa-156f-48cc-a198-181f9aa38065?rt=kKiEjmlHW2Z467V9UrnRFh52QKj__PsX"
}
```
`qr_url` is exactly what the token-slip QR should encode — the intake route + `?rt=` resume
token, already assembled server-side.

Behind the scenes (ADR 0007): this auto-creates a placeholder `Patient` and `Visit` row with no
identity yet. `POST /v1/identity/*` (ABHA QR/OTP or manual registration) is a **separate**
identity resolution step today — known gap, see below — it does not currently attach itself to
this session's placeholder Patient/Visit.

### Resume (rebind to a new device)

```
POST /v1/sessions/{id}/resume
{ "resume_token": "kKiEjmlHW2Z467V9UrnRFh52QKj__PsX" }
```
Real response:
```json
{
  "session_id": "179e1d8a-9e24-48af-9d52-ad552a54ce5d",
  "status": "created",
  "language": null,
  "progress": { "percent": 0, "module_id": "intake", "total_slots": 1, "completed_slots": 0 },
  "consent_scopes": [],
  "patient_id": "350fb874-f190-486b-a61a-5623140f4942"
}
```
`GET /v1/sessions/{id}` returns this same `Session` shape at any time, not just on resume.

Resuming also broadcasts `session.resumed` over the WebSocket to every other device already
joined to that session's room — real captured payload: `{"device_id": "cc87a094-374d-4d94-a0a7-103fad43b4c9"}`.
That's how a kiosk mid-interview would learn "the patient picked this up on their phone,
here's the new device" if you want to react to it (e.g. show a "continued on your phone"
state).

### Consent

```
POST /v1/sessions/{id}/consent
{ "scopes": ["history", "audio_recording", "abha_lookup"] }
```
`scopes` is a subset of `history | audio_recording | documents | abha_lookup |
research_deidentified`. Returns `204`, no body. `GET /v1/sessions/{id}/consent/resource` gets
you the assembled FHIR `Consent` resource back if you need to show/print it.

### Set language

```
POST /v1/sessions/{id}/language
{ "language": "hi" }
```
BCP-47 tag (e.g. `hi`, `hi-Latn`). `204`, no body.

---

## The interview loop — `POST /answer`

This is the hot path (p95 budget 1.2s) — one request per question, the response carries the
next question in the same round trip. **`Idempotency-Key` header is required**, not optional —
flaky hospital wifi means retries, and a retried request with a previously-seen key is a no-op
against already-advanced state rather than double-counting the answer (ADR 0007 §3). Use a
stable key per answer attempt (e.g. `${session_id}-${slot_id}`), not a fresh UUID per retry.

Real request:
```
POST /v1/sessions/2e48c1aa-156f-48cc-a198-181f9aa38065/answer
Idempotency-Key: demo-chief-complaint
Content-Type: application/json

{ "slot_id": "chief_complaint", "value": "chest_pain", "input_mode": "tap" }
```

Real response:
```json
{
  "next_question": {
    "slot_id": "site",
    "text": "Where exactly is the pain? You can tell me, or touch the place on the body.",
    "tts_url": null,
    "input_modes": ["voice", "bodymap"],
    "options": []
  },
  "progress": { "module_id": "chest_pain", "completed_slots": 0, "total_slots": 9, "percent": 0 },
  "red_flags": []
}
```

`input_mode` on the request is one of `voice | tap | bodymap | proxy | ocr` — this is
`answer.source` on the wire (CLAUDE.md rule 4), and it's how the clinician summary later
renders provenance and demotes low-confidence answers. **Never send `"typed"` or invent a
sixth value** — every slot has a non-typing path, that's the whole point (CLAUDE.md rule 6).

`next_question.input_modes` is the *other* enum — `QuestionInputMode` (`voice | chips | multi |
bodymap | facescale | duration`) — what UI affordances this specific question supports. Render
whichever of those you've built; a question with `["voice", "chips"]` should offer both, never
force typing as a fallback.

When an answer trips a red flag, `red_flags` on that same response is non-empty — real capture,
the `associated=[sweating]` answer in a chest-pain module with prior radiation-to-arm:
```json
"red_flags": [] // on this turn; the actual fire came back in the WS event below, same turn
```
and simultaneously over the socket:
```json
{"id": "4af9725d-fcdd-469d-b935-339e0864281e", "rule_id": "acs_radiation", "severity": "critical",
 "quote": "Radiation to arm or jaw with diaphoresis. Same escalation path.", "token_no": "GENERAL-007"}
```
(In the captured run the REST response's `red_flags` array was populated on the exact turn the
rule fired — build for both arriving together, and don't assume the WS event as the only
signal in case a client missed the socket connection.)

### Complete

```
POST /v1/sessions/{id}/complete
```
Triggers summarisation. Response: `{"summary_id": "3208669e-e7c5-4770-9c49-294c3bb70606"}`.

---

## Documents

```
POST /v1/sessions/{id}/documents   (multipart/form-data, field "file")
```
Real response: `{"document_id": "dc13159c-e1e6-4589-b376-0e58e7db7013", "status": "queued"}`
(`202`). Poll or listen for the result:
```
GET /v1/documents/{id}
```
Real response once processing settles:
```json
{
  "status": "done",
  "quality_score": 1,
  "extractions": [
    {"field": "drug", "value": "Dolo", "confidence": 0.489, "bounding_box": {"x": 0.1, "y": 0.2, "width": 0.3, "height": 0.05}},
    {"field": "dose", "value": "650", "confidence": 0.466, "bounding_box": {"x": 0.1, "y": 0.2, "width": 0.3, "height": 0.05}},
    {"field": "diagnosis", "value": "Fever", "confidence": 0.901, "bounding_box": {"x": 0.1, "y": 0.1, "width": 0.2, "height": 0.04}}
  ]
}
```
Same payload arrives over the socket as `document.processed` the moment it settles — poll only
as a fallback for a client that missed the event.

Every extraction has a `confidence` and a `bounding_box` — CLAUDE.md rule 5: handwritten OCR is
never auto-accepted, so the UI must show a dictionary-matched shortlist for a human to confirm,
never silently fill a field from this. Rule 4 also applies: demote low-confidence values in the
UI, don't hide them.

`GET /v1/sessions/{id}/timeline` gives you the chronologically-ordered view across every
document + visit event for the session — real capture: `[{"kind": "visit", "summary": "Visit:
Dolo", "event_id": "71d4ef6e-...", "approximate": true, "occurred_at": "2026-09-07T04:32:52...Z"}]`.

---

## WebSocket

Connect with `session_id` and/or `department` as **handshake query params** — no separate join
message:
```js
io("ws://localhost:4000", {
  query: { session_id: "2e48c1aa-...", department: "general" },
  transports: ["websocket"],
});
```
This joins `session:{id}` and/or `department:{code}` rooms server-side
(`services/gateway/src/websocket/events.gateway.ts`). Rooms determine what you receive — a
triage board wants `department` only, the intake/clinician clients want `session_id`.

Full event list (`packages/contracts/events.ts`, `WS_EVENTS`), with real captured payloads
where the demo run exercised them:

| Event | Room | Payload (real capture, or noted if not exercised) |
|---|---|---|
| `slot.filled` | session | `{"slot_id": "chief_complaint", "value": "chest_pain", "confidence": 1}` |
| `question.next` | session | `{"question": "Where exactly is the pain?...", "tts_url": null, "input_modes": ["voice","bodymap"], "options": []}` |
| `redflag.fired` | session **and** department | `{"id": "4af9725d-...", "rule_id": "acs_radiation", "severity": "critical", "quote": "Radiation to arm or jaw with diaphoresis...", "token_no": "GENERAL-007"}` |
| `queue.updated` | department | `{"tokens": [{"visit_id": "...", "token_no": "GENERAL-001", "patient_id": "...", "department": "general", "priority": "urgent", "waiting_minutes": 1096, "red_flags": [...]}, ...]}` — array wrapped in `{tokens: [...]}`, **unlike** the REST `GET /v1/visits/queue`, which returns the bare array (see "known gaps") |
| `document.processed` | session | `{"document_id": "dc13159c-...", "extractions": [...]}` (shape above) |
| `session.resumed` | session | `{"device_id": "cc87a094-374d-4d94-a0a7-103fad43b4c9"}` — captured by resuming a session while a second socket listened |
| `transcript.partial` | session | Not exercised in this run — the demo uses the tap path (CLAUDE.md rule 6 in practice: every slot works without voice). Shape per contract: `{"text": string, "is_final": boolean}`. Exercise this yourself once voice input is wired; don't trust this row until you have a real capture. |
| `audio.chunk` | session | **Client → server**, not something you listen for. Binary frame, 16 kHz PCM, per `packages/contracts/events.ts`. |

`redflag.fired` was observed firing twice in the captured run for the same red flag — once
right after the triggering answer, once again with `acknowledged_by`/`acknowledged_at` fields
attached (both `null` at first fire). Don't assume exactly one event per red flag; key your UI
state off `id`, not off "first event wins."

---

## Clinician summary and triage queue

```
GET /v1/visits/queue?department=general
```
Real response (bare array — see "known gaps" for why this differs from the WS shape):
```json
[
  {"visit_id": "4e0ad477-...", "token_no": "GENERAL-007", "patient_id": "4a11750e-...",
   "department": "general", "priority": "urgent", "waiting_minutes": 0,
   "red_flags": [{"id": "4af9725d-...", "rule_id": "acs_radiation", "severity": "critical",
                  "quote": "Radiation to arm or jaw with diaphoresis. Same escalation path.",
                  "token_no": "GENERAL-007", "acknowledged_by": null, "acknowledged_at": null}]}
]
```

```
GET /v1/visits/{visit_id}/summary
```
Real response (trimmed to two fields for length — every field has this same shape):
```json
{
  "visit_id": "4e0ad477-5930-4bcc-903e-bf4299934641",
  "session_id": "2e48c1aa-156f-48cc-a198-181f9aa38065",
  "fields": [
    {"field_path": "chief_complaint", "value": "Chest pain", "source": "tap", "confidence": 1,
     "audio_offset_ms": null, "bounding_box": null, "physician_edited": false, "low_confidence": false},
    {"field_path": "history_of_present_illness.radiation", "value": "left_arm", "source": "tap",
     "confidence": 1, "audio_offset_ms": null, "bounding_box": null, "physician_edited": false, "low_confidence": false}
  ],
  "signed": false,
  "red_flags": [{"id": "4af9725d-...", "rule_id": "acs_radiation", "severity": "critical", ...}]
}
```
Every field carries `source` + `confidence` (CLAUDE.md rule 4) and `low_confidence` — render
that flag, don't compute your own threshold client-side. `PATCH` the same endpoint with
`{"field_path": ..., "value": ...}` for a physician edit; the response is the updated summary
and the edited field will come back with `physician_edited: true`.

```
POST /v1/visits/{visit_id}/sign
```
Real response: `{"fhir_bundle_id": "ec43cfc2-...", "abdm_status": "mocked", "care_context_status": "linked (mock)"}`.
`abdm_status` is honestly `mocked` right now (docs/adr/0006-mock-abdm-gateway.md) — don't render
this as a live ABDM confirmation.

---

## Known gaps (real, current — not hypothetical)

1. **`POST /v1/identity/*` doesn't attach to the session it's called from** (ADR 0007). Calling
   `POST /v1/identity/abha/qr` creates its own `Patient` row; it is not wired to the placeholder
   Patient/Visit that `POST /v1/sessions` auto-created. Until that's fixed, don't build UI that
   assumes identifying a patient mid-session updates that session's own patient record — verify
   against a live response before relying on it.
2. **`Session` doesn't expose `visit_id`.** To go from a session to its visit (e.g. to build a
   "your token is ready" screen), resolve it from `GET /v1/visits/queue` by matching
   `patient_id`, the way `scripts/demo/demo.py` does — there's no direct session→visit lookup
   endpoint yet.
3. **The queue shape differs between REST and WebSocket** — `GET /v1/visits/queue` returns a
   bare `QueueToken[]`; the `queue.updated` WS event wraps the identical array as `{tokens:
   [...]}`. Both are real, captured behavior, not a typo in this doc — handle both shapes where
   you consume both.
4. **No RBAC/auth exists yet** (Day 4). Clinician/triage actions that need an actor
   (`POST /v1/redflags/{id}/acknowledge`, `POST /v1/visits/{id}/sign`) take plain
   `actor_id`/`actor_role` strings from the caller with no verification. Fine for the demo path,
   not something to design a permissions UI around yet.

---

## Seeding a session to develop against

```
make seed-session
```
Requires `make dev` running. Prints a fresh `session_id`, `resume_token`, and the exact
`http://localhost:3000/intake/{id}?rt={token}` URL to open. Doesn't touch consent or answer
anything — that surface is yours to build. For a full scripted walkthrough (consent through
signed summary) to see how a complete session looks server-side, run `make demo` instead
(`scripts/demo/demo.py` — this doc's payloads all came from a run of it).
