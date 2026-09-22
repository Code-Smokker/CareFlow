#!/usr/bin/env bash
# Seeds REFERENCE data only into whatever DATABASE_URL points at (Supabase or local): the NAMASTE
# concepts with their search embeddings, and the three drug/herb dictionaries. No patients, no visits
# (CLAUDE.md rule 8). Idempotent — every loader upserts, so a second run changes nothing.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/../.."
ROOT="$(pwd)"
export NAMASTE_EXPORT_PATH="${NAMASTE_EXPORT_PATH:-$ROOT/infra/seed/namaste/NATIONAL AYURVEDA MORBIDITY CODES.xls}"

echo "→ NAMASTE concepts + embeddings (services/terminology)"
( cd services/terminology && .venv/bin/python scripts/load_namaste.py )

echo "→ dictionaries: allopathic brands, AFI formulations, AYUSH plants (services/docai)"
( cd services/docai && .venv/bin/python scripts/seed_dictionaries.py )

echo "→ done. Counts:"
( cd services/gateway && node --env-file=../../.env -e '
const { PrismaClient } = require("@prisma/client"); const p = new PrismaClient();
(async () => { console.log({ concept: await p.concept.count(), dictionary_entry: await p.dictionaryEntry.count(), patients: await p.patient.count(), visits: await p.visit.count() }); await p.$disconnect(); })()' )
