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
   id?: number; // Added plan ID
   name: string;
   price: number;
   messageCount?: number | string;
   variant?: "standard" | "premium";
   features?: Feature[];
   premiumFeatures?: Feature[];
   className?: string;
}

export const PlanCard: FC<PlanCardProps> = ({
   id,
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

   // Combine default styles with any passed className
   const cardClasses = `relative h-full p-6 rounded-xl overflow-hidden transition-all duration-200 ${
      className || ""
   }`;

   return (
      <div
         className={
            variant === "standard"
               ? `${cardClasses} border border-gray-700 bg-[#0F1624]`
               : `${cardClasses} border-2 border-blue-400 bg-gradient-to-br from-[#0F1624] to-[#142032]`
         }
      >
         {/* Popular badge for premium variant */}
         {variant === "premium" && <PopularBadge />}

         {/* Plan title section */}
         <PlanTitle name={name} variant={variant} />

         {/* Pricing display */}
         <PricingDisplay price={price} variant={variant} />

         {/* Features lists */}
         {variant === "standard" ? (
            <FeaturesList features={standardFeatures} />
         ) : (
            <PremiumFeaturesList
               features={[...standardFeatures, ...defaultPremiumFeatures]}
            />
         )}

         {/* Action button */}
         <div
            className={`mt-6 ${
               variant === "premium" ? "flex justify-center" : ""
            }`}
         >
            <ActionButton
               variant={variant}
               planName={name}
               planPrice={price}
               planId={id}
               planFeatures={standardFeatures.map((f) => f.text)}
            />
         </div>
      </div>
   );
};
