"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoginMutation } from "@/hooks/auth/useLoginMutation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle, Mail } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

export function LoginForm() {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [errorMessage, setErrorMessage] = useState("");
   const router = useRouter();

   const {
      mutate: login,
      isPending,
      needsVerification,
      emailForVerification,
      resendConfirmationEmail,
      isResendingConfirmation,
      resendConfirmationSuccess,
   } = useLoginMutation();

   const handleLoginSuccess = () => {
      // Get any stored return path
      const returnPath = localStorage.getItem("returnPath") || "/";

      // Clear it from storage
      localStorage.removeItem("returnPath");

      // Navigate to the return path
      router.push(returnPath);
   };

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMessage("");

      login(
         { email, password },
         {
            onSuccess: handleLoginSuccess,
            onError: (err) => {
               // Don't set error message if it's the verification error
               // This is already handled by needsVerification state
               if (
                  err.response?.status === 403 &&
                  err.response.data.detail === "Please verify your email before logging in."
               ) {
                  // Don't set error message here
                  return;
               }
               
               if (err.response?.status === 422) {
                  setErrorMessage("Неверный формат email или пароля");
               } else if (err.response?.status === 401) {
                  setErrorMessage("Неверный email или пароль");
               } else {
                  setErrorMessage(
                     "Ошибка входа. Пожалуйста, попробуйте снова."
                  );
               }
            },
         }
      );
   };

   // Separate handler for resend button to prevent form submission
   const handleResendClick = (e: React.MouseEvent) => {
      e.preventDefault(); // Prevent any form submission
      resendConfirmationEmail();
   };

   return (
      <form onSubmit={handleSubmit} className="space-y-4">
         {errorMessage && (
            <Alert variant="destructive">
               <AlertCircle className="h-4 w-4" />
               <AlertDescription>
                  {errorMessage}
               </AlertDescription>
            </Alert>
         )}

         {needsVerification && (
            <Alert className="border-amber-500 bg-amber-50">
               <Mail className="h-5 w-5 text-amber-600" />
               <div className="ml-2 flex-1 space-y-2">
                  <AlertDescription className="text-amber-700">
                     Пожалуйста, подтвердите ваш email перед входом.
                     {!resendConfirmationSuccess && (
                        <Button
                           variant="link"
                           className="p-0 h-auto text-amber-700 font-medium underline underline-offset-4 ml-1"
                           onClick={handleResendClick}
                           disabled={isResendingConfirmation}
                        >
                           {isResendingConfirmation
                              ? "Отправка..."
                              : "Отправить письмо повторно"}
                        </Button>
                     )}
                  </AlertDescription>
                  {resendConfirmationSuccess && (
                     <div className="flex items-start gap-2 mt-2 bg-green-100 p-2 rounded text-sm text-green-800">
                        <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
                        <span>
                           Письмо для подтверждения отправлено на адрес{" "}
                           {emailForVerification}
                        </span>
                     </div>
                  )}
               </div>
            </Alert>
         )}

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
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               disabled={isPending || isResendingConfirmation}
               required
            />
         </div>

         <div className="space-y-2">
            <div className="flex items-center justify-between">
               <label
                  htmlFor="password"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
               >
                  Пароль
               </label>
               <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-primary hover:underline"
               >
                  Забыли пароль?
               </Link>
            </div>
            <Input
               id="password"
               type="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               disabled={isPending || isResendingConfirmation}
               required
            />
         </div>

         <Button
            type="submit"
            className="w-full"
            disabled={isPending || isResendingConfirmation}
         >
            {isPending ? "Выполняется вход..." : "Войти"}
         </Button>
      </form>
   );
}
