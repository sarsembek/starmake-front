"use client";

import { Suspense } from "react";
import "../globals.css";
import { Loader2 } from "lucide-react";

export default function AuthLayout({
   children,
}: {
   children: React.ReactNode;
}) {



   return (
      <Suspense fallback={
         <div className="flex min-h-screen items-center justify-center">
            <div className="flex flex-col items-center gap-2">
               <Loader2 className="h-8 w-8 animate-spin text-primary" />
               <p className="text-muted-foreground">Загрузка...</p>
            </div>
         </div>
      }>
         {children}
      </Suspense>
   )
}
