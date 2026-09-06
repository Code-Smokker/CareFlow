<div align="center">

# CareFlow

**The history reaches the doctor before the patient does.**

AI clinical intake for Indian OPDs — conversational history in the patient's own language,
medical-document digitisation, and a physician-ready structured summary, all completed
before the consultation begins.

Smart India Hackathon 2026 · Problem Statement **26047** · Ministry of Ayush,
All India Institute of Ayurveda

</div>

---

## The problem, as arithmetic

A tertiary Indian government hospital registers 4,000–10,000 OPD patients a day. Average
consultation time is 2–5 minutes. Inside that window a physician must elicit a history,
examine, read prior records, reason, counsel and prescribe. History taking — which alone
yields the correct diagnosis in 70–80% of cases — is the part that gets cut.

AYUSH institutions carry more, not less: Dashavidha Pariksha asks for ten assessment axes
before you reach the presenting complaint.

## Why this is not a kiosk

A thorough conversational history takes 4–6 minutes. At realistic throughput one kiosk clears
roughly 50–60 patients in a morning OPD. Serving 5,000 needs on the order of eighty kiosks —
a hardware procurement programme, for a problem statement filed under *Category: Software*.

So CareFlow is an **intake session**, not a device. The token slip carries a QR. The patient
scans it with their own phone, or walks to a shared kiosk, or a volunteer opens it on a tablet.
Same session, same record, same summary. Hardware becomes an optional accelerator, and the
ninety minutes a patient already spends waiting becomes the compute.

---

## What it does

| | |
|---|---|
| **Samvad** | Adaptive voice + touch history interview. Indic ASR, ontology-driven follow-ups, SOCRATES slot filling, TTS read-back. Every question answerable by speaking, tapping, or pointing at a body map. |
| **Drishti** | Photograph old prescriptions, lab reports and discharge summaries. Multilingual printed and handwritten OCR, entity extraction, chronological timeline, out-of-range and drug-interaction flagging. |
| **Saar** | Structured, physician-ready summary in standard clinical order, with a provenance chip on every field. A draft the physician accepts, amends or rejects — never an autonomous assertion. |
| **Setu** | ABHA identity, FHIR R4 bundles per the NRCES ABDM implementation guide, care-context linking, HIS adapter. |
| **Kavach** | Audio-explained granular consent, DPDP 2023 posture, field-level encryption, session TTL wipe, de-identification proxy, append-only audit log. |
| **Nadi** | Deterministic red-flag detection that re-prioritises the token queue and pushes a live alert to the triage nurse — not just a badge on a screen. |

## What makes it different

1. **Device-agnostic session** — phone, kiosk, tablet or desk, interchangeable mid-interview.
2. **NAMASTE ↔ ICD-11 TM2 dual coding** — every Ayurvedic finding emitted with both the national
   AYUSH code and the WHO Traditional Medicine Module 2 code, served by a real FHIR terminology
   service with `$translate`.
3. **The LLM never decides what to ask** — a YAML-declared clinical ontology drives the interview;
   the model only phrases and parses. Auditable, testable, safe.
4. **Red flags move the queue** — the token actually re-prioritises and the nurse board lights up.
5. **No dead ends** — speak it, tap it, or point at it. Text entry is never required.
6. **Provenance on every fact** — tap a field to hear the patient say it, or see the region of the
   scan it came from.
7. **Follow-up mode asks only the delta** — a returning patient is not re-interviewed.
8. **Attendant mode** — records who is answering and marks second-hand statements as such.
9. **De-identification proxy** — and a config flag that runs everything on-premise.

---

## Getting started

**Prerequisites** — Node 22 (`nvm use`), pnpm 9, Python 3.12, Docker Desktop.

```bash
git clone https://github.com/Code-Smokker/CareFlow.git
cd CareFlow

make setup      # creates .env, installs node deps
make up         # postgres, redis, minio, local HAPI FHIR
make dev        # runs apps and services in watch mode
```

Then fill in `.env`. Nothing is blocking on day one — every external API has a local fallback
and `ABDM_MODE=mock` is the default. See **[docs/API_KEYS.md](docs/API_KEYS.md)** for what to
obtain and in what order.

| Service | URL |
|---|---|
| Patient intake | http://localhost:3000 |
| Clinician console | http://localhost:3001 |
| Triage board | http://localhost:3002 |
| Admin analytics | http://localhost:3003 |
| API gateway | http://localhost:4000 |
| HAPI FHIR | http://localhost:8090 |
| MinIO console | http://localhost:9001 |

`make help` lists everything else.

---

## Documentation

Start at **[docs/00-overview.md](docs/00-overview.md)**. The full index is in
[docs/README.md](docs/README.md).

| | |
|---|---|
| [01 Architecture](docs/01-architecture.md) | Services, data flow, deployment |
| [02 Tech stack](docs/02-tech-stack.md) | Every choice and why not the alternative |
| [03 API contracts](docs/03-api-contracts.md) | The interfaces everyone builds against |
| [04 Data model](docs/04-data-model.md) | Tables, and the two columns that matter most |
| [05 Interview engine](docs/05-interview-engine.md) | The ontology and the state machine |
| [06 Document AI](docs/06-document-ai.md) | The five-stage pipeline |
| [07 AYUSH & terminology](docs/07-ayush-terminology.md) | Dashavidha, Prakriti, dual coding |
| [08 ABDM & FHIR](docs/08-abdm-fhir.md) | ABHA v3, bundles, the mock gateway |
| [09 Security & DPDP](docs/09-security-dpdp.md) | Consent, minimisation, boundary control |
| [10 UI guidelines](docs/10-ui-guidelines.md) | Two interfaces with opposite jobs |
| [11 Sprint plan](docs/11-sprint-plan.md) | Five days, six roles, daily goals |
| [12 Eval plan](docs/12-eval-plan.md) | The numbers we bring to judging |
| [13 Demo script](docs/13-demo-script.md) | Ninety seconds, beat by beat |
| [ADRs](docs/adr/) | Decisions that constrain other decisions |

Working agreement for contributors and for Claude Code: **[CLAUDE.md](CLAUDE.md)**.

---

## Status

Day 0 — scaffold and contracts. See [docs/11-sprint-plan.md](docs/11-sprint-plan.md) for what
is next and who owns it.

> **A note on claims.** Where an integration is mocked, this repo says so — in the docs, in the
> code, and on the slide. Verify every terminology code, endpoint path and licence against its
> primary source before presenting. This repo points; the sources decide.

## Licence

MIT — see [LICENSE](LICENSE).
