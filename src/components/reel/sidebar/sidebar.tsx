"use client";

import type React from "react";

import { useState } from "react";
import {
   ChevronDown,
   Hash,
   Film,
   Flame,
   Clock,
   Star,
   Heart,
   Globe,
   Menu,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Category } from "@/types/reel/category.type"; // Import the shared Category type

// Extended category type for UI with icon
interface UICategory extends Category {
   icon?: React.ReactNode;
}

interface SidebarProps {
   categories: UICategory[];
   activeCategory?: number;
   onSelectCategory?: (categoryId: number) => void;
}

export function Sidebar({
   categories,
   activeCategory,
   onSelectCategory,
}: SidebarProps) {
   const [isOpen, setIsOpen] = useState(false);

   // Update default categories to include name_rus and count_reels
   const defaultCategories: UICategory[] = [
      {
         id: 0,
         name: "All Reels",
         name_rus: "Все рилсы",
         count_reels: 120,
         icon: <Film className="h-4 w-4" />,
      },
      {
         id: 1,
         name: "Trending",
         name_rus: "Тренды",
         count_reels: 42,
         icon: <Flame className="h-4 w-4" />,
      },
      {
         id: 2,
         name: "Latest",
         name_rus: "Новые",
         count_reels: 28,
         icon: <Clock className="h-4 w-4" />,
      },
      {
         id: 3,
         name: "Popular",
         name_rus: "Популярные",
         count_reels: 35,
         icon: <Star className="h-4 w-4" />,
      },
      {
         id: 4,
         name: "Favorites",
         name_rus: "Избранное",
         count_reels: 15,
         icon: <Heart className="h-4 w-4" />,
      },
   ];

   const allCategories = [
      ...defaultCategories,
      ...categories.filter(
         (c) => !defaultCategories.some((dc) => dc.id === c.id)
      ),
   ];

   const handleCategoryClick = (categoryId: number) => {
      if (onSelectCategory) {
         onSelectCategory(categoryId);
      }
   };

   return (
      <>
         {/* Mobile Sidebar Trigger */}
         <div className="lg:hidden fixed top-4 left-4 z-40">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
               <SheetTrigger asChild>
                  <Button
                     variant="outline"
                     size="icon"
                     className="rounded-full"
                  >
                     <Menu className="h-5 w-5" />
                     <span className="sr-only">Toggle sidebar</span>
                  </Button>
               </SheetTrigger>
               <SheetContent side="left" className="p-0 w-[280px]">
                  <div className="flex flex-col h-full">
                     <div className="p-4 border-b">
                        <h2 className="text-lg font-semibold">Категории</h2>
                     </div>
                     <ScrollArea className="flex-1">
                        <div className="p-4">
                           <nav className="space-y-1">
                              {allCategories.map((category) => (
                                 <Button
                                    key={category.id}
                                    variant="ghost"
                                    className={cn(
                                       "w-full justify-start gap-2 text-left font-normal",
                                       activeCategory === category.id &&
                                          "bg-muted font-medium"
                                    )}
                                    onClick={() => {
                                       handleCategoryClick(category.id);
                                       setIsOpen(false);
                                    }}
                                 >
                                    {category.icon || (
                                       <Hash className="h-4 w-4" />
                                    )}
                                    {category.name_rus}{" "}
                                    {/* Display Russian name instead */}
                                    {category.count_reels !== undefined && (
                                       <span className="ml-auto text-xs text-muted-foreground">
                                          {category.count_reels}
                                       </span>
                                    )}
                                 </Button>
                              ))}
                           </nav>
                        </div>
                     </ScrollArea>
                  </div>
               </SheetContent>
            </Sheet>
         </div>

         {/* Desktop Sidebar */}
         <aside className="hidden lg:flex flex-col w-64 border-r h-screen sticky top-0">
            <div className="p-4 border-b">
               <h2 className="text-lg font-semibold">Категории</h2>
            </div>
            <ScrollArea className="flex-1">
               <div className="p-4">
                  <nav className="space-y-1">
                     {allCategories.map((category) => (
                        <Button
                           key={category.id}
                           variant="ghost"
                           className={cn(
                              "w-full justify-start gap-2 text-left font-normal",
                              activeCategory === category.id &&
                                 "bg-muted font-medium"
                           )}
                           onClick={() => handleCategoryClick(category.id)}
                        >
                           {category.icon || <Hash className="h-4 w-4" />}
                           {category.name_rus}{" "}
                           {/* Display Russian name instead */}
                           {category.count_reels !== undefined && (
                              <span className="ml-auto text-xs text-muted-foreground">
                                 {category.count_reels}
                              </span>
                           )}
                        </Button>
                     ))}
                  </nav>
               </div>
            </ScrollArea>
            <div className="p-4 border-t">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <Globe className="h-4 w-4 text-muted-foreground" />
                     <span className="text-sm text-muted-foreground">
                        Язык
                     </span>{" "}
                     {/* Translated to Russian */}
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 gap-1">
                     Русский {/* Set to Russian */}
                     <ChevronDown className="h-4 w-4" />
                  </Button>
               </div>
            </div>
         </aside>
      </>
   );
}
