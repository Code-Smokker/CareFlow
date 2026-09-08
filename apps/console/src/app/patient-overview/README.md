# Longitudinal Patient Overview (`/patient-overview`)

> **Location:** `src/app/patient-overview`  
> **Route:** `/patient-overview`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Enterprise clinical operating system workspace synthesizing real-time telemetry, active problems, current medications, recent diagnostics, and care pathways into an interactive canvas.

## Clinical Context & Patient Safety
The central nerve center for Rahul Sharma (42M, Code STEMI). Combines vital sign trends, ECG telemetry, active diagnoses, CPOE shortcuts, and care team collaboration.

## Interoperability & Compliance Standards
- **Enterprise EHR Information Architecture**
- **High-Density Clinical UX**
- **FHIR Patient Resource Ecosystem**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
