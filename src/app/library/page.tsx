"use client";

import { ReelCard } from "@/components/reel/reel-card/reel-card";
import { Sidebar } from "@/components/reel/sidebar/sidebar";
import { useState } from "react";
import { useCategories } from "@/hooks/useCategories";
import {
   Pagination,
   PaginationContent,
   PaginationEllipsis,
   PaginationItem,
   PaginationLink,
   PaginationNext,
   PaginationPrevious,
} from "@/components/ui/pagination";

// Sample data based on the provided schema
const generateReels = (count: number) => {
   return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      shortcode: `abc${i + 100}`,
      title: `Reel #${i + 1}: Amazing content for your feed`,
      description:
         i % 3 === 0
            ? `This is a longer description for reel #${
                 i + 1
              }. It contains more details about the content and what makes it special.`
            : undefined,
      videoUrl: "https://example.com/videos/video.mp4",
      thumbnailUrl: `/placeholder.svg?height=640&width=360&text=Reel+${i + 1}`,
      postUrl: `https://example.com/reels/abc${i + 100}`,
      ownerUsername: `user_${(i % 5) + 1}`,
      likes: Math.floor(Math.random() * 2000) + 100,
      viewCount: Math.floor(Math.random() * 50000) + 1000,
      commentCount: Math.floor(Math.random() * 200) + 10,
      hashtags: "trending,viral,content,reels",
      tags: "video,social,media",
      language: i % 3 === 0 ? "es" : i % 5 === 0 ? "fr" : "en",
      country: i % 3 === 0 ? "ES" : i % 5 === 0 ? "FR" : "US",
      category: {
         id: (i % 39) + 1,
         name: ["Entertainment", "Education", "Travel", "Food", "Fitness"][
            i % 5
         ],
         name_rus: [
            "Развлечения",
            "Образование",
            "Путешествия",
            "Еда",
            "Фитнес",
         ][i % 5],
         count_reels: [42, 28, 35, 20, 15][i % 5],
      },
   }));
};

const sampleReels = generateReels(24);
const itemsPerPage = 12;

export default function LibraryPage() {
   const [currentPage, setCurrentPage] = useState(1);
   const [activeCategory, setActiveCategory] = useState(0);
   const { data: apiCategories, isLoading } = useCategories();

   // Filter reels by category if needed
   const filteredReels =
      activeCategory === 0
         ? sampleReels
         : sampleReels.filter((reel) => reel.category?.id === activeCategory);

   // Calculate pagination
   const totalPages = Math.ceil(filteredReels.length / itemsPerPage);
   const startIndex = (currentPage - 1) * itemsPerPage;
   const currentReels = filteredReels.slice(
      startIndex,
      startIndex + itemsPerPage
   );

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
      if (activeCategory === 0) return "Все рилсы";

      if (isLoading || !apiCategories) return "Загрузка...";

      const selectedCategory = apiCategories.find(
         (cat) => cat.id === activeCategory
      );

      return selectedCategory?.name_rus || "Рилсы";
   };

   // Function to generate pagination items
   const renderPaginationItems = () => {
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

      return items;
   };

   return (
      <div className="flex min-h-screen bg-background">
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

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentReels.map((reel) => (
                     <ReelCard key={reel.id} {...reel} />
                  ))}
               </div>

               {/* shadcn Pagination Component */}
               {totalPages > 1 && (
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
                                       Math.min(totalPages, currentPage + 1)
                                    )
                                 }
                                 aria-disabled={currentPage === totalPages}
                                 tabIndex={currentPage === totalPages ? -1 : 0}
                                 className={
                                    currentPage === totalPages
                                       ? "pointer-events-none opacity-50"
                                       : ""
                                 }
                              />
                           </PaginationItem>
                        </PaginationContent>
                     </Pagination>
                  </div>
               )}
            </div>
         </main>
      </div>
   );
}
