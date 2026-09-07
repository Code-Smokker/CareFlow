# Quality Audit & Compliance Ledger (`/quality-audit-logs`)

> **Location:** `src/app/quality-audit-logs`  
> **Route:** `/quality-audit-logs`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Tamper-evident audit trail logging all clinical chart views, break-glass emergency accesses, medication modifications, and DSC signature events.

## Clinical Context & Patient Safety
Maintains an unalterable SHA-256 digital forensic trail of every clinical touchpoint in compliance with medico-legal requirements.

## Interoperability & Compliance Standards
- **India DPDP Act 2023 Forensic Audit Requirements**
- **FHIR AuditEvent Resource**
- **SHA-256 Ledger Verification**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
