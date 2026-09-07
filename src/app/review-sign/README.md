# Review & Sign Alias (`/review-sign`)

> **Location:** `src/app/review-sign`  
> **Route:** `/review-sign`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Route alias forwarding to the encounter review and cryptographic attestation screen.

## Clinical Context & Patient Safety
Direct access for attending physicians to sign off on encounters and trigger hospital billing release.

## Interoperability & Compliance Standards
- **Next.js Route Alias**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
