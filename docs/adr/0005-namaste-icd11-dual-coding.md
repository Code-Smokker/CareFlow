# ADR 0005 — Emit NAMASTE and ICD-11 TM2 codes together

**Status:** accepted · **Date:** 2026-09-06

## Context

The problem statement is sponsored by the Ministry of Ayush and the All India Institute of
Ayurveda. India's ICD-11 Traditional Medicine Module 2 roadmap pushes AYUSH institutions toward
recording morbidity in both the national AYUSH terminology (NAMASTE) and ICD-11 TM2, so
Ayurveda, Siddha and Unani diagnoses become globally comparable.

Most competing entries will treat Ayurveda as a UI tab with free-text findings.

## Decision

Build a terminology micro-service. Load the NAMASTE export as a FHIR `CodeSystem`, pull ICD-11
TM2 and MMS from the WHO ICD-API, store the crosswalk as a `ConceptMap`, and expose `$translate`.

Every clinical concept CareFlow captures is emitted as a FHIR `Condition` carrying two or three
codings: NAMASTE, ICD-11 TM2, and where relevant biomedical ICD-11 MMS.

Search uses `pg_trgm` plus embeddings so *amavata* / *āmavāta* / *aam vaat* resolve to one concept.

## Consequences

- We speak the sponsoring ministry's own vocabulary back to them. This is differentiator #2.
- A real dependency: the NAMASTE export must be obtained and the codes verified by Day 3.
  Every code in the repo is a `PLACEHOLDER` until then.
- Mappings carry an `equivalence` value and a `reviewed_by`. An unreviewed automatic mapping is
  never presented as authoritative.
- The physician can override the suggested code; their choice is what enters the signed bundle.
