import { User } from "@/types/auth/auth.type";
import { axiosWithAuth } from "@/lib/axios";
import axios from "axios";

export const getUserProfile = async (): Promise<User> => {
   try {
      const response = await axiosWithAuth.get<User>(`/auth/profile`);
      return response.data;
   } catch (error) {
      console.error("Failed to get user profile:", error);

      // Check for the specific limited error format
      if (
         axios.isAxiosError(error) &&
         error.response?.status === 403 &&
         error.response.data?.detail?.ru === "Ваш аккаунт ограничен"
      ) {
         // Set a flag in localStorage to persist the limited state
         localStorage.setItem("user_limited", "true");

         // Dispatch a global event for others to handle
         window.dispatchEvent(new CustomEvent("user:limited"));
      }

      throw error;
   }
};
