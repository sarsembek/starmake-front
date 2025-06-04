"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
   PaymentStatusHandler,
   PaymentStatusCard,
} from "@/components/payment/PaymentStatusHandler";
import { PaymentSuccessModal } from "@/components/payment/PaymentSuccessModal";
import {
   getPaymentStatusFromUrl,
   cleanupPaymentParams,
} from "@/utils/payment-utils";
import { useAuth } from "@/context/AuthContext";

export default function PaymentReturnPage() {
   const router = useRouter();
   const { checkAuthStatus } = useAuth();
   const paymentStatus = getPaymentStatusFromUrl();
   const [showSuccessModal, setShowSuccessModal] = useState(false);

   useEffect(() => {
      // Refresh authentication status to update subscription info
      if (paymentStatus) {
         checkAuthStatus();

         // If successful payment, show modal instead of redirect
         if (paymentStatus === "success") {
            setShowSuccessModal(true);
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

   const handleModalClose = () => {
      setShowSuccessModal(false);
      router.push("/profile/plan");
   };

   const handleModalContinue = () => {
      setShowSuccessModal(false);
      router.push("/"); // Redirect to main page for image creation
   };

   if (!paymentStatus) {
      return <div className="text-center py-12">Redirecting...</div>;
   }

   // Show success modal for successful payments
   if (paymentStatus === "success") {
      return (
         <>
            <PaymentSuccessModal
               isOpen={showSuccessModal}
               onClose={handleModalClose}
               onContinue={handleModalContinue}
            />
            {/* Fallback content if modal is not shown */}
            {!showSuccessModal && (
               <div className="min-h-screen flex items-center justify-center bg-[#0B1B2A] p-4">
                  <div className="max-w-md w-full">
                     <PaymentStatusHandler onComplete={() => {}} />
                     <PaymentStatusCard
                        status={
                           paymentStatus as
                              | "success"
                              | "failure"
                              | "cancel"
                              | null
                        }
                        redirectPath="/profile/plan"
                     />
                  </div>
               </div>
            )}
         </>
      );
   }

   // For non-success statuses, show the original card
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
