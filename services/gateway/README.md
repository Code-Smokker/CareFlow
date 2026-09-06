# @careflow/gateway

API gateway — sessions, consent, queue, WebSocket, audit log. NestJS 11 + Prisma 6 against
PostgreSQL 16. See `docs/01-architecture.md`, `docs/04-data-model.md`.

Day 1 scope was the session lifecycle end to end with **zero AI dependency** — `POST /answer`
walks `packages/ontology` directly and returns the next question straight from the loaded
YAML modules. That path still exists and still works with `services/ai` stopped or unreachable:
red-flag evaluation now prefers calling `ai.evaluate-flags` (see `src/ai/ai-service.client.ts`),
falling back to the local ontology walk on any failure — the interview never stalls because the
AI service is down.

## Run it

```
cp ../../.env.example ../../.env   # first time only, then fill in FIELD_ENCRYPTION_KEY etc.
docker compose up -d postgres      # from the repo root — Postgres on host port 5433, not 5432
pnpm --filter @careflow/contracts build   # dist/events.js — gateway imports the compiled output,
                                          # not the raw .ts (see @careflow/contracts' README)
pnpm db:deploy                     # applies prisma/migrations/
pnpm dev                           # nodemon + ts-node, http://localhost:4000
```

`services/ai` (`cd ../ai && pnpm dev` — see its own README) is optional for `/answer` to work,
but start it if you want to see the ai-service path exercised instead of the fallback.

`pnpm build && pnpm start` runs the compiled output (`node dist/main.js`) the same way it would
run in production.

**Why `ts-node`, not `tsx`:** `tsx` transpiles via esbuild, which does not emit TypeScript's
`emitDecoratorMetadata` output — NestJS's constructor injection depends on that metadata to
know what to inject. Under `tsx` every controller/service silently got empty-arg constructors
(no DI error, just `undefined` fields at runtime). `ts-node`'s default mode runs the real
compiler, so this actually works.

## What's real vs. deferred here

- Session create/get/resume/language/consent/answer/complete/delete: real Postgres
  persistence, real Socket.IO rooms (`session:{id}`), real idempotency handling on `/answer`.
- Chief-complaint selection is a plain chip-select slot over the loaded ontology modules —
  there's no AI classifier yet, so this stands in for docs/05-interview-engine.md's phase 3
  without skipping it.
- Red-flag evaluation calls `services/ai`'s `/evaluate-flags` (see `src/ai/`), falling back to
  the local `OntologyService.evaluateRedFlags` on any failure — both are the same deterministic
  rules (CLAUDE.md rule 3), just two implementations, one per service.
- `fill-slot` (voice utterance -> typed slot value) isn't wired here yet — `AnswerSubmission`
  still carries an already-typed `value`, not a raw utterance. That wiring is Day 2's actual
  voice-in-the-browser work, not something this endpoint's current shape can use yet.
- `/complete` creates a `draft` `Summary` row from the raw filled slots verbatim — no
  structuring, no bilingual render. That's `ai.summarise`'s job once it exists.
- No queue/token/department wiring yet (Day 2) — red flags fire, persist, and push
  `redflag.fired` to the session room, but not to a `department:{code}` room, and
  `RedFlag.token_no` falls back to `session_id`.
- Three schema deviations from `docs/04-data-model.md`, and why, are in
  `docs/adr/0007-session-scaffold-schema-deviations.md` — read it before touching identity or
  the facescale input mode.

## Database

```
pnpm db:migrate   # prisma migrate dev — interactive, creates+applies a new migration
pnpm db:deploy    # prisma migrate deploy — applies existing migrations, no prompts, no shadow DB
pnpm db:generate  # regenerate the Prisma client after pulling schema changes
pnpm db:studio    # prisma studio
```

Prisma's CLI needs `DATABASE_URL` in its own process env (it does not read `@nestjs/config`'s
resolution of the root `.env`) — either `set -a && source ../../.env && set +a` first, or
export it inline.

`audit_log` is append-only, enforced by a Postgres trigger (not just a convention) in
`prisma/migrations/20260906055251_init/migration.sql` — `UPDATE`/`DELETE` on that table raises.
That same migration hand-adds a partial index and two `gin_trgm_ops`/GIN indexes Prisma's
schema DSL can't express; if you regenerate a migration with `prisma migrate diff` and it wants
to `DROP INDEX` those, don't apply that part.

Pinned to Prisma **6**, not 7: Prisma 7 requires a `prisma.config.ts` + driver adapter instead
of the plain `url = env("DATABASE_URL")` in `schema.prisma` — more setup than this sprint needs.
