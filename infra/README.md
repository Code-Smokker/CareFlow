# infra

Local stack lives in `docker-compose.yml` at the repo root. This folder holds what those
containers mount.

| Path | Purpose |
|---|---|
| `postgres/init.sql` | Extensions created on first boot: pgcrypto, pg_trgm, vector |

## Notes

- Postgres is exposed on host port **5433**, not the default 5432 — some dev machines already
  run a native Postgres on 5432 that silently shadows a container mapped to the same port on
  `localhost`. `.env.example`'s `DATABASE_URL` already points at 5433; if you hand-roll a
  connection string, don't forget it.
- Postgres runs on `pgvector/pgvector:pg16`, not the stock `postgres:16-alpine` — that image
  does not ship pgvector and `CREATE EXTENSION vector` fails on it. Trigram search alone is
  enough to demo terminology lookup if this ever needs to fall back, so it is not day-1 blocking,
  but the pgvector image is the default now.
- MinIO console: http://localhost:9001 (careflow / careflow123). Create the
  `careflow-documents` bucket on first run.
- HAPI FHIR UI: http://localhost:8090 — use it to validate every bundle before claiming
  ABDM compliance.
- Kubernetes manifests are deliberately not written yet. They are a Day-5 nice-to-have so
  "how would you deploy this" has a file, not a slide.
