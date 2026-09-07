# Hospital Operations Command Center (`/operations-command`)

> **Location:** `src/app/operations-command`  
> **Route:** `/operations-command`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Executive dashboard tracking facility census, bed occupancy, emergency department throughput, operating theater utilization, and ambulance fleets.

## Clinical Context & Patient Safety
Macro-level command center for hospital medical directors and nursing supervisors to manage bed capacity and emergency influx.

## Interoperability & Compliance Standards
- **Hospital Incident Command System (HICS)**
- **Bed Management KPIs**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
