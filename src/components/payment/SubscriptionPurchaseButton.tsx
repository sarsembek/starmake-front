import React from "react";
import { Button } from "@/components/ui/button";
import { useSubscriptionPurchase } from "@/hooks/payments/useSubscriptionPurchase";
import { SubscriptionPlan } from "@/api/subscriptions/getPlans";

interface SubscriptionPurchaseButtonProps {
   plan: SubscriptionPlan;
   className?: string;
   variant?:
      | "default"
      | "outline"
      | "ghost"
      | "link"
      | "destructive"
      | "secondary";
   size?: "default" | "sm" | "lg" | "icon";
   children?: React.ReactNode;
   onSuccess?: () => void;
   onError?: (error: Error) => void;
   customReturnUrl?: string;
   metadata?: Record<string, unknown>;
}

export function SubscriptionPurchaseButton({
   plan,
   className,
   variant = "default",
   size = "default",
   children,
   onSuccess,
   onError,
   customReturnUrl,
   metadata = {},
}: SubscriptionPurchaseButtonProps) {
   const { handlePurchase, isLoading } = useSubscriptionPurchase({
      onSuccess,
      onError,
   });

   const onClick = () => {
      handlePurchase(plan.id, customReturnUrl, metadata);
   };

   return (
      <Button
         className={className}
         variant={variant}
         size={size}
         onClick={onClick}
         disabled={isLoading}
      >
         {isLoading ? "Processing..." : children || `Purchase ${plan.name}`}
      </Button>
   );
}
