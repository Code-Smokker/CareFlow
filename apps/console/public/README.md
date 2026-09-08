# Public Static Assets

> **Location:** `public`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Houses static assets, hospital branding iconography, vector badges, favicon, and robots.txt served directly by Next.js at the root path.

## Clinical Context & Patient Safety
Static clinical iconography, medical certification badges, and default media for EHR displays.

## Interoperability & Compliance Standards
- **Web Standards**
- **SVG 2.0 Vector Graphics**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`file.svg`](./file.svg) | Source file |
| [`globe.svg`](./globe.svg) | Source file |
| [`next.svg`](./next.svg) | Source file |
| [`vercel.svg`](./vercel.svg) | Source file |
| [`window.svg`](./window.svg) | Source file |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
