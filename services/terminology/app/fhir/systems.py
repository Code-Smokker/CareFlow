"""Canonical FHIR system URIs per internal `concept.system` value — docs/07-ayush-terminology.md's
worked example. TM2 and the biomedical MMS equivalent share one URI because both live in the
same ICD-11 MMS release (TM2 is chapter 26 of MMS, not a separate release) — they're
distinguished by which code/display they carry, not by system URI. Mirrored by hand in
services/gateway/src/visits/visits.service.ts (TS can't import this Python module) — keep both
in sync if either changes.
"""

SYSTEM_URIS = {
    "namaste": "http://terminology.ayush.gov.in/namaste",
    "icd11-tm2": "http://id.who.int/icd/release/11/mms",
    "icd11-bio": "http://id.who.int/icd/release/11/mms",
}
