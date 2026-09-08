# Diagnostic Orders Hub (`/orders`)

> **Location:** `src/app/orders`  
> **Route:** `/orders`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Full-screen orders management console tracking status of laboratory requests, urgent STAT radiology, and nursing procedures.

## Clinical Context & Patient Safety
Live dispatch board for phlebotomy draws, point-of-care troponin testing, and portable bedside chest X-rays.

## Interoperability & Compliance Standards
- **FHIR ServiceRequest**
- **HL7 Order Status Tracking**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
