import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/api/user/getUserProfile";
import { User } from "@/types/auth/auth.type";
import { useAuth } from "@/context/AuthContext";

export function useProfile() {
   const { isAuthenticated, user } = useAuth();

   return useQuery<User, Error>({
      queryKey: ["profile"],
      queryFn: getUserProfile,
      // Only fetch if authenticated and we don't already have user data
      enabled: isAuthenticated,
      // If we have user data from auth context, use it as initial data
      initialData: user || undefined,
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
