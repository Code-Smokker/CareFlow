# Interactive Longitudinal Clinical Timeline (`/clinical-timeline`)

> **Location:** `src/app/clinical-timeline`  
> **Route:** `/clinical-timeline`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Chronological multi-track event horizon visualizing encounters, lab draws, imaging studies, and medication changes over time with zoom and filter controls.

## Clinical Context & Patient Safety
Visualizes the clinical trajectory of Rahul Sharma from baseline 2024 wellness to acute 2026 cardiac event.

## Interoperability & Compliance Standards
- **Longitudinal Health Record Visualization**
- **FHIR Observation Timeline**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
