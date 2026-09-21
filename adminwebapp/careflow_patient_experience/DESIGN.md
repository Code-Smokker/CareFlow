---
name: CareFlow Patient Experience
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#3e4948'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
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
  secondary-container: '#6df5e1'
  on-secondary-container: '#006f64'
  tertiary: '#005261'
  on-tertiary: '#ffffff'
  tertiary-container: '#006c7f'
  on-tertiary-container: '#9eeaff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#a0f0f0'
  primary-fixed-dim: '#84d4d3'
  on-primary-fixed: '#002020'
  on-primary-fixed-variant: '#004f50'
  secondary-fixed: '#71f8e4'
  secondary-fixed-dim: '#4fdbc8'
  on-secondary-fixed: '#00201c'
  on-secondary-fixed-variant: '#005048'
  tertiary-fixed: '#acedff'
  tertiary-fixed-dim: '#4cd7f6'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5c'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
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
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  space-xxs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  space-3xl: 4rem
  gutter-mobile: 1rem
  gutter-desktop: 1.5rem
  margin-mobile: 1.25rem
  margin-desktop: 2.5rem
---

## Brand & Style

This design system establishes an empathetic, reassuring, and premium digital environment for modern patient healthcare. Medical interfaces often trigger latent anxiety; this system counters that tension by prioritizing emotional ease, absolute clarity, and organic fluidity. The aesthetic sits at the intersection of modern clinical precision and human warmth—combining airy minimalism with gentle, flowing structural curves and soothing ocean-tinted neutrals.

The target audience encompasses patients, caregivers, and family members spanning diverse digital proficiencies and physical contexts. The emotional response must be immediate relief, quiet confidence, and dignified control. The design movement balances **Corporate / Modern** utility with a refined, tactile softness: generous white space, whisper-soft aqua-tinted surfaces, legible architectural typography, and non-threatening geometry.

## Colors

The palette is anchored in restorative teal and aqua spectrums, balanced against clinical-grade dark navy text to preserve strict WCAG AAA legibility.

- **Primary (`#0D6E6E`)**: Deep restorative teal. Represents clinical competence, permanence, and calm authority. Used for key interactive targets, brand indicators, and emphasized navigation.
- **Secondary (`#14B8A6`)**: Vitality aqua. Denotes ongoing health progress, positive states, interactive highlights, and secondary callouts.
- **Tertiary (`#06B6D4`)**: Light cyan accent. Reserved for telemetry indicators, appointment tags, data visualization, and informative badges.
- **Neutral & Text (`#0F172A`)**: Midnight slate navy. Replaces pure black to eliminate harsh contrast while providing effortless legibility. Muted body and secondary descriptions default to `#475569` and `#64748B`.
- **Canvas & Supporting Surfaces**: Base canvas defaults to an ultra-soft aqua tint (`#F4FBF9`), supported by pure white card surfaces (`#FFFFFF`) and delicate resting container tints (`#E6FFFA` and `#F0FDFA`).

## Typography

**Plus Jakarta Sans** is selected for all typographic layers. Its contemporary geometry, generous x-height, and subtle rounded terminals impart a welcoming, human cadence while retaining structural authority.

- **Numerics & Vitals**: Vital statistics, dosages, and biometric data must be rendered with tabular figures (`font-variant-numeric: tabular-nums`) to prevent alignment jitter during real-time telemetry updates.
- **Hierarchy Rules**: Display headings use tighter tracking (`-0.02em`) to maintain cohesion at large sizes. Small utility labels feature open tracking (`+0.04em`) to safeguard immediate recognition under stressful clinical situations.
- **Reading Comfort**: Body copy is intentionally capped at 65 characters per line to minimize eye strain.

## Layout & Spacing

This design system uses an **8pt rhythmic fluid grid** system engineered for clear visual compartmentalization and low cognitive load:

- **Desktop (1024px+)**: 12-column layout with 24px gutters and 40px outer margins. Center-constrained max-width of 1280px prevents expansive, hard-to-read line lengths on wide clinical workstations.
- **Tablet (768px – 1023px)**: 8-column layout with 20px gutters and 28px margins. Cards collapse from multi-column metrics into contextual dual-column blocks.
- **Mobile (320px – 767px)**: 4-column layout with 16px gutters and 20px safe outer margins. Touch-critical workflows default to single-column full-width linear progressions.

White space is treated as an active clinical tool: generous padding around vital cards isolates information and prevents misinterpretation.

## Elevation & Depth

To avoid aggressive drop-shadows that feel artificial, depth is communicated through **tonal layers** paired with **ambient tinted shadows**:

- **Layering Base**: The viewport base sits at level 0 (`#F4FBF9`). Elevated surfaces utilize pure white (`#FFFFFF`) to visually lift themselves above the canvas.
- **Soft Ambient Shadows**: Elevation relies on low-opacity shadows tinted with deep teal (`rgba(13, 110, 110, 0.05)`) rather than harsh neutral blacks. This produces an optical illusion of natural light filtering through clean medical glass.
  - *Resting Card*: `0 2px 8px -2px rgba(13, 110, 110, 0.04), 0 1px 4px -1px rgba(15, 23, 42, 0.02)`
  - *Interactive Hover / Floating Card*: `0 12px 24px -6px rgba(13, 110, 110, 0.08), 0 4px 8px -2px rgba(15, 23, 42, 0.03)`
  - *Modals & Care Drawer Overlays*: `0 24px 48px -12px rgba(15, 23, 42, 0.14)`
- **Low-Contrast Boundaries**: Surfaces are bounded by whisper borders (`1px solid rgba(13, 110, 110, 0.08)`) to maintain physical boundary integrity when viewing against high-brightness displays.

## Shapes

The design system employs a soft, protective shape vocabulary characterized by **16px to 24px rounded radii**:

- **Cards & Primary Modules**: Standardized to `16px` (`rounded-lg`) on compact elements and `20px` to `24px` (`rounded-xl`) on primary dashboard containers.
- **Interactive Buttons & Form Fields**: Set to `12px` to `16px` depending on touch target scale, avoiding harsh sharp edges while retaining structural confidence.
- **Status Pills & Micro Indicators**: Fully pill-shaped (`9999px`) to immediately communicate status and non-editable meta tags.
- **Sensory Perception**: The absence of hard 90-degree corners reduces the user's subconscious association with sharp clinical instruments.

## Components

### Buttons
- **Primary**: Solid Deep Teal (`#0D6E6E`) with pure white text, 14px radius, and a minimum 48px touch boundary. Hover triggers a gentle transition to `#0A5C5C`.
- **Secondary**: Pale Aqua surface (`#F0FDFA`) with Deep Teal text and an invisible border that shifts to `#14B8A6` on interaction.
- **Tertiary / Ghost**: Transparent base with Midnight Navy (`#0F172A`) text, showing a faint `#E6FFFA` wash on hover.

### Form Inputs & Selectors
- Background is `#FFFFFF` with a 1.5px border of `#E2E8F0`. Corner radius is 12px.
- **Focus State**: Replaces border with `#14B8A6` and adds an external glow ring: `0 0 0 4px rgba(20, 184, 166, 0.15)`.
- **Helper & Validation**: Error states utilize `#DC2626` text with a pale rose fill (`#FEF2F2`) without eliminating clear label contexts.

### Cards & Care Summaries
- Fabricated from `#FFFFFF`, with 20px corners and a 1px border of `rgba(13, 110, 110, 0.08)`.
- Internal spacing defaults to `24px` padding. Headers group icons within a 40px rounded teal-tint circle (`#E6FFFA`).

### Selection Controls (Checkboxes & Radios)
- Rounded-md (6px) for checkboxes; fully circular for radios.
- Unselected states utilize a subtle `#CBD5E1` outline. Checked states immediately fill with Deep Teal (`#0D6E6E`) displaying a crisp white checkmark or radio dot.

### Chips & Health Badges
- Height of 28px to 32px with fully rounded pill geometry.
- Positive progress uses `#F0FDF4` background with `#15803D` text; upcoming appointments use `#F0FDFA` background with `#0D6E6E` text.

### Domain-Specific Components
- **Vitals Monitor Widget**: Distinct numeric presentation using `tabular-nums`, accompanied by a subtle sparkline and a directional trend arrow tinted in secondary aqua.
- **Medication Schedule Ribbon**: A segmented timeline card mapping morning, midday, and evening regimes using soft teal fill progress indicators.