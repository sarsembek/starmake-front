"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function ChooseOption() {
   const [selectedOption, setSelectedOption] = useState<string | null>(null);
   const router = useRouter();

   // Update parent layout about selection state
   useEffect(() => {
      if (selectedOption) {
         // This could be improved with a context if needed
         const event = new CustomEvent("optionSelected", {
            detail: selectedOption,
         });
         window.dispatchEvent(event);
      }
   }, [selectedOption]);

   const handleOptionSelect = (option: string, path: string) => {
      setSelectedOption(option);
      router.push(path); 
      // Router navigation will be handled by the footer component
   };

   return (
      <div className="flex flex-col min-h-[calc(100vh-8rem)]">
         <div className="flex-1">
            <h1 className="text-3xl font-bold text-center mb-8 mt-10">
               Выберите свой вариант развития
            </h1>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
               <Card
                  className={`h-full cursor-pointer transition-all hover:scale-105 ${
                     selectedOption === "scratch" ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() =>
                     handleOptionSelect(
                        "scratch",
                        "/script-builder/write-script"
                     )
                  }
               >
                  <CardContent className="p-6 flex flex-col items-center h-full">
                     <div className="mb-4 mt-4">
                        <Image
                           src="/img/create.png"
                           alt="Create from Scratch"
                           width={120}
                           height={120}
                           className="rounded-lg"
                        />
                     </div>
                     <div className="text-center">
                        <h2 className="text-xl font-bold mb-2">
                           СОЗДАТЬ СЦЕНАРИЙ С ПУСТОГО ЛИСТА
                        </h2>
                        <p className="text-muted-foreground">
                           Напишите текст озвучки вручную
                        </p>
                     </div>
                  </CardContent>
               </Card>

               <Card
                  className={`h-full cursor-pointer transition-all hover:scale-105 bg-primary/10 ${
                     selectedOption === "template" ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() =>
                     handleOptionSelect(
                        "template",
                        "/script-builder/use-template"
                     )
                  }
               >
                  <CardContent className="p-6 flex flex-col items-center h-full">
                     <div className="mb-4 mt-4">
                        <Image
                           src="/img/usetemp.png"
                           alt="Use Templates"
                           width={221}
                           height={180}
                           className="rounded-lg object-contain"
                        />
                     </div>
                     <div className="text-center">
                        <h2 className="text-xl font-bold mb-2">
                           ИСПОЛЬЗОВАТЬ ШАБЛОНЫ
                        </h2>
                        <p className="text-muted-foreground">
                           Собрать сценарий с помощью готового конструктора
                        </p>
                     </div>
                  </CardContent>
               </Card>
            </div>
         </div>
      </div>
   );
}
