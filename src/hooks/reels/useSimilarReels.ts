import { useQuery } from "@tanstack/react-query";
import { 
  getSimilarReels, 
  GetSimilarReelsParams, 
  SimilarReelsResponse 
} from "@/api/reels/getSimilarReels";
import { useAuth } from "@/context/AuthContext";

export function useSimilarReels(params: GetSimilarReelsParams) {
  const { isAuthenticated } = useAuth();

  return useQuery<SimilarReelsResponse, Error>({
    queryKey: ["similarReels", params.reelId, params.limit, params.page, params.size],
    queryFn: () => getSimilarReels(params),
    enabled: isAuthenticated && !!params.reelId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}