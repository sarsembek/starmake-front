import { useQuery } from "@tanstack/react-query";
import { getLastScript, LastScriptResponse } from "@/api/sandbox/getLastScript";
import { useAuth } from "@/context/AuthContext";

export function useLastScript() {
   const { isAuthenticated } = useAuth();

   return useQuery<LastScriptResponse, Error>({
      queryKey: ["lastScript"],
      queryFn: getLastScript,
      enabled: isAuthenticated,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error) => {
         // Don't retry on 404 errors (no script found)
         if (error?.message?.includes("404")) return false;
         return failureCount < 2;
      },
   });
}
