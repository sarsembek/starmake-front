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
import { useCategories } from "@/hooks/reels/useCategories";
import {
   useFavoriteReel,
   useUnfavoriteReel,
} from "@/hooks/reels/useFavoriteReels";

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

// Define the possible sizes for ReelCard
type ReelCardSize = "sm" | "md" | "lg";

export function ReelCard({
   id,
   title,
   description,
   file_url,
   shortcode,
   likes,
   view_count,
   comment_count,
   hashtags,
   language,
   country,
   category_id,
   category,
   is_favorite,
   size = "md", // Add size prop with default of "md"
}: Reel & {
   category?: { id: number; name: string; name_rus?: string };
   size?: ReelCardSize;
}) {
   const router = useRouter();
   const [isMuted, setIsMuted] = useState(true);
   const [isFavorite, setIsFavorite] = useState(is_favorite || false);
   const videoRef = useRef<HTMLVideoElement>(null);
   const { activeVideoId, setActiveVideoId } = useVideo();

   // Fetch all categories
   const { data: categories } = useCategories();

   // Find the matching category from our categories data
   const categoryData =
      category_id && categories
         ? categories.find((cat) => cat.id === category_id)
         : category; // Fallback to passed category prop if no match

   // Mutations for favorite functionality
   const addToFavorites = useFavoriteReel();
   const removeFromFavorites = useUnfavoriteReel();

   // Update local favorite state when prop changes
   useEffect(() => {
      setIsFavorite(is_favorite || false);
   }, [is_favorite]);

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

   // Handle favorite toggle
   const handleFavoriteToggle = (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent card click when clicking favorite button

      if (!isFavorite) {
         // Add to favorites
         addToFavorites.mutate(id, {
            onSuccess: () => setIsFavorite(true),
         });
      } else {
         // Remove from favorites
         removeFromFavorites.mutate(id, {
            onSuccess: () => setIsFavorite(false),
         });
      }
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

   // Size-specific styling
   const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";
   const buttonSize = size === "sm" ? "sm" : "icon";
   const cardPadding = size === "sm" ? "p-2" : "p-4";
   const textSize = {
      title:
         size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base",
      description:
         size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm",
      stats: size === "sm" ? "text-xs" : "text-sm",
   };

   // Add aspect ratio control based on size
   const aspectRatio = size === "sm" ? "aspect-[9/13]" : "aspect-[9/16]";

   // Add different sizing for card container
   const cardSizeClass =
      size === "sm" ? "h-full" : size === "lg" ? "h-full" : "h-full";

   return (
      <Card
         className={`overflow-hidden ${cardSizeClass} ${
            size === "sm" ? "py-0 gap-0" : "py-6"
         } flex flex-col pt-0 cursor-pointer`}
         onClick={handleCardClick}
      >
         <div className={`relative ${aspectRatio} w-full`}>
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

            <div className="absolute top-2 right-2 flex flex-col gap-2">
               <Button
                  variant="secondary"
                  size={buttonSize}
                  className="rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50"
                  onClick={handleFavoriteToggle}
               >
                  <Heart
                     className={`${iconSize} ${
                        isFavorite ? "fill-red-500 text-red-500" : "text-white"
                     }`}
                  />
               </Button>

               <Button
                  variant="secondary"
                  size={buttonSize}
                  className="rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50"
                  onClick={handleMuteToggle}
               >
                  {isMuted ? (
                     <VolumeX className={iconSize + " text-white"} />
                  ) : (
                     <Volume2 className={iconSize + " text-white"} />
                  )}
               </Button>
            </div>

            <CardContent
               className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent ${cardPadding} pt-16 space-y-1.5`}
            >
               <h3
                  className={`font-bold ${textSize.title} line-clamp-1 text-white`}
               >
                  {title}
               </h3>

               {description && (
                  <p
                     className={`text-white/80 ${textSize.description} mt-1 ${
                        size === "sm" ? "line-clamp-1" : "line-clamp-2"
                     }`}
                  >
                     {description}
                  </p>
               )}

               {/* Only show hashtags for md and lg sizes */}
               {size !== "sm" && (
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
               )}

               {/* Only show category, language, country for md and lg sizes */}
               {size !== "sm" && (
                  <div className="flex items-center gap-2">
                     {categoryData && (
                        <TooltipProvider>
                           <Tooltip>
                              <TooltipTrigger asChild>
                                 <div className="flex items-center gap-1">
                                    <Tag className={`${iconSize} text-white`} />
                                    <span className="text-xs text-white">
                                       {categoryData.name_rus ||
                                          categoryData.name}
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
                                    <Globe
                                       className={`${iconSize} text-white`}
                                    />
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
                                    <Flag
                                       className={`${iconSize} text-white`}
                                    />
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
               )}
            </CardContent>
         </div>

         <CardFooter
            className={`flex justify-between ${size === "sm" ? "p-4" : ""}`}
         >
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-1">
                  <Heart
                     className={`${size === "sm" ? "h-3 w-3" : "h-4 w-4"} ${
                        isFavorite
                           ? "fill-red-500 text-red-500"
                           : "text-muted-foreground"
                     }`}
                  />
                  <span className={`${textSize.stats} text-muted-foreground`}>
                     {likes}
                  </span>
               </div>

               <div className="flex items-center gap-1">
                  <Eye
                     className={`${
                        size === "sm" ? "h-3 w-3" : "h-4 w-4"
                     } text-muted-foreground`}
                  />
                  <span className={`${textSize.stats} text-muted-foreground`}>
                     {view_count}
                  </span>
               </div>

               <div className="flex items-center gap-1">
                  <MessageCircle
                     className={`${
                        size === "sm" ? "h-3 w-3" : "h-4 w-4"
                     } text-muted-foreground`}
                  />
                  <span className={`${textSize.stats} text-muted-foreground`}>
                     {comment_count}
                  </span>
               </div>
            </div>
         </CardFooter>
      </Card>
   );
}
