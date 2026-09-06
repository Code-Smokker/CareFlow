import { describe, expect, it } from "vitest";
import { evaluateExpression } from "../src/ontology/expression";

describe("evaluateExpression", () => {
  it("evaluates 'in' membership against an array-valued identifier", () => {
    expect(
      evaluateExpression("'neck_stiff' in associated", {
        associated: ["neck_stiff", "headache"],
      }),
    ).toBe(true);
    expect(
      evaluateExpression("'neck_stiff' in associated", {
        associated: ["headache"],
      }),
    ).toBe(false);
  });

  it("evaluates 'in' membership against a list literal", () => {
    expect(
      evaluateExpression("consciousness in ['drowsy','confused']", {
        consciousness: "drowsy",
      }),
    ).toBe(true);
    expect(
      evaluateExpression("consciousness in ['drowsy','confused']", {
        consciousness: "normal",
      }),
    ).toBe(false);
  });

  it("combines 'and'/'or' with the real fever.yaml red-flag expressions", () => {
    const ctx = { associated: ["neck_stiff", "headache"] };
    expect(
      evaluateExpression(
        "'neck_stiff' in associated and 'headache' in associated",
        ctx,
      ),
    ).toBe(true);
    expect(
      evaluateExpression(
        "'bleeding' in associated or ('rash' in associated and 'vomiting' in associated)",
        ctx,
      ),
    ).toBe(false);
  });

  it("evaluates numeric comparisons and mixed and/or from chest_pain.yaml", () => {
    const ctx = {
      character: "pressure",
      associated: ["sweating"],
      severity: 8,
    };
    expect(
      evaluateExpression(
        "character in ['pressure','tightness'] and 'sweating' in associated and severity >= 7",
        ctx,
      ),
    ).toBe(true);
    expect(evaluateExpression("severity >= 9", ctx)).toBe(false);
  });

  it("treats an unfilled slot as false rather than throwing", () => {
    expect(evaluateExpression("severity >= 7", {})).toBe(false);
    expect(evaluateExpression("'x' in associated", {})).toBe(false);
    expect(evaluateExpression("timing == 'recurrent'", {})).toBe(false);
  });

  it("supports 'not' and parentheses", () => {
    expect(evaluateExpression("not ('x' in tags)", { tags: ["y"] })).toBe(true);
    expect(evaluateExpression("not ('x' in tags)", { tags: ["x"] })).toBe(
      false,
    );
  });
});
