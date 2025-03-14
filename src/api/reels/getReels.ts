import { axiosWithAuth } from "@/lib/axios";
import { Reel } from "@/types/reel/reel.type";

export interface GetReelsParams {
   page?: number;
   size?: number;
   categoryId?: number;
   language?: string;
   country?: string;
   search?: string;
}

export interface ReelsResponse {
   items: Reel[];
   total: number;
   page: number;
   size: number;
   pages: number;
   links: {
      first: string;
      last: string;
      self: string;
      next: string | null;
      prev: string | null;
   };
}

export const getReels = async (
   params: GetReelsParams
): Promise<ReelsResponse> => {
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
};
