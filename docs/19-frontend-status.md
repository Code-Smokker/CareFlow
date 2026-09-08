# 19 — Frontend status (`apps/console`)

Route-by-route LIVE/MOCK status for the staff console, as of the PS-26047 scope cut described
in `apps/README.md`. "LIVE" means the page fetches real data from a running service at render
or action time — not that the code compiles, and not that seed data happens to be populated for
every visit. Verified against a running gateway (`:4000`), terminology service (`:8003`), local
HAPI FHIR (`:8090`), and Postgres/Redis/MinIO (`docker-compose.yml`) with real seeded visits.

## LIVE

| Route | Wired to | Notes |
|---|---|---|
| `/queue` | `GET /v1/visits/queue` | Red flags surfaced first, `POST /v1/redflags/{id}/acknowledge` wired. |
| `/triage` | `GET /v1/visits/queue` (client-filtered) | Wall-display styling, revalidates every 5s. |
| `/visit/[id]` | `GET /v1/visits/{id}/summary` | Composed from `VisitSummary`; no dedicated visit-overview endpoint exists. |
| `/visit/[id]/dossier` | `GET /v1/visits/{id}/summary` | Every `SummaryField` rendered with `ProvenanceBadge` (source + confidence, CLAUDE.md rule 4). Rebuilt from scratch — the boilerplate's `clinical-dossier` route aliased to a generic ICD problem-list page with no provenance concept at all. |
| `/visit/[id]/timeline` | `GET /v1/sessions/{id}/timeline` | Visit→session resolved server-side (`src/lib/visit-timeline.ts`) since `TimelineEvent` is session-scoped, not visit-scoped. |
| `/visit/[id]/summary` | `GET /v1/visits/{id}/summary` | Serif clinical-note styling per docs/16. Rebuilt — `clinical-summary` aliased to `discharge-referrals`, unrelated content. |
| `/visit/[id]/summary/print` | `GET /v1/visits/{id}/printable-summary` | Embeds the gateway's own server-rendered HTML (with QR code) via an iframe — one source of truth for what prints, not a second re-derived layout. |
| `/visit/[id]/sign` | `POST /v1/visits/{id}/sign` | Blocks nothing client-side; surfaces unresolved red flags and low-confidence field counts as warnings. |
| `/documents` | Composed: `GET /v1/sessions/{id}/timeline` → `GET /v1/documents/{id}` per `source_document_id` | No "list documents for a visit" endpoint exists — `/v1/sessions/{id}/documents` is upload-only (POST). Takes `?visitId=`; the bare route shows a real visit picker from the queue. |
| `/terminology` | `GET /search`, `POST /translate` on the terminology service directly (`:8003`) | Not gateway-proxied — no `/v1/terminology/*` path exists in `gateway.yaml`. Called server-side (Route Handlers under `/api/terminology/*`), Node-to-Node, same non-gateway-proxied pattern as HAPI. Unreviewed mappings (`reviewed_by: null`) are shown demoted, never as authoritative. |
| `/rules` | Direct filesystem read of `packages/ontology/modules/**/*.yaml` | No API involved — reads the version-controlled source directly, server-side only. Genuinely read-only by construction (no write path exists in the code, not just in the UI). |

## LIVE, partially

| Route | What's real | What's not, and why |
|---|---|---|
| `/medications` | Same document composition as `/documents`, filtered to medication-like `field` names, with real confidence values | The gateway's `Extraction` schema (`/v1/documents/{id}`, used by both routes) only carries `field/value/confidence/bounding_box`. It's missing `needs_confirmation`, `dictionary_matches`, `matched_dictionary` — which docai's own `ExtractedField` schema already has (`packages/contracts/openapi/docai.yaml`). Without those passed through, the CLAUDE.md rule 5 "confirm one of N" shortlist UI can't be built faithfully off the gateway today. Per-medication NAMASTE/ICD-11 dual coding has the same gap. Badged. |
| `/fhir` | `fhir_bundle_id`, `abdm_status`, `care_context_status` — the real `POST /v1/visits/{id}/sign` response, passed through as query params right after signing | The bundle **body** is not shown, and can't be: `validateBundleAgainstHapi` (`packages/fhir/src/hapi-client.ts`) calls HAPI's stateless `$validate` operation only — nothing is ever persisted to the local HAPI server. The signed bundle exists solely as JSON on the gateway's `Visit` row, with no endpoint exposing it. Needs either a new `GET /v1/visits/{id}/fhir-bundle` endpoint, or changing sign to actually create (not `$validate`) the bundle on HAPI. Not invented here — flagged for a decision. Also, re-opening an *already*-signed visit's FHIR page cold (no query params) has no lookup path at all yet. |
| `/consent` | Real per-session `consent_scopes` (`GET /v1/sessions/{id}`) and the FHIR Consent resource (`GET /v1/sessions/{id}/consent/resource`) | These are session-scoped, not a cross-patient DPDP admin surface. TTL wipe / break-glass / key-rotation controls have no backing endpoint — that section is badged. |
| `/rules/predicates` | The screen is genuinely read-only now (see Safety fix below) | The specific rule shown (`RF-CARD-01`) and its synthetic test cases are still the boilerplate's illustrative content — not read from `packages/ontology`'s real `chest_pain.yaml` red flags. Badged. A real version would need the ontology's `red_flags:` blocks rendered the way `/rules` already renders `slots:`. |

## MOCK — badged, no backend path exists

| Route | Why |
|---|---|
| `/audit` | An `audit_log` table exists (DB-trigger-enforced, append-only — `services/gateway`'s sign/acknowledge handlers write to it) but no endpoint reads it back. Needs a new `GET /v1/audit-log` (or similar) — not invented here. A fabricated "ISO 27799 / ABDM M3 Certified" badge was removed from this page regardless of its mock status, since that's a specific false compliance claim, not generic placeholder content. |
| `/integrations` | The real hosted→local fallback cascade (Sarvam/Gemini/Bhashini → Ollama/PaddleOCR/IndicConformer, docs/15-ai-stack.md) exists only in structured logs (structlog) today, with no endpoint exposing it. The page's own content (generic HIS subsystem bridges — PACS, LIS, pharmacy vault) was also never rewritten to reflect that story; it's the unmodified boilerplate mock. |
| `/analytics` | No aggregation endpoint exists in any service's OpenAPI contract (gateway, ai, docai, terminology). Newly built as a badged placeholder rather than left unbuilt, since the PS list calls for it. |

## Safety fix applied during wiring

`/rules/predicates` (the boilerplate's `red-flag-rule-builder`) shipped with a "Save Draft"
button, a "Submit to Clinical Board" modal, a "Tune Deterministic Thresholds" modal with live
numeric inputs for clinical cutoffs (ST-elevation mm, troponin ng/mL), and a button whose toast
claimed the rule was "cryptographically active and locked against autonomous AI mutation." None
of these persisted anything server-side — no such endpoint exists — but they visually implied a
user could edit red-flag predicates, which directly contradicts CLAUDE.md rule 3 (red flags are
deterministic, version-controlled rules, never UI-mutable) and this task's explicit instruction.
All were removed; the header now shows a plain "Read-only · version-controlled" badge instead.

## Dropped from the boilerplate (recoverable via `git log -- apps/console`)

Everything not in the PS-scoped route list: billing, CPOE, imaging, IPD admissions, OT/OPD-slot
scheduling, pharmacy dispensing, users/role/permission management, access-session admin,
discharge/referral records, and several duplicate routes that were one-line re-exports of other
pages under a different name (`clinical-queue` → redirected to home, `clinical-dossier` →
aliased `patient-overview`, `clinical-summary` → aliased `discharge-referrals`, `pharmacy` →
aliased `pharmacy-lab`, `radiology` → aliased `imaging`, and others).
