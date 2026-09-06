# 01 — Architecture

## Shape

```
┌─ CLIENTS ───────────────────────────────────────────────────────────────────┐
│  intake PWA (phone·kiosk·tablet)   triage board   clinician   admin         │
│  service worker + IndexedDB: offline queue, replay on reconnect             │
└──────────────────────────────┬──────────────────────────────────────────────┘
                               │ REST + WebSocket
┌─ EDGE ────────────────────────▼─────────────────────────────────────────────┐
│  API Gateway (NestJS)                                                       │
│  sessions · consent · RBAC · token queue · rate limit · audit log           │
│  de-identification proxy · BFF for all four clients                         │
└───┬───────────────┬───────────────────┬───────────────────┬─────────────────┘
    │               │                   │                   │
┌───▼─────┐   ┌─────▼───────┐   ┌───────▼────────┐   ┌──────▼──────────┐
│ ai      │   │ docai       │   │ terminology    │   │ fhir-bridge     │
│ FastAPI │   │ FastAPI+    │   │ FastAPI        │   │ (in gateway)    │
│ ASR/TTS │   │ Celery      │   │ NAMASTE↔ICD-11 │   │ bundles, ABHA,  │
│ dialogue│   │ OCR→entities│   │ $translate     │   │ care-context    │
│ slots   │   │ timeline    │   │ trgm + vector  │   │ HIS adapter     │
│ summary │   │ ref ranges  │   │                │   │                 │
│ redflags│   │             │   │                │   │                 │
└───┬─────┘   └─────┬───────┘   └───────┬────────┘   └──────┬──────────┘
    │               │                   │                   │
┌───▼───────────────▼───────────────────▼───────────────────▼─────────────────┐
│  PostgreSQL 16 (pgcrypto, pg_trgm, pgvector)   Redis   MinIO   HAPI FHIR    │
└─────────────────────────────────────────────────────────────────────────────┘
                               ╎ all degradable
┌─ EXTERNAL ────────────────────▼─────────────────────────────────────────────┐
│  Bhashini ULCA    WHO ICD-11 API    NAMASTE export    ABDM Gateway          │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Why this split

Not by fashion — by runtime need. TypeScript where the team is fast and the I/O is chatty
(HTTP, WebSocket, database, session orchestration). Python where the models live (speech,
vision, structured extraction). One boundary between them, defined in `packages/contracts`.

Four services is the ceiling. More would cost more in integration than it buys in separation,
for a six-person team on a five-day clock.

## Request flows

### Intake turn (the hot path — budget: 1.2 s p95)

```
device  ──audio chunks (WS)──▶ gateway ──▶ ai.transcribe (streaming, VAD)
                                              │
                                              ▼
                                     ai.fill_slot(slot_schema, utterance)
                                              │
                                     validate → advance XState
                                              │
                              ┌───────────────┼───────────────┐
                              ▼               ▼               ▼
                      persist answer   evaluate red flags   next question
                      (+ provenance)   (deterministic)      (TTS, cached)
                                              │
                                     if fired → queue.reprioritise
                                              → WS push to triage room
                                              │
                              ◀────── audio + UI state ──────┘
```

Latency budget: ASR finalise ≤ 400 ms · slot extraction ≤ 500 ms · TTS from cache ≤ 100 ms ·
transport ≤ 200 ms. The prompt set is finite, so cache every generated clip — most playback
is instant and free.

### Document (async — never blocks the interview)

```
device ──▶ quality gate (OpenCV.js, on device) ──▶ upload to MinIO
       ──▶ gateway enqueues job ──▶ Celery worker
              classify → OCR/VLM → extract entities → normalise dates
              → reference-range flags → drug interaction check
       ──▶ FHIR resources + DocumentReference ──▶ WS push "timeline updated"
```

The patient continues the interview while this runs. If it fails, the summary is still
complete — documents enrich, they do not gate.

### Summary and sign-off

```
interview complete ──▶ ai.summarise(answers + extractions)
                        → structured JSON FIRST (never prose first)
                        → render EN + local language from the structure
                        → provenance pointer on every field
       ──▶ clinician console ──▶ physician edits ──▶ Accept & sign
       ──▶ fhir-bridge assembles OPConsultRecord bundle
       ──▶ validate against local HAPI ──▶ push (ABDM or mock) ──▶ link care context
```

## State and resumability

`intake_session.state` holds the serialized XState snapshot, written on every turn. A session
can therefore be resumed from any device by scanning the same QR — battery dies, patient walks
away, kiosk reboots, no loss. This is what makes the device-agnostic claim real rather than
rhetorical, and it is why the snapshot column exists from day one instead of being retrofitted.

Redis holds the live session cache with a TTL; Postgres holds the durable record.

## Degradation

| Dependency | Fallback | Trigger |
|---|---|---|
| Bhashini ASR | self-hosted IndicConformer 600M | HTTP error, or p95 > 2 s |
| Bhashini TTS | cached clips, then local TTS | same |
| Hosted LLM | local open-weight model | `LLM_PROVIDER=local`, or error |
| ABDM gateway | mock gateway, identical shapes | `ABDM_MODE=mock` (default) |
| WHO ICD-API | cached snapshot in Postgres | offline |
| Network entirely | service worker queue, replay on reconnect | `navigator.onLine` |

**Rehearse the demo once with the network physically off.** That rehearsal is what makes this
table true rather than aspirational.

## Deployment

Development and demo: `docker compose up` for stateful infra, services on the host with
hot reload. One command, one laptop, no cloud dependency.

Production path (documented, not built during the sprint): each service containerised, k8s
manifests in `infra/k8s/`, Postgres managed, MinIO or S3, horizontal scale on the ai service
which is the only CPU/GPU-bound tier. Hospital deployments run on-premise with
`LLM_PROVIDER=local` so no patient data crosses the boundary.

## What lives where

| Concern | Home | Not |
|---|---|---|
| Session lifecycle, consent, RBAC, audit | gateway | anywhere else |
| Interview logic | `packages/ontology` + ai service | the frontend |
| Red-flag rules | `packages/ontology` (YAML) | Python code, or the LLM |
| Clinical vocabulary | terminology service | hardcoded lists |
| FHIR shapes | `packages/fhir` | inline object literals |
| Anything a client calls | `packages/contracts` | invented at the call site |
