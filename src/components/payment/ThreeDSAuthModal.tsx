"use client";

import { useEffect, useRef } from "react";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { ThreeDSData } from "@/api/payments/processPayment";

interface ThreeDSAuthModalProps {
   isOpen: boolean;
   onClose: () => void;
   threeDsData: ThreeDSData | null;
   onComplete: (data: {
      transaction_id: string;
      threeDSSessionData: string;
      cres: string;
   }) => void;
}

/**
 * Component that handles 3D Secure authentication in a modal dialog
 * Displays an iframe with the 3DS challenge and handles response
 */
export function ThreeDSAuthModal({
   isOpen,
   onClose,
   threeDsData,
   onComplete,
}: ThreeDSAuthModalProps) {
   const iframeRef = useRef<HTMLIFrameElement>(null);
   const formRef = useRef<HTMLFormElement>(null);

   // Listen for messages from the iframe (3DS authentication result)
   useEffect(() => {
      if (!isOpen || !threeDsData) return;

      const handleMessage = (event: MessageEvent) => {
         try {
            // Handle standard 3DS provider responses
            if (event.data && typeof event.data === "object") {
               if (
                  event.data.type === "3ds-complete" ||
                  event.data.type === "3ds-authentication-complete"
               ) {
                  const { transaction_id, threeDSSessionData, cres } =
                     event.data;
                  // Make sure we have all the required data before completing
                  if (transaction_id && threeDSSessionData && cres) {
                     onComplete({ transaction_id, threeDSSessionData, cres });
                     onClose();
                  }
               }
            }
         } catch (error) {
            console.error("Error handling 3DS message:", error);
         }
      };

      window.addEventListener("message", handleMessage);

      // Submit the form automatically when the component mounts
      if (formRef.current) {
         formRef.current.submit();
      }

      return () => {
         window.removeEventListener("message", handleMessage);
      };
   }, [isOpen, threeDsData, onComplete, onClose]);

   if (!threeDsData) return null;

   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent className="sm:max-w-md">
            <DialogHeader>
               <DialogTitle>Подтверждение оплаты</DialogTitle>
               <DialogDescription>
                  Пожалуйста, завершите проверку 3D Secure для подтверждения
                  платежа
               </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col items-center justify-center p-4">
               <div className="w-full h-[400px] border rounded-md overflow-hidden relative">
                  {/* Hidden form to submit to the ACS URL */}
                  <form
                     ref={formRef}
                     method="POST"
                     action={threeDsData.acsUrl}
                     target="threeDSFrame"
                     style={{ display: "none" }}
                  >
                     <input
                        type="hidden"
                        name="creq"
                        value={threeDsData.creq}
                     />
                     <input
                        type="hidden"
                        name="threeDSSessionData"
                        value={threeDsData.threeDSSessionData}
                     />
                  </form>

                  {/* Initial loading state */}
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                     <Loader2 className="h-8 w-8 animate-spin text-primary" />
                     <span className="ml-2">Загрузка страницы проверки...</span>
                  </div>

                  {/* 3DS challenge iframe */}
                  <iframe
                     ref={iframeRef}
                     name="threeDSFrame"
                     title="3D Secure Authentication"
                     className="w-full h-full border-0"
                     onLoad={() => {
                        // Hide the loader when the iframe content is loaded
                        const loader =
                           iframeRef.current?.previousElementSibling;
                        if (loader) {
                           (loader as HTMLElement).style.display = "none";
                        }
                     }}
                  />
               </div>

               <p className="text-sm text-muted-foreground mt-4 text-center">
                  Не закрывайте это окно до завершения процесса аутентификации
               </p>
            </div>
         </DialogContent>
      </Dialog>
   );
}
