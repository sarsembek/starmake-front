import { useMutation } from "@tanstack/react-query";
import {
   generateSandboxResponse,
   GenerateResponseRequest,
   AIResponse,
} from "@/api/sandbox/generateResponse";

export function useGenerateResponse() {
   return useMutation<AIResponse, Error, GenerateResponseRequest>({
      mutationFn: generateSandboxResponse,
      onError: (error) => {
         console.error("Error generating AI response:", error);
      },
   });
}
