# packages

Shared code. `ontology` is the only one that exists so far.

| Package | Contains | Owner |
|---|---|---|
| `ontology` | Complaint modules, slots, red-flag rules. **Core IP.** | AI-1 |
| `contracts` | OpenAPI specs → generated TS + Python clients. **Source of truth.** | INT |
| `ui` | Design system: tokens and the ten core components. | FE-2 |
| `fhir` | Zod schemas and builders for ABDM R4 profiles. | INT |

Build order on Day 0: `contracts` first (everyone is blocked on it), then `ui` and `ontology`
in parallel, then `fhir`.
