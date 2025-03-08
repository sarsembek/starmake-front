"use client";

import Image from "next/image";

export function LibrarySection() {
   return (
      <section className="bg-[#0B1B2A] md:py-24 py-12">
         <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row justify-between items-center md:gap-6">
               <div className="max-w-[567px] w-full">
                  <h3 className="text-white text-4xl md:text-5xl font-semibold leading-tight md:leading-[58px]">
                     Библиотека{" "}
                     <span className="text-[#C3F500]">
                        лучших трендов REELS
                     </span>{" "}
                     в Instagram
                  </h3>
                  <p className="font-sans text-white/80 text-xl md:text-2xl font-light mt-7 leading-[33px]">
                     Мы собрали 10 000 видео для вашего вдохновения, благодаря
                     которым авторы стали звездами. Выбирайте нишу: бизнес,
                     одежда, товары, красота, услуги, спорт, недвижимость,
                     рестораны и развлечения и другие.
                  </p>
               </div>

               {/* Mobile layout (hidden on desktop) */}
               <div className="relative mt-12 w-full lg:hidden">
                  <div className="absolute bg-[#3988D5] rounded-full blur-[90px] inset-0 z-0"></div>

                  {/* lib3.png at the top */}
                  <div className="w-full flex justify-center mb-4 z-10 relative">
                     <Image
                        src="/img/lib/lib3.png"
                        alt="Библиотека лучших рилсов инстаграм"
                        width={350}
                        height={500}
                        className="object-contain max-h-[500px]"
                     />
                  </div>

                  {/* Grid for other images */}
                  <div className="grid grid-cols-2 gap-3 z-10 relative">
                     <div>
                        <Image
                           src="/img/lib/lib1.png"
                           alt="Пример популярного Reels видео"
                           width={200}
                           height={350}
                           className="object-contain w-full"
                        />
                     </div>
                     <div>
                        <Image
                           src="/img/lib/lib2.png"
                           alt="Библиотека лучших видео"
                           width={200}
                           height={350}
                           className="object-contain w-full"
                        />
                     </div>
                     <div>
                        <Image
                           src="/img/lib/lib4.png"
                           alt="Тренды видео для инстаграм"
                           width={200}
                           height={350}
                           className="object-contain w-full"
                        />
                     </div>
                     <div>
                        <Image
                           src="/img/lib/lib5.png"
                           alt="Как стать известным"
                           width={200}
                           height={350}
                           className="object-contain w-full"
                        />
                     </div>
                  </div>
               </div>

               {/* Desktop layout (hidden on mobile) */}
               <div className="relative mt-12 lg:mt-0 hidden lg:grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-3.5 md:gap-4">
                  <div className="absolute bg-[#3988D5] rounded-full blur-[90px] top-0 left-0 w-full h-full z-0"></div>
                  <div className="z-10">
                     <Image
                        src="/img/lib/lib1.png"
                        alt="Пример популярного Reels видео"
                        width={200}
                        height={350}
                        className="object-contain"
                     />
                  </div>
                  <div className="col-span-2 row-span-2 z-10">
                     <Image
                        src="/img/lib/lib3.png"
                        alt="Библиотека лучших рилсов инстаграм"
                        width={350}
                        height={700}
                        className="object-contain"
                     />
                  </div>
                  <div className="z-10">
                     <Image
                        src="/img/lib/lib2.png"
                        alt="Библиотека лучших видео"
                        width={200}
                        height={350}
                        className="object-contain"
                     />
                  </div>
                  <div className="z-10">
                     <Image
                        src="/img/lib/lib4.png"
                        alt="Тренды видео для инстаграм"
                        width={200}
                        height={350}
                        className="object-contain"
                     />
                  </div>
                  <div className="z-10">
                     <Image
                        src="/img/lib/lib5.png"
                        alt="Как стать известным"
                        width={200}
                        height={350}
                        className="object-contain"
                     />
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}
