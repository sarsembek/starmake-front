"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
   PaymentStatusHandler,
   PaymentStatusCard,
} from "@/components/payment/PaymentStatusHandler";
import {
   getPaymentStatusFromUrl,
   cleanupPaymentParams,
} from "@/utils/payment-utils";
import { useAuth } from "@/context/AuthContext";

export default function PaymentReturnPage() {
   const router = useRouter();
   const { checkAuthStatus } = useAuth();
   const paymentStatus = getPaymentStatusFromUrl();

   useEffect(() => {
      // Refresh authentication status to update subscription info
      if (paymentStatus) {
         checkAuthStatus();

         // If successful payment, redirect after a delay
         if (paymentStatus === "success") {
            const timer = setTimeout(() => {
               router.push("/profile/plan");
            }, 3000);

            return () => clearTimeout(timer);
         }
      } else {
         // If no status, redirect to plans page
         router.push("/profile/plan");
      }

      // Clean up URL parameters when component unmounts
      return () => {
         cleanupPaymentParams();
      };
   }, [paymentStatus, router, checkAuthStatus]);

   if (!paymentStatus) {
      return <div className="text-center py-12">Redirecting...</div>;
   }

   return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1B2A] p-4">
         <div className="max-w-md w-full">
            <PaymentStatusHandler onComplete={() => {}} />
            <PaymentStatusCard
               status={paymentStatus as "success" | "failure" | "cancel" | null}
               redirectPath="/profile/plan"
            />
         </div>
      </div>
   );
}
