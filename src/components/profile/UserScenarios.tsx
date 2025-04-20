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
               <CardHeader className="bg-muted/30">
                  <div className="flex justify-between items-start">
                     <div>
                        <CardTitle>
                           {scenario.title || "Сценарий без названия"}
                        </CardTitle>
                        {scenario.created_at && (
                           <CardDescription>
                              Создан:{" "}
                              {format(
                                 new Date(scenario.created_at),
                                 "dd.MM.yyyy HH:mm"
                              )}
                           </CardDescription>
                        )}
                     </div>
                  </div>
               </CardHeader>
               <CardContent>
                  <div className="max-h-32 overflow-hidden relative">
                     <p className="text-sm whitespace-pre-wrap">
                        {scenario.text || "Нет текста сценария"}
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
