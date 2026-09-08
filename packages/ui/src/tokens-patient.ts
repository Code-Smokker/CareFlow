/**
 * Patient signage tokens — docs/16-design-system.md's "Patient signage" section, built for the
 * first time here (it was speced at Day 0, unbuilt until apps/intake existed). Deliberately
 * unrelated to tokens.ts (the staff palette): patient screens are flat, high-contrast signage
 * read at arm's length by someone who may not read at all, not the staff console's dense
 * Material-style information design. Two products, two systems, on purpose.
 */

export const patientColors = {
  paper: "#F7F9F8",
  surface: "#FFFFFF",
  "surface-2": "#F4F6F5",

  ink: "#0D1F1B",
  muted: "#5A6B65",
  faint: "#7A8A85",

  line: "#DCE5E1",
  "line-strong": "#C3D0CB",

  accent: "#0E6F5C",
  "accent-deep": "#0A5546",
  "accent-soft": "#DCEDE7",

  /** Low confidence, approximate, needs confirming — never decoration, never a highlight. */
  uncertain: "#A9700F",
  "uncertain-soft": "#F6EBD6",
  /** Clinical urgency ONLY — never a delete button, an inactive tab, a generic error. */
  critical: "#B32D24",
  "critical-soft": "#F9E3E0",
  good: "#1F7A47",
} as const;

export const patientSpacing = {
  "cf-1": "4px",
  "cf-2": "8px",
  "cf-3": "16px",
  "cf-4": "24px",
  "cf-5": "32px",
  "cf-6": "56px",
  "cf-7": "88px",
} as const;

export const patientFontSize = {
  /** 32px is the FLOOR for a question, not a target. */
  question: ["32px", { lineHeight: "1.25", fontWeight: "700" }],
  answer: ["24px", { lineHeight: "1.3", fontWeight: "700" }],
  support: ["19px", { lineHeight: "1.4", fontWeight: "500" }],
  headline: ["40px", { lineHeight: "1.2", fontWeight: "700" }],
} as const;

/** Loaded via next/font/google in apps/intake's layout — see docs/16's <link> block for the
 * exact family list (Familjen Grotesk, Noto Sans Devanagari, JetBrains Mono). */
export const patientFontFamily = {
  question: ["var(--font-familjen)", "Familjen Grotesk", "sans-serif"],
  native: ["var(--font-noto-devanagari)", "Noto Sans Devanagari", "sans-serif"],
  mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
} as const;
