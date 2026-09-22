# 13 — Demo script

**This is the acceptance test.** If a change breaks any beat below, it does not merge.

Written on Day 0 so everything gets built toward it. Ninety seconds. Two phones and a laptop,
with the triage board and clinician console side by side on a second screen.

## Setup

- **Run `make demo-reset` first. Every time. No exceptions.** It wipes the database, restarts
  every service, and seeds one clean signed demo patient. Skipping this is not a shortcut — the
  audit_log table is append-only (a Postgres trigger, not convention), so every gateway test run
  anyone has done against this database leaves permanent rows in it that nothing can delete.
  `/quality-audit-logs` on the triage/clinician console reads real data: an unreset database
  means a judge who clicks it sees a wall of `test.action` / `unit_test.*` noise instead of the
  one clean, real, signed patient this script walks. `make demo-reset` is the only way to get a
  presentable `/audit` screen — there is no delete button, on purpose.
- Laptop running the full stack offline: local ASR, local LLM, HAPI FHIR, mock ABDM
- Phone A — patient one (chest pain, Hindi)
- Phone B — patient two (Ayurvedic case with documents)
- Second screen — triage board left, clinician console right
- Printed token slip with a QR
- A real crumpled handwritten prescription and a printed lab report
- **Backup video downloaded on two laptops**

## Patient side on a real phone — the manual test (`userwebapp`)

The patient app is `userwebapp/` (the design's screens, bound to the gateway by `careflow-live.js`) served by
`scripts/serve-userwebapp.mjs` on **:3030** — one origin that also proxies `/api/v1/*` to the gateway. `make dev`
starts it. A phone's microphone only works on **HTTPS** (or `localhost` on the same device), so for a real phone:

1. `make dev` — wait for every health check. (First document after a cold start takes ~50 s while the OCR models
   load; run one throwaway document before the audience arrives.)
2. `make tunnel` — prints an `https://….trycloudflare.com` URL and records it where the gateway looks. Token slips
   issued **after** this encode that URL. (`INTAKE_PUBLIC_URL` in `.env` overrides it with a permanent origin.)
3. Doctor app (`doctorwebapp`, `w03`): **Add patient** → pick the department → **Issue token & QR**. Print the
   80 mm slip or leave the QR on screen.
4. Phone: scan the QR with the camera (no app, no login). You land on **language**; pick Hindi.
5. **Consent**: three switches. *Share my voice recording with the doctor* is **off by default** — switch it on for
   this test. Tap **Agree & continue**. "Withdraw my consent" (bottom of every screen) deletes everything.
6. ABHA: **Skip**. Who is answering: **I'll answer for myself**.
7. **Speak** — this is the one step only a human with a real microphone can verify: tap the mic on any question and
   say the answer. It records, stops itself when you pause, transcribes (Sarvam), fits the words to the options and
   **selects** the matching one for you to confirm. If it does not hear you, the taps are right there.
8. Chest pain → answer *pressure*, *sweating*, severity ≥ 7. The red-flag screen appears, is read aloud, and quotes
   your own answers. On the second screen the triage board turns red (measured: **≈ 0.5 s** after the tap).
9. Documents: point the camera at a prescription (or **Choose from gallery**), **Use this page**, wait for
   *We found…* — every value says **Doctor will confirm**.
10. Read-back → tick the box → **Continue**. The token appears. On the doctor app open the patient: a **▶** beside
    a voice-sourced fact plays *your* recording (each play is audited). **Sign** the summary and the recording is
    deleted; so it is after 24 h, or the moment you withdraw consent.

What automation could and could not prove is in `docs/19-frontend-status.md` — a real microphone is **not** marked
verified there until a person has done step 7.

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
- `make demo-reset` before the **final** rehearsal too, not just the real thing — a database full
  of every earlier rehearsal's patients is its own kind of unconvincing.
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
