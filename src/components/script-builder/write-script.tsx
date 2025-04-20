"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useLastScript } from "@/hooks/sandbox/useLastScript";
import { useCreateScenario } from "@/hooks/sandbox/useCreateScenario";
import { useGenerateResponse } from "@/hooks/sandbox/useGenerateResponse";

interface AIResponse {
   idea: string;
   script: string;
   tags: string;
}

export function WriteScript() {
   const router = useRouter();
   const [scenarioText, setScenarioText] = useState("");
   const [userMessage, setUserMessage] = useState("");
   const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
   const [tempId, setTempId] = useState<string>("");

   // Fetch last script
   const { data: lastScript } = useLastScript();

   // Mutations
   const createScenarioMutation = useCreateScenario();
   const generateResponseMutation = useGenerateResponse();

   // Set initial scenario text from last script if available
   useEffect(() => {
      if (lastScript && !scenarioText) {
         setScenarioText(lastScript.text);
      }
   }, [lastScript, scenarioText]);

   // Generate temp ID for retry tracking
   useEffect(() => {
      setTempId(uuidv4());
   }, []);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!scenarioText.trim()) return;

      try {
         // Show loading state while sending request
         const response = await createScenarioMutation.mutateAsync({
            text: scenarioText, // Changed from 'script' to 'text'
            temp_id: tempId,
            title: "Script from Builder", // Still sent but not used by API
         });

         // Only navigate after the request is successful and we have a response
         if (response && response.id) {
            // Navigate to success page
            router.push("/script-builder/next-step");
         } else {
            console.error("Invalid response from server:", response);
            throw new Error("Failed to create scenario: Invalid response");
         }
      } catch (error) {
         console.error("Error saving scenario:", error);
         // You might want to show an error message to the user here
      }
   };

   const handleAskAi = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!userMessage.trim()) return;

      try {
         const response = await generateResponseMutation.mutateAsync({
            user_message: userMessage,
            source: "write_script",
         });

         // Ensure we have a valid response
         if (response && typeof response === "object") {
            setAiResponse(response);
         } else {
            console.error("Invalid response format:", response);
            throw new Error("Received invalid response format");
         }
      } catch (error) {
         console.error("Error generating response:", error);
      }
   };

   const handleRetry = () => {
      setAiResponse(null);
   };

   const handleUseAiResponse = () => {
      if (aiResponse) {
         setScenarioText(aiResponse.script);
         setAiResponse(null);
      }
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

                     <div className="mt-4">
                        <Button
                           type="submit"
                           disabled={
                              createScenarioMutation.isPending ||
                              !scenarioText.trim()
                           }
                        >
                           {createScenarioMutation.isPending
                              ? "Сохранение..."
                              : "Сохранить и продолжить"}
                        </Button>
                     </div>
                  </form>
               </div>

               {/* Right Section - AI Assistant */}
               <div>
                  <Card className="bg-muted border">
                     <CardContent className="p-6">
                        {aiResponse ? (
                           <div className="space-y-4">
                              <div className="p-4 bg-primary/10 rounded-lg">
                                 <p className="mb-1 font-medium">Идея:</p>
                                 <p className="text-muted-foreground">
                                    {aiResponse.idea}
                                 </p>
                              </div>

                              <div className="p-4 bg-primary/10 rounded-lg">
                                 <p className="mb-1 font-medium">
                                    Текст озвучки:
                                 </p>
                                 <p className="text-muted-foreground">
                                    {aiResponse.script}
                                 </p>
                              </div>

                              <div className="p-4 bg-primary/10 rounded-lg">
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
                                 <Button
                                    size="sm"
                                    onClick={handleUseAiResponse}
                                 >
                                    Использовать этот текст
                                 </Button>
                              </div>
                           </div>
                        ) : (
                           <>
                              <div className="text-center mb-4">
                                 <h2 className="text-xl font-bold">
                                    Нет идей?
                                 </h2>
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

                              {generateResponseMutation.isPending ? (
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
                                       disabled={
                                          !userMessage.trim() ||
                                          generateResponseMutation.isPending
                                       }
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
      </div>
   );
}
