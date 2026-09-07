# Facility Integrations (`/facility-integrations`)

> **Location:** `src/app/facility-integrations`  
> **Route:** `/facility-integrations`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Route alias forwarding to the ABDM & FHIR Gateway monitor for facility-level interoperability management.

## Clinical Context & Patient Safety
Centralizes facility registry (HFR) and clinician registry (HPR) sync states under ABDM.

## Interoperability & Compliance Standards
- **ABDM Health Facility Registry (HFR)**
- **ABDM Healthcare Professionals Registry (HPR)**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
