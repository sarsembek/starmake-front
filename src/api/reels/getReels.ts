import { axiosWithAuth } from "@/lib/axios";
import { Reel } from "@/types/reel/reel.type";
import { PaginatedResponse } from "@/types/common/pagination.type";
import axios from "axios";

export interface GetReelsParams {
   page?: number;
   size?: number;
   categoryId?: number;
   search?: string;
}

export type ReelsResponse = PaginatedResponse<Reel>;

export const getReels = async (
   params: GetReelsParams
): Promise<ReelsResponse> => {
   try {
      const queryParams = new URLSearchParams();

      if (params.page) {
         queryParams.append("page", params.page.toString());
      }

      if (params.size) {
         queryParams.append("size", params.size.toString());
      }

      if (params.categoryId) {
         queryParams.append("category_id", params.categoryId.toString());
      }

      if (params.search) {
         queryParams.append("search", params.search);
      }

      // Append locale parameter
      queryParams.append("locale", "kz");
      
      // Make the GET request with query parameters
      const response = await axiosWithAuth.get<ReelsResponse>(
         `/library/api/v1/reels/?${queryParams.toString()}`
      );

      return response.data;
   } catch (error) {
      console.error("Failed to fetch reels:", error);

      // Check for the specific limited error format
      if (
         axios.isAxiosError(error) &&
         error.response?.status === 403 &&
         error.response.data?.detail?.en ===
            "Limited users can only access up to 3 pages of results"
      ) {
         // Dispatch an event that will be caught by the SubscriptionContext
         window.dispatchEvent(new CustomEvent("subscription:limited"));
      }

      throw error;
   }
};
