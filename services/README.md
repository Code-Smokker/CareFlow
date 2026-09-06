# services

| Service | Stack | Port | Owner |
|---|---|---|---|
| `gateway` | NestJS + Prisma | 4000 | BE |
| `ai` | FastAPI | 8001 | AI-1 |
| `docai` | FastAPI + Celery | 8002 | AI-2 |
| `terminology` | FastAPI | 8003 | AI-2 |

`gateway` is scaffolded: session lifecycle (create/get/resume/language/consent/answer/complete/
delete), Socket.IO rooms, the ontology-driven interview loop with zero AI dependency. The three
Python services are still Day 0/1 work. Contracts first: `packages/contracts` is the source of
truth for every interface between these and the clients. See `docs/03-api-contracts.md`.

Each Python service gets its own venv (`make py-setup`) and a `requirements.txt`. Each exposes
`/health`. Every log line carries `session_id`.
