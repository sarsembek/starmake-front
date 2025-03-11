import { Category } from "@/types/reel/category.type";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getCategories = async (token: string): Promise<Category[]> => {
   try {
      // Get all 39 categories at once by using a large enough limit
      const response = await axios.get<Category[]>(
         `${API_URL}/library/api/v1/categories/?skip=0&limit=50`,
         {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         }
      );
      return response.data;
   } catch (error) {
      console.error("Failed to fetch categories:", error);
      throw error;
   }
};
