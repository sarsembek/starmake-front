"use client";

import Image from "next/image";

export function BeforeAfterSection() {
   return (
      <section className="md:py-12 py-6">
         <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-evenly gap-8">
               <div className="flex flex-col items-center gap-3 max-w-[547px]">
                  <div className="text-4xl font-semibold border border-[#303133] rounded-lg px-5 py-2">
                     ДО
                  </div>
                  <div className="mt-3">
                     <Image
                        src="/img/before.png"
                        alt="создание видео через ии"
                        width={400}
                        height={600}
                        className="object-contain"
                     />
                  </div>
               </div>
               <div className="flex flex-col items-center gap-3 max-w-[547px]">
                  <div className="text-4xl font-semibold border bg-[#E8275C] rounded-lg px-5 py-2 text-white">
                     ПОСЛЕ
                  </div>
                  <div className="mt-3">
                     <Image
                        src="/img/after.png"
                        alt="ии для создания видео для инстаграм"
                        width={400}
                        height={600}
                        className="object-contain"
                     />
                  </div>
               </div>
            </div>
            <p className="font-semibold text-2xl md:text-5xl text-[#303133] md:mt-12 mt-6 md:text-center leading-tight md:leading-[62px] max-w-4xl mx-auto">
               Благодаря этим 4 сервисам, нам удалось набрать 100 000
               подписчиков. Так сможет каждый, кто будет использовать:
            </p>
         </div>
      </section>
   );
}
