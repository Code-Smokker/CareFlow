# Medication Reconciliation Hub (`/medication-reconciliation`)

> **Location:** `src/app/medication-reconciliation`  
> **Route:** `/medication-reconciliation`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Admission and transfer medication reconciliation engine resolving discrepancies between home medications, inpatient orders, and discharge prescriptions.

## Clinical Context & Patient Safety
Enforces safety holds on Metformin (lactic acidosis risk during contrast angiography) and Telmisartan (hypotension during acute reperfusion).

## Interoperability & Compliance Standards
- **The Joint Commission NPSG.03.06.01**
- **Medication Reconciliation Best Practices**
- **FHIR MedicationStatement & MedicationRequest**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
