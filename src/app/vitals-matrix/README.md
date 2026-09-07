# Vitals Matrix (`/vitals-matrix`)

> **Location:** `src/app/vitals-matrix`  
> **Route:** `/vitals-matrix`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
High-density hemodynamic matrix contrasting historical baselines against live ICU/CCU telemetry feeds.

## Clinical Context & Patient Safety
Hemodynamic trend matrix correlating heart rate spikes with troponin release and ECG morphology.

## Interoperability & Compliance Standards
- **Intensive Care Hemodynamic Telemetry**
- **LOINC Vitals Panel**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
