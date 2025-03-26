import { User } from "@/types/auth/auth.type";
import { axiosWithAuth } from "@/lib/axios";

export const getUserProfile = async (): Promise<User> => {
   try {
      // Remove the API_URL since axiosWithAuth already has baseURL
      const response = await axiosWithAuth.get<User>(`/auth/profile`);
      return response.data;
   } catch (error) {
      console.error("Failed to get user profile:", error);
      throw error;
   }
};