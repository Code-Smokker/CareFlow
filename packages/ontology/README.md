# @careflow/ontology

The clinical interview, as data. **This is the core IP of the project** and the reason the
system is auditable: the LLM never decides what to ask — this package does.

```
schema/module.schema.json   the contract every module must satisfy (validated in CI)
modules/*.yaml              one file per complaint
modules/ayush/*.yaml        Dashavidha Pariksha and related AYUSH assessment
scripts/validate.py         local validation; the same check runs in CI
```

## Anatomy of a module

| Key | Meaning |
|---|---|
| `id` | Stable identifier. Must match the filename. |
| `label` | Human-readable name, for the console and for logs. |
| `framework` | `SOCRATES`, `OLDCARTS`, `custom` — documents the clinical basis of the slot set. |
| `triggers` | Phrases, in every supported language, that route a chief complaint here. |
| `slots` | The typed questions. Order is the default ask order. |
| `red_flags` | Deterministic predicates over filled slots. Evaluated with **no model call**. |
| `followups` | Conditionally load another module. |

### Slots

Each slot declares `id`, `required`, `type`, the `input` modes it supports, and the prompt in
each language. **Every slot must support at least two input modes, and one of them must not be
voice** — a patient whose accent the ASR misses must still be able to answer.

| Input mode | For |
|---|---|
| `voice` | anything |
| `chips` | single choice, with icons |
| `multi` | multi-select |
| `bodymap` | location and radiation |
| `facescale` | 0–10 severity via faces |
| `duration` | today / 2 days / a week / a month / longer |

### Red flags

`when` is a restricted expression over filled slot values — no function calls, no imports,
evaluated by the rule engine, never by a model. `action` is `escalate` (re-prioritise the token
and alert triage) or `flag` (mark for physician attention). `speak` is what the patient hears,
per language, and must be calm and non-alarming.

**Tune for recall.** A false alarm costs a nurse thirty seconds; a miss costs everything else.

## Adding a module

1. Copy `modules/chest_pain.yaml` and rewrite it.
2. `pnpm --filter @careflow/ontology validate`.
3. Add at least one script to `eval/scripts/` — mandatory for any module with a red flag.
4. Have someone with clinical training read the questions out loud before it merges.

## Build these five first

`chest_pain` · `fever` · `cough_breathlessness` · `abdominal_pain` · `joint_pain`, plus
`generic` as the fallback. Five built well beats twenty built badly.
