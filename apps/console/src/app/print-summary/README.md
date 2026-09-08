# Print Summary Alias (`/print-summary`)

> **Location:** `src/app/print-summary`  
> **Route:** `/print-summary`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Direct route alias pointing to the A4 printable discharge summary and ABHA export screen.

## Clinical Context & Patient Safety
Direct shortcut for ward clerks and nursing staff to generate printable discharge summaries.

## Interoperability & Compliance Standards
- **Next.js Clean Route Alias**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
