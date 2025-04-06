import { useQuery } from "@tanstack/react-query";
import { getReels, GetReelsParams, ReelsResponse } from "@/api/reels/getReels";
import { useAuth } from "@/context/AuthContext";
import { usePaginationLimit } from "@/hooks/usePaginationLimit";

export function useReels(params: GetReelsParams) {
   const { isAuthenticated } = useAuth();
   const { hasExceededLimit } = usePaginationLimit({
      currentPage: params.page || 1,
   });

   return useQuery<ReelsResponse, Error>({
      queryKey: ["reels", params],
      queryFn: () => getReels(params),
      // Only run query when authenticated and not exceeded limit
      enabled: isAuthenticated && !hasExceededLimit,
      staleTime: 300 * 1000, // 5 minute
      retry: (failureCount, error) => {
         // Don't retry if we got the limited error
         if (
            error.message.includes(
               "Limited users can only access up to 3 pages"
            )
         ) {
            return false;
         }
         return failureCount < 2;
      },
   });
}
