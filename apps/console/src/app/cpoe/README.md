# Computerized Physician Order Entry (`/cpoe`)

> **Location:** `src/app/cpoe`  
> **Route:** `/cpoe`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Comprehensive order entry workspace for medications, intravenous infusions, diagnostic labs, and radiology with instant allergy/DDI conflict detection.

## Clinical Context & Patient Safety
STAT CPOE order dispatch during emergency resuscitation, including DAPT loading doses, IV heparin boluses, and Cath lab pre-op packages.

## Interoperability & Compliance Standards
- **CPOE Safety Benchmarks**
- **Allergy Hard-Stop Interlocks**
- **FHIR MedicationRequest**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
