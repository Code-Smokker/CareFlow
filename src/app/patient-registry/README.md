# Enterprise Master Patient Index & Registry (`/patient-registry`)

> **Location:** `src/app/patient-registry`  
> **Route:** `/patient-registry`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Central patient registry featuring ABHA token creation, biometrics matching, demographic search, duplicate record merging, and face sheet generation.

## Clinical Context & Patient Safety
Provides hospital-wide unique patient identification (UHID DEL-2024-8841), linking government Ayushman Bharat Health Accounts (ABHA).

## Interoperability & Compliance Standards
- **Master Patient Index (MPI)**
- **ABDM Milestone M1 (ABHA Verification)**
- **FHIR Patient Demographics**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
