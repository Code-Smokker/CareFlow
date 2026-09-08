# Longitudinal Delta Diff · What Changed? (`/consultation-followup`)

> **Location:** `src/app/consultation-followup`  
> **Route:** `/consultation-followup`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
3-column comparative diff engine contrasting baseline encounter (14-Aug-2025) with current acute STEMI admission (18-Oct-2026) across vitals, symptoms, biomarkers, and medications.

## Clinical Context & Patient Safety
Instantly highlights acute clinical escalations (+16/+8 mmHg BP, +30 bpm HR, -7% SpO2, hs-cTnI surge from <0.01 to 1.42 ng/mL) for expedited decision-making.

## Interoperability & Compliance Standards
- **Longitudinal EHR Comparison**
- **SOAP Assessment & Plan Insertion**
- **Digital DSC Review Attestation**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
