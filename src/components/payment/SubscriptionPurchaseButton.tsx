import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSubscriptionPurchase } from "@/hooks/payments/useSubscriptionPurchase";
import { SubscriptionPlan } from "@/api/subscriptions/getPlans";
import { PhoneNumberDialog } from "./PhoneNumberDialog";

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
   isPremium?: boolean; // Add prop to identify premium plans
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
   isPremium = false,
}: SubscriptionPurchaseButtonProps) {
   const [showPhoneDialog, setShowPhoneDialog] = useState(false);
   const { handlePurchase, isLoading } = useSubscriptionPurchase({
      onSuccess,
      onError,
   });

   const onClick = () => {
      // For premium plans, show phone number dialog first
      if (isPremium) {
         setShowPhoneDialog(true);
      } else {
         // For regular plans, proceed directly to payment
         handlePurchase(plan.id, customReturnUrl, metadata);
      }
   };

   const handlePhoneDialogBuy = () => {
      // Proceed to payment after phone number is handled
      handlePurchase(plan.id, customReturnUrl, metadata);
   };

   const handlePhoneDialogClose = () => {
      setShowPhoneDialog(false);
   };

   return (
      <>
         <Button
            className={className}
            variant={variant}
            size={size}
            onClick={onClick}
            disabled={isLoading}
         >
            {isLoading ? "Processing..." : children || `Purchase ${plan.name}`}
         </Button>

         {/* Phone Number Dialog for Premium Plans */}
         <PhoneNumberDialog
            isOpen={showPhoneDialog}
            onClose={handlePhoneDialogClose}
            onBuy={handlePhoneDialogBuy}
            planName={plan.name}
         />
      </>
   );
}
