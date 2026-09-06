#!/usr/bin/env python3
"""Validate every complaint module against the schema. Same check runs in CI."""
import json
import pathlib
import sys

import yaml
from jsonschema import Draft202012Validator

ROOT = pathlib.Path(__file__).resolve().parent.parent
schema = json.loads((ROOT / "schema" / "module.schema.json").read_text())
validator = Draft202012Validator(schema)

failed = 0
files = sorted(ROOT.glob("modules/**/*.yaml"))
if not files:
    print("no modules found", file=sys.stderr)
    sys.exit(1)

for path in files:
    data = yaml.safe_load(path.read_text())
    errors = sorted(validator.iter_errors(data), key=lambda e: e.path)
    rel = path.relative_to(ROOT)

    if data.get("id") != path.stem:
        errors.append(type("E", (), {"message": f"id '{data.get('id')}' != filename '{path.stem}'"})())

    # every slot needs a non-voice input mode — no dead ends
    for slot in data.get("slots", []):
        modes = set(slot.get("input", []))
        if modes == {"voice"}:
            errors.append(
                type("E", (), {"message": f"slot '{slot.get('id')}' is voice-only; add a tap alternative"})()
            )

    if errors:
        failed += 1
        print(f"FAIL {rel}", file=sys.stderr)
        for err in errors:
            print(f"     {err.message}", file=sys.stderr)
    else:
        print(f"ok   {rel}")

sys.exit(1 if failed else 0)
