"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useResetPasswordMutation } from "@/hooks/auth/useResetPasswordMutation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordPage() {
   const searchParams = useSearchParams();
   const router = useRouter();
   const token = searchParams.get("token");

   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [errorMessage, setErrorMessage] = useState("");

   const {
      mutate: resetPassword,
      isPending,
      // isError,
      // error,
      resetSuccess,
   } = useResetPasswordMutation();

   // Redirect to login page after successful reset
   useEffect(() => {
      if (resetSuccess) {
         const timeout = setTimeout(() => {
            router.push("/login");
         }, 3000);

         return () => clearTimeout(timeout);
      }
   }, [resetSuccess, router]);

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMessage("");

      // Validate password
      if (password.length < 8) {
         setErrorMessage("Пароль должен содержать минимум 8 символов");
         return;
      }

      // Check if passwords match
      if (password !== confirmPassword) {
         setErrorMessage("Пароли не совпадают");
         return;
      }

      if (!token) {
         setErrorMessage("Некорректная ссылка для сброса пароля");
         return;
      }

      resetPassword(
         { token, new_password: password },
         {
            onError: (err) => {
               if (err.response?.status === 400) {
                  setErrorMessage(
                     "Некорректный или устаревший токен сброса пароля"
                  );
               } else if (err.response?.status === 422) {
                  const validationErrors = err.response.data.detail;
                  if (
                     Array.isArray(validationErrors) &&
                     validationErrors.length > 0
                  ) {
                     setErrorMessage(validationErrors[0].msg);
                  } else {
                     setErrorMessage(
                        "Ошибка валидации. Проверьте правильность данных"
                     );
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

   // If no token provided, show error
   if (!token) {
      return (
         <div className="flex min-h-screen items-start justify-center pt-16 md:pt-24 p-4">
            <div className="mx-auto w-full max-w-md space-y-6">
               <div className="text-center">
                  <Logo href="/" className="inline-block mb-6" size="lg" />
                  <h1 className="text-2xl font-bold text-red-600">
                     Некорректная ссылка
                  </h1>
                  <p className="mt-2 text-muted-foreground">
                     Ссылка для сброса пароля недействительна или устарела.
                  </p>
                  <div className="mt-6">
                     <Button asChild>
                        <Link href="/forgot-password">
                           Запросить новую ссылку
                        </Link>
                     </Button>
                  </div>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="flex min-h-screen items-start justify-center pt-16 md:pt-24 p-4">
         <div className="mx-auto w-full max-w-md space-y-6">
            <div className="md:text-center">
               <Logo href="/" className="inline-block mb-6" size="lg" />
               <h1 className="text-3xl font-bold">Задать новый пароль</h1>
               <p className="text-muted-foreground">
                  Создайте новый пароль для вашей учетной записи
               </p>
            </div>

            {resetSuccess ? (
               <div className="space-y-4">
                  <Alert className="border-green-500 bg-green-50">
                     <CheckCircle className="h-5 w-5 text-green-600" />
                     <AlertDescription className="text-green-700">
                        Пароль успешно изменен! Вы будете перенаправлены на
                        страницу входа.
                     </AlertDescription>
                  </Alert>
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
                        htmlFor="password"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                     >
                        Новый пароль
                     </label>
                     <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isPending}
                        required
                     />
                  </div>

                  <div className="space-y-2">
                     <label
                        htmlFor="confirm-password"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                     >
                        Подтверждение пароля
                     </label>
                     <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isPending}
                        required
                     />
                  </div>

                  <Button type="submit" className="w-full" disabled={isPending}>
                     {isPending ? "Сохранение..." : "Сохранить новый пароль"}
                  </Button>
               </form>
            )}
         </div>
      </div>
   );
}
