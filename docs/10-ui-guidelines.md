# 10 — UI guidelines

Two interfaces with opposite jobs. One design system in `packages/ui`, two density modes.

Build the tokens on Day 0 — a calm clinical palette, one display face, one text face, a fixed
type scale, an 8px spacing rhythm. Deciding colours on day four is how hackathon UIs end up
looking assembled.

## Patient intake — designed for 68, not for 25

- **One question per screen.** Nothing else on it.
- **Question text 32px minimum. Body 20px minimum. Touch targets 56px minimum.**
- **Every screen has a speaker icon** that reads it aloud and a **mic** that listens. Both
  always visible, never hidden behind a menu.
- **Every question has a tap answer.** Text entry is never required.
- **Icons carry meaning, labels confirm it** — never labels alone.
- **Body map** for location and radiation. **Face scale** for severity. **Duration chips**
  ("today / 2 days / a week / a month / longer") — never a date picker.
- **Progress as a filling human figure**, so it reads without literacy.
- **Matte, low-glare surface colours**, plus a bright-light mode for kiosks near windows.
- **Read-back before submit** — the AI speaks the summary; the patient taps any line to fix it.
- **WCAG 2.2 AA** contrast, visible focus, full screen-reader labelling.
- **No dead ends.** After three failed voice attempts on a slot, it silently becomes tap-only.
- **No error states that blame the patient.** "I didn't catch that — you can tap instead."

### Language

First screen: language picker in native script, large, with an audio sample on each. Auto-detect
from the first utterance as a shortcut, never as the only path. Once chosen, everything —
prompts, chips, read-back, consent — is in that language.

## Clinician console — designed for eight seconds

- **Red-flag banner first**, full-bleed, with the triggering phrase quoted verbatim.
- **Chief complaint and duration at display size** — readable across the room.
- **History in the order physicians already read it**: CC → HPI → past medical/surgical →
  drugs & allergy → family → personal → ROS → prior investigations.
- **Horizontal document timeline**; click a marker to open the source scan.
- **Provenance chip on every field.** Low-confidence fields visually demoted, never hidden.
- **Every field editable in place.** Nothing is saved until *Accept & sign*.
- **"Ask the history"** — grounded Q&A over this patient's captured record only, with answers
  citing the field they came from. Never a general medical question box.
- **Follow-up visits open on the diff**, not the full history.
- **Keyboard first**: `j`/`k` to move, `e` to edit, `⌘↵` to sign.
- **Dark mode that actually works.** Evening OPD is real.

## Triage board

- Priority order, largest first. Red-flag cards at the top with the quote visible.
- Waiting-time heat so nobody is forgotten in the middle of the list.
- One-tap acknowledge that logs who saw the alert and when.
- Legible from four metres. This is a wall display as much as a tablet screen.

## Shared rules

- **Semantic colour is separate from the brand accent.** Red means clinical urgency and
  nothing else — never use it for a delete button or an inactive tab.
- **Nothing important is conveyed by colour alone.** Pair with an icon and a label.
- **Motion is functional.** Mic waveform, screen transitions, the red-flag banner arriving.
  Respect `prefers-reduced-motion`.
- **Loading states show what is happening**, in words a patient understands: "reading your
  prescription" not "processing".
- **Empty states say what to do next**, never just "no data".
- **Copy is written from the user's side of the screen.** A patient has "old reports", not
  "documents"; a physician "signs", they do not "submit".

## Components to build first (Day 0)

`BigButton` · `MicOrb` (with live waveform) · `ChipGroup` · `BodyMap` (SVG, tappable regions) ·
`FaceScale` · `ProgressFigure` · `SpeakerButton` · `ProvenanceChip` · `RedFlagBanner` ·
`TimelineStrip`

Everything else composes from these.
