import React, { useEffect } from "react";
import { useSubscriptionPurchase } from "@/hooks/payments/useSubscriptionPurchase";
import { useAuth } from "@/context/AuthContext";
import {
   Card,
   CardContent,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Info } from "lucide-react";
import { useRouter } from "next/navigation";

interface PaymentStatusProps {
   redirectPath?: string;
   onComplete?: (status: string | null) => void;
}

export function PaymentStatusHandler({ onComplete }: PaymentStatusProps) {
   const { checkPaymentStatus } = useSubscriptionPurchase();
   const { checkAuthStatus } = useAuth();

   useEffect(() => {
      const status = checkPaymentStatus();

      if (status) {
         // Refresh authentication status to update subscription info
         checkAuthStatus();
      }

      // Notify parent component
      if (onComplete) {
         onComplete(status);
      }
   }, [checkPaymentStatus, checkAuthStatus, onComplete]);

   return null; // This is just a handler, no UI needed
}

interface PaymentStatusCardProps {
   status: "success" | "failure" | "cancel" | null;
   redirectPath?: string;
}

export function PaymentStatusCard({
   status,
   redirectPath = "/profile/plan",
}: PaymentStatusCardProps) {
   const router = useRouter();

   if (!status) return null;

   let title = "";
   let message = "";
   let icon = null;
   let buttonText = "Continue";

   switch (status) {
      case "success":
         title = "Payment Successful!";
         message =
            "Your subscription has been activated. You now have access to all premium features.";
         icon = <CheckCircle className="h-12 w-12 text-green-500 mb-2" />;
         buttonText = "View Subscription";
         break;
      case "failure":
         title = "Payment Failed";
         message =
            "Your payment could not be processed. Please try again or contact our support team.";
         icon = <XCircle className="h-12 w-12 text-red-500 mb-2" />;
         buttonText = "Try Again";
         break;
      case "cancel":
         title = "Payment Cancelled";
         message =
            "You cancelled the payment process. You can try again whenever you're ready.";
         icon = <Info className="h-12 w-12 text-yellow-500 mb-2" />;
         buttonText = "Back to Plans";
         break;
   }

   return (
      <Card className="max-w-md mx-auto">
         <CardHeader className="flex flex-col items-center">
            {icon}
            <CardTitle>{title}</CardTitle>
         </CardHeader>
         <CardContent>
            <p className="text-center">{message}</p>
         </CardContent>
         <CardFooter className="flex justify-center">
            <Button onClick={() => router.push(redirectPath)}>
               {buttonText}
            </Button>
         </CardFooter>
      </Card>
   );
}
