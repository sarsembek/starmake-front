import React from "react";
import { Button } from "@/components/ui/button";
import { SocialIcon } from "react-social-icons";

interface SocialAuthProps {
   onGoogleAuth?: () => void;
   onTelegramAuth?: () => void;
   disabled?: boolean; // Add disabled prop
}

export function SocialAuth({
   onGoogleAuth,
   onTelegramAuth,
   disabled = true,
}: SocialAuthProps) {
   return (
      <>
         <div className="relative">
            <div className="absolute inset-0 flex items-center">
               <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
               <span className="bg-background px-2 text-muted-foreground">
                  Или продолжить с помощью
               </span>
            </div>
         </div>

         <div className="grid grid-cols-2 gap-4">
            <Button
               variant="outline"
               className="w-full flex items-center gap-2"
               onClick={onGoogleAuth}
               disabled={disabled}
            >
               <SocialIcon
                  network="google"
                  style={{ width: 24, height: 24 }}
                  className="!h-5 !w-5"
                  fgColor={disabled ? "gray" : "currentColor"}
                  bgColor="transparent"
               />
               Google
            </Button>
            <Button
               variant="outline"
               className="w-full flex items-center gap-2"
               onClick={onTelegramAuth}
               disabled={disabled}
            >
               <SocialIcon
                  network="telegram"
                  style={{ width: 24, height: 24 }}
                  className="!h-5 !w-5"
                  fgColor={disabled ? "gray" : "currentColor"}
                  bgColor="transparent"
               />
               Telegram
            </Button>
         </div>
      </>
   );
}
