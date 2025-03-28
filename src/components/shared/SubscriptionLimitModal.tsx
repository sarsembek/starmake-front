"use client";

import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";

interface SubscriptionLimitModalProps {
   isOpen: boolean;
   onClose: () => void;
}

export function SubscriptionLimitModal({
   isOpen,
   onClose,
}: SubscriptionLimitModalProps) {
   const router = useRouter();

   const handleUpgrade = () => {
      router.push("/profile");
      onClose();
   };

   return (
      <AlertDialog open={isOpen} onOpenChange={onClose}>
         <AlertDialogContent>
            <AlertDialogHeader>
               <div className="flex flex-col items-center gap-2 mb-2">
                  <AlertTriangle className="h-12 w-12 text-amber-500" />
                  <AlertDialogTitle className="text-xl">
                     Ограничение доступа
                  </AlertDialogTitle>
               </div>
               <AlertDialogDescription className="text-center text-base">
                  Ваш аккаунт ограничен. Для доступа к библиотеке и всем
                  функциям сервиса необходимо обновить вашу подписку.
               </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
               <AlertDialogAction asChild className="w-full">
                  <Button onClick={handleUpgrade} className="w-full">
                     Обновить подписку
                  </Button>
               </AlertDialogAction>
               <Button variant="outline" onClick={onClose} className="w-full">
                  Закрыть
               </Button>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
}
