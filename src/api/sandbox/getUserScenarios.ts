import { axiosWithAuth } from "@/lib/axios";
import { ScenarioResponse } from "./createScenario";
import { PaginatedResponse } from "@/types/common/pagination.type";

export interface GetScenariosParams {
   page?: number;
   size?: number;
}

export type ScenariosResponse = PaginatedResponse<ScenarioResponse>;

export const getUserScenarios = async (
   params: GetScenariosParams = {}
): Promise<ScenariosResponse> => {
   try {
      const { page = 1, size = 10 } = params;

      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      queryParams.append("size", size.toString());

      const response = await axiosWithAuth.get<ScenariosResponse>(
         `/sandbox/scenarios?${queryParams.toString()}`
      );

      return response.data;
   } catch (error) {
      console.error("Failed to fetch user scenarios:", error);
      throw error;
   }
};
