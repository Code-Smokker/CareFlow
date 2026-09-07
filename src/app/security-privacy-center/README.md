# Security, Privacy & Compliance Center (`/security-privacy-center`)

> **Location:** `src/app/security-privacy-center`  
> **Route:** `/security-privacy-center`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Governance console monitoring India DPDP Act 2023 compliance, AES-256 CloudHSM encryption, ABHA electronic consent ledgers, and PII redaction engines.

## Clinical Context & Patient Safety
Protects sensitive personal health data (SPHD), manages patient consent withdrawals, and validates automated redaction of Aadhaar and contact numbers.

## Interoperability & Compliance Standards
- **Digital Personal Data Protection (DPDP) Act 2023**
- **FIPS 140-2 Level 3 CloudHSM Key Management**
- **ABDM Electronic Consent Framework**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
