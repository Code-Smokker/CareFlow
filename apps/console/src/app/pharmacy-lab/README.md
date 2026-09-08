# In-House Pharmacy & Lab Fulfillment (`/pharmacy-lab`)

> **Location:** `src/app/pharmacy-lab`  
> **Route:** `/pharmacy-lab`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Pharmacy dispensing console managing e-Prescription verification, barcode pill validation, inventory stock deducts, and generic brand substitution.

## Clinical Context & Patient Safety
Verification and rapid dispensing of STAT loading medications: Aspirin 325mg chewed, Ticagrelor 180mg, Atorvastatin 80mg, and IV Heparin 5000 IU.

## Interoperability & Compliance Standards
- **Five Rights of Medication Administration**
- **CDSCO Schedule H/X Drug Compliance**
- **GS1 Barcode Verification**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Subdirectories
- [`prescriptions/`](./prescriptions/): Sub-module or nested route.
- [`reconciliation/`](./reconciliation/): Sub-module or nested route.

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
