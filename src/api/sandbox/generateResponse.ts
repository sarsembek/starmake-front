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
      // Remove "Теги: " prefix if it exists in the third element
      const tagsString = variants[2] || "";
      const cleanedTags = tagsString.replace(/^Теги:\s*/i, "");

      return {
         idea: variants[0] || "",
         script: variants[1] || "",
         tags: cleanedTags,
      };
   } catch (error) {
      console.error("Failed to generate response:", error);
      throw error;
   }
};
