# Consultation Workspace Follow-up Alias (`/consultation-workspace/followup`)

> **Location:** `src/app/consultation-workspace/followup`  
> **Route:** `/consultation-workspace/followup`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Nested route alias providing direct access to the Longitudinal Delta Diff comparison engine from within the consultation workflow.

## Clinical Context & Patient Safety
Allows physicians to inspect historical delta comparison without losing active consultation state.

## Interoperability & Compliance Standards
- **Next.js Clean Route Re-export**
- **EHR Workflow Continuity**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
