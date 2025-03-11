import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const LoadingState = () => (
   <>
      {Array(8)
         .fill(0)
         .map((_, i) => (
            <div key={`skeleton-${i}`} className="py-2">
               <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-48" />
               </div>
            </div>
         ))}
   </>
);
