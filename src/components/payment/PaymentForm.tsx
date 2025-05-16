"use client";

import { useState } from "react";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CreditCard, Loader2 } from "lucide-react";
import {
   UseFormRegister,
   FieldErrors,
   UseFormHandleSubmit,
   UseFormWatch,
} from "react-hook-form";
import { formatCardNumber, formatExpiryDate } from "./FormatUtils";
import { ThreeDSAuthModal } from "./ThreeDSAuthModal";
import { ThreeDSData } from "@/api/payments/processPayment";

/**
 * Form data structure for payment information
 */
export interface PaymentFormData {
   cardNumber: string;
   cardName: string;
   expiryDate: string;
   cvc: string;
}

/**
 * Props for PaymentForm component
 */
interface PaymentFormProps {
   /** The price to display on the submit button */
   planPrice: number;
   /** Plan ID for the subscription */
   planId: number;
   /** Whether the form is currently being submitted */
   isSubmitting: boolean;
   /** Error message to display if submission fails */
   error?: string;
   /** Function to handle form submission with payment API */
   onSubmit: (data: PaymentFormData, planId: number) => void;
   /** Register function from react-hook-form */
   register: UseFormRegister<PaymentFormData>;
   /** HandleSubmit function from react-hook-form */
   handleSubmit: UseFormHandleSubmit<PaymentFormData>;
   /** Form validation errors from react-hook-form */
   errors: FieldErrors<PaymentFormData>;
   /** Watch function from react-hook-form to observe input values */
   watch: UseFormWatch<PaymentFormData>;
   /** 3DS data if authentication is required */
   threeDsData: ThreeDSData | null;
   /** Whether 3DS authentication is required */
   requires3DS: boolean;
   /** Function to complete 3DS authentication */
   onComplete3DS: (data: {
      transaction_id: string;
      threeDSSessionData: string;
      cres: string;
   }) => void;
}

/**
 * Payment form component with validation and formatting
 * Collects credit card details with client-side validation
 */
export const PaymentForm = ({
   planPrice,
   planId,
   isSubmitting,
   error,
   onSubmit,
   register,
   handleSubmit,
   errors,
   // watch,
   threeDsData,
   requires3DS,
   onComplete3DS,
}: PaymentFormProps) => {
   const [show3DSModal, setShow3DSModal] = useState(false);

   // Handle form submission
   const processPayment = (data: PaymentFormData) => {
      onSubmit(data, planId);
   };

   // Show 3DS modal when 3DS is required
   useState(() => {
      if (requires3DS && threeDsData) {
         setShow3DSModal(true);
      }
   });

   return (
      <div className="relative md:col-span-2">
         <div
            className="absolute inset-0 -z-10 bg-primary blur-[90px] opacity-20 rounded-xl"
            style={{ transform: "scale(0.85)" }}
         />
         <Card className="relative z-10">
            <CardHeader>
               <CardTitle>Данные карты</CardTitle>
               <CardDescription>
                  Введите данные вашей банковской карты для оплаты
               </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit(processPayment)}>
               <CardContent className="space-y-4">
                  {error && (
                     <Alert variant="destructive">
                        <AlertTitle>Ошибка</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                     </Alert>
                  )}

                  <div className="space-y-1">
                     <Label htmlFor="cardNumber">Номер карты</Label>
                     <div className="relative">
                        <Input
                           id="cardNumber"
                           placeholder="0000 0000 0000 0000"
                           className="pr-10"
                           {...register("cardNumber", {
                              required: "Номер карты обязателен",
                              onChange: (e) => {
                                 e.target.value = formatCardNumber(
                                    e.target.value
                                 );
                              },
                              validate: (value) =>
                                 value.replace(/\s/g, "").length === 16 ||
                                 "Номер карты должен содержать 16 цифр",
                           })}
                        />
                        <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                     </div>
                     {errors.cardNumber && (
                        <p className="text-sm text-red-500 mt-1">
                           {errors.cardNumber.message}
                        </p>
                     )}
                  </div>

                  <div className="space-y-1">
                     <Label htmlFor="cardName">Имя владельца карты</Label>
                     <Input
                        id="cardName"
                        placeholder="IVAN IVANOV"
                        {...register("cardName", {
                           required: "Имя владельца карты обязательно",
                        })}
                     />
                     {errors.cardName && (
                        <p className="text-sm text-red-500 mt-1">
                           {errors.cardName.message}
                        </p>
                     )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <Label htmlFor="expiryDate">Срок действия</Label>
                        <Input
                           id="expiryDate"
                           placeholder="MM/YY"
                           {...register("expiryDate", {
                              required: "Срок действия обязателен",
                              onChange: (e) => {
                                 e.target.value = formatExpiryDate(
                                    e.target.value
                                 );
                              },
                              validate: (value) => {
                                 if (value.length !== 5)
                                    return "Введите в формате MM/YY";
                                 const [month] = value.split("/");
                                 if (
                                    parseInt(month) > 12 ||
                                    parseInt(month) < 1
                                 )
                                    return "Некорректный месяц";
                                 return true;
                              },
                           })}
                        />
                        {errors.expiryDate && (
                           <p className="text-sm text-red-500 mt-1">
                              {errors.expiryDate.message}
                           </p>
                        )}
                     </div>

                     <div className="space-y-1">
                        <Label htmlFor="cvc">CVC/CVV</Label>
                        <Input
                           id="cvc"
                           placeholder="123"
                           maxLength={3}
                           {...register("cvc", {
                              required: "CVC/CVV обязателен",
                              pattern: {
                                 value: /^[0-9]{3}$/,
                                 message: "CVC/CVV должен содержать 3 цифры",
                              },
                           })}
                        />
                        {errors.cvc && (
                           <p className="text-sm text-red-500 mt-1">
                              {errors.cvc.message}
                           </p>
                        )}
                     </div>
                  </div>

                  <div className="text-xs text-muted-foreground mt-2">
                     <p>
                        Ваши платежные данные в безопасности. Все транзакции
                        защищены SSL-шифрованием.
                     </p>
                  </div>
               </CardContent>

               <CardFooter>
                  <Button
                     type="submit"
                     className="w-full mt-5"
                     disabled={isSubmitting}
                  >
                     {isSubmitting ? (
                        <>
                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                           Обработка платежа...
                        </>
                     ) : (
                        `Оплатить $${planPrice}`
                     )}
                  </Button>
               </CardFooter>
            </form>
         </Card>

         {/* 3DS Authentication Modal */}
         <ThreeDSAuthModal
            isOpen={show3DSModal}
            onClose={() => setShow3DSModal(false)}
            threeDsData={threeDsData}
            onComplete={onComplete3DS}
         />
      </div>
   );
};
