import { axiosWithAuth } from "@/lib/axios";
import { Reel } from "@/types/reel/reel.type";
import { PaginatedResponse } from "@/types/common/pagination.type";
import axios from "axios";

export interface GetReelsParams {
   page?: number;
   size?: number;
   categoryId?: number;
   language?: string;
   country?: string;
   search?: string;
}

export type ReelsResponse = PaginatedResponse<Reel>;

export const getReels = async (
   params: GetReelsParams
): Promise<ReelsResponse> => {
   try {
      const {
         page = 1,
         size = 12,
         categoryId,
         language,
         country,
         search,
      } = params;

      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      queryParams.append("size", size.toString());

      if (categoryId && categoryId > 0) {
         queryParams.append("category_id", categoryId.toString());
      }

      if (language) {
         queryParams.append("language", language);
      }

      if (country) {
         queryParams.append("country", country);
      }

      if (search) {
         queryParams.append("search", search);
      }

      const response = await axiosWithAuth.get<ReelsResponse>(
         `/library/api/v1/reels/?${queryParams.toString()}`
      );
      return response.data;
   } catch (error) {
      console.error("Failed to fetch reels:", error);

      // Check for user limited error
      if (
         axios.isAxiosError(error) &&
         error.response?.status === 403 &&
         error.response?.data?.detail?.ru === "Ваш аккаунт ограничен"
      ) {
         // The global handler will catch this, but we can add specific handling here too
         console.log("User is limited, cannot access library");
      }

      throw error;
   }
};
