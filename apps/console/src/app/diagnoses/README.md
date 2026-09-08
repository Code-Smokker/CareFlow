# Diagnoses & Multi-Coding Management (`/diagnoses`)

> **Location:** `src/app/diagnoses`  
> **Route:** `/diagnoses`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Dedicated view for indexing patient problems and mapping terms across ICD-10, ICD-11, SNOMED CT, and AYUSH terminologies.

## Clinical Context & Patient Safety
Ensures seamless clinical coding for insurance cashless claims, national registries, and inter-facility transfers.

## Interoperability & Compliance Standards
- **ICD-10-CM (I21.0)**
- **ICD-11 (BA41.0)**
- **SNOMED CT (57054005)**
- **NAMASTE AYUSH Portal**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
