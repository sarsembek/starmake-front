import { NextRequest, NextResponse } from "next/server";

// Define public routes that do NOT require authentication
const publicRoutes = ["/login", "/register", "/"];

export async function middleware(req: NextRequest) {
   const path = req.nextUrl.pathname;
   const isPublicRoute = publicRoutes.some(
      (route) => path === route || path.startsWith(`${route}/`)
   );

   // Get authentication token from cookies using server-side API
   const authToken = req.cookies.get("auth_token");

   // If accessing a protected route and no token exists -> redirect to login
   if (!isPublicRoute && !authToken) {
      const url = new URL("/login", req.url);
      url.searchParams.set("from", path); // Store original URL for redirect after login
      return NextResponse.redirect(url);
   }

   // If accessing a public route while authenticated -> redirect to library
   if (isPublicRoute && authToken) {
      return NextResponse.redirect(new URL("/library", req.url));
   }

   // Handle API requests to track 401 responses
   const response = NextResponse.next();
   return track401Response(req, response);
}

// Function to track 401 responses and redirect users
async function track401Response(req: NextRequest, response: Response) {
   if (response.status === 401) {
      const url = new URL("/login", req.url);
      url.searchParams.set("from", req.nextUrl.pathname); // Store original URL
      return NextResponse.redirect(url);
   }
   return response;
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
