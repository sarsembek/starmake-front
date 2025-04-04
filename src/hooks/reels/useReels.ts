import { useQuery } from "@tanstack/react-query";
import { getReels, GetReelsParams, ReelsResponse } from "@/api/reels/getReels";
import { useAuth } from "@/context/AuthContext";

export function useReels(params: GetReelsParams) {
   const { isAuthenticated, isLimited } = useAuth();

   return useQuery<ReelsResponse, Error>({
      queryKey: ["reels", params],
      queryFn: () => getReels(params),
      enabled: isAuthenticated && !isLimited, // Only run query when authenticated
      staleTime: 300 * 1000, // 5 minute
   });
}
