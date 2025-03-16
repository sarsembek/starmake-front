"use client";

import React, { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCategories } from "@/hooks/useCategories";
import { SidebarHeader } from "./components/sidebar-header";
import { SidebarFooter } from "./components/sidebar-footer";
import { CategoryGroup } from "./components/category-group";
import { LoadingState } from "./components/loading-state";
import { mapCategoriesToUI } from "./utils/category-mapper";
import { groupCategories } from "./utils/category-grouper";

interface SidebarProps {
   activeCategory?: number;
   onSelectCategory?: (categoryId: number) => void;
}

export function Sidebar({ activeCategory, onSelectCategory }: SidebarProps) {
   const [isOpen, setIsOpen] = useState(false);
   const { data: apiCategories, isLoading, error } = useCategories();

   // Process categories using utility functions
   const uiCategories = mapCategoriesToUI(apiCategories);
   const categoryGroups = groupCategories(uiCategories);

   const handleCategoryClick = (categoryId: number) => {
      if (onSelectCategory) {
         onSelectCategory(categoryId);
      }
   };

   // Render sidebar content based on state
   const renderContent = () => {
      if (isLoading) {
         return <LoadingState />;
      }

      if (error) {
         return (
            <div className="text-destructive text-sm py-4">
               Ошибка загрузки категорий
            </div>
         );
      }

      return categoryGroups.map((group, index) => (
         <CategoryGroup
            key={`group-${index}`}
            group={group}
            groupIndex={index}
            activeCategory={activeCategory}
            onCategoryClick={handleCategoryClick}
            onClose={() => setIsOpen(false)}
         />
      ));
   };

   return (
      <>
         {/* Mobile Sidebar Trigger - Only shown on small screens */}
         <div className="block lg:hidden p-4 pb-0">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
               <SheetTrigger className="flex items-center gap-2">
                  <Button
                     // variant="outline"
                     size="icon"
                     className="p-2 shadow-lg"
                  >
                     <Menu className="h-6 w-6" />
                  </Button>
                  <p className="font-semibold">Категории</p>
               </SheetTrigger>
               <SheetContent
                  side="left"
                  className="p-0 w-[280px] flex flex-col bg-white h-full max-h-screen"
               >
                  <SidebarHeader />
                  <ScrollArea className="flex-1 overflow-y-auto">
                     <div className="px-4">
                        <nav>{renderContent()}</nav>
                     </div>
                  </ScrollArea>
                  <div className="border-t">
                     <SidebarFooter />
                  </div>
               </SheetContent>
            </Sheet>
         </div>

         {/* Desktop Sidebar */}
         <aside className="hidden lg:flex flex-col w-64 border-r h-screen sticky top-0">
            <SidebarHeader />
            <div className="flex-1 overflow-hidden">
               <ScrollArea className="h-full">
                  <div className="p-4">
                     <nav>{renderContent()}</nav>
                  </div>
               </ScrollArea>
            </div>
            <SidebarFooter />
         </aside>
      </>
   );
}
