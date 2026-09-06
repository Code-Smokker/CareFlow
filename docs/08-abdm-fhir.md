# 08 — ABDM & FHIR (Setu)

## ABHA v3 — identify in seconds

Session token first: `POST` to the gateway sessions endpoint with `client_credentials`
(`clientId` + `clientSecret`), token TTL roughly 20 minutes.

| Purpose | Endpoint |
|---|---|
| Session token | `/api/hiecm/gateway/v3/sessions` |
| Create — request OTP | `POST /v3/enrollment/request/otp` |
| Create — enrol | `POST /v3/enrollment/enrol/byAadhaar` |
| Login — request OTP | `POST /v3/profile/login/request/otp` |
| Login — verify | `POST /v3/profile/login/verify` |
| Login — select account | `POST /v3/profile/login/verify/user` |
| Search | `POST /v3/profile/account/abha/search` |
| Profile | `GET /v3/profile/account` |
| QR code | `GET /v3/profile/account/qrCode` |
| ABHA card | `GET /v3/profile/account/abha-card` |
| Public certificate | `GET /v3/profile/public/certificate` |

Sandbox base: `https://abhasbx.abdm.gov.in/abha/api`.
Sandbox session URL: `https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions`.

Common headers on every request: `REQUEST-ID` (fresh UUID), `TIMESTAMP` (ISO 8601),
`Authorization: Bearer <accessToken>`, `X-CM-ID` (`sbx` in sandbox), and `X-token` where a
user token is required.

**Aadhaar and OTP payloads are RSA-encrypted** with the public certificate fetched from
`/v3/profile/public/certificate`. Do not send them in the clear, even in sandbox.

> Verify every path above against current ABDM documentation before the demo. Endpoint shapes
> have changed between versions.

### The fast path we actually demo

Scan the ABHA QR at the kiosk or on the phone → demographics resolve → no typing, no login.
That is two seconds of stage time and it sets the tone for the whole demo.

## FHIR — the artefact we hand over

Built per the **NRCES FHIR Implementation Guide for ABDM**, FHIR R4 (4.0.1).

| Artefact | Use |
|---|---|
| **OPConsultRecord** | The main deliverable — the structured intake summary |
| **HealthDocumentRecord** | Prior uploads that stay unstructured |
| **DiagnosticReportRecord** | Extracted lab data |
| **PrescriptionRecord** | Medication advice, where captured |
| **DischargeSummaryRecord** | Digitised prior discharge summaries |

An OPConsultRecord bundle carries: `Composition` + `Patient` + `Practitioner` + `Encounter` +
`Condition` + `AllergyIntolerance` + `MedicationStatement` + `Observation` +
`DocumentReference` (one per scan), wrapped in a `DocumentBundle`.

`packages/fhir` holds Zod schemas and builders. Never construct a bundle as an inline object
literal at a call site.

**Validate every bundle against the local HAPI server in CI.** A red test on a malformed
bundle is a great thing to show a judge.

## The five-day reality

ABDM sandbox credentials may not arrive in time, and integrating against a gateway you cannot
reach is not a demo.

**Build against `ABDM_MODE=mock` from day one.** The mock gateway mirrors the real request and
response shapes exactly, behind the same client interface, alongside a local HAPI FHIR server.
When credentials arrive, flip the env var — nothing else changes.

On the slide, write: **"ABDM-ready · gateway mocked pending sandbox credentials"** and show the
bundle validating against HAPI.

Judges respect that. Teams that pretend the integration is live get one question and lose the
room.

## HIS integration

Hospitals run everything from a modern HMIS to a desktop application from 2009. Two adapters:

1. **FHIR out** — the bundle above, for anything ABDM-aware.
2. **Legacy adapter** — configurable REST/HL7 v2 push, plus a printable summary with a QR for
   hospitals with no integration surface at all.

The printable fallback matters more than it looks. It is what makes a pilot possible in a
hospital that cannot integrate anything.

## Care-context linking

After the physician signs, link the care context to the patient's ABHA so the record appears
in their PHR app. Under `ABDM_MODE=mock` this is logged and displayed rather than transmitted —
and the UI says so, rather than showing a fake success.
