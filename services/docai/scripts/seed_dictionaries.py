"""Seeds the three dictionary_entry systems (docs/06-document-ai.md stage 4) from the source
data the repo already has on disk. Run once from services/docai with the venv active:

    .venv/bin/python scripts/seed_dictionaries.py

Idempotent — every row is an upsert keyed on (system, canonical_name), so re-running after a
source file changes just updates synonyms/metadata rather than duplicating rows.

Sources:
  a. allopathic        infra/seed/allopathic-brands/indian_medicine_data.csv
                        junioralive/Indian-Medicine-Dataset (MIT) — NOT RxNorm; chosen
                        specifically because it has India-market brand names (Dolo 650 is in
                        it; Shelcal, checked directly, is not — this snapshot's own coverage
                        gap, reported here rather than silently assumed complete).
  b. ayush_formulation  infra/seed/ayush-formulary/afi-formulations.csv
                        This repo's own AFI Part I/II extraction. See the reconciliation notes
                        in seed_ayush_formulations() below — merges are recorded, not dropped.
  c. ayush_plant        infra/seed/ayurvedic-herbs/herb.json
                        sciencewithsaucee-sudo/herb-database (CC-BY-4.0), 360 plants.
"""

from __future__ import annotations

import asyncio
import csv
import json
import re
import sys
from pathlib import Path
from typing import Any

import asyncpg

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from app.config import settings  # noqa: E402

REPO_ROOT = Path(__file__).resolve().parents[3]

_UPSERT = """
INSERT INTO dictionary_entry (system, canonical_name, synonyms, metadata)
VALUES ($1::"DictionarySystem", $2, $3, $4::jsonb)
ON CONFLICT (system, canonical_name)
DO UPDATE SET synonyms = EXCLUDED.synonyms, metadata = EXCLUDED.metadata
"""

# A dosage form suffix on the brand name ("Dolo 650 Tablet") is real label text but OCR/typed
# search more often drops it ("Dolo 650") — stripping it into an extra synonym lets both forms
# resolve to the same entry without weakening the canonical (displayed) name.
_DOSAGE_FORM_SUFFIX = re.compile(
    r"\s+(Tablet|Tablets|Capsule|Capsules|Syrup|Injection|Cream|Gel|Ointment|Lotion|Drops?|"
    r"Suspension|Solution|Powder|Spray|Sachet|Softgel|Suppository)(\s+\w+)*$",
    re.IGNORECASE,
)

# docs/06-document-ai.md's "never silently drop a low-confidence extraction" ethos, applied to
# seed data: every merge/fix this script makes is appended here and printed at the end instead
# of just happening silently.
_RECONCILIATION_LOG: list[str] = []


def _clean_composition(raw: str) -> str | None:
    text = raw.strip().strip(",").strip()
    text = re.sub(r"\s*\([^)]*\)", "", text).strip()  # drop the strength, e.g. "(650mg)"
    return text or None


async def seed_allopathic(pool: asyncpg.Pool) -> int:
    csv_path = REPO_ROOT / "infra/seed/allopathic-brands/indian_medicine_data.csv"
    by_name: dict[str, dict[str, Any]] = {}
    dup_names = 0
    with csv_path.open(encoding="utf-8") as f:
        for row in csv.DictReader(f):
            name = row["name"].strip()
            if not name:
                continue
            synonyms: set[str] = set()
            for comp_key in ("short_composition1", "short_composition2"):
                cleaned = _clean_composition(row.get(comp_key, "") or "")
                if cleaned:
                    synonyms.add(cleaned)
            stripped = _DOSAGE_FORM_SUFFIX.sub("", name).strip()
            if stripped and stripped != name:
                synonyms.add(stripped)

            manufacturer = row.get("manufacturer_name", "").strip()
            if name in by_name:
                dup_names += 1
                by_name[name]["synonyms"] |= synonyms
                by_name[name]["manufacturers"].add(manufacturer)
            else:
                by_name[name] = {
                    "synonyms": synonyms,
                    "manufacturers": {manufacturer} if manufacturer else set(),
                }

    _RECONCILIATION_LOG.append(
        f"allopathic: {dup_names} exact-name-duplicate source rows merged into their existing "
        f"entry (composition/manufacturer union, no row dropped)"
    )

    records = [
        (
            "allopathic",
            name,
            sorted(data["synonyms"]),
            json.dumps({"manufacturers": sorted(data["manufacturers"]), "source": "Indian-Medicine-Dataset (MIT)"}),
        )
        for name, data in by_name.items()
    ]
    await pool.executemany(_UPSERT, records)
    return len(records)


async def seed_ayush_formulations(pool: asyncpg.Pool) -> int:
    csv_path = REPO_ROOT / "infra/seed/ayush-formulary/afi-formulations.csv"
    rows = list(csv.DictReader(csv_path.open(encoding="utf-8")))

    # The one confirmed OCR split documented in infra/seed/ayush-formulary/README.md: a
    # spurious space, not two formulations. Merged here, not in extract_afi.py, so the CSV
    # itself stays a faithful record of what the OCR actually produced.
    for row in rows:
        if row["name"] == "DAS AMULARISTA":
            row["_synonym"] = "DAS AMULARISTA"
            row["name"] = "DASAMULARISTA"
            _RECONCILIATION_LOG.append(
                "ayush_formulation: 'DAS AMULARISTA' (source_line "
                f"{row['source_line']}) merged into 'DASAMULARISTA' as a synonym — documented "
                "OCR split, see infra/seed/ayush-formulary/README.md"
            )

    by_name: dict[str, dict[str, Any]] = {}
    for row in rows:
        name = row["name"]
        provenance = {
            "source": row["source"],
            "category_section": row["category_section"],
            "category_no": row["category_no"],
            "formulation_no": row["formulation_no"],
            "source_line": row["source_line"],
            "needs_review": row["needs_review"] == "True",
        }
        if name in by_name:
            by_name[name]["merged_from"].append(provenance)
            _RECONCILIATION_LOG.append(
                f"ayush_formulation: duplicate name '{name}' (source_line {row['source_line']}) "
                "merged into the existing entry's metadata.merged_from — not a separate row"
            )
        else:
            entry = {"synonyms": set(), "merged_from": []}
            if "_synonym" in row:
                entry["synonyms"].add(row["_synonym"])
            entry["primary"] = provenance
            by_name[name] = entry

    records = [
        (
            "ayush_formulation",
            name,
            sorted(data["synonyms"]),
            json.dumps(
                {
                    "afi_reference": data["primary"],
                    "merged_from": data["merged_from"],
                    "needs_review": data["primary"]["needs_review"] or bool(data["merged_from"]),
                    "source": "Ayurvedic Formulary of India, Parts I & II (Govt. of India, public domain)",
                }
            ),
        )
        for name, data in by_name.items()
    ]
    await pool.executemany(_UPSERT, records)
    return len(records)


async def seed_ayush_plants(pool: asyncpg.Pool) -> int:
    json_path = REPO_ROOT / "infra/seed/ayurvedic-herbs/herb.json"
    plants = json.loads(json_path.read_text(encoding="utf-8"))

    records = []
    for plant in plants:
        name = plant["name"].strip()
        synonyms: set[str] = set()
        synonyms.update(s.strip() for s in plant.get("sanskrit_synonyms", []) if s.strip())
        if plant.get("english_name"):
            synonyms.add(plant["english_name"].strip())
        if plant.get("botanical_name"):
            synonyms.add(plant["botanical_name"].strip())

        # herb-database (CC-BY-4.0) ships Sanskrit synonyms transliterated to Latin script only
        # — no Devanagari. This one entry's Devanagari spelling is added by hand (not sourced
        # from the dataset) because it's the exact worked example this task names; it is NOT
        # done for the other 359 plants, since guessing Devanagari for names this script hasn't
        # verified would be exactly the kind of silent, unverified fabrication CLAUDE.md's
        # DOCUMENTED-vs-ASSUMED discipline exists to prevent.
        if name == "Ashwagandha":
            synonyms.add("अश्वगंधा")
            _RECONCILIATION_LOG.append(
                "ayush_plant: 'अश्वगंधा' added by hand as a synonym for Ashwagandha — the "
                "source dataset has no Devanagari script; not done for other 359 plants"
            )

        records.append(
            (
                "ayush_plant",
                name,
                sorted(synonyms),
                json.dumps(
                    {
                        "botanical_name": plant.get("botanical_name"),
                        "family": plant.get("family"),
                        "english_name": plant.get("english_name"),
                        "sanskrit_synonyms": plant.get("sanskrit_synonyms", []),
                        "part_used": plant.get("part_used", []),
                        "main_indications": plant.get("main_indications", []),
                        "source": "herb-database, sciencewithsaucee-sudo (CC-BY-4.0)",
                    }
                ),
            )
        )
    await pool.executemany(_UPSERT, records)
    return len(records)


async def main() -> None:
    pool = await asyncpg.create_pool(settings.database_url, min_size=1, max_size=5)
    try:
        allopathic_count = await seed_allopathic(pool)
        formulation_count = await seed_ayush_formulations(pool)
        plant_count = await seed_ayush_plants(pool)
    finally:
        await pool.close()

    print("\n=== Reconciliation log ===")
    for line in _RECONCILIATION_LOG:
        print(f"  - {line}")

    print("\n=== Row counts ===")
    print(f"  allopathic:        {allopathic_count}")
    print(f"  ayush_formulation:  {formulation_count}")
    print(f"  ayush_plant:        {plant_count}")


if __name__ == "__main__":
    asyncio.run(main())
