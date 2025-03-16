"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
   Heart,
   Eye,
   MessageCircle,
   Globe,
   Flag,
   Tag,
   Volume2,
   VolumeX,
   ArrowLeft,
   Copy,
} from "lucide-react";
import { useInView } from "react-intersection-observer";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import type { Reel } from "@/types/reel/reel.type";
import { useCategories } from "@/hooks/useCategories";

export function ReelDetails({
   // id,
   title,
   description,
   file_url,
   likes,
   view_count,
   comment_count,
   hashtags,
   language,
   country,
   shortcode,
   transcribed_text,
   repeat_instructions,
   improvement_suggestions,
   tags,
   category_id,
}: Reel) {
   const [isLiked, setIsLiked] = useState(false);
   const [likeCount, setLikeCount] = useState(likes);
   const [isMuted, setIsMuted] = useState(true);
   const videoRef = useRef<HTMLVideoElement>(null);

   const { data: categories } = useCategories();

   // Find the matching category from our categories data
   const category = categories?.find((category) => category.id === category_id);

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
         videoRef.current.muted = !videoRef.current.muted;
         setIsMuted(!isMuted);
      }
   };

   const handleCopyLink = () => {
      navigator.clipboard.writeText(
         `${window.location.origin}/reels/${shortcode}`
      );
      // You could add a toast notification here
   };

   const videoSrc = file_url;
   const hashtagArray = hashtags
      ? hashtags.split(",").map((tag) => tag.trim())
      : [];

   return (
      <div className="container max-w-4xl mx-auto py-8">
         <div className="flex items-center mb-6">
            <Link href="/library" className="mr-4">
               <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
               </Button>
            </Link>
            <h1 className="text-2xl font-bold">{title}</h1>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 gap-4">
            <div className="md:col-span-1">
               <Card className="overflow-hidden pt-0">
                  <div className="relative md:aspect-[9/16] w-full">
                     <video
                        ref={setRefs}
                        src={videoSrc}
                        className="w-full h-full object-cover"
                        loop
                        playsInline
                        muted={isMuted}
                        controls={false}
                        poster={"/placeholder.svg"}
                     />

                     {/* Control overlay */}
                     <div className="absolute top-4 right-4 flex flex-col gap-4">
                        <Button
                           variant="secondary"
                           size="icon"
                           className="rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50"
                           onClick={handleLike}
                        >
                           <Heart
                              className={`h-5 w-5 ${
                                 isLiked
                                    ? "fill-red-500 text-red-500"
                                    : "text-white"
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

                        {/* <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50"
                  onClick={handleSave}
                >
                  <Bookmark className={`h-5 w-5 ${isSaved ? "fill-primary text-primary" : "text-white"}`} />
                </Button> */}

                        <Button
                           variant="secondary"
                           size="icon"
                           className="rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50"
                           onClick={handleCopyLink}
                        >
                           <Copy className="h-5 w-5 text-white" />
                        </Button>
                     </div>
                  </div>

                  <CardFooter className="flex justify-between">
                     <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                           <Heart
                              className={`h-5 w-5 ${
                                 isLiked ? "text-red-500 fill-red-500" : ""
                              }`}
                           />
                           <span className="text-sm">{likeCount}</span>
                        </div>

                        <div className="flex items-center gap-1">
                           <Eye className="h-5 w-5" />
                           <span className="text-sm">{view_count}</span>
                        </div>

                        <div className="flex items-center gap-1">
                           <MessageCircle className="h-5 w-5" />
                           <span className="text-sm">{comment_count}</span>
                        </div>
                     </div>

                     {/* <Button variant="ghost" size="sm" onClick={() => {}}>
                        <Share2 className="h-5 w-5 mr-2" />
                        Поделиться
                     </Button> */}
                  </CardFooter>
               </Card>
            </div>

            <div className="md:col-span-1">
               <Card>
                  <CardContent className="px-4 md:px-6">
                     <h2 className="text-xl font-semibold mb-2">{title}</h2>
                     <p className="text-muted-foreground mb-4">{description}</p>

                     <div className="max-h-[4rem] overflow-hidden">
                        <div className="flex flex-wrap gap-2 mb-4">
                           {hashtagArray.slice(0, 8).map((tag, index) => (
                              <Badge
                                 key={`hashtag-${index}`}
                                 variant="secondary"
                              >
                                 #{tag}
                              </Badge>
                           ))}
                        </div>
                     </div>

                     <div className="max-h-[4rem] overflow-hidden">
                        <div className="flex flex-wrap gap-2 mb-4">
                           {tags.slice(0, 8).map((tag, index) => (
                              <Badge key={`tag-${index}`} variant="secondary">
                                 #{tag}
                              </Badge>
                           ))}
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4 mb-4">
                        {language && (
                           <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm uppercase">
                                 {language}
                              </span>
                           </div>
                        )}

                        {country && (
                           <div className="flex items-center gap-2">
                              <Flag className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{country}</span>
                           </div>
                        )}

                        <div className="flex items-center gap-2">
                           <Tag className="h-4 w-4 text-muted-foreground" />
                           <span className="text-sm">{category?.name_rus}</span>
                        </div>
                     </div>

                     <Separator className="my-4" />

                     <Tabs defaultValue="transcript">
                        <TabsList className="grid w-full grid-cols-3">
                           <TabsTrigger value="transcript">
                              Транскрипт
                           </TabsTrigger>
                           <TabsTrigger value="instructions">
                              Инструкция
                           </TabsTrigger>
                           <TabsTrigger value="tips">Предложения</TabsTrigger>
                        </TabsList>
                        <TabsContent value="transcript" className="mt-4">
                           <p className="text-sm">
                              {transcribed_text || "No transcript available."}
                           </p>
                        </TabsContent>
                        <TabsContent value="instructions" className="mt-4">
                           <p className="text-sm">
                              {repeat_instructions ||
                                 "No instructions available."}
                           </p>
                        </TabsContent>
                        <TabsContent value="tips" className="mt-4">
                           <p className="text-sm">
                              {improvement_suggestions || "No tips available."}
                           </p>
                        </TabsContent>
                     </Tabs>
                  </CardContent>
               </Card>
            </div>
         </div>

         {/* Related reels section could be added here */}
      </div>
   );
}
