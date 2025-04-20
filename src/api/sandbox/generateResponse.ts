import { axiosWithAuth } from "@/lib/axios";

export interface GenerateResponseRequest {
   user_message: string;
   source?: string;
}

export interface AIResponseVariant {
   title: string;
   content: string;
   tags: string;
}

export interface AIResponse {
   idea: string;
   script: string;
   tags: string;
}

export interface GenerateResponseData {
   variants: [string, string, string][];
}

export const generateSandboxResponse = async (
   data: GenerateResponseRequest
): Promise<AIResponse> => {
   try {
      const response = await axiosWithAuth.post<GenerateResponseData>(
         "/sandbox/generate-response",
         data
      );

      // Convert the variant format to the expected AIResponse format
      const variants = response.data.variants[0];

      if (!variants || variants.length < 3) {
         throw new Error("Invalid response format");
      }

      // Map the array elements to our expected format
      return {
         idea: variants[0] || "",
         script: variants[1] || "",
         tags: variants[2] || "",
      };
   } catch (error) {
      console.error("Failed to generate response:", error);
      throw error;
   }
};
