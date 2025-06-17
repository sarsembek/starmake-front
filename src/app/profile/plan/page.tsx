"use client";

import { useEffect, useState } from "react";
import { PlanCard } from "@/components/profile/plan/PlanCard";
import {
   getSubscriptionPlans,
   SubscriptionPlan,
} from "@/api/subscriptions/getPlans";
import {
   PaymentStatusHandler,
   PaymentStatusCard,
} from "@/components/payment/PaymentStatusHandler";
import { getPaymentStatusFromUrl } from "@/utils/payment-utils";

export default function PlansPage() {
   const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

   useEffect(() => {
      async function fetchPlans() {
         try {
            setLoading(true);
            setError(null); // Reset error state before fetching

            const subscriptionPlans = await getSubscriptionPlans();

            if (
               Array.isArray(subscriptionPlans) &&
               subscriptionPlans.length > 0
            ) {
               console.log("Fetched plans successfully:", subscriptionPlans);
               setPlans(subscriptionPlans);
            } else {
               // Even if we got a successful response but no plans
               console.warn("No subscription plans returned from API");
               setError("No subscription plans available right now.");
            }
         } catch (err) {
            console.error("Failed to fetch subscription plans:", err);

            // Use the detailed error message if available
            const errorMessage =
               err instanceof Error ? err.message : "Unknown error";
            setError(
               `Failed to load subscription plans: ${errorMessage}. Please try again later.`
            );

            // Show default plans as fallback when there's an error
            // We'll continue with the component rendering using default plans
         } finally {
            setLoading(false);
         }
      }

      fetchPlans();
   }, []);

   // Default plans to show while loading or if there's an error
   const defaultPlans = [
      { id: 1, name: "Только посмотреть", price: 11, message_count: 1000 },
      { id: 2, name: "Стандартный", price: 16, message_count: 2000 },
      { id: 3, name: "Безлимитный", price: 29, message_count: "безлимит" },
      {
         id: 4,
         name: "Эксклюзив",
         price: 93,
         message_count: "безлимит",
         is_premium: true,
      },
   ];

   // Use default plans if loading or error
   const displayPlans =
      loading || error || plans.length === 0 ? defaultPlans : plans;

   // Use an effect to check for payment status when the component mounts
   useEffect(() => {
      // Only run in browser
      if (typeof window !== "undefined") {
         const status = getPaymentStatusFromUrl();
         setPaymentStatus(status);
      }
   }, []);

   return (
      <div className="px-4 sm:px-8 md:px-16 lg:px-24 py-10 lg:py-20 bg-[#0B1B2A]">
         {/* Handle payment status updates */}
         <PaymentStatusHandler
            onComplete={(status) => setPaymentStatus(status)}
         />

         {/* Display payment status message if present */}
         {paymentStatus && (
            <div className="mb-8">
               <PaymentStatusCard
                  status={
                     paymentStatus as "success" | "failure" | "cancel" | null
                  }
               />
            </div>
         )}

         <div className="flex flex-col md:flex-row md:justify-between text-white gap-4 mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold">Тарифы</h1>
            <p className="max-w-xs">
               Стань звездой соцсетей с помощью AI-генерации трендовых видео
            </p>
         </div>

         {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-5">
               {error}
            </div>
         )}

         <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Standard Plans - One column on mobile, three columns on desktop */}
            {displayPlans
               .filter((plan) => !plan.is_premium)
               .map((plan) => (
                  <PlanCard
                     key={plan.id}
                     id={plan.id}
                     name={plan.name}
                     price={plan.price}
                     messageCount={plan.message_count}
                  />
               ))}

            {/* Premium Plan - Spans all three columns on desktop */}
            {displayPlans
               .filter((plan) => plan.is_premium)
               .map((plan) => (
                  <PlanCard
                     key={plan.id}
                     id={plan.id}
                     name={plan.name}
                     price={plan.price}
                     messageCount={plan.message_count}
                     variant="premium"
                     className="col-span-1 md:col-span-3 mt-5"
                  />
               ))}
         </div>
      </div>
   );
}
