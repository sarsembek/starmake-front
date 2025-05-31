"use client";

import { ReactNode } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

/**
 * Layout for the library page to add authentication protection
 */
export default function LibraryLayout({ children }: { children: ReactNode }) {
   return (
      <AuthGuard
         fallback={
            <div className="flex items-center justify-center min-h-screen">
               <LoadingSpinner size="lg" />
            </div>
         }
      >
         {children}
      </AuthGuard>
   );
}
