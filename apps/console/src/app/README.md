# Next.js App Router Core (`src/app`)

> **Location:** `src/app`  
> **Route:** `/`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Root routing tree for all 57 clinical, diagnostic, inpatient, and governance screens. Manages the persistent layout shell, global design tokens (`globals.css`), and font definitions.

## Clinical Context & Patient Safety
Orchestrates all clinical workflows across Outpatient (OPD), Emergency Department (ED), Inpatient (IPD), Laboratory, Pharmacy, and Administrative Governance.

## Interoperability & Compliance Standards
- **Next.js App Router**
- **CSS Design Tokens**
- **Inter & JetBrains Mono Fonts**
- **Material Symbols Outlined**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`favicon.ico`](./favicon.ico) | Source file |
| [`globals.css`](./globals.css) | Master stylesheet defining HSL design tokens, typography, and custom scrollbar behavior. |
| [`layout.tsx`](./layout.tsx) | Next.js Root Layout shell wrapping children with Header, Sidebar, and print stylesheets. |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Subdirectories
- [`abdm-fhir-gateway/`](./abdm-fhir-gateway/): Sub-module or nested route.
- [`access-active-sessions/`](./access-active-sessions/): Sub-module or nested route.
- [`admissions-ipd/`](./admissions-ipd/): Sub-module or nested route.
- [`assay-inspector/`](./assay-inspector/): Sub-module or nested route.
- [`billing-payments/`](./billing-payments/): Sub-module or nested route.
- [`care-plan/`](./care-plan/): Sub-module or nested route.
- [`clinical-assistant/`](./clinical-assistant/): Sub-module or nested route.
- [`clinical-dossier/`](./clinical-dossier/): Sub-module or nested route.
- [`clinical-orders/`](./clinical-orders/): Sub-module or nested route.
- [`clinical-pathway/`](./clinical-pathway/): Sub-module or nested route.
- [`clinical-queue/`](./clinical-queue/): Sub-module or nested route.
- [`clinical-rules-protocols/`](./clinical-rules-protocols/): Sub-module or nested route.
- [`clinical-summary/`](./clinical-summary/): Sub-module or nested route.
- [`clinical-timeline/`](./clinical-timeline/): Sub-module or nested route.
- [`consultation-followup/`](./consultation-followup/): Sub-module or nested route.
- [`consultation-workspace/`](./consultation-workspace/): Sub-module or nested route.
- [`cpoe/`](./cpoe/): Sub-module or nested route.
- [`diagnoses/`](./diagnoses/): Sub-module or nested route.
- [`discharge-referrals/`](./discharge-referrals/): Sub-module or nested route.
- [`document-tray/`](./document-tray/): Sub-module or nested route.
- [`facility-integrations/`](./facility-integrations/): Sub-module or nested route.
- [`imaging/`](./imaging/): Sub-module or nested route.
- [`integration-logs/`](./integration-logs/): Sub-module or nested route.
- [`investigations/`](./investigations/): Sub-module or nested route.
- [`medical-history/`](./medical-history/): Sub-module or nested route.
- [`medication-reconciliation/`](./medication-reconciliation/): Sub-module or nested route.
- [`operations-command/`](./operations-command/): Sub-module or nested route.
- [`orders/`](./orders/): Sub-module or nested route.
- [`patient-detail/`](./patient-detail/): Sub-module or nested route.
- [`patient-overview/`](./patient-overview/): Sub-module or nested route.
- [`patient-registry/`](./patient-registry/): Sub-module or nested route.
- [`permission-matrix/`](./permission-matrix/): Sub-module or nested route.
- [`pharmacy/`](./pharmacy/): Sub-module or nested route.
- [`pharmacy-lab/`](./pharmacy-lab/): Sub-module or nested route.
- [`prescriptions/`](./prescriptions/): Sub-module or nested route.
- [`print-summary/`](./print-summary/): Sub-module or nested route.
- [`problems/`](./problems/): Sub-module or nested route.
- [`quality-audit-logs/`](./quality-audit-logs/): Sub-module or nested route.
- [`radiology/`](./radiology/): Sub-module or nested route.
- [`red-flag-rule-builder/`](./red-flag-rule-builder/): Sub-module or nested route.
- [`review-sign/`](./review-sign/): Sub-module or nested route.
- [`schedule-opd-slots/`](./schedule-opd-slots/): Sub-module or nested route.
- [`security-privacy-center/`](./security-privacy-center/): Sub-module or nested route.
- [`triage-command/`](./triage-command/): Sub-module or nested route.
- [`users-role-permissions/`](./users-role-permissions/): Sub-module or nested route.
- [`vitals-flowsheet/`](./vitals-flowsheet/): Sub-module or nested route.
- [`vitals-matrix/`](./vitals-matrix/): Sub-module or nested route.

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
