# Red-Flag Clinical Rule Builder (`/red-flag-rule-builder`)

> **Location:** `src/app/red-flag-rule-builder`  
> **Route:** `/red-flag-rule-builder`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
No-code visual rule builder and test harness for defining clinical safety triggers, vital threshold alerts, and automated protocol escalations.

## Clinical Context & Patient Safety
Empowers hospital medical safety committees to create and test deterministic alert rules without code deployments.

## Interoperability & Compliance Standards
- **Clinical Decision Support System (CDSS) Governance**
- **Deterministic Rule Bytecode Checksums**
- **FHIR PlanDefinition**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
