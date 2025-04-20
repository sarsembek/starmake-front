import { useState } from "react";
import { useUserScenarios } from "@/hooks/sandbox/useUserScenarios";
import {
   Card,
   CardContent,
   CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
   Pagination,
   PaginationContent,
   PaginationItem,
   PaginationLink,
   PaginationNext,
   PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 5;

export function UserScenarios() {
   const [currentPage, setCurrentPage] = useState(1);
   const { data, isLoading, error } = useUserScenarios({
      page: currentPage,
      size: ITEMS_PER_PAGE,
   });

   const handlePageChange = (newPage: number) => {
      setCurrentPage(newPage);
   };

   if (isLoading) {
      return (
         <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
         </div>
      );
   }

   if (error) {
      return (
         <div className="text-center p-8 text-destructive">
            <p>Ошибка загрузки сценариев: {error.message}</p>
         </div>
      );
   }

   if (!data || !data.items || data.items.length === 0) {
      return (
         <div className="text-center p-8 text-muted-foreground">
            <p>У вас пока нет сценариев</p>
            <p className="mt-2">Создайте свой первый сценарий в конструкторе</p>
            <Button
               className="mt-4"
               onClick={() => (window.location.href = "/script-builder")}
            >
               Создать сценарий
            </Button>
         </div>
      );
   }

   return (
      <div className="space-y-6">
         {data.items.map((scenario) => (
            <Card key={scenario.id} className="overflow-hidden">
               <CardContent>
                  <div className="h-32 overflow-y-auto pr-2">
                     <p className="text-sm whitespace-pre-wrap">
                        {scenario.text || "Нет текста сценария"}
                     </p>
                  </div>
               </CardContent>
               <CardFooter className="flex justify-start">
                  <div className="flex flex-wrap gap-2">
                     {scenario.tags?.map((tag, idx) => (
                        <span
                           key={idx}
                           className="px-2 py-1 bg-primary/10 text-xs rounded-full"
                        >
                           {tag}
                        </span>
                     ))}
                  </div>
               </CardFooter>
            </Card>
         ))}

         {data.pages > 1 && (
            <Pagination className="mt-6">
               {currentPage > 1 && (
                  <PaginationPrevious
                     onClick={() => handlePageChange(currentPage - 1)}
                  />
               )}
               <PaginationContent>
                  {Array.from({ length: data.pages }, (_, i) => (
                     <PaginationItem key={i + 1}>
                        <PaginationLink
                           isActive={currentPage === i + 1}
                           onClick={() => handlePageChange(i + 1)}
                        >
                           {i + 1}
                        </PaginationLink>
                     </PaginationItem>
                  ))}
               </PaginationContent>
               {currentPage < data.pages && (
                  <PaginationNext
                     onClick={() => handlePageChange(currentPage + 1)}
                  />
               )}
            </Pagination>
         )}
      </div>
   );
}
