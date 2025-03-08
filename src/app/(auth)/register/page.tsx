import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export const metadata: Metadata = {
   title: "Register",
   description: "Create a new account",
};

export default function RegisterPage() {
   return (
      <div className="flex min-h-screen flex-col md:flex-row">
         {/* Left side with full-height image */}
         <div className="relative w-full md:w-1/2 min-h-[30vh] md:min-h-screen">
            <Image
               src="/img/portrait.png"
               alt="Portrait"
               fill
               className="object-cover"
               priority
            />
         </div>

         {/* Right side - register form */}
         <div className="flex w-full items-center justify-center p-8 md:w-1/2">
            <div className="mx-auto w-full max-w-md space-y-6">
               <div className="space-y-2 text-center">
                  <h1 className="text-3xl font-bold">Register</h1>
                  <p className="text-muted-foreground">Create a new account</p>
               </div>

               <div className="space-y-4">
                  <div className="space-y-2">
                     <label
                        htmlFor="email"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                     >
                        Email
                     </label>
                     <input
                        id="email"
                        type="email"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="m@example.com"
                        required
                     />
                  </div>
                  <div className="space-y-2">
                     <label
                        htmlFor="password"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                     >
                        Password
                     </label>
                     <input
                        id="password"
                        type="password"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                     />
                  </div>
                  <div className="space-y-2">
                     <label
                        htmlFor="confirm-password"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                     >
                        Confirm Password
                     </label>
                     <input
                        id="confirm-password"
                        type="password"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                     />
                  </div>
                  <Button type="submit" className="w-full">
                     Register
                  </Button>
               </div>

               <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                     <span className="w-full border-t"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                     <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
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

               <div className="text-xs text-muted-foreground">
                  Нажимая на одну из кнопок Зарегистрироваться, вы соглашаетесь
                  с Пользовательским соглашением, StarMake и Политикой
                  конфиденциальности, а также даете согласие на обработку
                  Персональных данных.
               </div>

               <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Link
                     href="/login"
                     className="font-medium text-primary underline underline-offset-4"
                  >
                     Login
                  </Link>
               </div>
            </div>
         </div>
      </div>
   );
}
