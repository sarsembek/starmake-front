"use client";

import { useEffect, useState } from "react";
import { PlanCard } from "@/components/profile/plan/PlanCard";
import {
   getSubscriptionPlans,
   SubscriptionPlan,
} from "@/api/subscriptions/getPlans";

export default function PlansPage() {
   const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      async function fetchPlans() {
         try {
            setLoading(true);
            const subscriptionPlans = await getSubscriptionPlans();
            setPlans(subscriptionPlans);
         } catch (err) {
            console.error("Failed to fetch subscription plans:", err);
            setError(
               "Failed to load subscription plans. Please try again later."
            );
         } finally {
            setLoading(false);
         }
      }

      fetchPlans();
   }, []);

   // Default plans to show while loading or if there's an error
   const defaultPlans = [
      { id: 1, name: "Только посмотреть", price: 11, message_count: 100 },
      { id: 2, name: "Стандартный", price: 16, message_count: 1000 },
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

   return (
      <div className="px-4 sm:px-8 md:px-16 lg:px-24 py-10 lg:py-20 bg-[#0B1B2A]">
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
