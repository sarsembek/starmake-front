import { axiosWithAuth } from "@/lib/axios";
import { Reel } from "@/types/reel/reel.type";
import { PaginatedResponse } from "@/types/common/pagination.type";

export interface GetSimilarReelsParams {
  reelId: number;
  limit?: number;
  page?: number;
  size?: number;
}

export type SimilarReelsResponse = PaginatedResponse<Reel>;

export const getSimilarReels = async (
  params: GetSimilarReelsParams
): Promise<SimilarReelsResponse> => {
  try {
    const { reelId, limit = 12, page = 1, size = 12 } = params;
    
    const queryParams = new URLSearchParams();
    
    if (limit) {
      queryParams.append("limit", limit.toString());
    }
    
    queryParams.append("page", page.toString());
    queryParams.append("size", size.toString());
    
    const response = await axiosWithAuth.get<SimilarReelsResponse>(
      `/library/api/v1/reels/similar/${reelId}?${queryParams.toString()}`
    );
    
    return response.data;
  } catch (error) {
    console.error("Failed to fetch similar reels:", error);
    throw error;
  }
};