"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
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
                     Ваш аккаунт был успешно создан
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
                     <p className="text-sm text-blue-800">
                        Теперь вы можете войти в систему, используя свои учетные данные.
                     </p>
                  </div>

                  <div className="space-y-3">
                     <Button 
                        onClick={handleGoToLogin} 
                        className="w-full"
                        size="lg"
                     >
                        Войти в аккаунт
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
