"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ActionButtonProps {
   variant: "standard" | "premium";
   onClick?: () => void;
   planName?: string;
   planPrice?: number;
   planId?: number;
   planFeatures?: string[];
}

export const ActionButton: FC<ActionButtonProps> = ({
   variant,
   onClick,
   planName,
   planPrice,
   planId,
   planFeatures,
}) => {
   const router = useRouter();

   const handleButtonClick = () => {
      if (onClick) {
         onClick();
      } else {
         // Navigate to payment page with plan details
         const searchParams = new URLSearchParams();
         if (planName) searchParams.append("plan", planName);
         if (planPrice) searchParams.append("price", planPrice.toString());
         if (planId) searchParams.append("planId", planId.toString());

         // Add features as encoded JSON string if available
         if (planFeatures && planFeatures.length > 0) {
            searchParams.append(
               "features",
               encodeURIComponent(JSON.stringify(planFeatures))
            );
         }

         router.push(`/profile/plan/payment?${searchParams.toString()}`);
      }
   };

   return variant === "premium" ? (
      <Button
         size="lg"
         className="mt-4 bg-[#00b3ff] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#0099e6] transition-colors min-w-[220px]"
         onClick={handleButtonClick}
      >
         Купить
      </Button>
   ) : (
      <Button
         size="lg"
         className="min-w-[220px] bg-[#00B3FF] hover:bg-[#009CDE] transition-colors duration-200"
         onClick={handleButtonClick}
      >
         Купить
      </Button>
   );
};
