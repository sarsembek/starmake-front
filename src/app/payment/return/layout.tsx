"use client";

import { ReactNode } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function PaymentLayout({ children }: { children: ReactNode }) {
   return (
      <AuthGuard
         fallback={
            <div className="flex items-center justify-center min-h-screen">
               <LoadingSpinner size="lg" />
            </div>
         }
      >
         <div className="flex flex-col min-h-screen">{children}</div>
      </AuthGuard>
   );
}
