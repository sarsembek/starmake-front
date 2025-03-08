"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { SocialAuth } from "@/components/shared/auth/SocialAuth";

export default function RegisterPage() {
   const handleGoogleAuth = () => {
      // Implement Google auth logic
      console.log("Google auth clicked");
   };

   const handleTelegramAuth = () => {
      // Implement Telegram auth logic
      console.log("Telegram auth clicked");
   };

   return (
      <div className="flex min-h-screen flex-col md:flex-row">
         {/* Left side with full-height image */}
         <div className="relative w-full md:w-1/2 min-h-[30vh] md:min-h-screen">
            {/* Image (Lower z-index to be behind the overlay) */}
            <Image
               src="/img/portrait.png"
               alt="Портрет"
               fill
               className="object-cover z-0"
               priority
            />

            {/* Dark Overlay (Ensure it's above the image but not fully opaque) */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent z-10 pointer-events-none"></div>
         </div>

         {/* Right side - register form */}
         <div className="flex w-full items-center justify-center p-8 md:w-1/2">
            <div className="mx-auto w-full max-w-md space-y-6">
               <div className="space-y-2 text-center">
                  <h1 className="text-3xl font-bold">Регистрация</h1>
                  <p className="text-muted-foreground">
                     Создайте новый аккаунт
                  </p>
               </div>

               <div className="space-y-4">
                  <div className="space-y-2">
                     <label
                        htmlFor="email"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                     >
                        Эл. почта
                     </label>
                     <Input
                        id="email"
                        type="email"
                        placeholder="mail@example.com"
                        required
                     />
                  </div>
                  <div className="space-y-2">
                     <label
                        htmlFor="password"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                     >
                        Пароль
                     </label>
                     <Input id="password" type="password" required />
                  </div>
                  <div className="space-y-2">
                     <label
                        htmlFor="confirm-password"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                     >
                        Подтверждение пароля
                     </label>
                     <Input id="confirm-password" type="password" required />
                  </div>
                  <Button type="submit" className="w-full">
                     Зарегистрироваться
                  </Button>
               </div>

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
                  <Link
                     href="/login"
                     className="font-medium text-primary underline underline-offset-4"
                  >
                     Войти
                  </Link>
               </div>
            </div>
         </div>
      </div>
   );
}
