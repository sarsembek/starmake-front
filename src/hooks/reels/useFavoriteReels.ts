import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
   getFavoriteReels,
   FavoriteReelsResponse,
} from "@/api/reels/getFavoriteReels";
import { addReelToFavorites } from "@/api/reels/addReelToFavorites";
import { removeReelFromFavorites } from "@/api/reels/removeReelFromFavorites";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

// Hook to fetch user's favorite reels with pagination
export function useFavoriteReels(page = 1, size = 12) {
   const { isAuthenticated } = useAuth();

   return useQuery<FavoriteReelsResponse, Error>({
      queryKey: ["favoriteReels", page, size],
      queryFn: () => getFavoriteReels(page, size),
      enabled: isAuthenticated,
      staleTime: 5 * 60 * 1000, // 5 minutes
   });
}

// Hook to add a reel to favorites
export function useFavoriteReel() {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: (reelId: number) => addReelToFavorites(reelId),
      onSuccess: (data) => {
         toast.success("Добавлено в избранное", {
            description: "Ролик был добавлен в ваше избранное",
         });

         // Invalidate the favorite reels query to refetch it
         queryClient.invalidateQueries({ queryKey: ["favoriteReels"] });

         // Also update any specific reel query that might be cached
         queryClient.invalidateQueries({
            queryKey: ["reel", data.reel_id.toString()],
         });
      },
      onError: () => {
         toast.error("Ошибка", {
            description: "Не удалось добавить ролик в избранное",
         });
      },
   });
}

// Hook to remove a reel from favorites
export function useUnfavoriteReel() {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: (reelId: number) => removeReelFromFavorites(reelId),
      onSuccess: (_, reelId) => {
         toast.success("Удалено из избранного", {
            description: "Ролик был удален из вашего избранного",
         });

         // Invalidate the favorite reels query to refetch it
         queryClient.invalidateQueries({ queryKey: ["favoriteReels"] });

         // Also update any specific reel query that might be cached
         queryClient.invalidateQueries({
            queryKey: ["reel", reelId.toString()],
         });
      },
      onError: () => {
         toast.error("Ошибка", {
            description: "Не удалось удалить ролик из избранного",
         });
      },
   });
}
