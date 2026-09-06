#!/usr/bin/env bash
# `make dev-down` — stops exactly the processes `make dev` started (by PID file), leaves the
# docker infra running (use `make down` for that).
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."
PID_DIR=".dev-pids"

if [ ! -d "$PID_DIR" ]; then
  echo "nothing to stop (no $PID_DIR — dev stack was never started with make dev)"
  exit 0
fi

for pidfile in "$PID_DIR"/*.pid; do
  [ -f "$pidfile" ] || continue
  name="$(basename "$pidfile" .pid)"
  pid="$(cat "$pidfile")"
  if kill -0 "$pid" 2>/dev/null; then
    kill "$pid" 2>/dev/null || true
    echo "  ✓ stopped $name (pid $pid)"
  else
    echo "  - $name (pid $pid) already stopped"
  fi
  rm -f "$pidfile"
done
