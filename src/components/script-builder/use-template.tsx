"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { axiosWithAuth } from "@/lib/axios";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Template data
const loudStartOptions = [
   "Нам на это потребовалось 2 года, а ты узнаешь это за 30 секунд",
   "90% людей допускают эту ошибку",
   "Было ли у тебя такое, когда (ситуация из жизни). Что с этим делать?",
   "Мы потратили на это более $1000 денег, чтобы я смог",
   "Для всех у кого есть проблемы в __________ вот что нужно делать",
   "Благодаря этой вещи, у меня наконец-то __________________",
   "ТОП-5 причин, почему вам нужно ____________",
   "Мы раньше такого никогда не делали…",
   "Об этом секрете никто кто говорит, если вы…",
   "Вот что вам стоит знать, если вы _____",
   "Подготовьтесь к потрясающему событию (дата)",
   "Не надо делать так _______",
   "Сравниваем _____ (товар) с этим (товаром)",
   "Проверь себя на эту ошибку…",
   "Неприятный факт о …",
   "У меня не получалось …., пока я …",
   "План из 3 шагов для …",
   "Главный признак, что …",
   "Вот что будет, если…",
   "Не все ещё это поняли, но…",
   "Самая частая причина …",
   "Главный инсайт за/после …",
   "Сейчас я тебе докажу, что …",
   "После этого у тебя будет …/ после этого ты сможешь …",
   "Вот что изменится, когда ты…",
   "Это действие помогло мне…",
   "Если бы я сейчас начинал(а)…..",
   "Я не знаю, как это работает, но …",
   "Никогда не говори …/ никогда не делай…",
   "У меня ушло … лет, чтобы понять: …",
   "Общая черта людей, которые ...",
   "С чего начать ….",
   "Я знаю, почему ты …",
   "Если ты правда хочешь …",
   "У тебя тоже такое было: …",
   "Когда тебя спрашивают: …",
   "Самый бесполезный совет …",
   "Почему пора перестать …",
   "Самый важный навык для …",
   "Это плохой/хороший сигнал, если …",
   "Простой тест на ….",
   "Вот что отделяет тебя от …",
   "Никто уже так не делает: …"
];

const textAmplifierOptions = [
   "Хватит это терпеть",
   "Мы готовились к этому 2 года",
   "Теперь я расскажу как исправить",
   "Чтобы решить эти проблемы, смотрите видео до конца",
   // Add more options as needed
];

export function UseTemplate() {
   const router = useRouter();
   const [formData, setFormData] = useState({
      loudStart: "",
      textAmplifier: "",
      mainText: "",
      callToAction: "",
   });
   const [selectedLoudStart, setSelectedLoudStart] = useState("");
   const [selectedAmplifier, setSelectedAmplifier] = useState("");
   const [showError, setShowError] = useState(false);
   const [userMessage, setUserMessage] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const [aiResponse, setAiResponse] = useState<{
      idea: string;
      script: string;
      tags: string;
   } | null>(null);
   const [formSubmitting, setFormSubmitting] = useState(false);

   const handleInputChange = (field: string, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
   };

   // Define handleSubmit with useCallback to avoid dependency cycle
   const handleSubmit = useCallback(
      async (e: React.FormEvent) => {
         e.preventDefault();

         // Check if all fields are filled
         if (
            !formData.loudStart ||
            !formData.textAmplifier ||
            !formData.mainText ||
            !formData.callToAction
         ) {
            setShowError(true);
            return;
         }

         setShowError(false);
         setFormSubmitting(true);

         try {
            // Create a combined script text from all template parts
            const fullText = `${formData.loudStart}\n\n${formData.textAmplifier}\n\n${formData.mainText}\n\n${formData.callToAction}`;

            // Create a temp ID for tracking
            const tempId = uuidv4();

            // Send the data to the API
            const response = await axiosWithAuth.post("/sandbox/scenarios", {
               text: fullText,
               temp_id: tempId,
            });

            if (response.data) {
               // Navigate to success page on successful submission
               router.push("/script-builder/next-step");
            }
         } catch (error) {
            console.error("Error submitting template:", error);
            // Show error message
         } finally {
            setFormSubmitting(false);
         }
      },
      [formData, router, setShowError, setFormSubmitting]
   );

   // Listen for form submission request from layout
   useEffect(() => {
      const handleFormSubmitRequest = () => {
         // Trigger form submission
         const syntheticEvent = {
            preventDefault: () => {},
         } as React.FormEvent<HTMLFormElement>;
         handleSubmit(syntheticEvent);
      };

      // Add event listener
      window.addEventListener(
         "scriptbuilder:submitform",
         handleFormSubmitRequest
      );

      // Clean up
      return () => {
         window.removeEventListener(
            "scriptbuilder:submitform",
            handleFormSubmitRequest
         );
      };
   }, [handleSubmit]);

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
            {showError && (
               <Alert variant="destructive" className="mb-6 max-w-6xl mx-auto">
                  <AlertDescription>
                     Пожалуйста, заполните все поля перед отправкой!
                  </AlertDescription>
               </Alert>
            )}

            <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
               {/* Left Section - Template Form */}
               <div>
                  <div className="mb-6">
                     <h1 className="text-2xl font-bold">Шаг 1. Сценарий</h1>
                     <p className="text-muted-foreground">
                        Напишите текст озвучки
                     </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                     <div className="space-y-2">
                        <h3 className="text-lg font-medium">
                           Выберите громкое начало
                        </h3>
                        <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                              <Button
                                 variant="outline"
                                 className="w-full justify-between"
                              >
                                 {selectedLoudStart ||
                                    "Выберите громкое начало"}
                                 <ChevronDown className="h-4 w-4 opacity-50" />
                              </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                              {loudStartOptions.map((option, index) => (
                                 <DropdownMenuItem
                                    key={index}
                                    onClick={() => {
                                       setSelectedLoudStart(option);
                                       handleInputChange("loudStart", option);
                                    }}
                                 >
                                    {option}
                                 </DropdownMenuItem>
                              ))}
                           </DropdownMenuContent>
                        </DropdownMenu>
                        <Textarea
                           value={formData.loudStart}
                           onChange={(e) =>
                              handleInputChange("loudStart", e.target.value)
                           }
                           placeholder="Введите громкое начало..."
                           className="bg-background border-input"
                        />
                     </div>

                     <div className="space-y-2">
                        <h3 className="text-lg font-medium">
                           Выберите усилитель для текста
                        </h3>
                        <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                              <Button
                                 variant="outline"
                                 className="w-full justify-between"
                              >
                                 {selectedAmplifier ||
                                    "Выберите усилитель для текста"}
                                 <ChevronDown className="h-4 w-4 opacity-50" />
                              </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                              {textAmplifierOptions.map((option, index) => (
                                 <DropdownMenuItem
                                    key={index}
                                    onClick={() => {
                                       setSelectedAmplifier(option);
                                       handleInputChange(
                                          "textAmplifier",
                                          option
                                       );
                                    }}
                                 >
                                    {option}
                                 </DropdownMenuItem>
                              ))}
                           </DropdownMenuContent>
                        </DropdownMenu>
                        <Textarea
                           value={formData.textAmplifier}
                           onChange={(e) =>
                              handleInputChange("textAmplifier", e.target.value)
                           }
                           placeholder="Введите усилитель текста..."
                           className="bg-background border-input"
                        />
                     </div>

                     <div className="space-y-2">
                        <h3 className="text-lg font-medium">
                           Расскажите ваш основной текст
                        </h3>
                        <Textarea
                           value={formData.mainText}
                           onChange={(e) =>
                              handleInputChange("mainText", e.target.value)
                           }
                           placeholder="Введите основной текст..."
                           className="bg-background border-input"
                           rows={4}
                        />
                     </div>

                     <div className="space-y-2">
                        <h3 className="text-lg font-medium">
                           Призыв к действию
                        </h3>
                        <Textarea
                           value={formData.callToAction}
                           onChange={(e) =>
                              handleInputChange("callToAction", e.target.value)
                           }
                           placeholder="Пример: Ставь лайк, подписывайся в инстаграм."
                           className="bg-background border-input"
                        />
                     </div>

                     <div className="mt-6">
                        <Button
                           type="submit"
                           className="w-full"
                           disabled={formSubmitting}
                        >
                           {formSubmitting
                              ? "Сохранение..."
                              : "Сохранить и продолжить"}
                        </Button>
                     </div>
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
                                    width={240} // Increased size slightly
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
