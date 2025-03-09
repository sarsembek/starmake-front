"use client";

import Link from "next/link";
import Image from "next/image";
import { SocialAuth } from "@/components/shared/auth/SocialAuth";
import { Logo } from "@/components/shared/Logo";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useAuthRedirect } from "@/hooks/auth/useAuthRedirect";

export default function RegisterPage() {
   const router = useRouter();

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

   // Switch to login without adding to browser history
   const goToLogin = (e: React.MouseEvent) => {
      e.preventDefault();
      router.replace("/login");
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

         {/* Left side with full-height image - hidden on mobile */}
         <div className="hidden md:block relative md:w-1/2 md:min-h-screen">
            <Image
               src="/img/portrait.png"
               alt="Портрет"
               fill
               className="object-cover z-0"
               priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent z-10 pointer-events-none"></div>
         </div>

         {/* Right side - register form */}
         <div className="flex w-full min-h-screen items-center justify-center p-8 md:w-1/2">
            <div className="mx-auto w-full max-w-md space-y-6">
               <div className="md:text-center">
                  <Logo href="/" className="inline-block mb-6 mt-6" size="lg" />
                  <h1 className="text-3xl font-bold">Регистрация</h1>
                  <p className="text-muted-foreground">
                     Создайте новый аккаунт
                  </p>
               </div>

               <RegisterForm />

               <SocialAuth
                  onGoogleAuth={handleGoogleAuth}
                  onTelegramAuth={handleTelegramAuth}
               />

               <div className="text-xs text-muted-foreground">
                  Нажимая на одну из кнопок Зарегистрироваться, вы соглашаетесь
                  с{" "}
                  <Link
                     href="/terms"
                     className="font-medium text-primary hover:underline"
                  >
                     Пользовательским соглашением
                  </Link>
                  ,{" "}
                  <Link
                     href="/"
                     className="font-medium text-primary hover:underline"
                  >
                     StarMake
                  </Link>{" "}
                  и{" "}
                  <Link
                     href="/privacy"
                     className="font-medium text-primary hover:underline"
                  >
                     Политикой конфиденциальности
                  </Link>
                  , а также даете согласие на обработку{" "}
                  <Link
                     href="/data"
                     className="font-medium text-primary hover:underline"
                  >
                     Персональных данных
                  </Link>
                  .
               </div>

               <div className="text-center text-sm">
                  Уже есть аккаунт?{" "}
                  <a
                     href="/login"
                     onClick={goToLogin}
                     className="font-medium text-primary underline underline-offset-4"
                  >
                     Войти
                  </a>
               </div>
            </div>
         </div>
      </div>
   );
}
