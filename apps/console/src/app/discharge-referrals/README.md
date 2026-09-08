# Discharge & Inter-Facility Referrals Command (`/discharge-referrals`)

> **Location:** `src/app/discharge-referrals`  
> **Route:** `/discharge-referrals`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Hospital discharge pipeline tracking pending discharge clearances, cashless insurance pre-auth, ambulance dispatch, and tertiary care facility transfer coordination.

## Clinical Context & Patient Safety
Monitors 3-hour discharge completion SLA, pharmacy discharge medication dispatch, and ALS ambulance coordination for tertiary dialysis transfers.

## Interoperability & Compliance Standards
- **NABH Discharge SLA (<180 min)**
- **Inter-Facility Handover Protocol**
- **ABDM Health Information Provider (HIP)**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Subdirectories
- [`[id]/`](./[id]/): Sub-module or nested route.

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
