# ADR 0004 — Monorepo, four services, TypeScript plus Python

**Status:** accepted · **Date:** 2026-09-06

## Context

The team ships React/Next, Node and Python. The workload genuinely splits: chatty I/O and
session orchestration on one side, speech and vision models on the other. Options considered
were a single Python service, a single Node service, and a service mesh.

## Decision

pnpm + Turborepo monorepo. Four apps (intake, clinician, triage, admin), four services
(gateway in NestJS; ai, docai, terminology in FastAPI), shared packages for `ui`, `fhir`,
`ontology` and `contracts`.

One boundary between the two languages, defined by OpenAPI in `packages/contracts`, with
clients generated for both sides.

Four services is the ceiling. Stateful infra runs in Docker Compose; application services run
on the host during development so hot reload works.

## Consequences

- Everyone works in a language they are already fast in.
- `packages/contracts` becomes the coordination point, which is where a six-person team needs
  one — and a hard dependency: if it is wrong on Day 0, everyone is blocked on Day 2.
- Pydantic models serve triple duty: validation, OpenAPI docs, and LLM structured output.
- One `docker compose up` and one `pnpm dev` gets a new machine running.
- A mesh, gRPC or Kafka would cost more in integration than it buys in separation at this size.
