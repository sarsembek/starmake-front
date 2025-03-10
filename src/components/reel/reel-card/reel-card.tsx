"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Eye, MessageCircle, Globe, Flag, Tag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ReelCardProps } from "@/types/reel/reel.type";
import {
   Tooltip,
   TooltipContent,
   TooltipProvider,
   TooltipTrigger,
} from "@/components/ui/tooltip";

export function ReelCard({
   title,
   description,
   videoUrl,
   fileUrl,
   thumbnailUrl,
   ownerUsername,
   likes,
   viewCount,
   commentCount,
   hashtags,
   language,
   country,
   category,
}: ReelCardProps) {
   const [isLiked, setIsLiked] = useState(false);
   const [likeCount, setLikeCount] = useState(likes);
   const [isPlaying, setIsPlaying] = useState(false);

   const videoSrc = videoUrl || fileUrl;
   const hashtagArray = hashtags
      ? hashtags.split(",").map((tag) => tag.trim())
      : [];

   const handleLike = () => {
      if (isLiked) {
         setLikeCount((prev) => prev - 1);
      } else {
         setLikeCount((prev) => prev + 1);
      }
      setIsLiked(!isLiked);
   };

   const handleVideoPlay = () => {
      setIsPlaying(!isPlaying);
   };

   return (
      <Card className="overflow-hidden h-full flex flex-col pt-0">
         <div className="relative aspect-[9/16] w-full">
            {thumbnailUrl && !isPlaying && (
               <div className="relative h-full w-full">
                  <Image
                     src={thumbnailUrl || "/placeholder.svg"}
                     alt={title}
                     fill
                     className="object-cover"
                     priority
                  />
                  <div
                     className="absolute inset-0 flex items-center justify-center cursor-pointer"
                     onClick={handleVideoPlay}
                  >
                     <div className="bg-black/50 rounded-full p-4">
                        <svg
                           width="24"
                           height="24"
                           viewBox="0 0 24 24"
                           fill="none"
                           xmlns="http://www.w3.org/2000/svg"
                        >
                           <path d="M8 5V19L19 12L8 5Z" fill="white" />
                        </svg>
                     </div>
                  </div>
               </div>
            )}

            {videoSrc && (isPlaying || !thumbnailUrl) && (
               <video
                  src={videoSrc}
                  className="w-full h-full object-cover"
                  // controls={isPlaying}
                  autoPlay={isPlaying}
                  loop
                  playsInline
                  onClick={handleVideoPlay}
               />
            )}

            {/* Like button overlay */}
            <div className="absolute top-4 right-4 flex flex-col gap-4">
               <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50"
                  onClick={handleLike}
               >
                  <Heart
                     className={`h-5 w-5 ${
                        isLiked ? "fill-red-500 text-red-500" : "text-white"
                     }`}
                  />
               </Button>
            </div>

            {/* Content overlay */}
            <CardContent className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-16 space-y-2">
               <h3 className="font-bold text-base line-clamp-1 text-white">
                  {title}
               </h3>

               {description && (
                  <p className="text-white/80 text-sm mt-1 line-clamp-2">
                     {description}
                  </p>
               )}

               <div className="flex flex-wrap gap-1 mt-2">
                  {hashtagArray.slice(0, 3).map((tag, index) => (
                     <Badge
                        key={`hashtag-${index}`}
                        variant="secondary"
                        className="bg-white/20 text-white hover:bg-white/30"
                     >
                        #{tag}
                     </Badge>
                  ))}
               </div>
               <div className="flex items-center gap-2">
                  {category && (
                     <TooltipProvider>
                        <Tooltip>
                           <TooltipTrigger asChild>
                              <div className="flex items-center gap-1">
                                 <Tag className="h-4 w-4 text-white" />
                                 <span className="text-xs text-white">
                                    {category.name}
                                 </span>
                              </div>
                           </TooltipTrigger>
                           <TooltipContent>
                              <p>Категория</p>
                           </TooltipContent>
                        </Tooltip>
                     </TooltipProvider>
                  )}

                  {language && (
                     <TooltipProvider>
                        <Tooltip>
                           <TooltipTrigger asChild>
                              <div className="flex items-center gap-1">
                                 <Globe className="h-4 w-4 text-white" />
                                 <span className="text-xs text-white uppercase">
                                    {language}
                                 </span>
                              </div>
                           </TooltipTrigger>
                           <TooltipContent>
                              <p>Язык</p>
                           </TooltipContent>
                        </Tooltip>
                     </TooltipProvider>
                  )}

                  {country && (
                     <TooltipProvider>
                        <Tooltip>
                           <TooltipTrigger asChild>
                              <div className="flex items-center gap-1">
                                 <Flag className="h-4 w-4 text-white" />
                                 <span className="text-xs text-white">
                                    {country}
                                 </span>
                              </div>
                           </TooltipTrigger>
                           <TooltipContent>
                              <p>Страна</p>
                           </TooltipContent>
                        </Tooltip>
                     </TooltipProvider>
                  )}
               </div>
               {/* User info overlay */}
               <div className="bottom-4 left-4 right-12 flex flex-col gap-2">
                     <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 border border-white">
                           <AvatarImage
                              src={`/placeholder.svg?height=32&width=32`}
                              alt={ownerUsername || "User"}
                           />
                           <AvatarFallback>
                              {ownerUsername?.substring(0, 2) || "UN"}
                           </AvatarFallback>
                        </Avatar>
                        <span className="text-white font-medium text-sm">
                           {ownerUsername || "Anonymous"}
                        </span>
                     </div>
                  </div>
            </CardContent>
         </div>

         <CardFooter className="flex justify-between">
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                     {likeCount}
                  </span>
               </div>

               <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                     {viewCount}
                  </span>
               </div>

               <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                     {commentCount}
                  </span>
               </div>
            </div>
         </CardFooter>
      </Card>
   );
}
