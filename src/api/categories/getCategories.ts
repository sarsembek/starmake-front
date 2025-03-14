import { Category } from "@/types/reel/category.type";
import { axiosWithAuth } from "@/lib/axios";

export const getCategories = async (): Promise<Category[]> => {
   try {
      // Note: No need to pass token manually anymore
      const response = await axiosWithAuth.get<Category[]>(
         "/library/api/v1/categories/?skip=0&limit=50"
      );
      return response.data;
   } catch (error) {
      console.error("Failed to fetch categories:", error);
      throw error;
   }
};
