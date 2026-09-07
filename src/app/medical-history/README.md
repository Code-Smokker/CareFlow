# Longitudinal Medical History (`/medical-history`)

> **Location:** `src/app/medical-history`  
> **Route:** `/medical-history`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Deep-dive clinical history dossier organizing past cardiovascular events, surgical procedures, chronic risk factors, immunization records, and family pedigree.

## Clinical Context & Patient Safety
Records 8-year history of Type 2 Diabetes Mellitus, Essential Hypertension, and premature coronary artery disease in first-degree relatives.

## Interoperability & Compliance Standards
- **FHIR FamilyMemberHistory**
- **FHIR Condition / PastMedicalHistory**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
