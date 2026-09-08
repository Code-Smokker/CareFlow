# 16 — Design system (`packages/ui`)

The visual spec, in code. Screen-by-screen behaviour is in doc 10; this is tokens and
components.

**One system, two densities, two different states of completeness.** Patient screens are
*signage* — huge type, flat colour, no ornament, read at arm's length by someone anxious and
possibly unable to read at all. Staff screens are *information design* — dense, keyboard-first,
legible across a room. As of this doc's last rewrite, **the staff system is built and shipped**
(`packages/ui`, consumed by `apps/console`); **the patient system below is still the plan**,
unbuilt pending `apps/intake`. Do not read the patient section as done — it is dated from Day 0
and kept here because it is still the right target when that app gets scaffolded.

---

## Staff console — shipped (`packages/ui`)

`apps/console` began life as an import of a generic hospital-EHR boilerplate
(Hospital-Side-Panel). Its Material-Stitch-derived visual language — the colour palette, Inter
+ JetBrains Mono type, Material Symbols iconography, card/container density — is what we kept.
`packages/ui` exists to make that language a single source of truth instead of something
duplicated per-app, and to bolt on the three colour rules below, which the boilerplate did not
have and which are not negotiable here.

**Where things live:**

| File | What it is |
|---|---|
| `packages/ui/src/tokens.ts` | Colour, spacing, radius, `fontFamily`, `fontSize` — lifted verbatim from the import's `tailwind.config.ts`, plus `uncertain` (see below), which the import did not have. |
| `packages/ui/src/tailwind-preset.ts` | A Tailwind v3 preset wrapping those tokens. Consuming apps do `presets: [careflowPreset]` instead of redeclaring the palette. |
| `packages/ui/src/components/Icons.tsx` | The import's inline-SVG icon set (most icons in practice are the Material Symbols variable font, loaded in `layout.tsx`; this file covers the handful of bespoke ones). |
| `packages/ui/src/components/StatusBadge.tsx` | Enforces "status colour never travels alone" — every tone renders with both an icon and a label. |
| `packages/ui/src/components/ProvenanceBadge.tsx` | Renders CLAUDE.md rule 4 (`answer.source` + `answer.confidence`) directly from `SummaryField`. Demotes low-confidence values via the `uncertain` tone; never hides them. |
| `packages/ui/src/components/DemoDataBadge.tsx` | The "Demo data — not connected to live backend" badge every unwired screen must show (docs/19-frontend-status.md). |

**Deliberately not extracted:** `Header` and `Sidebar` stay in `apps/console/src/components`.
There is exactly one staff app; turning them into a shared, parameterised component now would be
abstraction with no second caller. If a second staff-density app shows up, lift them then.

### Colour rules that override the boilerplate's own conventions

The import used its palette purely decoratively (no tone carried clinical meaning). Three rules
now sit on top of it and win in any conflict:

1. **`error` (`#ba1a1a` / `error-container` `#ffdad6`) means clinical urgency only.** Never a
   delete button, an inactive tab, a chart series, or a generic error toast. If a screen needs a
   "something went wrong, try again" colour that isn't clinical, it does not get red.
2. **`uncertain` (`#8a5a00` / `uncertain-container` `#ffddb0`) is new** — the import had no token
   for "the system is not sure." Used for low-confidence slot values, OCR spans awaiting
   confirmation, approximate timeline dates. Chosen to read clearly distinct from `error` at a
   glance (amber vs. red) rather than reusing the flat patient-app `--cf-uncertain` hex below —
   the two systems are visually unrelated and unifying them is only worth doing if one app ever
   has to embed the other's components.
3. **Status colour never travels alone.** `StatusBadge` and `ProvenanceBadge` are the only
   places colour carries meaning, and both hard-code an icon + text label alongside the fill.
   Don't reach for a bare `bg-error` / `bg-uncertain-container` span outside these components.

### Fonts

Inter (UI text) and JetBrains Mono (clinical data, IDs, timestamps) — both loaded as
`next/font/google` in `apps/console/src/app/layout.tsx`, exposed as `--font-inter` /
`--font-mono`. One addition: `clinical-note` (Source Serif 4) for `/visit/[id]/summary` — the
clinician summary is a serif on purpose, so it reads as a clinical note and not an app screen.
Not yet loaded in `layout.tsx`; add it alongside Inter when that screen ships.

---

## Patient signage — planned, not yet built (`apps/intake`)

Everything below is the original Day 0 spec, unchanged. It describes a flat, high-contrast,
CSS-custom-property system that is intentionally unrelated to the Material aesthetic above —
patient and staff screens do not need to look like the same product, they need to each be
legible to their own audience.

```css
:root {
  /* ground — never pure white; kiosks sit under glare */
  --cf-paper:        #F7F9F8;
  --cf-surface:      #FFFFFF;
  --cf-surface-2:    #F4F6F5;

  /* ink */
  --cf-ink:          #0D1F1B;
  --cf-muted:        #5A6B65;
  --cf-faint:        #7A8A85;

  /* structure */
  --cf-line:         #DCE5E1;
  --cf-line-strong:  #C3D0CB;

  /* accent — the only brand colour */
  --cf-accent:       #0E6F5C;
  --cf-accent-deep:  #0A5546;
  --cf-accent-soft:  #DCEDE7;

  /* semantic — reserved, never decorative */
  --cf-uncertain:      #A9700F;   /* low confidence, approximate, needs confirming */
  --cf-uncertain-soft: #F6EBD6;
  --cf-critical:       #B32D24;   /* clinical urgency ONLY */
  --cf-critical-soft:  #F9E3E0;
  --cf-good:           #1F7A47;

  /* staff dark (triage wall display, clinician night mode) */
  --cf-d-paper:      #0B1412;
  --cf-d-surface:    #131F1C;
  --cf-d-surface-2:  #1A2724;
  --cf-d-ink:        #E4EDE9;
  --cf-d-muted:      #93A5A0;
  --cf-d-line:       #22332F;
  --cf-d-accent:     #45C4A6;
  --cf-d-critical:   #F1695D;
  --cf-d-uncertain:  #E0A845;

  /* rhythm — everything is a multiple of 8 */
  --cf-1: 4px;  --cf-2: 8px;  --cf-3: 16px; --cf-4: 24px;
  --cf-5: 32px; --cf-6: 56px; --cf-7: 88px;

  --cf-r-chip: 6px;
  --cf-r-card: 10px;
}
```

**Two rules about colour that get broken if not stated:**

- `--cf-critical` is clinical urgency and nothing else. Never a delete button, an inactive tab,
  a chart series, or an error toast.
- `--cf-uncertain` means *the system is not sure* — low confidence, an approximate date, a drug
  name needing confirmation. Never decoration, never a highlight.

## Type

| Role | Face | Size | Weight | Used on |
|---|---|---|---|---|
| Question | Noto Sans Devanagari / Familjen Grotesk | **34px** | 700 | patient — the question itself |
| Answer | same | **24px** | 700 | patient — tap options |
| Support | Familjen Grotesk | **19px** | 500 | patient — English gloss, hints |
| Headline | Familjen Grotesk | 40px | 700 | clinician — chief complaint |
| Clinical | Source Serif 4 | 17px / 1.55 | 400 | clinician — the history body |
| Label | JetBrains Mono | 10.5px | 700 · 0.14em | section labels, chips, data |

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=JetBrains+Mono:wght@500;700&display=swap">
```

**The clinician summary is a serif on purpose.** It should read as a clinical note, not an app
screen. That is a deliberate signal to the physician, not a style preference.

**32px is the floor for a patient question.** Not a target — a floor. Anything smaller fails the
68-year-old this interface exists for.

## Hit targets

| | |
|---|---|
| Minimum touch target | **56px** |
| Answer row height | 88px |
| Primary button height | 72px |
| Screen gutter, patient | 24px |
| Screen gutter, staff | 26–34px |

## Components — build these ten on Day 0

Before any screen. Deciding colours on Day 4 is how hackathon UIs end up looking assembled.

| Component | Notes |
|---|---|
| `BigButton` | 72px, accent fill, icon + label. Icon always, label always. |
| `AnswerRow` | 88px, icon + native-script label + English gloss. The tap alternative to every question. |
| `MicOrb` | 68px circle + live waveform bars. Pulse ring on listening. `prefers-reduced-motion` kills the animation, not the state. |
| `SpeakerButton` | 56px. Replays the question aloud. Present on **every** screen. |
| `ChipGroup` | Single or multi select, icon + label, wraps with `gap`. |
| `BodyMap` | SVG figure, front/back, named tappable regions. Accent = pain site, uncertain = radiation. |
| `FaceScale` | 0–10 in six faces, green→red ramp, selected gets a 3px ring and the value read out large. |
| `ProgressFigure` | Human figure filling bottom-up via `clipPath`. Readable with zero literacy. |
| `ProvenanceChip` | Mono, 11px. `voice 04:12` · `scan p.2` · `tapped` · `low confidence` (uncertain colour). |
| `RedFlagBanner` | Critical fill, full-bleed, **quotes the patient's own words verbatim** — never a paraphrase. |

Two density modes on the same primitives: `patient` (the sizes above) and `staff` (roughly 60%
— now superseded by the shipped staff system above; keep this ratio in mind only if patient and
staff ever need to share a primitive).

## Non-negotiable rules

- **Every question has a tap answer.** Text entry is never required, anywhere, for anything.
- **One question per screen.** No nav, no back stack the patient has to reason about.
- **Mic and speaker are always visible.** Never behind a menu, never conditional.
- **Icons carry meaning, labels confirm it.** Never a label alone, never an icon alone.
- **No error blames the patient.** "I didn't catch that — you can tap instead."
- **Low confidence is demoted, never hidden.** The system says "unclear"; it does not guess.
- **Icons are stroke SVG on a 24px grid.** Never emoji, never a dingbat font.
- **No shadows on patient screens.** Depth is border and ground, not blur.
- **Motion is functional only** — waveform, screen change, red-flag arrival. `prefers-reduced-motion`
  respected everywhere.
- **WCAG 2.2 AA** contrast, visible focus rings, every control labelled for a screen reader.

## Charts (admin only)

- One scale per chart. **Never a dual axis.**
- Single-series charts use `--cf-accent` alone and need no legend — the title names the series.
- Ranked horizontal bars beat a donut for "share of" questions. Use them.
- `font-variant-numeric: tabular-nums` on every figure that sits in a column.
- Status colour (good / uncertain / critical) is separate from the accent and always ships with
  an icon or a label — never colour alone.

## The canvas

The visual source of truth is the **CareFlow Interface** design canvas — twelve artboards across
three pages: the eight-screen patient flow, the three staff screens, and this token sheet. Export
PNGs from it for the deck rather than screenshotting the running app. Note this predates the
staff-console import above and its "three staff screens" no longer reflects what's built —
`apps/console`'s running app is the current source of truth for staff screens.
