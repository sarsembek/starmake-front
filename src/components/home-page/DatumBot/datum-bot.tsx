"use client";

import Image from "next/image";

export function DatumBot() {
   return (
      <section className="py-16 bg-white">
         <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-center gap-5 md:gap-8">
               <div className="md:w-1/2 max-w-lg">
                  <h2 className="text-3xl md:text-4xl lg:text-[55px] font-semibold leading-tight md:leading-[58px] max-w-[536px]">
                     Бот для увеличения подписчиков
                  </h2>
                  <p className="font-sans text-lg md:text-xl lg:text-2xl leading-relaxed mt-6 md:mt-8 max-w-[464px] text-[#212121]/80">
                     Привяжите ассистента к вашему инстаграмму, который будет
                     выдавать подарки, видео, инструкции после подписки на
                     вас.&nbsp;
                  </p>
               </div>
               <div className="md:w-1/2 max-w-[588px] mt-8 md:mt-0">
                  <Image
                     src="/img/bot.png"
                     alt="Бот для увеличения подписчиков в Instagram"
                     width={588}
                     height={500}
                     className="object-contain w-full"
                  />
               </div>
            </div>
         </div>
      </section>
   );
}
