"use client";

import Image from "next/image";
import { SocialAuth } from "@/components/shared/auth/SocialAuth";
import { Logo } from "@/components/shared/Logo";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoginForm } from "@/components/auth/LoginForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuthRedirect } from "@/hooks/auth/useAuthRedirect";

export default function LoginPage() {
   const router = useRouter();
   const searchParams = useSearchParams();
   const isRegistered = searchParams.get("registered") === "true";

   // Redirect authenticated users to home page
   useAuthRedirect();

   const handleGoogleAuth = () => {
      // Implement Google auth logic
      console.log("Google auth clicked");
   };

   const handleTelegramAuth = () => {
      // Implement Telegram auth logic
      console.log("Telegram auth clicked");
   };

   // Switch to register without adding to browser history
   const goToRegister = (e: React.MouseEvent) => {
      e.preventDefault();
      router.replace("/register");
   };

   // Go back to previous page (likely home)
   const goBack = () => {
      router.back();
   };

   return (
      <div className="flex min-h-screen flex-col md:flex-row">
         {/* Back button - visible on all screen sizes */}
         <Button
            variant="ghost"
            size="icon"
            onClick={goBack}
            className="absolute top-4 left-4 z-50"
         >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Назад</span>
         </Button>

         {/* Left side - placeholder for image - hidden on mobile */}
         <div
            className="hidden md:flex md:w-1/2 items-center justify-center 
           bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-500"
         >
            <Image
               src="/img/stats-section.png"
               alt="Статистика"
               width={400}
               height={400}
            />
         </div>

         {/* Right side - login form */}
         <div className="flex w-full min-h-screen items-center justify-center p-8 md:w-1/2">
            <div className="mx-auto w-full max-w-md space-y-6">
               <div className="md:text-center">
                  <Logo href="/" className="inline-block mb-6" size="lg" />
                  <h1 className="text-3xl font-bold">Вход</h1>
                  <p className="text-muted-foreground">
                     Введите данные для входа
                  </p>
               </div>

               {isRegistered && (
                  <Alert className="border-green-500 bg-green-50">
                     <CheckCircle className="h-4 w-4 text-green-500" />
                     <AlertDescription className="text-green-700">
                        Регистрация успешна! Пожалуйста, подтвердите ваш email
                        адрес, перейдя по ссылке в письме.
                     </AlertDescription>
                  </Alert>
               )}

               <LoginForm />

               <SocialAuth
                  onGoogleAuth={handleGoogleAuth}
                  onTelegramAuth={handleTelegramAuth}
               />

               <div className="text-center text-sm">
                  Нет аккаунта?{" "}
                  <a
                     href="/register"
                     onClick={goToRegister}
                     className="font-medium text-primary underline underline-offset-4"
                  >
                     Зарегистрироваться
                  </a>
               </div>
            </div>
         </div>
      </div>
   );
}
