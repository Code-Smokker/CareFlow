# Prescriptions Roster (`/prescriptions`)

> **Location:** `src/app/prescriptions`  
> **Route:** `/prescriptions`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Clinician prescription review view organizing active medication courses, dose tapering schedules, and refill authorizations.

## Clinical Context & Patient Safety
Review of oral antiplatelet therapy (DAPT), high-intensity statin therapy, and insulin sliding scales.

## Interoperability & Compliance Standards
- **e-Prescribing Quality Standards**
- **FHIR MedicationRequest**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
