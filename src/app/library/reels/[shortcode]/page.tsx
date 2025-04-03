"use client";

import { useParams } from "next/navigation";
import { ReelDetails } from "./reel-details";
import { useReel } from "@/hooks/reels/useReel";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { VideoProvider } from "@/context/VideoContext";

export default function ReelPage() {
   const params = useParams<{ shortcode: string }>();
   const shortcode = params.shortcode as string;

   const { data: reel, isLoading, error } = useReel(shortcode);

   if (isLoading || (!error && !reel)) {
      return <ReelSkeleton />;
   }

   if (!isLoading && (error || !reel)) {
      return <ReelError />;
   }

   return (
      <VideoProvider>
         <ReelDetails {...reel} />
      </VideoProvider>
   );
}

function ReelSkeleton() {
   return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
         <div className="flex items-center mb-6">
            <Skeleton className="h-10 w-10 rounded-full mr-4" />
            <Skeleton className="h-8 w-64" />
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
               <Skeleton className="aspect-video md:aspect-[9/16] w-full rounded-lg" />
            </div>
            <div className="md:col-span-1">
               <div className="space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-20 w-full" />
                  <div className="flex flex-wrap gap-2">
                     <Skeleton className="h-6 w-16 rounded-full" />
                     <Skeleton className="h-6 w-20 rounded-full" />
                     <Skeleton className="h-6 w-14 rounded-full" />
                  </div>
                  <div className="h-[1px] bg-gray-200 w-full my-4" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-40 w-full" />
               </div>
            </div>
         </div>
      </div>
   );
}

function ReelError() {
   return (
      <div className="container max-w-4xl mx-auto py-8 px-4 text-center">
         <h2 className="text-2xl font-bold text-red-500">Reel не найден</h2>
         <p className="mt-2">
            Запрашиваемый ролик не найден или произошла ошибка при его загрузке
            это. Пожалуйста, попробуйте позже.
         </p>
         <Link href="/library">
            <Button className="mt-4">
               <ArrowLeft className="h-4 w-4 mr-2" />
               Вернуться к библиотеке
            </Button>
         </Link>
      </div>
   );
}
