"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useRef } from "react";

export function HeroSection() {
   const videoRef = useRef<HTMLVideoElement>(null);

   useEffect(() => {
      // Ensure video plays automatically
      if (videoRef.current) {
         videoRef.current.play().catch((error) => {
            console.error("Error attempting to play video:", error);
         });
      }
   }, []);

   return (
      <section className="relative w-full h-[92vh] md:h-screen overflow-hidden">
         {/* Background Video */}
         <div className="absolute inset-0 w-full h-full z-0">
            <video
               ref={videoRef}
               autoPlay
               muted
               loop
               playsInline
               className="w-full h-full object-cover"
            >
               <source src="/video/Back Video.mp4" type="video/mp4" />
               Ваш браузер не поддерживает видео тег.
            </video>
         </div>

         {/* Overlay for better text visibility */}
         <div className="absolute inset-0 bg-black/40 z-10"></div>

         {/* Content */}
         <div className="relative z-20 container mx-auto h-full flex flex-col items-center justify-center text-start md:text-center px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 max-w-6xl">
               Стань звездой Instagram, Tik-Tok, Youtube: повторяй тренды,
               генерируй видео и привлекай подписчиков с помощью AI
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-xl">
               Примеры лучших видео от блогеров и наших сервисов по набору
               аудитории
            </p>
            <Button
               size="lg"
               className="text-lg px-8 py-6 font-semibold text-white 
              bg-[#00b3ff] border-2 border-[#00b3ff] rounded-md cursor-pointer
              transition-all duration-500 ease-in-out 
              hover:bg-transparent hover:text-[#00b3ff]
              focus:outline-none focus:ring-2 focus:ring-[#00b3ff]
              box-border align-baseline overflow-visible"
               asChild
            >
               <Link href="/library">Открыть каталог</Link>
            </Button>
         </div>
      </section>
   );
}
