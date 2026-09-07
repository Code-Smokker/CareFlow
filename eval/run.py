#!/usr/bin/env python3
"""Replays eval/scripts/*.yaml through the ai service, scores slot recall and red-flag
sensitivity/specificity, prints the table. `make eval` runs this. See docs/12-eval-plan.md.

Talks to the ai service over HTTP only (no gateway, no database) — matches how docs/12 frames
it: a black-box replay against services/ai's own endpoints.
"""

from __future__ import annotations

import csv
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

import httpx
import yaml

AI_SERVICE_URL = "http://localhost:8001"
SCRIPTS_DIR = Path(__file__).parent / "scripts"
REPORT_DIR = Path(__file__).parent / "report"


@dataclass
class SlotResult:
    script_id: str
    slot_id: str
    expected: Any
    actual: Any
    correct: bool
    needs_clarification: bool


@dataclass
class RedFlagResult:
    script_id: str
    kind: str
    expected: list[str]
    fired: list[str]
    sensitivity_ok: bool  # every expected rule fired
    specificity_ok: bool  # no unexpected rule fired


@dataclass
class Results:
    slots: list[SlotResult] = field(default_factory=list)
    red_flags: list[RedFlagResult] = field(default_factory=list)
    errors: list[str] = field(default_factory=list)


def check_service_reachable(client: httpx.Client) -> None:
    try:
        response = client.get(f"{AI_SERVICE_URL}/health", timeout=3.0)
        response.raise_for_status()
    except httpx.HTTPError as exc:
        print(f"ERROR: ai service is not reachable at {AI_SERVICE_URL} ({exc}).", file=sys.stderr)
        print("Start it first: cd services/ai && .venv/bin/uvicorn app.main:app --port 8001", file=sys.stderr)
        sys.exit(1)


def load_scripts() -> list[dict[str, Any]]:
    scripts = sorted(SCRIPTS_DIR.glob("*.yaml"))
    if not scripts:
        print(f"ERROR: no scripts found in {SCRIPTS_DIR}", file=sys.stderr)
        sys.exit(1)
    return [yaml.safe_load(p.read_text(encoding="utf-8")) for p in scripts]


def values_equal(a: Any, b: Any) -> bool:
    if isinstance(a, list) and isinstance(b, list):
        return sorted(map(str, a)) == sorted(map(str, b))
    return a == b


def run_red_flag_script(client: httpx.Client, script: dict[str, Any], results: Results) -> None:
    slots = {a["slot_id"]: a["value"] for a in script["answers"]}
    # Every scripted answer is correct by construction (it's a fixture we wrote, not extracted
    # from an utterance) — still recorded, so the overall slot count reflects the full eval set,
    # not just the messy subset.
    for slot_id, value in slots.items():
        results.slots.append(SlotResult(script["id"], slot_id, value, value, True, False))

    response = client.post(
        f"{AI_SERVICE_URL}/evaluate-flags",
        json={"module_id": script["module_id"], "slots": slots},
        timeout=10.0,
    )
    response.raise_for_status()
    fired = [f["rule_id"] for f in response.json()["fired"]]
    expected = script["expected_red_flags"]
    results.red_flags.append(
        RedFlagResult(
            script["id"],
            script["kind"],
            expected,
            fired,
            sensitivity_ok=set(expected).issubset(fired),
            specificity_ok=set(fired).issubset(expected),
        )
    )


def run_messy_script(client: httpx.Client, script: dict[str, Any], results: Results) -> None:
    extracted: dict[str, Any] = {}
    for item in script["utterances"]:
        response = client.post(
            f"{AI_SERVICE_URL}/fill-slot",
            json={"slot_schema": item["slot_schema"], "utterance": item["utterance"], "context": {}},
            timeout=15.0,
        )
        response.raise_for_status()
        body = response.json()
        correct = values_equal(body["value"], item["expected_value"])
        results.slots.append(
            SlotResult(script["id"], item["slot_id"], item["expected_value"], body["value"], correct, body["needs_clarification"])
        )
        if body["value"] is not None:
            extracted[item["slot_id"]] = body["value"]

    response = client.post(
        f"{AI_SERVICE_URL}/evaluate-flags",
        json={"module_id": script["module_id"], "slots": extracted},
        timeout=10.0,
    )
    response.raise_for_status()
    fired = [f["rule_id"] for f in response.json()["fired"]]
    expected = script["expected_red_flags"]
    results.red_flags.append(
        RedFlagResult(
            script["id"],
            script["kind"],
            expected,
            fired,
            sensitivity_ok=set(expected).issubset(fired),
            specificity_ok=set(fired).issubset(expected),
        )
    )


def run_all(client: httpx.Client, scripts: list[dict[str, Any]]) -> Results:
    results = Results()
    for script in scripts:
        try:
            if script["kind"] == "red_flag":
                run_red_flag_script(client, script, results)
            elif script["kind"] == "messy":
                run_messy_script(client, script, results)
            else:
                raise ValueError(f"unknown script kind {script['kind']!r}")
        except httpx.HTTPError as exc:
            results.errors.append(f"{script['id']}: {exc}")
    return results


def _slot_accuracy_detail(messy_slots: list[SlotResult]) -> str:
    # fill_slot.py never fabricates a value — no reachable LLM provider means every call comes
    # back needs_clarification=True (app/llm/fill_slot.py). So "how many of these needed
    # clarification" is an honest, self-reporting signal for whether a live provider actually
    # answered this run, without this script having to know which provider or credential.
    if not messy_slots:
        return "via /fill-slot"
    unclear = sum(s.needs_clarification for s in messy_slots)
    if unclear == len(messy_slots):
        return "via /fill-slot, no LLM provider answered — every call came back needs_clarification"
    return f"via /fill-slot, {len(messy_slots) - unclear}/{len(messy_slots)} calls answered by a live LLM provider"


def print_table(results: Results) -> str:
    red_flag_cases = [r for r in results.red_flags if r.kind == "red_flag"]
    messy_cases = [r for r in results.red_flags if r.kind == "messy"]
    messy_slots = [s for s in results.slots if any(m.script_id == s.script_id for m in messy_cases)]

    sensitivity_n = sum(r.sensitivity_ok for r in red_flag_cases)
    specificity_n = sum(r.specificity_ok for r in messy_cases)
    slot_correct_n = sum(s.correct for s in messy_slots)

    def row(label: str, result: str, detail: str) -> str:
        return f"{label:44} {result:>8}  {detail}"

    lines = []
    lines.append("CareFlow eval — " + f"{len(results.slots)} slot checks, {len(results.red_flags)} scripts")
    lines.append("=" * 88)
    lines.append(row("Metric", "Result", "Detail"))
    lines.append("-" * 88)
    lines.append(
        row(f"Red-flag sensitivity ({len(red_flag_cases)} red_flag cases)", f"{sensitivity_n}/{len(red_flag_cases)}", "target 100%")
    )
    lines.append(
        row(
            f"Red-flag specificity ({len(messy_cases)} messy cases)",
            f"{specificity_n}/{len(messy_cases)}",
            "non-flag cases correctly not escalated",
        )
    )
    lines.append(
        row(
            "Slot accuracy — messy/extraction cases",
            f"{slot_correct_n}/{len(messy_slots)}" if messy_slots else "n/a",
            _slot_accuracy_detail(messy_slots),
        )
    )
    lines.append("-" * 88)
    lines.append("Per-script detail:")
    for r in results.red_flags:
        status = "PASS" if r.sensitivity_ok and r.specificity_ok else "FAIL"
        lines.append(f"  [{status}] {r.script_id:32} expected={r.expected} fired={r.fired}")
    for s in results.slots:
        if s.script_id in [m.script_id for m in messy_cases]:
            status = "PASS" if s.correct else "FAIL"
            lines.append(
                f"  [{status}] {s.script_id}.{s.slot_id:20} expected={s.expected!r} actual={s.actual!r}"
                + (" (needs_clarification)" if s.needs_clarification else "")
            )
    if results.errors:
        lines.append("-" * 88)
        lines.append("Errors:")
        for e in results.errors:
            lines.append(f"  {e}")
    return "\n".join(lines)


def write_reports(results: Results) -> None:
    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    with (REPORT_DIR / "slots.csv").open("w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["script_id", "slot_id", "expected", "actual", "correct", "needs_clarification"])
        for s in results.slots:
            writer.writerow([s.script_id, s.slot_id, s.expected, s.actual, s.correct, s.needs_clarification])
    with (REPORT_DIR / "red_flags.csv").open("w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["script_id", "kind", "expected", "fired", "sensitivity_ok", "specificity_ok"])
        for r in results.red_flags:
            writer.writerow([r.script_id, r.kind, ";".join(r.expected), ";".join(r.fired), r.sensitivity_ok, r.specificity_ok])
    (REPORT_DIR / "report.md").write_text(f"# CareFlow eval report\n\n```\n{print_table(results)}\n```\n", encoding="utf-8")


def main() -> None:
    with httpx.Client() as client:
        check_service_reachable(client)
        scripts = load_scripts()
        results = run_all(client, scripts)
    table = print_table(results)
    print(table)
    write_reports(results)
    print(f"\nWrote {REPORT_DIR}/report.md, slots.csv, red_flags.csv")


if __name__ == "__main__":
    main()
