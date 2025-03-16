import { axiosWithAuth } from "@/lib/axios";

export interface FavoriteReelRequest {
   reel_id: number;
}

export interface FavoriteReelResponse {
   user_id: string;
   reel_id: number;
   id: number;
   created_at: string;
}

export const addReelToFavorites = async (
   reelId: number
): Promise<FavoriteReelResponse> => {
   try {
      const response = await axiosWithAuth.post<FavoriteReelResponse>(
         "/library/api/v1/favorite_reels/",
         { reel_id: reelId }
      );
      return response.data;
   } catch (error) {
      console.error("Failed to add reel to favorites:", error);
      throw error;
   }
};
