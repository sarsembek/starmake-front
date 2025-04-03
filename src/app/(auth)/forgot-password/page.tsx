// src/app/(auth)/forgot-password/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForgotPasswordMutation } from "@/hooks/auth/useForgotPasswordMutation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
   const [email, setEmail] = useState("");
   const [errorMessage, setErrorMessage] = useState("");
   const router = useRouter();

   const {
      mutate: requestReset,
      isPending,
      // isError,
      // error,
      emailSent,
   } = useForgotPasswordMutation();

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMessage("");

      // Basic email validation
      if (!email || !email.includes("@")) {
         setErrorMessage("Пожалуйста, введите корректный email адрес");
         return;
      }

      requestReset(
         { email },
         {
            onError: (err) => {
               if (err.response?.status === 422) {
                  const validationErrors = err.response.data.detail;
                  if (
                     Array.isArray(validationErrors) &&
                     validationErrors.length > 0
                  ) {
                     setErrorMessage(validationErrors[0].msg);
                  } else {
                     setErrorMessage("Некорректный email адрес");
                  }
               } else {
                  setErrorMessage(
                     "Ошибка сервера. Пожалуйста, попробуйте позже."
                  );
               }
            },
         }
      );
   };

   const goBack = () => {
      router.back();
   };

   return (
      <div className="flex min-h-screen flex-col">
         {/* Back button */}
         <div className="flex items-center p-6">
            <button
               onClick={goBack}
               className="inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4 rounded-md"
            >
               <ArrowLeft className="mr-2 h-4 w-4" />
               Назад
            </button>
         </div>

         <div className="flex-1 flex items-start justify-center pt-16 md:pt-24 px-4 md:px-8">
            <div className="mx-auto w-full max-w-md space-y-6">
               <div className="md:text-center space-y-2">
                  <Logo href="/" className="inline-block mb-6" size="lg" />
                  <h1 className="text-3xl font-bold">Восстановление пароля</h1>
                  <p className="text-muted-foreground">
                     Введите email для отправки инструкции по сбросу пароля
                  </p>
               </div>

               {emailSent ? (
                  <div className="space-y-4">
                     <Alert className="border-green-500 bg-green-50">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <AlertDescription className="text-green-700">
                           Инструкция по сбросу пароля отправлена на указанный
                           email. Пожалуйста, проверьте вашу почту и следуйте
                           инструкциям.
                        </AlertDescription>
                     </Alert>
                     <div className="flex flex-col space-y-4">
                        <Button asChild>
                           <Link href="/login">
                              Вернуться на страницу входа
                           </Link>
                        </Button>
                     </div>
                  </div>
               ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                     {errorMessage && (
                        <Alert variant="destructive">
                           <AlertCircle className="h-4 w-4" />
                           <AlertDescription>{errorMessage}</AlertDescription>
                        </Alert>
                     )}

                     <div className="space-y-2">
                        <label
                           htmlFor="email"
                           className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                           Email
                        </label>
                        <Input
                           id="email"
                           type="email"
                           placeholder="mail@example.com"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           disabled={isPending}
                           required
                        />
                     </div>

                     <Button
                        type="submit"
                        className="w-full"
                        disabled={isPending}
                     >
                        {isPending ? "Отправка..." : "Отправить инструкцию"}
                     </Button>

                     <div className="text-center text-sm">
                        <Link
                           href="/login"
                           className="font-medium text-primary underline underline-offset-4"
                        >
                           Вернуться на страницу входа
                        </Link>
                     </div>
                  </form>
               )}
            </div>
         </div>
      </div>
   );
}
