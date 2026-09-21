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

VOCABULARY_SUFFIX = "-vocabulary"
modules_by_id: dict[str, dict] = {}

for path in files:
    if path.stem.endswith(VOCABULARY_SUFFIX):
        continue  # validated separately below — it is not an interview module
    data = yaml.safe_load(path.read_text())
    if isinstance(data, dict) and isinstance(data.get("id"), str):
        modules_by_id[data["id"]] = data
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


def validate_vocabulary(path: pathlib.Path) -> list[str]:
    """Structural + referential checks for a clinician-side vocabulary. Every slot, option and
    mapping it points at must exist in the interview modules — a typo here would silently drop a
    'Patient reported' pre-fill in the console, so it fails CI instead."""
    errs: list[str] = []
    vocab = yaml.safe_load(path.read_text())
    if vocab.get("status") != "PENDING_EXPERT_REVIEW" and not vocab.get("review", {}).get("verified_by"):
        errs.append("status must be PENDING_EXPERT_REVIEW until a practitioner has signed it off (add review.verified_by)")

    all_slots: dict[str, dict] = {}
    for module in modules_by_id.values():
        for slot in module.get("slots", []):
            all_slots[slot["id"]] = slot

    seen_fields: set[str] = set()
    field_options: dict[str, set[str]] = {}
    for step in vocab.get("steps", []):
        for section in step.get("sections", []):
            for field in section.get("fields", []):
                fid = field["id"]
                if fid in seen_fields:
                    errs.append(f"duplicate field id {fid}")
                seen_fields.add(fid)
                if not fid.startswith(f"{step['id']}."):
                    errs.append(f"field {fid} must be prefixed with its step id '{step['id']}.'")
                ftype = field.get("type")
                if ftype in ("enum", "enum_multi"):
                    values = [o["value"] for o in field.get("options", [])]
                    if not values:
                        errs.append(f"field {fid} has no options")
                    if len(values) != len(set(values)):
                        errs.append(f"field {fid} has duplicate option values")
                    for o in field.get("options", []):
                        if not o.get("label") or not o.get("gloss"):
                            errs.append(f"field {fid} option '{o.get('value')}' needs a label and a gloss")
                    field_options[fid] = set(values)
                for ref in field.get("patient_reference", []):
                    slot = all_slots.get(ref["slot"])
                    if slot is None:
                        errs.append(f"field {fid} references unknown slot '{ref['slot']}'")
                        continue
                    slot_values = {o["value"] for o in slot.get("options", [])}
                    for patient_value, exam_value in (ref.get("map") or {}).items():
                        if patient_value not in slot_values:
                            errs.append(f"field {fid}: map key '{patient_value}' is not an option of slot '{ref['slot']}'")
                        if exam_value not in field_options.get(fid, set()):
                            errs.append(f"field {fid}: map value '{exam_value}' is not an option of the field")

    module_ids = set(modules_by_id)
    for group in vocab.get("prashna", {}).get("groups", []):
        mod = group.get("module")
        if mod is not None and mod not in module_ids:
            errs.append(f"prashna group '{group['id']}' references unknown module '{mod}'")

    for slot_id, mapping in vocab.get("prakriti_scoring", {}).get("slots", {}).items():
        slot = all_slots.get(slot_id)
        if slot is None:
            errs.append(f"prakriti_scoring references unknown slot '{slot_id}'")
            continue
        slot_values = {o["value"] for o in slot.get("options", [])}
        if set(mapping) != slot_values:
            errs.append(f"prakriti_scoring for '{slot_id}' must tag every option exactly once (has {sorted(mapping)}, slot has {sorted(slot_values)})")
        doshas = {d["value"] for d in vocab["prakriti_scoring"]["doshas"]}
        for tag in mapping.values():
            if tag not in doshas:
                errs.append(f"prakriti_scoring for '{slot_id}' uses unknown dosha '{tag}'")
    return errs


for path in sorted(ROOT.glob("modules/**/*-vocabulary.yaml")):
    rel = path.relative_to(ROOT)
    errs = validate_vocabulary(path)
    if errs:
        failed += 1
        print(f"FAIL {rel}", file=sys.stderr)
        for e in errs:
            print(f"     {e}", file=sys.stderr)
    else:
        print(f"ok   {rel}")

sys.exit(1 if failed else 0)
