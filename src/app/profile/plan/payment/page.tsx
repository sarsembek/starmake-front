"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

// Import our decomposed components
import { PaymentHeader } from "@/components/payment/PaymentHeader";
import { PaymentForm, PaymentFormData } from "@/components/payment/PaymentForm";
import { PaymentSuccess } from "@/components/payment/PaymentSuccess";
import { OrderSummary } from "@/components/payment/OrderSummary";
import { usePaymentProcessing } from "@/hooks/payments/usePaymentProcessing";
import { PaymentRequest } from "@/api/payments/processPayment";

/**
 * PaymentPage component for handling the payment process
 * Manages form state, submission logic, and displays appropriate UI based on payment status
 */
export default function PaymentPage() {
   const router = useRouter();
   const searchParams = useSearchParams();

   // Get plan details from URL parameters or use defaults
   const planName = searchParams.get("plan") || "Стандартный";
   const planPrice = Number(searchParams.get("price")) || 16;
   const planId = Number(searchParams.get("planId")) || 1;

   // Initialize payment processing hook
   const {
      processCardPayment,
      isProcessingPayment,
      paymentError,
      paymentStatus,
      requires3DS,
      threeDsData,
      complete3DSAuthentication,
   } = usePaymentProcessing({
      redirectAfterSuccess: true,
   });

   // State for managing the payment flow
   const [isSuccess, setIsSuccess] = useState(false);
   const [error, setError] = useState("");

   // Set up form handling with react-hook-form
   const {
      register,
      handleSubmit,
      formState: { errors },
      watch,
   } = useForm<PaymentFormData>();

   // Check if payment was successful
   useEffect(() => {
      if (paymentStatus === "paid") {
         setIsSuccess(true);
      }
   }, [paymentStatus]);

   // Handle payment errors
   useEffect(() => {
      if (paymentError) {
         setError(
            paymentError.message || "Произошла ошибка при обработке платежа"
         );
      }
   }, [paymentError]);

   // Handle back button click
   const goBack = () => {
      router.back();
   };

   /**
    * Handle direct card payment submission
    * Processes payment through payment API with card details
    */
   const onSubmit = async (data: PaymentFormData, planId: number) => {
      setError("");

      try {
         // Format card data for API
         const [expiryMonth, expiryYear] = data.expiryDate.split("/");

         // Create payment request
         const paymentData: PaymentRequest = {
            card_data: {
               cardNumber: data.cardNumber.replace(/\s/g, ""),
               expiryMonth,
               expiryYear,
               cvv: data.cvc,
               cardholderName: data.cardName,
            },
            metadata: {
               plan_id: planId,
            },
         };

         // Process the payment
         processCardPayment(paymentData);
      } catch (error: unknown) {
         const errorMessage =
            error instanceof Error
               ? error.message
               : "Произошла ошибка при обработке платежа. Пожалуйста, попробуйте еще раз.";
         setError(errorMessage);
         console.error("Payment error:", error);
      }
   };

   /**
    * Complete 3DS authentication
    */
   const handle3DSCompletion = (data: {
      transaction_id: string;
      threeDSSessionData: string;
      cres: string;
   }) => {
      complete3DSAuthentication(data);
   };

   return (
      <div className="container max-w-4xl px-4 sm:px-6 py-10">
         {/* Page header with back button - left aligned */}
         <PaymentHeader onBack={goBack} />

         {/* Main content grid - centered */}
         <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl w-full">
               {/* Payment form or success state */}
               {isSuccess ? (
                  <div className="md:col-span-2 relative w-full">
                     <div
                        className="absolute inset-0 -z-10 bg-primary blur-[90px] opacity-20 rounded-xl"
                        style={{ transform: "scale(0.85)" }}
                     />
                     <div className="relative z-10">
                        <PaymentSuccess planName={planName} />
                     </div>
                  </div>
               ) : (
                  <PaymentForm
                     planPrice={planPrice}
                     planId={planId}
                     isSubmitting={isProcessingPayment}
                     error={error}
                     onSubmit={onSubmit}
                     register={register}
                     handleSubmit={handleSubmit}
                     errors={errors}
                     watch={watch}
                     threeDsData={threeDsData}
                     requires3DS={requires3DS}
                     onComplete3DS={handle3DSCompletion}
                  />
               )}

               {/* Order summary */}
               <div className="md:col-span-1 w-full">
                  <OrderSummary planName={planName} planPrice={planPrice} />
               </div>
            </div>
         </div>
      </div>
   );
}
