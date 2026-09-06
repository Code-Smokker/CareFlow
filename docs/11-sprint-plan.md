# 11 — Five-day sprint

The highest-value scheduling decision: **something end-to-end and demoable exists by the end
of Day 1, and it never stops working.** Every later day thickens it. Nothing is integrated for
the first time on Day 5.

## Roles

| | Owns |
|---|---|
| **FE-1** | Patient intake, accessibility, offline, capture flow |
| **FE-2** | Clinician console, triage board, admin, design system |
| **BE** | Gateway, database, auth, queue, realtime, consent, security |
| **AI-1** | Speech, interview engine, slot filling, summarisation, red flags |
| **AI-2** | Document AI, extraction, terminology service |
| **INT** | FHIR/ABDM, DevOps, eval harness, deck, video, pitch |

## Rituals

- 15-minute stand-up at the start of each day.
- **Integration checkpoint at 18:00 daily** — everything merged to `main`, full demo path run
  start to finish.
- A broken demo path is the only P0.
- No branch lives more than half a day. Feature-flag anything unfinished.

---

### Day 0 — half day · *nobody is ever blocked on a decision again*

- **ALL** Monorepo, compose file, Postgres schema, seed data, CI green on an empty build
- **INT** `packages/contracts` — full OpenAPI spec for every endpoint, generated clients committed
- **FE-2** Design tokens, type scale, and the ten core components in `packages/ui`
- **AI-1** Ontology schema fixed; `chest_pain.yaml` written as the reference module
- **ALL** Agree the demo script **in writing**. Everything gets built toward it.

### Day 1 — *a text-only intake runs end to end and appears on a doctor's screen*

- **FE-1** Language pick → consent → five hardcoded questions → confirm screen
- **BE** Session create/advance/complete, Postgres persistence, WebSocket room per session
- **AI-1** XState runner walking the YAML module; slot filling against text input, no audio yet
- **FE-2** Clinician console rendering the structured summary live
- **INT** Deployed on a LAN box; every teammate can hit it from their phone by end of day

### Day 2 — *a patient speaks Hindi and the history fills itself*

- **AI-1** Streaming ASR with VAD; Bhashini path plus self-hosted fallback; TTS with prompt cache
- **FE-1** Mic orb with live waveform, tap alternatives on every question, SVG body map, face scale
- **AI-1** Four more complaint modules + generic fallback; red-flag rule engine
- **BE** Priority queue, triage WebSocket channel, escalation logging
- **FE-2** Triage board live — with a fake alert first, then a real one

### Day 3 — *a crumpled prescription becomes a timeline*

- **AI-2** Capture quality gate, OCR + VLM pipeline, entity extraction, reference-range flagging
- **AI-2** Terminology service: NAMASTE loaded, ICD-11 TM2 pulled, ConceptMap and `$translate` live
- **AI-2** ⚠️ **Verify real codes today.** Replace every PLACEHOLDER in docs and seed data
- **FE-1** Camera flow with retake guidance; AYUSH interview path with Dashavidha axes
- **FE-2** Document timeline strip, provenance chips, dual-code display in the console
- **INT** HAPI FHIR up, first OPConsultRecord bundle validating

### Day 4 — *ABHA, consent, security and the follow-up story all land*

- **INT** ABHA v3 client (or mock gateway), QR scan identify, care-context linking, bundle push
- **BE** Consent artifact, de-identification proxy, encryption, audit log, RBAC, TTL wipe
- **FE-1** Offline mode: service worker, IndexedDB queue, replay on reconnect. Attendant mode
- **FE-2** Follow-up diff view, "Ask the history", admin analytics dashboard
- **AI-1 / AI-2** Latency pass — cache, batch, quantise. Target sub-1.2 s turn time
- **ALL** 🔒 **Feature freeze at 22:00.** Nothing new after this point

### Day 5 — *numbers on a slide and a demo that cannot fail*

- **INT** Run the eval harness, produce the metrics table, k6 load test at 200 concurrent sessions
- **FE-1 / FE-2** Polish: empty states, error copy, loading skeletons, focus states, dark mode
- **ALL** Rehearse the demo five times. **Record a backup video of the full flow**
- **INT** README with architecture diagram, one-command setup, ADRs, screenshots
- **ALL** Prepare answers to the ten questions judges will ask (doc 00 and CLAUDE.md)

---

## Scope discipline

Five complaint modules built well beats twenty built badly. If the clock slips, cut in this
order: admin analytics → "Ask the history" → follow-up diff → AYUSH depth → document AI.

Never cut: the interview, red flags, the clinician summary, offline mode, the demo path.
