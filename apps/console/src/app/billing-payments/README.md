# Billing & TPA Cashless Settlements (`/billing-payments`)

> **Location:** `src/app/billing-payments`  
> **Route:** `/billing-payments`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Hospital financial management desk for IPD/OPD billing, GIPSA/PMJAY tariff schedules, real-time cashless TPA pre-authorizations, and itemized invoice generation.

## Clinical Context & Patient Safety
Automated insurance pre-authorization and settlement for cardiac catheterization and stent placement (ICICI Lombard Cashless ₹4,50,000 approved).

## Interoperability & Compliance Standards
- **GIPSA PPN Tariff Schedules**
- **Ayushman Bharat PMJAY Integration**
- **FHIR Coverage & Claim Resources**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
