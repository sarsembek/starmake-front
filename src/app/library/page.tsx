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
   PaginationEllipsis,
   PaginationItem,
   PaginationLink,
   PaginationNext,
   PaginationPrevious,
} from "@/components/ui/pagination";

const itemsPerPage = 12;

export default function LibraryPage() {
   // const { isAuthenticated } = useAuth();
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

   // Function to generate pagination items
   const renderPaginationItems = () => {
      const totalPages = reelsData?.pages || 1;

      // For small number of pages, show all of them
      if (totalPages <= 5) {
         return Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i + 1}>
               <PaginationLink
                  isActive={currentPage === i + 1}
                  onClick={() => handlePageChange(i + 1)}
               >
                  {i + 1}
               </PaginationLink>
            </PaginationItem>
         ));
      }

      // For larger number of pages, show a limited set with ellipsis
      const items = [];

      // Always include first page
      items.push(
         <PaginationItem key={1}>
            <PaginationLink
               isActive={currentPage === 1}
               onClick={() => handlePageChange(1)}
            >
               1
            </PaginationLink>
         </PaginationItem>
      );

      // Add ellipsis if needed
      if (currentPage > 3) {
         items.push(
            <PaginationItem key="ellipsis-1">
               <PaginationEllipsis />
            </PaginationItem>
         );
      }

      // Add pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
         items.push(
            <PaginationItem key={i}>
               <PaginationLink
                  isActive={currentPage === i}
                  onClick={() => handlePageChange(i)}
               >
                  {i}
               </PaginationLink>
            </PaginationItem>
         );
      }

      // Add ellipsis if needed
      if (currentPage < totalPages - 2) {
         items.push(
            <PaginationItem key="ellipsis-2">
               <PaginationEllipsis />
            </PaginationItem>
         );
      }

      // Always include last page
      if (totalPages > 1) {
         items.push(
            <PaginationItem key={totalPages}>
               <PaginationLink
                  isActive={currentPage === totalPages}
                  onClick={() => handlePageChange(totalPages)}
               >
                  {totalPages}
               </PaginationLink>
            </PaginationItem>
         );
      }

      return items;
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
                                          : ""
                                    }
                                 />
                              </PaginationItem>

                              {renderPaginationItems()}

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
                                          : ""
                                    }
                                 />
                              </PaginationItem>
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
