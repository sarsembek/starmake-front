"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import "../globals.css";

export default function AuthLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   const { isAuthenticated } = useAuth();
   const router = useRouter();
   const [checking, setChecking] = useState(true);

   useEffect(() => {
      // Short delay to ensure auth state is loaded
      const timer = setTimeout(() => {
         setChecking(false);

         if (isAuthenticated) {
            console.log(
               "Auth layout detected authenticated user, redirecting to home"
            );
            router.replace("/");
         }
      }, 200);

      return () => clearTimeout(timer);
   }, [isAuthenticated, router]);

   // Show nothing during initial check to prevent flash
   if (checking || isAuthenticated) {
      return null;
   }

   return children;
}
