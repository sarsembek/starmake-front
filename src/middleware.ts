import { NextRequest, NextResponse } from "next/server";

// Define routes configuration
const publicRoutes = ["/login", "/register", "/"];

export function middleware(req: NextRequest) {
   const path = req.nextUrl.pathname;

   console.log(`[Middleware] Executing for path: ${path}`);

   // Check if current path is public
   const isPublicRoute = publicRoutes.some(
      (route) => path === route || path.startsWith(`${route}/`)
   );

   // Get authentication token from cookies (just for redirects on public routes)
   // We don't want to protect routes here since we're using AuthGuard for that
   const accessToken = req.cookies.get("access_token")?.value;

   console.log(`[Middleware] Path: ${path}, Token exists: ${!!accessToken}`);

   // If accessing login/register while already authenticated, redirect to library
   if (isPublicRoute && accessToken && path !== "/") {
      console.log(`[Middleware] Redirecting authenticated user to library`);
      return NextResponse.redirect(new URL("/library", req.url));
   }

   // For all other cases, allow AuthGuard components to handle authentication status
   return NextResponse.next();
}

export const config = {
   matcher: [
      // Only run middleware on specific paths that need redirection from public to protected routes
      "/login",
      "/register",
   ],
};
