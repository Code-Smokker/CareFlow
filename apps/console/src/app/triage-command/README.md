# Triage Command Center (`/triage-command`)

> **Location:** `src/app/triage-command`  
> **Route:** `/triage-command`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Emergency Department triage command hub orchestrating red-flag STEMI protocol activations, ambulance telemetry feeds, and bay allocations.

## Clinical Context & Patient Safety
Immediate intake and risk stratification of walk-in and ambulance emergencies, triggering instant Code STEMI paging to catheterization teams.

## Interoperability & Compliance Standards
- **AHA Code STEMI Protocol**
- **Emergency Severity Index (ESI)**
- **FHIR Encounter (Emergency)**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
