#!/usr/bin/env python3
"""Seeds one intake session against a running local gateway and prints exactly what a frontend
dev needs to point the intake PWA at it: session_id, resume_token, and the qr_url the token
slip would encode. `make seed-session` runs this. Requires `make dev` running.

Does not touch consent or answer any slots — that is the surface the frontend is meant to
exercise. For a full walkthrough (consent -> interview -> summary -> sign), see `make demo`
(scripts/demo/demo.py) instead.
"""

from __future__ import annotations

import sys

import httpx

GATEWAY_URL = "http://localhost:4000"


def main() -> None:
    try:
        r = httpx.get(f"{GATEWAY_URL}/health", timeout=3.0)
        r.raise_for_status()
    except httpx.HTTPError:
        print(f"ERROR: gateway not reachable at {GATEWAY_URL}. Start it first: make dev", file=sys.stderr)
        sys.exit(1)

    r = httpx.post(f"{GATEWAY_URL}/v1/sessions", timeout=10.0)
    r.raise_for_status()
    data = r.json()

    print("Session seeded.")
    print(f"  session_id:   {data['session_id']}")
    print(f"  resume_token: {data['resume_token']}")
    print(f"  qr_url:       {data['qr_url']}")
    print()
    print("Point the intake app at it directly:")
    print(f"  http://localhost:3000/intake/{data['session_id']}?rt={data['resume_token']}")


if __name__ == "__main__":
    main()
