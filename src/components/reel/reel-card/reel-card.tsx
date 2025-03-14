"use client";

import { useState, useRef, useEffect } from "react";
// import Image from "next/image";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
   // video_url,
   file_url,
   thumbnail_url,
   owner_username,
   likes,
   view_count,
   comment_count,
   hashtags,
   language,
   country,
   category,
}: Reel & { category?: { id: number; name: string; name_rus?: string } }) {
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
      // Set the videoRef
      videoRef.current = el;
      // Set the inViewRef (for intersection observer)
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

   const handleLike = () => {
      if (isLiked) {
         setLikeCount((prev) => prev - 1);
      } else {
         setLikeCount((prev) => prev + 1);
      }
      setIsLiked(!isLiked);
   };

   const handleMuteToggle = () => {
      if (videoRef.current) {
         if (isMuted) {
            // This video is being unmuted, so make it the active video
            setActiveVideoId(id);
         } else {
            // This video is being muted, so clear active video if it's this one
            if (activeVideoId === id) {
               setActiveVideoId(null);
            }
            videoRef.current.muted = true;
            setIsMuted(true);
         }
      }
   };

   const videoSrc = file_url;
   const hashtagArray = hashtags
      ? hashtags.split(",").map((tag) => tag.trim())
      : [];

   return (
      <Card className="overflow-hidden h-full flex flex-col pt-0">
         <div className="relative aspect-[9/16] w-full">
            {/* Always render video element for autoplay, but control it with CSS */}
            <video
               ref={setRefs}
               src={videoSrc}
               className="w-full h-full object-cover"
               loop
               playsInline
               muted={true}
               autoPlay={false} // We control this via JS
               poster={thumbnail_url || "/placeholder.svg"}
            />

            {/* Like button and mute button overlay */}
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

               {/* New mute/unmute button */}
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
                                    {category.name_rus || category.name}
                                 </span>
                              </div>
                           </TooltipTrigger>
                           <TooltipContent>
                              <p>Category</p>
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
                              <p>Language</p>
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
                              <p>Country</p>
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
                           alt={owner_username || "User"}
                        />
                        <AvatarFallback>
                           {owner_username?.substring(0, 2) || "UN"}
                        </AvatarFallback>
                     </Avatar>
                     <span className="text-white font-medium text-sm">
                        {owner_username || "Anonymous"}
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
