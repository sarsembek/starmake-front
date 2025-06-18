import React from "react";
import { Button } from "@/components/ui/button";
import { SocialIcon } from "react-social-icons";
import {
   Tooltip,
   TooltipContent,
   TooltipProvider,
   TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGoogleAuth } from "@/hooks/auth/useGoogleAuth";

interface SocialAuthProps {
   onGoogleAuth?: () => void;
   onTelegramAuth?: () => void;
   disabled?: boolean; // Add disabled prop
   googleEnabled?: boolean; // Add Google enabled prop
}

export function SocialAuth({
   onGoogleAuth,
   onTelegramAuth,
   disabled = true,
   googleEnabled = true, // Enable Google by default
}: SocialAuthProps) {
   const { initiateGoogleAuth, isGoogleAuthLoading } = useGoogleAuth();

   const handleGoogleClick = () => {
      if (onGoogleAuth) {
         onGoogleAuth();
      } else {
         initiateGoogleAuth();
      }
   };
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
            <TooltipProvider>
               <Tooltip>
                  <TooltipTrigger asChild>
                     <div className="w-full">
                        {" "}
                        {/* Wrapper div to properly position tooltip */}
                        <Button
                           variant="outline"
                           className="w-full flex items-center gap-2"
                           onClick={handleGoogleClick}
                           disabled={!googleEnabled || isGoogleAuthLoading}
                        >
                           <SocialIcon
                              network="google"
                              style={{ width: 24, height: 24 }}
                              className="!h-5 !w-5"
                              fgColor={(!googleEnabled || isGoogleAuthLoading) ? "gray" : "currentColor"}
                              bgColor="transparent"
                           />
                           {isGoogleAuthLoading ? "Загрузка..." : "Google"}
                        </Button>
                     </div>
                  </TooltipTrigger>
                  <TooltipContent>
                     <p>{googleEnabled ? "Войти через Google" : "Эта функция будет доступна скоро"}</p>
                  </TooltipContent>
               </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
               <Tooltip>
                  <TooltipTrigger asChild>
                     <div className="w-full">
                        {" "}
                        {/* Wrapper div to properly position tooltip */}
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
                  </TooltipTrigger>
                  <TooltipContent>
                     <p>Эта функция будет доступна скоро</p>
                  </TooltipContent>
               </Tooltip>
            </TooltipProvider>
         </div>
      </>
   );
}
