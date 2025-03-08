"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { SocialAuth } from "@/components/shared/auth/SocialAuth";

export default function LoginPage() {
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
         {/* Left side - placeholder for image */}
         <div
            className="flex w-full items-center justify-center 
           bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-500 
           p-8 md:w-1/2"
         >
            <Image
               src="/img/stats-section.png"
               alt="Статистика"
               width={400}
               height={400}
            />
         </div>
         {/* Right side - login form */}
         <div className="flex w-full items-center justify-center p-8 md:w-1/2">
            <div className="mx-auto w-full max-w-md space-y-6">
               <div className="space-y-2 text-center">
                  <h1 className="text-3xl font-bold">Вход</h1>
                  <p className="text-muted-foreground">
                     Введите данные для входа
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
                  <Button type="submit" className="w-full">
                     Войти
                  </Button>
               </div>

               <SocialAuth
                  onGoogleAuth={handleGoogleAuth}
                  onTelegramAuth={handleTelegramAuth}
               />

               <div className="text-center text-sm">
                  Нет аккаунта?{" "}
                  <Link
                     href="/register"
                     className="font-medium text-primary underline underline-offset-4"
                  >
                     Зарегистрироваться
                  </Link>
               </div>
            </div>
         </div>
      </div>
   );
}
