# API keys and credentials

Everything CareFlow talks to, in the order it is worth obtaining. **Nothing here blocks Day 1** —
every external dependency has a local fallback and the defaults in `.env.example` run offline.

Copy `.env.example` to `.env` and fill in as things arrive. `.env` is gitignored. If a
credential is ever committed, rotate it — do not just delete the line.

---

## Priority 1 — Bhashini (ULCA)

Government speech stack: ASR, translation and TTS for 22 Indian languages. Using it is itself
a scoring point with a government panel.

**Get it:** register at bhashini.gov.in / the ULCA portal as a developer, create an app, and
take the user ID and API keys from the dashboard.

```
BHASHINI_USER_ID=
BHASHINI_ULCA_API_KEY=
BHASHINI_INFERENCE_API_KEY=
BHASHINI_PIPELINE_ID=
```

**How it works:** two calls. First a *pipeline config* request to the ULCA config endpoint,
which returns the callback URL, the auth header name and the service IDs for the tasks you
asked for. Then a *compute* call to that URL with your task sequence — `asr`, `translation`,
`tts`, or a combination, in order. Language codes are ISO-639 (`hi`, `ta`, `bn`).

**Fallback if it does not arrive:** `LOCAL_ASR_ENABLED=true` runs
`ai4bharat/indic-conformer-600m-multilingual` (MIT, 600M params, 22 languages, hybrid CTC +
RNNT) locally. The demo works either way — Bhashini is for the pitch, the local model is the
safety net. Build against both from Day 2.

---

## Priority 2 — LLM provider

One key, one adapter. Pick whichever you already have.

```
LLM_PROVIDER=openai        # openai | anthropic | google | sarvam | local
LLM_API_KEY=
LLM_MODEL=
LLM_BASE_URL=              # only for local / self-hosted
```

Two call sites, two different needs: **slot extraction** (every turn, tiny prompt, needs to be
fast and cheap) and **summarisation** (once per session, larger context). You may point them at
different models — the adapter supports it.

**The on-premise story:** Sarvam released 30B and 105B open-weight models under Apache 2.0 in
March 2026. Running one locally with `LLM_PROVIDER=local` is what lets you answer "does patient
data leave the hospital?" with a config flag instead of a hedge. Worth having working by Day 4
even if the demo uses a hosted model for quality. *Verify the current licence before claiming it
on a slide.*

---

## Priority 3 — WHO ICD-11 API

Free. Needed for ICD-11 TM2 and MMS codes in the terminology service.

**Get it:** register at `icd.who.int/icdapi`, create API credentials. OAuth2
`client_credentials` against `https://icdaccessmanagement.who.int/connect/token`, then query
`https://id.who.int`. There is also an official FHIR-facing surface worth looking at before
writing a custom client.

```
ICD_CLIENT_ID=
ICD_CLIENT_SECRET=
```

**Fallback:** cache the TM2 and MMS subset you need into Postgres on Day 3. The demo then works
offline and you are not dependent on WHO uptime in the venue.

---

## Priority 4 — NAMASTE terminology

The National AYUSH Morbidity and Standardized Terminologies Electronic portal
(`namaste.ayush.gov.in`). Source of the Ayurveda / Siddha / Unani codes.

Not an API key — a **data acquisition** task. Get the terminology export (download or portal
registration), load it into the terminology service as a FHIR `CodeSystem`, and build the
crosswalk to ICD-11 TM2 as a `ConceptMap`.

⚠️ **Every NAMASTE and ICD-11 code in this repo is currently a `PLACEHOLDER`.** Replace them on
Day 3 with real codes and record the source URL beside each. An Ayurveda faculty judge will
recognise a wrong code.

---

## Priority 5 — ABDM sandbox

```
ABDM_MODE=mock             # mock | sandbox | production
ABDM_CLIENT_ID=
ABDM_CLIENT_SECRET=
ABDM_HIP_ID=
```

**Get it:** register on the ABDM sandbox portal as a Health Information Provider, obtain client
credentials, and go through the M1/M2/M3 milestone flow. This takes days to weeks and **may not
arrive before the hackathon.** Plan for that.

**Fallback — and this is the plan, not the contingency:** `ABDM_MODE=mock` runs a local gateway
that mirrors the real ABHA v3 request and response shapes exactly, behind the same client
interface, with a local HAPI FHIR server for bundle validation. When real credentials arrive,
change one env var.

On the slide: *"ABDM-ready · gateway mocked pending sandbox credentials"*, and show the bundle
validating. Do not claim a live integration you do not have.

---

## Not needed

| | Why |
|---|---|
| Aadhaar / UIDAI | We never handle Aadhaar directly. ABHA is the identity layer, and Aadhaar-based enrolment happens inside ABDM's own flow. |
| SMS / OTP provider | ABDM sends the OTP. |
| Payment gateway | There is nothing to charge for. |
| Maps / geocoding | Not part of the product. |
| Cloud hosting | Everything runs locally for the demo, and hospitals deploy on-premise. |

---

## Handling

- Never commit `.env`. Never paste a key into a chat, an issue, a screenshot, or a slide.
- Share credentials through a password manager or an encrypted note, not the group chat.
- Use separate keys per person where the provider allows it, so one can be revoked alone.
- Add a pre-commit secret scan before Day 2 — someone will paste a key into a test file.
- Set spend limits on any paid API before the sprint, not after.

## Status

| Credential | Owner | Status |
|---|---|---|
| Bhashini | | ☐ not obtained |
| LLM provider | | ☐ not obtained |
| WHO ICD-11 | | ☐ not obtained |
| NAMASTE export | | ☐ not obtained |
| ABDM sandbox | | ☐ not obtained — mock in use |

Keep this table current. It is also the honest answer when a judge asks what is live.
