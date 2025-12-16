import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware: redirect unauthenticated users to sign-in for protected routes
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow static files, next internals and API routes
  if (pathname.startsWith("/_next/") || pathname.startsWith("/api/") || pathname.startsWith("/static/")) {
    return NextResponse.next();
  }

  // Allow public auth pages
  if (pathname === "/sign-in" || pathname === "/sign-up") {
    return NextResponse.next();
  }

  // If no session cookie is present, redirect to sign-in
  const session = req.cookies.get("session")?.value;
  if (!session) {
    const signInUrl = req.nextUrl.clone();
    signInUrl.pathname = "/sign-in";
    // include original path so UI can redirect back after login
    signInUrl.search = `redirect=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

// Apply middleware only to root and interview pages (protected areas)
export const config = {
  matcher: ["/", "/interview/:path*"],
};
