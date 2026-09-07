# Vitals Flowsheet (`/vitals-flowsheet`)

> **Location:** `src/app/vitals-flowsheet`  
> **Route:** `/vitals-flowsheet`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Dedicated bedside vital signs flowsheet recording serial blood pressure, heart rate, SpO2, respiratory rate, and MEWS acuity scores.

## Clinical Context & Patient Safety
Continuous telemetry log recording blood pressure response to IV nitroglycerin and beta-blocker initiation.

## Interoperability & Compliance Standards
- **Modified Early Warning Score (MEWS)**
- **FHIR Observation (Vitals Category)**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
