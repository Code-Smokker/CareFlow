# Encounter Discharge & Referral Case File (`/discharge-referrals/[id]`)

> **Location:** `src/app/discharge-referrals/[id]`  
> **Route:** `/discharge-referrals/[id]`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Detailed discharge dossier for individual patient encounters with transport handover checklists, transition summaries, and e-KYC/ABDM sharing status.

## Clinical Context & Patient Safety
Case-level handover file ensuring continuity of care, paramedical handover, and verified consent for external health data exchange.

## Interoperability & Compliance Standards
- **FHIR Composition (TransferSummary)**
- **ABDM Consent Artefact Verification**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
