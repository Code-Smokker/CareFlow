# CareFlow AI Clinical Assistant & Evidence Dock (`/clinical-assistant`)

> **Location:** `src/app/clinical-assistant`  
> **Route:** `/clinical-assistant`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
3-pane multimodal clinical copilot grounded in 2024 ACC/AHA STEMI guidelines, UpToDate synthesis, and patient-specific EHR parameters with strict deterministic safety guarantees.

## Clinical Context & Patient Safety
Assists clinicians with acute reperfusion pathway verification, DAPT dose calculations, contrast nephropathy risk scoring, and antibiotic alternatives for severe penicillin allergy.

## Interoperability & Compliance Standards
- **2024 ACC/AHA STEMI Reperfusion Guidelines**
- **Class IIb Medical Device Decision Support (CDSS)**
- **FHIR ClinicalImpression & GuidanceResponse**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
