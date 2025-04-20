import { axiosWithAuth } from "@/lib/axios";

export interface LastScriptResponse {
   text: string;
}

export const getLastScript = async (): Promise<LastScriptResponse> => {
   try {
      const response = await axiosWithAuth.get<LastScriptResponse>(
         "/sandbox/get_last_script"
      );
      return response.data;
   } catch (error) {
      console.error("Failed to get last script:", error);
      throw error;
   }
};
