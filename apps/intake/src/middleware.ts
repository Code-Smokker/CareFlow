import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

/**
 * Patients never log in (CLAUDE.md: the QR session link opens with no auth), so the patient
 * routes — `/` (check-in), `/s/*` (the session) and `/api/*` (voice / fill-slot relays) — are not
 * matched at all: no Supabase call sits in their request path, and a dead network or missing
 * Supabase env cannot take an intake down (rule 9).
 *
 * Anything else that might one day be a staff-only route still gets its Supabase session
 * refreshed, and even then this can only fail open: it never redirects and never throws.
 */
export async function middleware(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return NextResponse.next();
  try {
    return await updateSession(request);
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // Not: "/" · "/s/…" · "/api/…" · Next internals · files with an extension (icons, images, fonts).
    "/((?!$|s/|api/|_next/|favicon.ico|.*\\..*).*)",
  ],
};
