# Clinical Orders & Diagnostic Scheduling (`/clinical-orders`)

> **Location:** `src/app/clinical-orders`  
> **Route:** `/clinical-orders`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Centralized order entry hub for laboratory draws, urgent radiology requests, point-of-care diagnostics, and inter-departmental specialty consultations.

## Clinical Context & Patient Safety
STAT order management during acute admissions, tracking blood draws, bedside ECGs, and priority catheterization lab bookings.

## Interoperability & Compliance Standards
- **CPOE Standards**
- **FHIR ServiceRequest**
- **HL7 Order Entry (ORM)**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
