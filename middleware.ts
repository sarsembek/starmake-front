import { NextRequest, NextResponse } from "next/server";

// Define public routes that do NOT require authentication
const publicRoutes = ["/login", "/register", "/"];

export function middleware(req: NextRequest) {
   const path = req.nextUrl.pathname;
   const isPublicRoute = publicRoutes.some(
      (route) => path === route || path.startsWith(`${route}/`)
   );

   // Get authentication token from cookies using server-side API
   const authToken = req.cookies.get("auth_token");

   // If accessing a protected route and no token exists -> redirect to login
   if (!isPublicRoute && !authToken) {
      // Create redirect URL with special flag for history handling
      const url = new URL("/login", req.url);
      url.searchParams.set("from", path);
      url.searchParams.set("nohistory", "true"); // Add this flag for client-side detection

      // Create response with redirect
      const response = NextResponse.redirect(url);

      // Set a cookie to indicate this was a protected route redirect
      // This helps us track that we came from a redirect rather than direct navigation
      response.cookies.set("redirect_from_protected", "true", {
         maxAge: 60, // Short lived - just for the redirect
         path: "/",
      });

      return response;
   }

   // For public routes, clear the redirect cookie
   if (isPublicRoute) {
      const response = NextResponse.next();
      response.cookies.delete("redirect_from_protected");
      return response;
   }

   // For all other cases, proceed normally
   return NextResponse.next();
}

export const config = {
   matcher: [
      /*
       * Match all request paths except:
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico (favicon file)
       * - public files (images, etc.)
       */
      "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
   ],
};
