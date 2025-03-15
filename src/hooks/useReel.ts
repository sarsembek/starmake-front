import { useQuery } from "@tanstack/react-query";
import { getReel } from "@/api/reels/getReel";
import { Reel } from "@/types/reel/reel.type";
import { useAuth } from "@/context/AuthContext";

export function useReel(shortcode: string | null) {
   const { isAuthenticated } = useAuth();

   return useQuery<Reel, Error>({
      queryKey: ["reel", shortcode],
      queryFn: () => {
         if (!shortcode) throw new Error("Shortcode is required");
         return getReel(shortcode);
      },
      enabled: isAuthenticated && !!shortcode,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error) => {
         // Don't retry on 404 errors
         if (error?.message?.includes("404")) {
            return false;
         }
         return failureCount < 2;
      },
   });
}
