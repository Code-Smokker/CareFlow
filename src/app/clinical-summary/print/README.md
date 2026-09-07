# Printable Discharge Summary & ABHA Export (`/clinical-summary/print`)

> **Location:** `src/app/clinical-summary/print`  
> **Route:** `/clinical-summary/print`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
A4 print-optimized hospital discharge summary with print stylesheets, hospital letterhead, ICD-10 coding, verifiable ABDM QR token, and Class 3 DSC digital attestation stamp.

## Clinical Context & Patient Safety
Formal patient discharge document providing legible home instructions, emergency red-flag warning signs, verifiable QR code, and legal medical DSC signing.

## Interoperability & Compliance Standards
- **W3C Paged Media Print Stylesheet**
- **ABDM FHIR DiagnosticReport / Composition**
- **e-Mudhra Class 3 DSC Digital Signing**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
