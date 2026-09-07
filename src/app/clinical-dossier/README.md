# Patient Longitudinal Clinical Dossier (`/clinical-dossier`)

> **Location:** `src/app/clinical-dossier`  
> **Route:** `/clinical-dossier`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Synthesized lifelong medical record indexing past hospital admissions, surgical operative notes, historical discharge summaries, and family genetic pedigrees.

## Clinical Context & Patient Safety
Complete medical chronology of Rahul Sharma (42M) tracing past hypertensive episodes, lipid panels, and previous OPD encounters.

## Interoperability & Compliance Standards
- **FHIR Patient, EpisodeOfCare, and Composition**
- **ABDM CareConnect Profile v1.2**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
