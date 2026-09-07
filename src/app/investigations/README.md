# Laboratory Investigations Hub (`/investigations`)

> **Location:** `src/app/investigations`  
> **Route:** `/investigations`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Comprehensive laboratory results table organizing hematology, biochemistry, cardiac biomarkers, and microbiology panels with reference ranges and abnormal flags.

## Clinical Context & Patient Safety
Instant access to critical biomarkers: high-sensitivity Troponin I (1.42 ng/mL STAT), HbA1c (7.8%), serum creatinine (0.92 mg/dL), and lipid panels.

## Interoperability & Compliance Standards
- **LOINC Clinical Coding**
- **HL7 v2.5 ORU Results**
- **FHIR DiagnosticReport & Observation**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Subdirectories
- [`trajectory/`](./trajectory/): Sub-module or nested route.

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
