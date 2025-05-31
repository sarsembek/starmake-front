import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { purchaseSubscription } from "@/api/subscriptions/purchaseSubscription";
import { useAuth } from "@/context/AuthContext";

interface UseSubscriptionPurchaseOptions {
   onSuccess?: () => void;
   onError?: (error: Error) => void;
   defaultReturnUrl?: string;
}

export function useSubscriptionPurchase(
   options: UseSubscriptionPurchaseOptions = {}
) {
   const {
      onSuccess,
      onError,
      defaultReturnUrl = `${
         typeof window !== "undefined" ? window.location.origin : ""
      }/payment/return`,
   } = options;

   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<Error | null>(null);
   const router = useRouter();
   const { checkAuthStatus } = useAuth();

   const handlePurchase = async (
      planId: number,
      customReturnUrl?: string,
      metadata: Record<string, unknown> = {}
   ) => {
      setIsLoading(true);
      setError(null);

      try {
         console.log(`Initiating subscription purchase for plan ID: ${planId}`);

         // Use the provided returnUrl or default to the payment return page
         const returnUrl = customReturnUrl || defaultReturnUrl;
         console.log(`Using return URL: ${returnUrl}`);

         const result = await purchaseSubscription(planId, returnUrl, metadata);
         console.log("Subscription purchase API response:", result);

         if (result.success && result.payment_url) {
            // If we have a payment URL, redirect the user to complete payment
            console.log(`Redirecting to payment URL: ${result.payment_url}`);
            toast.success("Redirecting to payment page...");

            // Small delay before redirect to ensure toast is visible
            setTimeout(() => {
               window.location.href = result.payment_url as string;
               onSuccess?.();
            }, 1000);
         } else if (result.success && result.subscription) {
            // For free plans, no payment URL is needed, subscription is already activated
            console.log(
               "Free plan activated successfully:",
               result.subscription
            );
            toast.success("Subscription activated successfully");

            // Refresh auth status to update user subscription info
            await checkAuthStatus();

            // Redirect to subscription details page
            router.push("/profile/plan");
            onSuccess?.();
         } else {
            // Handle unexpected response
            console.error("Unexpected API response:", result);
            const errorMessage =
               result.message || "Failed to create payment link";
            const newError = new Error(errorMessage);
            setError(newError);
            toast.error(errorMessage);
            onError?.(newError);
         }
      } catch (err) {
         console.error("Error during subscription purchase:", err);
         const errorMessage =
            err instanceof Error ? err.message : "An unexpected error occurred";
         const newError = err instanceof Error ? err : new Error(errorMessage);
         setError(newError);
         toast.error(errorMessage);
         onError?.(newError);
      } finally {
         setIsLoading(false);
      }
   };

   const checkPaymentStatus = () => {
      // This function should be called on the return page
      if (typeof window === "undefined") {
         console.log("checkPaymentStatus called on server side, skipping");
         return null;
      }

      console.log("Checking payment status from URL parameters");
      const urlParams = new URLSearchParams(window.location.search);
      const status = urlParams.get("status");
      console.log("Payment status from URL:", status);

      if (status === "success") {
         console.log("Payment successful, updating subscription status");
         toast.success(
            "Payment successful! Your subscription has been activated."
         );
         // Refresh auth status to update user subscription info
         checkAuthStatus();
      } else if (status === "failure") {
         toast.error("Payment failed. Please try again or contact support.");
      } else if (status === "cancel") {
         toast.info("Payment was cancelled.");
      }

      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);

      return status;
   };

   return {
      handlePurchase,
      checkPaymentStatus,
      isLoading,
      error,
   };
}
