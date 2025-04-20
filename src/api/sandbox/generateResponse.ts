import { axiosWithAuth } from "@/lib/axios";

export interface GenerateResponseRequest {
   user_message: string;
   source?: string;
}

export interface AIResponse {
   idea: string;
   script: string;
   tags: string;
}

export const generateSandboxResponse = async (
   data: GenerateResponseRequest
): Promise<AIResponse> => {
   try {
      const response = await axiosWithAuth.post<AIResponse>(
         "/sandbox/generate-response",
         data
      );
      return response.data;
   } catch (error) {
      console.error("Failed to generate response:", error);
      throw error;
   }
};
