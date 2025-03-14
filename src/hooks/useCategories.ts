import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/api/categories/getCategories";
import { useAuth } from "@/context/AuthContext";

export function useCategories() {
   const { isAuthenticated } = useAuth();

   return useQuery({
      queryKey: ["categories"],
      queryFn: getCategories,
      enabled: isAuthenticated, // Only run query when authenticated
      staleTime: Infinity,
   });
}
