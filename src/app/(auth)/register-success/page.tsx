"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Mail } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";

export default function RegisterSuccessPage() {
   const router = useRouter();
   const searchParams = useSearchParams();
   const [email, setEmail] = useState("");

   useEffect(() => {
      // Get email from URL params
      const emailParam = searchParams.get("email");
      if (emailParam) {
         setEmail(emailParam);
      }
   }, [searchParams]);

   const handleGoToLogin = () => {
      router.push("/login");
   };

   const handleGoHome = () => {
      router.push("/");
   };

   return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
         <div className="max-w-md w-full space-y-8">
            <div className="text-center">
               <Logo href="/" className="mx-auto mb-8" size="lg" />
            </div>

            <Card className="shadow-lg">
               <CardHeader className="text-center pb-4">
                  <div className="mx-auto bg-green-100 rounded-full p-4 mb-4">
                     <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-green-800">
                     Регистрация успешна!
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-2">
                     Подтвердите ваш email адрес для завершения регистрации
                  </CardDescription>
               </CardHeader>

               <CardContent className="space-y-6">
                  {email && (
                     <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-sm text-green-800">
                           <span className="font-medium">Email:</span> {email}
                        </p>
                     </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                     <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                           <h3 className="text-sm font-medium text-blue-800 mb-1">
                              Письмо с подтверждением отправлено
                           </h3>
                           <p className="text-sm text-blue-700">
                              Мы отправили письмо с подтверждением на ваш email
                              адрес. Пожалуйста, проверьте почту и перейдите по
                              ссылке для подтверждения аккаунта.
                           </p>
                           <p className="text-xs text-blue-600 mt-2">
                              Не забудьте проверить папку &quot;Спам&quot;, если
                              письмо не пришло.
                           </p>
                        </div>
                     </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                     <p className="text-sm text-amber-800 text-center">
                        После подтверждения email вы сможете войти в систему
                     </p>
                  </div>

                  <div className="space-y-3">
                     <Button
                        onClick={handleGoToLogin}
                        className="w-full"
                        size="lg"
                     >
                        Перейти к входу
                     </Button>

                     <Button
                        onClick={handleGoHome}
                        variant="outline"
                        className="w-full"
                        size="lg"
                     >
                        На главную
                     </Button>
                  </div>
               </CardContent>
            </Card>

            <div className="text-center">
               <p className="text-sm text-gray-500">
                  Возникли проблемы?{" "}
                  <a
                     href="mailto:support@starmake.ai"
                     className="font-medium text-primary hover:underline"
                  >
                     Обратитесь в поддержку
                  </a>
               </p>
            </div>
         </div>
      </div>
   );
}
