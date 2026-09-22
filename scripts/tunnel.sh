#!/usr/bin/env bash
# `make tunnel` — gives the patient app a public HTTPS URL so a REAL PHONE can use its microphone.
# Browsers only allow getUserMedia on HTTPS or on localhost on the same device; http://<LAN-ip> silently
# has no microphone API. The phone then needs exactly ONE origin (the patient app server proxies /api/v1/*
# to the gateway — see scripts/serve-userwebapp.mjs).
#
# Prints the URL and records it where the gateway looks (.dev-pids/intake-public-url), so token-slip QR codes
# issued from the doctor app encode it. Stops (and forgets the URL) on Ctrl-C.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."
mkdir -p .dev-pids .dev-logs
URL_FILE=".dev-pids/intake-public-url"
LOG=".dev-logs/tunnel.log"
TARGET="${INTAKE_LOCAL_URL:-http://localhost:3030}"

command -v cloudflared >/dev/null || { echo "cloudflared is not installed. Run: brew install cloudflared" >&2; exit 1; }
curl -fsS -m 3 -o /dev/null "$TARGET" || { echo "The patient app is not answering at $TARGET — start it first (make dev, or: node scripts/serve-userwebapp.mjs)." >&2; exit 1; }
curl -fsS -m 3 -o /dev/null "http://localhost:4000/health" || { echo "The gateway is not answering at :4000 — start it first (make dev)." >&2; exit 1; }

rm -f "$URL_FILE"
: > "$LOG"
cloudflared tunnel --no-autoupdate --url "$TARGET" >"$LOG" 2>&1 &
TUNNEL_PID=$!
cleanup() { kill "$TUNNEL_PID" 2>/dev/null || true; rm -f "$URL_FILE"; echo; echo "tunnel closed — QR codes go back to ${INTAKE_PUBLIC_URL:-the local URL}."; }
trap cleanup EXIT INT TERM

URL=""
for _ in $(seq 1 40); do
  URL="$(grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com' "$LOG" | head -1 || true)"
  [ -n "$URL" ] && break
  kill -0 "$TUNNEL_PID" 2>/dev/null || { echo "cloudflared exited — see $LOG" >&2; exit 1; }
  sleep 1
done
[ -n "$URL" ] || { echo "no tunnel URL after 40 s — see $LOG" >&2; exit 1; }
echo "$URL" > "$URL_FILE"

cat <<MSG

  Patient app, on a phone (HTTPS — the microphone works here):

      $URL

  Token slips issued from now on encode this URL. Issue one from the doctor app (Add patient),
  scan it with the phone, and speak. Ctrl-C closes the tunnel.

MSG
wait "$TUNNEL_PID"
