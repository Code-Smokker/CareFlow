# ADR 0007 — Schema deviations needed to make the session lifecycle real

**Status:** accepted · **Date:** 2026-09-06

## Context

Day 1 needs the session lifecycle endpoints (`create, get, resume, language, consent, answer,
complete, delete`) backed by real Postgres persistence, with zero AI dependency — `/answer`
walks `packages/ontology` directly. Implementing that against `docs/04-data-model.md` exactly
as written surfaced four places where the doc (an intent document) and the contract
(`packages/contracts`, the actual source of truth per CLAUDE.md) don't quite meet. Each is
additive, none renames or removes anything the doc describes.

## Decisions

**1. Patient and Visit are auto-created as placeholders when a session starts.**
`docs/04-data-model.md` shows `intake_session.visit_id → visit` and `visit.patient_id →
patient` as plain (non-nullable) foreign keys — but `POST /v1/sessions` takes no body and
identity is resolved later, via `POST /v1/identity/*`, which isn't built yet. Making the FKs
nullable would ripple into every future query that joins session → visit → patient. Instead,
`POST /v1/sessions` creates a placeholder `Patient` (all demographic columns null) and a
placeholder `Visit` (`department`/`token_no` null, `status = in_intake`), and the FK chain
stays exactly as documented. **Whoever builds `POST /v1/identity/*` must UPDATE this existing
placeholder Patient/Visit row, not create a new one and reattach the session.**

**2. `intake_session` gets a `status` column, not in the doc.**
The contract's `Session` schema requires `status: created|in_progress|completed|withdrawn`.
The doc gives `visit` a status but not `intake_session` — plausibly because a session's
lifecycle and its visit's lifecycle are meant to diverge (a visit can outlive a session across
a follow-up). Added the column rather than overloading `visit.status`.

**3. `answer` gets an `idempotency_key` column, not in the doc.**
`docs/03-api-contracts.md` rule 4 requires the `Idempotency-Key` header on `POST /answer` to
stop a retried request from advancing the interview twice. Rather than a separate table, the
key lives on the `answer` row itself: `@@unique([session_id, idempotency_key])`. Postgres
treats every `NULL` in a unique index as distinct, so this only constrains genuine key reuse —
answers submitted without a key are unaffected. A retried request with a seen key is a no-op:
the state was already advanced the first time, so the handler just recomputes the (deterministic)
response from current state instead of reprocessing.

**4. `answer.input_mode` and `answer.source` are populated from the same wire value —
and `input_mode`'s enum gained `ocr` to make that honest.**
The doc defines two different enums — `input_mode(voice|tap|bodymap|facescale|proxy)` for UI
modality and `source(voice|tap|bodymap|proxy|ocr)` for provenance — but the contract's
`AnswerSubmission.input_mode` (deliberately, per CLAUDE.md rule 4) carries only the five
`source` values, with no `facescale`. Both DB columns are written from that one wire value,
which meant `input_mode` needed to accept `ocr` too — added rather than silently dropped or
mapped to something incorrect, so the column never lies about provenance. The two enums now
differ in exactly one direction: `input_mode` is `source`'s five values plus `facescale`.
`facescale` still needs its own path (or a widened wire enum) once the severity-via-faces slot
input ships — flagged here so that work doesn't get surprised by it.

## Consequences

- The FK chain in Postgres matches `docs/04-data-model.md` exactly; the deviation is in what
  gets auto-created, not in the shape.
- `packages/contracts` didn't change — these are all persistence-layer or additive-column
  decisions, not wire-shape changes.
- The identity work (`POST /v1/identity/*`) and the facescale slot input both have a landmine
  to avoid, and now a paper trail explaining why.
