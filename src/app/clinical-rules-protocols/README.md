# Clinical Decision Support (CDSS) Rule Engine (`/clinical-rules-protocols`)

> **Location:** `src/app/clinical-rules-protocols`  
> **Route:** `/clinical-rules-protocols`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Governance catalog of active hospital alert triggers, drug-drug interaction matrix, contraindication hard-stops, and institutional clinical protocols.

## Clinical Context & Patient Safety
Institutional safety rules enforcing hard-stops on penicillin administration, automated troponin elevation triggers, and contrast-induced nephropathy warnings.

## Interoperability & Compliance Standards
- **FHIR ActivityDefinition**
- **Clinical Quality Language (CQL)**
- **NABH Medication Safety Directives**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
