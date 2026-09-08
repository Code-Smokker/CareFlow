# Schedule & OPD Capacity Roster (`/schedule-opd-slots`)

> **Location:** `src/app/schedule-opd-slots`  
> **Route:** `/schedule-opd-slots`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Live OPD outpatient appointment roster managing clinician schedules, room allocations, overbooking slots, and check-in lounge statuses.

## Clinical Context & Patient Safety
High-density scheduling engine for Cardiology, General Medicine, and Specialty OPDs with live Door-to-Balloon integration for emergency arrivals.

## Interoperability & Compliance Standards
- **HL7 Scheduling (SIU)**
- **FHIR Appointment & Slot Resources**
- **OPD Wait-Time Metrics**

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
