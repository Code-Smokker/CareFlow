# User Profile & Security Dossier (`/users-role-permissions/[id]`)

> **Location:** `src/app/users-role-permissions/[id]`  
> **Route:** `/users-role-permissions/[id]`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Granular user detail view displaying hardware token bindings (YubiKey), active session counts, permission scopes, and role audit history.

## Clinical Context & Patient Safety
Security dossier for Dr. Rohit Verma (Consultant Interventional Cardiologist, MCI-2011-8921) with one-click MFA token unbinding and emergency revocation.

## Interoperability & Compliance Standards
- **Privileged Access Security**
- **Hardware Security Key (FIDO2/U2F)**
- **Audit Logging**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
