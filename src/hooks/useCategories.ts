import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/api/categories/getCategories";
import { useAuth } from "@/context/AuthContext";

export function useCategories() {
   const { token } = useAuth();

   return useQuery({
      queryKey: ["categories"],
      queryFn: () =>
         token
            ? getCategories(token)
            : Promise.reject("No authentication token"),
      enabled: !!token, // Only run query when token is available
      staleTime: Infinity, // Consider data fresh for 5 minutes
      retry: 2, // Retry failed requests twice
   });
}
