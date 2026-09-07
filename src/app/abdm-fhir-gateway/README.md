# ABDM & FHIR R4 Gateway Monitor (`/abdm-fhir-gateway`)

> **Location:** `src/app/abdm-fhir-gateway`  
> **Route:** `/abdm-fhir-gateway`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Real-time integration console for HAPI FHIR v6.8.0 server and Ayushman Bharat Digital Mission (ABDM) Milestone M1, M2, and M3 APIs. Features live ingestion/egress transaction queues and JSON bundle syntax inspector.

## Clinical Context & Patient Safety
Monitors national digital health backbone synchronization, patient ABHA address resolution, and cryptographic payload validation for clinical health records.

## Interoperability & Compliance Standards
- **ABDM Milestone M1 (ABHA Creation)**
- **ABDM Milestone M2 (Health Facility/Provider Registry)**
- **ABDM Milestone M3 (Consent & Data Exchange)**
- **FHIR R4 Composition, Observation, DiagnosticReport**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
