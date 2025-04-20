import { axiosWithAuth } from "@/lib/axios";

export interface ScenarioCreate {
   title: string;
   description?: string;
   script: string;
   tags?: string[];
   temp_id?: string;
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
      const response = await axiosWithAuth.post<ScenarioResponse>(
         "/sandbox/scenarios",
         data
      );
      return response.data;
   } catch (error) {
      console.error("Failed to create scenario:", error);
      throw error;
   }
};
