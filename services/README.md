# services

| Service | Stack | Port | Owner |
|---|---|---|---|
| `gateway` | NestJS + Prisma | 4000 | BE |
| `ai` | FastAPI | 8001 | AI-1 |
| `docai` | FastAPI + Celery | 8002 | AI-2 |
| `terminology` | FastAPI | 8003 | AI-2 |

`gateway` is scaffolded: session lifecycle (create/get/resume/language/consent/answer/complete/
delete), Socket.IO rooms, the ontology-driven interview loop. `ai` is scaffolded: three-tier
speech adapters (sarvam -> bhashini -> local), `/fill-slot`, and `/evaluate-flags` — the
gateway's `/answer` now calls `ai.evaluate-flags` for red flags, falling back to its own local
ontology walk when `ai` is unreachable, so the interview keeps working either way. `docai` and
`terminology` are still Day 0/1 work. Contracts first: `packages/contracts` is the source of
truth for every interface between these and the clients. See `docs/03-api-contracts.md`.

Each Python service gets its own venv (`make py-setup`) and a `requirements.txt`. Each exposes
`/health`. Every log line carries `session_id`.
