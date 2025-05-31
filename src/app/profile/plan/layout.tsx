"use client";

import { ReactNode } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

/**
 * Layout for the profile/plan page with authentication protection
 */
export default function PlanLayout({ children }: { children: ReactNode }) {
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
