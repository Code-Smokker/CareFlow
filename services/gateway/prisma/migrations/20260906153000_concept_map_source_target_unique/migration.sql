-- A source concept maps to a given target at most once per direction — the candidate-mapping
-- generator (services/terminology/app/mapping/generate.py) upserts on this pair so re-running
-- it after new concepts load updates existing rows instead of duplicating them.
CREATE UNIQUE INDEX "concept_map_source_concept_target_concept_key" ON "concept_map"("source_concept", "target_concept");
