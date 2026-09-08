# Admissions & IPD Bed Board (`/admissions-ipd`)

> **Location:** `src/app/admissions-ipd`  
> **Route:** `/admissions-ipd`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Inpatient bed board command center displaying 420 licensed beds across CCU, HDU, and Med-Surg wards with telemetry waveforms, turnaround indicators, and admission slide-over dossier.

## Clinical Context & Patient Safety
Real-time census engine balancing bed turnover times, ICU/CCU acuity levels, emergency admissions, and post-angioplasty bed allocation.

## Interoperability & Compliance Standards
- **Emergency Severity Index (ESI)**
- **ICU/CCU Acuity Grading**
- **FHIR Encounter & Location Resources**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Subdirectories
- [`[id]/`](./[id]/): Sub-module or nested route.

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
