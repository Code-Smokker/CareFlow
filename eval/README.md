# eval

The numbers we bring to judging. Almost nobody else will.

```
scripts/     30 synthetic patient scripts + clinician-marked expected slot values
documents/   20 photographed documents + expected entities
load/        k6 script, 200 concurrent sessions
run.py       replays scripts through the ai service, scores, prints the table
report/      generated markdown + CSV, committed after the final run
```

`make eval` runs it end to end and prints the metrics table. A judge should be able to run it
themselves with one command.

Composition of the golden set, targets, and what goes on the slide: `docs/12-eval-plan.md`.

**Synthetic patients only.** Never a real patient, never a real ABHA number, never a real
document with identifiable information — photograph blanks or your own paperwork with the
identifiers removed.

Every new red-flag rule ships with a case here. That is a review requirement, not a suggestion.
