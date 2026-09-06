# @careflow/ai (services/ai)

FastAPI. Speech (ASR/TTS), slot filling, deterministic red-flag evaluation. See
`docs/15-ai-stack.md` for why each provider was chosen and `docs/05-interview-engine.md` for
the interview design this serves.

**No AI call decides what to ask, and none evaluates a red flag** — CLAUDE.md rules 1 and 3.
`/evaluate-flags` has no model in its implementation, on purpose; if it ever gains one, that's
a bug.

## Run it

```
cd services/ai
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
.venv/bin/uvicorn app.main:app --port 8001 --reload
```

Needs no database and no other service running — it's stateless, reading
`packages/ontology/modules/*.yaml` off disk at startup. `.env` at the repo root supplies
`SARVAM_API_KEY` etc.; with none of those set, every endpoint still responds — `/fill-slot`
returns an honest "unclear" (never fabricates a value), `/transcribe` and `/synthesise` return
a `503` naming exactly which tier failed and why.

```
.venv/bin/pytest -v
```

## The three-tier speech pattern

`ASR_PROVIDER` / `TTS_PROVIDER` pick the *starting* tier; from there `app/cascade.py` always
falls through the remaining tiers on failure, in the fixed order **sarvam -> bhashini ->
local**. Setting a provider to `local` skips the network tiers entirely — that's the "rehearse
the demo with the network physically off" mode (docs/01-architecture.md).

| Tier | Verified against | Status |
|---|---|---|
| `sarvam` | The real `sarvamai` SDK's own source (`app/speech/sarvam.py`, `app/llm/sarvam.py`) | Code is correct; not exercised against a live account (no `SARVAM_API_KEY` in this environment) |
| `bhashini` | Publicly documented ULCA request/response shape | Implemented to the documented shape, not exercised against a live account — verify field names against a real response before the demo (same discipline docs/15-ai-stack.md asks of prices/licences) |
| `local` | `ai4bharat/indic-conformer-600m-multilingual` and `ai4bharat/IndicF5` model cards | Code matches the model cards' own usage exactly; `transformers`/`torch` aren't installed here (~2GB, commented out in `requirements.txt`) so this tier wasn't actually run — verified instead by confirming the cascade reaches it and fails with a clear "not installed" error, not a crash |

Every tier failure is caught as `ProviderUnavailable` and logged with `session_id`; if every
tier fails, the endpoint returns `503` with a per-tier breakdown of why (see
`app/routers/transcribe.py` / `synthesise.py`).

## `/fill-slot`

One slot per call, forced structured output via tool-calling (not prompt-engineered JSON) —
`slot_schema` is a plain JSON Schema fragment for the target slot's value
(`{"type": "string", "enum": [...]}` for an `enum` slot, straight from `packages/ontology`),
wrapped with `confidence`/`needs_clarification` and sent as the tool's parameter schema. The
model is forced to call that exact tool (`tool_choice`), so the response is always valid JSON
against that schema or the call fails cleanly.

`LLM_PROVIDER=local` hits an OpenAI-compatible server at `LLM_BASE_URL` — the same Sarvam
30B/105B weights, Apache-2.0, that the hosted `sarvam` tier calls (docs/15-ai-stack.md's
"elegant part"). Not yet implemented: automatic LLM-tier cascading (unlike speech, this only
dispatches to the one configured provider) — a failure still degrades honestly to "unclear"
rather than crashing, it just doesn't try a second provider first.

## `/evaluate-flags`

Pure function of `(module_id, slots)` — no session, no database. `app/ontology/expression.py`
is a from-scratch Python port of `services/gateway/src/ontology/expression.ts`'s restricted
grammar (no `eval()` anywhere): two independent implementations of the same rules, kept honest
by both being tested against the real YAML in `packages/ontology/modules/`, not by sharing code
across the language boundary. The gateway calls this endpoint first for every answered slot and
falls back to its own copy on failure — see `services/gateway/src/ai/ai-service.client.ts`.

## Not built yet

- Live streaming WebSocket ASR (`/speech-to-text/ws`) for the turn-by-turn interview — `/transcribe`
  here is a batch call (one `audio_ref` in, one transcript out), which is what its contract
  shape actually needs; the low-latency streaming path is separate Day 2 browser-audio work.
- `/next-question` and `/summarise` — contract exists (`packages/contracts/openapi/ai.yaml`),
  not implemented in this pass.
- Reference prompt audio for local TTS (IndicF5 needs one per language) — `infra/seed/` doesn't
  ship any yet, so `LOCAL` TTS fails clearly rather than silently.
