# Clinical Queue & Triage Command (`/clinical-queue`)

> **Location:** `src/app/clinical-queue`  
> **Route:** `/clinical-queue`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
High-throughput Emergency and Outpatient triage roster sorting patients by Emergency Severity Index (ESI 1-5), wait-time milestones, and attending assignments.

## Clinical Context & Patient Safety
Real-time command center managing acute patient flows, flagging P1 STAT red flags, and synchronizing triage nurses with attending emergency physicians.

## Interoperability & Compliance Standards
- **Emergency Severity Index (ESI v4)**
- **National Triage Guidelines**
- **FHIR Encounter Roster**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
