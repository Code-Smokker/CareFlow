# 06 — Document AI (Drishti)

Five stages. One of them is admitting uncertainty.

## Pipeline

| Stage | What happens | Where |
|---|---|---|
| **1 Capture** | Live edge detection, auto-crop, deskew. Glare/blur scoring and the retake prompt are not built yet. | Canvas 2D, on device (`userwebapp/document-scanner.js`) — no OpenCV.js/WASM dependency |
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
  right Python. (This service's own venv now runs Python 3.14 for everything else — GLiNER's
  torch dependency does ship a 3.14 wheel, verified — so `paddlepaddle` itself stays uninstalled;
  it's not actually what `local.py` uses. See below.)
- **The disk-space blocker this section used to describe is gone.** PaddleOCR-VL-1.6's ~1.8 GB
  weights (`model.safetensors`) are downloaded and cached
  (`~/.cache/huggingface/hub/models--PaddlePaddle--PaddleOCR-VL`). The actual, current blocker
  is a code incompatibility, diagnosed two levels deep as of 2026-09-07:

  1. **`local.py`'s approach — `pipeline("image-text-to-text", ...)`** fails because
     PaddleOCR-VL's remote modeling code never registers `PaddleOCRVLConfig` into
     transformers' `AutoModelForImageTextToText` mapping. Tried on transformers 4.55.0 (the
     exact version this model's own `config.json` says it was authored against), 4.57.1, and
     5.13.1 — all fail the same way ("Unrecognized configuration class ... for this kind of
     AutoModel"), except 5.13.1, which gets further and fails differently (next point).
  2. **The suspected real fix — load the model's own class directly** (`AutoModelForCausalLM
     .from_pretrained(model_id, trust_remote_code=True)`, bypassing `pipeline()`'s generic
     factory entirely) was tried live against transformers 5.13.1 / torch 2.14.0 and gets
     further — the processor loads fine — but the model constructor itself fails:
     `KeyError: 'default'` in `transformers.modeling_rope_utils.ROPE_INIT_FUNCTIONS`, raised
     from the vendor's own `modeling_paddleocr_vl.py` (`RotaryEmbedding.__init__` looks up
     `ROPE_INIT_FUNCTIONS[self.rope_type]` where `rope_type` is `"default"`). Transformers
     5.13.1's `ROPE_INIT_FUNCTIONS` registry no longer has a `"default"` key at all — only
     `linear, dynamic, yarn, longrope, llama3, proportional` — a breaking change in
     transformers' RoPE API (matching the deprecation warning this same run prints:
     `rope_config_validation is deprecated ... moved to
     RotaryEmbeddingConfigMixin.validate_rope`). PaddleOCR-VL's vendored code was written
     against an older RoPE API shape and was never updated for this rename.

  **What this means:** the fix is not "call the model differently" — that was tried and hits a
  second, unrelated incompatibility. What's needed is either (a) a transformers version that
  satisfies both constraints (registers `PaddleOCRVLConfig` for `AutoModel` dispatch *and*
  still has `ROPE_INIT_FUNCTIONS["default"]`) — not yet found among 4.55.0/4.57.1/5.13.1 — or
  (b) patching the vendor's remote code locally to use a registered rope_type. Neither is done.
  Downgrading transformers repo-wide to hunt for that window was not attempted here: this
  service's GLiNER extraction tier (packages/ontology's C2 pass) already depends on and is
  verified against transformers 5.13.1 in the same venv, and an untested downgrade right before
  a demo risks breaking a tier that currently works to chase one that doesn't.
- **It's slow to import.** A bare `import paddle` plus one tensor op took ~7 minutes wall-clock
  on this machine the first time it was tried (see git history) — before loading any OCR model.
  Moot while `paddlepaddle` itself stays uninstalled (see above), but any future `local` tier
  built on it needs a generous timeout and a startup-time warm-up, not per-request loading.

**What this means for the design:** the `local` tier is written correctly (lazy-loaded, same
pattern as `services/ai/app/speech/local.py`'s offline ASR — matching PaddleOCR-VL's own model
card usage, and `trust_remote_code=True` is set, fixing the separate interactive-hang bug this
tier used to have) but **cannot actually serve a request in this environment** — it fails fast
with `ProviderUnavailable`, not a hang, so the hosted → local → stub cascade still degrades
honestly. The `hosted` tier (Gemini) is what's actually verified end-to-end today, S3 refs
included — see `services/docai/app/ocr/hosted.py` and `test/test_ocr_s3.py`.

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
