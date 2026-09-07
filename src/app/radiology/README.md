# Radiology Subsystem Alias (`/radiology`)

> **Location:** `src/app/radiology`  
> **Route:** `/radiology`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Direct route alias linking directly to the PACS diagnostic imaging viewer.

## Clinical Context & Patient Safety
Quick navigation shortcut for radiologists and cardiologists reviewing imaging studies.

## Interoperability & Compliance Standards
- **Next.js Route Alias**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
