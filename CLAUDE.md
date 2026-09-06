# CLAUDE.md — working agreement for this repo

CareFlow is an AI clinical intake platform for Indian OPDs. Smart India Hackathon 2026,
Problem Statement **26047 — Patient Case-Taking Software**, Ministry of Ayush / All India
Institute of Ayurveda. Five-day build, six people.

Read `docs/00-overview.md` before your first change. Read the doc for the area you are
touching before you touch it. The docs are the spec; this file is how we work.

---

## The one-sentence product

A patient records a full medical history by talking to their phone or a kiosk in their own
language while waiting, scans their old prescriptions and lab reports, and the doctor opens
a structured, physician-ready summary the moment they walk in.

## The reframe that defines the architecture

Ten kiosks cannot see 5,000 patients a day. So **CareFlow is not a kiosk** — it is an intake
*session* that any screen can attach to: the patient's phone via a QR on the token slip, a
shared kiosk, a volunteer's tablet, the registration desk. Session state lives server-side;
the screen is disposable and interchangeable mid-session.

Anything that assumes a dedicated device is wrong by construction.

---

## Non-negotiable rules

These are clinical-safety and evaluation-critical. Do not relax them for convenience.

1. **The LLM never decides what to ask.** The interview is a state machine over
   `packages/ontology` — YAML modules declaring slots, follow-ups and red-flag predicates.
   The model only (a) phrases the next question in the patient's language and (b) parses an
   answer into a typed slot. Question order, completeness and escalation are code.
2. **CareFlow never diagnoses.** It structures history. No differential, no treatment, no
   "likely condition". The physician signs every summary; until then it is a draft.
3. **Red flags are deterministic rules**, evaluated over filled slots — never model judgement.
   They live in the YAML module next to the slots they read.
4. **Every stored fact carries provenance and confidence.** `answer.source`
   (`voice | tap | bodymap | proxy | ocr`), `answer.confidence`, and where applicable the audio
   offset or the OCR bounding box. The UI renders low-confidence values as demoted, never hides
   them, and never silently guesses.
5. **Handwritten OCR output is never auto-accepted.** Surface a dictionary-matched shortlist
   for a human to confirm.
6. **No question is answerable only by typing.** Every question has a voice path and a tap
   path. Text entry is optional, always.
7. **No PII leaves the process boundary un-proxied.** Identifiers go through the
   de-identification proxy in the gateway before any hosted model call.
8. **No real patient data, ABHA numbers, Aadhaar numbers or credentials in the repo.** Ever.
   Synthetic fixtures only, in `eval/` and seed data.
9. **Every external dependency has a local fallback.** Bhashini → self-hosted IndicConformer.
   ABDM → mock gateway. WHO ICD-API → cached snapshot. The demo must survive a dead network.

---

## Architecture

```
Clients   intake PWA · clinician console · triage board · admin      (Next.js)
   ↓
Edge      API gateway — sessions, consent, RBAC, queue, WebSocket,
          audit log, de-identification proxy                          (NestJS)
   ↓
Services  ai (ASR/TTS, interview, slots, summary, red flags)          (FastAPI)
          docai (OCR, extraction, timeline)                           (FastAPI + Celery)
          terminology (NAMASTE ↔ ICD-11 TM2, $translate)              (FastAPI)
          fhir-bridge (bundle assembly, ABHA client, HIS adapter)     (in gateway for now)
   ↓
Data      PostgreSQL 16 · Redis · MinIO · HAPI FHIR (local)
   ↓
External  Bhashini ULCA · ABDM Gateway · WHO ICD-API · NAMASTE export  (all degradable)
```

Full detail in `docs/01-architecture.md`.

## Layout

```
apps/intake       Next.js PWA — the patient. XState interview runner.
apps/clinician    Next.js — the 8-second summary and sign-off.
apps/triage       Next.js — realtime red-flag board.
apps/admin        Next.js — impact analytics.
services/gateway  NestJS — Prisma, WebSocket hub, consent, queue, de-ID proxy.
services/ai       FastAPI — speech, dialogue, slot filling, summarisation, red flags.
services/docai    FastAPI + Celery — OCR, entity extraction, timeline.
services/terminology  FastAPI — NAMASTE / ICD-11 TM2 crosswalk.
packages/ui       Design system. Tokens, BigButton, MicOrb, BodyMap, FaceScale.
packages/fhir     Zod schemas + builders for ABDM R4 profiles.
packages/ontology Complaint modules (YAML) + red-flag rules + validator.  ← core IP
packages/contracts OpenAPI spec → generated TS and Python clients.        ← source of truth
eval/             Golden patient scripts + scoring harness.
infra/            Compose mounts, seed data, deployment manifests.
docs/             The spec. Start at docs/00-overview.md.
```

---

## How to work in this repo

**Contracts first.** `packages/contracts` is the source of truth for every interface between a
client and the gateway, and between the gateway and a service. Change the OpenAPI spec, regenerate,
then implement. Never invent a request shape in a component.

**The demo path is the only P0.** `docs/13-demo-script.md` is the acceptance test. If a change
breaks the demo path, it does not merge, whatever else it improves.

**Branches live half a day, maximum.** Feature-flag anything unfinished and merge to `main`.
Six people cannot integrate on day four if nothing merged on day two.

**Vertical slices, not layers.** Ship "one question end to end through every tier" before
"all questions in the UI with no backend".

**Conventional commits.** `feat(intake): body map for pain location`, `fix(ai): VAD cutting
long answers`, `docs(adr): record mock ABDM decision`. Scopes are the directory names above.

**ADRs for decisions that constrain other people.** One page in `docs/adr/`, numbered, in the
existing format. If you spent more than twenty minutes choosing, write it down.

---

## Conventions

**TypeScript** — `strict: true`, no `any` (use `unknown` and narrow). Zod at every boundary
that touches the network or the database. Server Components by default in Next.js; `"use client"`
only where interaction actually lives. Named exports; default exports only where a framework
demands one.

**Python** — 3.12, full type hints, Ruff + mypy clean. Pydantic v2 models are the single
definition used for validation, OpenAPI docs *and* LLM structured output — do not write a
second schema by hand. Async by default in FastAPI; anything over ~2 seconds goes to Celery.

**Errors** — never swallow. Structured logs (pino / structlog) with `session_id` on every line.
User-facing error copy says what went wrong and what to do next; no apologies, no stack traces.

**Naming** — `snake_case` in the database and in Python, `camelCase` in TypeScript, `kebab-case`
for files and routes. Clinical terms use their standard spelling (`prakriti`, `dashavidha`,
`nidana`), never an ad-hoc abbreviation.

**Tests** — Vitest for units, Playwright for the intake flow, pytest for services. Every new
red-flag rule ships with a case in `eval/`. Every FHIR builder ships with a bundle that
validates against the local HAPI server.

**Accessibility is a correctness requirement here, not a polish item.** 32px minimum question
text, 56px minimum touch targets, WCAG 2.2 AA contrast, visible focus, every control labelled.
A patient interface that a 68-year-old cannot use is broken, not unpolished.

---

## Build order

Follow `docs/11-sprint-plan.md`. Current position: **Day 0 — scaffold and contracts.**

Day 0 → repo, contracts, schema, design tokens, first ontology module
Day 1 → text-only intake runs end to end and renders on the clinician console
Day 2 → voice in and out, five complaint modules, red flags, triage board
Day 3 → document pipeline, terminology service, AYUSH interview path
Day 4 → ABHA, consent, security, offline mode, follow-up diff
Day 5 → eval numbers, polish, rehearsal, README, backup video

Do not start Day N+1 work while the Day N demo path is broken.

---

## Things that will be asked in judging — keep the answers true

- *"What if the AI gets the diagnosis wrong?"* → It does not diagnose. Red flags are
  deterministic. The physician signs.
- *"Does patient data leave the hospital?"* → De-identification proxy, and a config flag that
  runs the whole pipeline on-premise on an open-weight model.
- *"Ten kiosks can't see 5,000 patients."* → Correct. That is why it is a session, not a kiosk.
- *"Is the ABDM integration real?"* → Say exactly where it stands. If we are on the mock
  gateway, the slide says "ABDM-ready, gateway mocked pending sandbox credentials" and we show
  the bundle validating. We do not claim a live integration we do not have.

Honesty about limits is a scoring advantage here. Do not let generated copy overclaim.
