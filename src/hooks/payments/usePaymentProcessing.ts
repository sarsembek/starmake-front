import { useState } from "react";
import {
   processPayment,
   complete3DSAuthentication as complete3DSAuth,
   checkPaymentStatus,
   PaymentRequest,
   Complete3DSRequest,
   ThreeDSData,
   PaymentError,
} from "@/api/payments/processPayment";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

interface PaymentErrorWithCode {
   message: string;
   code?: string;
}

interface UsePaymentProcessingOptions {
   redirectAfterSuccess?: boolean;
   successRedirectUrl?: string;
}

export function usePaymentProcessing(
   options: UsePaymentProcessingOptions = {}
) {
   const { redirectAfterSuccess = true, successRedirectUrl = "/profile" } =
      options;
   const [isProcessingPayment, setIsProcessingPayment] = useState(false);
   const [paymentStatus, setPaymentStatus] = useState<
      "paid" | "pending_auth" | "failed" | null
   >(null);
   const [paymentId, setPaymentId] = useState<string | null>(null);
   const [requires3DS, setRequires3DS] = useState(false);
   const [threeDsData, setThreeDsData] = useState<ThreeDSData | null>(null);
   const [paymentError, setPaymentError] =
      useState<PaymentErrorWithCode | null>(null);

   const router = useRouter();
   const { checkAuthStatus } = useAuth();

   // Process a direct card payment
   const processCardPayment = async (data: PaymentRequest) => {
      setIsProcessingPayment(true);
      setPaymentError(null);
      setPaymentStatus(null);

      try {
         const response = await processPayment(data);

         if (response.success) {
            setPaymentId(response.payment_id);
            setPaymentStatus(response.status);

            if (response.requires_3ds && response.threeds_data) {
               setRequires3DS(true);
               setThreeDsData(response.threeds_data);
            } else if (response.status === "paid") {
               await handlePaymentSuccess();
            }
         } else {
            handlePaymentError({
               message: response.message || "Payment processing error",
            });
         }

         return response;
      } catch (error: unknown) {
         const paymentError = error as PaymentError;
         const errorMessage =
            paymentError.response?.data?.message || "Failed to process payment";
         handlePaymentError({ message: errorMessage });
         throw error;
      } finally {
         setIsProcessingPayment(false);
      }
   };

   // Complete 3DS authentication
   const complete3DSAuthentication = async (data: Complete3DSRequest) => {
      setIsProcessingPayment(true);

      try {
         const response = await complete3DSAuth(data);

         if (response.success && response.status === "paid") {
            setPaymentStatus("paid");
            await handlePaymentSuccess();
         } else {
            setPaymentStatus("failed");
            handlePaymentError({
               message: response.message || "3D Secure authentication failed",
            });
         }

         return response;
      } catch (error: unknown) {
         const paymentError = error as PaymentError;
         const errorMessage =
            paymentError.response?.data?.message ||
            "3D Secure authentication error";
         handlePaymentError({ message: errorMessage });
         throw error;
      } finally {
         setIsProcessingPayment(false);
         setRequires3DS(false);
         setThreeDsData(null);
      }
   };

   // Check payment status
   const checkPayment = async (paymentId: string, transactionId?: string) => {
      setIsProcessingPayment(true);

      try {
         const response = await checkPaymentStatus({
            payment_id: paymentId,
            transaction_id: transactionId,
         });

         if (response.success && response.status === "paid") {
            setPaymentStatus("paid");
            await handlePaymentSuccess();
         } else if (response.status === "failed") {
            setPaymentStatus("failed");
            handlePaymentError({
               message: response.message || "Payment failed",
            });
         }

         return response;
      } catch (error: unknown) {
         const paymentError = error as PaymentError;
         const errorMessage =
            paymentError.response?.data?.message ||
            "Failed to check payment status";
         handlePaymentError({ message: errorMessage });
         throw error;
      } finally {
         setIsProcessingPayment(false);
      }
   };

   // Handle successful payment
   const handlePaymentSuccess = async (): Promise<void> => {
      setPaymentStatus("paid");
      toast.success("Payment completed successfully!");

      // Update auth status to refresh subscription info
      await checkAuthStatus();

      // Redirect after success if enabled
      if (redirectAfterSuccess) {
         setTimeout(() => {
            router.push(successRedirectUrl);
         }, 3000);
      }
   };

   // Handle payment error
   const handlePaymentError = (error: PaymentErrorWithCode): void => {
      setPaymentStatus("failed");
      setPaymentError(error);
      toast.error("Payment Error", {
         description: error.message,
      });
   };

   return {
      isProcessingPayment,
      paymentStatus,
      paymentId,
      requires3DS,
      threeDsData,
      paymentError,
      processCardPayment,
      complete3DSAuthentication,
      checkPayment,
   };
}
