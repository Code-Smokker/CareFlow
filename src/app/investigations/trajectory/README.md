# Biomarker Longitudinal Trajectory (`/investigations/trajectory`)

> **Location:** `src/app/investigations/trajectory`  
> **Route:** `/investigations/trajectory`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Interactive SVG trajectory graph plotting serial lab values (e.g. HbA1c, hs-cTnI) over time with fasting timestamps, specimen barcodes, and LIS provenance chains.

## Clinical Context & Patient Safety
Visualizes progression of glycemic deterioration and acute biomarker spike to correlate chronic disease with acute coronary events.

## Interoperability & Compliance Standards
- **Serial Biomarker Trend Analysis**
- **HL7 Specimen Provenance Chain**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
