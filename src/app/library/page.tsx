"use client";

import { ReelCard } from "@/components/reel/reel-card/reel-card";
import { Sidebar } from "@/components/reel/sidebar/sidebar";
import { useState } from "react";
import { useCategories } from "@/hooks/reels/useCategories";
import { useReels } from "@/hooks/reels/useReels";
import { VideoProvider } from "@/context/VideoContext";
import {
   Pagination,
   PaginationContent,
   PaginationItem,
   PaginationNext,
   PaginationPrevious,
   PaginationLast,
} from "@/components/ui/pagination";
import { generateCenteredPaginationItems } from "@/utils/paginationUtils";

const itemsPerPage = 12;

export default function LibraryPage() {
   const [currentPage, setCurrentPage] = useState(1);
   const [activeCategory, setActiveCategory] = useState(0);

   // Fetch categories
   const { data: apiCategories, isLoading: categoriesLoading } =
      useCategories();

   // Fetch reels with current filters
   const {
      data: reelsData,
      isLoading: reelsLoading,
      error: reelsError,
   } = useReels({
      page: currentPage,
      size: itemsPerPage,
      categoryId: activeCategory > 0 ? activeCategory : undefined,
   });

   const handlePageChange = (page: number) => {
      setCurrentPage(page);
      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: "smooth" });
   };

   const handleCategorySelect = (categoryId: number) => {
      setActiveCategory(categoryId);
      setCurrentPage(1); // Reset to first page when changing category
   };

   // Get the category name_rus for the title
   const getCategoryTitle = () => {
      if (activeCategory === 0) return "Reels";

      if (categoriesLoading || !apiCategories) return "Loading...";

      const selectedCategory = apiCategories.find(
         (cat) => cat.id === activeCategory
      );

      return selectedCategory?.name_rus || "Reels";
   };

   // Function to generate pagination items with centered sliding effect
   const renderPaginationItems = () => {
      const totalPages = reelsData?.pages || 1;
      
      return generateCenteredPaginationItems({
         currentPage,
         totalPages,
         onPageChange: handlePageChange,
         maxVisiblePages: 5
      });
   };

   return (
      <VideoProvider>
         <div className="lg:flex min-h-screen bg-background">
            <Sidebar
               activeCategory={activeCategory}
               onSelectCategory={handleCategorySelect}
            />

            <main className="flex-1 p-4 lg:p-6">
               <div className="container mx-auto max-w-7xl">
                  <header className="mb-8">
                     <h1 className="text-3xl font-bold tracking-tight">
                        {getCategoryTitle()}
                     </h1>
                     <p className="text-muted-foreground mt-1">
                        Откройте для себя удивительный контент от создателей со
                        всего мира
                     </p>
                  </header>

                  {reelsLoading ? (
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array(12)
                           .fill(0)
                           .map((_, index) => (
                              <div
                                 key={index}
                                 className="h-[400px] bg-gray-100 rounded-md animate-pulse"
                              ></div>
                           ))}
                     </div>
                  ) : reelsError ? (
                     <div className="text-center py-10">
                        <h3 className="text-lg font-medium text-red-500">
                           Ошибка при загрузке данных
                        </h3>
                        <p className="text-muted-foreground">
                           Пожалуйста, попробуйте позже
                        </p>
                     </div>
                  ) : (
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reelsData?.items.map((reel) => {
                           // Find the matching category
                           const category = apiCategories?.find(
                              (cat) => cat.id === reel.category_id
                           );

                           return (
                              <ReelCard
                                 shortcode={reel.shortcode}
                                 key={reel.id}
                                 id={reel.id}
                                 title={reel.title}
                                 description={reel.description}
                                 video_url={reel.video_url}
                                 file_url={reel.file_url}
                                 thumbnail_url={reel.thumbnail_url}
                                 owner_username={reel.owner_username}
                                 likes={reel.likes}
                                 view_count={reel.view_count}
                                 comment_count={reel.comment_count}
                                 hashtags={reel.hashtags}
                                 language={reel.language}
                                 country={reel.country}
                                 category_id={reel.category_id}
                                 tags={reel.tags}
                                 transcribed_text={reel.transcribed_text}
                                 repeat_instructions={reel.repeat_instructions}
                                 improvement_suggestions={
                                    reel.improvement_suggestions
                                 }
                                 source={reel.source}
                                 created_at={reel.created_at}
                                 is_favorite={reel.is_favorite}
                                 post_url={reel.post_url}
                                 category={
                                    category
                                       ? {
                                            id: category.id,
                                            name: category.name,
                                            name_rus: category.name_rus,
                                         }
                                       : undefined
                                 }
                              />
                           );
                        })}
                     </div>
                  )}

                  {/* Pagination Component */}
                  {reelsData && reelsData.pages > 1 && (
                     <div className="mt-8">
                        <Pagination>
                           <PaginationContent>
                              {/* 1. Previous button */}
                              <PaginationItem>
                                 <PaginationPrevious
                                    onClick={() =>
                                       handlePageChange(
                                          Math.max(1, currentPage - 1)
                                       )
                                    }
                                    aria-disabled={currentPage === 1}
                                    tabIndex={currentPage === 1 ? -1 : 0}
                                    className={
                                       currentPage === 1
                                          ? "pointer-events-none opacity-50"
                                          : "cursor-pointer"
                                    }
                                 />
                              </PaginationItem>

                              {/* 2. Pagination numbers */}
                              {renderPaginationItems()}

                              {/* 3. Next page button */}
                              <PaginationItem>
                                 <PaginationNext
                                    onClick={() =>
                                       handlePageChange(
                                          Math.min(
                                             reelsData.pages,
                                             currentPage + 1
                                          )
                                       )
                                    }
                                    aria-disabled={
                                       currentPage === reelsData.pages
                                    }
                                    tabIndex={
                                       currentPage === reelsData.pages ? -1 : 0
                                    }
                                    className={
                                       currentPage === reelsData.pages
                                          ? "pointer-events-none opacity-50"
                                          : "cursor-pointer"
                                    }
                                 />
                              </PaginationItem>

                              {/* 4. Last page button */}
                              {reelsData.pages > 5 && currentPage < reelsData.pages && (
                                 <PaginationItem>
                                    <PaginationLast
                                       onClick={() => handlePageChange(reelsData.pages)}
                                       className="cursor-pointer"
                                    />
                                 </PaginationItem>
                              )}
                           </PaginationContent>
                        </Pagination>
                     </div>
                  )}

                  {/* Show message when no reels are found */}
                  {reelsData?.items.length === 0 && !reelsLoading && (
                     <div className="text-center py-10">
                        <h3 className="text-lg font-medium">
                           В этой категории пока нет рилсов
                        </h3>
                        <p className="text-muted-foreground">
                           Попробуйте выбрать другую категорию
                        </p>
                     </div>
                  )}
               </div>
            </main>
         </div>
      </VideoProvider>
   );
}
