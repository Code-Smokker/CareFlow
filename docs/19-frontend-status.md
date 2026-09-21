# 19 — Frontend status (`apps/console`, `apps/intake`)

Route/screen-by-screen LIVE/MOCK status for both patient-facing and staff frontends, as of the
PS-26047 scope cut described in `apps/README.md`. "LIVE" means the page fetches real data from
a running service at render or action time — not that the code compiles, and not that seed data
happens to be populated for every visit. Verified against a running gateway (`:4000`),
terminology service (`:8003`), local HAPI FHIR (`:8090`), and Postgres/Redis/MinIO
(`docker-compose.yml`) with real seeded visits.

## `apps/intake` — screen-by-screen, all LIVE

Every screen below was walked end-to-end at a phone viewport against a real running gateway
(`make dev`), not against mocked fetches — verified 2026-09-09, the same pass that merged
`design/patient-ui` (a Google AI Studio export, imported as a design source only — see docs/16)
into this app's look. `packages/ontology`'s `chest_pain` and `fever` modules drove the actual
question sequence; two different red-flag rules (`acs_radiation`, `cardiac_with_dyspnoea`) fired
for real off real answers, and one fever-only run completed with zero red flags — both paths
checked. The completed visit and both red flags were confirmed showing up in `apps/console` at
`:3001` (`/queue` and `/visit/[id]/dossier`) with correct `Proxy · 100%` provenance badges on
every field — the full patient → gateway → Postgres → console chain, not a single-app demo.

| Screen | Wired to | Notes |
|---|---|---|
| Check-in (`/`) | `POST /v1/sessions` (walk-in) or in-page QR scan (`BarcodeDetector` + `getUserMedia`, no backend call) | ADR 0002 made visible: a shared device attaches to *a* session via QR, it isn't *the* session. The imported design's fake 6-digit manual-code modal was dropped — no endpoint resolves a short code to a session, and inventing one would mean a component shape ahead of the contract (CLAUDE.md's contracts-first rule). Camera permission is a native browser dialog automation can't drive; see docs/13's manual checklist. |
| Language | `POST /v1/sessions/{id}/language` | Unchanged by this pass. |
| Consent | `POST /v1/sessions/{id}/consent` | Fixed during this pass: the speaker button was a no-op (`onPlay={() => {}}`) — now actually reads the consent copy aloud. |
| ABHA (scan / mobile+OTP) | `POST /v1/identity/abha/{qr,otp/request,otp/verify}` — the real mock-ABDM-gateway endpoints (ADR 0006), not stubbed for this screen | New this pass — one of design/patient-ui's orphan screens, adopted. Verified live: OTP request → wrong code correctly rejected with the mock's real `HIS-2022 Invalid OTP value` error → correct demo code (`000000`, since `ABDM_MODE=mock` fixes it) verified successfully. Known gap, not papered over: `identity.service.ts` doesn't take a `session_id`, so a successful link isn't yet persisted onto the session server-side — kept client-side in `IntakeContext` for display only. Skip is always present and never blocks progress. |
| Attendant / proxy | Client-side only — sets `IntakeContext.isProxy`, which forces every subsequent `POST /v1/sessions/{id}/answer`'s `input_mode` to `"proxy"` regardless of how it was actually answered | New this pass — the other orphan screen, adopted "strongly" per product decision: CLAUDE.md rule 4's `proxy` provenance source existed in the schema with nothing producing it until now. Verified in the database directly (not just the UI): `SELECT input_mode, source FROM answer` showed `proxy`/`proxy` for both a chip-tap and a bodymap-tap answer. Also verified downstream in `apps/console`'s dossier, which renders it as `Proxy · 100%`. |
| Question (voice / chips / multi / duration / bodymap / facescale) | `POST /v1/sessions/{id}/answer` | Unchanged by this pass except the restyle (palette/type/motion) and the proxy override above. Voice input itself still can't be verified by automation — getUserMedia's permission prompt — see docs/13. |
| Red flag | Reacts to `red_flags` in the `/answer` response; no separate call | Tone deliberately did **not** adopt design/patient-ui's alarm styling (pulsing red "IMPORTANT" badge) — verified live that the calm, non-alarming copy and verbatim quote survived the restyle unchanged. |
| Documents | `POST /v1/sessions/{id}/documents` | Unchanged by this pass. |
| Read-back | Renders `IntakeContext.answered`; submit is `POST /v1/sessions/{id}/complete` | Bug found and fixed during this pass: `ProvenanceChip`'s source was hardcoded to only ever resolve to `voice`/`tap`/`bodymap`, silently collapsing `proxy` (and `ocr`) into `tap` — exactly the fact the new attendant screen exists to surface. Now passes `line.input_mode` straight through. Still review-and-confirm, not review-and-edit, by design (see `machine.ts`'s `readback` state comment) — a patient can't edit an already-answered slot; correction is by re-answering, and the clinician edits after. |
| Complete | None (terminal state) | "What happens next" panel folded in from design/patient-ui's `ScreenComplete`, adopted per product decision — cheap, answers the one question every patient in a queue actually has. |

Not carried over from design/patient-ui, and not silently added: `SplashScreen` (costs seconds,
buys nothing in a queue app), `ProfileScreen` (implies patient accounts, out of PS scope), the
duplicate unused `screens/CompleteScreen.tsx`, and `ScreenHandoff` (a second review-and-consent
gate that duplicates Read-back's job, plus an unearned "ISO 27001" compliance badge) — all
explicit product decisions, not oversights.

## `apps/console`

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
| `/audit` | `GET /v1/audit-log` (new — contracts-first: `packages/contracts/openapi/gateway.yaml`, then `services/gateway/src/audit/`) | Reads the real, pre-existing `audit_log` table. `integrity` in the response is a **live** `pg_trigger` query on every request (`audit_log_no_update`/`audit_log_no_delete`), not a stored flag — see `AuditService.checkIntegrity()`. Tested against real Postgres, including a test that the trigger genuinely rejects an `UPDATE`. |
| `/integrations` | `GET /v1/integration-events` (new), backed by a new `provider_cascade_event` table written directly from `services/ai`'s and `services/docai`'s `cascade()` helper — the one call site every hosted→local fallback goes through (docs/15-ai-stack.md) | Every tier attempt, success or failure, is now persisted, not just logged. Verified live: a real `/fill-slot` call against Sarvam recorded a `sarvam · success · 7055ms` row, and existing `fill_slot` fixture tests recorded real `sarvam · failure → local · success` sequences — the actual fallback story, not a mockup of it. |
| `/analytics` | `GET /v1/analytics/summary` (new), aggregate SQL over `Visit`/`RedFlag`/`IntakeSession`/`Summary` | No new data, no separate store. Verified against the real seeded dataset (`?since=2026-01-01`): 36 visits, Chest pain top complaint (12), 11% red-flag rate, ~12s average intake. Defaults to "since start of today" — mostly empty in this dev DB since seed data predates today; the query logic itself is what's verified, not today's count. |

## LIVE, partially

| Route | What's real | What's not, and why |
|---|---|---|
| `/medications` | Same document composition as `/documents`, filtered to medication-like `field` names, with real confidence values | The gateway's `Extraction` schema (`/v1/documents/{id}`, used by both routes) only carries `field/value/confidence/bounding_box`. It's missing `needs_confirmation`, `dictionary_matches`, `matched_dictionary` — which docai's own `ExtractedField` schema already has (`packages/contracts/openapi/docai.yaml`). Without those passed through, the CLAUDE.md rule 5 "confirm one of N" shortlist UI can't be built faithfully off the gateway today. Per-medication NAMASTE/ICD-11 dual coding has the same gap. Badged. |
| `/fhir` | `fhir_bundle_id`, `abdm_status`, `care_context_status` — the real `POST /v1/visits/{id}/sign` response, passed through as query params right after signing | The bundle **body** is not shown, and can't be: `validateBundleAgainstHapi` (`packages/fhir/src/hapi-client.ts`) calls HAPI's stateless `$validate` operation only — nothing is ever persisted to the local HAPI server. The signed bundle exists solely as JSON on the gateway's `Visit` row, with no endpoint exposing it. Needs either a new `GET /v1/visits/{id}/fhir-bundle` endpoint, or changing sign to actually create (not `$validate`) the bundle on HAPI. Not invented here — flagged for a decision. Also, re-opening an *already*-signed visit's FHIR page cold (no query params) has no lookup path at all yet. |
| `/consent` | Real per-session `consent_scopes` (`GET /v1/sessions/{id}`) and the FHIR Consent resource (`GET /v1/sessions/{id}/consent/resource`) | These are session-scoped, not a cross-patient DPDP admin surface. TTL wipe / break-glass / key-rotation controls have no backing endpoint — that section is badged. |
| `/rules/predicates` | The screen is genuinely read-only now (see Safety fix below) | The specific rule shown (`RF-CARD-01`) and its synthetic test cases are still the boilerplate's illustrative content — not read from `packages/ontology`'s real `chest_pain.yaml` red flags. Badged. A real version would need the ontology's `red_flags:` blocks rendered the way `/rules` already renders `slots:`. |

## MOCK — badged, no backend path exists

None currently. `/audit`, `/integrations` and `/analytics` were the three routes here; all three
now have real endpoints (see the LIVE table above). A fabricated "ISO 27799 / ABDM M3 Certified"
badge that was on the old mock `/audit` page was removed when it was rebuilt — a specific false
compliance claim, not generic placeholder content, and worth remembering as an example of what
this pass was watching for.

### New backend surface added for this pass

- **`packages/contracts/openapi/gateway.yaml`**: `GET /v1/audit-log`, `GET /v1/integration-events`,
  `GET /v1/analytics/summary` — contracts-first, implemented after.
- **`services/gateway/prisma/schema.prisma`**: new `ProviderCascadeEvent` model /
  `provider_cascade_event` table (migration `20260908073818_provider_cascade_event`). Prisma
  migrates it; `services/ai` and `services/docai` read/write it directly via `asyncpg`, same
  convention as `dictionary_entry`.
- **`services/ai/app/cascade.py`, `services/docai/app/cascade.py`**: `cascade()` now takes a
  required `capability` label and persists every tier attempt (success and failure) — best
  effort, wrapped so a telemetry write can never break the actual request. Both services'
  existing cascade unit tests keep passing unchanged in behavior (this only adds a side effect);
  new `test_cascade_persistence.py` in each service proves rows actually land.
- **Gateway**: new `audit`, `integrations`, `analytics` NestJS modules (11 new tests, all
  against real Postgres — this repo's existing convention, no mocked Prisma).

### One real side effect worth knowing about

The `audit.service.spec.ts` test suite writes real rows to `audit_log` — and, proven by one of
its own tests, **cannot delete them afterward**: the append-only trigger rejects that exactly
like it would in production. Every gateway test run against this local dev database leaves a
handful of `test.action` / `unit_test.*` rows in `/audit` permanently. Harmless (clearly tagged,
easy to filter out or ignore) but real — expect `/audit` in this dev environment to accumulate
test noise over time. A demo run should either filter by resource/action, or reset the DB
(`docker compose down -v && up`, then re-migrate) beforehand for a clean log.

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

---

## `doctorwebapp` — Ayurvedic Case Record & Demo Path

Bound via `doctorwebapp/careflow-live.js` and `doctorwebapp/careflow-ayurveda.js`, preserving static Tailwind HTML markup and design.

| Screen | Key | Wired to | Status & Notes |
|---|---|---|---|
| Dashboard | `w03` | `GET /v1/visits/queue` | **LIVE**: Populates "Today's patients" table with live OPD tokens, wait times, priority status, and "Needs attention" list for active red flags. |
| Patient Directory | `w04` | `GET /v1/visits/queue`, `GET /v1/visits/{id}/summary` | **LIVE**: Renders OPD queue with patient status pills (`Ready for review`, `In progress`, `Signed`, `Important`), complaint summary, and direct links to profile or red flags. |
| Patient Profile | `w05` | `GET /v1/visits/{id}/summary`, `GET /v1/visits/queue` | **LIVE**: Displays patient concern, structured HPI chips with provenance, red flag alert banners, and re-points the primary action button to the Ayurvedic Case Record (`a01`). |
| Care Summary | `w11` | `GET /v1/visits/{id}/summary`, `GET /v1/ayurveda/vocabulary` | **LIVE**: Renders HPI questionnaire review and appends the "Ayurvediya Rugna Pariksha" card with complete case sheet rows and Vaidya chips. |
| Red Flag Alerts | `w13` | `GET /v1/visits/queue`, `POST /v1/redflags/{id}/acknowledge` | **LIVE**: Displays unacknowledged red flags; one-tap acknowledge updates the queue and records an audit log row. |
| Register patient + token slip | modal on `w03`/`w04` | `GET /v1/departments`, `POST /v1/sessions` (with `patient`) | **LIVE** (replaces the old sample-data modal, which only showed a toast). Name, phone and ABHA number are stored AES-GCM encrypted; age becomes an approximate DOB. Returns the token number and a server-rendered QR (PNG data URL, no CDN) that encodes `apps/intake`'s `/s/{id}?token=`. Verified in the browser: the QR decodes to that link, the patient appears in the queue by name immediately, and their age feeds the Vaya band. Print opens a slip window. |
| Documents (list + upload) | `w09` | `GET /v1/visits/{id}/documents`, `POST /v1/sessions/{id}/documents` | **LIVE**: real counts, per-document OCR status and extractions, upload by browse / camera / drag-and-drop attached to the visit's session. Verified: upload succeeds and shows "Queued". **OCR does not complete in this environment** — see "Known environment blocker" below. |
| Document review | `w10` | `GET /v1/documents/{id}/file`, `POST /v1/extractions/{id}/confirm` | **LIVE**: original image beside the extracted values; each value needs a person's Confirm (audited, refused twice) — handwritten output is never auto-accepted (CLAUDE.md rule 5). Not exercised against real OCR output yet (blocked as above). |
| Intake overview / Symptoms / Questionnaire / Read-back | `w06`–`w08`, `w12` | `GET /v1/visits/{id}/summary`, `GET /v1/visits/{id}/ayurveda` | **LIVE**: the patient's own answers with provenance chips; a visit whose patient is still answering shows "intake in progress" rather than an error. Read-back speaks the summary with the browser voice. |
| Handoff / Session complete | `w14`, `w15` | `POST /v1/visits/{id}/sign`, `GET /v1/visits/{id}/printable-summary` | **LIVE**: sign from the doctor UI. Verified: signed bundle has 77 Observations + 2 Conditions, **0 HAPI errors** (304 warnings: unknown code systems, best-practice), 71 Ayurvedic Observations all flagged NAMASTE `PLACEHOLDER`; the print view carries every Ayurvedic section. |
| Analytics | `w17` | `GET /v1/analytics/summary` | **LIVE**: throughput, red-flag rate, average intake time, top complaints. |
| System status | `w18` | `GET /health`, `GET /v1/audit-log`, `GET /v1/integration-events`, `GET /v1/ayurveda/vocabulary` | **LIVE**, but it replaces the design's Settings screen: there is no clinician login or per-user setting to show. |
| Appointments | `w16` | — | **No backend.** The page states this instead of showing invented appointments. |
| Login / Landing | `w02`, `w01` | — | **Not connected.** No authentication exists yet (actions are recorded under a shared identifier); these two static pages still contain design sample content. |
| Search palette (Cmd+K) | all pages | queue, `GET /v1/terminology/search` | **LIVE** — its hardcoded fake patients and invented "NAMASTE" codes were removed. Terminology results are listed alphabetically, never ranked. |
| Ayurvedic Case Record | `a01` | `GET /v1/ayurveda/vocabulary`, `GET/PUT /v1/visits/{id}/ayurveda`, `GET /v1/terminology/search`, `POST /v1/terminology/translate`, `POST /v1/visits/{id}/sign`, `GET /v1/visits/{id}/printable-summary` | **LIVE**: Step 1 renders read-only Prashna (43 questions) + Prakriti score chart. Steps 2–4 render dynamic forms with patient-reported pre-fills and Mala override. Computes BMI and Vaya age band in real time. Step 5 provides NAMASTE diagnosis search and ICD-11 TM2 translation. Step 6 displays case sheet, executes HAPI FHIR-validated signing, and links to the A4 print view. Post-sign saves are locked (409). |

### Known environment blocker: OCR does not run

Documents upload and store, but stay "Queued". `localhost:6379` is served by a native Homebrew
`redis-server` that cannot persist to disk (`MISCONF`), shadowing the healthy Docker Redis, so the
docai Celery broker refuses writes; the docai worker is also not running. Fix: stop the native
Redis (`brew services stop redis`) so Docker's is used, then start the docai worker (`make dev`).

### Where mock data is deliberately gone

Every card the design filled with sample patients, documents, appointments, notes and voice
recordings on `w03`, `w05`, `w11`, `w13` is now either bound to real data or removed. A scan of all
19 rendered pages for the design's sample strings finds none except on `w01` and `w02`.

---

## `userwebapp` — Patient Self-Intake

Bound via `userwebapp/shared_careflow.js` with full `CareFlow.api` and `CareFlow.qrScanner` integration.

| Screen | File | Wired to | Status & Notes |
|---|---|---|---|
| Scan / Check-in | `02_scan_qr_code/code.html` | Live QR Scanner (Camera + BarcodeDetector + File fallback) | **LIVE**: Scans OPD QR codes and initializes session via `POST /v1/sessions`. |
| Language | `04_language_selection/code.html` | `POST /v1/sessions/{id}/language` | **LIVE**: Sets preferred intake language (English, Hindi, etc.). |
| Consent | `05_consent_and_permissions/code.html` | `POST /v1/sessions/{id}/consent` | **LIVE**: Records patient consent with valid scopes. |
| Symptoms / Complaint | `07_symptoms_and_chief_complaint/code.html` | `POST /v1/sessions/{id}/answer` | **LIVE**: Submits `chief_complaint` slot. |
| Health Questionnaire | `08_health_questionnaire/code.html` | `POST /v1/sessions/{id}/answer` | **LIVE**: Drives sequential question answering with voice and tap inputs. |
| Documents Upload | `09_clinical_documents_upload/code.html` | `POST /v1/sessions/{id}/documents` | **LIVE**: Uploads patient clinical records and lab reports. |
| Summary Review | `11_summary_and_review/code.html` | `GET /v1/visits/{id}/summary` | **LIVE**: Displays structured read-back summary with provenance chips. |
| Session Complete | `24_session_complete/code.html` | `POST /v1/sessions/{id}/complete` | **LIVE**: Finalizes intake session and returns token and next steps in queue. |

---

## `adminwebapp` — Admin & Operations Control Center

Bound via `adminwebapp/shared_nav.js` with live backend access (`CareFlow.api`) connecting to `http://localhost:4000`.

| Screen / Feature | Path | Wired to | Status & Notes |
|---|---|---|---|
| Admin & Operations Control Center | `careflow_admin_panel/code.html` | `GET /v1/visits/queue`, `GET /v1/audit-log`, `GET /v1/integration-events`, `POST /v1/redflags/{id}/acknowledge` | **LIVE**: Central operations console monitoring live OPD queue tokens, real-time wait times, unacknowledged red flags with one-tap acknowledgment, append-only audit trail with DB-trigger integrity verification, and AI cascade telemetry. Direct links to Doctor App (`:3020`), Patient App (`/userwebapp/`), and Staff Console (`:3011`). |
| Master Suite Shell | `index.html` | Embedded controller & viewport switcher | **LIVE**: Includes dedicated `ADM: Admin & Operations Control Center` tab, responsive viewport switcher, and navigation across all 20 patient experience screens plus admin operations. |
| Patient Experience (P01–P20) | `careflow_patient_web_p01` through `p20` | `shared_nav.js` (`CareFlow.api`) | **LIVE**: Navigation dock includes direct Admin Panel jump button; exposed API client provides session creation, ABHA OTP verification, consent, and document uploads. |
