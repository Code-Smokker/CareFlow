# Pharmacy Reconciliation (`/pharmacy-lab/reconciliation`)

> **Location:** `src/app/pharmacy-lab/reconciliation`  
> **Route:** `/pharmacy-lab/reconciliation`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Pharmacist-led medication reconciliation tool comparing pre-admission regimens against acute inpatient pharmacotherapy.

## Clinical Context & Patient Safety
Validates drug interactions, catches accidental therapeutic duplications, and confirms continuation of essential chronic medications.

## Interoperability & Compliance Standards
- **Medication Safety Benchmarks**
- **FHIR MedicationStatement**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
