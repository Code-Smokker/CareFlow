# Clinical Document Tray & Scanner (`/document-tray`)

> **Location:** `src/app/document-tray`  
> **Route:** `/document-tray`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Central repository for scanned referral letters, lab report PDFs, consent forms, and physical records with OCR text extraction and FHIR document attachment.

## Clinical Context & Patient Safety
Ingests historical paper records, physical ECG printouts, and external hospital slips into the digital EHR chart.

## Interoperability & Compliance Standards
- **Optical Character Recognition (OCR)**
- **FHIR DocumentReference**
- **PDF/A Archival Format**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
