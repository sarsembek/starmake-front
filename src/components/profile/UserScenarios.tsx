import { useState } from "react";
import { format } from "date-fns";
import { useUserScenarios } from "@/hooks/sandbox/useUserScenarios";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
   Pagination,
   PaginationContent,
   PaginationEllipsis,
   PaginationItem,
   PaginationLink,
   PaginationNext,
   PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 5;

export function UserScenarios() {
   const [currentPage, setCurrentPage] = useState(1);

   const {
      data: scenarios,
      isLoading,
      error,
   } = useUserScenarios({
      page: currentPage,
      size: ITEMS_PER_PAGE,
   });

   const handlePageChange = (page: number) => {
      setCurrentPage(page);
   };

   // Function to format date
   const formatDate = (dateString: string) => {
      try {
         return format(new Date(dateString), "dd.MM.yyyy HH:mm");
      } catch {
         return "Invalid date";
      }
   };

   // Generate pagination items
   const renderPaginationItems = () => {
      const totalPages = scenarios?.pages || 1;

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

      // For more than 5 pages, show first, last, and pages around current
      const items = [];

      // First page
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

      // Ellipsis if needed
      if (currentPage > 3) {
         items.push(<PaginationEllipsis key="start-ellipsis" />);
      }

      // Pages around current
      for (
         let i = Math.max(2, currentPage - 1);
         i <= Math.min(totalPages - 1, currentPage + 1);
         i++
      ) {
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

      // Ellipsis if needed
      if (currentPage < totalPages - 2) {
         items.push(<PaginationEllipsis key="end-ellipsis" />);
      }

      // Last page
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

   if (isLoading) {
      return (
         <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
         </div>
      );
   }

   if (error) {
      return (
         <div className="text-center py-8 text-red-500">
            <p>Ошибка при загрузке сценариев</p>
            <p className="text-sm">{(error as Error).message}</p>
         </div>
      );
   }

   if (!scenarios?.items || scenarios.items.length === 0) {
      return (
         <div className="text-center py-8 text-muted-foreground">
            <p>У вас пока нет сохраненных сценариев</p>
            <p className="mt-2">
               Создайте сценарий в разделе &quot;Сценарии&quot; и он появится
               здесь
            </p>
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
      <div className="space-y-4">
         {scenarios.items.map((scenario) => (
            <Card key={scenario.id}>
               <CardHeader>
                  <CardTitle>{scenario.title}</CardTitle>
                  <CardDescription>
                     Создан: {formatDate(scenario.created_at)}
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  <div className="max-h-32 overflow-hidden relative">
                     <p className="text-sm whitespace-pre-wrap">
                        {scenario.script}
                     </p>
                     <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent"></div>
                  </div>
               </CardContent>
               <CardFooter className="flex justify-between">
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
                  <Button
                     variant="outline"
                     size="sm"
                     onClick={() =>
                        (window.location.href = `/script-builder/edit/${scenario.id}`)
                     }
                  >
                     Редактировать
                  </Button>
               </CardFooter>
            </Card>
         ))}

         {scenarios.pages > 1 && (
            <Pagination>
               {currentPage > 1 && (
                  <PaginationPrevious
                     onClick={() => handlePageChange(currentPage - 1)}
                  />
               )}
               <PaginationContent>{renderPaginationItems()}</PaginationContent>
               {currentPage < scenarios.pages && (
                  <PaginationNext
                     onClick={() => handlePageChange(currentPage + 1)}
                  />
               )}
            </Pagination>
         )}
      </div>
   );
}
