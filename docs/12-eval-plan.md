# 12 — Eval plan

Bring numbers. Almost nobody does.

## The golden set

Write **30 synthetic patient scripts** in `eval/scripts/`. Each is a scripted set of patient
utterances plus the slot values a clinician says should result.

Composition:

| | Count |
|---|---|
| Common OPD complaints across the five modules | 14 |
| AYUSH cases exercising the Dashavidha path | 3 |
| Red-flag cases that must escalate | 5 |
| Deliberately messy — mumbling, background noise, self-contradiction, code-switching | 5 |
| Follow-up visits (delta only) | 3 |

Have a medical student or an Ayurveda faculty contact mark the expected values. Their sign-off
is worth more in judging than the score itself — say who reviewed it.

**Synthetic only. Never a real patient, never a real ABHA number.**

## Metrics

| Metric | Measured as | Target to state |
|---|---|---|
| History completeness | required slots filled ÷ required slots, versus a manual baseline you time yourselves | > 90% |
| Slot accuracy | filled values matching the clinician-marked expected value | > 85% |
| Red-flag sensitivity | flag cases correctly escalated | **100% on the eval set** |
| Red-flag specificity | non-flag cases not escalated | report it, do not optimise it |
| Turn latency | p95, end-of-speech → next prompt audio | < 1.2 s |
| Intake duration | median wall-clock for a full history | 4–6 min |
| Physician time saved | timed manual history minus timed console read | state the measured delta |
| Extraction precision | correct entities ÷ extracted, on 20 photographed documents | **printed and handwritten reported separately** |
| Concurrency | k6, 200 simultaneous sessions | 0 errors |

## Sensitivity over precision

A false alarm costs a nurse thirty seconds. A miss costs everything else. Tune the red-flag
thresholds for recall and report the false-positive rate honestly rather than hiding it.

## Report the handwriting number honestly

Printed-document extraction will score well. Handwritten prescriptions will not. Show both,
separately, and pair the weak number with the human-in-the-loop design from doc 06.

A team that knows exactly where its system is weak reads as the team that could actually
deploy this.

## Harness

```
eval/
├─ scripts/            # 30 YAML patient scripts
├─ documents/          # 20 photographed documents + expected entities
├─ run.py              # replays scripts through the ai service, scores, prints the table
└─ report/             # generated markdown + CSV, committed after the final run
```

`make eval` must run it end to end and print the table. A judge should be able to run it
themselves with one command — that alone separates you from most of the field.

## Load test

k6 script in `eval/load/`. 200 concurrent sessions, ramped. Record p95 latency and error rate.
Run it against the local stack on Day 5 and screenshot the output.

## What goes on the slide

The table, the reviewer's name and credential, the baseline methodology in one line, and the
weak number shown next to its mitigation. Nothing rounded up. Nothing estimated presented as
measured.
