# Hospital Subsystem Bridges & Integration Logs (`/integration-logs`)

> **Location:** `src/app/integration-logs`  
> **Route:** `/integration-logs`  
> **Module Status:** Production Ready · 100% Type Safe · Google Stitch Compliant

## Overview
Monitoring console for 8 hospital subsystem bridges (PACS, LIS, Pharmacy, Central HIS, Whisper AI, SMS/WhatsApp, RADIUS, POCT) with latency metrics and live request logs.

## Clinical Context & Patient Safety
Ensures 99.9% uptime across critical telemetry connections, catheterization lab feeds, and pharmacy inventory databases.

## Interoperability & Compliance Standards
- **HL7 v2.5 / v3**
- **DICOM DIMSE Protocol**
- **WebSocket Low-Latency Streaming**
- **TCP/ICMP Synthetic Health Probes**

## Files in this Directory
| File | Purpose & Architecture |
| :--- | :--- |
| [`page.tsx`](./page.tsx) | Next.js App Router Page component implementing the full view, state management, and user interactions. |

## Architectural Guidelines
- **Styling**: Strictly uses Tailwind CSS with Google Stitch HSL color variables (`bg-surface`, `text-on-surface`, `bg-primary-container`, etc.). Ad-hoc hex codes are prohibited.
- **Typography**: Headings use Google Fonts `Inter`; clinical measurements, IDs, and timestamps use `JetBrains Mono`.
- **Print Optimization**: All printable elements leverage print media queries (`print:hidden`, `print:p-0`, `print:border-none`) for clean A4 paper output.
