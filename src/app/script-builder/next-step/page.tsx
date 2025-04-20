import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function NextStepPage() {
   return (
      <main className="min-h-screen">
         <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto mt-20">
               <Card className="bg-primary/10 border">
                  <CardContent className="p-8 text-center">
                     <h1 className="text-3xl font-bold mb-6">
                        Сценарий успешно создан!
                     </h1>
                     <p className="text-lg mb-8">
                        Ваш сценарий был успешно сохранен. Теперь вы можете
                        перейти к следующему шагу.
                     </p>
                     <div className="flex justify-center gap-4">
                        <Link href="/" passHref>
                           <Button variant="outline">
                              Вернуться на главную
                           </Button>
                        </Link>
                        <Link href="/profile?tab=scenarios" passHref>
                           <Button>Перейти к моим сценариям</Button>
                        </Link>
                     </div>
                  </CardContent>
               </Card>
            </div>
         </div>
      </main>
   );
}
