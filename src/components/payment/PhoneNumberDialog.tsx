"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePhoneNumber } from "@/api/auth/updatePhoneNumber";

interface PhoneNumberDialogProps {
   isOpen: boolean;
   onClose: () => void;
   onBuy: () => void;
   planName: string;
}

interface PhoneFormData {
   phoneNumber: string;
}

export function PhoneNumberDialog({
   isOpen,
   onClose,
   onBuy,
   planName,
}: PhoneNumberDialogProps) {
   const [isLoading, setIsLoading] = useState(false);
   const [isSaving, setIsSaving] = useState(false);

   const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
   } = useForm<PhoneFormData>();

   const handleSave = async (data: PhoneFormData) => {
      setIsSaving(true);
      try {
         await updatePhoneNumber(data.phoneNumber);
         toast.success("Phone number saved successfully!");
      } catch (error) {
         console.error("Error saving phone number:", error);
         toast.error("Failed to save phone number. Please try again.");
      } finally {
         setIsSaving(false);
      }
   };

   const handleBuy = async (data: PhoneFormData) => {
      setIsLoading(true);
      try {
         // First save the phone number if provided
         if (data.phoneNumber.trim()) {
            await updatePhoneNumber(data.phoneNumber);
         }

         // Close the dialog and proceed to payment
         onClose();
         onBuy();
      } catch (error) {
         console.error("Error processing phone number:", error);
         toast.error("Failed to save phone number. Please try again.");
         setIsLoading(false);
      }
   };

   const handleClose = () => {
      reset();
      onClose();
   };

   return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
         <DialogContent className="sm:max-w-md">
            <DialogHeader>
               <DialogTitle className="text-xl font-semibold">
                  Покупка тарифа «{planName}»
               </DialogTitle>
            </DialogHeader>

            <form className="space-y-4">
               <div className="space-y-2">
                  <Label htmlFor="phoneNumber">
                     Введите ваш номер телефона
                  </Label>
                  <Input
                     id="phoneNumber"
                     type="tel"
                     placeholder="+7 (999) 123-45-67"
                     {...register("phoneNumber", {
                        required: "Номер телефона обязателен",
                        pattern: {
                           value: /^[\+]?[1-9][\d]{0,15}$/,
                           message: "Введите корректный номер телефона",
                        },
                     })}
                     className="w-full"
                  />
                  {errors.phoneNumber && (
                     <p className="text-sm text-red-500">
                        {errors.phoneNumber.message}
                     </p>
                  )}
               </div>

               <div className="flex gap-3 pt-4">
                  <Button
                     type="button"
                     variant="outline"
                     onClick={handleSubmit(handleSave)}
                     disabled={isSaving || isLoading}
                     className="flex-1"
                  >
                     {isSaving ? "Сохранение..." : "Сохранить"}
                  </Button>

                  <Button
                     type="button"
                     onClick={handleSubmit(handleBuy)}
                     disabled={isLoading || isSaving}
                     className="flex-1 bg-[#00b3ff] hover:bg-[#0099e6] text-white"
                  >
                     {isLoading ? "Обработка..." : "Купить"}
                  </Button>
               </div>
            </form>
         </DialogContent>
      </Dialog>
   );
}
