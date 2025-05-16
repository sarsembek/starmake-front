"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

/**
 * Props for PaymentHeader component
 */
interface PaymentHeaderProps {
   /** Function to handle back button click */
   onBack: () => void;
}

/**
 * Payment header component with a back button and title
 * Displays at the top of the payment page
 */
export const PaymentHeader = ({ onBack }: PaymentHeaderProps) => {
   return (
      <div className="mb-6 flex items-center">
         <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
         </Button>
         <h1 className="text-2xl font-bold">Оплата тарифа</h1>
      </div>
   );
};
