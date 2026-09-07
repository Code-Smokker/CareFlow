# Encounter Review & Attestation (`/consultation-workspace/review-sign`)

> **Location:** `src/app/consultation-workspace/review-sign`  
> **Route:** `/consultation-workspace/review-sign`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Final encounter signing stage verifying diagnosis coding, e-Prescription orders, and digital cryptographic doctor attestation.

## Clinical Context & Patient Safety
Attending review checkpoint ensuring complete coding (ICD-10, SNOMED) before signing with medical DSC token.

## Interoperability & Compliance Standards
- **India Information Technology Act Section 3 (DSC)**
- **MCI Registration Verification**
- **FHIR Provenance**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
