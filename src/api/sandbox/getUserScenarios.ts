import { axiosWithAuth } from "@/lib/axios";

export interface Scenario {
   id: number | string;
   text: string; // The API returns 'text' instead of 'script'
   temp_id?: string;
   user_id?: number;
   title?: string;
   description?: string;
   tags?: string[];
   created_at?: string;
}

export interface GetScenariosParams {
   page?: number;
   size?: number;
}

export interface ScenariosResponse {
   items: Scenario[];
   count: number;
   pages: number;
}

export const getUserScenarios = async (
   params: GetScenariosParams = {}
): Promise<ScenariosResponse> => {
   try {
      const response = await axiosWithAuth.get<Scenario[]>(
         "/sandbox/scenarios",
         { params }
      );

      // The API returns an array of scenarios rather than a paginated object
      // Transform it to the expected format
      const scenarios = response.data;

      return {
         items: scenarios.map((scenario) => ({
            ...scenario,
            // Ensure backward compatibility with components that expect 'script'
            script: scenario.text,
            // Initialize empty tags array if not present
            tags: scenario.tags || [],
         })),
         count: scenarios.length,
         pages: 1, // Since we're not getting pagination info, default to 1 page
      };
   } catch (error) {
      console.error("Failed to get user scenarios:", error);
      throw error;
   }
};
