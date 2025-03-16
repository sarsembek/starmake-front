import { axiosWithAuth } from "@/lib/axios";

export const removeReelFromFavorites = async (
   reelId: number
): Promise<void> => {
   try {
      await axiosWithAuth.delete(
         `/library/api/v1/favorite_reels/reel/${reelId}`
      );
   } catch (error) {
      console.error("Failed to remove reel from favorites:", error);
      throw error;
   }
};
