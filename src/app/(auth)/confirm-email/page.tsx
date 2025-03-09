"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEmailConfirmation } from "@/hooks/auth/useEmailConfirmation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
// Import useAuth directly instead of the redirect hook
import { useAuth } from "@/context/AuthContext";

export default function EmailConfirmationPage() {
   const searchParams = useSearchParams();
   const router = useRouter();
   const [errorMessage, setErrorMessage] = useState<string | null>(null);

   // Get auth state but don't redirect - we want to allow email confirmation even when logged in
   const { isAuthenticated } = useAuth();

   const {
      mutate: confirmEmail,
      isPending,
      isSuccess,
      isError,
   } = useEmailConfirmation();

   useEffect(() => {
      const tokenFromUrl = searchParams.get("token");
      if (tokenFromUrl) {
         // Use the token directly without storing in state
         confirmEmail(
            { token: tokenFromUrl },
            {
               onError: (err) => {
                  // Check specifically for the "Invalid or expired token" message
                  if (err.response && typeof err.response.data.detail === 'string' && err.response.data.detail === "Invalid or expired token") {
                     setErrorMessage(
                        "Некорректный или устаревший токен подтверждения."
                     );
                  } else if (err.response?.status === 422) {
                     setErrorMessage(
                        "Некорректный или устаревший токен подтверждения."
                     );
                  } else {
                     setErrorMessage(
                        "Ошибка подтверждения email. Пожалуйста, попробуйте снова."
                     );
                  }
               },
            }
         );
      } else {
         setErrorMessage("Не указан токен подтверждения.");
      }
   }, [searchParams, confirmEmail]);

   const goToLogin = () => {
      // If already authenticated, go to homepage instead
      router.push(isAuthenticated ? "/" : "/login");
   };

   return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
         <Card className="w-full max-w-md shadow-lg">
            <CardHeader className="text-center">
               <div className="flex justify-center mb-6">
                  <Logo href="/" size="lg" />
               </div>
               <CardTitle className="text-2xl">Подтверждение Email</CardTitle>
               <CardDescription>Проверка вашего email адреса</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               {isPending && (
                  <div className="flex flex-col items-center justify-center py-8">
                     <Loader2 className="h-12 w-12 animate-spin text-primary" />
                     <p className="mt-4 text-center text-sm text-muted-foreground">
                        Подтверждаем ваш email адрес...
                     </p>
                  </div>
               )}

               {isSuccess && (
                  <Alert className="border-green-500 bg-green-50">
                     <CheckCircle className="h-5 w-5 text-green-500" />
                     <AlertDescription className="text-green-700">
                        Ваш email успешно подтвержден! Теперь вы можете войти в
                        систему.
                     </AlertDescription>
                  </Alert>
               )}

               {isError && (
                  <Alert variant="destructive">
                     <AlertCircle className="h-5 w-5" />
                     <AlertDescription variant="destructive">
                        {errorMessage}
                     </AlertDescription>
                  </Alert>
               )}
            </CardContent>
            <CardFooter>
               <Button
                  onClick={goToLogin}
                  className="w-full"
                  disabled={isPending}
               >
                  {isSuccess
                     ? isAuthenticated
                        ? "Перейти на главную"
                        : "Войти в систему"
                     : "Вернуться на страницу входа"}
               </Button>
            </CardFooter>
         </Card>
      </div>
   );
}
