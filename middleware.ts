import { NextRequest, NextResponse } from "next/server";

// Define routes configuration
// Protected routes require authentication, public routes don't
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
   const authToken = req.cookies.get("auth_token");

   // If accessing a protected route without authentication, redirect to login
   if (isProtectedRoute && !authToken) {
      const url = new URL("/login", req.url);
      url.searchParams.set("from", path);
      return NextResponse.redirect(url);
   }

   // If accessing login/register while already authenticated, redirect to library
   if (isPublicRoute && authToken && path !== "/") {
      return NextResponse.redirect(new URL("/library", req.url));
   }

   // For all other cases, proceed normally
   return NextResponse.next();
}

export const config = {
   matcher: [
      // Match all paths except static files, images, and api routes
      "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api).*)",
   ],
};
