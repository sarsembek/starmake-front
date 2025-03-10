"use client";

import Image from "next/image";

export function ConstructSection() {
   return (
      <section className="bg-[#0B1B2A] py-16">
         <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
               <div className="relative w-full md:w-2/5 -mt-8 -mb-12 z-10">
                  <div className="absolute bg-[#3988D5] rounded-full blur-[5rem] top-1/5 left-0 w-full h-3/5 z-0"></div>
                  <Image
                     src="/img/construct/phone.png"
                     alt="Идеи для видео — трендовые рилс для привлечения подписчиков"
                     width={600  }
                     height={1200}
                     className="object-contain relative z-10 mx-auto"
                  />
               </div>
               <div className="mt-6 md:mt-0 text-white z-10 self-center w-full md:w-3/5 lg:w-1/2">
                  <h2 className="font-semibold text-3xl md:text-4xl lg:text-5xl leading-tight">
                     Используйте{" "}
                     <span className="text-[#C3F500]">
                        конструктор сценария
                     </span>
                  </h2>
                  <p className="font-sans mt-6 md:mt-8 text-white/80 text-lg md:text-xl lg:text-2xl leading-relaxed">
                     Мы протестировали более 100 заголовков, 20 структур текста,
                     и создали идеальный конструктор сценария, который наберет
                     вашим видео миллионы просмотров, а вы принесете пользу и
                     станете звездой.
                  </p>
               </div>
            </div>
         </div>
      </section>
   );
}
