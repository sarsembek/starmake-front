"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface AuthGuardProps {
   children: ReactNode;
   fallback?: ReactNode;
}

/**
 * Client-side auth guard component that ensures a user is authenticated
 * before showing protected content
 */
export function AuthGuard({ children, fallback }: AuthGuardProps) {
   const { isAuthenticated, isLoading, refreshProtectedRoutes } = useAuth();
   const router = useRouter();

   useEffect(() => {
      // If we're not loading anymore and the user is not authenticated, redirect to login
      if (!isLoading && !isAuthenticated) {
         // Store the current path for redirection after login
         const currentPath = window.location.pathname;
         localStorage.setItem("returnPath", currentPath);

         // Redirect to login page
         router.push(`/login?from=${encodeURIComponent(currentPath)}`);
      } else if (!isLoading && isAuthenticated) {
         // If authenticated, ensure the page is refreshed with the token
         refreshProtectedRoutes();
      }
   }, [isAuthenticated, isLoading, router, refreshProtectedRoutes]);

   // While loading, show nothing or a fallback UI
   if (isLoading) {
      return fallback ? <>{fallback}</> : null;
   }

   // When authenticated, show the protected content
   return isAuthenticated ? <>{children}</> : null;
}
