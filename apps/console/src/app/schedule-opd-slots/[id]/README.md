# Appointment Encounter Specifications (`/schedule-opd-slots/[id]`)

> **Location:** `src/app/schedule-opd-slots/[id]`  
> **Route:** `/schedule-opd-slots/[id]`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Tactical encounter specification view detailing appointment lifecycle milestones, triage telemetry, conflict mitigation, and room assignments.

## Clinical Context & Patient Safety
Encounter detail for Appointment #APT-2024-99182 (Rahul Sharma) showing transition from scheduled consultation to emergency Code STEMI.

## Interoperability & Compliance Standards
- **FHIR Encounter Lifecycle**
- **Emergency Escalation Handover**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
