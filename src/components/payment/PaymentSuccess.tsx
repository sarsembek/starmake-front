"use client";

import { CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

/**
 * Props for PaymentSuccess component
 */
interface PaymentSuccessProps {
   /** The name of the plan that was purchased */
   planName: string;
}

/**
 * Component displayed when payment is successful
 * Shows a confirmation message with the purchased plan name
 */
export const PaymentSuccess = ({ planName }: PaymentSuccessProps) => {
   return (
      <CardContent className="space-y-6">
         <div className="flex flex-col items-center justify-center py-6">
            <div className="rounded-full bg-green-100 p-3">
               <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">
               Платеж выполнен успешно!
            </h3>
            <p className="mt-1 text-center text-muted-foreground">
               Ваш тариф «{planName}» активирован. Вы будете перенаправлены на
               страницу профиля.
            </p>
         </div>
      </CardContent>
   );
};
