# User Directory & Access Control (`/users-role-permissions`)

> **Location:** `src/app/users-role-permissions`  
> **Route:** `/users-role-permissions`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Hospital staff directory managing clinician credentials, biometric MFA enrollment, department assignments, and privileged access tokens.

## Clinical Context & Patient Safety
Maintains verified profiles of attending cardiologists (Dr. Rohit Verma), residents, triage nurses, and pharmacists.

## Interoperability & Compliance Standards
- **ABDM Healthcare Professionals Registry (HPR)**
- **NMC Registration Verification**
- **FIDO2 WebAuthn Management**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Subdirectories
- [`[id]/`](./[id]/): Sub-module or nested route.

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
