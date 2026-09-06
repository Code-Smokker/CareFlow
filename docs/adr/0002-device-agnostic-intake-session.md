# ADR 0002 — CareFlow is a session, not a kiosk

**Status:** accepted · **Date:** 2026-09-06

## Context

PS 26047 suggests a kiosk ("MediKiosk"). The arithmetic does not support it: a thorough history
takes 4–6 minutes, one device clears roughly 50–60 patients across a morning OPD, and serving
5,000 patients would need on the order of eighty kiosks. That is a hardware procurement
programme, for a problem statement filed under Category: Software.

Meanwhile every patient already spends around ninety minutes waiting, and most carry a phone.

## Decision

The unit of work is an **intake session** identified by a QR on the token slip. Any screen can
attach to it: the patient's own phone (installable PWA, no app store, no login), a shared kiosk,
a volunteer's tablet, the registration desk. Session state lives server-side; screens are
interchangeable mid-interview.

`intake_session.state` stores the serialized XState snapshot on every turn, which is what makes
resume-on-another-device real rather than rhetorical.

## Consequences

- Answers the scalability objection before a judge raises it. This is differentiator #1.
- Nothing in the codebase may assume a dedicated device. Kiosk-only assumptions are bugs.
- We must handle mid-session device switching, network loss and resume from day one — hence
  the snapshot column in the first migration rather than a later retrofit.
- Hardware becomes an optional accelerator for patients without a phone, not the bottleneck.
