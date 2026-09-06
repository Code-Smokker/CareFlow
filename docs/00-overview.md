# 00 — Overview

## The problem statement

**PS 26047 — Patient Case-Taking Software.** Ministry of Ayush, All India Institute of
Ayurveda. Category: Software. Theme: MedTech / BioTech / HealthTech.

Indian government hospital OPDs register 4,000–10,000 patients a day at 2–5 minutes of
consultation each. History taking — the single highest-yield diagnostic activity, correct in
70–80% of cases on its own — is systematically compressed out. Patients arrive carrying
handwritten paper records in multiple languages that nobody has time to read. AYUSH settings
need *more* history, not less: Dashavidha Pariksha is ten assessment axes before the presenting
complaint.

ABDM has solved the national plumbing — ABHA identity, FHIR interoperability, the health
information exchange. The unsolved part is the **first mile**: nothing captures a structured
history and digitises the patient's paper *before* the consultation starts.

## Our reframe

The problem statement suggests a kiosk. Take the arithmetic seriously and the kiosk breaks:
a thorough history takes 4–6 minutes, one device clears ~50–60 patients across a morning OPD,
and 5,000 patients would need on the order of eighty kiosks. That is a procurement programme,
not software.

**CareFlow is an intake session, not a device.** The token slip prints a QR. Whoever wants to
attach a screen to that session can — the patient's own phone (installable PWA, no app store,
no login), a shared kiosk for those without one, a volunteer's tablet in the queue, the
registration desk. State lives server-side; screens are interchangeable mid-interview.

The scarce resource is not devices. It is physician minutes. The abundant resource is the
ninety minutes every patient already spends waiting. CareFlow moves work from the first to
the second.

## What we build

Six modules, named so the pitch is memorable and the repo is navigable, each mapped to a
lettered module in the PS:

| Module | Does | PS |
|---|---|---|
| **Samvad** (conversation) | Adaptive voice + touch history interview | A |
| **Drishti** (sight) | Medical document digitisation and timeline | B |
| **Saar** (essence) | Structured physician-ready summary | C |
| **Setu** (bridge) | ABHA identity, FHIR, HIS integration | D |
| **Kavach** (armour) | Consent, privacy, DPDP 2023 | D |
| **Nadi** (pulse) | Red-flag detection and queue re-prioritisation | ours |

## The nine differentiators

Each is buildable in five days and demonstrable in under fifteen seconds. That was the filter.

1. **Device-agnostic session** — answers the scalability objection before a judge raises it.
2. **NAMASTE ↔ ICD-11 TM2 dual coding** — the sponsoring ministry's own live policy priority.
3. **The LLM never decides what to ask** — ontology-constrained, auditable, testable.
4. **Red flags move the queue** — token re-prioritises, nurse board alerts, escalation logged.
5. **No dead ends** — speak, tap, or point at a body map. Text entry never required.
6. **Provenance on every fact** — play back the patient's own voice for any field.
7. **Follow-up mode asks only the delta** — the PS names repeated questioning as a failure.
8. **Attendant mode** — Indian OPD patients arrive accompanied; mark second-hand statements.
9. **De-identification proxy** — plus a flag that runs the whole pipeline on-premise.

## What CareFlow deliberately does not do

- It does not diagnose, suggest a differential, or recommend treatment.
- It does not assert an Ayurvedic constitution — it presents the assessment responses for the
  vaidya to confirm.
- It does not auto-accept a handwritten drug name.
- It does not claim a live ABDM integration while running on the mock gateway.

Each of these is a scoring advantage, not a limitation. Say them out loud.

## Success criteria for the build

| | |
|---|---|
| Demo path | Runs end to end, offline, five times in a row without a failure |
| History completeness | > 90% of required slots filled |
| Red-flag sensitivity | 100% on the eval set — tuned for recall, not precision |
| Turn latency | p95 under 1.2 s from end-of-speech to next prompt |
| Numbers on a slide | Measured, from `eval/`, not estimated |
