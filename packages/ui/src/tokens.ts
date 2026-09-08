/**
 * Design tokens for staff-density CareFlow surfaces, lifted verbatim from the
 * Hospital-Side-Panel import (apps/console) — see docs/16-design-system.md for
 * the full rationale and the colour rules these values must obey.
 *
 * `uncertain` did not exist in the source repo and was added here: CareFlow must be able to
 * say "the system is not sure" (a low-confidence slot, an OCR span needing confirmation) in a
 * colour that is never confused with `error` (clinical urgency). Chosen to sit visually next to
 * this palette's warm/amber-adjacent neutrals rather than clash with the Material-style scheme.
 */

export const colors = {
  primary: "#005c55",
  "on-primary": "#ffffff",
  "primary-container": "#0f766e",
  "on-primary-container": "#a3faef",
  "primary-fixed": "#9cf2e8",
  "primary-fixed-dim": "#80d5cb",
  "on-primary-fixed": "#00201d",
  "on-primary-fixed-variant": "#00504a",
  "inverse-primary": "#80d5cb",

  secondary: "#4c5e83",
  "on-secondary": "#ffffff",
  "secondary-container": "#bfd2fd",
  "on-secondary-container": "#475a7e",
  "secondary-fixed": "#d7e2ff",
  "secondary-fixed-dim": "#b4c7f1",
  "on-secondary-fixed": "#041b3c",
  "on-secondary-fixed-variant": "#34476a",

  tertiary: "#0047bf",
  "on-tertiary": "#ffffff",
  "tertiary-container": "#1e5fe7",
  "on-tertiary-container": "#e6e9ff",
  "tertiary-fixed": "#dbe1ff",
  "tertiary-fixed-dim": "#b4c5ff",
  "on-tertiary-fixed": "#00174b",
  "on-tertiary-fixed-variant": "#003ea8",

  /** Clinical urgency ONLY — never a delete button, an inactive tab, a chart series, or an
   * error toast (CLAUDE.md, hard rule carried into this import). */
  error: "#ba1a1a",
  "on-error": "#ffffff",
  "error-container": "#ffdad6",
  "on-error-container": "#93000a",

  /** The system is not sure — low confidence, an approximate value, a drug name needing
   * confirmation. Never decorative, never a highlight, never paired with `error`'s meaning. */
  uncertain: "#8a5a00",
  "on-uncertain": "#ffffff",
  "uncertain-container": "#ffddb0",
  "on-uncertain-container": "#2b1700",

  surface: "#f6faff",
  "surface-dim": "#cedce7",
  "surface-bright": "#f6faff",
  "surface-container-lowest": "#ffffff",
  "surface-container-low": "#eaf5ff",
  "surface-container": "#e2f0fb",
  "surface-container-high": "#dceaf6",
  "surface-container-highest": "#d7e4f0",
  "surface-variant": "#d7e4f0",
  "on-surface": "#101d25",
  "on-surface-variant": "#3e4947",
  "surface-tint": "#006a63",
  "inverse-surface": "#25323b",
  "inverse-on-surface": "#e5f2fe",

  background: "#f6faff",
  "on-background": "#101d25",
  outline: "#6e7977",
  "outline-variant": "#bdc9c6",
} as const;

export const spacing = {
  "space-2xs": "0.125rem",
  "space-xs": "0.25rem",
  "space-sm": "0.5rem",
  "space-md": "0.75rem",
  "space-base": "1rem",
  "space-lg": "1.25rem",
  "space-xl": "1.5rem",
  "space-2xl": "2rem",
  "gutter-dense": "0.5rem",
  "gutter-normal": "1rem",
  "panel-padding": "1.25rem",
} as const;

export const borderRadius = {
  DEFAULT: "0.125rem",
  lg: "0.25rem",
  xl: "0.5rem",
  full: "0.75rem",
} as const;

export const fontFamily = {
  "page-title": ["var(--font-inter)", "Inter", "sans-serif"],
  "section-title": ["var(--font-inter)", "Inter", "sans-serif"],
  subheading: ["var(--font-inter)", "Inter", "sans-serif"],
  "chief-complaint": ["var(--font-inter)", "Inter", "sans-serif"],
  "chief-complaint-mobile": ["var(--font-inter)", "Inter", "sans-serif"],
  "body-strong": ["var(--font-inter)", "Inter", "sans-serif"],
  "body-default": ["var(--font-inter)", "Inter", "sans-serif"],
  "table-header": ["var(--font-inter)", "Inter", "sans-serif"],
  "metadata-micro": ["var(--font-inter)", "Inter", "sans-serif"],
  "clinical-data": ["var(--font-inter)", "Inter", "sans-serif"],
  "clinical-data-mono": ["var(--font-mono)", "JetBrains Mono", "monospace"],
  /** Clinician summary reads as a clinical note, not an app screen — docs/16-design-system.md. */
  "clinical-note": ["Source Serif 4", "Georgia", "serif"],
} as const;

export const fontSize = {
  subheading: ["16px", { lineHeight: "22px", letterSpacing: "0em", fontWeight: "500" }],
  "page-title": ["24px", { lineHeight: "32px", letterSpacing: "-0.015em", fontWeight: "600" }],
  "metadata-micro": ["11px", { lineHeight: "14px", letterSpacing: "0.02em", fontWeight: "500" }],
  "clinical-data-mono": ["13px", { lineHeight: "18px", letterSpacing: "0em", fontWeight: "500" }],
  "chief-complaint": ["32px", { lineHeight: "40px", letterSpacing: "-0.02em", fontWeight: "600" }],
  "body-strong": ["14px", { lineHeight: "20px", letterSpacing: "0em", fontWeight: "600" }],
  "body-default": ["14px", { lineHeight: "20px", letterSpacing: "0em", fontWeight: "400" }],
  "section-title": ["18px", { lineHeight: "24px", letterSpacing: "-0.01em", fontWeight: "600" }],
  "clinical-data": ["13px", { lineHeight: "18px", letterSpacing: "-0.005em", fontWeight: "500" }],
  "chief-complaint-mobile": ["24px", { lineHeight: "32px", letterSpacing: "-0.01em", fontWeight: "600" }],
  "table-header": ["12px", { lineHeight: "16px", letterSpacing: "0.04em", fontWeight: "600" }],
  "clinical-note": ["17px", { lineHeight: "1.55", letterSpacing: "0em", fontWeight: "400" }],
} as const;

/** answer.source values (CLAUDE.md rule 4) — used by ProvenanceBadge, never a free-text string. */
export const inputModes = ["voice", "tap", "bodymap", "proxy", "ocr"] as const;
export type InputMode = (typeof inputModes)[number];

export const inputModeIcon: Record<InputMode, string> = {
  voice: "mic",
  tap: "touch_app",
  bodymap: "accessibility_new",
  proxy: "supervisor_account",
  ocr: "document_scanner",
};
