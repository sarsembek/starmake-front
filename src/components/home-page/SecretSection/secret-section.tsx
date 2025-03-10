"use client";

import Image from "next/image";

export function SecretSection() {
  return (
    <section className="bg-[#0B1B2A] pt-4">
      <div className="сontainer md:mx-16 px-4 justify-between">
        <div className="flex flex-col md:flex-row items-center">
          <div className="h-full flex flex-col gap-8 md:w-1/2">
            <h2 className="font-semibold text-3xl md:text-[43px] leading-tight md:leading-[71px] text-white max-w-[450px]">
              Секреты создания успешных Reels для Instagram
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Image 
                  src="/img/secret/secret1.png" 
                  alt="Аналитика успешных видео для Instagram" 
                  width={80}
                  height={80}
                />
                <span className="text-white">Получите аналитику</span>
              </div>
              <div className="flex items-center gap-4">
                <Image 
                  src="/img/secret/secret2.png" 
                  alt="Схема для создания популярного видео" 
                  width={80}
                  height={80}
                />
                <span className="text-white">Схему для создания подобного видео</span>
              </div>
              <div className="flex items-center mb-6 gap-4">
                <Image 
                  src="/img/secret/secret3.png" 
                  alt="Повторите тренды видео инстаграм"
                  width={80}
                  height={80} 
                />
                <span className="text-white">Используйте инструменты</span>
              </div>
            </div>
          </div>
          <div className="max-w-[656px] md:-mt-[100px] relative md:w-1/2">
            <div className="absolute bg-[#3988D5] rounded-full blur-[90px] top-0 left-0 w-full h-full z-0"></div>
            <div className="relative z-10">
              <Image 
                src="/img/secret/hand.png" 
                alt="как стать популярной" 
                width={600}
                height={800}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}