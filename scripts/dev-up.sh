#!/usr/bin/env bash
# `make dev` — starts infra (docker compose) + all four services, waits for every health
# check to go green, then prints every URL a human needs. Services are started with `nohup`
# and their PIDs recorded in .dev-pids/ so `make dev-down` can stop exactly these processes
# without touching anything else running on the machine.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."
ROOT="$(pwd)"
LOG_DIR="$ROOT/.dev-logs"
PID_DIR="$ROOT/.dev-pids"
mkdir -p "$LOG_DIR" "$PID_DIR"

echo "→ infra: postgres, redis, minio, hapi-fhir"
docker compose up -d

wait_for() {
  local name="$1" url="$2" tries="${3:-60}"
  for _ in $(seq 1 "$tries"); do
    if curl -fsS -m 2 "$url" >/dev/null 2>&1; then
      echo "  ✓ $name"
      return 0
    fi
    sleep 1
  done
  echo "  ✗ $name did not become healthy at $url within ${tries}s — see $LOG_DIR/${name}.log" >&2
  return 1
}

start() {
  local name="$1"; shift
  if [ -f "$PID_DIR/$name.pid" ] && kill -0 "$(cat "$PID_DIR/$name.pid")" 2>/dev/null; then
    echo "  → $name already running (pid $(cat "$PID_DIR/$name.pid"))"
    return 0
  fi
  # `exec` inside bash -lc so the recorded PID is the real server process, not a wrapper shell
  # `make dev-down` can't reach through — best-effort even so: nodemon/celery may still leave a
  # grandchild behind, in which case `lsof -ti:4000,8001,8002,8003 | xargs kill` is the fallback.
  "$@" >"$LOG_DIR/$name.log" 2>&1 &
  echo $! >"$PID_DIR/$name.pid"
  disown
}

# A moved/renamed repo (e.g. off an iCloud-synced Desktop) leaves every existing Python venv's
# console scripts with a shebang line pip baked in at install time, pointing at the *old*
# absolute path. `python3 -m venv` on an already-existing venv dir does not rewrite that — so the
# venv silently keeps launching the old, now-nonexistent interpreter path. The process this
# starts still answers /health (bash resolved `uvicorn` fine, or an already-running process from
# before the move is still alive) while every request touching a lazily-imported path (an SSL
# cert bundle, a model file) 500s or hangs — the worst kind of failure, because it looks green.
# Catch it here, before starting anything, instead of downstream as a mystery 500.
check_venv() {
  local svc="$1" shebang_path
  local script="$ROOT/services/$svc/.venv/bin/python3"
  [ -e "$script" ] || return 0  # no venv yet — py-setup's problem, not this check's
  shebang_path="$(readlink "$script" 2>/dev/null || true)"
  case "$shebang_path" in
    "$ROOT"/*|/opt/*|/usr/*) return 0 ;;  # resolves under this repo, or a system/homebrew python
  esac
  # Fall back to the actual shebang line of an installed console script, which is where pip
  # bakes an absolute interpreter path (the bin/python3 symlink itself is usually fine).
  shebang_path="$(head -1 "$ROOT/services/$svc/.venv/bin/pip" 2>/dev/null | sed 's/^#!//')"
  if [ -n "$shebang_path" ] && [[ "$shebang_path" != "$ROOT"/* ]]; then
    echo "✗ services/$svc/.venv is stale: its scripts point at '$shebang_path', not this repo ($ROOT)." >&2
    echo "  Run: rm -rf services/$svc/.venv && make py-setup" >&2
    exit 1
  fi
}

for svc in ai docai terminology; do check_venv "$svc"; done

echo "→ waiting for infra..."
until docker exec careflow-postgres pg_isready -U careflow >/dev/null 2>&1; do sleep 1; done
echo "  ✓ postgres"
until docker exec careflow-redis redis-cli ping >/dev/null 2>&1; do sleep 1; done
echo "  ✓ redis"
wait_for minio "http://localhost:9001/minio/health/live" 60
wait_for hapi-fhir "http://localhost:8090/fhir/metadata" 90

echo "→ starting services"
start gateway bash -lc 'cd services/gateway && exec pnpm dev'
start ai bash -lc 'exec services/ai/.venv/bin/uvicorn app.main:app --app-dir services/ai --port 8001'
start docai bash -lc 'exec services/docai/.venv/bin/uvicorn app.main:app --app-dir services/docai --port 8002'
start docai-worker bash -lc 'cd services/docai && exec .venv/bin/celery -A app.celery_app worker --loglevel=info --concurrency=2'
# Celery beat: the 24-hour / after-signing deletion of patient voice notes (app/audio_retention.py)
start docai-beat bash -lc 'cd services/docai && exec .venv/bin/celery -A app.celery_app beat --loglevel=info --schedule=/tmp/careflow-celerybeat-schedule'
start terminology bash -lc 'exec services/terminology/.venv/bin/uvicorn app.main:app --app-dir services/terminology --port 8003'
# The patient app: userwebapp/ served with /api proxied to the gateway — one origin, so a tunnel can give it HTTPS.
start patient bash -lc 'exec node scripts/serve-userwebapp.mjs'

echo "→ waiting for services..."
wait_for gateway "http://localhost:4000/health"
wait_for ai "http://localhost:8001/health"
wait_for docai "http://localhost:8002/health"
wait_for terminology "http://localhost:8003/health"
wait_for patient "http://localhost:3030/health"

cat <<'URLS'

================================================================
CareFlow dev stack is up.

  Patient app        http://localhost:3030        (userwebapp; token slips open here)
  Gateway API        http://localhost:4000        (health: /health)
  Gateway WebSocket   ws://localhost:4000          (?session_id=...&department=...)
  ai service docs     http://localhost:8001/docs
  docai service docs  http://localhost:8002/docs
  terminology docs    http://localhost:8003/docs
  MinIO console        http://localhost:9001       (careflow / careflow123)
  HAPI FHIR UI         http://localhost:8090
  Postgres             localhost:5433              (careflow / careflow)
  Redis                localhost:6379

  Logs:  .dev-logs/<service>.log
  Stop:  make dev-down   (infra stays up — use `make down` for that)
================================================================
URLS
