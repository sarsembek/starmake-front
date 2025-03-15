import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/api/user/getUserProfile";
import { User } from "@/types/auth/auth.type";
import { useAuth } from "@/context/AuthContext";

export function useProfile() {
   const { isAuthenticated } = useAuth();

   return useQuery<User, Error>({
      queryKey: ["profile"],
      queryFn: getUserProfile,
      enabled: isAuthenticated,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error) => {
         // Don't retry on 401/403 errors
         if (error.message.includes("401") || error.message.includes("403")) {
            return false;
         }
         // Otherwise retry up to 2 times
         return failureCount < 2;
      },
   });
}
