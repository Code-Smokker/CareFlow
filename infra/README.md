# infra

Local stack lives in `docker-compose.yml` at the repo root. This folder holds what those
containers mount.

| Path | Purpose |
|---|---|
| `postgres/init.sql` | Extensions created on first boot: pgcrypto, pg_trgm, vector |

## Notes

- The stock `postgres:16-alpine` image does **not** ship pgvector. If `CREATE EXTENSION vector`
  fails, switch the image to `pgvector/pgvector:pg16` in `docker-compose.yml`. Trigram search
  alone is enough to demo terminology lookup, so this is not day-1 blocking.
- MinIO console: http://localhost:9001 (careflow / careflow123). Create the
  `careflow-documents` bucket on first run.
- HAPI FHIR UI: http://localhost:8090 — use it to validate every bundle before claiming
  ABDM compliance.
- Kubernetes manifests are deliberately not written yet. They are a Day-5 nice-to-have so
  "how would you deploy this" has a file, not a slide.
