"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
   Heart,
   Eye,
   MessageCircle,
   Globe,
   Flag,
   Tag,
   Volume2,
   VolumeX,
} from "lucide-react";
import { useInView } from "react-intersection-observer";
import { useVideo } from "@/context/VideoContext";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Reel } from "@/types/reel/reel.type";
import {
   Tooltip,
   TooltipContent,
   TooltipProvider,
   TooltipTrigger,
} from "@/components/ui/tooltip";

export function ReelCard({
   id,
   title,
   description,
   file_url,
   shortcode, // Make sure shortcode is included in props
   likes,
   view_count,
   comment_count,
   hashtags,
   language,
   country,
   category,
}: Reel & { category?: { id: number; name: string; name_rus?: string } }) {
   const router = useRouter();
   const [isLiked, setIsLiked] = useState(false);
   const [likeCount, setLikeCount] = useState(likes);
   const [isMuted, setIsMuted] = useState(true);
   const videoRef = useRef<HTMLVideoElement>(null);
   const { activeVideoId, setActiveVideoId } = useVideo();

   // Track if video is in view using IntersectionObserver
   const { ref: inViewRef, inView } = useInView({
      threshold: 0.5,
      triggerOnce: false,
   });

   // Set up refs with callback to handle both video and intersection observer
   const setRefs = (el: HTMLVideoElement | null) => {
      videoRef.current = el;
      inViewRef(el);
   };

   // Handle when this video becomes active (unmuted)
   useEffect(() => {
      if (videoRef.current) {
         if (activeVideoId === id) {
            videoRef.current.muted = false;
            setIsMuted(false);
         } else {
            videoRef.current.muted = true;
            setIsMuted(true);
         }
      }
   }, [activeVideoId, id]);

   // Autoplay/pause based on visibility
   useEffect(() => {
      if (videoRef.current) {
         if (inView) {
            videoRef.current.play().catch((err) => {
               console.error("Autoplay failed:", err);
            });
         } else {
            videoRef.current.pause();
         }
      }
   }, [inView]);

   const handleLike = (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent card click when clicking like button
      if (isLiked) {
         setLikeCount((prev) => prev - 1);
      } else {
         setLikeCount((prev) => prev + 1);
      }
      setIsLiked(!isLiked);
   };

   const handleMuteToggle = (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent card click when clicking mute button
      if (videoRef.current) {
         if (isMuted) {
            setActiveVideoId(id);
         } else {
            if (activeVideoId === id) {
               setActiveVideoId(null);
            }
            videoRef.current.muted = true;
            setIsMuted(true);
         }
      }
   };

   // Handle card click to navigate to reel details
   const handleCardClick = () => {
      if (shortcode) {
         router.push(`/library/reels/${shortcode}`);
      }
   };

   const videoSrc = file_url;
   const hashtagArray = hashtags
      ? hashtags.split(",").map((tag) => tag.trim())
      : [];

   return (
      <Card
         className="overflow-hidden h-full flex flex-col pt-0 cursor-pointer"
         onClick={handleCardClick}
      >
         <div className="relative aspect-[9/16] w-full">
            <video
               ref={setRefs}
               src={videoSrc}
               className="w-full h-full object-cover"
               loop
               playsInline
               muted={true}
               autoPlay={false}
               poster={"/placeholder.svg"}
            />

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

               <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50"
                  onClick={handleMuteToggle}
               >
                  {isMuted ? (
                     <VolumeX className="h-5 w-5 text-white" />
                  ) : (
                     <Volume2 className="h-5 w-5 text-white" />
                  )}
               </Button>
            </div>

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
                                    {category.name_rus || category.name}
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
                     {view_count}
                  </span>
               </div>

               <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                     {comment_count}
                  </span>
               </div>
            </div>
         </CardFooter>
      </Card>
   );
}
