"use client";

import { useState } from "react";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useApplyPromocodeMutation } from "@/hooks/promocodes/useApplyPromocodeMutation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Loader2, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function PromoCodeForm() {
   const [code, setCode] = useState("");
   const {
      mutate: applyPromocode,
      isPending,
      isSuccess,
      isError,
      error,
      data,
   } = useApplyPromocodeMutation();

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!code.trim()) return;

      applyPromocode(
         { code: code.trim() },
         {
            onSuccess: (data) => {
               toast.success("Промокод успешно применен.", {
                  description: `Ваша подписка теперь активна до: ${format(
                     new Date(data.new_end_date),
                     "dd.MM.yyyy"
                  )}`,
               });
               setCode("");
            },
            onError: (error) => {
               toast.error("Ошибка применения промокода", {
                  description:
                     error.response?.data?.detail ||
                     "Не удалось применить промокод",
               });
            },
         }
      );
   };

   return (
      <Card className="w-full">
         <CardHeader>
            <CardTitle>Применить промокод</CardTitle>
            <CardDescription>
               Введите промокод, чтобы получить дополнительные дни подписки
            </CardDescription>
         </CardHeader>
         <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                     value={code}
                     onChange={(e) => setCode(e.target.value.toUpperCase())}
                     placeholder="Введите промокод"
                     disabled={isPending || isSuccess}
                     className="flex-1"
                  />
                  <Button
                     type="submit"
                     disabled={isPending || !code.trim() || isSuccess}
                     className={cn(
                        "transition-all",
                        isSuccess && "bg-green-600 hover:bg-green-700"
                     )}
                  >
                     {isPending ? (
                        <>
                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                           Применение...
                        </>
                     ) : isSuccess ? (
                        <>
                           <CheckCircle2 className="mr-2 h-4 w-4" />
                           Применен
                        </>
                     ) : (
                        "Применить"
                     )}
                  </Button>
               </div>

               {isError && (
                  <Alert variant="destructive">
                     <AlertTitle>Ошибка</AlertTitle>
                     <AlertDescription>
                        {error.response?.data?.detail ||
                           "Не удалось применить промокод"}
                     </AlertDescription>
                  </Alert>
               )}

               {isSuccess && data && (
                  <Alert
                     variant="default"
                     className="bg-green-50 border-green-200"
                  >
                     <CheckCircle2 className="h-4 w-4" />
                     <AlertTitle>Промокод успешно применен!</AlertTitle>
                     <AlertDescription className="space-y-1">
                        <p>{data.message}</p>
                        <p className="font-medium">
                           Ваша подписка теперь активна до:{" "}
                           {format(new Date(data.new_end_date), "dd.MM.yyyy")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                           Добавлено дней: {data.days_added}
                        </p>
                     </AlertDescription>
                  </Alert>
               )}
            </form>
         </CardContent>
      </Card>
   );
}
