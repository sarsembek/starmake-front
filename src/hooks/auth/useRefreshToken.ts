import { refreshToken as refreshTokenApi } from "@/api/auth/refreshToken";
import { getUserProfile } from "@/api/user/getUserProfile";
import { User } from "@/types/auth/auth.type";
import { useState } from "react";

interface RefreshResult {
   success: boolean;
   user: User | null;
   email?: string;
}

export function useRefreshToken() {
   const [isRefreshing, setIsRefreshing] = useState(false);

   const refresh = async (): Promise<RefreshResult> => {
      try {
         setIsRefreshing(true);

         // First try refreshing the token
         const refreshResponse = await refreshTokenApi();
         console.log("Token refresh response:", refreshResponse);

         // The response includes the email but not the full user object
         const email = refreshResponse.payload?.email;

         if (!email) {
            console.error("No email in refresh response");
            return { success: false, user: null };
         }

         // Then get the user profile with the refreshed token
         try {
            const userData = await getUserProfile();

            // Store user data in cache
            localStorage.setItem("user_cache", JSON.stringify(userData));

            return {
               success: true,
               user: userData,
               email,
            };
         } catch (profileError) {
            console.error(
               "Profile fetch failed after token refresh:",
               profileError
            );
            return {
               success: true, // Token refresh was successful even if profile fetch failed
               user: null,
               email,
            };
         }
      } catch (error) {
         console.error("Token refresh failed:", error);

         // Clear cache on failure
         localStorage.removeItem("user_cache");

         return {
            success: false,
            user: null,
         };
      } finally {
         setIsRefreshing(false);
      }
   };

   return {
      refresh,
      isRefreshing,
   };
}
