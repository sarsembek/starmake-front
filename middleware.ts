import { NextRequest, NextResponse } from "next/server";
import Cookies from "js-cookie";

// Define public routes that do NOT require authentication
const publicRoutes = ["/login", "/register", "/"];

export async function middleware(req: NextRequest) {
   const path = req.nextUrl.pathname;
   const isPublicRoute = publicRoutes.includes(path);

   // Get authentication token from cookies
   const authToken = Cookies.get("auth_token");

   // If accessing a protected route (anything except public routes) and no token exists -> redirect to login
   if (!isPublicRoute && !authToken) {
      const url = new URL("/login", req.url);
      url.searchParams.set("from", path); // Store original URL for redirect after login
      return NextResponse.redirect(url);
   }

   // If accessing a public route while authenticated -> redirect to dashboard (or library)
   if (isPublicRoute && authToken) {
      return NextResponse.redirect(new URL("/library", req.url));
   }

   return NextResponse.next();
}

export const config = {
   matcher: "/:path*", // ✅ This applies the middleware to ALL routes
};
