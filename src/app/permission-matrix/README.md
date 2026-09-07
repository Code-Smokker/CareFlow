# Enterprise Roles & Permissions Matrix (`/permission-matrix`)

> **Location:** `src/app/permission-matrix`  
> **Route:** `/permission-matrix`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Full-screen interactive RBAC governance matrix mapping 8 hospital clinical/admin roles against 16 granular permissions across four clinical domains.

## Clinical Context & Patient Safety
Governs privileged actions (e.g. Break-Glass Emergency Chart Access, Schedule H/X Narcotic Orders, Digital Signing) across consultants, residents, nurses, and pharmacists.

## Interoperability & Compliance Standards
- **Role-Based Access Control (RBAC)**
- **Privileged Access Management (PAM)**
- **NABH Hospital Governance**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
