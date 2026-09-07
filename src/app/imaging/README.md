# Radiology & Diagnostic Imaging Hub (`/imaging`)

> **Location:** `src/app/imaging`  
> **Route:** `/imaging`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
PACS imaging viewer showing 12-lead ECG strips, multi-view coronary angiograms, echocardiograms, and chest radiographs with measurement tools.

## Clinical Context & Patient Safety
Evaluates STEMI severity via acute LAD occlusion visual angiograms, 12-lead ECG ST elevations (+3.2mm in V2-V4), and left ventricular ejection fraction (LVEF 42%).

## Interoperability & Compliance Standards
- **DICOM PS3.0 Standard**
- **DICOMweb WADO-RS / QIDO-RS**
- **FHIR ImagingStudy Resource**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
