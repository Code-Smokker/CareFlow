# 09 — Security, consent and DPDP 2023 (Kavach)

Health data under the Digital Personal Data Protection Act 2023, captured from patients who
in many cases cannot read a privacy notice. The interface has to carry the obligation, not a
policy page.

## Consent

- **Purpose stated aloud**, in the chosen language, before anything is recorded.
- **Granular toggles with icons**, each independently refusable:
  - capture my history
  - read my old records
  - share with this hospital
  - link to my ABHA
- **Revocable** at any point, including after submission, from the same QR.
- **Assent recorded as audio** and stored alongside a FHIR `Consent` resource with timestamp
  and scope.
- **Refusing a scope degrades gracefully.** Declining ABHA linking still produces a summary for
  this visit. Nothing is all-or-nothing.

## Minimisation and erasure

| Rule | Mechanism |
|---|---|
| Raw audio deleted after transcription | Celery task, unless the patient opts into provenance playback |
| Session data expires | Redis TTL + `intake_session.expires_at` |
| Uploaded scans expire | MinIO lifecycle policy |
| Patient can purge | `DELETE /v1/sessions/:id` |

The kiosk shows a **visible countdown to session wipe**. Making the policy legible in the
interface is worth more than a paragraph nobody reads.

## Boundary control

The **de-identification proxy** sits in the gateway. Before any hosted model call, identifiers
— name, ABHA number, phone, address — are replaced with stable per-session placeholders, and
restored on the way back. In `LLM_PROVIDER=local` mode nothing leaves the building at all.

Keep a debug view that shows the before and after. It demos in five seconds and it is the
answer to the data-residency question.

## Standard hygiene

- TLS everywhere, including between services in production.
- AES-GCM field-level encryption for identifier columns; a database dump must not yield
  identities.
- RBAC: `patient` · `kiosk` · `nurse` · `physician` · `admin`. Least privilege by default.
- **Append-only audit log** recording every *read* of a patient record with actor, role and
  reason. Enforced by a trigger, not by convention.
- Rate limiting on every public endpoint; stricter on OTP endpoints.
- Kiosk lock-down mode: single origin, no navigation, state cleared on session end, no
  browser chrome.
- Idempotency keys on mutating endpoints — retries on bad wifi must not double-write.
- Dependency scanning in CI; no secrets in the repo, enforced by a pre-commit hook.

## Threat notes specific to this system

| Threat | Mitigation |
|---|---|
| Shoulder surfing at a shared kiosk | No full identifiers on screen after identification; large text is a tradeoff we make deliberately and mitigate with screen positioning guidance |
| Session hijack via QR | `resume_token` is single-scope, hashed at rest, and expires with the session |
| Wrong patient attached to a session | Read-back confirms name and age aloud before submission |
| Prompt injection via a scanned document | Extracted document text is data, never instructions — it never enters a prompt as an instruction block |
| Model retaining PII | De-identification proxy, plus on-premise mode |
| Audio leaking to storage | Deleted after transcription by default; opt-in only |

## What we claim, and what we do not

We claim: DPDP-aligned consent design, minimisation, encryption, auditability, and an
on-premise deployment path.

We do not claim: a certified deployment, a completed DPIA, or ABDM certification. Say so.
A team that knows the difference between *aligned with* and *certified against* reads as a
team that has read the Act.
