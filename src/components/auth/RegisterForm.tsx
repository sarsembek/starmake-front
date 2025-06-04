"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRegisterMutation } from "@/hooks/auth/useRegistrationMutation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function RegisterForm() {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [errorMessage, setErrorMessage] = useState("");
   const router = useRouter();

   const { mutate: register, isPending } = useRegisterMutation();

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMessage("");

      // Check if passwords match
      if (password !== confirmPassword) {
         setErrorMessage("Пароли не совпадают");
         return;
      }

      // Password strength validation (optional)
      if (password.length < 8) {
         setErrorMessage("Пароль должен быть не менее 8 символов");
         return;
      }

      register(
         { email, password },
         {
            onSuccess: () => {
               // Redirect to success page with email parameter
               router.push(`/register-success?email=${encodeURIComponent(email)}`);
            },
            onError: (err) => {
               if (err.response?.status === 400) {
                  setErrorMessage("Этот email уже зарегистрирован");
               } else if (err.response?.status === 422) {
                  const validationErrors = err.response.data.detail;
                  if (
                     Array.isArray(validationErrors) &&
                     validationErrors.length > 0
                  ) {
                     setErrorMessage(validationErrors[0].msg);
                  } else {
                     setErrorMessage("Ошибка в данных формы");
                  }
               } else {
                  setErrorMessage(
                     "Ошибка регистрации. Пожалуйста, попробуйте снова."
                  );
               }
            },
         }
      );
   };

   return (
      <form onSubmit={handleSubmit} className="space-y-4">
         {errorMessage && (
            <Alert variant="destructive">
               <AlertCircle className="h-4 w-4" />
               <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
         )}

         <div className="space-y-2">
            <label
               htmlFor="register-email"
               className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
               Эл. почта
            </label>
            <Input
               id="register-email"
               type="email"
               placeholder="mail@example.com"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               disabled={isPending}
               required
            />
         </div>

         <div className="space-y-2">
            <label
               htmlFor="register-password"
               className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
               Пароль
            </label>
            <Input
               id="register-password"
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
            {isPending ? "Регистрация..." : "Зарегистрироваться"}
         </Button>
      </form>
   );
}
