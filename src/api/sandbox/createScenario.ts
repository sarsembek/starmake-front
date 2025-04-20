import { axiosWithAuth } from "@/lib/axios";

// Update interface to match the API's expected format
export interface ScenarioCreate {
   text: string;
   temp_id?: string;
   title?: string; // Keep for backward compatibility but not used in API request
}

export interface ScenarioResponse {
   id: string;
   title: string;
   description?: string;
   script: string;
   tags: string[];
   created_at: string;
   temp_id?: string;
}

export const createScenario = async (
   data: ScenarioCreate
): Promise<ScenarioResponse> => {
   try {
      // Create proper request payload format
      const requestPayload = {
         text: data.text,
         temp_id: data.temp_id,
      };

      const response = await axiosWithAuth.post<ScenarioResponse>(
         "/sandbox/scenarios",
         requestPayload
      );
      return response.data;
   } catch (error) {
      console.error("Failed to create scenario:", error);
      throw error;
   }
};
