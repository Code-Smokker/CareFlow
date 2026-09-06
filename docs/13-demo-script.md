# 13 — Demo script

**This is the acceptance test.** If a change breaks any beat below, it does not merge.

Written on Day 0 so everything gets built toward it. Ninety seconds. Two phones and a laptop,
with the triage board and clinician console side by side on a second screen.

## Setup

- Laptop running the full stack offline: local ASR, local LLM, HAPI FHIR, mock ABDM
- Phone A — patient one (chest pain, Hindi)
- Phone B — patient two (Ayurvedic case with documents)
- Second screen — triage board left, clinician console right
- Printed token slip with a QR
- A real crumpled handwritten prescription and a printed lab report
- **Backup video downloaded on two laptops**

## Beats

| Time | Beat |
|---|---|
| **0:00** | **The reframe.** "Five thousand patients. Two minutes each. Ten kiosks can't fix that — but every one of those patients is already waiting ninety minutes." Token slip on camera, QR visible. |
| **0:10** | **Identify.** Scan the ABHA QR on Phone A. Name and age appear. No typing, no login. Consent plays aloud in Hindi; three toggles; tap accept. |
| **0:25** | **Speak.** In Hindi: *"do din se seene mein dard hai, paseena bhi aata hai."* The follow-ups branch — character, radiation, associated symptoms — and slots fill live on the projected console. |
| **0:40** | **Escalate.** Red-flag rule fires. Triage board goes red, the token jumps to the top of the queue, the nurse tablet buzzes. **Say nothing for two seconds** and let the room watch it happen. |
| **0:50** | **Scan.** Phone B: photograph the crumpled handwritten prescription and the lab report. Timeline assembles. Creatinine flags out-of-range. One handwritten drug shows "confirm one of these three" — point at it and say why that is deliberate. |
| **1:05** | **Read.** Clinician console. Eight-second summary. Tap a provenance chip and play back the patient's own voice for that line. Show the Ayurvedic case beside it with NAMASTE and ICD-11 TM2 codes side by side. |
| **1:20** | **Sign.** Physician edits one field, hits *Accept & sign*. FHIR OPConsultRecord bundle appears, validates, links to the ABHA record. |
| **1:28** | **The kicker.** Pull the network cable. Start a new intake. It keeps working on the local model, then syncs when you plug back in. Close on the metrics dashboard. |

## Rehearsal rules

- Run it **five times** on Day 5. If it fails once, fix and reset the count.
- Run it **once with the network physically off** — that rehearsal is what makes the
  degradation table in doc 01 true rather than aspirational.
- One person drives, one narrates. Never both on the same laptop.
- Never type during the demo. Every input is a scan, a tap, or speech.
- Rehearse the recovery: if a beat fails, the narrator moves to the next beat and the driver
  resets silently. Do not debug on stage.

## The lines that matter

Opening: *"Ten kiosks cannot see five thousand patients. But five thousand patients are already
sitting in that corridor for ninety minutes each. We built for the waiting room, not for the
kiosk."*

On safety: *"CareFlow never diagnoses. It structures history. The red flags are deterministic
rules, not model judgement, and the physician signs every summary."*

On the ministry: *"Every Ayurvedic finding comes out coded twice — NAMASTE and ICD-11 TM2 —
because that is where AIIA is taking AYUSH records."*

On limits: *"Handwriting OCR is hard. Here is our number. Here is why we never auto-accept a
handwritten drug name."*
