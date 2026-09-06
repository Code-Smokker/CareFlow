# ADR 0006 — Build against a mock ABDM gateway from day one

**Status:** accepted · **Date:** 2026-09-06

## Context

ABDM sandbox registration as a Health Information Provider takes days to weeks. We have five.
Integrating against a gateway we cannot reach is not a demo, and a demo that depends on venue
internet and a third-party sandbox is a demo that fails on stage.

## Decision

`ABDM_MODE=mock` is the **default**. A local mock gateway mirrors the real ABHA v3 request and
response shapes exactly — headers, RSA-encrypted payload structure, error codes — behind the
same client interface. A local HAPI FHIR server validates every bundle we generate.

When real credentials arrive, set `ABDM_MODE=sandbox`. Nothing else changes.

We state the mock openly: on the slide, in the README, and in the UI, which shows "linked
(mock)" rather than a fake success.

## Consequences

- The demo works offline and does not depend on anyone else's uptime.
- Bundle correctness is still verified — against HAPI, in CI — so "ABDM-ready" is a claim we
  can defend.
- We cannot claim a live integration, and we will not. Judges respect the distinction; teams
  that fake it get one question and lose the room.
- Small ongoing cost: the mock must be kept in sync with the documented shapes as we learn them.
