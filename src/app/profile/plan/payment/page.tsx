"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

// Import our decomposed components
import { PaymentHeader } from "@/components/payment/PaymentHeader";
import { PaymentForm, PaymentFormData } from "@/components/payment/PaymentForm";
import { PaymentSuccess } from "@/components/payment/PaymentSuccess";
import { OrderSummary } from "@/components/payment/OrderSummary";
import { usePaymentProcessing } from "@/hooks/payments/usePaymentProcessing";
import { CardData } from "@/api/payments/processPayment";

// Client Component that uses useSearchParams
function PaymentPageContent() {
   const router = useRouter();
   const searchParams = useSearchParams();

   // Get plan details from URL parameters or use defaults
   const planName = searchParams.get("plan") || "Стандартный";
   const planPrice = Number(searchParams.get("price")) || 16;
   const planId = Number(searchParams.get("planId")) || 1;

   // Get plan features from URL if available
   const planFeaturesParam = searchParams.get("features");
   const planFeatures = planFeaturesParam
      ? JSON.parse(decodeURIComponent(planFeaturesParam))
      : [];

   // Initialize payment processing hook
   const {
      purchaseSubscription,
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
    * Handle direct subscription payment submission
    * Processes payment through subscription API with card details
    */
   const onSubmit = async (data: PaymentFormData, planId: number) => {
      setError("");

      try {
         // Format card data for API
         const [expiryMonth, expiryYear] = data.expiryDate.split("/");

         // Create card data object
         const cardData: CardData = {
            cardNumber: data.cardNumber.replace(/\s/g, ""),
            expiryMonth,
            expiryYear,
            cvv: data.cvc,
            cardholderName: data.cardName,
         };

         // Purchase subscription directly with card
         purchaseSubscription(planId, cardData);
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
                  <OrderSummary
                     planName={planName}
                     planPrice={planPrice}
                     planFeatures={planFeatures}
                  />
               </div>
            </div>
         </div>
      </div>
   );
}

/**
 * Main Payment Page component that wraps the content with Suspense
 */
export default function PaymentPage() {
   return (
      <Suspense fallback={<PaymentLoading />}>
         <PaymentPageContent />
      </Suspense>
   );
}

/**
 * Loading state component for the payment page
 */
function PaymentLoading() {
   return (
      <div className="container max-w-4xl px-4 sm:px-6 py-10">
         <div className="flex justify-center items-center min-h-[60vh]">
            <div className="flex flex-col items-center">
               <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
               <p className="mt-4 text-lg font-medium">
                  Загрузка формы оплаты...
               </p>
            </div>
         </div>
      </div>
   );
}
