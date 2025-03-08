"use client";

import Image from "next/image";

export function CreateSection() {
   return (
      <section className="md:py-16 py-12">
         <div className="container mx-auto px-4">
            <div className="flex flex-col gap-12 overflow-hidden">
               <div className="space-y-4">
                  <h2 className="font-semibold text-3xl md:text-5xl leading-tight md:leading-[58px] text-center max-w-[648px] mx-auto">
                     Как создать AI клона для популярных видео в Instagram и
                     TikTok
                  </h2>
                  <p className="font-sans font-medium text-lg md:text-2xl leading-relaxed md:leading-[33px] text-center text-[#212121]/80 max-w-[950px] mt-4 mx-auto">
                     Не нужно самому сниматься, если у вас экспертный контент.
                     Один раз создайте себе AI клона, и ваш аватар будет
                     появляться на ваших видео вместо вас.
                  </p>
               </div>
               <div className="flex flex-col md:flex-row gap-8 md:gap-12 justify-center">
                  <div className="w-full md:w-[334px] mt-8 md:mt-[100px] relative">
                     <div className="absolute w-[250px] md:w-[500px] h-auto md:h-[107px] -left-4 md:-left-[115px] -top-10 md:-top-[60px]">
                        <Image
                           src="/img/create/1000-people.png"
                           alt="Аналитика видео для TikTok и Instagram"
                           width={500}
                           height={300}
                           className="object-contain w-full h-full"
                        />
                     </div>
                     <div className="absolute w-[100px] md:w-[180px] top-1/2 -left-8 md:-left-[60px]">
                        <Image
                           src="/img/create/photo.png"
                           alt="ИИ для создания видео"
                           width={100}
                           height={120}
                           className="object-contain w-full h-full"
                        />
                     </div>
                     <Image
                        src="/img/create/reel1.png"
                        alt="генерация видео с ИИ"
                        width={300}
                        height={500}
                        className="object-contain mx-auto"
                     />
                  </div>
                  <div className="relative w-full md:w-[388px]">
                     <div className="absolute w-[120px] md:w-[190px] top-[20%] right-0 md:-right-[40px]">
                        <Image
                           src="/img/create/instagram.png"
                           alt="идеи для популярных видео в Instagram"
                           width={120}
                           height={120}
                           className="object-contain w-full h-full"
                        />
                     </div>
                     <Image
                        src="/img/create/reel2.png"
                        alt="Как сделать рилс — создание вирусных видео для Instagram"
                        width={300}
                        height={500}
                        className="object-contain mx-auto"
                     />
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}
