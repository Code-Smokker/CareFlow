# OPD Consultation & AI Scribe Workspace (`/consultation-workspace`)

> **Location:** `src/app/consultation-workspace`  
> **Route:** `/consultation-workspace`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Primary physician consultation desk with ambient voice transcription, structured SOAP documentation, real-time CDSS recommendations, and prescription generation.

## Clinical Context & Patient Safety
Interactive consultation room used by Dr. Rohit Verma to examine patients, review ambient clinical transcriptions, and formulate assessment plans.

## Interoperability & Compliance Standards
- **SOAP Note Structure**
- **Ambient Medical Scribe Integration**
- **FHIR Encounter & ClinicalImpression**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Subdirectories
- [`followup/`](./followup/): Sub-module or nested route.
- [`review-sign/`](./review-sign/): Sub-module or nested route.

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
