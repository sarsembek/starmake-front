import { NextRequest, NextResponse } from "next/server";

// Define routes configuration
const protectedRoutes = ["/library", "/dashboard", "/profile"];
const publicRoutes = ["/login", "/register", "/"];

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );
  
  // Check if current path is public
  const isPublicRoute = publicRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );

  // Get authentication token from cookies
  const authToken = req.cookies.get("auth_token")?.value;
  
  console.log(`[Middleware] Path: ${path}, Token exists: ${!!authToken}`);
  
  // If accessing a protected route without authentication, redirect to login
  if (isProtectedRoute && !authToken) {
    console.log(`[Middleware] Redirecting to login from ${path}`);
    const url = new URL("/login", req.url);
    url.searchParams.set("from", path);
    return NextResponse.redirect(url);
  }

  // If accessing login/register while already authenticated, redirect to library
  if (isPublicRoute && authToken && path !== "/") {
    console.log(`[Middleware] Redirecting authenticated user to library`);
    return NextResponse.redirect(new URL("/library", req.url));
  }

  return NextResponse.next();
}

export const config = {
  // This ensures the middleware runs for all routes except static assets
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images, etc)
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|public/|api/).*)',
  ],
};