# 06 — Document AI (Drishti)

Five stages. One of them is admitting uncertainty.

## Pipeline

| Stage | What happens | Where |
|---|---|---|
| **1 Capture** | Live edge detection, auto-crop, deskew, glare and blur scoring. Below threshold the patient is asked to retake, with the problem named on screen. | OpenCV.js, on device |
| **2 Classify** | prescription / lab report / discharge summary / imaging / unknown → routes to the right extraction schema. | docai |
| **3 Read** | Printed and tabular content through PaddleOCR; handwritten regions through the VLM. Both paths keep bounding boxes. | docai |
| **4 Extract** | Typed entities: diagnoses; drug + dose + frequency + duration; analyte + value + unit + reference range; procedures; dates. Fuzzy-matched against a drug dictionary and a lab-analyte dictionary. | docai |
| **5 Assemble** | Dates normalised and sorted into a timeline. Out-of-range values flagged. Duplicate and interacting drugs flagged across documents. Written as FHIR resources with a `DocumentReference` back to the scan. | gateway + `packages/fhir` |

Runs async on Celery. The patient continues the interview while it processes. If it fails
entirely, the summary is still complete — documents enrich the history, they do not gate it.

## The rule that makes this defensible

**A handwritten drug name is never auto-accepted.** It surfaces as a shortlist of the closest
dictionary matches for the patient — or, at the console, the physician — to confirm with one
tap.

Handwriting OCR on Indian prescriptions is genuinely hard. A team that says so and engineers
around it outscores a team that claims 98% and gets caught on a live scan. Show the confirm-one-
of-three interaction on stage and explain why it is deliberate.

## Confidence handling

| Confidence | Behaviour |
|---|---|
| High | Included in the summary, provenance chip shows the source region |
| Medium | Included, visually demoted, physician sees "verify" |
| Low | Not asserted. Surfaced as a shortlist to confirm, or omitted with the region still viewable |

Never silently drop a low-confidence extraction without leaving the source scan reachable.

## Capture quality gate

Rejecting a bad photo on the device is worth more than any amount of server-side cleverness.
Score and act on:

- **blur** — Laplacian variance below threshold → "hold still, tap to retake"
- **glare** — saturated region ratio → "move away from the light"
- **coverage** — detected document quad area → "fit the whole paper in the frame"
- **skew** — corrected automatically, not rejected

Show the patient what is wrong in words and an icon, never a numeric score.

## Timeline assembly

Documents arrive undated, wrongly dated, and out of order. Normalisation:

1. Prefer an explicit date on the document.
2. Fall back to a date the patient stated for that document.
3. Fall back to relative ordering only, marked as "approximate".

Never invent a precise date. An approximate marker on the timeline is honest; a fabricated
date is a clinical error.

## Flagging

- **Out-of-range labs** — against the reference range printed on the report where present,
  otherwise against a standard range table, and say which was used.
- **Duplicate therapy** — same molecule from two prescribers.
- **Interactions** — from an open drug interaction dataset. Flag for physician attention only;
  never advise the patient.

## Testing

Photograph twenty real documents — a mix of printed lab reports, printed prescriptions,
handwritten prescriptions and a discharge summary, in at least two languages, some crumpled,
some in poor light. Mark the expected entities by hand. Report printed and handwritten
precision **separately** in the eval table. See doc 12.
