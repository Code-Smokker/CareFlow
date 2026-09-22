# 20 — PS-26047 Compliance: Ayurvedic Case Record (Ayurvediya Rugna Pariksha)

Specification and compliance audit for the Ayurvedic Case Record module (PS-26047) implemented across `packages/ontology`, `services/gateway`, `services/terminology`, `packages/fhir`, and `doctorwebapp`.

---

## 1. Core Principles & Safety Boundaries

| Rule | Requirement | Implementation & Proof |
|---|---|---|
| **Patient vs. Clinician Separation** | The patient answers only what a patient can honestly report (Prashna); the Vaidya records everything requiring clinical examination. | `pariksha-vocabulary.yaml` strictly partitions Prashna (patient intake) from Trividha, Ashtavidha, Dashavidha, and Vyadhi Vinishchaya. Patient answers never assert Vikriti, Samprapti, or diagnoses. |
| **No Autonomous Diagnoses** | CareFlow never suggests, computes, or auto-ranks Vikriti, Samprapti, or Ayurvedic diagnoses. | All diagnosis fields (`vyadhi_vinishchaya.diagnosis.codes`) are clinician-selected. Terminology search results are displayed alphabetically with no AI ranking or score-based reordering. |
| **Provenance & Overrides** | Patient-reported answers mapped to examination fields are presented as pre-fills or references; clinician confirms or overrides while preserving patient's original value. | `AyurvedaService.saveExam()` records clinician disposition (`confirmed` or `overridden`) and attaches the original patient answer, source (`voice`/`tap`/`proxy`), and confidence score. |
| **Append-Only Audit Trail** | Every save of the Ayurvedic case record writes an audit log row in the same transaction. | Verified via `prisma.$transaction` creating `AyurvedaExam` rows and `AuditLog` rows simultaneously. DB trigger prevents `UPDATE` or `DELETE` on `audit_log`. |
| **Immutability Post-Sign** | Once a visit is signed, its Ayurvedic case record is locked against any further modification. | Verified: `PUT /v1/visits/{id}/ayurveda` rejects edits with HTTP `409 Conflict` (`visit_signed`) if `summary.status === 'signed'`. |

---

## 2. Ontology & Vocabulary (`packages/ontology`)

- **Vocabulary File**: `packages/ontology/modules/ayush/pariksha-vocabulary.yaml`
  - Status: `PENDING_EXPERT_REVIEW` (explicit disclaimer that terms, option lists, and cut-offs require qualified practitioner verification before production clinical use).
  - Skipped by interview engine loaders (`*-vocabulary.yaml` naming convention) so it is not treated as patient questionnaire modules.
  - Served via `GET /v1/ayurveda/vocabulary` to drive all dynamic UI forms.
- **Patient Modules**:
  - Eleven dedicated AYUSH Prashna modules: `nidana`, `ahara`, `vihara`, `agni`, `koshtha`, `mutra`, `mala`, `satmya`, `ahara_shakti`, `vyayama_shakti`, `prakriti`.
  - Every option provides bilingual labels (English and Hindi) and icons.
  - Cross-validation enforced in `validate.py` (verifies all slot IDs referenced in `patient_reference` exist in the corresponding YAML modules).
- **AYUSH Mode**:
  - Activated by department (`ayurveda` in `AYUSH_DEPARTMENTS`).
  - An AYUSH session executes the chief complaint module followed by all 11 Prashna modules sequentially.

---

## 3. Calculation & Clinical Rules

1. **Prakriti Scoring**:
   - Condensed demo proxy for CCRAS Prakriti Assessment Scale.
   - Calculates per-dosha counts only (Vata, Pitta, Kapha).
   - Deliberately omits any "dominant dosha" calculation or constitutional assertion — constitution is determined solely by the Vaidya.
2. **Vaya (Age Bands)**:
   - Evaluated from date of birth (DOB) when present, or clinician-entered age.
   - Cut-offs: Bala (< 16 years), Madhya (16–69 years), Vriddha (≥ 70 years) per Sushruta Samhita guidelines.
3. **Pramana (BMI)**:
   - Dynamically computed from height ($cm$) and weight ($kg$): $\text{BMI} = \text{weight} / (\text{height}/100)^2$.

---

## 4. Terminology & Dual Coding (`services/terminology`)

- **NAMASTE Export**: Real export of 2,909 concepts loaded into the terminology database.
- **Proxy Endpoints**: Gateway proxies `GET /v1/terminology/search` and `POST /v1/terminology/translate`.
- **ICD-11 TM2 Linkage**: Dual coding with WHO ICD-11 Chapter 26 (Traditional Medicine - Module 2). Unreviewed mappings carry explicit unreviewed provenance; unlinked codes clearly state "No ICD-11 TM2 link".

---

## 5. FHIR R4 Bundle Assembly (`packages/fhir`)

- On clinician sign (`POST /v1/visits/{id}/sign`), `buildOPConsultRecordBundle()` incorporates:
  - Ayurvedic `Observation` resources with NAMASTE codes (or `PLACEHOLDER` code where unverified) and provenance.
  - `Condition` resources for picked diagnoses with dual coding.
- The assembled bundle is validated against local HAPI FHIR (`:8090`) before sign completes.
- ABDM care context linking is attempted (mocked in demo environment).

---

## 6. Doctor Web Application (`doctorwebapp`)

- **Architecture**: Static Tailwind HTML preserved; live data binding via `careflow-live.js` and `careflow-ayurveda.js`.
- **Demo Path Screens**:
  - `w03` Care Team Dashboard: Live queue, waiting times, red flag counters.
  - `w04` Patient Directory: Live OPD queue table, status pills (`Ready for review`, `In progress`, `Signed`, `Important`).
  - `w05` Patient Profile: Displays structured patient intake, chief complaint, HPI chips, and "Ayurvedic case record" action button.
  - `w11` Care Summary: Merged view with "Ayurvediya Rugna Pariksha" card displaying case sheet rows, Vaidya badges, and vocabulary review status.
  - `w13` Red Flag Alerts: One-tap acknowledge button wired to `POST /v1/redflags/{id}/acknowledge` with audit logging.
  - `a01` Ayurvedic Case Record:
    - Step 1 (Prashna): Read-only patient history + Prakriti score visualization.
    - Steps 2–5: Trividha, Ashtavidha, Dashavidha, and Vyadhi Vinishchaya forms generated dynamically from vocabulary.
    - Step 6: Case sheet review, signing, and A4 print view link.

---

## 7. Patient Web Application (`userwebapp`)

- **Architecture**: the design's static screens, bound to the gateway by `careflow-live.js`; served with an `/api`
  proxy by `scripts/serve-userwebapp.mjs` (one origin — required for a phone microphone over an HTTPS tunnel).
- **Voice and tap on every question** (rule 6): each question screen has real chips/cards/figure/faces *and* a mic;
  typing is optional and never the only path.
- **Provenance** (rule 4): every answer carries `input_mode` (`voice | tap | bodymap | proxy`), confidence, and — for
  a consented spoken answer — the voice-note link. Low-confidence chips are shown demoted, never hidden.
- **Consent-gated recording**: the voice note is stored only if the patient switched on *Share my voice recording with
  the doctor* (default off), is deleted on signing, after 24 h, or on withdrawal, and every play and delete is audited.
- **OCR** (rule 5): extracted values are shown as *We found…* with **Doctor will confirm** — never auto-accepted.
- **Red flags** (rule 3): deterministic, evaluated by the gateway from the ontology rules; the patient app only shows
  and reads the result, quoting the patient's own answers.
- **Honest limits**: ABDM is the local mock registry (said on screen); Marathi/Gujarati/Tamil/Telugu fall back to English
  question text; a human microphone test is still owed (see `docs/19-frontend-status.md`).
