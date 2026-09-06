import { describe, expect, it } from "vitest";
import { DeidService } from "../src/deid/deid.service";

function fakeConfig(overrides: Record<string, unknown> = {}) {
  const values: Record<string, unknown> = { DEID_ENABLED: true, DEID_STRICT: true, ...overrides };
  return { get: (key: string) => values[key] } as never;
}

describe("DeidService", () => {
  it("redacts every identifier and restores them from placeholders", () => {
    const deid = new DeidService(fakeConfig());
    const text = "My name is Rajesh Kumar, my ABHA is 12-3456-7890-1234, call me on 9876543210.";
    const redacted = deid.redact("s1", ["Rajesh Kumar", "12-3456-7890-1234", "9876543210"], text);

    expect(redacted).not.toContain("Rajesh Kumar");
    expect(redacted).not.toContain("12-3456-7890-1234");
    expect(redacted).not.toContain("9876543210");
    expect(redacted).toMatch(/\[\[ID_\d+\]\]/);

    expect(deid.restore("s1", redacted)).toBe(text);
  });

  it("maps the same identifier to the same placeholder across calls within a session", () => {
    const deid = new DeidService(fakeConfig());
    const first = deid.redact("s1", ["Rajesh Kumar"], "Rajesh Kumar arrived.");
    const second = deid.redact("s1", ["Rajesh Kumar"], "Ask Rajesh Kumar about allergies.");
    const placeholder = first.match(/\[\[ID_\d+\]\]/)?.[0];
    expect(placeholder).toBeTruthy();
    expect(second).toContain(placeholder);
  });

  it("keeps placeholder maps isolated between sessions", () => {
    const deid = new DeidService(fakeConfig());
    deid.redact("s1", ["Rajesh Kumar"], "Rajesh Kumar arrived.");
    // s2 never saw "Rajesh Kumar" redacted, so restoring an s1 placeholder under s2 is a no-op.
    const leaked = deid.restore("s2", "[[ID_1]] arrived.");
    expect(leaked).toBe("[[ID_1]] arrived.");
  });

  it("is a no-op passthrough when DEID_ENABLED=false", () => {
    const deid = new DeidService(fakeConfig({ DEID_ENABLED: false }));
    const text = "Rajesh Kumar, 9876543210";
    expect(deid.redact("s1", ["Rajesh Kumar", "9876543210"], text)).toBe(text);
  });

  it("ignores null/empty identifiers without throwing", () => {
    const deid = new DeidService(fakeConfig());
    expect(deid.redact("s1", [null, undefined, ""], "no identifiers here")).toBe("no identifiers here");
  });

  it("records before/after entries in the debug log", () => {
    const deid = new DeidService(fakeConfig());
    deid.redact("s1", ["Rajesh Kumar"], "Rajesh Kumar arrived.");
    const log = deid.getDebugLog("s1");
    expect(log).toHaveLength(1);
    expect(log[0].before).toContain("Rajesh Kumar");
    expect(log[0].after).not.toContain("Rajesh Kumar");
  });
});
