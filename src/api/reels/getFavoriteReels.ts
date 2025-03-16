import { axiosWithAuth } from "@/lib/axios";
import { Reel } from "@/types/reel/reel.type";
import { PaginatedResponse } from "@/types/common/pagination.type";

export interface FavoriteReelItem {
   favorite_id: number;
   user_id: string;
   created_at: string;
   reel: Reel;
}

export type FavoriteReelsResponse = PaginatedResponse<FavoriteReelItem>;

export const getFavoriteReels = async (
   page = 1,
   size = 50
): Promise<FavoriteReelsResponse> => {
   try {
      const response = await axiosWithAuth.get<FavoriteReelsResponse>(
         `/library/api/v1/favorite_reels/with-details?page=${page}&size=${size}`
      );
      return response.data;
   } catch (error) {
      console.error("Failed to fetch favorite reels:", error);
      throw error;
   }
};
