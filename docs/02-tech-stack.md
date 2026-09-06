# 02 — Tech stack

Chosen for what this team already ships: React/Next, Node, Python. Nothing here asks anyone
to learn a framework during the sprint.

## Frontend

| Choice | Why, and why not the alternative |
|---|---|
| **Next.js 15 · React 19 · TypeScript** | One codebase serves phone, kiosk and tablet. Installable PWA from a QR with no app store — a queue cannot afford an install step. Flutter and React Native were on the table and lose on exactly that. |
| **Tailwind CSS · shadcn/ui** | Fast, and shadcn components are copied into the repo so we can rewrite them for 56px touch targets without fighting a library. |
| **XState v5** | The interview *is* a statechart: branching, resumable, replayable. `useState` collapses at the third branch. The serialized snapshot is what makes cross-device resume a three-line feature. |
| **Zustand** | Small non-interview UI state only. Do not put interview state here. |
| **Socket.IO client** | Rooms per session and per department, reconnect-with-backlog. Matters on hospital wifi. |
| **Framer Motion** | Sparingly. Mic waveform, screen transitions, red-flag banner. Respect `prefers-reduced-motion`. |
| **Workbox** | Service worker, offline queue, IndexedDB replay. |
| **OpenCV.js** | On-device capture quality gate — blur, glare, edge detection — so the patient retakes a bad photo instead of the server failing silently. |

## Gateway

| Choice | Why |
|---|---|
| **NestJS 11** | Modules, guards, DTO validation, OpenAPI generation out of the box. Bare Express means hand-rolling all four at 2 a.m. |
| **Prisma + PostgreSQL 16** | Typed queries, migrations that a six-person team can run without conflict. |
| **Socket.IO** | Same protocol both ends. |
| **BullMQ (Redis)** | Token queue and job dispatch. |
| **Zod** | Every network and database boundary. |

## AI services

| Choice | Why |
|---|---|
| **FastAPI · Python 3.12 · Pydantic v2** | Pydantic models are the *single* definition used for validation, OpenAPI docs and LLM structured output. Do not write a second schema by hand. |
| **Celery + Redis** | Anything over ~2 s (document processing) leaves the request path. |
| **silero-vad** | Voice activity detection. Cheap, accurate, runs on CPU. |

### Speech

**ASR primary — Bhashini (ULCA pipeline).** The government stack; using it scores points by
itself and the pipeline covers ASR, translation and TTS in one config-then-compute call.

**ASR fallback — `ai4bharat/indic-conformer-600m-multilingual`, self-hosted.** MIT licensed,
600M parameters, 22 scheduled Indian languages, hybrid CTC + RNNT decoding, loads via
`transformers` with `trust_remote_code=True`; audio resampled to 16 kHz. This is what keeps the
demo alive when the venue wifi dies. *Verify licence and model card before the deck goes out.*

**TTS** — Bhashini primary, open Indic TTS fallback. Cache every generated clip; the question
set is finite.

**Code-switching** — Hinglish is the norm in Indian OPDs, not an edge case. Do not fight it in
the ASR; handle it in normalisation.

### LLM

A **pluggable adapter** with one interface and two deployment stories:

- Demo: a hosted API for quality and latency.
- On-premise: an open-weight Indian model (Sarvam released 30B and 105B under Apache 2.0 in
  March 2026) so "does patient data leave the hospital?" is answered with a config flag rather
  than a hedge. *Verify current licence and weights availability.*

Two call sites only, and they are different sizes of problem:

1. **Slot extraction** — tiny prompt, one slot, structured output against the Pydantic schema.
   Small fast model. This runs on every turn and owns the latency budget.
2. **Summarisation** — once per session, larger context, still emits a structured object first.

The model is never asked "what should I ask next".

### Document AI

| Stage | Tool |
|---|---|
| Quality gate | OpenCV.js on device |
| Printed + tabular OCR | PaddleOCR / docTR |
| Handwritten regions | a small permissive VLM (e.g. LightOnOCR-1B, Apache 2.0) |
| Entity extraction | LLM with structured output + dictionary fuzzy match |

Small VLMs currently beat larger ones on scanned clinical documents. Keep bounding boxes
through every stage — they are the provenance.

## Terminology

**PostgreSQL + `pg_trgm` + pgvector**, exposed as FHIR `CodeSystem` / `ValueSet` / `ConceptMap`
with a `$translate` operation. Ayurvedic terms arrive transliterated a dozen ways
(*amavata* / *āmavāta* / *aam vaat*), so trigram similarity plus embeddings beats exact match —
and a real `$translate` beats a lookup dictionary in front of a judge.

## Data

| | |
|---|---|
| **PostgreSQL 16** | Sessions, history, audit. pgcrypto for field-level encryption. |
| **Redis** | Live session cache with TTL, pub/sub, job queue. |
| **MinIO (S3 API)** | Scans and audio clips. Lifecycle expiry gives the DPDP retention story for free. |
| **HAPI FHIR** | Local validation target and offline demo endpoint. |

## Quality

TypeScript `strict` · ESLint + Prettier · Ruff + mypy · Vitest · Playwright · pytest ·
GitHub Actions · conventional commits · pino + structlog with `session_id` on every line.

Judges do open the repo. Green CI, a real README and honest ADRs read as a team that ships.

## Deliberately not used

| | Why not |
|---|---|
| Flutter / React Native | Install step the OPD queue cannot afford. The PWA wins on reach. |
| Microservice mesh, gRPC, Kafka | Integration cost exceeds the benefit at this size and clock. |
| A vector database as a separate service | pgvector is enough; one fewer container to explain. |
| Blockchain, on-device federated learning | Neither survives the "show me it working" question. |
| A general-purpose chatbot for the interview | See CLAUDE.md rule 1. This is the whole design. |
