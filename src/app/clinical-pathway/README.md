# Clinical Pathway Engine (`/clinical-pathway`)

> **Location:** `src/app/clinical-pathway`  
> **Route:** `/clinical-pathway`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Standardized clinical practice guideline (CPG) execution engine mapping acute STEMI timelines, reperfusion checklists, and post-angioplasty telemetry protocols.

## Clinical Context & Patient Safety
Ensures adherence to the <90 minute Door-to-Balloon national cardiac quality benchmark with automated phase triggers and checklist verification.

## Interoperability & Compliance Standards
- **ACC/AHA STEMI Performance Measures**
- **Clinical Practice Guidelines (CPG)**
- **FHIR PlanDefinition**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
