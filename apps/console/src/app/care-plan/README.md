# Longitudinal Care Plan (`/care-plan`)

> **Location:** `src/app/care-plan`  
> **Route:** `/care-plan`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Multidisciplinary post-event care coordination interface tracking clinical milestones, lifestyle interventions, rehabilitation targets, and remote biometric thresholds.

## Clinical Context & Patient Safety
Post-myocardial infarction rehabilitation roadmap coordinating cardiac rehab, diabetic glycemic control, and secondary prevention pharmacotherapy.

## Interoperability & Compliance Standards
- **AHA Cardiac Rehabilitation Guidelines**
- **FHIR CarePlan Resource**
- **Remote Patient Monitoring (RPM) Thresholds**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
