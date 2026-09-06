# ADR 0003 — The LLM never decides what to ask

**Status:** accepted · **Date:** 2026-09-06

## Context

The obvious implementation is a conversational agent with a clinical system prompt. It demos
well for ninety seconds and fails every question that follows: it is non-deterministic, hard to
test, impossible to audit, and it can omit a required history item without anyone noticing.
Clinical evaluators ask about exactly this.

## Decision

The interview is a deterministic state machine over a clinical ontology. Complaint modules are
declarative YAML in `packages/ontology` — slots, input modes, follow-ups, and red-flag
predicates. The runtime walks the graph.

The model has two jobs only:

1. phrase the next question in the patient's language,
2. parse an answer into a typed slot (structured output, one slot per call).

Question order, completeness and escalation are code. Red-flag predicates are evaluated in the
rule engine with no model call at all.

## Consequences

- Auditable, reproducible, and testable — the eval harness can score slot recall meaningfully.
- Adding a complaint is a YAML file plus a test, not prompt engineering.
- Latency is controlled: small prompts, one slot at a time, cached TTS.
- Costs expressiveness. The interview cannot follow an arbitrary tangent — which for clinical
  history taking is the correct trade.
- `POST /evaluate-flags` gaining a model call is a bug, not an optimisation.
