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

## OCR reality check (this machine — Apple M2, arm64, 16GB RAM, no CUDA)

Tested before choosing, not assumed:

- **`paddlepaddle` has no wheel for Python 3.14** (this machine's default `python3`). It does
  ship a working `macosx_11_0_arm64` wheel for **3.9–3.13** — installed and verified on 3.12:
  imports, reports `is_compiled_with_cuda() == False` (correct — no CUDA on Apple Silicon,
  runs CPU-only), creates a tensor correctly. So the framework genuinely runs here, given the
  right Python.
- **It's slow to import.** A bare `import paddle` plus one tensor op took ~7 minutes wall-clock
  on this machine the first time. That's before loading any OCR model. Any `local` tier here
  needs a generous timeout and needs to warm up once at startup, not per-request.
- **PaddleOCR-VL-1.6's weights are ~1.8 GB** (`model.safetensors`, confirmed via HTTP
  `content-length`), loadable through `transformers` (merged into the library December 2025).
  It has never been run on this machine: **disk was at 100% capacity (359 MB free) when
  checked**, genuinely insufficient to download it regardless of whether the framework works.
  This is an environment problem, not a PaddleOCR-VL-on-Apple-Silicon problem — but it's the
  actual, current blocker, and designing around "it should theoretically work" instead of this
  would have been dishonest.

**What this means for the design:** the `local` tier is written correctly (lazy-loaded, same
pattern as `services/ai/app/speech/local.py`'s offline ASR — matching PaddleOCR-VL's own model
card usage) but is **unexercised in this environment**, exactly like that ASR tier already is.
The `stub` tier is what's actually verified end-to-end today. See `services/docai/app/ocr/`.

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
