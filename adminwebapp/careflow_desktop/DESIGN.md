---
name: CareFlow Desktop
colors:
  surface: '#f9f9ff'
  surface-dim: '#ccdafa'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e8eeff'
  surface-container-high: '#dfe8ff'
  surface-container-highest: '#d7e3ff'
  on-surface: '#0c1b33'
  on-surface-variant: '#3e4948'
  inverse-surface: '#223149'
  inverse-on-surface: '#ecf0ff'
  outline: '#6e7979'
  outline-variant: '#bec9c8'
  surface-tint: '#016a6a'
  primary: '#005454'
  on-primary: '#ffffff'
  primary-container: '#0d6e6e'
  on-primary-container: '#9dedec'
  inverse-primary: '#84d4d3'
  secondary: '#006b5f'
  on-secondary: '#ffffff'
  secondary-container: '#9cefdf'
  on-secondary-container: '#0b6f63'
  tertiary: '#015362'
  on-tertiary: '#ffffff'
  tertiary-container: '#296b7a'
  on-tertiary-container: '#abe9fb'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#a0f0f0'
  primary-fixed-dim: '#84d4d3'
  on-primary-fixed: '#002020'
  on-primary-fixed-variant: '#004f50'
  secondary-fixed: '#9ff2e2'
  secondary-fixed-dim: '#83d5c6'
  on-secondary-fixed: '#00201c'
  on-secondary-fixed-variant: '#005047'
  tertiary-fixed: '#aeecfe'
  tertiary-fixed-dim: '#92d0e2'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5c'
  background: '#f9f9ff'
  on-background: '#0c1b33'
  surface-variant: '#d7e3ff'
  canvas-bg: '#FAF8FF'
  surface-card: '#FFFFFF'
  surface-mint: '#D1F2E8'
  surface-mint-subtle: '#E6F7F2'
  border-subtle: '#E2E8F0'
  border-teal: '#D6E4E2'
  navy-dark: '#0B192C'
  text-muted: '#3E4948'
  status-error: '#BA1A1A'
  status-error-bg: '#FFDAD6'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 34px
    fontWeight: '700'
    lineHeight: 42px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.01em
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm-bilingual:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1320px
  sidebar-width: 260px
  gutter-desktop: 1.5rem
  gutter-mobile: 1rem
  padding-card: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style

This design system translates a patient-first mobile experience into a responsive desktop and web clinical environment. Designed for patients, doctors, and triage administrators across India's modern healthcare ecosystem, it pairs clinical precision with soothing hospitality. 

The emotional tone balances calm reassurance with rigorous competence. By softening institutional sterility through warm lavender-tinted neutrals, fluid curvatures, and restorative teals, the interface mitigates healthcare-induced anxiety while organizing high-density medical data. 

The aesthetic is **Corporate / Modern** elevated by tactile softness: generous architectural white space, crisp hairline borders, soft mint badge highlights, and dual-language typographic accommodation (English and Devanagari/Hindi).

## Colors

The color system centers around restorative deep teals, crisp clinical whites, and deep navy tones, anchored against a lavender-tinted background.

- **Primary (`#0D6E6E`)**: Deep CareFlow Teal serves as the primary visual anchor for high-priority actions, active navigation tabs, and focal points.
- **Secondary (`#006B5F`) & Tertiary (`#005261`)**: Mid-tone teals and slate cyans used for clinical metadata, active data filters, and triage status indicators.
- **Neutral & Text (`#0F1E36` / `#0B192C`)**: Deep Navy replaces pure black. This provides high-contrast legibility for vital signs, medical records, and diagnostic descriptions without harshness.
- **Surfaces & Canvases**: The foundational canvas uses `#FAF8FF`, while elevated content containers sit on pure `#FFFFFF`.
- **Highlights & Badges**: Soft mint accents (`#D1F2E8`, `#E6F7F2`) denote normal readings, confirmed appointments, and pill badges.

## Typography

Typography relies on **Plus Jakarta Sans** for expressive, humanistic headings and structural copy, complemented by **Inter** for dense interface labels, telemetry meters, and data tables.

- **Bilingual Typographic Hierarchy**: Wherever clinical directions or summaries require dual-language clarity, the primary English copy is matched with a secondary, muted Hindi translation rendered in `body-sm-bilingual` directly beneath.
- **Tabular Data**: Biometric telemetry, diagnostic lab numerical ranges, and appointment timestamps must explicitly employ `font-variant-numeric: tabular-nums` to maintain vertical alignment across data lists.
- **Legibility Guardrails**: Reading line-lengths for patient reports and clinical triage notes are constrained to a maximum of 72 characters.

## Elevation & Depth

Visual hierarchy uses **tonal layering** and **diffused ambient shadows** tinted with teal and navy undertones, maintaining a pristine, non-invasive clinical environment:

- **Level 0 (Canvas)**: `#FAF8FF` baseline layer.
- **Level 1 (Cards & Workstation Panels)**: Pure `#FFFFFF` resting on `#FAF8FF` with a subtle perimeter border (`1px solid #E2E8F0` or `#D6E4E2`) and an ambient shadow: `0 2px 8px -2px rgba(13, 110, 110, 0.04), 0 1px 4px -1px rgba(15, 30, 54, 0.03)`.
- **Level 2 (Hover States & Active Cards)**: Elevated card state featuring `0 12px 24px -4px rgba(13, 110, 110, 0.08), 0 4px 8px -2px rgba(15, 30, 54, 0.04)`.
- **Level 3 (Modals & Slide-over Drawers)**: Diagnostic summary slide-outs and triage overlays feature deep ambient containment: `0 24px 48px -12px rgba(11, 25, 44, 0.16)`.

## Shapes

The design system rejects rigid, razor-sharp enterprise borders in favor of approachable, rounded geometries:

- **Cards & Primary Panels**: Styled with `rounded-2xl` (16px to 20px) to echo the handheld mobile experience.
- **Buttons & Interactive CTAs**: Pill-shaped (`rounded-full` / 9999px) for prominent triggers, conveying human accessibility rather than technical rigidity.
- **Input Fields & Form Controls**: Standardized to `10px` to `12px` roundedness for structured ergonomics.
- **Badges, Tags & Language Switchers**: Fully pill-shaped (`rounded-full`) encapsulating text cleanly.

## Components

### Buttons
- **Primary CTA**: Pill-shaped (`rounded-full`), solid Deep CareFlow Teal (`#0D6E6E`), white text, 44px height (desktop) or 48px (mobile). Hover shifts background to `#0A5656`.
- **Secondary Action**: Pill-shaped with a pure white background, `1.5px solid #D6E4E2` border, and `#0D6E6E` text. Hover applies `#E6F7F2` tint.
- **Tertiary / Utility**: Borderless button with `#0F1E36` text, transitioning to `#E6F7F2` background on interaction.

### Chips, Pills & Highlights
- Constructed with a height of 26px–30px, `rounded-full`, with 12px horizontal padding.
- Normal/Success: `#E6F7F2` background with `#006B5F` text.
- Attention/Triage: `#FFDAD6` background with `#BA1A1A` text.
- Information/Pending: Lavender-tinted container (`#EAEDFF`) with `#005261` text.

### Top Navigation & Sidebar
- **Top Bar**: Fixed 64px height, `#FFFFFF` background, `1px solid #E2E8F0` lower border. Contains the CareFlow heart emblem, navigation links (Dashboard, Patients, Appointments, Documents, Care Summaries), a dual-language switcher toggle (`English` | `हिन्दी`), and the profile avatar badge.
- **Sidebar**: Compact 260px floating container, rounded corners (`rounded-2xl`), `#FFFFFF` surface. Active menu items use a soft mint pill background (`#E6F7F2`) with `#0D6E6E` text and a 4px vertical teal indicator.

### Cards & Clinical Panels
- Built on `#FFFFFF` surfaces with `rounded-2xl`, bounded by a `1px solid #E2E8F0` border.
- Split-panel headers isolate patient identity and vital indicators from the scrollable diagnostic history using a subtle horizontal divider (`#F2F3FF`).

### Input Fields
- White fill, 42px height, `1px solid #E2E8F0` boundary, `12px` corner radius.
- Active focus state highlights the border with `#0D6E6E` and applies an outer ring: `0 0 0 3px rgba(13, 110, 110, 0.15)`.

### Checkboxes & Radios
- Checkboxes: 18px x 18px, `rounded-md` (6px). Checked state fills `#0D6E6E` with a crisp white checkmark.
- Radios: 18px x 18px circular targets with a solid `#0D6E6E` center dot when selected.