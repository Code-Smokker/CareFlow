import { describe, expect, it } from "vitest";
import { buildConsent } from "../src/consent";
import { urnReference } from "../src/common";

describe("buildConsent", () => {
  const patientRef = urnReference("p1", "Test Patient");

  it("is active when at least one scope is currently granted", () => {
    const consent = buildConsent({
      id: "c1",
      patientRef,
      grantedScopes: ["history", "abha_lookup"],
      allScopes: ["history", "abha_lookup"],
      grantedAt: "2026-09-06T10:00:00.000Z",
    });
    expect(consent.status).toBe("active");
    expect(consent.provision?.code).toHaveLength(2);
  });

  it("is inactive once every granted scope has been revoked, but keeps the revoked scope in category", () => {
    const consent = buildConsent({
      id: "c1",
      patientRef,
      grantedScopes: [],
      allScopes: ["abha_lookup"],
      grantedAt: "2026-09-06T10:00:00.000Z",
    });
    expect(consent.status).toBe("inactive");
    expect(consent.category).toHaveLength(1);
    expect(consent.category[0].coding?.[0].code).toBe("abha_lookup");
    expect(consent.provision?.code).toHaveLength(0);
  });

  it("carries the recorded audio assent as a sourceAttachment when present", () => {
    const consent = buildConsent({
      id: "c1",
      patientRef,
      grantedScopes: ["history"],
      allScopes: ["history"],
      grantedAt: "2026-09-06T10:00:00.000Z",
      audioUri: "https://storage.example/assent.wav",
    });
    expect(consent.sourceAttachment?.url).toBe("https://storage.example/assent.wav");
  });

  it("omits sourceAttachment when no audio assent was recorded", () => {
    const consent = buildConsent({
      id: "c1",
      patientRef,
      grantedScopes: ["history"],
      allScopes: ["history"],
      grantedAt: "2026-09-06T10:00:00.000Z",
    });
    expect(consent.sourceAttachment).toBeUndefined();
  });
});
