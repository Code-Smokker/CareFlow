# CareFlow documentation

The spec. Read `00-overview.md` first; read the file for the area you are about to touch
before you touch it.

## Reading order

| # | Doc | Read it when |
|---|---|---|
| 00 | [Overview](00-overview.md) | Before anything. The problem, the reframe, the differentiators. |
| 01 | [Architecture](01-architecture.md) | Before adding a service or crossing a boundary. |
| 02 | [Tech stack](02-tech-stack.md) | Before adding a dependency. |
| 03 | [API contracts](03-api-contracts.md) | Before writing any client or endpoint. |
| 04 | [Data model](04-data-model.md) | Before a migration. |
| 05 | [Interview engine](05-interview-engine.md) | Before touching the conversation. |
| 06 | [Document AI](06-document-ai.md) | Before touching OCR or extraction. |
| 07 | [AYUSH & terminology](07-ayush-terminology.md) | Before touching Ayurvedic capture or codes. |
| 08 | [ABDM & FHIR](08-abdm-fhir.md) | Before touching identity or interoperability. |
| 09 | [Security & DPDP](09-security-dpdp.md) | Before touching consent, storage or logging. |
| 10 | [UI guidelines](10-ui-guidelines.md) | Before designing a screen. |
| 11 | [Sprint plan](11-sprint-plan.md) | Every morning. |
| 12 | [Eval plan](12-eval-plan.md) | Day 5, and whenever adding a clinical rule. |
| 13 | [Demo script](13-demo-script.md) | Continuously. This is the acceptance test. |
| — | [API keys](API_KEYS.md) | When obtaining credentials. |
| — | [Contributing](CONTRIBUTING.md) | Before your first PR. |
| — | [ADRs](adr/) | When you disagree with a decision. |

## Conventions in these docs

- **Verified** means someone on the team checked it against the primary source and put the
  link in the doc. **Unverified** means it came from a plan and still needs checking.
- Anything marked `PLACEHOLDER` must be replaced before the demo. Codes especially.
- If a doc and the code disagree, the code is what runs and the doc is a bug. Fix the doc in
  the same PR.
