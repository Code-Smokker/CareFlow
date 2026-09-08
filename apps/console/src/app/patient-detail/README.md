# Patient Detail Alias (`/patient-detail`)

> **Location:** `src/app/patient-detail`  
> **Route:** `/patient-detail`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Convenience route alias providing direct access to the longitudinal patient overview chart.

## Clinical Context & Patient Safety
Ensures deep links and external integrations reliably resolve to the comprehensive patient chart.

## Interoperability & Compliance Standards
- **Next.js Route Re-export**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
