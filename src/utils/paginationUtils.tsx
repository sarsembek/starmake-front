import React from "react";
import {
   PaginationItem,
   PaginationLink,
   PaginationEllipsis,
} from "@/components/ui/pagination";

interface PaginationConfig {
   currentPage: number;
   totalPages: number;
   onPageChange: (page: number) => void;
   maxVisiblePages?: number;
}

/**
 * Generates centered pagination items with sliding effect
 * The selected page is always centered when possible
 */
export function generateCenteredPaginationItems({
   currentPage,
   totalPages,
   onPageChange,
   maxVisiblePages = 5,
}: PaginationConfig): React.ReactNode[] {
   if (totalPages <= 1) return [];

   const items: React.ReactNode[] = [];
   const halfVisible = Math.floor(maxVisiblePages / 2);

   // Calculate the start and end of the visible range
   let startPage = Math.max(1, currentPage - halfVisible);
   const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

   // Adjust start if we're near the end
   if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
   }

   // Add first page if not in range
   if (startPage > 1) {
      items.push(
         <PaginationItem key={1}>
            <PaginationLink
               isActive={currentPage === 1}
               onClick={() => onPageChange(1)}
               className="transition-all duration-200 hover:scale-105"
            >
               1
            </PaginationLink>
         </PaginationItem>
      );

      // Add ellipsis if there's a gap
      if (startPage > 2) {
         items.push(
            <PaginationItem key="ellipsis-start">
               <PaginationEllipsis />
            </PaginationItem>
         );
      }
   }

   // Add the visible page range
   for (let page = startPage; page <= endPage; page++) {
      items.push(
         <PaginationItem key={page}>
            <PaginationLink
               isActive={currentPage === page}
               onClick={() => onPageChange(page)}
               className={`transition-all duration-200 hover:scale-105 ${
                  currentPage === page
                     ? "transform scale-110 shadow-md border-primary bg-primary text-primary-foreground"
                     : ""
               }`}
            >
               {page}
            </PaginationLink>
         </PaginationItem>
      );
   }

   // Add last page if not in range
   if (endPage < totalPages) {
      // Add ellipsis if there's a gap
      if (endPage < totalPages - 1) {
         items.push(
            <PaginationItem key="ellipsis-end">
               <PaginationEllipsis />
            </PaginationItem>
         );
      }

      items.push(
         <PaginationItem key={totalPages}>
            <PaginationLink
               isActive={currentPage === totalPages}
               onClick={() => onPageChange(totalPages)}
               className="transition-all duration-200 hover:scale-105"
            >
               {totalPages}
            </PaginationLink>
         </PaginationItem>
      );
   }

   return items;
}

/**
 * Alternative simplified pagination for smaller screens
 */
export function generateSimplePaginationItems({
   currentPage,
   totalPages,
   onPageChange,
}: Omit<PaginationConfig, "maxVisiblePages">): React.ReactNode[] {
   if (totalPages <= 1) return [];

   const items: React.ReactNode[] = [];

   // Show only current page and adjacent pages on small screens
   const startPage = Math.max(1, currentPage - 1);
   const endPage = Math.min(totalPages, currentPage + 1);

   for (let page = startPage; page <= endPage; page++) {
      items.push(
         <PaginationItem key={page}>
            <PaginationLink
               isActive={currentPage === page}
               onClick={() => onPageChange(page)}
               className={`transition-all duration-200 ${
                  currentPage === page
                     ? "transform scale-110 border-primary bg-primary text-primary-foreground"
                     : ""
               }`}
            >
               {page}
            </PaginationLink>
         </PaginationItem>
      );
   }

   return items;
}
