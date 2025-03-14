"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { AxiosError } from "axios";

export function Providers({ children }: { children: ReactNode }) {
   const [queryClient] = useState(
      () =>
         new QueryClient({
            defaultOptions: {
               queries: {
                  retry: (failureCount, error: unknown) => {
                     // Don't retry on 401 errors since they're handled by our interceptor
                     const axiosError = error as AxiosError;
                     if (axiosError?.response?.status === 401) {
                        return false;
                     }
                     // Default retry logic for other errors (retry 3 times)
                     return failureCount < 3;
                  },
                  staleTime: 60 * 1000, // 1 minute
               },
            },
         })
   );

   return (
      <QueryClientProvider client={queryClient}>
         <AuthProvider>
            {children}
         </AuthProvider>
         {/* Remove this if you don't have the devtools installed */}
         {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
   );
}
