# Access & Active Sessions Control Center (`/access-active-sessions`)

> **Location:** `src/app/access-active-sessions`  
> **Route:** `/access-active-sessions`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Hospital-wide live session monitor tracking workstations, mobile WOW carts, tablets, and IP subnets with instant session lockdown and FIDO2/biometric authentication auditing.

## Clinical Context & Patient Safety
Prevents unauthorized bedside terminal access, monitors clinical carts across ER/CCU/OPD, and enforces privileged access controls.

## Interoperability & Compliance Standards
- **FIDO2 / WebAuthn Hardware Tokens**
- **802.1X RADIUS VLAN Segregation**
- **HIPAA & NABH Access Control**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
