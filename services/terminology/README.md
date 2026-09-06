# @careflow/terminology (services/terminology)

FastAPI over PostgreSQL + pg_trgm + pgvector. NAMASTE ↔ ICD-11 TM2/MMS crosswalk. See
`docs/07-ayush-terminology.md` for the design and `docs/03-api-contracts.md` for the endpoints.

## Status, honestly (as of this commit)

Two real dependencies are not obtained yet, per `docs/API_KEYS.md`:

- **NAMASTE export** — `infra/seed/namaste/` is empty. `NAMASTE_EXPORT_PATH` is unset.
  `app/namaste/load.py` is written and tested against a synthetic fixture
  (`test/fixtures/test_namaste_export.csv`, codes prefixed `TEST-` so they can never be
  mistaken for real ones) — the pandas/openpyxl read path, column detection (code/English/
  Devanagari/diacritical/description), and synonym collection all work. It has never run
  against the real file because the real file doesn't exist here. Run
  `scripts/load_namaste.py` once `NAMASTE_EXPORT_PATH` points at it.
- **WHO ICD-11 credentials** — `ICD_CLIENT_ID`/`ICD_CLIENT_SECRET` are both empty in `.env`.
  `app/icd11/client.py`'s OAuth2 + search flow is written against WHO's publicly documented API
  shape and unit-tested with a mocked HTTP client (`test/test_icd11_client.py`) — the request/
  response shapes are **unverified against a live provider**, same discipline as
  `services/docai/app/ocr/hosted.py`'s unverified vision tier. The cascade falls back to
  whatever's cached in Postgres for that system, which is also empty right now.

Because of the above, **the tables are empty**: 0 NAMASTE concepts, 0 ICD-11 concepts, 0
candidate mappings. Nothing in `infra/seed/` or anywhere else was fabricated to make numbers
look better — see docs/07 and ADR 0005 on why a fake code here is worse than an honest zero.

**What is real and verified, against a live local Postgres 17 + pgvector instance and the
actual embedding model:**

- The `concept`/`concept_map` schema (Prisma-migrated, this service only reads/writes it) —
  `definition` and `concept_map.provenance` columns added, `ConceptEquivalence` gained
  `inexact`, a `(source_concept, target_concept)` uniqueness constraint added, and the same
  lower(display) trigram-index fix `services/docai/app/dictionary/search.py` already made for
  its table, applied here too (`concept_display_lower_trgm_idx`).
- Trigram search (`app/search/concepts.py`) — verified: a lowercase query matches a
  Title-Cased `display` (case-insensitivity fix), and — importantly — trigram search alone
  **cannot** bridge Devanagari to Latin script (verified as a negative: `आमवात` does not match
  a `display` of `Amavata` on trigram alone, however the case is normalized).
- **The embedding model actually loaded on this machine.** `sentence-transformers/LaBSE`
  downloaded and ran (~500s the first time, cached after). Real, measured cosine similarities
  between `model.encode(...)`-normalized embeddings of the four spellings docs/07 names:

  ```
                amavata   āmavāta   aam vaat   आमवात    diabetes (control)
  amavata        1.00      0.72      0.61       0.63      0.30
  āmavāta        0.72      1.00      0.60       0.72      0.36
  aam vaat       0.61      0.60      1.00       0.62      0.26
  आमवात          0.63      0.72      0.62       1.00      0.37
  ```

  All four spellings cluster in the 0.60–0.72 range against each other, clearly above the
  ~0.26–0.37 range against an unrelated control word. `test/test_search_ranking.py`'s
  `test_embedding_bridges_devanagari_to_latin_when_the_model_is_available` proves this closes
  the loop end-to-end: a concept stored with an embedding is found by a Devanagari query that
  trigram search alone misses. **This is the real mechanism, exercised on synthetic
  `test-namaste`-system concepts** (there is no real "Amavata" NAMASTE concept yet to search
  for) — re-run it once the real NAMASTE data is loaded to get the actual demo-ready result.
- The candidate-mapping generator (`app/mapping/generate.py`) — exact code, exact title, fuzzy
  cascade; every write gets `reviewed_by: NULL`, `provenance: 'lexical'`; re-running it never
  overwrites a mapping a human has already reviewed (`test/test_mapping_generate.py`).
- The FHIR endpoint shapes (`app/fhir/codesystem.py`, `app/fhir/conceptmap.py`) — plain-dict
  CodeSystem and $translate Parameters resources, unit-tested.
- The gateway's dual-coding wiring (`services/gateway/src/visits/visits.service.ts`'s
  `buildChiefComplaintCodings`) — degrades to exactly today's text-only `Condition.code` when
  the terminology service has nothing (which is the actual current state), never throws, never
  fabricates a coding. `packages/fhir`'s `buildCondition`/`buildOPConsultRecordBundle` now
  accept an optional `codings` array; both behaviors (present/absent) are tested in
  `packages/fhir/test/bundle.spec.ts`.

## Run it

```
cd services/terminology
python3.12 -m venv .venv   # 3.12, not the machine default 3.14 — same constraint as docai's
                            # paddlepaddle: no wheel for 3.14 for this service's heavier deps
.venv/bin/pip install -r requirements.txt

.venv/bin/uvicorn app.main:app --port 8003 --reload
```

Needs `DATABASE_URL` (concept/concept_map tables, migrated by the gateway's Prisma schema —
this service only reads/writes them, same convention as `services/docai/app/dictionary/db.py`).

## Endpoints

`GET /search?q=&system=`, `GET /concept/:system/:code`, `POST /translate`,
`GET /fhir/CodeSystem/:id`, `GET /fhir/ConceptMap/:id/$translate?code=&system=&target=` — see
`packages/contracts/openapi/terminology.yaml`.

## Scripts

- `scripts/load_namaste.py` — loads the real export once `NAMASTE_EXPORT_PATH` is set.
- `scripts/generate_mappings.py` — regenerates candidate mappings after either side's data
  changes.
