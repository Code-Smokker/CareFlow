# Contributing

Five days, six people. These rules exist so we can move fast without breaking each other.

## Before your first change

1. Read `docs/00-overview.md` and `CLAUDE.md`.
2. Read the doc for the area you are touching.
3. `make setup && make up && make dev` — get it running before you change it.

## Workflow

- Branch from `main`: `feat/intake-body-map`, `fix/asr-vad-cutoff`, `docs/adr-mock-abdm`.
- **A branch lives half a day, maximum.** Feature-flag anything unfinished and merge.
- Conventional commits, scoped to a directory: `feat(intake):`, `fix(ai):`, `docs(adr):`,
  `chore(infra):`.
- Open a PR, fill the template, get one review, merge. Do not wait for two on a five-day clock.
- **18:00 daily: everything merged, demo path run end to end.**

## Definition of done

- [ ] `pnpm lint && pnpm typecheck && pnpm test` pass locally
- [ ] The demo path in `docs/13-demo-script.md` still works
- [ ] No secrets, real ABHA numbers, or real patient data in the diff
- [ ] Interface changes are in `packages/contracts` first, then implemented
- [ ] New clinical rules have a case in `eval/`
- [ ] New FHIR builders produce a bundle that validates against local HAPI
- [ ] Docs updated in the same PR if behaviour changed

## Things that will get a PR sent back

- An LLM call that decides what question to ask next (CLAUDE.md rule 1)
- A red-flag rule implemented in Python instead of the module YAML
- A field stored without `source` and `confidence`
- A question with no tap alternative
- A hardcoded clinical vocabulary list instead of a terminology lookup
- An inline FHIR object literal instead of a builder from `packages/fhir`
- A request shape invented at a call site instead of added to the contract
- `any` in TypeScript, a bare `except:` in Python
- Copy that claims something the system does not do

## Reviewing

Review for correctness and for the rules above, not for style — Prettier and Ruff own style.
Say what is blocking and what is a suggestion. On a five-day clock, "approve with comments" is
usually the right call.

## When you are stuck

Ask in the group before spending an hour. Twenty minutes of someone else's time is cheaper than
an hour of yours on day three. If a decision constrains other people, write an ADR after you
resolve it.
