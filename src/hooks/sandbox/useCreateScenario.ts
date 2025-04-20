import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
   createScenario,
   ScenarioCreate,
   ScenarioResponse,
} from "@/api/sandbox/createScenario";
import { toast } from "sonner";

export function useCreateScenario() {
   const queryClient = useQueryClient();

   return useMutation<ScenarioResponse, Error, ScenarioCreate>({
      mutationFn: createScenario,
      onSuccess: () => {
         // Invalidate relevant queries
         queryClient.invalidateQueries({ queryKey: ["lastScript"] });
         queryClient.invalidateQueries({ queryKey: ["userScenarios"] });
         toast.success("Сценарий успешно сохранен");
      },
      onError: (error) => {
         toast.error("Ошибка при сохранении сценария");
         console.error("Error creating scenario:", error);
      },
   });
}
