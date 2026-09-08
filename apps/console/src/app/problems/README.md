# Problems & Multi-Terminology Coding (`/problems`)

> **Location:** `src/app/problems`  
> **Route:** `/problems`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Comprehensive problem list manager with real-time term disambiguation across ICD-10, ICD-11, SNOMED CT, and AYUSH medical vocabularies.

## Clinical Context & Patient Safety
Accurately catalogs acute STEMI (ICD-10 I21.0), essential hypertension (I10), and type 2 diabetes mellitus (E11.9) with onset timelines.

## Interoperability & Compliance Standards
- **ICD-10-CM / ICD-11 Multi-Coding**
- **SNOMED CT International Edition**
- **FHIR Condition Resource**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
