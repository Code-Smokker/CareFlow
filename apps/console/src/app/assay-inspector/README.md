# Clinical Assay Inspector (`/assay-inspector`)

> **Location:** `src/app/assay-inspector`  
> **Route:** `/assay-inspector`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Diagnostic assay review interface displaying specimen barcodes, calibration curves, reference ranges, and LIS analyzer raw telemetry data.

## Clinical Context & Patient Safety
High-sensitivity cardiac troponin I (hs-cTnI) and molecular diagnostic assay verification with analytical quality control curves.

## Interoperability & Compliance Standards
- **CLIA Quality Control**
- **LOINC 49563-0**
- **HL7 v2.5.1 LIS Interface**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
