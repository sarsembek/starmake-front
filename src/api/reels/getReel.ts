import { axiosWithAuth } from "@/lib/axios";
import { Reel } from "@/types/reel/reel.type";

export const getReel = async (shortcode: string): Promise<Reel> => {
   try {
      const response = await axiosWithAuth.get<Reel>(
         `/library/api/v1/reels/${shortcode}`
      );
      return response.data;
   } catch (error) {
      console.error("Failed to fetch reel:", error);
      throw error;
   }
};
