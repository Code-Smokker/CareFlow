# eval

The numbers we bring to judging. Almost nobody else will.

```
scripts/     8 of the eventual 30 synthetic patient scripts — see "Current state" below
documents/   not started — 20 photographed documents + expected entities, once docai exists
load/        not started — k6 script, 200 concurrent sessions
run.py       replays scripts through the ai service, scores, prints the table
report/      generated markdown + CSV, committed after the final run
```

`make eval` runs it end to end and prints the metrics table — genuinely, right now, against the
8 scripts that exist. A judge can run it themselves with one command (the `ai` service needs to
be running first: `cd services/ai && .venv/bin/uvicorn app.main:app --port 8001`).

## Current state

8 scripts, not the full 30: **5 red-flag cases** (one per rule, across `chest_pain` and
`fever` — `acs_suspected`, `acs_radiation`, `exertional_angina`, `meningism`,
`dengue_warning`) and **3 deliberately messy** ones (mumbling, self-contradiction,
code-switched Hinglish), run through `/fill-slot`. The other 22 — the remaining 9 common-OPD
cases, 3 AYUSH/Dashavidha cases, and 3 follow-up-visit cases — aren't written yet.

Last real run: **5/5 red-flag sensitivity, 3/3 specificity, 0/6 slot accuracy on the messy
cases** — the messy-case number is genuinely 0% in an environment with no `SARVAM_API_KEY`
configured; `/fill-slot` returns an honest `needs_clarification` rather than a guess in every
one of those 6 cases, which is the correct behaviour, not a bug. See `eval/report/`.

Composition of the golden set, targets, and what goes on the slide: `docs/12-eval-plan.md`.

**Synthetic patients only.** Never a real patient, never a real ABHA number, never a real
document with identifiable information — photograph blanks or your own paperwork with the
identifiers removed.

Every new red-flag rule ships with a case here. That is a review requirement, not a suggestion.
