# Prescription Queue (`/pharmacy-lab/prescriptions`)

> **Location:** `src/app/pharmacy-lab/prescriptions`  
> **Route:** `/pharmacy-lab/prescriptions`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Dedicated pharmacy dispensing queue for reviewing, compounding, and dispensing outpatient and inpatient prescription orders.

## Clinical Context & Patient Safety
Worklist for registered pharmacists to inspect physician prescriptions, verify renal/hepatic dosing, and clear orders for dispensing.

## Interoperability & Compliance Standards
- **Good Pharmacy Practice (GPP)**
- **FHIR MedicationDispense**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
