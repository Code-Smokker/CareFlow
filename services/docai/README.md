# @careflow/docai (services/docai)

FastAPI + Celery. OCR, entity extraction, timeline assembly. See `docs/06-document-ai.md` for
the pipeline design and `docs/15-ai-stack.md` for the OCR provider choice — including the
"OCR reality check" section documenting what actually installs and runs on Apple Silicon.

**Handwritten OCR output is never auto-accepted** — CLAUDE.md rule 5. Every extraction from a
handwritten region comes back with `needs_confirmation: true` for a human to confirm against
the dictionary-matched shortlist.

C1 wired the whole path — gateway upload → Celery job → `document.processed` over the WebSocket
→ persisted extraction — with a stub extractor that returned fixed entities. **C2 (done)**
replaces that with real extraction: see `app/extract/pipeline.py`.

## C2 — real entity extraction

Pipeline (docs/15-ai-stack.md "Medical entity extraction"): **GLiNER-BioMed two-pass** →
**LLM structured output for the messy remainder** → **dictionary fuzzy-match shortlist**.

1. `app/extract/gliner_ner.py` runs `Ihor/gliner-biomed-base-v1.0` (zero-shot NER, `NER_MODEL`
   in `.env`) twice per OCR region: once with allopathic labels (drug, dose, frequency,
   duration, diagnosis, procedure, analyte, value, unit, date), once with AYUSH labels
   (ayush_formulation, ayush_plant, dosha) — a single label set biases zero-shot NER toward
   whichever vocabulary it's given first. `merge_passes` resolves overlapping spans by keeping
   the higher-confidence label; this merge logic is unit-tested in `test/test_extract.py`
   without needing the model itself.
   **Verified working on this machine**: `pip install gliner` succeeded on the Python 3.14 venv
   (torch 2.14 ships a 3.14 wheel, unlike paddlepaddle — see the OCR section below), the model
   downloaded (~756MB, fits in the ~10-12GB free on this machine) and produced real entities
   from a synthetic prescription string. This is a genuinely exercised tier, not a
   written-but-untested one like the OCR `local` tier below.
2. `app/extract/llm_remainder.py` — for a region GLiNER found nothing (or only low-confidence)
   in, calls an LLM (tool-forced structured output, `app/llm/openai_compatible.py`, ported from
   `services/ai`'s adapter) with the same never-fabricate discipline as `services/ai`'s
   `fill_slot`. **Unexercised**: `LLM_BASE_URL` is empty in `.env`, so this pass currently
   always returns "unavailable" and is skipped — written correctly, degrades to nothing rather
   than crashing (`ProviderUnavailable`, logged as a warning).
3. Both passes' entities are matched against `app/dictionary/search.py` (already built in C1)
   for `drug`/`ayush_formulation`/`ayush_plant`-labelled entities, populating
   `dictionary_matches` — no second fuzzy-matching library was added; the existing pg_trgm
   search already satisfies this.
4. If neither GLiNER nor the LLM remainder pass produces anything for any region (e.g. neither
   is available in some other environment), the pipeline falls back to the C1 stub's raw-text
   fields rather than returning an empty result or failing the job (CLAUDE.md rule 9).
5. `app/timeline/assemble.py` builds one `TimelineEvent` per document: the highest-confidence
   parseable `date`-labelled entity becomes `occurred_at` (`approximate: false`); with no
   parseable date it falls back to the processing time as a relative placeholder
   (`approximate: true`) — never a fabricated precise date. `TimelineEvent.approximate` is a
   new **required** field (`packages/contracts/openapi/docai.yaml`) added contracts-first for
   this — regenerated TS/Python clients are part of this change. `/process`'s request body also
   gained an optional `doc_type` (from a prior `/classify` call) so the timeline event's `kind`
   isn't always the generic `visit` fallback.

## Run it

```
cd services/docai
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt

# API
.venv/bin/uvicorn app.main:app --port 8002 --reload

# Worker (separate process, same venv) — needs Postgres (dictionary lookups) and Redis (broker)
.venv/bin/celery -A app.celery_app worker --loglevel=info
```

Needs `DATABASE_URL` (dictionary_entry table, migrated by the gateway's Prisma schema — this
service only reads/writes it) and `REDIS_URL` (Celery broker/backend) from the repo-root `.env`.
`GATEWAY_CALLBACK_URL` defaults to `http://localhost:4000/v1/internal/documents/callback` — the
gateway is what actually emits `document.processed`, since it alone owns the Socket.IO server.

## The OCR provider cascade

`OCR_PROVIDER=hosted|local|stub`, same three-tier shape as `services/ai`'s speech providers,
minus a second cloud tier (no documented Bhashini-equivalent for OCR). See
`docs/06-document-ai.md`'s "OCR reality check" for exactly what's verified vs. unexercised in
this environment, and `app/ocr/{hosted,local,stub}.py` for the adapters.

## The dictionaries

`GET /dictionary/search?q=&system=` — pg_trgm fuzzy match against `dictionary_entry`
(allopathic brands, AYUSH classical formulations, Ayurvedic plants), seeded by
`scripts/seed_dictionaries.py`. See that script's own docstring for sources and the AFI
reconciliation it performs.
