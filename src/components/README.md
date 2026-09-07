# Clinical Design System & Shared Components (`src/components`)

> **Location:** `src/components`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Houses reusable clinical UI primitives, navigation shells (`Header.tsx`, `Sidebar.tsx`), and icon vectors (`Icons.tsx`) built strictly to Google Stitch design token specifications.

## Clinical Context & Patient Safety
Provides the persistent layout shell with the global patient context banner, emergency quick-action dock, department selectors, and responsive sidebar navigation.

## Interoperability & Compliance Standards
- **Google Stitch Token System**
- **WCAG 2.1 AA Accessibility**
- **Print CSS Engine (`print:hidden`)**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`Header.tsx`](./Header.tsx) | Persistent top navigation bar with campus selector, search hotkey (⌘K), and audio toggles. |
| [`Icons.tsx`](./Icons.tsx) | High-performance inline SVG medical and operational iconography. |
| [`PagePlaceholder.tsx`](./PagePlaceholder.tsx) | Source file |
| [`Sidebar.tsx`](./Sidebar.tsx) | Collapsible persistent sidebar indexing all 57 clinical, inpatient, and administrative routes. |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
