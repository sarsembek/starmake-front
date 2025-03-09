"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRegisterMutation } from "@/hooks/auth/useRegistrationMutation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Mail, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";

export function RegisterForm() {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [errorMessage, setErrorMessage] = useState("");
   const [showSuccessDialog, setShowSuccessDialog] = useState(false);
   const [registeredEmail, setRegisteredEmail] = useState("");
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
               // Store the email for displaying in the success dialog
               setRegisteredEmail(email);
               // Show success dialog instead of immediate redirect
               setShowSuccessDialog(true);
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

   const handleDialogClose = () => {
      setShowSuccessDialog(false);
      router.push("/login?registered=true");
   };

   return (
      <>
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

         {/* Email Confirmation Dialog */}
         <Dialog open={showSuccessDialog} onOpenChange={handleDialogClose}>
            <DialogContent className="sm:max-w-md">
               <DialogHeader>
                  <div className="mx-auto bg-green-100 rounded-full p-3 mb-4">
                     <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <DialogTitle className="text-center text-xl">
                     Регистрация прошла успешно!
                  </DialogTitle>
                  <DialogDescription className="text-center">
                     Письмо для подтверждения отправлено на адрес{" "}
                     <span className="font-medium">{registeredEmail}</span>
                  </DialogDescription>
               </DialogHeader>
               <div className="flex flex-col items-center gap-4 py-4">
                  <div className="bg-muted rounded-lg p-4 flex items-start gap-4">
                     <Mail className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                     <div className="text-sm">
                        <p className="mb-2">
                           Пожалуйста, проверьте вашу электронную почту и
                           перейдите по ссылке, чтобы подтвердить ваш email
                           адрес.
                        </p>
                        <p>
                           Если вы не получили письмо, проверьте папку
                           &quot;Спам&quot; или попробуйте войти с указанной
                           электронной почтой для повторной отправки письма.
                        </p>
                     </div>
                  </div>
               </div>
               <DialogFooter className="sm:justify-center">
                  <Button onClick={handleDialogClose}>
                     Перейти к странице входа
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </>
   );
}
