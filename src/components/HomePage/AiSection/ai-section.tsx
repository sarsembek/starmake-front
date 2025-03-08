"use client";

import Image from "next/image";

export function AiSection() {
   return (
      <section className="md:my-32 my-8">
         <div className="container mx-auto max-w-7xl px-4 md:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
               <div className="md:max-w-lg">
                  <Image
                     src="/img/ai/ai.png"
                     alt="ИИ для создания видео"
                     width={400}
                     height={400}
                     className="object-contain w-full"
                  />
               </div>
               <div className="md:max-w-lg">
                  <h2 className="text-[#303133] text-3xl md:text-4xl lg:text-5xl leading-tight md:leading-[1.2] font-semibold">
                     Используйте AI для создания вирусных видео
                  </h2>
                  <ul className="mt-8 font-sans text-lg md:text-xl lg:text-[1.375rem] leading-relaxed flex flex-col gap-5">
                     <li>
                        Создайте своего{" "}
                        <span className="font-bold">AI видео клона</span>
                     </li>
                     <li>
                        <span className="font-bold">Привяжите чат бот</span>,
                        который автоматом даст лид-магнит, и наберете
                        подписчиков
                     </li>
                     <li>
                        <span className="font-bold">Напишите сценарий</span> для
                        ваших вирусных видео, с помощью конструктора
                     </li>
                  </ul>
               </div>
            </div>
         </div>
      </section>
   );
}
