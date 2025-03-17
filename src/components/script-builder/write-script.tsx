"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export function WriteScript() {
   const [scenarioText, setScenarioText] = useState("");
   const [userMessage, setUserMessage] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const [aiResponse, setAiResponse] = useState<{
      idea: string;
      script: string;
      tags: string;
   } | null>(null);

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Handle form submission - in a real app, this would submit to your backend
      console.log("Submitting scenario:", scenarioText);
      window.location.href = "/script-builder/next-step"; // Navigate to the next step
   };

   const handleAskAi = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!userMessage.trim()) return;

      setIsLoading(true);

      try {
         // Simulate API call
         await new Promise((resolve) => setTimeout(resolve, 2000));

         // Mock response
         setAiResponse({
            idea: "История о том, как автосервис адаптировался к работе во время карантина",
            script:
               "В разгар пандемии наш автосервис столкнулся с беспрецедентными вызовами. Мы быстро адаптировались: внедрили бесконтактную приемку автомобилей, запустили онлайн-консультации и мобильный сервис. Это позволило нам не только выжить, но и привлечь новых клиентов.",
            tags: "#автосервис #пандемия #адаптация #бизнес",
         });
      } catch (error) {
         console.error("Error generating response:", error);
      } finally {
         setIsLoading(false);
      }
   };

   const handleRetry = () => {
      setAiResponse(null);
   };

   return (
      <div className="flex flex-col min-h-[calc(100vh-8rem)]">
         <div className="flex-1">
            <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
               {/* Left Section - Script Area */}
               <div>
                  <div className="mb-6">
                     <h1 className="text-2xl font-bold">Шаг 1. Сценарий</h1>
                     <p className="text-muted-foreground">
                        Напишите текст озвучки
                     </p>
                  </div>

                  <form onSubmit={handleSubmit}>
                     <Textarea
                        value={scenarioText}
                        onChange={(e) => setScenarioText(e.target.value)}
                        placeholder="Введите ваш сценарий здесь..."
                        className="min-h-[300px] bg-background border-input"
                     />
                  </form>
               </div>

               {/* Right Section - AI Bot */}
               <Card className="border bg-card">
                  <CardContent className="p-6">
                     {aiResponse ? (
                        <div className="space-y-4">
                           <div className="p-4 bg-accent/30 rounded-lg">
                              <p className="mb-1 font-medium">Идея:</p>
                              <p className="text-muted-foreground">
                                 {aiResponse.idea}
                              </p>
                           </div>

                           <div className="p-4 bg-accent/30 rounded-lg">
                              <p className="mb-1 font-medium">Текст озвучки:</p>
                              <p className="text-muted-foreground">
                                 {aiResponse.script}
                              </p>
                           </div>

                           <div className="p-4 bg-accent/30 rounded-lg">
                              <p className="mb-1 font-medium">Теги:</p>
                              <p className="text-muted-foreground">
                                 {aiResponse.tags}
                              </p>
                           </div>

                           <div className="flex gap-3 mt-4">
                              <Button
                                 variant="outline"
                                 size="sm"
                                 onClick={handleRetry}
                              >
                                 Переделать
                              </Button>
                              <Button
                                 variant="outline"
                                 size="sm"
                                 onClick={() => {
                                    setUserMessage("");
                                    setAiResponse(null);
                                 }}
                              >
                                 Написать другой запрос
                              </Button>
                           </div>
                        </div>
                     ) : (
                        <>
                           <div className="text-center mb-4">
                              <h2 className="text-xl font-bold">Нет идей?</h2>
                              <p className="text-muted-foreground">
                                 Спросите у AI сценариста
                              </p>
                           </div>

                           <div className="flex justify-center mb-4">
                              <div className="relative p-4 rounded-xl bg-gradient-to-b from-primary/10 to-primary/5 border border-primary/20">
                                 <Image
                                    src="/img/botpic.png"
                                    alt="AI Assistant"
                                    width={240}
                                    height={180}
                                    className="object-contain z-10 relative"
                                 />
                                 <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-xl opacity-70 z-0"></div>
                              </div>
                           </div>

                           {isLoading ? (
                              <div className="text-center py-8">
                                 <p className="text-lg">
                                    Подождите, идет обработка запроса...
                                 </p>
                              </div>
                           ) : (
                              <form
                                 onSubmit={handleAskAi}
                                 className="space-y-4"
                              >
                                 <Textarea
                                    value={userMessage}
                                    onChange={(e) =>
                                       setUserMessage(e.target.value)
                                    }
                                    placeholder="История про работу автосервиса во время карантина...."
                                    className="bg-background border-input"
                                    rows={4}
                                 />
                                 <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={!userMessage.trim()}
                                 >
                                    Спросить Starmake AI
                                 </Button>
                              </form>
                           )}
                        </>
                     )}
                  </CardContent>
               </Card>
            </div>
         </div>
      </div>
   );
}
