"use client";

import { FC } from "react";
import { Feature } from "./types";
import { FeaturesList } from "./FeaturesList";
import { PremiumFeaturesList } from "./PremiumFeaturesList";
import { PlanTitle } from "./PlanTitle";
import { PricingDisplay } from "./PricingDisplay";
import { PopularBadge } from "./PopularBadge";
import { ActionButton } from "./ActionButton";

// Define PlanCard props
interface PlanCardProps {
   name: string;
   price: number;
   messageCount?: number | string;
   variant?: "standard" | "premium";
   features?: Feature[];
   premiumFeatures?: Feature[];
   className?: string;
}

export const PlanCard: FC<PlanCardProps> = ({
   name,
   price,
   messageCount,
   variant = "standard",
   features,
   premiumFeatures,
   className,
}) => {
   // Default features for standard variant
   const standardFeatures: Feature[] = features || [
      { id: 1, text: "Возможность посмотреть всё на 30 дней" },
      { id: 2, text: "Возможность использовать поиск" },
      { id: 3, text: "Возможность вступить в нашу общую телеграмм группу" },
      {
         id: 4,
         text: `Возможность привязать чатбота и сделать ${messageCount} тестовых сообщений`,
      },
   ];

   // Default premium features for premium variant
   const defaultPremiumFeatures: Feature[] = premiumFeatures || [
      { id: 5, text: "Личный ассистент продюсер в телеграме", isPremium: true },
      {
         id: 6,
         text: "Обучение как набрать 100 000 подписчиков",
         isPremium: true,
      },
      {
         id: 7,
         text: "Создание платформы для вашего продукта",
         isPremium: true,
      },
   ];

   // Handle buy button click for premium variant
   //  const handleBuyClick = () => {
   //     if (variant === "premium") {
   //        alert("Спасибо за покупку тарифа «Эксклюзив»!");
   //     }
   //  };

   if (variant === "premium") {
      return (
         <div className={`w-full ${className}`}>
            <div className="bg-[#5d2de6] rounded-3xl shadow-[0px_0px_40px_rgba(93,45,230,0.35)] overflow-hidden relative text-white">
               <PopularBadge />
               <div className="p-6 flex flex-col md:flex-row h-full">
                  {/* Content Column - Title and Features */}
                  <div className="flex-1 pr-4">
                     {/* Plan Title */}
                     <PlanTitle name={name} variant="premium" />

                     {/* Features section - horizontal on desktop, vertical on mobile */}
                     <div className="flex flex-col md:flex-row gap-6">
                        {/* Standard Features */}
                        <div className="flex-1">
                           <FeaturesList
                              features={standardFeatures}
                              textColor="text-white"
                           />
                        </div>

                        {/* Premium Features */}
                        <div className="flex-1">
                           <PremiumFeaturesList
                              features={defaultPremiumFeatures}
                              textColor="text-white"
                           />
                        </div>
                     </div>
                  </div>

                  {/* Pricing and CTA Column - Desktop only */}
                  <div className="hidden md:flex flex-col min-w-[220px] h-full">
                     {/* Price aligned to top */}
                     <div className="mt-14">
                        <PricingDisplay price={price} variant="premium" />
                     </div>

                     {/* Button aligned to bottom with margin-top to push it down */}
                     <div className="mt-auto self-start">
                        <ActionButton
                           variant="premium"
                           planName={name}
                           planPrice={price}
                        />
                     </div>
                  </div>
               </div>

               {/* Mobile-only pricing and CTA */}
               <div className="md:hidden p-6 pt-0">
                  <div className="flex flex-col items-center mb-4">
                     <PricingDisplay price={price} variant="premium" />
                  </div>
                  <div className="flex justify-center">
                     <ActionButton
                        variant="premium"
                        planName={name}
                        planPrice={price}
                     />
                  </div>
               </div>
            </div>
         </div>
      );
   }

   // Standard variant
   return (
      <div className="flex flex-col bg-white w-full p-4 rounded-3xl">
         <PlanTitle name={name} variant="standard" />
         <PricingDisplay price={price} variant="standard" />
         <div className="border-t border-gray"></div>
         <div className="my-4">
            <FeaturesList features={standardFeatures} />
         </div>
         <div className="min-w-[200px] flex justify-start">
            <ActionButton
               variant="standard"
               planName={name}
               planPrice={price}
            />
         </div>
      </div>
   );
};
