# 15 — AI stack: buy, borrow, build

**Rule: we integrate, we do not invent.** Nothing in this project trains a model. Every AI
component is a hosted API we call or an open-weight model we run, adapted to our needs. Our
work is the orchestration, the clinical ontology, the provenance and the UX — that is where the
differentiation lives, and it is the only part nobody else has.

Three-tier pattern everywhere: **hosted API (primary) → second cloud option → open weights on
our own machine (offline)**. Same interface for all three, chosen by an env var. The demo must
survive a dead venue network, so the third tier is not optional.

> Verify every price, licence and endpoint against its primary source before it goes on a slide.
> This document points; the sources decide. Links are at the bottom.

---

## Decision table

| Component | Primary | Fallback | Offline | Licence / cost |
|---|---|---|---|---|
| Speech → text | **Sarvam Saaras v3** (streaming WS) | Bhashini ULCA | `ai4bharat/indic-conformer-600m-multilingual` | ₹30/hr · MIT (local) |
| Text → speech | **Sarvam Bulbul v2** | Bhashini TTS | `ai4bharat/IndicF5` | ₹15/10K chars |
| Voice activity | **`@ricky0123/vad-web`** (Silero v5, in-browser) | — | same | MIT |
| Slot filling LLM | **Sarvam-30B** (API) | any hosted | Sarvam-30B **open weights** | ₹2.5 / ₹10 per 1M tok · Apache-2.0 |
| Summary LLM | Sarvam-105B or 30B | any hosted | same weights | as above |
| Capture / crop | **jscanify** (OpenCV.js) | — | same | MIT, in-browser |
| OCR | **PaddleOCR-VL-1.6** self-hosted | hosted VLM when online | same | Apache-2.0, ~2 GB VRAM |
| Medical entities | **GLiNER-BioMed** + LLM structured output | — | same | open weights, CPU-fine |
| Drug dictionary | **Indian medicine datasets** (see below) | — | local CSV → Postgres | open data |
| Terminology | NAMASTE export + WHO ICD-API | — | cached snapshot in Postgres | free |
| FHIR | `fhir.resources` (py), typed models (ts) | — | local HAPI validation | open |

---

## Speech → text

**Primary: Sarvam Saaras v3, streaming WebSocket.**

Endpoints `/speech-to-text/ws` and `/speech-to-text-translate/ws`, authenticated with
`api_subscription_key`. Audio as base64 WAV or raw PCM (`pcm_s16le`), **16 kHz** — the sample
rate you declare must match the audio or transcription degrades badly. Partial transcripts
arrive via VAD events, then a final.

The reason it wins for us is one parameter. Saaras v3 exposes a `mode`:

| mode | does |
|---|---|
| `transcribe` | original language |
| `translate` | transcribe → English |
| `verbatim` | keeps fillers and repetitions |
| `translit` | romanised output |
| **`codemix`** | **code-mixed speech** |

Hinglish is the *normal* case in an Indian OPD, not an edge case. A model with a native
code-mix mode is a categorically better fit than a general multilingual model we bolt
normalisation onto. `verbatim` is also worth testing for the interview — fillers and
repetitions carry hesitancy that matters clinically.

**Cost: ₹30/hour of audio, billed per second.** With browser-side VAD we only ship speech, so a
five-minute intake is roughly two minutes of billable audio ≈ **₹1 per patient**. New accounts
get ₹100 of credits, which is ~3 hours of audio — enough for the entire build.

**Second: Bhashini ULCA.** Keep the adapter. It is the government stack, it is free, and using
it is worth real points with a ministry panel. Two calls: pipeline *config* returns the callback
URL, auth header name and service IDs; then *compute* with your task sequence.

**Offline: `ai4bharat/indic-conformer-600m-multilingual`.** MIT, 600M params, 22 scheduled
languages, hybrid CTC + RNNT, loads through `transformers` with `trust_remote_code=True`, audio
resampled to 16 kHz. This is what runs when the cable comes out.

**Not Whisper as primary.** It is the right general multilingual reference and fine as a
sanity check, but it is not built for Indian languages or code-switching, and the Indic-specific
models exist precisely because of that gap.

## Text → speech

**Sarvam Bulbul v2**, ₹15 per 10K characters. Offline: `ai4bharat/IndicF5` (11 languages,
close to human) or Indic Parler-TTS.

**Cache every generated clip, keyed by (text, language, voice).** The question set is finite —
a few hundred prompts across five modules and every language. After the first run almost all
playback is instant and free, which is also how we hit the latency budget.

## Voice activity detection

**`@ricky0123/vad-web`** — Silero v5 as ONNX, running in the browser. Two jobs, both important:
it decides when the patient has stopped speaking so we can finalise a turn fast, and it means we
never stream silence, which cuts both cost and latency. Runs on the patient's device, so it
costs us nothing and works offline.

## The language model

**Sarvam-30B for slot filling, Sarvam-105B (or 30B) for the summary** — and this is the elegant
part: Sarvam released 30B and 105B under **Apache-2.0** in March 2026, so *the same model* is
available as a cheap API and as weights we run on-premise.

That means the on-premise story is not a hedge — it is literally the same model, verified by
flipping `LLM_PROVIDER`. "Does patient data leave the hospital?" gets answered with a config
change and identical output, not a promise about a model we never tested.

Two call sites, two shapes:

1. **Slot filling** — one slot, tiny prompt, structured output against the Pydantic schema.
   Runs on every turn and owns the latency budget. ~30 calls per intake ≈ **₹0.05**.
2. **Summarisation** — once per session, larger context, still emits a structured object first.

Never "extract everything from this transcript". Never "decide what to ask next".

## Document capture

**`jscanify`** — MIT, OpenCV.js underneath, does live edge detection, corner extraction and
perspective correction in the browser. That is the hard 80% already built.

We add the quality gate on top, because rejecting a bad photo on the device beats any
server-side cleverness:

- **blur** — Laplacian variance below threshold → "hold still, tap to retake"
- **glare** — saturated-pixel ratio → "move away from the light"
- **coverage** — detected quad area → "fit the whole paper in the frame"
- **skew** — corrected silently, never rejected

Always in words and an icon. Never show the patient a numeric score.

## OCR

**PaddleOCR-VL-1.6.** 0.9B params, **Apache-2.0**, ~2 GB VRAM at FP16, ~45 pages/minute on a
mid GPU, and **100+ languages including Indian scripts** — the widest script coverage of the
current open document VLMs, which is exactly our constraint. It handles handwritten annotations
acceptably on clean scans.

Alternatives if VRAM is tight: GOT-OCR 2.0 (<3 GB, Apache-2.0) or classic PaddleOCR for printed
text only. dots.ocr (MIT, ~1.7B) is strong on forms. DeepSeek-OCR (MIT, ~3B MoE) is for volume,
which we do not have.

**Keep bounding boxes through every stage.** They are the provenance chips, and retrofitting
them later means re-running the pipeline.

**The rule stands regardless of model: a handwritten drug name is never auto-accepted.** It
surfaces as a shortlist from the drug dictionary for a human to confirm. Report printed and
handwritten precision separately in the eval table.

## Medical entity extraction

**GLiNER-BioMed** — a suite of small, efficient open models for zero-shot biomedical NER
(drugs, conditions, dosages, lab analytes). Small and base variants run on CPU at usable speed,
so this is not a GPU dependency.

Pipeline: GLiNER for the structured pass → LLM structured output for the messy remainder →
**fuzzy match against the drug dictionary** (`rapidfuzz`) to produce the confirm-one-of-three
shortlist.

## Drug dictionary — the India-specific catch

**RxNorm and openFDA are United States vocabularies.** An Indian prescription says *Dolo 650*,
*Shelcal*, *Pan-D* — brand names that do not exist in RxNorm at all. Building the shortlist on
a US vocabulary would fail on almost every real prescription we scan.

Use Indian brand data instead: the open **Indian Medicine Dataset** (curated CSV of Indian
medicines by brand) and the **A–Z Medicine Dataset of India** on Kaggle. Load into Postgres with
a trigram index, same as the terminology service.

For AYUSH formulations, cross-reference the Ayurvedic Pharmacopoeia of India naming — a
classical formulation will never appear in any allopathic drug list.

## Drug interactions — read this before planning around it

⚠️ **The NLM / RxNav Drug Interaction API has been discontinued.** Any tutorial or plan that
tells you to call it is out of date, and discovering this on Day 3 would cost you the feature.

What to do instead, in scope order:

1. **Duplicate therapy detection** — same molecule prescribed by two different doctors across
   the scanned documents. Pure string and dictionary work, no external service, and genuinely
   the most common real problem in an Indian OPD. **This alone is worth demoing.**
2. **openFDA drug label API** for warnings and contraindication text on the molecule.
3. A **small curated list of major interaction pairs** relevant to the complaints we cover,
   reviewed by a clinician, shipped as seed data.

Claim exactly what you built. "We flag duplicate therapy and known major pairs, for physician
attention" is defensible. "Full interaction checking" is not, and a pharmacology judge will ask.

## FHIR and ABDM — read the reference implementations first

Before writing the ABHA client or the bundle builders, spend an hour reading
**PSMRI/AMRIT** — an open-source Indian digital health platform (Piramal Swasthya) with a
public **FHIR-API** service and an ABDM-FHIR developer guide. It is the closest thing to a
government-adjacent reference implementation of exactly what we need. Bahmni's India distro and
the various open ABDM client libraries are useful for request shapes too.

We still build our own client against `packages/contracts` with mock mode — but we build it
knowing what a working one looks like, instead of guessing from documentation.

Libraries: `fhir.resources` (Pydantic FHIR models) in Python, typed FHIR models in TypeScript,
validation against the local HAPI server in CI.

## What we build ourselves

Short list, and it is deliberately short — this is the part that is ours:

- **The clinical ontology** (`packages/ontology`) — complaint modules, slots, red-flag rules
- **The interview state machine** — XState, resumable, device-agnostic
- **The provenance model** — source and confidence on every stored fact
- **The summary structure and the clinician console**
- **The triage queue re-prioritisation**
- **NAMASTE ↔ ICD-11 TM2 crosswalk service**
- **The body map SVG** — build our own with named regions rather than pulling a random medical
  SVG off the internet; licensing is murky and the anatomy would need verifying anyway
- **The de-identification proxy**
- **The eval harness**

## Cost, for the slide

Per patient, on cloud APIs, with browser VAD stripping silence:

| | |
|---|---|
| ASR (~2 min billable) | ~₹1.00 |
| TTS (cached after warm-up) | ~₹0.05 |
| LLM (slot filling + summary) | ~₹0.10 |
| **Total** | **~₹1.15 per patient** |

Roughly ₹5,700 a day at 5,000 patients — against several minutes of physician time recovered per
consultation. On-premise mode drops the marginal cost to electricity.

Bring this number. Nobody else will have costed their system, and "what does it cost to run"
is a question every serious evaluator asks.

## Sources

- [Sarvam pricing](https://docs.sarvam.ai/api-reference-docs/pricing) · [Sarvam streaming STT](https://docs.sarvam.ai/api/api-guides-tutorials/speech-to-text/streaming-api) · [Sarvam 30B/105B open weights](https://www.sarvam.ai/blogs/sarvam-30b-105b)
- [Bhashini ULCA APIs](https://bhashini.gitbook.io/bhashini-apis)
- [AI4Bharat IndicConformer 600M](https://huggingface.co/ai4bharat/indic-conformer-600m-multilingual) · [IndicF5](https://huggingface.co/ai4bharat/IndicF5)
- [@ricky0123/vad](https://docs.vad.ricky0123.com/user-guide/browser/) · [Silero VAD](https://github.com/snakers4/silero-vad)
- [jscanify](https://github.com/ColonelParrot/jscanify)
- [Open-source OCR VLM comparison 2026](https://www.spheron.network/blog/best-open-source-ocr-vlm-self-host-gpu-cloud-2026/)
- [GLiNER-BioMed](https://huggingface.co/Ihor/gliner-biomed-base-v1.0)
- [Indian Medicine Dataset](https://github.com/junioralive/Indian-Medicine-Dataset) · [A–Z Medicine Dataset of India](https://www.kaggle.com/datasets/shudhanshusingh/az-medicine-dataset-of-india)
- [NIH discontinues the Drug Interaction API](https://blog.drugbank.com/nih-discontinues-their-drug-interaction-api/)
- [PSMRI/AMRIT](https://github.com/PSMRI/AMRIT) · [AMRIT ABDM-FHIR developer intro](https://github.com/PSMRI/AMRIT-Docs/blob/main/architecture/integrations/abdm-fhir-developer-intro/README.md) · [PSMRI/FHIR-API](https://github.com/PSMRI/FHIR-API)
- [NRCES FHIR IG for ABDM](https://www.nrces.in/ndhm/fhir/r4/profiles.html)
