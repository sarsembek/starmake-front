"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

/**
 * Props for OrderSummary component
 */
interface OrderSummaryProps {
   /** The name of the plan being purchased */
   planName: string;
   /** The price of the plan in dollars */
   planPrice: number;
}

/**
 * Component that displays the order summary with plan details
 * Shows plan name, period, total price and subscription terms
 */
export const OrderSummary = ({ planName, planPrice }: OrderSummaryProps) => {
   return (
      <div className="relative">
         <div
            className="absolute inset-0 -z-10 bg-gray-400 blur-[90px] opacity-20 rounded-xl"
            style={{ transform: "scale(0.85)" }}
         />
         <Card className="relative z-10">
            <CardHeader>
               <CardTitle>Детали заказа</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex justify-between">
                  <span className="text-muted-foreground">Тариф:</span>
                  <span className="font-medium">{planName}</span>
               </div>

               <div className="flex justify-between">
                  <span className="text-muted-foreground">Период:</span>
                  <span className="font-medium">1 месяц</span>
               </div>

               <Separator />

               <div className="flex justify-between">
                  <span className="font-semibold">Итого к оплате:</span>
                  <span className="font-bold text-lg">${planPrice}</span>
               </div>

               <div className="text-xs text-muted-foreground mt-4">
                  <p>
                     Оплачивая подписку, вы соглашаетесь с условиями и правилами
                     сервиса. Подписка будет автоматически продлеваться каждый
                     месяц до тех пор, пока вы её не отмените.
                  </p>
               </div>
            </CardContent>
         </Card>
      </div>
   );
};
