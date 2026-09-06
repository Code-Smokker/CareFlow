# 04 — Data model

PostgreSQL 16. Prisma owns the schema in `services/gateway/prisma/schema.prisma`; this document
is the intent behind it.

## Tables

```
patient        id · abha_number(enc) · abha_address · name(enc) · dob · sex
               · phone(enc) · created_at

visit          id · patient_id → patient · department · token_no · priority
               · status(waiting|in_intake|ready|consulting|closed)
               · started_at · closed_at

intake_session id · visit_id → visit · mode(kiosk|phone|assisted|proxy)
               · language · device_id · resume_token(hashed)
               · state(jsonb)          -- serialized XState snapshot
               · progress · resumed_count · expires_at

answer         id · session_id → intake_session · slot_id · value(jsonb)
               · input_mode(voice|tap|bodymap|facescale|proxy)
               · source(voice|tap|bodymap|proxy|ocr) · confidence(real)
               · audio_uri · audio_offset_ms · started_at · answered_at

document       id · session_id → intake_session · type(prescription|lab|discharge|imaging|unknown)
               · storage_uri · page_count · quality_score
               · ocr_status(queued|processing|done|failed)

extraction     id · document_id → document · entity_type(condition|medication|observation|procedure)
               · payload(jsonb) · bbox(jsonb) · page · confidence
               · confirmed_by · confirmed_at

red_flag       id · session_id → intake_session · rule_id · severity(1..3)
               · quote · payload(jsonb) · fired_at
               · acknowledged_by · acknowledged_at

summary        id · visit_id → visit · structured(jsonb)
               · rendered_en · rendered_local · fhir_bundle(jsonb)
               · status(draft|signed) · signed_by · signed_at

consent        id · patient_id → patient · session_id → intake_session
               · scopes(text[]) · audio_uri · granted_at · revoked_at

audit_log      id · actor_id · actor_role · action · resource · resource_id
               · reason · at                      -- APPEND ONLY, no update, no delete

concept        id · system · code · display · synonyms(text[]) · embedding(vector)
concept_map    id · source_concept → concept · target_concept → concept
               · equivalence(equivalent|wider|narrower|related) · reviewed_by
```

## The columns that earn their keep

**`answer.source` and `answer.confidence`.** These are what make the provenance chips and the
honest "unclear" rendering possible. Retrofitting them on day four means rewriting the
summariser and every UI that reads it. They exist from the first migration.

**`intake_session.state`.** The serialized XState snapshot. Resume-on-another-device becomes a
three-line feature instead of a rebuild, and the device-agnostic claim becomes real rather than
rhetorical.

**`audit_log` is append-only.** No `UPDATE`, no `DELETE`, enforced by a trigger. It records
every *read* of a patient record with actor, role and reason — reads matter more than writes
for a DPDP story.

## Encryption

Columns marked `(enc)` are encrypted at the application layer with AES-GCM before they reach
Postgres, using `FIELD_ENCRYPTION_KEY`. pgcrypto is available for anything better done in the
database. A dump of the database must not yield identities.

## Retention

| Data | Lives | Enforced by |
|---|---|---|
| Raw audio | deleted after transcription, unless the patient opts into provenance playback | Celery task + MinIO lifecycle |
| Session cache | TTL, expires with `intake_session.expires_at` | Redis |
| Uploaded scans | MinIO lifecycle rule | object storage policy |
| Structured history | durable, it is the clinical record | — |
| Audit log | durable | — |

The kiosk shows the patient a countdown to session wipe. The interface makes the policy legible
rather than asking them to trust a privacy page they cannot read.

## Indexes worth having from the start

```sql
CREATE INDEX ON answer (session_id, slot_id);
CREATE INDEX ON visit (department, priority DESC, token_no);
CREATE INDEX ON red_flag (session_id) WHERE acknowledged_at IS NULL;
CREATE INDEX ON concept USING gin (display gin_trgm_ops);
CREATE INDEX ON concept USING gin (synonyms);
-- add the ivfflat index on concept.embedding only once there is real data in the table
```

## Seed data

`infra/seed/` ships synthetic patients, one completed visit for the follow-up diff demo, the
NAMASTE subset and its ICD-11 TM2 crosswalk, and a drug dictionary. A fresh clone must demo in
under two minutes. **Synthetic only — never a real ABHA number, never a real patient.**
