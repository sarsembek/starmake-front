import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export const metadata: Metadata = {
   title: "Вход",
   description: "Вход в аккаунт",
};

export default function LoginPage() {
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
                     <input
                        id="email"
                        type="email"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                     <input
                        id="password"
                        type="password"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                     />
                  </div>
                  <Button type="submit" className="w-full">
                     Войти
                  </Button>
               </div>

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
                  <Button variant="outline" className="w-full">
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                     >
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M8 12h8"></path>
                        <path d="M12 8v8"></path>
                     </svg>
                     Google
                  </Button>
                  <Button variant="outline" className="w-full">
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                     >
                        <path d="m22 8-6 4 6 4V8Z"></path>
                        <rect width="16" height="16" x="2" y="4" rx="2"></rect>
                     </svg>
                     Telegram
                  </Button>
               </div>

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
