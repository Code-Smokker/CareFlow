# Clinical Summary Overview (`/clinical-summary`)

> **Location:** `src/app/clinical-summary`  
> **Route:** `/clinical-summary`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Consolidated encounter summary bringing together discharge diagnoses, surgical interventions, discharge medications, and follow-up appointment instructions.

## Clinical Context & Patient Safety
Provides attending physicians with a synchronized view of encounter highlights prior to digital attestation and discharge publication.

## Interoperability & Compliance Standards
- **FHIR Composition Resource**
- **ABDM Discharge Summary Bundle**
- **SNOMED CT**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Subdirectories
- [`print/`](./print/): Sub-module or nested route.

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
