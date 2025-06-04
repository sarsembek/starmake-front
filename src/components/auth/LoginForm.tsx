"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoginMutation } from "@/hooks/auth/useLoginMutation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

export function LoginForm() {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [errorMessage, setErrorMessage] = useState("");
   const router = useRouter();

   const { mutate: login, isPending } = useLoginMutation();

   const handleLoginSuccess = () => {
      // Get any stored return path or the "from" parameter from URL
      const urlParams = new URLSearchParams(window.location.search);
      const fromParam = urlParams.get("from");
      const returnPath = localStorage.getItem("returnPath") || fromParam || "/";

      // Clear it from storage
      localStorage.removeItem("returnPath");

      // Clean up the URL if needed
      if (fromParam) {
         window.history.replaceState(
            {},
            document.title,
            window.location.pathname
         );
      }

      // Navigate to the return path
      // Add a small delay to ensure auth context is updated
      setTimeout(() => {
         router.push(returnPath);
      }, 100);
   };

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMessage("");

      login(
         { email, password },
         {
            onSuccess: handleLoginSuccess,
            onError: (err) => {
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
               disabled={isPending}
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
               disabled={isPending}
               required
            />
         </div>

         <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Выполняется вход..." : "Войти"}
         </Button>
      </form>
   );
}
