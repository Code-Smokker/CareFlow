# 05 — Interview engine (Samvad)

## The design rule

**The LLM never decides what to ask.** The interview is a deterministic state machine over a
clinical ontology. The model has exactly two jobs: *phrase* the next question in the patient's
language, and *parse* an answer into a typed slot. Question order, completeness and escalation
are code.

This is the single most important engineering decision in the project. It makes the interview
auditable, testable, reproducible and safe, and it is the answer to every clinical judge's
first question.

## Flow

```
utterance
   │
   ├─▶ ASR (16 kHz · silero-VAD · streamed over WS)
   │
   ├─▶ normalise  (code-switched Hinglish is the norm — handle it, don't fight it)
   │
   ├─▶ slot extract  (structured output against the Pydantic schema for THIS SLOT ONLY
   │                  — small prompt, low latency, high accuracy)
   │
   ├─▶ validate  (type, range, contradiction against already-filled slots)
   │
   ├─▶ advance  (XState transition; persist snapshot + answer with provenance)
   │
   ├─▶ evaluate red flags  (deterministic predicates over filled slots — NO model)
   │
   └─▶ speak next question  (TTS from cache)
```

Target: **under 1.2 s p95** from end-of-speech to next prompt. Below that it feels like a
conversation; above it patients start repeating themselves.

## Complaint modules

A module is a declarative YAML file in `packages/ontology/modules/`. Build **five properly**
plus a generic fallback and you cover the majority of a general OPD:

`chest_pain` · `fever` · `cough_breathlessness` · `abdominal_pain` · `joint_pain` · `generic`

Each module declares:

| Key | Meaning |
|---|---|
| `id` | Stable identifier, matches the filename |
| `triggers` | Phrases in every supported language that route to this module |
| `framework` | `SOCRATES`, `OLDCARTS`, or `custom` — documents the clinical basis |
| `slots` | The typed questions. `required`, `input` modes, `chips`/`multi` options |
| `red_flags` | Deterministic predicates over filled slots, with `action` and `speak` |
| `followups` | Conditional loading of another module |

Validated in CI against `packages/ontology/schema/module.schema.json`. A malformed module
fails the build.

## Slot input modes

Every slot declares which input modes it supports. **Every slot supports at least two**, and
none requires typing:

| Mode | Used for |
|---|---|
| `voice` | Anything. Always available. |
| `chips` | Single choice from a short list, with icons |
| `multi` | Multi-select associated symptoms |
| `bodymap` | Location and radiation — tap the SVG body |
| `facescale` | Severity, 0–10 via faces |
| `duration` | "today / 2 days / a week / a month / longer" chips — never a date picker |

## Three behaviours that matter more than they look

**Never blocks.** Three failed ASR attempts on one slot silently switches that slot to
tap-only. The patient never sees an error, and the interview never stalls.

**Always resumable.** The XState snapshot persists on every turn. Battery dies, patient walks
away, kiosk reboots — scan the QR again, continue from the exact slot.

**Always honest.** A low-confidence slot is stored *with* its confidence and rendered demoted
in the summary. The system says "unclear", it never guesses. Confidence below the threshold
also triggers one clarifying re-ask before giving up.

## Red flags

Deterministic predicates, evaluated after every slot fill, defined in the module beside the
slots they read. Not model judgement. Not a separate service. Firing a rule:

1. writes a `red_flag` row with the triggering quote,
2. re-prioritises the token in the queue service,
3. pushes `redflag.fired` to the department room — nurse board and wall display,
4. stamps the session so the clinician console opens with a red banner,
5. speaks a calm instruction to the patient in their language.

**Tune for recall, not precision.** A false alarm costs a nurse thirty seconds. A miss costs
everything else. Target 100% sensitivity on the eval set and accept the false positives.

Every new rule ships with a test case in `eval/`.

## Interview phases

```
1  identify        ABHA QR / OTP / new registration
2  consent         audio-explained, granular, revocable
3  chief complaint open question → classifier → module selection
4  HPI             the module's slot graph
5  past history    medical, surgical — chips, prior-visit prefill
6  drugs & allergy prefilled from scanned documents where available
7  family history  chips
8  personal        diet, sleep, tobacco, alcohol, occupation, (obstetric where relevant)
9  ROS             targeted by complaint, not the full list
10 AYUSH path      Dashavidha Pariksha where the department is AYUSH — see doc 07
11 documents       scan flow (runs async; can be done during any phase)
12 read-back       TTS speaks the summary; patient taps any line to correct it
```

## Follow-up mode

A returning patient is not re-interviewed. Load the prior structured history, confirm it aloud
in about twenty seconds — *"last time: three months of joint pain, on Tab. Shallaki. Still the
case?"* — and spend the remaining time only on what changed. The clinician console opens on the
diff, not the full history.

The PS names repeated questioning across visits as a failure mode. This is the fix, and almost
nobody else will build it.

## Attendant / proxy mode

Indian OPD patients arrive accompanied. A toggle records who is answering and their
relationship, switches the interview to third person, and marks every proxy-sourced field via
`answer.source = proxy` so the physician knows which statements are second-hand.

## Prompt discipline

- One slot per LLM call. Never "extract everything from this transcript".
- The Pydantic schema for that slot is the structured-output contract. No free-text parsing.
- The prompt never contains the patient's name or ABHA number — the de-identification proxy
  strips them first.
- Few-shot examples live in the module YAML, per language, not in Python string literals.
- Log every prompt and completion with `session_id` at debug level. It is how the eval harness
  explains a failure.
