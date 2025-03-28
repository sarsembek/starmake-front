import { axiosWithAuth } from "@/lib/axios";

export interface ApplyPromocodeRequest {
   code: string;
}

export interface PromoCodeUsage {
   id: number;
   promocode_id: number;
   promocode_code: string;
   used_at: string;
   days_added: number;
}

export interface ApplyPromocodeResponse {
   success: boolean;
   message: string;
   days_added: number;
   new_end_date: string;
   usage: PromoCodeUsage;
}

export const applyPromocode = async (
   data: ApplyPromocodeRequest
): Promise<ApplyPromocodeResponse> => {
   try {
      const response = await axiosWithAuth.post<ApplyPromocodeResponse>(
         `/auth/promocodes/apply`,
         data
      );
      return response.data;
   } catch (error) {
      console.error("Failed to apply promocode:", error);
      throw error;
   }
};
