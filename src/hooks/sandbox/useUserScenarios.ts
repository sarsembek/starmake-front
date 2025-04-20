import { useQuery } from "@tanstack/react-query";
import {
   getUserScenarios,
   GetScenariosParams,
   ScenariosResponse,
} from "@/api/sandbox/getUserScenarios";
import { useAuth } from "@/context/AuthContext";

export function useUserScenarios(params: GetScenariosParams = {}) {
   const { isAuthenticated } = useAuth();

   return useQuery<ScenariosResponse, Error>({
      queryKey: ["userScenarios", params],
      queryFn: () => getUserScenarios(params),
      enabled: isAuthenticated,
      staleTime: 5 * 60 * 1000, // 5 minutes
   });
}
