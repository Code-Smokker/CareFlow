# @careflow/docai (services/docai)

FastAPI + Celery. OCR, entity extraction, timeline assembly. See `docs/06-document-ai.md` for
the pipeline design and `docs/15-ai-stack.md` for the OCR provider choice — including the
"OCR reality check" section documenting what actually installs and runs on Apple Silicon.

**Handwritten OCR output is never auto-accepted** — CLAUDE.md rule 5. Every extraction from a
handwritten region comes back with `needs_confirmation: true` for a human to confirm against
the dictionary-matched shortlist.

This first pass (see the repo's C1/C2 split) wires the whole path — gateway upload → Celery job
→ `document.processed` over the WebSocket → persisted extraction — with a **stub extractor**
that returns fixed entities. Real entity extraction (GLiNER, the two-pass allopathic+Ayurveda
merge, timeline assembly) is C2.

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
