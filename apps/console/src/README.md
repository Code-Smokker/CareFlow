# Source Code Root (`src`)

> **Location:** `src`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Contains the application core source code, including the Next.js App Router route tree (`app`), reusable clinical UI components and layout shells (`components`).

## Clinical Context & Patient Safety
Central codebase orchestration housing all UI views, business logic, state models, and design tokens for the CareFlow Clinical Workspace.

## Interoperability & Compliance Standards
- **Next.js 16 App Router**
- **React 19 Server & Client Components**
- **TypeScript Strict Mode**

## Files in this Directory
*No standalone files in this directory root (see subdirectories).*

## Subdirectories
- [`app/`](./app/): Sub-module or nested route.
- [`components/`](./components/): Sub-module or nested route.

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
