/**
 * Patient signage tokens — docs/16-design-system.md's "Patient signage" section, built for the
 * first time here (it was speced at Day 0, unbuilt until apps/intake existed). Deliberately
 * unrelated to tokens.ts (the staff palette): patient screens are flat, high-contrast signage
 * read at arm's length by someone who may not read at all, not the staff console's dense
 * Material-style information design. Two products, two systems, on purpose.
 *
 * accent/accent-deep/accent-soft were retuned against design/patient-ui (the team's AI-Studio
 * design source, imported as reference material only — see docs/16) — its teal
 * (#0d6e6e/#005454/#ccfbf1) was close enough to our original green (#0E6F5C) that merging was
 * low-drama, not a rebuild. Everything else here (paper/ink/uncertain/critical/good) is
 * unchanged: that source had no equivalent principled system for "uncertain" vs "critical", so
 * there was nothing to merge.
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

  accent: "#0D6E6E",
  "accent-deep": "#005454",
  "accent-soft": "#CCFBF1",

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

/** Loaded via @import in apps/intake/src/app/globals.css — see docs/16's font block. Plus
 * Jakarta Sans replaced Familjen Grotesk during the design/patient-ui merge; its handwriting
 * accent (Caveat) was dropped, not adopted — a clinical interface a judge is assessing doesn't
 * get handwriting fonts. */
export const patientFontFamily = {
  question: ["Plus Jakarta Sans", "sans-serif"],
  native: ["Noto Sans Devanagari", "sans-serif"],
  mono: ["JetBrains Mono", "monospace"],
} as const;
